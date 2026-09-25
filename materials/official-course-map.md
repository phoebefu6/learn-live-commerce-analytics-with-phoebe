# Official course map - learn-live-commerce-analytics-with-phoebe

Built 2026-09-24. Hub bucket `ds` (Data Science), difficulty tier 3. Two tracks: leader 6 x 45 min,
builder 8 x 45 min. Audience `both`, format `interactive`, 14 sessions.

Running artifact: one **minute-grain table** over 60 TikTok Shop LIVE streams of **Lumen Glow**, a
fictional skincare brand with one hero SKU (Dew Serum, 29 dollars, 49 dollar bundle), four human
hosts (Maya, Jules, Ren, Priya) and two AI avatar hosts (Nova, Kai). The bench replays stream 61,
"tonight" (Jules, Friday 20:00), and lets the learner cue the host.

Decisions Phoebe locked in the grill (2026-09-24): lens = C + A + B combined in the live-commerce
domain; platform TikTok Shop; English only; two paths (tech / MCN leader); two-track shape;
synthetic data from a seeded generator with planted effects, declared as planted; CV features
precomputed (no live detector in the browser); slug `learn-live-commerce-analytics-with-phoebe`,
title "LIVE Commerce Video Analytics"; TikTok-ish cyan palette.

---

## The seam against sibling courses (checked against their live session titles)

| Sibling | What it owns | What this course does instead |
|---|---|---|
| `learn-ecommerce-metrics-with-phoebe` (data) | "The GMV equation", "Reading the funnel", "The GMV driver tree", metric governance | LIVE-room metrics only, at the minute grain, joined to content. a1 is titled "Read the LIVE room", never "Reading the funnel". Buyer-level and order-level analysis is handed to that course by name in b1 |
| `learn-ai-media-with-phoebe` (aiap) | Making the video: retention curve, "The first three seconds", captions, tool costs, Sora | Analysing a two-hour selling stream after and during the fact. No editing, no generation tools, no retention-curve teaching (the 16 to 72 percent finding stays there) |
| `learn-ai-digital-human-with-phoebe` (aiap) | Consent, likeness, "Should you at all", the policy you have to write | Only what the data says about an AI host per viewer, plus TikTok Shop's LIVE rule (below). Ethics and consent are linked, not repeated |
| `learn-timeseries-forecasting-with-phoebe` (ds) | The method ladder: ETS, ARIMA, Prophet, ML, deep, backtesting | One nowcaster for a 1-minute series with a 5-minute horizon, backtested on the history. b7 names the sibling for everything past that |
| `learn-experimentation-with-phoebe` (ds) | A/B, CUPED, sequential, geo, DiD, synthetic control | Switchback design over minutes of one stream, and bandits, which the sibling does not cover. b8 hands randomisation theory to it |
| `learn-causal-inference-with-phoebe` (ds) | DAGs, identification, DoWhy, heterogeneity | Only within-stream fixed effects as a confound fix, taught by contrast with the pooled regression. b6 names DoWhy once and points at the sibling |
| `learn-streaming-data-with-phoebe` (deng) | Event-time windows, watermarks, idempotency, replay | The stream delay as a clock-shift problem in b2. No streaming infrastructure |
| `learn-user-journey-analytics-with-phoebe` (data) | Site journeys, PDP, cart micro-funnel | Nothing on-site. The LIVE room is the whole journey here |

Widget name `live-bench.js` / `LIVE_ENGINE`: no sibling uses either (grep 2026-09-24).

---

## Session coverage

### Leader track

