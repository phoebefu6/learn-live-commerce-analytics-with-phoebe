/* live-engine.js - the LIVE room engine for learn-live-commerce-analytics-with-phoebe.

   One module, two homes. Node runs it once to write data/streams.json and data/streams.csv
   (the history every builder session analyses in Python). The browser runs the same code
   for the replay bench, so a number on a page and a number in the bench come from one
   generator with one seed.

   What is real: every stream is produced minute by minute by the same arithmetic - viewers
   arrive, viewers leave, the pinned product is shown, a share of viewers click, a share of
   clickers order. Every count is a draw from that arithmetic with a fixed seed.

   What is PLANTED, and said so on the landing page: the causal structure. Which segment
   types raise the click rate, which raise the order rate, how a giveaway inflates early
   engagement and buys platform traffic while lowering conversion, how a stretched urgency
   pitch holds viewers and loses orders, and how an AI host loses viewers a little faster
   each time the script repeats. Nothing here is a claim about TikTok's real ranking
   algorithm. The point of planting the structure is that the analysis methods taught in the
   builder track can be checked against a truth that is known.

   Exposes window.LIVE_ENGINE in the browser and module.exports in Node. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) { module.exports = factory(); }
  else { root.LIVE_ENGINE = factory(); }
}(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* ============================================================
     0. deterministic randomness
     ============================================================ */

  /* mulberry32 - small, deterministic, identical in Node and every browser */
  function rng(seed) {
    seed = seed | 0;
    return function () {
      seed = (seed + 0x6D2B79F5) | 0;
      var t = seed;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function poisson(r, lambda) {
    if (lambda <= 0) return 0;
    if (lambda > 60) { /* normal approximation keeps big rooms fast */
      var u = r(), v = r();
      var z = Math.sqrt(-2 * Math.log(u || 1e-12)) * Math.cos(2 * Math.PI * v);
      return Math.max(0, Math.round(lambda + z * Math.sqrt(lambda)));
    }
    var L = Math.exp(-lambda), k = 0, p = 1;
    do { k++; p *= r(); } while (p > L);
    return k - 1;
  }
  function binomial(r, n, p) {
    if (n <= 0 || p <= 0) return 0;
    if (p >= 1) return n;
    if (n > 80) {
      var mu = n * p, sd = Math.sqrt(n * p * (1 - p));
      var u = r(), v = r();
      var z = Math.sqrt(-2 * Math.log(u || 1e-12)) * Math.cos(2 * Math.PI * v);
      return Math.min(n, Math.max(0, Math.round(mu + z * sd)));
    }
    var k = 0;
    for (var i = 0; i < n; i++) if (r() < p) k++;
    return k;
  }
  function pick(r, arr) { return arr[Math.floor(r() * arr.length)]; }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function round2(x) { return Math.round(x * 100) / 100; }

  /* ============================================================
     1. the world - Lumen Glow, one hero SKU, six hosts
     ============================================================ */

  var BRAND = "Lumen Glow";
  var SKU = { name: "Dew Serum 30ml", price: 29, bundlePrice: 49, bundleShare: 0.22 };
  var MINUTES = 120;

  /* Segment types, as the speech tagger in b4 would label a minute of talk. */
  var SEGMENTS = ["hook", "build", "demo", "price", "cta", "fomo", "qna", "filler", "dead"];

  /* Hosts. Style numbers are the truth the b6 analysis is trying to recover.
     fomoRun: how many consecutive minutes this host tends to hold an urgency pitch.
     qnaShare: how much of the cycle they spend answering the room.
     pace: multiplier on segment lengths (below 1 = faster switching). */
  var HOSTS = [
    { name: "Maya",  type: "human", fomoRun: 1, qnaShare: 1.2, demoLove: 1.2, pace: 1.0, baseDraw: 1.15 },
    { name: "Jules", type: "human", fomoRun: 2, qnaShare: 1.0, demoLove: 1.0, pace: 0.9, baseDraw: 1.0 },
    { name: "Ren",   type: "human", fomoRun: 5, qnaShare: 0.6, demoLove: 0.8, pace: 1.1, baseDraw: 1.1 },
    { name: "Priya", type: "human", fomoRun: 2, qnaShare: 1.4, demoLove: 1.3, pace: 1.0, baseDraw: 0.9 },
    { name: "Nova",  type: "ai",    fomoRun: 2, qnaShare: 0.0, demoLove: 1.0, pace: 1.0, baseDraw: 0.85 },
    { name: "Kai",   type: "ai",    fomoRun: 2, qnaShare: 0.0, demoLove: 1.0, pace: 1.0, baseDraw: 0.85 }
  ];

  /* ============================================================
     2. the planted causal structure
     ============================================================ */

  var TRUTH = {
    /* per-minute base rates before any multiplier */
    arrivalsPerMin: 45,          /* new viewers entering, before hour and host factors */
    leaveHazard: 0.11,           /* share of the room that leaves in a normal minute */
    pinRate: 0.72,               /* share of the room that sees the pinned product card */
    ctr: 0.045,                  /* product card click rate, baseline */
    cvr: 0.115,                  /* click-to-order rate, baseline */
    commentRate: 0.018, likeRate: 0.09,

    /* hour of day: TikTok Shop LIVE rooms are evening rooms */
    hourFactor: { 12: 0.85, 13: 0.85, 14: 0.9, 15: 0.9, 16: 0.95, 17: 1.0, 18: 1.15, 19: 1.35, 20: 1.45, 21: 1.4, 22: 1.2, 23: 1.0 },

    /* how each segment moves each rate. 1.0 = no effect. */
    seg: {
      hook:   { leave: 0.9,  ctr: 0.8,  cvr: 0.75, comment: 1.0 },
      build:  { leave: 1.0,  ctr: 1.1,  cvr: 1.0,  comment: 0.9 },
      demo:   { leave: 0.8,  ctr: 1.5,  cvr: 1.1,  comment: 1.0 },
      price:  { leave: 0.9,  ctr: 1.4,  cvr: 1.3,  comment: 1.0 },
      cta:    { leave: 1.0,  ctr: 1.7,  cvr: 1.6,  comment: 0.9 },
      fomo:   { leave: 0.75, ctr: 1.3,  cvr: 1.45, comment: 1.1 },   /* a real, short urgency cue */
      qna:    { leave: 0.65, ctr: 0.9,  cvr: 1.15, comment: 2.0 },
      filler: { leave: 1.4,  ctr: 0.6,  cvr: 0.7,  comment: 0.6 },
      dead:   { leave: 1.8,  ctr: 0.4,  cvr: 0.6,  comment: 0.4 }
    },
    /* what the camera shows, on top of what is said */
    productInHandCtr: 0.25,      /* +25% click rate when the product is in frame in hand */
    closeUpCtr: 0.20,            /* +20% when the shot is a close-up */
    priceOverlayCtr: 0.15,       /* +15% when the price is on screen (OCR sees this) */

    /* the stretched-urgency trap: from the 3rd consecutive fomo minute on, the room holds but
       stops buying, and the distrust lingers for three minutes after */
    fomoStretchFrom: 3, fomoStretchCvr: 0.55, fomoHangoverMin: 3, fomoHangoverCvr: 0.8,
    fomoFlagFrom: 4,             /* 4+ consecutive urgency minutes counts as a policy-risk flag */

    /* the giveaway confound: a free-gift raffle in the opening minutes */
    giveawayMinutes: 6,
    giveawayArrivals: 1.35, giveawayEngage: 2.6,       /* likes and comments explode */
    giveawayCvrDuring: 0.45, giveawayCvrAfter: 0.88,   /* freebie audience buys less, all night */

    /* the platform boost: after minute 10 the platform pushes rooms whose first ten minutes
       looked engaged. Engagement per viewer is what it reads, which a giveaway inflates. */
    boostReadMinutes: 10, boostFloor: 0.7, boostCeil: 2.2, boostIntercept: 0.4, boostSlope: 1.9,

    /* the AI host: cheaper, tireless, no live replies, and the script repeats */
    aiCtr: 0.95, aiCvr: 0.92, aiLeave: 1.12, aiRepeatLeave: 0.03,   /* +3% hazard per repeated cycle */

    /* replies: a human in a qna minute answers up to this many comments; an AI answers none live */
    repliesPerQnaMin: 6
  };

  /* ============================================================
     3. a host's script - the segment plan for one stream
     ============================================================ */

  /* One cycle of a selling script. Lengths in minutes before the host's pace multiplier. */
  function planSegments(r, host, opts) {
    var plan = [];
    var cycle = 0;
    var giveaway = opts.giveawayOpen ? TRUTH.giveawayMinutes : 0;
    while (plan.length < MINUTES) {
      cycle++;
      var blocks = [
        ["hook", 1 + Math.round(r() * 1)],
        ["build", 2 + Math.round(r() * 2)],
        ["demo", Math.max(1, Math.round((2 + r() * 2) * host.demoLove))],
        ["price", 1],
        ["cta", 1 + Math.round(r() * 1)],
        ["fomo", Math.max(1, Math.round(host.fomoRun + (r() - 0.5) * 1.2))],
        ["qna", Math.round((1 + r() * 2) * host.qnaShare)],
        ["filler", r() < 0.35 ? 1 : 0],
        ["dead", r() < 0.12 ? 1 : 0]
      ];
      /* an AI host never runs a live qna; the minute becomes scripted filler */
      if (host.type === "ai") {
        blocks = blocks.map(function (b) { return b[0] === "qna" ? ["filler", 1] : b; });
      }
      blocks.forEach(function (b) {
        var n = Math.max(0, Math.round(b[1] * host.pace));
        for (var i = 0; i < n && plan.length < MINUTES; i++) {
          plan.push({ seg: b[0], cycle: cycle });
        }
      });
    }
    plan = plan.slice(0, MINUTES);
    /* the giveaway opener replaces the first minutes with a hype hook */
    for (var g = 0; g < giveaway; g++) plan[g] = { seg: "hook", cycle: 1, giveaway: true };
    return plan;
  }

  /* what the camera would show for a minute of this segment */
  function frameFeatures(r, seg, host) {
    var inHand = seg === "demo" ? (r() < 0.9 ? 1 : 0)
               : seg === "build" ? (r() < 0.6 ? 1 : 0)
               : seg === "cta" || seg === "price" ? (r() < 0.5 ? 1 : 0)
               : (r() < 0.15 ? 1 : 0);
    var closeUp = seg === "demo" ? round2(0.45 + r() * 0.4)
                : seg === "build" ? round2(0.15 + r() * 0.25)
                : round2(r() * 0.15);
    var priceOverlay = (seg === "price" || seg === "cta") ? (r() < 0.75 ? 1 : 0) : (r() < 0.1 ? 1 : 0);
    var cuts = host.type === "ai" ? 1 + Math.round(r() * 2) : 2 + Math.round(r() * 5);
    var wpm = host.type === "ai" ? 158 + Math.round((r() - 0.5) * 6)
            : (seg === "dead" ? 20 : 120 + Math.round(r() * 70));
    return { inHand: inHand, closeUp: closeUp, priceOverlay: priceOverlay, cuts: cuts, wpm: wpm };
  }

  /* ============================================================
     4. run one stream minute by minute
     ============================================================ */

  /* params: { id, host, hour, weekday, giveawayOpen, seed }
     policy (optional): function(t, state, minutePlan) -> overrides for the bench.
       may return { seg, inHand, closeUp, replies } to change what the host does at minute t. */
  function simulate(params, policy) {
    var r = rng(params.seed);
    var host = params.host;
    var plan = planSegments(r, host, params);
    var hourF = TRUTH.hourFactor[params.hour] || 1.0;
    var weekdayF = (params.weekday === 5 || params.weekday === 6) ? 1.12 : 1.0;   /* Fri/Sat */
    var streamDraw = 0.8 + r() * 0.4;     /* the night's own luck, unknowable in advance */

    var rows = [];
    var room = 0, boost = 1.0, fomoRun = 0, hangover = 0, flags = 0, giveawayEver = !!params.giveawayOpen;
    var earlyViews = 0, earlyEngage = 0;
    var totals = { views: 0, impressions: 0, clicks: 0, orders: 0, gmv: 0, comments: 0, likes: 0, replies: 0, viewerMinutes: 0 };

    for (var t = 1; t <= MINUTES; t++) {
      var m = plan[t - 1];
      var seg = m.seg;
      var f = frameFeatures(r, seg, host);
      var replies = 0;
      var ov = policy ? (policy(t, { room: room, rows: rows, boost: boost, fomoRun: fomoRun }, m) || null) : null;
      if (ov) {
        if (ov.seg) seg = ov.seg;
        if (ov.inHand !== undefined) f.inHand = ov.inHand;
        if (ov.closeUp !== undefined) f.closeUp = ov.closeUp;
        if (ov.priceOverlay !== undefined) f.priceOverlay = ov.priceOverlay;
        if (ov.giveaway) giveawayEver = true;
      }
      var S = TRUTH.seg[seg];
      var giveawayLive = !!m.giveaway || (ov && ov.giveaway);
      var giveawayStream = giveawayEver;

      /* urgency run bookkeeping */
      if (seg === "fomo") fomoRun++; else { if (fomoRun >= TRUTH.fomoStretchFrom) hangover = TRUTH.fomoHangoverMin; fomoRun = 0; }
      var stretched = seg === "fomo" && fomoRun >= TRUTH.fomoStretchFrom;
      if (seg === "fomo" && fomoRun === TRUTH.fomoFlagFrom) flags++;

      /* platform boost is read once, after the first ten minutes */
      if (t === TRUTH.boostReadMinutes + 1) {
        var eng = earlyViews ? earlyEngage / earlyViews : 0;
        boost = clamp(TRUTH.boostIntercept + TRUTH.boostSlope * eng, TRUTH.boostFloor, TRUTH.boostCeil);
      }

      /* arrivals */
      var lam = TRUTH.arrivalsPerMin * hourF * weekdayF * host.baseDraw * streamDraw * boost * (1 - 0.25 * (t / MINUTES));
      if (giveawayLive) lam *= TRUTH.giveawayArrivals;
      var arrivals = poisson(r, lam);

      /* departures */
      var h = TRUTH.leaveHazard * S.leave;
      if (host.type === "ai") h *= TRUTH.aiLeave * (1 + TRUTH.aiRepeatLeave * (m.cycle - 1));
      var leavers = binomial(r, room, clamp(h, 0.02, 0.6));
      room = Math.max(0, room + arrivals - leavers);

      /* the product card */
      var impressions = binomial(r, room, TRUTH.pinRate);
      var ctr = TRUTH.ctr * S.ctr * (1 + TRUTH.productInHandCtr * f.inHand) * (1 + TRUTH.closeUpCtr * f.closeUp) * (1 + TRUTH.priceOverlayCtr * f.priceOverlay);
      if (host.type === "ai") ctr *= TRUTH.aiCtr;
      var clicks = binomial(r, impressions, clamp(ctr, 0, 0.6));

      var cvr = TRUTH.cvr * S.cvr;
      if (stretched) cvr *= TRUTH.fomoStretchCvr;
      if (hangover > 0 && seg !== "fomo") { cvr *= TRUTH.fomoHangoverCvr; hangover--; }
      if (giveawayLive) cvr *= TRUTH.giveawayCvrDuring; else if (giveawayStream) cvr *= TRUTH.giveawayCvrAfter;
      if (host.type === "ai") cvr *= TRUTH.aiCvr;
      var orders = binomial(r, clicks, clamp(cvr, 0, 0.9));
      var bundles = binomial(r, orders, SKU.bundleShare);
      var gmv = (orders - bundles) * SKU.price + bundles * SKU.bundlePrice;

      /* the chat */
      var engageMult = giveawayLive ? TRUTH.giveawayEngage : 1;
      var comments = poisson(r, room * TRUTH.commentRate * S.comment * engageMult);
      var likes = poisson(r, room * TRUTH.likeRate * engageMult * (seg === "qna" ? 1.3 : 1));
      if (seg === "qna" && host.type === "human") replies = Math.min(comments, TRUTH.repliesPerQnaMin);
      if (ov && ov.replies !== undefined) replies = Math.min(comments, ov.replies);

      if (t <= TRUTH.boostReadMinutes) { earlyViews += arrivals; earlyEngage += likes + comments; }

      totals.views += arrivals; totals.impressions += impressions; totals.clicks += clicks;
      totals.orders += orders; totals.gmv += gmv; totals.comments += comments; totals.likes += likes;
      totals.replies += replies; totals.viewerMinutes += room;

      rows.push({
        t: t, seg: seg, cycle: m.cycle, giveaway: giveawayLive ? 1 : 0,
        arrivals: arrivals, room: room, impressions: impressions, clicks: clicks, orders: orders, gmv: gmv,
        comments: comments, likes: likes, replies: replies,
        inHand: f.inHand, closeUp: f.closeUp, priceOverlay: f.priceOverlay, cuts: f.cuts, wpm: f.wpm,
        fomoRun: fomoRun, boost: round2(boost)
      });
    }

    var summary = {
      id: params.id, host: host.name, hostType: host.type, hour: params.hour, weekday: params.weekday,
      giveawayOpen: params.giveawayOpen ? 1 : 0, boost: round2(boost), riskFlags: flags,
      views: totals.views, peakRoom: Math.max.apply(null, rows.map(function (x) { return x.room; })),
      avgWatchMin: totals.views ? round2(totals.viewerMinutes / totals.views) : 0,
      impressions: totals.impressions, clicks: totals.clicks, orders: totals.orders, gmv: totals.gmv,
      ctr: totals.impressions ? round2(100 * totals.clicks / totals.impressions) : 0,
      cvr: totals.clicks ? round2(100 * totals.orders / totals.clicks) : 0,
      gpm: totals.views ? round2(1000 * totals.gmv / totals.views) : 0,
      comments: totals.comments, likes: totals.likes, replies: totals.replies
    };
    return { params: params, summary: summary, minutes: rows };
  }

  /* ============================================================
     5. the history - 60 past streams plus tonight's
     ============================================================ */

  var WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  function historyParams(seed, n) {
    var r = rng(seed);
    var out = [];
    /* 60 nights across 12 weeks. Humans mostly evenings, AI hosts fill the daytime slots. */
    for (var i = 1; i <= n; i++) {
      var host = pick(r, HOSTS);
      var hour = host.type === "ai" ? pick(r, [12, 13, 14, 15, 16, 17, 22, 23]) : pick(r, [17, 18, 19, 19, 20, 20, 21, 21, 22]);
      var weekday = Math.floor(r() * 7);
      var week = Math.floor((i - 1) / 5) + 1;
      out.push({
        id: i, host: host, hour: hour, weekday: weekday, weekdayName: WEEKDAYS[weekday], week: week,
        giveawayOpen: r() < 0.45, seed: 1000 + i * 7919
      });
    }
    return out;
  }

  function history(seed, n) {
    return historyParams(seed || 20260924, n || 60).map(function (p) { return simulate(p); });
  }

  /* tonight: Jules, Friday 20:00, no giveaway - the stream the bench replays */
  function tonightParams(seed) {
    return { id: 61, host: HOSTS[1], hour: 20, weekday: 4, weekdayName: "Fri", week: 13, giveawayOpen: false, seed: seed || 424242 };
  }

  /* ============================================================
     6. nowcast - the next five minutes of orders, from the room so far
     ============================================================ */

  /* An honest small model: exponentially weighted orders-per-viewer times a viewer projection
     from the recent room trend. Teaching tool, not a production forecaster (b7 says so). */
  function nowcast(rows, t, horizon) {
    horizon = horizon || 5;
    var past = rows.slice(0, t);
    if (past.length < 3) return { orders: null, room: null };
    var alpha = 0.1, rate = null, room = past[past.length - 1].room;
    past.forEach(function (x) {
      var rr = x.room ? x.orders / x.room : 0;
      rate = rate === null ? rr : alpha * rr + (1 - alpha) * rate;
    });
    var k = Math.min(5, past.length - 1);
    var slope = (past[past.length - 1].room - past[past.length - 1 - k].room) / k;
    var predOrders = 0, predRoom = room;
    for (var i = 1; i <= horizon; i++) { predRoom = Math.max(0, predRoom + slope * 0.6); predOrders += predRoom * rate; }
    return { orders: Math.round(predOrders), room: Math.round(predRoom), rate: rate };
  }

  /* ============================================================
     7. the bench - policies a coach could run on tonight's stream
     ============================================================ */

  function minutesSince(rows, segName) {
    for (var i = rows.length - 1; i >= 0; i--) if (rows[i].seg === segName) return rows.length - i;
    return 999;
  }
  function recentOrders(rows, k) {
    var s = 0; for (var i = Math.max(0, rows.length - k); i < rows.length; i++) s += rows[i].orders; return s;
  }
  /* three consecutive minutes of a shrinking room - the moment a nervous host reaches for a trick */
  function roomDropping(rows) {
    var n = rows.length;
    if (n < 4) return false;
    return rows[n - 1].room < rows[n - 2].room && rows[n - 2].room < rows[n - 3].room && rows[n - 3].room < rows[n - 4].room;
  }

  var POLICIES = {
    none: {
      label: "The host's own plan",
      note: "No coaching. Jules runs the script the way Jules always does.",
      fn: null
    },
    ctaOnDip: {
      label: "Cue a CTA when orders dip",
      note: "If the last 3 minutes ordered under 70% of the nowcast rate and the last CTA is 6+ minutes back, run a price line then a CTA.",
      fn: function (t, st, m) {
        if (t < 12) return null;
        var nc = nowcast(st.rows, t - 1, 3);
        if (nc.orders === null) return null;
        if (recentOrders(st.rows, 3) < 0.7 * nc.orders && minutesSince(st.rows, "cta") >= 6) {
          return { seg: minutesSince(st.rows, "price") >= 6 ? "price" : "cta", inHand: 1, priceOverlay: 1 };
        }
        return null;
      }
    },
    showOnCta: {
      label: "Product in hand on every CTA",
      note: "Every price and CTA minute is shot close-up with the serum in hand and the price on screen. Same words, different picture.",
      fn: function (t, st, m) {
        if (m.seg === "cta" || m.seg === "price") return { inHand: 1, closeUp: 0.8, priceOverlay: 1 };
        return null;
      }
    },
    replyEvery10: {
      label: "Answer the room every 10 minutes",
      note: "Every tenth minute becomes a live Q&A minute, reading names and answering comments.",
      fn: function (t, st, m) { return (t % 10 === 0 && m.seg !== "cta") ? { seg: "qna", replies: 6 } : null; }
    },
    stretchFomo: {
      label: "Stretch the urgency when viewers drop",
      note: "The tempting one. Whenever the room is shrinking, keep the 'last chance, almost gone' pitch running until it recovers.",
      fn: function (t, st, m) {
        if (t <= 10) return null;
        var rows = st.rows, n = rows.length, last = rows[n - 1];
        /* once started, the pitch holds while the room sits under its recent high - up to six minutes,
           which is about as long as a host can say "almost gone" before even they stop believing it */
        if (last && last.seg === "fomo" && st.fomoRun < 6) {
          var hi = 0; for (var i = Math.max(0, n - 8); i < n; i++) hi = Math.max(hi, rows[i].room);
          if (last.room < 0.97 * hi) return { seg: "fomo" };
        }
        return roomDropping(rows) ? { seg: "fomo" } : null;
      }
    },
    giveawayOnDrop: {
      label: "Announce a giveaway when viewers drop",
      note: "The other tempting one. A free-gift raffle whenever the room shrinks by 10 percent.",
      fn: function (t, st, m) { return (t > 10 && roomDropping(st.rows)) ? { seg: "hook", giveaway: true } : null; }
    },
    playbook: {
      label: "The playbook: all three good cues",
      note: "CTA on a dip, product in hand on every CTA, answer the room every ten minutes.",
      fn: function (t, st, m) {
        return POLICIES.replyEvery10.fn(t, st, m) || POLICIES.ctaOnDip.fn(t, st, m) || POLICIES.showOnCta.fn(t, st, m);
      }
    }
  };

  /* Run a policy over many seeds of tonight's stream and report means. A single run is a
     story; a mean over 40 nights with the same plan is a measurement. */
  function benchPolicy(name, nSeeds) {
    nSeeds = nSeeds || 40;
    var pol = POLICIES[name];
    var acc = { gmv: 0, orders: 0, watch: 0, peak: 0, flags: 0, views: 0, cvr: 0 };
    for (var s = 0; s < nSeeds; s++) {
      var p = tonightParams(424242 + s * 101);
      var res = simulate(p, pol.fn);
      acc.gmv += res.summary.gmv; acc.orders += res.summary.orders; acc.watch += res.summary.avgWatchMin;
      acc.peak += res.summary.peakRoom; acc.flags += res.summary.riskFlags; acc.views += res.summary.views; acc.cvr += res.summary.cvr;
    }
    return {
      policy: name, label: pol.label, note: pol.note, nights: nSeeds,
      gmv: Math.round(acc.gmv / nSeeds), orders: Math.round(acc.orders / nSeeds),
      avgWatchMin: round2(acc.watch / nSeeds), peakRoom: Math.round(acc.peak / nSeeds),
      riskFlags: round2(acc.flags / nSeeds), views: Math.round(acc.views / nSeeds), cvr: round2(acc.cvr / nSeeds)
    };
  }
  function ladder(nSeeds) {
    return Object.keys(POLICIES).map(function (k) { return benchPolicy(k, nSeeds); });
  }

  /* ============================================================
     8. CSV export for the builder track
     ============================================================ */

  var MINUTE_COLS = ["stream_id", "host", "host_type", "hour", "weekday", "giveaway_open", "t", "segment", "cycle", "giveaway_live",
    "arrivals", "room", "impressions", "clicks", "orders", "gmv", "comments", "likes", "replies",
    "product_in_hand", "close_up_ratio", "price_overlay", "scene_cuts", "wpm", "fomo_run", "boost"];

  function toCsv(streams) {
    var lines = [MINUTE_COLS.join(",")];
    streams.forEach(function (s) {
      var p = s.params;
      s.minutes.forEach(function (x) {
        lines.push([p.id, p.host.name, p.host.type, p.hour, p.weekdayName, p.giveawayOpen ? 1 : 0, x.t, x.seg, x.cycle, x.giveaway,
          x.arrivals, x.room, x.impressions, x.clicks, x.orders, x.gmv, x.comments, x.likes, x.replies,
          x.inHand, x.closeUp, x.priceOverlay, x.cuts, x.wpm, x.fomoRun, x.boost].join(","));
      });
    });
    return lines.join("\n") + "\n";
  }

  return {
    BRAND: BRAND, SKU: SKU, MINUTES: MINUTES, SEGMENTS: SEGMENTS, HOSTS: HOSTS, TRUTH: TRUTH,
    rng: rng, simulate: simulate, history: history, historyParams: historyParams, tonightParams: tonightParams,
    nowcast: nowcast, POLICIES: POLICIES, benchPolicy: benchPolicy, ladder: ladder, toCsv: toCsv, MINUTE_COLS: MINUTE_COLS
  };
}));
