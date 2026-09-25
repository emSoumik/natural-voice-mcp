# ai tells

Audit every draft against this list before returning it. Adapted from the humanizer skill (based on Wikipedia's "Signs of AI writing"), trimmed to what shows up in personal writing, plus newer tells common in 2025 and 2026 model output.

The audit is silent. Fix the text and return only the final version.

---

## A. content tells

**1. puffed significance.** "marks a pivotal moment", "a testament to", "plays a crucial role", "reflects a broader shift", "evolving landscape", "setting the stage for".
→ Say what happened. "i taught a workshop" not "this workshop marked a pivotal step in my journey".

**2. fake depth with -ing tails.** "..., highlighting the importance of teamwork", "..., showcasing my ability to...", "..., fostering a culture of...".
→ Delete the tail, or make it its own plain sentence with a real fact.

**3. promo language.** vibrant, seamless, cutting edge, groundbreaking, stunning, world class, game changer, powerful, robust.
→ Describe what it does.

**4. vague authority.** "experts say", "many believe", "studies show" with nothing behind it.
→ Name the source or drop the claim.

**5. challenges then triumph.** "despite these challenges, i persevered and grew".
→ Name the actual problem and what you did.

**6. generic upbeat ending.** "excited for what's ahead!", "the future is bright", "this is just the beginning", "onwards and upwards".
→ End on a specific next step or a real reason. Or just stop.

**7. summary ending.** "in conclusion", "overall", "all in all", "at the end of the day", a closing paragraph that restates the piece.
→ Cut it.

---

## B. language tells

**8. ai vocabulary.** delve, tapestry, testament, underscore, foster, garner, intricate, interplay, pivotal, crucial, landscape, realm, embark, journey (as metaphor), navigate (as metaphor), elevate, empower, unlock, harness, leverage, seamless, robust, additionally, furthermore, moreover.
→ Full swap list in `word-bank.md`.

**9. copula avoidance.** "serves as", "stands as", "functions as", "boasts", "features".
→ Use is, are, has.

**10. negative parallelism.** "it's not just X, it's Y", "not only X but also Y", "this isn't about X. it's about Y."
→ Say Y. A trailing "not just X" clause is allowed once (see voice profile).

**11. reflexive rule of three.** "fast, simple, and powerful", "learn, build, and grow". Lists of three abstract nouns.
→ Use two, or the real number of things. Three is fine when there are actually three concrete things.

**12. synonym cycling.** "the app... the platform... the tool... the solution" for the same thing.
→ Repeat the same word. Humans do.

**13. false range.** "from beginners to experts", "from design to deployment" when it isn't a real spectrum.
→ Name what's actually covered.

**14. stacked hedging.** "it could potentially be argued that this might...".
→ One qualifier max, or none. Note: honest uncertainty ("still figuring out") is not hedging. Keep that.

**15. filler.** "in order to", "due to the fact that", "it's important to note", "at this point in time", "in terms of", "when it comes to".
→ to, because, (delete), now, (rephrase), (rephrase).

---

## C. style tells

**16. em and en dashes.** — and –. The strongest single tell. Never use them. Also avoid `--` and ` - ` as punctuation in prose.

**17. staccato slogan lines.** Strings of very short declaratives meant to sound punchy: "started as a user. ended as a contributor." / "no fluff. just results." / "open source wins." / "that's the real edge."
→ Max one per piece, and only when the line carries a real, specific idea. Prefer the comma rhythm.

**18. colon reveals.** "here's the thing:", "the secret?", "the result:", "the best part?".
→ Just say it.

**19. bold overuse and bold-label bullets.** `- **Speed:** it's faster`.
→ up to 4 bold terms at level 2, none elsewhere. Turn label lists into sentences.

**20. emoji decoration.** 🚀 💡 ✅ at the start of lines or headings.
→ None, except 1 to 3 in community announcements.

**21. Title Case Headings.**
→ sentence case at levels 4 and 5, lowercase at 1 to 3.

**22. curly quotes.** “ ” ‘ ’
→ Straight quotes.

**23. uniform hyphenation.** third-party, data-driven, real-time, long-term, high-quality, decision-making, end-to-end, all hyphenated consistently.
→ Drop the hyphen in casual prose ("long term", "real time"). Keep it only where meaning needs it or it's a proper name (e.g. "poke-gate" as a repo name).

**24. same length sentences.** Every sentence 12 to 18 words, every paragraph 3 sentences.
→ Vary. One long comma chain, one short line, one medium.

**25. perfect parallel structure everywhere.** Every bullet starts with a verb, every paragraph opens with a topic sentence.
→ Let a little shape go uneven.

---

## D. chat residue (never in sendable text)

**26.** "here's a rewrite", "sure!", "certainly!", "great question", "i hope this helps", "let me know if you'd like me to...", "want me to make it more casual?", "feel free to adjust".

**27.** Knowledge cutoff hedges: "as of my last update", "while details are limited".

**28.** Sycophancy toward the reader: "you're absolutely right", "what a great idea".

---

## E. soul check (humanizer's other half)

Clean but lifeless text is also a tell. After removing patterns, check:

- Is there at least one specific detail only this person would know?
- Is there a real opinion or feeling, stated once, plainly?
- Does the rhythm vary?
- Is there any honesty about uncertainty or mixed feelings, if the situation has it?
- Would a friend recognize the writer?

If the answer to most is no, the draft is sterile. Add from what the user gave you, never from imagination.
