// Browser preview: same drawFrame as the offline renderer, clocked by the audio element.
import { setCanvasFactory } from './core/draw';
import { drawFrame } from './core/film';
import { DURATION } from './core/time';
import './film/index';
import { loadAssets, ASSETS } from './core/assets';

setCanvasFactory((w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; });
const cv = document.getElementById('c') as HTMLCanvasElement;
const g = cv.getContext('2d')!;
const audio = new Audio('/out/music.wav');
const seek = document.getElementById('seek') as HTMLInputElement;
const time = document.getElementById('time')!;
const play = document.getElementById('play')!;
const q = new URLSearchParams(location.search);
audio.currentTime = Number(q.get('t') ?? 0);
play.onclick = () => (audio.paused ? audio.play() : audio.pause());
seek.oninput = () => { audio.currentTime = Number(seek.value); };
addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === ' ') { e.preventDefault(); play.click(); }
  if (e.key === 'ArrowRight') audio.currentTime += e.shiftKey ? 5 : 1;
  if (e.key === 'ArrowLeft') audio.currentTime -= e.shiftKey ? 5 : 1;
  if (e.key === '.') audio.currentTime += 1 / 60;
  if (e.key === ',') audio.currentTime -= 1 / 60;
});
await document.fonts.ready;
await loadAssets({
  image: (p) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = '/' + p; }),
  json: async (p) => { const r = await fetch('/' + p); if (!r.ok) throw new Error(p); return r.json(); },
}, ASSETS);
const loop = () => {
  const t = Math.min(audio.currentTime, DURATION - 1e-3);
  drawFrame(g, t);
  seek.value = String(t);
  time.textContent = `${t.toFixed(2)}s  bar ${(t / 2).toFixed(2)}`;
  requestAnimationFrame(loop);
};
loop();
