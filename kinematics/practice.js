// AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from model.js; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const p3 = x => (x < 0 ? '−' : '') + Math.abs(x).toPrecision(3);   // 3 significant figures
const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const dg = r => r * 180 / Math.PI;

// 0 · a faster throw
const H2 = (2 * M.VY0) ** 2 / (2 * M.G);
// 1 · caught on the way down, below the launch point
const DROP = 1.50, DIST1 = 2 * M.H + DROP;
// 2 · averages over the first 1.50 s
const T2 = 1.50, Y2 = M.y(T2), D2 = 2 * M.H - Y2;
// 3 · strobe gaps shrink by gτ²
const TAU = M.STROBE;
// 5 · speed at 3.00 m up
const Y5 = 3.00, V5 = Math.sqrt(M.VY0 ** 2 - 2 * M.G * Y5);
// 6 · twice the sideways speed
const R6 = 2 * M.VX * M.T;
// 7 · a faster car
const VC7 = 20.0, A7 = dg(Math.atan2(VC7, M.RAIN.vr));
// 8 · a stronger current, aimed straight across
const VW8 = 2.0;
// 9 · the fading pull, at 2.00 s
const T9 = 2.00, V9 = M.PULL.a0 * T9 - 0.5 * M.PULL.k * T9 ** 2;

