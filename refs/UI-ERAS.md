# Mathematica notebook UI across the eras: visual reference

All images are in `refs/ui/`. I looked at every file listed here with an image viewer. Hex values come from ImageMagick colour quantization of the actual pixels, so they are close estimates, not exact values. JPEG and GIF compression shifts colours slightly.

Tags used below:
- **[seen]**: visible in the image.
- **[measured]**: hex sampled from the pixels.
- **[inferred]**: my interpretation or outside knowledge. Treat it as unverified.

> **Blog-stylesheet caveat.** From about 2019 on, Stephen Wolfram's posts render notebooks in a custom "writings" style. Its features are italic gray `In[•]:=` / `Out[•]=` labels, bold proportional (Source Sans–like) code, and gray brackets. **This is not the default Mathematica look.** For the default look, use `v13.3-2023-chat-3.png` (plain blue `In[1]:=` labels), `v11-2018-modern-1.png`, and `v13.3-2023-chat-1.png` (right-hand window).

---

## 1. SMP (1981): terminal/printout session
**Files:** `smp-1981-printout-1.png`, `smp-1981-printout-2.png`, `smp-1981-printout-3.png`
**Sources:** https://writings.stephenwolfram.com/2013/06/there-was-a-time-before-mathematica/ (1 = `smp-output.png`, 2 = `smp-lib1-large1.png`), https://www.wolfram.com/mathematica/scrapbook/1980/01/05/prewri_smpcode-2/ (3)

- [seen] These are paper printouts (line-printer or terminal hardcopy), not screen captures. Black monospace text on off-white paper, with slight gray paper texture.
- [seen] Prompt format: **`#I[1]::`** for input and **`#O[1]:`** for output. Input has a double colon, output a single colon. Both sit flush left, and the expression starts at a tab stop about 12 characters in.
- [seen] Output math is 2D ASCII: exponents are raised onto the line above (`2  3` over `a x`). Fractions are built from dashed lines (`-----------`), with the numerator and denominator centred.
- [seen] Function names are abbreviated with `[]` brackets, e.g. `Ex[(x-1)^2 (x+2a)^3]`, `Fac[x^12-1]`, `D[Log[x]^3 Exp[-a x]/(x-2b),x]`, `Int[...]`, `N[BesJ[6,7.8]...]`, `Ar[...]`. Pattern variables use a `$x` prefix. Comments are `/* ... */`.
- [seen] Printout 2 uses a dot-matrix-looking font with slashed zeros (`Ø`) and more condensed glyphs. Sample text: `#I[1]:: <XAck`, `#O[2]: {1,4,27,256,...}`.
- [seen] Printout 3 has a separate contour plot in thin black lines, overlaid as a hardcopy figure.
- [inferred] On a real 1981 terminal this would be green or amber on black, or a VT100-style white on black. None of these images shows a live screen, so the film can pick either. Paper printout is the look that is actually documented.

## 2. Mathematica 1.0 on Macintosh (1988)
**Files:** `v1-1988-mac-1.png` (clean `$Version` screen), `v1-1988-mac-3-vs-modern.png` (Stellate icosahedron in v1 next to modern), `v1-1988-mac-2.png` (photo of a Mac SE/30 plus a modern re-render), `v1-mac-vs-iphone.png`, `v1-1987-mac-prerelease-1.jpg` (1987 prerelease front end), `v1-1988-mac-startup.png` / `v1-1988-mac-startup-onscreen.png` (splash), `v1x-1989-mac-color-splash.jpg` (1.x colour splash, ©1988-89)
**Sources:** https://writings.stephenwolfram.com/2018/06/weve-come-a-long-way-in-30-years-but-you-havent-seen-anything-yet/ ; https://www.wolfram.com/mathematica/scrapbook/1987/02/08/1987_frontend-2/ ; https://www.macintoshrepository.org/2297-mathematica-1

