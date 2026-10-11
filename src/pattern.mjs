const colours = ['#d06961', '#468f86', '#ddb64f', '#927ba5', '#d887a0', '#628faa', '#db974f', '#699477'];
const paper = '#eee1cb';
const cream = '#fff2d3';

export function pattern(kind, variation = 0, design = 'basic') {
  const count = variation ? 6 : 8;
  const sectors = Array.from({ length: count }, (_, i) => {
    const angle = i * 360 / count;
    const colour = colours[i];
    let marks;
    if (design === 'mirror-ring') {
      marks = `<path d="M123 47Q150 34 177 47L181 82Q150 72 119 82Z" fill="#dc8754"/>
        <path d="M138 78C110 52 124 18 145 27C171 38 163 62 143 55C129 48 138 35 147 42" fill="${colour}" stroke="${cream}" stroke-width="2.4"/>
        <path d="M133 66C111 48 129 24 142 31" fill="none" stroke="#dfb54d" stroke-width="3" stroke-dasharray="1 5" stroke-linecap="round"/>
        <g transform="rotate(45 150 92)"><rect x="136" y="78" width="28" height="28" rx="2" fill="#ece6cf" stroke="${colour}" stroke-width="3"/><path d="M141 101L157 83M148 103L160 91" stroke="#fff9e8" stroke-width="2"/></g>
        <circle cx="170" cy="32" r="4" fill="#e7bb54"/><circle cx="172" cy="67" r="3" fill="${cream}"/>`;
    } else if (design === 'lotus') {
      marks = `<path d="M150 139C128 114 122 91 150 66C177 91 174 116 150 139Z" fill="${kind === 'newspaper' ? paper : colour}" stroke="${cream}" stroke-width="3"/>
        <path d="M150 126Q132 105 150 81Q168 105 150 126Z" fill="${colour}" opacity=".85"/>
        <path d="M150 116V88M146 109L139 98M154 106L160 94" stroke="#d7b558" stroke-width="2" fill="none"/>
        <path d="M135 77Q123 58 132 48Q147 54 145 73M155 73Q154 52 167 48Q177 61 164 78" fill="#70a292" stroke="${cream}" stroke-width="2"/>
        <circle cx="150" cy="37" r="14" fill="#f1debc" stroke="${colour}" stroke-width="3"/><path d="M154 32C138 26 137 45 150 44C160 43 159 34 150 35" stroke="${colour}" fill="none" stroke-width="2"/>
        <path d="M128 22Q150 4 172 22" fill="none" stroke="#9c779f" stroke-width="7" stroke-linecap="round"/><circle cx="150" cy="14" r="3" fill="${cream}"/>`;
    } else if (design === 'festival') {
      const packets = [52, 82, 112].map((y, row) => `<g transform="translate(0 ${y - 58})"><path d="M139 43l-4 6 4 23h22l4-23-4-6-6 3-8-3z" fill="${colours[(i + row * 2) % 8]}" stroke="${cream}" stroke-width="1.5"/><path d="M141 51h18m-16 13h14" stroke="#f6dea1" stroke-width="2"/></g>`).join('');
      marks = `${packets}<path d="M125 72Q118 52 128 39M172 39Q184 52 175 72" fill="none" stroke="#72a096" stroke-width="4" stroke-linecap="round"/>
        <path d="M128 27Q150 6 172 27Q151 38 128 27Z" fill="${colour}" stroke="${cream}" stroke-width="2"/>
        <path d="M145 25Q151 18 157 25" fill="none" stroke="#edbb58" stroke-width="2"/>
        <circle cx="128" cy="18" r="3" fill="#e2b550"/><circle cx="172" cy="18" r="3" fill="#e2b550"/>`;
    } else if (design === 'star') {
      marks = `<path d="M150 139L128 106L132 75L150 46L168 75L172 106Z" fill="${colour}" stroke="${cream}" stroke-width="3"/>
        <path d="M150 128L138 104L150 79L162 104Z" fill="${cream}"/><path d="M150 113L143 101L150 90L157 101Z" fill="#e1b553"/>
        <path d="M150 74V53M138 75L143 68M162 75L157 68" fill="none" stroke="#9e9583" stroke-width="1.5"/>
        <path d="M128 53Q117 25 142 22Q157 25 149 39Q139 47 134 35" fill="none" stroke="${colour}" stroke-width="4" stroke-linecap="round"/>
        <circle cx="165" cy="28" r="8" fill="#dbac53" stroke="${cream}" stroke-width="2"/><path d="M123 12Q150 0 177 12" fill="none" stroke="#698f84" stroke-width="5" stroke-linecap="round"/>`;
    } else if (design === 'blossom') {
      marks = `<path d="M150 136C124 117 119 82 150 45C180 82 177 117 150 136Z" fill="${paper}" stroke="${cream}" stroke-width="3"/>
        <path d="M150 123Q132 100 150 68Q168 100 150 123Z" fill="${i % 2 ? '#927ba5' : '#d887a0'}" opacity=".75"/>
        <path d="M150 110V81M145 96L140 88M155 96L160 88" fill="none" stroke="${cream}" stroke-width="2"/>
        <path d="M124 67Q113 42 128 33Q145 42 138 61M162 61Q155 42 172 33Q188 42 176 67" fill="#82a89b" stroke="${cream}" stroke-width="2"/>
        <path d="M133 22Q150 9 167 22" fill="none" stroke="#d5ad54" stroke-width="3" stroke-linecap="round"/><circle cx="150" cy="23" r="4" fill="${cream}"/>`;
    } else if (design === 'pinwheel') {
      marks = `<path d="M150 136Q117 104 125 60Q157 68 169 96Q161 117 150 136Z" fill="${colour}" stroke="${cream}" stroke-width="3"/>
        <path d="M149 120Q133 96 134 77Q151 86 157 101Z" fill="#e8bd62"/>
        <path d="M173 74Q189 58 185 43Q165 40 163 61Z" fill="#6e9c87" stroke="${cream}" stroke-width="2"/>
        <path d="M127 40Q140 21 160 30" fill="none" stroke="${colour}" stroke-width="5" stroke-linecap="round"/><circle cx="166" cy="29" r="4" fill="#e2b553"/>`;
    } else if (design === 'rosette') {
      marks = `<path d="M150 136C128 123 125 105 135 91C120 72 133 51 150 57C168 51 180 72 165 91C176 109 168 125 150 136Z" fill="${i % 2 ? '#cd7f9e' : '#b0789b'}" stroke="${cream}" stroke-width="3"/>
        <path d="M150 119Q136 104 150 89Q164 104 150 119Z" fill="#e6b651"/>
        <path d="M125 73Q106 55 117 40Q138 44 138 63M163 63Q162 44 183 40Q194 55 176 73" fill="#68a295" stroke="${cream}" stroke-width="2"/>
        <path d="M138 32Q150 17 162 32" fill="none" stroke="#dfad52" stroke-width="4" stroke-linecap="round"/><circle cx="150" cy="28" r="3" fill="${cream}"/>`;
    } else {
      const fill = kind === 'newspaper' ? paper : ['#cc6553', '#418b83', '#dcad46', '#6a9794'][i % 4];
      marks = `<path class="petal" pathLength="1" d="M150 133C119 106 115 76 150 33C184 76 182 109 150 133Z" fill="${fill}" stroke="${cream}" stroke-width="${kind === 'powder' ? 5 : 3}" stroke-linecap="round" stroke-linejoin="round"/>${kind === 'newspaper' ? '<path d="M140 74h20m-23 9h26m-24 9h22m-19 9h17" stroke="#8a8175" stroke-width="2" opacity=".5"/>' : ''}`;
    }
    return `<g class="piece"><g transform="rotate(${angle} 150 150)">${marks}</g></g>`;
  }).join('');
  const id = `rough-${kind}-${variation}-${design}`;
  const centre = design === 'basic' ? `<circle cx="150" cy="150" r="13" fill="#e1af43" stroke="${cream}" stroke-width="4"/>` : `<circle cx="150" cy="150" r="20" fill="#dfaa53" stroke="${cream}" stroke-width="3"/><circle cx="150" cy="150" r="11" fill="#b86774" stroke="${cream}" stroke-width="2"/><circle cx="150" cy="150" r="4" fill="#f0d994"/>`;
  return `<svg viewBox="0 0 300 300" class="rangoli-svg design-${design}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="${id}" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="8" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8"/></filter></defs><g filter="url(#${id})" stroke-linejoin="round">${sectors}<g class="centre">${centre}</g>${kind === 'powder' ? `<circle class="outline" pathLength="1" cx="150" cy="150" r="132" fill="none" stroke="${cream}" stroke-width="3" stroke-dasharray="1"/>` : ''}</g></svg>`;
}
