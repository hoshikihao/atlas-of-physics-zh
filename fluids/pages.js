// Chapter 8, page by page (AP Physics 1, Unit 8: fluids). Text and charts on the left page; on the
// right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, SC, PY6, PY7, ZH } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const kPa = (p, n = 1) => `${f(p / 1000, n)} kPa`;

// ---------- small SVG charts for the left page, with live cursors ----------
const W = 420, P = { l: 44, r: 14, t: 16, b: 30 };
export const CURSORS = {};       // key → (x, y) → [cx, cy]
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursors = [], label, h = 170, ylabels, xlabels }) {
  const H = h;
  const sx = x => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy = y => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b);
  for (const c of cursors) CURSORS[c] = (x, y) => [sx(x), sy(y)];
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const [yt, yb] = ylabels || [y1, y0], [xl, xr] = xlabels || [x0, x1];
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${yt}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${yb}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${xl}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${xr}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(c => `<circle class="cursor" r="4.5" cx="-20" cy="-20" data-cursor="${c}"/>`).join('')}
  </svg>`;
}
const sample = (fn, a, b, n = 120) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });

// Bernoulli's energy per volume at the three points, as stacked bars
function bernBars() {
  const H = 150, top = 85, sy = v => P.t + (1 - v / top) * (H - P.t - P.b), bw = 60;
  const cols = M.BERN.pts.map((p, k) => {
    const x = P.l + 40 + k * 120; let y0 = 0, out = '';
    for (const [val, fill] of [[p.P, '#ecece8'], [p.K / 1000 * 1000, '#8fb0f0'], [p.U, '#9c9ca2']]) {
      const v = val / 1000; if (v > 0.01) out += `<rect x="${x}" y="${sy(y0 + v)}" width="${bw}" height="${sy(y0) - sy(y0 + v)}" fill="${fill}" stroke="#8a8a8f" stroke-width=".8"/>`; y0 += v;
    }
    return out + `<text class="lab" x="${x + bw / 2}" y="${H - 9}" text-anchor="middle">点 ${k + 1}</text>`;
  }).join('');
  const tot = sy(M.BERN.E / 1000);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="三个点处单位体积的能量：压强、动能项和势能项之和始终相同">
    <line class="grid" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>${cols}
    <line class="trend" x1="${P.l}" x2="${W - P.r}" y1="${tot}" y2="${tot}"/><text class="lab" x="${W - P.r}" y="${tot - 6}" text-anchor="end">总计 ${f(M.BERN.E / 1000, 0)} kPa</text>
    <text class="ax" x="${P.l - 6}" y="${sy(top) + 4}" text-anchor="end">${top}</text><text class="ax" x="${P.l - 6}" y="${sy(0) + 4}" text-anchor="end">0</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">kPa = kJ/m³：P（浅色）+ ½ρv²（蓝色）+ ρgy（灰色）</text>
  </svg>`;
}

const at = (k, dx = 0, dy = 0.5, dz = 0) => [STATIONS[k] + dx, dy, dz];
const Bp = M.BERN.pts;