| # | Session | Covers (✓ live, ◐ named and handed on) | Source rows |
|---|---|---|---|
| a1 | Read the LIVE room | ✓ TikTok Shop LIVE metric names and the four-stage diagnosis funnel; ✓ counts vs states; ✓ GPM vs GMV as selling vs traffic; ◐ tap-through rate (platform-held) | T1.1, T1.2, T1.3, T1.4 |
| a2 | What the top streams share | ✓ the giveaway confound (9 of top 10; +5,576 pooled; -2.3 pts within); ✓ per-viewer vs per-stream comparison; ◐ fixed-effects mechanics (b6) | analysis canon |
| a3 | Design the say | ✓ segment values (CTA 11.6, price 7.7, demo 7.7, urgency 5.8, hook 2.0 orders per 1,000 viewer-min); ✓ the two-minute urgency cue (15.1/15.4 percent CVR at run 1-2, 8.3 at run 3); ✓ FABES; ✓ what a legal urgency claim is (TikTok misleading-content guide, DMCC para 7, UCPD item 7, FTC dark patterns) | T1.8, P2.3, P2.4, R3.1-3.3, canon |
| a4 | Design the show | ✓ product in hand +1.38 pts CTR, close-up +1.01, price on screen +0.97 (within-stream); ✓ human vs AI per viewer (GPM 1,981 vs 1,252; same-hour 1,910 vs 1,258; watch 9.8 vs 7.3 min); ✓ **TikTok Shop's LIVE rule: no AI-generated voices, no non-real-time narration, avatars under 50 percent of frame**; ◐ consent and likeness (digital-human course) | canon, P2.9, P2.7, P2.8 |
| a5 | Coach the room live | ✓ the nowcast in the producer's ear; ✓ three cues that pay (+10.1, +9.7, +4.4 percent), two that do not (stretched urgency +0.5 percent and 3.2 flags; mid-stream giveaway -11.2 percent); ✓ the replay bench, leader mode | canon.json ladder |
| a6 | Prove the playbook worked | ✓ a host and script scorecard on per-viewer numbers; ✓ switchback design in plain words; ✓ the claims the platform and the regulator read as deceptive; ✓ AI Act Art 50 from 2 Aug 2026; ◐ full experiment theory (experimentation course) | P2.x, R3.x, Bojinov 2023 |

### Builder track

| # | Session | Covers | Source rows |
|---|---|---|---|
| b1 | The stream as data | ✓ four sources, native grains, one join key; ✓ funnel rebuilt from columns and reconciled 60/60; ✓ the three grain mistakes | T1.1, T1.2, data |
| b2 | Ingest and align | ✓ FFmpeg 9.0.2 segment muxer, fps filter, 16 kHz mono wav; ✓ PySceneDetect 0.7.1 AdaptiveDetector; ✓ the stream-delay clock shift and what it does to every downstream result if skipped | K1 |
| b3 | See it | ✓ Ultralytics 8.4.161 / YOLO26 and the AGPL-3.0 vs Enterprise licence decision; ✓ MediaPipe 1.0.1 hand and pose landmarkers (Apache-2.0); ✓ YOLOE / Grounding DINO / OWLv2 / Florence-2 open-vocabulary against a named SKU; ✓ supervision 0.30.5 zones, trackers 2.6.0 (ByteTrack moved out of supervision); ✓ close-up ratio, product in hand, price card OCR as minute columns | K2 |
| b4 | Hear it | ✓ Whisper 20250625 / faster-whisper 1.2.1 / WhisperX 3.8.6 word timestamps; ✓ Deepgram nova-3 and AssemblyAI Universal-3.5 with per-hour prices; ✓ the segment tagger (nine labels); ✓ a claims checker on TikTok's own banned-absolutes list; ◐ Gemini 3.8 Flash / Qwen3-VL / Twelve Labs Pegasus 1.5 for VLM segment labels | K3, K4, P2.3 |
| b5 | Score the content | ✓ per-minute CTR, CTOR, orders per 1,000 viewer-minutes by segment; ✓ ratios on small denominators; ✓ the urgency run table | canon |
| b6 | From traits to a playbook | ✓ pooled OLS vs within-stream demeaned OLS with clustered errors (statsmodels 0.15 / linearmodels 7.0 PanelOLS); ✓ LightGBM 4.7.0 + SHAP 0.52 TreeExplainer, MAE 1.43 vs 2.56 baseline, top features; ◐ DoWhy 0.14 / EconML 0.17 | K5, canon |
| b7 | The live nowcast | ✓ EWMA order-rate times room projection, alpha sweep 0.1/0.3/0.6, MAE 9.41/10.84/11.28 vs naive 11.97 over 6,720 windows; ✓ statsforecast 2.1.1 AutoETS/MSTL and statsmodels UnobservedComponents as the next rung; ✓ an alert rule with a base rate | K6, canon |
| b8 | Intervene, then prove it | ✓ the replay bench, seven policies over 40 nights; ✓ switchback design (Bojinov, Simchi-Levi, Zhao 2023); ✓ bandits (MABWiser 2.7.4, VW 9.11.6) named as the next step | K6, canon |

