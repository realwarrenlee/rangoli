export const clamp = n => Math.max(0, Math.min(1, n));
export const range = (p, a, b) => clamp((p - a) / (b - a));
export const ease = n => n * n * (3 - 2 * n);

export const scenes = [
  { name: 'Beside her mother', background: 'doorstep', cast: [['mother', 61, 48, 30], ['childhood-child', 82, 53, 23]], patterns: [[63, 74, 28, 'powder'], [80, 71, 17, 'powder']], lines: [
    ['A welcome\nthat grows.', 'A small encounter with rangoli.'],
    ['Beside her mother.', 'Every morning, she made rangoli beside her mother.'],
    ['Room to begin.', 'Her mother gave her some powder. She made a design of her own.']
  ] },
  { name: 'A place to welcome', background: 'doorstep', cast: [['mother', 61, 48, 30], ['childhood-child', 82, 53, 23]], patterns: [[63, 74, 28, 'powder'], [80, 71, 17, 'powder']], lines: [
    ['A place to welcome.', 'At the doorstep, rangoli welcomes guests.'],
    ['A hope for the home.', 'For her, it also carries hopes of protection, health and prosperity.'],
    ['Even the smallest\nvisitors.', 'Made with rice powder, it can feed small birds and insects too.']
  ] },
  { name: 'More ways to begin', background: 'community', cast: [['practitioner', 71, 47, 35]], patterns: [[71, 76, 33, 'bottle', 'mirror-ring']], lines: [
    ['More ways to begin.', 'Vijayalakshmi Mohan wanted more people to learn rangoli.'],
    ['Familiar shapes.\nNew materials.', 'Through Singa Rangoli, she explored designs with materials people could find.'],
    ['Something beautiful.', 'Even a used bottle could become part of a rangoli.']
  ] },
  { name: 'Made together', background: 'community', cast: [['community', 54, 43, 24, 0], ['community', 70, 39, 23, 1], ['community', 86, 44, 24, 2], ['practitioner', 54, 74, 27], ['community', 86, 74, 24, 3]], patterns: [[70, 65, 34, 'food', 'festival']], lines: [
    ['Made together.', 'With migrant workers, she made a rangoli from sweets and snacks.'],
    ['Every hand\nadds something.', 'The pattern takes shape through people making together.'],
    ['Shared afterwards.', 'Afterwards, the food was shared with those who took part.']
  ] },
  { name: 'Another way to make', background: 'community', cast: [['practitioner', 49, 48, 25], ['learner', 70, 59, 23], ['new-child', 89, 43, 21]], patterns: [[49, 70, 25, 'newspaper', 'lotus'], [70, 79, 21, 'newspaper', 'star'], [89, 62, 18, 'newspaper', 'blossom']], lines: [
    ['When people\ncould not gather.', 'During the pandemic, the invitation needed another form.'],
    ['Another way to make.', 'She used newspaper, reaching community centres and organisations.'],
    ['Separate places.\nA shared practice.', 'These separate making spaces illustrate the idea of participation beyond one gathering.']
  ] },
  { name: 'Passing it on', background: 'community', cast: [['practitioner', 58, 46, 29], ['learner', 81, 52, 28], ['new-child', 86, 52, 23]], patterns: [[62, 70, 24, 'newspaper', 'mirror-ring'], [83, 72, 22, 'newspaper', 'pinwheel']], lines: [
    ['One person learns.', 'She makes the steps simple enough for another person to learn.'],
    ['Then teaches another.', 'A learner describes teaching her children, who share it with neighbours and friends.'],
    ['From person\nto person.', 'The practice continues when someone helps another person begin.']
  ] },
  { name: 'Room for your own design', background: 'community', cast: [['learner', 60, 48, 31], ['new-child', 87, 54, 23]], patterns: [[64, 74, 29, 'newspaper', 'star'], [85, 73, 18, 'newspaper', 'rosette']], lines: [
    ['Your own design.', 'A new pair of hands. A different way to arrange the same small pieces.'],
    ['Her mother gave her\nroom to make.', 'Now she makes room for others.'],
    ['A welcome\nthat keeps growing.', 'There is room for another person to begin.']
  ] }
];

