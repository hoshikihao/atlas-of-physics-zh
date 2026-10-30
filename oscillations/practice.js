// oscillations/practice.js — AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from the model or from the givens; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const G = M.G, TAU = 2 * Math.PI;
const f = (x, n = 2) => (x < -1e-12 ? '−' : '') + Math.abs(x).toFixed(n);
const sg = (x, n = 2) => (x > 1e-12 ? '+' : '') + f(x, n);

// 1 · Hooke: the block at x = −0.20 m and at +0.25 m
const x1 = -0.20, x1b = 0.25;
// 2 · speed at x = 0.30 m
const x2 = 0.30, v2 = M.W * Math.sqrt(M.A ** 2 - x2 ** 2);
// 3 · energy at x = A/2
const K3 = 0.5 * M.K * (M.A ** 2 - (M.A / 2) ** 2);
// 4 · a 0.50 kg block on the same spring; the 1.0 kg block's spring force at the bottom
const m4 = 0.50, d4 = m4 * G / M.K, Fbot = M.K * (M.D + M.HANG.A);
// 5 · the 1.5 m pendulum on the Moon; its fastest speed
const gMoon = 1.62, Tmoon = TAU * Math.sqrt(M.PEND.L / gMoon), vmax5 = M.vmaxPendulum(M.PEND.L, M.PEND.th0);
// 6 · doubling the period; a pendulum for 3.0 s
const k6 = M.K / 4, T6 = 3.0, L6 = G * (T6 / TAU) ** 2, TL = M.periodPendulum(M.DOUBLE.L);
// 8 · the pushed start (Physics C)
const St = M.STARTS[1], t8 = (Math.PI / 2 - St.phi) / M.W;
// 9 · the rod and the hoop (Physics C)
const R = M.ROD, H = M.HOOP;
// 10 · the torsion pendulum (Physics C)
const Ts = M.TORS, wT = TAU / Ts.T;
// 11 · the car with 300 kg aboard; the swing
const C = M.CAR, m11 = C.m + 300, T11 = M.periodSpring(m11, C.k), Sw = M.SWING;

