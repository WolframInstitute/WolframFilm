# ψ — the quantum century

A five-minute documentary about a hundred years of quantum theory, narrated only by the people who made it: recordings
of Planck, Bohr, de Broglie, Heisenberg, Dirac, Schrödinger, Born, Bell, Aspect, Feynman and Zeilinger, from 1942 to
2022, subtitled.  Between their words: real experiments on film -- single electrons building interference fringes,
the photoelectric effect, Germer's electron diffraction, cloud chambers, entangled photon pairs, lasers, MRI, quantum
computers -- and the physics they describe, computed in the notebook: the blackbody curve, hydrogen's lines and
orbitals, the wave packet, uncertainty, tunnelling, the cat's Wigner function, Bell's 2√2, Feynman's paths.  Music
sits beneath, ducked under every voice.  No narrator, no generative image, video or music models.

## Watch

- Notebook: https://www.wolframcloud.com/obj/wolframinstitute/WolframFilm/Quantum.nb
- Video: https://www.wolframcloud.com/obj/wolframinstitute/WolframFilm/Quantum.mp4

## Build

```sh
wolframscript -f scripts/build.wls Quantum       # (from the repository root) build, render, publish
```

- Script and shot list: `docs/SCRIPT.md`
- Every fact checked against its paper, and every archive file with its licence: `docs/SOURCES.md`

## Archive media

`fetch-archive.sh` cuts every clip from its source into `archive/` (gitignored); they are kept in the cloud beside the
film (`WolframFilm/Quantum/archive/`), where the notebook reads them.  Every clip, its moment, transcript and rights:
`docs/CLIPS.md`.  The copyrighted voices are short, credited quotations in a non-commercial educational film.  Stills:

- Helgoland, c. 1890-1900, photochrom: Library of Congress, public domain
- Werner Heisenberg, 1926: photo by Friedrich Hund, CC BY 3.0
- First page of Schrödinger 1926 and p. 865 of Born 1926: Internet Archive scans; public domain in the US
- The fifth Solvay conference, 1927: photo by Benjamin Couprie (public domain in the US; its Wikimedia Commons copy is
  nominated for deletion over EU copyright)
