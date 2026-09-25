# Primary sources - LIVE Commerce Video Analytics (TikTok Shop LIVE)

Researched 2026-09-24. Method: WebFetch (200 unless stated), curl, Claude Browser pane for bot-walled sites,
pypdf for two PDFs, Crossref/DOAJ APIs for paywalled papers. Quotes are verbatim from the fetched page
unless marked "paraphrase". Anything not read directly is marked UNVERIFIED.

Legend: READ = full page/PDF read. ABSTRACT = only abstract read. UNVERIFIED = could not read; do not cite.

---

## 1. TikTok Shop Academy - LIVE analytics metrics and playbook

### 1.1 "Key Metrics to Observe & How to Access Data" (US Academy) - READ
URL: https://seller-us.tiktok.com/university/essay?knowledge_id=8418309721360171&lang=en - HTTP 200

Metric groups and definitions as printed:
- Content metrics: Likes, Comments, Shares ("High interaction levels show that your content resonates with viewers"); Total Views; Average Watch Duration
- **Unique Viewers**: "total number of individual people who watched your stream, counted only once"
- **Peak Concurrent Viewers**: "highest number of viewers at one time"
- **Average Concurrent Viewers**: "average number of people watching your TikTok livestream at the same time"
- Negative responses / feedback (dislikes, complaints)
- Conversion metrics: **Click-Through Rate (CTR)** (interest in showcased products); **Click to Order Rate (CTOR)**: "percentage of viewers who proceed to purchase after clicking"; **GMV** (total sales during stream); **Watch GPM**: "total sales (GMV) generated for every thousand views"; **Items Sold**
- Compliance metrics: Content Violations ("Violations can negatively impact your traffic and reputation")
- Access: post-LIVE summary in TikTok Studio; historical: TikTok Studio > TikTok Shop for Creator > Performance data; LIVE Analytics overview covers last 28 days; Account Health for violations.

### 1.2 "LIVE Manager Analytics" (US Academy) - READ
URL: https://seller-us.tiktok.com/university/essay?knowledge_id=7633608400013099 - HTTP 200

Four metric categories as named on the page:
- **Sales**: GMV, Direct GMV
- **Traffic**: Views, Viewers, Entry Rate, Traffic Sources (Feed / Promoted / Follow)
- **Engagement**: Comments, Likes, Shares, New Followers, Watch Time
- **Products**: Product Impressions, Product Clicks, CTR (Click-Through Rate), CTOR (Click-To-Order Rate), Sold Quantity
- During LIVE: "computer monitor icon" top-right of LIVE Manager. After LIVE: "Analytics > LIVE Analytics > All LIVE videos". Custom date range.
- NOTE: the page names the metrics but does not print formulas; the LIVE Performance page (1.4) says definitions live in hover tooltips ("?" icon) inside Seller Center, which cannot be fetched headless.

### 1.3 "LIVE Diagnosis" (US Academy) - READ
URL: https://seller-us.tiktok.com/university/essay?knowledge_id=7464845486606122&lang=en - HTTP 200

Funnel order the tool prescribes (verbatim stage names):
1. Entry performance - **Tap-through rate**
2. Stay performance - **Avg. viewing duration per view**
3. Product clicks - **CTR (Click-through rate)**
4. Product conversion - **CTOR (Click-to-order rate)**
Also: GMV, Impressions.
Status labels: **Risk** = "LIVE session has violation information"; **Need attention** = "Core metrics lower vs. your past performance"; **Can improve** = "Core metrics lower vs. same-category Benchmark" (review "Benchmark missing factors", use Best practice clips); **Normal** = "No obvious anomaly signals".

### 1.4 "LIVE Performance" (US Academy) - READ
URL: https://seller-us.tiktok.com/university/essay?knowledge_id=6394088836597518&lang=en - HTTP 200
- Metrics referenced: GMV, CTR, Impressions, Views, **GMV per hour**, **Impressions per hour**.
- "Each metric is accompanied by a question mark icon. Hover over the icon to view the metric's detailed definition and calculation method."
- Time filters: default "Last 7 Days"; Today / Last 7 Days / Last 30 Days / Custom; "the system defaults to comparing data with the previous period of equal length".
- "Diagnosis and most Traffic analysis remain limited to Official Accounts"; "The supported metrics may differ between real-time and non-real-time data".

