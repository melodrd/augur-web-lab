/** Homepage v4 copy, the /ryan-augus/ review copy: both reviewers' notes, every section rewritten from them
 * (owner, 29 Oct 2026: "rewrite the copy of all sections … based on the suggestions"; the Augus-only copy
 * at /augus/ is gone and now redirects here). Three sources:
 * - Ryan's 17 notes as Augus marked them: a dash means do it (2, 3, 4, 5, 7, 8, 9, 10, 12, 13, 15, 17), an
 *   X means don't (6, the "?" tips; 11, removing the builder block; 16, the intent split), no mark keeps
 *   it (1, the hero headline; 14, the roadmap).
 * - Augus's notes 1–3 on Ryan's: the builder block with its "Talk to us" link (1; "have the link for the
 *   1st"), Holding REP (2) and the Why Augur cards (3). His words are used, trimmed only to fit the UI.
 * - Augus's section notes (18 Oct 2026), each with a user and a project reading: Why Augur says why a trader
 *   wants the market they use on this oracle; What can Augur Lituus power leans into the business case
 *   (resolution outsourced, no hiring, disputes off the project, liability very lightly); How it works is
 *   the consumer case for taking part and getting paid, Holding REP inside it; the roadmap: "Coming soon?".
 * Augus's worry is that Ryan's changes turn technical, so every line is in plain words.
 * Facts win over a reviewer's wording (January 2026 whitepaper; docs/sources.md): "risk losing the token" is
 * REP losing its value, since nothing takes the token. Lines that keep a reviewer's word against a house
 * rule carry a `FLAG:` comment.
 * Structure from v2 (homepage-review.ts): the same UI system, so this object spreads homeV2 and overrides
 * every section it rewrites. Learn more reads v2's (Ryan 15: the blog and the FAQ as plain links). */
import {homeV2} from './homepage-v2';

