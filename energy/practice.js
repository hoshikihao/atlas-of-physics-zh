// energy/practice.js — AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from the model or from the givens; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const G = M.G, D2R = Math.PI / 180;
const f = (x, n = 2) => (x < -1e-12 ? '−' : '') + Math.abs(x).toFixed(n);

// 0 · work: the page's pull, 20 N at 30°, over 3.0 m
const P = M.PULL, d0 = 3.0, W0 = P.F * d0 * Math.cos(P.th);
// 1 · the toss
const T = M.TOSS, Wup = -0.5 * T.m * T.v0 ** 2;
// 2 · the whirl, half a lap
const Wh = M.WHIRL, halfArc = Math.PI * Wh.r;
// 3 · the car over 12 m from rest
const C = M.CAR, d3 = 12, v3 = Math.sqrt(2 * C.F * d3 / C.m);
// 4 · the drop, zero on the 1.0 m tabletop; speed 1.0 m above the ground
const Dr = M.DROP, y4 = 1.0, U4 = Dr.m * G * (Dr.h - Dr.ref2), v4 = Math.sqrt(2 * G * (Dr.h - y4));
// 5 · the spring, compression when the block has slowed to 1.0 m/s
const S = M.SPRING, v5 = 1.0, x5 = Math.sqrt(S.m * (S.v0 ** 2 - v5 ** 2) / S.k);
// 6 · the changing push (Physics C)
const Pu = M.PUSH, v6 = Math.sqrt(2 * Pu.W / Pu.m), Whalf = Pu.F0 * Pu.L * 13 / 24;
// 7 · the pendulum at 20°
const Pd = M.PEND, th7 = 20 * D2R, v7 = Math.sqrt(2 * G * Pd.L * (Math.cos(th7) - Math.cos(Pd.th0)));
const vb = Math.sqrt(2 * G * Pd.L * (1 - Math.cos(Pd.th0))), Tb = Pd.m * G + Pd.m * vb ** 2 / Pd.L;
// 8 · U(x) = 3x² − 2x³ (Physics C)
const U8 = x => 3 * x * x - 2 * x ** 3, F8 = x => -(6 * x - 6 * x * x), x8 = 2.0;
// 9 · the bond (Physics C)
const B = M.BOND, kB = 72 * B.eps / B.r0 ** 2, TB = 2 * Math.PI * Math.sqrt(B.m / kB);
// 10 · the slide, from 8.0 m/s; heat after 1.0 m from 4.0 m/s
const Sl = M.SLIDE, v10 = 8.0, d10 = v10 ** 2 / (2 * Sl.mu * G), x10 = 1.0, Q10 = Sl.mu * Sl.m * G * x10;
// 11 · a student on the stairs
const m11 = 70, h11 = 3.0, t11 = 4.2, P11 = m11 * G * h11 / t11;

