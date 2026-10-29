/** The homepage's use cases: Homepage 28:7, then the owner's passes of 18–19 Oct 2026. Prediction markets
 * leads; DAOs & governance replaced DAOs & grants on 19 Oct (owner), since every earlier case ended in a
 * payment and the lead promises any app that needs to know what happened. Each case has a `summary` of the
 * kind of app it stands for (owner asked for SEDA- and UMA-style explanations, not copied; new copy, awaiting
 * approval). Each version's product cards (homepage-v2.ts `cards`) show what the case's app does with an answer. */
export const applications = [
  { id: 'prediction', title: 'Prediction markets', summary: 'Markets on any question with a result people can check: sports, elections, launches, weather or company news.' },
  { id: 'insurance', title: 'Insurance & payments', summary: 'Coverage and payments that trigger when something measurable happens: a delayed flight, a missed delivery, a storm or a canceled event.' },
  { id: 'governance', title: 'DAOs & governance', summary: 'Proposals and grants that wait on real-world facts: an audit result or a milestone met.' },
] as const;
