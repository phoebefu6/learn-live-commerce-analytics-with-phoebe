"""The builder-track analysis, run for real against data/streams.csv.

Every number quoted on the b5 / b6 / a2 pages comes from this script. Run it from the repo root:

    python materials/analysis/analyze.py

It writes materials/analysis/canon.json and prints the same numbers. Seeded where a method
needs a seed, so the output is identical on every run.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
SEED = 20260924
rng = np.random.default_rng(SEED)

df = pd.read_csv(ROOT / "data" / "streams.csv")
summ = pd.read_csv(ROOT / "data" / "summary.csv")
out: dict = {}

# ---------------------------------------------------------------------------
# 1. The naive read (a2 / b5): what do the top streams share?
# ---------------------------------------------------------------------------
summ = summ.sort_values("gmv", ascending=False).reset_index(drop=True)
top = summ.head(10)
rest = summ.iloc[10:]
naive = {
    "top10_giveaway_share": float(top["giveawayOpen"].mean()),
    "rest_giveaway_share": float(rest["giveawayOpen"].mean()),
    "top10_gmv_mean": float(top["gmv"].mean()),
    "rest_gmv_mean": float(rest["gmv"].mean()),
    "top10_human_share": float((top["hostType"] == "human").mean()),
    "giveaway_vs_not": {
        "giveaway": summ[summ.giveawayOpen == 1][["gmv", "views", "cvr", "gpm", "boost", "avgWatchMin"]].mean().round(2).to_dict(),
        "no_giveaway": summ[summ.giveawayOpen == 0][["gmv", "views", "cvr", "gpm", "boost", "avgWatchMin"]].mean().round(2).to_dict(),
    },
    "host_type": summ.groupby("hostType")[["gmv", "views", "cvr", "gpm", "avgWatchMin", "replies"]].mean().round(2).to_dict("index"),
    "by_host": summ.groupby("host")[["gmv", "cvr", "gpm", "riskFlags", "avgWatchMin"]].mean().round(2).to_dict("index"),
}
out["naive"] = naive

# ---------------------------------------------------------------------------
# 2. Per-minute rates and the segment table (b5)
# ---------------------------------------------------------------------------
m = df.copy()
m["ctr"] = np.where(m.impressions > 0, m.clicks / m.impressions, np.nan)
m["cvr"] = np.where(m.clicks > 0, m.orders / m.clicks, np.nan)
m["opv"] = np.where(m.room > 0, m.orders / m.room, np.nan)  # orders per viewer-minute
seg = m.groupby("segment").agg(minutes=("t", "size"), ctr=("ctr", "mean"), cvr=("cvr", "mean"), opv=("opv", "mean"),
                                comments_per_100=("comments", lambda s: 100 * s.sum() / m.loc[s.index, "room"].sum()))
seg = (seg * [1, 100, 100, 1000, 1]).round(2).sort_values("opv", ascending=False)
out["segment_table"] = seg.reset_index().to_dict("records")

# the stretched-urgency read: conversion by consecutive fomo minute
fomo = m[m.segment == "fomo"].groupby("fomo_run").agg(minutes=("t", "size"), cvr=("cvr", "mean"), room_change=("room", "mean"))
fomo["cvr"] = (100 * fomo["cvr"]).round(2)
out["fomo_by_run"] = fomo.reset_index().to_dict("records")

# ---------------------------------------------------------------------------
# 3. The confound, then within-stream fixed effects (b6)
# ---------------------------------------------------------------------------
import statsmodels.formula.api as smf

# pooled: does a giveaway opener predict GMV across streams? (the naive regression)
pooled = smf.ols("gmv ~ giveawayOpen + C(hostType) + C(hour)", data=summ).fit()
out["pooled_giveaway_coef"] = float(pooled.params["giveawayOpen"])
out["pooled_giveaway_p"] = float(pooled.pvalues["giveawayOpen"])

# within-stream: demean every per-minute variable by stream, so traffic luck and the host's
# base draw cancel and only what changed inside the stream is compared with itself.
mm = m.dropna(subset=["cvr"]).copy()
mm["cvr100"] = 100 * mm["cvr"]
mm["ctr100"] = 100 * mm["ctr"]
for c in ["cta", "demo", "price", "fomo", "qna", "hook", "filler", "dead"]:
    mm[f"is_{c}"] = (mm.segment == c).astype(int)
mm["fomo_stretched"] = ((mm.segment == "fomo") & (mm.fomo_run >= 3)).astype(int)
mm["fomo_short"] = ((mm.segment == "fomo") & (mm.fomo_run < 3)).astype(int)
X = ["is_cta", "is_demo", "is_price", "fomo_short", "fomo_stretched", "is_qna", "is_hook", "is_filler", "is_dead",
     "product_in_hand", "close_up_ratio", "price_overlay", "giveaway_live"]

def within(df_: pd.DataFrame, cols: list[str], y: str) -> pd.DataFrame:
    g = df_.groupby("stream_id")
    d = df_[cols + [y]].copy()
    for c in cols + [y]:
        d[c] = df_[c] - g[c].transform("mean")
    return d

def fe_fit(y: str) -> dict:
    d = within(mm, X, y)
    fit = smf.ols(f"{y} ~ " + " + ".join(X) + " - 1", data=d).fit(cov_type="cluster", cov_kwds={"groups": mm["stream_id"]})
    return {k: {"coef": round(float(fit.params[k]), 3), "p": round(float(fit.pvalues[k]), 4)} for k in X}

out["fe_cvr"] = fe_fit("cvr100")
out["fe_ctr"] = fe_fit("ctr100")

# same regression pooled (no demeaning) for the contrast the page draws
pooled_min = smf.ols("cvr100 ~ " + " + ".join(X), data=mm).fit(cov_type="cluster", cov_kwds={"groups": mm["stream_id"]})
out["pooled_cvr"] = {k: {"coef": round(float(pooled_min.params[k]), 3), "p": round(float(pooled_min.pvalues[k]), 4)} for k in X}

# ---------------------------------------------------------------------------
# 4. LightGBM + SHAP on per-minute orders (b6): what the model says matters
# ---------------------------------------------------------------------------
import lightgbm as lgb
import shap

feat = ["room", "impressions", "product_in_hand", "close_up_ratio", "price_overlay", "scene_cuts", "wpm", "fomo_run",
        "giveaway_live", "giveaway_open", "hour", "t", "replies", "comments", "likes"] + [f"is_{c}" for c in ["cta", "demo", "price", "fomo", "qna", "hook", "filler", "dead"]]
mm["is_ai"] = (mm.host_type == "ai").astype(int)
feat.append("is_ai")
streams = mm.stream_id.unique()
rng.shuffle(streams)
test_ids = set(streams[:12])
tr, te = mm[~mm.stream_id.isin(test_ids)], mm[mm.stream_id.isin(test_ids)]
model = lgb.LGBMRegressor(n_estimators=400, learning_rate=0.03, num_leaves=15, min_child_samples=40, subsample=0.8, subsample_freq=1,
                          colsample_bytree=0.8, random_state=SEED, verbose=-1)
model.fit(tr[feat], tr["orders"])
pred = model.predict(te[feat])
mae = float(np.mean(np.abs(pred - te["orders"])))
base_mae = float(np.mean(np.abs(te["orders"].mean() - te["orders"])))
expl = shap.TreeExplainer(model)
sv = expl.shap_values(te[feat])
imp = pd.Series(np.abs(sv).mean(axis=0), index=feat).sort_values(ascending=False)
out["lgbm"] = {"test_streams": len(test_ids), "mae": round(mae, 3), "mean_baseline_mae": round(base_mae, 3),
               "shap_top": [{"feature": k, "mean_abs_shap": round(float(v), 4)} for k, v in imp.head(10).items()]}

# ---------------------------------------------------------------------------
# 5. Human vs AI host, per viewer (a4 / b3)
# ---------------------------------------------------------------------------
hv = summ.groupby("hostType").agg(streams=("id", "size"), gmv=("gmv", "mean"), gpm=("gpm", "mean"), cvr=("cvr", "mean"),
                                   watch=("avgWatchMin", "mean"), replies=("replies", "mean"), evening_share=("hour", lambda h: (h >= 18).mean()))
out["human_vs_ai"] = hv.round(2).to_dict("index")
# the same comparison inside overlapping hours only
ov = summ[summ.hour.isin([17, 22])]
if len(ov) and ov.hostType.nunique() == 2:
    out["human_vs_ai_same_hours"] = ov.groupby("hostType")[["gmv", "gpm", "cvr", "avgWatchMin"]].mean().round(2).to_dict("index")
# retention decay by script cycle
cyc = m.groupby(["host_type", "cycle"]).agg(room=("room", "mean")).reset_index()
cyc = cyc[cyc.cycle <= 8].pivot(index="cycle", columns="host_type", values="room").round(0)
out["room_by_cycle"] = cyc.reset_index().to_dict("records")

# ---------------------------------------------------------------------------
# 6. The nowcast, backtested (b7): EWMA rate x room projection, 5-minute horizon
# ---------------------------------------------------------------------------
def nowcast_backtest(alpha: float = 0.3, horizon: int = 5) -> dict:
    errs, naive_errs = [], []
    for sid, g in m.groupby("stream_id"):
        g = g.sort_values("t")
        orders, room = g.orders.to_numpy(), g.room.to_numpy()
        rate = None
        for t in range(3, len(g) - horizon):
            rr = orders[t - 1] / room[t - 1] if room[t - 1] else 0
            rate = rr if rate is None else alpha * rr + (1 - alpha) * rate
            k = min(5, t - 1)
            slope = (room[t - 1] - room[t - 1 - k]) / k
            pr, po = room[t - 1], 0.0
            for _ in range(horizon):
                pr = max(0, pr + slope * 0.6)
                po += pr * rate
            actual = orders[t:t + horizon].sum()
            errs.append(abs(po - actual))
            naive_errs.append(abs(orders[t - horizon:t].sum() - actual))  # "next 5 = last 5"
    return {"alpha": alpha, "mae": round(float(np.mean(errs)), 2), "naive_last5_mae": round(float(np.mean(naive_errs)), 2), "n": len(errs)}

out["nowcast"] = [nowcast_backtest(a) for a in (0.1, 0.3, 0.6)]

# ---------------------------------------------------------------------------
# 7. Switchback: does a design over minutes recover the CTA effect? (b8)
# ---------------------------------------------------------------------------
# On the historical data we can only compare naturally occurring CTA minutes; the bench is where a
# policy is actually applied. Here: the within-stream CTA coefficient again, expressed as orders per
# 1000 viewer-minutes, the unit the a6 scorecard uses.
d = within(mm.assign(opv1000=1000 * mm.opv.fillna(0)), ["is_cta", "is_demo", "is_qna", "fomo_stretched", "giveaway_live"], "opv1000")
fit = smf.ols("opv1000 ~ is_cta + is_demo + is_qna + fomo_stretched + giveaway_live - 1", data=d).fit(
    cov_type="cluster", cov_kwds={"groups": mm["stream_id"]})
out["opv_effects"] = {k: round(float(v), 2) for k, v in fit.params.items()}
out["opv_mean"] = round(float(1000 * mm.opv.mean()), 2)

(ROOT / "materials" / "analysis" / "canon.json").write_text(json.dumps(out, indent=2, default=float))
print(json.dumps(out, indent=2, default=float))
