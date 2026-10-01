# ψ — the quantum century

A short film about **quantum theory**: how, between 1900 and today, physics learned that the world is made of
amplitudes -- waves of possibility that interfere, spread, tunnel, entangle, and become a definite click only when
something looks.  2026 is a hundred years since Schrödinger wrote down the wave equation (January 1926), and the film's
protagonist is that wave function, ψ: one complex wave, drawn with its phase as colour, that travels the whole film --
through a double slit, into an atom, through a barrier, across a laboratory, into a computer.

**Length** 2:42 (81 bars) · **Tempo** 120 BPM, so 1 bar = 2.000 s and 1 beat = 0.500 s · **Picture** 1920×1080 ·
**Sound** a score composed in code, no narration · **Built** as `films/Quantum/Quantum.md`, a notebook made with WAnim

Not a tutorial: no code on screen except where code is the point.  Every picture is *computed* -- solved, sampled
or simulated in the Wolfram Language (NDSolve, special functions, Fourier transforms, the Wolfram Quantum Framework
for the discrete systems, archive photographs for the people) -- so the classic images of quantum physics are
recreated, not copied.

## The idea

**The wave and the click.**  Quantum theory has two faces, and so does the film.  The *wave* is continuous, smooth,
deterministic, beautiful: ψ in phase colour, evolving by Schrödinger's equation.  The *click* is discrete, random,
final: a dot on a screen, a detector firing.  The picture is the wave; the rhythm is the clicks.

**The music is quantum too.**

| Physics | What you hear |
|---|---|
| single particles arriving at a screen, sampled from \|ψ\|² | the hi-hats and clicks: random, but building a pattern |
| the hydrogen atom's spectral lines (Rydberg: 1/n² − 1/m²) | the melody and its chords: the Balmer lines as pitches -- the atom's own chord |
| the harmonic oscillator's evenly spaced levels | the bass: an evenly stepped line |
| a particle in a box (levels ∝ n²), its revivals | the arpeggio that returns exactly on itself (the quantum carpet) |
| two entangled particles measured | kick and snare: each random, always together |
| decoherence | the mix losing its reverb tail, interference fading |

## The facts the film stands on

