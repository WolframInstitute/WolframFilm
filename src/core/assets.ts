// Assets computed by the Wolfram Language (assets/wl/*), preloaded before any frame is drawn.
import type { G } from './draw';

type Loader = { image: (path: string) => Promise<any>; json: (path: string) => Promise<any> };
const images = new Map<string, any>();
const jsons = new Map<string, any>();

export async function loadAssets(L: Loader, names: { images: string[]; json: string[] }) {
  await Promise.all([
    ...names.images.map(async (n) => { try { images.set(n, await L.image(`assets/wl/${n}`)); } catch { /* missing: placeholder */ } }),
    ...names.json.map(async (n) => { try { jsons.set(n, await L.json(`assets/wl/${n}`)); } catch { /* missing */ } }),
  ]);
}
export const img = (n: string) => images.get(n);
export const json = <T = any>(n: string) => jsons.get(n) as T | undefined;

/** Draw an asset image fitted into a box (contain), or a labelled placeholder if it is missing. */
export function drawAsset(g: G, n: string, x: number, y: number, w: number, h: number, alpha = 1) {
  const im = img(n);
  g.save();
  g.globalAlpha *= alpha;
  if (!im) {
    g.strokeStyle = '#C33'; g.setLineDash([6, 4]); g.strokeRect(x, y, w, h); g.setLineDash([]);
    g.fillStyle = '#C33'; g.font = '14px "Source Code Pro"'; g.fillText(`[${n}]`, x + 8, y + 20);
  } else {
    const s = Math.min(w / im.width, h / im.height);
    const dw = im.width * s, dh = im.height * s;
    g.imageSmoothingEnabled = true;
    (g as any).imageSmoothingQuality = 'high';
    g.drawImage(im, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  }
  g.restore();
}

/** All asset names the film uses (kept in one place so both renderers can preload). */
export const ASSETS = {
  images: [
    'v1_plot3d.png', 'v2_surface.png', 'v5_colors.png', 'v6_europe.png',
    ...Array.from({ length: 16 }, (_, i) => `v6_manip_${String(i).padStart(2, '0')}.png`),
    'fam_contour.png', 'fam_density.png', 'fam_stream.png', 'fam_polar.png',
    'fam_knot.png', 'fam_spherical.png', 'fam_region3d.png', 'fam_complex.png',
    'v8_europe_graph.png', 'v10_geo.png', 'v10_globe.png', 'v13_astro.png', 'v15_eclipse.png', 'v10_stars.png', 'v11_birdsay.png', 'v12_molecule.png', 'v13_tree.png', 'hero_wordcloud.png',
    ...Array.from({ length: 32 }, (_, i) => `v12_system_${String(i).padStart(2, '0')}.png`),
    ...['fam_knot', 'fam_spherical', 'fam_region3d', 'fam_complex', 'v12_molecule', 'v13_geodesic', 'v6_manip_mid'].flatMap((n) => Array.from({ length: 24 }, (_, i) => `rot/${n}_${String(i).padStart(2, '0')}.png`)),
    ...['smp-manual-1.jpg', 'smp-summary-handwritten-1.png', 'smp-output-1.png', 'smp-ad-1.png', 'design-sketch-1986-1.jpg', 'design-notes-1986-1.jpg', 'design-notes-handwritten-1.png', 'first-code-1986-1.jpg', 'early-program-1987-1.png', 'product-names-1987-1.jpg', 'frontend-1987-1.jpg', 'v1-box-1.png', 'v1-book-1.jpg', 'v1-press-release-1.jpg', 'v1-launch-speakers-1.jpg', 'v1-launch-signatures-1.png', 'v1-startup-screen-1.png', 'v1-press-clipping-1.jpg', 'v1-apple-poster-1989-1.jpg', 'next-license-1.jpg', 'next-display-1.jpg', 'next-cube-1.jpg', 'next-jobs-card-1.jpg', 'v2-box-book-1.png', 'books-1995-1.jpg', 'v3-book-1.jpg', 'v3-typeset-1.jpg', 'v6-reinvented-1.jpg', 'v6-box-1.jpg', 'demonstrations-2007-1.png', 'wl2013-something-big-1.png', 'wl2013-raspberry-pi-1.png', 'wl2014-sxsw-1.jpg', 'chat-notebooks-2023-1.png', 'v14-functions-1.png', 'v15-launch-1.png', 'spikey-versions-1.png', 'spikey-born-1.png', 'spikey-then-now-1.png', 'spikey-candidates-1.png'].map((f) => `../archive/${f}`),
    'x_parallel.png', 'x_tree.png', 'x_quantum_circuit.png', 'x_quantum_std.png', 'x_quantum_trad.png', 'x_tabular.png', 'x_quantum_probs.png', 'x_fireballs.png', 'v13_geodesic.png',
  ],
  json: ['polyhedra.json', 'x_parallel_kernels.json', 'x_graph.json', 'x_compile.json', 'v12_system.json', 'v4_rule30.json', 'v4_rule110.json', 'v7_turing.json', 'v8_europe_graph.json', 'fam_names.json', 'manifest.json'],
};
