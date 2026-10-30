// potential/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const g = (x, n = 3) => x.toPrecision(n);
const s = x => (x < 0 ? '−' : x > 0 ? '+' : '') + Math.abs(x);   // signed, with a real minus
const K = M.K, nC = M.nC;

// ---- page 0: the page's pair brought from 40 cm to 10 cm ----
const { q1, q2, r0, r1 } = M.PAIR;
const P0 = { W: K * q1 * q2 * (1 / r1 - 1 / r0) };
P0.nums = [K * q1 * q2 / r1, P0.W, K * q1 * q2 / r1 ** 2 * (r0 - r1), K * q1 * q2 / (r0 - r1)].map(x => x * 1e6);   // from ∞ · right · F(r₁)Δr · 1/Δr
// ---- page 1: the page's square; charging a sphere ----
const P1 = { U: M.SQ.U, a: M.SQ.a, q: M.SQ.q };
P1.nums = [4 * K * P1.q ** 2 / P1.a, 2 * P1.U, P1.U, (4 + 2 * Math.SQRT2) * K * P1.q ** 2 / P1.a].map(x => x * 1e6);   // sides only · every pair twice · right · diagonal a/√2
const P1b = { Q: 2 * nC, R: 0.15 };
P1b.U = K * P1b.Q ** 2 / (2 * P1b.R);
P1b.nums = [2 * P1b.U, P1b.U / 2, P1b.U, P1b.U / P1b.R].map(x => x * 1e6);   // Q × final V · ¼ · right · extra 1/R
// ---- page 2: the page's A → C; E = 3x² ----
const P2 = { W: -M.UNI.q * (M.Vuni(M.UNI.C) - M.Vuni(M.UNI.A)) };
P2.L = Math.hypot(M.UNI.C[0] - M.UNI.A[0], M.UNI.C[2] - M.UNI.A[2]);
P2.nums = [-P2.W, 0, M.UNI.q * M.UNI.E * P2.L, P2.W].map(x => x * 1e9);   // sign · "path ⟂ somewhere" · full length · right
const P2b = { c: 3, x: 2 };
P2b.dV = -P2b.c * P2b.x ** 3 / 3;
P2b.nums = [-P2b.dV, -P2b.c * P2b.x ** 2 * P2b.x, P2b.dV, -P2b.c * P2b.x ** 2 * P2b.x / 2];   // sign · E(x)·x · right · mean of end fields
// ---- page 3: the page's hill where V = 90 V; V = 3x²y − y³ ----
const P3 = { V: 90 };
P3.r = K * M.HILL.Q / P3.V;
P3.E = P3.V / P3.r;
P3.nums = [P3.V, P3.E, P3.E / 2, 2 * P3.E];
const P3b = { x: 1, y: 2 };
P3b.Ex = -6 * P3b.x * P3b.y; P3b.Ey = -(3 * P3b.x ** 2 - 3 * P3b.y ** 2);
P3b.E = Math.hypot(P3b.Ex, P3b.Ey);
P3b.nums = [Math.abs(P3b.Ex) + Math.abs(P3b.Ey), Math.abs(P3b.Ex), P3b.E, Math.abs(P3b.Ey)];
// ---- page 4: the page's dipole at P ----
const P4 = { V: M.VdipAxis(M.DIP.axisX) };
P4.nums = [-P4.V, 0, P4.V, -2 * M.DIP.a * K * M.DIP.q / M.DIP.axisX ** 2];   // sign · bisector habit · right · far-field
// ---- page 5: the page's rod at a = 10 cm ----
const { L: rL, Q: rQ, lam: rlam } = M.ROD;
const P5 = { a: 0.10 };
P5.V = M.VrodAxis(P5.a);
P5.nums = [K * rQ / P5.a, K * rQ / (P5.a + rL / 2), K * rlam * Math.log10((P5.a + rL) / P5.a), P5.V];   // all at the end · all at the middle · log₁₀ · right
P5.E = K * rQ / (P5.a * (P5.a + rL));
P5.nums2 = [P5.E, P5.V / P5.a, K * rQ / P5.a ** 2, K * rlam / P5.a];   // right · V/a · point at the end · kλ/a
// ---- page 6: the page's ring at z = 20 cm; the half-ring's field at its centre ----
const P6 = { z: 0.20 };
P6.V = M.Vring(P6.z);
P6.nums = [K * M.RING.Q / P6.z, P6.V, K * M.RING.Q * P6.z / (M.RING.R ** 2 + P6.z ** 2) ** 1.5, K * M.RING.Q / M.RING.R];   // point · right · that's E · centre
const P6b = { E: 2 * K * M.ARC.Q / (Math.PI * M.ARC.R ** 2) };
P6b.nums = [K * M.ARC.Q / M.ARC.R ** 2, P6b.E / 2, P6b.E, 0];   // as a point · lost 2 · right · ring symmetry
// ---- page 7: the page's insulating sphere at R/2; two connected spheres ----
const P7 = { r: M.SPH.R / 2 };
P7.V = M.Vins(P7.r);
P7.nums = [K * M.SPH.Q / P7.r, P7.V, M.Vcond(P7.r), M.Vins(0)];   // point · right · conductor · centre
const P7b = { nums: [1 / 3, 3, 1, 1 / 9] };
// ---- page 8: the page's proton; an electron falling toward +1 nC ----
const P8 = { v: M.ACC.vp };
P8.nums = [Math.sqrt(M.E_CH * M.ACC.dV / M.M_P), M.speed(M.E_CH, M.ACC.Vhi, M.M_P), P8.v, M.speed(M.E_CH, M.ACC.dV, M.M_E)].map(v => v / 1e3);   // lost 2 · used 7 V · right · electron
const P8b = { Q: 1 * nC, ra: 0.10, rb: 0.05 };
P8b.dV = K * P8b.Q * (1 / P8b.rb - 1 / P8b.ra);
P8b.v = M.speed(M.E_CH, P8b.dV, M.M_E);
P8b.nums = [M.speed(M.E_CH, K * P8b.Q / P8b.rb, M.M_E), P8b.v, P8b.v / Math.SQRT2, M.speed(M.E_CH, P8b.dV, M.M_P)].map(v => v / 1e6);   // V at the end only · right · lost 2 · proton mass

