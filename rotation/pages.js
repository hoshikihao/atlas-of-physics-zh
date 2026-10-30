// Chapter 7, page by page (after the AP Physics 1 organizer, Unit 8, with the AP Physics C additions). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, V_SCALE, A_SCALE, F_LIGHT, F_HEAVY, F_SHAPES, RACE_V, F_PAX, F_WRENCH, F_SLIP, P_SCALE, LP_SCALE, ZH } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const dg = r => (r * 180 / Math.PI).toFixed(1);
const cm = s => `${(s * 100).toFixed(s * 100 < 1 ? 1 : 0)} cm`;

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
const sx = (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy = (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b);
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursors = [], label, zero = false }) {
  const X = x => sx(x, x0, x1), Y = y => sy(y, y0, y1);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${X(s.tag[0]) + 4}" y="${Y(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${X(x)}" cy="${Y(y)}" r="3.5"/><text class="ax" x="${X(x) + dx}" y="${Y(y) + dy}">${t}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${zero ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${Y(0)}" y2="${Y(0)}"/>` : ''}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${Y(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${Y(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(c => `<circle class="cursor" r="4.5" cx="-20" cy="-20" data-cursor="${c}"/>`).join('')}
  </svg>`;
}
export const CH = { sx, sy };
const curvePts = (fn, a, b, n = 60) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });

