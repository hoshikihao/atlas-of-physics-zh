// Chapter 2, page by page (after the AP Physics 1 organizer, Unit 3). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, KN_SCALE, F_SCALE, TUG_SCALE, DRAG_SCALE, HONEY_SCALE } from './world.js';

const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const at = (k, dy = 0.5) => [STATIONS[k], dy, 0];
const TG = M.TUG, BD = M.BOARD, DR = M.DRAG, HN = M.HONEY;

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursor, label }) {
  const sx = x => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy = y => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + 6}" y="${sy(y) + 14}">${t}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${String(y0).replace('-', '−')}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursor ? `<circle class="cursor" r="4.5" data-cursor="${cursor}"/>` : ''}
  </svg>`;
}
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };

const frictionChart = chart({
  x0: 0, x1: 12, y0: 0, y1: 12, xlabel: '外加推力 (N)', ylabel: '摩擦力 (N)', cursor: 'friction', label: '摩擦力随外加推力的变化',
  series: [{ pts: [[0, 0], [M.F_SMAX, M.F_SMAX]], tag: [2.2, 2.2, '静摩擦：f = F'] }, { pts: [[M.F_SMAX, M.F_K], [12, M.F_K]], tag: [5.6, M.F_K - 1.6, '滑动摩擦：μk·FN →'] }, { cls: 'trend', pts: [[M.F_SMAX, M.F_SMAX], [M.F_SMAX, M.F_K]] }],
  marks: [[M.F_SMAX, M.F_SMAX, `${f(M.F_SMAX)} N`]],
});

export const PAGES = [
  {
    kicker: '第 2 章', title: '牛顿运动定律', sub: '是什么改变了运动',
    body: `
      <p class="lede">运动学描述运动，动力学解释运动：<b>力</b>就是推或拉，而改变运动的正是力。</p>
      <p>力是矢量，画成从物体中心出发的箭头。1 牛顿是使 1 kg 物体产生 1 m/s² 加速度的力。这个 ${f(M.M1, 1)} kg 的木块受到两个力：</p>
      <table class="data">
        <tr><th>力</th><th>符号</th><th>本例</th></tr>
        <tr><td>重力</td><td><i>F</i><sub>g</sub> = <i>mg</i></td><td>${f(M.W1, 1)} N，向下</td></tr>
        <tr><td>支持力（来自接触面）</td><td><i>F</i><sub>N</sub></td><td>${f(M.FN, 1)} N，向上</td></tr>
        <tr><td>拉力（来自绳）</td><td><i>T</i></td><td>—</td></tr>
        <tr><td>摩擦力</td><td><i>f</i></td><td>—</td></tr>
        <tr><td>阻力（来自空气）</td><td><i>F</i><sub>d</sub></td><td>—</td></tr>
      </table>
      <p>第一步总是画<b>受力分析图</b>：把物体画成一个点，把它受到的每个力画成箭头。点击木块即可看到。</p>`,
    cam: { target: at('rest', 0.45), az: -30, el: 12, dist: 9 }, lit: 'rest', scene: 'rest', look: {},
    fig: '静止的木块',
  },
  {
    kicker: '2.1', title: '拉力', sub: '绳只能拉，不能推',
    body: `
      <p class="lede"><b>拉力</b> <i>T</i> 是绳或绳索沿自身方向的拉力。绳只能拉，永远不能推。</p>
      <p>左边，${f(M.M1, 1)} kg 的木块挂在一根绳上。它处于平衡状态，所以 <i>T</i> = <i>mg</i> = ${f(M.W1, 1)} N。</p>
      <p>右边，两根绳分担重量。只有它们的竖直分量托住木块，所以 2<i>T</i> sin θ = <i>mg</i>，即</p>
      <div class="eq"><i>T</i> = <i>mg</i> / (2 sin θ)</div>
      <p>绳越平，θ 越小，拉力越大：70° 时 ${f(M.tension2(70), 1)} N，30° 时 ${f(M.tension2(30), 1)} N，20° 时 ${f(M.tension2(20), 1)} N。这就是晾衣绳永远拉不成完全笔直的原因。两个水平分量互相抵消。</p>
      <div class="charts">${chart({ x0: 10, x1: 90, y0: 0, y1: 60, xlabel: '绳的角度 θ (°)', ylabel: '每根绳的拉力 (N)', cursor: 'tension', label: '拉力随绳的角度的变化',
        series: [{ pts: Array.from({ length: 41 }, (_, i) => { const d = 12 + i * 1.95; return [d, Math.min(M.tension2(d), 60)]; }) }] })}</div>
      <p class="hintline">点击绳子，把每个拉力分解为分量。</p>`,
    cam: { target: [STATIONS.tension, 1.5, 0], az: -10, el: 5, dist: 11 }, lit: 'tension', scene: 'tension', look: {},
    fig: '一根绳，然后两根',
  },
  {
    kicker: '2.2', title: '牛顿第一定律', sub: '惯性',
    body: `
      <p class="lede">除非受到不为零的<b>合力</b>作用，静止的物体保持静止，做直线运动的物体保持原来的速度继续运动。</p>
      <p>这个木块以 ${f(M.V_GLIDE, 1)} m/s 在光滑平面上滑行。它的重力和支持力互相抵消，所以 Σ<i>F</i> = 0，没有什么改变它的运动。频闪像的间距相等。</p>
      <p><b>平衡</b>指 Σ<i>F</i> = 0。这包括匀速运动，而不只是静止。<i>维持</i>它运动不需要任何力。</p>
      <div class="charts">${chart({ x0: 0, x1: 2.4, y0: 0, y1: 3.6, xlabel: '时间 (s)', ylabel: '位置 (m)', label: '位置随时间变化：一条直线', series: [{ pts: [[0, 0], [2.4, 3.6]] }] })}</div>`,
    cam: { target: at('glide', 0.45), az: -18, el: 14, dist: 12 }, lit: 'glide', scene: 'glide', look: {},
    fig: '速度恒定，合力为零',
  },
  {
    kicker: '2.3', title: '水平飞行', sub: '在运动，但处于平衡',
    body: `
      <p class="lede">一架 ${M.PLANE.m} kg 的飞机以恒定的 ${M.PLANE.v} m/s 水平直线巡航。它的速度没有变化，所以由牛顿第一定律，合力为零。</p>
      <table class="data">
        <tr><td>升力（向上，来自机翼）</td><td>${(M.PLANE.L / 1000).toFixed(2)} kN</td></tr>
        <tr><td>重力（向下）</td><td>${(M.PLANE.W / 1000).toFixed(2)} kN</td></tr>
        <tr><td>推力（向前，来自螺旋桨）</td><td>${(M.PLANE.T / 1000).toFixed(2)} kN</td></tr>
        <tr><td><b>阻力</b>（向后，来自空气）</td><td>${(M.PLANE.D / 1000).toFixed(2)} kN</td></tr>
      </table>
      <p><b>阻力</b>是流体对在其中运动的物体施加的、阻碍运动的力。它随速度增大，大致为 <i>F</i><sub>d</sub> = ½<i>DρAv</i>²（<i>D</i> 为阻力系数，<i>A</i> 为迎流面积）。发动机不是用来维持飞机运动的，而是用来抵消阻力的。</p>
      <p class="hintline">这里的箭头每千牛长 ${(KN_SCALE * 100).toFixed(0)} cm。</p>`,
    cam: { target: [STATIONS.plane, 3.0, 0], az: -26, el: 9, dist: 34 }, lit: 'plane', scene: 'plane', look: {},
    fig: '升力 = 重力，推力 = 阻力',
  },
  {
    kicker: '2.4', title: '牛顿第二定律', sub: 'ΣF = ma',
    body: `
      <p class="lede">合力使物体沿合力方向产生加速度，大小为 Σ<i>F</i>/<i>m</i>。</p>
      <p>两个木块在光滑平面上受到同样 ${f(M.PUSH, 1)} N 的推力。${f(M.M1, 1)} kg 的木块加速度为 ${f(M.A1, 1)} m/s²。${f(M.M2, 1)} kg 的木块质量加倍，加速度减半：${f(M.A2, 1)} m/s²。</p>
      <p>力越大，加速度越大；质量越大，加速度越小。</p>
      <div class="charts">${chart({ x0: 0, x1: 12, y0: 0, y1: 6, xlabel: '合力 (N)', ylabel: '加速度 (m/s²)', label: '2 kg 和 4 kg 木块的加速度随合力的变化', series: [{ pts: [[0, 0], [12, 6]], tag: [9, 4.5, '2 kg'] }, { pts: [[0, 0], [12, 3]], tag: [9.6, 2.4, '4 kg'] }], marks: [[M.PUSH, M.A1, '3.0'], [M.PUSH, M.A2, '1.5']] })}</div>`,
    cam: { target: [STATIONS.second + 1.2, 0.4, 0], az: -22, el: 20, dist: 12 }, lit: 'second', scene: 'second', look: {},
    fig: '同样 6.0 N 的力分别作用在 2 kg 和 4 kg 上',
  },
  {
    kicker: '2.5', title: '是什么推动汽车？', sub: '是路面',
    body: `
      <p class="lede">发动机带动车轮转动，但发动机是汽车的一部分，而任何东西都不能推动自己。汽车受到的向前的力来自<b>路面</b>：作用在轮胎上的静摩擦力。</p>
      <p>轮胎向后推路面。由牛顿第三定律，路面向前推轮胎，这里是 ${f(M.CAR.F / 1000, 1)} kN。轮胎没有打滑，所以这是<i>静</i>摩擦力，尽管汽车在运动。</p>
      <p>空气阻力向后推，并随 <i>v</i>² 增大：${f(M.car(M.CAR.run).v, 1)} m/s 时只有 ${f(M.car(M.CAR.run).D, 0)} N，到高速公路车速（30 m/s）时就有 ${f(M.CAR.k * 30 * 30, 0)} N。汽车越来越快，合力和加速度随之减小。</p>
      <div class="charts">${chart({ x0: 0, x1: 3.2, y0: 0, y1: 10, xlabel: '时间 (s)', ylabel: '速率 (m/s)', cursor: 'car', label: '汽车速率随时间的变化',
        series: [{ pts: Array.from({ length: 33 }, (_, i) => [i * 0.1, M.car(i * 0.1).v]) }] })}</div>
      <p class="hintline">箭头：每千牛长 ${(KN_SCALE * 100).toFixed(0)} cm。</p>`,
    cam: { target: [STATIONS.car + 0.5, 1.2, 0], az: -20, el: 14, dist: 36 }, lit: 'car', scene: 'car', look: {},
    fig: '摩擦力向前，阻力向后',
  },
  {
    kicker: '2.6', title: '摩擦力', sub: '先静摩擦，后滑动摩擦',
    body: `
      <p class="lede">在粗糙地面上，推力每秒均匀增大 ${f(M.RAMP, 1)} N。开始时木块不动：<b>静摩擦力</b>恰好与推力相等。</p>
      <p>静摩擦力有上限，μ<sub>s</sub><i>F</i><sub>N</sub> = ${f(M.MU_S)} × ${f(M.FN, 1)} = ${f(M.F_SMAX)} N。再用力推，木块就开始滑动。此后由<b>滑动摩擦力</b>接替，大小较小且恒定，μ<sub>k</sub><i>F</i><sub>N</sub> = ${f(M.F_K)} N，与推力无关。红色箭头（合力）只在推力胜出后才出现。</p>
      <div class="charts">${frictionChart}</div>`,
    cam: { target: [STATIONS.friction + 0.4, 0.45, 0], az: -26, el: 13, dist: 9 }, lit: 'friction', scene: 'friction', look: {},
    fig: '在粗糙地面上逐渐增大的推力',
  },
  {
    kicker: '2.7', title: '牛顿第三定律', sub: '力总是成对出现',
    body: `
      <p class="lede">如果 A 推 B，B 就同时以大小相等、方向相反的力推 A。</p>
      <p>${f(M.PUSH, 1)} N 的推力使两个木块一起以 ${f(M.A_PAIR, 1)} m/s² 加速。要让 B（${f(M.M2, 1)} kg）获得这个加速度，A 必须以 ${f(M.CONTACT, 1)} N 推它。B 以 ${f(M.CONTACT, 1)} N 推回 A，所以 A 受到的合力是 ${f(M.PUSH - M.CONTACT, 1)} N，恰好等于 ${f(M.M1, 1)} kg × ${f(M.A_PAIR, 1)} m/s²。</p>
      <p>一对作用力与反作用力作用在<b>不同物体</b>上，所以它们永远不会互相抵消。重力和支持力<i>不是</i>一对作用力与反作用力：两者都作用在同一个木块上。木块所受重力的反作用力，是木块对地球向上的吸引力。</p>`,
    cam: { target: [STATIONS.third + 0.9, 0.45, 0], az: -24, el: 12, dist: 9 }, lit: 'third', scene: 'third', look: {},
    fig: 'A 推 B，B 推 A',
  },

  {
    kicker: '2.8', title: '选择系统', sub: '内力互相抵消',
    body: `
      <p class="lede">在你选定的任意物体周围画一条边界，把它们称为<b>系统</b>。系统内部物体之间的力是<b>内力</b>，来自系统外任何物体的力是<b>外力</b>。</p>
      <p>滑冰者 A（${TG.mA} kg）和滑冰者 B（${TG.mB} kg）站在光滑的冰面上，收拉一根轻绳。绳对每人的拉力都是 ${TG.T} N，所以 A 以 ${f(TG.aA, 1)} m/s²、B 以 ${f(TG.aB, 1)} m/s² 相向加速。</p>
      <p>把滑冰者和绳一起作为系统。拉力是内力，它们成对出现、等大反向，所以总和为零。重力和支持力是外力，但它们互相抵消。整个系统不能加速，它的<b>质心</b>保持不动：</p>
      <div class="eq"><i>x</i><sub>cm</sub> = Σ<i>m</i><i>x</i> / Σ<i>m</i></div>
      <div class="eq">= (<i>m</i><sub>A</sub><i>x</i><sub>A</sub> + <i>m</i><sub>B</sub><i>x</i><sub>B</sub>) / (<i>m</i><sub>A</sub> + <i>m</i><sub>B</sub>)</div>
      <table class="data">
        <tr><th></th><th><i>x</i><sub>A</sub></th><th><i>x</i><sub>B</sub></th><th><i>x</i><sub>cm</sub></th></tr>
        <tr><td>开始时</td><td>${f(M.tug(0).xA)} m</td><td>${f(M.tug(0).xB)} m</td><td>0.00 m</td></tr>
        <tr><td>${f(TG.run, 2)} s 后</td><td>${f(M.tug(TG.run).xA)} m</td><td>${f(M.tug(TG.run).xB)} m</td><td>0.00 m</td></tr>
      </table>
      <p>较轻的滑冰者滑过的距离更远，${f(M.tug(TG.run).xA - TG.xA0, 1)} m 对 ${f(TG.xB0 - M.tug(TG.run).xB, 1)} m，比例恰好使 <i>x</i><sub>cm</sub> 保持不变。假如他们原本一起滑行，<i>x</i><sub>cm</sub> 就会以同样的速度继续滑行。</p>
      <div class="charts">${chart({ x0: 0, x1: 1.7, y0: -3, y1: 2, xlabel: '时间 (s)', ylabel: '位置 (m)', cursor: 'tug', label: '两名滑冰者及质心的位置随时间的变化',
        series: [{ pts: Array.from({ length: 21 }, (_, i) => [i * TG.run / 20, M.tug(i * TG.run / 20).xA]), tag: [0.15, TG.xA0 + 0.25, 'A'] }, { pts: Array.from({ length: 21 }, (_, i) => [i * TG.run / 20, M.tug(i * TG.run / 20).xB]), tag: [0.75, M.tug(0.75).xB - 0.75, 'B'] }, { cls: 'curve total', pts: [[0, 0], [TG.run, 0]], tag: [1.2, 0.1, 'x<tspan dy="3" font-size="8">cm</tspan>'] }] })}</div>
      <p class="hintline">这里的箭头每牛顿长 ${(TUG_SCALE * 100).toFixed(1)} cm。点击滑冰者查看系统边界。</p>`,
    cam: { target: [STATIONS.tug - 0.45, 0.95, 0], az: -8, el: 9, dist: 18 }, lit: 'tug', scene: 'tug', look: {},
    fig: '在冰上收拉绳子',
  },
  {
    kicker: '2.9', title: '质心的加速度', sub: 'ΣF_ext = M a_cm',
    body: `
      <p class="lede">对系统的每一部分写出 <i>F</i> = <i>ma</i>，再全部相加。内力成对抵消，剩下的就是整个系统的牛顿第二定律：</p>
      <div class="eq">Σ<i>F</i><sub>ext</sub> = <i>M</i> <i>a</i><sub>cm</sub>，&nbsp; <i>M</i> = Σ<i>m</i></div>
      <p>${f(BD.m, 1)} kg 的木块放在冰面上一块 ${f(BD.Mb, 1)} kg 的木板上，一根绳以 ${BD.F} N 拉木板。这超过了静摩擦力所能分配的上限（μ<sub>s</sub><i>Mg</i> = ${f(BD.Fslip)} N），所以木块打滑。${f(BD.f)} N 的滑动摩擦力拖着木块向前、拖着木板向后。</p>
      <table class="data">
        <tr><td>木块：<i>f</i>/<i>m</i></td><td>${f(BD.aBlock)} m/s²</td></tr>
        <tr><td>木板：(<i>F</i> − <i>f</i>)/<i>M</i><sub>木板</sub></td><td>${f(BD.aBoard)} m/s²</td></tr>
        <tr><td><b>系统</b>：<i>F</i>/(<i>m</i> + <i>M</i><sub>木板</sub>)</td><td>${f(BD.aCm)} m/s²</td></tr>
      </table>
      <p>验算：(${f(BD.m, 1)} × ${f(BD.aBlock)} + ${f(BD.Mb, 1)} × ${f(BD.aBoard)}) / ${f(BD.M, 1)} = ${f(BD.aCm)} m/s²。摩擦力对 <i>a</i><sub>cm</sub> 毫无影响。从餐具底下猛抽桌布也是同样的道理：拖动餐具的只有摩擦力，它最多只能给餐具 μ<i>g</i> 的加速度。</p>
      <div class="charts">${chart({ x0: 0, x1: 1.1, y0: 0, y1: 4.5, xlabel: '时间 (s)', ylabel: '速度 (m/s)', cursor: 'board', label: '木块、木板和质心的速度随时间的变化',
        series: [{ pts: [[0, 0], [1.1, BD.aBoard * 1.1]], tag: [0.86, BD.aBoard * 0.86 + 0.2, '木板'] }, { cls: 'curve total', pts: [[0, 0], [1.1, BD.aCm * 1.1]], tag: [0.92, BD.aCm * 0.92 - 0.95, '质心'] }, { pts: [[0, 0], [1.1, BD.aBlock * 1.1]], tag: [0.8, BD.aBlock * 0.8 - 0.75, '木块'] }] })}</div>
      <p class="hintline">箭头：每牛顿长 ${(F_SCALE * 100).toFixed(0)} cm。点击可抬起木块，查看这对摩擦力。</p>`,
    cam: { target: [STATIONS.board + 0.4, 0.5, 0], az: -16, el: 15, dist: 13.5 }, lit: 'board', scene: 'board', look: {},
    fig: '从木块下方抽出的木板',
  },
  {
    kicker: '2.10', title: '斜面', sub: '把坐标轴倾斜',
    body: `
      <p class="lede">在斜面上，沿斜面和垂直于斜面建立坐标轴。这样重力就分解为两个分量。</p>
      <table class="data">
        <tr><td>沿斜面</td><td><i>mg</i> sin θ = ${f(M.W_PAR)} N</td></tr>
        <tr><td>垂直压向斜面</td><td><i>mg</i> cos θ = ${f(M.W_PERP)} N</td></tr>
      </table>
      <p>垂直于斜面方向没有加速度，所以支持力抵消了第二个分量：<i>F</i><sub>N</sub> = <i>mg</i> cos θ = ${f(M.FN_INC)} N。只剩下沿斜面的分量：<i>a</i> = <i>g</i> sin θ = ${f(M.A_INC)} m/s²。</p>
      <p>加上摩擦力，当 tan θ = μ<sub>k</sub> 时木块匀速下滑。对 μ<sub>k</sub> = ${f(M.MU_K)}，这个角度是 ${f(M.critical(M.MU_K), 1)}°。</p>
      <p class="hintline">点击木块，分解它的重力。</p>`,
    cam: { target: [STATIONS.incline - 0.2, 1.0, 0], az: -8, el: 12, dist: 12 }, lit: 'incline', scene: 'incline', look: {},
    fig: `${M.THETA_DEG}° 斜面`,
  },
  {
    kicker: '2.11 · AP 物理 C', title: '与 v 成正比的阻力', sub: '终端速度',
    body: `
      <p class="lede">阻力与速度方向相反，并随速率增大。对于在黏稠流体中缓慢运动的小物体，阻力就与速率成正比：<i>F</i><sub>d</sub> = −<i>bv</i>。</p>
      <p>一个 ${f(DR.m, 2)} kg、<i>b</i> = ${f(DR.b)} kg/s 的小球由静止释放。取向下为正：</p>
      <div class="eq"><i>m</i> d<i>v</i>/d<i>t</i> = <i>mg</i> − <i>bv</i></div>
      <p>开始时 <i>v</i> = 0，<i>a</i> = <i>g</i>。随着速度增大，阻力增大，合力减小。当 <i>bv</i> = <i>mg</i> 时合力为零：这就是<b>终端速度</b> <i>v</i><sub>t</sub> = <i>mg</i>/<i>b</i> = ${f(DR.vt)} m/s。令 τ = <i>m</i>/<i>b</i>，分离变量：</p>
      <div class="eq">d<i>v</i> / (<i>v</i><sub>t</sub> − <i>v</i>) = d<i>t</i> / τ</div>
      <div class="eq">∫<sub>0</sub><sup><i>v</i></sup> d<i>v</i>′/(<i>v</i><sub>t</sub> − <i>v</i>′) = ∫<sub>0</sub><sup><i>t</i></sup> d<i>t</i>′/τ</div>
      <div class="eq">−ln(1 − <i>v</i>/<i>v</i><sub>t</sub>) = <i>t</i>/τ</div>
      <div class="eq"><i>v</i>(<i>t</i>) = <i>v</i><sub>t</sub> (1 − e<sup>−<i>t</i>/τ</sup>)</div>
      <p>这里 τ = ${f(DR.tau)} s。经过一个 τ，小球达到 <i>v</i><sub>t</sub> 的 1 − 1/e = 63.2%；经过 3τ，达到 95%；经过 5τ，达到 99.3%。它永远不会完全达到。</p>
      <div class="charts">${chart({ x0: 0, x1: 2, y0: 0, y1: 4.5, xlabel: '时间 (s)', ylabel: '速率 (m/s)', cursor: 'drag', label: '速率随时间趋近终端速度',
        series: [{ cls: 'trend', pts: [[0, DR.vt], [2, DR.vt]], tag: [1.62, DR.vt, 'v<tspan dy="3" font-size="8">t</tspan>'] }, { pts: Array.from({ length: 41 }, (_, i) => [i * 0.05, M.linDrag(i * 0.05).v]) }, { cls: 'trend', pts: [[DR.tau, 0], [DR.tau, M.linDrag(DR.tau).v]] }],
        marks: [[DR.tau, M.linDrag(DR.tau).v, `τ = ${f(DR.tau, 1)} s 时达 63.2%`]] })}
        ${chart({ x0: 0, x1: 2, y0: 0, y1: 6, xlabel: '时间 (s)', ylabel: '力 (N)', cursor: 'dragF', label: '阻力和重力随时间的变化',
        series: [{ cls: 'trend', pts: [[0, DR.W], [2, DR.W]], tag: [1.2, DR.W, '重力 <tspan font-style="italic">mg</tspan>'] }, { pts: Array.from({ length: 41 }, (_, i) => [i * 0.05, M.linDrag(i * 0.05).D]), tag: [0.5, M.linDrag(0.5).D - 2.2, '阻力 <tspan font-style="italic">bv</tspan>'] }] })}</div>
      <p class="hintline">这里的箭头每牛顿长 ${(DRAG_SCALE * 100).toFixed(0)} cm。点击小球查看它实时的受力分析图。</p>`,
    cam: { target: [STATIONS.drag, 2.8, 0], az: -10, el: 5, dist: 23 }, lit: 'drag', scene: 'drag', look: {},
    fig: '受阻力 −bv 作用下落的小球',
  },
  {
    kicker: '2.12 · AP 物理 C', title: '真实流体', sub: '位置，以及用哪种阻力规律',
    body: `
      <p class="lede">再积分一次，得到下落的距离：</p>
      <div class="eq"><i>x</i>(<i>t</i>) = ∫<sub>0</sub><sup><i>t</i></sup> <i>v</i> d<i>t</i>′ = <i>v</i><sub>t</sub> [ <i>t</i> − τ (1 − e<sup>−<i>t</i>/τ</sup>) ]</div>
      <p>几个 τ 之后，它近似为 <i>v</i><sub>t</sub>(<i>t</i> − τ)：小球下落得就像一直以 <i>v</i><sub>t</sub> 运动、只是晚出发了 τ 一样（下图虚线）。</p>
      <p>线性阻力适用于在黏稠流体中缓慢运动的小物体。大的或快的物体会把流体推开，阻力随 <i>kv</i>² 增大，就像 2.5 节中汽车受到的阻力。这时 <i>v</i><sub>t</sub> = √(<i>mg</i>/<i>k</i>)。</p>
      <table class="data">
        <tr><th>下落物体</th><th><i>v</i><sub>t</sub></th><th>τ</th><th>阻力</th></tr>
        <tr><td>雾滴，20 µm</td><td>${f(M.drop(1e-5).vLin * 100, 1)} cm/s</td><td>${f(M.drop(1e-5).tau * 1000, 1)} ms</td><td><i>bv</i></td></tr>
        <tr><td>蜂蜜中的钢球，10 mm</td><td>${f(HN.vt * 100, 1)} cm/s</td><td>${f(HN.tau * 1000, 1)} ms</td><td><i>bv</i></td></tr>
        <tr><td>雨滴，2 mm</td><td>${f(M.drop(1e-3).vQuad, 1)} m/s</td><td>—</td><td><i>kv</i>²</td></tr>
      </table>
      <p>对雨滴，按 <i>bv</i> 会算出 ${f(M.drop(1e-3).vLin, 0)} m/s。它实际下落的速率约为 6.5 m/s，与 <i>kv</i>² 的预测一致。</p>
      <p>蜂蜜中的钢球（画成实物的 10 倍大）还受到浮力 <i>B</i>，所以 <i>mg</i> 要换成 <i>mg</i> − <i>B</i>，<i>v</i><sub>t</sub> = (<i>mg</i> − <i>B</i>)/<i>b</i>。τ 只有 ${f(HN.tau * 1000, 1)} ms，它在不到一毫米内就达到终端速率，所以看起来从一开始就在匀速下沉。</p>
      <div class="charts">${chart({ x0: 0, x1: 2, y0: 0, y1: 7, xlabel: '时间 (s)', ylabel: '下落距离 (m)', label: '下落距离随时间的变化及其渐近线',
        series: [{ cls: 'trend', pts: [[DR.tau, 0], [2, DR.vt * (2 - DR.tau)]], tag: [1.25, DR.vt * 0.85 - 0.4, 'v<tspan dy="3" font-size="8">t</tspan><tspan dy="-3">(t − τ)</tspan>'] }, { pts: Array.from({ length: 41 }, (_, i) => [i * 0.05, M.linDrag(i * 0.05).x]) }] })}
        ${chart({ x0: 0, x1: 2, y0: 0, y1: 4.5, xlabel: '时间 (s)', ylabel: '速率 (m/s)，v_t 相同', label: '线性阻力与平方阻力，终端速率相同',
        series: [{ cls: 'trend', pts: [[0, DR.vt], [2, DR.vt]] }, { pts: Array.from({ length: 41 }, (_, i) => [i * 0.05, M.quadV(i * 0.05)]), tag: [0.18, M.quadV(0.3), 'kv²'] }, { pts: Array.from({ length: 41 }, (_, i) => [i * 0.05, M.linDrag(i * 0.05).v]), tag: [0.5, M.linDrag(0.4).v - 1.3, 'bv'] }] })}</div>
      <p>在 <i>v</i><sub>t</sub> 以下，<i>kv</i>² 比 <i>bv</i> 小，所以在 <i>v</i><sub>t</sub> 相同时它更快接近终端速率：<i>t</i> = τ 时达到 ${(100 * M.quadV(DR.tau) / DR.vt).toFixed(0)}%，而不是 63%。</p>
      <p class="hintline">这里的箭头每牛顿长 ${HONEY_SCALE} m。点击小球查看它的受力。</p>`,
    cam: { target: [STATIONS.honey, 0.68, 0], az: -12, el: 8, dist: 5.6 }, lit: 'honey', scene: 'honey', look: {},
    fig: '在蜂蜜中下沉的钢球',
  },
];

// ---------- click a scene: what it breaks into ----------
export const PLATES = {
  tug: { text: `浅色方框就是系统：两名滑冰者和绳。A 受到的拉力和 B 受到的拉力是内力；它们等大反向，总和为零。每名滑冰者的重力都被冰面的支持力抵消。没有合外力，质心（四等分的圆盘）就不能移动。`,
    facts: s => { const r = M.tug(s.tug.t), xc = M.xcm([TG.mA, TG.mB], [r.xA, r.xB]); return [['x<sub>A</sub>, v<sub>A</sub>', `${f(r.xA)} m，${f(r.vA)} m/s`], ['x<sub>B</sub>, v<sub>B</sub>', `${f(r.xB)} m，${f(r.vB)} m/s`], ['x<sub>cm</sub> = Σmx/Σm', `${f(Math.abs(xc) < 5e-3 ? 0 : xc)} m`], ['内力：A 受的 T + B 受的 T', `${TG.T} − ${TG.T} = 0 N`], ['外力：ΣF<sub>ext</sub>', '0 N']]; } },
  board: { text: `把它们抬开，这对摩擦力就显现出来：木板拖木块向前，木块拖木板向后，各 ${f(BD.f)} N。在木块 + 木板这个系统内部，它们互相抵消。只有拉力 F 是外力，所以质心以 F/M 加速，介于木块和木板的加速度之间。`,
    facts: s => { const t = s.board.t, r = M.board(t); return [['ΣF<sub>ext</sub> = F', `${BD.F} N`], ['M = m + M<sub>木板</sub>', `${f(BD.M, 1)} kg`], ['a<sub>cm</sub> = ΣF<sub>ext</sub>/M', `${f(BD.aCm)} m/s²`], ['v<sub>木块</sub>, v<sub>木板</sub>', `${f(r.vBlock)}, ${f(r.vBoard)} m/s`], ['v<sub>cm</sub>', `${f(M.xcm([BD.m, BD.Mb], [r.vBlock, r.vBoard]))} m/s`]]; } },
  drag: { text: `小球缩成它的受力分析图：重力向下，阻力向上。阻力为 bv，随速率增大，直到与重力相等，合力（红色）随之消失。加速度为 g e<sup>−t/τ</sup>：开始时最大，达到终端速率时为零。`,
    facts: s => { const r = M.linDrag(s.drag.t); return [['时间', `${f(s.drag.t)} s = ${f(s.drag.t / DR.tau, 1)} τ`], ['速率 v', `${f(r.v)} m/s = v<sub>t</sub> 的 ${(100 * r.v / DR.vt).toFixed(1)}%`], ['阻力 bv', `${f(r.D)} N`], ['重力 mg', `${f(DR.W)} N`], ['合力，a', `${f(DR.W - r.D)} N，${f(r.a)} m/s²`]]; } },
  honey: { text: `三个力，已经平衡：重力向下，阻力和浮力向上。小球处于终端速率，所以频闪像间距相等。这里阻力是线性的，因为雷诺数 ρvd/η（比较推开流体的作用与流体黏性的作用）远小于 1。`,
    facts: () => [['重力 mg', `${f(HN.W * 1000, 1)} mN`], ['浮力 B', `${f(HN.B * 1000, 1)} mN`], ['阻力 bv<sub>t</sub>（b = 6πηr）', `${f(HN.b * HN.vt * 1000, 1)} mN`], ['合力', '0 N'], ['v<sub>t</sub>, τ', `${f(HN.vt * 100, 2)} cm/s，${f(HN.tau * 1000, 1)} ms`], ['雷诺数', f(HN.Re, 3)]] },
  tension: { text: `每个拉力分解为一个水平分量和一个竖直分量（灰色）。两个水平分量等大反向，互相抵消；两个竖直分量加起来等于重力。绳越平，每个竖直分量越小，所以拉力必须越大。`,
    facts: s => { const th = M.hangAngle(s.clock * M.SLOW), T = M.tension2(th), r = th * Math.PI / 180; return [['角度 θ', `${th.toFixed(1)}°`], ['每根绳的拉力 T', `${f(T)} N`], ['竖直分量 T sin θ', `${f(T * Math.sin(r))} N × 2 = ${f(2 * T * Math.sin(r))} N`], ['水平分量 T cos θ', `${f(T * Math.cos(r))} N，互相抵消`]]; } },
  plane: { text: `四个力，两对平衡力。注意它们不是牛顿第三定律中的作用力与反作用力：四个力都作用在飞机上。升力与重力平衡，因为飞机既不爬升也不下降；推力与阻力平衡，因为它的速率不变。`,
    facts: () => [['升力 − 重力', '0 N'], ['推力 − 阻力', '0 N'], ['加速度', '0 m/s²'], ['速率', `${M.PLANE.v} m/s，恒定`]] },
  car: { text: `重力与支持力互相抵消。水平方向有两个力：路面的静摩擦力向前，空气阻力向后。两者之差就是合力（红色）。`,
    facts: s => { const c = M.car(s.car.t); return [['路面摩擦力（向前）', `${f(M.CAR.F)} N`], ['空气阻力（向后）', `${f(c.D)} N`], ['合力', `${f(M.CAR.F - c.D)} N`], ['加速度', `${f(c.a)} m/s²`], ['速率', `${f(c.v)} m/s`]]; } },
  rest: { text: `木块缩成一个点，只留下它受到的力：这就是它的受力分析图。两个力等大反向，所以合力为零，它保持静止。`,
    facts: () => [['重力 F<sub>g</sub>', `${f(M.W1)} N，向下`], ['支持力 F<sub>N</sub>', `${f(M.FN)} N，向上`], ['合力', '0 N']] },
  glide: { text: `受力分析图与静止的木块完全一样。Σ<i>F</i> = 0 并不意味着“不运动”，而是意味着“速度不变”。`,
    facts: s => [['速度', `${f(M.V_GLIDE)} m/s，恒定`], ['合力', '0 N'], ['加速度', '0 m/s²']] },
  second: { text: `红色箭头是每个木块受到的合力：都是 6.0 N。除以各自的质量，就得到各自的加速度。`,
    facts: s => [['2.0 kg：a = 6.0/2.0', `${f(M.A1)} m/s²`], ['4.0 kg：a = 6.0/4.0', `${f(M.A2)} m/s²`], ['时间', `${f(s.second.t)} s`]] },
  friction: { text: `木块受到的四个力，实时显示。竖直方向互相抵消。水平方向，在推力超过 ${f(M.F_SMAX)} N 之前，摩擦力与推力相等。此后摩擦力降为 ${f(M.F_K)} N，两者之差使木块加速。`,
    facts: s => { const r = M.friction(s.friction.t); return [['推力 F<sub>app</sub>', `${f(r.F)} N`], [`摩擦力（${r.kind === 'static' ? '静' : '滑动'}）`, `${f(r.f)} N`], ['合力', `${f(r.F - r.f)} N`], ['加速度', `${f(r.a)} m/s²`]]; } },
  third: { text: `把它们暂时拉开，这对力就一目了然：A 以 ${f(M.CONTACT, 1)} N 向前推 B，B 以 ${f(M.CONTACT, 1)} N 向后推 A。大小相等，方向相反，作用在不同的木块上。`,
    facts: () => [['A 受的力（外部推力）', `${f(M.PUSH, 1)} N →`], ['F<sub>B 对 A</sub>', `${f(M.CONTACT, 1)} N ←`], ['F<sub>A 对 B</sub>', `${f(M.CONTACT, 1)} N →`], ['两者的加速度', `${f(M.A_PAIR, 1)} m/s²`]] },
  incline: { text: `重力（竖直向下）被它沿倾斜坐标轴的两个分量代替。支持力抵消了垂直于斜面的分量，沿斜面的分量就是合力，所以木块沿斜面加速下滑。`,
    facts: () => [['mg sin θ', `${f(M.W_PAR)} N`], ['mg cos θ = F<sub>N</sub>', `${f(M.W_PERP)} N`], ['a = g sin θ', `${f(M.A_INC)} m/s²`]] },
};
