// Chapter 12, page by page (after the AP Physics C E&M organizer, Unit 4). Text and a chart on
// the left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS as ST } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const pF = c => f(c * 1e12, 1);
const BLUE = '#3d63a8', GREY = '#86868c';

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursors = [], label, under = '' }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}"${s.color ? ` style="stroke:${s.color}"` : ''} d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}"${s.color ? ` style="fill:${s.color}"` : ''}>${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    ${under}<rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(([key, color]) => `<circle class="cursor" r="4.5" data-cursor="${key}"${color ? ` style="fill:${color}"` : ''}/>`).join('')}
  </svg>`;
}
const samples = (n, a, b, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });
const area = (R, pts) => `<path d="M${CH.sx(pts[0][0], R.x0, R.x1)},${CH.sy(0, R.y0, R.y1)}${pts.map(([x, y]) => `L${CH.sx(x, R.x0, R.x1).toFixed(1)},${CH.sy(y, R.y0, R.y1).toFixed(1)}`).join('')}L${CH.sx(pts[pts.length - 1][0], R.x0, R.x1)},${CH.sy(0, R.y0, R.y1)}Z" style="fill:#dfe7f6;stroke:none"/>`;

// chart ranges, shared with the live cursors in main.js
export const R = {
  charge: { x0: 0, x1: 100, y0: 0, y1: 800 },
  gap: { x0: 0, x1: 10, y0: 0, y1: 20 },
  sph: { x0: 0, x1: 25, y0: 0, y1: 2500 },
  cyl: { x0: 0, x1: 10, y0: 0, y1: 5000 },
  fill: { x0: 0, x1: 800, y0: 0, y1: 120 },
  slab: { x0: 0, x1: 1, y0: 0, y1: 2500 },
  energy: { x0: 0, x1: 1, y0: 0, y1: 3.5 },
  probe: { x0: -28, x1: 28, y0: 0, y1: 3500 },
};
const RS = R.sph, RC = R.cyl;
const sphCurve = samples(120, 0, 25, r => M.sphE(r / 100)), cylCurve = samples(200, 0, 10, r => M.cylE(r / 100));
const S = M.SER, PA = M.PAR, u = x => (x * 1e6).toFixed(0);

// a bar chart of the charge on each capacitor, series against parallel
const qBars = (() => {
  const bars = [['C₁', S.Q1, 0], ['C₂', S.Q2, 1], ['C₁', PA.Q1, 3], ['C₂', PA.Q2, 4]], base = 140, top = 24, max = 40e-6, bw = 46, x0 = 70;
  return `<svg class="chart" viewBox="0 0 ${W} ${H + 10}" role="img" aria-label="串联与并联时每个电容器上的电荷量">
    <line class="zero" x1="${x0 - 20}" x2="${x0 + 5.6 * (bw + 16)}" y1="${base}" y2="${base}"/>
    ${bars.map(([n, q, i]) => { const h = (base - top) * q / max, x = x0 + i * (bw + 16); return `<rect class="bar" x="${x}" y="${base - h}" width="${bw}" height="${h}"/><text class="ax" x="${x + bw / 2}" y="${base - h - 6}" text-anchor="middle">${u(q)} µC</text><text class="lab" x="${x + bw / 2}" y="${base + 16}" text-anchor="middle">${n}</text>`; }).join('')}
    <text class="ax" x="${x0 + (bw + 16) - 8}" y="${base + 32}" text-anchor="middle">串联：Q 相同</text>
    <text class="ax" x="${x0 + 3.5 * (bw + 16) + bw / 2}" y="${base + 32}" text-anchor="middle">并联：Q 相加</text>
  </svg>`;
})();

const DIEL = { vacuum: '真空', air: '空气', Teflon: '聚四氟乙烯', plastic: '塑料', paper: '纸', rubber: '橡胶', water: '水', 'SrTiO₃': 'SrTiO₃' };
const dielTable = `<table class="data">${[0, 2, 4, 6].map(i => `<tr><td>${DIEL[M.DIELECTRICS[i][0]]}</td><td>${M.DIELECTRICS[i][1]}</td><td>${DIEL[M.DIELECTRICS[i + 1][0]]}</td><td>${M.DIELECTRICS[i + 1][1]}</td></tr>`).join('')}</table>`;
const full = { iso: M.slab(1, false), con: M.slab(1, true) };

const steps = rows => `<table class="data eqs">${rows.map(([e, n]) => `<tr><td>${e}</td><td>${n}</td></tr>`).join('')}</table>`;

export const PAGES = [
  {
    kicker: '第 12 章', title: '电容器', sub: '被分隔开的电荷',
    body: `
      <p class="lede"><b>电容器</b>就是彼此隔开的两个导体。电池把电荷从一个导体搬到另一个上，留下 +<i>Q</i> 和 −<i>Q</i>，两者之间形成电场。</p>
      <p>电压加倍，电荷量也加倍。两者之比，即<b>电容</b>，保持不变：</p>
      <div class="eq"><i>C</i> = <i>Q</i> / Δ<i>V</i></div>
      <p>单位为法拉（1 F = 1 C/V），永不为负。它只取决于<b>几何形状</b>和两极间的介质。这两块极板 20 cm 见方，相距 5 cm：<i>C</i> = ${pF(M.C0)} pF。</p>
      <div class="charts">${chart({ ...R.charge, xlabel: 'ΔV（V）', ylabel: 'Q（pC）', cursors: [['charge']], label: '电荷量随电压变化：斜率为 C 的直线',
        series: [{ pts: [[0, 0], [100, M.Q0 * 1e12]], tag: [58, M.C0 * 58e12 - 190, `斜率 = C = ${pF(M.C0)} pF`] }] })}</div>
      <p class="hintline">每对 ± 电荷画一条电场线。点击极板。按实际比例绘制。</p>`,
    cam: { target: [ST.plates, 1.4, 0], az: 24, el: 16, dist: 10.5 }, lit: 'plates', scene: 'plates', look: {},
    fig: '电池电压调高又调低',
  },
  {
    kicker: '12.1', title: '平行板电容器', sub: '先用高斯定理，再求 ΔV，再求 C',
    body: `
      <p class="lede">每次都是三步：用高斯定理求 <i>E</i>，积分求 Δ<i>V</i>，再求 <i>C</i> = <i>Q</i>/Δ<i>V</i>。</p>
      ${steps([
        ['<i>EA</i> = σ<i>A</i>/ε<sub>0</sub>', '扁圆柱高斯面'],
        ['<i>E</i> = σ/ε<sub>0</sub> = <i>Q</i>/ε<sub>0</sub><i>A</i>', '匀强'],
        ['Δ<i>V</i> = −∫<sub><i>d</i></sub><sup>0</sup> <i>E ds</i> = <i>Ed</i>', 'E 为常量'],
        ['<i>C</i> = <i>Q</i>/Δ<i>V</i> = <b>ε<sub>0</sub><i>A</i>/<i>d</i></b>', 'Q 约掉'],
      ])}
      <p>间距变化时 <i>Q</i> 不变：<i>E</i> 保持 ${f(M.E0, 0)} V/m，Δ<i>V</i> = <i>Ed</i> 增大，<i>C</i> 按 1/<i>d</i> 减小。</p>
      <div class="charts">${chart({ ...R.gap, xlabel: '间距 d（cm）', ylabel: 'C（pF）', cursors: [['gap']], label: '电容随间距的变化',
        series: [{ pts: samples(80, 1.8, 10, d => M.cPlate(M.PLATE.A, d / 100) * 1e12) }] })}</div>
      <p class="hintline">点击扁圆柱高斯面，把它拉出来。</p>`,
    cam: { target: [ST.pillbox, 1.45, 0], az: 24, el: 15, dist: 11 }, lit: 'pillbox', scene: 'gap', look: {},
    fig: '电荷量不变，间距在变',
  },
  {
    kicker: '12.2', title: '球形电容器', sub: '球壳里的一个球',
    body: `
      <p class="lede">一个球（<i>a</i> = ${M.SPH.a * 100} cm，+<i>Q</i>）在一个球壳（<i>b</i> = ${M.SPH.b * 100} cm，−<i>Q</i>）里面，剖开一半。</p>
      ${steps([
        ['<i>E</i>·4π<i>r</i><sup>2</sup> = <i>Q</i>/ε<sub>0</sub>', '高斯定理，a < r < b'],
        ['Δ<i>V</i> = −∫<sub><i>b</i></sub><sup><i>a</i></sup> <i>Q dr</i>/4πε<sub>0</sub><i>r</i><sup>2</sup>', 'E·ds = E dr'],
        ['&nbsp;&nbsp;&nbsp;&nbsp;= <i>Q</i>(<i>b</i> − <i>a</i>)/4πε<sub>0</sub><i>ab</i>', ''],
        ['<i>C</i> = <b>4πε<sub>0</sub><i>ab</i>/(<i>b</i> − <i>a</i>)</b>', `${pF(M.SPH.C)} pF`],
      ])}
      <p>当 <i>b</i> → ∞ 时，<i>C</i> → 4πε<sub>0</sub><i>a</i>，即孤立导体球的电容。阴影部分：Δ<i>V</i> = ${M.V0} V。</p>
      <div class="charts">${chart({ ...RS, xlabel: 'r（cm）', ylabel: 'E（V/m）', cursors: [['sph']], label: '电场随半径的变化，两极之间以外为零', under: area(RS, sphCurve.filter(([r]) => r >= 10 && r <= 20)), series: [{ pts: sphCurve }] })}</div>
      <p class="hintline">点击打开球壳。箭头 2 cm 代表 1 kV/m。</p>`,
    cam: { target: [ST.sphere, 2.2, 0], az: 14, el: 12, dist: 17 }, lit: 'sphere', scene: 'sphere', look: {},
    fig: '两壳之间 E ∝ 1/r²',
  },
  {
    kicker: '12.3', title: '圆柱形电容器', sub: '管子里的一根棒',
    body: `
      <p class="lede">一根棒（<i>a</i> = ${M.CYL.a * 100} cm）在一根管子（<i>b</i> = ${M.CYL.b * 100} cm）里面，长 <i>L</i> = ${M.CYL.L * 100} cm：一段短的同轴电缆。</p>
      ${steps([
        ['<i>E</i>·2π<i>rL</i> = <i>Q</i>/ε<sub>0</sub>', '高斯定理，只有侧面'],
        ['Δ<i>V</i> = −∫<sub><i>b</i></sub><sup><i>a</i></sup> <i>Q dr</i>/2πε<sub>0</sub><i>rL</i>', 'E·ds = E dr'],
        ['&nbsp;&nbsp;&nbsp;&nbsp;= (<i>Q</i>/2πε<sub>0</sub><i>L</i>) ln(<i>b</i>/<i>a</i>)', '∫dr/r = ln r'],
        ['<i>C</i> = <b>2πε<sub>0</sub><i>L</i>/ln(<i>b</i>/<i>a</i>)</b>', `${pF(M.CYL.C)} pF`],
      ])}
      <p><i>E</i> ∝ 1/<i>r</i>，比 1/<i>r</i><sup>2</sup> 平缓，因此出现对数。<i>C</i> ∝ 长度：每米 ${f(M.CYL.C / M.CYL.L * 1e12, 0)} pF。</p>
      <div class="charts">${chart({ ...RC, xlabel: 'r（cm）', ylabel: 'E（V/m）', cursors: [['cyl']], label: '同轴圆柱间电场随半径的变化', under: area(RC, cylCurve.filter(([r]) => r >= 2 && r <= 8)), series: [{ pts: cylCurve }] })}</div>
      <p class="hintline">点击把管子滑开。箭头 1 cm 代表 1 kV/m。</p>`,
    cam: { target: [ST.coax, 1.5, 0], az: 16, el: 14, dist: 14 }, lit: 'coax', scene: 'coax', look: {},
    fig: '管内 E ∝ 1/r',
  },
  {
    kicker: '12.4', title: '储存的能量', sub: '充电所做的功',
    body: `
      <p class="lede">每一小份 <i>dq</i> 都要顶着已有的电场从 − 板搬到 + 板，经过的电势差是 Δ<i>V</i> = <i>q</i>/<i>C</i>。最初几份几乎不费功；最后几份要付足 ${M.V0} V。</p>
      <div class="eq"><i>U</i> = ∫<sub>0</sub><sup><i>Q</i></sup> <i>q</i>/<i>C</i> <i>dq</i> = <i>Q</i><sup>2</sup>/2<i>C</i></div>
      <p>= ½<i>Q</i>Δ<i>V</i> = ½<i>C</i>Δ<i>V</i><sup>2</sup>：即直线下方的三角形面积，这里是 ${f(M.U0 * 1e9, 1)} nJ。能量储存在电场中，<b>能量密度</b>（J/m³）为</p>
      <div class="eq"><i>u</i> = ½ε<sub>0</sub><i>E</i><sup>2</sup></div>
      <div class="charts">${chart({ ...R.fill, xlabel: '已搬运的电荷量 q（pC）', ylabel: 'ΔV（V）', cursors: [['fill']], label: '电压随已搬运电荷量的变化；图线下的面积就是储存的能量',
        under: `<path data-area="fill" style="fill:#dfe7f6"/>`, series: [{ pts: [[0, 0], [800, 800e-12 / M.C0]] }] })}</div>
      <p class="live" id="filllive"></p>
      <p class="hintline">两极间的蓝色随 u 增大而加深。点击极板。</p>`,
    cam: { target: [ST.energy + 0.4, 1.45, 0], az: 24, el: 14, dist: 12 }, lit: 'energy', scene: 'energy', look: {},
    fig: '一点一点地充电',
  },
  {
    kicker: '12.5', title: '串联与并联', sub: 'Q 相同，或 ΔV 相同',
    body: `
      <p class="lede">${M.CIRC.C1 * 1e6} µF 和 ${M.CIRC.C2 * 1e6} µF 接在 ${M.CIRC.V} V 上。极板面积按 ∝ <i>C</i> 绘制；一个记号代表 2 µC。</p>
      <table class="data cols">
        <tr><th>串联</th><th>并联</th></tr>
        <tr><td>每个的 <i>Q</i> 相同</td><td>每个的 Δ<i>V</i> 相同</td></tr>
        <tr><td>Δ<i>V</i> = Δ<i>V</i><sub>1</sub> + Δ<i>V</i><sub>2</sub></td><td><i>Q</i> = <i>Q</i><sub>1</sub> + <i>Q</i><sub>2</sub></td></tr>
        <tr><td>1/<i>C</i><sub>eq</sub> = 1/<i>C</i><sub>1</sub> + 1/<i>C</i><sub>2</sub></td><td><i>C</i><sub>eq</sub> = <i>C</i><sub>1</sub> + <i>C</i><sub>2</sub></td></tr>
        <tr><td>${f(S.C * 1e6)} µF：${f(S.V1, 0)} V + ${f(S.V2, 0)} V</td><td>${f(PA.C * 1e6, 0)} µF：${u(PA.Q1)} + ${u(PA.Q2)} µC</td></tr>
      </table>
      <p>串联时，两者之间的导线是一块中性的孤立导体：一端带 +<i>Q</i>，另一端就带 −<i>Q</i>。电容较小的那个分得的电压更多；并联时，电容较大的那个分得的电荷更多。</p>
      <div class="charts">${qBars}</div>
      <p class="hintline">点击一个电路，查看它的电荷量和电压。</p>`,
    cam: { target: [ST.circuits, 1.6, 0], az: 16, el: 9, dist: 19 }, lit: 'series', scene: 'circuits', look: {},
    fig: '2 µF 和 4 µF 接在 9 V 上',
  },
  {
    kicker: '12.6', title: '电介质', sub: '两极间的绝缘体',
    body: `
      <p class="lede">两极间的绝缘体会<b>极化</b>：每个分子电偶极子受到力矩 τ = <i>p</i>×<i>E</i> = <i>pE</i> sin θ，转向能量最低的 <i>U</i> = −<i>p</i>·<i>E</i> 方向。</p>
      <p>排列整齐的偶极子端头在表面留下<b>束缚电荷</b>；它的电场 <i>E</i><sub>ind</sub> 与极板的电场方向相反：</p>
      <div class="eq"><i>E</i> = <i>E</i><sub>0</sub> − <i>E</i><sub>ind</sub> = <i>E</i><sub>0</sub>/κ</div>
      <p><i>Q</i> 不变时，Δ<i>V</i> 减小为 1/κ，<i>C</i> = κε<sub>0</sub><i>A</i>/<i>d</i> 增大为 κ 倍，κ ≥ 1。</p>
      ${dielTable}
      <div class="charts">${chart({ ...R.slab, xlabel: '两极间被填充的比例', ylabel: 'E（V/m）', cursors: [['slab']], label: '电场随电介质板插入程度的变化',
        series: [{ pts: samples(60, 0, 1, x => M.slab(x, false).E) }], marks: [[1, full.iso.E, `E₀/κ`, -46, -8]] })}</div>`,
    cam: { target: [ST.slab, 1.85, 0], az: 26, el: 13, dist: 11.5 }, lit: 'slab', scene: 'slab', look: {},
    fig: 'κ = 3 的电介质板，极板断开电源',
  },
  {
    kicker: '12.7', title: '接着电源与断开电源', sub: '电池保持什么不变',
    body: `
      <p class="lede">电介质板部分插入时，有介质的部分和旁边的空气部分相当于两个并联的电容器：<i>C</i> = <i>C</i><sub>0</sub>(1 + (κ − 1)<i>x</i>)；插入一半时为 <i>C</i><sub>0</sub>/2 · (1 + κ)。</p>
      <table class="data">
        <tr><th>完全插入</th><th>接着电源</th><th>断开电源</th></tr>
        <tr><td>保持不变的量</td><td>Δ<i>V</i> = ${M.V0} V</td><td><i>Q</i> = ${f(M.Q0 * 1e12, 0)} pC</td></tr>
        <tr><td><i>Q</i></td><td>κ<i>Q</i><sub>0</sub> = ${f(full.con.Q * 1e12, 0)} pC</td><td><i>Q</i><sub>0</sub></td></tr>
        <tr><td>Δ<i>V</i>、<i>E</i></td><td>不变</td><td>÷ κ（${f(full.iso.V, 1)} V）</td></tr>
        <tr><td><i>U</i></td><td>× κ（${f(full.con.U * 1e9, 1)} nJ）</td><td>÷ κ（${f(full.iso.U * 1e9, 1)} nJ）</td></tr>
      </table>
      <p>接着电源时，电荷流到介质板所对的极板区域；电池做功 Δ<i>V</i>·Δ<i>Q</i>，是储存能量增加量的两倍。无论哪种情况，极板都会把介质板吸进去。</p>
      <div class="charts">${chart({ ...R.energy, xlabel: '两极间被填充的比例', ylabel: 'U / U₀', cursors: [['enA'], ['enB', GREY]], label: '储存能量随填充比例的变化，接着电源与断开电源两种情况',
        series: [{ pts: samples(60, 0, 1, x => M.slab(x, true).U / M.U0), tag: [0.3, 1.75, '接着电源'] }, { pts: samples(60, 0, 1, x => M.slab(x, false).U / M.U0), color: GREY, tag: [0.6, 0.55, '断开电源'] }] })}</div>
      <p class="hintline">点击任意一个电容器。</p>`,
    cam: { target: [ST.compare, 1.75, 0], az: 24, el: 11, dist: 16.5 }, lit: 'battery', scene: 'compare', look: {},
    fig: '左：接着电池；右：断开电池',
  },
  {
    kicker: '12.8', title: '导体', sub: '处于静电平衡',
    body: `
      <p class="lede">一个中性金属球放在 ${M.COND.E0} V/m 的电场中。它的自由电子发生移动，直到它们自己的电场在内部抵消外电场。此时：</p>
      <ul class="rules">
        <li>金属内部各处 <i>E</i> = 0；</li>
        <li>电荷都分布在表面；</li>
        <li>紧贴表面外侧，<i>E</i> ⊥ 表面，且 <i>E</i> = σ/ε<sub>0</sub>；</li>
        <li>整个导体是等势体。</li>
      </ul>
      <p>这里 σ = 3ε<sub>0</sub><i>E</i><sub>0</sub> cos θ，总和为零；在两极处 <i>E</i> = 3<i>E</i><sub>0</sub>。在电容器中插入厚度为 <i>t</i> 的金属板，会留下两段串联的间隙：<i>C</i> = ε<sub>0</sub><i>A</i>/(<i>d</i> − <i>t</i>)。</p>
      <div class="charts">${chart({ ...R.probe, xlabel: '沿轴线的位置（cm）', ylabel: 'E（V/m）', cursors: [['probe']], label: '沿穿过球的轴线的电场',
        series: [{ pts: samples(160, -28, -10.0001, x => M.condAxisE(x / 100)) }, { pts: [[-10, 0], [10, 0]] }, { pts: samples(160, 10.0001, 28, x => M.condAxisE(x / 100)) }] })}</div>
      <p class="hintline">点击球，把它剖开。电场线由模型描出。</p>`,
    cam: { target: [ST.conductor, 1.8, 0], az: 40, el: 10, dist: 19 }, lit: 'conductor', scene: 'conductor', look: {},
    fig: '电场中的中性金属球',
  },
];

// ---------- click a scene: what it breaks into ----------
const sph = r => [['高斯球面半径 r', `${f(r * 100, 1)} cm`], ['E(r) = Q/4πε₀r²', `${f(M.sphE(r), 0)} V/m`], ['电通量 E·4πr²', `${f(M.sphE(r) * 4 * Math.PI * r * r, 1)} V·m`], ['Q/ε₀', `${f(M.SPH.Q / M.EPS0, 1)} V·m`]];
export const PLATES = {
  plates: { text: `每块极板单独产生的电场为 σ/2ε₀，背离 +、指向 −（灰色）。在两板之间两个电场同向，相加为 σ/ε₀。在外侧方向相反，相互抵消。所以电场全都在两极之间。`,
    facts: s => { const r = M.charging(s.charge.t); return [['ΔV', `${f(r.V, 1)} V`], ['Q = CΔV', `${f(r.Q * 1e12, 0)} pC`], ['每块极板 σ/2ε₀', `${f(r.E / 2, 0)} V/m`], ['两板之间：相加', `${f(r.E, 0)} V/m`], ['外侧：相减', '0 V/m']]; } },
  pillbox: { text: `扁圆柱高斯面跨在 + 极板上。它的外侧底面处电场为零，侧面与电场平行，所以唯一的电通量穿过两极间的那个底面：E·A。它所围的电荷为 σA。由高斯定理：EA = σA/ε₀。`,
    facts: s => { const r = M.gapScene(s.gap.t), A = M.PILLBOX.A; return [['底面积 A', `${f(A * 1e4, 1)} cm²`], ['电通量 E·A', `${f(r.E * A, 3)} V·m`], ['q_enc/ε₀', `${f(M.Q0 / M.PLATE.A * A / M.EPS0, 3)} V·m`], ['间距 d', `${f(r.d * 100, 1)} cm`], ['ΔV = Ed', `${f(r.V, 0)} V`], ['C = ε₀A/d', `${pF(r.C)} pF`]]; } },
  sphere: { text: `打开球壳，可以看到里面的球和两者之间的高斯球面。不论高斯球面半径多大，穿过它的电通量都是同样的 Q/ε₀，所以 E 按 1/r² 减小。`,
    facts: s => sph(M.gaussR(s.sweep.t, M.SPH.a, M.SPH.b)) },
  coax: { text: `管子移开后，可以看到棒和高斯圆柱面。电通量只从面积为 2πrL 的侧面穿出，所以 E = Q/2πε₀rL 按 1/r 减小。`,
    facts: s => { const r = M.gaussR(s.sweep.t, M.CYL.a, M.CYL.b); return [['高斯圆柱面半径 r', `${f(r * 100, 1)} cm`], ['E(r)', `${f(M.cylE(r), 0)} V/m`], ['电通量 E·2πrL', `${f(M.cylE(r) * 2 * Math.PI * r * M.CYL.L, 1)} V·m`], ['Q/ε₀', `${f(M.CYL.Q / M.EPS0, 1)} V·m`], ['C', `${pF(M.CYL.C)} pF`]]; } },
  energy: { text: `能量分布在两极间 A × d 的体积中，能量密度为 u = ½ε₀E²。两者相乘，又得到 ½CΔV²。`,
    facts: s => { const r = M.filling(s.fill.t), vol = M.PLATE.A * M.PLATE.d; return [['E', `${f(r.E, 0)} V/m`], ['u = ½ε₀E²', `${f(r.u * 1e6, 2)} µJ/m³`], ['体积 Ad', `${f(vol * 1e6, 0)} cm³`], ['u·Ad', `${f(r.u * vol * 1e9, 2)} nJ`], ['Q²/2C', `${f(r.U * 1e9, 2)} nJ`]]; } },
  series: { text: `电池让 ${u(S.Q)} µC 的电荷绕回路移动。里侧的两块极板和它们之间的导线是一块中性的孤立导体：一侧 −${u(S.Q)} µC，另一侧 +${u(S.Q)} µC。每个电容器上的电压为 Q/C，两者之和为 ${M.CIRC.V} V。`,
    facts: () => [['C_eq', `${f(S.C * 1e6)} µF`], ['每个的 Q', `${u(S.Q)} µC`], ['ΔV₁ = Q/C₁', `${f(S.V1, 1)} V`], ['ΔV₂ = Q/C₂', `${f(S.V2, 1)} V`], ['能量 ½C_eqV²', `${f(S.U * 1e6, 0)} µJ`]] },
  parallel: { text: `两个电容器都直接接在电池两端，所以各自承受全部的 ${M.CIRC.V} V。每个带电 Q = CΔV，电池提供两者之和。`,
    facts: () => [['C_eq', `${f(PA.C * 1e6, 0)} µF`], ['每个的 ΔV', `${M.CIRC.V} V`], ['Q₁ = C₁ΔV', `${u(PA.Q1)} µC`], ['Q₂ = C₂ΔV', `${u(PA.Q2)} µC`], ['能量 ½C_eqV²', `${f(PA.U * 1e6, 0)} µJ`]] },
  slab: { text: `在介质板中：只有极板上的自由电荷时，会产生 E₀（灰色，向右）。介质板表面的束缚电荷产生 E_ind（灰色，向左）。剩下的是 E（蓝色），在介质板中和旁边的空气中都相同，因为两者跨越的是同一个 ΔV。`,
    facts: s => { const x = M.fillOf(s.slide.t), r = M.slab(x, false); return [['插入比例', `${f(x * 100, 0)} %`], ['E₀ = σ_free/ε₀（介质板部分）', `${f(r.Efree, 0)} V/m`], ['E_ind = σ_bound/ε₀', `${f(r.Eind, 0)} V/m`], ['E = E₀ − E_ind', `${f(r.E, 0)} V/m`], ['ΔV', `${f(r.V, 1)} V`], ['C', `${pF(r.C)} pF`]]; } },
  battery: { text: `电池使 ΔV 保持在 ${M.V0} V，所以 E = ΔV/d 不能改变。随着介质板插入，电荷流到正对介质板的那部分极板上，直到那里的电荷变为原来的 κ 倍。`,
    facts: s => { const r = M.slab(M.fillOf(s.slide.t), true); return [['C', `${pF(r.C)} pF`], ['Q', `${f(r.Q * 1e12, 0)} pC`], ['ΔV', `${f(r.V, 1)} V`], ['E', `${f(r.E, 0)} V/m`], ['U', `${f(r.U * 1e9, 1)} nJ`]]; } },
  isolated: { text: `电荷既流不进也流不出，所以 Q 保持不变。电荷向介质板一侧移动，两极间各处的电场都减小，ΔV 也随之减小。`,
    facts: s => { const r = M.slab(M.fillOf(s.slide.t), false); return [['C', `${pF(r.C)} pF`], ['Q', `${f(r.Q * 1e12, 0)} pC`], ['ΔV', `${f(r.V, 1)} V`], ['E', `${f(r.E, 0)} V/m`], ['U', `${f(r.U * 1e9, 1)} nJ`]]; } },
  conductor: { text: `剖开后：内部没有电荷也没有电场，电荷只在表面。在金属内任意位置取高斯面，面上 E = 0，所以它不包围电荷。空心球壳同样如此，这就是金属盒能屏蔽内部的原因。`,
    facts: s => { const x = M.probeX(s.clock); return [['探测点位于', `${f(x * 100, 1)} cm`], ['该处的 E', `${f(M.condAxisE(x), 0)} V/m`], ['内部的 E', '0 V/m'], ['两极处的 σ', `±${f(M.condSigma(0) * 1e9, 1)} nC/m²`], ['两极处 E = σ/ε₀', `${f(M.condSigma(0) / M.EPS0, 0)} V/m`]]; } },
};