export const homeV4 = {
  ...homeV2,
  hero: {
    // Ryan 2 (dash), his words; the whitepaper's modelled estimate (Abstract p1; §7.5 p20), hedged by
    // "designed to". The review UI keeps the ending's last two words on one line. "See how it works" stays
    // (Ryan 16, X).
    keep: 2,
    bodyEnd: 'lying is designed to cost more than ever before.',
  },
  why: {
    // Ryan 3 (dash), verbatim.
    lead: 'Whoever controls the oracle decides who gets paid.',
    // Ryan 4 (dash) on Augus's band: no "parties". Augus's user reading ("protect funds with economics rather
    // than" trust) gives the plain word: no one has to be trusted with the answer.
    answer: 'With Augur, users don’t have to trust anyone with the answer.',
    // Augus 3 (Ryan 17, dash): his titles, order and facts. Same scenes as v2 (two roads, the middleman,
    // the catapult).
    tenets: [
      // Ryan 5 (dash) over Augus's "Any app can ask." (anyone may pay a fee to ask, §2 p2, §4.4.1 p7). His
      // body without "on Augur", so it keeps two lines at 1024.
      // FLAG: "Report, challenge or build" is a rule of three (house style), Augus's own.
      { title: 'Permissionless', diagram: 'cross', claim: ['Anyone can ask.', 'Anyone can answer.'], body: 'Report, challenge or build. No approvals, no gatekeepers.' },
      // Augus's three sentences, the two the whitepaper sources as the claim (Abstract p1: truth "is not decided
      // by token holders, governance, multisigs, or anyone else") and admin keys leading the body, so the claim
      // keeps two lines like the other cards ("No governance. No multisigs." on one line wrapped at every width).
      // His body, its rule of three cut to the name that carries it ("or anyone else", Abstract p1).
      // FLAG: "No admin keys." is not in the whitepaper, and Lituus-CS isn't shipped: Augus to confirm.
      { title: 'Trustless', diagram: 'authority', claim: ['No governance.', 'No multisigs.'], body: 'No admin keys. Not even Augur’s creators can override answers.' },
      // Augus's claim, verbatim. His body ("one of the highest economic barriers to attack among decentralized
      // oracles") in plain words: the whitepaper's modelled estimate (Abstract p1, "significantly more
      // resistant to attack than all current offerings"; §3 p3, 134% of FDV), hedged by "designed to" and
      // "one of".
      // FLAG: "Harder to game. Costlier to manipulate." are comparatives without a referent.
      { title: 'Robust', diagram: 'mesh', claim: ['Harder to game.', 'Costlier to manipulate.'], body: 'Designed to be one of the costliest oracles to attack.' },
    ],
    // The closer statement stays ("The answer is nobody’s call."), over Augus's two readings.
    paths: [
      // Ryan 7 (dash): misresolution said plainly, as a fact about markets, never a statistic. Augus's user
      // reading: "I want to use products that are backstopped by this design", so the payoff asks for them.
      // "Ask for" because no market runs on Augur Lituus yet (AGENTS.md: no invented readiness), and it meets
      // the builder block's "Want Augur Lituus in a platform you use?".
      { who: 'For traders', line: ['Markets sometimes settle the wrong way.', 'Ask for markets backed by Augur Lituus.'] },
      // Ryan 8 (dash, Augus's note 1): the liability, a dispute landing on whoever resolved it. Augus's project
      // reading: "they trust us to resolve things. we dont even want that responsibility". "You" is scoped by
      // "For builders" (AGENTS.md).
      { who: 'For builders', line: ['Resolving in-house puts every dispute on you.', 'Hand that responsibility to Augur Lituus.'] },
    ],
  },
  applications: {
    // Ryan 9 (dash), verbatim. It also says Augus's user reading: one oracle for many kinds of product.
    lead: homeV2.applications.lead,
    // Ryan 10 (dash): the DAO tab names his two documents. On the review UI the tab reads only `summary`.
    governance: {
      summary: 'Upgrades and protocol changes checked against a DAO’s mission statement or constitution.',
    },
    // Augus's business case in each builders paragraph, in his order: resolution outsourced (no one to hire),
    // then disputes off the project (his "PR shield"), the liability only implied: the team has no ruling to
    // defend.
    cards: {
      ...homeV2.applications.cards,
      prediction: { ...homeV2.applications.cards.prediction, builders: 'No one has to be hired to resolve markets. When a result is disputed, Augur Lituus settles it in the open, so the team never has a ruling of its own to defend.' },
      // The fallback use keeps its sentence (owner, 6 Oct 2026; awaiting the maintainers, launch checklist).
      insurance: { ...homeV2.applications.cards.insurance, builders: 'Payouts run on the answer, with no claims team to staff. An insurance app could also use a faster oracle and turn to Augur Lituus only when a claim is disputed.' },
      // Ryan 10 (dash) on the switch card, in plain words: Augus's worry rules out "rug". The change passes its
      // vote, Augur Lituus finds it breaks the DAO's mission, and its go-live switch goes back off. The
      // question is as long as the other two cards' (41 characters; "upgrade" wrapped at 1280), so the three keep one height.
      // FLAG: a mission statement is open to interpretation (whitepaper §5 p12: objective ground truth; v2 asks
      // about a written rule), and "can’t" holds only where the upgrade waits on the answer, as the card shows.
      governance: {
        label: 'Query',
        title: 'Does this change break the DAO’s mission?',
        upgrade: { name: 'Protocol change', states: ['Voting', 'Passed'], notes: ['Open to members', 'Goes live in 2 days'] },
        oracle: { answer: 'Yes', other: 'No' },
        outcome: { status: 'Blocked', note: 'It won’t go live' },
        builders: 'The DAO stays free to change, but an upgrade that breaks its mission can’t be pushed through. The check runs outside the team, with no one to staff it.',
      },
    },
    // Augus 1 (Ryan 11, X: the block stays, with its link). His title, ask and three reasons in his order:
    // trust, work, then the dispute. The ask sits beside the "Talk to us" link to /contact/ (his "->", with no
    // arrow: an internal link, AGENTS.md). Every reason keeps two lines from 1024 to 1440, so the three
    // columns end level: "verify and challenge" without "independent … themselves", and his last line in five
    // words that keep his "not you" without the em dash or "makes the call".
    builder: {
      title: ['Good for users.', 'Easier for projects.'],
      // "Augur Lituus" in full (AGENTS.md) for his "Augur"; "you’re building" scopes the ask to builders.
      ask: ['Want Augur Lituus in a platform you use?', 'Or one you’re building?'],
      reasons: [
        // FLAG: "Win user trust." reverses Augus's 18 Oct "no trust" in this section.
        { title: 'Win user trust.', line: 'Give users outcomes they can verify and challenge.' },
        // Augus, verbatim. A fee per question (whitepaper §4.4.2 p7; fixed-price Query Tokens, §4.4.7 p9).
        { title: 'No team to hire.', line: 'Pay per question instead of running resolution in-house.' },
        // Disputes escalate in public (§2.1–2.2 p2), so a contested outcome never needs the project's ruling.
        { title: 'Stay out of the middle.', line: 'Contested outcomes go to Augur Lituus, never to you.' },
      ],
    },
  },
  howItWorks: {
    ...homeV2.howItWorks,
    // Augus's consumer case (Ryan 12, dash: the detail stays behind "Walk through an example"): how you take
    // part and how you get rewarded, so every step speaks to "you", and each gain keeps its condition beside
    // it. Plain words: no bond, appeal period or Reporter Pay. Facts: §2 p2, §4.0.2 p4, §4.1 p5, §4.3.1 p6,
    // §4.4.2–4.4.3 p7.
    path: {
      // "Anyone with REP" is who can take part, never that holding requires it (AGENTS.md).
      lead: 'Anyone with REP can take part: report what you know, and get paid in REP for being right.',
      label: 'How taking part works',
      stops: [
        // Reporter Pay rises from 0 REP toward the fee until someone reports (§4.4.3): the reason to report early.
        { title: 'Ask', note: 'Someone pays a fee', scene: 'ask', claim: ['A question comes in.', 'Its fee funds a reward.'], body: 'The longer no one reports, the bigger the reward gets.' },
        // A report stakes the fee; unchallenged, the reporter gets it back with the reward (§4.1, §4.3.1).
        { title: 'Report', note: 'Say what happened', scene: 'report', claim: ['Know the answer?', 'Report it and stake REP.'], body: 'No challenge? You get your REP back plus the reward.' },
        // A challenge stakes double on another answer and restarts the appeal period, which anyone can use (§4.0.2).
        { title: 'Challenge', note: 'Fix a wrong answer', scene: 'challenge', claim: ['Spot a wrong answer?', 'Stake double to fix it.'], body: 'Then anyone can challenge yours, and the clock starts again.' },
        // Winners share 80% of the losing stakes ("most", §4.3.1).
        { title: 'Get paid', note: 'When your answer holds', scene: 'paid', claim: ['Your answer holds?', 'You get paid in REP.'], body: 'You win most of what the wrong side staked.' },
      ],
      // walkthrough.ts's question and amounts as a story about you, the challenger who turns out right, so it
      // ends on your payout. Markup as in v2: **…** bold, {+name} your win in Green. The fee isn't the reward:
      // part of it pays whoever first backs the final answer, the rest burns (§4.3.1, §4.4.2–4.4.4), and each
      // gain in Get paid is its own (review, 29 Oct 2026).
      example: {
        label: 'An example, step by step',
        story: [
          'Someone asks, “{question}” They pay a fee of **{fee}**. Part of it pays whoever first backs the right answer; the rest is burned.',
          'Anyone can report. Someone reports **{reported}** and stakes **{bond}** on it.',
          'You know better, so you challenge with **{challenged}** and stake **{challenge}**, double theirs. Now anyone can challenge you.',
          'No one does in time, so **{final}** is the final answer. You get your {challenge} back, plus {+share} from their stake, plus {+the reward}. The other {burned} of their stake is burned.',
        ],
      },
    },
  },
  holder: {
    // Augus 2 (Ryan 13, dash): his two labels and lines, as rows of v2's Navy card, Utility's label in Green.
    // Utility gains its condition (house rule: no guarantees): rewards go only to an answer that holds
    // (§4.3.1 p6), paid in REP. Non-passivity: unmoved REP loses its value in a fork (§4.2.2 p5); nothing
    // takes the token, so his "risk losing the token" is the REP's value.
    title: 'Holding REP?',
    link: 'How REP works',
    points: [
      { label: 'Utility', text: 'Use REP to earn from participating in the oracle. You’re paid in REP when your answer holds.', earn: true },
      { label: 'Non-passivity', text: 'Check actively for forks, or risk your REP losing its value.' },
    ],
  },
  // Augus's "Coming soon?" (18 Oct) as the roadmap's heading (Roadmap.astro reads `roadmap` from a copy).
  // FLAG: no invented readiness (AGENTS.md): the roadmap's own stops put testing, audits and launch in 2027,
  // and "soon" sets no date. He asked it as a question.
  roadmap: { heading: ['Augur Lituus.', 'Coming soon.'] },
} as const;
