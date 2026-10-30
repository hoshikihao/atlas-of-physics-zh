// Chapter 9, page by page (after the AP Physics C: E&M organizer, Unit 1). Text and a chart on
// the left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, S, E_SCALE, F_SCALE, PL } from './world.js';

const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const sci = (x, n = 2) => { const p = Math.floor(Math.log10(Math.abs(x))), m = x / 10 ** p; return `${m.toFixed(n)} × 10<sup>${p < 0 ? '−' + -p : p}</sup>`; };
const cm = x => (x * 100).toFixed(0);
const kNC = x => (x / 1000).toFixed(2);
export const STAGE = { 'neutral': '中性', 'rod brought near': '棒移近', 'charges separate': '电荷分离', 'grounded': '接地', 'ground cut': '断开接地', 'rod taken away': '移走棒', 'charged by induction': '感应带电' };
const ATOM = { 'neutral atom': '中性原子', 'negative ion': '负离子', 'positive ion': '正离子' };

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
const curve = (x0, x1, fn, n = 80) => Array.from({ length: n + 1 }, (_, i) => { const x = x0 + (x1 - x0) * i / n; return [x, fn(x)]; });
const clip = (y, y1) => Math.min(y, y1);
// chart ranges shared with main.js (live cursors)
export const RANGE = {
  induce: { x0: 0, x1: Math.ceil(M.INDUCE.run), y0: -1, y1: 4 },
  coulomb: { x0: 15, x1: 50, y0: 0, y1: 4 },
  line: { x0: 10, x1: 40, y0: -0.4, y1: 0.3 },
  field: { x0: 5, x1: 35, y0: 0, y1: 4 },
  dipole: { x0: 10, x1: 50, y0: 0, y1: 2 },
  rod: { x0: 0, x1: 40, y0: 0, y1: 4 },
  ring: { x0: 0, x1: 60, y0: 0, y1: 1.5 },
  plates: { x0: 0, x1: 12, y0: 0, y1: 14 },
};
const at = (k, x = 0, y = 0.4) => [STATIONS[k] + x, y, 0];
const R = RANGE;

const pairF = r => M.coulomb(M.PAIR.q1, M.PAIR.q2, r);
const inducedSeries = () => curve(0, M.INDUCE.run, t => M.induce(t).Qnet / M.nC, 200);