---

## Verified facts, with their tier

**Tier 1 - read from the primary page on 2026-09-24.** Full fetch logs in
`materials/sources/sources-tiktok-policy.md` and `materials/sources/sources-tech.md`.

TikTok Shop Academy (US Seller Center):
- T1.1 Key Metrics: Likes, Comments, Shares, Total Views, Average Watch Duration, Unique Viewers
  ("counted only once"), Peak Concurrent Viewers, Average Concurrent Viewers, CTR, CTOR ("percentage
  of viewers who proceed to purchase after clicking"), GMV, Watch GPM ("total sales (GMV) generated
  for every thousand views"), Items Sold, Content Violations.
- T1.2 LIVE Manager Analytics: GMV, Direct GMV; Views, Viewers, Entry Rate, Traffic Sources (Feed /
  Promoted / Follow); Comments, Likes, Shares, New Followers, Watch Time; Product Impressions,
  Product Clicks, CTR, CTOR, Sold Quantity.
- T1.3 LIVE Diagnosis: funnel stages Tap-through rate -> Avg. viewing duration per view -> CTR ->
  CTOR. Status labels Risk / Need attention / Can improve / Normal.
- T1.4 LIVE Performance: GMV per hour, Impressions per hour; definitions live in hover tooltips
  inside Seller Center (not fetchable, so formulas on the pages are the course's own arithmetic and
  say so).
- T1.8 Playbook pages: 10+ products in the bag ("LIVEs with 10+ items see 2x higher shopping bag
  clicks"); do not switch pins faster than 10-15 min in a 2 h LIVE; H-I-T product mix; FABES
  (Features, Advantages, Benefits, Evidence, Scarcity); LIVE Flash Sale with countdown; LIVE Coupon;
  Creator LIVE Giveaway is a real platform tool; LIVE events 30 min to 13 h, max 100 products.
- P2.1 Content Policy (eff. 2026-09-17): no "exaggerated promises about a product's performance,
  effect, or price"; no "false, misleading, unavailable, or expired prices or discounts"; AIGC that
  "Misleads or deceives viewers ... Fabricates product effects" is not allowed.
- P2.2 Fair Pricing Policy (eff. 2026-09-01): no reference prices that "do not reflect a genuine
  and established selling price"; no "Artificially inflating the original price".
- P2.3 How to Avoid Misleading Content: problematic urgency wording "While stocks last", "This
  sale is for selected customers only", "Don't miss these big discounts", "We are having our largest
  sale!"; banned absolutes "100% effective", "Guaranteed results", "Works for everyone", "Permanent
  effect", "Instant results", "No side effects".
- P2.4 Misleading Discount Content Guide (eff. 2026-08-31): "sale ends today" / "only 2 hours left"
  must be genuine; shown price must match the product page.
- P2.6 UK Content Policy (eff. 2026-01-09): prohibits claiming the seller "will soon stop selling
  the product(s), when that is not the case".
- P2.7 AI-Generated Content Restrictions (US, eff. 2026-09-02): disclose synthetic faces, voices,
  digital humans; "Do not use AI to make a product look more powerful or effective than it really
  is".
- P2.8 AIGC (UK, 2026-08-28): platform label "Disclosed by creator as AI-generated" cannot be
  removed; no AI presenters implying professional expertise.
- **P2.9 Requirements for High-Quality Videos and LIVEs (US, eff. 2026-09-17):** "Interact with
  viewers through real-time verbal or sign language communication." "Do not use non-real-time
  verbal interaction such as AI-generated voices, audio recordings, or radio." "Do not use animated
  figures or content that covers more than 50% of the screen." Penalties up to account removal.
  **Consequence taught in a4 and a6: a fully AI-voiced avatar host is not permitted on a TikTok
  Shop promotional LIVE.** The AI-host streams in the dataset are taught as what the trade would be
  where an avatar host is allowed, and as a compliance stop on this platform.

Regulation:
- R3.1 FTC: Endorsement Guides 16 CFR 255 (eff. 2023-07-26); Consumer Reviews Rule 16 CFR 465
  (announced 2024-08-14); "Bringing Dark Patterns to Light" (2022): False Low Stock Message, False
  High Demand, Baseless Countdown Timer, False Limited Time Message, False Discount Claims. No FTC
  rule specific to fake urgency; enforcement under FTC Act s.5.
- R3.2 UK DMCC Act 2024 Sch. 20 para 7 (in force 2025-04-06): "Falsely stating that a product will
  only be available for a limited time ... in order to elicit an immediate decision". CMA207
  (2025-11-18) countdown-clock example.
- R3.3 EU UCPD Annex I item 7 ("very limited time"); Art 6(1)(d) on price advantage.
- R3.4 EU AI Act Art 50 applies from 2 August 2026 (three sources agree).

Tools (versions read from PyPI / docs 2026-09-24):
- K1 FFmpeg 9.0.2; PySceneDetect 0.7.1 (BSD-3), `AdaptiveDetector(adaptive_threshold=3.0, ...)`.
- K2 ultralytics 8.4.161, YOLO26 flagship (AGPL-3.0 or Enterprise; commercial/closed use needs
  Enterprise); YOLOE open-vocab; mediapipe 1.0.1 (Apache-2.0) ObjectDetector / HandLandmarker /
  PoseLandmarker; supervision 0.30.5 (MIT) PolygonZone / LineZone, `sv.ByteTrack` deprecated since
  0.28.0 and removed in 0.31.0, replaced by `trackers` 2.6.0 `ByteTrackTracker`; OWLv2 (Apache-2.0),
  Grounding DINO 1.0 (Apache-2.0), Florence-2 (MIT).
- K3 openai-whisper 20250625 (MIT), faster-whisper 1.2.1 (MIT), whisperx 3.8.6 (BSD-2); Deepgram
  nova-3 $0.0043/min mono; AssemblyAI Universal-3.5 Pro $0.21/hr (words in milliseconds; Deepgram
  in seconds).
- K4 Gemini 3.8 Flash via `client.interactions.create`, ~100 video tokens/s at low resolution, $0.75
  in per 1M tokens through 2026-12-31 (about $0.006 per minute of video, course arithmetic);
  Qwen3-VL Apache-2.0; Twelve Labs Marengo 3.0 / Pegasus 1.5.
- K5 LightGBM 4.7.0, SHAP 0.52.0 (Python 3.12+), statsmodels 0.15.0, linearmodels 7.0, DoWhy
  0.14, EconML 0.17.0.
- K6 statsforecast 2.1.1 (no release since 2024-09), MABWiser 2.7.4, vowpalwabbit 9.11.6.

**Tier 2 - abstract only or secondary.** Flagged on the page that cites it.
- Guo, Zhang, Goh, Peng (2025) POM: affective CTAs raise orders, cognitive CTAs do not (abstract).
- Xie, Sharma, Mehra (2025) POM: longer per-product presentation raises product revenue, lowers
  session revenue (abstract).
- Ling et al. (2024) Behavioral Sciences 14(4):320 and Liu & Zhang (2024) PLOS ONE: survey SEM,
  streamer interaction -> purchase intention; time pressure strengthens it (full text read, but
  self-reported intention, Chinese platforms).
- Bojinov, Simchi-Levi, Zhao (2023) Management Science 69(7): switchback design (arXiv abstract;
  journal metadata via search).
- Digital Omnibus grace period for Art 50(2) watermarking: date unverified; the page says only
  "Article 50 applies from 2 August 2026".

**Tier 3 - the course's own planted structure.** Declared on the landing page and in
`assets/live-engine.js`. Nothing in it is a claim about TikTok's ranking algorithm.

---

## Analysis canon (materials/analysis/canon.json, produced by analyze.py on 2026-09-24)

- Top 10 streams by GMV: 9 of 10 opened with a giveaway (base rate 32 of 60); 10 of 10 human.
- Giveaway vs not (stream means): GMV 16,904 vs 15,265; views 10,364 vs 7,546; boost 1.93 vs 1.25;
  CVR 11.16 vs 13.10; GPM 1,547 vs 1,983; watch 8.67 vs 9.38 min.
- Pooled OLS, GMV on giveaway opener controlling host type and hour: +5,576 dollars, p < 1e-7.
- Within-stream (demeaned by stream, clustered by stream), CVR in points: CTA +6.50, price +3.78,
  short urgency (run 1-2) +4.93, stretched urgency (run 3+) -1.84, Q&A +0.96, hook -3.18, filler
  -2.64, dead air -4.72, giveaway minute -2.31; product in hand +0.04 (p 0.81), close-up +0.46
  (p 0.65), price overlay -0.13 (p 0.58).
- Within-stream, CTR in points: product in hand +1.38, close-up +1.01, price overlay +0.97, CTA
  +3.28, demo +2.54; giveaway minute -0.05 (p 0.71).
- Segment table, orders per 1,000 viewer-minutes: CTA 11.57, price 7.69, demo 7.72, urgency 5.83,
  build 4.51, Q&A 3.68, hook 1.98, filler 1.40, dead 0.71. Mean 5.80.
- Urgency by consecutive minute, CVR percent: 15.12, 15.44, 8.30, 8.33, 8.43, 9.09.
- LightGBM per-minute orders, 12 held-out streams: MAE 1.427 vs mean-baseline 2.56. SHAP top:
  impressions, is_cta, close_up_ratio, product_in_hand, room, fomo_run, is_hook, price_overlay,
  is_price, is_ai.
- Human vs AI: GMV 19,850 vs 8,132; GPM 1,981 vs 1,252; CVR 12.53 vs 11.07; watch 9.80 vs 7.28;
  replies 95.6 vs 0; evening share 0.95 vs 0.26. Same hours (17:00, 22:00): GPM 1,910 vs 1,258.
- Room by script cycle (human / AI): 419/216, 856/442, 961/484, 961/468, 935/441, 880/413,
  847/383, 790/366.
- Nowcast backtest, 6,720 windows, 5-min horizon: alpha 0.1 MAE 9.41; 0.3 10.84; 0.6 11.28; naive
  last-5 11.97.
- Bench ladder (data/canon.json, 40 nights of stream 61): none 18,198; ctaOnDip 20,847 (+14.6%);
  showOnCta 19,960 (+9.7%); replyEvery10 19,006 (+4.4%); stretchFomo 18,290 (+0.5%, watch 9.84 vs
  9.63, 3.18 flags); giveawayOnDrop 16,165 (-11.2%); playbook 23,166 (+27.3%).

---

## Not covered by design

- Order-level data: refunds, SKUs, buyer cohorts (customer retention / e-commerce metrics courses).
- Feed-side tap-through rate (platform-held, never in the recording).
- Video editing, generation, thumbnails, retention curves (AI + Audio/Video course).
- Consent, likeness, deepfake ethics (AI + Digital Human course).
- Douyin / Taobao Live specifics. English, TikTok Shop only, by Phoebe's decision.
- Live detector running in the browser (Phoebe chose precomputed CV features).
- Re-verify before delivery: TikTok Shop policy pages carry effective dates and changed three times
  in Aug-Sep 2026; tool versions move monthly.
