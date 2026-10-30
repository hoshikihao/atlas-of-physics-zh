// Chapter 3, page by page (after the AP Physics 1 organizer, Units 4 and 6, and AP Physics C
// gravitation and orbits). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, V_SCALE, A_SCALE, F_SCALE, ROAD, COASTER, SPACE, ORBIT, WELLS } from './world.js';

const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const cm = x => (x * 100).toFixed(x * 100 < 1 ? 1 : 0);
const deg = r => r * 180 / Math.PI;

// ---------- small SVG charts for the left page ----------
const W = 420, H = 150, P = { l: 44, r: 14, t: 16, b: 30 };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursor, label }) {
  const sx = x => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy = y => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const zero = y0 < 0 && y1 > 0 ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${zero}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursor ? `<circle class="cursor" r="4.5" data-cursor="${cursor}"/>` : ''}
  </svg>`;
}
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
const curve = (x0, x1, fn, n = 60) => Array.from({ length: n + 1 }, (_, i) => { const x = x0 + (x1 - x0) * i / n; return [x, fn(x)]; });

const lapW = M.period(M.V1, M.BALL.r);
const vb = M.loopV(0), Nb = M.loopN(0), Nt = M.loopN(Math.PI);
const r1 = M.SAT.r1, r2 = M.SAT.r2, RE = M.EARTH.R;
const Kp = 0.5 * M.SAT_M * M.ELL.vp ** 2, Ka = 0.5 * M.SAT_M * M.ELL.va ** 2;
const dE = M.circE(M.SAT.r2) - M.circE(M.SAT.r1), dU = M.Ugrav(M.SAT.r2) - M.Ugrav(M.SAT.r1);
const F1 = M.gravF(M.SPHERES.m1, M.SPHERES.m2, M.SPHERES.rMin), F3 = M.gravF(M.SPHERES.m1, M.SPHERES.m2, M.SPHERES.rMax);

export const PAGES = [
  {
    kicker: '第 3 章', title: '圆周运动', sub: '速率不变，却一直在加速',
    body: `
      <p class="lede">用绳拴着小球甩圈，小球的速率保持不变，却一直在加速：在圆周上的每一点，它的速度<b>方向</b>都在改变。</p>
      <p>速度是矢量：大小<i>或</i>方向改变，速度就改变。这个小球用 ${f(M.BALL.r)} m 长的绳拴着，在光滑桌面上以 ${f(M.V1, 1)} m/s 做圆周运动；浅色的像每 ⅛ 圈一张，间距相等。</p>
      <table class="data">
        <tr><td><i>v</i>（蓝）</td><td>沿圆的切线方向</td></tr>
        <tr><td><i>a</i><sub>c</sub> = <i>v</i>²/<i>r</i>（红）</td><td>${f(M.ac(M.V1, M.BALL.r))} m/s²，指向圆心，⟂ <i>v</i></td></tr>
        <tr><td><i>T</i> = 2π<i>r</i>/<i>v</i></td><td>每圈 ${f(lapW)} s</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: 5, y0: -3, y1: 3, xlabel: '时间 (s)', ylabel: '速度 (m/s)', cursor: 'whirl', label: '速度的一个分量来回摆动，而速率保持不变',
        series: [{ pts: curve(0, 5, t => M.uniform(M.BALL.r, M.V1, t).vx, 120), tag: [0.15, -2.2, 'v<tspan dy="3" font-size="8">x</tspan>'] }, { cls: 'trend', pts: [[0, M.V1], [5, M.V1]], tag: [3.6, M.V1 + 0.1, '速率'] }] })}</div>
      <p class="hintline">点击小球求 Δv。每 1 m/s 长 ${cm(V_SCALE)} cm，每 1 m/s² 长 ${cm(A_SCALE)} cm。</p>`,
    cam: { target: [STATIONS.whirl, 0.1, 0.05], az: -18, el: 40, dist: 5.2 }, lit: 'whirl', scene: 'whirl', look: {},
    fig: '俯视绳拴小球',
  },
  {
    kicker: '3.1', title: '向心力', sub: '是一种作用，不是一种新的力',
    body: `
      <p class="lede">指向圆心的加速度需要指向圆心的合力：Σ<i>F</i> = <i>ma</i><sub>c</sub> = <i>mv</i>²/<i>r</i>。这不是一种新的力，而是哪个真实的力指向圆心，哪个就充当向心力：</p>
      <table class="data">
        <tr><td>绳拴小球</td><td>拉力 <i>T</i></td></tr>
        <tr><td>甩动的桶里的水</td><td>桶底的支持力</td></tr>
        <tr><td>水平弯道上的汽车</td><td>静摩擦力 <i>f</i><sub>s</sub></td></tr>
        <tr><td>倾斜弯道上的汽车</td><td>支持力的一个分量</td></tr>
        <tr><td>绕地球运行的月球</td><td>万有引力 <i>F</i><sub>g</sub></td></tr>
      </table>
      <p>这里 <i>F</i><sub>N</sub> = <i>mg</i>，<i>T</i> = <i>mv</i>²/<i>r</i>：${f(M.V1, 1)} m/s 时为 ${f(M.tension(M.V1))} N，${f(M.V2, 1)} m/s 时为 <b>${f(M.tension(M.V2))} N</b>。速率加倍，拉力变为四倍；半径减半，拉力加倍。</p>
      <div class="charts">${chart({ x0: 0, x1: 5, y0: 0, y1: 6, xlabel: '速率 v (m/s)', ylabel: '拉力 T (N)', label: '拉力随速率的平方增大',
        series: [{ pts: curve(0, 5, v => Math.min(M.tension(v), 6)) }], marks: [[M.V1, M.tension(M.V1), `${f(M.tension(M.V1), 1)} N`], [M.V2, M.tension(M.V2), `${f(M.tension(M.V2), 1)} N`, -44, 4]] })}</div>
      <p class="hintline">点击小球查看受力分析图。每牛顿长 ${cm(F_SCALE)} cm。</p>`,
    cam: { target: [STATIONS.double, 0.1, 0.1], az: -10, el: 38, dist: 11.5 }, lit: 'double', scene: 'double', look: {},
    fig: '同一根绳，2.0 m/s 和 4.0 m/s',
  },
  {
    kicker: '3.2', title: '汽车转弯', sub: '摩擦力让它转向',
    body: `
      <p class="lede">在水平弯道上，汽车在水平方向受到的唯一的力是路面的<b>静摩擦力</b>，指向圆心。之所以是静摩擦力，是因为轮胎没有侧向滑动；它最大只能达到 μ<sub>s</sub><i>F</i><sub>N</sub>。</p>
      <table class="data eqs">
        <tr><td>Σ<i>F</i><sub>y</sub> = 0</td><td><i>F</i><sub>N</sub> = <i>mg</i> = ${f(M.CAR.W / 1000)} kN</td></tr>
        <tr><td>Σ<i>F</i><sub>x</sub> = <i>ma</i><sub>c</sub></td><td><i>f</i><sub>s</sub> = <i>mv</i>²/<i>r</i> = ${f(M.CAR.f / 1000)} kN（上限 ${f(M.CAR.fmax / 1000)} kN）</td></tr>
      </table>
      <p>μ<sub>s</sub><i>mg</i> = <i>mv</i>²/<i>r</i>，质量约去：</p>
      <div class="eq"><i>v</i><sub>max</sub> = √(μ<sub>s</sub><i>gr</i>) = ${f(M.CAR.vmax)} m/s</div>
      <p>超过这个速率，汽车会沿切线滑出：是直着冲出去，而不是被甩向外侧。</p>
      <div class="charts">${chart({ x0: 0, x1: 12, y0: 0, y1: 16, xlabel: '速率 v (m/s)', ylabel: '所需摩擦力 (kN)', cursor: 'flatcar', label: '所需摩擦力随速率的变化，以及路面能提供的最大值',
        series: [{ pts: curve(0, 12, v => Math.min(M.CAR.m * v * v / M.CAR.r / 1000, 16)) }, { cls: 'trend', pts: [[0, M.CAR.fmax / 1000], [12, M.CAR.fmax / 1000]], tag: [0.3, M.CAR.fmax / 1000 + 0.3, 'μs·mg'] }],
        marks: [[M.CAR.vmax, M.CAR.fmax / 1000, `v<tspan dy="3" font-size="8">max</tspan><tspan dy="-3"> ${f(M.CAR.vmax, 1)}</tspan>`, 8, 18]] })}</div>
      <p class="hintline">点击汽车查看受力分析图。按 1:4 绘制；每千牛长 ${cm(ROAD.kN)} cm，每 1 m/s 长 ${cm(ROAD.v)} cm。</p>`,
    cam: { target: [STATIONS.flatcar, 0.2, 0.3], az: -14, el: 48, dist: 21 }, lit: 'flatcar', scene: 'flatcar', look: {},
    fig: `半径 ${M.CAR.r} m 的弯道，${f(M.CAR.v, 1)} m/s`,
  },
  {
    kicker: '3.3', title: '圆锥摆', sub: '绳会倾斜',
    body: `
      <p class="lede">用绳拴着小球甩圈，绳不可能保持水平：必须有东西托住小球、对抗重力。绳向下倾斜，直到它的拉力同时完成两项任务。</p>
      <p>从竖直方向量 θ。于是水平分量用 sin θ，竖直分量用 cos θ：</p>
      <table class="data eqs">
        <tr><td>Σ<i>F</i><sub>y</sub> = 0</td><td><i>T</i> cos θ = <i>mg</i>，所以 <i>T</i> = <i>mg</i>/cos θ = ${f(M.CONE.T)} N</td></tr>
        <tr><td>Σ<i>F</i><sub>x</sub> = <i>ma</i><sub>c</sub></td><td><i>T</i> sin θ = <i>mv</i>²/<i>r</i> = ${f(M.CONE.Tx)} N</td></tr>
      </table>
      <p>两式相除，拉力约去：</p>
      <div class="eq"><i>g</i> tan θ = <i>v</i>²/<i>r</i> = <i>a</i><sub>c</sub></div>
      <p>这里 ${f(M.CONE.L, 1)} m 长的绳在 θ = ${M.CONE.thetaDeg}° 时画出半径 <i>r</i> = ${f(M.CONE.r)} m 的圆，所以小球的速率必须是 ${f(M.CONE.v)} m/s，每 ${f(M.period(M.CONE.v, M.CONE.r))} s 转一圈。绳完全水平是不可能的：没有东西能平衡 <i>mg</i>。</p>
      <p class="hintline">点击小球分解拉力。力每牛顿长 ${cm(F_SCALE)} cm。</p>`,
    cam: { target: [STATIONS.cone, 1.25, 0], az: -14, el: 24, dist: 5.6 }, lit: 'cone', scene: 'cone', look: {},
    fig: `${f(M.CONE.L, 1)} m 的绳，偏离竖直方向 ${M.CONE.thetaDeg}°`,
  },
  {
    kicker: '3.4', title: '竖直面内的圆周运动', sub: '回环的最高点和最低点',
    body: `
      <p class="lede">在竖直回环中，重力也参与进来。在最低点和最高点，圆心在正上方或正下方，所以这两处的合力是竖直的：<i>mv</i>²/<i>r</i>。</p>
      <table class="data eqs">
        <tr><td>最低点：<i>F</i><sub>N</sub> − <i>mg</i> = <i>mv</i>²/<i>r</i></td><td><i>F</i><sub>N</sub> = <i>m</i>(<i>v</i>²/<i>r</i> + <i>g</i>) = ${f(Nb / 1000, 1)} kN</td></tr>
        <tr><td>最高点：<i>F</i><sub>N</sub> + <i>mg</i> = <i>mv</i>²/<i>r</i></td><td><i>F</i><sub>N</sub> = <i>m</i>(<i>v</i>²/<i>r</i> − <i>g</i>) = ${f(Nt / 1000, 1)} kN</td></tr>
      </table>
      <div class="eq"><i>F</i><sub>N 最高点</sub> = 0：<i>v</i><sub>min</sub> = √(<i>gr</i>) = ${f(M.LOOP.vmin)} m/s</div>
      <p>在头顶上甩一桶水也是一样。这辆 ${M.LOOP.m} kg 的过山车以 ${f(M.LOOP.vTop, 1)} m/s 通过回环最高点，在最低点达到 ${f(vb, 1)} m/s；在两者之间，合力的一个分量使它加速或减速。</p>
      <div class="charts">${chart({ x0: 0, x1: 360, y0: 0, y1: 35, xlabel: '从最低点起绕回环转过的角度 (°)', ylabel: '支持力 (kN)', cursor: 'loop', label: '绕回环一周的支持力',
        series: [{ pts: curve(0, 360, d => M.loopN(d * Math.PI / 180) / 1000, 90) }, { cls: 'trend', pts: [[0, M.LOOP.W / 1000], [360, M.LOOP.W / 1000]], tag: [8, M.LOOP.W / 1000 + 0.5, 'mg'] }],
        marks: [[180, Nt / 1000, `最高点 ${f(Nt / 1000, 1)}`, 10, -10]] })}</div>
      <p class="hintline">点击过山车查看受力分析图。按 1:5 绘制，力每千牛长 ${cm(COASTER.kN)} cm。</p>`,
    cam: { target: [STATIONS.loop + 0.75, 1.3, 0], az: -8, el: 6, dist: 12 }, lit: 'loop', scene: 'loop', look: {},
    fig: `半径 ${f(M.LOOP.r, 0)} m 的回环，以 ${f(M.LOOP.vTop, 0)} m/s 通过最高点`,
  },
  {
    kicker: '3.5', title: '倾斜弯道', sub: '让路面倾斜',
    body: `
      <p class="lede">把路面倾斜，支持力也随之倾斜，倾角就是路面的倾角 θ。支持力的水平分量让汽车转弯，完全不需要摩擦力。</p>
      <table class="data eqs">
        <tr><td>Σ<i>F</i><sub>y</sub> = 0</td><td><i>F</i><sub>N</sub> cos θ = <i>mg</i>，<i>F</i><sub>N</sub> = ${f(M.BANK.N / 1000)} kN</td></tr>
        <tr><td>Σ<i>F</i><sub>x</sub> = <i>ma</i><sub>c</sub></td><td><i>F</i><sub>N</sub> sin θ = <i>mv</i>²/<i>r</i> = ${f(M.BANK.Nx / 1000)} kN</td></tr>
      </table>
      <div class="eq">tan θ = <i>v</i>²/(<i>rg</i>)</div>
      <p>每个倾角只对应一个设计速率 √(<i>rg</i> tan θ)：这里是 ${f(M.BANK.v)} m/s。开得更快，汽车会向坡上滑；开得更慢，会向坡下滑。</p>
      <div class="charts">${chart({ x0: 0, x1: 45, y0: 0, y1: 10, xlabel: '倾角 θ (°)', ylabel: '设计速率 (m/s)', label: '半径 10 m 弯道的设计速率随倾角的变化',
        series: [{ pts: curve(0, 45, d => M.bankSpeed(d)) }], marks: [[M.BANK.thetaDeg, M.BANK.v, `${M.BANK.thetaDeg}°：${f(M.BANK.v)} m/s`]] })}</div>
      <p class="hintline">点击汽车分解支持力。按 1:4 绘制，力每千牛长 ${cm(ROAD.kN)} cm。</p>`,
    cam: { target: [STATIONS.bank, 0.3, 0.3], az: -14, el: 30, dist: 21 }, lit: 'bank', scene: 'bank', look: {},
    fig: `倾角 ${M.BANK.thetaDeg}°，无摩擦`,
  },
  {
    kicker: '3.6', title: '角速度', sub: 'v = rω',
    body: `
      <p class="lede">转动圆盘上的每一点在相同时间内转过相同的角度：它们有同一个<b>角速度</b> ω。离圆心越远的点走过的路程越长，所以运动得越快。</p>
      <table class="data eqs">
        <tr><td>ω = Δθ/<i>t</i></td><td>rad/s（或 rpm）</td></tr>
        <tr><td><i>s</i> = <i>r</i>Δθ</td><td>弧长；<i>s</i> = <i>r</i> 时为 1 rad</td></tr>
        <tr><td><i>v</i> = <i>r</i>ω</td><td>线速度；<i>T</i> = 2π/ω</td></tr>
      </table>
      <p>当 ω = ${f(M.DISC.w)} rad/s（${f(M.radToRpm(M.DISC.w), 1)} rpm；rpm × 2π/60 = rad/s）时，距圆心 ${f(M.DISC.r1)} m 的木块以 ${f(M.DISC.v1)} m/s 运动，距离加倍的木块以 ${f(M.DISC.v2)} m/s 运动。两者都是每 ${f(M.DISC.T)} s 转一圈；与质量无关。</p>
      <div class="charts">${chart({ x0: 0, x1: 1, y0: 0, y1: 3, xlabel: '到圆心的距离 r (m)', ylabel: '速率 v (m/s)', label: '速率与半径成正比',
        series: [{ pts: [[0, 0], [1, M.DISC.w]], tag: [0.06, 1.0, '斜率 = ω'] }], marks: [[M.DISC.r1, M.DISC.v1, 'v₁'], [M.DISC.r2, M.DISC.v2, 'v₂']] })}</div>
      <p class="hintline">点击圆盘，查看转过的一个弧度。</p>`,
    cam: { target: [STATIONS.disc, 0.05, 0.05], az: -16, el: 40, dist: 5.6 }, lit: 'disc', scene: 'disc', look: {},
    fig: `ω = ${f(M.DISC.w, 1)} rad/s`,
  },
  {
    kicker: '3.7', title: '万有引力', sub: '任何两个物体都相互吸引',
    body: `
      <p class="lede">任何两个物体都相互吸引，引力的大小与两者质量的乘积成正比，与两者中心距离的平方成反比。</p>
      <div class="eq"><i>F</i><sub>g</sub> = <i>G m</i><sub>1</sub><i>m</i><sub>2</sub> / <i>r</i>²</div>
      <p><i>G</i> = 6.67 × 10⁻¹¹ N·m²/kg²。这两个球相距 ${f(M.SPHERES.rMin, 1)} m 时相互吸引 ${f(F1 * 1e6, 0)} μN（相当于半粒米的重力）；距离变为三倍，引力变为九分之一：${f(F3 * 1e6, 1)} μN。地球给出 <i>g</i> = <i>GM</i><sub>E</sub>/<i>R</i><sub>E</sub>² = ${f(M.EARTH.g)} m/s²：对 ${M.PERSON} kg 的人为 ${f(M.gravF(M.EARTH.M, M.PERSON, M.EARTH.R), 0)} N，恰好就是 <i>mg</i>。</p>
      <table class="data">
        <tr><td>2<i>m</i><sub>1</sub>，2<i>m</i><sub>2</sub>，3<i>r</i></td><td>2 × 2 / 3²</td><td>4/9 <i>F</i></td></tr>
        <tr><td>4<i>m</i><sub>1</sub>，<i>m</i><sub>2</sub>，½<i>r</i></td><td>4 × 1 / 0.5²</td><td>${f(M.ratio(4, 1, 0.5), 0)} <i>F</i></td></tr>
      </table>
      <div class="charts">${chart({ x0: 0.8, x1: 3.2, y0: 0, y1: 220, xlabel: '中心距离 r (m)', ylabel: '力 (μN)', cursor: 'gravity', label: '万有引力随距离的变化：平方反比',
        series: [{ pts: curve(0.8, 3.2, r => M.gravF(M.SPHERES.m1, M.SPHERES.m2, r) * 1e6, 80) }] })}</div>
      <p class="hintline">点击比较两者的加速度。每 μN 长 ${f(SPACE.uN * 1000, 0)} mm。</p>`,
    cam: { target: [STATIONS.gravity + 0.15, 0.85, 0], az: -10, el: 12, dist: 14 }, lit: 'gravity', scene: 'gravity', look: {},
    fig: `${M.SPHERES.m1} kg 和 ${M.SPHERES.m2} kg 的铁球`,
  },
  {
    kicker: '3.8', title: '轨道', sub: '以引力为绳',
    body: `
      <p class="lede">在圆轨道上运行的卫星，就是一个以万有引力为绳的绳拴小球。任何天体运动问题，都从 <i>F</i><sub>g</sub> = <i>F</i><sub>c</sub> 出发：</p>
      <div class="eq"><i>GMm</i>/<i>r</i>² = <i>mv</i>²/<i>r</i> &nbsp;→&nbsp; <i>v</i> = √(<i>GM</i>/<i>r</i>)</div>
      <p>卫星自身的质量约去了。代入 <i>v</i> = 2π<i>r</i>/<i>T</i>，就得到开普勒第三定律 <i>T</i>² ∝ <i>r</i>³：</p>
      <div class="eq"><i>T</i>² = (4π²/<i>GM</i>) <i>r</i>³</div>
      <table class="data">
        <tr><th>轨道半径</th><th><i>v</i></th><th><i>T</i></th><th><i>a</i></th></tr>
        <tr><td>2 <i>R</i><sub>E</sub> = ${f(r1 / 1e6 * 1000, 0)} km</td><td>${f(M.orbitV(r1) / 1000)} km/s</td><td>${f(M.orbitT(r1) / 3600)} h</td><td>${f(M.orbitA(r1))} m/s²</td></tr>
        <tr><td>4 <i>R</i><sub>E</sub> = ${f(r2 / 1e6 * 1000, 0)} km</td><td>${f(M.orbitV(r2) / 1000)} km/s</td><td>${f(M.orbitT(r2) / 3600)} h</td><td>${f(M.orbitA(r2))} m/s²</td></tr>
      </table>
      <p>轨道越高，周期越长，速率越<b>小</b>。这与圆盘正好相反：圆盘上每一点的 ω 相同，越靠外运动越快。真实的轨道是椭圆，行星位于一个焦点上（开普勒第一定律），相等时间内扫过相等的面积（开普勒第二定律）。下一页就画出一个。</p>
      <p class="hintline">以 3600 倍速播放：这里的一秒就是一小时。1 m 代表 ${f(1 / ORBIT.draw / 1e6 * 1000, 0)} km；每 1 km/s 长 ${cm(ORBIT.v)} cm，每 1 m/s² 长 ${cm(ORBIT.a)} cm。</p>`,
    cam: { target: [STATIONS.orbit, 1.6, 0.2], az: -14, el: 36, dist: 34 }, lit: 'orbit', scene: 'orbit', look: {},
    fig: '2 倍和 4 倍地球半径处的轨道',
  },
  {
    kicker: '3.9', title: '椭圆轨道', sub: '相等时间扫过相等面积',
    body: `
      <p class="lede">大多数轨道是椭圆，地球位于一个焦点上（开普勒第一定律）。万有引力对地心没有力矩，所以角动量 <i>mvr</i><sub>⊥</sub> 守恒。在近地点和远地点，<i>v</i> ⟂ <i>r</i>：</p>
      <div class="eq"><i>r</i><sub>p</sub><i>v</i><sub>p</sub> = <i>r</i><sub>a</sub><i>v</i><sub>a</sub></div>
      <table class="data">
        <tr><td>近地点，2 <i>R</i><sub>E</sub></td><td><i>v</i><sub>p</sub> = ${f(M.ELL.vp / 1000)} km/s</td></tr>
        <tr><td>远地点，6 <i>R</i><sub>E</sub></td><td><i>v</i><sub>a</sub> = ${f(M.ELL.va / 1000)} km/s</td></tr>
      </table>
      <p>距离变为三倍，速率变为三分之一。卫星与地心的连线在相等时间内扫过相等的面积（开普勒第二定律）；把 <i>r</i> 换成半长轴 <i>a</i>，开普勒第三定律依然成立。</p>
      <div class="charts">${chart({ x0: 0, x1: 360, y0: 0, y1: 8, xlabel: '从近地点起转过的角度 (°)', ylabel: '速率 (km/s)', cursor: 'kepler', label: '沿椭圆轨道的速率：近地点最快，远地点最慢',
        series: [{ pts: curve(0, 360, d => M.ellV(d * Math.PI / 180) / 1000, 120) }],
        marks: [[180, M.ELL.va / 1000, `远地点 ${f(M.ELL.va / 1000)}`, -36, -12]] })}</div>
      <p class="hintline">点击查看近地点和远地点。每个扇形代表一小时（蓝色为最近一小时）。3600 倍速；每 1 km/s 长 ${cm(ORBIT.v)} cm。</p>`,
    cam: { target: [STATIONS.kepler + 0.6, 1.8, 0.3], az: -6, el: 62, dist: 41 }, lit: 'kepler', scene: 'kepler', look: {},
    fig: '近地点 2 倍、远地点 6 倍地球半径',
  },
  {
    kicker: '3.10', title: '轨道上的能量', sub: '动能与势能相互转化',
    body: `
      <p class="lede">只有万有引力做功，而万有引力是保守力，所以卫星–地球系统的机械能守恒：</p>
      <div class="eq">½<i>mv</i>² − <i>GMm</i>/<i>r</i> = <i>E</i>，恒定</div>
      <p>向近地点下落时，引力有一个沿 <i>v</i> 方向的分量。它做正功：<i>U</i> = −<i>GMm</i>/<i>r</i> 减小，<i>K</i> 增加同样的量。向外爬升时，同一个分量使它减速。</p>
      <table class="data">
        <tr><th>${M.SAT_M} kg</th><th><i>K</i></th><th><i>U</i></th><th><i>E</i></th></tr>
        <tr><td>近地点</td><td>${f(Kp / 1e9, 1)} GJ</td><td>${f(M.Ugrav(M.ELL.rp) / 1e9, 1)} GJ</td><td>${f(M.ELL.E / 1e9, 1)} GJ</td></tr>
        <tr><td>远地点</td><td>${f(Ka / 1e9, 1)} GJ</td><td>${f(M.Ugrav(M.ELL.ra) / 1e9, 1)} GJ</td><td>${f(M.ELL.E / 1e9, 1)} GJ</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: 360, y0: -35, y1: 25, xlabel: '从近地点起转过的角度 (°)', ylabel: '能量 (GJ)', label: '沿椭圆轨道的动能、势能和总能量',
        series: [{ pts: curve(0, 360, d => 0.5 * M.SAT_M * M.ellV(d * Math.PI / 180) ** 2 / 1e9, 120), tag: [172, 5, 'K'] },
                 { pts: curve(0, 360, d => M.Ugrav(M.ellR(d * Math.PI / 180)) / 1e9, 120), tag: [172, -20, 'U'] },
                 { cls: 'curve total', pts: [[0, M.ELL.E / 1e9], [360, M.ELL.E / 1e9]], tag: [262, M.ELL.E / 1e9 + 0.5, 'E = K + U'] }] }).replace('</svg>', '<circle class="cursor" r="4.5" data-cursor="orbitK"/><circle class="cursor" r="4.5" data-cursor="orbitU"/></svg>')}</div>
      <p class="hintline">点击卫星，把引力分解为沿 <i>v</i> 和垂直于 <i>v</i> 的分量。每千牛长 ${f(ORBIT.kN * 100, 0)} cm；能量条每 GJ 长 ${f(ORBIT.GJ * 100, 0)} cm。</p>`,
    cam: { target: [STATIONS.orbitE + 0.1, 1.9, 0.3], az: -6, el: 36, dist: 36 }, lit: 'orbitE', scene: 'orbitE', look: {},
    fig: `${M.SAT_M} kg 的卫星，K + U = E`,
  },
  {
    kicker: '3.11 · AP 物理 C', title: '引力势能', sub: 'U = −GMm/r，无穷远处为零',
    body: `
      <p class="lede">远离地面时 <i>g</i> 会变化，<i>mgh</i> 就不再适用。取无穷远处 <i>U</i> = 0，对 <i>F</i><sub>r</sub> = −<i>GMm</i>/<i>r</i>² 积分：</p>
      <div class="eq"><i>U</i> = −∫<sub>∞</sub><sup><i>r</i></sup> <i>F</i><sub>r</sub> d<i>r</i>′ = <i>GMm</i>[−1/<i>r</i>′]<sub>∞</sub><sup><i>r</i></sup> = −<i>GMm</i>/<i>r</i></div>
      <p>它是负的，因为把 <i>m</i> 从无穷远处拉近时引力做正功。只有差值才有意义，而 −d<i>U</i>/d<i>r</i> 又给回 <i>F</i><sub>r</sub>。在地面附近，<i>r</i> = <i>R</i> + <i>h</i>，且 <i>h</i> ≪ <i>R</i>：</p>
      <div class="eq">Δ<i>U</i> ≈ (<i>GMm</i>/<i>R</i>²) <i>h</i> = <i>mgh</i></div>
      <div class="charts">${chart({ x0: 0, x1: 2, y0: 0, y1: 130, xlabel: '高度 h（地球半径）', ylabel: '相对地面的 ΔU (GJ)', label: '1000 kg 物体的 mgh 与势能变化精确值的对比',
        series: [{ pts: curve(0, 2, h => (M.Ugrav(RE * (1 + h)) - M.Ugrav(RE)) / 1e9), tag: [1.5, 34, '精确值'] }, { cls: 'trend', pts: curve(0, 2, h => M.SAT_M * M.EARTH.g * h * RE / 1e9, 2), tag: [1.25, 96, 'mgh'] }] })}</div>
      <p class="hintline">在 100 km 高处，<i>mgh</i> 偏大 ${f(100e3 / M.EARTH.R * 100, 1)}%；点击曲线。横向 1 m 代表 ${f(1 / ORBIT.draw / 1e6 * 1000, 0)} km，纵向每 GJ 长 ${cm(WELLS.GJ)} cm，每千牛长 ${cm(WELLS.kN)} cm。</p>`,
    cam: { target: [STATIONS.well + 3.8, 1.3, 0], az: -8, el: 10, dist: 30 }, lit: 'well', scene: 'well', look: {},
    fig: `${M.SAT_M} kg 卫星的 U(r)`,
  },
  {
    kicker: '3.12 · AP 物理 C', title: '逃逸', sub: '能量为负即被束缚',
    body: `
      <p class="lede">在圆轨道上 <i>mv</i>² = <i>GMm</i>/<i>r</i>，所以 <i>K</i> = −<i>U</i>/2，</p>
      <div class="eq"><i>E</i> = <i>K</i> + <i>U</i> = −<i>GMm</i>/2<i>r</i></div>
      <p>把 ${M.SAT_M} kg 的卫星从 2 <i>R</i><sub>E</sub> 抬升到 4 <i>R</i><sub>E</sub> 要消耗 ${f(dE / 1e9, 1)} GJ，它最后却更慢了：<i>U</i> 增加 ${f(dU / 1e9, 1)} GJ，<i>K</i> 减少 ${f(dE / 1e9, 1)} GJ。要到达 <i>r</i> → ∞，必须有 <i>E</i> ≥ 0：</p>
      <div class="eq">½<i>mv</i>² = <i>GMm</i>/<i>R</i> → <i>v</i><sub>esc</sub> = √(2<i>GM</i>/<i>R</i>)</div>
      <p>从地面出发为 ${f(M.vEsc(M.EARTH.R) / 1000, 1)} km/s，朝任何方向都一样；从 2 <i>R</i><sub>E</sub> 出发为 ${f(M.LAUNCH.vesc / 1000)} km/s = √2 <i>v</i><sub>c</sub>。低于它，轨道是椭圆；等于它，是抛物线；高于它，是双曲线。</p>
      <div class="charts">${chart({ x0: 1.6, x1: 8, y0: -40, y1: 10, xlabel: '圆轨道半径（地球半径）', ylabel: '能量 (GJ)', label: 'U(r)，以及 2 倍和 4 倍地球半径处圆轨道的总能量和动能',
        series: [{ pts: curve(1.6, 8, x => M.Ugrav(x * RE) / 1e9, 90), tag: [5.6, -17, 'U(r)'] },
          ...[2, 4].flatMap(x => [{ cls: 'curve total', pts: [[x - 0.35, M.circE(x * RE) / 1e9], [x + 0.35, M.circE(x * RE) / 1e9]], tag: [x + 0.35, M.circE(x * RE) / 1e9 - 1, 'E'] },
            { cls: 'trend', pts: [[x, M.Ugrav(x * RE) / 1e9], [x, M.circE(x * RE) / 1e9]], tag: [x - 0.02, (M.Ugrav(x * RE) + M.circE(x * RE)) / 2e9 - 2, 'K'] }]),
          { cls: 'trend', pts: [[6.3, 0], [8, 0]], tag: [5.2, 1, '逃逸：E ≥ 0'] }],
        marks: [[2, M.Ugrav(2 * RE) / 1e9, '2 R<tspan dy="3" font-size="8">E</tspan>', 6, 12], [4, M.Ugrav(4 * RE) / 1e9, '4 R<tspan dy="3" font-size="8">E</tspan>', 6, 12]] })}</div>
      <p class="hintline">点击一次发射，比较各发射速率。以 ${M.ESC_TIME} 倍速播放；每 1 km/s 长 ${cm(ORBIT.v)} cm。</p>`,
    cam: { target: [STATIONS.escape - 0.8, 1.4, -2.4], az: -8, el: 52, dist: 42 }, lit: 'escape', scene: 'escape', look: {},
    fig: '从 2 倍地球半径处水平发射',
  },
];

// ---------- click a scene: what it breaks into ----------
export const PLATES = {
  whirl: { text: `取圆周上相隔 ${f(deg(M.DPHI), 0)}° 的两个时刻的速度，从同一点画出。变化量 Δ<i>v</i> = <i>v</i><sub>f</sub> − <i>v</i><sub>0</sub>（红）指向圆心。把两个时刻之间的时间缩短，Δ<i>v</i>/Δ<i>t</i> 就恰好变为 <i>v</i>²/<i>r</i>，始终指向圆心。`,
    facts: () => { const dt = M.DPHI * M.BALL.r / M.V1; return [['Δv = 2v sin(Δθ/2)', `${f(M.deltaV(M.V1, M.DPHI))} m/s`], ['Δt', `${f(dt, 3)} s`], ['Δv / Δt', `${f(M.avgAccel(M.V1, M.BALL.r, M.DPHI))} m/s²`], ['v²/r（Δt → 0）', `${f(M.ac(M.V1, M.BALL.r))} m/s²`]]; } },
  double: { text: `每个小球缩成一个点：这就是它的受力分析图。竖直方向，桌面的支持力抵消了重力。水平方向唯一的力是绳的拉力，所以拉力<i>就是</i>合力（红），指向中心的钉子。`,
    facts: () => [['F<sub>N</sub> = mg', `${f(M.BALL.m * M.G)} N，两球相同`], [`${f(M.V1, 1)} m/s 时的 T`, `${f(M.tension(M.V1))} N`], [`${f(M.V2, 1)} m/s 时的 T`, `${f(M.tension(M.V2))} N`], ['比值', `(${f(M.V2 / M.V1, 0)})² = ${f(M.tension(M.V2) / M.tension(M.V1), 0)}`]] },
  flatcar: { text: `汽车缩成一个点：重力与支持力互相抵消；指向圆心的静摩擦力就是合力。虚线表示摩擦力消失时（比如在冰面上）汽车的去向：沿切线直着走。`,
    facts: () => [['f<sub>s</sub> = mv²/r', `${f(M.CAR.f)} N`], ['μ<sub>s</sub> F<sub>N</sub>（上限）', `${f(M.CAR.fmax)} N`], ['a<sub>c</sub> = v²/r', `${f(M.CAR.v ** 2 / M.CAR.r)} m/s²`], ['v<sub>max</sub> = √(μ<sub>s</sub> g r)', `${f(M.CAR.vmax)} m/s`]] },
  cone: { text: `拉力分解为竖直分量和水平分量：竖直分量托住小球、对抗 <i>mg</i>，水平分量指向圆心。水平分量就是全部的合力（红）。`,
    facts: () => [['T', `${f(M.CONE.T)} N`], ['T cos θ = mg', `${f(M.CONE.Ty)} N`], ['T sin θ = mv²/r', `${f(M.CONE.Tx)} N`], ['tan θ = v²/(rg)', `${f(Math.tan(M.CONE.th), 3)}`]] },
  loop: { text: `最高点和最低点的受力分析图。在最低点，轨道向上推，还必须胜过重力：是重力的 ${f(Nb / M.LOOP.W, 1)} 倍。在最高点，轨道和重力都向下、指向圆心，两者合起来提供 <i>mv</i>²/<i>r</i>。`,
    facts: () => [['最低点：F<sub>N</sub>', `${f(Nb / 1000)} kN，${f(vb)} m/s 时`], ['最高点：F<sub>N</sub>', `${f(Nt / 1000)} kN，${f(M.LOOP.vTop)} m/s 时`], ['重力 mg', `${f(M.LOOP.W / 1000)} kN`], ['v<sub>min</sub> = √(gr)', `${f(M.LOOP.vmin)} m/s`]] },
  bank: { text: `支持力分解为竖直分量和指向圆心的水平分量，竖直分量恰好与重力平衡。水平分量就是合力（红）。以设计速率行驶时不需要摩擦力。`,
    facts: () => [['F<sub>N</sub> = mg / cos θ', `${f(M.BANK.N)} N`], ['F<sub>N</sub> cos θ = mg', `${f(M.BANK.Ny)} N`], ['F<sub>N</sub> sin θ = mv²/r', `${f(M.BANK.Nx)} N`], ['设计速率', `${f(M.BANK.v)} m/s`]] },
  disc: { text: `在同一段时间里，两个木块都转过一个弧度。外侧的弧长是内侧的两倍，因为 <i>s</i> = <i>r</i>θ。时间相同，路程加倍：速率也加倍。`,
    facts: () => [['Δθ', '1 rad = 57.3°'], ['s₁ = r₁ × 1 rad', `${f(M.DISC.r1)} m`], ['s₂ = r₂ × 1 rad', `${f(M.DISC.r2)} m`], ['转过 1 rad 所用时间', `${f(1 / M.DISC.w)} s`]] },
  gravity: { text: `两个引力是一对作用力与反作用力：大小相等，方向相反，尽管一个球的质量是另一个的两倍。它们的加速度（红，<i>a</i> = <i>F</i>/<i>m</i>）并不相等：较轻的球得到的加速度是另一个的两倍。`,
    facts: s => { const r = M.sep(s.clock), F = M.gravF(M.SPHERES.m1, M.SPHERES.m2, r); return [['r', `${f(r)} m`], ['F<sub>12</sub> = F<sub>21</sub>', `${f(F * 1e6, 1)} μN`], ['a₁（1000 kg）', `${f(F / M.SPHERES.m1 * 1e9, 1)} × 10⁻⁹ m/s²`], ['a₂（2000 kg）', `${f(F / M.SPHERES.m2 * 1e9, 1)} × 10⁻⁹ m/s²`]]; } },
  orbit: { text: `圆弧表示每颗卫星在同一小时内走过的路程。内侧的扫过 ${f(deg(3600 * M.orbitV(r1) / r1), 0)}°，外侧的只扫过 ${f(deg(3600 * M.orbitV(r2) / r2), 0)}°。与圆盘上的点不同，各轨道的角速度并不相同：越往外，各方面都越慢。`,
    facts: () => [['T₁², T₂² ÷ r³', `${(M.orbitT(r1) ** 2 / r1 ** 3).toExponential(3)} s²/m³，两者相同`], ['4π² / GM', `${(4 * Math.PI ** 2 / M.GM).toExponential(3)} s²/m³`], ['T₂ / T₁', `${f(M.orbitT(r2) / M.orbitT(r1))} = 2√2`], ['v₂ / v₁', `${f(M.orbitV(r2) / M.orbitV(r1), 3)} = 1/√2`]] },
  kepler: { text: `卫星位于近地点和远地点。在这两处 <i>v</i> ⟂ <i>r</i>，所以 <i>L</i> = <i>mvr</i>。距离是三倍，速率就是三分之一。每个一小时的扇形面积相等：靠近地球的又短又宽，远处的又长又窄。`,
    facts: () => [['r<sub>p</sub> v<sub>p</sub>', `${f(M.ELL.rp * M.ELL.vp / 1e10, 3)} × 10¹⁰ m²/s`], ['r<sub>a</sub> v<sub>a</sub>', `${f(M.ELL.ra * M.ELL.va / 1e10, 3)} × 10¹⁰ m²/s`], ['每小时扫过的面积（RK4）', `${f(M.swept(0, M.SWEEP) / 1e12, 1)} × 10¹² m²`], ['T = 2π√(a³/GM)', `${f(M.ELL.T / 3600)} h`]] },
  orbitE: { text: `引力（红）分解为沿速度方向和垂直于速度方向的两个分量。只有沿 <i>v</i> 的分量做功：向内运动时它使卫星加速，向外运动时使卫星减速。在近地点和远地点它为零，速率达到极值。`,
    facts: s => { const p = M.ELL.track.at(s.clock * M.ORBIT_TIME), K = 0.5 * M.SAT_M * p.v ** 2, U = M.Ugrav(p.r); return [['r', `${f(p.r / RE)} R<sub>E</sub>`], ['K = ½mv²', `${f(K / 1e9)} GJ`], ['U = −GMm/r', `${f(U / 1e9)} GJ`], ['E = K + U', `${f((K + U) / 1e9)} GJ`]]; } },
  well: { text: `红线是 <i>U</i>(<i>R</i>) + <i>mgh</i>，即曲线在地面处的切线，斜率为 <i>mg</i>。<i>h</i> 很小时它是准确的；再往高处，<i>g</i> 减弱，真实曲线逐渐变平，永远达不到零，而这条直线在地面以上一个地球半径处就穿过了零。`,
    facts: s => { const r = M.wellR(s.clock); return [['r', `${f(r / RE)} R<sub>E</sub>`], ['U = −GMm/r', `${f(M.Ugrav(r) / 1e9)} GJ`], ['F = GMm/r²', `${f(M.GM * M.SAT_M / r ** 2 / 1000)} kN`], ['U(R) + mgh', `${f((M.Ugrav(RE) + M.SAT_M * M.EARTH.g * (r - RE)) / 1e9)} GJ`]]; } },
  escape: { text: `四种发射速率并排比较，都从同一点水平发射。<i>E</i> 的正负决定结果：小于零，物体被束缚，绕一圈回来；等于零，恰好逃逸，在远处速率趋于零；大于零，带着多余的速率离去。`,
    facts: () => M.LAUNCH.list.map(o => [`${({ circle: '圆', ellipse: '椭圆', parabola: '抛物线', hyperbola: '双曲线' })[o.name]}：${f(o.v0 / 1000)} km/s`, `E ${Math.abs(o.E) < 1 ? '0' : f(o.E * M.SAT_M / 1e9, 1)} GJ`]) },
};
