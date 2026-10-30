// Chapter 4, page by page (after the AP Physics 1 organizer, Unit 5). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, SC, BAR_COLORS } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const ST = STATIONS;
const INK = '#2c2c30', BLUE = '#4f7cbd', AMBER = '#bf9030', GREY = '#86868c';

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1, h = H) => P.t + (1 - (y - y0) / (y1 - y0)) * (h - P.t - P.b) };   // h: a chart may be shorter
function chart({ x0, x1, y0, y1, h: H = 170, series, xlabel, ylabel, marks = [], cursors = [], label, under = '', zero = false }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1, H);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}"${s.color ? ` style="stroke:${s.color}"` : ''} d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}"${s.color ? ` style="fill:${s.color}"` : ''}>${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    ${under}<rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>
    ${zero ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/><text class="ax" x="${P.l - 6}" y="${sy(0) + 4}" text-anchor="end">0</text>` : ''}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(([key, color]) => `<circle class="cursor" r="4.5" data-cursor="${key}"${color ? ` style="fill:${color}"` : ''}/>`).join('')}
  </svg>`;
}
const samples = (n, a, b, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });

// live energy bars on the left page (the pendulum): heights set in main.js
export const BARS = { x: 70, w: 64, gap: 46, base: 150, top: 20 };
const barChart = (key, items, Emax) => `<svg class="chart" viewBox="0 0 ${W} ${H + 10}" role="img" aria-label="实时能量条形图">
  <line class="zero" x1="${BARS.x - 20}" x2="${BARS.x + items.length * (BARS.w + BARS.gap)}" y1="${BARS.base}" y2="${BARS.base}"/>
  <line class="grid" x1="${BARS.x - 20}" x2="${BARS.x + items.length * (BARS.w + BARS.gap)}" y1="${BARS.top}" y2="${BARS.top}"/>
  <text class="ax" x="${BARS.x - 26}" y="${BARS.top + 4}" text-anchor="end">${f(Emax)} J</text><text class="ax" x="${BARS.x - 26}" y="${BARS.base + 4}" text-anchor="end">0</text>
  ${items.map(([k, name, color], i) => `<rect data-bar="${key}-${k}" x="${BARS.x + i * (BARS.w + BARS.gap)}" width="${BARS.w}" y="${BARS.base}" height="0" style="fill:${color};stroke:#6c6c72;stroke-width:.8"/>
    <text class="lab" x="${BARS.x + i * (BARS.w + BARS.gap) + BARS.w / 2}" y="${BARS.base + 18}" text-anchor="middle">${name}</text>
    <text class="ax" data-val="${key}-${k}" x="${BARS.x + i * (BARS.w + BARS.gap) + BARS.w / 2}" y="${BARS.base - 6}" text-anchor="middle"></text>`).join('')}
</svg>`;

// chart ranges, shared with the live cursors in main.js
export const R = {
  pull: { x0: 0, x1: 3.2, y0: 0, y1: 70 },
  toss: { x0: 0, x1: 1.25, y0: -10, y1: 10 },
  car: { x0: 0, x1: 8, y0: 0, y1: 25 },
  drop: { x0: 0, x1: 3, y0: 0, y1: 16 },
  spring: { x0: 0, x1: 0.5, y0: 0, y1: 25 },
  slide: { x0: 0, x1: 2.2, y0: 0, y1: 18 },
  lift: { x0: 0, x1: 4.2, y0: 0, y1: 250 },
  push: { x0: 0, x1: 4, y0: 0, y1: 20, h: 140 },
  beadU: { x0: 0, x1: 6, y0: 0, y1: 4, h: 125 },
  beadF: { x0: 0, x1: 6, y0: -2, y1: 2, h: 110 },
  bondU: { x0: 0.13, x1: 0.34, y0: -1.2, y1: 0.4, h: 135 },
};
const P0 = M.pull(M.PULL.run), XS = M.SPRING.xmax;