export const PRACTICE = {
  0: [
    { q: `木块以振幅 <i>A</i> = ${f(M.A)} m 振动。它在一个周期内走过的路程是多少？`,
      choices: ['0 m', `${f(M.A)} m`, `${f(2 * M.A)} m`, `${f(4 * M.A)} m`], answer: 3,
      why: `<p>从 +<i>A</i> 到 −<i>A</i> 是 2<i>A</i>，再回来又是 2<i>A</i>：4<i>A</i> = ${f(4 * M.A)} m。它在一个周期内的<i>位移</i>为 0，因为终点就是起点。</p>` },
    { q: `周期为 ${f(M.T0, 3)} s。频率是多少？`,
      choices: [`${f(M.T0)} Hz`, `${f(M.F0, 3)} Hz`, `${f(M.W)} Hz`, `${f(1 / M.W, 3)} Hz`], answer: 1,
      why: `<div class="eq"><i>f</i> = 1/<i>T</i> = 1/${f(M.T0, 3)} = ${f(M.F0, 3)} Hz</div><p>${f(M.W)} 是以 rad/s 为单位的 ω = 2π<i>f</i>，即角频率，不是每秒的全振动次数。</p>` },
  ],
  1: [
    { q: `取平衡位置右侧为正。木块（<i>k</i> = ${M.K} N/m）位于 <i>x</i> = ${f(x1)} m 处。它受到的弹力是多少？`,
      choices: [`${sg(-M.K * x1)} N`, `${sg(M.K * x1)} N`, `${sg(-M.K / x1, 1)} N`, `${sg(-0.5 * M.K * x1)} N`], answer: 0,
      why: `<div class="eq"><i>F</i><sub>s</sub> = −<i>k</i>Δ<i>x</i> = −${M.K} × (${f(x1)}) = ${sg(-M.K * x1)} N</div><p>弹簧向左被压缩，就向右推，指向平衡位置。${sg(M.K * x1)} N 漏掉了负号。</p>` },
    { q: `${f(M.M1, 1)} kg 木块在 <i>x</i> = ${sg(x1b)} m 处的加速度是多少？`,
      choices: [`${sg(M.K * x1b / M.M1)} m/s²`, `${sg(-M.W * x1b)} m/s²`, `${sg(-M.AMAX)} m/s²`, `${sg(-M.K * x1b / M.M1)} m/s²`], answer: 3,
      why: `<div class="eq"><i>a</i> = −(<i>k</i>/<i>m</i>)<i>x</i> = −(${M.K}/${f(M.M1, 1)}) × ${f(x1b)} = ${sg(-M.K * x1b / M.M1)} m/s²</div><p>加速度不是恒定的：${sg(-M.AMAX)} m/s² 只是 <i>x</i> = +<i>A</i> 处的值。−ω<i>x</i> 忘了把 ω 平方。</p>` },
  ],
  2: [
    { q: '木块位于 <i>x</i> = +<i>A</i> 的瞬间，',
      choices: ['<i>v</i> = 0，<i>a</i> = 0', '<i>v</i> 最大，<i>a</i> = 0', '<i>v</i> = 0，<i>a</i> 最大，指向 −<i>x</i>', '<i>v</i> = 0，<i>a</i> 最大，指向 +<i>x</i>'], answer: 2,
      why: '<p><i>x</i>–<i>t</i> 图像在此处有一个峰：斜率为零，所以 <i>v</i> = 0。而 <i>a</i> = −ω²<i>x</i> 的大小最大，方向指回平衡位置，即 −<i>x</i> 方向。</p>' },
    { q: `<i>A</i> = ${f(M.A)} m，ω = ${f(M.W, 1)} rad/s，木块在 <i>x</i> = ${f(x2)} m 处的速率是多少？`,
      choices: [`${f(M.VMAX)} m/s`, `${f(M.W * x2)} m/s`, `${f(v2)} m/s`, `${f(M.W * (M.A - x2))} m/s`], answer: 2,
      why: `<p>由能量关系，½<i>mv</i>² = ½<i>k</i>(<i>A</i>² − <i>x</i>²)，所以</p><div class="eq"><i>v</i> = ω√(<i>A</i>² − <i>x</i>²) = ${f(M.W, 1)} × √(${f(M.A ** 2)} − ${f(x2 ** 2)}) = ${f(v2)} m/s</div><p>${f(M.VMAX)} m/s 只是 <i>x</i> = 0 处的速率。</p>` },
  ],
  3: [
    { q: `总能量 ½<i>kA</i>² = ${f(M.E)} J。木块在 <i>x</i> = <i>A</i>/2 处的动能是多少？`,
      choices: [`${f(M.E / 2)} J`, `${f(K3)} J`, `${f(M.E - K3)} J`, `${f(M.E)} J`], answer: 1,
      why: `<div class="eq"><i>U</i> = ½<i>k</i>(<i>A</i>/2)² = ¼ × ½<i>kA</i>² = ${f(M.E - K3)} J &nbsp;⇒&nbsp; <i>K</i> = ${f(M.E)} − ${f(M.E - K3)} = ${f(K3)} J</div><p>位于一半振幅处并不意味着能量各占一半：<i>U</i> 随 <i>x</i>² 增大。${f(M.E - K3)} J 是弹性势能那一份。</p>` },
    { q: '振幅加倍后，总能量和最大速率分别变为',
      choices: ['能量 ×2，最大速率 ×2', '能量 ×4，最大速率 ×2', '能量 ×4，最大速率 ×4', '能量 ×2，最大速率 ×√2'], answer: 1,
      why: '<p><i>E</i> = ½<i>kA</i>² 变为 4 倍。<i>v</i><sub>max</sub> = ω<i>A</i>，而 ω = √(<i>k</i>/<i>m</i>) 不变，所以最大速率加倍（动能 4 倍 ⇒ 速率 2 倍）。</p>' },
  ],
  4: [
    { q: `把 ${f(m4)} kg 的木块挂在同一根 ${M.K} N/m 的弹簧下。弹簧伸长多少达到新的平衡位置？`,
      choices: [`${f(m4 / M.K, 4)} m`, `${f(M.D, 3)} m`, `${f(M.K / (m4 * G), 2)} m`, `${f(d4, 3)} m`], answer: 3,
      why: `<div class="eq"><i>kd</i> = <i>mg</i> &nbsp;⇒&nbsp; <i>d</i> = ${f(m4)} × ${f(G)} / ${M.K} = ${f(d4, 3)} m</div><p>质量减半，伸长量也减半（${f(M.D, 3)} m 对应的是 ${f(M.M1, 1)} kg）。${f(m4 / M.K, 4)} m 忘了 <i>g</i>：用的是质量而不是重力；${f(M.K / (m4 * G), 2)} m 把公式颠倒了。</p>` },
    { q: `${f(M.M1, 1)} kg 木块在平衡位置（伸长 ${f(M.D, 3)} m）上下各 ${f(M.HANG.A)} m 的范围内振动。在最低点，弹簧对它的作用力是多少？`,
      choices: [`${f(M.WEIGHT)} N`, `${f(Fbot)} N`, `${f(M.K * M.HANG.A)} N`, `${f(M.K * (M.D - M.HANG.A))} N`], answer: 1,
      why: `<p>在最低点，弹簧伸长 <i>d</i> + <i>A</i> = ${f(M.D + M.HANG.A, 4)} m：</p><div class="eq"><i>F</i><sub>s</sub> = <i>k</i>(<i>d</i> + <i>A</i>) = ${M.K} × ${f(M.D + M.HANG.A, 4)} = ${f(Fbot)} N</div><p>比重力大 ${f(M.K * M.HANG.A)} N：合力为向上的 ${f(M.K * M.HANG.A)} N，指回平衡位置。${f(M.K * (M.D - M.HANG.A))} N 是最高点处的弹力。</p>` },
  ],
  5: [
    { q: `把 ${f(M.PEND.L, 1)} m 长的单摆（在地球上周期为 ${f(M.P_T)} s）带到月球上，那里 <i>g</i> = ${f(gMoon)} m/s²。它在月球上的周期是多少？`,
      choices: [`${f(Tmoon)} s`, `${f(M.P_T)} s`, `${f(M.P_T * G / gMoon, 1)} s`, `${f(M.P_T * Math.sqrt(gMoon / G), 3)} s`], answer: 0,
      why: `<div class="eq"><i>T</i> = 2π√(<i>L</i>/<i>g</i>) = 2π√(${f(M.PEND.L, 1)}/${f(gMoon)}) = ${f(Tmoon)} s</div><p>重力变弱，摆动变慢，但只慢了 √(${f(G)}/${f(gMoon)}) = ${f(Math.sqrt(G / gMoon))} 倍，而不是整个比值 ${f(G)}/${f(gMoon)} = ${f(G / gMoon)}，后者会得到 ${f(M.P_T * G / gMoon, 1)} s。</p>` },
    { q: `同一单摆从 ${(M.PEND.th0 / M.DEG).toFixed(0)}° 处由静止释放。摆球在最低点的速率是多少？`,
      choices: [`${f(Math.sqrt(2 * G * M.PEND.L * Math.sin(M.PEND.th0)))} m/s`, `${f(Math.sqrt(2 * G * M.PEND.L))} m/s`, `${f(Math.sqrt(G * M.PEND.L * (1 - Math.cos(M.PEND.th0))), 3)} m/s`, `${f(vmax5, 3)} m/s`], answer: 3,
      why: `<p>它下降的高度 Δ<i>y</i> = <i>L</i>(1 − cos θ<sub>0</sub>) = ${f(M.PEND.L * (1 - Math.cos(M.PEND.th0)) * 100, 2)} cm。</p><div class="eq"><i>v</i> = √(2<i>g</i>Δ<i>y</i>) = ${f(vmax5, 3)} m/s</div><p>√(2<i>gL</i>) 要求下降整个摆长的高度；sin θ<sub>0</sub> 给出的是水平距离，不是高度。</p>` },
  ],
  6: [
    { q: `${f(M.DOUBLE.m, 1)} kg 木块挂在 ${M.K} N/m 的弹簧上，周期为 ${f(M.periodSpring(M.DOUBLE.m, M.K))} s。劲度系数为多少时周期加倍？`,
      choices: [`${f(M.K / 2, 1)} N/m`, `${f(2 * M.K, 1)} N/m`, `${f(k6, 1)} N/m`, `${f(4 * M.K, 1)} N/m`], answer: 2,
      why: `<p><i>T</i> ∝ 1/√<i>k</i>。要得到 2<i>T</i>，√(<i>k</i><sub>new</sub>) 必须是 √<i>k</i> 的一半，所以 <i>k</i><sub>new</sub> = <i>k</i>/4 = ${f(k6, 1)} N/m。把 <i>k</i> 减半只能让周期变为 √2 倍；更硬的弹簧会让周期变短。</p>` },
    { q: `${f(M.DOUBLE.L)} m 长的单摆周期为 ${f(TL)} s。要使周期为 ${f(T6, 1)} s，摆长应为多少？`,
      choices: [`${f(M.DOUBLE.L * T6 / TL)} m`, `${f(G * T6 / TAU)} m`, `${f(G * T6 ** 2 / 4, 1)} m`, `${f(L6)} m`], answer: 3,
      why: `<div class="eq"><i>L</i> = <i>g</i>(<i>T</i>/2π)² = ${f(G)} × (${f(T6, 1)}/2π)² = ${f(L6)} m</div><p>也可以用比例：<i>L</i> ∝ <i>T</i>²，所以 ${f(M.DOUBLE.L)} × (${f(T6, 1)}/${f(TL)})² = ${f(L6)} m。直接按时间之比缩放 <i>L</i> 会得到 ${f(M.DOUBLE.L * T6 / TL)} m。</p>` },
  ],
  7: [
    { q: '水平弹簧上的木块释放前被拉开的距离加倍。与原来相比，它的周期和最大速率',
      choices: ['周期不变，最大速率加倍', '周期加倍，最大速率不变', '都不变', '周期 ×√2，最大速率加倍'], answer: 0,
      why: '<p><i>T</i> = 2π√(<i>m</i>/<i>k</i>) 中没有 <i>A</i>。距离加倍，力加倍，加速度也加倍：它在相同时间内走过两倍的距离，所以 <i>v</i><sub>max</sub> = ω<i>A</i> 加倍。</p>' },
    { q: '下列哪种改变会改变单摆钟的周期？',
      choices: ['换一个重四倍的摆球', '摆角从 8° 改为 4°', '把它搬到月球上', '推一下再让它摆，而不是从静止释放'], answer: 2,
      why: '<p><i>T</i> = 2π√(<i>L</i>/<i>g</i>) 只取决于 <i>L</i> 和 <i>g</i>。质量会约掉（<i>ma</i> = −<i>mg</i> sin θ），小振幅下周期都相同，而推一下只改变振幅。</p>' },
  ],
  8: [
    { q: `${f(M.M1, 1)} kg 木块挂在 ${M.K} N/m 的弹簧上，从 <i>x</i><sub>0</sub> = ${f(St.x0)} m 处以 <i>v</i><sub>0</sub> = ${f(St.v0, 1)} m/s 开始运动。它的振幅是多少？`,
      choices: [`${f(St.A, 3)} m`, `${f(St.x0, 3)} m`, `${f(St.x0 + Math.abs(St.v0) / M.W, 3)} m`, `${f(Math.hypot(St.x0, St.v0), 3)} m`], answer: 0,
      why: `<p>ω = √(<i>k</i>/<i>m</i>) = ${f(M.W, 1)} rad/s。由能量关系，½<i>kA</i>² = ½<i>kx</i><sub>0</sub>² + ½<i>mv</i><sub>0</sub>²：</p><div class="eq"><i>A</i> = √(<i>x</i><sub>0</sub>² + (<i>v</i><sub>0</sub>/ω)²) = √(${f(St.x0)}² + ${f(Math.abs(St.v0) / M.W)}²) = ${f(St.A, 3)} m</div><p>推一下增加了能量，所以 <i>A</i> &gt; <i>x</i><sub>0</sub>。两部分按平方相加，不能直接相加；√(<i>x</i><sub>0</sub>² + <i>v</i><sub>0</sub>²) 把米和米每秒混在了一起。</p>` },
    { q: `解答题。证明 <i>x</i> = <i>A</i> cos(ω<i>t</i> + φ) 是 <i>m</i> d²<i>x</i>/d<i>t</i>² = −<i>kx</i> 的解。对上题中被推出的木块，求 φ 以及它第一次经过 <i>x</i> = 0 的时刻。`,
      solution: `<p>求两次导数：d<i>x</i>/d<i>t</i> = −<i>A</i>ω sin(ω<i>t</i> + φ)，d²<i>x</i>/d<i>t</i>² = −<i>A</i>ω² cos(ω<i>t</i> + φ) = −ω²<i>x</i>。只要 ω = √(<i>k</i>/<i>m</i>) = ${f(M.W, 1)} rad/s，它对任意 <i>t</i> 都等于 −(<i>k</i>/<i>m</i>)<i>x</i>。</p><p><i>t</i> = 0 时：<i>A</i> cos φ = ${f(St.x0)} m，−<i>A</i>ω sin φ = ${f(St.v0, 1)} m/s，所以 tan φ = −<i>v</i><sub>0</sub>/ω<i>x</i><sub>0</sub> = ${f(-St.v0 / (M.W * St.x0), 3)}，且 cos φ &gt; 0：</p><div class="eq">φ = ${f(St.phi / M.DEG, 1)}° = ${f(St.phi, 3)} rad，&nbsp; <i>A</i> = ${f(St.A, 3)} m</div><p>当 ω<i>t</i> + φ = π/2 时，它第一次到达 <i>x</i> = 0：</p><div class="eq"><i>t</i> = (π/2 − φ)/ω = (${f(Math.PI / 2, 3)} − ${f(St.phi, 3)})/${f(M.W, 1)} = ${f(t8, 3)} s</div><p>比四分之一周期（${f(M.T0 / 4, 3)} s）短，因为它起始位置离平衡位置更近，而且一开始就在向平衡位置运动。</p>` },
  ],
  9: [
    { q: `一根长 ${f(R.L, 1)} m 的均匀杆绕一端摆动。小摆角时它的周期是多少？`,
      choices: [`${f(M.periodPendulum(R.L))} s`, `${f(M.periodPendulum(R.L / 2))} s`, `${f(R.T)} s`, `${f(M.periodPhysical(R.m, R.d, R.Icm))} s`], answer: 2,
      why: `<p>对端点的 <i>I</i> = <i>I</i><sub>cm</sub> + <i>m</i>(<i>L</i>/2)² = <i>mL</i>²/12 + <i>mL</i>²/4 = <i>mL</i>²/3，且 <i>d</i> = <i>L</i>/2：</p><div class="eq"><i>T</i> = 2π√(<i>I</i>/<i>mgd</i>) = 2π√(2<i>L</i>/3<i>g</i>) = ${f(R.T)} s</div><p>${f(M.periodPendulum(R.L / 2))} s 把它当成位于质心处的摆球；${f(M.periodPhysical(R.m, R.d, R.Icm))} s 用的是 <i>I</i><sub>cm</sub>，而不是对转轴的 <i>I</i>。</p>` },
    { q: `解答题。半径 <i>R</i> = ${f(H.R)} m 的细圆环边缘挂在钉子上。求它对钉子的转动惯量，写出它在自身平面内小角度摆动的运动方程，并求周期。`,
      solution: `<p>对圆心而言，圆环上每一部分到圆心的距离都是 <i>R</i>：<i>I</i><sub>cm</sub> = ∫<i>R</i>² d<i>m</i> = <i>mR</i>²。钉子到圆心的距离 <i>d</i> = <i>R</i>，由平行轴定理 <i>I</i> = <i>mR</i>² + <i>mR</i>² = 2<i>mR</i>²。</p><p>重力作用在圆心：τ = −<i>mgR</i> sin θ ≈ −<i>mgR</i>θ。由 τ = <i>I</i>α：</p><div class="eq">d²θ/d<i>t</i>² = −(<i>mgR</i>/2<i>mR</i>²)θ = −(<i>g</i>/2<i>R</i>)θ</div><p>这是简谐运动，ω = √(<i>g</i>/2<i>R</i>)，与质量无关：</p><div class="eq"><i>T</i> = 2π√(2<i>R</i>/<i>g</i>) = 2π√(${f(2 * H.R)}/${f(G)}) = ${f(H.T)} s</div><p>与摆长等于圆环直径（${f(2 * H.R)} m）的单摆相同。</p>` },
  ],
  10: [
    { q: `金属丝上 ${f(Ts.M, 1)} kg 圆盘的周期为 ${f(Ts.T)} s。换成质量相同、半径加倍的圆盘，新的周期是多少？`,
      choices: [`${f(Ts.T)} s`, `${f(Ts.T * Math.SQRT2)} s`, `${f(2 * Ts.T)} s`, `${f(4 * Ts.T, 1)} s`], answer: 2,
      why: `<p>半径加倍，<i>I</i> = ½<i>MR</i>² 变为 4 倍，<i>T</i> = 2π√(<i>I</i>/κ) 变为 √4 = 2 倍：${f(2 * Ts.T)} s。金属丝相同，κ 也相同。</p>` },
    { q: `解答题。圆盘（<i>I</i> = ${f(Ts.I, 3)} kg·m²，κ = ${Ts.kappa} N·m/rad）被扭转 ${(Ts.th0 / M.DEG).toFixed(0)}° 后由静止释放。写出 θ(<i>t</i>)，并求最大力矩和最大角速率。`,
      solution: `<p><i>I</i> d²θ/d<i>t</i>² = −κθ，所以 θ = θ<sub>0</sub> cos(ω<i>t</i>)，其中 ω = √(κ/<i>I</i>) = √(${Ts.kappa}/${f(Ts.I, 3)}) = ${f(wT, 3)} rad/s，θ<sub>0</sub> = ${(Ts.th0 / M.DEG).toFixed(0)}° = ${f(Ts.th0, 3)} rad（由静止释放，所以 φ = 0）。不需要小角度近似：τ = −κθ 在任意扭转角下都成立。</p><div class="eq">|τ|<sub>max</sub> = κθ<sub>0</sub> = ${Ts.kappa} × ${f(Ts.th0, 3)} = ${f(Ts.kappa * Ts.th0, 3)} N·m &nbsp;（在两端）</div><div class="eq">|dθ/d<i>t</i>|<sub>max</sub> = θ<sub>0</sub>ω = ${f(Ts.th0, 3)} × ${f(wT, 3)} = ${f(Ts.th0 * wT, 2)} rad/s &nbsp;（经过 θ = 0 时）</div><p>θ 必须用弧度：力矩公式和 ω 都以此为前提。</p>` },
  ],
  11: [
    { q: `${C.m} kg 的汽车在弹簧上以 ${f(C.T, 3)} s 的周期弹跳（减震器关闭）。总共 300 kg 的乘客上车后，新的周期是多少？`,
      choices: [`${f(C.T, 3)} s`, `${f(C.T * m11 / C.m, 3)} s`, `${f(C.T * Math.sqrt(C.m / m11), 3)} s`, `${f(T11, 3)} s`], answer: 3,
      why: `<div class="eq"><i>T</i> = 2π√(<i>m</i>/<i>k</i>) = 2π√(${m11}/${C.k}) = ${f(T11, 3)} s</div><p>车变重，弹跳变慢，但只慢了 √(${m11}/${C.m}) = ${f(Math.sqrt(m11 / C.m), 3)} 倍，而不是按质量之比。</p>` },
    { q: `孩子坐在 ${f(Sw.L, 1)} m 长的秋千上，要每摆一次（每个完整周期）推一下，两次推之间应等多久？`,
      choices: [`${f(Sw.T / 2)} s`, `${f(Sw.T)} s`, `${f(TAU * Math.sqrt(G / Sw.L), 1)} s`, `${f(Math.sqrt(Sw.L / G), 3)} s`], answer: 1,
      why: `<div class="eq"><i>T</i> = 2π√(<i>L</i>/<i>g</i>) = 2π√(${f(Sw.L, 1)}/${f(G)}) = ${f(Sw.T)} s</div><p>每个完整周期，孩子回到你手边一次。半个周期 ${f(Sw.T / 2)} s 时，孩子在另一端。孩子的质量和（小）振幅都无关紧要。</p>` },
  ],
};
