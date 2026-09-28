// Media Source Extensions inside a Worker: the page receives a MediaSourceHandle as video.srcObject,
// so no blob: URL is ever created (the Wolfram Cloud's CSP forbids blob: media).
// Segments are fragmented-MP4 pieces of the film, fetched from public cloud objects.
let ms, sb, segs = [], init = null, base = '', want = 0, busy = false;
const fetched = new Set();

self.onmessage = async (e) => {
  const m = e.data;
  if (m.type === 'start') {
    base = m.base;
    const text = await (await fetch(base + 'film.m3u8')).text();
    let t = 0;
    for (const line of text.split('\n')) {
      if (line.startsWith('#EXT-X-MAP')) init = line.match(/URI="([^"]+)"/)[1];
      else if (line.startsWith('#EXTINF:')) { const d = parseFloat(line.slice(8)); segs.push({ t0: t, d, uri: null }); t += d; }
      else if (line.trim() && !line.startsWith('#') && segs.length && !segs[segs.length - 1].uri) segs[segs.length - 1].uri = line.trim();
    }
    ms = new MediaSource();
    ms.addEventListener('sourceopen', async () => {
      ms.duration = t;
      sb = ms.addSourceBuffer(`video/mp4; codecs="${m.codecs}"`);
      await append(await get(init));
      pump();
    });
    self.postMessage({ type: 'handle', handle: ms.handle, duration: t }, [ms.handle]);
  } else if (m.type === 'time') {
    want = m.t;
    pump();
  }
};

const get = async (uri) => new Uint8Array(await (await fetch(base + uri)).arrayBuffer());
const whenIdle = () => (sb.updating ? new Promise((res) => sb.addEventListener('updateend', res, { once: true })) : Promise.resolve());
const append = async (buf) => { await whenIdle(); sb.appendBuffer(buf); await whenIdle(); };
const segAt = (t) => Math.max(0, segs.findIndex((s) => t >= s.t0 && t < s.t0 + s.d));

async function pump() {
  if (busy || !sb) return;
  busy = true;
  try {
    for (;;) {
      // keep ~30 s ahead of the playhead, starting from the segment that contains it (so seeks jump)
      let i = segAt(want);
      while (i < segs.length && fetched.has(i)) i++;
      if (i >= segs.length || segs[i].t0 > want + 30) break;
      await append(await get(segs[i].uri));
      fetched.add(i);
      // drop what is far behind the playhead, to bound memory
      if (want > 90) {
        await whenIdle(); sb.remove(0, want - 60); await whenIdle();
        for (const k of [...fetched]) if (segs[k].t0 + segs[k].d < want - 60) fetched.delete(k);
      }
    }
    if (fetched.size === segs.length && ms.readyState === 'open') ms.endOfStream();
  } catch (err) {
    self.postMessage({ type: 'error', message: String(err) });
  }
  busy = false;
}
setInterval(pump, 1000);
