import './style.css';
import poseBounds from './pose-bounds.json';
import { scenes, range, clamp, sampleScene, sampleJourney } from './story.mjs';

import { pattern } from './pattern.mjs';

function sceneMarkup(scene, index) {
  return `<div class="scene scene-${index}" data-scene="${index}"><div class="painting"><img class="backdrop" src="/assets/${scene.background}-background.webp" alt="" decoding="async">${scene.patterns.map(([x, y, width, kind, design], n) => `<div class="floor-work ${kind}" style="--x:${x}%;--y:${y}%;--w:${width}%">${pattern(kind, n, design)}</div>`).join('')}${scene.cast.map(([who, x, y, width, person = 0]) => `<div class="actor ${who}" data-person="${person}" style="--x:${x}%;--y:${y}%;--w:${who === 'community' ? width * .68 : width}%;--columns:${who === 'community' ? 4 : 2}"><div class="pose" style="background-image:url('/assets/${who}.webp')"></div></div>`).join('')}</div></div>`;
}

const journey = document.querySelector('#journey');
const caption = document.querySelector('#caption');
const title = caption.querySelector('h1');
const body = caption.querySelector('p');
const sceneRoot = document.querySelector('#scenes');
sceneRoot.innerHTML = scenes.map(sceneMarkup).join('');
document.querySelector('#story-text').innerHTML = scenes.map(s => `<section><h2>${s.name}</h2>${s.lines.map(([h, p]) => `<p>${h} ${p}</p>`).join('')}</section>`).join('');
const reading = document.querySelector('#reading');
reading.innerHTML = scenes.map((s, i) => `<section class="read-section"><div class="reading-art" aria-hidden="true">${sceneMarkup(s, i)}</div><div class="read-copy">${s.lines.map(([h, p], n) => `<${i === 0 && n === 0 ? 'h1' : 'h2'}>${h}</${i === 0 && n === 0 ? 'h1' : 'h2'}><p>${p}</p>`).join('')}</div></section>`).join('');

function cacheScene(root) {
  return { el: root, painting: root.querySelector('.painting'), actors: [...root.querySelectorAll('.actor')], patterns: [...root.querySelectorAll('.floor-work')].map(p => ({ el: p, pieces: [...p.querySelectorAll('.piece')], centre: p.querySelector('.centre'), outline: p.querySelector('.outline') })) };
}
const layers = [...sceneRoot.children].map(cacheScene);