export const PAGES = [
  {
    kicker: '第 9 章', title: '电荷', sub: '以电子为单位计数',
    body: `
      <p class="lede">原子由带电的部分组成：原子核里的<b>质子</b>（+），核外的<b>电子</b>（−），以及不带电的中子。同种电荷相互排斥，异种电荷相互吸引。</p>
      <table class="data">
        <tr><th>粒子</th><th>电荷量</th><th>质量</th></tr>
        <tr><td>质子</td><td>+<i>e</i></td><td>${sci(M.MP)} kg</td></tr>
        <tr><td>电子</td><td>−<i>e</i></td><td>${sci(M.ME)} kg</td></tr>
        <tr><td>中子</td><td>0</td><td>≈ <i>m</i><sub>p</sub></td></tr>
      </table>
      <div class="eq">1 <i>e</i> = ${sci(M.QE)} C</div>
      <p>质子与电子数目相等：<b>中性</b>。电子多了：<b>带负电</b>。电子少了：<b>带正电</b>。固体起电时只有电子移动，任何电荷量都是 <i>e</i> 的整数倍。</p>
      <p><b>电荷守恒：</b>电荷既不会凭空产生，也不会消灭，只会转移。用毛皮摩擦棒，一方得到 +<i>q</i>，另一方得到 −<i>q</i>。</p>
      <p class="hintline">点击原子，找出多出的那个电子和缺少的那个电子。</p>`,
    cam: { target: at('charge', 0, 0.3), az: -14, el: 10, dist: 25 }, lit: 'atoms', scene: 'atoms', look: {},
    fig: '中性、带负电、带正电',
  },
  {
    kicker: '9.1', title: '使物体带电', sub: '移动电子的四种方式',
    body: `
      <p class="lede">起电从不创造电荷，只是把电子移到物体上、从物体上移走，或在物体内部移动。</p>
      <table class="data">
        <tr><td><b>摩擦起电</b></td><td>用毛皮摩擦 PVC 棒：电子从一方转移到另一方</td></tr>
        <tr><td><b>接触起电</b></td><td>接触：在金属上会散开，在绝缘体上留在原处</td></tr>
        <tr><td><b>感应起电</b></td><td>不接触：把金属里的电子推开，再接地</td></tr>
        <tr><td><b>极化</b></td><td>绝缘体的分子被拉伸成电偶极子</td></tr>
      </table>
      <p>带 ${f(M.ROD.Q / M.nC, 0)} nC 的棒移近到 ${cm(M.ROD.near)} cm 处。球内的自由电子挤到远侧；接地让它们流走。球最终带 <b>+${f(M.QG / M.nC)} nC</b>，与棒的电性相反。</p>
      <div class="charts">${chart({ ...R.induce, xlabel: '时间（s）', ylabel: '球上的净电荷（nC）', cursor: 'induce', label: '感应起电全过程中球上的净电荷',
        series: [{ pts: inducedSeries() }] })}</div>
      <p class="hintline">小珠的大小表示面电荷密度 σ。点击金属球或气球。</p>`,
    cam: { target: at('charging', -0.3, 0.4), az: -8, el: 8, dist: 32 }, lit: 'induce', scene: 'induce', look: {},
    fig: '感应起电与极化',
  },
  {
    kicker: '9.2', title: '库仑定律', sub: '平方反比',
    body: `
      <p class="lede">两个点电荷之间的力与电荷量的乘积成正比，与距离的平方成反比。</p>
      <div class="eq"><i>F</i> = <i>k</i>|<i>q</i><sub>1</sub><i>q</i><sub>2</sub>|/<i>r</i>²</div>
      <p><i>k</i> = 1/4πε<sub>0</sub> = ${sci(M.K)} N·m²/C²。代入大小 |<i>q</i>|；正负号只说明是吸引还是排斥。两个力是一对作用力与反作用力：大小相等，哪怕一个电荷是另一个的两倍。</p>
      <div class="charts">${chart({ ...R.coulomb, xlabel: '间距 r（cm）', ylabel: '每个电荷受的力（N）', cursor: 'coulomb', label: '力随间距变化，按 1/r² 减小',
        series: [{ pts: curve(15, 50, x => clip(pairF(x / 100), 4)) }], marks: [[20, pairF(0.2), `${f(pairF(0.2))} N`], [40, pairF(0.4), `${f(pairF(0.4))} N`, -46, -8]] })}</div>
      <p><b>有多强？</b>让两个相距 1 m、质量 ${M.PEOPLE.m} kg 的人各自质子比电子多 1%：每人带 ${sci(M.PEOPLE.q)} C，<i>F</i> = ${sci(M.PEOPLE.F)} N，足以让地球产生 ${f(M.PEOPLE.a, 1)} m/s² 的加速度。</p>
      <p class="hintline">按实际尺寸放大 ${S} 倍；力 ${cm(F_SCALE.coulomb)} cm 代表 1 N。点击查看一对同种电荷。</p>`,
    cam: { target: at('coulomb', 0, 0.1), az: -12, el: 8, dist: 13 }, lit: 'coulomb', scene: 'coulomb', look: {},
    fig: `+${M.PAIR.q1 / M.uC} μC 与 −${-M.PAIR.q2 / M.uC} μC`,
  },
  {
    kicker: '9.3', title: '合力', sub: '以及平衡点',
    body: `
      <p class="lede">有多个电荷时，先求出每个电荷对所研究电荷的力，再按矢量相加：这就是<b>叠加原理</b>。</p>
      <p>一个 +${f(M.LINE.q0 / M.uC, 1)} μC 的试探电荷位于 A（+${M.LINE.qA / M.uC} μC）和 B（+${M.LINE.qB / M.uC} μC）之间，A、B 相距 ${cm(M.LINE.D)} cm。两者都推它。两个推力在下面的位置平衡：</p>
      <div class="eq sm"><i>kq</i><sub>A</sub>/<i>x</i>² = <i>kq</i><sub>B</sub>/(<i>d</i> − <i>x</i>)²  →  <i>x</i> = ${cm(M.LINE.xEq)} cm</div>
      <p>平衡点总是<b>更靠近电荷量较小的那个</b>。它不一定在两者之间：把 B 换成负电荷，平衡点就移到 B 外侧的 ${cm(M.LINE.xEqUnlike)} cm 处。</p>
      <div class="charts">${chart({ ...R.line, xlabel: '位置 x（cm）', ylabel: 'q₀ 受的合力（N）', cursor: 'line', label: '试探电荷所受合力随位置变化，在平衡点处过零',
        series: [{ pts: curve(10, 40, x => Math.max(Math.min(M.lineForces(x / 100).net[0], 0.3), -0.4)) }], marks: [[M.LINE.xEq * 100, 0, `${cm(M.LINE.xEq)} cm`, 6, -8]] })}</div>
      <p class="hintline">力 ${f(F_SCALE.line, 0)} cm 代表 0.01 N。点击让试探电荷停在平衡点。</p>`,
    cam: { target: at('line', 0, 0.3), az: -10, el: 8, dist: 15.5 }, lit: 'line', scene: 'line', look: {},
    fig: 'A、B 之间的试探电荷',
  },
  {
    kicker: '9.4', title: '电场', sub: '单位电荷受到的力',
    body: `
      <p class="lede">电荷会改变它周围的空间。把一个小的正<b>试探电荷</b> <i>q</i><sub>0</sub> 放在任何位置，它都会受力；电场就是每库仑电荷受到的力。</p>
      <div class="eq"><b>E</b> = <b>F</b>/<i>q</i><sub>0</sub> = (<i>kQ</i>/<i>r</i>²) <b>r̂</b></div>
      <p><b>r̂</b> 背离 <i>Q</i>。+<i>Q</i> 的电场向外，−<i>Q</i> 的电场向内。单位为 N/C。</p>
      <table class="data">
        <tr><td><b>电场线</b></td><td>表示方向，疏密表示强弱；起于 +，止于 −</td></tr>
        <tr><td><b>场矢量</b></td><td>还能表示大小：在 10、20、30 cm 处分别为 ${f(M.pointMag(M.POINT.Q, 0.1), 0)}、${f(M.pointMag(M.POINT.Q, 0.2), 0)}、${f(M.pointMag(M.POINT.Q, 0.3), 0)} N/C</td></tr>
      </table>
      <div class="charts">${chart({ ...R.field, xlabel: '距离 r（cm）', ylabel: 'E（kN/C）', cursor: 'field', label: '电场强度随距离变化，按 1/r² 减小',
        series: [{ cls: 'curve total', pts: curve(5, 35, x => clip(M.pointMag(M.POINT.Q, x / 100) / 1000, 4)) }] })}</div>
      <p class="hintline">两个电荷分别单独画出，按实际尺寸放大 ${S} 倍；E ${cm(E_SCALE.field * 100)} cm 代表 100 N/C。+${f(M.POINT.q0 / M.nC, 1)} nC 试探电荷受的力画得与 E 一样长。点击查看 r̂。</p>`,
    cam: { target: at('field', 0, 0.4), az: -8, el: 8, dist: 35 }, lit: 'point', scene: 'point', look: {},
    fig: `+${M.POINT.Q / M.nC} nC 与 −${M.POINT.Q / M.nC} nC`,
  },
  {
    kicker: '9.5', title: '电偶极子', sub: '电场按矢量相加',
    body: `
      <p class="lede">两个异种电荷 ±<i>q</i>，相距 2<i>a</i>。P 点的 <b>E</b> 是两个电荷各自电场的矢量和。</p>
      <p><b>在轴线上</b>，两个电场都沿这条直线，较近的那个占优：</p>
      <div class="eq sm"><i>E</i> = <i>kq</i>/(<i>x</i>−<i>a</i>)² − <i>kq</i>/(<i>x</i>+<i>a</i>)² = 4<i>kqax</i>/(<i>x</i>²−<i>a</i>²)²</div>
      <p><b>在中垂线上</b>，<i>y</i> 分量抵消，<i>x</i> 分量相加：</p>
      <div class="eq sm"><i>E</i> = 2 · <i>kq</i>/(<i>a</i>²+<i>y</i>²) · cos θ = 2<i>kqa</i>/(<i>a</i>²+<i>y</i>²)<sup>3/2</sup></div>
      <p>在远处两式分别变为 4<i>kqa</i>/<i>x</i>³ 和 2<i>kqa</i>/<i>y</i>³：两个电场几乎抵消，所以 E 按 <b>1/<i>r</i>³</b> 减小。</p>
      <div class="charts">${chart({ ...R.dipole, xlabel: '到中心的距离（cm）', ylabel: 'E（kN/C）', cursor: 'dipole', label: '偶极子在轴线上和中垂线上的电场随距离变化，以及各自的远场近似',
        series: [{ cls: 'curve total', pts: curve(20, 50, x => clip(M.dipoleAxis(x / 100) / 1000, 2)), tag: [27, 1.0, '轴线'] }, { cls: 'curve trend', pts: curve(20, 50, x => clip(4 * M.K * M.DIPOLE.q * M.DIPOLE.a / (x / 100) ** 3 / 1000, 2)) },
          { cls: 'curve total', pts: curve(10, 50, x => clip(M.dipoleBisector(x / 100) / 1000, 2)), tag: [15.5, 0.75, '中垂线'] }, { cls: 'curve trend', pts: curve(14, 50, x => clip(2 * M.K * M.DIPOLE.q * M.DIPOLE.a / (x / 100) ** 3 / 1000, 2)) }] })}</div>
      <p class="hintline">虚线：1/r³。按实际尺寸放大 ${S} 倍；E ${cm(E_SCALE.dipole * 100)} cm 代表 100 N/C。点击把 E 拆成 E₊ 和 E₋。</p>`,
    cam: { target: at('dipole', -0.6, 0.2), az: -10, el: 8, dist: 19 }, lit: 'dipole', scene: 'dipole', look: {},
    fig: `±${M.DIPOLE.q / M.nC} nC，相距 ${cm(2 * M.DIPOLE.a)} cm`,
  },
  {
    kicker: '9.6', title: '带电细棒', sub: '把各小段加起来',
    body: `
      <p class="lede">把棒切成小段 d<i>x</i>，每段带 d<i>q</i> = λ d<i>x</i>（λ = <i>Q</i>/<i>L</i> = ${f(M.RODE.lambda / M.nC, 0)} nC/m）。每段都是一个点电荷，再积分。</p>
      <p><b>在轴线上</b>，距一端 <i>a</i> 处：</p>
      <div class="eq sm"><i>E</i> = ∫<sub><i>a</i></sub><sup><i>a</i>+<i>L</i></sup> <i>k</i>λ d<i>x</i>/<i>x</i>² = <i>k</i>λ[1/<i>a</i> − 1/(<i>a</i>+<i>L</i>)] = <i>kQ</i>/<i>a</i>(<i>a</i>+<i>L</i>)</div>
      <p><b>在中垂线上</b>，中点上方 <i>a</i> 处，<i>x</i> 分量抵消：</p>
      <div class="eq sm"><i>E</i> = ∫ <i>k</i>λ<i>a</i> d<i>x</i>/(<i>x</i>²+<i>a</i>²)<sup>3/2</sup> = <i>kQ</i>/<i>a</i>√(<i>L</i>²/4 + <i>a</i>²)</div>
      <p>在远处（<i>a</i> ≫ <i>L</i>）两式都变为 <i>kQ</i>/<i>a</i>²，与点电荷相同。靠近中点（<i>a</i> ≪ <i>L</i>）时为 2<i>k</i>λ/<i>a</i>。</p>
      <div class="charts">${chart({ ...R.rod, xlabel: '距离 a（cm）', ylabel: 'E（kN/C）', cursor: 'rod', label: '细棒在轴线上和中垂线上的电场随距离变化，并与点电荷的电场对照',
        series: [{ cls: 'curve total', pts: curve(2, 40, x => clip(M.rodAxis(x / 100) / 1000, 4)), tag: [3.5, 1.5, '轴线'] }, { cls: 'curve total', pts: curve(3, 40, x => clip(M.rodBisector(x / 100) / 1000, 4)), tag: [13, 2.0, '中垂线'] },
          { cls: 'curve trend', pts: curve(10, 40, x => clip(M.K * M.RODE.Q / (x / 100) ** 2 / 1000, 4)), tag: [24, 0.75, 'kQ/a²'] }] })}</div>
      <p class="hintline">按实际尺寸放大 ${S} 倍；E ${cm(E_SCALE.rod * 100)} cm 代表 100 N/C。点击把棒切成 ${M.RODE.slices} 段。</p>`,
    cam: { target: at('rod', 0, 1.0), az: -10, el: 8, dist: 21 }, lit: 'rod', scene: 'rod', look: {},
    fig: `${cm(M.RODE.L)} cm 长的棒带 +${M.RODE.Q / M.nC} nC`,
  },
  {
    kicker: '9.7', title: '带电圆环', sub: '以及圆盘',
    body: `
      <p class="lede">圆环上每一小段到轴线上 P 点的距离都相同。横向分量相互抵消；每段只留下 cos φ = <i>z</i>/√(<i>z</i>²+<i>R</i>²) 的那部分。</p>
      <div class="eq sm"><i>E</i> = ∫<sub>0</sub><sup>2π</sup> <i>k</i>λ<i>R</i> d<i>θ</i> · <i>z</i>/(<i>z</i>²+<i>R</i>²)<sup>3/2</sup> = <i>kQz</i>/(<i>z</i>²+<i>R</i>²)<sup>3/2</sup></div>
      <p>中心处为零，远处为 <i>kQ</i>/<i>z</i>²，两者之间有一个峰值，位于 <i>z</i> = <i>R</i>/√2 = ${f(M.RING_ZMAX * 100, 1)} cm 处。</p>
      <div class="charts">${chart({ ...R.ring, xlabel: '沿轴线的距离 z（cm）', ylabel: 'E（kN/C）', cursor: 'ring', label: '圆环轴线上的电场：中心为零，达到峰值后减小',
        series: [{ cls: 'curve total', pts: curve(0, 60, x => M.ringAxis(x / 100) / 1000) }, { cls: 'curve trend', pts: curve(31, 60, x => clip(M.K * M.RING.Q / (x / 100) ** 2 / 1000, 1.5)), tag: [44, 0.55, 'kQ/z²'] }], marks: [[M.RING_ZMAX * 100, M.ringAxis(M.RING_ZMAX) / 1000, 'R/√2', 6, -6]] })}</div>
      <p><b>圆盘</b>就是一叠圆环，d<i>q</i> = σ 2π<i>r</i> d<i>r</i>：</p>
      <div class="eq sm"><i>E</i> = (σ/2ε<sub>0</sub>)(1 − <i>z</i>/√(<i>z</i>²+<i>R</i>²))</div>
      <p>紧贴圆心上方时为 σ/2ε<sub>0</sub>，而不是零：圆盘在 P 的正下方就有电荷。</p>
      <p class="hintline">按实际尺寸放大 ${S} 倍；E ${cm(E_SCALE.ring * 100)} cm 代表 100 N/C，d<i>E</i> 放大 2 倍。点击查看各小段。</p>`,
    cam: { target: at('ring', -0.4, 0.5), az: -30, el: 12, dist: 20 }, lit: 'ring', scene: 'ring', look: {},
    fig: `圆环带 +${(M.RING.Q / M.nC).toFixed(0)} nC，R = ${cm(M.RING.R)} cm`,
  },
  {
    kicker: '9.8', title: '匀强电场', sub: '又是抛体运动',
    body: `
      <p class="lede">两块带等量异种电荷的大平行板之间，电场处处相同，从 + 指向 −。其中的电荷受恒力，像抛出的球一样运动。</p>
      <div class="eq"><i>F</i> = <i>qE</i> = <i>ma</i></div>
      <p>电子以 ${sci(M.PLATES.v0, 1)} m/s 射入；<i>E</i> = ${M.PLATES.E} N/C。它受的力与 <b>E</b> <i>反向</i>，指向 + 板。</p>
      <table class="data">
        <tr><td><i>a</i> = <i>eE</i>/<i>m</i><sub>e</sub></td><td>${sci(M.PLATES.a)} m/s²，向上</td></tr>
        <tr><td><i>t</i> = <i>L</i>/<i>v</i><sub>0</sub></td><td>在 ${cm(M.PLATES.L)} cm 长的极板间运动 ${f(M.PLATES.tCross * 1e9, 1)} ns</td></tr>
        <tr><td><i>y</i> = ½<i>at</i>²</td><td>${f(M.PLATES.yExit * 1000, 2)} mm；离开时偏转 ${f(M.PLATES.angle, 1)}°</td></tr>
      </table>
      <p>质子会向反方向偏转，偏移量只有电子的 1/${f(M.MP / M.ME, 0)}：${f(M.PLATES.yProton * 1e6, 1)} μm。</p>
      <div class="charts">${chart({ ...R.plates, xlabel: 'x（cm）', ylabel: 'y（mm）', cursor: 'plates', label: '电子的轨迹：极板间是抛物线，离开后是直线',
        series: [{ pts: curve(0, M.PLATES.run, t => [M.electron(t).x * 100, M.electron(t).y * 1000]).map(p => p[1]) }, { cls: 'curve trend', pts: [[M.PLATES.L * 100, 0], [M.PLATES.L * 100, 14]], tag: [M.PLATES.L * 100 - 3.6, 12, '极板末端'] }] })}</div>
      <p class="hintline">放慢约 10⁹ 倍；按实际尺寸放大 ${PL.S} 倍；E ${f(PL.E * 100 * 1000, 0)} cm 代表 1 kN/C。点击查看 v<sub>x</sub>、v<sub>y</sub>。</p>`,
    cam: { target: at('plates', -0.1, 0.5), az: -10, el: 5, dist: 17 }, lit: 'plates', scene: 'plates', look: {},
    fig: '带电极板间的电子',
  },
];

