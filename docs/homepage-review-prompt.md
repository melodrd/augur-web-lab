# Prompt: review the whole homepage (`/`)

Paste everything below the line into a fresh Claude Code session in this project, or say: “Read `docs/homepage-review-prompt.md` and do it.”

---

## Your job

Review the Augur homepage, Melo's version at `/`, the way a first-time visitor meets it, and answer the owner's questions plainly:

1. **Does it explain Augur Lituus?** After the first screen, and after the whole page, can a newcomer say what it is, who it's for, whether it's live and what to do next?
2. **Is it too noisy?** Does every element earn its place, or does something compete with the message?
3. **Is it clear?** Plain words, terms explained where they first appear, one idea at a time.
4. **Is it organized?** Does the order follow the questions readers ask, with one job per section?
5. **Does it follow good practice?** Copy, UX, UI, user flows, accessibility, performance, findability and trust, measured against current, sourced practice.
6. **Does it serve each reader?** Beginners and traders first, then REP holders and builders (integrators).

Give a verdict on each, then a ranked list of fixes with a concrete proposal for each.

- **Review only:** don't edit site files, commit or push. Scratch files are fine. The owner picks the fixes, and another session applies them.
- **Decide:** one recommendation per problem, with its reason. Name a runner-up only when it's a real alternative. Don't end on “want me to…?”.
- **Push back:** where an owner decision or a project rule is what hurts the page, say so and name the principle. Keep those findings apart from fixes that work within the rules.
- **Time:** about 3 hours. Say your estimate in your first message, then start. If the owner answers “fast path”, keep the research to the starting list below and do passes 0–4 with three readers (about 1 hour).
- **Rules:** `AGENTS.md`, `PRODUCT.md`, and the copy rules and size and spacing standards in `docs/plan.md`. The plan's `/2/` is today's `/`, and phones are in scope here.
- **Helpers:** subagents for the research and the cold reads, run in parallel. No Workflow unless the owner asks for one.

## Setup

| What | Where |
| --- | --- |
| Code | this checkout. Note the commit you review (`git log -1 --oneline`). |
| Build | `bun --bun astro build --outDir <your scratchpad>/dist`, served with a small `Bun.serve`. Judge the build, not the dev server: only built pages carry the CSP, which can block an inline script. Don't touch the repo's own `dist`; other sessions preview it. |
| Screenshots and measures | headless Edge over CDP. The project memory has the recipe (`edge-cdp-screenshots`) and how to film motion at real speed (`motion-filmstrips`). Playwright doesn't run on this machine, and there's no Node. The Browser pane is fine for clicking around, but while it's hidden it stops animation frames and scroll events (`hidden-pane-testing`). |
| Accessibility scan | inject `axe-core/axe.min.js` from `node_modules` over CDP and run `axe.run()` |
| Live (may lag the repo) | https://augur-web-lab.vercel.app/ |
| Other versions | `/ryan/` and `/ryan-augus/`: the same UI with other reviewers' copy and a few of their UI asks (pass 6 only) |

## What's on the page

Nine blocks and about 900 words, counting the example and the footer. Every visible string is in `src/data/homepage-copy-source.json`, and Melo's copy, with the reason for each line, in `src/data/homepage-v2.ts`. `AGENTS.md` (“Motion and access”) lists everything that moves and why.

| Block | Opens with | Files and notes |
| --- | --- | --- |
| Announcement bar | “Augur is back.” | `layout/AnnouncementBar.astro`. Drops in 3 s into a fresh visit. |
| Header | About, Products, Resources, Community, Talk to us | `layout/SiteHeader.astro`, `chrome-v2.css`. Hides while you scroll down. |
| Hero | “The frontier of decentralized truth.” | `home/Hero.astro`. “Jump to” links for traders, REP holders and builders; the flock art, and from 1024 px the live canvas floor. |
| Why Augur | “Smart contracts can't see the world.” | `home/Tenets.astro`. Three looping cards, then “The answer is nobody's call.” for traders and builders. |
| Use cases | “What can Augur Lituus power?” | `home/Applications.astro`. Three example cases as tabs, the shown card looping, then the builder block. |
| How it works | “Know what happened? Get paid to report it.” | `home/HowItWorks.astro`, `how-scenes.ts`. Four steps over one stage, the example story behind a toggle, then the Holding REP? card. |
| Roadmap | “The road to Augur Lituus.” | `home/Roadmap.astro`, `roadmap.ts`. |
| Learn more | “Keep going.” | `home/LearnMore.astro`. Doors to the FAQ, the blog and Discord. |
| Footer | “Talk to the Augur team.” | `layout/SiteFooter.astro`. Contact, the newsletter prototype (it never sends) and the site map. |