### 1.5 "Optimizing LIVE Performance: A guide to tracking and diagnosing your LIVEs" - READ
URL: https://seller-us.tiktok.com/university/essay?knowledge_id=7629311633164078&lang=en - HTTP 200
- Reach: "LIVE Impressions, Views, Average Viewing Duration, Enter Room Rate (ERR)"
- Engagement: "New Followers, Likes, Shares, and Comments"
- Conversion: "GMV, SKU Orders, Average Price, Click-Through Rate (CTR), and Click-to-Order Rate (C_O)"
- Five diagnosis dimensions: Diligence (session frequency/timing), Traffic, Product, Content, Promotion.
- Product categorisation: "High Engagement & High GMV Products" open the session; "High Engagement but Low GMV" need better talking points/incentives; "Low Engagement & Low GMV" deprioritise.
- Promotion timing: activate offers when engagement drops or in high-impression / low-conversion periods; pre-schedule giveaways.
- Content: cohesive theme, product hooks + personal anecdotes, answer pricing/returns/shipping questions, walk through checkout.
- Cadence: review after each LIVE; focus on 1-2 dimensions at a time.

### 1.6 "Shop Tab & Search Analytics" - READ (not LIVE-specific; useful for GMV wording)
URL: https://seller-us.tiktok.com/university/essay?knowledge_id=6276577063585582&lang=en - HTTP 200
- GMV: "The total amount paid for orders from the Shop Tab, including returns and refunds."
- Impressions: "Each time a product link appears in a Recommendations touchpoint, it counts as 1 impression."
- Conversion rate: "The percentage of unique page views that result in sales of your products."

### 1.7 "Analyzing your Livestream data" - READ
URL: https://seller-us.tiktok.com/university/essay?knowledge_id=6837825178388225 - HTTP 200
- Names transaction data, traffic (impressions, entrances), product clicks, orders, engagement, follower growth, organic vs ad traffic. No formulas. Mentions analysing "when certain products are pinned and discounts or flash sales are offered". No tactical recommendations.

### 1.8 LIVE playbook pages - READ
- **"Choosing the Right Products for LIVE Selling"** https://seller-us.tiktok.com/university/essay?knowledge_id=463621005051661&lang=en - 200
  - "at least >= 10 products in shopping bag"; "LIVEs with 10+ items see 2x higher shopping bag clicks"
  - H-I-T sequencing: High-Traffic Drivers 10-20% (discounted/viral openers), Irresistible Heroes 70-80% (bestsellers), Testing Products 10-20%
  - Pinning: pin heroes at onset; switch to traffic-drivers if impressions stagnate; "Do not switch up product pins too quickly. Give some time (at least 10-15 mins in a 2 hour LIVE)"
  - Selection: >90% positive reviews, deal attached, stock, audience fit; "Hot sales / Hot search / Hot picks / Top selling" tags
- **"TikTok Shop LIVE Promotions Tools"** https://seller-us.tiktok.com/university/essay?knowledge_id=6810061071615758&lang=en - 200
  - LIVE Flash Sale: "Limited-time seller-funded deal shown only on the livestream, with countdown timer and pre-launch countdown." Tips: announce upcoming deals, leverage countdown to retain viewers, price below standard discounts.
  - LIVE Coupon: claimable only during the LIVE; minimum discount $0.50
  - Creator LIVE Deal: "Exclusive limited-time deal shown only on a designated creator's livestream."
  - Creator LIVE Giveaway: "LIVE prize giveaway run by sellers or creators during a TikTok Shop LIVE session." (drives watch time; automated winner pick)
  - Creator Exclusive Price: minimum 5% discount
  - Over-discount guard: system flags combined promotions of 80%+ before publishing
- **"Operating LIVE Flash Sales in LIVE Manager"** https://seller-us.tiktok.com/university/essay?knowledge_id=5460509911861034&lang=en - 200
  - Setup: Shopping Bag > "Add LIVE Flash Sale" > select products > SKU inventory allocation > purchase limits per buyer > duration + countdown > launch now or save. "pin the product to get more attention"; "build up anticipation and energy ahead of the sale start time". Five-minute pre-launch countdown mentioned in search snippet of sibling page (UNVERIFIED exact figure on this page).
- **"LIVE Events"** https://seller-us.tiktok.com/university/essay?knowledge_id=6837836318344962&lang=en - 200
  - Duration "30 minutes minimum and maximum 13 hours"; max "100 products" per event; must start "within 10 minutes of its planned start"; mobile events scheduled >= 2 hours ahead; moderators up to 30 (desktop) / 20 (mobile).
