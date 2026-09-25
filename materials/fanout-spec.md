# Fan-out spec - shared context for every page agent

Read this whole file, then the template page named in your brief, then write your pages.

## The course in one paragraph

learn-live-commerce-analytics-with-phoebe. Two tracks: Leader (a1-a6, "Leader session N of 6",
for MCN and brand leads who run hosts, no code) and Builder (b1-b8, "Builder session N of 8", for
data scientists, Python). Running case: **Lumen Glow**, a fictional skincare brand, one hero SKU
(Dew Serum 30ml, 29 dollars, 49 dollar two-pack bundle taken by 22 percent of orders), sold on
TikTok Shop LIVE across **60 streams** of 120 minutes. Hosts: humans Maya, Jules, Ren, Priya; AI
avatars Nova, Kai. The data is a **minute table**: 7,200 rows, 26 columns, one row per stream and
minute, produced by a seeded generator (`assets/live-engine.js`) whose causal structure is
**planted on purpose** so the analysis methods can be checked against a known truth. The landing
page says this openly. Pages may say "the generator plants X" only where the lesson is the method
recovering it; otherwise state findings as findings from the Lumen Glow data.

## Template pages (copy structure, classes, SVG style, quiz markup EXACTLY)

- Leader template: `courses/a1-read-the-room.html`
- Builder template: `courses/b1-stream-as-data.html`
- Landing page (for the card text and session titles you must match): `index.html`
- Facts and sources: `materials/official-course-map.md` (read it; every version, policy quote and
  canon number you use must come from it or from `materials/analysis/canon.json` /
  `data/canon.json`). Full fetch notes: `materials/sources/*.md`.

## Palette (the ONLY hexes allowed in your SVGs, plus white and the universal reds)

deep `#075E70` · primary `#0B7F94` · mid `#22C3DD` · soft `#A5EAF4` · tint `#EEFCFE` ·
ink `#0B1A20` · muted `#4F6B73` · faint `#BFD8DE` (arrows, arrowheads, hairlines) ·
hairline `#DCEBEF` · flag `#C8173F` (note squares, the one warm accent, the "trap" colour) ·
flag-ink `#4A0416` · flag-tint `#FFF0F4` · code-bg `#062B33`. Universal reds allowed:
`#991B1B`, `#FCA5A5`, `#FEF2F2`. White `#fff`. Nothing else. Text on `#22C3DD` is ink, not white.
Text on `#075E70`, `#0B7F94`, `#C8173F` is white.

## Session filenames and footer chain (exact)

Leader: a1-read-the-room.html · a2-what-top-streams-share.html · a3-design-the-say.html ·
a4-design-the-show.html · a5-coach-live.html · a6-prove-it-worked.html
Builder: b1-stream-as-data.html · b2-ingest-and-align.html · b3-see-it.html · b4-hear-it.html ·
b5-score-content.html · b6-traits-to-playbook.html · b7-live-nowcast.html · b8-intervene.html
Footer prev/next link text: "← Leader session N · Short title" / "Leader session N · Short title →"
(same for Builder). a6 and b8 next-link goes to `../index.html` "All sessions →". a1/b1 prev is
"← All sessions" (already written).

## Canon numbers (use these exactly; do not invent others)