The version pill at the bottom right is review chrome: leave it out of the verdicts, but say if it covers anything.

## Who it's for

Traders and beginners first (owner, 19 Oct 2026), and never assume the reader owns an app or a project. These four readers are the cold reads' personas, and their questions are what the page has to answer:

| Reader | Who they are | What they come to find out |
| --- | --- | --- |
| Beginner | knows what a blockchain is; has never heard “oracle”; may have seen prediction markets in the news | What is this? Is it for me? Is it real? Where do I start? |
| Trader | uses prediction markets; has seen or heard of a disputed result | Why does the oracle behind my market matter? What stops a wrong answer? Can I use it today? |
| REP holder | has held REP for years without following 2025–26 | What's happening with Augur? What can I do with REP? Do I have to do anything? |
| Builder | builds a market, insurance, DAO or other onchain app, and knows other oracles | What does it do that others don't? What does it cost and save? How do I integrate it, and when? Who do I talk to? |

## What the owner wants

- **Signal over noise:** professional, calm and organized. Fewer, stronger elements and one clear action per section.
- **No dead space:** no short column beside a tall one, no empty card foot, no art floating in a box. Check every tab and state.
- **Familiar words first:** a word a newcomer knows (blockchain, app, answer) beats tidy terminology. Explain the unfamiliar ones (oracle, REP, fork) where they first appear.
- **Resolution leads:** Augur Lituus settles questions; it doesn't offer trading. In a market example its answer is the biggest thing and prices are context, with no Buy buttons and no profit or price as the hero.
- **REP, calmly:** taking part can earn REP, like paid work; never money, price or yield. Holding never requires taking part, and a fork is a calm last resort.
- **Truthful:** “designed to”, never guarantees. No invented partners, metrics, dates, readiness or addresses. Mechanism facts come from the January 2026 whitepaper (`docs/sources.md`). A reader can tell proposed design, work underway, illustrative examples and history apart.
- **Approved copy stays:** most of Melo's lines are drafts (`homepage-v2.ts` says so), but some are approved (`AGENTS.md`; what still awaits approval is in `docs/launch-checklist.md`). You can still say an approved line fails: mark its fix “approved copy, owner's call”.

**Turned down before.** If you'd bring one back, argue for it explicitly:
- grids of squares, meters, extra tonal zones and written cues like “Next: …” (noise)
- two big Yes/No buttons in the market example
- coins for REP (the iso-kit blocks stay) and generic pictogram icons (markers are bespoke iso-kit objects)
- “?” tooltips on the Why Augur cards (Ryan 6)
- a highlight that walks through How it works' steps by itself (it read as a stepper that had lost its content)
- scroll snap, settle or glide scripts (native scroll only)
- a theme toggle or alternate layouts
- a pause control for the loops (removed on 22 Oct). It's still a WCAG 2.2.2 launch blocker, so pass 4 asks you to solve it.

## Research first (about 30 minutes)

Build the yardstick before you judge the page, so the page doesn't set it. Two subagents can take steps 1 and 2 while you build and shoot pass 0.

1. **Practice.** Turn current, primary sources into a checklist of 30 to 40 tests, each with its source link, its date and how you'll check it. Look for 2025–26 work as well as the classics. Start with:
   - NN/g: the 10 usability heuristics, homepage usability guidelines, how people scan pages, plain language for experts, progressive disclosure, information scent, trustworthy design, animation in UX
   - lawsofux.com, the owner's favourite (read each law you cite)
   - W3C WAI: WCAG 2.2, level AA
   - web.dev: Core Web Vitals
   - GOV.UK content design, and the US plain language guidelines
   - Stanford's Web Credibility guidelines
   - Google Search Central's SEO starter guide, and the Open Graph protocol
   - one or two landing-page and positioning guides with a real track record, such as Julian Shapiro's landing-page guide or April Dunford on positioning

   Cover at least what a great homepage of this kind has:
   - a first screen that says what it is, who it's for and what to do
   - one main action per reader
   - depth one click away: FAQ, Learn, whitepaper, code
   - proof: real history, evidence, open code, who's behind it
   - an honest status, and honest risk
   - ways to stay in touch and to reach a person
   - speed, access and phones
   - findability and sharing
   - a consistent header, footer and 404
   - legal basics wherever data is collected

   Skip listicles and anything you can't trace to research or practice.
