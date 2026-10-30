// Chapter 14, page by page (after the AP Physics C E&M organizer, Unit 7). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, SC } from './world.js';

const f = (x, n = 2) => (x < -1e-12 ? '−' : '') + Math.abs(x).toFixed(n);
const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
export const sci = (x, n = 2) => { const e = Math.floor(Math.log10(Math.abs(x))), m = x / 10 ** e; return `${f(m, n)}×10${String(e).split('').map(c => SUP[c]).join('')}`; };
const uT = x => f(x * 1e6, 1);

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], vlines = [], zero = false, cursor, label }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(Math.min(Math.max(y, y0), y1)).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const vl = vlines.map(([x, t]) => `<line class="grid" x1="${sx(x)}" x2="${sx(x)}" y1="${P.t}" y2="${H - P.b}"/><text class="ax" x="${sx(x) + 4}" y="${H - P.b - 6}">${t}</text>`).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const z = zero ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${z}${vl}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2 + 40}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursor ? `<circle class="cursor" r="4.5" cx="-20" cy="-20" data-cursor="${cursor}"/>` : ''}
  </svg>`;
}
const curve = (fn, a, b, n = 80) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });
// chart ranges, shared with main.js for the live cursors
export const R = {
  magnet: { x0: -40, x1: 40, y0: 0, y1: 300 },
  rhr: { x0: 0, x1: 180, y0: 0, y1: 2 },
  cyclo: { x0: 0, x1: 2.5, y0: 0, y1: 3 },
  selector: { x0: 0, x1: 2, y0: -2, y1: 2 },
  loop: { x0: 0, x1: 180, y0: -0.08, y1: 0.08 },
  ampere: { x0: 0, x1: 15, y0: 0, y1: 400 },
  ring: { x0: 0, x1: 36, y0: 0, y1: 45 },
  wires: { x0: 0, x1: 40, y0: 0, y1: 2 },
  solenoid: { x0: -40, x1: 40, y0: 0, y1: 300 },
};

// the closed surface round the magnet's N end, summed once
export const MAGFLUX = M.boxFlux(M.magnetB, M.MAG_BOX.c, M.MAG_BOX.h, 60);
const BC = M.magnetB([0, 0, 0])[0], SOLC = M.solB([0, 0, 0])[0];
const slow = c => sci(c, 1);

export const PAGES = [
  {
    kicker: '第 14 章', title: '磁场', sub: '由运动电荷产生',
    body: `
      <p class="lede"><b>磁场</b> <b>B</b> 由运动电荷产生：电流，或磁体内部自旋的电子。它的单位是特斯拉（1 T = 10<sup>4</sup> 高斯）。</p>
      <p>在磁体外部，磁感线从 N 极指向 S 极；在内部，从 S 极回到 N 极，所以每条磁感线都是闭合的。不存在磁单极子（把磁体切开，得到的是两个磁体），所以通过任何闭合曲面都有</p>
      <div class="eq">∮ <b>B</b> · d<b>A</b> = 0</div>
      <p>这块 ${f(M.MAG.L * 100, 0)} cm 的磁体按安培设想的样子绘制：侧面环绕着一层电流。每条磁感线都是由这层电流按毕奥–萨伐尔定律求和描出来的。</p>
      <div class="charts">${chart({ ...R.magnet, xlabel: '沿轴线的 x（cm）', ylabel: 'B (mT)', label: '沿磁体轴线的磁场', vlines: [[-10, 'S'], [10, 'N']],
        series: [{ pts: curve(x => M.magnetB([x / 100, 0, 0])[0] * 1000, -40, 40, 120) }] })}</div>
      <p class="hintline">点击磁体，在它的 N 端套上一个闭合盒子。每格 10 cm。</p>`,
    cam: { target: [STATIONS.magnet, 2.0, 0], az: -18, el: 20, dist: 20 }, lit: 'magnet', scene: 'magnet', look: {},
    fig: '磁感线从 N 极出发，回到 S 极',
  },
  {
    kicker: '14.1', title: '洛伦兹力', sub: 'F = qv × B',
    body: `
      <p class="lede">磁场只对<b>运动</b>电荷有力的作用，而且是侧向的：同时垂直于 <b>v</b> 和 <b>B</b>。</p>
      <div class="eq"><b>F</b> = <i>q</i> <b>v</b> × <b>B</b>, &nbsp; <i>F</i> = <i>qvB</i> sin θ</div>
      <p><b>右手定则：</b>拇指指向 <b>v</b>，食指指向 <b>B</b>，中指就是 + 电荷受力 <b>F</b> 的方向；− 电荷受力方向相反。沿 <b>B</b> 运动时不受力。</p>
      <p><b>F</b> 始终 ⊥ <b>v</b>，所以 <b>B</b> <b>不做功</b>：它只改变电荷的运动方向，从不改变速率。若同时有 <b>E</b>，<b>F</b> = <i>q</i><b>E</b> + <i>q</i><b>v</b> × <b>B</b>（这个合力也称洛伦兹力）。</p>
      <div class="charts">${chart({ ...R.rhr, xlabel: 'v 与 B 的夹角 θ（°）', ylabel: 'F (10⁻¹⁴ N)', cursor: 'rhr', label: '力随夹角的变化', series: [{ pts: curve(d => M.RHR.Fmax * Math.sin(d * Math.PI / 180) / 1e-14, 0, 180) }] })}</div>
      <p class="hintline">点击，把 <b>v</b> 分解为沿 <b>B</b> 和垂直于 <b>B</b> 的两个分量。<i>v</i> = ${sci(M.RHR.v, 1)} m/s，<i>B</i> = ${f(M.RHR.B)} T；<b>F</b> 为 ${sci(M.RHR.Fmax, 1)} N 时画成 1.5 格。</p>`,
    cam: { target: [STATIONS.rhr, 1.9, 0], az: -36, el: 22, dist: 17 }, lit: 'rhr', scene: 'rhr', look: {},
    fig: '速度相同的质子和电子',
  },
  {
    kicker: '14.2', title: '磁场中的圆周运动', sub: 'r = mv/qB',
    body: `
      <p class="lede">电荷垂直于匀强 <b>B</b> 运动时，受力始终与速度垂直。这个力提供向心力：电荷做匀速圆周运动。</p>
      <div class="eq"><i>qvB</i> = <i>mv</i>²/<i>r</i> → <i>r</i> = <i>mv</i>/<i>qB</i>, &nbsp;ω = <i>qB</i>/<i>m</i></div>
      <p>两个质子从静止出发，分别经 50 V 和 200 V 加速（获得 50 eV 和 200 eV，<i>q</i>Δ<i>V</i> = ½<i>mv</i>²）。能量是 4 倍，速率是 2 倍，半径也是 2 倍：${f(M.CYC.r[0] * 100)} cm 和 ${f(M.CYC.r[1] * 100)} cm。</p>
      <p>但两者的周期都是 <i>T</i> = 2π<i>m</i>/<i>qB</i> = ${f(M.CYC.T * 1e6, 3)} μs，所以每转一圈都在起点相遇。<b>回旋加速器</b>正是利用这一点，以 ${f(M.CYC.f / 1e6)} MHz 的频率在缝隙处一次次给它们加速。</p>
      <div class="charts">${chart({ ...R.cyclo, xlabel: 'v（10⁵ m/s）', ylabel: 'r (cm)', label: '半径随速率的变化', series: [{ pts: curve(v => M.MP * v * 1e5 / (M.QE * M.CYC.B) * 100, 0, 2.5) }],
        marks: M.CYC.v.map((v, i) => [v / 1e5, M.CYC.r[i] * 100, `${M.CYC.dV[i]} V`]) })}</div>
      <p class="hintline">点击查看受力和半径。<i>B</i> = ${f(M.CYC.B)} T，竖直向下。每格 1 cm；时间放慢 ${slow(M.CYC.show / M.CYC.T)}×。</p>`,
    cam: { target: [STATIONS.cyclo, 0.8, 0], az: -14, el: 40, dist: 17 }, lit: 'cyclo', scene: 'cyclo', look: {},
    fig: '速率加倍，半径加倍，周期相同',
  },
  {
    kicker: '14.3', title: '正交的 E 和 B', sub: '速度选择器',
    body: `
      <p class="lede">两板之间的 <b>E</b> 以 <i>qE</i> 把质子推向 − 板。垂直纸面向里的 <b>B</b> 以 <i>qvB</i> 把它推回来。在某一个速率下，两者恰好抵消：</p>
      <div class="eq"><i>qE</i> = <i>qvB</i> &nbsp;→&nbsp; <i>v</i> = <i>E</i>/<i>B</i></div>
      <p>这里 <i>E</i> = ${f(M.SEL.E, 0)} V/m，<i>B</i> = ${f(M.SEL.B, 3)} T，所以速率为 ${sci(M.SEL.v0, 1)} m/s 的质子沿直线通过。更慢时 <i>qE</i> 占优，质子向下偏；更快时 <i>qvB</i> 占优，向上偏。</p>
      <p><b>霍尔效应</b>是导线中的同一种平衡：电荷在一侧堆积，直到 <i>qE</i> = <i>qv</i><sub>d</sub><i>B</i>，留下 Δ<i>V</i><sub>H</sub> = <i>v</i><sub>d</sub><i>Bd</i> = <i>IBd</i>/<i>nqA</i>。</p>
      <div class="charts">${chart({ ...R.selector, zero: true, xlabel: 'v（10⁵ m/s）', ylabel: 'qvB − qE，向上（10⁻¹⁶ N）', label: '合力随速率的变化',
        series: [{ pts: curve(v => M.QE * (v * 1e5 * M.SEL.B - M.SEL.E) / 1e-16, 0, 2) }], marks: M.SEL.k.map((k, i) => [k, M.QE * M.SEL.E * (k - 1) / 1e-16, ['0.8', 'E/B', '1.25'][i], i === 1 ? -26 : 6, i === 1 ? -8 : 14]) })}</div>
      <p class="hintline">点击查看每个质子受的 <i>q</i><b>E</b> 和 <i>q</i><b>v</b> × <b>B</b>。每格 1 cm。</p>`,
    cam: { target: [STATIONS.selector + 0.4, 2.5, 0], az: -22, el: 13, dist: 31 }, lit: 'selector', scene: 'selector', look: {},
    fig: '只有 v = E/B 的质子沿直线通过',
  },
  {
    kicker: '14.4', title: '安培力', sub: '以及线圈受的力矩',
    body: `
      <p class="lede">电流就是大量运动的电荷。由 <i>I</i> = <i>nqAv</i><sub>d</sub>，长为 <i>L</i> 的导线中电荷 <i>nqAL</i> 所受的力变为</p>
      <div class="eq"><b>F</b> = <i>I</i> <b>L</b> × <b>B</b></div>
      <p>在匀强磁场中，线圈各边受力之和为零，但两条竖直边受力方向相反、作用线不同。它们使线圈转动：</p>
      <div class="eq"><b>τ</b> = <b>μ</b> × <b>B</b>, &nbsp; <b>μ</b> = <i>I</i><b>A</b></div>
      <p>与电偶极子的 <i>U</i> = −<b>p</b> · <b>E</b> 一样，<i>U</i> = −<b>μ</b> · <b>B</b>：沿 <b>B</b> 时最低（稳定），逆着 <b>B</b> 时最高（不稳定）。这里 μ = ${f(M.LOOP.mu, 2)} A·m²。</p>
      <div class="charts">${chart({ ...R.loop, zero: true, xlabel: 'μ 与 B 的夹角 θ（°）', ylabel: 'τ (N·m), U (J)', cursor: 'loop', label: '力矩和能量随夹角的变化',
        series: [{ pts: curve(d => M.LOOP.tmax * Math.sin(d * Math.PI / 180), 0, 180), tag: [80, M.LOOP.tmax, 'τ'] }, { cls: 'trend', pts: curve(M.loopU, 0, 180), tag: [150, M.loopU(150), 'U'] }] })}</div>
      <p class="hintline">线圈缓慢转过各个角度。点击查看每条边受的力（每 N 画 4 格）。</p>`,
    cam: { target: [STATIONS.loop, 2.3, 0], az: -32, el: 16, dist: 20 }, lit: 'loop', scene: 'loop', look: {},
    fig: `${f(M.LOOP.a * 100, 0)} × ${f(M.LOOP.b * 100, 0)} cm，${f(M.LOOP.I, 1)} A，B = ${f(M.LOOP.B)} T`,
  },
  {
    kicker: '14.5', title: '安培环路定理', sub: '长直导线周围的 B',
    body: `
      <p class="lede">长直导线周围的磁感线是一个个圆：拇指指向 <i>I</i>，四指弯曲的方向就是 <b>B</b> 的方向。</p>
      <div class="eq">∮ <b>B</b> · d<b>s</b> = μ<sub>0</sub><i>I</i><sub>enc</sub></div>
      <p>在圆周上 <b>B</b> ∥ d<b>s</b>，且 <i>B</i> 大小不变：<i>B</i>(2π<i>r</i>) = μ<sub>0</sub><i>I</i>，所以 <i>B</i> = μ<sub>0</sub><i>I</i>/2π<i>r</i>。在粗导线内部，<i>B</i> = μ<sub>0</sub><i>Ir</i>/2π<i>a</i>²。</p>
      <p>求穿过矩形的磁通量，就把各细条加起来：∫<sub><i>a</i></sub><sup><i>a</i>+<i>c</i></sup> (μ<sub>0</sub><i>I</i>/2π<i>r</i>) <i>b</i> d<i>r</i>，即</p>
      <div class="eq">Φ = (μ<sub>0</sub><i>Ib</i>/2π) ln((<i>a</i> + <i>c</i>)/<i>a</i>)</div>
      <div class="charts">${chart({ ...R.ampere, xlabel: 'r (cm)', ylabel: 'B (μT)', cursor: 'ampere', label: '粗导线的磁场随距离的变化', vlines: [[1, 'a']],
        series: [{ pts: curve(r => M.ampereB(r / 100) * 1e6, 0, 15, 150) }] })}</div>
      <p class="hintline">点击导线查看 d<b>s</b>，点击矩形查看它的细条。<b>B</b>：每 100 μT 画 0.8 格。</p>`,
    cam: { target: [STATIONS.ampere + 0.7, 3.3, 0], az: 34, el: 21, dist: 24 }, lit: 'ampere', scene: 'ampere', look: {},
    fig: `${f(M.AMP.I, 0)} A 电流沿长直导线向上`,
  },
  {
    kicker: '14.6', title: '毕奥–萨伐尔定律', sub: '把每一小段加起来',
    body: `
      <p class="lede">没有对称性可用时，就把每一小段导线 d<b>l</b> 的磁场加起来，正如库仑定律把一小块一小块电荷的电场加起来。<b>r̂</b> 从 d<b>l</b> 指向 P：</p>
      <div class="eq">d<b>B</b> = (μ<sub>0</sub><i>I</i>/4π) d<b>l</b> × <b>r̂</b> / <i>r</i>²</div>
      <p>在圆环的轴线上，每个 d<b>l</b> ⊥ <b>r</b>。d<b>B</b> 的侧向分量绕圆环一周相互抵消；沿轴线的分量（cos θ = <i>R</i>/<i>r</i>）相加：</p>
      <div class="eq"><i>B</i> = μ<sub>0</sub><i>IR</i>² / 2(<i>R</i>² + <i>z</i>²)<sup>3/2</sup></div>
      <p>在圆心处，μ<sub>0</sub><i>I</i>/2<i>R</i> = ${uT(M.RING.Bc)} μT。在远处，μ<sub>0</sub><i>IR</i>²/2<i>z</i>³：正是偶极子的 1/<i>z</i>³。</p>
      <div class="charts">${chart({ ...R.ring, xlabel: '沿轴线的 z（cm）', ylabel: 'B (μT)', cursor: 'ring', label: '圆环轴线上的磁场',
        series: [{ cls: 'trend', pts: curve(z => M.ringFar(z / 100) * 1e6, 12, 36), tag: [24, 13, 'μ₀IR²/2z³'] }, { pts: curve(z => M.ringAxis(z / 100) * 1e6, 0, 36) }] })}</div>
      <p class="hintline">点击圆环，查看 ${M.RING.pieces} 小段 d<b>l</b> 及其 d<b>B</b>（画成 5 倍长）。<b>B</b>：每 20 μT 画 1 格。</p>`,
    cam: { target: [STATIONS.ring + 1.0, 2.5, 0], az: -38, el: 14, dist: 22 }, lit: 'ring', scene: 'ring', look: {},
    fig: `R = ${f(M.RING.R * 100, 0)} cm，I = ${f(M.RING.I, 0)} A`,
  },
  {
    kicker: '14.7', title: '平行导线', sub: '同向电流相互吸引',
    body: `
      <p class="lede">每根导线都处在另一根的磁场中，所以各自受力 <b>F</b> = <i>I</i> <b>L</b> × <b>B</b>。</p>
      <div class="eq"><i>B</i><sub>1</sub> = μ<sub>0</sub><i>I</i><sub>1</sub>/2π<i>d</i> &nbsp;→&nbsp; <i>F</i>/<i>L</i> = μ<sub>0</sub><i>I</i><sub>1</sub><i>I</i><sub>2</sub>/2π<i>d</i></div>
      <p>两根导线各通 ${f(M.WIRES.I, 0)} A，相距 ${f(M.WIRES.d * 100, 0)} cm，每米受力 ${f(M.WIRES.FL * 1000)} mN。电流<b>同向</b>相吸，<b>反向</b>相斥，与电荷的情形正好相反。</p>
      <p>磁感线显示了这一点。同向电流的磁场在两导线之间相互抵消（正中间 <i>B</i> = 0），外侧的磁感线把两根导线一起包住。反向电流则使两导线之间的磁场变密。</p>
      <div class="charts">${chart({ ...R.wires, xlabel: 'd (cm)', ylabel: 'F/L (mN/m)', label: '单位长度受力随间距的变化',
        series: [{ pts: curve(d => M.MU0 * M.WIRES.I ** 2 / (2 * Math.PI * d / 100) * 1000, 2, 40) }], marks: [[M.WIRES.d * 100, M.WIRES.FL * 1000, `${f(M.WIRES.FL * 1000)} mN/m`]] })}</div>
      <p class="hintline">点击一对导线，查看每根导线所在处另一根的磁场。力：每 mN/m 画 2 格。</p>`,
    cam: { target: [(STATIONS.same + STATIONS.opposite) / 2, 2.0, 0], az: -10, el: 30, dist: 34 }, lit: 'same', scene: 'wires', look: {},
    fig: '先同向，再反向',
  },
  {
    kicker: '14.8', title: '螺线管', sub: '和螺绕环：匀强磁场',
    body: `
      <p class="lede">把许多线圈叠在一起：它们的磁场在内部相加，在外部几乎抵消。这就是<b>螺线管</b>。</p>
      <p>取一个一半在管内的矩形。只有管内那条边有贡献（两端 <b>B</b> ⊥ d<b>s</b>，管外 <i>B</i> ≈ 0），所以 <i>BL</i> = μ<sub>0</sub><i>NI</i>。用 <i>n</i> = <i>N</i>/<i>L</i> 表示每米的匝数：</p>
      <div class="eq"><i>B</i> = μ<sub>0</sub><i>nI</i> &nbsp;&nbsp; 螺绕环：<i>B</i> = μ<sub>0</sub><i>NI</i>/2π<i>r</i></div>
      <p>这里 μ<sub>0</sub><i>nI</i> = ${uT(M.SOL.B)} μT；毕奥–萨伐尔求和给出 ${uT(SOLC)} μT，因为这个线圈只有 ${f(M.SOL.L / M.SOL.R, 1)} 个半径长。把它弯成一个环就是<b>螺绕环</b>：环内 <i>B</i>(2π<i>r</i>) = μ<sub>0</sub><i>NI</i>，中间的孔里和环外 <i>B</i> 都为 0。</p>
      <div class="charts">${chart({ ...R.solenoid, xlabel: '沿轴线的 x（cm）', ylabel: 'B (μT)', label: '螺线管轴线上的磁场', vlines: [[-20, '端'], [20, '端']],
        series: [{ cls: 'trend', pts: [[-20, M.SOL.B * 1e6], [20, M.SOL.B * 1e6]], tag: [-6, M.SOL.B * 1e6 + 6, 'μ₀nI'] }, { pts: curve(x => M.solB([x / 100, 0, 0])[0] * 1e6, -40, 40, 100) }] })}</div>
      <p class="hintline">点击螺线管查看它的安培环路矩形，点击螺绕环看内部。<b>B</b>：每 100 μT 画 1 格。</p>`,
    cam: { target: [(STATIONS.solenoid + STATIONS.toroid) / 2 - 0.4, 1.8, 0], az: -10, el: 30, dist: 31 }, lit: 'solenoid', scene: 'solenoid', look: {},
    fig: `${M.SOL.N} 匝和 ${M.TOR.N} 匝，${f(M.SOL.I, 1)} A`,
  },
];

// ---------- click a scene: what it breaks into ----------
const deg = Math.PI / 180;
export const PLATES = {
  magnet: { text: `磁体变淡，露出内部的磁感线；在它的 N 端套上一个闭合盒子。磁感线从盒子的外侧各面穿出，同样这些磁感线又从切过磁体的那一面穿回来。穿出与穿入相互抵消：不存在单独的磁极。`,
    facts: () => [['穿出的磁通量', `${sci(MAGFLUX.out)} Wb`], ['穿入的磁通量', `${sci(MAGFLUX.in)} Wb`], ['总量 ∮B·dA', `为穿出磁通量的 ${f(Math.abs(MAGFLUX.total / MAGFLUX.out) * 100, 3)}%：即 0`], ['中心处的 B', `${f(BC * 1000, 0)} mT`]] },
  rhr: { text: `<b>v</b> 分解为沿 <b>B</b> 和垂直于 <b>B</b> 的两个分量（灰色）。只有垂直分量受力：<i>F</i> = <i>qv</i><sub>⊥</sub><i>B</i> = <i>qvB</i> sin θ。<b>F</b> 同时 ⊥ <b>v</b> 和 <b>B</b>。电子带负电，受力方向相反。`,
    facts: s => { const d = M.rhrAngle(s.clock), v = M.RHR.v; return [['θ', `${f(d, 0)}°`], ['沿 B 的 v', `${sci(Math.max(Math.abs(v * Math.cos(d * deg)), 1), 2)} m/s`], ['垂直于 B 的 v', `${sci(Math.max(v * Math.sin(d * deg), 1), 2)} m/s`], ['F = qv⊥B', `${sci(Math.max(M.RHR.Fmax * Math.sin(d * deg), 1e-30), 2)} N`], ['F 做的功', '0']]; } },
  cyclo: { text: `力（红色）指向各自圆周的圆心，⊥ <b>v</b>，所以速率始终不变。较快的质子需要更大的圆，但走完一圈所用的时间相同。`,
    facts: s => { const t = M.cycTime(s.clock) % M.CYC.T; return [['本圈已用时间 t', `${f(t * 1e6, 3)} μs（共 ${f(M.CYC.T * 1e6, 3)} μs）`], ['50 V 质子受的 F', `${sci(M.QE * M.CYC.v[0] * M.CYC.B)} N`], ['200 V 质子受的 F', `${sci(M.QE * M.CYC.v[1] * M.CYC.B)} N`], ['ω = qB/m', `${sci(M.CYC.omega)} rad/s`]]; } },
  selector: { text: `两板之间的每个质子都受两个力：向下的 <i>q</i><b>E</b>，对所有质子都一样；向上的 <i>q</i><b>v</b> × <b>B</b>，随速率增大。两者之和（红色）只在 <i>v</i> = <i>E</i>/<i>B</i> 时为零。只有 <b>E</b> 做功，所以慢的质子落向 − 板时会加速。`,
    facts: () => [['qE（三个都一样）', `${sci(M.QE * M.SEL.E)} N`], ['0.8 E/B 时的 qvB', `${sci(0.8 * M.QE * M.SEL.E)} N`], ['E/B 时的 qvB', `${sci(M.QE * M.SEL.E)} N`], ['1.25 E/B 时的 qvB', `${sci(1.25 * M.QE * M.SEL.E)} N`]] },
  loop: { text: `每条边受力 <b>F</b> = <i>I</i> <b>L</b> × <b>B</b>。竖直边上的 <b>F</b><sub>1</sub> 和 <b>F</b><sub>3</sub> 始终为 <i>IbB</i>，但作用线不同，所以使线圈转动。上下两边的 <b>F</b><sub>2</sub> 和 <b>F</b><sub>4</sub> 大小相等、方向相反，且在同一直线上：只会拉伸或压缩线圈。弯曲的导线也一样：半径为 <i>R</i> 的半圆受力 ∫<i>I</i> d<b>s</b> × <b>B</b> = 2<i>IRB</i>，与连接两端的直弦相同。`,
    facts: s => { const d = M.loopAngle(s.clock), S = M.loopSides(d); return [['θ', `${f(d, 0)}°`], ['F₁、F₃（竖直边）', `各 ${f(M.len(S[0].F), 3)} N`], ['F₂、F₄（上、下边）', `各 ${f(M.len(S[1].F), 3)} N`], ['ΣF', '0 N'], ['τ = μB sin θ', `${f(M.len(M.loopTorque(d)), 4)} N·m`]]; } },
  ampere: { text: `安培环路圆被分成许多小段 d<b>s</b>。在每一小段上，<b>B</b> 都与 d<b>s</b> 同向且大小相同，所以 ∮<b>B</b> · d<b>s</b> 就是 <i>B</i> × 2π<i>r</i>。圆变大时，<i>B</i> 相应减小：总量始终为 μ<sub>0</sub><i>I</i>。`,
    facts: s => { const r = M.ampR(s.clock), B = M.ampereB(r); return [['r', `${f(r * 100, 1)} cm`], ['B', `${uT(B)} μT`], ['2πr', `${f(2 * Math.PI * r * 100, 1)} cm`], ['B · 2πr', `${sci(B * 2 * Math.PI * r)} T·m`], ['μ₀I', `${sci(M.MU0 * M.AMP.I)} T·m`]]; } },
  flux: { text: `矩形被分成 ${M.FLUX.strips} 条宽为 d<i>r</i> 的细条。每条细条上 <i>B</i> 几乎不变，所以每条的磁通量为 <i>B</i>(<i>r</i>) <i>b</i> d<i>r</i>。靠近导线的细条贡献最多。把它们加起来就是积分。`,
    facts: () => { const s = M.fluxStrips(); return [...s.map((x, i) => [`第 ${i + 1} 条（r ${f((M.FLUX.a + (i + 0.5) * M.FLUX.c / M.FLUX.strips) * 100, 1)} cm）`, `${f(x * 1e9, 0)} nWb`]), ['总和', `${f(s.reduce((a, b) => a + b, 0) * 1e9, 0)} nWb`], ['(μ₀Ib/2π) ln((a+c)/a)', `${f(M.FLUX.phi * 1e9, 0)} nWb`]]; } },
  ring: { text: `圆环上的十二小段 d<b>l</b>，以及各自在 P 点产生的 d<b>B</b>（灰色）。每个 d<b>B</b> 都同时 ⊥ d<b>l</b> 和 <b>r</b>，所以合起来构成一个圆锥。绕圆环一周，侧向分量两两抵消，沿轴线的分量加起来就是 <b>B</b>。`,
    facts: s => { const z = M.ringZ(s.clock), p = M.ringPieces(z), one = M.len(p[0].dB); return [['z', `${f(z * 100, 1)} cm`], ['每段的 |dB|', `${f(one * 1e6, 2)} μT`], ['每段沿轴线的分量', `${f(p[0].dB[0] * 1e6, 2)} μT`], [`${p.length} 段之和`, `${uT(p.reduce((a, q) => a + q.dB[0], 0))} μT`], ['μ₀IR²/2(R²+z²)^{3/2}', `${uT(M.ringAxis(z))} μT`]]; } },
  same: { text: `在导线 2 处，导线 1 的磁场 <b>B</b><sub>1</sub> 与导线垂直。<i>I</i><sub>2</sub><b>L</b> × <b>B</b><sub>1</sub> 指向导线 1。反过来也一样，两者是一对大小相等、方向相反的力。`,
    facts: () => [['导线 2 处的 B₁', `${uT(M.ampereB(M.WIRES.d))} μT`], ['每根的 F/L', `${f(M.WIRES.FL * 1000)} mN/m`], ['正中间的 B', '0'], ['方向', '相互靠近']] },
  opposite: { text: `让 <i>I</i><sub>2</sub> 反向，<i>I</i><sub>2</sub><b>L</b> × <b>B</b><sub>1</sub> 也随之反向：两根导线相互推开。此时两者之间的磁场相加。`,
    facts: () => [['导线 2 处的 B₁', `${uT(M.ampereB(M.WIRES.d))} μT`], ['每根的 F/L', `${f(M.WIRES.FL * 1000)} mN/m`], ['正中间的 B', `${uT(2 * M.ampereB(M.WIRES.d / 2))} μT`], ['方向', '相互远离']] },
  solenoid: { text: `线圈变淡，露出内部的磁场：近似均匀，近似平行。虚线安培环路矩形包围了 ${M.rectTurns()} 匝。只有沿轴线的那条边对 ∮<b>B</b> · d<b>s</b> 有贡献。`,
    facts: () => { const L = 2 * M.SOL_RECT.h, N = M.rectTurns(); return [['包围的匝数 N', `${N}`], ['管内的边长 L', `${f(L * 100, 0)} cm`], ['μ₀NI / L', `${uT(M.MU0 * N * M.SOL.I / L)} μT`], ['∮B·ds（由模型求和）', `${sci(M.lineIntegral(M.solB, M.rectPath(M.SOL_RECT.h, M.SOL_RECT.Y, 200)))} T·m`], ['μ₀NI', `${sci(M.MU0 * N * M.SOL.I)} T·m`]]; } },
  toroid: { text: `线圈变淡。虚线圆时大时小，从中间的孔经过环芯一直扩到外部。只有当它位于绕组内部时才显示 <b>B</b> 箭头，此时它把全部 ${M.TOR.N} 匝各包围一次。`,
    facts: s => { const r = M.torR(s.clock); return [['r', `${f(r * 100, 1)} cm`], ['包围的电流', r > M.TOR.R0 - M.TOR.a && r < M.TOR.R0 + M.TOR.a ? `NI = ${f(M.TOR.N * M.TOR.I, 0)} A` : '0'], ['μ₀NI/2πr', `${uT(M.torIdeal(r))} μT`], ['模型计算值', `${uT(M.len(M.torB([r, 0, 0])))} μT`]]; } },
};