Stream means (60 streams): views 9,049 · peak room 871 · avg watch 9.0 min · impressions 60,000 ·
clicks 3,997 · CTR 6.6% · orders 484 · CTOR 12.1% · GMV $16,139 · GPM $1,750 · comments 1,652 ·
likes 7,855 · host replies 65.
Correlations across streams: GMV vs peak room 0.96; GPM vs CTOR 0.86.
Top 10 by GMV: 9 opened with a giveaway (base 32 of 60); all 10 human hosts.
Giveaway vs not: GMV 16,904 vs 15,265; views 10,364 vs 7,546; boost x1.93 vs x1.25; CTOR 11.16 vs
13.10; GPM 1,547 vs 1,983; watch 8.67 vs 9.38 min.
Pooled OLS (GMV on giveaway, controlling host type and hour): +5,576 dollars, p below 1e-7.
Within-stream (minutes demeaned by stream, clustered SE), CTOR in points: CTA +6.50, price +3.78,
short urgency (run 1-2) +4.93, stretched urgency (run 3+) -1.84, Q&A +0.96, hook -3.18, filler -2.64,
dead air -4.72, giveaway minute -2.31; product in hand +0.04 (p .81), close-up +0.46 (p .65), price
overlay -0.13 (p .58).
Within-stream, CTR in points: product in hand +1.38, close-up ratio +1.01, price overlay +0.97, CTA
+3.28, demo +2.54, price +1.55, Q&A -0.97, giveaway minute -0.05 (p .71).
Orders per 1,000 viewer-minutes by segment: CTA 11.57 · price 7.69 · demo 7.72 · urgency 5.83 ·
build 4.51 · Q&A 3.68 · hook 1.98 · filler 1.40 · dead 0.71 · mean 5.80. Minutes share: demo 20.9%,
build 19.0%, urgency 16.4%, hook 12.8%, CTA 9.9%, Q&A 9.1%, price 6.6%, filler 4.6%, dead 0.8%.
Urgency CTOR by consecutive minute: 15.12, 15.44, 8.30, 8.33, 8.43, 9.09 (runs 1-6).
LightGBM per-minute orders, 12 held-out streams: MAE 1.43 vs mean baseline 2.56. SHAP order:
impressions, is_cta, close_up_ratio, product_in_hand, room, fomo_run, is_hook, price_overlay,
is_price, is_ai.
Human vs AI hosts: GMV 19,850 vs 8,132; GPM 1,981 vs 1,252; CTOR 12.53 vs 11.07; watch 9.80 vs 7.28
min; replies 95.6 vs 0 per stream; evening share 95% vs 26%. Same hours only (17:00 and 22:00): GPM
1,910 vs 1,258, watch 9.91 vs 7.29. Room by script cycle human/AI: 419/216, 856/442, 961/484,
961/468, 935/441, 880/413, 847/383, 790/366 (cycles 1-8).
Nowcast backtest (6,720 five-minute windows): alpha 0.1 MAE 9.41; 0.3 -> 10.84; 0.6 -> 11.28;
naive "next five = last five" 11.97.
Bench ladder, tonight's stream (Jules, Friday 20:00), means of 40 seeded nights: host's own plan
$18,198 (544 orders, watch 9.63, 0 flags) · CTA on a dip $20,847 (+14.6%) · product in hand on
every CTA $19,960 (+9.7%) · answer the room every 10 min $19,006 (+4.4%, watch 9.87) · stretch the
urgency when viewers drop $18,290 (+0.5%, watch 9.84, 3.18 policy-risk flags) · giveaway when
viewers drop $16,165 (-11.2%, views up to 8,732 from 8,519) · the playbook (all three good cues)
$23,166 (+27.3%, watch 9.90, peak 885).
Two real streams for examples: Maya stream 17 (Wed 21:00, giveaway) 16,404 views, peak 1,579, watch
9.48, CTR 6.86, CTOR 11.58, GPM 1,817, GMV $29,799. Priya stream 16 (Mon 18:00, no giveaway) 4,858
views, peak 498, watch 9.82, CTR 6.90, CTOR 14.01, GPM 2,309, GMV $11,217.

## TikTok Shop facts (verbatim-safe, from the fetched pages dated 2026-09-24)

