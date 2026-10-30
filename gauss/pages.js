// Chapter 10, page by page (after the AP Physics C E&M organizer, Unit 2). Text and an E(r) chart on
// the left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, SC, Y0 } from './world.js';

const f = (x, n = 2) => (x < -1e-12 ? '−' : '') + Math.abs(x).toFixed(n);
const nC = q => f(q * 1e9, 2);
const arrowNote = s => `箭头：${f(s, 1)} 格代表 1 kN/C。一格为 10 cm。`;

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], vlines = [], zero = false, cursor, cursors = [], label }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(Math.min(Math.max(y, y0), y1)).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const vl = vlines.map(([x, t]) => `<line class="grid" x1="${sx(x)}" x2="${sx(x)}" y1="${P.t}" y2="${H - P.b}"/><text class="ax" x="${sx(x)}" y="${H - 9}" text-anchor="middle">${t}</text>`).join('');
  const mk = marks.map(([x, y, t]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + 6}" y="${sy(y) + 14}">${t}</text>`).join('');
  const z = zero ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  const cs = [cursor, ...cursors].filter(Boolean).map(c => `<circle class="cursor" r="4.5" cx="-20" cy="-20" data-cursor="${c}"/>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${z}${vl}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2 + 40}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cs}
  </svg>`;
}
const curve = (fn, a, b, n = 80) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });
// chart ranges, shared with main.js for the live cursors
export const R = {
  flux: { x0: 0, x1: 180, y0: -80, y1: 80 },
  point: { x0: 0, x1: 26, y0: 0, y1: 2 },
  line: { x0: 0, x1: 22, y0: 0, y1: 0.8 },
  sheet: { x0: -15, x1: 15, y0: -0.5, y1: 0.5 },
  sphere: { x0: 0, x1: 26, y0: 0, y1: 2 },
  rod: { x0: 0, x1: 17, y0: 0, y1: 0.8 },
  cage: { x0: -40, x1: 40, y0: 0, y1: 3.2 },
};
const kE = fn => r => fn(r / 100) / 1000;     // r in cm → E in kN/C
const sphereChart = (fn, cursor, extra = []) => chart({ ...R.sphere, xlabel: 'r（cm）', ylabel: 'E（kN/C）', cursor, label: '电场强度随到中心距离的变化',
  vlines: [[10, 'R']], series: [...extra, { pts: curve(kE(fn), 0.001, 26, 120) }] });

