/* live-bench.js - the replay bench for learn-live-commerce-analytics-with-phoebe.
   Renders into any element carrying [data-live-bench]. Needs live-engine.js loaded first.

   Two panels. REPLAY runs tonight's stream (Jules, Friday 20:00) minute by minute with the
   nowcast beside the truth, and lets you cue the host at the current minute. Because the
   engine is seeded, cueing minute 40 changes nothing before minute 40 - the past stays put,
   exactly as it would in a real room. LADDER runs every coaching policy over 40 seeded nights
   and reports means, because one night is a story and forty is a measurement.

   Everything drawn here is computed on the spot by live-engine.js. Nothing is hard-coded. */
(function () {
  "use strict";
  var E = window.LIVE_ENGINE;
  if (!E) return;

  var ACTIONS = [
    { key: "cta",    label: "Cue a CTA",           ov: { seg: "cta", inHand: 1, priceOverlay: 1 } },
    { key: "show",   label: "Product in hand",     ov: { inHand: 1, closeUp: 0.8 } },
    { key: "qna",    label: "Answer the room",     ov: { seg: "qna", replies: 6 } },
    { key: "fomo",   label: "Stretch the urgency", ov: { seg: "fomo" } },
    { key: "give",   label: "Announce a giveaway", ov: { seg: "hook", giveaway: true } }
  ];
  var SEG_LABEL = { hook: "hook", build: "product build", demo: "demo", price: "price", cta: "CTA", fomo: "urgency", qna: "Q&A", filler: "filler", dead: "dead air" };

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt !== undefined) e.textContent = txt;
    return e;
  }
  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }
  function css(name, fb) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fb;
  }

  function mount(host) {
    var C = {
      p: css("--indigo", "#0B7F94"), deep: css("--indigo-deep", "#075E70"), mid: css("--indigo-mid", "#22C3DD"),
      soft: css("--indigo-soft", "#A5EAF4"), tint: css("--indigo-50", "#EEFCFE"), ink: css("--ink", "#0B1A20"),
      muted: css("--muted", "#4F6B73"), faint: css("--faint", "#BFD8DE"), flag: css("--amber", "#C8173F")
    };
    var seed = 424242;
    var params = E.tonightParams(seed);
    var actions = {};          /* minute -> action key */
    var t = 12;                /* current minute of the replay */
    var timer = null;
    var mode = host.getAttribute("data-mode") || "both";

    function policy(tt, st, m) { var a = actions[tt]; return a ? ACTIONS.filter(function (x) { return x.key === a; })[0].ov : null; }
    function baseline() { return E.simulate(E.tonightParams(seed), null); }
    function coached() { return E.simulate(E.tonightParams(seed), policy); }

    host.innerHTML = "";
    var wrap = el("div", "lb");

    /* ---------- REPLAY ---------- */
    var replay = el("div", "lb-panel");
    if (mode !== "ladder") {
      var head = el("div", "lb-head");
      head.appendChild(el("b", null, "Tonight: " + params.host.name + ", Friday 20:00, " + E.SKU.name + " at " + money(E.SKU.price)));
      head.appendChild(el("span", "lb-note", "Every count below is produced by the engine as you press play. The nowcast only ever sees minutes that have already happened."));
      replay.appendChild(head);

      var chart = el("div", "lb-chart");
      replay.appendChild(chart);

      var stat = el("div", "lb-stats");
      replay.appendChild(stat);

      var ctl = el("div", "lb-ctl");
      var play = el("button", "btn primary", "▶ Play");
      var step = el("button", "btn", "Step 1 min");
      var reset = el("button", "btn", "Reset");
      ctl.appendChild(play); ctl.appendChild(step); ctl.appendChild(reset);
      var cues = el("div", "lb-cues");
      ACTIONS.forEach(function (a) {
        var b = el("button", "btn lb-cue", a.label);
        b.setAttribute("data-key", a.key);
        b.addEventListener("click", function () { if (t <= E.MINUTES) { actions[t] = a.key; draw(); } });
        cues.appendChild(b);
      });
      ctl.appendChild(el("span", "lb-cuelabel", "Cue the host at this minute:"));
      ctl.appendChild(cues);
      replay.appendChild(ctl);

      var forty = el("div", "lb-forty");
      var fortyBtn = el("button", "btn", "Run this exact plan over 40 nights");
      var fortyOut = el("div", "lb-fortyout");
      forty.appendChild(fortyBtn); forty.appendChild(fortyOut);
      replay.appendChild(forty);

      play.addEventListener("click", function () {
        if (timer) { clearInterval(timer); timer = null; play.textContent = "▶ Play"; return; }
        play.textContent = "❚❚ Pause";
        timer = setInterval(function () { if (t >= E.MINUTES) { clearInterval(timer); timer = null; play.textContent = "▶ Play"; return; } t++; draw(); }, 220);
      });
      step.addEventListener("click", function () { if (t < E.MINUTES) { t++; draw(); } });
      reset.addEventListener("click", function () { actions = {}; t = 12; if (timer) { clearInterval(timer); timer = null; play.textContent = "▶ Play"; } fortyOut.innerHTML = ""; draw(); });
      fortyBtn.addEventListener("click", function () {
        var accB = 0, accC = 0, accW = 0, accF = 0, N = 40;
        for (var s = 0; s < N; s++) {
          var b = E.simulate(E.tonightParams(seed + s * 101), null).summary;
          var c = E.simulate(E.tonightParams(seed + s * 101), policy).summary;
          accB += b.gmv; accC += c.gmv; accW += c.avgWatchMin - b.avgWatchMin; accF += c.riskFlags - b.riskFlags;
        }
        var d = (accC - accB) / N;
        fortyOut.innerHTML = "";
        fortyOut.appendChild(el("b", null, (d >= 0 ? "+" : "-") + money(Math.abs(d)) + " GMV per night, mean of 40 seeded nights with your cues at the same minutes"));
        fortyOut.appendChild(el("span", "lb-note", " (watch time " + (accW / N >= 0 ? "+" : "") + (accW / N).toFixed(2) + " min, policy-risk flags " + (accF / N >= 0 ? "+" : "") + (accF / N).toFixed(2) + " per night). One night above is a story; this is the measurement."));
      });

      function draw() {
        var base = baseline(), coach = coached();
        var rows = coach.minutes.slice(0, t), brows = base.minutes.slice(0, t);
        var nc = E.nowcast(coach.minutes, t, 5);
        var actualNext = coach.minutes.slice(t, t + 5).reduce(function (p, x) { return p + x.orders; }, 0);
        var gmvSoFar = rows.reduce(function (p, x) { return p + x.gmv; }, 0);
        var bgmvSoFar = brows.reduce(function (p, x) { return p + x.gmv; }, 0);
        var cur = rows[rows.length - 1];

        /* chart: room (area) + orders (bars) for minutes 1..t, cue markers */
        var W = 880, H = 230, padL = 46, padR = 14, padT = 18, padB = 28;
        var maxRoom = Math.max.apply(null, coach.minutes.map(function (x) { return x.room; }).concat(base.minutes.map(function (x) { return x.room; }))) * 1.05;
        var maxOrd = Math.max.apply(null, coach.minutes.map(function (x) { return x.orders; }).concat(base.minutes.map(function (x) { return x.orders; }))) * 1.1 || 1;
        var xs = function (i) { return padL + (i - 1) * (W - padL - padR) / (E.MINUTES - 1); };
        var yr = function (v) { return padT + (H - padT - padB) * (1 - v / maxRoom); };
        var yo = function (v) { return padT + (H - padT - padB) * (1 - v / maxOrd); };
        var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Room size and orders per minute for tonight\'s stream up to minute ' + t + ', with the host\'s own plan drawn faint underneath the coached run">';
        s += '<line x1="' + padL + '" y1="' + (H - padB) + '" x2="' + (W - padR) + '" y2="' + (H - padB) + '" stroke="' + C.faint + '"/>';
        [0, 30, 60, 90, 120].forEach(function (m) { if (m === 0) m = 1; s += '<text x="' + xs(m) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="11" fill="' + C.muted + '" font-family="Inter,sans-serif">' + (m === 1 ? "min 1" : m) + '</text>'; });
        s += '<text x="6" y="' + (padT + 8) + '" font-size="11" fill="' + C.muted + '" font-family="Inter,sans-serif">room</text>';
        s += '<text x="' + (W - padR) + '" y="' + (padT + 8) + '" text-anchor="end" font-size="11" fill="' + C.flag + '" font-family="Inter,sans-serif">orders / min</text>';
        /* baseline room, faint */
        var pb = brows.map(function (x, i) { return (i ? "L" : "M") + xs(x.t) + " " + yr(x.room); }).join(" ");
        if (pb) s += '<path d="' + pb + '" fill="none" stroke="' + C.faint + '" stroke-width="2" stroke-dasharray="4 4"/>';
        /* coached room area */
        if (rows.length) {
          var pa = "M" + xs(1) + " " + yr(0) + " " + rows.map(function (x) { return "L" + xs(x.t) + " " + yr(x.room); }).join(" ") + " L" + xs(rows[rows.length - 1].t) + " " + yr(0) + " Z";
          s += '<path d="' + pa + '" fill="' + C.soft + '" opacity="0.55"/>';
          s += '<path d="' + rows.map(function (x, i) { return (i ? "L" : "M") + xs(x.t) + " " + yr(x.room); }).join(" ") + '" fill="none" stroke="' + C.p + '" stroke-width="2.5"/>';
        }
        /* orders bars */
        var bw = (W - padL - padR) / E.MINUTES * 0.7;
        rows.forEach(function (x) { s += '<rect x="' + (xs(x.t) - bw / 2) + '" y="' + yo(x.orders) + '" width="' + bw + '" height="' + (H - padB - yo(x.orders)) + '" fill="' + C.flag + '" opacity="0.75"/>'; });
        /* cue markers */
        Object.keys(actions).forEach(function (k) {
          var m = +k; if (m > t) return;
          s += '<line x1="' + xs(m) + '" y1="' + padT + '" x2="' + xs(m) + '" y2="' + (H - padB) + '" stroke="' + C.deep + '" stroke-width="1.5"/>';
          s += '<rect x="' + (xs(m) - 5) + '" y="' + (padT - 8) + '" width="10" height="10" rx="2" fill="' + C.deep + '"/>';
        });
        /* now line */
        s += '<line x1="' + xs(t) + '" y1="' + padT + '" x2="' + xs(t) + '" y2="' + (H - padB) + '" stroke="' + C.ink + '" stroke-width="1" stroke-dasharray="2 3"/>';
        s += '</svg>';
        chart.innerHTML = s;

        stat.innerHTML = "";
        var tiles = [
          ["minute", t + " of " + E.MINUTES, "now: " + (SEG_LABEL[cur.seg] || cur.seg) + (actions[t] ? " (your cue)" : "")],
          ["in the room", cur.room.toLocaleString("en-US"), "boost x" + cur.boost + " since min 11"],
          ["GMV so far", money(gmvSoFar), (gmvSoFar - bgmvSoFar >= 0 ? "+" : "-") + money(Math.abs(gmvSoFar - bgmvSoFar)) + " vs the host's own plan"],
          ["nowcast, next 5 min", nc.orders === null ? "-" : nc.orders + " orders", t + 5 <= E.MINUTES ? "the engine will actually produce " + actualNext : "stream ends"],
          ["urgency run", cur.fomoRun + " min", cur.fomoRun >= E.TRUTH.fomoStretchFrom ? "stretched: the room holds, buying stops" : "short cues convert"]
        ];
        tiles.forEach(function (tt) {
          var d = el("div", "lb-tile"); d.appendChild(el("span", "lb-k", tt[0])); d.appendChild(el("b", null, tt[1])); d.appendChild(el("span", "lb-s", tt[2])); stat.appendChild(d);
        });
        if (t >= E.MINUTES) {
          var fin = el("div", "lb-final");
          var d = coach.summary.gmv - base.summary.gmv;
          fin.appendChild(el("b", null, "Stream over. " + money(coach.summary.gmv) + " GMV, " + (d >= 0 ? "+" : "-") + money(Math.abs(d)) + " against the host's own plan on this seed. Watch time " + coach.summary.avgWatchMin + " min, policy-risk flags " + coach.summary.riskFlags + "."));
          stat.appendChild(fin);
        }
      }
      draw();
    }

    /* ---------- LADDER ---------- */
    var lad = el("div", "lb-panel");
    if (mode !== "replay") {
      var lh = el("div", "lb-head");
      lh.appendChild(el("b", null, "Seven coaching policies, forty seeded nights each, means"));
      lh.appendChild(el("span", "lb-note", "Computed now, in this tab, by the same engine. Sorted by GMV. The two the room asks for when it gets nervous are marked."));
      lad.appendChild(lh);
      var table = el("table", "clean lb-table");
      var thead = el("thead"); var tr = el("tr");
      ["Policy", "GMV / night", "Orders", "Avg watch", "Peak room", "Risk flags", "vs own plan"].forEach(function (h) { tr.appendChild(el("th", null, h)); });
      thead.appendChild(tr); table.appendChild(thead);
      var tbody = el("tbody"); table.appendChild(tbody);
      lad.appendChild(table);
      var L = E.ladder(40);
      var none = L.filter(function (x) { return x.policy === "none"; })[0];
      L.slice().sort(function (a, b) { return b.gmv - a.gmv; }).forEach(function (x) {
        var r = el("tr");
        var isTrap = x.policy === "stretchFomo" || x.policy === "giveawayOnDrop";
        var c0 = el("td"); c0.appendChild(el("b", null, x.label)); c0.appendChild(el("span", "lb-polnote", x.note)); r.appendChild(c0);
        r.appendChild(el("td", null, money(x.gmv)));
        r.appendChild(el("td", null, String(x.orders)));
        r.appendChild(el("td", null, x.avgWatchMin + " min"));
        r.appendChild(el("td", null, String(x.peakRoom)));
        var cf = el("td", null, String(x.riskFlags)); if (x.riskFlags > 0) cf.style.color = C.flag; r.appendChild(cf);
        var d = x.gmv - none.gmv;
        var cd = el("td", null, x.policy === "none" ? "-" : (d >= 0 ? "+" : "-") + money(Math.abs(d)) + " (" + (d >= 0 ? "+" : "") + (100 * d / none.gmv).toFixed(1) + "%)");
        if (d < 0) cd.style.color = C.flag;
        r.appendChild(cd);
        if (isTrap) r.className = "lb-trap";
        tbody.appendChild(r);
      });
      lad.appendChild(el("p", "lb-note", "Watch the two marked rows. Stretching the urgency raises the number a nervous host is staring at (viewers, watch time) and buys almost nothing in GMV while adding about three policy-risk flags a night. A mid-stream giveaway fills the room and empties the till."));
    }

    wrap.appendChild(replay);
    wrap.appendChild(lad);
    host.appendChild(wrap);

    /* expose for the headless bench runner */
    host.__bench = { ladder: function () { return E.ladder(40); }, baseline: baseline, actions: actions };
  }

  document.querySelectorAll("[data-live-bench]").forEach(mount);
})();
