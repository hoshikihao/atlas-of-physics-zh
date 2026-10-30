// Chapter 11, page by page (after the AP Physics C E&M organizer, Unit 3). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS as ST, SC } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const BLUE = '#3d63a8';
const uJ = J => f(J * 1e6, 3);

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursors = [], label, zero = false, extra = '' }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" style="fill:none${s.color ? `;stroke:${s.color}` : ''}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}"${s.color ? ` style="fill:${s.color}"` : ''}>${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>
    ${zero ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/><text class="ax" x="${P.l - 6}" y="${sy(0) + 4}" text-anchor="end">0</text>` : ''}${paths}${mk}${extra}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(([key, color]) => `<circle class="cursor" r="4.5" data-cursor="${key}"${color ? ` style="fill:${color}"` : ''}/>`).join('')}
  </svg>`;
}
const samples = (n, a, b, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });

// chart ranges, shared with the live cursors in main.js
export const R = {
  pair: { x0: 10, x1: 40, y0: -1, y1: 1 },
  square: { x0: 0, x1: 4.8, y0: 0, y1: 1.2 },
  uniform: { x0: 0, x1: 20, y0: -12, y1: 0 },
  hill: { x0: 0, x1: 0.4, y0: 0, y1: 200 },
  rod: { x0: 0, x1: 0.4, y0: 0, y1: 300 },
  ring: { x0: 0, x1: 0.25, y0: 0, y1: 250 },
  sphV: { x0: 0, x1: 0.4, y0: 0, y1: 300 },
  sphE: { x0: 0, x1: 0.4, y0: 0, y1: 2 },
  accel: { x0: 0, x1: 6, y0: 0, y1: 6 },
};

const Ulike = M.pair(M.PAIR.run, 1), Uunl = M.pair(M.PAIR.run, -1);
const steps = [0, 1, 2, 3].map(M.sqStep);
const dipAxis = M.VdipAxis(M.DIP.axisX), rodA = M.VrodAxis(0.1), rodB = M.VrodBis(M.ROD.bisA);
// split a sampled curve into the runs that stay inside ±lim (it blows up at each charge)
const runs = (pts, lim) => pts.reduce((out, p, i) => { if (Math.abs(p[1]) > lim || !isFinite(p[1])) return out; if (i && Math.abs(pts[i - 1][1]) <= lim && out.length) out.at(-1).push(p); else out.push([p]); return out; }, []);