export const PAGES = [
  {
    kicker: '第 10 章', title: '电通量', sub: '有多少电场穿过',
    body: `
      <p class="lede">电场穿过某个面的<b>电通量</b> Φ，衡量有多少电场穿过这个面。数一数穿过该面的电场线有多少条。</p>
      <div class="eq">Φ = <b>E</b> · <b>A</b> = <i>EA</i> cos θ</div>
      <p>面积矢量 <b>A</b> 垂直于该面，长度等于面积；θ 是 <b>E</b> 与 <b>A</b> 的夹角。电场越强、面积越大，或越正对电场，电通量就越大。单位：N·m²/C。</p>
      <p>这个边长 ${f(M.FLUX.side * 100, 0)} cm 的正方形在 ${f(M.FLUX.E / 1000, 1)} kN/C 的匀强电场中转动。正对电场时，Φ = ${f(M.FLUX.max, 0)} N·m²/C；侧对时为 0；转过 90° 后为负。匀强电场穿过任何<i>闭合</i>曲面的电通量都是 0。</p>
      <div class="charts">${chart({ ...R.flux, zero: true, xlabel: 'θ（°）', ylabel: 'Φ（N·m²/C）', cursor: 'flux', label: '电通量随角度的变化', series: [{ pts: curve(M.flux, 0, 180) }] })}</div>
      <p class="hintline">点击正方形，分解 <b>E</b>。${arrowNote(SC.flux)}</p>`,
    cam: { target: [STATIONS.flux + 0.3, Y0 - 0.2, 0], az: -16, el: 26, dist: 17 }, lit: 'flux', scene: 'flux', look: {},
    fig: '在匀强电场中转动的正方形',
  },
  {
    kicker: '10.1', title: '高斯定理', sub: '穿出的电通量 = 内部的电荷',
    body: `
      <p class="lede">穿过任何<b>闭合</b>曲面的总电通量，等于该曲面所围电荷除以 ε<sub>0</sub>。</p>
      <div class="eq">∮ <b>E</b> · d<b>A</b> = <i>q</i><sub>enc</sub> / ε<sub>0</sub></div>
      <p>d<b>A</b> 指向外。球面在胀缩，但 Φ 始终是 ${f(M.POINT.flux, 0)} N·m²/C：<i>E</i> 按 1/<i>r</i>² 减小，面积 4π<i>r</i>² 按 <i>r</i>² 增大。球面上 <b>E</b> ∥ d<b>A</b>，且 <i>E</i> 处处相等，所以</p>
      <div class="eq"><i>E</i> · 4π<i>r</i>² = <i>q</i>/ε<sub>0</sub> &nbsp;→&nbsp; <i>E</i> = <i>kq</i>/<i>r</i>²</div>
      <p>这就是库仑定律。盒子里没有电荷：进入盒子的每条电场线都会穿出，所以它的电通量为零。</p>
      <div class="charts">${chart({ ...R.point, xlabel: 'r（cm）', ylabel: 'E（kN/C）', cursor: 'point', label: '点电荷的电场随距离的变化', series: [{ pts: curve(kE(M.pointE), 6.5, 26) }] })}</div>
      <p class="hintline">点击球面查看 d<b>A</b>，点击盒子查看各个面。${arrowNote(SC.point)}</p>`,
    cam: { target: [STATIONS.gauss + 1.2, Y0, 0], az: -10, el: 14, dist: 29 }, lit: 'gauss', scene: 'gauss', look: {},
    fig: `q = ${nC(M.POINT.q)} nC，两个闭合曲面`,
  },
  {
    kicker: '10.2', title: '带电直线', sub: '用圆柱面把它包起来',
    body: `
      <p class="lede">一条无限长直线，每米带电 λ。由对称性，<b>E</b> 从直线垂直向外，所以用半径为 <i>r</i>、长为 <i>L</i> 的同轴圆柱面把它包起来。</p>
      <p>把这个曲面分成两个底面和一个侧面。底面上 <b>E</b> ⊥ d<b>A</b>：没有电通量。侧面上 <b>E</b> ∥ d<b>A</b>，且 <i>E</i> 处处相等：</p>
      <div class="eq"><i>E</i> · 2π<i>rL</i> = λ<i>L</i>/ε<sub>0</sub> &nbsp;→&nbsp; <i>E</i> = 2<i>k</i>λ/<i>r</i></div>
      <p><i>L</i> 约掉了，电场按 1/<i>r</i> 减小，比点电荷的电场减小得慢。这里 λ = ${nC(M.LINE.lam)} nC/m，所以 10 cm 处 <i>E</i> = ${f(M.lineE(0.1), 0)} N/C。</p>
      <div class="charts">${chart({ ...R.line, xlabel: 'r（cm）', ylabel: 'E（kN/C）', cursor: 'line', label: '带电直线的电场随距离的变化', series: [{ pts: curve(kE(M.lineE), 4.5, 22) }] })}</div>
      <p class="hintline">点击圆柱面，取下它的两个底面。${arrowNote(SC.line)}</p>`,
    cam: { target: [STATIONS.line, Y0, 0], az: -32, el: 18, dist: 23 }, lit: 'line', scene: 'line', look: {},
    fig: '底面与侧面',
  },
  {
    kicker: '10.3', title: '带电平面与金属板', sub: '跨过表面的扁圆柱高斯面',
    body: `
      <p class="lede">让一个扁圆柱高斯面跨过每个表面。它的侧面与 <b>E</b> 平行，所以只有底面有电通量，所围电荷为 σ<i>A</i>。</p>
      <table class="data">
        <tr><th></th><th>不导电的带电平面</th><th>金属板</th></tr>
        <tr><td>有电通量穿出的面</td><td>两个底面：2<i>EA</i></td><td>一个底面：<i>EA</i></td></tr>
        <tr><td>所以 <i>E</i> =</td><td>σ/2ε<sub>0</sub> = ${f(M.SHEET.E, 0)} N/C</td><td>σ/ε<sub>0</sub> = ${f(M.PLATE.E, 0)} N/C</td></tr>
      </table>
      <p>金属内部 <i>E</i> = 0，所以金属板里那个底面没有电通量。这里 σ = ${nC(M.SHEET.sigma)} nC/m² 是带电平面上、以及金属板<i>每个表面</i>上的面电荷密度。两种情况的电场都与距离无关：是匀强电场。</p>
      <div class="charts">${chart({ ...R.sheet, zero: true, xlabel: '到中间的高度（cm）', ylabel: 'E（kN/C，向上）', label: '带电平面和金属板的电场随高度的变化',
        series: [{ cls: 'trend', pts: [[-15, -M.SHEET.E / 1000], [0, -M.SHEET.E / 1000], [0, M.SHEET.E / 1000], [15, M.SHEET.E / 1000]], tag: [-14, -M.SHEET.E / 1000 + 0.1, '带电平面'] },
          { pts: [[-15, -M.PLATE.E / 1000], [-3, -M.PLATE.E / 1000], [-3, 0], [3, 0], [3, M.PLATE.E / 1000], [15, M.PLATE.E / 1000]], tag: [5, M.PLATE.E / 1000 - 0.16, '金属板'] }] })}</div>
      <p class="hintline">点击任意一个，打开它的扁圆柱高斯面。${arrowNote(SC.sheet)}</p>`,
    cam: { target: [(STATIONS.sheet + STATIONS.plate) / 2, Y0, 0], az: -10, el: 24, dist: 30 }, lit: 'sheet', scene: 'sheet', look: {},
    fig: '带电平面与金属板',
  },
  {
    kicker: '10.4', title: '金属球', sub: '内部与外部',
    body: `
      <p class="lede">导体上的电荷分布在<b>表面</b>。金属内部的高斯球面不包围任何电荷。</p>
      <table class="data">
        <tr><td><i>r</i> &lt; <i>R</i></td><td><i>q</i><sub>enc</sub> = 0</td><td><i>E</i> = 0</td></tr>
        <tr><td><i>r</i> &gt; <i>R</i></td><td><i>q</i><sub>enc</sub> = <i>Q</i></td><td><i>E</i> · 4π<i>r</i>² = <i>Q</i>/ε<sub>0</sub> → <i>E</i> = <i>kQ</i>/<i>r</i>²</td></tr>
      </table>
      <p>在外部，金属球就像位于球心的点电荷。电场在表面处从 0 跃变到 <i>kQ</i>/<i>R</i>² = ${f(M.cSphere.E(M.SPH.R), 0)} N/C。这里 <i>Q</i> = ${nC(M.SPH.Q)} nC，<i>R</i> = ${f(M.SPH.R * 100, 0)} cm。切掉一块楔形，是为了让你看到内部。</p>
      <div class="charts">${sphereChart(M.cSphere.E, 'csphere')}</div>
      <p class="hintline">点击金属球，看高斯球面包围了什么。${arrowNote(SC.sphere)}</p>`,
    cam: { target: [STATIONS.csphere, Y0, 0], az: -24, el: 16, dist: 16 }, lit: 'csphere', scene: 'csphere', look: {},
    fig: '电荷只在表面',
  },
  {
    kicker: '10.5', title: '绝缘球', sub: '电荷遍布整个球体',
    body: `
      <p class="lede">在绝缘体中电荷不会移动：这里电荷均匀分布在整个体积内，ρ = <i>Q</i>/(⁴⁄₃π<i>R</i>³) = ${f(M.SPH.rho * 1e6, 3)} μC/m³。</p>
      <p>在内部，<i>q</i><sub>enc</sub> = ρ⁴⁄₃π<i>r</i>³：内部用小 <i>r</i>，外部用大 <i>R</i>。</p>
      <table class="data eqs">
        <tr><td><i>E</i> · 4π<i>r</i>² = ρ⁴⁄₃π<i>r</i>³/ε<sub>0</sub></td><td><i>E</i> = ρ<i>r</i>/3ε<sub>0</sub>，内部</td></tr>
        <tr><td><i>E</i> · 4π<i>r</i>² = ρ⁴⁄₃π<i>R</i>³/ε<sub>0</sub></td><td><i>E</i> = <i>kQ</i>/<i>r</i>²，外部</td></tr>
      </table>
      <p><i>E</i> 线性增大，在表面达到峰值，然后按 1/<i>r</i>² 减小。在外部，它与金属球（<i>Q</i>、<i>R</i> 相同）的电场一样。如果球是空心的，空腔内 <i>E</i> = 0。</p>
      <div class="charts">${sphereChart(M.iSphere.E, 'isphere')}</div>
      <p class="hintline">点击球，查看所围电荷。${arrowNote(SC.sphere)}</p>`,
    cam: { target: [STATIONS.isphere, Y0, 0], az: -24, el: 16, dist: 16 }, lit: 'isphere', scene: 'isphere', look: {},
    fig: '内部 E ∝ r，外部 E ∝ 1/r²',
  },
  {
    kicker: '10.6', title: '带电长棒', sub: '金属棒与绝缘棒',
    body: `
      <p class="lede">两根半径 <i>R</i> = ${f(M.ROD.R * 100, 0)} cm 的长棒，每米都带 λ = ${nC(M.ROD.lam)} nC。各用一个同轴圆柱面包住；底面没有电通量。</p>
      <table class="data">
        <tr><th></th><th>金属（σ 在表面）</th><th>绝缘体（ρ 在内部）</th></tr>
        <tr><td><i>r</i> &lt; <i>R</i></td><td><i>E</i> = 0</td><td><i>E</i> = ρ<i>r</i>/2ε<sub>0</sub></td></tr>
        <tr><td><i>r</i> &gt; <i>R</i></td><td><i>E</i> = σ<i>R</i>/ε<sub>0</sub><i>r</i></td><td><i>E</i> = ρ<i>R</i>²/2ε<sub>0</sub><i>r</i></td></tr>
      </table>
      <p>在绝缘棒内部，<i>q</i><sub>enc</sub> = ρπ<i>r</i>²<i>L</i>，<i>E</i> · 2π<i>rL</i> = <i>q</i><sub>enc</sub>/ε<sub>0</sub>。在外部，两者都就是 2<i>k</i>λ/<i>r</i>，又回到了带电直线。空心绝缘棒或空心绝缘球的空腔内 <i>E</i> = 0。</p>
      <div class="charts">${chart({ ...R.rod, xlabel: 'r（cm）', ylabel: 'E（kN/C）', cursors: ['crod', 'irod'], label: '长棒的电场随距离的变化', vlines: [[5, 'R']],
        series: [{ cls: 'trend', pts: curve(kE(M.cRod.E), 0.001, 17, 120), tag: [1.2, 0.07, '金属'] }, { pts: curve(kE(M.iRod.E), 0.001, 17, 120), tag: [1.6, 0.36, '绝缘体'] }] })}</div>
      <p class="hintline">点击一根棒，看它的圆柱面包围了什么。${arrowNote(SC.rod)}</p>`,
    cam: { target: [(STATIONS.crod + STATIONS.irod) / 2, Y0 + 0.3, 0], az: -12, el: 14, dist: 19 }, lit: 'irod', scene: 'rods', look: {},
    fig: '左为金属，右为绝缘体',
  },
  {
    kicker: '10.7', title: '不均匀分布的电荷', sub: 'ρ(r) = br',
    body: `
      <p class="lede">当 ρ 随 <i>r</i> 变化时，把一层层薄球壳加起来，每层带电 ρ(<i>r</i>) · 4π<i>r</i>² d<i>r</i>。</p>
      <div class="eq"><i>q</i><sub>enc</sub> = ∫<sub>0</sub><sup><i>r</i></sup> <i>br</i>′ · 4π<i>r</i>′² d<i>r</i>′ = π<i>br</i>⁴</div>
      <p>在内部，<i>E</i> · 4π<i>r</i>² = π<i>br</i>⁴/ε<sub>0</sub> → <i>E</i> = <i>br</i>²/4ε<sub>0</sub>。在外部，<i>E</i> = <i>bR</i>⁴/4ε<sub>0</sub><i>r</i>²。这里 <i>b</i> = ${f(M.SPH.b * 1e6, 2)} μC/m⁴：总电荷仍是 ${nC(M.SPH.Q)} nC。</p>
      <table class="data"><tr><th>ρ(r)</th><td>C</td><td>br</td><td>br²</td><td>br³</td></tr><tr><th>内部 E ∝</th><td>r</td><td>r²</td><td>r³</td><td>r⁴</td></tr></table>
      <div class="charts">${sphereChart(M.nSphere.E, 'nsphere', [{ cls: 'trend', pts: curve(kE(M.iSphere.E), 0.001, 10, 40), tag: [3.5, 0.95, '均匀'] }])}</div>
      <p class="hintline">电荷点越靠近中心越稀疏。${arrowNote(SC.sphere)}</p>`,
    cam: { target: [STATIONS.nsphere, Y0, 0], az: -24, el: 16, dist: 16 }, lit: 'nsphere', scene: 'nsphere', look: {},
    fig: '越靠近表面越密',
  },
  {
    kicker: '10.8', title: '导体', sub: '静电平衡：法拉第笼',
    body: `
      <p class="lede">导体中的电荷一旦停止移动：</p>
      <ol class="rules">
        <li>金属内部各处 <i>E</i> = 0。</li>
        <li>多余的电荷都分布在表面。</li>
        <li>紧贴表面外侧，<b>E</b> 垂直于表面，<i>E</i> = σ/ε<sub>0</sub>。</li>
        <li>内部没有电荷的空腔中没有电场：这就是<b>法拉第笼</b>。</li>
      </ol>
      <p>这个不带电的球壳放在 ${f(M.CAGE.E0 / 1000, 1)} kN/C 的匀强电场中。电子挤到左侧，右侧留下正电荷；它们的电场在内部抵消了 <b>E</b><sub>0</sub>，并使电场线弯曲，垂直地到达表面。（导线中有电流时，其中的 <i>E</i> 不为零。）</p>
      <div class="charts">${chart({ ...R.cage, xlabel: 'x（cm）', ylabel: 'E（kN/C）', label: '沿穿过球壳的轴线的电场', vlines: [[-14, '−R'], [14, 'R']],
        series: [{ pts: curve(x => M.len(M.cageField([x / 100, 0, 0])) / 1000, -40, 40, 400) }] })}</div>
      <p class="hintline">点击球壳，查看金属内部的高斯面。${arrowNote(SC.cage)}</p>`,
    cam: { target: [STATIONS.cage, Y0, 0], az: -18, el: 14, dist: 21 }, lit: 'cage', scene: 'cage', look: {},
    fig: '球壳内没有电场',
  },
];

