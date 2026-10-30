// Chapter 5, page by page (after the AP Physics 1 organizer, Unit 6). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, P_SCALE, F_WALL, F_EGG, EGG_ZOOM, CRASH_SCALE, W_SCALE, W_PLATE } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const k = (x, n = 0) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const cm = s => `${(s * 100).toFixed(0)} cm`;

// ---------- small SVG charts for the left page ----------
const W = 420, H = 140, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursors = [], label }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1);
  const d = pts => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('');
  const paths = series.map(s => (s.fill ? `<path class="area" d="${d(s.pts)}L${sx(s.pts.at(-1)[0]).toFixed(1)},${sy(0).toFixed(1)}L${sx(s.pts[0][0]).toFixed(1)},${sy(0).toFixed(1)}Z"/>` : '') +
    `<path class="${s.cls || 'curve'}" d="${d(s.pts)}"/>` + (s.tag ? `<text class="lab${s.cls === 'total' ? ' blue' : ''}" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}"${s.tag[3] ? ' text-anchor="end"' : ''}>${s.tag[2]}</text>` : '')).join('');
  const zero = y0 < 0 && y1 > 0 ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  const mk = marks.map(([x, y, t]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + 6}" y="${sy(y) + 14}">${t}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${zero}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(c => `<circle class="cursor" r="4.5" data-cursor="${c}"/>`).join('')}
  </svg>`;
}
const samples = (a, b, n, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });

// collision pages: momentum of each cart and the total, against time
export const COLL_T = { y0: -3, y1: 7 };
const momChart = (c, key, tags) => chart({
  x0: 0, x1: c.run, ...COLL_T, xlabel: '时间 (s)', ylabel: '动量 (kg·m/s)', cursors: [key], label: '每辆小车的动量及总动量随时间的变化',
  series: [
    { pts: [[0, c.m1 * c.u1], [c.tc, c.m1 * c.u1], [c.tc, c.m1 * c.v1], [c.run, c.m1 * c.v1]], tag: [tags[0][0], tags[0][1], 'p₁'] },
    { pts: [[0, c.m2 * c.u2], [c.tc, c.m2 * c.u2], [c.tc, c.m2 * c.v2], [c.run, c.m2 * c.v2]], tag: [tags[1][0], tags[1][1], 'p₂'] },
    { cls: 'total', pts: [[0, c.m1 * c.u1 + c.m2 * c.u2], [c.run, c.m1 * c.u1 + c.m2 * c.u2]], tag: [c.run - 0.03, c.m1 * c.u1 + c.m2 * c.u2, 'P，总动量', 1] },
  ] });
const collTable = c => { const K0 = M.ke(c.m1, c.u1) + M.ke(c.m2, c.u2), K1 = M.ke(c.m1, c.v1) + M.ke(c.m2, c.v2); return `
  <table class="data">
    <tr><th>kg·m/s, J</th><th><i>p</i>₁</th><th><i>p</i>₂</th><th>总动量 <i>P</i></th><th><i>KE</i></th></tr>
    <tr><td>碰前</td><td>${f(c.m1 * c.u1, 1)}</td><td>${f(c.m2 * c.u2, 1)}</td><td>${f(c.m1 * c.u1 + c.m2 * c.u2, 1)}</td><td>${f(K0)}</td></tr>
    <tr><td>碰后</td><td>${f(c.m1 * c.v1, 1)}</td><td>${f(c.m2 * c.v2, 1)}</td><td>${f(c.m1 * c.v1 + c.m2 * c.v2, 1)}</td><td>${f(K1)}</td></tr>
  </table>`; };

const Wl = M.WALL, Eg = M.EGG, S = M.STICK, B = M.BOUNCE, X = M.BURST, Pd = M.PEND, C = M.CRASH, Sh = M.SHELL;
const deg = r => (r * 180 / Math.PI).toFixed(1);
// a real bullet: 10 g into 2.0 kg, swinging to the same angle
export const BULLET = ((0.01 + 2.0) / 0.01) * Math.sqrt(2 * M.G * Pd.L * (1 - Math.cos(Pd.theta)));

// tip-to-tail sketch of the crash momenta, to scale
const vecSketch = (() => {
  const s = 0.0016, ox = 190, oy = 128, ax = ox + C.px * s, ay = oy - C.py * s;
  const head = (x1, y1, x2, y2, cls) => { const a = Math.atan2(y2 - y1, x2 - x1), L = 9; return `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2 - 6 * Math.cos(a)}" y2="${y2 - 6 * Math.sin(a)}"/><path class="${cls}h" d="M${x2},${y2}L${x2 - L * Math.cos(a - 0.4)},${y2 - L * Math.sin(a - 0.4)}L${x2 - L * Math.cos(a + 0.4)},${y2 - L * Math.sin(a + 0.4)}Z"/>`; };
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="动量矢量首尾相接相加">
    ${head(ox, oy, ax, oy, 'vk')}${head(ax, oy, ax, ay, 'vk')}${head(ox, oy, ax, ay, 'vb')}
    <text class="lab" x="${ox - 4}" y="${oy + 6}" text-anchor="end">p_轿 ${k(C.px)}</text>
    <text class="lab" x="${ax + 8}" y="${(oy + ay) / 2}">p_卡 ${k(C.py)}</text>
    <text class="lab blue" x="${(ox + ax) / 2 - 8}" y="${(oy + ay) / 2 - 6}" text-anchor="end">P ${k(C.P)}</text>
    <text class="ax" x="${W - 14}" y="20" text-anchor="end">kg·m/s · 东 → 北 ↑</text>
  </svg>`;
})();

const shellChart = chart({
  x0: 0, x1: 14, y0: 0, y1: 5, xlabel: 'x (m)', ylabel: '高度 (m)', cursors: ['shell'], label: '炮弹、两块碎片及质心的运动轨迹',
  series: [
    { cls: 'trend', pts: samples(0, Sh.run, 40, t => 0).map(([t]) => M.shell(t).cm), tag: [Sh.R * 0.62, Sh.H * 0.55, '质心'] },
    { pts: samples(0, Sh.ta, 20, t => 0).map(([t]) => M.shell(t).cm) },
    { pts: samples(Sh.ta, Sh.run, 20, t => 0).map(([t]) => M.shell(t).a), tag: [Sh.R / 2 - 0.15, 0.9, '后半块', 1] },
    { pts: samples(Sh.ta, Sh.run, 20, t => 0).map(([t]) => M.shell(t).b), tag: [10.3, 3.0, '前半块'] },
  ],
  marks: [[Sh.R / 2, 0, 'R/2'], [Sh.R, 0, 'R'], [1.5 * Sh.R, 0, '3R/2']],
});


// continuous bodies: λ(x) with the moment x·λ(x) shaded; strip sums converging
const Rd = M.ROD, Tr = M.TRI, Se = M.SEMI, Ll = M.ELL, Ho = M.HOLE;
const rodChart = chart({
  x0: 0, x1: Rd.L, y0: 0, y1: 3, xlabel: '沿杆的坐标 x (m)', ylabel: 'λ (kg/m) 与 x·λ (kg)', cursors: ['rodL', 'rodM'], label: '沿杆的线密度及其矩，图中标出平衡点',
  series: [
    { fill: true, pts: samples(0, Rd.L, 40, x => x * M.lam('N', x)), tag: [0.95, 1.25, 'x·λ：面积 = ∫x dm', 1] },
    { pts: samples(0, Rd.L, 2, x => M.lam('N', x)), tag: [1.97, 1.02, 'λ：面积 = M', 1] },
    { cls: 'trend', pts: [[Rd.xN, 0], [Rd.xN, 3]] },
  ],
  marks: [[Rd.xN, 2.92, 'x_cm = 2L/3']] });
const NS = Array.from({ length: 12 }, (_, i) => i + 1);
const stripChart = chart({
  x0: 1, x1: 12, y0: 0.95, y1: 1.55, xlabel: '窄条数 n', ylabel: '分条求和 ÷ 精确值', label: '随 n 增大，分条求和得到的质心估计值趋近积分结果',
  series: [
    { pts: NS.map(n => [n, M.stripSum(M.triW, Tr.h, n) / Tr.ucm]), tag: [11.8, 1.44, '上：三角形', 1] },
    { pts: NS.map(n => [n, M.stripSum(M.semiW, Se.R, n) / Se.ucm]), tag: [11.8, 1.36, '下：半圆', 1] },
    { cls: 'trend', pts: [[1, 1], [12, 1]], tag: [11.8, 1.0, '积分值', 1] },
  ],
  });
const xy = c => `(${f(c[0])}, ${f(c[1])})`;

export const PAGES = [
  {
    kicker: '第 5 章', title: '动量', sub: '物体有多难停下来',
    body: `
      <p class="lede"><b>动量</b>衡量运动物体有多难停下来：它等于质量乘以速度，是矢量，单位 kg·m/s。</p>
      <div class="eq"><i>p</i> = <i>mv</i></div>
      <p>轻而快的球和重而慢的小车，可以具有相同的动量：</p>
      <table class="data">
        <tr><th></th><th>质量</th><th>速度</th><th>动量</th><th>KE</th></tr>
        <tr><td>球</td><td>${f(M.BALL.m, 1)} kg</td><td>${f(M.BALL.v, 1)} m/s</td><td>${f(M.p(M.BALL.m, M.BALL.v), 1)} kg·m/s</td><td>${f(M.ke(M.BALL.m, M.BALL.v), 1)} J</td></tr>
        <tr><td>小车</td><td>${f(M.CART.m, 1)} kg</td><td>${f(M.CART.v, 1)} m/s</td><td>${f(M.p(M.CART.m, M.CART.v), 1)} kg·m/s</td><td>${f(M.ke(M.CART.m, M.CART.v), 1)} J</td></tr>
      </table>
      <p>但动能并不相同：<i>K</i> = <i>p</i>²/2<i>m</i>，较轻的那个动能更大。动量的变化量为 Δ<i>p</i> = <i>m</i>Δ<i>v</i>。</p>
      <div class="charts">${chart({ x0: 0, x1: 5, y0: 0, y1: 4, xlabel: '速度 (m/s)', ylabel: '动量 (kg·m/s)', label: '0.5 kg 与 2 kg 物体的动量随速度的变化',
        series: [{ pts: [[0, 0], [2, 4]], tag: [1.75, 3.0, '2.0 kg', 1] }, { pts: [[0, 0], [5, 2.5]], tag: [4.1, 2.05, '0.5 kg'] }, { cls: 'trend', pts: [[0, 2], [5, 2]] }],
        marks: [[M.CART.v, 2, '小车'], [M.BALL.v, 2, '球']] })}</div>
      <p class="hintline">动量箭头：每 kg·m/s 对应 ${cm(P_SCALE)}。点击显示速度。</p>`,
    cam: { target: [STATIONS.mom + 0.3, 0.4, 0], az: -14, el: 16, dist: 16 }, lit: 'mom', scene: 'mom', look: {},
    fig: 'p 相同，m 和 v 不同',
  },
  {
    kicker: '5.1', title: '冲量', sub: '力在一段时间内的累积',
    body: `
      <p class="lede">对物体推一段时间，它的动量就会改变。推力乘以作用时间就是<b>冲量</b>。</p>
      <div class="eq"><i>J</i> = <i>F</i>Δ<i>t</i> = Δ<i>p</i></div>
      <p>${f(Wl.m, 1)} kg 的球以 +${f(Wl.v, 1)} m/s 撞来，以 −${f(Wl.v, 1)} m/s 弹回：Δ<i>p</i> = −${f(Wl.J, 1)} kg·m/s，是它动量的两倍，因为它既要停下来，<i>又</i>要反弹回去。</p>
      <p>墙的推力在 ${f(Wl.tau, 2)} s 内先增大后减小，峰值为 ${f(Wl.Fpk, 0)} N。<b>力–时间图线下的面积</b>就是冲量 ${f(Wl.J, 1)} N·s，相当于恒定的 ${f(Wl.Favg, 0)} N 作用 ${f(Wl.tau, 2)} s。冲量的方向与力相同，背离墙面。</p>
      <div class="charts">${chart({ x0: 0.15, x1: 0.35, y0: 0, y1: 50, xlabel: '时间 (s)', ylabel: '墙的推力 (N)', cursors: ['wall'], label: '球所受的力随时间的变化，阴影面积即冲量',
        series: [{ fill: true, pts: samples(0.15, 0.35, 80, t => -M.wall(t).F), tag: [0.287, 30, `面积 = ${f(Wl.J, 1)} N·s`] }] })}</div>
      <p>AP 物理 C：对于变力，冲量是积分 <i>J</i> = ∫<i>F</i> d<i>t</i>。对这个脉冲：</p>
      <div class="eq">∫<sub>0</sub><sup>τ</sup> <i>F</i><sub>pk</sub> sin(π<i>t</i>/τ) d<i>t</i> = 2<i>F</i><sub>pk</sub>τ/π = ${f(Wl.J, 1)} N·s</div>
      <p class="hintline">${M.SLOW_HIT}× 速度播放。力：每牛顿对应 ${cm(F_WALL)}。点击查看 Δp。</p>`,
    cam: { target: [STATIONS.wall - 0.55, 0.6, 0], az: -14, el: 12, dist: 7.2 }, lit: 'wall', scene: 'wall', look: {},
    fig: '墙的推力使球反向',
  },
  {
    kicker: '5.2', title: '减小冲力', sub: 'Δp 相同，时间更长',
    body: `
      <p class="lede">两只鸡蛋从 ${f(Eg.h * 100, 0)} cm 高处落下，落地速度为 ${f(Eg.v0, 1)} m/s。每只都要失去 ${f(Eg.J, 2)} kg·m/s 的动量，所以需要相同的冲量。</p>
      <p>枕头会凹陷，用时 ${f(Eg.tauSoft, 2)} s；地板用时 ${f(Eg.tauHard, 2)} s。<i>F</i>Δ<i>t</i> 一定，时间缩短为六分之一，力就变为六倍：</p>
      <table class="data">
        <tr><th></th><th>停止时间</th><th>平均合力</th><th>峰值</th></tr>
        <tr><td>枕头</td><td>${f(Eg.tauSoft, 2)} s</td><td>${f(Eg.J / Eg.tauSoft)} N</td><td>${f(Math.PI * Eg.J / (2 * Eg.tauSoft))} N</td></tr>
        <tr><td>地板</td><td>${f(Eg.tauHard, 2)} s</td><td>${f(Eg.J / Eg.tauHard)} N</td><td>${f(Math.PI * Eg.J / (2 * Eg.tauHard))} N</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: 0.2, y0: 0, y1: 8, xlabel: '落地后的时间 (s)', ylabel: '合力 (N)', cursors: ['eggS', 'eggH'], label: '面积相同的两个力脉冲',
        series: [{ fill: true, pts: samples(0, Eg.tauSoft, 60, t => M.pulse(t, Eg.J, Eg.tauSoft, Eg.m).F).concat([[0.2, 0]]), tag: [0.075, 1.4, '枕头'] },
                 { fill: true, pts: samples(0, Eg.tauHard, 30, t => M.pulse(t, Eg.J, Eg.tauHard, Eg.m).F).concat([[0.2, 0]]), tag: [0.034, 5.2, '地板：面积相同'] }] })}</div>
      <p>安全气囊、汽车的溃缩区和落地时屈膝都不能改变 Δ<i>p</i>，它们延长的是 Δ<i>t</i>。</p>
      <p class="hintline">按实物 ${EGG_ZOOM}× 大小、${M.SLOW_HIT}× 速度绘制。红色：合力，每牛顿对应 ${cm(F_EGG * EGG_ZOOM)}。点击对比。</p>`,
    cam: { target: [STATIONS.eggs, 1.05, 0], az: -10, el: 10, dist: 10.5 }, lit: 'eggs', scene: 'eggs', look: {},
    fig: 'Δp 相同，时间被拉长',
  },
  {
    kicker: '5.3', title: '动量守恒', sub: '碰后粘在一起的小车',
    body: `
      <p class="lede">把两辆小车看作一个<b>孤立系统</b>，它所受的外力之和为零，总动量就不会改变。</p>
      <p>两车相互施加大小相等、方向相反的冲量：一辆车失去多少动量，另一辆就得到多少。</p>
      <div class="eq"><i>m</i>₁<i>v</i>₁ + <i>m</i>₂<i>v</i>₂ = (<i>m</i>₁ + <i>m</i>₂)<i>v</i>′</div>
      <p>${f(S.m1, 1)} kg、速度 ${f(S.u1, 1)} m/s 的小车与 ${f(S.m2, 1)} kg、速度 ${f(S.u2, 1)} m/s 的小车相碰，粘在一起后速度为 <i>v</i>′ = ${f(S.m1 * S.u1 + S.m2 * S.u2, 1)}/${f(S.m1 + S.m2, 1)} = ${f(S.v1, 1)} m/s。这是<b>完全非弹性碰撞</b>：损失的动能变成了热、声音和凹痕。</p>
      ${collTable(S)}
      <div class="charts">${momChart(S, 'stick', [[0.05, 6.1], [0.05, -1.5]])}</div>
      <p class="hintline">蓝色：总动量 <i>P</i>。圆片：质心。点击对比。</p>`,
    cam: { target: [STATIONS.stick - 0.4, 0.6, 0], az: -12, el: 14, dist: 17 }, lit: 'stick', scene: 'stick', look: {},
    fig: 'Δp = 0，ΔKE < 0',
  },
  {
    kicker: '5.4', title: '弹性碰撞', sub: '相互弹开的小车',
    body: `
      <p class="lede">如果两车相互弹开且没有能量损失，这样的碰撞就是<b>弹性碰撞</b>：动量<i>和</i>动能都守恒。</p>
      <p>${f(B.m1, 1)} kg、速度 ${f(B.u1, 1)} m/s 的小车撞上静止的 ${f(B.m2, 1)} kg 小车。两个未知量，两个方程：</p>
      <table class="data eqs">
        <tr><td><i>m</i>₁<i>v</i>₁ + <i>m</i>₂<i>v</i>₂ = <i>m</i>₁<i>v</i>₁′ + <i>m</i>₂<i>v</i>₂′</td><td>Δ<i>p</i> = 0</td></tr>
        <tr><td>½<i>m</i>₁<i>v</i>₁² + ½<i>m</i>₂<i>v</i>₂² = ½<i>m</i>₁<i>v</i>₁′² + ½<i>m</i>₂<i>v</i>₂′²</td><td>Δ<i>KE</i> = 0</td></tr>
      </table>
      <p>解得 <i>v</i>₁′ = ${f(B.v1, 1)} m/s，<i>v</i>₂′ = ${f(B.v2, 1)} m/s。两车受到大小相等、方向相反的 ${f(B.m2 * B.v2, 1)} N·s 冲量：质量小的那辆 Δ<i>v</i> 更大。</p>
      ${collTable(B)}
      <div class="charts">${momChart(B, 'bounce', [[0.05, 4.1], [0.05, -1.0]])}</div>`,
    cam: { target: [STATIONS.bounce - 0.5, 0.6, 0], az: -12, el: 14, dist: 17 }, lit: 'bounce', scene: 'bounce', look: {},
    fig: 'Δp = 0，ΔKE = 0',
  },
  {
    kicker: '5.5', title: '爆炸', sub: '从静止被推开',
    body: `
      <p class="lede">两辆小车并在一起静止，释放它们之间的弹簧。总动量原来为零，之后仍为零。</p>
      <div class="eq">(<i>m</i>₁ + <i>m</i>₂)<i>v</i> = <i>m</i>₁<i>v</i>₁′ + <i>m</i>₂<i>v</i>₂′</div>
      <p><i>v</i> = 0 时，两车动量大小相等、方向相反，所以 ${f(X.m1, 1)} kg 小车的速率是 ${f(X.m2, 1)} kg 小车的三倍。弹簧的 ${f(X.Q, 1)} J 能量转化为动能：动能<i>增加</i>。</p>
      ${collTable(X)}
      <table class="data">
        <tr><th>类型</th><th>Δ<i>p</i></th><th>Δ<i>KE</i></th><th>判断依据</th></tr>
        <tr><td>非弹性碰撞</td><td>0</td><td>&lt; 0</td><td>动能减少；粘在一起时损失最多</td></tr>
        <tr><td>弹性碰撞</td><td>0</td><td>0</td><td>相互弹开，没有损失</td></tr>
        <tr><td>爆炸</td><td>0</td><td>&gt; 0</td><td>起初在一起，然后分开飞出</td></tr>
      </table>
      <p class="hintline">质心保持不动。点击查看前后对比。</p>`,
    cam: { target: [STATIONS.burst - 0.8, 0.6, 0], az: -12, el: 14, dist: 17 }, lit: 'burst', scene: 'burst', look: {},
    fig: 'Δp = 0，ΔKE > 0',
  },
  {
    kicker: '5.6', title: '冲击摆', sub: '先用动量，再用能量',
    body: `
      <p class="lede">一块 ${f(Pd.m, 1)} kg、速度 ${f(Pd.u, 0)} m/s 的黏土嵌入用 ${f(Pd.L, 1)} m 长细绳悬挂的 ${f(Pd.M, 1)} kg 木块，木块随之摆起。两个过程，两条定律：</p>
      <table class="data">
        <tr><th>过程</th><th>规律</th><th>本例</th></tr>
        <tr><td>碰撞</td><td>Δ<i>p</i> = 0：<i>mv</i> = (<i>m</i>+<i>M</i>)<i>v</i>′</td><td><i>v</i>′ = ${f(Pd.v)} m/s</td></tr>
        <tr><td>摆起</td><td>Δ<i>E</i> = 0：½<i>v</i>′² = <i>g</i>Δ<i>y</i></td><td>Δ<i>y</i> = ${f(Pd.dy * 100, 1)} cm</td></tr>
      </table>
      <p>碰撞过程中能量不守恒（${f(M.ke(Pd.m, Pd.u), 1)} J → ${f(M.ke(Pd.m + Pd.M, Pd.v))} J），摆起过程中动量不守恒（绳的拉力和重力都是外力）。由 Δ<i>y</i> = <i>L</i>(1 − cos θ)，θ = ${deg(Pd.theta)}°：</p>
      <div class="eq"><i>v</i> = ((<i>m</i> + <i>M</i>)/<i>m</i>) √(2<i>gL</i>(1 − cos θ))</div>
      <div class="charts">${chart({ x0: 0, x1: 2.4, y0: 0, y1: 2, xlabel: '碰后的时间 (s)', ylabel: '能量 (J)', cursors: ['pendK', 'pendU'], label: '摆动过程中的动能与势能',
        series: [{ pts: samples(0, Pd.T, 60, t => M.pend(Pd.lead + t).K), tag: [0.1, 1.15, 'KE'] }, { pts: samples(0, Pd.T, 60, t => M.pend(Pd.lead + t).U), tag: [Pd.T / 4 - 0.12, 1.15, 'Ug'] }, { cls: 'trend', pts: [[0, M.ke(Pd.m + Pd.M, Pd.v)], [2.4, M.ke(Pd.m + Pd.M, Pd.v)]], tag: [2.36, 1.72, '总能量', 1] }] })}</div>
      <p class="hintline">点击标出 Δy、L 和 θ，并查看求 v′ 的其他方法。</p>`,
    cam: { target: [STATIONS.pend + 0.2, 1.25, 0], az: -10, el: 8, dist: 7.4 }, lit: 'pend', scene: 'pend', look: {},
    fig: '碰撞 Δp = 0，摆起 ΔE = 0',
  },
  {
    kicker: '5.7', title: '二维碰撞', sub: '十字路口的撞车',
    body: `
      <p class="lede">一辆 ${k(C.m1)} kg、以 ${f(C.v1, 0)} m/s 向东行驶的轿车，与一辆 ${k(C.m2)} kg、以 ${f(C.v2, 0)} m/s 向北行驶的卡车相撞并卡在一起。动量在每个方向上分别守恒。</p>
      <table class="data">
        <tr><th>东（<i>x</i>）</th><th>北（<i>y</i>）</th></tr>
        <tr><td><i>m</i>₁<i>v</i>₁ = (<i>m</i>₁+<i>m</i>₂)<i>v</i>′<sub>x</sub></td><td><i>m</i>₂<i>v</i>₂ = (<i>m</i>₁+<i>m</i>₂)<i>v</i>′<sub>y</sub></td></tr>
        <tr><td>${k(C.px)} = ${k(C.m1 + C.m2)} <i>v</i>′<sub>x</sub></td><td>${k(C.py)} = ${k(C.m1 + C.m2)} <i>v</i>′<sub>y</sub></td></tr>
        <tr><td><i>v</i>′<sub>x</sub> = ${f(C.vx)} m/s</td><td><i>v</i>′<sub>y</sub> = ${f(C.vy)} m/s</td></tr>
      </table>
      <p>把动量首尾相接相加：<i>P</i> = √(<i>p</i><sub>x</sub>² + <i>p</i><sub>y</sub>²) = ${k(C.P)} kg·m/s，所以 <i>v</i>′ = <i>P</i>/(<i>m</i>₁+<i>m</i>₂) = ${f(C.v)} m/s，方向为东偏北 ${C.angle.toFixed(1)}°。千万不要把速率直接相加。</p>
      <div class="charts">${vecSketch}</div>
      <p class="hintline">此处箭头：每 1000 kg·m/s 对应 ${cm(CRASH_SCALE)}。点击把它们首尾相接。</p>`,
    cam: { target: [STATIONS.crash + 0.5, 0, -1.5], az: -10, el: 50, dist: 58 }, lit: 'crash', scene: 'crash', look: {},
    fig: 'p_轿 + p_卡 = P',
  },
  {
    kicker: '5.8', title: '质心', sub: '炸开后照样飞行',
    body: `
      <p class="lede"><b>质心</b>是系统各部分位置按质量加权的平均。内力改变不了它的运动：在前面几页小车的碰撞中，质心始终匀速直线穿过。</p>
      <div class="eq"><i>x</i><sub>cm</sub> = (<i>m</i>₁<i>x</i>₁ + <i>m</i>₂<i>x</i>₂) / (<i>m</i>₁ + <i>m</i>₂)</div>
      <p>一枚 ${f(Sh.m, 1)} kg 的炮弹以 ${f(Sh.v0, 0)} m/s、仰角 ${Sh.deg}° 射出，在最高点炸成质量相等的两半。后半块被留在原地静止，竖直落到 <i>R</i>/2 处；前半块带走全部动量，<i>v</i>₂′ = ((<i>m</i>₁+<i>m</i>₂)/<i>m</i>₂)<i>v</i><sub>x</sub> = ${f(Sh.v2, 1)} m/s，落在 3<i>R</i>/2 处。质心落在 <i>R</i> = ${f(Sh.R)} m 处，就像炮弹从未炸开。</p>
      <div class="charts">${shellChart}</div>
      <p>提示：两块碎片受到的冲量总是大小相等、方向相反，所以较轻的那块 Δ<i>v</i> 更大。</p>`,
    cam: { target: [STATIONS.shell + 0.2, 2.4, 0], az: -6, el: 8, dist: 44 }, lit: 'shell', scene: 'shell', look: {},
    fig: '质心落在 R 处',
  },
  {
    kicker: '5.9 · AP 物理 C', title: '连续物体', sub: '用积分求质心',
    body: `
      <p class="lede">把实心杆切成小段 d<i>m</i> = λ d<i>x</i>（λ：每米的质量），每段按所在位置加权，再积分。</p>
      <div class="eq"><i>x</i><sub>cm</sub> = (1/<i>M</i>) ∫ <i>x</i> d<i>m</i></div>
      <table class="data">
        <tr><th>${f(Rd.L, 1)} m 长的杆</th><th><i>M</i> = ∫λ d<i>x</i></th><th><i>x</i><sub>cm</sub></th></tr>
        <tr><td>λ = ${f(Rd.lamU, 1)} kg/m</td><td>λ<i>L</i> = ${f(Rd.MU, 1)} kg</td><td><i>L</i>/2 = ${f(Rd.xU)} m</td></tr>
        <tr><td>λ = λ₀<i>x</i>/<i>L</i>, λ₀ = ${f(Rd.lam0, 1)}</td><td>λ₀<i>L</i>/2 = ${f(Rd.MN, 1)} kg</td><td>2<i>L</i>/3 = ${f(Rd.xN)} m</td></tr>
      </table>
      <div class="eq">∫<i>x</i> d<i>m</i> = ∫<sub>0</sub><sup><i>L</i></sup> λ<sub>0</sub><i>x</i>²/<i>L</i> d<i>x</i> = λ<sub>0</sub><i>L</i>²/3</div>
      <p>除以 <i>M</i> = λ₀<i>L</i>/2 得 2<i>L</i>/3，越过了中点。每根杆都架在位于其 <i>x</i><sub>cm</sub> 处的刀口上，此处合力矩 ∫(<i>x</i> − <i>x</i><sub>cm</sub>)<i>g</i> d<i>m</i> = 0。</p>
      <div class="charts">${rodChart}</div>
      <p class="hintline">颜色越深，密度越大。点击把杆切开（每牛顿对应 ${cm(W_SCALE)}）。</p>`,
    cam: { target: [STATIONS.rods + 0.1, 0.4, 0], az: -14, el: 22, dist: 9.4 }, lit: 'rods', scene: 'rods', look: {},
    fig: '在 x_cm 处平衡',
  },
  {
    kicker: '5.10 · AP 物理 C', title: '薄板', sub: '一条一条地加',
    body: `
      <p class="lede">把薄板（σ = ${f(M.SIGMA, 1)} kg/m²）切成平行于某条边的窄条。距该边 <i>u</i>、宽 <i>w</i>(<i>u</i>) 的窄条，质量 d<i>m</i> = σ<i>w</i> d<i>u</i>。</p>
      <div class="eq"><i>u</i><sub>cm</sub> = (1/<i>M</i>) ∫ <i>u</i> σ<i>w</i>(<i>u</i>) d<i>u</i></div>
      <table class="data">
        <tr><th>薄板</th><th><i>w</i>(<i>u</i>)</th><th><i>u</i><sub>cm</sub></th></tr>
        <tr><td>三角形，<i>h</i> = ${f(Tr.h, 1)} m</td><td><i>b</i>(1 − <i>u</i>/<i>h</i>)</td><td><i>h</i>/3 = ${f(Tr.ucm)} m</td></tr>
        <tr><td>半圆，<i>R</i> = ${f(Se.R, 1)} m</td><td>2√(<i>R</i>² − <i>u</i>²)</td><td>4<i>R</i>/3π = ${f(Se.ucm)} m</td></tr>
      </table>
      <div class="eq">∫<sub>0</sub><sup><i>R</i></sup> 2<i>u</i>√(<i>R</i>² − <i>u</i>²) d<i>u</i> = 2<i>R</i>³/3</div>
      <p>再除以面积 π<i>R</i>²/2，得 4<i>R</i>/3π。三角形就是上一页的杆横过来：从顶点起，窄条的宽度像 λ₀<i>x</i>/<i>L</i> 那样增大。分条求和逐渐逼近积分值：</p>
      <div class="charts">${stripChart}</div>
      <p class="hintline">支针位于质心处。点击把窄条分开（每牛顿对应 ${cm(W_PLATE)}）。</p>`,
    cam: { target: [STATIONS.plates + 0.05, 0.3, 0], az: -10, el: 22, dist: 10.6 }, lit: 'plates', scene: 'plates', look: {},
    fig: 'u_cm = (1/M)∫u dm',
  },
  {
    kicker: '5.11 · AP 物理 C', title: '组合与挖孔', sub: '各部分相加，空缺相减',
    body: `
      <p class="lede">对于由简单部分组成的物体，把每部分的质量集中在它自己的质心上，再求和。孔可以看作质量为负的部分。</p>
      <div class="eq"><i>x</i><sub>cm</sub> = (<i>m</i><sub>A</sub><i>x</i><sub>A</sub> + <i>m</i><sub>B</sub><i>x</i><sub>B</sub>)/(<i>m</i><sub>A</sub> + <i>m</i><sub>B</sub>)</div>
      <table class="data">
        <tr><th>L 形板，以内角为原点</th><th>质量</th><th>(<i>x</i>, <i>y</i>)，m</th></tr>
        <tr><td>A 臂，${f(Ll.A.a1 - Ll.A.a0, 1)} × ${f(Ll.A.b1 - Ll.A.b0, 1)} m</td><td>${f(Ll.pA.m)} kg</td><td>${xy(Ll.pA.c)}</td></tr>
        <tr><td>B 臂，${f(Ll.B.a1 - Ll.B.a0, 1)} × ${f(Ll.B.b1 - Ll.B.b0, 1)} m</td><td>${f(Ll.pB.m)} kg</td><td>${xy(Ll.pB.c)}</td></tr>
        <tr><td>整个 L 形板</td><td>${f(Ll.M)} kg</td><td>${xy(Ll.cm)}</td></tr>
      </table>
      <p>这个点落在空缺处，不在 L 形板上。和圆环、回旋镖一样，它无法用一根支针顶住平衡；但用细绳吊起时，它会转动，直到质心位于绳结正下方。</p>
      <div class="eq"><i>x</i><sub>cm</sub> = (<i>m</i><sub>整</sub><i>x</i><sub>整</sub> − <i>m</i><sub>孔</sub><i>x</i><sub>孔</sub>)/<i>M</i></div>
      <p>边长 ${f(Ho.s, 1)} m 的正方形板（${f(Ho.mFull)} kg）在 ${xy(Ho.c)} 处挖去半径 ${f(Ho.r, 1)} m 的圆片（${f(Ho.mPlug)} kg）：<i>x</i><sub>cm</sub> = <i>y</i><sub>cm</sub> = −${f(Ho.mPlug)}×${f(Ho.c[0])}/${f(Ho.M)} = ${f(Ho.cm[0], 3)} m，离中心 ${f(Math.hypot(...Ho.cm) * 100, 1)} cm，偏向远离孔的一侧。</p>
      <p class="hintline">点击拆开 L 形板，并取出圆片。</p>`,
    cam: { target: [STATIONS.parts + 0.05, 1.22, 0], az: -12, el: 14, dist: 10.2 }, lit: 'parts', scene: 'parts', look: {},
    fig: '质心在物体之外',
  },
];

// ---------- click a scene: what it breaks into ----------
const collFacts = c => s => { const r = M.track(c, s[c === S ? 'stick' : c === B ? 'bounce' : 'burst'].t); return [
  ['p₁', `${f(r.p1)} kg·m/s`], ['p₂', `${f(r.p2)} kg·m/s`], ['总动量 P', `${f(r.P)} kg·m/s`], ['动能', `${f(r.K)} J`], ['质心速度', `${f(r.P / (c.m1 + c.m2))} m/s`]]; };
export const PLATES = {
  mom: { text: `灰色箭头是速度：球的速度箭头是小车的四倍长。黑色的动量箭头一样长，因为小车的质量是球的四倍。动量由质量和速度共同决定。`,
    facts: () => [['球：0.5 kg × 4.0 m/s', `${f(M.p(M.BALL.m, M.BALL.v))} kg·m/s`], ['小车：2.0 kg × 1.0 m/s', `${f(M.p(M.CART.m, M.CART.v))} kg·m/s`], ['球 KE = p²/2m', `${f(M.ke(M.BALL.m, M.BALL.v))} J`], ['小车 KE = p²/2m', `${f(M.ke(M.CART.m, M.CART.v))} J`]] },
  wall: { text: `碰前（向右）与碰后（向左）的动量。变化量 Δp = p<sub>后</sub> − p<sub>前</sub> 的长度是两者的两倍，方向背离墙面，与墙的推力同向。这个变化量就是冲量。`,
    facts: s => { const w = M.wall(s.wall.t); return [['碰前 p', `+${f(Wl.m * Wl.v)} kg·m/s`], ['碰后 p', `−${f(Wl.m * Wl.v)} kg·m/s`], ['Δp = J', `−${f(Wl.J)} N·s`], ['接触时间', `${f(Wl.tau)} s`], ['此刻的力', `${f(Math.abs(w.F), 1)} N`]]; } },
  eggs: { text: `灰色箭头是两个冲量：完全相同，因为两只鸡蛋失去的动量相同。不同的是这一过程用了多长时间，因而推力要多大。`,
    facts: () => [['每只的冲量', `${f(Eg.J, 3)} N·s`], ['枕头：J / Δt', `${f(Eg.J / Eg.tauSoft)} N，持续 ${f(Eg.tauSoft)} s`], ['地板：J / Δt', `${f(Eg.J / Eg.tauHard)} N，持续 ${f(Eg.tauHard)} s`], ['力之比', `${f(Eg.tauSoft / Eg.tauHard, 1)}×`]] },
  stick: { text: `上方是碰前和碰后的动量，首尾相接排列。每一行加起来都是同一个蓝色总动量。2 号车的动量甚至改变了符号，总动量却丝毫未变。`, facts: collFacts(S) },
  bounce: { text: `碰前：动量全在 1 号车上。碰后：1 号车的动量为负，2 号车的动量比总动量还大。首尾相接，两行加起来仍是同一个蓝色箭头。`, facts: collFacts(B) },
  burst: { text: `爆炸前：没有动量。爆炸后：两个大小相等、方向相反的箭头，加起来为零。总动量始终为零，所以质心一直不动。`, facts: collFacts(X) },
  pend: { text: `虚线标出摆动的最低点和最高点，相距 Δy。由三角形得 cos θ = (L − Δy)/L，所以 Δy = L(1 − cos θ)。碰后求 v′ 的其他方法：木块在粗糙地面上滑行至停止，v′ = √(2μ<sub>k</sub>gΔx)；木块压缩弹簧，v′ = √(kΔx²/(m+M))；木块从桌边飞出，v′ = Δx/√(2Δy/g)。`,
    facts: s => { const q = M.pend(s.pend.t); return [['碰后 v′', `${f(Pd.v)} m/s`], ['Δy = v′²/2g', `${f(Pd.dy * 100, 1)} cm`], ['最大 θ', `${deg(Pd.theta)}°`], ['此刻角度', `${deg(q.th)}°`], ['此刻 KE + Ug', `${f(q.K + q.U)} J`], ['10 g 子弹射入 2.0 kg 木块，θ 相同', `${f(BULLET, 0)} m/s`]]; } },
  crash: { text: `轿车的动量向东，卡车的动量向北。首尾相接，它们构成一个直角三角形；蓝色斜边就是总动量，残骸带着它沿东偏北 ${C.angle.toFixed(1)}° 方向滑出。`,
    facts: () => [['p 轿车（向东）', `${k(C.px)} kg·m/s`], ['p 卡车（向北）', `${k(C.py)} kg·m/s`], ['总动量 P', `${k(C.P)} kg·m/s`], ['v′ = P/(m₁+m₂)', `${f(C.v)} m/s`], ['方向', `东偏北 ${C.angle.toFixed(1)}°`], ['KE', `${k(C.K0 / 1000)} kJ → ${k(C.K1 / 1000)} kJ`]] },
  shell: { text: `重力是外力，它使每一块的轨迹都弯曲，所以竖直方向的动量不断变化。爆炸是内力作用：在那一瞬间，总动量（蓝色）前后相同，此时全部集中在前半块上。`,
    facts: s => { const q = M.shell(s.shell.t); return [['质心的 x', `${f(q.cm[0])} m`], ['爆炸前：m·vx', `${f(Sh.m * Sh.vx)} kg·m/s`], ['爆炸后：(m/2)·v₂′', `${f(Sh.m / 2 * Sh.v2)} kg·m/s`], ['落点', `${f(Sh.R / 2)} m 和 ${f(1.5 * Sh.R)} m`]]; } },

  rods: { text: `每一小段都画在它自己的质心处，并标出其重力 d<i>m</i>·<i>g</i>（每牛顿对应 ${cm(W_SCALE)}）。均匀杆的十段重力相等；另一根杆的重力随 <i>x</i> 增大，所以右侧较少但较重的几段，与左侧较多但较轻的几段相平衡。对刀口而言，两侧的力矩相等。`,
    facts: () => { const sl = M.rodSlices('N'), g = M.G, L = sl.filter(q => q.x < Rd.xN).reduce((a, q) => a + (Rd.xN - q.x) * q.dm * g, 0), Rr = sl.filter(q => q.x >= Rd.xN).reduce((a, q) => a + (q.x - Rd.xN) * q.dm * g, 0);
      return [['均匀杆：每段', `${f(M.rodSlices('U')[0].dm, 3)} kg`], ['λ₀x/L：第一段和最后一段', `${f(sl[0].dm, 3)} kg，${f(sl.at(-1).dm, 3)} kg`], ['x_cm，均匀 / λ₀x/L', `${f(Rd.xU)} m / ${f(Rd.xN)} m`], ['左侧各段的力矩', `${f(L, 3)} N·m`], ['右侧各段的力矩', `${f(Rr, 3)} N·m`]]; } },
  plates: { text: `每块板各分成八条，每条都画在它自己的质心处，并标出其重力（每牛顿对应 ${cm(W_PLATE)}）。靠近底边或直径的宽条最重，所以平衡点离这条边更近，离远端的顶点更远。`,
    facts: () => { const t = M.plateStrips(Tr), c = M.plateStrips(Se); return [['三角形：M = σbh/2', `${f(Tr.M)} kg`], ['三角形：最重 / 最轻的窄条', `${f(t[0].dm, 3)} / ${f(t.at(-1).dm, 3)} kg`], ['半圆：M = σπR²/2', `${f(Se.M)} kg`], ['半圆：最重 / 最轻的窄条', `${f(c[0].dm, 3)} / ${f(c.at(-1).dm, 3)} kg`], ['8 个矩形：三角形，半圆', `${f(M.stripSum(M.triW, Tr.h, 8), 3)}，${f(M.stripSum(M.semiW, Se.R, 8), 3)} m`], ['积分值：h/3，4R/3π', `${f(Tr.ucm, 3)}，${f(Se.ucm, 3)} m`]]; } },
  parts: { text: `拆开后，每条臂都是位于自身中心的质点（小圆片）。L 形板的质心在两者的连线上，靠近较重的那条臂，并且在两臂分开时保持不动。取出的圆片就是那部分负质量：正方形的中心、圆片的中心和带孔板的质心在同一直线上，平衡点在远离孔的一侧。`,
    facts: () => [['A 臂', `${f(Ll.pA.m)} kg，位于 ${xy(Ll.pA.c)} m`], ['B 臂', `${f(Ll.pB.m)} kg，位于 ${xy(Ll.pB.c)} m`], ['整个 L 形板', `${f(Ll.M)} kg，位于 ${xy(Ll.cm)} m`], ['完整正方形 − 圆片', `${f(Ho.mFull)} − ${f(Ho.mPlug)} = ${f(Ho.M)} kg`], ['带孔板的 x_cm，y_cm', `${f(Ho.cm[0], 3)}，${f(Ho.cm[1], 3)} m`]] },
};
