// Chapter 6, page by page (after the AP Physics 1 organizer, Unit 7). Text and charts on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, P_SCALE, PAPER, TQ_ARC } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const deg = r => (r / M.DEG).toFixed(0);

// ---------- small SVG charts for the left page, with live cursors ----------
const W = 420, P = { l: 44, r: 14, t: 16, b: 30 };
export const CURSORS = {};       // key → (x, y) → [cx, cy]
export const LIVE = {};          // key → (t) → path d, for a series that is redrawn every frame
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursors = [], label, h = 170, ylabels, xlabels }) {
  const H = h;
  const sx = x => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy = y => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b);
  for (const c of cursors) CURSORS[c] = (x, y) => [sx(x), sy(y)];
  const toD = pts => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('');
  for (const s of series) if (s.live) { LIVE[s.live] = t => toD(s.fn(t)); s.pts = s.fn(0); }
  const paths = series.map(s => `<path class="${s.cls || 'curve'}"${s.live ? ` data-live="${s.live}"` : ''} d="${toD(s.pts)}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const zero = y0 < 0 && y1 > 0 ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  const [yt, yb] = ylabels || [y1, y0], [xl, xr] = xlabels || [x0, x1];
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${zero}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${yt}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${yb}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${xl}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${xr}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(c => `<circle class="cursor" r="4.5" cx="-20" cy="-20" data-cursor="${c}"/>`).join('')}
  </svg>`;
}
const sample = (fn, a, b, n = 120) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });
const T2 = 2 * M.T0;

const at = (k, dx = 0, dy = 0.35) => [STATIONS[k] + dx, dy, 0];