- [measured] Strictly 1-bit: `#FFFFFF` background, `#000000` ink. The only "grays" are 50% dither patterns in the scroll tracks and title-bar stripes.
- [seen] **Menu bar** (System 6): Apple logo, then **`File  Edit  Cells  Search  Action  Styles  Windows`** in the 1.0 `$Version` shot. The SE/30 and Stellate shots, probably 1.1/1.2, read **`File Edit Cell Graph Find Action Style Window`**. Font is Chicago 12 bold. At the far right are a boxed **`?`** (help) and a small round app icon.
- [seen] **Window chrome:** the title bar has horizontal pinstripes, a small square close box at left, and a zoom box at right. The title `Untitled-1` sits centred in a white knockout. Scroll bars have a 50% gray dither track, white arrow boxes, and a square thumb. The horizontal scroll bar at the bottom starts with a black/dither "page" indicator strip at left. There is a size box bottom-right.
- [seen] **In/Out labels go on their own line above the cell content**, not to the left of it. They are italic, small (about 70% of code size), and plain black, in an italic sans (Geneva-italic–like). Written `In[1]:=` and `Out[1]=`.
- [seen] **Input:** bold monospace (Courier-bold–like), e.g. `$Version`, indented about 2 characters from the label. **Output:** plain (non-bold) Courier, e.g. `Macintosh 1.0 (June 17, 1988)`.
- [seen] **Cell brackets** sit at the far right, just left of the scroll bar. They are thin black 1-px `]` shapes with small horizontal serifs at top and bottom. A cell group gets a second, taller bracket outside the first. Each In and Out cell has its own bracket.
- [seen] Graphics output prints a separate text cell: **`-Graphics-`** for 2D and **`-SurfaceGraphics-`** for Plot3D.
- [seen] **Plot3D on the monochrome Mac:** a black mesh with hidden-line removal and dithered gray shading on the faces, a bounding box, and tick labels in a small sans. `Show[Graphics3D[Stellate[Icosahedron[]]]]` draws dither-patterned faces inside a thin box.
- [seen] 1987 prerelease: menus read `File Edit Control Selection Font Windows`. Notebook "Orthopoly" has bold section titles ("Legendre Polynomials") and Courier text.
- [inferred] The "pastel lighting" Plot3D look (pink/blue/yellow lights) only appears on colour displays (Mac II, 1987+). `v1x-1989-mac-color-splash.jpg` shows 1.x colour surfaces in saturated red/green/blue/purple lighting.

## 3. Mathematica on NeXT (1988–1992)
**Files:** `next-1992-screen-3.png` (best: two Mathematica notebooks, "Calculus&Mathematica"), `next-1992-screen-1.png` (Mathematica notebook `Animation.ma` beside NeXTMail), `next-1992-screen-2.png` (a custom MathLink front end "PhaseScope", good for NeXTSTEP widget styling), `next-1989-photo-1.jpg` (photo of a NeXT MegaPixel display showing a Mathematica "Examples of Mathematica" notebook)
**Sources:** NeXT white paper "NeXTstep: The Ideal Platform for Mathematica" (Jan 1992), https://levenez.com/NeXTSTEP/Mathematica.pdf (images extracted with `pdfimages`); https://www.wolfram.com/mathematica/scrapbook/1989/04/03/1989_mathematicaarrivesnext-2/

- [measured] 2-bit grayscale: `#FFFFFF`, light gray `#B8B8B8` (window frame, buttons), dark gray `#686868` (desktop), `#000000`.
- [seen] **Menus are vertical**, a stacked list pinned top-left: title `Mathematica` in white on black, then `Info ▸ Notebook ▸ Edit ▸ Format ▸ Cell ▸ Graph ▸ Action ▸ Windows ▸ Print ▸ Services ▸ Hide h, Quit q`, with key equivalents right-aligned.
- [seen] **Window title bar is solid black**, with the title in centred white bold Helvetica: `1.01.NumbersAndAlgebra.ma —`. A small miniaturize square sits at left and a close ⊠ box at right. Below it are a ruler with tab markers, then a toolbar row: a cell-style popup (`Section`, `Input`) plus three text-alignment buttons.
- [seen] **The scroller is on the LEFT side** (NeXT convention). Arrow buttons are grouped at the bottom-left corner, and there is a `100%` zoom popup in the bottom bar.
- [seen] Cell brackets are at the right, black and thin, with nested group brackets. Collapsed groups show a small filled-bar bracket.
- [seen] Text cells use a serif (Times) and code uses bold Courier. `In[1]:=` is italic and small, **above** the code as on the Mac. Section headings have a gray filled square bullet `■`, e.g. "Guide", "Basics", "Tutorial". The title cell is centred large serif in a framed box.
- [seen] Plot3D: fine black mesh with light gray shading (Display PostScript) and a bounding box with numeric ticks.
- [seen] The Dock runs down the right edge: 64-px beveled tiles on gray (clock, Mail, etc.). The top tile is the NeXT logo cube. **Do not copy the logo.**
- [seen] The 1989 photo: NeXT MegaPixel monochrome display with a notebook "Examples of Mathematica" (bold title) containing a stellated polyhedron and a 3D surface.

## 4. Mathematica 2.x (1991–1995): Windows 3.1
**Files:** `v2-1992-win31-1.png` (notebook "Crystals"), `v2-1992-win31-2.png` ("Claw" graphic plus 3D ViewPoint Selector dialog), `v2-1992-win31-about.png` (About box, v2.1 build Aug 1992)
**Source:** https://winworldpc.com/product/mathematica/2x