// Hold the placing pose throughout making, including the completed-pattern pause.
export function making(p, start, end, count) {
  const t = range(p, start, end) * count;
  const stage = p < start ? 'rest' : 'place';
  const pieces = Array.from({ length: count }, (_, k) => clamp(t - k));
  return { pieces, fill: pieces.reduce((a, b) => a + b, 0) / count, stage };
}

export function sampleScene(index, progress) {
  const p = clamp(progress);
  const windows = [ [[.18, .37], [.55, .86]], [[0, 0], [0, 0]], [[.18, .72]], [[.14, .57]], [[.16, .52], [.58, .79], [.69, .88]], [[.17, .42], [.74, .9]], [[0, 0], [.3, .83]] ][index];
  const works = scenes[index].patterns.map((_, n) => {
    const count = n ? 6 : 8;
    if (index === 1 || index === 6 && n === 0) return { pieces: Array(count).fill(1), fill: 1, stage: 'rest' };
    return making(p, ...windows[n], count);
  });
  const actions = scenes[index].cast.map(() => 'rest');
  const owners = [0, 1, 2, 4, 3, 0, 2, 4];
  if (index === 3) {
    scenes[index].cast.forEach((_, n) => { if (p >= .14 + owners.indexOf(n) * (.57 - .14) / 8) actions[n] = 'place'; });
    // Sharing happens one person at a time, after the completed pattern has had a hold.
    scenes[index].cast.forEach((_, n) => {
      const take = .66 + n * .04;
      if (p >= take) actions[n] = 'share';
    });
    works[0].pieces = works[0].pieces.map((amount, k) => amount * (1 - range(p, .69 + owners[k] * .04, .72 + owners[k] * .04)));
    works[0].fill = works[0].pieces.reduce((a, b) => a + b, 0) / 8;
  } else {
    works.forEach((work, n) => { actions[index === 5 && n === 1 ? 2 : index === 6 ? 1 : n] = work.stage; });
  }
  const poses = scenes[index].cast.map(([who, , , , person = 0], n) => {
    const action = actions[n];
    if (index === 3) return who === 'community' ? action === 'share' ? person + 4 : person + (action === 'place' ? 12 : 8) : action === 'share' ? 3 : action === 'place' ? 6 : 4;
    if (index === 1) return 1;
    if (index === 5 && who === 'practitioner') return 2;
    if (index === 5 && who === 'learner') return p < .65 ? 0 : 2;
    if (index === 6 && who === 'learner') return 2;
    return action === 'place' ? 1 : 0;
  });
  const facing = scenes[index].cast.map(([who], n) => index === 3 && actions[n] === 'share' && (n === 2 || n === 3) || who === 'childhood-child' && (poses[n] === 0 || poses[n] === 3) ? -1 : 1);
  const opacity = scenes[index].cast.map(([who], n) => index === 5 ? who === 'practitioner' ? 1 - ease(range(p, .45, .58)) : who === 'new-child' ? ease(range(p, .55, .68)) : 1 : index === 0 && n === 0 ? ease(range(p, 0, .16)) : index === 4 && n > 0 ? ease(range(p, .35 + n * .07, .50 + n * .07)) : 1);
  const line = Math.min(scenes[index].lines.length - 1, Math.floor(p * scenes[index].lines.length));
  return { poses, opacity, facing, actions, works, fill: works[0].fill, camera: 1, line, handoff: index === 5 ? ease(range(p, .45, .65)) : 0 };
}

export function sampleJourney(progress) {
  const scaled = clamp(progress) * scenes.length;
  const index = Math.min(scenes.length - 1, Math.floor(scaled));
  const local = scaled - index;
  return { index, local, reveal: ease(range(local, .89, 1)) };
}