const frac = x => ({ [1 / 3]: '1/3', 3: '3', 1: '1', [1 / 9]: '1/9' })[x];

export const PRACTICE = {
  0: [
    { q: `把本页的 +${q2 / nC} nC 电荷从距固定的 +${q1 / nC} nC 电荷 ${p(r0 * 100, 0)} cm 处移到 ${p(r1 * 100, 0)} cm 处（始末都静止），你需要做多少功？`,
      choices: P0.nums.map(x => `${p(x, 3)} μJ`), answer: 1, nums: P0.nums,
      why: `<p>你要克服 <i>F</i> = <i>kq</i><sub>1</sub><i>q</i><sub>2</sub>/<i>r</i>² 推动它，而这个力越推越大，所以要积分：</p><div class="eq"><i>W</i> = −∫<sub><i>r</i><sub>0</sub></sub><sup><i>r</i><sub>1</sub></sup> <i>kq</i><sub>1</sub><i>q</i><sub>2</sub>/<i>r</i>² d<i>r</i> = <i>kq</i><sub>1</sub><i>q</i><sub>2</sub>(1/<i>r</i><sub>1</sub> − 1/<i>r</i><sub>0</sub>) = Δ<i>U</i> = ${p(P0.W * 1e6, 3)} μJ</div><p><i>kq</i><sub>1</sub><i>q</i><sub>2</sub>/<i>r</i><sub>1</sub>（${p(P0.nums[0], 3)} μJ）是从无穷远处移来所做的功，而不是从 ${p(r0 * 100, 0)} cm 处。</p>` },
    { q: '两个粒子相互作用的势能为 <i>U</i>(<i>r</i>) = <i>A</i>/<i>r</i>² − <i>B</i>/<i>r</i>（<i>A</i>、<i>B</i> &gt; 0）。两者间距为多少时，它们之间的力为零？',
      choices: ['<i>A</i>/<i>B</i>', '√(<i>A</i>/<i>B</i>)', '<i>B</i>/2<i>A</i>', '2<i>A</i>/<i>B</i>'], answer: 3,
      why: '<p><i>F</i> = −d<i>U</i>/d<i>r</i>，所以令斜率为零：</p><div class="eq">d<i>U</i>/d<i>r</i> = −2<i>A</i>/<i>r</i>³ + <i>B</i>/<i>r</i>² = 0 &nbsp;→&nbsp; <i>r</i> = 2<i>A</i>/<i>B</i></div><p><i>A</i>/<i>B</i> 是 <i>U</i> = 0 的位置，而不是斜率为零的位置。在 2<i>A</i>/<i>B</i> 处 <i>U</i> 取最小值，所以这个间距是稳定的。</p>' },
  ],
  1: [
    { q: `本页四个 +${P1.q / nC} nC 电荷位于边长 ${p(P1.a * 100, 0)} cm 的正方形四个顶点上。这组电荷的电势能为`,
      choices: P1.nums.map(x => `${p(x, 3)} μJ`), answer: 2, nums: P1.nums,
      why: `<p>六对：四条边，间距 <i>a</i>；两条对角线，间距 √2<i>a</i>。</p><div class="eq"><i>U</i> = 4<i>kq</i>²/<i>a</i> + 2<i>kq</i>²/√2<i>a</i> = (4 + √2)<i>kq</i>²/<i>a</i> = ${p(P1.U * 1e6, 3)} μJ</div><p>对每个电荷求 <i>qV</i> 再相加，会把每一对算两次（${p(P1.nums[1], 3)} μJ）；对角线是 √2<i>a</i>，不是 <i>a</i>/√2。</p>` },
    { q: `从无穷远处一点一点地移来微小电荷 d<i>q</i>，使半径 ${p(P1b.R * 100, 0)} cm 的金属球带电 ${p(P1b.Q / nC, 1)} nC。所需的总功为`,
      choices: P1b.nums.map(x => `${p(x, 3)} μJ`), answer: 2, nums: P1b.nums,
      why: `<p>球带电 <i>q</i> 时，它的电势是 <i>kq</i>/<i>R</i>，再移来 d<i>q</i> 需要做功 (<i>kq</i>/<i>R</i>) d<i>q</i>：</p><div class="eq"><i>W</i> = ∫<sub>0</sub><sup><i>Q</i></sup> (<i>kq</i>/<i>R</i>) d<i>q</i> = <i>kQ</i>²/2<i>R</i> = ${p(P1b.U * 1e6, 3)} μJ</div><p>用 <i>Q</i> 乘以最终电势（${p(P1b.nums[0], 3)} μJ）等于让每个 d<i>q</i> 都付全价；而最先移来的几乎没有受到排斥。</p>` },
  ],
  2: [
    { q: `本页中，一个 +${M.UNI.q / nC} nC 电荷在 ${M.UNI.E} N/C 的匀强电场中从 A 移到 C，<i>V</i><sub>C</sub> − <i>V</i><sub>A</sub> = −10 V。电场力对它做的功为`,
      choices: P2.nums.map(x => `${s(+p(x, 1))} nJ`), answer: 3, nums: P2.nums,
      why: `<div class="eq"><i>W</i><sub>电场</sub> = −Δ<i>U</i> = −<i>q</i>Δ<i>V</i> = −(${M.UNI.q / nC} nC)(−10 V) = +${p(P2.W * 1e9, 1)} nJ</div><p>与路径无关：只有沿 <b>E</b> 的 ${p(M.UNI.C[0] * 100, 0)} cm 起作用，而不是 ${p(P2.L * 100, 1)} cm 的直线路径（${p(P2.nums[2], 1)} nJ）。正电荷顺着 <b>E</b> 运动时 <i>U</i> 减小，所以电场力做正功。</p>` },
    { q: `电场沿 +<i>x</i> 方向，<i>E</i> = ${P2b.c}<i>x</i>²（N/C，<i>x</i> 以 m 为单位）。<i>V</i>(${P2b.x} m) − <i>V</i>(0) 为`,
      choices: P2b.nums.map(x => `${s(x)} V`), answer: 2, nums: P2b.nums,
      why: `<div class="eq">Δ<i>V</i> = −∫<sub>0</sub><sup>${P2b.x}</sup> ${P2b.c}<i>x</i>² d<i>x</i> = −<i>x</i>³ |<sub>0</sub><sup>${P2b.x}</sup> = ${s(P2b.dV)} V</div><p>顺着 <b>E</b> 移动，<i>V</i> 降低，所以答案为负。<i>E</i>(${P2b.x}) × ${P2b.x} m = ${-P2b.nums[1]} V 把最大的电场当成了全程都一样大。</p>` },
  ],
  3: [
    { q: `在本页的山丘（+${M.HILL.Q / nC} nC）上 <i>V</i> = ${P3.V} V 的位置，电场的大小为`,
      choices: P3.nums.map(x => `${p(x, 0)} N/C`), answer: 1, nums: P3.nums,
      why: `<p>先求距离：<i>r</i> = <i>kQ</i>/<i>V</i> = ${p(K * M.HILL.Q, 2)}/${P3.V} = ${p(P3.r * 100, 2)} cm。再求斜率：</p><div class="eq"><i>E</i> = −d<i>V</i>/d<i>r</i> = <i>kQ</i>/<i>r</i>² = <i>V</i>/<i>r</i> = ${p(P3.E, 0)} N/C</div><p><i>V</i> 与 <i>E</i> 的单位和大小都不同：${P3.V} V 是山丘的高度，${p(P3.E, 0)} N/C 是它的陡峭程度。</p>` },
    { q: '某区域内 <i>V</i>(<i>x</i>, <i>y</i>) = 3<i>x</i>²<i>y</i> − <i>y</i>³（伏特，米）。(1 m, 2 m) 处 <b>E</b> 的大小为',
      choices: P3b.nums.map(x => `${p(x, 1)} N/C`), answer: 2, nums: P3b.nums,
      why: `<p><b>E</b> = −∇<i>V</i>，逐个分量求：</p><div class="eq"><i>E<sub>x</sub></i> = −∂<i>V</i>/∂<i>x</i> = −6<i>xy</i> = ${s(P3b.Ex)} N/C，&nbsp;<i>E<sub>y</sub></i> = −(3<i>x</i>² − 3<i>y</i>²) = ${s(P3b.Ey)} N/C</div><div class="eq">|<b>E</b>| = √(${P3b.Ex ** 2} + ${P3b.Ey ** 2}) = ${p(P3b.E, 1)} N/C</div><p>分量要按矢量合成，而不是按数值相加（${p(P3b.nums[0], 1)}）。</p>` },
  ],
  4: [
    { q: `对本页的电偶极子（+${M.DIP.q / nC} nC 位于 <i>x</i> = −${p(M.DIP.a * 100, 0)} cm，−${M.DIP.q / nC} nC 位于 +${p(M.DIP.a * 100, 0)} cm），轴线上 <i>x</i> = ${p(M.DIP.axisX * 100, 0)} cm 的 P 点电势为`,
      choices: P4.nums.map(x => `${x === 0 ? '0' : s(+p(x, 1))} V`), answer: 2, nums: P4.nums,
      why: `<p>把两个 <i>kq</i>/<i>r</i> 连同正负号相加：</p><div class="eq"><i>V</i> = <i>kq</i>/${p((M.DIP.axisX + M.DIP.a), 2)} − <i>kq</i>/${p((M.DIP.axisX - M.DIP.a), 2)} = ${p(K * M.DIP.q / (M.DIP.axisX + M.DIP.a), 1)} − ${p(K * M.DIP.q / (M.DIP.axisX - M.DIP.a), 1)} = ${s(+p(P4.V, 1))} V</div><p>P 离负电荷更近，所以 <i>V</i> &lt; 0。<i>V</i> = 0 在中垂线上成立，而不是这里；远场公式 −2<i>akq</i>/<i>x</i>²（${p(P4.nums[3], 1)} V）要求 <i>x</i> ≫ <i>a</i>。</p>` },
    { q: '在该偶极子轴线上 −<i>q</i> 一侧的远处，<i>V</i> ≈ −2<i>akq</i>/<i>x</i>²。那里的电场为',
      choices: ['4<i>akq</i>/<i>x</i>³，背离偶极子', '2<i>akq</i>/<i>x</i>³，指向偶极子', '4<i>akq</i>/<i>x</i>³，指向偶极子', '2<i>akq</i>/<i>x</i>²，背离偶极子'], answer: 2,
      why: '<div class="eq"><i>E<sub>x</sub></i> = −d<i>V</i>/d<i>x</i> = −d/d<i>x</i>(−2<i>akq x</i><sup>−2</sup>) = −4<i>akq</i>/<i>x</i>³</div><p>为负：指向 −<i>x</i>，即指回偶极子。这说得通：较近的 −<i>q</i> 对正试探电荷的吸引，比较远的 +<i>q</i> 对它的排斥更强。<b>E</b> 从高电势指向低电势，而越往里 <i>V</i> 越低（越负）。</p>' },
  ],
  5: [
    { q: `本页的细棒（+${rQ / nC} nC 分布在 ${p(rL * 100, 0)} cm 上）。在其轴线上、距一端 ${p(P5.a * 100, 0)} cm 处的电势为`,
      choices: P5.nums.map(x => `${p(x, 1)} V`), answer: 3, nums: P5.nums,
      why: `<div class="eq"><i>V</i> = ∫<sub><i>a</i></sub><sup><i>a</i>+<i>L</i></sup> <i>k</i>λ d<i>x</i>/<i>x</i> = <i>k</i>λ ln((<i>a</i> + <i>L</i>)/<i>a</i>) = ${p(K * rlam, 1)} × ln ${p((P5.a + rL) / P5.a, 0)} = ${p(P5.V, 1)} V</div><p>1/<i>x</i> 的积分是自然对数；用 log₁₀ 会得到 ${p(P5.nums[2], 1)} V。把全部电荷放在中点（${p(P5.nums[1], 1)} V）只在远处适用。</p>` },
    { q: `由该轴线上的 <i>V</i>(<i>a</i>) 求出距端点 ${p(P5.a * 100, 0)} cm 处的电场为`,
      choices: P5.nums2.map(x => `${p(x, 0)} N/C`), answer: 0, nums: P5.nums2,
      why: `<div class="eq"><i>E</i> = −d<i>V</i>/d<i>a</i> = −<i>k</i>λ[1/(<i>a</i> + <i>L</i>) − 1/<i>a</i>] = <i>kQ</i>/(<i>a</i>(<i>a</i> + <i>L</i>)) = ${p(P5.E, 0)} N/C</div><p>方向背离细棒。<i>V</i>/<i>a</i>（${p(P5.nums2[1], 0)} N/C）只在 <i>V</i> ∝ 1/<i>a</i> 时才对；要求导数。</p>` },
  ],
  6: [
    { q: `本页的圆环（+${M.RING.Q / nC} nC，<i>R</i> = ${p(M.RING.R * 100, 0)} cm）。在其轴线上距中心 ${p(P6.z * 100, 0)} cm 处的电势为`,
      choices: P6.nums.map(x => `${p(x, 1)} V`), answer: 1, nums: P6.nums,
      why: `<p>每个 d<i>q</i> 到该点的距离都是 √(<i>R</i>² + <i>z</i>²) = ${p(Math.hypot(M.RING.R, P6.z) * 100, 0)} cm，而 <i>V</i> 是标量，不用分解分量：</p><div class="eq"><i>V</i> = <i>kQ</i>/√(<i>R</i>² + <i>z</i>²) = ${p(K * M.RING.Q, 2)}/${p(Math.hypot(M.RING.R, P6.z), 2)} = ${p(P6.V, 1)} V</div><p>${p(P6.nums[2], 1)} 是电场 <i>kQz</i>/(<i>R</i>² + <i>z</i>²)<sup>3/2</sup>，单位为 N/C；cos 因子属于 <b>E</b>，不属于 <i>V</i>。</p>` },
    { q: `本页的半圆环（+${M.ARC.Q / nC} nC，<i>R</i> = ${p(M.ARC.R * 100, 0)} cm）在圆心处 <i>V</i> = <i>kQ</i>/<i>R</i>。那里<b>电场</b>的大小为`,
      choices: P6b.nums.map(x => `${x ? p(x, 0) : '0'} N/C`), answer: 2, nums: P6b.nums,
      why: `<p>λ = <i>Q</i>/π<i>R</i>，每个 d<i>q</i> = λ<i>R</i> dθ 产生 <i>k</i>λ dθ/<i>R</i>。从对称轴量起 θ；横向分量抵消，其余相加：</p><div class="eq"><i>E</i> = ∫<sub>−π/2</sub><sup>π/2</sup> (<i>k</i>λ/<i>R</i>) cos θ dθ = 2<i>k</i>λ/<i>R</i> = 2<i>kQ</i>/π<i>R</i>² = ${p(P6b.E, 0)} N/C</div><p>与 <i>V</i> 不同，<b>E</b> 并不就是 <i>kQ</i>/<i>R</i>²（${p(P6b.nums[0], 0)} N/C）：各小块的电场方向不同。只有完整的圆环，圆心处电场才为零。</p>` },
  ],
  7: [
    { q: `本页的绝缘球（+${M.SPH.Q / nC} nC 均匀分布，<i>R</i> = ${p(M.SPH.R * 100, 0)} cm）。距球心 ${p(P7.r * 100, 0)} cm 处的电势为`,
      choices: P7.nums.map(x => `${p(x, 1)} V`), answer: 1, nums: P7.nums,
      why: `<p>从无穷远处走进来：外部的 −∫<i>E</i> d<i>r</i> 给出 <i>kQ</i>/<i>R</i>；内部 <i>E</i> = <i>kQr</i>/<i>R</i>³，还要再加：</p><div class="eq"><i>V</i>(<i>r</i>) = <i>kQ</i>/<i>R</i> + ∫<sub><i>r</i></sub><sup><i>R</i></sup> <i>kQr</i>′/<i>R</i>³ d<i>r</i>′ = (<i>kQ</i>/<i>R</i>)(3/2 − <i>r</i>²/2<i>R</i>²) = ${p(P7.V, 1)} V</div><p><i>kQ</i>/<i>r</i>（${p(P7.nums[0], 1)} V）相当于把全部电荷都放在 <i>r</i> 以内；${p(P7.nums[2], 1)} V 是金属球的结果，它内部 <i>E</i> = 0。</p>` },
    { q: '两个金属球半径 <i>R</i><sub>1</sub> = 3<i>R</i><sub>2</sub>，相距很远，用细导线连接后充电。面电荷密度之比 σ<sub>1</sub>/σ<sub>2</sub> 为',
      choices: P7b.nums.map(frac), answer: 0, nums: P7b.nums,
      why: '<p>连接后它们是同一个导体，电势相等：<i>kQ</i><sub>1</sub>/<i>R</i><sub>1</sub> = <i>kQ</i><sub>2</sub>/<i>R</i><sub>2</sub>，所以 <i>Q</i><sub>1</sub>/<i>Q</i><sub>2</sub> = <i>R</i><sub>1</sub>/<i>R</i><sub>2</sub> = 3。于是</p><div class="eq">σ<sub>1</sub>/σ<sub>2</sub> = (<i>Q</i><sub>1</sub>/<i>R</i><sub>1</sub>²)/(<i>Q</i><sub>2</sub>/<i>R</i><sub>2</sub>²) = 3 × (1/3)² = 1/3</div><p>大球带的电荷更多，但分布得更稀：导体上曲率越大的地方，电荷越密集。</p>' },
  ],
  8: [
    { q: `本页的质子从 ${M.ACC.Vhi} V 极板由静止出发，运动到 ${M.ACC.Vlo} V 极板。到达时的速度为`,
      choices: P8.nums.map(x => `${p(x, 1)} km/s`), answer: 2, nums: P8.nums,
      why: `<div class="eq"><i>e</i>Δ<i>V</i> = ½<i>mv</i>² &nbsp;→&nbsp; <i>v</i> = √(2<i>e</i>Δ<i>V</i>/<i>m</i><sub>p</sub>) = √(2 × ${M.E_CH.toExponential(2).replace('e-', ' × 10<sup>−')}</sup> × ${M.ACC.dV}/${M.M_P.toExponential(2).replace('e-', ' × 10<sup>−')}</sup>) = ${p(P8.v / 1e3, 1)} km/s</div><p>只有<b>电势差</b> ${M.ACC.dV} V 起作用，而不是出发极板的 ${M.ACC.Vhi} V。${p(P8.nums[3], 0)} km/s 是电子获得同样 6 eV 时的速度。</p>` },
    { q: `一个电子在距固定的 +${P8b.Q / nC} nC 电荷 ${p(P8b.ra * 100, 0)} cm 处由静止释放，被吸引过去。它距该电荷 ${p(P8b.rb * 100, 0)} cm 时的速度为`,
      choices: P8b.nums.map(x => `${p(x, 2)} × 10<sup>6</sup> m/s`), answer: 1, nums: P8b.nums,
      why: `<p>电子越靠近受力越大，所以用能量来算，能量里已经包含了积分 ∫<i>F</i> d<i>r</i>：</p><div class="eq">Δ<i>V</i> = <i>kQ</i>(1/<i>r</i><sub>b</sub> − 1/<i>r</i><sub>a</sub>) = ${p(P8b.dV, 1)} V，&nbsp;<i>v</i> = √(2<i>e</i>Δ<i>V</i>/<i>m</i><sub>e</sub>) = ${p(P8b.v / 1e6, 2)} × 10<sup>6</sup> m/s</div><p>只用 ${p(P8b.rb * 100, 0)} cm 处的 <i>V</i>（${p(K * P8b.Q / P8b.rb, 0)} V），忘了出发点的电势是 ${p(K * P8b.Q / P8b.ra, 0)} V，而不是 0。</p>` },
  ],
};