- [seen] Application title bar: `Mathematica for Windows - [Crystals]` in black text on white, with a Windows 3.1 control-menu box `–` at left and ▼▲ min/max at right. The dialog title bar is light blue `#A0C8F0` [measured] with a black centred title.
- [seen] Menus: **`File Edit Cell Graph Action Style Options Window Help`**, with underlined mnemonics.
- [seen] Under the menus: an inch ruler, then a toolbar with a style dropdown (`Input`, `Postscript`) and about 12 small gray 3D buttons with icons.
- [seen] Status bar at the bottom: sunken panes, e.g. `211833K Bytes Free`.
- [measured] Chrome gray `#C0C0C0`, page `#FFFFFF`. **Cell brackets are pure blue `#0000FF`**, thin, at the far right, with nested groups.
- [seen] Section heading with a black filled square `■` and bold sans (Arial) text: "■Zincblende Structures". Text cells in Arial. **Input in large Courier (regular weight here, not bold)**. No In/Out labels are visible in this demo notebook, which has labels hidden.
- [seen] Graphics3D in saturated RGB (red/blue points, green `#00FF00` bonds). Plot3D "Claw" has default pastel lighting: lavender, pink, light blue and tan faces with dark mesh lines. Selected graphics show 8 black resize handles.
- [not found] No clean Mac 2.x screenshot. [inferred] Mac 2.x chrome is System 7 (still 1-bit or colour Platinum-less), with notebook styling close to v1.

## 5. Mathematica 3.0 (1996–97): typeset 2D input, palettes
**Files:** `v3-1997-macos8-1.jpg` (3.0.1 on a Mac, Plot3D), `v3to5-typeset-output-1.jpg` (TraditionalForm integral table, blue brackets; exact version unknown, 3.x–5.x)
**Sources:** https://www.macintoshrepository.org/681-mathematica-3 ; https://www.wolfram.com/mathematica/scrapbook/1996/07/10/1996_typeset-2/

- [seen] Mac OS 8 "Platinum"-style window: light gray title bar with fine horizontal stripes, and close, zoom and windowshade boxes. Title `Untitled-1`. Platinum scroll bars.
- [seen][measured] The **`In[8]:=` label is still above the input**, in small italic **dark navy/blue `#1B1A46`**. Cell brackets are the same dark navy colour, thin, on the right.
- [seen] Input: `Plot3D[ Sin[1 - x y], {x,-3,3}, {y,-1.5,1.5} ]` in bold Courier.
- [seen] Plot3D on this machine is grayscale-shaded faces with a black mesh. [inferred] This is because the caption says it is running on an SE/30 (monochrome), not because of v3 defaults.
- [seen] Typeset image: real 2D math (integral signs with limits, fractions, radicals, Γ, ζ, ₂F₁ subscripts) in a Times-like italic serif, i.e. TraditionalForm/StandardForm. **Cell brackets are blue, rendered with a textured/dotted fill** (selected-look). [inferred] This is the Windows front end.
- [not found] No Windows 95 v3.0 screenshot. [inferred] For Win95: classic `#C0C0C0` chrome, navy `#000080` title bar, and a BasicInput palette like the one in section 6 (palettes debuted in 3.0).

## 6. Mathematica 4 / 5 (1999–2005): Mac OS 9, Windows 9x/XP, Unix
**Files:** `v4-1999-macos9-1.jpg` (CalculatingPi.nb plus the BasicInput palette on Mac OS 9), `v4-2000-win-1.png` (4.1 on Windows 9x plus the BasicInput palette), `v5-2003-unix-motif-1.jpg` (Unix/X11 Motif, `100!` and Plot3D), `v5.1-2005-winxp-1.gif` (5.1 on Windows XP next to Excel), `v5.1-2005-winxp-trekker.gif` (EquationTrekker GUI, XP)
**Sources:** https://www.macintoshrepository.org/705-mathematica-4 ; https://winworldpc.com/product/mathematica/4x ; https://www.macintoshrepository.org/291-mathematica-5 ; Wayback: `wolfram.com/products/mathematica/newin51/images/excel.gif` and `gui-EquationTrekker.gif` (2006–07 captures)

- [seen] **Unix v4/5 default notebook** (the cleanest "default" reference for this era):
  - **The `In[1]:=` label now sits to the LEFT of the input on the same baseline** (modern placement). The label is tiny sans, blue-gray `#67669B`–`#343346` [measured].
  - Input is bold Courier (`100!`, `Plot3D[Sin[x/y], {x, 1, 5}, {y, -1, 1}]`). Output is regular Courier. Long numbers wrap, with a `\` continuation at line end.
  - Output reads **`Out[2]= - SurfaceGraphics -`** (with spaces).
  - Cell brackets are blue/periwinkle `#605F99`–`#A8A7E3` [measured], thin, on the right, with nested group brackets.
  - Plot3D default lighting is pastel: lavender, pink/salmon, pale blue and light cyan faces, black mesh, and a box with small sans tick labels.
  - Menus: `File Edit Cell Format Input Kernel Find Window Help`. The Motif title bar is gray, with `Untitled-1 *` in a large light sans.
