// Seekable playback on the Wolfram Cloud: MSE in a worker, handed over as a MediaSourceHandle.
(() => {
  const v = document.getElementById('film');
  const base = 'https://www.wolframcloud.com/obj/wolframinstitute/WolframFilm/player/';
  if (window.MediaSource && MediaSource.canConstructInDedicatedWorker) {
    const w = new Worker(base + 'worker.js');
    w.onmessage = (e) => {
      if (e.data.type === 'handle') v.srcObject = e.data.handle;
      else if (e.data.type === 'error') console.error('player:', e.data.message);
    };
    w.postMessage({ type: 'start', base, codecs: 'avc1.640032, mp4a.40.2' });
    const tell = () => w.postMessage({ type: 'time', t: v.currentTime });
    v.addEventListener('timeupdate', tell);
    v.addEventListener('seeking', tell);
  } else {
    v.src = 'https://www.wolframcloud.com/obj/wolframinstitute/WolframFilm/In1-en.mp4'; // progressive fallback
  }
})();