2. **Peers.** Six homepages that explain a hard technical product:
   - today's augur.net
   - two oracles, from Chainlink, UMA, Pyth or Kleros
   - ethereum.org, for teaching beginners
   - one prediction market's help page on how markets settle (Polymarket or Kalshi)
   - one developer product people praise for clarity, such as Stripe

   For each: a first-screen screenshot, how it says what it is (quote 15 words at most), how it explains “oracle”, its reader paths, its main actions, its trust signals and how much moves.
3. **Answer key.** From the whitepaper, `docs/sources.md` and the page's own sourced facts, answer each reader question above in a line or two, plus these: What is Augur Lituus? How is an answer decided? What stops someone lying? Is it live? How do Augur, Augur Lituus and REP relate? The cold reads are scored against this key.

## Passes

### 0. Inventory

Measure; don't eyeball. At 1440 × 900, collect:
- full-page and per-section screenshots, closed, then with every tab and panel open
- the page text in reading order, and the heading outline
- for each section: its words, and how many text styles, colours, boxes, labels or chips, icons and actions it has
- every link and button, with where it goes
- everything that moves: its trigger, its length, whether it loops, and what else moves at the same time

### 1. Does it explain Augur Lituus? (cold reads)

Give each reader a fresh subagent with only pictures and text: no brief, no findings, no hints, and tell it not to open the repo. It answers as that person and says “I don't know” rather than guess.
- **First screen (five-second test):** the 1440 × 900 screen as a fresh visit shows it after about 4 s (the announcement bar drops in at 3 s), then the 390 × 844 one. What is this? Who is it for? What would you click first, and why?
- **Whole page:** the section screenshots in order, with the text. Explain Augur Lituus in one sentence. Is it live? What is REP? How is an answer decided, and what stops someone lying? What would you do next? What confused you, what did you skip, what felt like noise, and what's missing for you? How far do you trust it, from 1 to 5, and why?
- **First click:** for the reader's main goal, which link or button they'd use on the first screen, and which at the end of the page.

Score each answer against the key: right, partly right or wrong. Quote the misreads; they're the best evidence you'll get. Then give one more fresh reader a filmstrip of the first scroll (`motion-filmstrips`) and ask what drew the eye first, second and third, and whether anything felt slow, busy or gimmicky.

These are model readers, not people. Say so in the report, and name the real-user test you'd run next, for example a five-second test and a first-click test with five people per reader.

### 2. Copy and wording

- **Plain language:** sentence length and reading grade for each section. Aim for about grade 8 on the main scroll and flag anything over 10. List every term a beginner may not know (oracle, onchain, REP, stake, fork, multisig, governance, burned, DAO, protocol and the rest), where it first appears, and whether it's explained there.
- **Names:** how Augur, Augur Lituus, REP, the Lituus Foundation, ChainSafe and the Moon Fork are introduced. Is each clear before it's used, and is it clear which does what?
- **One word per thing:** answer, outcome, result and truth; ask, question and query; stake, fee and bond; project, app, platform and protocol. Flag only the switches that could confuse; familiar words stay.
- **Repetition:** every fact the page says more than once (“anyone can ask”, for one), where, and whether each repeat reinforces or pads.
- **Headings and links:** does each heading make sense alone, as a skimmer or a screen reader's heading list meets it? Does each link say where it goes?
- **Truth and tone:** every claim matches the whitepaper and says “designed to” where it's design. Nothing reads as an investment pitch, a duty for REP holders, or a date the sources don't give. Someone who reads only the hero and one more section knows Augur Lituus is still being built.
- **House style** (`docs/plan.md`): no em dashes, no rule-of-three lists, no “X, not Y” constructions, curly quotes, and “Augur Lituus” in full.

### 3. Structure and flow

- **Order:** write the questions a newcomer asks, in the order they ask them, and map each section to the one it answers. Find questions answered late, twice or never, and sections that answer none.
- **One job per section:** say each section's job in a sentence. If you can't, it's doing two.
- **Readers:** a table of reader × question, with where the page answers it, or “nowhere”. Do the hero's “Jump to” links land where that reader's answers are?
- **Journeys:** click through each reader's path in the build, from the first screen to their goal: Learn, the FAQ, the REP page, the whitepaper, GitHub, Talk to us or the newsletter. Count the steps, and note dead ends, wrong landings, weak scent and anything that needs JavaScript.
- **Navigation:** the header menus and the footer. Can a reader predict what's behind each label?
- **Ways on:** every section ends with a clear next step, and the page ends with one for each reader.