- [seen] **BasicInput palette** (v4 Mac and Win): a narrow floating tool window of square gray bevelled buttons. The top block is 2-column template buttons (x², √, ∫ with limits, ∂, Σ, Π, matrix, part `[[ ]]`). Below that is a dense 6-column grid of symbols: π e ⅈ ∞ °, × ÷ ⊗ → ⧴, ≠ ≤ ≥ ∈ ¬ ∧ ∨ ∪ ∩, and Greek α…Ω.
- [seen] v4 Mac OS 9: Platinum windows, and a `100%` zoom popup in the bottom-left of the horizontal scroll bar. The CalculatingPi notebook uses a *custom* demo stylesheet: magenta bold section titles, orange-banded input cells (`#FAB26B`), pink output bg, and a "MATHEMATICA" banner. **Not the default look.**
- [seen][measured] v4.1 Windows: classic navy title bar `#010181`, `#C0C0C0` chrome, and a taskbar with a Start button. Menus: `File Edit Cell Format Input Kernel Find Window Help`. The notebook CoverImage.nb also uses a custom stylesheet: orange input bg `#FFBE50`, peach graphics bg `#FFBFAF`, and a teal left rule `#078D96`.
- [seen] v5.1 on XP: Luna blue title bars with a red ✕ button. The notebook window `Transport2.nb` has a `100%` zoom field bottom-left, blue cell brackets at right, and a light steel-blue US map with gray lines.
- [not found] No Mac OS X Aqua v4/v5 notebook screenshot (only splash and About boxes, which are logo-heavy).

## 7. Mathematica 6.0 (2007): new look, syntax colouring, Manipulate
**Files:** `v6-2007-manipulate-commons.jpg` (Manipulate of Plot3D, Windows), `v6-2007-manipulate-1.jpg` (large Manipulate, Mac), `v6-2007-syntax-coloring-1.jpg`, `v6-2007-blog-TheoTree1.gif` (Manipulate panel, minimal), `v6-2007-blog-KovasCountryData.gif` (tooltip/graphics)
**Sources:** https://commons.wikimedia.org/wiki/File:Manipulate.jpg (CC BY 3.0) ; https://www.wolfram.com/mathematica/scrapbook/2007/11/08/2007_manipulate-2/ ; Wayback `wolfram.com/products/mathematica/newin6/content/RealTimeCodeAnnotation/` ; https://blog.wolfram.com/2007/05/17/why-spend-more-than-five-minutes-on-a-gui/ ; https://blog.wolfram.com/2007/05/13/symbolic-programming-visualized/

- [seen] `In[1]:=` / `Out[1]=` sit to the left: tiny (about 60% of code size) plain sans in **blue** (`#3638AF`-ish [measured]). Input is **bold Courier**.
- [seen] **Manipulate panel:**
  - Light gray rounded rectangle, bg `#F5F5F5`–`#ECECED`, with a 1-px mid-gray border `#A6A6A6` [measured]. About 4 px corner radius.
  - Inner content area is white with a thin gray border.
  - Top-right has a small circled **⊕** options button (gray).
  - Control row: label `k` in sans, a long thin slider track, a thumb (Windows: a pill with a green rim, `#74B088` [measured]; Mac: a blue glossy ball), and a small square **`+`** button to the right that opens the animator.
  - The Mac version adds setter bars (segmented buttons `plane | sphere | torus | cylinder | möbius | sine` with a light blue selected segment), vertical sliders, checkboxes and icon toggle buttons in a right column.
- [seen] **v6 default Plot3D:** smooth surface with a black mesh, lit in **periwinkle/violet, pink-magenta, pale blue and white** (`#5C5DE7`, `#D8B2F0`, `#ADCDEA` [measured]). The box has thin gray edges and small sans ticks.
- [seen] **Syntax colouring (v6 defaults):**
  - User-defined/global symbols are **blue** (`FStep`, `GStep`).
  - Pattern variables and scoped locals are **green italic** (`x_`, `y_`, `n_`, `α_`, `σ`, `τ`).
  - System symbols (`If`, `Partition`, `Module`) are **black**.
  - Input is typeset with real 2D fractions (`n/2` stacked) and superscripts (`2^(2n)`).
- [seen] Tooltip: a pale yellow box with a thin border holding a graphic (a flag).

## 8. Mathematica 8.0 (2010): free-form input
**Files:** `v8-2010-freeform-Example1.jpg` (`plot x sin^3x`), `v8-2010-freeform-Example-slider.jpg`, `v8-2010-freeform-Example-Blob.jpg`, `v8-2010-freeform-Example-Opened.jpg` (full W|A-style pods), `v8-2011-linux-commons.png` (a full default 8.0 notebook window on Linux, the best "default v8 notebook" reference)
**Sources:** https://writings.stephenwolfram.com/2010/11/the-free-form-linguistics-revolution-in-mathematica/ ; https://commons.wikimedia.org/wiki/File:Mathematica_logistic_bifurcation.png (CC0)