// ---------- click a scene: what it breaks into ----------
const rNow = (s, sc) => M.breathe(s.clock, sc.rMin, sc.rMax, sc.T);
const sphereFacts = model => s => { const r = rNow(s, M.SPH); return [['高斯球面半径 r', `${f(r * 100, 1)} cm（R = ${f(M.SPH.R * 100, 0)} cm）`], ['q<sub>enc</sub>', `${nC(model.qenc(r))} nC`], ['电通量 q<sub>enc</sub>/ε<sub>0</sub>', `${f(model.qenc(r) / M.EPS0, 1)} N·m²/C`], ['E = 电通量 / 4πr²', `${f(model.E(r), 0)} N/C`]]; };
const rodFacts = model => s => { const r = rNow(s, M.ROD); return [['高斯圆柱面半径 r', `${f(r * 100, 1)} cm（R = ${f(M.ROD.R * 100, 0)} cm）`], ['圆柱面长 L', `${f(M.ROD.L * 100, 0)} cm`], ['q<sub>enc</sub>', `${f(model.qenc(r) * 1e12, 0)} pC`], ['E = q<sub>enc</sub>/(ε<sub>0</sub> 2πrL)', `${f(model.E(r), 0)} N/C`]]; };
export const PLATES = {
  flux: { text: `<b>E</b> 分解为沿 <b>A</b> 的分量 <i>E</i> cos θ，和位于面内的分量 <i>E</i> sin θ；后者从面上掠过，并不穿过它。只有前者贡献电通量。也可以这样看：正方形沿电场方向的投影面积是 <i>A</i> cos θ（虚线）。`,
    facts: s => { const d = M.fluxAngle(s.clock); return [['θ', `${f(d, 1)}°`], ['E cos θ', `${f(M.FLUX.E * Math.cos(d * Math.PI / 180), 0)} N/C`], ['A', `${f(M.FLUX.A, 3)} m²`], ['Φ = EA cos θ', `${f(M.flux(d), 1)} N·m²/C`]]; } },
  gauss: { text: `每一小块 d<b>A</b>（黑色）都垂直向外，与 <b>E</b>（蓝色）同向。所以每一小块上 <b>E</b> · d<b>A</b> = <i>E</i> d<i>A</i>；又因为 <i>E</i> 在球面上处处相等，∮ <i>E</i> d<i>A</i> = <i>E</i> · 4π<i>r</i>²。`,
    facts: s => { const r = rNow(s, M.POINT); return [['r', `${f(r * 100, 1)} cm`], ['E = kq/r²', `${f(M.pointE(r), 0)} N/C`], ['4πr²', `${f(4 * Math.PI * r * r, 4)} m²`], ['Φ = E · 4πr²', `${f(M.pointE(r) * 4 * Math.PI * r * r, 1)} N·m²/C`], ['q/ε<sub>0</sub>', `${f(M.POINT.flux, 1)} N·m²/C`]]; } },
  box: { text: `六个面被拉开，每个面上标出它自己的电通量（单位 N·m²/C），由点电荷的电场数值求和得到。最靠近电荷的那个面电通量为负（穿入），其余五个面为正（穿出）。它们加起来为零：盒子没有包围电荷。`,
    facts: () => { const b = M.boxFaces(); return [['近侧面（穿入）', `${f(b[1], 1)} N·m²/C`], ['远侧面', `${f(b[0], 1)} N·m²/C`], ['四个侧面', `${f(b[2] + b[3] + b[4] + b[5], 1)} N·m²/C`], ['总和', `${f(Math.abs(b.reduce((a, c) => a + c)) < 0.05 ? 0 : b.reduce((a, c) => a + c), 1)} N·m²/C`]]; } },
  line: { text: `两个底面被取下。底面上电场平躺在面内（灰色箭头），所以 <b>E</b> ⊥ d<b>A</b>，没有电通量穿过。全部电通量都从侧面穿出，那里 <b>E</b> ∥ d<b>A</b>。`,
    facts: s => { const r = rNow(s, M.LINE); return [['r', `${f(r * 100, 1)} cm`], ['侧面积 2πrL', `${f(2 * Math.PI * r * M.LINE.L, 4)} m²`], ['E = 2kλ/r', `${f(M.lineE(r), 0)} N/C`], ['穿过侧面的电通量', `${f(M.lineE(r) * 2 * Math.PI * r * M.LINE.L, 2)} N·m²/C`], ['λL/ε<sub>0</sub>', `${f(M.LINE.lam * M.LINE.L / M.EPS0, 2)} N·m²/C`]]; } },
  sheet: { text: `两个底面被抬起。每个底面向外的电通量都是 <i>EA</i>；侧面没有。2<i>EA</i> = σ<i>A</i>/ε<sub>0</sub>，所以 <i>E</i> = σ/2ε<sub>0</sub>，与扁圆柱的高度无关。`,
    facts: () => [['σ', `${nC(M.SHEET.sigma)} nC/m²`], ['底面积 A', `${f(M.SHEET.Abox * 1e4, 1)} cm²`], ['q<sub>enc</sub> = σA', `${f(M.SHEET.sigma * M.SHEET.Abox * 1e12, 1)} pC`], ['E = σ/2ε<sub>0</sub>', `${f(M.SHEET.E, 0)} N/C`]] },
  plate: { text: `里面那个底面位于金属中，那里 <i>E</i> = 0，所以只有外面的底面有电通量：<i>EA</i> = σ<i>A</i>/ε<sub>0</sub>。σ 与带电平面相同，电场却是它的两倍。`,
    facts: () => [['每个表面的 σ', `${nC(M.PLATE.sigma)} nC/m²`], ['金属中的 E', '0'], ['外部 E = σ/ε<sub>0</sub>', `${f(M.PLATE.E, 0)} N/C`]] },
  csphere: { text: `金属变淡。在内部，高斯球面不包围任何电荷：没有电通量，也没有电场。一旦它比金属球大，就包围了全部 <i>Q</i>（红色球壳），<i>E</i> = <i>kQ</i>/<i>r</i>²。`, facts: sphereFacts(M.cSphere) },
  isphere: { text: `红球是高斯球面所围的电荷。在内部，它按 <i>r</i>³ 增大，而面积按 <i>r</i>² 增大，所以 <i>E</i> 按 <i>r</i> 增大。在外部，它停在 <i>Q</i>，不再增加。`, facts: sphereFacts(M.iSphere) },
  nsphere: { text: `红球是所围电荷，现在为 π<i>br</i>⁴：外层球壳带的电荷更多，所以它按 <i>r</i>⁴ 迅速增大，<i>E</i> = <i>q</i><sub>enc</sub>/(4π<i>r</i>²ε<sub>0</sub>) 按 <i>r</i>² 增大。`, facts: sphereFacts(M.nSphere) },
  crod: { text: `金属变淡。金属内部的高斯圆柱面不包围电荷。在外部，它包围 σ · 2π<i>RL</i>（红色），<i>E</i> · 2π<i>rL</i> = σ2π<i>RL</i>/ε<sub>0</sub>。`, facts: rodFacts(M.cRod) },
  irod: { text: `红色芯部是高斯圆柱面内的电荷，<i>r</i> &lt; <i>R</i> 时为 ρπ<i>r</i>²<i>L</i>。除以 ε<sub>0</sub> 和侧面积 2π<i>rL</i>：<i>E</i> = ρ<i>r</i>/2ε<sub>0</sub>。`, facts: rodFacts(M.iRod) },
  cage: { text: `在金属内部画一个高斯球面（虚线）。它上面 <i>E</i> = 0，所以它不包围净电荷：内壁上没有电荷，空腔中也没有电场。表面处的箭头都垂直于表面：在 − 侧指向内，在 + 侧指向外。`,
    facts: () => [['E<sub>0</sub>', `${f(M.CAGE.E0, 0)} N/C`], ['+ 极处的 σ', `${f(M.cageSigma(1) * 1e9, 2)} nC/m²`], ['极点处 E = σ/ε<sub>0</sub>', `${f(M.cageSigma(1) / M.EPS0, 0)} N/C`], ['空腔中的 E', '0'], ['球壳上的净电荷', '0']] },
};