### 4. Noise and visual design

Look at every screenshot at 100%, and zoom into the small parts.
- **Blur test:** show each section screenshot blurred (`filter: blur(6px)` in a small HTML page, shot in the same Edge) and list the three things that still stand out. Are they the three that matter?
- **Cut test:** from pass 0, find the busiest sections. For each element, say what a reader loses if it goes; an element whose loss costs nothing is a cut.
- **Hierarchy and system:**
  - the type scale, weights and colours
  - where Green goes, and whether it still points at what matters
  - alignment to the 500 / 80 / 668 heading row and the 1248 content width
  - gaps on the spacing scale
  - the same component and state looking the same in every section
- **Motion:** for each moving thing, what it explains. How many things move at once in each viewport? Does any motion compete with reading, hold it back or repeat for no reason? Loops that start themselves and run past 5 s need a pause control (WCAG 2.2.2, level A, open on `docs/launch-checklist.md`); say how you'd meet it.
- **Dead space and rhythm:** every tab and state, at 1440, 1280 and 1024. Does the page keep an even rhythm, or are some sections packed and others thin?

### 5. Good practice, measured

- **Accessibility:** axe, closed and open; the keyboard path through the whole page; focus always visible and never under the header; heading order and landmarks; contrast; forced colours; reduced motion; no JavaScript; text at 200%; reflow at 320 px.
- **Performance:** LCP, CLS and long tasks in headless Edge, at 1440 and at 390 with 4× CPU throttling; JavaScript, CSS, font and image weight. `scripts/check-budgets.ts` sets a 20 KB JavaScript budget for the homepage, but on Windows its path test never matches `/`, so measure that yourself. Lighthouse needs Node; say if you couldn't run it.
- **Phones and widths:** 1440 × 900, 1366 × 768, 1280, 1024, 768, 390 × 844 and 360 × 640. No sideways scroll, the first screen still says what this is, and tap targets meet the size standards in `docs/plan.md`.
- **Findability and sharing:** title, description, canonical, Open Graph tags and social image, structured data, `lang`, favicon and 404. Indexing stays off until launch on purpose (`PUBLIC_SITE_INDEXABLE`); say what must be true by then.
- **Trust:** who's behind it, real evidence (history since the 2015 crowdsale, the August 2026 Moon Fork, the Q2 report's figures, the public code), how status and risk are stated, and how to reach someone. Recommend only real, sourced signals.
- **The rest of your checklist:** anything a great homepage of this kind has that this one lacks. Leave out what `AGENTS.md` rules out: third-party tracking, a client framework, an animation library, a backend, a wallet connection.
- **Project checks:** `bun run check`, and the copy, links and budgets scripts against your scratch build (they read `./dist`; `edge-cdp-screenshots` says how).

### 6. The other two versions

Read `/ryan/` and `/ryan-augus/` as text, section by section, beside `/`. List the lines that explain something better than Melo's, and why. Don't merge them: a reviewer's lines stay in that reviewer's version until the owner moves them.

## Report

One private, shareable page (an Artifact or a Claude Doc) with the screenshots in it. Post its link with the verdicts and the top 10 in your reply.

1. **Verdicts:** each of the six questions, scored 1 to 5 with a line on why, then a grade for each reader.
2. **The top 10 fixes, ranked by how much they help a reader understand.** For each:
   - what's wrong and where, with the screenshot, the width and the evidence (a cold-read quote, a measure)
   - the principle, source or rule behind it
   - the exact fix: copy text, layout, CSS values or markup
   - the effort (S, M or L), and whether it touches approved copy or a project rule
3. **Cold reads:** reader × question, scored, with the quotes.
4. **Section by section:** its job, its words, and what to keep, cut and change.
5. **Copy table** for the drafts: element | current | verdict | proposed | why. End it with a ready-to-paste block in `homepage-v2.ts`'s shape, and the word count before and after.
6. **Journeys:** each reader's path, step by step, with the weak steps marked.
7. **Checklist:** each test from your research, passed or failed, with its source.
8. **Peers:** what they do better, in a few lines, with their first screens.
9. **Lines from the other versions** worth a look.
10. **What already works,** so it isn't lost.
11. **Not checked,** and why.
12. **Questions for the owner:** only real decisions, one line each.

Keep it short and concrete. Report only checks you actually ran. Quote outside sources in 15 words or fewer, with links.