- [seen][measured] **Free-form marker:** a small **orange rounded square `#F76504` with a white `=`** glyph (about 13×13 px at 100%), just right of `In[1]:=`.
- [seen] The query text (`plot x sin^3x`) is in bold sans, inside a white box with a light gray rounded border and a tiny `⊞` at top-right.
- [seen] Below the query sits the interpretation line: an orange hook-arrow **`↳ Plots`** plus gray `(1 of 2)`. Below that is the generated code in bold Courier: `Plot[x*Sin[x]^3, {x, -6.3, 6.3}]`. An orange `»` link appears after some queries.
- [seen] **Full-results mode** (`Example-Opened`): stacked **pods**. Each is a white rounded rectangle with a light gray border, a gray pod title (`Indefinite integral:`, `Plots of the integral:`), and orange links (`Show steps`, `Use the base 10 logarithm`) at the right. The math is TraditionalForm. The pods sit inside a larger light gray rounded container.
- [seen] v6–v9 default 2D Plot line: **thin blue-purple** (`#6468AB`–`#5F60AB` [measured]). Two-curve plots add orange. Ticks are small; axes pass through the origin.
- [seen] The Linux 8.0 window (Ubuntu chrome, orange/brown title-bar buttons):
  - Labels `In[6]:=` / `Out[8]=` are tiny blue-gray, right-aligned left of the cell.
  - Code is Courier bold, with **green italic** pattern vars and **teal-ish** strings.
  - Output text is in regular Courier.
  - The right-edge brackets are **blue**, with tiny flag notches on output brackets.
  - A `⊞` cell-insertion bar at the bottom, and a `75%` zoom box at bottom-right.
  - Menus: `File Edit Insert Format Cell Graphics Evaluation Palettes Window Help`.

## 9. Mathematica 9.0 (2012): Suggestions Bar
**Files:** `v9-2012-suggestions-1.png`, `v9-2012-units-1.png`, `v9-2013-wa-in-notebook-commons.png` (Win 7 with full W|A results in the notebook, "==" mode)
**Sources:** https://writings.stephenwolfram.com/2012/11/mathematica-9-is-released-today/ ; https://commons.wikimedia.org/wiki/File:Alphawithmath.PNG (CC BY-SA 3.0)

- [seen][measured] **Suggestions Bar:** a full-width strip directly under the output. Light gray bg `#F3F5F6` with thin top and bottom borders, about 22 px tall.
- [seen] Items are separated by thin vertical dividers: `acyclic? ▾ | edges ▾ | vertices ▾ | adjacency matrix ▾ | more...`. Each is dark gray sans text with a small **boxed ▾** dropdown. The hovered item turns **orange `#F86415`**. At the right end are three icons: a spiral/undo, a gear, and a speech bubble.
- [seen] Graph default look (v9): vertices are rounded-square gold/yellow gradient tiles with number labels, and edges are dark blue lines.
- [seen] Labels `In[2]:=` / `Out[2]=` are tiny and blue. Code is bold Courier. The output list uses `↔` (UndirectedEdge) arrows. Truncated output lines fade to gray.
- [seen] **Quantity/free-form inline boxes:** a rounded box with a light border, a mini orange `=` square at left, bold text, and an orange **◆** at right (e.g. `10 mph ◆`, `earth's gravity in SI ◆`).
- [seen] "==" full W|A mode (Win 7): an **orange spiky-sphere icon with `=`** before the query. **Treat as a Spikey derivative; do not copy.** Pods are titled `Input interpretation:` / `Result:` in a gray serif-ish font, with orange buttons like `Show space filling` and `Step-by-step solution`. A `WolframAlpha` wordmark sits in each pod-group footer (**do not copy**). The zoom field reads `120%`.

## 10. Versions 10–12 (2014–2019): modern flat notebook
**Files:** `v10-2014-new-default-styles-in-mathemtica-10.png` (grid of new default plot styles), `v10-2014-geographic-visualization-in-mathematica-10.png` (Entity blobs plus GeoListPlot), `v10-2014-association-example-in-mathematica-10.png`, `v11-2018-modern-1.png` (macOS window, Plot3D in 11.3)
**Sources:** https://writings.stephenwolfram.com/2014/07/launching-mathematica-10-with-700-new-functions-and-a-crazy-amount-of-rd/ ; https://writings.stephenwolfram.com/2018/06/weve-come-a-long-way-in-30-years-but-you-havent-seen-anything-yet/