export const PRACTICE = {
  0: [
    { q: `把小球改以 ${f(2 * M.VY0, 1)} m/s 而不是 ${f(M.VY0)} m/s 竖直上抛。它能升多高？（不计空气阻力。）`,
      choices: [`${p3(2 * M.H)} m`, `${p3(Math.SQRT2 * M.H)} m`, `${p3(H2)} m`, `${p3(8 * M.H)} m`], answer: 2,
      why: `<p>在最高点 <i>v</i> = 0，所以 <i>h</i> = <i>v</i><sub>0</sub>²/2<i>g</i>。高度与抛出速度的<b>平方</b>成正比：<i>v</i><sub>0</sub> 加倍，高度变为 4 × ${f(M.H)} m。</p><div class="eq"><i>h</i> = (${f(2 * M.VY0, 1)})² / (2 × ${f(M.G)}) = ${p3(H2)} m</div><p>${p3(2 * M.H)} m 是误以为高度与速度成正比。</p>` },
    { q: '小球到达最高点的那一瞬间，它的加速度',
      choices: ['为零', `${f(M.G)} m/s²，竖直向下`, `${f(M.G)} m/s²，竖直向上`, '无法确定，因为它正在改变方向'], answer: 1,
      why: `<p>每一时刻重力都是唯一的力，所以整个飞行过程中 <i>a</i> = <i>g</i> = ${f(M.G)} m/s²，竖直向下。在最高点<b>速度</b>为零，但它仍在变化：下一瞬间它就指向下方。</p>` },
  ],
  1: [
    { q: `从平台边缘以 ${f(M.VY0)} m/s 竖直上抛一个小球，下落时在抛出点<b>下方</b> ${f(DROP)} m 处接住。它一共走过多少路程？`,
      choices: [`${p3(DROP)} m`, `${p3(2 * M.H - DROP)} m`, `${p3(M.H + DROP)} m`, `${p3(DIST1)} m`], answer: 3,
      why: `<p>路程要把每一段轨迹都加起来。它上升 <i>h</i> = <i>v</i><sub>0</sub>²/2<i>g</i> = ${f(M.H)} m，下落 ${f(M.H)} m 回到抛出点，再下落 ${f(DROP)} m：</p><div class="eq">${f(M.H)} + ${f(M.H)} + ${f(DROP)} = ${p3(DIST1)} m</div><p>${p3(DROP)} m 是<b>位移</b>的大小（向上为正时为 −${f(DROP)} m），不是路程。</p>` },
    { q: '物体沿直线运动时，它的位移大小与走过的路程相比如何？',
      choices: ['两者总是相等。', '位移可能大于路程。', '位移永远不会更大；只有物体不折返时两者才相等。', '位移总是小于路程。'], answer: 2,
      why: `<p>路程计入轨迹的每一米，位移只计净变化。任何折返都会抵消一部分位移，却会增加路程（往返一趟：0 m 对 ${f(2 * M.H)} m）。不折返时两者相等，所以“总是小于”也不对。</p>` },
  ],
  2: [
    { q: `从抛出到 <i>t</i> = ${f(T2)} s，小球的平均<b>速率</b>是多少？（它以 ${f(M.VY0)} m/s 上抛，在 ${f(M.T / 2)} s 时到达最高点 ${f(M.H)} m。）`,
      choices: [`${p3(D2 / T2)} m/s`, `${p3(Y2 / T2)} m/s`, `${p3(M.H / T2)} m/s`, `${p3((M.VY0 + Math.abs(M.vy(T2))) / 2)} m/s`], answer: 0,
      why: `<p>平均速率 = 路程 / 时间。在 ${f(T2)} s 时小球位于 <i>y</i> = ${f(M.VY0)}(${f(T2)}) − ½(${f(M.G)})(${f(T2)})² = ${f(Y2, 3)} m，正在下落。路程 = 上升 ${f(M.H)} m + 下落 ${f(M.H - Y2, 3)} m = ${f(D2, 3)} m。</p><div class="eq">${f(D2, 3)} m / ${f(T2)} s = ${p3(D2 / T2)} m/s</div><p>${p3(Y2 / T2)} m/s 是平均<b>速度</b>（位移 / 时间）。</p>` },
    { q: '比较小球刚离手时的速度和它刚要回到手中时的速度。',
      choices: ['两者相同。', '落回时的速度更大，因为重力作用的时间更长。', '两者平均都为零，所以无法比较。', '速率相同，方向相反。'], answer: 3,
      why: `<p>运动是对称的：抛出时 +${f(M.VY0)} m/s，下落经过同一高度时 −${f(M.VY0)} m/s（<i>v</i>² = <i>v</i><sub>0</sub>² + 2<i>a</i>Δ<i>y</i>，Δ<i>y</i> = 0）。速率相等，但速度包含方向，所以两个速度不同。</p>` },
  ],
  3: [
    { q: '取向上为正。小球在飞行的哪一阶段加速？',
      choices: ['上升时，因为它的速度为正', '在最高点，因为那里的加速度最大', '下落时，因为 v 与 a 同号', '从不加速：负的加速度总是让物体减速'], answer: 2,
      why: `<p>加速意味着 <i>v</i> 与 <i>a</i> 方向相同。<i>a</i> 始终是 −${f(M.G)} m/s²；下落时 <i>v</i> 也为负，所以速率增大。负的 <i>a</i> 只在 <i>v</i> 为正时才让小球减速。</p>` },
    { q: `频闪每 ${f(TAU, 3)} s 闪一次。上升时，相邻两像之间的间距比前一个间距缩短多少？`,
      choices: [`${p3(0.5 * M.G * TAU ** 2)} m`, `${p3(M.G * TAU ** 2)} m`, `${p3(M.G * TAU)} m`, `${p3(2 * M.G * TAU ** 2)} m`], answer: 1,
      why: `<p>每个间距是一个时间间隔内走过的距离 <i>v</i>τ − ½<i>g</i>τ²，其中 <i>v</i> 是该间隔开始时的速率。从一个间距到下一个，<i>v</i> 减小 <i>g</i>τ，所以间距减小 (<i>g</i>τ)τ：</p><div class="eq">Δ(间距) = <i>g</i>τ² = ${f(M.G)} × (${f(TAU, 3)})² = ${p3(M.G * TAU ** 2)} m</div><p>½ 属于单个间距，不属于两个间距之差。</p>` },
  ],
  4: [
    { q: `在小球的 <i>v</i>–<i>t</i> 图像上（向上为正，<i>v</i><sub>0</sub> = ${f(M.VY0)} m/s），从 0 到 ${f(T2)} s，图线与时间轴之间的净面积是多少？`,
      choices: [`${p3(D2)} m`, `${p3(M.VY0 * T2)} m`, `${p3(M.H)} m`, `${p3(Y2)} m`], answer: 3,
      why: `<p><i>v</i>–<i>t</i> 图线下的面积是位移；时间轴以下的面积记为负。时间轴以上，到 ${f(M.T / 2)} s 为一个三角形：+½(${f(M.VY0)})(${f(M.T / 2)}) = +${f(M.H)} m。时间轴以下，从 ${f(M.T / 2)} 到 ${f(T2)} s：−½(${f(T2 - M.T / 2)})(${f(-M.vy(T2))}) = −${f(M.H - Y2, 3)} m。</p><div class="eq">净面积 = ${f(M.H)} − ${f(M.H - Y2, 3)} = ${p3(Y2)} m</div><p>${p3(D2)} m 是把轴下部分加上而不是减去：那是路程。</p>` },
    { q: '小球到达最高点的那一瞬间，下列哪个量为零？',
      choices: ['<i>y</i>–<i>t</i> 图像的斜率', '<i>v</i>–<i>t</i> 图像的斜率', '从 <i>a</i>–<i>t</i> 图像上读出的值', '自抛出以来 <i>a</i>–<i>t</i> 图线下的面积'], answer: 0,
      why: `<p><i>y</i>–<i>t</i> 图像的斜率是速度，在最高点为零。<i>v</i>–<i>t</i> 图像的斜率和 <i>a</i>–<i>t</i> 图像的读数都是 −${f(M.G)} m/s²。自抛出以来 <i>a</i>–<i>t</i> 图线下的面积是 Δ<i>v</i> = −${f(M.VY0)} m/s，不为零。</p>` },
  ],
  5: [
    { q: `小球在抛出点上方 ${f(Y5)} m 处时速率是多少？（<i>v</i><sub>0</sub> = ${f(M.VY0)} m/s，向上。）`,
      choices: [`${p3(Math.sqrt(M.VY0 ** 2 + 2 * M.G * Y5))} m/s`, `${p3(V5)} m/s`, `${p3(Math.sqrt(M.VY0 ** 2 - M.G * Y5))} m/s`, `${p3(V5 ** 2)} m/s`], answer: 1,
      why: `<p>题目没有给出也不需要时间，所以用不含 <i>t</i> 的公式，<i>a</i> = −${f(M.G)} m/s²：</p><div class="eq"><i>v</i>² = ${f(M.VY0)}² + 2(−${f(M.G)})(${f(Y5)}) = ${f(V5 ** 2)} m²/s²，&nbsp;<i>v</i> = ${p3(V5)} m/s</div><p>${p3(Math.sqrt(M.VY0 ** 2 + 2 * M.G * Y5))} m/s 来自把 <i>a</i> 取为 +<i>g</i>：小球到了上面一定更慢，而不是更快。（它两次经过 ${f(Y5)} m，速率都是这个值。）</p>` },
    { q: `只知道 <i>v</i><sub>0</sub>、<i>a</i> 和 Δ<i>y</i>，要求小球第一次到达 ${f(Y5)} m 所用的时间。哪个公式一步就能求出？`,
      choices: ['<i>v</i> = <i>v</i><sub>0</sub> + <i>at</i>', '<i>v</i>² = <i>v</i><sub>0</sub>² + 2<i>a</i>Δ<i>y</i>', 'Δ<i>y</i> = <i>v</i><sub>0</sub><i>t</i> + ½<i>at</i>²', 'Δ<i>y</i> = ½(<i>v</i><sub>0</sub> + <i>v</i>)<i>t</i>'], answer: 2,
      why: `<p>不需要的未知量是末速度 <i>v</i>，所以选不含 <i>v</i> 的公式：Δ<i>y</i> = <i>v</i><sub>0</sub><i>t</i> + ½<i>at</i>²。它是关于 <i>t</i> 的二次方程；较小的根对应上升过程。另外三个公式要么含 <i>v</i>，要么不含 <i>t</i>。</p>` },
  ],
  6: [
    { q: `第二个球离手时水平速度 ${f(M.VX)} m/s，竖直向上速度 ${f(M.VY0)} m/s。它在轨迹最高点的速率是多少？`,
      choices: ['0 m/s', `${p3(M.VY0)} m/s`, `${p3(M.V0P)} m/s`, `${p3(M.VX)} m/s`], answer: 3,
      why: `<p>在最高点只有 <i>v</i><sub>y</sub> 为零。水平方向不受力，所以 <i>v</i><sub>x</sub> 保持 ${f(M.VX)} m/s，速率为 √(<i>v</i><sub>x</sub>² + 0²) = ${p3(M.VX)} m/s。“0 m/s”只对竖直上抛的球成立。</p>` },
    { q: `从水平地面再抛一次，竖直向上的速度仍是 ${f(M.VY0)} m/s，水平速度却<b>加倍</b>为 ${f(2 * M.VX)} m/s。它落在多远处？`,
      choices: [`${p3(M.RANGE)} m`, `${p3(R6)} m`, `${p3(4 * M.RANGE)} m`, `${p3(Math.SQRT2 * M.RANGE)} m`], answer: 1,
      why: `<p>在空中的时间只取决于竖直方向的运动：<i>t</i> = 2<i>v</i><sub>0y</sub>/<i>g</i> = ${f(M.T)} s，没有改变。水平方向是匀速运动：</p><div class="eq">Δ<i>x</i> = <i>v</i><sub>x</sub><i>t</i> = ${f(2 * M.VX)} × ${f(M.T)} = ${p3(R6)} m</div><p>${p3(4 * M.RANGE)} m 是把整个抛出速度加倍的结果，那样飞行时间也会加倍。</p>` },
  ],
  7: [
    { q: `雨以 ${f(M.RAIN.vr, 1)} m/s 竖直下落。汽车加速到 ${f(VC7, 1)} m/s。在车里看，雨痕偏离竖直方向多大角度？`,
      choices: [`${p3(dg(Math.atan2(M.RAIN.vr, VC7)))}°`, `${p3(M.RAIN_ANGLE)}°`, `${p3(A7)}°`, `${p3(dg(Math.atan2(M.RAIN.vr, M.RAIN.vc)))}°`], answer: 2,
      why: `<p><i>v</i><sub>RC</sub> = <i>v</i><sub>RG</sub> + <i>v</i><sub>GC</sub>：向下 ${f(M.RAIN.vr, 1)} m/s 加上向后 ${f(VC7, 1)} m/s，两者互相垂直。从竖直方向量角，对边是水平分量：</p><div class="eq">tan θ = ${f(VC7, 1)} / ${f(M.RAIN.vr, 1)}，&nbsp;θ = ${p3(A7)}°</div><p>${p3(dg(Math.atan2(M.RAIN.vr, VC7)))}° 是偏离<b>水平方向</b>的角度。</p>` },
    { q: `对于坐在以 ${f(M.RAIN.vc, 1)} m/s 向前行驶的汽车里的乘客，路面的速度是多少？`,
      choices: [`${f(M.RAIN.vc, 1)} m/s，向后`, `${f(M.RAIN.vc, 1)} m/s，向前`, '零：路面是参考物', `${f(M.vlen(M.V_RC))} m/s，斜向`], answer: 0,
      why: `<p>交换字母，矢量就反向：<i>v</i><sub>GC</sub> = −<i>v</i><sub>CG</sub>。汽车相对路面以 ${f(M.RAIN.vc, 1)} m/s 向前运动，所以路面相对汽车以 ${f(M.RAIN.vc, 1)} m/s 向后运动。以哪个物体为参考是一种选择，而不是事实。</p>` },
  ],
  8: [
    { q: `水流速度增大到 ${f(VW8, 1)} m/s。小船在水中的速度仍是 ${f(M.RIVER.vb, 1)} m/s，船头正对 ${M.RIVER.w} m 宽河流的对岸。渡河要多长时间？`,
      choices: [`${p3(M.RIVER.w / Math.hypot(M.RIVER.vb, VW8))} s`, `${p3(M.RIVER.w / Math.sqrt(M.RIVER.vb ** 2 - VW8 ** 2))} s`, `${p3(M.RIVER.w / (M.RIVER.vb + VW8))} s`, `${p3(M.RIVER.w / M.RIVER.vb)} s`], answer: 3,
      why: `<p>只有速度中垂直河岸的分量才能把船送到对岸，而水流没有垂直河岸的分量。所以</p><div class="eq"><i>t</i> = <i>w</i> / <i>v</i><sub>b</sub> = ${M.RIVER.w} / ${f(M.RIVER.vb, 1)} = ${p3(M.RIVER.w / M.RIVER.vb)} s</div><p>与原来相同；更强的水流只是把船带到更下游（${f(VW8 * M.RIVER.w / M.RIVER.vb, 1)} m）。用合速率 ${f(Math.hypot(M.RIVER.vb, VW8))} m/s 去除，是拿斜向路径上的速率去对应垂直河岸的距离。</p>` },
    { q: `回到 ${f(M.RIVER.vw, 1)} m/s 的水流：速度 ${f(M.RIVER.vb, 1)} m/s 的小船，船头要从正对对岸的方向向上游偏多大角度，才能在正对岸靠岸？`,
      choices: [`${p3(dg(Math.atan(M.RIVER.vw / M.RIVER.vb)))}°`, `${p3(dg(M.AIM_UP))}°`, `${p3(dg(Math.acos(M.RIVER.vw / M.RIVER.vb)))}°`, `${p3(dg(Math.atan(M.RIVER.vb / M.RIVER.vw)))}°`], answer: 1,
      why: `<p>小船沿上游方向的分量必须抵消水流。小船自身的速度是斜边：</p><div class="eq"><i>v</i><sub>b</sub> sin θ = <i>v</i><sub>w</sub> &nbsp;→ sin θ = ${f(M.RIVER.vw, 1)} / ${f(M.RIVER.vb, 1)}，θ = ${p3(dg(M.AIM_UP))}°</div><p>tan θ = ${f(M.RIVER.vw, 1)}/${f(M.RIVER.vb, 1)} 把 ${f(M.RIVER.vb, 1)} m/s 当成了垂直河岸的直角边，但它其实是小船在水中的全部速率。</p>` },
  ],
  9: [
    { q: `汽车由静止出发，<i>a</i> = ${f(M.PULL.a0, 1)} − ${f(M.PULL.k, 1)}<i>t</i>（m/s²，<i>t</i> 以 s 计）。<i>t</i> = ${f(T9)} s 时它的速率是多少？`,
      choices: [`${p3(M.PULL.a0 * T9 - M.PULL.k * T9 ** 2)} m/s`, `${p3(M.PULL.a0 * T9)} m/s`, `${p3(V9)} m/s`, `${p3(M.pa(T9))} m/s`], answer: 2,
      why: `<p><i>a</i> 不恒定，所以要积分：</p><div class="eq"><i>v</i>(<i>t</i>) = ∫<sub>0</sub><sup><i>t</i></sup> (${f(M.PULL.a0, 1)} − ${f(M.PULL.k, 1)}<i>t</i>′) d<i>t</i>′ = ${f(M.PULL.a0, 1)}<i>t</i> − ${f(M.PULL.k / 2)}<i>t</i>²</div><div class="eq"><i>v</i>(${f(T9)}) = ${f(M.PULL.a0 * T9, 1)} − ${f(M.PULL.k / 2 * T9 ** 2, 1)} = ${p3(V9)} m/s</div><p>${p3(M.PULL.a0 * T9 - M.PULL.k * T9 ** 2)} m/s 漏掉了对 <i>t</i> 积分产生的 ½；${p3(M.PULL.a0 * T9)} m/s 把 <i>a</i> 当成恒为 ${f(M.PULL.a0, 1)} m/s²。</p>` },
    { q: `同一辆车（<i>a</i> = <i>a</i><sub>0</sub> − <i>kt</i>，减到零后保持为 0；从 <i>x</i> = 0 处由静止出发），证明加速度减为零时它已走过 <i>x</i><sub>1</sub> = <i>a</i><sub>0</sub>³/3<i>k</i>²，并求 <i>t</i> = 5.00 s 时它的位置。`,
      solution: `<p>1. <i>a</i> = 0 发生在 <i>t</i><sub>1</sub> = <i>a</i><sub>0</sub>/<i>k</i> = ${f(M.T1)} s。</p><p>2. <i>v</i> = ∫<sub>0</sub><sup><i>t</i></sup><i>a</i> d<i>t</i>′ = <i>a</i><sub>0</sub><i>t</i> − ½<i>kt</i>²，所以 <i>v</i><sub>1</sub> = <i>a</i><sub>0</sub>²/2<i>k</i> = ${f(M.V1, 1)} m/s。</p><p>3. <i>x</i> = ∫<sub>0</sub><sup><i>t</i></sup><i>v</i> d<i>t</i>′ = ½<i>a</i><sub>0</sub><i>t</i>² − <i>kt</i>³/6。在 <i>t</i><sub>1</sub> 时：</p><div class="eq"><i>x</i><sub>1</sub> = <i>a</i><sub>0</sub>³/2<i>k</i>² − <i>a</i><sub>0</sub>³/6<i>k</i>² = <i>a</i><sub>0</sub>³/3<i>k</i>² = ${f(M.PULL.a0, 1)}³ / (3 × ${f(M.PULL.k, 1)}²) = ${f(M.X1, 1)} m</div><p>4. <i>t</i><sub>1</sub> 之后 <i>a</i> = 0，所以 <i>v</i> 保持 ${f(M.V1, 1)} m/s：</p><div class="eq"><i>x</i>(5.00) = ${f(M.X1, 1)} + ${f(M.V1, 1)} × (5.00 − ${f(M.T1)}) = ${f(M.px(5), 1)} m</div>` },
  ],
  10: [
    { q: `质点按 <i>x</i> = <i>t</i>³ − 3<i>t</i>（m，s）运动。它的速度为零的那一瞬间（<i>t</i> &gt; 0），加速度是多少？`,
      choices: [`${p3(M.ca(M.T_TURN))} m/s²`, '0 m/s²', `${p3(M.cx(M.T_TURN))} m/s²`, `${p3(3 * M.CUBE.A * M.T_TURN)} m/s²`], answer: 0,
      why: `<p><i>v</i> = d<i>x</i>/d<i>t</i> = 3<i>t</i>² − 3，在 <i>t</i> = ${f(M.T_TURN)} s 时为零。<i>a</i> = d<i>v</i>/d<i>t</i> = 6<i>t</i> = ${p3(M.ca(M.T_TURN))} m/s²。</p><p>速度为零并不意味着加速度为零：质点正在掉头，所以它的速度在变化。（${p3(M.cx(M.T_TURN))} 是它在那里的位置，单位 m。）</p>` },
    { q: '质点的加速度 <i>a</i> = 6<i>t</i>（m/s²），<i>v</i>(0) = −3 m/s，<i>x</i>(0) = 0。求 <i>x</i>(<i>t</i>)、它回到 <i>x</i> = 0 的时刻 <i>t</i> &gt; 0，以及此时的速度。',
      solution: `<p>1. 积分一次：<i>v</i> = 3<i>t</i>² + <i>C</i><sub>1</sub>；由 <i>v</i>(0) = −3 得 <i>C</i><sub>1</sub> = −3。</p><p>2. 再积分一次：<i>x</i> = <i>t</i>³ − 3<i>t</i> + <i>C</i><sub>2</sub>；由 <i>x</i>(0) = 0 得 <i>C</i><sub>2</sub> = 0。</p><p>3. <i>x</i> = <i>t</i>(<i>t</i>² − 3) = 0，得 <i>t</i> = √3 = ${f(Math.sqrt(3))} s。</p><div class="eq"><i>v</i>(√3) = 3(3) − 3 = ${f(M.cv(Math.sqrt(3)))} m/s</div><p>它先向左运动到 1 s 时的 <i>x</i> = −2 m，然后向右返回，速率比出发时更大。</p>` },
  ],
};