- **"LIVE Manager"** course page https://seller-us.tiktok.com/university/course?learning_id=5542989418907438&content_id=1195537245292331 - 200
  - "a minimum of 30 minutes and maximum 13 hours"; "at least 10 products", max 100; Pin button "pin the product and make it visible to your viewers"; giveaways: "Set the number of winners and items per winner", entry by comment / follow / none.
- **"Tips to Make TikTok LIVE Work for You: Engage, Sell, Repeat!"** https://seller-us.tiktok.com/university/course?learning_id=3044648051263246&content_id=8441296932570926 - 200
  - "Strategic use of flash deals, giveaways, and limited-time offers"; real-time Q&A; storytelling; consistent scheduling; **FABES method** (Features, Advantages, Benefits, Evidence, Scarcity). No hook/CTA wording, no stream-length number.
- "LIVE selling on TikTok Shop" hub https://seller-us.tiktok.com/university/essay?knowledge_id=969132212504366&lang=en - 200 - onboarding hub only, no rules.
- UNVERIFIED: the hook/CTA scripts surfaced in search ("Tap the pinned product now...", "30-45 minutes is a strong start") came from third-party blogs (livesellacademy.com, socialtale.co), not TikTok. Do not attribute to TikTok.

---

## 2. TikTok Shop policies

### 2.1 "Content Policy" (US) - READ - effective 09/17/2026
URL: https://seller-us.tiktok.com/university/essay?knowledge_id=6837891779151617 - 200
- "Creators are prohibited from promoting any content that is inconsistent with the products being advertised or sold."
- "Creators are prohibited from promoting any content that includes exaggerated promises about a product's performance, effect, or price."
- "Creators must not promote false, misleading, unavailable, or expired prices or discounts"; avoid "lowest price"/"cheapest price" without substantiation.
- LIVE Auctions: "your background and staging must be consistent with the products you are actually selling."
- AIGC: "AI-generated content is not allowed if it: Misleads or deceives viewers, Impersonates others, Changes or exaggerates a promoted product, Fabricates product effects or functions." Creators must verify AIGC "matches the actual product, the Product Description Page, and any reliable product evidence."
- No standalone "false urgency" clause; urgency is policed through misleading discount / availability rules (see 2.3, 2.5).

### 2.2 "Fair Pricing Policy" (US) - READ - effective 09/01/2026
URL: https://seller-us.tiktok.com/university/essay?knowledge_id=8519326693148462&lang=en - 200
- Prohibited: "Displaying reference prices or discounts that do not reflect a genuine and established selling price"; "Artificially inflating the original price to exaggerate a promotional discount"
- "Frequent or repeated price changes within a short period that prevent a stable or established selling price"
- "Listing materially different product types under a single product listing to display an artificially low starting price"
- Price gouging: "Overcharging during periods of increased customer demand, such as holidays or emergencies."
- NOTE: no fixed look-back window (e.g. 30 days) is stated for the reference price.

### 2.3 "How to Avoid Misleading Content" (US) - READ
URL: https://seller-us.tiktok.com/university/essay?knowledge_id=4581457528194817 - 200
- "Content is considered misleading when it: Includes claims that are inconsistent with the product detail page. Creates a false or inaccurate impression of the product."
- Listed as problematic urgency/scarcity wording: "While stocks last." / "This sale is for selected customers only." / "Don't miss these big discounts." / "We are having our largest sale!"
- Banned absolutes: "100% effective", "Guaranteed results", "Works for everyone", "Permanent effect", "Instant results", "No side effects"
- Pricing: "You can round up prices ($19.99 to $20) but never down ($19.99 to $19)."; avoid "This is the cheapest you'll ever see for this product".
- Disclaimers allowed "ONLY in the following scenarios: When showing before-and-after comparisons... When referencing time-based results."

### 2.4 "Misleading Discount Content Guide" (US) - READ - effective 08/31/2026
URL: https://seller-us.tiktok.com/university/essay?knowledge_id=6083133872424718 - 200
- "The promotional or discounted price shown in your content must exactly match the price on the product detail page when you upload your video."
- "Do not display expired promotional or discount prices. If a sale is over, it is time to take down or update that content."
- Urgency: claims like "sale ends today" / "only 2 hours left" must be genuine; content left live after expiry is a violation.
- Enforcement threshold: 300+ misleading-discount videos in 3 months -> posting limit of 3 shoppable videos/week for 14 days.

