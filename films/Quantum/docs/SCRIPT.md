# |ψ⟩ — a hundred years of the wave function, in one notebook

A short film about **quantum theory as a language**: a hundred years after Schrödinger wrote down the wave
equation (January 1926), its objects -- states, operators, measurements, channels, circuits -- are words of the
Wolfram Language, and one line of code says what a 1926 paper needed pages for.  It is told with the
[Wolfram Quantum Framework](https://resources.wolframcloud.com/PacletRepository/resources/Wolfram/QuantumFramework/)
(`Wolfram/QuantumFramework`, QF), and every picture, number and **note** on screen is computed by it.

**Length** 2:42 (81 bars) · **Tempo** 120 BPM, so 1 bar = 2.000 s and 1 beat = 0.500 s · **Picture** 1920×1080 ·
**Sound** a score composed in code, no narration · **Built** as `films/Quantum/Quantum.md`, a notebook made with WAnim,
like In1

## The idea

**Every note is a measurement.**  The soundtrack is played by quantum states being measured: a WAnim `Track` whose
events are the outcomes of QF measurements (seeded, so the film is reproducible).  The music *is* the physics, so
the story can be heard as well as seen:

| Physics | What you hear |
|---|---|
| a qubit in superposition, measured every 16th | a hi-hat that plays half the time, at random: the Born rule as a groove |
| a Bell pair, both halves measured | kick and snare that always agree, however random each one is: entanglement |
| a GHZ state of three | three voices in unison; a W state of three: exactly one of them, every step |
| a qutrit (d = 3) | the three notes of a triad, one level each |
| amplitude damping (a Lindblad channel) | the mix decays into reverb: decoherence |
| Grover's search | probability flowing onto one pitch until the melody lands on it |
| phase estimation | a phase read out, bit by bit, as a pitch |

**One notebook, one hundred years.**  Each step of the history is shown twice: first as it was written (the
formula in a 1920s typeset paper, on paper), then as one line of QF code, typed and evaluated in a notebook,
its output drawn by the framework itself.  The paper fades; the code stays.

The HUD is a timeline 1900 → 2026 along the bottom and, from 2021, the framework's own counter: its commits.

## The facts the film stands on

Status: **✓** checked against the source given; **○** standard history, source given, to be checked against the
primary source before the film is final.  Framework facts come from its repository (`~/src/wolfram/QuantumFramework`)
and its own reports.

| Fact | Value | Source | |
|---|---|---|---|
| Planck's quantum | presented 14 Dec 1900, German Physical Society | Verh. Dtsch. Phys. Ges. 2, 237 (1900) | ○ |
| Heisenberg, matrix mechanics | June 1925, on Helgoland; "Umdeutung" paper received 29 Jul 1925 | Z. Phys. 33, 879 (1925); IYQ 2025 materials | ✓ (Helgoland, June 1925) |
| The centenary | 2025 is the UN International Year of Quantum Science and Technology, for the centenary of quantum mechanics; launched 4 Feb 2025 at UNESCO | [Physics World](https://physicsworld.com/a/international-year-of-quantum-science-and-technology-2025-heres-all-you-need-to-know/), [quantum2025.org](https://quantum2025.org/about-iyq-2025/) | ✓ |
| Schrödinger's equation | "Quantisierung als Eigenwertproblem", received 27 Jan 1926 | Ann. Phys. 79, 361 (1926) | ○ |
| Born's rule | probability interpretation, received 25 Jun 1926 | Z. Phys. 37, 863 (1926) | ○ |
| von Neumann | measurement as an interaction that entangles system and apparatus; the density matrix | *Mathematische Grundlagen der Quantenmechanik* (1932) | ○ |
| Wigner's quasi-probability | 1932 | Phys. Rev. 40, 749 (1932) | ○ |
| EPR | "Can quantum-mechanical description of physical reality be considered complete?", 15 May 1935 | Phys. Rev. 47, 777 (1935) | ○ |
| "Entanglement" | Schrödinger names it (*Verschränkung*), 1935 | Proc. Camb. Phil. Soc. 31, 555 (1935) | ○ |
| Dirac's notation | bras and kets, 1939 | Proc. Camb. Phil. Soc. 35, 416 (1939) | ○ |
| Bell's theorem | 1964 | Physics 1, 195 (1964) | ○ |
| CHSH | classical bound 2 (1969); quantum maximum 2√2 (Tsirelson, 1980) | PRL 23, 880 (1969); Lett. Math. Phys. 4, 93 (1980) | ○ |
| Lindblad equation | 1976 (and Gorini-Kossakowski-Sudarshan, 1976) | Commun. Math. Phys. 48, 119 (1976) | ○ |
| Feynman | "Nature isn't classical, dammit, and if you want to make a simulation of nature, you'd better make it quantum mechanical" -- talk May 1981, published 1982 | Int. J. Theor. Phys. 21, 467 (1982) | ○ (quote wording to check) |
| Deutsch | the universal quantum computer, 1985 | Proc. R. Soc. A 400, 97 (1985) | ○ |
| Teleportation | Bennett et al., 1993 | PRL 70, 1895 (1993) | ○ |
| Shor | factoring, 1994; the 9-qubit code, 1995 | FOCS 1994; PRA 52, R2493 (1995) | ○ |
| Grover | search, 1996 | STOC 1996 (PRL 79, 325, 1997) | ○ |
| Stabilizers | Gottesman 1997; the Aaronson-Gottesman tableau QF's `PauliStabilizer` uses, 2004 | Caltech thesis (1997); PRA 70, 052328 (2004) | ○ |
| ZX-calculus | Coecke and Duncan, 2008 | ICALP 2008 | ○ |
| Quantum in the cloud | IBM puts a 5-qubit processor online, 4 May 2016 | IBM press release | ○ |
| OpenQASM | 2017 | arXiv:1707.03429 | ○ |
| Bell tests, Nobel | Aspect, Clauser, Zeilinger, Physics 2022 | nobelprize.org | ○ |
| **QF begins** | initial commit 10 Sep 2021 | QF git history | ✓ |
| QF 1.0 | 4 Dec 2021 | QF git history (PacletInfo) | ✓ |
| QF on Amazon Braket | 2 Aug 2023 | [AWS blog](https://aws.amazon.com/blogs/quantum-computing/introducing-the-wolfram-quantum-framework-for-amazon-braket/), [Wolfram blog](https://blog.wolfram.com/2023/08/04/quantum-computation-wolfram-language-meets-amazon-braket/) | ✓ |
| QF 2.0 / 2.1 | 6 May 2026 / 28 Jul 2026 | QF git history | ✓ |
| QF's size | 2,891 commits to date; 222 / 564 / 641 / 692 / 304 / 468 commits a year, 2021-26 | QF git history | ✓ |
| One object model | state, operator, channel (Stinespring form), measurement (von Neumann dilation), circuit; exact and symbolic by default; any qudit dimension; basis a first-class attribute | QF's `OngoingProjects/QF-At-A-Glance.md` | ✓ |
| Three engines | tensor network (default), Schrödinger, stabilizer | same | ✓ |
| A thousand qubits | a 1,000-qubit, 2×10⁴-gate Clifford stream in under 60 ms on the stabilizer engine | same (June 2026 rewrite) | ✓ (their benchmark; re-run on the film machine) |
| Named textbook objects | circuits `"Deutsch"`, `"DeutschJozsa"`, `"Simon"`, `"BernsteinVazirani"`, `"Grover"`, `"Fourier"`, `"PhaseEstimation"`, `"CHSH"`, `"LeggettGarg"`, `"GHZ"`, `"Bell"`, `"Trotterization"`, ...; states `"Bell"`, `"GHZ"`, `"W"`, `"Dicke"`, `"Werner"`, `"Graph"`; channels `"BitFlip"`, `"Depolarizing"`, `"AmplitudeDamping"`, ... | QF source, `Named*.m` | ✓ |
| Real hardware | OpenQASM 2/3 import/export in pure WL; `IBMJobSubmit` returns the same `QuantumMeasurement` an exact simulation gives | QF-At-A-Glance.md | ✓ |

## Look

- **Two grounds.** Paper `#F4F1EA` for the history (the formula as its paper set it: Source Serif 4, the era's
  notation), and the notebook on deep ink `#0E0F11` for the code, WAnim's "Manim" theme.  Each era's formula
  dissolves into its line of code.
- **The framework draws itself.** Every picture is a QF output: `["Diagram"]` circuits drawing gate by gate,
  `["BlochPlot"]`, `["ProbabilityPlot"]`, Wigner surfaces, stabilizer tableaux, ZX spiders, Dirac-notation output.
- **One accent per idea.** Probability amplitudes in Manim blue, phases as hue (QF's own phase colouring),
  the classical bound and anything classical in grey, entanglement in Wolfram red `#DD1100`.
- **Motion**: holds and snaps, as In1.  Measurements land on 16ths; every cut lands on a downbeat.

## Shot list (bar = 2 s), 81 bars / 2:42

| Bars | Time | Section | Picture · caption · what you hear |
|---|---|---|---|
| 0–4 | 0:00 | **Cold open** | Black.  `m = QuantumMeasurementOperator[][QuantumState["Plus"]]` typed; `m["SimulatedMeasurement"]` -- a 0 or a 1, again and again.  "Every sound in this film is a measurement." · a lone hi-hat, half the 16ths, at random |
| 4–8 | 0:08 | **1900 · 1925** | Paper: Planck's *E = hν*.  Then Heisenberg on Helgoland: *pq − qp = h/2πi*.  It becomes `Commutator[QuantumOperator["X"], QuantumOperator["Y"]]` → `2 I Z`.  "1925. Physics becomes matrices that do not commute." · bass enters on the commutator |
| 8–14 | 0:16 | **1926 · the wave function (DROP)** | "*Quantisierung als Eigenwertproblem*", 27 January 1926.  Card: **100 years**.  A driven qubit: `QuantumEvolve[H, ψ0, t]` -- its state in closed form, its Bloch vector spiralling on the sphere (README example 3).  · the full groove: the drums are now measurements of the evolving state |
| 14–18 | 0:28 | **1926 · Born** | The amplitudes become probabilities: `ψ["ProbabilityPlot"]` beside the hi-hat's live counts converging on them.  "The square of an amplitude is a chance." |
| 18–22 | 0:36 | **1932 · von Neumann, Wigner** | A measurement in QF is an entangling gate onto a record wire (wire 0): the diagram shows it.  "A measurement entangles the apparatus. Here it still does."  Then a cat state's Wigner function, its negative fringes in red. |
| 22–26 | 0:44 | **1935 · entanglement** | EPR's title, then Schrödinger's word.  `QuantumState["PhiPlus"]` in Dirac form: (|00⟩ + |11⟩)/√2.  · kick and snare join: each random, always together |
| 26–28 | 0:52 | **1939 · Dirac** | Kets set in 1939 type become QF's own kets.  "One notation, then and now." |
| 28–32 | 0:56 | **1964 · Bell** | `QuantumCircuitOperator["CHSH"]`: the correlation climbs a gauge past the classical **2** to **2√2**.  "1982: Aspect measures it. 2022: the Nobel Prize." |
| 32–36 | 1:04 | **1976 · open systems** | `QuantumChannel["AmplitudeDamping"[γ]]` and the Lindblad equation: the Bloch vector spirals in to the pole.  · the mix decays into reverb, then dries |
| 36–38 | 1:12 | **Breakdown · 1981** | Black. Feynman, typed: "Nature isn't classical, dammit…" |
| 38–44 | 1:16 | **Quantum computers (DROP 2)** | Circuits drawing themselves, one per bar: `"Deutsch"` (1985) → teleportation (1993: the measurement record is a wire, the correction a controlled gate) → `"Fourier"` (Shor, 1994) → `"Grover"` (1996). · Grover heard: amplitude pouring onto one pitch, the melody landing on it |
| 44–48 | 1:28 | **1995 · error correction** | A bit flip hits a qubit (`QuantumChannel["BitFlip"[p]]`); the code catches it; the state comes back.  "Errors, digitized and corrected." |
| 48–52 | 1:36 | **1997 · stabilizers** | `PauliStabilizer` tableau of a GHZ state; then 1,000 qubits, 20,000 gates, done before the beat ends. · the GHZ unison: three voices, one outcome |
| 52–56 | 1:44 | **2008 · 2016 · 2019** | ZX spiders (2008).  Quantum in the cloud (2016); OpenQASM text pouring out of `QuantumQASM` (2017).  "Quantum computers, anyone can reach." |
| 56–62 | 1:52 | **2021 · the framework** | A git log scrolling from "Initial commit" (10 Sep 2021); the commit counter racing to **2,891**; versions 1.0 → 2.1 on the timeline.  The five objects -- state, operator, channel, measurement, circuit -- assemble into one diagram: one algebra. |
| 62–66 | 2:04 | **Any dimension** | A qutrit: `QuantumState["Plus", 3]`'s three levels light up three notes. · the chords become qutrit measurements |
| 66–74 | 2:12 | **Climax** | All of it at once: the exact propagator as a formula, the Bloch sphere, the Wigner surface, the CHSH gauge at 2√2, the 1,000-qubit tableau as a wall of bits (In1's word wall, in qubits), a hardware histogram beside the ideal one. · everything measured, everything in time |
| 74–81 | 2:28 | **Outro** | A fresh notebook: `In[1]:= QuantumState["0"]` → \|0⟩.  "1926 – 2026. Still the first line."  `PacletInstall["Wolfram/QuantumFramework"]`.  Credits. |

## The score

Written as WAnim `Track`s, with the drum and note *events* drawn from QF measurements:
`QuantumMeasurementOperator[...][state]["SimulatedMeasurement", n]` on each section's state, `SeedRandom`ed, sampled on the 16th-note
grid; amplitudes set velocities; measuring a Bell pair gives two voices from one outcome.  Key and harmony
change with the history (a single pitch class for the cold open; triads from qutrits at 2:04).  The same
`Track` drives the pictures' pulses, as In1's kick drove Spikey.

## Open questions

1. **Title.**  Working title "|ψ⟩"; the film's folder is `films/Quantum`.
2. **Real hardware.**  The climax's hardware histogram needs an IBM Quantum run (`IBMJobSubmit`, an account);
   otherwise a QF noisy simulation stands in, labelled as such.
3. **People on screen.**  The physicists are named in captions; the framework's contributors only in the credits?
4. **Language cuts.**  English only, or Russian and Japanese too, as In1?
