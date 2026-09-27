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
    'x_parallel.png', 'x_tree.png', 'x_quantum_circuit.png', 'x_quantum_probs.png', 'x_fireballs.png', 'v13_geodesic.png',
  ],
  json: ['x_parallel_kernels.json', 'x_graph.json', 'x_compile.json', 'v12_system.json', 'v4_rule30.json', 'v4_rule110.json', 'v7_turing.json', 'v8_europe_graph.json', 'fam_names.json', 'manifest.json'],
};
