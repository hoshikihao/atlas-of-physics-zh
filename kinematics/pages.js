// The chapter, page by page: text on the left, and for the figure on the right the camera,
// the one lit thing and what is shown. Every number comes from model.js.
import * as M from './model.js';
import { ST, RAIN_V, RIV, PULLS } from './world.js';

const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const tau = M.STROBE;
const deg = r => (r * 180 / Math.PI).toFixed(1);

// ---------- small SVG charts for pages 1.7–1.10 (live parts are updated in main.js) ----------
const CW = 420, CH = 86, CP = { l: 40, r: 12, t: 9, b: 19 };
export const KR = {
  rain: { x0: 0, x1: 30, y0: 0, y1: 90 },
  map: { x0: -2, x1: 16, y0: 0, y1: 24 },
  pa: { x0: 0, x1: 5, y0: 0, y1: 6 }, pv: { x0: 0, x1: 5, y0: 0, y1: 12 }, px: { x0: 0, x1: 5, y0: 0, y1: 45 },
  cx: { x0: 0, x1: 2, y0: -3, y1: 3 }, cv: { x0: 0, x1: 2, y0: -3, y1: 9 }, ca: { x0: 0, x1: 2, y0: 0, y1: 12 },
};
export const KC = {
  sx: (x, R) => CP.l + (x - R.x0) / (R.x1 - R.x0) * (CW - CP.l - CP.r),
  sy: (y, R) => CP.t + (1 - (y - R.y0) / (R.y1 - R.y0)) * (CH - CP.t - CP.b),
};
const samples = (n, a, b, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });
function kchart(R, { series, xlabel, ylabel, label, live = '', marks = [] }) {
  const sx = x => KC.sx(x, R), sy = y => KC.sy(y, R);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const zero = R.y0 < 0 ? `<line class="zero" x1="${CP.l}" x2="${CW - CP.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  const fmt = v => (v < 0 ? '−' : '') + Math.abs(v);
  return `<svg class="chart" viewBox="0 0 ${CW} ${CH}" role="img" aria-label="${label}">
    <rect class="frame" x="${CP.l}" y="${CP.t}" width="${CW - CP.l - CP.r}" height="${CH - CP.t - CP.b}"/>${zero}${live}${paths}${mk}
    <text class="ax" x="${CP.l - 6}" y="${sy(R.y1) + 4}" text-anchor="end">${fmt(R.y1)}</text><text class="ax" x="${CP.l - 6}" y="${sy(R.y0) + 4}" text-anchor="end">${fmt(R.y0)}</text>
    <text class="ax" x="${CP.l}" y="${CH - 7}">${R.x0}</text><text class="ax" x="${CW - CP.r}" y="${CH - 7}" text-anchor="end">${R.x1}</text>
    <text class="lab" x="${CP.l + 6}" y="${CP.t + 13}">${ylabel}</text><text class="ax" x="${(CP.l + CW - CP.r) / 2}" y="${CH - 7}" text-anchor="middle">${xlabel}</text>
  </svg>`;
}
// live pieces: a shaded area (filled by main.js), a red tangent, a cursor
const AREA = k => `<path data-area="${k}" style="fill:rgba(229,72,77,.18);stroke:none"/>`;
const TAN = k => `<line data-tan="${k}" style="stroke:#e5484d;stroke-width:1.4"/>`;
const CUR = k => `<circle class="cursor" r="4.5" data-cursor="${k}"/>`;

export const PAGES = [
  {
    kicker: '第 1 章', title: '运动学', sub: '对运动的描述',
    body: `
      <p class="lede">运动学用三个量描述运动：物体在哪里，运动得多快，以及这种快慢怎样变化。它不问为什么。</p>
      <p>本章的一切都来自一个以 ${f(M.VY0)} m/s 竖直上抛的小球。离手之后，作用在它上面的只有重力，所以它处于<b>自由落体</b>状态。上升时如此，下落时也如此。</p>
      <p>它上升 ${f(M.T / 2)} s，在 ${f(M.H)} m 高处停住，抛出后 ${f(M.T)} s 落地。图中以半速播放。</p>`,
    cam: { target: [-1.0, 2.7, 0], az: 22, el: 7, dist: 21 }, lit: 'ball', look: { strobe: 1, level: 1 },
    fig: '竖直上抛的小球',
  },
  {
    kicker: '1.1', title: '位置', sub: '位移与路程',
    body: `
      <p class="lede"><b>位置</b> <i>y</i> 表示小球在哪里，从原点量起。这里以抛出点为原点，向上为正。</p>
      <p><b>位移</b> Δ<i>y</i> = <i>y</i><sub>f</sub> − <i>y</i><sub>0</sub> 是位置的净变化。它是矢量：既有大小，也有方向（坐标轴旁的黑色箭头）。</p>
      <p><b>路程</b>是运动轨迹的总长度。它是标量，永远不为负。</p>
      <table class="data">
        <tr><th></th><th>位移</th><th>路程</th></tr>
        <tr><td>抛出 → 最高点</td><td>+${f(M.H)} m</td><td>${f(M.H)} m</td></tr>
        <tr><td>抛出 → 落地</td><td>0.00 m</td><td>${f(2 * M.H)} m</td></tr>
      </table>`,
    cam: { target: [-0.3, 2.9, 0], az: -16, el: 6, dist: 15 }, lit: 'staff', look: { disp: 1 },
    fig: '位置坐标轴',
  },
  {
    kicker: '1.2', title: '速度', sub: '速率与它并不相同',
    body: `
      <p class="lede"><b>速度</b> <i>v</i> = Δ<i>y</i>/Δ<i>t</i> 表示位置变化的快慢，带有方向。<b>速率</b>是速度的大小，没有方向。</p>
      <p>箭头就是速度。它从 +${f(M.VY0)} m/s 开始，到最高点缩为零，然后指向下方逐渐变长，落地时为 −${f(M.VY0)} m/s。抛出和落地时速率相同，速度却不同。</p>
      <p>对整段飞行取平均，也有同样的区别：</p>
      <table class="data">
        <tr><td>平均速度</td><td>Δ<i>y</i>/Δ<i>t</i> = 0 / ${f(M.T)} = 0 m/s</td></tr>
        <tr><td>平均速率</td><td>路程/Δ<i>t</i> = ${f(2 * M.H)} / ${f(M.T)} = ${f(2 * M.H / M.T)} m/s</td></tr>
      </table>`,
    cam: { target: [0.1, 3.0, 0.2], az: 24, el: 8, dist: 18 }, lit: 'vArrow', look: {},
    fig: '速度',
  },
  {
    kicker: '1.3', title: '加速度', sub: '速度变化的快慢',
    body: `
      <p class="lede"><b>加速度</b> <i>a</i> = Δ<i>v</i>/Δ<i>t</i>。这个小球的加速度始终是 −${f(M.G)} m/s²：上升时、在最高点、下落时都一样。红色箭头从不改变。</p>
      <p>浅色的球是频闪照片，每 ${f(tau, 1)} s 一张。上升时，相邻间距每次缩短 <i>g</i>τ² = ${f(M.G * tau * tau)} m。下落时，各张像恰好落在同样的高度上。</p>
      <p><b>加速还是减速？</b>比较正负号。<i>v</i> 与 <i>a</i> 异号时小球减速（上升）；同号时加速（下落）。两者都是加速度，并没有另外一个“减速度”。</p>
      <p class="live" id="live-sign"></p>`,
    cam: { target: [0.1, 2.75, 0], az: -6, el: 5, dist: 15.5 }, lit: 'aArrow', look: { strobe: 1 },
    fig: '频闪，每 ' + tau.toFixed(1) + ' s 一张',
  },
  {
    kicker: '1.4', title: '运动图像', sub: '斜率与面积',
    body: `
      <p class="lede">三幅图像画的是同一段飞行。位置图像按实际比例绘制：图中的高度就是小球真实的高度。</p>
      <ul class="rules">
        <li><i>x</i>–<i>t</i> 图像的斜率 = 速度</li>
        <li><i>v</i>–<i>t</i> 图像的斜率 = 加速度</li>
        <li><i>v</i>–<i>t</i> 图线下的面积 = 位移</li>
        <li><i>a</i>–<i>t</i> 图线下的面积 = 速度的变化量</li>
      </ul>
      <p>加速度恒定时，<i>a</i>–<i>t</i> 图线是水平直线，<i>v</i>–<i>t</i> 图线是倾斜直线，<i>x</i>–<i>t</i> 图线是抛物线。每幅图都比上面一幅低一“次”。</p>
      <p class="hintline">点击一幅图像，查看它的斜率和面积。</p>`,
    cam: { target: [-7.6, 3.0, -1.0], az: 0, el: 3, dist: 40 }, lit: 'boardX', look: { level: 1 },
    fig: '位置、速度、加速度随时间变化的图像',
  },
  {
    kicker: '1.5', title: '匀变速直线运动公式', sub: '只适用于恒定加速度',
    body: `
      <p class="lede">描述这种运动的有五个量：Δ<i>y</i>、<i>v</i><sub>0</sub>、<i>v</i>、<i>a</i>、<i>t</i>。每个公式都缺其中一个，所以挑那个不含“既不知道、也不需要”的量的公式。</p>
      <table class="data eqs">
        <tr><th>公式</th><th>不含</th></tr>
        <tr><td><i>v</i> = <i>v</i><sub>0</sub> + <i>at</i></td><td>Δ<i>y</i></td></tr>
        <tr><td>Δ<i>y</i> = <i>v</i><sub>0</sub><i>t</i> + ½<i>at</i>²</td><td><i>v</i></td></tr>
        <tr><td><i>v</i>² = <i>v</i><sub>0</sub>² + 2<i>a</i>Δ<i>y</i></td><td><i>t</i></td></tr>
        <tr><td>Δ<i>y</i> = ½(<i>v</i><sub>0</sub> + <i>v</i>)<i>t</i></td><td><i>a</i></td></tr>
        <tr><td>Δ<i>y</i> = <i>vt</i> − ½<i>at</i>²</td><td><i>v</i><sub>0</sub></td></tr>
      </table>
      <p>它能升多高？在最高点 <i>v</i> = 0，且不需要 <i>t</i>：0 = ${f(M.VY0)}² + 2(−${f(M.G)})Δ<i>y</i>，所以 Δ<i>y</i> = ${f(M.H)} m。</p>`,
    cam: { target: [-3.2, 3.1, -0.4], az: 20, el: 15, dist: 34 }, lit: 'ball', look: { level: 1 },
    fig: '一次飞行，五个量',
  },
  {
    kicker: '1.6', title: '抛体运动', sub: '两个运动同时进行',
    body: `
      <p class="lede">同一时刻抛出第二个球，竖直向上的速度同样是 ${f(M.VY0)} m/s，另外还有 ${f(M.VX)} m/s 的水平速度。</p>
      <p>它一路都和第一个球保持同一高度，并在同一时刻落地。竖直方向的运动是自由落体，水平速度不会改变它。它在地面上的影子以相等的 ${f(M.VX * tau)} m 步长移动：水平方向是匀速运动。</p>
      <table class="data cols">
        <tr><th>水平 · 匀速</th><th>竖直 · 自由落体</th></tr>
        <tr><td><i>v</i><sub>x</sub> = ${f(M.VX)} m/s</td><td><i>v</i><sub>0</sub> = ${f(M.VY0)} m/s，<i>v</i> = −${f(M.VY0)} m/s</td></tr>
        <tr><td>Δ<i>x</i> = <i>v</i><sub>x</sub><i>t</i> = ${f(M.RANGE, 1)} m</td><td><i>a</i> = −${f(M.G)} m/s²，Δ<i>y</i> = 0</td></tr>
        <tr><td><i>t</i> = ${f(M.T)} s</td><td><i>t</i> = ${f(M.T)} s</td></tr>
      </table>
      <p>在最高点，只有竖直分量 <i>v</i><sub>y</sub> 为零。小球仍以 ${f(M.VX)} m/s 水平运动。</p>`,
    cam: { target: [4.6, 2.7, 0.6], az: -16, el: 13, dist: 33 }, lit: 'projV', look: { proj: 1, comp: 1 },
    fig: '每一时刻都等高',
  },
  {
    kicker: '1.7', title: '参考系', sub: '速度取决于由谁来观察',
    body: `
      <p class="lede">每个速度都是相对于某个物体测得的。雨滴相对路面以 ${f(M.RAIN.vr, 1)} m/s 竖直下落；在以 ${f(M.RAIN.vc, 1)} m/s 行驶的车里看，雨滴以 ${f(M.vlen(M.V_RC))} m/s 斜着落下。</p>
      <p>用 <i>v</i><sub>AB</sub> 表示“A 相对于 B 的速度”（R 雨，C 车，G 地面）。速度可以串联，中间的字母要对上：</p>
      <div class="eq"><i>v</i><sub>AC</sub> = <i>v</i><sub>AB</sub> + <i>v</i><sub>BC</sub></div>
      <p>所以 <i>v</i><sub>RC</sub> = <i>v</i><sub>RG</sub> + <i>v</i><sub>GC</sub>，按首尾相接相加。交换两个字母，箭头就反向：在车里看，路面向后运动，<i>v</i><sub>GC</sub> = −<i>v</i><sub>CG</sub>。两个分量互相垂直，所以 |<i>v</i><sub>RC</sub>| = √(${f(M.RAIN.vc, 1)}² + ${f(M.RAIN.vr, 1)}²) = ${f(M.vlen(M.V_RC))} m/s，tan θ = ${f(M.RAIN.vc, 1)}/${f(M.RAIN.vr, 1)}，θ = ${f(M.RAIN_ANGLE, 1)}°（偏离竖直方向）。车开得越快，雨斜得越厉害：</p>
      <div class="charts">${kchart(KR.rain, { xlabel: '车速 (m/s)', ylabel: '偏离竖直方向的角度 θ (°)', label: '车里看到的雨滴倾斜角随车速的变化',
        series: [{ pts: samples(60, 0, 30, M.rainAngleAt) }], marks: [[M.RAIN.vc, M.RAIN_ANGLE, `${f(M.RAIN_ANGLE, 1)}°`, 8, 16]] })}</div>
      <p class="hintline">按 1:1 绘制。箭头每 1 m/s 长 ${(RAIN_V * 100).toFixed(0)} cm。¼ 速播放。点击三角形查看角度。</p>`,
    cam: { target: [ST.rain + 11, 2.3, 0], az: -8, el: 10, dist: 60 }, lit: 'rainSum', look: {}, scene: 'rain',
    fig: '同一场雨，两个参考系',
  },
  {
    kicker: '1.8', title: '小船渡河', sub: '两个速度首尾相接相加',
    body: `
      <p class="lede">小船相对河岸的速度，等于它相对水的速度加上水相对河岸的速度：</p>
      <div class="eq"><i>v</i><sub>BS</sub> = <i>v</i><sub>BW</sub> + <i>v</i><sub>WS</sub></div>
      <p>两条船在水中的速度都是 ${f(M.RIVER.vb, 1)} m/s，水流速度 ${f(M.RIVER.vw, 1)} m/s，河宽 ${M.RIVER.w} m。</p>
      <table class="data">
        <tr><th>m/s, s, m</th><th>船头正对对岸</th><th>船头偏向上游 ${deg(M.AIM_UP)}°</th></tr>
        <tr><td>速率</td><td>√(${f(M.RIVER.vb, 1)}² + ${f(M.RIVER.vw, 1)}²) = ${f(M.vlen(M.vBS(0)))}</td><td>√(${f(M.RIVER.vb, 1)}² − ${f(M.RIVER.vw, 1)}²) = ${f(M.vlen(M.vBS(M.AIM_UP)))}</td></tr>
        <tr><td>时间</td><td>${M.RIVER.w}/${f(M.RIVER.vb, 1)} = ${f(M.crossTime(0), 1)} s</td><td>${M.RIVER.w}/${f(M.vBS(M.AIM_UP)[1], 1)} = ${f(M.crossTime(M.AIM_UP), 1)} s</td></tr>
        <tr><td>漂移</td><td>${f(M.RIVER.vw, 1)} × ${f(M.crossTime(0), 1)} = ${f(M.drift(0), 1)} m</td><td>0 m</td></tr>
      </table>
      <p>只有垂直河岸的分量能把船送到对岸，所以船头正对对岸时渡河最快；水流只是把船带向下游。要在正对岸靠岸，就让船头偏向上游，直到 sin θ = ${f(M.RIVER.vw, 1)}/${f(M.RIVER.vb, 1)}。</p>
      <div class="charts">${kchart(KR.map, { xlabel: '顺流方向 (m)', ylabel: '垂直河岸 (m)', label: '俯视两条船的路径',
        live: CUR('boatA') + CUR('boatB'), series: [{ pts: [[0, 0], [M.drift(0), M.RIVER.w]], tag: [8.6, 12.5, '正对对岸'] }, { pts: [[0, 0], [0, M.RIVER.w]], tag: [0.3, 3, '偏向上游'] }] })}</div>
      <p class="hintline">1 m 画成 ${(RIV.s * 100).toFixed(0)} cm。箭头每 1 m/s 长 ${(RIV.v * 100).toFixed(0)} cm。以 ${M.RIVER.rate}× 速度播放。</p>`,
    cam: { target: [ST.river - 1.7, 0, 0.3], az: -4, el: 44, dist: 40 }, lit: 'boatA', look: {}, scene: 'river',
    fig: '船头朝一个方向，船却走向另一个方向',
  },
  {
    kicker: '1.9 · AP 物理 C', title: '用微积分描述运动', sub: '加速度变化时',
    body: `
      <p class="lede">1.5 节的公式要求 <i>a</i> 恒定。这辆车的 <i>a</i> = ${f(M.PULL.a0, 1)} − ${f(M.PULL.k, 1)}<i>t</i> m/s²，在 <i>t</i><sub>1</sub> = ${f(M.T1)} s 时减为零，所以要改用积分。它从起跑线由静止出发：<i>v</i><sub>0</sub> = 0，<i>x</i><sub>0</sub> = 0。</p>
      <div class="eq"><i>v</i> = <i>v</i><sub>0</sub> + ∫<i>a</i> d<i>t</i> = ${f(M.PULL.a0, 1)}<i>t</i> − ${f(M.PULL.k / 2)}<i>t</i>² &nbsp;→ ${f(M.V1, 1)} m/s</div>
      <div class="eq"><i>x</i> = <i>x</i><sub>0</sub> + ∫<i>v</i> d<i>t</i> = ${f(M.PULL.a0 / 2, 1)}<i>t</i>² − ${f(M.PULL.k / 6)}<i>t</i>³ &nbsp;→ ${f(M.X1, 1)} m</div>
      <div class="charts">
        ${kchart(KR.pa, { xlabel: 't (s)', ylabel: 'a (m/s²) · 面积 = Δv', label: '加速度随时间变化，面积已着色', live: AREA('pa') + CUR('pa'), series: [{ pts: samples(100, 0, 5, M.pa) }] })}
        ${kchart(KR.pv, { xlabel: 't (s)', ylabel: 'v (m/s) · 面积 = Δx，斜率 = a', label: '速度随时间变化，面积已着色', live: AREA('pv') + TAN('pv') + CUR('pv'), series: [{ pts: samples(100, 0, 5, M.pv) }] })}
        ${kchart(KR.px, { xlabel: 't (s)', ylabel: 'x (m) · 斜率 = v', label: '位置随时间变化及其切线', live: TAN('px') + CUR('px'), series: [{ pts: samples(100, 0, 5, M.px) }] })}
      </div>
      <p class="hintline">着色 = 积分，红线 = 导数。1 m 画成 ${(PULLS.s * 100).toFixed(0)} cm。</p>`,
    cam: { target: [ST.pull + 4.4, 0.3, 0], az: -8, el: 24, dist: 22 }, lit: 'pull', look: {}, scene: 'pull',
    fig: 'a = ' + M.PULL.a0.toFixed(1) + ' − ' + M.PULL.k.toFixed(1) + 't',
  },
  {
    kicker: '1.10 · AP 物理 C', title: '由 x(t) 求运动', sub: '向下求导，向上积分',
    body: `
      <p class="lede">已知 <i>x</i>(<i>t</i>)，就求导。对 <i>x</i> = <i>t</i>³ − 3<i>t</i>：</p>
      <div class="eq"><i>v</i> = 3<i>t</i>² − 3 &nbsp;&nbsp; <i>a</i> = 6<i>t</i></div>
      <p>它开始时以 ${f(-M.cv(0))} m/s 向左运动，在 <i>t</i> = ${f(M.T_TURN)} s、<i>x</i> = ${f(M.cx(M.T_TURN))} m 处掉头。2 s 内：位移 ${f(M.cx(2))} m，路程 ${f(M.cdist(2))} m。</p>
      <p><b>反过来积分</b>需要初始条件：由 <i>a</i> = 6<i>t</i> 得 <i>v</i> = 3<i>t</i>² + <i>C</i><sub>1</sub>，<i>x</i> = <i>t</i>³ + <i>C</i><sub>1</sub><i>t</i> + <i>C</i><sub>2</sub>；由 <i>v</i>(0) = −3 和 <i>x</i>(0) = 0 得 <i>C</i><sub>1</sub> = −3，<i>C</i><sub>2</sub> = 0。</p>
      <div class="charts">
        ${kchart(KR.cx, { xlabel: 't (s)', ylabel: 'x (m) · 斜率 = v', label: '位置随时间变化', live: TAN('cx') + CUR('cx'), series: [{ pts: samples(100, 0, 2, M.cx) }] })}
        ${kchart(KR.cv, { xlabel: 't (s)', ylabel: 'v (m/s) · 面积 = Δx', label: '速度随时间变化，带正负号的面积已着色', live: AREA('cv') + CUR('cv'), series: [{ pts: samples(100, 0, 2, M.cv) }] })}
        ${kchart(KR.ca, { xlabel: 't (s)', ylabel: 'a (m/s²) · 面积 = Δv', label: '加速度随时间变化，面积已着色', live: AREA('ca') + CUR('ca'), series: [{ pts: samples(100, 0, 2, M.ca) }] })}
      </div>
      <p class="hintline">每 0.2 s 一个位置；返程画在前面。</p>`,
    cam: { target: [ST.cube + 0.25, 0.25, 0], az: -6, el: 28, dist: 19.5 }, lit: 'bead', look: {}, scene: 'cube',
    fig: 'x = t³ − 3t',
  },
];

// ---------- click a concept: what it breaks into ----------
const sign = v => v > 1e-9 ? '+' : v < -1e-9 ? '−' : '';
export const PLATES = {
  ball: { text: `做自由落体运动的小球。抛出后没有任何东西推它向上；它上升只是因为它仍在向上运动，而重力让它的速度每秒改变 ${M.G.toFixed(2)} m/s。`,
    facts: t => [['时间', `${t.toFixed(2)} s`], ['位置 y', `${M.y(t).toFixed(2)} m`], ['速度 v', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['加速度 a', `−${M.G.toFixed(2)} m/s²`]] },
  staff: { text: `这条竖线是位置坐标轴，零点在抛出点。短标记随小球的高度移动；黑色箭头是从零点起的位移。小球落地时位移回到零，尽管小球已经走过了 ${(2 * M.H).toFixed(2)} m。`,
    facts: t => [['位置 y', `${M.y(t).toFixed(2)} m`], ['位移', `${sign(M.y(t))}${Math.abs(M.y(t)).toFixed(2)} m`], ['已走路程', `${M.distance(t).toFixed(2)} m`]] },
  vArrow: { text: `箭头的长度表示速率，方向表示速度的正负。它按固定比例绘制，所以速度加倍，箭头也加长一倍。`,
    facts: t => [['速度', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['速率', `${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['方向', M.vy(t) > 1e-9 ? '向上' : M.vy(t) < -1e-9 ? '向下' : '无，仅此一瞬']] },
  aArrow: { text: `每一时刻的加速度都相同，所以这个箭头从不改变。小球是加速还是减速，取决于速度的正负号与它是否相同。`,
    facts: t => [['加速度', `−${M.G.toFixed(2)} m/s²`], ['速度', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['所以小球正在', M.vy(t) > 1e-9 ? '减速' : M.vy(t) < -1e-9 ? '加速' : '位于最高点']] },
  boardX: { text: `红线是这一时刻的切线。它的斜率（纵向变化除以横向变化）就是速度：抛出时陡，最高点处平，落地时朝另一方向陡。`,
    facts: t => [['斜率 = v', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`]] },
  boardV: { text: `一条直线，所以斜率（加速度）恒定。直线与零线之间的着色面积就是到目前为止的位移。零线以下的面积记为负，所以到落地时两半互相抵消。`,
    facts: t => [['斜率 = a', `−${M.G.toFixed(2)} m/s²`], ['面积 = Δy', `${sign(M.areaUnderV(t))}${Math.abs(M.areaUnderV(t)).toFixed(2)} m`]] },
  boardA: { text: `一条水平线：加速度恒定。着色面积是到目前为止速度的变化量 a·t。`,
    facts: t => [['面积 = Δv', `${t > 0 ? '−' : ''}${(M.G * t).toFixed(2)} m/s`], ['v = v₀ + Δv', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`]] },
  proj: { text: `两个相互独立的运动同时进行：水平方向匀速，竖直方向自由落体。每一个都是一维问题，有各自的公式。它们只共用时间。`,
    facts: t => [['x', `${M.x(t).toFixed(2)} m`], ['y', `${M.y(t).toFixed(2)} m`], ['时间', `${t.toFixed(2)} s`]] },
  projV: { text: `速度箭头可以分解为一个始终不变的水平分量，和一个与第一个球的速度完全相同的竖直分量。把两者首尾相接相加，就得回原来的箭头。`,
    facts: t => [['vₓ', `${M.VX.toFixed(2)} m/s`], ['v_y', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['速率 √(vₓ² + v_y²)', `${Math.hypot(M.VX, M.vy(t)).toFixed(2)} m/s`]] },
  shadow: { text: `从正上方照下的光把运动压扁到地面上，剩下的就是水平方向的运动：相等时间内走相等的距离，因为水平方向不受力。`,
    facts: t => [['已走 Δx', `${M.x(t).toFixed(2)} m`], ['每 ' + M.STROBE.toFixed(1) + ' s 的步长', `${(M.VX * M.STROBE).toFixed(2)} m`]] },
  rainRoad: { text: `在路面上看，每个雨滴以 ${M.RAIN.vr.toFixed(1)} m/s 竖直下落，汽车以 ${M.RAIN.vc.toFixed(1)} m/s 从雨下驶过。这里没有任何东西是斜的。`,
    facts: () => [['车，v_CG', `${M.RAIN.vc.toFixed(2)} m/s，向前`], ['雨，v_RG', `${M.RAIN.vr.toFixed(2)} m/s，向下`], ['雨滴的轨迹', '竖直']] },
  rainCar: { text: `在车里看，车是静止的。路面以 ${M.RAIN.vc.toFixed(1)} m/s 向后流过，每个雨滴在保持向下运动的同时，还随路面一起向后运动，所以雨痕是斜的。`,
    facts: () => [['雨，v_RC', `${M.vlen(M.V_RC).toFixed(2)} m/s`], ['偏离竖直方向', `${M.RAIN_ANGLE.toFixed(1)}°`], ['路面，v_GC', `${M.RAIN.vc.toFixed(2)} m/s，向后`], ['车', '0 m/s']] },
  rainSum: { text: `首尾相接：先画雨相对地面的速度，再加上地面相对车的速度。从第一个箭尾指向最后一个箭头的箭头，就是车里看到的雨。`,
    facts: () => [['向前分量', `${M.V_RC[0].toFixed(2).replace('-', '−')} m/s`], ['向上分量', `${M.V_RC[1].toFixed(2).replace('-', '−')} m/s`], ['|v_RC|', `${M.vlen(M.V_RC).toFixed(2)} m/s`], ['tan θ = 10.0 / 7.0', `θ = ${M.RAIN_ANGLE.toFixed(1)}°`]] },
  river: { text: `水相对河岸以 ${M.RIVER.vw.toFixed(1)} m/s 流动。漂在水上的任何东西，比如这些树叶或一条船，除了自身在水中的运动之外，还会以这个速度被水带着走。`,
    facts: (t, s) => [['水流，v_WS', `${M.RIVER.vw.toFixed(2)} m/s，顺流`], ['河宽', `${M.RIVER.w} m`], ['时间', `${s.river.t.toFixed(1)} s`]] },
  boatA: { text: `船头正对对岸，经 w/v_b = ${M.crossTime(0).toFixed(1)} s 到达对岸，这是最快的渡河方式，但水流把它向下游带了 ${M.drift(0).toFixed(1)} m。船头朝一个方向，船却走向另一个方向。`,
    facts: (t, s) => boatFacts(0, s.river.t) },
  boatB: { text: `船头偏向上游 ${deg(M.AIM_UP)}°，它沿上游方向的分量（${M.RIVER.vb.toFixed(1)} sin θ = ${M.RIVER.vw.toFixed(1)} m/s）抵消了水流。它在正对岸靠岸，但只剩 ${M.vBS(M.AIM_UP)[1].toFixed(1)} m/s 用来渡河，所以要用 ${M.crossTime(M.AIM_UP).toFixed(1)} s。`,
    facts: (t, s) => boatFacts(M.AIM_UP, s.river.t) },
  pull: { text: `它的加速度不恒定，所以 1.5 节的匀变速直线运动公式不适用。它的速度是到目前为止 a–t 图线下的面积，位置是 v–t 图线下的面积。相邻轮廓之间的间距不断增大，但增量越来越小，直到 a = 0 后间距相等。`,
    facts: (t, s) => { const u = s.pull.t; return [['时间', `${u.toFixed(2)} s`], ['x = ∫v dt', `${M.px(u).toFixed(2)} m`], ['v = ∫a dt', `${M.pv(u).toFixed(2)} m/s`], ['a', `${M.pa(u).toFixed(2)} m/s²`]]; } },
  pullA: { text: `a = ${M.PULL.a0.toFixed(1)} − ${M.PULL.k.toFixed(1)}t：v–t 图像的斜率，均匀减小，在 t₁ = ${M.T1.toFixed(2)} s 时减为零。它的变化率 da/dt = −${M.PULL.k.toFixed(1)} m/s³ 叫作加加速度（急动度）。`,
    facts: (t, s) => { const u = s.pull.t; return [['a = dv/dt', `${M.pa(u).toFixed(2)} m/s²`], ['da/dt', u < M.T1 ? `−${M.PULL.k.toFixed(2)} m/s³` : '0'], ['目前面积 = v', `${M.pv(u).toFixed(2)} m/s`]]; } },
  bead: { text: `x = t³ − 3t。求一次导得到速度，求两次导得到加速度。掉头时 v = 0，但 a = ${M.ca(M.T_TURN).toFixed(1)} m/s²：速度为零并不意味着加速度为零。`,
    facts: (t, s) => { const u = s.cube.t, v = M.cv(u), a = M.ca(u); return [['时间', `${u.toFixed(2)} s`], ['x', `${f(M.cx(u))} m`], ['v = 3t² − 3', `${f(v)} m/s`], ['a = 6t', `${f(a)} m/s²`], ['所以它正在', Math.abs(v) < 0.02 ? '掉头' : v * a > 0 ? '加速' : a === 0 ? 'a = 0，仅此一瞬' : '减速']]; } },
  cubeLine: { text: `黑色箭头是从起点算起的位移。质点先向左走 2 m，再向右走 4 m：2 s 时位移是 +2 m，但走过的路程是 6 m。`,
    facts: (t, s) => { const u = s.cube.t; return [['位置 x', `${f(M.cx(u))} m`], ['位移', `${f(M.cx(u))} m`], ['已走路程', `${M.cdist(u).toFixed(2)} m`]]; } },
};
function boatFacts(phi, t) {
  const tt = Math.min(t, M.crossTime(phi)), [dx, dy] = M.boatPos(phi, t);
  return [['时间', `${tt.toFixed(1)} s`], ['垂直河岸', `${dy.toFixed(1)} / ${M.RIVER.w} m`], ['顺流', `${Math.abs(dx) < 0.05 ? '0.0' : dx.toFixed(1)} m`], ['速率 |v_BS|', `${M.vlen(M.vBS(phi)).toFixed(2)} m/s`], ['靠岸', `${M.crossTime(phi).toFixed(1)} s，向下游 ${Math.abs(M.drift(phi)) < 0.05 ? '0.0' : M.drift(phi).toFixed(1)} m`]];
}