### 2.5 "Your Guide to Product Pricing" (US) - READ - effective 09/15/2026
URL: https://seller-us.tiktok.com/university/essay?knowledge_id=5486313366537997 - 200
- "The price a customer sees should always be a genuine and accurate representation of the product for sale."
- "The primary price displayed to customers is the lowest price in a listing."
- Prohibits advertising in videos/livestreams a price lower than checkout price; placeholder "Do Not Buy" SKUs; mixed-price bundles under one listing.

### 2.6 "TikTok Shop UK Content Policy" - READ - effective 01/09/2026
URL: https://seller-uk.tiktok.com/university/essay?knowledge_id=8913678280345345&lang=en-GB - 200
- "All price claims, including any type of promotion and/or saving claims, must be genuine, accurate and compliant with applicable laws."
- "The reference price must not be inflated to mislead customers."
- False scarcity (explicit): "Sellers and/or Creators claiming in E-commerce Content that the Seller will soon stop selling the product(s), when that is not the case" is prohibited.
- "E-commerce Content must not include any incorrect or exaggerated information about the Seller or the product."
- AI: prohibits "Creating or distributing AI-generated deepfakes of celebrities, medical professionals, or public figures to promote a product".

### 2.7 "AI-Generated Content Restrictions and Requirements" (US) - READ - effective 09/02/2026
URL: https://seller-us.tiktok.com/university/essay?knowledge_id=491489038501663&lang=en - 200
- Must disclose when "The video or audio includes synthetic faces, voices, digital humans, or highly realistic virtual figures" or "The content is fully generated by AI or significantly edited by AI." Methods: on-screen text/watermark, or the "AI-generated content" toggle.
- "Content must not use AI to demonstrate a core product effect that is not supported by the actual product."
- "Content must not use the likeness, voice, name, trademarks, or other intellectual property, of any third party without proper permission."
- "Do not use AI to make a product look more powerful or effective than it really is."
- AI "doctors"/"professors" for health products = violation. Penalties: warning -> removal -> account restriction/suspension/permanent ban.

### 2.8 "Artificial Intelligence Generated Content (AIGC)" (UK) - READ via curl - dated 28/08/2026
URL: https://seller-uk.tiktok.com/university/essay?knowledge_id=5234615598237462 - 200
- Definition: "AIGC refers to content created wholly or partially by AI tools (e.g. scripts, voices, avatars, images, animations), with minimal or no direct human performance."
- Rationale includes "To comply with The Artificial Intelligence Act (AI Act) 2024 and TikTok AI Guidelines".
- Disclosure: toggle produces label "Disclosed by creator as AI-generated" bottom-left. "Content created using official TikTok AI effects will be automatically labeled by the platform". Platform auto-label when "specific technical metadata" present: "Once content is automatically labeled by the platform, creators cannot remove the label."
- Prohibited "in Livestreams and Short Videos/Photo Mode": Non-Disclosure ("Missing labels in livestreams, titles, or video descriptions may result in enforcement action"); impersonation of celebrities / medical professionals / political or public figures / official authorities "even if content is properly labeled as AIGC"; deepfakes; "Don't use AI-generated avatars, voices, personas, presenters or hosts that impersonate, portray or falsely imply medical or professional expertise"; fear-based health imagery.
- LIVE example given: "A Live Stream where the host is selling shoes using a filter of Kanye Wests face" (violation).