// race: where the energy goes, a stacked bar per racer
function energyBars() {
  const bw = W - 150 - P.r, rowH = 30, top = 22, mgh = M.RACE.m * M.G * M.RACE.h;
  const rows = M.RACE.list.map((o, i) => {
    const kt = 1 / (1 + o.f), y = top + i * rowH;
    return `<text class="ax" x="${140}" y="${y + 14}" text-anchor="end">${ZH[o.name]}</text>
      <rect class="bar" x="150" y="${y}" width="${(bw * kt).toFixed(1)}" height="18"/>
      <rect x="${(150 + bw * kt).toFixed(1)}" y="${y}" width="${(bw * (1 - kt)).toFixed(1)}" height="18" fill="#8a8a8f"/>
      <text class="ax" x="${155}" y="${y + 13}">${Math.round(kt * 100)}%</text>`;
  }).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${top + 4 * rowH + 22}" role="img" aria-label="各参赛物体动能中平动与转动所占的比例">
    <text class="lab" x="150" y="14">到达底部时 mgh = ${f(mgh)} J →</text>${rows}
    <rect class="bar" x="150" y="${top + 4 * rowH + 4}" width="12" height="10"/><text class="ax" x="168" y="${top + 4 * rowH + 13}">½mv²（平动）</text>
    <rect x="290" y="${top + 4 * rowH + 4}" width="12" height="10" fill="#8a8a8f"/><text class="ax" x="308" y="${top + 4 * rowH + 13}">½Iω²（转动）</text>
  </svg>`;
}

const at = (k, dy = 0.5) => [STATIONS[k], dy, 0];
const R0 = M.ROD, PX = M.PAX.list, WR = M.WRENCH, B = M.BOWL, IM = M.IMP.list, HT = M.HIT;
const D = M.DOOR.cases, [ring, discS, sphere] = M.SHAPES.list, sk0 = M.skater(0.2), sk1 = M.skater(4);

export const PAGES = [
  {
    kicker: '第 7 章', title: '转动', sub: '用描述运动的语言描述转动',
    body: `
      <p class="lede">转动的轮子上，每一点在相同时间内都转过相同的<b>角度</b> θ（以弧度计）。所以我们用角量来描述整个轮子：ω = Δθ/Δt，单位 rad/s；α = Δω/Δt，单位 rad/s²。</p>
      <p>取逆时针为正。这个轮子以 ${f(M.WHEEL.alpha, 1)} rad/s² 加速，然后以同样大小的角加速度制动。加速时，ω 与 α <b>同号</b>；减速时，两者<b>异号</b>。把 x → θ、v → ω、a → α，匀变速直线运动公式照样适用：</p>
      <table class="data eqs">
        <tr><td>ω = ω<sub>0</sub> + αt</td><td>不含 Δθ</td></tr>
        <tr><td>Δθ = ω<sub>0</sub>t + ½αt²</td><td>不含 ω</td></tr>
        <tr><td>ω² = ω<sub>0</sub>² + 2αΔθ</td><td>不含 t</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: 4.8, y0: 0, y1: 4, xlabel: '时间 (s)', ylabel: 'ω (rad/s)', cursors: ['wheelW'], label: '角速度随时间的变化：先增大后减小',
        series: [{ pts: curvePts(t => M.wheel(t).w, 0, M.WHEEL.run, 48), tag: [0.5, 1.6, 'α > 0'] }, { cls: 'trend', pts: [], tag: [3.5, 2.4, 'α < 0'] }] })}</div>
      <p class="hintline">点击轮子，查看它转过的角度。</p>`,
    cam: { target: [STATIONS.wheel, 1.15, 0], az: -14, el: 6, dist: 7.2 }, lit: 'wheel', scene: 'wheel', look: {},
    fig: '先加速、再制动的轮子',
  },
  {
    kicker: '7.1', title: '两位乘客', sub: 'v = rω',
    body: `
      <p class="lede">在旋转木马上，两位乘客的 ω 相同。边缘处的乘客在相同时间内绕更大的圆转一圈，所以她运动得更快：半径加倍，速率也加倍。</p>
      <table class="data">
        <tr><th></th><th>线量</th><th>角量</th><th>关系</th></tr>
        <tr><td>位移</td><td>Δx</td><td>Δθ</td><td>s = rΔθ</td></tr>
        <tr><td>速度</td><td>v</td><td>ω</td><td>v = rω</td></tr>
        <tr><td>加速度</td><td>a<sub>t</sub></td><td>α</td><td>a<sub>t</sub> = rα</td></tr>
      </table>
      <p>由于运动方向在改变，每位乘客还有指向中心的向心加速度 a<sub>c</sub> = rω²。</p>
      <div class="charts">${chart({ x0: 0, x1: 5, y0: 0, y1: 2.5, xlabel: '时间 (s)', ylabel: '速率 v (m/s)', cursors: ['disc1', 'disc2'], label: '两位乘客的速率随时间的变化',
        series: [{ pts: curvePts(t => M.DISC.r2 * M.disc(t).w, 0, M.DISC.run, 50), tag: [3.3, 1.75, `r = ${M.DISC.r2} m`] }, { pts: curvePts(t => M.DISC.r1 * M.disc(t).w, 0, M.DISC.run, 50), tag: [3.75, 0.12, `r = ${M.DISC.r1} m`] }] })}</div>
      <p class="hintline">点击把每位乘客的加速度分解。v：每 m/s 对应 ${cm(V_SCALE)}；a：每 m/s² 对应 ${cm(A_SCALE)}。</p>`,
    cam: { target: [STATIONS.disc, 0.7, 0], az: -10, el: 42, dist: 10.5 }, lit: 'disc', scene: 'disc', look: {},
    fig: '两位乘客，同一个 ω',
  },
  {
    kicker: '7.2', title: '力矩', sub: '使物体转动的原因',
    body: `
      <p class="lede">推门时，只有作用点离开门轴、且不正对门轴推，门才会转。力的转动效果就是<b>力矩</b>，单位 N·m：</p>
      <div class="eq">τ = rF sin φ = F × 力臂</div>
      <p>r 从门轴指向推力的作用点，φ 是 r 与 F 的夹角。只有垂直于门的分力 F sin φ 能使门转动。</p>
      <table class="data">
        <tr><th>同样 ${f(M.DOOR.F, 0)} N 的推力</th><th>τ (N·m)</th></tr>
        ${D.map(c => `<tr><td>${ZH[c.name]}</td><td>${f(c.tau)}</td></tr>`).join('')}
      </table>
      <div class="charts">${chart({ x0: 0, x1: 180, y0: 0, y1: 10, xlabel: 'r 与 F 的夹角 φ (°)', ylabel: 'τ (N·m)', label: '两种距离下力矩随推力角度的变化',
        series: [{ pts: curvePts(p => M.torque(0.85, M.DOOR.F, p), 0, 180), tag: [122, 7.6, 'r = 0.85 m'] }, { pts: curvePts(p => M.torque(0.425, M.DOOR.F, p), 0, 180), tag: [118, 1.4, 'r = 0.425 m'] }],
        marks: [[90, D[0].tau, '', 0, 0], [90, D[1].tau, '', 0, 0], [30, D[2].tau, '30°', -26, -6]] })}</div>
      <p class="hintline">点击门，画出每个力的力臂。箭头：每牛顿对应 ${cm(F_LIGHT)}。</p>`,
    cam: { target: [STATIONS.doors + 0.05, 0.6, -0.4], az: -14, el: 48, dist: 14.5 }, lit: 'doors', scene: 'doors', look: {},
    fig: '同样的推力，三种力矩',
  },
  {
    kicker: '7.3', title: '平衡', sub: '不平动，也不转动',
    body: `
      <p class="lede">一座木板桥，一只 ${M.PLANK.m} kg 的箱子从上面缓慢滑过。要保持静止，必须 Σ<i>F</i> = 0 <i>且</i> Στ = 0。</p>
      <p>对未知量最多的点取力矩：支点 A，<i>F</i><sub>A</sub> 在这里没有力臂。逆时针为 +，顺时针为 −：</p>
      <div class="eq">L·F<sub>B</sub> − (L/2)·Mg − x·mg = 0</div>
      <p>再由 Σ<i>F</i> = 0 得 <i>F</i><sub>A</sub> = (M + m)g − <i>F</i><sub>B</sub>。箱子离哪个支点越近，那个支点承担的力就越大。</p>
      <div class="charts">${chart({ x0: 0, x1: 4, y0: 0, y1: 400, xlabel: '箱子到 A 的距离 x (m)', ylabel: '支持力 (N)', cursors: ['plankA', 'plankB'], label: '支持力随箱子位置的变化',
        series: [{ pts: curvePts(x => M.plank(x).FA, 0, 4, 4), tag: [3.55, M.plank(3.55).FA + 4, 'F<tspan baseline-shift="sub" font-size="8">A</tspan>'] }, { pts: curvePts(x => M.plank(x).FB, 0, 4, 4), tag: [3.55, M.plank(3.55).FB - 60, 'F<tspan baseline-shift="sub" font-size="8">B</tspan>'] }] })}</div>
      <p class="hintline">点击木板，查看对 A 的力矩。箭头：每牛顿对应 ${cm(F_HEAVY)}。</p>`,
    cam: { target: [STATIONS.plank, 1.3, 0], az: -14, el: 10, dist: 13 }, lit: 'plank', scene: 'plank', look: {},
    fig: `${M.PLANK.M} kg 的木板，${M.PLANK.m} kg 的箱子`,
  },
  {
    kicker: '7.4', title: '梯子', sub: '能斜到多低？',
    body: `
      <p class="lede">一架 ${M.LADDER.m} kg 的梯子立在粗糙地面上，靠着光滑墙壁，墙只能沿水平方向向外推。</p>
      <p>力：<i>F</i><sub>N</sub> = mg，<i>f</i><sub>s</sub> = <i>F</i><sub>w</sub>。对梯脚 O 取力矩，有两个力不产生力矩：</p>
      <div class="eq">(L sin θ)·F<sub>w</sub> = (½L cos θ)·mg</div>
      <p>梯子越低，梯脚需要的摩擦力越大。摩擦力最大为 μ<sub>s</sub>mg，所以倾角低于 θ<sub>min</sub>（tan θ<sub>min</sub> = 1/(2μ<sub>s</sub>)）时梯子就会滑倒：μ<sub>s</sub> = ${f(M.LADDER.muS)} 时为 ${dg(M.LADDER.thMin)}°，与梯子的质量和长度无关。</p>
      <div class="charts">${chart({ x0: 40, x1: 85, y0: 0, y1: 120, xlabel: '梯子倾角 θ (°)', ylabel: '所需摩擦力 (N)', cursors: ['ladder'], label: '所需摩擦力随梯子倾角的变化',
        series: [{ pts: curvePts(d => Math.min(M.ladder(d * Math.PI / 180).f, 120), 41.2, 85) }, { cls: 'trend', pts: [[40, M.LADDER.muS * M.LADDER.W], [85, M.LADDER.muS * M.LADDER.W]], tag: [64, M.LADDER.muS * M.LADDER.W + 4, '最大静摩擦力'] }],
        marks: [[dg(M.LADDER.thMin), M.LADDER.muS * M.LADDER.W, `θ<tspan baseline-shift="sub" font-size="8">min</tspan> = ${dg(M.LADDER.thMin)}°`, -62, 22]] })}</div>
      <p class="hintline">点击梯子，查看对 O 的力臂。箭头：每牛顿对应 ${cm(F_HEAVY)}。</p>`,
    cam: { target: [STATIONS.ladder + 0.15, 1.45, 0], az: -18, el: 8, dist: 11.5 }, lit: 'ladder', scene: 'ladder', look: {},
    fig: '粗糙地面上的梯子',
  },
  {
    kicker: '7.5', title: '转动惯量', sub: 'Στ = Iα',
    body: `
      <p class="lede">转动形式的牛顿第二定律是 Στ = Iα。<b>转动惯量</b> I = Σmr² 扮演质量的角色，离转轴越远的质量贡献越大。</p>
      <p>每个物体的质量都是 ${f(M.SHAPES.M, 1)} kg，半径都是 ${f(M.SHAPES.R, 1)} m，绕在边缘的细绳上都施加相同的 ${f(M.SHAPES.F, 1)} N 拉力：τ = ${f(M.SHAPES.tau)} N·m。</p>
      <table class="data">
        <tr><th></th><th>I = fMR²</th><th>α = τ/I</th></tr>
        ${M.SHAPES.list.map(s => `<tr><td>${ZH[s.key]}</td><td>${s.frac === '1' ? '' : s.frac}MR²</td><td>${f(s.alpha)} rad/s²</td></tr>`).join('')}
      </table>
      <div class="charts">${chart({ x0: 0, x1: 2.4, y0: 0, y1: 8, xlabel: '时间 (s)', ylabel: 'ω (rad/s)', cursors: ['sh0', 'sh1', 'sh2'], label: '圆环、圆盘和实心球的角速度',
        series: M.SHAPES.list.map(s => ({ pts: [[0, 0], [2.4, s.alpha * 2.4]], tag: [1.75, s.alpha * 1.75 + (s.key === 'sphere' ? 0.5 : s.key === 'disc' ? -0.3 : 0), ZH[s.key]] })) })}</div>
      <p class="hintline">点击这些物体，把圆盘切成圆环。箭头：每牛顿对应 ${cm(F_SHAPES)}。</p>`,
    cam: { target: [STATIONS.inertia, 1.15, 0], az: -10, el: 22, dist: 10.2 }, lit: 'inertia', scene: 'inertia', look: {},
    fig: '同样的力矩，三种形状',
  },
  {
    kicker: '7.6 · AP 物理 C', title: '求转动惯量', sub: 'I = ∫ r² dm',
    body: `
      <p class="lede">把物体切成小块 dm，把每块的 r² dm 加起来：I = ∫ r² dm。结果取决于转轴的位置。</p>
      <p>均匀细杆（${f(R0.M, 1)} kg，${f(R0.L, 1)} m）的 λ = M/L，所以小段 dx 的质量 dm = λ dx。圆盘由许多细圆环组成，每个圆环 dm = σ·2πr dr（σ = M/πR²）：</p>
      <table class="data">
        <tr><td>细杆，转轴过中点</td><td>∫<sub>−L/2</sub><sup>L/2</sup> λx² dx</td><td><sup>1</sup>⁄<sub>12</sub>ML²</td></tr>
        <tr><td>细杆，转轴过一端</td><td>∫<sub>0</sub><sup>L</sup> λx² dx</td><td>⅓ML²</td></tr>
        <tr><td>圆盘，转轴过圆心</td><td>∫<sub>0</sub><sup>R</sup> r²·σ2πr dr</td><td>½MR²</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: 1.2, y0: 0, y1: 1.8, xlabel: '到转轴的距离 r (m)', ylabel: 'dI/dr = λr² (kg·m)', cursors: ['integE', 'integC'], label: '细杆每米长度对 I 的贡献随到转轴距离的变化',
        series: [{ cls: 'bar', pts: [[0, 0], ...curvePts(r => R0.lam * r * r, 0, 1.2, 40), [1.2, 0]] }, { pts: curvePts(r => R0.lam * r * r, 0, 1.2, 40), tag: [0.25, 1.0, `一端：0→L 的面积 = ${f(R0.Iend, 2)}`] }, { cls: 'trend', pts: [[0.6, 0], [0.6, 1.8]], tag: [0.62, 0.15, `中点：2 × (0→L/2) = ${f(R0.Icm, 2)}`] }] })}</div>
      <p class="hintline">点击把小段和圆环分开，比较求和与积分的结果。</p>`,
    cam: { target: [STATIONS.integ - 0.3, 1.0, 0], az: -10, el: 22, dist: 14.5 }, lit: 'integ', scene: 'integ', look: {},
    fig: '小段与圆环',
  },
  {
    kicker: '7.7 · AP 物理 C', title: '平行轴定理', sub: 'I = I<sub>cm</sub> + Md²',
    body: `
      <p class="lede">把转轴从质心平移距离 d，I 就增加 Md²：</p>
      <div class="eq">I = I<sub>cm</sub> + Md²</div>
      <p>转轴在杆的一端时，d = L/2：<sup>1</sup>⁄<sub>12</sub>ML² + M(L/2)² = ⅓ML²（绕合页转动的门：⅓MW²）。所以同样的 τ = ${f(M.PAX.tau)} N·m 使它转起来的角加速度只有四分之一。</p>
      <table class="data">
        <tr><th>转轴位置</th><th>I<sub>cm</sub></th><th>Md²</th><th>I</th><th>α = τ/I</th></tr>
        ${PX.map(p => `<tr><td>${ZH[p.key]}</td><td>${f(R0.Icm)}</td><td>${f(R0.M * p.d * p.d)}</td><td>${f(p.I)}</td><td>${f(p.alpha)}</td></tr>`).join('')}
      </table>
      <div class="charts">${chart({ x0: 0, x1: 2.4, y0: 0, y1: 4.5, xlabel: '时间 (s)', ylabel: 'ω (rad/s)', cursors: ['pax0', 'pax1'], label: '两根杆的角速度随时间的变化',
        series: PX.map((p, i) => ({ pts: [[0, 0], [2.4, p.alpha * 2.4]], tag: i ? [1.25, p.alpha * 1.25 + 0.15, '转轴在一端'] : [0.75, 2.2, '转轴在中点'] })) })}</div>
      <p class="hintline">点击杆，查看距离 d。箭头：每牛顿对应 ${cm(F_PAX)}。</p>`,
    cam: { target: [STATIONS.parallel - 0.45, 0.8, 0.15], az: -10, el: 55, dist: 11 }, lit: 'parallel', scene: 'parallel', look: {},
    fig: '同样的推力，两种转轴',
  },
  {
    kicker: '7.8', title: '功和功率', sub: 'W = τΔθ，P = τω',
    body: `
      <p class="lede">用 ${f(WR.F, 0)} N 的力推 ${f(WR.r, 2)} m 长的扳手拧螺母。手沿圆弧 s = rΔθ 移动，所以它做的功是</p>
      <div class="eq">W = F·s = F·rΔθ = τΔθ</div>
      <p>这是 W = Fd 在转动中的对应形式。做功的快慢就是功率，对应于 P = Fv：</p>
      <div class="eq">P = τω</div>
      <p>这里 τ = ${f(WR.tau, 0)} N·m，匀速转动 ${f(WR.w, 1)} rad/s：P = ${f(WR.P, 0)} W，拧过 120° 做功 ${f(M.wrench(9).W, 1)} J。螺纹的摩擦使 ω 保持不变，所以这些功变成了热，而不是转动动能。没有摩擦时，它会变成 ½Iω²。</p>
      <div class="charts">${chart({ x0: 0, x1: 2.2, y0: 0, y1: 45, xlabel: '转过的角度 Δθ (rad)', ylabel: '功 W (J)', cursors: ['wrench'], label: '功随转过角度的变化：斜率为 τ 的直线',
        series: [{ pts: [[0, 0], [WR.stroke, WR.tau * WR.stroke]], tag: [0.95, WR.tau * 0.95 + 2, `斜率 = τ = ${f(WR.tau, 0)} N·m`] }],
        marks: [[WR.stroke, WR.tau * WR.stroke, '120°', -36, 4]] })}</div>
      <p class="hintline">点击扳手，查看半径和圆弧。箭头：每牛顿对应 ${cm(F_WRENCH)}。</p>`,
    cam: { target: [STATIONS.wrench + 0.08, 0.15, 0.12], az: -14, el: 48, dist: 3.6 }, lit: 'wrench', scene: 'wrench', look: {},
    fig: '拧螺母的扳手',
  },
  {
    kicker: '7.9', title: '滚动', sub: '斜面上的比赛',
    body: `
      <p class="lede">实心球、圆盘和圆环从静止开始沿 ${dg(M.RACE.theta)}° 的斜面滚下，旁边一只箱子在冰面上滑下。滚动的物体必须把一部分能量用于转动：</p>
      <div class="eq">mgh = ½mv² + ½Iω²</div>
      <p>由 I = fmR² 和 ω = v/R，得 v² = 2gh/(1 + f)。质量和半径都约掉了；形状因子 f 越小，速度越快。箱子最先到达，然后依次是实心球、圆盘、圆环。<i>向上</i>滚上坡时，转动动能能让它多升高一些。</p>
      <div class="charts">${energyBars()}</div>
      <p class="hintline">点击参赛物体，看看滚动的圆盘是怎样运动的。箭头：每 m/s 对应 ${cm(RACE_V)}。</p>`,
    cam: { target: [STATIONS.race + 0.15, 0.6, 0], az: -14, el: 36, dist: 12.5 }, lit: 'race', scene: 'race', look: {},
    fig: '箱子、实心球、圆盘、圆环',
  },
  {
    kicker: '7.10 · AP 物理 C', title: '先滑后滚', sub: '保龄球',
    body: `
      <p class="lede">保龄球以 ${f(B.v0, 1)} m/s 离手，没有转动。它的底部在打滑，所以滑动摩擦力 μ<sub>k</sub>mg 向后作用：它使球减速，同时作用在距球心 R 处，使球转得越来越快。</p>
      <table class="data cols">
        <tr><th>平动：ΣF = ma</th><th>转动：Στ = Iα，I = ⅖mR²</th></tr>
        <tr><td>v = v<sub>0</sub> − μ<sub>k</sub>g t</td><td>ω = (5μ<sub>k</sub>g / 2R) t</td></tr>
      </table>
      <p>一旦 v = Rω，它就开始纯滚动：</p>
      <div class="eq">t* = 2v<sub>0</sub> / 7μ<sub>k</sub>g,&nbsp; v = <sup>5</sup>⁄<sub>7</sub>v<sub>0</sub></div>
      <p>μ<sub>k</sub> = ${f(B.muK, 1)} 时：t* = ${f(B.tStar)} s，滑行 ${f(B.xStar)} m，之后以 ${f(B.vf)} m/s 滚动。有 ${f(0.5 * B.m * B.v0 ** 2 - M.bowl(9).K, 1)} J 变成了热。</p>
      <div class="charts">${chart({ x0: 0, x1: 1.1, y0: 0, y1: 2.6, xlabel: '时间 (s)', ylabel: '速率 (m/s)', cursors: ['slipV', 'slipW'], label: '球的速率 v 与边缘速率 Rω 随时间的变化，在 t* 时相等',
        series: [{ pts: curvePts(t => M.bowl(t).v, 0, 1.1, 50), tag: [0.22, 2.0, 'v'] }, { pts: curvePts(t => B.R * M.bowl(t).w, 0, 1.1, 50), tag: [0.24, 0.15, 'Rω'] }],
        marks: [[B.tStar, B.vf, 't*', 4, 18]] })}</div>
      <p class="hintline">点击球，看看它的底部滑得多快。v：每 m/s 对应 ${cm(RACE_V)}；f：每牛顿对应 ${cm(F_SLIP)}。</p>`,
    cam: { target: [STATIONS.slip, 0.15, 0], az: -8, el: 18, dist: 7.2 }, lit: 'slip', scene: 'slip', look: {},
    fig: '滑着出手',
  },
  {
    kicker: '7.11', title: '水井', sub: '力与力矩共同作用',
    body: `
      <p class="lede">一只 ${f(M.WELL.m, 1)} kg 的水桶挂在绳上，绳绕在 ${f(M.WELL.M, 1)} kg 的辘轳（实心圆柱）上。松手后，水桶下落，辘轳越转越快。</p>
      <table class="data cols">
        <tr><th>水桶：ΣF = ma</th><th>辘轳：Στ = Iα，a = rα</th></tr>
        <tr><td>mg − T = ma</td><td>rT = ½Mr²·(a/r)，所以 T = ½Ma</td></tr>
      </table>
      <div class="eq">a = mg / (m + ½M) = ${f(M.WELL.a)} m/s²</div>
      <p>T = ${f(M.WELL.T)} N，小于重力。辘轳越重，水桶下落越慢。</p>
      <div class="charts">${chart({ x0: 0, x1: 1.2, y0: 0, y1: 8, xlabel: '时间 (s)', ylabel: '水桶速率 (m/s)', cursors: ['well'], label: '水桶速率随时间的变化，与自由落体比较',
        series: [{ pts: [[0, 0], [M.WELL.run, M.WELL.a * M.WELL.run]], tag: [0.78, M.WELL.a * 0.78 - 1.6, '绕在辘轳上'] }, { cls: 'trend', pts: [[0, 0], [0.64, M.G * 0.64]], tag: [0.5, M.G * 0.5 + 0.6, '自由落体'] }] })}</div>
      <p class="hintline">点击水井，与自由落体比较。箭头：每牛顿对应 ${cm(F_LIGHT)}。</p>`,
    cam: { target: [STATIONS.well + 0.25, 2.05, 0], az: 22, el: 8, dist: 14 }, lit: 'well', scene: 'well', look: {},
    fig: '水桶和辘轳',
  },
  {
    kicker: '7.12', title: '角冲量', sub: 'τΔt = ΔL',
    body: `
      <p class="lede">转动的物体具有<b>角动量</b> L = Iω。力矩会改变角动量，就像力会改变 p：</p>
      <div class="eq">Στ = ΔL/Δt，所以 τΔt = ΔL</div>
      <p>τΔt 是<b>角冲量</b>，即 τ–t 图线下的面积。两个相同的旋转木马（I = ½MR² = ${f(M.IMP.I, 0)} kg·m²）在边缘各被推一次：A 用力大、时间短，B 用力小、时间长。两块面积相等，所以它们最终的 L 相同，ω 也相同，都是 ${f(IM[0].wf)} rad/s。</p>
      <div class="charts">${chart({ x0: 0, x1: 3, y0: 0, y1: 300, xlabel: '时间 (s)', ylabel: '力矩 τ (N·m)', cursors: ['impT0', 'impT1'], label: '两次推动的力矩随时间的变化：面积相等',
        series: [{ cls: 'bar', pts: [[0, 0], [0, IM[1].tau], [IM[1].dt, IM[1].tau], [IM[1].dt, 0]], tag: [1.55, IM[1].tau - 30, `B：${IM[1].tau} × ${IM[1].dt} = ${IM[1].J}`] }, { pts: [[0, 0], [0, IM[0].tau], [IM[0].dt, IM[0].tau], [IM[0].dt, 0], [3, 0]], tag: [0.65, IM[0].tau - 50, `A：${IM[0].tau} × ${IM[0].dt} = ${IM[0].J}`] }] })}</div>
      <p class="hintline">点击旋转木马，查看力臂。箭头：每牛顿对应 ${cm(F_HEAVY)}。</p>`,
    cam: { target: [STATIONS.impulse, 0.5, 0.2], az: -10, el: 36, dist: 16.5 }, lit: 'impulse', scene: 'impulse', look: {},
    fig: '用力大而短，用力小而长',
  },
  {
    kicker: '7.13', title: '旋转', sub: '角动量，L = Iω',
    body: `
      <p class="lede">没有外力矩时，<b>角动量</b> L = Iω 不会改变：I<sub>0</sub>ω<sub>0</sub> = I<sub>f</sub>ω<sub>f</sub>。</p>
      <p>滑冰者两臂平伸、手持 ${f(M.SKATE.m, 1)} kg 的哑铃旋转，然后把哑铃举过头顶。冰面几乎不提供力矩。质量向内收，I 减小，ω 就增大。L 保持不变，但 K<sub>r</sub> 增大了：她的手臂做了功。</p>
      <table class="data">
        <tr><th></th><th>两臂平伸</th><th>两臂上举</th></tr>
        <tr><td>I (kg·m²)</td><td>${f(sk0.I)}</td><td>${f(sk1.I)}</td></tr>
        <tr><td>ω (rad/s)</td><td>${f(sk0.w)}</td><td>${f(sk1.w)}</td></tr>
        <tr><td>L = Iω</td><td>${f(sk0.L)}</td><td>${f(sk1.L)}</td></tr>
        <tr><td>K<sub>r</sub> = ½Iω² (J)</td><td>${f(sk0.K)}</td><td>${f(sk1.K)}</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: +M.SKATE.run.toFixed(1), y0: 0, y1: 5, xlabel: '时间 (s)', ylabel: 'ω (rad/s)', cursors: ['skater'], label: '滑冰者角速度随时间的变化',
        series: [{ pts: curvePts(t => M.skater(t).w, 0, M.SKATE.run, 120) }] })}</div>
      <p class="hintline">点击滑冰者，查看哑铃原来的位置。</p>`,
    cam: { target: [STATIONS.skater, 1.3, 0], az: -16, el: 16, dist: 9.6 }, lit: 'skater', scene: 'skater', look: {},
    fig: '收臂，转速加快',
  },
  {
    kicker: '7.14 · AP 物理 C', title: '质点的角动量', sub: 'L = r × p',
    body: `
      <p class="lede">沿直线滑动的球对点 O 也有角动量：</p>
      <div class="eq">L = r × p, |L| = mvr sin φ = mvr<sub>⊥</sub></div>
      <p>r<sub>⊥</sub> = d 是 O 到运动路线的距离。球滑动时，r 和 φ 都在变，但 r sin φ 始终等于 d：沿直线运动时 <b>L 保持不变</b>。随后它撞上一根绕 O 转动的 ${f(HT.M, 1)} kg 细杆。转轴对 O 没有力矩，所以对 O 的 L 守恒：</p>
      <div class="eq">mv<sub>0</sub>d = −mv<sub>f</sub>d + ⅓ML²ω</div>
      <p>弹性碰撞：${f(HT.m, 1)} kg 的球以 ${f(-HT.v1)} m/s 弹回；细杆以 ${f(HT.w)} rad/s 转动。</p>
      <div class="charts">${chart({ x0: 0, x1: 2.1, y0: -0.4, y1: 1.4, zero: true, xlabel: '时间 (s)', ylabel: '对 O 的 L (kg·m²/s)', cursors: ['hitB', 'hitR', 'hitL'], label: '球、细杆及总角动量随时间的变化',
        series: [{ pts: [[0, M.hit(0).Lb], [HT.tHit, M.hit(0).Lb], [HT.tHit, M.hit(9).Lb], [2.1, M.hit(9).Lb]], tag: [1.5, M.hit(9).Lb + 0.01, '球'] }, { cls: 'trend', pts: [[0, 0], [HT.tHit, 0], [HT.tHit, HT.I * HT.w], [2.1, HT.I * HT.w]], tag: [1.3, HT.I * HT.w + 0.02, '细杆'] }, { cls: 'curve total', pts: [[0, M.hit(0).L], [2.1, M.hit(0).L]], tag: [0.15, M.hit(0).L - 0.22, '总角动量'] }] })}</div>
      <p class="hintline">点击把 L 画成矢量。p：每 kg·m/s 对应 ${cm(P_SCALE)}。</p>`,
    cam: { target: [STATIONS.particle - 0.4, 0.15, 0.15], az: -14, el: 52, dist: 8.5 }, lit: 'particle', scene: 'particle', look: {},
    fig: '球、转轴和细杆',
  },
];

// ---------- click a scene: what it breaks into ----------
const turns = th => (th / (2 * Math.PI));
export const PLATES = {
  wheel: { text: `虚线是做了标记的辐条的起始位置；灰色圆弧是它此后转过的角度 θ，以弧度计。气门嘴沿轮缘走过了弧长 s = rθ。轮子上每一点转过的 θ 都相同，但越靠外的点走过的路程越长。转一整圈的角位移是 2π rad，尽管气门嘴回到了原处（线位移为零）。`,
    facts: s => { const q = M.wheel(s.wheel.t); return [['θ', `${f(q.th)} rad = ${f(turns(q.th))} 圈`], ['弧长 s = rθ', `${f(M.WHEEL.R * q.th)} m`], ['ω', `${f(q.w)} rad/s`], ['α', `${f(q.a)} rad/s²`], ['轮缘速率 v = rω', `${f(M.WHEEL.R * q.w)} m/s`]]; } },
  disc: { text: `每位乘客的加速度都分成两部分。a<sub>t</sub>（沿轨迹切向）改变她的速率；木马加速时它向前，减速时向后。a<sub>c</sub>（指向中心）使她沿圆周转弯，随 ω² 增大。红色箭头是两者之和，a = r√(ω⁴ + α²)。半径加倍，两者都加倍。`,
    facts: s => { const q = M.disc(s.disc.t), p1 = M.pointAt(M.DISC.r1, q), p2 = M.pointAt(M.DISC.r2, q); return [['ω、α（共同）', `${f(q.w)} rad/s，${f(q.a)} rad/s²`], [`r = ${M.DISC.r1} m：v、a<sub>t</sub>、a<sub>c</sub>`, `${f(p1.v)}，${f(p1.at)}，${f(p1.ac)}`], [`r = ${M.DISC.r2} m：v、a<sub>t</sub>、a<sub>c</sub>`, `${f(p2.v)}，${f(p2.at)}，${f(p2.ac)}`]]; } },
  doors: { text: `把每个力沿其<b>作用线</b>（虚线）延长。<b>力臂</b> r<sub>⊥</sub> 是门轴到这条线的最短距离，与作用线垂直。τ = F·r<sub>⊥</sub>。右边那扇门上的推力分解为 F<sub>⊥</sub> 和 F<sub>∥</sub>：F<sub>⊥</sub> 使门转动，F<sub>∥</sub> 沿门推向门轴，对转动毫无作用。r 减半，或把推力倾斜到 30°（sin 30° = ½），力矩都减半。`,
    facts: () => D.map(c => [ZH[c.name], `r⊥ = ${f(c.arm, 3)} m → τ = ${f(c.tau)} N·m`]) },
  plank: { text: `对 A 的力矩。每个力使木板转动的效果是（它到 A 的距离）×（力）。木板的重力作用在中点 L/2 处；箱子的重力作用在 x 处；F<sub>B</sub> 作用在 L 处。F<sub>A</sub> 作用在支点上，没有力矩。两个重力使木板顺时针转（−），F<sub>B</sub> 使它逆时针转（+），两者相互抵消。`,
    facts: s => { const x = M.crateX(s.clock * M.SLOW), q = M.plank(x); return [['F<sub>B</sub> 的 τ（+）', `${f(M.PLANK.L)} × ${f(q.FB, 1)} = ${f(M.PLANK.L * q.FB, 0)} N·m`], ['木板 Mg 的 τ（−）', `${f(M.PLANK.L / 2)} × ${f(M.PLANK.Wp, 1)} = ${f(M.PLANK.L / 2 * M.PLANK.Wp, 0)} N·m`], ['箱子 mg 的 τ（−）', `${f(x)} × ${f(M.PLANK.Wc, 1)} = ${f(x * M.PLANK.Wc, 0)} N·m`], ['对 A 的 Στ', '0 N·m'], ['F<sub>A</sub>、F<sub>B</sub>', `${f(q.FA, 1)} N，${f(q.FB, 1)} N`]]; } },
  ladder: { text: `对梯脚 O 而言，只有两个力有力矩。墙的作用力是水平的，沿水平方向延长：它的力臂是梯子顶端的高度 L sin θ。重力是竖直的，向下延长：它的力臂是到梯子中点的水平距离 ½L cos θ。F<sub>N</sub> 和 f<sub>s</sub> 作用在 O 点本身，不产生力矩。`,
    facts: s => { const th = M.ladderAngle(s.clock * M.SLOW), q = M.ladder(th); return [['θ', `${dg(th)}°`], ['F<sub>w</sub> × L sin θ', `${f(q.Fw * M.LADDER.L * Math.sin(th), 1)} N·m`], ['mg × ½L cos θ', `${f(M.LADDER.W * M.LADDER.L / 2 * Math.cos(th), 1)} N·m`], ['所需摩擦力', `${f(q.f, 1)} N`], ['最大静摩擦力 μ<sub>s</sub>F<sub>N</sub>', `${f(q.fMax, 1)} N`]]; } },
  inertia: { text: `圆盘分成四个等宽的细圆环。每个圆环的质量几乎都在同一半径处，所以它的 I 约为 mr²。外圈的圆环质量更大，<i>而且</i>离转轴更远，所以贡献占主导。把它们加起来得 ½MR²，是质量全部集中在边缘的圆环的一半。实心球的质量更多地分布在转轴附近：⅖MR²。`,
    facts: () => M.discAsRings(4).map((r, k) => [`第 ${k + 1} 环：${f(r.r0, 1)}–${f(r.r1, 1)} m，${f(r.m, 3)} kg`, `I = ${f(r.I, 4)} kg·m²`]).concat([['总和', `${f(M.discAsRings(4).reduce((a, r) => a + r.I, 0), 4)} = ½MR²`]]) },
  race: { text: `纯滚动时，与斜面接触的点瞬时静止。中心以 v 运动，顶部以 2v 运动：整个圆盘在绕接触点转动。所以 ω = v/R。在冰面上滑动的箱子不需要为转动付出能量，最先到达。能量的分配与质量和大小无关：实心球有 1/(1 + ⅖) = 71% 的能量是 ½mv²。`,
    facts: s => M.RACE.list.map(o => { const q = M.race(o, s.race.t), e = M.energy(o, q.v); return [ZH[o.name], `½mv² ${f(e.Kt)} J + ½Iω² ${f(e.Kr)} J`]; }) },
  well: { text: `虚影是自由下落的水桶：没有东西需要带动转动，它会以 g 下落。绳拉在辘轳边缘，到轴的距离为 r 且与半径垂直，所以力矩为 rT。这个力矩要使辘轳越转越快，所以 T 始终小于 mg，水桶只以 ${f(M.WELL.a)} m/s² 的加速度下落。跨过重滑轮的两个物体（阿特伍德机）也是同样道理：a = (m<sub>1</sub> − m<sub>2</sub>)g / (m<sub>1</sub> + m<sub>2</sub> + ½M)。`,
    facts: s => { const q = M.well(s.well.t); return [['水桶下落', `${f(q.y)} m，速率 ${f(q.v)} m/s`], ['若自由下落', `${f(Math.min(0.5 * M.G * s.well.t ** 2, M.WELL.h))} m`], ['力矩 rT', `${f(M.WELL.R * M.WELL.T)} N·m`], ['辘轳 ω', `${f(q.w)} rad/s`]]; } },
  skater: { text: `虚影球标出两臂平伸时哑铃的位置。把它们从 r = ${f(M.SKATE.rOut)} m 处收回，2mr² 从 ${f(2 * M.SKATE.m * M.SKATE.rOut ** 2)} 减小到 ${f(2 * M.SKATE.m * M.SKATE.rIn ** 2, 3)} kg·m²。L = Iω 不变，所以 I 减小多少倍，ω 就增大多少倍。`,
    facts: s => { const q = M.skater(s.skater.t); return [['r', `${f(q.r)} m`], ['I', `${f(q.I)} kg·m²`], ['ω', `${f(q.w)} rad/s`], ['L = Iω', `${f(q.L, 3)} kg·m²/s`], ['K<sub>r</sub>', `${f(q.K)} J`]]; } },
  integ: { text: `小段滑开，圆环升起。每一小段的质量都是 dm = λΔx，但它对 I 的贡献是 r²dm，所以远处的小段贡献最大：在转轴过一端的杆上，最后一段到转轴的距离是第一段的 19 倍，贡献就是 19² = 361 倍。把各段加起来，Σr²Δm，小段越细，求和就越接近积分。圆环同理，只是每个圆环的质量也随 r 增大（dm = σ2πr dr），所以 I = ∫σ2πr³dr。`,
    facts: () => [[`${R0.N} 段，转轴过中点`, `Σr²Δm = ${f(M.rodSum(R0.N, 0), 4)} kg·m²`], ['积分 ML²/12', `${f(R0.Icm, 4)} kg·m²`], [`${R0.N} 段，转轴过一端`, `Σr²Δm = ${f(M.rodSum(R0.N, -R0.L / 2), 4)} kg·m²`], ['积分 ML²/3', `${f(R0.Iend, 4)} kg·m²`], ['100 段，转轴过中点', `${f(M.rodSum(100, 0), 5)} kg·m²`]] },
  parallel: { text: `虚线是过（转轴在一端的）杆质心、与转轴平行的另一条轴。对这条轴，这根杆的 I<sub>cm</sub> = ML²/12，与另一根杆相同。从转轴量起，每一小段的位置都等于它到质心的位置加上 d = L/2。平方后求和：交叉项相互抵消（对质心而言各部分是平衡的），剩下 I<sub>cm</sub> + Md²。这个定理必须从过质心的轴出发：对这条轴 I 最小。`,
    facts: s => PX.map(p => [`转轴在${ZH[p.key]}：I<sub>cm</sub> + Md²`, `${f(R0.Icm)} + ${f(R0.M * p.d * p.d)} = ${f(p.I)} kg·m²`]).concat(PX.map(p => [`${ZH[p.key]}：ω`, `${f(M.paxSpin(p, s.parallel.t).w)} rad/s`])) },
  wrench: { text: `灰色轮廓是这一下开始时扳手的位置。手的路径是灰色圆弧，s = rΔθ，推力始终沿着它，与手柄垂直。所以 W = Fs = F·rΔθ = τΔθ：功等于力矩乘以角度（以弧度计）。扳手长一倍，得到同样的 τ 只需一半的推力，但手要走两倍的距离：做的功相同。`,
    facts: s => { const q = M.wrench(s.wrench.t); return [['Δθ', `${f(q.th)} rad = ${dg(q.th)}°`], ['弧长 s = rΔθ', `${f(q.s, 3)} m`], ['F·s', `${f(WR.F * q.s, 1)} J`], ['τΔθ', `${f(q.W, 1)} J`], ['P = τω', `${f(q.P, 0)} W`]]; } },
  slip: { text: `球底部的速度为 v − Rω（灰色，贴着地面）。只要它不为零，球就在打滑，滑动摩擦力与它反向。v 减小，Rω（顶部的灰色箭头）增大，直到两者相等；此时底部静止，摩擦力消失，球开始纯滚动。对接触线而言摩擦力没有力矩，所以 mvR + Iω 保持不变：由 mv<sub>0</sub>R = mvR + ⅖mR²(v/R) 同样得到 v = 5v<sub>0</sub>/7。`,
    facts: s => { const q = M.bowl(s.slip.t); return [['v', `${f(q.v)} m/s`], ['ω', `${f(q.w, 1)} rad/s`], ['底部滑动速度 v − Rω', `${f(q.vSlip)} m/s`], ['摩擦力', q.slip ? `${f(B.f, 1)} N，向后` : '无：纯滚动'], ['K', `${f(q.K, 1)} J（共 ${f(0.5 * B.m * B.v0 ** 2, 1)} J）`]]; } },
  impulse: { text: `每次推力都作用在边缘、与半径垂直，所以力臂就是整个半径 R = ${f(M.IMP.R, 1)} m，τ = FR。用力大的推法在短时间内给出大的 τ，用力小的推法在较长时间内给出小的 τ。决定最终转速的是 τΔt，即面积。推完之后没有力矩（轴承光滑），所以 L 保持不变。`,
    facts: s => IM.map(p => { const q = M.imp(p, s.impulse.t); return [`${p.key}：τΔt = ${p.tau} × ${p.dt}`, `${p.J} kg·m²/s → 此刻 L ${f(q.L, 0)}，ω ${f(q.w)} rad/s`]; }) },
  particle: { text: `把对 O 的 L 画成矢量，从上方看逆时针时向上（右手定则）。碰撞前，只有球有角动量 mv<sub>0</sub>d。碰撞后，球的 L 向下（它反向运动了），细杆的 L 向上。蓝色的总角动量不变：转轴对细杆的作用力就作用在 O 点，对 O 没有力矩。这里动量<i>不</i>守恒：转轴在推。`,
    facts: s => { const q = M.hit(s.particle.t); return [['r（O 到球）', `${f(q.r)} m`], ['r sin φ = r<sub>⊥</sub>', `${f(HT.d)} m`], ['球的 L = mv r<sub>⊥</sub>', `${f(q.Lb, 3)} kg·m²/s`], ['细杆的 L = Iω', `${f(q.Lr, 3)} kg·m²/s`], ['总角动量', `${f(q.L, 3)} kg·m²/s`]]; } },
};
