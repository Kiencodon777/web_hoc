# Information-theory question audit

Input: SV-ôn-thi-1.pdf, 21 pages, 151 distinct question numbers. Identical repeated rows 26 and 27 omitted. Sources were consulted on 2026-10-23. Reproduce with tools/import-information.py; the reviewed reasoning is in information-solutions.json; source URLs and titles are in dist/question-sources.js.

This is a worked reference key, not an official lecturer key. It is not appropriate to force a single answer where the original is defective. Eight items are ungraded; five accept multiple alternative selections (the learner selects one, not a multi-select combination).

| Question | Finding |
|---|---|
| 20 | A lower frequency bound does not specify a Nyquist rate. 8000 Hz assumes the intended word is maximum, not minimum. |
| 52 | p(y|x)=1 alone does not imply equal self-information. D interpreted as insufficient information; constant-output counterexample supplied. |
| 53 | Forward transition probability below one does not imply lost information about X. Disjoint output alphabets provide a counterexample. |
| 55 | Both probability-chain factorizations C/D are valid. |
| 59 | Joint self-information and pointwise mutual information use the same printed notation. Conditional intended identity explained, not graded. |
| 63 | Printed B is wrong: deterministic entropy is zero; maximum over a fixed alphabet is attained by the uniform distribution, A. |
| 69 | Conditional entropy/equivocation is not an average error probability. None of the supplied labels is precise. |
| 77 | A/B/C are false under the standard meaning of message; accept all three alternatives. |
| 80 | C explicitly has the wrong sign, but B is also ambiguous; intended C stated, no automatic grading. |
| 101 | Caesar T+7=A. Both A and D print the same answer A. |
| 106 | Both identity-left and identity-right generator matrices are systematic. |
| 112 | Symmetric versus public-key assumptions missing. |
| 129 | Key reuse depends on the construction: never reuse one-time pad; GCM permits repeated-key invocations subject to unique IV and usage bounds. |
| 135 | Prefix-free and distinct fixed-length codewords are both sufficient for unique decoding. Prefix-free is not necessary. |
| 143 | Every option has a prefix collision; no valid choice. |

Other simplifications (noise model, receiver functions, throughput terminology, strict Nyquist boundary, lossless coding, stationarity, independent-symbol assumption, zero initial encoder state and cryptographic security assumptions) are annotated on their specific questions.

Cross-check families: Shannon's original communication paper and MIT OCW for information measures/source coding; MathWorks plus Texas Instruments for sampling; MIT plus Cisco/NI for modulation; MathWorks plus MIT for coding matrices; Cornell plus Handbook of Applied Cryptography and NIST for cryptography. Sources support concepts; the letter selections and arithmetic were worked independently. No unofficial answer-sharing site was used as an authority.