export const PAGES = [
  {
    kicker: '第 8 章', title: '流体', sub: '密度',
    body: `
      <p class="lede"><b>流体</b>就是能流动的物质：液体或气体。它的分子不固定在某个位置上，所以它会充满容器、呈现容器的形状。我们用<b>密度</b>，即单位体积的质量，来描述它：</p>
      <div class="eq">ρ = <i>m</i> / <i>V</i></div>
      <p>这五个立方体的边长都是 10 cm，体积都是 1.0 L：体积相同，质量却相差很大，从 ${f(M.MATERIALS[0].mass)} kg 的软木到 ${f(M.MATERIALS[4].mass)} kg 的铁。在质量–体积图像上，每种材料都是一条直线，斜率就是它的密度。</p>
      <p>密度属于材料，而不属于物体：把立方体切成两半，<i>m</i> 和 <i>V</i> 都减半。<b>理想流体</b>不可压缩（密度始终不变），流动时没有摩擦。水非常接近理想流体。</p>
      <div class="charts">${chart({ x0: 0, x1: 1, y0: 0, y1: 3, xlabel: '体积 (L)', ylabel: '质量 (kg)：斜率 = ρ', label: '五种材料的质量随体积的变化：斜率等于密度的直线', h: 150,
        series: M.MATERIALS.map(m => ({ pts: [[0, 0], [Math.min(1, 3 / m.mass), Math.min(m.mass, 3)]], tag: { cork: [0.78, 0.24, '软木'], ice: [0.62, 0.95, '冰、水'], water: null, al: [0.66, 1.8, '铝'], iron: [0.4, 2.3, '铁'] }[m.key] })) })}</div>
      <p class="hintline">点击立方体，把每个切成八块。</p>`,
    cam: { target: at('density', 0, 0.06), az: -14, el: 16, dist: 3.4 }, lit: 'blocks', scene: 'density', look: {},
    fig: '五个 1 升的立方体',
  },
  {
    kicker: '8.1', title: '压强', sub: '分布在面积上的力',
    body: `
      <p class="lede"><b>压强</b>是垂直作用在表面上的力与面积之比：</p>
      <div class="eq"><i>P</i> = <i>F</i><sub>⊥</sub> / <i>A</i></div>
      <p>压强是标量，单位是帕斯卡：1 Pa = 1 N/m²。同一个 ${M.PERSON.m} kg（${f(M.PERSON.W, 0)} N）的人两次站在雪地上：</p>
      <table class="data">
        <tr><th></th><th>面积</th><th>压强</th></tr>
        <tr><td>普通鞋</td><td>${f(M.SHOE.A, 3)} m²</td><td>${kPa(M.P_SHOE)}</td></tr>
        <tr><td>雪鞋</td><td>${f(M.SNOWSHOE.A, 2)} m²</td><td>${kPa(M.P_SNOW, 2)}</td></tr>
      </table>
      <p>面积变为八倍，压强变为八分之一，雪地就撑得住。钉子正好相反：用 ${M.NAIL.F} N 的力按 1 cm² 的钉帽，0.5 mm² 的钉尖对木头的压强达 ${f(M.NAIL.F / M.NAIL.tip / 1e6, 0)} MPa。</p>
      <div class="charts">${chart({ x0: 0, x1: 0.5, y0: 0, y1: 30, xlabel: '接触面积 (m²)', ylabel: 'P = W/A (kPa)', label: '同样重力下压强随接触面积的变化：P 与 1/A 成正比', h: 118,
        series: [{ pts: sample(A => Math.min(M.PERSON.W / A / 1000, 30), 0.0229, 0.5) }], marks: [[M.SHOE.A, M.P_SHOE / 1000, '普通鞋'], [M.SNOWSHOE.A, M.P_SNOW / 1000, '雪鞋', -40, -10]] })}</div>
      <p class="hintline">箭头：对雪地的压力，每 125 cm² 一个箭头，每 kPa 对应 ${f(SC.shoeP * 1e5, 1)} cm。点击把人移开。</p>`,
    cam: { target: at('pressure', 0, 0.9), az: -18, el: 12, dist: 10.5 }, lit: 'feet', scene: 'pressure', look: {},
    fig: '重力相同，面积更大',
  },
  {
    kicker: '8.2', title: '压强与深度', sub: '上方水的重力',
    body: `
      <p class="lede">水下的压强来自上方水的重力。高 <i>h</i>、截面积 <i>A</i> 的水柱重 ρ<i>Ah g</i>，所以它使压强比顶面增加 ρ<i>gh</i>：</p>
      <div class="eq"><i>P</i> = <i>P</i><sub>0</sub> + ρ<i>gh</i></div>
      <p><i>P</i><sub>0</sub> = ${kPa(M.P0)} 是大气对水面的压强。<i>P</i> 是<b>绝对压强</b>；单独的 ρ<i>gh</i> 是<b>表压</b>，即高出大气压的部分。水每深 ${f(M.P0 / (M.RHO * M.G), 1)} m，压强大约增加一个大气压：在 10 m 深处，潜水员承受 ${kPa(M.pAt(10), 0)}。</p>
      <p>在同一深度，各个方向的压强都相等，与周围水的形状无关。</p>
      <div class="charts">${chart({ x0: 0, x1: 12, y0: 0, y1: 240, xlabel: '深度 h (m)', ylabel: '压强 (kPa)', cursors: ['depth', 'gauge'], label: '绝对压强和表压随深度的变化：两条平行直线', h: 150,
        series: [{ pts: [[0, M.P0 / 1000], [12, M.pAt(12) / 1000]], tag: [7.4, M.pAt(7.4) / 1000 + 4, '绝对压强'] }, { cls: 'trend', pts: [[0, 0], [12, M.gauge(12) / 1000]], tag: [8.6, M.gauge(8.6) / 1000 - 32, '表压 ρgh'] }] })}</div>
      <p class="hintline">箭头：每 kPa 对应 ${f(SC.lakeP * 1e5, 1)} cm。点击潜水员，查看其上方的水柱。</p>`,
    cam: { target: at('depth', 0.2, 6.4), az: -12, el: 6, dist: 44 }, lit: 'diver', scene: 'depth', look: {},
    fig: '潜水员，从 1 m 到 10 m 深',
  },
  {
    kicker: '8.3', title: '帕斯卡原理', sub: '一处施压，处处感受',
    body: `
      <p class="lede">对密闭容器中的液体施压，增加的压强会大小不变地传到液体的每一部分和容器的每一面器壁。这就是<b>帕斯卡原理</b>。</p>
      <p>对小活塞施加 ${M.PASCAL.F1} N 的推力，各处压强都增加 Δ<i>P</i> = <i>F</i><sub>1</sub>/<i>A</i><sub>1</sub> = ${kPa(M.PASCAL.dP, 2)}。大活塞的面积是小活塞的 ${f(M.PASCAL.A2 / M.PASCAL.A1, 0)} 倍，同样的 Δ<i>P</i> 在它下面产生 ${f(M.PASCAL.F2, 0)} N 的力，足以托起 ${f(M.PASCAL.load, 1)} kg：</p>
      <div class="eq"><i>F</i><sub>1</sub>/<i>A</i><sub>1</sub> = <i>F</i><sub>2</sub>/<i>A</i><sub>2</sub></div>
      <p>天下没有免费的午餐。水不可压缩，所以左边压下去多少体积，右边就升起多少：<i>A</i><sub>1</sub><i>d</i><sub>1</sub> = <i>A</i><sub>2</sub><i>d</i><sub>2</sub>。大活塞移动的距离只有小活塞的 ${f(M.PASCAL.A2 / M.PASCAL.A1, 0)} 分之一，所以输入功等于输出功，<i>F</i><sub>1</sub><i>d</i><sub>1</sub> = <i>F</i><sub>2</sub><i>d</i><sub>2</sub>。</p>
      <table class="data">
        <tr><th></th><th>面积</th><th>力</th><th>移动距离</th></tr>
        <tr><td>小活塞</td><td>${f(M.PASCAL.A1 * 1e4, 0)} cm²</td><td>${M.PASCAL.F1} N</td><td>${f(M.PASCAL.stroke * 100, 0)} cm</td></tr>
        <tr><td>大活塞</td><td>${f(M.PASCAL.A2 * 1e4, 0)} cm²</td><td>${f(M.PASCAL.F2, 0)} N</td><td>${f(M.PASCAL.stroke * 100 * M.PASCAL.A1 / M.PASCAL.A2, 0)} cm</td></tr>
      </table>
      <p class="hintline">每个小箭头表示一块 ${f(M.PASCAL.A1 * 1e4, 0)} cm² 面积上的 Δ<i>P</i>：小活塞下有一个，大活塞下有十六个。点击查看每面器壁上的 Δ<i>P</i>。</p>`,
    cam: { target: at('pascal', -0.15, 0.8), az: -18, el: 14, dist: 7.2 }, lit: 'pascal', scene: 'pascal', look: {},
    fig: 'ΔP 相同，面积十六倍',
  },
  {
    kicker: '8.4', title: '浮力', sub: '阿基米德原理',
    body: `
      <p class="lede">水对浸没物体的每个面都有压力，而且越往下压得越厉害。侧面的压力相互抵消；底面向上的压力大于顶面向下的压力，两者之差就是<b>浮力</b>。</p>
      <p>对边长为 <i>s</i> 的立方体：(<i>P</i><sub>下</sub> − <i>P</i><sub>上</sub>)<i>s</i>² = ρ<i>gs</i>·<i>s</i>² = ρ<i>Vg</i>，正好等于它排开的水的重力：</p>
      <div class="eq"><i>F</i><sub>b</sub> = ρ<sub>液</sub> <i>V</i><sub>排</sub> <i>g</i></div>
      <p>立方体浸入水中时浮力逐渐增大，完全浸没后保持 ${f(M.BUOY.Fb, 0)} N 不变，无论多深。细绳承担剩下的部分，即<b>视重</b> <i>T</i> = <i>W</i> − <i>F</i><sub>b</sub> = ${f(M.BUOY.W - M.BUOY.Fb, 0)} N，而不是 ${f(M.BUOY.W, 0)} N。</p>
      <div class="charts">${chart({ x0: -0.35, x1: 0.75, y0: 0, y1: 900, xlabel: '底面的深度 (m)', ylabel: '力 (N)', cursors: ['fb', 'T'], label: '浮力和绳的拉力随立方体浸入深度的变化', h: 140, xlabels: ['−0.35', '0.75'],
        series: [{ pts: sample(d => M.buoy(M.BUOY.L0 - d).Fb, -0.35, 0.75), tag: [0.45, M.BUOY.Fb + 10, 'F_b'] }, { pts: sample(d => M.buoy(M.BUOY.L0 - d).T, -0.35, 0.75), tag: [0.45, M.BUOY.W - M.BUOY.Fb + 10, 'T = W − F_b'] }, { cls: 'trend', pts: [[-0.35, M.BUOY.W], [0.75, M.BUOY.W]], tag: [0.6, M.BUOY.W + 10, 'W'] }] })}</div>
      <p class="hintline">表压：每 kPa 对应 ${f(SC.buoyP * 1e5, 1)} cm；力：每牛顿对应 ${f(SC.buoyF * 1000, 1)} mm。点击查看每个面受到的总压力。</p>`,
    cam: { target: at('buoy', 0, 0.95), az: -20, el: 8, dist: 6.8 }, lit: 'cube', scene: 'buoy', look: {},
    fig: `细绳吊着的 ${f(M.BUOY.s * 100, 0)} cm 铝立方体`,
  },
  {
    kicker: '8.5', title: '浮与沉', sub: '比较密度',
    body: `
      <p class="lede">如果物体的密度比水小，它只会下沉到排开的水的重力等于它自身的重力为止：ρ<sub>液</sub><i>V</i><sub>浸</sub><i>g</i> = ρ<sub>物</sub><i>Vg</i>，所以</p>
      <div class="eq"><i>V</i><sub>浸</sub> / <i>V</i> = ρ<sub>物</sub> / ρ<sub>液</sub></div>
      <table class="data">
        <tr><th></th><th>ρ (kg/m³)</th><th>结果</th></tr>
        <tr><td>木块</td><td>${M.WOOD.rho}</td><td>漂浮，${f(100 * M.WOOD.draft / M.WOOD.s, 0)}% 在水下</td></tr>
        <tr><td>冰</td><td>${M.ICE.rho}</td><td>漂浮，${f(100 * M.ICE.draft / M.ICE.s, 1)}% 在水下</td></tr>
        <tr><td>钢球</td><td>${M.BALL.rho}</td><td>下沉</td></tr>
        <tr><td>钢船，平均</td><td>${f(M.SHIP.avg, 0)}</td><td>漂浮，吃水 ${f(M.SHIP.draft * 100, 1)} cm</td></tr>
      </table>
      <p>海水中的冰山有 ${f(100 * M.fractionUnder(917, M.RHO_SEA), 0)}% 在水下。钢球的 <i>F</i><sub>b</sub> = ${f(M.BALL.Fb, 0)} N 抵不过它 ${f(M.BALL.W, 0)} N 的重力，剩下的由池底向上的支持力承担。船是把钢做成能装下空气的形状。</p>
      <div class="charts">${chart({ x0: 0, x1: 1.5, y0: 0, y1: 1.15, xlabel: 'ρ_物 / ρ_水', ylabel: '浸在水下的比例', label: '浸没比例随密度比的变化：两者相等，直到 1 为止，此后物体下沉', h: 104, ylabels: ['', '0'],
        series: [{ pts: [[0, 0], [1, 1], [1.5, 1]], tag: [1.02, 1.0, '下沉 →'] }], marks: [[M.SHIP.avg / 1000, M.SHIP.avg / 1000, '船'], [0.6, 0.6, '木块'], [0.917, 0.917, '冰', -26, -8]] })}</div>
      <p class="hintline">力：每牛顿对应 ${f(SC.floatF * 1000, 1)} mm。点击把排开的水取出来。</p>`,
    cam: { target: at('float', 0.15, 0.55), az: -10, el: 9, dist: 12.5 }, lit: 'float', scene: 'float', look: {},
    fig: '木块、冰、钢球、钢船',
  },
  {
    kicker: '8.6', title: '连续性方程', sub: '流进多少，流出多少',
    body: `
      <p class="lede">水不可压缩，管子也不漏，所以每秒通过每个横截面的水的体积都相同。这就是<b>体积流量</b> <i>Q</i> = <i>Av</i>：</p>
      <div class="eq"><i>A</i><sub>1</sub><i>v</i><sub>1</sub> = <i>A</i><sub>2</sub><i>v</i><sub>2</sub></div>
      <p>管子变细到一半半径，截面积变为四分之一，所以水流速度变为四倍：从 ${f(M.FLOW.v1, 1)} m/s 增加到 ${f(M.FLOW.v2, 1)} m/s。各处 <i>Q</i> 都是 ${f(M.FLOW.Q * 1000, 0)} L/s。</p>
      <p>跟踪那段深色的水：在粗的部分它又短又粗；在细的部分，同样的体积变得又细又长。用拇指堵住水管口也是同样的道理。</p>
      <div class="charts">${chart({ x0: 0, x1: 0.3, y0: 0, y1: 3, xlabel: '横截面积 A (m²)', ylabel: '流速 v = Q/A (m/s)', cursors: ['flow'], label: '流速随横截面积的变化：v 与 1/A 成正比', h: 150,
        series: [{ pts: sample(A => Math.min(M.FLOW.Q / A, 3), M.FLOW.Q / 3, 0.3) }], marks: [[M.FLOW.A1, M.FLOW.v1, 'A₁', -6, -10], [M.FLOW.A2, M.FLOW.v2, 'A₂']] })}</div>
      <p class="hintline">速度：每 m/s 对应 ${f(SC.flowV * 100, 0)} cm。点击管子，取出它的两个横截面。</p>`,
    cam: { target: at('continuity', 0, PY6 + 0.1), az: -12, el: 14, dist: 14 }, lit: 'pipe', scene: 'continuity', look: {},
    fig: '面积变为四分之一，速度变为四倍',
  },
  {
    kicker: '8.7', title: '伯努利方程', sub: '流体的能量守恒',
    body: `
      <p class="lede">沿管子跟踪一小团水。在它加速的地方，必须有东西推它向前：它后方的压强一定比前方高。所以<b>流速大的地方压强小</b>。</p>
      <p>沿着流动方向，单位体积的能量守恒（理想流体，定常流动）：</p>
      <div class="eq"><i>P</i> + ½ρ<i>v</i>² + ρ<i>gy</i> = 常量</div>
      <table class="data">
        <tr><th></th><th><i>v</i></th><th><i>y</i></th><th><i>P</i>（表压）</th></tr>
        ${Bp.map((p, k) => `<tr><td>${k + 1} ${['粗、低处', '细、低处', '粗、高处'][k]}</td><td>${f(p.v, 1)} m/s</td><td>${f(p.y, 1)} m</td><td>${kPa(p.P)}</td></tr>`).join('')}
      </table>
      <div class="charts">${bernBars()}</div>
      <p class="hintline">半速播放。压强：每 kPa 对应 ${f(SC.bernP * 1e5, 1)} cm。点击把能量柱立在管子旁边。</p>`,
    cam: { target: at('bernoulli', 0.8, PY7 + 0.6), az: -12, el: 10, dist: 24.5 }, lit: 'bernoulli', scene: 'bernoulli', look: {},
    fig: '细处流得快，高处流得慢',
  },
  {
    kicker: '8.8', title: '托里拆利定律', sub: '从小孔射出的水流',
    body: `
      <p class="lede">水从水面下 <i>h</i> 处的小孔流出。从敞开的水面（大气压，几乎静止）到射流（同样是大气压）应用伯努利方程：压强项相互抵消，剩下 ρ<i>gh</i> = ½ρ<i>v</i>²，所以</p>
      <div class="eq"><i>v</i> = √(2<i>gh</i>)</div>
      <p>与水滴自由下落高度 <i>h</i> 得到的速率相同。这里 <i>h</i> 起初为 ${f(M.TANK.h0, 1)} m，所以 <i>v</i> = ${f(M.torricelli(M.TANK.h0))} m/s。随着水箱排空，<i>h</i> 和 <i>v</i> 一起减小。</p>
      <p>水滴一离开小孔就做平抛运动：水平速度为 <i>v</i>，用 ${f(M.jetFlight, 3)} s 下落 ${f(M.TANK.yh, 2)} m。射程为 <i>v t</i> = 2√(<i>h y</i><sub>孔</sub>)，水箱满时为 ${f(M.jetRange(M.TANK.h0))} m。</p>
      <div class="charts">${chart({ x0: 0, x1: 1.2, y0: 0, y1: 5, xlabel: '小孔上方的水深 h (m)', ylabel: '射流速率 v (m/s)', cursors: ['tank'], label: '射流速率随水深的变化：2gh 的平方根', h: 150,
        series: [{ pts: sample(h => M.torricelli(h), 0, 1.2) }] })}</div>
      <p class="hintline">速度：每 m/s 对应 ${f(SC.jetV * 100, 0)} cm。点击水箱，分解水滴的速度。</p>`,
    cam: { target: at('torricelli', -0.05, 1.15), az: -14, el: 10, dist: 10 }, lit: 'tank', scene: 'torricelli', look: {},
    fig: '从小孔排水的水箱',
  },
];