// ---------- click a scene: what it breaks into ----------
const ind = s => s.induce;
export const PLATES = {
  atoms: { text: `三个原子的原子核相同：6 个质子，+6<i>e</i>。负离子多得到了一个电子，这里把它拉了出来。正离子失去了一个电子，轮廓标出它空出的位置。净电荷总是（质子数 − 电子数）× <i>e</i>。（这只是示意图：真实原子直径约 10⁻¹⁰ m，原子核还要小约 10 万倍，电子也不像行星那样绕核运行。）`,
    facts: () => M.ATOMS.map(a => [ATOM[a.name], `${a.p} − ${a.e} = ${a.p - a.e >= 0 ? (a.p - a.e ? '+' : '') : '−'}${Math.abs(a.p - a.e)} e = ${a.p === a.e ? '0' : (a.p > a.e ? '+' : '−') + sci(M.QE)} C`]) },
  induce: { text: `小珠的大小表示球面上的面电荷密度 σ。棒靠近而球未接地时，近侧 σ 为 +，远侧为 −，但总和仍为零：电子只是换了位置。接地让远侧的电子流走。留下的电荷被棒吸引住，棒移走后便均匀分布开。`,
    facts: s => { const st = ind(s); return [['阶段', STAGE[st.stage]], ['棒尖到球心', st.rod ? `${cm(st.dTip)} cm` : '已移走'], ['球上的净电荷', `${f(st.Qnet / M.nC)} nC`], ['接地后', `−Σ q R/d = +${f(M.QG / M.nC)} nC`]]; } },
  balloon: { text: `墙是绝缘体，电子无法离开各自的分子。每个分子只是被拉长，− 端朝向带 + 电的气球。− 端离得更近，所以它们受到的吸引胜过 + 端受到的排斥，气球被吸向墙。图中分子的拉伸程度随气球电场增大。`,
    facts: s => { const g = s.balloonGap, r = g + M.BALLOON.r; return [['气球电荷量', `+${M.BALLOON.q / M.nC} nC`], ['到墙的间隙', `${f(g * 100, 1)} cm`], ['气球在墙处的电场', `${kNC(M.K * M.BALLOON.q / (r * r))} kN/C`]]; } },
  coulomb: { text: `下方是相同距离的一对同种电荷：相互排斥。在两对电荷中，+4 μC 电荷受力的大小都与较小的那个电荷相同。乘积 q₁q₂ 决定力的大小，正负号决定是吸引还是排斥。`,
    facts: s => { const r = s.pairR; return [['r', `${f(r * 100, 1)} cm`], ['F = k|q₁q₂|/r²', `${f(pairF(r))} N`], ['2r 处的 F', `${f(pairF(2 * r))} N（¼）`], ['异种电荷', '吸引'], ['同种电荷', '排斥']]; } },
  line: { text: `停在 x<sub>eq</sub> 处时，两个推力大小相等、方向相反，红色的合力为零。往任一侧轻推，较近的电荷都会把它推回来：沿这条直线，这是稳定平衡点。方法：（1）根据每个力的方向判断它可能在哪里平衡；（2）令两力相等，解出距离；（3）检查它是否更靠近较小的电荷。`,
    facts: () => { const r = M.lineForces(M.LINE.xEq); return [['x<sub>eq</sub>', `距 A ${cm(M.LINE.xEq)} cm`], ['该处的 F<sub>A</sub>', `${f(r.FA[0], 3)} N →`], ['该处的 F<sub>B</sub>', `${f(-r.FB[0], 3)} N ←`], ['合力', `${f(Math.abs(r.net[0]), 3)} N`]]; } },
  point: { text: `试探电荷停在 20 cm 处。r̂（灰色）是单位矢量，长度为 1，从电荷出发、穿过试探电荷指向外。电场等于 <i>kQ</i>/<i>r</i>² 乘以 r̂。换成 −Q 时，同一公式给出 −r̂ 方向，所以正试探电荷受的力指向内。`,
    facts: () => { const r = 0.2, E = M.pointMag(M.POINT.Q, r); return [['r', `${f(r * 100, 1)} cm`], ['E = kQ/r²', `${f(E, 0)} N/C`], ['F = q₀E', `${sci(M.POINT.q0 * E)} N`], ['r̂', `(cos 22.5°, sin 22.5°) = (${f(Math.cos(M.POINT.ang))}, ${f(Math.sin(M.POINT.ang))})`]]; } },
  dipole: { text: `在每个 P 点，细箭头是 E₊（来自 +q，背离它）和 E₋（指向 −q）。在轴线上两者方向相反，较近的那个占优。在中垂线上两者大小相等：灰色的 y 分量抵消，x 分量相加。对任意一组电荷都适用的方法：（1）求每个电荷在 P 点的电场；（2）看哪些分量因对称而抵消；（3）由边长求出 sin 和 cos，算出其余分量；（4）相加。`,
    facts: s => { const x = s.dipoleX, y = s.dipoleY, a = M.DIPOLE.a, k = M.K * M.DIPOLE.q; return [['轴线：E₊ − E₋', `${f(k / (x - a) ** 2, 0)} − ${f(k / (x + a) ** 2, 0)} = ${f(M.dipoleAxis(x), 0)} N/C`], ['中垂线：每个', `${f(k / (a * a + y * y), 0)} N/C`], ['中垂线：2 E cos θ', `${f(M.dipoleBisector(y), 0)} N/C`]]; } },
  rod: { text: `两个 P 点都移近了。棒被拆成 ${M.RODE.slices} 段，每段是电荷量为 Q/${M.RODE.slices} 的点电荷。它们在上方 P 点产生的 dE 箭头对称地散开，所以横向分量抵消。这些箭头的矢量和已经接近积分值；段数越多、每段越细，结果就越精确。在中垂线上，积分要用到 ∫x dx/(x²+a²)<sup>3/2</sup> = −1/(x²+a²)<sup>1/2</sup>，它在对称的上下限之间给出 E<sub>x</sub> = 0；E<sub>y</sub> 则用 ∫dx/(x²+a²)<sup>3/2</sup> = x/a²(x²+a²)<sup>1/2</sup>。`,
    facts: () => { const b = M.RODE.b0, sum = M.sumE(M.rodSlices(M.RODE.slices), [0, b, 0])[1]; return [['a（中垂线）', `${f(b * 100, 1)} cm`], [`${M.RODE.slices} 段之和`, `${f(sum, 0)} N/C`], ['积分', `${f(M.rodBisector(b), 0)} N/C`], ['横向', '0，已抵消']]; } },
  ring: { text: `P 停在峰值处，z = R/√2。${M.RING.beads} 个小段各自沿着从圆环出发的直线（虚线）产生 dE。绕圆环一周，横向分量指向各个方向，相互抵消；沿轴线的分量全部相加。每段的 <i>r</i> 和 cos φ 都相同，所以对 θ 的积分就是 2π：E = 2π<i>k</i>λ<i>Rz</i>/(<i>z</i>²+<i>R</i>²)<sup>3/2</sup> = <i>kQz</i>/(<i>z</i>²+<i>R</i>²)<sup>3/2</sup>。对于圆盘，用 ∫<i>r</i> d<i>r</i>/(<i>z</i>²+<i>r</i>²)<sup>3/2</sup> = −1/(<i>z</i>²+<i>r</i>²)<sup>1/2</sup> 把这些圆环从 <i>r</i> = 0 积分到 <i>R</i>。`,
    facts: () => { const z = M.RING_ZMAX, dEm = M.K * M.RING.Q / M.RING.beads / (z * z + M.RING.R ** 2); return [['z', `${f(z * 100, 1)} cm`], ['每个 dE', `${f(dEm, 0)} N/C`], ['cos φ', f(z / Math.hypot(z, M.RING.R), 3)], ['E = Σ dE cos φ', `${f(M.ringAxis(z), 0)} N/C`]]; } },
  plates: { text: `灰色的是两个速度分量。v<sub>x</sub> 始终不变；电子在极板间时 v<sub>y</sub> 均匀增大，离开后两者都保持不变。这就是抛体运动，只是由电场扮演重力的角色。频闪轮廓之间的时间间隔相等。`,
    facts: s => { const e = M.electron(s.plates.t); return [['t', `${f(s.plates.t * 1e9, 2)} ns`], ['v<sub>x</sub>', `${sci(e.vx)} m/s`], ['v<sub>y</sub>', `${sci(Math.max(e.vy, 1))} m/s`], ['y', `${f(e.y * 1000, 2)} mm`]]; } },
};