Metric names: Views, Viewers (unique), Peak Concurrent Viewers, Average Concurrent Viewers,
Average Watch Duration, Product Impressions, Product Clicks, CTR, CTOR (click-to-order rate),
GMV, Watch GPM (GMV per thousand views), Items Sold, New Followers, Comments, Likes, Shares,
traffic sources Feed / Promoted / Follow, GMV per hour, Impressions per hour. Diagnosis funnel:
tap-through rate -> avg viewing duration per view -> CTR -> CTOR. Labels: Risk / Need attention /
Can improve / Normal.
Playbook pages: 10+ products in the bag ("LIVEs with 10+ items see 2x higher shopping bag clicks");
do not switch pins faster than every 10-15 minutes in a 2 h LIVE; FABES = Features, Advantages,
Benefits, Evidence, Scarcity; tools: LIVE Flash Sale (countdown), LIVE Coupon, Creator LIVE
Giveaway, Creator Exclusive Price; LIVE events 30 min to 13 h, max 100 products.
Policy: Content Policy (eff. 2026-09-17) bans "exaggerated promises about a product's performance,
effect, or price" and "false, misleading, unavailable, or expired prices or discounts". Fair
Pricing Policy (eff. 2026-09-01): reference prices must "reflect a genuine and established selling
price"; no "Artificially inflating the original price". Misleading Content guide flags "While
stocks last", "This sale is for selected customers only", "Don't miss these big discounts", "We
are having our largest sale!" and bans "100% effective", "Guaranteed results", "Works for
everyone", "Permanent effect", "Instant results", "No side effects". Misleading Discount guide
(eff. 2026-08-31): "sale ends today" / "only 2 hours left" must be genuine. UK Content Policy (eff.
2026-01-09) prohibits claiming the seller "will soon stop selling the product(s), when that is not
the case". AI-Generated Content Restrictions (US, eff. 2026-09-02): disclose synthetic faces,
voices, digital humans; "Do not use AI to make a product look more powerful or effective than it
really is". **Requirements for High-Quality Videos and LIVEs (US, eff. 2026-09-17): "Interact with
viewers through real-time verbal or sign language communication." "Do not use non-real-time
verbal interaction such as AI-generated voices, audio recordings, or radio." "Do not use animated
figures or content that covers more than 50% of the screen."** Consequence: a fully AI-voiced
avatar host is not permitted on a TikTok Shop promotional LIVE. The dataset's AI-host streams
show what the trade would be on a platform that allows it; on TikTok Shop they are a compliance
stop first.
Regulation: UK DMCC Act 2024 Sch. 20 para 7 (in force 6 April 2025): "Falsely stating that a
product will only be available for a limited time ... in order to elicit an immediate decision".
EU UCPD Annex I item 7: same with "very limited time". FTC: no fake-urgency rule; s.5 enforcement
guided by "Bringing Dark Patterns to Light" (2022): False Low Stock Message, Baseless Countdown
Timer, False Limited Time Message, False Discount Claims. EU AI Act Article 50 applies from 2
August 2026. CMA207 guidance (18 Nov 2025) countdown-clock example.

## Tool facts (versions read 2026-09-24)

FFmpeg 9.0.2 (segment muxer `-f segment -segment_time 60 -reset_timestamps 1`, `-vf fps=1`,
`-vn -ac 1 -ar 16000 -c:a pcm_s16le`). PySceneDetect 0.7.1 (BSD-3), `AdaptiveDetector`.
ultralytics 8.4.161, YOLO26 flagship, AGPL-3.0 or paid Enterprise (Enterprise needed for
commercial products, closed-source internal tools, SaaS with a YOLO backend); YOLOE open-vocab.
mediapipe 1.0.1 (Apache-2.0): ObjectDetector, HandLandmarker (21 points), PoseLandmarker (33).
supervision 0.30.5 (MIT): PolygonZone, LineZone; `sv.ByteTrack` deprecated 0.28, removed 0.31;
use `trackers` 2.6.0 `ByteTrackTracker`. OWLv2 (Apache-2.0), Grounding DINO 1.0 (Apache-2.0),
Florence-2 (MIT, has OCR and OCR_WITH_REGION tasks). openai-whisper 20250625, faster-whisper
1.2.1 (`word_timestamps=True`), whisperx 3.8.6 (wav2vec2 forced alignment). Deepgram nova-3
$0.0043/min (~$0.26/hr, words in seconds); AssemblyAI Universal-3.5 Pro $0.21/hr (words in
milliseconds). Gemini 3.8 Flash via `client.interactions.create`, ~100 video tokens/s low-res,
$0.75/1M input tokens through 2026-12-31 (~$0.006 per minute of video); Qwen3-VL (Apache-2.0);
Twelve Labs Marengo 3.0 / Pegasus 1.5. LightGBM 4.7.0, SHAP 0.52.0 (Python 3.12+), statsmodels
0.15.0, linearmodels 7.0 PanelOLS (`entity_effects=True`, `fit(cov_type="clustered",
cluster_entity=True)`), DoWhy 0.14, EconML 0.17.0. statsforecast 2.1.1 (AutoETS, AutoTheta,
MSTL; no release since 2024-09), statsmodels UnobservedComponents local level. MABWiser 2.7.4,
vowpalwabbit 9.11.6. Bojinov, Simchi-Levi, Zhao (2023) "Design and Analysis of Switchback
Experiments", Management Science 69(7).