export const PAGES = [
  {
    kicker: '第 11 章', title: '电势能', sub: '储存在一对电荷中的功',
    body: `
      <p class="lede">把一个电荷推向另一个同号电荷，你要克服斥力做功。这部分功以<b>电势能</b>的形式储存起来。</p>
      <div class="eq"><i>U</i> = <i>kq</i><sub>1</sub><i>q</i><sub>2</sub> / <i>r</i></div>
      <p>两电荷相距无穷远时 <i>U</i> = 0。把 +2 nC 从距 +4 nC ${M.PAIR.r0 * 100} cm 处移到 ${M.PAIR.r1 * 100} cm 处，需要做功 ${uJ(Ulike.W)} μJ。异种电荷相互吸引，所以它们的 <i>U</i> 为<b>负</b>，并随着靠近而减小。<i>U</i> 是标量：它的正负由两个电荷的符号决定。</p>
      <div class="charts">${chart({ ...R.pair, zero: true, xlabel: '间距 r（cm）', ylabel: 'U（μJ）', cursors: [['pairL'], ['pairU', BLUE]], label: '同种电荷与异种电荷的电势能随间距的变化',
        series: [{ pts: samples(60, 10, 40, r => M.Upair(M.PAIR.q1, M.PAIR.q2, r / 100) * 1e6), tag: [24, 0.38, '同种：U > 0'] }, { color: BLUE, pts: samples(60, 10, 40, r => M.Upair(M.PAIR.q1, -M.PAIR.q2, r / 100) * 1e6), tag: [24, -0.18, '异种：U < 0'] }] })}</div>
      <p class="hintline">点击查看分步的路径，每一步增加 <i>F</i>Δ<i>r</i>。1 格 = 10 cm；力 ${(SC.F * 10).toFixed(1)} cm 代表 1 μN。</p>`,
    cam: { target: [ST.pair + 0.2, 0.3, 0], az: -12, el: 32, dist: 16 }, lit: 'pair', scene: 'pair', look: {},
    fig: '同种与异种电荷对，逐渐靠近',
  },
  {
    kicker: '11.1', title: '组装电荷', sub: '把每一对都加起来',
    body: `
      <p class="lede">一组电荷的能量，等于把它们从无穷远处一个一个移过来所做的功。</p>
      <table class="data">
        <tr><td><i>q</i><sub>1</sub></td><td>那里还什么都没有</td><td>0</td></tr>
        <tr><td><i>q</i><sub>2</sub></td><td><i>kq</i>²/<i>a</i></td><td>${uJ(steps[1])} μJ</td></tr>
        <tr><td><i>q</i><sub>3</sub></td><td><i>kq</i>²/<i>a</i> + <i>kq</i>²/√2<i>a</i></td><td>${uJ(steps[2])} μJ</td></tr>
        <tr><td><i>q</i><sub>4</sub></td><td>2<i>kq</i>²/<i>a</i> + <i>kq</i>²/√2<i>a</i></td><td>${uJ(steps[3])} μJ</td></tr>
      </table>
      <div class="eq"><i>U</i> = 4<i>kq</i>²/<i>a</i> + 2<i>kq</i>²/√2<i>a</i> = ${uJ(M.SQ.U)} μJ</div>
      <p>四个 +2 nC 电荷，<i>a</i> = ${M.SQ.a * 100} cm。共六对，按任何顺序移入结果都一样。</p>
      <div class="charts">${chart({ ...R.square, xlabel: '时间（s）', ylabel: '这组电荷的 U（μJ）', cursors: [['square']], label: '电荷陆续到位时这组电荷的能量',
        series: [{ pts: samples(240, 0, M.SQ.run, t => M.square(t).U * 1e6) }] })}</div>
      <p class="hintline">点击正方形，查看它的六对电荷。</p>`,
    cam: { target: [ST.square, 0.3, 0], az: -12, el: 40, dist: 15 }, lit: 'square', scene: 'square', look: {},
    fig: '四个电荷，六对',
  },
  {
    kicker: '11.2', title: '电势', sub: '单位电荷的能量',
    body: `
      <p class="lede"><b>电势</b> <i>V</i> 是单位电荷的电势能，单位为伏特（J/C）。放在该处的电荷 <i>q</i> 具有 <i>U</i> = <i>qV</i>。</p>
      <div class="eq">Δ<i>V</i> = −∫<sub>A</sub><sup>B</sup> <b><i>E</i></b> · d<b><i>s</i></b></div>
      <p>每一步 d<b><i>s</i></b> 只有沿 <b><i>E</i></b> 的部分起作用。<i>E</i> = ${M.UNI.E} N/C：A → B 垂直于 <b><i>E</i></b>，贡献 0；B → C 沿 <b><i>E</i></b> 走 0.2 m，−${M.UNI.E} × 0.2 = <b>−10 V</b>。直接从 A 到 C 结果相同。<b>顺着</b> <b><i>E</i></b> 移动，<i>V</i> 降低。浅色的面是<b>等势面</b>，与 <b><i>E</i></b> 垂直。若 <i>E</i> = 4<i>x</i>：−∫<sub>0</sub><sup>4</sup> 4<i>x</i> d<i>x</i> = ${M.VARY.dV} V。</p>
      <div class="charts">${chart({ ...R.uniform, xlabel: '沿 E 的距离（cm）', ylabel: 'V（伏特）', cursors: [['uni']], label: '电势随沿电场方向距离的变化', series: [{ pts: [[0, 0], [20, -10]] }] })}</div>
      <p class="hintline">点击把 A → C 拆成一步步 d<b><i>s</i></b>。<b><i>E</i></b>：一格代表 25 N/C。</p>`,
    cam: { target: [ST.uniform, 0.4, 0.2], az: -18, el: 34, dist: 19 }, lit: 'uniform', scene: 'uniform', look: {},
    fig: 'E = 50 N/C；从 A 到 C 降低 10 V',
  },
  {
    kicker: '11.3', title: '电势山丘', sub: 'V = kq/r，以及 E = −∇V',
    body: `
      <p class="lede">在点电荷周围，每一步只有径向部分起作用，<b>r̂</b> · d<b><i>s</i></b> = d<i>r</i>：</p>
      <div class="eq">Δ<i>V</i> = −∫ <i>kq</i>/<i>r</i>² d<i>r</i> = <i>kq</i>(1/<i>r</i><sub>B</sub> − 1/<i>r</i><sub>A</sub>)</div>
      <p>从无穷远处算起，<i>V</i> = <i>kq</i>/<i>r</i>，这里把 +1 nC 的电势画成高度。圆圈是每隔 30 V 一条的等势线；山坡越陡，它们越密。<b><i>E</i></b> 指向正下坡方向，大小等于坡度：<b><i>E</i></b> = −∇<i>V</i>，即 <i>E</i> = −d<i>V</i>/d<i>r</i>。</p>
      <div class="charts">${chart({ ...R.hill, xlabel: '距离 r（m）', ylabel: 'V（伏特）', cursors: [['hill']], label: '电势随距离的变化，以及探测点处的切线',
        series: [{ pts: samples(80, 0.045, 0.4, r => M.Vpoint(M.HILL.Q, r)) }], extra: `<path class="trend" style="fill:none" data-tangent="hill" d=""/>` })}</div>
      <p class="live" id="hilllive"></p>
      <p class="hintline">点击把山丘从地图上抬起。高度：一格代表 60 V（150 V 以上削成圆顶）；<b><i>E</i></b>：一格代表 1 kN/C。</p>`,
    cam: { target: [ST.hill, 0.9, 0], az: -18, el: 30, dist: 25 }, lit: 'hill', scene: 'hill', look: {},
    fig: '高度 = 电势；箭头指向下坡',
  },
  {
    kicker: '11.4', title: '电偶极子', sub: '电势按数值相加',
    body: `
      <p class="lede">电势是标量：有多个电荷时，把各自的 <i>kq</i>/<i>r</i> 连同正负号相加即可，不用分解分量。</p>
      <div class="eq"><i>V</i><sub>轴</sub> = −2<i>akq</i>/(<i>x</i>² − <i>a</i>²)</div>
      <p>这就是 ±1 nC、相距 ${2 * M.DIP.a * 100} cm 时的 <i>kq</i>/(<i>x</i> + <i>a</i>) − <i>kq</i>/(<i>x</i> − <i>a</i>)：一座山丘旁边一个深坑。在 ${M.DIP.axisX * 100} cm 外的 P 点，<i>V</i> = ${f(dipAxis, 1)} V。中垂线上每一点到两个电荷的距离都相等，所以那里 <i>V</i> = <b>0</b>，尽管 <b><i>E</i></b> 不为零。对于两个同种电荷，中垂线上的 <i>V</i> 不为 0：在中点达到峰值。</p>
      <div class="charts">${chart({ x0: -0.36, x1: 0.36, y0: -200, y1: 200, zero: true, xlabel: '沿轴线的位置（m）', ylabel: '轴线上的 V（伏特）', label: '沿偶极子轴线的电势',
        series: runs(samples(720, -0.36, 0.36, x => M.Vdip([x, 0, 0])), 200).map(pts => ({ pts })),
        marks: [[M.DIP.axisX, dipAxis, `P：${f(dipAxis, 0)} V`, 6, 16]] })}</div>
      <p class="hintline">点击查看每个电荷在 P 和 P′ 处各贡献多少。高度：一格代表 60 V。蓝线：由模型描出的电场线。</p>`,
    cam: { target: [ST.dipole, 0, 0], az: -14, el: 30, dist: 24 }, lit: 'dipole', scene: 'dipole', look: {},
    fig: '一座山丘、一个深坑，中间 V = 0',
  },
  {
    kicker: '11.5', title: '带电细棒', sub: '把每个 dq 都加起来',
    body: `
      <p class="lede">把连续分布的电荷切成小块 d<i>q</i>，每块贡献 <i>k</i> d<i>q</i>/<i>r</i>，再积分。</p>
      <table class="data eqs">
        <tr><td>λ = <i>Q</i>/<i>L</i>，d<i>q</i> = λ d<i>x</i></td><td>${f(M.ROD.lam * 1e9, 0)} nC/m</td></tr>
        <tr><td>P，在轴线上：<i>k</i>λ ln((<i>a</i> + <i>L</i>)/<i>a</i>)</td><td>${f(rodA, 1)} V</td></tr>
        <tr><td>P′，在中垂线上：<i>k</i>λ ln[(<i>L</i> + <i>s</i>)/(−<i>L</i> + <i>s</i>)]</td><td>${f(rodB, 1)} V</td></tr>
      </table>
      <p>+3 nC 分布在 ${M.ROD.L * 100} cm 长的棒上，取 <i>a</i> = 10 cm 时的值，其中 <i>s</i> = √(<i>L</i>² + 4<i>a</i>²)，由 ∫ d<i>x</i>/√(<i>x</i>² + <i>a</i>²) = ln(<i>x</i> + √(<i>x</i>² + <i>a</i>²)) 得到。在远处，细棒就像一个点电荷（虚线）。</p>
      <div class="charts">${chart({ ...R.rod, xlabel: '到端点的距离 a（m）', ylabel: 'P 点的 V（伏特）', cursors: [['rod']], label: '细棒轴线上的电势随距离的变化',
        series: [{ pts: samples(60, 0.04, 0.4, M.VrodAxis), tag: [0.09, 175, '细棒'] }, { cls: 'trend', pts: samples(60, 0.04, 0.4, a => M.K * M.ROD.Q / (a + M.ROD.L / 2)), tag: [0.2, 95, 'kQ/(a + L/2)'] }] })}</div>
      <p class="hintline">点击细棒，把它切成 12 块 d<i>q</i>。</p>`,
    cam: { target: [ST.rod - 0.5, 1.6, 0], az: -12, el: 14, dist: 15 }, lit: 'rod', scene: 'rod', look: {},
    fig: 'λ = 10 nC/m；P 沿轴线滑动',
  },
  {
    kicker: '11.6', title: '圆环、圆弧与圆盘', sub: '每个 dq 都一样远的时候',
    body: `
      <p class="lede">在圆环或圆弧的圆心，每个 d<i>q</i> 到它的距离都是 <i>R</i>，所以 <i>V</i><sub>c</sub> = (<i>k</i>/<i>R</i>)∫d<i>q</i> = <i>kQ</i>/<i>R</i>。</p>
      <table class="data eqs">
        <tr><td>圆环，在其轴线上</td><td><i>kQ</i>/√(<i>R</i>² + <i>z</i>²)</td></tr>
        <tr><td>圆盘，d<i>q</i> = σ·2π<i>r</i> d<i>r</i></td><td>2π<i>k</i>σ(√(<i>R</i>² + <i>z</i>²) − <i>z</i>)</td></tr>
        <tr><td>圆盘中心，σ = <i>Q</i>/π<i>R</i>²</td><td>2<i>kQ</i>/<i>R</i></td></tr>
      </table>
      <p>各带 +2 nC，<i>R</i> = ${M.RING.R * 100} cm。圆环与半圆环的圆心：${f(M.Varc0, 1)} V。圆盘中心：${f(M.Vdisc(0), 1)} V，是前者的两倍，因为同样的电荷离得更近。</p>
      <div class="charts">${chart({ ...R.ring, xlabel: '沿轴线的距离 z（m）', ylabel: 'V（伏特）', cursors: [['ring'], ['disc', BLUE]], label: '圆环与圆盘轴线上的电势',
        series: [{ color: BLUE, pts: samples(60, 0, 0.25, M.Vdisc), tag: [0.1, 160, '圆盘'] }, { pts: samples(60, 0, 0.25, M.Vring), tag: [0.1, 70, '圆环'] }, { cls: 'trend', pts: samples(40, 0.075, 0.25, z => M.K * M.RING.Q / z), tag: [0.17, 112, 'kQ/z'] }] })}</div>
      <p class="hintline">点击圆环、圆弧或圆盘，把它拆成小块 d<i>q</i>。</p>`,
    cam: { target: [ST.ring - 1.4, 1.8, 0], az: -32, el: 12, dist: 29 }, lit: 'ring', scene: 'ring', look: {},
    fig: '圆心处为 kQ/R；P 在轴线上向外移动',
  },
  {
    kicker: '11.7', title: '带电球体', sub: '导体与绝缘体',
    body: `
      <p class="lede">先用高斯定理求出各区域的 <b><i>E</i></b>，再从无穷远处走进来：外部从 ∞ 到 <i>R</i>，内部从 <i>R</i> 到 <i>r</i>。</p>
      <p>在外部，两者都像点电荷，<i>V</i> = <i>kQ</i>/<i>r</i>。<b>导体</b>内部 <i>E</i> = 0，所以 <i>V</i> 保持为 <i>kQ</i>/<i>R</i> = ${f(M.Vcond(0), 1)} V。<b>绝缘体</b>内部 <i>E</i> = <i>kQr</i>/<i>R</i>³，电势继续增加：</p>
      <div class="eq"><i>V</i> = (<i>kQ</i>/<i>R</i>)(3/2 − <i>r</i>²/2<i>R</i>²)</div>
      <p>球心处为 3<i>kQ</i>/2<i>R</i> = ${f(M.Vins(0), 1)} V（+2 nC，<i>R</i> = ${M.SPH.R * 100} cm）。<i>V</i> 从不跃变。</p>
      <div class="charts">${chart({ ...R.sphV, xlabel: 'r（m）', ylabel: 'V（伏特）', cursors: [['sphVc'], ['sphVi', BLUE]], label: '两个球的电势随 r 的变化',
        series: [{ color: BLUE, pts: samples(120, 0, 0.4, M.Vins), tag: [0.11, 215, '绝缘体'] }, { pts: samples(120, 0, 0.4, M.Vcond), tag: [0.13, 150, '导体'] }] })}</div>
      <p class="hintline">点击一个球，查看沿路径的 <b><i>E</i></b>。竖杆：一格代表 150 V；<b><i>E</i></b>：一格代表 2.5 kN/C。</p>`,
    cam: { target: [ST.spheres, 1.8, 0], az: -8, el: 10, dist: 27 }, lit: 'conductor', scene: 'spheres', look: {},
    fig: '从 40 cm 处走进来',
  },
  {
    kicker: '11.8', title: '电子伏特', sub: '电势差给出的能量',
    body: `
      <p class="lede">释放一个电荷：电势能转化为动能，机械能守恒。</p>
      <div class="eq"><i>qV</i><sub>0</sub> = <i>qV</i><sub>f</sub> + ½<i>mv</i>²  →  <i>v</i> = √(2<i>q</i>Δ<i>V</i>/<i>m</i>)</div>
      <p>质子顺着 <b><i>E</i></b> 从 7 V “滚下坡”到 1 V；电子则反向运动。两者各获得 ${M.ACC.dV} <b>eV</b>（1 eV = ${M.E_CH.toExponential(2).replace('e-', ' × 10⁻')} J，即一个 <i>e</i> 经过 1 V 获得的能量），但电子的质量只有质子的 1/${Math.round(M.M_P / M.M_E)}：</p>
      <table class="data">
        <tr><th></th><th>质子</th><th>电子</th></tr>
        <tr><td>末速度</td><td>${f(M.ACC.vp / 1000, 1)} km/s</td><td>${f(M.ACC.ve / 1e6, 2)} × 10⁶ m/s</td></tr>
        <tr><td>穿过 6 cm 的时间</td><td>${f(M.ACC.Tp * 1e6, 2)} μs</td><td>${f(M.ACC.Te * 1e9, 0)} ns</td></tr>
      </table>
      <div class="charts">${chart({ ...R.accel, xlabel: '到 7 V 极板的距离（cm）', ylabel: 'K（eV）', cursors: [['accP'], ['accE', BLUE]], label: '质子和电子的动能随位置的变化',
        series: [{ pts: [[0, 0], [6, 6]], tag: [3.6, 3.0, '质子 →'] }, { color: BLUE, pts: [[6, 0], [0, 6]], tag: [0.5, 3.4, '← 电子'] }] })}</div>
      <p class="hintline">两者都放慢到用 ${M.ACC.run} s 穿过。点击查看受力和频闪像。1 格 = 1 cm；<b><i>E</i></b>：一格代表 50 V/m。</p>`,
    cam: { target: [ST.accel, 2.3, 0], az: -16, el: 10, dist: 21 }, lit: 'accel', scene: 'accel', look: {},
    fig: '降 6 V 与升 6 V：各得 6 eV',
  },
];

