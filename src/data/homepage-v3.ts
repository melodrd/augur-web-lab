/** Homepage v3 copy, the /ryan/ review copy: Ryan's 17 notes, every section rewritten from them (owner,
 * 29 Oct 2026: "rewrite the copy of all sections … based on the suggestions", free to adjust a little for
 * the UI). Ryan's notes only, ignoring Augus's marks: where he gave words they are used, where he gave a
 * direction the line takes it the most direct way, in his spirit (explicit, even radical; jargon is fine
 * for him, "a general audience will follow along", but said the least technical way).
 * Facts win over a reviewer's wording (January 2026 whitepaper; docs/sources.md): his "check in at least
 * once a month" is two weeks here, since a fork is designed to give two weeks to move. Every claim keeps
 * its hedge ("designed to", "built to").
 * Structure from v2 (homepage-review.ts): the same UI system, so this object spreads homeV2 and overrides
 * every section it rewrites. The roadmap (Ryan 14: "looks fine") and Learn more (Ryan 15, which v2's Keep
 * going already applies: the blog and the FAQ as plain links) read v2's.
 * Ryan's UI notes: the hero's three reader links (16), the "?" tips (6) and no builder block (11). */
import {homeV2} from './homepage-v2';

export const homeV3 = {
  ...homeV2,
  hero: {
    // Ryan 2, his own words. The whitepaper's modelled estimate: Abstract p1 "unprecedented security", §7.5
    // p20 (46% costlier to attack than Augur's previous design), hedged by "designed to". The review UI keeps
    // the ending's last words on one line; two here, since five broke the line early at 1440.
    keep: 2,
    bodyEnd: 'lying is designed to cost more than ever before.',
    // Ryan 16: the page split into three intents on the first screen, in the hero's action area (Hero.astro,
    // home-v3.css), in place of "See how it works". Traders first, so theirs is the one Green action. Each
    // link lands on its section's heading; the REP link targets the How it works heading, not
    // #how-it-works, which would open the example (how-path-v2.js).
    paths: {
      label: 'Jump to',
      links: [
        { label: 'For traders', href: '#tenets-heading' },
        { label: 'For REP holders', href: '#how-heading' },
        { label: 'For builders', href: '#applications-heading' },
      ],
    },
  },
  why: {
    // Ryan 3, verbatim.
    lead: 'Whoever controls the oracle decides who gets paid.',
    // Ryan 4: no "parties". "Middleman" is the word a reader already has for whoever stands between a market
    // and its answer, and the line answers the lead with its own verb: whoever controls / no middleman does.
    answer: 'With Augur, no middleman controls the answers.',
    // Ryan 5, 6 and 17: the titles he named, each with a "?" that defines it (`tip`, Tenets.astro), and the
    // differentiators said outright in the claims. `diagram` picks the isometric scene: two roads, the
    // middleman who falls away, the catapult (the cost of an attack).
    tenets: [
      // Claim: Ryan 5, verbatim. Body: v1's (Ryan said nothing about it). Tip: anyone may ask (§2, §4.4.1)
      // and anyone can report or challenge (§2).
      { title: 'Permissionless', diagram: 'cross', claim: ['Anyone can ask.', 'Anyone can answer.'], body: 'Ask, answer or push back. No one has to let you in.',
        tip: { id: 'tip-permissionless', label: 'What does permissionless mean?', text: 'Open to anyone. No one approves who asks a question or who answers it.' } },
      // Claim: Ryan 17's two words, verbatim. Abstract p1: truth "is not decided by token holders, governance,
      // multisigs, or anyone else"; §2 p2: no "centralized backstops or vetoes". Body: his "no-holds-barred
      // decentralization and trustlessness", taken "all the way" in his words.
      // FLAG: "No governance." is sourced for deciding answers (Abstract p1), not for every protocol parameter.
      { title: 'Decentralized', diagram: 'authority', claim: ['No governance.', 'No multisigs.'], body: 'Trustless all the way: no one can overrule an answer.',
        tip: { id: 'tip-decentralized', label: 'What does decentralized mean?', text: 'No one is in charge, so there is no one to pressure. Answers come from many independent people.' } },
      // Claim: Ryan 17's attack cost "higher than ever before", as a ranking, since the hero already says
      // "more than ever before". The whitepaper's modelled estimate: Abstract p1, "significantly more resistant
      // to attack than all current offerings"; §3 p3, the costliest to attack of the designs surveyed (134% of
      // FDV). "Built to be" keeps it a design aim. Body: why, as a mechanism (each challenge doubles the bond,
      // §2.1 p2, §4.1 p5). No "money", "bond" or "stake" in this section, so nothing suggests money buys the
      // answer. Tip: v1's approved body for this card.
      { title: 'Bribery-resistant', diagram: 'mesh', claim: ['Built to be the costliest', 'oracle to attack.'], body: 'By design, every challenge doubles the cost of a lie.',
        tip: { id: 'tip-bribery-resistant', label: 'What does bribery-resistant mean?', text: 'Paying for a false answer is designed to cost more than it brings in.' } },
    ],
    // The closer statement stays: "The answer is nobody’s call."
    paths: [
      // Ryan 7: say outright that traders have seen markets misresolve ("misresolve" is his word), then the
      // payoff he asked to sharpen: v1's "no authority deciding alone" becomes no authority deciding at all.
      // "Probably" keeps the unsourced "many traders" a guess about the reader, never a statistic.
      { who: 'For traders', line: ['You’ve probably seen a market misresolve.', 'Here, no authority decides the outcome.'] },
      // Ryan 8: liability first (his PR disasters and backlash from bad resolutions), then why it goes away:
      // the integrator's team never rules on the outcome. "Your team" is scoped by "For builders" (AGENTS.md).
      // "For builders", not his "For integrators": the site's name for them, and the hero link's.
      { who: 'For builders', line: ['One bad resolution can turn into a PR disaster.', 'With Augur Lituus, your team isn’t the judge.'] },
    ],
  },
  applications: {
    // Ryan 9, verbatim: one sentence ("It asks a question and acts on the answer." goes).
    lead: homeV2.applications.lead,
    // Ryan 10: the DAO case checks a change against the DAO's mission statement or constitution. On the review
    // UI the tab reads only `summary` (Applications.astro spreads it over v1's case).
    governance: {
      summary: 'Proposed improvements and protocol changes checked against a DAO’s mission statement or constitution.',
    },
    cards: {
      ...homeV2.applications.cards,
      // Each builders paragraph leads with Ryan 8's liability (a disputed result is never a ruling the team has
      // to defend, so it isn't the team's PR problem), then the labour (no one to hire). Ryan 11 sends the
      // builder block's points back to where they started: they live here now.
      prediction: { ...homeV2.applications.cards.prediction, builders: 'No one on the team picks the winner, so a disputed result is never a ruling the team has to defend in public. There’s no resolution staff to hire, either.' },
      // "Turns a claim down" is the decision users push back on. The fallback use keeps its sentence (owner, 6 Oct
      // 2026; awaiting the maintainers, launch checklist).
      insurance: { ...homeV2.applications.cards.insurance, builders: 'No one on staff turns a claim down: the answer decides. An insurance app could also use a faster oracle and turn to Augur Lituus only when a claim is disputed.' },
      // Ryan 10 on the switch card, in his word "change": the change passes its vote, Augur Lituus finds that it breaks the
      // DAO's mission, and its go-live switch goes back off. His "developers can't rug or attack users" and
      // "DAOs remain open-ended" are the paragraph. The question is as long as the other two cards' (41
      // characters; "upgrade" wrapped at 1280), so the three cards keep one height.
      // FLAG: a mission statement is open to interpretation; the whitepaper asks for questions with an objective
      // ground truth (§5 p12) and resolves an unanswerable one Invalid (§4.0.1 p3). v2 asks about a written rule.
      // FLAG: "can’t" is a guarantee; it holds only where the DAO's upgrade waits on the answer, as the card shows.
      governance: {
        label: 'Query',
        title: 'Does this change break the DAO’s mission?',
        upgrade: { name: 'Protocol change', states: ['Voting', 'Passed'], notes: ['Open to members', 'Goes live in 2 days'] },
        oracle: { answer: 'Yes', other: 'No' },
        outcome: { status: 'Blocked', note: 'It won’t go live' },
        builders: 'Developers can’t rug users with an upgrade that strays from the mission: it’s blocked first. The DAO stays open-ended, and changes that fit still go live.',
      },
    },
    // Ryan 11: no builder block (Applications.astro renders it only when the copy has a `builder`). Its ask
    // lives in the header's and the footer's "Talk to us".
  },
  howItWorks: {
    ...homeV2.howItWorks,
    // Ryan 12: less on the main scroll. The UI already keeps the example behind "Walk through an example";
    // the words on the scroll are cut to the rule, one short line each, in the whitepaper's terms (§2 p2,
    // §4.0.2 p4, §4.1 p5, §4.3.1 p6, §4.4.2–4.4.3 p7).
    path: {
      lead: 'Stake REP on what happened. Right answers get paid; wrong ones lose their stake.',
      label: 'How taking part works',
      stops: [
        // Reporter Pay starts at 0 REP and rises toward the fee until someone reports (§4.4.3).
        { title: 'Ask', note: 'A fee in REP', scene: 'ask', claim: ['Ask a question.', 'Its fee funds the reward.'], body: 'The reward climbs from zero until someone reports.' },
        // An unchallenged reporter gets the bond back with the reward (§4.1, §4.3.1).
        { title: 'Report', note: 'Stake on an answer', scene: 'report', claim: ['Report what happened.', 'Stake REP on it.'], body: 'Unchallenged, your stake comes back with the reward.' },
        // A challenge stakes double the bond on another answer and restarts the appeal period (§4.0.2).
        { title: 'Challenge', note: 'Stake double', scene: 'challenge', claim: ['Think it’s wrong?', 'Stake double to challenge.'], body: 'Each challenge restarts the clock on the new answer.' },
        // Winners share 80% of the losing stakes ("most") and 20% burns (§4.3.1): the tokenomics Ryan asks for.
        { title: 'Get paid', note: 'If your answer holds', scene: 'paid', claim: ['No challenge in time?', 'That answer is final.'], body: 'Its backers win most of the losing stake. The rest is burned.' },
      ],
      // walkthrough.ts's question and amounts, one sentence per step, cut to what happens. Markup as in v2:
      // **…** bold, {+name} your win in Green. The fee isn't the reward: part of it pays whoever first backs the final
      // answer, the rest burns (§4.3.1, §4.4.2–4.4.4), and each gain in Get paid is its own (review, 29 Oct 2026).
      example: {
        label: 'An example, step by step',
        story: [
          'Someone asks, “{question}” The fee is **{fee}**. Part of it pays whoever first backs the right answer; the rest is burned.',
          'Someone else reports **{reported}** and stakes **{bond}** on it.',
          'You challenge with **{challenged}** and stake **{challenge}**, double theirs. The clock restarts on your answer.',
          'No one challenges you in time, so **{final}** is final. You get your {challenge} back, plus {+share} from their stake, plus {+the reward}. The other {burned} of their stake is burned.',
        ],
      },
    },
  },
  holder: {
    // Ryan 13: what you can do with REP, then the reminder that holding it isn't passive. Each row is v2's
    // Navy card row, its `label` the term; Earn's in Green.
    // - Report and stake are his two uses. Staking is how you report or challenge (the bond, §4.1 p5; the only
    //   staking in the paper), so "stake" is backing an answer in a dispute, never staking for a yield; both
    //   pay only when the answer holds (§4.3.1 p6).
    // - The fork: a two-week, one-way migration window, a proposed design (§2.2 p2; Lituus-CS forking isn't
    //   built), hence "designed to"; REP left behind loses its value (§4.2.2 p5). His monthly check could miss
    //   a two-week window, so the check-in matches the window. Migrating isn't reporting or challenging, so
    //   nothing here says holders must take part.
    title: 'Holding REP?',
    link: 'How REP works',
    points: [
      { label: 'Report to earn', text: 'Say what happened and earn the reward when your answer holds.', earn: true },
      { label: 'Stake on the truth', text: 'Back the right answer in a dispute and win most of the losing stake.' },
      { label: 'Never passive', text: 'A fork is designed to give you two weeks to move your REP, and REP left behind loses its value. Check in at least every two weeks.' },
    ],
  },
} as const;