- [seen][measured] Page is near-white `#FCFCFC`. Cell brackets are **light gray** `#BEC2C5`: thin, right side, several nested columns. They are no longer blue.
- [seen][measured] `In[6]:=` / `Out[6]=` are tiny (about 55% of code size), **steel blue `#719ABD`–`#6F97B8`**, right-aligned in the left margin, on the first line of the cell. In 13.x the default labels are `#3B6E92`-ish (from `v13.3-2023-chat-3.png`).
- [seen] Input is bold monospace (Courier-like in 10, and in the 11.3 Mac shot too; the code font looks like bold Courier/Menlo) [inferred on exact face].
- [seen] **Default Plot3D (v10+):** **orange-to-yellow** gradient surface (`#F59A13`, `#FBE020`, with brown shading `#985B16` [measured]), thin dark mesh, light gray box edges, gray sans ticks. The underside is darker brown.
- [seen] **Default 2D palette (v10+):** 1st **blue**, 2nd **orange**, 3rd **green**, 4th red. Lines are about 1.5 px. Filled regions are pale blue with a blue outline. Box-whisker and bar charts are in orange/amber tones. [inferred, from WL docs, not measured]: `ColorData[97]` is approximately #5E81B5, #E19C24, #8FB032, #EB6235.
- [seen][measured] **Entity blobs:** rounded rectangle (radius about 4 px) with an **orange border `#F4821D`**, cream fill `#FDFBF3`, and dark text. The entity type is in lighter gray parentheses, e.g. `Mediterranean Sea (ocean)`, `United Kingdom (country)`. Blobs in long lists fade to lighter orange and gray further down. There is a tiny gray `⊞` for the entity-class expander.
- [seen] **Association:** printed literally as `<|"Species" -> "Dog", "Breed" -> ... , "Image" -> [inline photo], "Lifespan" -> 15 yr, "Origin" -> [entity blob], "Color" -> ■|>`. Images, quantities (`15 yr` typeset) and colour swatches (small black square) render inline. `->` shows as `->` in input. (No boxed "Association summary" appears in this image.)
- [seen] GeoListPlot: pale blue sea, light tan land, and **dark red dots** (hex not measured).
- [seen] macOS window (11.3): standard traffic lights, notebook icon plus `Retro-01.nb` in the title, and a `100% ▸` zoom box at bottom.

## 11. Version 13.3 (2023): Chat Notebooks
**Files:** `v13.3-2023-chat-1.png` (1988 Mac next to a 2023 chat notebook, the best full view), `v13.3-2023-chat-4.png` (chat cells, the chat-block separator, context behaviour), `v13.3-2023-chat-3.png` (default `In/Out` labels, 13.x)
**Sources:** https://www.wolfram.com/mathematica/scrapbook/2023/06/08/june-8-2023-introducing-chat-notebooks/ ; https://writings.stephenwolfram.com/2023/06/introducing-chat-notebooks-integrating-llms-into-the-notebook-paradigm/

- [seen][measured] **Chat input cell:** white box with a **light blue border `#A3C9F1`** (about 2 px), square-ish corners (very slight radius), and a proportional sans (Source Sans–like). Text is near-black `#080808`. In the left margin is a **filled light-blue speech-bubble icon `#7DD2FF`** with a darker outline `#4992B9`.
- [seen][measured] **Assistant response cell:** very light blue-gray fill (`#F3F4F8` / `#FCFDFF`) with a thin light gray border. In the margin is a **gray speech-bubble icon**. In the scrapbook shot the response icon is a small blue assistant glyph; **do not replicate its exact glyph**. A vertical `⋮` menu sits top-right. Prose is black sans. Function names are **linked blue `#35569C`** (e.g. `ParametricPlot`). Code blocks are a white inset with a hairline border and bold monospace, and `t` variables are tinted teal. Inline code (`t = −4`) sits in small bordered boxes.
- [seen] **Chat block separator:** a full-width light gray bar (hex not measured) with a gray chat icon at the left margin.
- [seen] Right-side cell brackets: light gray, nested.
- [seen] Window: macOS, `Untitled.nb` title with a red notebook icon (**Spikey-bearing, do not copy**), and `100% ⌄` top-right. Output graphics: a plain medium-blue ParametricPlot line (hex not measured), gray axes, sans ticks. A gear icon floats at the right of the graphic.

## 12. Version 14.3 (2025): Dark Mode
**Files:** `v14.3-2025-dark-1.png` (full window with toolbar), `v14.3-2025-dark-2.png` (same plot in light mode, blog style), `v14.3-2025-dark-3.png` (same plot in dark), `v14.3-2025-dark-5.png` (ArrayPlot3D in dark); plus v15 `v15-2026-dark-1.png` (`DarkModePane`) and `v15-2026-themes-1.png` (v15 theme picker: Light/Dark/System plus 18 themes)
**Sources:** https://writings.stephenwolfram.com/2025/08/new-features-everywhere-launching-version-14-3-of-wolfram-language-mathematica/ ; v15 post (below)