// ---------- click a scene: what it breaks into ----------
const pairFacts = s => { const a = M.pair(s.pair.t, 1), b = M.pair(s.pair.t, -1);
  return [['间距 r', `${f(a.r * 100, 1)} cm`], ['同种：+2 nC 受的 F', `${f(a.F * 1e6)} μN，背离`], ['同种：U', `${uJ(a.U)} μJ`], ['同种：至此做的功', `${uJ(a.W)} μJ`], ['异种：U', `${uJ(b.U)} μJ`], ['异种：至此做的功', `${uJ(b.W)} μJ`]]; };
export const PLATES = {
  pair: { text: `虚影以 5 cm 为一步标出路径，每一步都画出该处的电场力。力按 1/<i>r</i>² 增大，所以每一步都比上一步费力；总和 −∫<i>F</i> d<i>r</i> 就是 <i>U</i> 的变化量。对同种电荷，你要顶着力推（做正功）；对异种电荷，是电场力在拉，你在往回拽（做负功）。`, facts: pairFacts },
  square: { text: `六条连线就是六对电荷。每对储存 <i>kq</i>²/<i>r</i>：四条边 <i>r</i> = <i>a</i>，两条对角线 <i>r</i> = √2<i>a</i>。它们的和就是这组电荷的能量。`,
    facts: s => { const st = M.square(s.square.t); return [['已就位的电荷', `${st.n} / 4`], ['此刻的 U', `${uJ(st.U)} μJ`], ['每条边 kq²/a', `${uJ(M.K * M.SQ.q ** 2 / M.SQ.a)} μJ`], ['每条对角线 kq²/√2a', `${uJ(M.K * M.SQ.q ** 2 / (Math.SQRT2 * M.SQ.a))} μJ`], ['全部六对', `${uJ(M.SQ.U)} μJ`]]; } },
  uniform: { text: `把 A → C 切成四步 d<b><i>s</i></b>（黑色）。只有沿 <b><i>E</i></b> 的灰色部分 d<i>x</i> 起作用：<b><i>E</i></b> · d<b><i>s</i></b> = <i>E</i> d<i>x</i>。每步 5 cm，四步各使电势降低 2.5 V。每一步的横向部分沿着等势面走，贡献为零，所以路径无关紧要。`,
    facts: s => { const r = M.uniPath(s.uniform.t); return [['每一步：−E dx', `−${M.UNI.E} × 0.05 = −2.5 V`], ['A → C，四步', '−10.00 V'], ['电荷位于', `x = ${f(r.p[0] * 100, 1)} cm`], ['该处的 V', `${f(r.V)} V`], ['U = qV（q = +1 nC）', `${f(r.U * 1e9)} nJ`]]; } },
  hill: { text: `曲面从底图上抬起。每一圈等高线落到它对应的等势圆上：等势线就是绕山一周的水平路线。蓝色的 <b><i>E</i></b> 箭头与圆圈垂直相交，指向下坡，在圆圈密集处最长。`,
    facts: s => { const r = M.hillProbe(s.clock); return [['探测点 r', `${f(r * 100, 1)} cm`], ['V = kq/r', `${f(M.Vpoint(M.HILL.Q, r), 1)} V`], ['E = kq/r²', `${f(M.Epoint(M.HILL.Q, r), 0)} N/C`], ['坡度 −dV/dr', `${f(M.Epoint(M.HILL.Q, r), 0)} V/m`]]; } },
  dipole: { text: `在每一点，红杆是 +1 nC 的 <i>kq</i>/<i>r</i>，蓝杆是 −1 nC 的，黑杆是两者之和。在轴线上，较近的 −q 占优。在中垂线上的 P′ 点，两者恰好抵消：<i>V</i> = 0，黑杆消失。`,
    facts: () => { const a = M.DIP.axisX, z = M.DIP.bisZ, v1 = M.Vpoint(M.DIP.q, a + M.DIP.a), v2 = M.Vpoint(-M.DIP.q, a - M.DIP.a), w = M.Vpoint(M.DIP.q, Math.hypot(M.DIP.a, z));
      return [['P：来自 +q', `${f(v1, 1)} V`], ['P：来自 −q', `${f(v2, 1)} V`], ['P：合计', `${f(v1 + v2, 1)} V`], ['P′：±q 各自', `±${f(w, 1)} V`], ['P′：合计', '0 V']]; } },
  rod: { text: `把细棒看作 ${12} 段，每段 d<i>q</i> = λΔ<i>x</i> = 0.25 nC，都是点电荷。每段向 P 和 P′ 贡献 <i>k</i> d<i>q</i>/<i>r</i>；那些连线就是距离 <i>r</i>。仅 12 段就已经很接近积分值了。`,
    facts: s => { const a = M.rodProbe(s.clock); return [['P：距离 a', `${f(a * 100, 1)} cm`], ['P：kλ ln((a+L)/a)', `${f(M.VrodAxis(a), 1)} V`], ['P：12 段之和', `${f(M.rodSum(12, [-a, 0, 0]), 1)} V`], ['P′：解析式', `${f(rodB, 1)} V`], ['P′：12 段之和', `${f(M.rodSum(12, [M.ROD.L / 2, 0, -M.ROD.bisA]), 1)} V`]]; } },
  ring: { text: `十六块，每块 0.125 nC，每一块到 P 的距离都是 √(<i>R</i>² + <i>z</i>²)，所以总和就是 <i>kQ</i> 除以这个距离。`,
    facts: s => { const z = M.axisProbe(s.clock); return [['P 位于 z', `${f(z * 100, 1)} cm`], ['每块到 P 的距离', `${f(Math.hypot(M.RING.R, z) * 100, 1)} cm`], ['kQ/√(R² + z²)', `${f(M.Vring(z), 1)} V`], ['16 块之和', `${f(M.ringSum(16, z), 1)} V`]]; } },
  arc: { text: `一个半圆环，八块，每块 0.25 nC，到圆心 C 的距离都是 ${M.ARC.R * 100} cm。圆弧张开多大无关紧要，只与总电荷有关：<i>V</i><sub>c</sub> = <i>kQ</i>/<i>R</i>。（它在 C 处的电场与形状有关，电势却无关。）`,
    facts: () => [['每块', `k(0.25 nC)/0.15 m = ${f(M.Varc0 / 8, 2)} V`], ['八块', `${f(M.arcSum(8), 1)} V`], ['kQ/R', `${f(M.Varc0, 1)} V`]] },
  disc: { text: `五个圆环，滑开摆放。每个都是带电 d<i>q</i> = σ · 2π<i>r</i> d<i>r</i> 的圆环，到 P 的距离为 √(<i>r</i>² + <i>z</i>²)；外圈的环电荷更多，但离得更远。把它们加起来，就是对 <i>r</i> 的积分。`,
    facts: s => { const z = M.axisProbe(s.clock); return [['P 位于 z', `${f(z * 100, 1)} cm`], ['σ', `${f(M.DISC.sigma * 1e9, 1)} nC/m²`], ['2πkσ(√(R² + z²) − z)', `${f(M.Vdisc(z), 1)} V`], ['5 个环之和', `${f(M.discSum(5, z), 1)} V`]]; } },
  conductor: { text: `分两段走进来。从 ∞ 到 <i>R</i>，电场为 <i>kQ</i>/<i>r</i>²（蓝色），<i>V</i> 升到 <i>kQ</i>/<i>R</i>。在内部 <i>E</i> = 0：没有箭头，没有可加的，所以 <i>V</i> 保持不变。整个导体是一个等势体。`,
    facts: s => { const r = M.sphProbe(s.spheres.t); return [['探测点 r', `${f(r * 100, 1)} cm`], ['该处的 E', `${f(M.Econd(r), 0)} N/C`], ['该处的 V', `${f(M.Vcond(r), 1)} V`], ['∞ → R 增加', `${f(M.Vcond(M.SPH.R), 1)} V`], ['R → 0 增加', '0 V']]; } },
  insulator: { text: `同样的路线。在外部，电场同样是 <i>kQ</i>/<i>r</i>²。在内部，电场按 <i>kQr</i>/<i>R</i>³ 向中心减小（只有 <i>r</i> 以内的电荷起作用），但不为零，所以 <i>V</i> 继续升高，到球心又多出 <i>kQ</i>/2<i>R</i>。`,
    facts: s => { const r = M.sphProbe(s.spheres.t); return [['探测点 r', `${f(r * 100, 1)} cm`], ['该处的 E', `${f(M.Eins(r), 0)} N/C`], ['该处的 V', `${f(M.Vins(r), 1)} V`], ['∞ → R 增加', `${f(M.Vins(M.SPH.R), 1)} V`], ['R → 0 增加', `${f(M.Vins(0) - M.Vins(M.SPH.R), 1)} V`]]; } },
  accel: { text: `两者受到大小相同的力 <i>eE</i>，方向相反：正电荷被推着顺 <b><i>E</i></b> 运动，负电荷逆 <b><i>E</i></b> 运动。频闪像之间时间间隔相等，随着速度增大而越拉越开。相同的力作用相同的距离：做功相同，各 6 eV。`,
    facts: s => { const u = s.accel.t / M.ACC.run, p = M.accel(u, 'p'), e = M.accel(u, 'e');
      return [['各自受力 eE', `${(M.E_CH * M.ACC.E).toExponential(2)} N`], ['质子：V、K', `${f(p.V)} V，${f(M.eV(p.K))} eV`], ['质子：v', `${f(p.v / 1000, 1)} km/s`], ['电子：V、K', `${f(e.V)} V，${f(M.eV(e.K))} eV`], ['电子：v', `${f(e.v / 1e6, 3)} × 10⁶ m/s`]]; } },
};
