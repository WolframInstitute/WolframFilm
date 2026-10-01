# WolframFilm

Films made entirely of Wolfram Language code: each is a computational essay -- a notebook whose cells build the film
with [WAnim](https://github.com/sw1sh/WAnim) (`PacletInstall["WolframInstitute/WAnim"]`), render it, and publish
the notebook and its video to the Wolfram Cloud.  No generative image, video or music models.

## Films

| Film | | Notebook |
| --- | --- | --- |
| [In1](films/In1) | *In[1]:= -- the life of a language*: the Wolfram Language's vocabulary, 1988 to 2026, in one notebook window through the eras | [In1.nb](https://www.wolframcloud.com/obj/wolframinstitute/WolframFilm/In1.nb) |

## Layout

```
films/<film>/
  <film>.md        the film, as a notebook in Markdown (MarkdownToNotebook)
  README.md        what it is, where to watch it, its sources
  docs/            its script and notes
scripts/
  build.wls <film>     <film>.md -> <film>.nb, every cell evaluated (the film renders itself), then publish
  publish.wls <film>   <film>.nb -> WolframFilm/<film>.nb in the cloud, public, outputs as pictures
  cloud.wl             which film, and the cloud account
```

The built notebook, its cloud copy and the rendered video stay beside the Markdown, untracked.

## Build

```sh
wolframscript -f scripts/build.wls In1                 # build, render and publish
wolframscript -f scripts/build.wls In1 --no-publish    # build and render only
wolframscript -f scripts/publish.wls In1               # publish again
```

The scripts work in the cloud as the account in `.env` (gitignored): `WOLFRAM_CLOUD_USER`, `WOLFRAM_CLOUD_PASSWORD`.
Rendering uses WAnim's GPU renderer on Apple silicon and the front end elsewhere.

A new film: `films/<Name>/<Name>.md`, starting with `PacletInstall["WolframInstitute/WAnim"]; Needs["WolframInstitute`WAnim`"]`.