// ---------- click a scene: what it breaks into ----------
const b4 = s => s.st4;
export const PLATES = {
  blocks: { text: `每个立方体都分成八个小立方体。每一块的质量和体积都是原来的八分之一，所以密度不变。密度是物质的性质，与物质有多少无关。`,
    facts: () => M.MATERIALS.map(m => [`${ZH[m.key]}：${f(m.mass / 8, 3)} kg / 0.125 L`, `${m.rho} kg/m³`]) },
  feet: { text: `人被移开，雪地上留下了他们的接触面。两种情况下总压力都是 ${f(M.PERSON.W, 0)} N；雪鞋把它分散到八倍的面积上，所以每块面积受到的压力只有八分之一。`,
    facts: () => [['重力 W', `${f(M.PERSON.W, 0)} N`], ['普通鞋：W / A', `${f(M.PERSON.W, 0)} / ${f(M.SHOE.A, 3)} = ${kPa(M.P_SHOE)}`], ['雪鞋：W / A', `${f(M.PERSON.W, 0)} / ${f(M.SNOWSHOE.A, 2)} = ${kPa(M.P_SNOW, 2)}`], ['比值', `${f(M.P_SHOE / M.P_SNOW, 0)}×`]] },
  diver: { text: `颜色较深的那段水柱是潜水员正上方的水，横截面积 1 m²。它的重力分布在这 1 m² 上，就是表压 ρgh。再加上顶部的大气压，就是绝对压强。从下方来的箭头比从上方来的稍长：潜水员的脚比头更深。`,
    facts: s => { const d = M.diveDepth(s.clock); return [['深度 h', `${f(d, 2)} m`], ['水柱重力 ρ(1 m²)h g', `${f(M.gauge(d) / 1000, 1)} kN`], ['表压 ρgh', kPa(M.gauge(d))], ['绝对压强 P₀ + ρgh', kPa(M.pAt(d))], ['以大气压计', `${f(M.pAt(d) / M.P0, 2)} atm`]]; } },
  pascal: { text: `推力带来的附加压强在每面器壁和两个活塞上都相同。不同的是它作用的面积：大活塞下的面积是十六倍，所以力也是十六倍。`,
    facts: s => { const p = M.pascal(s.clock); return [['各处的 ΔP', kPa(M.PASCAL.dP, 2)], ['F₁ = ΔP·A₁', `${M.PASCAL.F1} N`], ['F₂ = ΔP·A₂', `${f(M.PASCAL.F2, 0)} N`], ['小活塞下降 d₁', `${f(p.d1 * 100, 1)} cm`], ['大活塞上升 d₂', `${f(p.d2 * 100, 2)} cm`], ['功 F₁d₁ = F₂d₂', `${f(M.PASCAL.F1 * p.d1, 2)} J`]]; } },
  cube: { text: `每个面上的箭头被替换成该面受到的总压力，即作用在面中心的 <i>P</i>·<i>A</i>。四个侧面的压力两两抵消。底面减去顶面就是浮力，等于立方体排开的水的重力。`,
    facts: s => { const b = b4(s), A = M.BUOY.s ** 2, top = M.gaugeAtY(b.yb + M.BUOY.s, b.L) * A, bot = M.gaugeAtY(b.yb, b.L) * A;
      return [['底面向上', `${f(bot, 1)} N`], ['顶面向下', `${f(top, 1)} N`], ['F_b = 底面 − 顶面', `${f(bot - top, 1)} N`], ['ρ V_浸 g', `${f(b.Fb, 1)} N`], ['拉力 T = W − F_b', `${f(b.T, 1)} N`], ['水面上升', `${f((b.L - M.BUOY.L0) * 1000, 1)} mm`]]; } },
  float: { text: `每个蓝色块都是该物体排开的水，被取了出来。对漂浮的物体，它的重力恰好等于物体的重力。钢球排开了与自身等体积的水，仍然不够。`,
    facts: () => [['木块：W = F_b', `${f(M.WOOD.W, 0)} N`], ['冰：W = F_b', `${f(M.ICE.W, 0)} N`], ['钢球：W、F_b', `${f(M.BALL.W, 0)} N，${f(M.BALL.Fb, 0)} N`], ['船：W = F_b', `${f(M.SHIP.W, 0)} N（${f(M.SHIP.m, 1)} kg 钢）`]] },
  pipe: { text: `两个横截面滑了出来。每秒都有 ${f(M.FLOW.Q * 1000, 0)} L 的水通过它们：以 ${f(M.FLOW.v1, 1)} m/s 通过 ${f(M.FLOW.A1, 3)} m²，以 ${f(M.FLOW.v2, 1)} m/s 通过 ${f(M.FLOW.A2, 3)} m²。`,
    facts: s => { const A = M.PIPE1.area(s.slab6); return [['A₁v₁', `${f(M.FLOW.A1, 4)} × ${f(M.FLOW.v1, 1)} = ${f(M.FLOW.Q, 4)} m³/s`], ['A₂v₂', `${f(M.FLOW.A2, 4)} × ${f(M.FLOW.v2, 1)} = ${f(M.FLOW.Q, 4)} m³/s`], ['深色那段水：A', `${f(A, 4)} m²`], ['它的速率 Q/A', `${f(M.FLOW.Q / A, 2)} m/s`]]; } },
  bernoulli: { text: `每个点后面立着它单位体积的能量：压强（浅色）、动能项 ½ρv²（蓝色）和势能项 ρgy（灰色）。各部分相互转化，但每根柱子的总高度始终相同。机翼的升力也来自同样的转化：机翼弯曲的上表面上方的空气流得更快，所以上方的压强比下方小。`,
    facts: () => Bp.map((p, k) => [`点 ${k + 1}：P + ½ρv² + ρgy`, `${f(p.P / 1000, 1)} + ${f(p.K / 1000, 1)} + ${f(p.U / 1000, 1)} = ${f((p.P + p.K + p.U) / 1000, 1)} kPa`]) },
  tank: { text: `虚线是当前速率下的轨迹。图中这滴水离开小孔 0.25 s，它保持着离开时的水平速度 v（灰色，水平），并获得了向下的 g·t（灰色，向下）。`,
    facts: s => { const h = s.h8, v = M.torricelli(h); return [['h', `${f(h)} m`], ['v = √(2gh)', `${f(v)} m/s`], ['½v² = gh', `${f(0.5 * v * v, 2)} = ${f(M.G * h, 2)} J/kg`], ['下落时间', `${f(M.jetFlight, 3)} s`], ['射程', `${f(M.jetRange(h))} m`]]; } },
};