export const PAGES = [
  {
    kicker: '第 6 章', title: '振动', sub: '来来回回，周而复始',
    body: `
      <p class="lede"><b>振动</b>是物体在<b>平衡位置</b>附近的往复运动。如果把它拉回平衡位置的<b>回复力</b>与位移成正比，这种振动就是<b>简谐运动</b>，此时周期始终不变。</p>
      <table class="data">
        <tr><td>振幅 <i>A</i>：离平衡位置的最大距离</td><td>${f(M.A)} m</td></tr>
        <tr><td>周期 <i>T</i>：完成一次全振动所用的时间</td><td>${f(M.T0, 3)} s</td></tr>
        <tr><td>频率 <i>f</i> = 1/<i>T</i>：每秒完成全振动的次数</td><td>${f(M.F0, 3)} Hz</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: 1, xlabels: ['0', '2T'], y0: -M.A, y1: M.A, ylabels: ['+A', '−A'], xlabel: '时间', ylabel: '位置 x', cursors: ['x0'], label: '位置随时间的变化：余弦曲线', h: 140,
        series: [{ pts: sample(u => M.spring(u * T2).x, 0, 1) }], marks: [[0.5, M.A, 'T', -3, 16]] })}</div>
      <p class="hintline">轮廓线是等时间间隔的频闪像：在两端处较密，因为木块在那里运动得慢。点击木块查看 v 和 a。</p>`,
    cam: { target: at('spring', -0.25, 0.3), az: -20, el: 20, dist: 7.6 }, lit: 'spring', scene: 'spring', look: {},
    fig: '光滑水平面上的弹簧振子',
  },
  {
    kicker: '6.1', title: '胡克定律', sub: '回复力',
    body: `
      <p class="lede">拉伸或压缩弹簧，它就会反推回来，推力与弹簧末端移动的距离成正比：</p>
      <div class="eq"><i>F</i><sub>s</sub> = −<i>k</i>Δ<i>x</i></div>
      <p><i>k</i> = ${M.K} N/m 是<b>劲度系数</b>，表示弹簧的软硬程度。负号表示弹力总是与位移<b>方向相反</b>。重力与支持力相互抵消，所以 <i>F</i><sub>s</sub> 就是合力，<i>a</i> = −(<i>k</i>/<i>m</i>)<i>x</i>（红色）。</p>
      <table class="data">
        <tr><th>位置</th><th>力、加速度</th><th>速率</th></tr>
        <tr><td><i>x</i> = ±<i>A</i></td><td>${f(M.FMAX, 1)} N，${f(M.AMAX, 1)} m/s²：最大</td><td>0</td></tr>
        <tr><td><i>x</i> = 0</td><td>0</td><td>${f(M.VMAX, 1)} m/s：最大</td></tr>
      </table>
      <div class="charts">${chart({ x0: -M.A, x1: M.A, y0: -M.FMAX, y1: M.FMAX, xlabel: '位移 x (m)', ylabel: 'F (N)', cursors: ['Fx'], label: '弹力随位移的变化：斜率为 −k 的直线', h: 130,
        series: [{ pts: [[-M.A, M.FMAX], [M.A, -M.FMAX]], tag: [0.12, -2.4, '斜率 −k'] }] })}</div>
      <p class="hintline">点击木块查看它的受力分析图。</p>`,
    cam: { target: at('hooke', -0.2, 0.3), az: -16, el: 14, dist: 7.8 }, lit: 'hooke', scene: 'hooke', look: {},
    fig: '力总是指向 x = 0',
  },
  {
    kicker: '6.2', title: 'x、v 和 a', sub: '余弦曲线及其斜率',
    body: `
      <p class="lede">一条纸带从木块下方匀速抽出，木块便自己画出了位置随时间变化的图像：一条余弦曲线。</p>
      <table class="data eqs">
        <tr><td><i>x</i> = <i>A</i> cos 2π<i>ft</i></td><td>两端处为 ±<i>A</i></td></tr>
        <tr><td><i>v</i> = −2π<i>fA</i> sin 2π<i>ft</i></td><td>在 <i>x</i> = 0 处最大，${f(M.VMAX)} m/s</td></tr>
        <tr><td><i>a</i> = −4π²<i>f</i>²<i>A</i> cos 2π<i>ft</i></td><td>在 ±<i>A</i> 处最大，${f(M.AMAX)} m/s²</td></tr>
      </table>
      <p>每幅图都是上一幅图的斜率：cos → −sin → −cos。而 <i>a</i> 就是 <i>x</i> 翻转并缩放后的结果。</p>
      <div class="charts">
        ${chart({ x0: 0, x1: 1, xlabels: ['', ''], y0: -1, y1: 1, ylabels: ['+A', '−A'], xlabel: '', ylabel: 'x', cursors: ['tx'], label: '位置：余弦', h: 78, series: [{ pts: sample(u => Math.cos(2 * Math.PI * 2 * u), 0, 1) }] })}
        ${chart({ x0: 0, x1: 1, xlabels: ['', ''], y0: -1, y1: 1, ylabels: ['+max', '−max'], xlabel: '', ylabel: 'v', cursors: ['tv'], label: '速度：负正弦', h: 78, series: [{ pts: sample(u => -Math.sin(2 * Math.PI * 2 * u), 0, 1) }] })}
        ${chart({ x0: 0, x1: 1, xlabels: ['0', '2T'], y0: -1, y1: 1, ylabels: ['+max', '−max'], xlabel: '时间', ylabel: 'a', cursors: ['ta'], label: '加速度：负余弦', h: 88, series: [{ pts: sample(u => -Math.cos(2 * Math.PI * 2 * u), 0, 1) }] })}
      </div>
      <p class="hintline">点击纸带上的曲线，查看笔尖处的斜率：也就是速度。</p>`,
    cam: { target: [STATIONS.trace - 0.1, 0, 1.45], az: -10, el: 52, dist: 11 }, lit: 'trace', scene: 'trace', look: {},
    fig: '木块画出 x–t 图像',
  },
  {
    kicker: '6.3', title: '能量', sub: '相互转化，从不损失',
    body: `
      <p class="lede">没有摩擦时，总能量保持不变，只是在木块的运动和弹簧之间来回转移：</p>
      <div class="eq">½<i>kA</i>² = ½<i>mv</i>² + ½<i>kx</i>²</div>
      <p>在 ±<i>A</i> 处，能量全部储存在弹簧中，½<i>kA</i>² = ${f(M.E)} J。在 <i>x</i> = 0 处，能量全部是动能，所以 ½<i>mv</i><sub>max</sub>² = ½<i>kA</i>²，<i>v</i><sub>max</sub> = √(<i>k</i>/<i>m</i>)·<i>A</i> = ${f(M.VMAX)} m/s。两者各占一半的位置在 <i>x</i> = <i>A</i>√2/2 = ${f(M.X_HALF, 3)} m 处，而不是在中点。</p>
      <div class="charts">${chart({ x0: -M.A, x1: M.A, y0: 0, y1: M.E, xlabel: '位置 x (m)', ylabel: '能量 (J)', cursors: ['U', 'K'], label: '动能和弹性势能随位置的变化', h: 140,
        series: [{ pts: sample(x => 0.5 * M.K * x * x, -M.A, M.A), tag: [0.27, 0.32, 'U'] }, { pts: sample(x => M.E - 0.5 * M.K * x * x, -M.A, M.A), tag: [-0.06, 1.72, 'K'] }],
        marks: [[M.X_HALF, M.E / 2, 'K = U', 8, 4]] })}</div>
      <p>弹性势能等于拉伸弹簧所做的功：<i>F</i> = <i>kx</i> 图线下的三角形面积，½(<i>kx</i>)<i>x</i>。</p>
      <p class="hintline">点击把动能部分从能量柱上分离出来。</p>`,
    cam: { target: at('energy', 0.95, 0.6), az: -10, el: 14, dist: 12 }, lit: 'energy', scene: 'energy', look: {},
    fig: '动能与弹性势能',
  },
  {
    kicker: '6.4', title: '竖直弹簧振子', sub: '重力改变平衡位置，不改变节拍',
    body: `
      <p class="lede">把同一个木块挂在同一根弹簧下。弹簧伸长，直到弹力与重力平衡，<i>kd</i> = <i>mg</i>：</p>
      <div class="eq"><i>d</i> = <i>mg</i>/<i>k</i> = ${f(M.D, 3)} m</div>
      <p>这就是新的平衡位置。从这里开始量 <i>y</i>，重力就从式子中消掉了：<i>k</i>(<i>d</i> − <i>y</i>) − <i>mg</i> = −<i>ky</i>。又是胡克定律的形式，所以它上下振动的周期与在水平面上相同，为 ${f(M.T0, 3)} s。</p>
      <table class="data">
        <tr><th>位置</th><th>弹力</th><th>重力</th><th>合力（红色）</th></tr>
        <tr><td>最高点</td><td>${f(M.K * (M.D - M.HANG.A))} N</td><td>${f(M.WEIGHT)} N</td><td>${f(M.K * M.HANG.A)} N ↓</td></tr>
        <tr><td>平衡位置</td><td>${f(M.WEIGHT)} N</td><td>${f(M.WEIGHT)} N</td><td>0</td></tr>
        <tr><td>最低点</td><td>${f(M.K * (M.D + M.HANG.A))} N</td><td>${f(M.WEIGHT)} N</td><td>${f(M.K * M.HANG.A)} N ↑</td></tr>
      </table>
      <p class="hintline">点击木块查看它的受力分析图。</p>`,
    cam: { target: at('hang', 0.1, 1.9), az: -14, el: 6, dist: 9 }, lit: 'hang', scene: 'hang', look: {},
    fig: '竖直弹簧下的木块',
  },
  {
    kicker: '6.5', title: '单摆', sub: '摆角很小时才是简谐运动',
    body: `
      <p class="lede">绳的拉力沿绳方向，所以沿圆弧把摆球拉回的只有重力：</p>
      <div class="eq"><i>F</i> = −<i>mg</i> sin θ</div>
      <p>它并不严格与 θ 成正比。但在约 10° 以内，sin θ ≈ θ（以弧度计），于是 <i>F</i> ≈ −<i>mg</i>θ，这就是简谐运动，周期为</p>
      <div class="eq"><i>T</i> = 2π√(<i>L</i>/<i>g</i>) = ${f(M.P_T, 3)} s</div>
      <p>摆角为 ±${deg(M.PEND.th0)}° 时，真实周期只比它长 ${f(100 * (M.periodExact(M.PEND.L, M.PEND.th0) / M.P_T - 1), 2)}%。在最低点，回复力为零，摆球速度最大：由 ½<i>mv</i>² = <i>mg</i>Δ<i>y</i> 得 ${f(M.vmaxPendulum(M.PEND.L, M.PEND.th0), 3)} m/s。</p>
      <div class="charts">${chart({ x0: 0, x1: 60, y0: 0, y1: 1.05, ylabels: ['mg', '0'], xlabel: '摆角 θ (°)', ylabel: '回复力', cursors: ['th'], label: 'mg sin θ 与 mgθ 的比较', h: 120,
        series: [{ pts: sample(d => Math.sin(d * M.DEG), 0, 60), tag: [46, Math.sin(46 * M.DEG) - 0.24, 'mg sin θ'] }, { cls: 'trend', pts: sample(d => d * M.DEG, 0, 60), tag: [40, 40 * M.DEG + 0.04, 'mgθ'] }, { cls: 'grid', pts: [[10, 0], [10, 1.05]] }],
        marks: [[10, Math.sin(10 * M.DEG), '10°', 6, 16]] })}</div>
      <p class="hintline">箭头：每牛顿对应 ${(P_SCALE * 100).toFixed(0)} cm。点击摆球，把重力分解。</p>`,
    cam: { target: at('pendulum', 0, 2.05), az: -12, el: 5, dist: 9.5 }, lit: 'pendulum', scene: 'pendulum', look: {},
    fig: `${M.PEND.L.toFixed(1)} m 长的单摆，±${deg(M.PEND.th0)}°`,
  },
  {
    kicker: '6.6', title: '周期加倍', sub: '注意平方根',
    body: `
      <p class="lede">周期与 <i>m</i>、1/<i>k</i> 或 <i>L</i> 的<i>平方根</i>成正比。要让周期加倍，这些量就要变为四倍。</p>
      <table class="data cols">
        <tr><th>弹簧振子</th><th>单摆</th></tr>
        <tr><td><i>T</i> = 2π√(<i>m</i>/<i>k</i>)</td><td><i>T</i> = 2π√(<i>L</i>/<i>g</i>)</td></tr>
        <tr><td>2<i>T</i>：4<i>m</i> 或 ¼<i>k</i></td><td>2<i>T</i>：4<i>L</i></td></tr>
        <tr><td>${f(M.periodSpring(M.DOUBLE.m, M.K))} s → ${f(M.periodSpring(M.DOUBLE.m4, M.K))} s</td><td>${f(M.periodPendulum(M.DOUBLE.L))} s → ${f(M.periodPendulum(M.DOUBLE.L4))} s</td></tr>
      </table>
      <p><b>代入数值。</b>8 kg 的物体挂在 2 N/m 的弹簧上：<i>T</i> = 2π√(8/2) = 4π s。要得到 8π s，由 8π = 2π√(<i>m</i>/2) 得 <i>m</i> = 32 kg：变为四倍。</p>
      <p><b>用比例。</b><i>T</i> ∝ √<i>m</i>，所以 2<i>T</i> ∝ √(<u>&nbsp;?&nbsp;</u><i>m</i>)：什么数的平方根是 2？是 4。<i>k</i> 在分母上，由 2 = √(1/<i>x</i>) 得 ¼。只缩放你改变的量，2π 和 ½ 保持不变。</p>
      <div class="charts">${chart({ x0: 0, x1: 4, y0: 0, y1: 3.5, xlabel: '16 N/m 弹簧上的质量 (kg)', ylabel: '周期 (s)', label: '周期随质量的变化：平方根关系', h: 120,
        series: [{ pts: sample(m => M.periodSpring(m, M.K), 0, 4) }], marks: [[1, M.periodSpring(1, M.K), 'm：1.57 s', 6, 14], [4, M.periodSpring(4, M.K), '4m：3.14 s', -64, 16]] })}</div>
      <p class="hintline">点击任意一组，数一数它们的周期数。</p>`,
    cam: { target: at('double', -0.45, 1.6), az: -12, el: 10, dist: 16.5 }, lit: 'springs4', scene: 'double', look: {},
    fig: '质量 4 倍、摆长 4 倍：周期 2 倍',
  },
  {
    kicker: '6.7', title: '与什么无关', sub: '振幅，以及摆球的质量',
    body: `
      <p class="lede">振幅<b>不</b>影响周期，两个公式里都没有它。</p>
      <p>远处的木块起始位置远一倍。力大一倍，加速度大一倍，在相同时间内走过的距离也大一倍：两者步调始终一致。</p>
      <p>单摆摆球的<b>质量</b>也不影响周期：<i>ma</i> = −<i>mg</i> sin θ，<i>m</i> 被约掉了，与自由落体中一样。${f(M.IGNORE.m2, 0)} kg 的摆球与 ${f(M.IGNORE.m1, 0)} kg 的摆球步调一致。</p>
      <table class="data">
        <tr><th>改变的量</th><th>周期</th></tr>
        <tr><td>弹簧振子的质量 <i>m</i></td><td><i>T</i> ∝ √<i>m</i></td></tr>
        <tr><td>劲度系数 <i>k</i></td><td><i>T</i> ∝ 1/√<i>k</i></td></tr>
        <tr><td>摆长 <i>L</i></td><td><i>T</i> ∝ √<i>L</i></td></tr>
        <tr><td>摆球质量</td><td>不变</td></tr>
        <tr><td>振幅（单摆须为小摆角）</td><td>不变</td></tr>
      </table>`,
    cam: { target: at('ignore', -0.6, 1.2), az: -12, el: 11, dist: 13.5 }, lit: 'amp', scene: 'ignore', look: {},
    fig: '两种振幅、两种质量，各自周期相同',
  },

  {
    kicker: '6.8 · AP 物理 C', title: '简谐运动方程', sub: '为什么答案是余弦',
    body: `
      <p class="lede">把胡克定律代入 Σ<i>F</i> = <i>ma</i>，就得到关于 <i>x</i>(<i>t</i>) 的方程：</p>
      <div class="eq">d²<i>x</i>/d<i>t</i>² = −(<i>k</i>/<i>m</i>) <i>x</i></div>
      <p>试探 <i>x</i> = <i>A</i> cos(ω<i>t</i> + φ)：求两次导数得 −<i>A</i>ω² cos(ω<i>t</i> + φ) = −ω²<i>x</i>。只要 ω = √(<i>k</i>/<i>m</i>) = ${f(M.W, 1)} rad/s，任意 <i>A</i> 和 φ 都满足方程。<i>A</i> 和 φ 由初始条件决定，<i>x</i><sub>0</sub> = <i>A</i> cos φ，<i>v</i><sub>0</sub> = −<i>A</i>ω sin φ：</p>
      <div class="eq"><i>A</i> = √(<i>x</i><sub>0</sub>² + (<i>v</i><sub>0</sub>/ω)²) &nbsp; tan φ = −<i>v</i><sub>0</sub>/ω<i>x</i><sub>0</sub></div>
      <table class="data">
        <tr><th>初始方式</th><th><i>x</i><sub>0</sub>, <i>v</i><sub>0</sub></th><th><i>A</i></th><th>φ</th></tr>
        ${M.STARTS.map((st, i) => `<tr><td>${i ? '推出' : '静止释放'}</td><td>${f(st.x0)} m，${f(st.v0, 1)} m/s</td><td>${f(st.A)} m</td><td>${f(st.phi / M.DEG, 1)}°</td></tr>`).join('')}
      </table>
      <div class="charts">${chart({ x0: 0, x1: 1, xlabels: ['0', '2T'], y0: -0.55, y1: 0.55, ylabels: ['0.5 m', '−0.5'], xlabel: '时间', ylabel: 'x', cursors: ['st0', 'st1'], label: '两种初始方式下位置随时间的变化：周期相同，振幅和初相不同', h: 112,
        series: [{ cls: 'trend', pts: sample(u => M.start(0, u * T2).x, 0, 1, 160) }, { pts: sample(u => M.start(1, u * T2).x, 0, 1, 160) }] })}</div>
      <p class="hintline">虚线：静止释放。实线：推出。点击任一木块。</p>`,
    cam: { target: at('ode', 0.05, 0.45), az: -8, el: 16, dist: 16.5 }, lit: 'starts', scene: 'ode', look: {},
    fig: '一个方程，两种初始条件',
  },
  {
    kicker: '6.9 · AP 物理 C', title: '复摆', sub: '绕轴摆动的刚体',
    body: `
      <p class="lede">刚体的重力作用在质心上，质心在转轴下方距离 <i>d</i> 处，重力的力矩使它转回：</p>
      <div class="eq">τ = −<i>mgd</i> sin θ ≈ −<i>mgd</i> θ</div>
      <p>由 <i>I</i>α = τ 得 d²θ/d<i>t</i>² = −(<i>mgd</i>/<i>I</i>)θ：这是简谐运动，ω = √(<i>mgd</i>/<i>I</i>)，</p>
      <div class="eq"><i>T</i> = 2π√(<i>I</i>/<i>mgd</i>)</div>
      <p><i>I</i> 是对转轴的转动惯量：<i>I</i> = <i>I</i><sub>cm</sub> + <i>md</i>²（平行轴定理）。</p>
      <table class="data">
        <tr><th></th><th><i>I</i></th><th><i>d</i></th><th><i>T</i></th></tr>
        <tr><td>摆球，绳长 <i>L</i></td><td><i>mL</i>²</td><td><i>L</i></td><td>2π√(<i>L</i>/<i>g</i>) = ${f(M.periodPendulum(M.ROD.L))} s</td></tr>
        <tr><td>长 <i>L</i> 的杆，绕一端</td><td>⅓<i>mL</i>²</td><td><i>L</i>/2</td><td>2π√(2<i>L</i>/3<i>g</i>) = ${f(M.ROD.T)} s</td></tr>
        <tr><td>挂在钉子上的圆环</td><td>2<i>mR</i>²</td><td><i>R</i></td><td>2π√(2<i>R</i>/<i>g</i>) = ${f(M.HOOP.T)} s</td></tr>
      </table>
      <div class="charts">${chart({ x0: -5, x1: 0, xlabels: ['5 s 前', '现在'], y0: -9, y1: 9, ylabels: ['+8°', '−8°'], xlabel: '时间', ylabel: 'θ', cursors: ['rodNow', 'strNow'], label: '杆与等长单摆的摆角随时间的变化：杆的周期较短', h: 104,
        series: [{ cls: 'trend', live: 'strTh', fn: t => sample(u => M.pendulum(t + u, M.ROD.L, M.ROD.th0).th / M.DEG, -5, 0, 160) }, { live: 'rodTh', fn: t => sample(u => M.physical(M.ROD, t + u).th / M.DEG, -5, 0, 160) }] })}</div>
      <p class="hintline">实线：杆。虚线：单摆。点击杆。</p>`,
    cam: { target: at('physical', 0.1, 2.1), az: -8, el: 6, dist: 11.5 }, lit: 'rod', scene: 'physical', look: {},
    fig: '单摆、杆和圆环，各绕一个转轴摆动',
  },
  {
    kicker: '6.10 · AP 物理 C', title: '扭摆', sub: '扭过去，再扭回来',
    body: `
      <p class="lede">用金属丝吊起一个圆盘并把它转过一个角度。金属丝会产生与转角成正比的回复力矩，这是转动形式的胡克定律：</p>
      <div class="eq">τ = −κθ &nbsp;⇒&nbsp; <i>T</i> = 2π√(<i>I</i>/κ)</div>
      <p>因为 <i>I</i>α = −κθ 就是弹簧振子的方程，只是把 <i>m</i> 换成 <i>I</i>，把 <i>k</i> 换成 κ，即金属丝的<b>扭转常量</b>，${M.TORS.kappa} N·m/rad。质量 ${f(M.TORS.M, 1)} kg、半径 ${f(M.TORS.R)} m 的圆盘，<i>I</i> = ½<i>MR</i>² = ${f(M.TORS.I, 3)} kg·m²，所以 <i>T</i> = ${f(M.TORS.T, 2)} s。</p>
      <p>这次不需要小角度近似：无论金属丝扭转多大角度（在其限度内），力矩都与 θ 成正比。转角为 ${(M.TORS.th0 / M.DEG).toFixed(0)}° 还是 5°，周期都相同。</p>
      <div class="charts">${chart({ x0: -60, x1: 60, y0: -0.3, y1: 0.3, ylabels: ['0.3 N·m', '−0.3'], xlabels: ['−60°', '60°'], xlabel: '扭转角 θ', ylabel: 'τ', cursors: ['tq'], label: '力矩随扭转角的变化：斜率为 −κ 的直线', h: 120,
        series: [{ pts: [[-60, M.TORS.kappa * 60 * M.DEG], [60, -M.TORS.kappa * 60 * M.DEG]], tag: [12, -0.08, '斜率 −κ'] }] })}</div>
      <p class="hintline">点击圆盘，查看金属丝对它的力矩。</p>`,
    cam: { target: at('torsion', 0.1, 1.9), az: -14, el: 22, dist: 5.9 }, lit: 'disc', scene: 'torsion', look: {},
    fig: '金属丝上扭转的圆盘',
  },
  {
    kicker: '6.11', title: '身边的振动', sub: '汽车与秋千',
    body: `
      <p class="lede">只要回复力随位移增大，物体就会振动。</p>
      <p><b>弹簧上的汽车。</b>${M.CAR.m} kg 的车身装在四根弹簧上，总劲度系数 ${(M.CAR.k / 1000).toFixed(0)} kN/m。在自身重力作用下它下沉 ${f(100 * M.CAR.d, 1)} cm；把它往下压，它就以 <i>T</i> = 2π√(<i>m</i>/<i>k</i>) = ${f(M.CAR.T)} s 的周期上下弹跳。（真实的减震器会在一两个周期内让振动衰减，这里把它关掉了。）</p>
      <p><b>秋千。</b>坐在 ${f(M.SWING.L, 1)} m 长秋千上的孩子就是一个单摆：<i>T</i> = 2π√(<i>L</i>/<i>g</i>) = ${f(M.SWING.T)} s，无论推得轻还是重、孩子轻还是重。所以推秋千要踩准节奏。</p>
      <table class="data cols">
        <tr><th>弹簧振子</th><th>单摆</th></tr>
        <tr><td>回复力 −<i>kx</i></td><td>回复力 −<i>mg</i> sin θ</td></tr>
        <tr><td>总是简谐运动</td><td>小摆角时为简谐运动</td></tr>
        <tr><td>½<i>kA</i>² = ½<i>mv</i><sub>max</sub>²</td><td><i>mg</i>Δ<i>y</i> = ½<i>mv</i><sub>max</sub>²</td></tr>
      </table>`,
    cam: { target: at('life', -1.4, 1.4), az: -12, el: 8, dist: 19.5 }, lit: 'car', scene: 'life', look: {},
    fig: '弹跳的汽车，荡秋千的孩子',
  },
];