Status: all rows checked against the papers and their DOI records on 2026-10-02; details, scans and the one
correction (Dirac's 1928 paper did not itself predict antimatter: that was 1931) are in `SOURCES.md`.

| Year | Fact | Source | |
|---|---|---|---|
| 1900 | Planck's quantum of action: the blackbody law, *E = hν*; presented 14 Dec 1900 | Verh. Dtsch. Phys. Ges. 2, 237 (1900) | ✓ |
| 1905 | Einstein: light comes in quanta (photoelectric effect) | Ann. Phys. 17, 132 (1905) | ✓ |
| 1913 | Bohr's atom: the hydrogen lines from quantized orbits | Phil. Mag. 26, 1 (1913) | ✓ |
| 1922 | Stern-Gerlach: a beam of silver atoms splits in two | Z. Phys. 9, 349 (1922) | ✓ |
| 1924 | de Broglie: matter is a wave, λ = h/p | thesis, Paris (1924) | ✓ |
| 1925 | Heisenberg, on Helgoland, in June: matrix mechanics -- quantities that do not commute | Z. Phys. 33, 879 (1925); [IYQ 2025](https://quantum2025.org/about-iyq-2025/) | ✓ |
| 1925 | Pauli's exclusion principle; spin (Uhlenbeck, Goudsmit) | Z. Phys. 31, 765 (1925); Naturwiss. 13, 953 (1925) | ✓ |
| 2025 | the UN International Year of Quantum Science and Technology, for the centenary | [Physics World](https://physicsworld.com/a/international-year-of-quantum-science-and-technology-2025-heres-all-you-need-to-know/) | ✓ |
| 1926 | Schrödinger's wave equation, "Quantisierung als Eigenwertproblem", received 27 Jan 1926 | Ann. Phys. 79, 361 (1926) | ✓ |
| 1926 | Born: \|ψ\|² is a probability | Z. Phys. 37, 863 (1926) | ✓ |
| 1927 | Heisenberg's uncertainty relation | Z. Phys. 43, 172 (1927) | ✓ |
| 1927 | Davisson-Germer: electrons diffract like waves | Phys. Rev. 30, 705 (1927) | ✓ |
| 1927 | The Solvay conference, Brussels, October: the photograph of 29 physicists, 17 of them Nobel laureates | Solvay Institutes | ✓ |
| 1928 | Dirac's relativistic equation; antimatter predicted from it in 1931; the positron found 1932 (Anderson) | Proc. R. Soc. A 117, 610 (1928); Phys. Rev. 43, 491 (1933) | ✓ |
| 1928 | Gamow: alpha decay is tunneling | Z. Phys. 51, 204 (1928) | ✓ |
| 1932 | Wigner's quasi-probability distribution | Phys. Rev. 40, 749 (1932) | ✓ |
| 1935 | EPR, 15 May; Schrödinger's cat and the word *entanglement* | Phys. Rev. 47, 777 (1935); Naturwiss. 23, 807 (1935); Proc. Camb. Phil. Soc. 31, 555 (1935) | ✓ |
| 1947–48 | the transistor (Bell Labs, Dec 1947); Feynman's path integral (1948) | Rev. Mod. Phys. 20, 367 (1948) | ✓ |
| 1960 | the laser (Maiman, 16 May 1960) | Nature 187, 493 (1960) | ✓ |
| 1964 | Bell's theorem; CHSH bound 2 (1969), quantum maximum 2√2 (Tsirelson 1980) | Physics 1, 195 (1964); PRL 23, 880 (1969) | ✓ |
| 1965 | "I think I can safely say that nobody understands quantum mechanics." -- Feynman | *The Character of Physical Law* (1965) | ✓ |
| 1976 | Hofstadter's butterfly: electrons in a magnetic field, a fractal spectrum | Phys. Rev. B 14, 2239 (1976) | ✓ |
| 1980 | the quantum Hall effect (von Klitzing) | PRL 45, 494 (1980) | ✓ |
| 1981 | Feynman: "Nature isn't classical, dammit, and if you want to make a simulation of nature, you'd better make it quantum mechanical" | Int. J. Theor. Phys. 21, 467 (1982) | ✓ |
| 1982 | Aspect's Bell test | PRL 49, 1804 (1982) | ✓ |
| 1984 | Heller's scars: quantum chaos remembers classical orbits | PRL 53, 1515 (1984) | ✓ |
| 1989 | Tonomura: single electrons build up a double-slit pattern | Am. J. Phys. 57, 117 (1989) | ✓ |
| 1994–96 | Shor's factoring; Grover's search | FOCS 1994; STOC 1996 | ✓ |
| 1995 | Bose-Einstein condensate (Cornell, Wieman; Ketterle) | Science 269, 198 (1995) | ✓ |
| 2019 | a quantum processor outruns a supercomputer on one task (Google Sycamore, 23 Oct 2019) | Nature 574, 505 (2019) | ✓ |
| 2022 | Nobel Prize in Physics to Aspect, Clauser, Zeilinger for entanglement experiments | nobelprize.org | ✓ |

## Look

- **ψ in phase colour.**  The wave function is drawn the way physicists draw complex fields: brightness \|ψ\|,
  hue its phase (`ComplexPlot`'s colouring).  Wherever it goes, it looks the same, so it is recognisable as one
  character.  Probability \|ψ\|² is drawn as light on black.
- **Paper and dark.**  The years before 1926 on warm paper `#F4F1EA`, formulas set as their papers set them
  (Source Serif 4); from the wave equation on, deep ink `#0E0F11`, where ψ glows.  Archive photographs (Solvay 1927,
  the Helgoland coast) as prints, as in In1.
- **Clicks are dots.**  Every detection is a dot that lands on a 16th note and stays.
- **Motion**: holds and snaps, as In1; ψ itself moves continuously -- the only thing in the film that never snaps.

## Shot list (bar = 2 s), 81 bars / 2:42

| Bars | Time | Section | Picture · caption · sound |
|---|---|---|---|
| 0–4 | 0:00 | **Cold open: one at a time** | Black.  Dots arrive on a screen, one per click, at random -- and slowly build interference fringes (sampled from a two-slit \|ψ\|²; Tonomura's experiment).  "One particle at a time." · clicks only, accelerating |
| 4–8 | 0:08 | **1900 · the quantum** | Paper.  A glowing body's spectrum: the classical curve shoots to infinity (the ultraviolet catastrophe), Planck's curve bends down; colours of the black body.  *E = hν*. · a low drone, then a pulse |
| 8–12 | 0:16 | **1905–1913 · light and atoms** | Light as dots (photons); hydrogen's lines -- red, cyan, blue, violet -- appear at 656, 486, 434, 410 nm.  Bohr's orbits.  "Atoms only sing certain notes." · **the four Balmer lines become four pitches: the atom's chord** |
| 12–16 | 0:24 | **1922–1925 · strange rules** | Stern-Gerlach: a beam splits into exactly two.  de Broglie: a particle becomes a wave.  Helgoland, June 1925 (photo): two matrices multiplied both ways give different answers: *pq − qp ≠ 0*. · bass enters, evenly stepped (oscillator levels) |
| 16–22 | 0:32 | **1926 · ψ (DROP)** | The wave equation, set as in Annalen der Physik, 27 January 1926.  Card: **100 years**.  ψ is born: a wave packet in phase colour, moving and spreading.  The oscillator's standing waves; hydrogen's orbitals, 3D, turning (1s, 2p, 3d, 4f…). · full groove |
| 22–26 | 0:44 | **1926 · Born** | The orbital becomes a cloud of dots: each one a measurement, landing where \|ψ\|² is bright.  "The wave tells you where the click is likely." · the hi-hats are those dots |
| 26–30 | 0:52 | **1927 · uncertainty** | One packet, two views: squeeze it in position and it spreads in momentum (the Fourier pair, side by side).  Electrons diffracting (Davisson-Germer).  The Solvay photograph, October 1927. |
| 30–34 | 1:00 | **1928 · through walls** | ψ meets a barrier: most reflects, a ghost passes through -- tunneling (Gamow's alpha decay).  Dirac's equation and its mirror: antimatter. |
| 34–38 | 1:08 | **1935 · entanglement** | EPR's title page.  Schrödinger's cat as a Wigner function: two blobs and, between them, fringes going negative -- a superposition you can see.  Two particles, far apart, whose clicks always agree. · kick and snare join, locked |
| 38–40 | 1:16 | **Breakdown · 1948** | Black.  Feynman's path integral: every path from A to B at once, each an arrow turning with its phase; they cancel everywhere except along one line -- the classical path emerges.  "Nobody understands quantum mechanics." (1965) |
| 40–48 | 1:20 | **The quantum world we built (DROP 2)** | One per bar, each computed: the transistor's band gap (1947) · laser light, phases locked (1960) · Bell's inequality broken, 2√2 > 2 (1964, Aspect 1982) · Hofstadter's butterfly (1976) · quantum Hall plateaus (1980) · a condensate's spike (1995) · MRI's precessing spins · a quantum carpet: a particle in a box weaving and returning to itself. |
| 48–54 | 1:36 | **1981 · computing with ψ** | "Nature isn't classical, dammit…" (Feynman, 1981).  Qubits on Bloch spheres; a circuit; Grover's search, amplitude pouring onto one answer (Wolfram Quantum Framework).  · the melody converges onto one note |
| 54–58 | 1:48 | **Decoherence** | The Wigner fringes of the cat fade as it touches the world; the quantum becomes classical.  · the reverb dries |
| 58–62 | 1:56 | **Chaos and order** | A stadium billiard: a chaotic eigenstate, and inside it a scar along a classical orbit (Heller, 1984).  Quantum chaos still remembers the paths. |
| 62–74 | 2:04 | **Climax: the quantum century** | Everything at once, on a timeline 1900 → 2026: the orbitals, the butterfly, the carpet, the cat, the fringes completing on the screen from the cold open, now dense and bright. |
| 74–81 | 2:28 | **Outro** | One packet of ψ, alone, in phase colour, drifting.  "1926 – 2026."  "Nobody understands it.  Everything runs on it." · the atom's chord, once more, alone |

## Assets: what computes each picture

| Picture | How |
|---|---|
| Double slit, dot by dot | two-slit Fraunhofer intensity; `RandomVariate` from it; dots on 16ths |
| Blackbody | Planck's law vs Rayleigh-Jeans, `ColorData["BlackBodySpectrum"]` |
| Hydrogen lines, orbitals | Rydberg formula; `LaguerreL`, `SphericalHarmonicY`; 3D density contours |
| Wave packets, tunneling, carpets | `NDSolve` / split-step Fourier on the Schrödinger equation; `ComplexPlot`-style phase colour |
| Oscillator, box | `HermiteH` eigenfunctions; box modes `Sin[n π x]`, their revival |
| Uncertainty | `FourierTransform` of a Gaussian packet |
| Cat state, decoherence | Wigner function of a cat (Wolfram Quantum Framework's phase-space tools), its fringes damped |
| Bell, qubits, Grover | Wolfram Quantum Framework: `QuantumState`, `QuantumCircuitOperator["CHSH"]`, `["Grover"]`, Bloch plots |
| Path integral | random and stationary paths, phase arrows summed |
| Hofstadter's butterfly | Harper's equation eigenvalues over flux |
| Quantum Hall, BEC, band gap | Landau-level plateaus; a Bose-Einstein velocity distribution; Kronig-Penney bands |
| Scars | eigenstates of a stadium billiard (finite elements, `NDEigensystem`) |
| People | archive photographs from public sources (Solvay 1927), imported by URL with credits |

## Open questions

1. **Title.**  Working title "ψ — the quantum century"; folder `films/Quantum`.
2. **Archive photos.**  Which: the Solvay 1927 photograph, Helgoland, the 1926 paper's first page, Tonomura's
   frames?  All by public URL, credited.
3. **Language cuts.**  English only, or also Russian and Japanese, as In1?