### 2.9 "Requirements for High-Quality Videos and LIVEs" (US) - READ - effective 09/17/2026  <-- the AI-host rule
URL: https://seller-us.tiktok.com/university/essay?knowledge_id=4581457528243969&lang=en - 200
- Required: "Interact with viewers through real-time verbal or sign language communication."
- Prohibited: "Do not use non-real-time verbal interaction such as AI-generated voices, audio recordings, or radio."
- "Do not use stills, slideshows, or scrolling images that covers more than 50% of the screen."
- "Do not use animated figures or content that covers more than 50% of the screen."
- "Do not overlay product display page screenshots on your content."
- Penalties: "Assigning violation points", "Removing content", "Removing access to features", "Restricting commission earnings", "Restricting or removing your creator account".
- Implication for the course: a fully AI-voiced virtual host is not permitted on TikTok Shop promotional LIVEs; an avatar may appear only as a <=50%-of-frame element with a real human speaking/signing live. Secondary coverage: Social Media Today 2026-06-15 (https://www.socialmediatoday.com/news/tiktok-bans-ai-generated-voices-in-shopping-livestreams/822977/ - READ) quotes the same sentence; ppc.land / PYMNTS say the rule was first published 2026-05-23 (UNVERIFIED date - the page itself now shows 09/17/2026).

### 2.10 Symphony Digital Avatars
- Newsroom "Meet Symphony Avatars" 2024-06-17 - READ - https://newsroom.tiktok.com/en-us/announcing-symphony-avatars - 200
  - Stock Avatars: "pre-built avatars created using paid actors that are licensed for commercial use."; Custom Avatars: "crafted to represent a creator or a brand spokesperson with multi-language abilities"; AI Dubbing defined. No labelling statement on this page.
- Newsroom "Creativity at Scale" 2025-06-16 - READ - https://newsroom.tiktok.com/en-us/tiktok-symphony-updates - 200
  - "Symphony content is automatically labeled as AI-generated and goes through multiple rounds of safety review". Symphony Showcase Products = avatars holding products / modelling clothing / showing apps. No LIVE or TikTok Shop mention.
- Ads help centre "How to create avatar videos with Symphony Creative Studio" - READ - https://ads.tiktok.com/help/article/how-to-create-avatar-videos-with-symphony-creative-studio - 200
  - "An AI-generated label is added to all exported videos." Export to Download or Ads Manager; content "will undergo further moderation and policy reviews on TikTok or TikTok Ads Manager prior to being cleared for publishing." No statement permitting avatar use as a LIVE host.
- UNVERIFIED: TikTok Community Guidelines "Integrity and Authenticity" (https://www.tiktok.com/community-guidelines/en/integrity-authenticity) and https://www.tiktok.com/tns-inapp/pages/ai-generated-content are JS-rendered; WebFetch, curl and the browser pane all returned navigation only. Rely on 2.7/2.8 (TikTok Shop policy) for AIGC rules instead.

---

## 3. Regulation

### 3.1 US - FTC
- **Endorsement Guides, 16 CFR Part 255** - READ via govinfo Federal Register text
  URL: https://www.govinfo.gov/content/pkg/FR-2023-07-26/html/2023-14795.htm - 200 (ecfr.gov and federalregister.gov both 302 to a bot-unblock page)
  - Published and effective 2023-07-26.
  - 255.0(b) endorsement: "any advertising, marketing, or promotional message for a product that consumers are likely to believe reflects the opinions, beliefs, findings, or experiences of a party other than the sponsoring advertiser"
  - 255.0(f) clear and conspicuous: "a disclosure is difficult to miss (i.e., easily noticeable) and easily understandable by ordinary consumers"
  - 255.2(d): advertisers must not engage in "procuring, suppressing, boosting, organizing, or editing consumer reviews" so as to distort what consumers think; "fake positive reviews used to promote a product are endorsements."
  - Live stream mention: only in the Federal Register discussion (video-game influencer "paid to play and live stream a game"), not in a Guide example.
- **Rule on the Use of Consumer Reviews and Testimonials, 16 CFR Part 465** - READ (press release)
  URL: https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials - 200
  - Announced 2024-08-14; effective 60 days after FR publication (secondary sources give 2024-10-21 - UNVERIFIED here). Bans fake/AI-generated reviews, sentiment-conditioned compensated reviews, undisclosed insider reviews, fake independent review sites, review suppression, and buying/selling "fake social media indicators" (followers, views). Civil penalties for knowing violators.
- **Rule on Unfair or Deceptive Fees, 16 CFR Part 464** - READ (FTC FAQ)
  URL: https://www.ftc.gov/business-guidance/resources/rule-unfair-or-deceptive-fees-frequently-asked-questions - 200
  - Effective 2025-05-12; scope is **live-event tickets and short-term lodging only** - does NOT cover general e-commerce or livestream retail. Do not cite it as a fake-urgency rule.
- **No FTC rule specifically on fake urgency exists (2024-2026)**. Fake urgency is enforced under FTC Act Section 5 (deception) using the staff report:
- **"Bringing Dark Patterns to Light" staff report, Sept 2022** - READ (PDF, 2.1 MB, via pypdf)
  URL: https://www.ftc.gov/system/files/ftc_gov/pdf/P214800%20Dark%20Patterns%20Report%209.14.2022%20-%20FINAL.pdf - 200
  - p.21 SCARCITY: "False Low Stock Message - Creating pressure to buy immediately by saying inventory is low when it isn't. Example: 'Only 1 left in stock - order soon'"; "False High Demand - Creating pressure to buy immediately by saying demand is high when it isn't. Example: '20 other shoppers have this item in their cart'"
  - p.22 URGENCY: "Baseless Countdown Timer - Creating pressure to buy immediately by showing a fake countdown clock that just goes away or resets when it times out. Example: 'Offer ends in 00:59:48'"; "False Limited Time Message - Creating pressure to buy immediately by saying the offer is good only for a limited time or that the deal ends soon - but without a deadline or with a meaningless deadline that just resets when reached"; "False Discount Claims - Creating pressure to buy immediately by offering a fake 'discounted' or 'sale' price"
  - p.4: workshop discussed "countdown timers on offers that are not actually time-limited, claims that an item is almost sold out when there is actually ample supply, and false claims that other people are also currently looking at or have recently purchased the same product."

### 3.2 UK - DMCC Act 2024, Schedule 20 - READ via browser pane (legislation.gov.uk returns HTTP 202 bot-wall to curl/WebFetch)
URL: https://www.legislation.gov.uk/ukpga/2024/13/schedule/20
- Title: "Schedule 20 - Commercial practices which are in all circumstances considered unfair" (Section 225).
- **Para 7**: "Falsely stating that a product will only be available for a limited time, or that it will only be available on particular terms for a limited time, in order to elicit an immediate decision and deprive consumers of sufficient opportunity or time to make an informed choice."
  Commencement: "Sch. 20 para. 7 in force at 6.4.2025 by S.I. 2025/272, reg. 2(1)(11)".
- Para 6 (bait): "Making an invitation to purchase products at a specified price and then- (a) refusing to show the advertised item to consumers, (b) refusing to take orders for it or deliver it within a reasonable time, or (c) demonstrating a defective sample of it, with the intention of promoting a different product."
- Para 13 (reviews): "(1) Submitting, or commissioning another person to submit or write- (a) a fake consumer review, or (b) a consumer review that conceals the fact it has been incentivised. (2) Publishing consumer reviews, or consumer review information, in a misleading way. (3) Publishing consumer reviews ... without taking such reasonable and proportionate steps as are necessary for the purposes of- (a) preventing the publication of- (i) fake consumer reviews, (ii) consumer reviews that conceal the fact they have been incentivised, or (iii) consumer review information th[at is false or misleading]..."
- Key change vs CPRs 2008 / UCPD: threshold dropped from "very limited time" to "limited time" (compare UCPD Annex I item 7 below).

**CMA207 "Unfair commercial practices" guidance, 18 November 2025** - READ (PDF 574 KB via pypdf)
URL: https://assets.publishing.service.gov.uk/media/691b9bd821ef5aaa6543ee6f/Unfair_commercial_practices_CMA207_18_Nov_2025__2_.pdf - 200
- p.24, Banned practice 7 example: "A trader falsely tells a consumer that an offer will end when a countdown clock runs out in order to pressure them into making an immediate decision to buy. When the time runs down, the offer does not in fact end, but continues and the countdown clock restarts. If the trader's statement that the offer will end is true (and is not otherwise misleading, for example, because a substantially similar offer appears within a short period) then this is unlikely to be problematic."
- p.46 (misleading actions, s.226): "One message states 'Be quick! We've sold 10 in the last 5 mins.' While it is literally true that the stated number of people have just bought the product, the trader's stock levels are high and there is no need for consumers to hurry." (flagged as potentially misleading)
- p.14: marketplaces "may be carrying out a banned practice if they falsely state that a particular featured appliance is available for a limited time only".
- 1.4: "This Guidance updates and replaces Consumer Protection from Unfair Trading Regulations: OFT1008."
- CMA precedent press release 2022-11-30 (Emma Sleep) - READ - https://www.gov.uk/government/news/cma-investigates-online-selling-practices-based-on-urgency-claims - "countdown timers and claims about time limits to imply that a discounted price will end soon, when this may not be the case" (under CPRs 2008).

### 3.3 EU - UCPD 2005/29/EC consolidated 28.05.2022 - READ via browser pane (EUR-Lex returns 202 to curl/WebFetch)
URL: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02005L0029-20220528
- Annex I title: "COMMERCIAL PRACTICES WHICH ARE IN ALL CIRCUMSTANCES CONSIDERED UNFAIR"
- **Item 7**: "Falsely stating that a product will only be available for a very limited time, or that it will only be available on particular terms for a very limited time, in order to elicit an immediate decision and deprive consumers of sufficient opportunity or time to make an informed choice."
- Item 6: bait and switch (same three limbs as DMCC para 6) "with the intention of promoting a different product (bait and switch)"
- Item 23b: "Stating that reviews of a product are submitted by consumers who have actually used or purchased the product without taking reasonable and proportionate steps to check that they originate from such consumers."
- Item 23c: "Submitting or commissioning another legal or natural person to submit false consumer reviews or endorsements, or misrepresenting consumer reviews or social endorsements, in order to promote products."
- Article 6(1)(d): misleading as to "the price or the manner in which the price is calculated, or the existence of a specific price advantage"
- Article 7(6) (added by 2019/2161): "Where a trader provides access to consumer reviews of products, information about whether and how the trader ensures that the published reviews originate from consumers who have actually used or purchased the product shall be regarded as material."
- Price-reduction "prior price = lowest price in previous 30 days" rule is in the Price Indication Directive 98/6/EC Art 6a, not UCPD - NOT fetched, UNVERIFIED here.

### 3.4 EU AI Act Article 50
- Text - READ from artificialintelligenceact.eu reproduction (EUR-Lex itself bot-walled): https://artificialintelligenceact.eu/article/50/ - 200
  - Art 50(1) providers: natural persons "are informed that they are interacting with an AI system" unless obvious.
  - Art 50(2) providers of systems generating synthetic audio/image/video/text: outputs "marked in a machine-readable format and detectable as artificially generated or manipulated".
  - Art 50(4) deployers of deep fakes: "disclose that the content has been artificially generated or manipulated".
  - Art 50(5): information given "in a clear and distinguishable manner at the latest at the time of the first interaction or exposure".
  - Art 3(60) deep fake: "AI-generated or manipulated image, audio or video content that resembles existing persons, objects, places, entities or events and would falsely appear to a person to be authentic or truthful"
  - Application: "Article 50 comes into force on 2 August 2026, per Article 113."
- Commission guidelines page - READ: https://digital-strategy.ec.europa.eu/en/policies/guidelines-ai-transparency-obligations - 200 - "Article 50 of the AI Act applies from 2 August 2026." Deployers "must inform individuals when they are exposed to...Deepfakes." Non-adherents to the Code "will have to demonstrate compliance ... through alternative equivalently adequate means."
- Code of Practice page - READ: https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content - 200 - first draft 17 Dec 2025, second draft 3 Mar 2026, final code 10 Jun 2026; "transparency obligations, applicable from 2 August 2026".
- Digital Omnibus effect - SECONDARY (Gibson Dunn, 2026-05-27, READ): https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/ - Article 50 stays at 2 Aug 2026; systems on market before 2 Aug 2026 get "a four-month grace period (until 2 December 2026) before the watermarking obligation under Article 50(2)"; high-risk Annex III moved to 2 Dec 2027, Annex I to 2 Aug 2028. Search results disagree (some say Feb 2027) - the OJ text of the Omnibus (reported published 2026-07-24) was NOT fetched: treat the grace-period date as UNVERIFIED; the 2 Aug 2026 Article 50 date is verified across three sources.
- **Verdict on "August 2026?"**: YES - Article 50 applies from 2 August 2026 (Art 113). Penalty tier for Art 50 breaches: up to EUR 15m / 3% turnover (Art 99(4)) - from search summary only, UNVERIFIED here.

---

## 4. Research on live-commerce conversion

| # | Citation | One-line finding | Read level |
|---|----------|------------------|-----------|
| R1 | Guo, Y., Zhang, Y., Goh, K.-Y., & Peng, X. (2025). Can Social Technologies Drive Purchases in E-Commerce Live Streaming? An Empirical Study of Broadcasters' Cognitive and Affective Social Call-to-Actions. *Production and Operations Management*, 34(12). https://doi.org/10.1177/10591478241276131 | Observational speech-to-text + IV econometrics on real ELS sessions: **affective** CTAs raise product orders (one extra affective-CTA word/minute -> +0.43% orders, ~1.10% demand growth per minute); **cognitive** CTAs have no significant effect and "impede social engagements". | ABSTRACT (Crossref; SAGE page 403) |
| R2 | Xie, S., Sharma, S., & Mehra, A. (2025). Designing E-commerce Livestreams: How Product Presentation Duration Affects Sales? *Production and Operations Management*, 34(12). https://doi.org/10.1177/10591478251314455 | Real data from two large Chinese platforms: longer per-product presentation raises that product's revenue but lowers session revenue; effect driven by third-party (multi-brand) streams - a brand-vs-host incentive tension. | ABSTRACT (Crossref; SAGE page 403). Sample "nearly 75,000 livestreams, 2021" from GMU news release - UNVERIFIED |
| R3 | Liu, Z., Zhang, W., Liu, X., et al. (2025). Predicting livestream shopping success. *International Journal of Research in Marketing*. https://www.sciencedirect.com/science/article/pii/S0167811625001168 | Taobao Live seller data; adding session strategy, assortment strategy, content and engagement metrics improves sales-prediction accuracy by 25.6%. | UNVERIFIED (ScienceDirect 403; only search snippet) |
| R4 | Liu, X., & Zhang, L. (2024). Impacts of different interactive elements on consumers' purchase intention in live streaming e-commerce. *PLOS ONE*, 19(12), e0315731. https://doi.org/10.1371/journal.pone.0315731 | Survey SEM (n=326): consumer-streamer interaction -> purchase intention beta=0.218 (p<.001); consumer-consumer beta=0.149 (p<.01); consumer-platform n.s.; mediated by social presence and trust. | READ (full text, PLOS) |
| R5 | Ling, S., Zheng, C., Cho, D., Kim, Y., & Dong, Q. (2024). The Impact of Interpersonal Interaction on Purchase Intention in Livestreaming E-Commerce: A Moderated Mediation Model. *Behavioral Sciences*, 14(4), 320. https://doi.org/10.3390/bs14040320 | PLS-SEM (n=758, China, Jan-Feb 2024): consumer-anchor interaction -> PI beta=0.117; via psychological distance beta=0.144; **time pressure strengthens** both paths (beta=0.152 and 0.112). | READ (full text, PMC) |
| R6 | Qu, Y., Khan, J., Su, Y., Tong, J., & Zhao, S. (2023). Impulse buying tendency in live-stream commerce: The role of viewing frequency and anticipated emotions influencing scarcity-induced purchase decision. *Journal of Retailing and Consumer Services*, 75, 103534. https://doi.org/10.1016/j.jretconser.2023.103534 | Viewing frequency and anticipated emotions (regret/rejoicing) fully mediate past purchase -> scarcity-induced impulse purchase. | ABSTRACT-level, from search summaries only (ScienceDirect + ResearchGate 403; Crossref has no abstract) - treat finding wording as UNVERIFIED |
| R7 | Luo, X., Cheah, J.-H., Hollebeek, L. D., & Lim, X.-J. (2024). Boosting customers' impulsive buying tendency in live-streaming commerce: The role of customer engagement and deal proneness. *Journal of Retailing and Consumer Services*, 77, 103644. https://doi.org/10.1016/j.jretconser.2023.103644 | ELM model, n=735 Chinese millennials: product info quality, streamer interaction quality, credibility and review consistency raise engagement and impulse buying; **deal proneness moderates** engagement -> impulse buying. | ABSTRACT (IDEAS/RePEc) |
| R8 | Li, Y., Garcia-de-Frutos, N., & Ortega-Egea, J. M. (2025). Impulse buying in live streaming e-commerce: A systematic literature review and future research agenda. *Computers in Human Behavior Reports*, 19, 100676. https://doi.org/10.1016/j.chbr.2025.100676 | SLR (WoS/Scopus): "most research has relied on a cross-sectional survey design, predominantly conducted in Chinese contexts"; antecedents grouped as marketing / streamer / live-streaming stimuli and cognitive / affective / trait organism factors (S-O-R). | ABSTRACT (DOAJ) |

Honest caveats for the course: R1-R3 are the only real-transaction studies found; R4-R7 are self-reported purchase-intention surveys in China. No peer-reviewed study of TikTok Shop LIVE specifically was found. No study isolating "price anchoring" in livestream was located; R7's deal-proneness moderation and the FTC/CMA reference-price rules are the nearest verified material.

---

## Could not read (UNVERIFIED) - summary
- TikTok Community Guidelines "Integrity and Authenticity" and tns-inapp AIGC page (JS-only render).
- FTC Endorsement Guides on ecfr.gov / federalregister.gov (bot wall) - substituted govinfo copy.
- ScienceDirect (R3, R6, R8 full text), SAGE (R1, R2 full text), ResearchGate, tandfonline review 10.1080/08874417.2023.2290574 - all 403.
- Digital Omnibus OJ text (Art 50(2) grace period date).
- Price Indication Directive 98/6/EC Art 6a (30-day prior price).
- Exact TikTok tooltip formulas for Views / Viewers / Watch Time / CTR / CTOR / GPM (only visible inside Seller Center).