// ---------- click a scene: what it breaks into ----------
const phase = t => { const s = M.spring(t); return Math.abs(s.x) > 0.97 * M.A ? '在端点：速度为零，力和加速度最大' : Math.abs(s.x) < 0.03 * M.A ? '在平衡位置：速度最大，不受力' : s.x * s.v < 0 ? '向中间运动：加速' : '向外运动：减速'; };
export const PLATES = {
  spring: { text: `速度（黑色）和加速度（红色）叠加在回复力上。加速度和力一样，总是指向中间；速度则指向木块运动的方向。向中间运动时两者同向，木块加速；向外运动时两者反向，木块减速。`,
    facts: s => { const r = M.spring(s.t); return [['位置 x', `${f(r.x)} m`], ['速度 v', `${f(r.v)} m/s`], ['加速度 a', `${f(r.a)} m/s²`], ['此刻', phase(s.t)]]; } },
  hooke: { text: `木块缩成一个点：这就是它的受力分析图。重力和支持力相互抵消，只剩下弹力，所以弹力就是合力，并且总是指回 x = 0。`,
    facts: s => { const r = M.spring(s.t); return [['位移 x', `${f(r.x)} m`], ['F<sub>s</sub> = −kx', `${f(r.F)} N`], ['a = F<sub>s</sub>/m', `${f(r.a)} m/s²`], ['重力、支持力', `各 ${f(M.WEIGHT)} N，相互抵消`]]; } },
  trace: { text: `红线是笔尖处曲线的切线。纸带每秒移动 ${PAPER} m，所以笔尖每秒的横向移动量，也就是斜率，就是木块的速度。笔尖经过中间时曲线最陡，在两侧边缘处变平。`,
    facts: s => { const r = M.spring(s.t); return [['x', `${f(r.x)} m`], ['斜率 = v', `${f(r.v)} m/s`], ['a', `${f(r.a)} m/s²`], ['t', `${f(s.t % M.T0)} s（周期 ${f(M.T0, 3)} s）`]]; } },
  energy: { text: `能量柱分成两部分。它们的高度时刻在变，但加起来总是达到虚线：½kA²。`,
    facts: s => { const r = M.spring(s.t); return [['动能 ½mv²', `${f(r.KE)} J`], ['弹性势能 ½kx²', `${f(r.U)} J`], ['总能量', `${f(r.KE + r.U)} J`], ['x', `${f(r.x)} m`]]; } },
  hang: { text: `受力分析图。弹簧总是向上拉（这里它始终处于伸长状态），重力向下拉。两者之差就是红色的合力 −ky：在平衡位置为零，在最高点和最低点最大。`,
    facts: s => { const r = M.hang(s.t); return [['离平衡位置的 y', `${f(r.y)} m`], ['弹力 k(d − y)', `${f(r.Fs)} N，向上`], ['重力 mg', `${f(M.WEIGHT)} N，向下`], ['合力 = −ky', `${f(r.net)} N`]]; } },
  pendulum: { text: `重力被它的两个分力（灰色）代替：一个沿绳方向，一个沿圆弧切线方向。沿绳方向，mg cos θ 小于拉力，两者之差使轨迹弯成圆周。沿圆弧方向，mg sin θ 就是回复力：它指回最低点。`,
    facts: s => { const p = M.pendulum(s.t); return [['摆角 θ', `${f(p.th / M.DEG, 1)}°`], ['mg sin θ（回复力）', `${f(Math.abs(p.restoring), 3)} N`], ['mg cos θ', `${f(p.along, 3)} N`], ['拉力 T', `${f(p.tension, 3)} N`], ['速率', `${f(Math.abs(p.v), 3)} m/s`]]; } },
  springs4: { text: `4.0 kg 木块挂在同样的 16 N/m 弹簧上，质量是另一块的四倍。它每完成一次全振动，1.0 kg 木块完成两次。`,
    facts: s => [['1.0 kg：T', `${f(M.periodSpring(1, M.K), 3)} s`], ['4.0 kg：T', `${f(M.periodSpring(4, M.K), 3)} s`], ['已完成的全振动次数', `${f(s.t / M.periodSpring(1, M.K), 1)} 和 ${f(s.t / M.periodSpring(4, M.K), 1)}`]] },
  pend4: { text: `长摆的摆长是短摆的四倍。短摆摆动两次，长摆才摆动一次。`,
    facts: s => [[`${f(M.DOUBLE.L)} m：T`, `${f(M.periodPendulum(M.DOUBLE.L), 3)} s`], [`${f(M.DOUBLE.L4, 1)} m：T`, `${f(M.periodPendulum(M.DOUBLE.L4), 3)} s`], ['已摆动次数', `${f(s.t / M.periodPendulum(M.DOUBLE.L), 1)} 和 ${f(s.t / M.periodPendulum(M.DOUBLE.L4), 1)}`]] },
  amp: { text: `同样的木块、同样的弹簧，其中一个被拉开的距离是另一个的两倍。每一时刻，远的那个位移、受力和速率都是近的两倍，所以它们同时到达端点和中间。`,
    facts: s => [['小振幅：x', `${f(M.spring(s.t, M.IGNORE.A1).x)} m`], ['大振幅：x', `${f(M.spring(s.t, M.IGNORE.A2).x)} m`], ['比值', '始终为 2'], ['两者：T', `${f(M.T0, 3)} s`]] },
  bobs: { text: `质量变为四倍，回复力就变为四倍，要推动的惯性也变为四倍。两者相互抵消，所以两个摆球一起摆动。`,
    facts: s => [['1 kg：mg sin θ', `${f(Math.abs(M.pendulum(s.t, M.IGNORE.L, M.IGNORE.th0, 1).restoring), 3)} N`], ['4 kg：mg sin θ', `${f(Math.abs(M.pendulum(s.t, M.IGNORE.L, M.IGNORE.th0, 4).restoring), 3)} N`], ['两者：T', `${f(M.periodPendulum(M.IGNORE.L), 3)} s`]] },

  starts: { text: `每个木块都是一个红点的影子，红点以 ω = √(k/m) 在半径为 A 的圆上转动。两个点转得一样快，只是从不同的角度 φ、在大小不同的圆上出发。推出的木块对应的点从 53° 处出发，所以这个木块一开始就在向中间运动。`,
    facts: s => [0, 1].map(i => { const r = M.start(i, s.t), st = M.STARTS[i]; return [i ? '推出' : '静止释放', `x ${f(r.x)} m，A ${f(st.A)} m，φ ${f(st.phi / M.DEG, 0)}°`]; }).concat([['ω，两者相同', `${f(M.W, 1)} rad/s`], ['T，两者相同', `${f(M.T0, 3)} s`]]) },
  string: { text: `单摆就是全部质量集中在一点的复摆：I = mL²，d = L，所以 2π√(I/mgd) = 2π√(L/g)。`,
    facts: s => { const p = M.pendulum(s.t, M.ROD.L, M.ROD.th0); return [['摆角', `${f(p.th / M.DEG, 1)}°`], ['I = mL²', `${f(M.ROD.m * M.ROD.L ** 2, 2)} kg·m²`], ['d', `${f(M.ROD.L, 2)} m`], ['T', `${f(M.periodPendulum(M.ROD.L), 3)} s`]]; } },
  rod: { text: `重力作用在质心上，质心在转轴下方 d = L/2 处。重力垂直于杆的分力（红色）力臂为 d，所以 τ = −mgd sin θ。2L/3 处的红色标记是振动中心：摆长等于这个距离的单摆，与杆同步摆动。`,
    facts: s => { const r = M.physical(M.ROD, s.t); return [['摆角', `${f(r.th / M.DEG, 1)}°`], ['τ = −mgd sin θ', `${f(r.torque, 3)} N·m`], ['I = ⅓mL²', `${f(M.ROD.I, 3)} kg·m²`], ['α = τ/I', `${f(r.torque / M.ROD.I, 3)} rad/s²`], ['T', `${f(M.ROD.T, 3)} s`]]; } },
  hoop: { text: `圆环的全部质量都在离圆心 R 处，所以 I_cm = mR²。钉子离圆心也是 R，由平行轴定理再加一个 mR²：I = 2mR²。取 d = R，得 T = 2π√(2R/g)，相当于摆长等于圆环直径的单摆。`,
    facts: s => { const h = M.physical(M.HOOP, s.t); return [['摆角', `${f(h.th / M.DEG, 1)}°`], ['I = 2mR²', `${f(M.HOOP.I, 3)} kg·m²`], ['d = R', `${f(M.HOOP.d)} m`], ['τ', `${f(h.torque, 3)} N·m`], ['T', `${f(M.HOOP.T, 3)} s`]]; } },
  disc: { text: `红色箭头是金属丝对圆盘的力矩：总是指回 θ = 0，扭得越多箭头越长（每 N·m 对应 ${TQ_ARC} rad 的弧）。在 θ = 0 处力矩为零，圆盘转得最快。`,
    facts: s => { const r = M.torsion(s.t); return [['扭转角 θ', `${f(r.th / M.DEG, 1)}°`], ['τ = −κθ', `${f(r.torque, 3)} N·m`], ['α = τ/I', `${f(r.alpha, 2)} rad/s²`], ['角速率', `${f(Math.abs(r.om), 2)} rad/s`], ['T', `${f(M.TORS.T, 3)} s`]]; } },
  car: { text: `车身在四根弹簧上上下运动，就像一个质量挂在一根劲度系数等于四者之和的弹簧上。它的加速度（红色）指回静止时的高度，在每次弹跳的最高点和最低点最大。`,
    facts: s => { const r = M.shm(M.CAR.A, Math.sqrt(M.CAR.k / M.CAR.m), s.t); return [['离静止高度', `${f(100 * r.x, 1)} cm`], ['加速度', `${f(r.a)} m/s²`], ['周期', `${f(M.CAR.T, 3)} s`], ['频率', `${f(1 / M.CAR.T, 2)} Hz`]]; } },
  swing: { text: `秋千就是一个单摆，摆长从树枝量到孩子的质心。它的周期只取决于摆长和 g。`,
    facts: s => { const p = M.pendulum(s.t, M.SWING.L, M.SWING.th0, M.SWING.m); return [['摆角', `${f(p.th / M.DEG, 1)}°`], ['速率', `${f(Math.abs(p.v))} m/s`], ['周期', `${f(M.SWING.T, 2)} s`], ['回复力', `${f(Math.abs(p.restoring), 1)} N`]]; } },
};