export const PAGES = [
  {
    kicker: '第 4 章', title: '功', sub: '力沿一段距离的作用',
    body: `
      <p class="lede"><b>功</b>是力传给物体或从物体取走的能量。只有物体在力作用期间发生了移动，这个力才做功。</p>
      <div class="eq"><i>W</i> = |<i>F</i>| |Δ<i>x</i>| cos θ</div>
      <p>θ 是力与位移之间的夹角。功的单位是焦耳：1 J 就是 1 N 的力作用 1 m 所做的功。</p>
      <p>绳以与水平成 ${M.PULL.deg}° 的 ${f(M.PULL.F, 0)} N 拉力拉着这个 ${f(M.PULL.m, 1)} kg 的箱子在光滑地板上运动。只有 <i>F</i> cos θ = ${f(M.PULL.Fx, 1)} N 沿运动方向。<i>F</i> sin θ = ${f(M.PULL.Fy, 1)} N 垂直于运动方向，不做功。在 ${f(P0.x)} m 内，绳做功 ${f(P0.W, 1)} J，比水平拉时的 ${f(M.PULL.F * P0.x, 1)} J 少。</p>
      <div class="charts">${chart({ ...R.pull, xlabel: '位移 Δx (m)', ylabel: '绳做的功 (J)', cursors: [['pull']], label: '功随位移的变化',
        series: [{ cls: 'trend', pts: [[0, 0], [3.2, M.PULL.F * 3.2]], tag: [1.7, M.PULL.F * 1.7 + 3, 'θ = 0°'] }, { pts: [[0, 0], [3.2, M.PULL.Fx * 3.2]], tag: [2.45, M.PULL.Fx * 2.45 - 13, 'θ = 30°'] }] })}</div>
      <p class="hintline">点击箱子分解拉力。箭头：每牛顿长 ${SC.pull.F * 100} cm。</p>`,
    cam: { target: [ST.pull + 0.75, 0.6, 0], az: -20, el: 12, dist: 17 }, lit: 'pull', scene: 'pull', look: {},
    fig: '与水平成 30° 的拉力',
  },
  {
    kicker: '4.1', title: '正功与负功', sub: '顺着运动还是逆着运动',
    body: `
      <p class="lede">沿运动方向的力（θ &lt; 90°）做<b>正</b>功：物体获得动能。逆着运动方向的力（θ &gt; 90°）做<b>负</b>功：物体失去动能。</p>
      <p>以 ${f(M.TOSS.v0, 1)} m/s 上抛一个 ${f(M.TOSS.m)} kg 的小球：上升时，重力与运动方向相反（θ = 180°），到最高点小球停住时，重力做功 ${f(-M.TOSS.m * M.G * M.TOSS.h, 1)} J。下落时（θ = 0°），重力把这 ${f(M.TOSS.m * M.G * M.TOSS.h, 1)} J 还回来。能量条满足：<i>K</i><sub>0</sub> + <i>W</i><sub>g</sub> = <i>K</i>。</p>
      <div class="charts">${chart({ ...R.toss, zero: true, xlabel: '时间 (s)', ylabel: '能量 (J)', cursors: [['tossK', BLUE], ['tossW']], label: '动能和重力做的功随时间的变化',
        series: [{ color: BLUE, pts: samples(40, 0, M.TOSS.run, t => M.toss(t).K), tag: [0.02, 7.2, 'K'] }, { pts: samples(40, 0, M.TOSS.run, t => M.toss(t).Wg), tag: [0.5, -9.6, '重力做的功'] }] })}</div>
      <p class="hintline">箭头：<b>v</b> 每 1 m/s 长 ${SC.toss.v * 100} cm，<i>F</i><sub>g</sub> 每牛顿长 ${SC.toss.F * 100} cm。能量条：每焦耳长 ${SC.toss.E * 100} cm。</p>`,
    cam: { target: [ST.toss + 0.8, 1.25, 0], az: -16, el: 7, dist: 12 }, lit: 'toss', scene: 'toss', look: {},
    fig: '上升时逆着重力，下落时顺着重力',
  },
  {
    kicker: '4.2', title: '不做功的力', sub: '与运动方向垂直',
    body: `
      <p class="lede">与位移成 90° 的力不做功，因为 cos 90° = 0。它可以改变运动方向，但永远不能改变速率。</p>
      <p>一个 ${f(M.WHIRL.m)} kg 的小球用 ${f(M.WHIRL.r, 1)} m 长的绳拴着，在光滑桌面上以 ${f(M.WHIRL.v, 1)} m/s 做圆周运动。绳以 <i>T</i> = ${f(M.WHIRL.T, 1)} N 把它拉向圆心，始终垂直于它的速度。它的动能保持 ${f(M.WHIRL.K)} J。</p>
      <p>圆轨道上的卫星也是如此：万有引力指向行星，垂直于速度，所以引力对它不做功。水平地面上的支持力同样不做功。</p>
      <div class="charts">${chart({ x0: 0, x1: 180, y0: -10, y1: 10, zero: true, xlabel: '夹角 θ (°)', ylabel: '10 N 的力在 1 m 内做的功 (J)', label: '功随夹角的变化',
        series: [{ pts: samples(60, 0, 180, d => M.work(10, 1, d)) }, { cls: 'trend', pts: [], tag: [20, 2.5, '正功'] }, { cls: 'trend', pts: [], tag: [120, -8, '负功'] }], marks: [[90, 0, '90° 时为零', 8, -8]] })}</div>
      <p class="hintline">点击小球查看更早的时刻。<b>v</b>：每 1 m/s 长 ${SC.whirl.v * 100} cm；<i>T</i>：每牛顿长 ${SC.whirl.F * 100} cm。</p>`,
    cam: { target: [ST.whirl, 0.1, 0], az: -14, el: 36, dist: 8.8 }, lit: 'whirl', scene: 'whirl', look: {},
    fig: '拉力垂直于速度',
  },
  {
    kicker: '4.3', title: '动能', sub: '动能定理',
    body: `
      <p class="lede"><b>动能</b>是物体由于运动而具有的能量，<i>K</i> = ½<i>mv</i>²。它是标量，单位焦耳，永远不为负。</p>
      <p><b>动能定理</b>：合力做的功等于动能的变化量。</p>
      <div class="eq"><i>W</i><sub>net</sub> = Δ<i>K</i> = ½<i>mv</i><sub>f</sub>² − ½<i>mv</i><sub>0</sub>²</div>
      <p>路面以 ${f(M.CAR.F / 1000, 1)} kN 的力向前推这辆 ${M.CAR.m} kg 的汽车（不计阻力）。行驶 ${f(M.car(M.CAR.run).x)} m 后，它做功 ${f(M.car(M.CAR.run).Wnet / 1000)} kJ，汽车速率为 ${f(M.car(M.CAR.run).v, 1)} m/s：½ × ${M.CAR.m} × ${f(M.car(M.CAR.run).v, 1)}² = ${f(M.car(M.CAR.run).K / 1000)} kJ。两个能量条同步增长。</p>
      <div class="charts">${chart({ ...R.car, xlabel: '路程 (m)', ylabel: 'K = W_net (kJ)', cursors: [['car', BLUE]], label: '动能随路程的变化',
        series: [{ color: BLUE, pts: [[0, 0], [8, M.CAR.F * 8 / 1000]], tag: [3.2, M.CAR.F * 3.2 / 1000 + 3, '斜率 = F = 3.0 kN'] }] })}</div>
      <p class="hintline">点击汽车：重力和支持力不做功。箭头：每千牛长 25 cm。能量条：每千焦长 7.5 cm。</p>`,
    cam: { target: [ST.car + 4.6, 1.0, 0], az: -16, el: 12, dist: 36 }, lit: 'car', scene: 'car', look: {},
    fig: '合力做功，变成动能',
  },
  {
    kicker: '4.4', title: '重力势能', sub: '与高度有关的能量',
    body: `
      <p class="lede"><b>势能</b>是与位置有关的储存的能量。在地面附近</p>
      <div class="eq"><i>U</i><sub>g</sub> = <i>mg</i>Δ<i>y</i></div>
      <p>Δ<i>y</i> 从你选定 <i>U</i><sub>g</sub> = 0 的位置量起。它等于克服重力把物体举到那里所需的最小功。</p>
      <p>这个 ${f(M.DROP.m)} kg 的小球从 ${f(M.DROP.h, 1)} m 高处释放：<i>U</i><sub>g</sub> = ${f(M.DROP.E, 1)} J，<i>K</i> = 0。下落过程中 <i>U</i><sub>g</sub> 转化为 <i>K</i>；即将落地时 <i>K</i> = ${f(M.DROP.E, 1)} J，所以 <i>v</i> = ${f(Math.sqrt(2 * M.G * M.DROP.h))} m/s。从某一高度释放时，<i>U</i><sub>g0</sub> = <i>K</i><sub>f</sub>。</p>
      <div class="charts">${chart({ ...R.drop, xlabel: '离地高度 (m)', ylabel: '能量 (J)', cursors: [['dropU', AMBER], ['dropK', BLUE]], label: '势能和动能随高度的变化',
        series: [{ cls: 'trend', pts: [[0, M.DROP.E], [3, M.DROP.E]], tag: [1.25, M.DROP.E - 1, 'E'] }, { color: AMBER, pts: [[0, 0], [3, M.DROP.E]], tag: [2.2, 8.5, 'U<tspan dy="3" font-size="8">g</tspan>'] }, { color: BLUE, pts: [[0, M.DROP.E], [3, 0]], tag: [0.35, 10.0, 'K'] }] })}</div>
      <p class="hintline">点击小球移动零点。能量条：每焦耳长 ${SC.drop.E * 100} cm。</p>`,
    cam: { target: [ST.drop + 0.7, 1.5, 0], az: -14, el: 6, dist: 14 }, lit: 'drop', scene: 'drop', look: {},
    fig: '高度变成速度',
  },
  {
    kicker: '4.5', title: '弹性势能', sub: '胡克定律',
    body: `
      <p class="lede">弹簧总是朝恢复原长的方向推回，压缩或拉伸得越多，推力越大。</p>
      <table class="data eqs"><tr><td><i>F</i><sub>s</sub> = −<i>k</i>Δ<i>x</i></td><td>与 Δx 方向相反；<i>k</i> 的单位为 N/m</td></tr><tr><td><i>U</i><sub>s</sub> = ½<i>k</i>Δ<i>x</i>²</td><td>储存的能量</td></tr></table>
      <p>劲度系数 <i>k</i> = ${M.SPRING.k} N/m，${f(M.SPRING.m, 1)} kg 的木块（<i>K</i> = ${f(M.SPRING.E, 1)} J）在 Δ<i>x</i> = ${f(XS)} m 处停住：全部 ${f(M.SPRING.E, 1)} J 都储存起来，然后又还回去。功是<b>力–位移图像下的面积</b>；<i>kx</i> 下的面积是一个三角形，½ · Δ<i>x</i> · <i>k</i>Δ<i>x</i>。</p>
      <div class="charts">${chart({ ...R.spring, xlabel: '压缩量 Δx (m)', ylabel: '弹力 (N)', cursors: [['spring']], label: '弹力随压缩量的变化，着色面积等于储存的能量',
        under: `<path data-area="spring" style="fill:${BAR_COLORS.U};opacity:.45" d=""/>`, series: [{ pts: [[0, 0], [0.5, M.SPRING.k * 0.5]] }] })}</div>
      <p class="live" id="springlive"></p>
      <p class="hintline">无摩擦。箭头：每牛顿长 ${SC.spring.F * 100} cm。能量条：每焦耳长 ${SC.spring.E * 100} cm。</p>`,
    cam: { target: [ST.spring - 0.05, 0.6, 0], az: -14, el: 20, dist: 14 }, lit: 'spring', scene: 'spring', look: {},
    fig: '压缩弹簧',
  },
  {
    kicker: '4.6 · AP 物理 C', title: '变力做功', sub: 'F(x) 图线下的面积',
    body: `
      <p class="lede">力沿途变化时，把路径切成细条，对每一条加上 <i>F</i>Δ<i>x</i>，再让细条越来越窄。这个和就变成 <b>F(x) 图线下的面积</b>：</p>
      <div class="eq"><i>W</i> = lim Σ <i>F</i>(<i>x</i><sub>i</sub>)Δ<i>x</i> = ∫ <i>F</i>(<i>x</i>) d<i>x</i></div>
      <p>光滑地板上一个 ${f(M.PUSH.m, 1)} kg 的板条箱受到推力 <i>F</i> = <i>F</i><sub>0</sub>(1 − <i>x</i>/<i>L</i>)(1 + 2<i>x</i>/<i>L</i>)，从 ${M.PUSH.F0} N 逐渐减小到 <i>L</i> = ${f(M.PUSH.L, 1)} m 处的 0。积分得 <i>W</i> = ⅚<i>F</i><sub>0</sub><i>L</i> = ${f(M.PUSH.W, 1)} J，全部变成动能。</p>
      <div class="charts">${chart({ ...R.push, xlabel: '位置 x (m)', ylabel: '推力 F(x) (N)', cursors: [['push']], label: '推力随位置的变化，到板条箱处的面积已着色，并画出六个细条',
        under: `<path data-area="push" style="fill:#86868c;opacity:.35" d=""/>` + Array.from({ length: 6 }, (_, i) => { const dx = M.PUSH.L / 6, x = i * dx, F = M.pushF(x + dx / 2), X = v => CH.sx(v, R.push.x0, R.push.x1), Y = v => CH.sy(v, R.push.y0, R.push.y1, R.push.h); return `<rect class="trend" x="${X(x)}" y="${Y(F)}" width="${X(dx) - X(0)}" height="${Y(0) - Y(F)}"/>`; }).join(''),
        series: [{ pts: [...samples(60, 0, M.PUSH.L, M.pushF), [R.push.x1, 0]] }] })}</div>
      <p class="hintline">6 个细条（虚线）${f(M.pushStrips(6))} J；64 个细条 ${f(M.pushStrips(64), 3)} J。每牛顿长 ${SC.push.F * 100} cm。</p>`,
    cam: { target: [ST.push + 0.1, 0.8, 0], az: -12, el: 9, dist: 14.5 }, lit: 'push', scene: 'push', look: {},
    fig: '功是 F(x) 图线下的面积',
  },
  {
    kicker: '4.7', title: '机械能守恒', sub: '机械能保持不变',
    body: `
      <p class="lede">没有摩擦和阻力时，机械能 <i>E</i> = <i>K</i> + <i>U</i><sub>g</sub> + <i>U</i><sub>s</sub> 保持不变。</p>
      <div class="eq"><i>U</i><sub>g0</sub> + <i>U</i><sub>s0</sub> + <i>K</i><sub>0</sub> = <i>U</i><sub>gf</sub> + <i>U</i><sub>sf</sub> + <i>K</i><sub>f</sub></div>
      <p>${f(M.PEND.L, 1)} m 长的绳上挂着 ${f(M.PEND.m, 1)} kg 的摆球，从 ${M.PEND.deg0}° 处释放。在两端，能量全部是 <i>U</i><sub>g</sub>，${f(M.PEND.E)} J。在最低点，能量全部是 <i>K</i>，速率为 ${f(Math.sqrt(2 * M.PEND.E / M.PEND.m))} m/s。绳的拉力垂直于运动方向，不做功。技巧：先找出为零的项（两端 <i>v</i> = 0，最低点 Δ<i>y</i> = 0）。</p>
            <div class="charts">${barChart('pend', [['K', 'K', BAR_COLORS.K], ['U', 'U<tspan dy="3" font-size="8">g</tspan>', BAR_COLORS.U], ['E', 'E', BAR_COLORS.E]], M.PEND.E)}</div>
      <p class="hintline">点击摆球分解它的重力。箭头：每牛顿长 ${SC.pendulum.F * 100} cm。能量条：每焦耳长 ${SC.pendulum.E * 100} cm。</p>`,
    cam: { target: [ST.pendulum + 0.7, 1.8, 0], az: -10, el: 6, dist: 14 }, lit: 'pendulum', scene: 'pendulum', look: {},
    fig: 'K 与 U 相互转化',
  },
  {
    kicker: '4.8 · AP 物理 C', title: '由势能求力', sub: 'U 的斜率取负',
    body: `
      <p class="lede">由于 d<i>W</i> = <i>F</i> d<i>x</i> = −d<i>U</i>，保守力就是 <i>U</i>(<i>x</i>) 的<b>斜率取负</b>：它指向“下坡”方向，在 <i>U</i> 平坦处为零。</p>
      <div class="eq"><i>F</i><sub>x</sub> = −d<i>U</i>/d<i>x</i></div>
      <p>一个 ${f(M.BEAD.m)} kg 的珠子套在光滑的金属丝上，<i>x</i> 沿金属丝量取：<i>U</i> = <i>mgh</i>(<i>x</i>)。</p>
      <div class="charts">${chart({ ...R.beadU, xlabel: '沿金属丝的 x (m)', ylabel: 'U (J) 及其切线', cursors: [['beadU']], label: '沿金属丝的势能，以及珠子所在处的切线',
        under: `<line data-tangent="bead" class="curve" style="stroke:#e5484d;stroke-width:1.3"/>`,
        series: [{ cls: 'trend', pts: [[0, M.BEAD.E], [R.beadU.x1, M.BEAD.E]], tag: [5.3, M.BEAD.E - 0.55, 'E'] }, { pts: samples(120, 0, M.BEAD.len, M.beadU) }] })}
        ${chart({ ...R.beadF, zero: true, xlabel: '沿金属丝的 x (m)', ylabel: 'F = −dU/dx (N)', cursors: [['beadF']], label: '沿金属丝方向的力',
        series: [{ pts: samples(120, 0, M.BEAD.len, M.beadF) }], marks: [[M.BEAD.stable, 0, '稳定', -16, 14], [M.BEAD.unstable, 0, '不稳定', 6, -6]] })}</div>
      <p class="hintline">点击珠子查看切线。每牛顿长 ${SC.bead.F * 100} cm。</p>`,
    cam: { target: [ST.bead - 0.1, 0.85, 0], az: -10, el: 8, dist: 14.5 }, lit: 'bead', scene: 'bead', look: {},
    fig: '沿 U 图像“下坡”',
  },
  {
    kicker: '4.9 · AP 物理 C', title: '势能曲线', sub: '转折点与平衡',
    body: `
      <p class="lede">在总能量 <i>E</i> 处画一条水平线：它高出 <i>U</i>(<i>x</i>) 的部分就是 <i>K</i>。粒子在 <i>U</i> = <i>E</i> 的<b>转折点</b>处折返。</p>
      <table class="data eqs"><tr><td>稳定平衡</td><td>U 极小，U″ &gt; 0：F 把它推回</td></tr><tr><td>不稳定平衡</td><td>U 极大，U″ &lt; 0：F 把它推开（驼峰）</td></tr><tr><td>随遇平衡</td><td>U 平坦：不受力（金属丝的右端）</td></tr></table>
      <p>一个轻原子与一个重原子成键，<i>E</i> = ${f(M.BOND.E / M.EV, 1)} eV。在势阱底部附近，势阱就像一根弹簧，<i>k</i> = <i>U</i>″：</p>
      <div class="eq">ω² = <i>U</i>″(<i>x</i><sub>0</sub>)/<i>m</i> → <i>T</i> = ${f(2 * Math.PI / M.BOND.w * 1e15, 1)} fs</div>
      <div class="charts">${chart({ ...R.bondU, xlabel: '原子间距 r (nm)', ylabel: 'U (eV)', cursors: [['bondU']], zero: true, label: '化学键的势能曲线，以及总能量线和转折点',
        series: [{ cls: 'trend', pts: [[R.bondU.x0, M.BOND.E / M.EV], [R.bondU.x1, M.BOND.E / M.EV]], tag: [0.315, M.BOND.E / M.EV + 0.06, 'E'] }, { pts: samples(120, 0.1355, R.bondU.x1, r => M.bondU(r * 1e-9) / M.EV) }],
        marks: [[M.BOND.r1 * 1e9, M.BOND.E / M.EV, '转折点', -40, 4], [M.BOND.r2 * 1e9, M.BOND.E / M.EV, '转折点', 6, 14]] })}</div>
      <p class="hintline">按 0.1 nm = 1 m 绘制，<i>F</i> 每 nN 长 ${SC.bond.F * 100} cm，放慢 ${(() => { const [a, e] = (1 / (M.SLOW * M.BOND.tscale)).toExponential(1).split('e+'); return `${a}×10<sup>${e}</sup>`; })()} 倍。</p>`,
    cam: { target: [ST.bond - 0.45, 1.25, 0], az: -10, el: 6, dist: 12.5 }, lit: 'bond', scene: 'bond', look: {},
    fig: '势阱中的粒子',
  },
  {
    kicker: '4.10', title: '机械能不守恒时', sub: '摩擦把能量变成热',
    body: `
      <p class="lede">摩擦力和阻力是<b>耗散力</b>。它们与运动方向相反，所以做的功总是负的。它们带走的机械能变成了内能。</p>
      <div class="eq"><i>E</i><sub>mech,i</sub> = <i>E</i><sub>mech,f</sub> + |<i>W</i><sub>耗散</sub>|</div>
      <p>${f(M.SLIDE.m, 1)} kg 的木块以 ${f(M.SLIDE.v0, 1)} m/s 滑上粗糙地面。μ<sub>k</sub> = ${f(M.SLIDE.mu)}，摩擦力 <i>f</i> = μ<sub>k</sub><i>mg</i> = ${f(M.SLIDE.f)} N。它滑行 ${f(M.SLIDE.d)} m 后停下：|<i>W</i><sub>f</sub>| = <i>f</i>·<i>d</i> = ${f(M.SLIDE.E, 1)} J，正好是它全部的 <i>K</i>。<i>E</i><sub>mech</sub> 降为零；把热也算进去，总能量始终不变。</p>
      <div class="charts">${chart({ ...R.slide, xlabel: '滑行距离 (m)', ylabel: '能量 (J)', cursors: [['slideK', BLUE], ['slideT', GREY]], label: '动能和内能随滑行距离的变化',
        series: [{ cls: 'trend', pts: [[0, M.SLIDE.E], [M.SLIDE.d, M.SLIDE.E]], tag: [0.85, M.SLIDE.E - 0.2, '总能量'] }, { color: BLUE, pts: [[0, M.SLIDE.E], [M.SLIDE.d, 0]], tag: [0.2, 11.5, 'K'] }, { color: GREY, pts: [[0, 0], [M.SLIDE.d, M.SLIDE.E]], tag: [1.45, 8.0, '内能'] }] })}</div>
      <p class="hintline">点击木块。箭头：每牛顿长 ${SC.slide.F * 100} cm。能量条：每焦耳长 ${SC.slide.E * 100} cm。</p>`,
    cam: { target: [ST.slide + 0.3, 0.55, 0], az: -16, el: 12, dist: 14 }, lit: 'slide', scene: 'slide', look: {},
    fig: '动能变成热',
  },
  {
    kicker: '4.11', title: '功率', sub: '做功的快慢',
    body: `
      <p class="lede"><b>功率</b>是做功的快慢，也就是能量从一种形式转化为另一种形式的快慢。单位是瓦特：1 W = 1 J/s，1 马力 = ${M.HP} W。</p>
      <div class="eq"><i>P</i> = <i>W</i>/<i>t</i> = <i>F</i>Δ<i>x</i>/<i>t</i> = <i>Fv</i></div>
      <p>两个 ${M.LIFT.m} kg 的板条箱都匀速上升 ${f(M.LIFT.h, 1)} m，所以每根绳的拉力都是 <i>T</i> = <i>mg</i> = ${f(M.LIFT.W, 0)} N，做功 ${f(M.LIFT.work, 0)} J。快的用时 ${f(M.LIFT.tFast, 1)} s：${f(M.LIFT.Pfast, 0)} W。慢的用时 ${f(M.LIFT.tSlow, 1)} s：${f(M.LIFT.Pslow, 0)} W。做功相同，功率加倍。已知速率和时间时，用 <i>P</i> = Δ<i>E</i>/<i>t</i> 往往最快。</p>
            <div class="charts">${chart({ ...R.lift, xlabel: '时间 (s)', ylabel: '已做的功 (J)', cursors: [['liftF'], ['liftS']], label: '功随时间的变化，快与慢',
        series: [{ pts: [[0, 0], [M.LIFT.tFast, M.LIFT.work], [4.2, M.LIFT.work]], tag: [0.25, 160, '快：斜率 98 W'] }, { cls: 'trend', pts: [[0, 0], [M.LIFT.tSlow, M.LIFT.work]], tag: [2.45, 95, '慢：49 W'] }] })}</div>
      <p class="hintline">忽略短暂的启动和停止。箭头：每牛顿长 ${SC.lift.F * 100} cm。</p>`,
    cam: { target: [ST.lift, 1.7, 0], az: -12, el: 6, dist: 14 }, lit: 'lift', scene: 'lift', look: {},
    fig: '做功相同，用时减半',
  },
];