- [measured] Notebook background **`#191919`–`#1D1D1D`**. Toolbar strip `#262626`, with toolbar controls in `#383838`.
- [seen] **Notebook toolbar** (docked at top): grouped sections labelled small gray `Evaluation`, `Assistance`, `Cell Style` (a `+ Insert Cell...` dropdown), `Cells`, `Code`, `Insert`, `Notebook`, each with light gray line icons. The first icon (evaluation) is a red/orange square.
- [seen][measured] Section title in **salmon/coral `#F79268`** sans. Body text light gray `#E5E5E5` / `#D9DFE0`.
- [seen] Labels `In[•]:=` and `Out[•]=` are gray `#A1A1A1`, italic. The italic is the blog style: in-product default labels are non-italic [inferred].
- [seen][measured] Code: bold light text, **brackets gray**, and the iterator variable `x` in **light cyan `#90D4E9`**. A `{…}+` elided-list box is a rounded chip.
- [measured] Plot lines in dark mode: **blue `#4097C7`, orange `#EC9D27`, green `#71AF35`**. Axes and ticks are light gray/white.
- [seen] Tables (DataConnectionObject) keep light row banding, with darker header cells. Tooltips are dark gray panels.
- [seen] macOS dark window chrome: traffic lights, `darkmode.nb` with its icon, `100%` at top-right.

## 13. Version 15.0 (June 2026): AI Assistant chatbar and symbolic music
**Files:** `v15-2026-assistant-1.png` (empty notebook with the chatbar), `v15-2026-assistant-2.png` (query → response with code block and action buttons), `v15-2026-assistant-4.png` (inserted/evaluated code plus Plot3D table); music: `v15-2026-music-score-1.png`, `v15-2026-music-score-2.png` (MusicScore outputs), `v15-2026-music-measure.png`, `v15-2026-music-plot.png` (MusicPlot), `v15-2026-music-1/2/3/5/7/10/11.png` (MusicPitch/Duration/Chord/Interval summary boxes); `v15-2026-themes-1.png` (Preferences → Appearance → Theming)
**Source:** https://writings.stephenwolfram.com/2026/06/launching-version-15-of-wolfram-language-mathematica-built-in-useful-ai-lots-of-new-core-functionality/ (sections "An AI Assistant in Every Notebook", "Introducing Symbolic Music", "Visual Themes Come to Notebooks", "Going Dark in the Light")

**AI Assistant chatbar**
- [seen][measured] **Docked at the bottom of the notebook window**, full width minus margins. White field with a **~10 px corner radius** and a **light blue 1.5 px border `#76C3EB`**.
- [seen] Left: an outline speech-bubble icon (blue). Placeholder **"What would you like to do?"** in medium gray sans. Right: a **blue → arrow `#007DCA`/`#40A3DA`**. Outside the field to the right are a gray `✕` (close) and `…` (menu) stacked.
- [seen] An empty notebook shows only a tiny boxed `+` cell-insertion button at top-left.
- [seen] After sending, the transcript appears in-notebook:
  - The query is echoed in a rounded, light-blue-bordered box with a faded arrow.
  - The response pane is very light blue `#F9FDFF`, with a thin blue-gray border and rounded corners.
  - Gray outline chat icons sit in the left margin, 👍/👎 outline icons in the right margin, and a `⋮` at the top-right of the pane.
- [seen][measured] Code block inside the response: a white panel with a hairline gray border and monospace text. **Comments are teal `#549DB4`**, user symbols (`pentagon`, `vals`, `funs`, `x`, `y`) **blue `#0C30C4`**, system symbols black, and `→` arrows are rendered. The footer row has three text buttons with icons: **`Insert and evaluate`** (blue starburst icon, **Spikey-like, do not copy**), **`Insert`**, **`Copy`**.
- [seen] Evaluated result: an `In[•]:=` cell with the code (comments teal), then `Out[•]=` with a list of 6 Plot3D pentagon eigenmodes in the **orange/yellow default surface** style, each titled with its eigenvalue.

**Symbolic music output**
- [seen][measured] **`MusicScore` output** is a rounded panel (about 6 px radius) with a thin light gray border.
  - Left column (about 50 px): a **blue circled play ▶** and a **blue circled stop ■** (`#3980C6`), with a gray speaker 🔈 below. A thin vertical divider separates it from the roll.
  - Main area: a white **piano-roll** of horizontal note dashes. Voice 1 is **orange `#F2A024`**, voice 2 **blue `#3C95CB`**, voice 3 **green**. A thin dark vertical playhead line sits at the left.
  - Footer band `#F5F5F5` holds two gray sans lines: `Duration: 3 measures` / `Time Signature: 4/4`.
- [seen] `MusicMeasure[...]` summary box: a light gray rounded box containing a mini piano-roll thumbnail in a white square, then two gray-label lines (`TimeSignature: 4/4`, `NoteList: {E, C, D, G3}`).
- [seen] `MusicPitch`/`MusicDuration`/`MusicInterval`/`MusicChord` render as standard summary boxes: gray rounded chip, gray `⊞` expander, then a value like `A♯`, `G♯5`, `7/4`, `MajorThird`. Chords show a **mini treble-clef staff with note heads** plus a name ("G Major", or `{C4, ≪4≫, F𝄫5}`).
- [seen] `MusicPlot`: pitch (C2…C6, G labels) against measure number, with short coloured dashes per voice (blue/orange/green) and gray vertical measure lines.
- [seen] Themes (v15): Preferences pane with a `Light/Dark mode: System setting | Light | Dark` segmented control and 18 theme cards (Wolfram Default, Wolfram Bright, Wolfram Muted, Atom One, Bubblegum, Cobalt, CRT, Dracula, Garden, Grayscale, Monokai, Natural, Pastel, Sky, Solarized, Spring, Stargazer, Watermelon). Each card shows dark and light mini-previews and a swatch strip.

