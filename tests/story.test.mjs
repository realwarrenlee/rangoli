import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scenes, making, sampleScene, sampleJourney } from '../src/story.mjs';
import { pattern } from '../src/pattern.mjs';
import { readFileSync, existsSync } from 'node:fs';

test('varied designs keep the scroll sector contract and simple beginner patterns', () => {
  const designs = new Set();
  scenes.forEach((scene, index) => scene.patterns.forEach(([, , , kind, design = 'basic'], n) => {
    const svg = pattern(kind, n, design);
    assert.equal((svg.match(/class="piece"/g) || []).length, sampleScene(index, .5).works[n].pieces.length);
    assert.ok(svg.includes('class="centre"'));
    if (design !== 'basic') {
      designs.add(design);
      assert.ok((svg.match(/<path/g) || []).length > (pattern(kind, n).match(/<path/g) || []).length);
    }
    if (index < 2) assert.equal(design, 'basic');
  }));
  assert.deepEqual([...designs], ['mirror-ring', 'festival', 'lotus', 'star', 'blossom', 'pinwheel', 'rosette']);
  const childDesigns = scenes.slice(4).map(scene => scene.patterns.at(-1)[4]);
  assert.equal(new Set(childDesigns).size, childDesigns.length);
  assert.ok(childDesigns.slice(1).every(design => !pattern('newspaper', 1, design).includes('fill="#eee1cb"')));
});

test('all forward, reverse and skipped scroll positions produce valid states', () => {
  const values = Array.from({ length: 701 }, (_, i) => i / 700);
  const forward = values.map(p => sampleJourney(p));
  assert.deepEqual(values.toReversed().map(p => sampleJourney(p)).toReversed(), forward);
  for (const { index, local } of forward) {
    assert.ok(index >= 0 && index < scenes.length);
    const state = sampleScene(index, local);
    assert.ok(state.fill >= 0 && state.fill <= 1);
    assert.equal(state.poses.length, scenes[index].cast.length);
    state.poses.forEach((pose, n) => assert.ok(Number.isInteger(pose) && pose >= 0 && pose < (scenes[index].cast[n][0] === 'community' ? 16 : scenes[index].cast[n][0] === 'practitioner' ? 8 : 4)));
  }
  assert.deepEqual(sampleJourney(-1), sampleJourney(0));
  assert.deepEqual(sampleJourney(2), sampleJourney(1));
});

test('food is assembled, then distributed within the same scene', () => {
  assert.equal(sampleScene(3, .6).fill, 1);
  assert.ok(sampleScene(3, .95).fill < .2);
  assert.equal(sampleScene(3, .6).poses[0], 12);
  assert.equal(sampleScene(3, .75).poses[0], 4);
});

test('making holds one placing action through all petals and the final pause', () => {
  assert.equal(making(.1, .2, .8, 8).fill, 0);
  for (let p = .2; p <= 1; p += .01) assert.equal(making(p, .2, .8, 8).stage, 'place');
  const states = Array.from({ length: 46 }, (_, i) => sampleScene(0, .55 + i * .01));
  assert.ok(states.every(s => s.poses[1] === 1 && s.facing[1] === 1 && s.camera === 1));
  assert.ok(states.every((s, i) => !i || s.works[1].fill >= states[i - 1].works[1].fill));
  assert.equal(states.at(-1).works[1].fill, 1);
  for (const [scene, start, actor] of [[2, .18, 0], [4, .58, 1], [4, .69, 2], [5, .74, 2], [6, .3, 1]]) {
    for (let p = start; p <= 1; p += .01) assert.equal(sampleScene(scene, p).poses[actor], 1);
  }
});

test('each newspaper maker arrives before their own pattern starts', () => {
  for (let p = 0; p <= 1; p += .005) {
    const state = sampleScene(4, p);
    state.works.forEach((work, n) => { if (work.fill > 0) assert.equal(state.opacity[n], 1); });
  }
  assert.equal(sampleScene(0, .16).works[0].fill, 0);
  assert.equal(sampleScene(5, .7).works[1].fill, 0);
});

test('community gestures are staggered and sharing faces the recipient', () => {
  const during = sampleScene(3, .16);
  assert.equal(during.actions.filter(a => a === 'place').length, 1);
  assert.equal(sampleScene(3, .7).actions[0], 'share');
  assert.notEqual(sampleScene(3, .7).actions[4], 'share');
  assert.equal(sampleScene(3, .9).facing[2], -1);
  assert.equal(sampleScene(0, .42).facing[1], -1);
  assert.equal(sampleScene(5, .2).facing[1], 1);
  assert.equal(sampleScene(5, .8).facing[1], 1);
});

test('teacher leaves and learner teaches a child at the handoff', () => {
  assert.equal(sampleScene(5, .2).opacity[0], 1);
  assert.equal(sampleScene(5, .2).opacity[2], 0);
  assert.equal(sampleScene(5, .9).opacity[0], 0);
  assert.equal(sampleScene(5, .9).opacity[2], 1);
  assert.equal(sampleScene(5, .9).poses[1], 2);
});

test('each used actor has a valid crop and a real transparent sheet', () => {
  const bounds = JSON.parse(readFileSync(new URL('../src/pose-bounds.json', import.meta.url)));
  for (const scene of scenes) {
    assert.ok(existsSync(new URL(`../public/assets/${scene.background}-background.webp`, import.meta.url)));
    for (const [who] of scene.cast) {
      assert.ok(existsSync(new URL(`../public/assets/${who}.webp`, import.meta.url)));
      for (const { rect: [x, y, width, height], hull } of bounds[who]) {
        assert.ok(x >= 0 && y >= 0 && width > 0 && height > 0);
        assert.ok(x + width <= 1536 && y + height <= 1024);
        assert.ok(hull.length >= 3);
        assert.ok(hull.flat().every(n => n >= 0 && n <= 100));
      }
    }
  }
  for (const who of ['community', 'practitioner']) {
    assert.ok(existsSync(new URL(`../public/assets/${who}-making.webp`, import.meta.url)));
    assert.equal(bounds[`${who}-making`].length, who === 'community' ? 8 : 4);
  }
});

test('full poses extend past grid seams that previously clipped heads and hands', () => {
  const bounds = JSON.parse(readFileSync(new URL('../src/pose-bounds.json', import.meta.url)));
  assert.ok(bounds['childhood-child'][2].rect[1] < 492);
  assert.ok(bounds.practitioner[2].rect[1] < 510);
  for (const index of [0, 4, 6]) {
    const [x, , width] = bounds.community[index].rect;
    assert.ok(x + width > (index % 4 + 1) * 384);
  }
});