// ---------- click a scene: what it breaks into ----------
export const PLATES = {
  pull: { text: `拉力分解为两个分量（灰色）。<i>F</i> cos θ 沿位移方向，做了全部的功。<i>F</i> sin θ 竖直向上，与运动方向成 90°，不做功：它只是让地板的支持力变小。绳做的功等于箱子的动能，因为没有其他力做功。`,
    facts: s => { const r = M.pull(s.pull.t); return [['F cos θ（沿 Δx）', `${f(M.PULL.Fx)} N`], ['F sin θ（垂直）', `${f(M.PULL.Fy)} N，不做功`], ['Δx', `${f(r.x)} m`], ['W = F Δx cos θ', `${f(r.W)} J`], ['K = ½mv²', `${f(r.K)} J`]]; } },
  toss: { text: `注意重力与速度之间的夹角。上升时两者相反（180°）：重力做负功，K 条缩短。下落时两者同向（0°）：重力做正功，K 条又长回来。每一时刻都有 K = K<sub>0</sub> + W<sub>g</sub>。`,
    facts: s => { const r = M.toss(s.toss.t); return [['高度', `${f(r.y)} m`], ['速度', `${f(r.v)} m/s`], ['到目前为止重力做的功', `${f(r.Wg)} J`], ['K = K₀ + W_g', `${f(M.toss(0).K)} + (${f(r.Wg)}) = ${f(r.K)} J`]]; } },
  whirl: { text: `更早的几个时刻，相隔四分之一圈：每个时刻拉力（指向钉子）与速度（沿圆周）都成 90°。在任何一小步中，位移都沿 <b>v</b>，所以 T·Δx·cos 90° = 0。重力和桌面的支持力是竖直的，也不做功。`,
    facts: () => [['拉力 T', `${f(M.WHIRL.T)} N`], ['T 与 v 的夹角', '90°'], ['T 做的功', '0 J'], ['速率', `${f(M.WHIRL.v)} m/s，恒定`], ['K', `${f(M.WHIRL.K)} J，恒定`]] },
  car: { text: `重力和支持力是竖直的，与运动方向成 90°，不做功，可以不管。沿 Δx 方向唯一的力是路面的推力，它也是合力（红）。它做的功 F·Δx 就是动能的全部变化量。`,
    facts: s => { const r = M.car(s.car.t); return [['F（路面，向前）', `${f(M.CAR.F / 1000)} kN`], ['Δx', `${f(r.x)} m`], ['W_net = F Δx', `${f(r.Wnet / 1000)} kJ`], ['v', `${f(r.v)} m/s`], ['K = ½mv²', `${f(r.K / 1000)} kJ`]]; } },
  drop: { text: `把零点上移到 ${f(M.DROP.ref2, 1)} m，每个 U<sub>g</sub> 值都减小 mg × ${f(M.DROP.ref2, 1)} = ${f(M.DROP.m * M.G * M.DROP.ref2)} J。在新零点以下，U<sub>g</sub> 为负。但下落过程中 U<sub>g</sub> 的<i>变化量</i>不变，所以算出的速率也不变。哪个零点让计算最简单，就选哪个。`,
    facts: s => { const r = M.drop(s.drop.t), m = M.DROP.m * M.G; return [['高度', `${f(r.y)} m`], ['U_g，以地面为零点', `${f(r.U)} J`], [`U_g，以 ${f(M.DROP.ref2, 1)} m 为零点`, `${f(m * (r.y - M.DROP.ref2))} J`], ['释放以来的 ΔU_g', `${f(r.U - M.DROP.E)} J，两种零点相同`], ['K', `${f(r.K)} J`]]; } },
  spring: { text: `灰色箭头是压缩量 Δx，从弹簧原长处量起。弹力 F<sub>s</sub> = −kΔx 指向相反方向。木块减速时，它的 K 条流入 U<sub>s</sub> 条；压缩到最大时能量全部是 U<sub>s</sub>。总能量始终不变。`,
    facts: s => { const r = M.spring(s.spring.t); return [['压缩量 Δx', `${f(r.x, 3)} m`], ['F_s = −kΔx', `${f(r.F)} N`], ['U_s = ½kΔx²', `${f(r.U)} J`], ['K = ½mv²', `${f(r.K)} J`], ['K + U_s', `${f(r.K + r.U)} J`]]; } },
  push: { text: `F(x) 图线下的面积被分成 ${6} 个细条。每一条是 F(x<sub>i</sub>)·Δx，即推力几乎不变的一小段上所做的功。它们的和 ${f(M.pushStrips(6))} J 已经接近积分值 ${f(M.PUSH.W)} J；细条越窄，差距越小。地板水平且光滑，所以重力和支持力不做功，面积全部变成动能。`,
    facts: s => { const r = M.push(s.push.t); return [['x', `${f(r.x)} m`], ['F(x)', `${f(r.F)} N`], ['到目前为止 W = ∫F dx', `${f(r.W)} J`], ['K = ½mv²', `${f(r.K)} J`], ['整段推力的 6 条之和', `${f(M.pushStrips(6))} J`], ['∫₀ᴸ F dx', `${f(M.PUSH.W)} J`]]; } },
  bead: { text: `虚线是金属丝的切线。重力分解为沿金属丝的分量 mg sin θ 和垂直于金属丝的分量，后者由金属丝的支持力承担。由于 U = mgh，且沿金属丝 dh/dx = sin θ，沿金属丝的分量恰好是 −dU/dx。在谷底和驼峰顶，切线水平：不受力，处于平衡。`,
    facts: s => { const r = M.bead(s.bead.t); return [['沿金属丝的 x', `${f(r.x)} m`], ['U = mgh', `${f(r.U)} J`], ['dU/dx（斜率）', `${f(r.slope)} J/m`], ['F = −dU/dx', `${f(r.F)} N`], ['K + U', `${f(r.K + r.U, 3)} J`]]; } },
  bond: { text: `这个化学键用伦纳德-琼斯模型描述，U = ε[(r<sub>0</sub>/r)¹² − 2(r<sub>0</sub>/r)⁶]，r<sub>0</sub> = ${f(M.BOND.r0 * 1e9)} nm；重原子几乎不动。虚影标出转折点，在那里 U = E，原子停住。蓝色虚线抛物线是 ½k(r − r<sub>0</sub>)²，k = U″(r<sub>0</sub>) = ${f(M.BOND.k, 0)} N/m：它与势阱底部吻合，所以小振动是简谐运动，ω² = U″/m。再往上，真实的势阱并不对称，内侧陡、外侧缓，所以这次振动更慢，在拉伸状态停留的时间更长。`,
    facts: s => { const r = M.bond(s.bond.t); return [['r', `${f(r.r * 1e9, 4)} nm`], ['U', `${f(r.U / M.EV, 3)} eV`], ['K = E − U', `${f(r.K / M.EV, 3)} eV`], ['F = −dU/dr', `${f(r.F * 1e9)} nN`], ['k = U″(r₀)', `${f(M.BOND.k, 0)} N/m`], ['小振动 T / 本次振动', `${f(2 * Math.PI / M.BOND.w * 1e15)} / ${f(M.BOND.period * 1e15)} fs`]]; } },
  pendulum: { text: `重力分解为沿轨迹的 mg sin θ 和沿绳的 mg cos θ。只有 mg sin θ 做功：上摆时使摆球减速，下摆时使它加速。拉力和 mg cos θ 垂直于运动方向，不做功，所以 K + U<sub>g</sub> 保持不变。`,
    facts: s => { const r = M.pendulum(s.pendulum.t); return [['角度 θ', `${f(r.th * 180 / Math.PI, 1)}°`], ['mg sin θ（沿轨迹）', `${f(r.Ftan)} N`], ['拉力 T', `${f(r.T)} N，不做功`], ['K', `${f(r.K)} J`], ['U_g', `${f(r.U)} J`], ['K + U_g', `${f(r.K + r.U)} J`]]; } },
  slide: { text: `重力和支持力不做功，可以不管。摩擦力是沿运动方向唯一的力，而且它向后：θ = 180°，所以它做的功是 −f·Δx。这个负功恰好等于损失的动能，这部分能量以热的形式出现在木块和地面中。`,
    facts: s => { const r = M.slide(s.slide.t); return [['摩擦力 f = μk mg', `${f(M.SLIDE.f)} N`], ['Δx', `${f(r.x)} m`], ['W_f = −f Δx', `${f(r.Wf)} J`], ['K', `${f(r.K)} J`], ['内能', `${f(r.Eth)} J`], ['K + 内能', `${f(r.K + r.Eth)} J`]]; } },
  lift: { text: `灰色箭头是每个箱子上升的 Δy。匀速时绳的拉力等于重力，所以每根绳做功 W = mgΔy。高度相同，做功就相同；快的箱子用一半的时间到达，所以它的绳输出的功率是两倍。`,
    facts: s => { const a = M.lift(s.lift.t, M.LIFT.vFast), b = M.lift(s.lift.t, M.LIFT.vSlow); return [['T = mg', `${f(M.LIFT.W, 1)} N`], ['快：到目前为止做的功', `${f(a.W, 0)} J，P ${f(a.P, 0)} W`], ['慢：到目前为止做的功', `${f(b.W, 0)} J，P ${f(b.P, 0)} W`], ['P = Fv（快）', `${f(M.LIFT.W, 0)} × ${f(M.LIFT.vFast, 1)} = ${f(M.LIFT.Pfast, 0)} W`]]; } },
};