---

## Cross-era cheat sheet (for rendering)

| Era | Page bg | Label placement / style | Input font | Bracket colour | 3D default |
|---|---|---|---|---|---|
| SMP 1981 | paper / terminal | `#I[n]::` / `#O[n]:` inline, left | monospace | none | line-printer contours |
| v1 Mac 1988 | #FFFFFF 1-bit | above cell, italic black small | bold Courier | black | dithered gray mesh |
| NeXT 1989–92 | #FFFFFF + #B8B8B8 chrome | above, italic | bold Courier; Times text | black | gray-shaded mesh |
| v2 Win3.1 1992 | #FFFFFF, #C0C0C0 chrome | (hidden in demo) | Courier (large) | #0000FF | pastel multi-light |
| v3 Mac 1997 | white | above, italic navy #1B1A46 | bold Courier | navy | (gray on mono Mac) |
| v4/5 1999–2005 | white | **left, same line**, tiny blue-gray | bold Courier | periwinkle #605F99 | pastel lavender/pink/cyan |
| v6–v9 2007–12 | white | left, tiny blue | bold Courier + syntax colours | blue | v6 violet/pink/blue |
| v10–12 2014–19 | #FCFCFC | left, tiny steel blue #719ABD | bold mono | light gray #BEC2C5 | orange→yellow |
| 13.3 2023 | #FFFFFF | left, #3B6E92 | bold mono; chat in sans | light gray | orange→yellow |
| 14.3 dark 2025 | #191919 | left, gray | bold light; cyan vars | dark gray | same, dark bg |
| 15 2026 | white | left | bold mono; comments teal | light gray | orange→yellow |

## Do NOT copy verbatim vs. generic elements

**Trademarked / logo material. Avoid, or redraw as a clearly different generic mark:**
- **Spikey** in every form: the stellated-icosahedron/rhombic-hexecontahedron app icons, the notebook-file icon in title bars (v5+ on Windows, macOS `.nb` icon), the splash polyhedra, the v9 orange spiky "==" W|A marker, and the v15 blue starburst "Insert and evaluate" icon.
- Wordmarks: "Mathematica" italic logotype, "WOLFRAM RESEARCH", "Wolfram Mathematica N", the "WolframAlpha" pod footer, the "30 Years of Mathematica" roundel. The same goes for splash screens and About boxes (`v1-1988-mac-startup.png`, `v1x-1989-mac-color-splash.jpg`, etc.): use them for reference only.
- Assistant/chat glyphs specific to Wolfram (the response icon in 13.3).
- OS vendor marks: the Apple rainbow/menu-bar apple, the NeXT cube logo in the Dock, the Windows flag and Start branding, the Excel icon. Use a neutral generic menu-bar glyph.
- Third-party content in screenshots (the Calculus&Mathematica title page, NeXTMail content, the Addison-Wesley copyright) and the dog photo in the Association example.

**Generic UI grammar. Fine to recreate from scratch in code:**
- Right-hand nested cell brackets, and `In[n]:=` / `Out[n]=` labels (the label text is language syntax, not a logo). Placement: above in 1988–97, left from about v4.
- Monospace bold input with plain output, `-Graphics-` text, 2D ASCII math, and typeset math.
- Pinstriped/black/navy title bars, dithered scroll bars and vertical NeXT-style menus. Recreate these *styles*, not the vendor logos.
- Rounded gray control panels with sliders and a `+` button, setter bars and checkboxes; suggestions bar with ▾ items; rounded orange-bordered entity chips; W|A-style pods; chat cells with a blue border and speech-bubble icons; a bottom chatbar with a → send button; piano-roll MusicScore panels with play/stop buttons; dark-mode palettes.
- Default plot colour schemes (blue/orange/green; orange-yellow Plot3D; v6 violet-pink lighting). These are colour choices, not marks.

[inferred] Legal note: using the product name in a documentary is generally nominative use. Recreating recognisable trade dress (for example the exact Spikey or the notebook icon) is the risky part. Get this checked if the film is distributed commercially.

## Gaps (not found or not verified)
- No live-screen SMP capture (only printouts).
- No Windows 95/NT v3.0 screenshot, no Mac OS X Aqua v4/v5 notebook, no Mac 2.x notebook.
- No full v6 Mac notebook window (only Manipulate panels, syntax snippets and a Windows Manipulate).
- The 14.3 dark images use the blog stylesheet (italic labels, proportional code). The default dark labels and code font are not verified.