function draw(layer, index, p) {
  const s = sampleScene(index, p);
  layer.painting.style.transform = `scale(${s.camera})`;
  layer.actors.forEach((actor, n) => {
    const columns = scenes[index].cast[n][0] === 'community' ? 4 : 2;
    const pose = actor.querySelector('.pose');
    const who = scenes[index].cast[n][0];
    const extra = s.poses[n] >= (who === 'community' ? 8 : 4);
    const sheet = `${who}${extra ? '-making' : ''}`;
    const frame = s.poses[n] - (extra ? who === 'community' ? 8 : 4 : 0);
    const col = frame % columns, row = Math.floor(frame / columns);
    const { rect: [x, y, width, height], hull } = poseBounds[sheet][frame];
    pose.style.backgroundImage = `url('/assets/${sheet}.webp')`;
    // Generated poses cross grid boundaries; preserve their full silhouettes and seated anchors.
    pose.style.left = `${(x - col * 1536 / columns) / (1536 / columns) * 100}%`;
    pose.style.top = `${(y - row * 512) / 512 * 100}%`;
    pose.style.width = `${width / (1536 / columns) * 100}%`;
    pose.style.height = `${height / 512 * 100}%`;
    pose.style.backgroundSize = `${1536 / width * 100}% ${1024 / height * 100}%`;
    pose.style.backgroundPosition = `${x / (1536 - width) * 100}% ${y / (1024 - height) * 100}%`;
    pose.style.clipPath = `polygon(${hull.map(([px, py]) => `${px}% ${py}%`).join(',')})`;
    actor.style.opacity = s.opacity[n];
    actor.style.transform = `translate(-50%,-50%) scaleX(${s.facing[n]})`;
    // The learner becomes the teacher at the same seated anchor used in the final scene.
    if (index === 5 && n === 1) { actor.style.setProperty('--x', `${81 - 23 * s.handoff}%`); actor.style.setProperty('--y', `${52 - 6 * s.handoff}%`); }
  });
  layer.patterns.forEach((work, n) => {
    const { fill, pieces } = s.works[n];
    // Community marks follow the nearest maker rather than appearing around the circle by themselves.
    const order = index === 3 ? [7, 0, 1, 3, 5, 6, 2, 4] : work.pieces.map((_, k) => k);
    work.pieces.forEach((piece, k) => {
      const amount = pieces[order.indexOf(k)];
      piece.style.opacity = amount;
      const petal = piece.querySelector('.petal');
      if (petal && work.el.classList.contains('powder')) { petal.style.strokeDasharray = 1; petal.style.strokeDashoffset = 1 - amount; petal.style.fillOpacity = amount * .7; }
    });
    work.centre.style.opacity = range(fill, .05, .2);
    if (work.outline) work.outline.style.strokeDashoffset = 1 - fill;
  });
  layer.el.style.setProperty('--separate', index === 4 ? range(p, .2, .7) : 0);
  layer.el.style.setProperty('--people-rest', index === 1 ? 1 - range(p, .45, .7) * .62 : 1);
}

reading.querySelectorAll('.scene').forEach((el, i) => { draw(cacheScene(el), i, i === 3 ? .76 : .95); el.style.opacity = 1; el.style.visibility = 'visible'; el.querySelector('.painting').style.transform = 'none'; });
const media = matchMedia('(prefers-reduced-motion: reduce)');
let reduced = media.matches, frame = 0, lastCaption = '';

function update() {
  frame = 0;
  if (reduced) return;
  const bounds = journey.getBoundingClientRect();
  const progress = clamp(-bounds.top / (journey.offsetHeight - innerHeight));
  const { index, local, reveal } = sampleJourney(progress);
  layers.forEach((layer, i) => {
    const visible = i === index || (i === index + 1 && reveal > 0);
    layer.el.style.visibility = visible ? 'visible' : 'hidden';
    if (!visible) return;
    draw(layer, i, i === index ? local : 0);
    layer.el.style.opacity = 1;
    layer.el.style.setProperty('--paint', i === index ? '160%' : `${reveal * 160}%`);
  });
  const state = sampleScene(index, local);
  const key = `${index}-${state.line}`;
  if (key !== lastCaption) {
    [title.textContent, body.textContent] = scenes[index].lines[state.line];
    caption.classList.toggle('opening', index === 0 && state.line === 0);
    lastCaption = key;
  }
  caption.style.opacity = index < scenes.length - 1 ? 1 - reveal : 1;
}
function schedule() { if (!frame) frame = requestAnimationFrame(update); }
function setMotion() {
  journey.hidden = reduced;
  reading.hidden = !reduced;
  if (!reduced) schedule();
}
media.addEventListener('change', () => { reduced = media.matches; setMotion(); });
addEventListener('scroll', schedule, { passive: true });
addEventListener('resize', schedule);
// Decoded assets share the scroll state; they never start a separate animation clock.
document.fonts.ready.then(schedule);
setMotion();
update();

document.querySelector('.film-button').addEventListener('click', () => {
  const player = document.createElement('iframe');
  player.src = 'https://www.youtube.com/embed/S7i09mka5ec?autoplay=1';
  player.title = 'Vijayalakshmi Mohan — a film by Roots Sg';
  player.referrerPolicy = 'strict-origin-when-cross-origin';
  player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  player.allowFullscreen = true;
  document.querySelector('#film').replaceChildren(player);
});