## The bench widget (b8 and a5 only)

Include before app.js: `<script src="../assets/live-engine.js?v=1"></script>` then
`<script src="../assets/live-bench.js?v=1"></script>`, and place `<div data-live-bench></div>`
(b8: full; a5: `<div data-live-bench data-mode="both"></div>` too) inside the build-along section.
The widget renders itself. Pages quote the ladder numbers above as its canon and say they are
means over 40 seeded nights computed live in the browser.

=== HARD RULES (violations = rework) ===
- NEVER em dash or en dash anywhere. Hyphen only. Site-owner hard rule.
- NEVER the words "lottery" or "lotteries".
- No meta or course-instruction text: never "this course's rule", "banned in this course", "we
  teach X as a concept". State the professional norm directly with its real-world reason.
  Track-overview intros (Part 0) and prev/next navigation are fine.
- Attribution is "by Phoebe Fu" only.
- Head: `<link rel="stylesheet" href="../assets/style.css?v=1">`; before `</body>`:
  `<script src="../assets/app.js?v=1"></script>`. Nothing else external.
- Copy the social meta block shape from the template (description, og:*, twitter:*), with this
  page's own title and description, URL `https://phoebefu6.github.io/learn-live-commerce-analytics-with-phoebe/courses/<file>`.
- Copy template component classes exactly: toolbar, masthead (chip-row, agenda a1-a4 with the
  0-3 / 3-20 / 20-40 / 40-45 split), section-kicker (klabel + h2 + tag), details.card summary
  (mode live|self, mini, caret ▶), prompt-box good|bad with label (escape & to &amp;, < to &lt;),
  callout tip|win|example (ex-pill "Real world"), table.clean, steps/step, quiz markup exactly
  (.quiz-q data-answer 0-based, 3 .qopt "A · ...", .qwhy, one .quiz-score), covered-row/pill
  solid|light|inkpill, section.cheat#cheatsheet with .grid-2 of .cheat-item (b + span), pagefoot.
- Exactly ONE `.callout.win` per page (in Part 0). First card `open` in Part 0 only.
- 2-3 SVG diagrams per page, viewBox width 880 exactly, height as needed, palette above ONLY,
  UNIQUE class prefix per SVG (e.g. `.a3aX`, `.a3bX`) and unique marker ids. figure.zoomable +
  figcaption "🔍 Click to zoom - ...". role="img" aria-label describing the data. Text MUST fit its
  box: ~7px per character at 12px, so a 150px box holds ~20 chars, 190px ~26, 240px ~33, a
  full-width note under ~110 chars. Bottom note line (14x14 `#C8173F` square + 11px bold) sits
  22px below the last content row and the viewBox height clears it by 8px. Shorten labels rather
  than widen boxes. Never below 10px font.
- Sentence case headings. Warm practitioner tone, concrete, fun not dry. ~420-520 lines per file
  as depth guidance, never by collapsing whitespace or dissolving lists into paragraphs.
- Titles: "Leader session N · <name> - learn live commerce analytics with phoebe" (or Builder).
- Every number you quote comes from the canon above or the course map. If you need a number that
  is not there, do not invent it: write the sentence without it.
- Builder pages: code in prompt-box good, Python, pandas-first, versions as listed. Leader pages:
  no code.

Return only: file paths + one-line coverage each. No HTML in the reply.