export const PRACTICE = {
  0: [
    { q: `绳以与水平成 ${P.deg}° 的 ${f(P.F, 0)} N 拉力拉着 ${f(P.m, 1)} kg 的箱子，在光滑地板上滑动 ${f(d0, 1)} m。绳做了多少功？`,
      choices: [`${f(P.F * d0 * Math.sin(P.th), 1)} J`, `${f(P.F * d0, 1)} J`, `${f(W0, 1)} J`, `${f(P.F * d0 / Math.cos(P.th), 1)} J`], answer: 2,
      why: `<p>只有沿位移方向的分量做功：</p><div class="eq"><i>W</i> = <i>F</i>Δ<i>x</i> cos θ = ${f(P.F, 0)} × ${f(d0, 1)} × cos ${P.deg}° = ${f(W0, 1)} J</div><p>${f(P.F * d0 * Math.sin(P.th), 1)} J 用了 sin θ，即垂直于运动方向的分量；${f(P.F * d0, 1)} J 忽略了夹角。</p>` },
    { q: '在同一次拉动中，地板的支持力对箱子做了多少功？',
      choices: ['负功，因为支持力小于 <i>mg</i>', '零，因为它与位移垂直', '正功，因为它向上', '与绳做的功大小相等、符号相反'], answer: 1,
      why: '<p>支持力竖直，箱子水平运动：θ = 90°，cos 90° = 0，所以 <i>W</i> = 0。它的大小（因为绳向上提了一点而小于 <i>mg</i>）无关紧要。</p>' },
  ],
  1: [
    { q: `${f(T.m)} kg 的小球以 ${f(T.v0, 1)} m/s 竖直向上离手。从手到最高点，重力对它做了多少功？`,
      choices: [`${f(-Wup)} J`, `${f(0)} J`, `${f(2 * Wup)} J`, `${f(Wup)} J`], answer: 3,
      why: `<p>重力与运动方向相反（θ = 180°），所以做负功；由动能定理，它带走了全部动能：</p><div class="eq"><i>W</i><sub>g</sub> = Δ<i>K</i> = 0 − ½ × ${f(T.m)} × ${f(T.v0, 1)}² = ${f(Wup)} J</div><p>${f(2 * Wup)} J 漏掉了 ½；+${f(-Wup)} J 符号错了。</p>` },
    { q: '在整个过程中，从离手到回到同一高度，重力对小球做的总功',
      choices: ['为正', '为负', '为零', '等于 <i>mgh</i>，<i>h</i> 为最大高度'], answer: 2,
      why: '<p>上升时做负功，下落时做等量的正功：总功为零。这就是小球（不计空气阻力）以抛出时的速率回到手中的原因。</p>' },
  ],
  2: [
    { q: `绳对做圆周运动的小球的拉力为 ${f(Wh.T, 1)} N，圆的半径为 ${f(Wh.r, 1)} m。转半圈的过程中，拉力做了多少功？`,
      choices: [`${f(Wh.T * halfArc, 1)} J`, `${f(Wh.T * 2 * Wh.r, 1)} J`, `${f(-Wh.T * halfArc, 1)} J`, '0 J'], answer: 3,
      why: `<p>每一时刻，拉力指向圆心，速度沿圆周：两者成 90°，所以每一小步的贡献都是 <i>T</i> d<i>s</i> cos 90° = 0。总功为 0 J，速率始终不变。</p><p>${f(Wh.T * halfArc, 1)} J 把力和弧长当作平行直接相乘；${f(Wh.T * 2 * Wh.r, 1)} J 用了直径即净位移，而它在每一时刻也并不沿力的方向。</p>` },
    { q: '现在用同一根绳让小球以两倍的速率转动。拉力和小球的动能分别变为原来的几倍？',
      choices: ['拉力 ×2，动能 ×4', '拉力 ×4，动能 ×4', '拉力 ×4，动能 ×2', '拉力 ×2，动能 ×2'], answer: 1,
      why: '<p><i>T</i> = <i>mv</i>²/<i>r</i> 和 <i>K</i> = ½<i>mv</i>² 都与 <i>v</i>² 成正比，所以都变为 4 倍。拉力仍然不做功：增加的 <i>K</i> 来自让小球加速的那个力。</p>' },
  ],
  3: [
    { q: `${f(C.F / 1000, 1)} kN 的合力推动 ${C.m} kg 的汽车由静止前进 ${d3} m。此时它的速率是多少？`,
      choices: [`${f(Math.sqrt(C.F * d3 / C.m))} m/s`, `${f(v3)} m/s`, `${f(C.F * d3 / C.m, 1)} m/s`, `${f(2 * C.F * d3 / C.m, 1)} m/s`], answer: 1,
      why: `<div class="eq"><i>W</i><sub>net</sub> = <i>F</i>Δ<i>x</i> = ${f(C.F * d3 / 1000, 1)} kJ = ½<i>mv</i>² &nbsp;⇒&nbsp; <i>v</i> = √(2 × ${f(C.F * d3, 0)} / ${C.m}) = ${f(v3)} m/s</div><p>${f(Math.sqrt(C.F * d3 / C.m))} m/s 漏掉了 ½；另外两个忘了开平方。</p>` },
    { q: '同样的合力先使汽车由静止加速到 <i>v</i>，再从 <i>v</i> 加速到 2<i>v</i>。第二阶段合力做的功是第一阶段的几倍？',
      choices: ['1', '2', '4', '3'], answer: 3,
      why: '<p>从 0 到 <i>v</i>，Δ<i>K</i> 为 ½<i>mv</i>²。从 <i>v</i> 到 2<i>v</i>，为 ½<i>m</i>(4<i>v</i>² − <i>v</i>²) = 3 × ½<i>mv</i>²。动能随 <i>v</i>² 增长，所以速率每增加相同的量，需要的功（和距离）越来越多。</p>' },
  ],
  4: [
    { q: `取离地 ${f(Dr.ref2, 1)} m 的桌面处 <i>U</i><sub>g</sub> = 0。把 ${f(Dr.m)} kg 的小球举在离地 ${f(Dr.h, 1)} m 处，它的 <i>U</i><sub>g</sub> 是多少？`,
      choices: [`${f(Dr.m * G * Dr.h)} J`, `${f(Dr.m * G * Dr.ref2)} J`, `${f(U4)} J`, `${f(Dr.m * G * (Dr.h + Dr.ref2))} J`], answer: 2,
      why: `<p>Δ<i>y</i> 从选定的零点量起：${f(Dr.h, 1)} − ${f(Dr.ref2, 1)} = ${f(Dr.h - Dr.ref2, 1)} m。</p><div class="eq"><i>U</i><sub>g</sub> = <i>mg</i>Δ<i>y</i> = ${f(Dr.m)} × ${f(G)} × ${f(Dr.h - Dr.ref2, 1)} = ${f(U4)} J</div><p>${f(Dr.m * G * Dr.h)} J 只在以地面为零点时才对。</p>` },
    { q: `小球从 ${f(Dr.h, 1)} m 高处释放。它离地 ${f(y4, 1)} m 时速率多大？`,
      choices: [`${f(Math.sqrt(2 * G * y4))} m/s`, `${f(Math.sqrt(2 * G * Dr.h))} m/s`, `${f(2 * G * (Dr.h - y4), 1)} m/s`, `${f(v4)} m/s`], answer: 3,
      why: `<p>它已下落 ${f(Dr.h - y4, 1)} m，减少的 <i>U</i><sub>g</sub> 变成了 <i>K</i>：</p><div class="eq"><i>mg</i>Δ<i>y</i> = ½<i>mv</i>² &nbsp;⇒&nbsp; <i>v</i> = √(2 × ${f(G)} × ${f(Dr.h - y4, 1)}) = ${f(v4)} m/s</div><p>${f(Math.sqrt(2 * G * y4))} m/s 用了离地高度，而不是下落的距离。</p>` },
  ],
  5: [
    { q: `${f(S.m, 1)} kg 的木块以 ${f(S.v0, 1)} m/s 撞上劲度系数 ${S.k} N/m 的弹簧。木块减速到 ${f(v5, 1)} m/s 时，弹簧被压缩了多少？`,
      choices: [`${f(x5, 3)} m`, `${f(S.xmax / 2, 3)} m`, `${f(S.m * (S.v0 ** 2 - v5 ** 2) / S.k, 3)} m`, `${f(Math.sqrt(S.m * (S.v0 ** 2 - v5 ** 2) / (2 * S.k)), 3)} m`], answer: 0,
      why: `<div class="eq">½<i>mv</i><sub>0</sub>² = ½<i>mv</i>² + ½<i>k</i>Δ<i>x</i>² &nbsp;⇒&nbsp; Δ<i>x</i> = √(<i>m</i>(<i>v</i><sub>0</sub>² − <i>v</i>²)/<i>k</i>) = √(${f(S.m, 1)} × ${f(S.v0 ** 2 - v5 ** 2, 1)} / ${S.k}) = ${f(x5, 3)} m</div><p>速率减半不等于压缩量减半：此时四分之三的动能已经储存起来，所以 Δ<i>x</i> 是 ${f(S.xmax)} m 的 √¾ 倍。</p>` },
    { q: '如果木块撞上来时的速率加倍，弹簧的最大压缩量会',
      choices: ['不变', '变为原来的 √2 倍', '变为原来的两倍', '变为原来的四倍'], answer: 2,
      why: '<p>½<i>kx</i><sub>max</sub>² = ½<i>mv</i><sub>0</sub>²，所以 <i>x</i><sub>max</sub> = <i>v</i><sub>0</sub>√(<i>m</i>/<i>k</i>)：与 <i>v</i><sub>0</sub> 成正比。能量变为四倍，但能量与 <i>x</i>² 成正比，所以压缩量变为两倍。</p>' },
  ],
  6: [
    { q: `推力 <i>F</i>(<i>x</i>) = <i>F</i><sub>0</sub>(1 − <i>x</i>/<i>L</i>)(1 + 2<i>x</i>/<i>L</i>)，<i>F</i><sub>0</sub> = ${Pu.F0} N，<i>L</i> = ${f(Pu.L, 1)} m，作用在由静止开始的 ${f(Pu.m, 1)} kg 板条箱上。它在 <i>x</i> = <i>L</i> 处的速率是多少？`,
      choices: [`${f(Math.sqrt(2 * Pu.F0 * Pu.L / Pu.m))} m/s`, `${f(Math.sqrt(Pu.W / Pu.m))} m/s`, `${f(Math.sqrt(2 * (Pu.F0 / 2) * Pu.L / Pu.m))} m/s`, `${f(v6)} m/s`], answer: 3,
      why: `<p>展开后积分：</p><div class="eq"><i>W</i> = ∫<sub>0</sub><sup><i>L</i></sup> <i>F</i><sub>0</sub>(1 + <i>x</i>/<i>L</i> − 2<i>x</i>²/<i>L</i>²) d<i>x</i> = <i>F</i><sub>0</sub><i>L</i>(1 + ½ − ⅔) = ⅚<i>F</i><sub>0</sub><i>L</i> = ${f(Pu.W, 1)} J</div><div class="eq"><i>v</i> = √(2<i>W</i>/<i>m</i>) = √(2 × ${f(Pu.W, 1)} / ${f(Pu.m, 1)}) = ${f(v6)} m/s</div><p>${f(Math.sqrt(2 * Pu.F0 * Pu.L / Pu.m))} m/s 把推力当成恒为 ${Pu.F0} N；${f(Math.sqrt(2 * (Pu.F0 / 2) * Pu.L / Pu.m))} m/s 只对两端的值取平均，漏掉了中间鼓起的部分。</p>` },
    { q: `解答题。求同一推力在前一半范围内，即从 <i>x</i> = 0 到 <i>x</i> = <i>L</i>/2 所做的功。它比总功 ${f(Pu.W, 1)} J 的一半多还是少？为什么？`,
      solution: `<p>展开：<i>F</i> = <i>F</i><sub>0</sub>(1 + <i>x</i>/<i>L</i> − 2<i>x</i>²/<i>L</i>²)。逐项积分：</p><div class="eq"><i>W</i> = <i>F</i><sub>0</sub>[<i>x</i> + <i>x</i>²/2<i>L</i> − 2<i>x</i>³/3<i>L</i>²]<sub>0</sub><sup><i>L</i>/2</sup> = <i>F</i><sub>0</sub><i>L</i>(½ + ⅛ − 1/12) = (13/24)<i>F</i><sub>0</sub><i>L</i></div><div class="eq"><i>W</i> = (13/24) × ${Pu.F0} × ${f(Pu.L, 1)} = ${f(Whalf, 1)} J</div><p>比 ${f(Pu.W, 1)} J 的一半多：推力在 <i>x</i> = <i>L</i>/4 处达到最大，所以 <i>F</i>(<i>x</i>) 下的面积集中在前一半，后一半只剩逐渐减弱的尾巴。</p>` },
  ],
  7: [
    { q: `${f(Pd.L, 1)} m 长的绳上挂着 ${f(Pd.m, 1)} kg 的摆球，从 ${Pd.deg0}° 处由静止释放。绳与竖直方向成 20° 时，摆球的速率是多少？`,
      choices: [`${f(v7)} m/s`, `${f(Math.sqrt(2 * G * Pd.L * (1 - Math.cos(th7))))} m/s`, `${f(vb)} m/s`, `${f(vb / Math.SQRT2)} m/s`], answer: 0,
      why: `<p>只看两个角度之间的高度差：Δ<i>y</i> = <i>L</i>(cos 20° − cos ${Pd.deg0}°) = ${f(Pd.L * (Math.cos(th7) - Math.cos(Pd.th0)), 3)} m。</p><div class="eq"><i>v</i> = √(2<i>g</i>Δ<i>y</i>) = √(2 × ${f(G)} × ${f(Pd.L * (Math.cos(th7) - Math.cos(Pd.th0)), 3)}) = ${f(v7)} m/s</div><p>${f(Math.sqrt(2 * G * Pd.L * (1 - Math.cos(th7))))} m/s 用的是 20° 处相对最低点的高度，而不是从 ${Pd.deg0}° 下降的高度。角度减半并不意味着能量减半。</p>` },
    { q: '摆球经过最低点时，绳的拉力是多少？',
      choices: [`${f(Pd.m * G * Math.cos(Pd.th0))} N`, `${f(Pd.m * G)} N`, `${f(Tb)} N`, `${f(Pd.m * G - Pd.m * vb ** 2 / Pd.L)} N`], answer: 2,
      why: `<p>在最低点，摆球以 <i>v</i> = ${f(vb)} m/s 做圆周运动，所以合力向上、指向悬点：</p><div class="eq"><i>T</i> − <i>mg</i> = <i>mv</i>²/<i>L</i> &nbsp;⇒&nbsp; <i>T</i> = ${f(Pd.m * G)} + ${f(Pd.m * vb ** 2 / Pd.L)} = ${f(Tb)} N</div><p>只有摆球在那里静止时，<i>T</i> = <i>mg</i> 才对。</p>` },
  ],
  8: [
    { q: '粒子沿 <i>x</i> 轴运动，势能 <i>U</i>(<i>x</i>) = 3<i>x</i>² − 2<i>x</i>³（<i>U</i> 以 J 计，<i>x</i> 以 m 计）。它在 <i>x</i> = 2.0 m 处受到的力是多少？',
      choices: [`${f(-U8(x8), 1)} N`, `${f(-F8(x8), 1)} N`, `${f(U8(x8), 1)} N`, `+${f(F8(x8), 1)} N`], answer: 3,
      why: `<div class="eq"><i>F</i><sub>x</sub> = −d<i>U</i>/d<i>x</i> = −(6<i>x</i> − 6<i>x</i>²) = −(12 − 24) = +${f(F8(x8), 1)} N</div><p>该处 <i>U</i> 的斜率为负（<i>U</i> 沿 +<i>x</i> 方向减小），所以力指向 +<i>x</i>：指向“下坡”。−${f(F8(x8), 1)} N 漏掉了负号；±${f(-U8(x8), 1)} N 用的是 <i>U</i> 本身而不是它的斜率。</p>` },
    { q: '对于同一个 <i>U</i>(<i>x</i>) = 3<i>x</i>² − 2<i>x</i>³，粒子可以在 <i>x</i> = 0 和 <i>x</i> = 1 m 处平衡。它们各是哪种平衡？',
      choices: ['都是稳定平衡', '<i>x</i> = 0 不稳定，<i>x</i> = 1 m 稳定', '<i>x</i> = 0 稳定，<i>x</i> = 1 m 不稳定', '都是不稳定平衡'], answer: 2,
      why: '<p>d<i>U</i>/d<i>x</i> = 6<i>x</i> − 6<i>x</i>² 在 <i>x</i> = 0 和 1 处为零。由二阶导数判断：<i>U</i>″ = 6 − 12<i>x</i> 在 <i>x</i> = 0 处为 +6（谷底，稳定），在 <i>x</i> = 1 m 处为 −6（驼峰，不稳定）。</p>' },
  ],
  9: [
    { q: `解答题。对于这个化学键，<i>U</i>(<i>r</i>) = ε[(<i>r</i><sub>0</sub>/<i>r</i>)¹² − 2(<i>r</i><sub>0</sub>/<i>r</i>)⁶]，ε = ${f(B.eps / M.EV, 1)} eV，<i>r</i><sub>0</sub> = ${f(B.r0 * 1e9)} nm。证明 <i>r</i><sub>0</sub> 是平衡位置，求劲度系数 <i>k</i> = <i>U</i>″(<i>r</i><sub>0</sub>)，以及 ${f(B.m / M.AMU, 1)} u 原子小振动的周期。`,
      solution: `<p>求导：</p><div class="eq"><i>U</i>′ = ε[−12<i>r</i><sub>0</sub>¹²/<i>r</i>¹³ + 12<i>r</i><sub>0</sub>⁶/<i>r</i>⁷]</div><p>在 <i>r</i> = <i>r</i><sub>0</sub> 处，括号内为 −12/<i>r</i><sub>0</sub> + 12/<i>r</i><sub>0</sub> = 0：不受力，处于平衡。</p><div class="eq"><i>U</i>″ = ε[156<i>r</i><sub>0</sub>¹²/<i>r</i>¹⁴ − 84<i>r</i><sub>0</sub>⁶/<i>r</i>⁸] &nbsp;⇒&nbsp; <i>U</i>″(<i>r</i><sub>0</sub>) = 72ε/<i>r</i><sub>0</sub>²</div><p>为正，所以是稳定的极小值。代入 ε = ${B.eps.toExponential(3).replace('e-', '×10<sup>−')}</sup> J，<i>r</i><sub>0</sub> = ${f(B.r0 * 1e9)}×10<sup>−9</sup> m：</p><div class="eq"><i>k</i> = 72 × ${f(B.eps * 1e19, 3)}×10<sup>−19</sup> / (${f(B.r0 * 1e9)}×10<sup>−9</sup>)² = ${f(kB, 0)} N/m</div><div class="eq"><i>T</i> = 2π√(<i>m</i>/<i>k</i>) = 2π√(${f(B.m * 1e27, 3)}×10<sup>−27</sup> / ${f(kB, 0)}) = ${f(TB * 1e15, 1)} fs</div>` },
    { q: '势阱中的粒子总能量 <i>E</i> 低于阱沿。在任一转折点，',
      choices: ['它的速率为零，受力也为零', '它的速率最大，受力为零', '它的势能为零', '它的速率为零，受力指回势阱内'], answer: 3,
      why: '<p>在转折点 <i>U</i> = <i>E</i>，所以 <i>K</i> = 0，粒子停住。但那里的 <i>U</i> 是倾斜的（那是势阱的侧壁，不是底部），所以 <i>F</i> = −d<i>U</i>/d<i>x</i> ≠ 0，并指向“下坡”，即指回极小值。这就是它折返的原因。</p>' },
  ],
  10: [
    { q: `木块现在以 ${f(v10, 1)} m/s 而不是 ${f(Sl.v0, 1)} m/s 滑上同样的地面（μ<sub>k</sub> = ${f(Sl.mu)}）。它能滑多远？`,
      choices: [`${f(2 * Sl.d)} m`, `${f(d10)} m`, `${f(Sl.d)} m`, `${f(v10 ** 2 / (Sl.mu * G), 1)} m`], answer: 1,
      why: `<div class="eq">½<i>mv</i><sub>0</sub>² = μ<sub>k</sub><i>mgd</i> &nbsp;⇒&nbsp; <i>d</i> = <i>v</i><sub>0</sub>²/(2μ<sub>k</sub><i>g</i>) = ${f(v10, 1)}² / (2 × ${f(Sl.mu)} × ${f(G)}) = ${f(d10)} m</div><p>速率加倍，动能变为四倍，滑行距离也变为四倍（原来滑了 ${f(Sl.d)} m）。${f(2 * Sl.d)} m 是把它当成 <i>d</i> ∝ <i>v</i> 而加倍。</p>` },
    { q: `回到 ${f(Sl.v0, 1)} m/s（动能 ${f(Sl.E, 1)} J）：滑行最初的 ${f(x10, 1)} m 后，摩擦产生了多少内能？`,
      choices: [`${f(Sl.E / 2)} J`, `${f(Sl.mu * G * x10)} J`, `${f(Q10)} J`, `${f(Sl.E)} J`], answer: 2,
      why: `<div class="eq"><i>E</i><sub>th</sub> = <i>f</i><i>d</i> = μ<sub>k</sub><i>mg</i> × <i>d</i> = ${f(Sl.mu)} × ${f(Sl.m, 1)} × ${f(G)} × ${f(x10, 1)} = ${f(Q10)} J</div><p>木块还有 ${f(Sl.E - Q10)} J 的 <i>K</i>。${f(Sl.mu * G * x10)} J 漏掉了质量。</p>` },
  ],
  11: [
    { q: `一名 ${m11} kg 的学生用 ${f(t11, 1)} s 匀速跑上 ${f(h11, 1)} m 高的楼梯。这名学生用于提升自身的平均功率是多少？`,
      choices: [`${f(m11 * h11 / t11, 1)} W`, `${f(P11, 0)} W`, `${f(m11 * G * h11, 0)} W`, `${f(m11 * G * h11 * t11, 0)} W`], answer: 1,
      why: `<div class="eq"><i>P</i> = <i>W</i>/<i>t</i> = <i>mgh</i>/<i>t</i> = ${m11} × ${f(G)} × ${f(h11, 1)} / ${f(t11, 1)} = ${f(P11, 0)} W</div><p>${f(m11 * G * h11, 0)} 是以焦耳为单位的功，不是功率；${f(m11 * h11 / t11, 1)} W 用了质量而不是重力。</p>` },
    { q: '起重机以恒定的 0.5 m/s 把一个箱子提升高度 <i>h</i>，再以恒定的 1.0 m/s 把一个相同的箱子提升同样的高度。与慢速提升相比，快速提升需要',
      choices: ['两倍的功和两倍的功率', '相同的功和相同的功率', '相同的功和两倍的功率', '一半的功和两倍的功率'], answer: 2,
      why: '<p>匀速时，两种情况下钢索的拉力都是 <i>mg</i>，所以做功 <i>mgh</i> 相同。快速提升用时减半，所以 <i>P</i> = <i>W</i>/<i>t</i> = <i>Fv</i> 加倍。</p>' },
  ],
};
