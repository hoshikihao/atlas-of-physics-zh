// capacitors/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const { EPS0, K, C0, V0, Q0, U0, PLATE } = M;
const A = PLATE.A, d = PLATE.d;

// ---- page 0: the battery turned up steadily from 20 V to 100 V in 4.0 s ----
const P0 = { V1: 20, V2: 100, dt: 4.0 };
P0.I = C0 * (P0.V2 - P0.V1) / P0.dt;
P0.nums = [C0 * P0.V2 / P0.dt, P0.I, P0.I / 2, C0 * P0.V1 / P0.dt].map(x => x * 1e12);   // final V not ΔV · right · halved · starting V
// ---- page 1: isolated plates pulled from 5 cm to 8 cm; the force between them ----
const P1 = { d2: 0.08 };
P1.V = Q0 / M.cPlate(A, P1.d2);
P1.nums = [V0 * d / P1.d2, V0, V0 * (P1.d2 / d) ** 2, P1.V];        // ΔV ∝ 1/d · battery's · ∝ d² · right
P1.F = Q0 * Q0 / (2 * EPS0 * A);
P1.fnums = [Q0 * M.E0, P1.F, K * Q0 * Q0 / d ** 2, P1.F / 2].map(x => x * 1e6);   // full field σ/ε₀ · right · point charges · ¼
// ---- page 2: the page's spheres, a = 10 cm, b = 20 cm, 100 V ----
const { a: sa, b: sb } = M.SPH, r2 = 0.15;
const P2 = { E: K * M.SPH.Q / r2 ** 2 };
P2.nums = [V0 / (sb - sa), K * M.SPH.Q / sb ** 2, P2.E, K * M.SPH.Q / sa ** 2];   // as if plates · used b · right · used a
P2.dV = V0 * (1 / sa - 1 / r2) / (1 / sa - 1 / sb);
P2.vnums = [P2.dV, V0 * (r2 - sa) / (sb - sa), V0 - P2.dV, V0 * (1 / sa ** 2 - 1 / r2 ** 2) / (1 / sa ** 2 - 1 / sb ** 2)];   // right · linear · the other part · 1/r² for V
// ---- page 3: the page's coax; the tube widened to 16 cm; where the energy is ----
const { a: ca, b: cb, L: cL } = M.CYL, cb2 = 2 * cb;
const P3 = { C: 2 * Math.PI * EPS0 * cL / Math.log(cb2 / ca) };
P3.nums = [M.CYL.C / 2, M.CYL.C, P3.C, M.CYL.C / 4].map(x => x * 1e12);   // C ∝ 1/b · unchanged · right · 1/b²
P3.frac = Math.log(2) / Math.log(cb / ca);
P3.fnums = [((2 * ca) ** 2 - ca ** 2) / (cb ** 2 - ca ** 2), ca / (cb - ca), (1 / ca ** 2 - 1 / (2 * ca) ** 2) / (1 / ca ** 2 - 1 / cb ** 2), P3.frac].map(x => x * 100);   // by volume · by radius · E² not E²r · right
// ---- page 4: the second half of the charge; the gap halved on the battery ----
const P4 = { frac: 1 - 0.25 };
P4.nums = [25, 50, P4.frac * 100, 87.5];
const P4b = { d2: d / 2 };
P4b.U = 0.5 * M.cPlate(A, P4b.d2) * V0 * V0;
P4b.nums = [U0 / 2, U0, 4 * U0, P4b.U].map(x => x * 1e9);           // as if Q fixed · unchanged · ×4 · right
// ---- page 5: 2 µF and 4 µF in series on 9 V ----
const { C1, C2, V: CV } = M.CIRC, S = M.SER;
const P5 = { V1: S.Q / C1 };
P5.nums = [P5.V1, CV * C1 / (C1 + C2), CV, CV / 2];                // right · split the wrong way · all of it · halves
P5.U = S.Q * S.Q / 2 * (1 / C1 + 1 / C2);
P5.unums = [S.Q * CV, M.PAR.U, S.Q * S.Q / (2 * C1), P5.U].map(x => x * 1e6);   // forgot ½ · parallel · C₁ only · right
// ---- page 6: the κ = 3 slab, plates isolated; a graded dielectric ----
const KA = M.KAPPA;
const P6 = { V: V0 / KA };
P6.nums = [V0 * KA, P6.V, V0, V0 / KA ** 2];
const P6b = { k1: 1, k2: 3 };
P6b.C = EPS0 * A * (P6b.k2 - P6b.k1) / (d * Math.log(P6b.k2 / P6b.k1));      // the free-response answer
// ---- page 7: slab fully in, battery on; half in, battery off ----
const P7 = { dQ: (KA - 1) * Q0 };
P7.nums = [KA * Q0, Q0, Q0 * (1 - 1 / KA), P7.dQ].map(x => x * 1e12);  // total not added · Q₀ · wrong way · right
const P7b = { x: 0.5, side: PLATE.side };
P7b.F = U0 * (KA - 1) / (P7b.side * (1 + (KA - 1) * P7b.x) ** 2);
P7b.nums = [U0 * (KA - 1) / P7b.side, P7b.F, U0 * (KA - 1) / (P7b.side * (1 + (KA - 1) * P7b.x)), U0 / (P7b.side * (1 + (KA - 1) * P7b.x) ** 2)].map(x => x * 1e9);   // V held · right · C not C² · no (κ − 1)
// ---- page 8: the induced charge on one half of the sphere ----
const { R: cR, E0: cE } = M.COND, sMax = 3 * EPS0 * cE;
const P8 = { q: sMax * Math.PI * cR * cR };
P8.nums = [sMax * 2 * Math.PI * cR * cR, 0, sMax * 4 * Math.PI * cR * cR, P8.q].map(x => x * 1e9);   // σ_max × half the area · total · whole area · right

const pF = x => `${p(x, 1)} pF`;

export const PRACTICE = {
  0: [
    { q: '把接在电容器上的电池电压从 Δ<i>V</i> 调高到 3Δ<i>V</i>。关于电容 <i>C</i> 和每块极板上的电荷量 <i>Q</i>，下列说法正确的是',
      choices: ['<i>C</i> 增至三倍；<i>Q</i> 不变', '<i>C</i> 不变；<i>Q</i> 增至三倍', '<i>C</i> 不变；<i>Q</i> 变为 9 倍', '<i>C</i> 减为三分之一；<i>Q</i> 不变'], answer: 1,
      why: '<p><i>C</i> = ε<sub>0</sub><i>A</i>/<i>d</i> 只取决于极板和间距，所以保持不变。于是 <i>Q</i> = <i>C</i>Δ<i>V</i> 成正比增大：变为 3 倍。变为 9 倍的是<b>能量</b> ½<i>C</i>Δ<i>V</i><sup>2</sup>。</p>' },
    { q: `本页的极板（<i>C</i> = ${p(C0 * 1e12, 2)} pF）接在电池上，电池电压在 ${p(P0.dt, 1)} s 内从 ${P0.V1} V 均匀调高到 ${P0.V2} V。这段时间内流向 + 极板的电流为`,
      choices: P0.nums.map(x => `${p(x, 1)} pA`), answer: 1, nums: P0.nums,
      why: `<p>在 <i>C</i> 不变的情况下对 <i>Q</i> = <i>C</i>Δ<i>V</i> 求导：</p><div class="eq"><i>I</i> = <i>dQ</i>/<i>dt</i> = <i>C</i> <i>d</i>(Δ<i>V</i>)/<i>dt</i> = ${p(C0 * 1e12, 2)} pF × ${p((P0.V2 - P0.V1) / P0.dt, 0)} V/s = ${p(P0.I * 1e12, 1)} pA</div><p>只有电压的<b>变化率</b>起作用：用 ${P0.V2} V / ${p(P0.dt, 1)} s（${p(P0.nums[0], 1)} pA）是把电压和电压的变化量弄混了。</p>` },
  ],
  1: [
    { q: `本页的极板在间距 ${p(d * 100, 0)} cm 时充电到 ${V0} V，然后断开电源。再把极板拉开到 ${p(P1.d2 * 100, 0)} cm。此时的电势差为`,
      choices: P1.nums.map(x => `${p(x, 1)} V`), answer: 3, nums: P1.nums,
      why: `<p>断开电源后 <i>Q</i> 不变，所以 σ 和 <i>E</i> = σ/ε<sub>0</sub> = ${p(M.E0, 0)} V/m 都不变。只有距离增大了：</p><div class="eq">Δ<i>V</i> = <i>Ed</i> = ${p(M.E0, 0)} V/m × ${p(P1.d2, 2)} m = ${p(P1.V, 1)} V</div><p>也可以这样看：<i>C</i> 减为原来的 ${p(d * 100, 0)}/${p(P1.d2 * 100, 0)}，Δ<i>V</i> = <i>Q</i>/<i>C</i> 按反比增大。只有电池仍然接着时，电压才保持 ${V0} V。</p>` },
    { q: `<i>Q</i> 不变时，本页极板在间距为 <i>x</i> 时的能量为 <i>U</i>(<i>x</i>) = <i>Q</i><sup>2</sup><i>x</i>/2ε<sub>0</sub><i>A</i>。若 <i>Q</i> = ${p(Q0 * 1e12, 0)} pC，<i>A</i> = ${p(A, 2)} m²，两极板间的吸引力为`,
      choices: P1.fnums.map(x => `${p(x, 3)} µN`), answer: 1, nums: P1.fnums,
      why: `<p>电荷不变时，力等于能量对位置的斜率取负：</p><div class="eq"><i>F</i> = −<i>dU</i>/<i>dx</i> = −<i>Q</i><sup>2</sup>/2ε<sub>0</sub><i>A</i> = −(${p(Q0 * 1e12, 0)}×10<sup>−12</sup> C)<sup>2</sup> / (2 × ${EPS0} × ${p(A, 2)}) = −${p(P1.F * 1e6, 3)} µN</div><p>负号表示它把间隙拉紧。每块极板处在<b>另一块</b>极板的电场 σ/2ε<sub>0</sub> 中，所以 <i>F</i> = <i>Q</i>(σ/2ε<sub>0</sub>)；用两板间的总电场 σ/ε<sub>0</sub> 会把它加倍为 ${p(P1.fnums[0], 3)} µN。</p>` },
  ],
  2: [
    { q: `本页的球形电容器（<i>a</i> = ${sa * 100} cm，<i>b</i> = ${sb * 100} cm，Δ<i>V</i> = ${V0} V）在 <i>r</i> = ${r2 * 100} cm 处的电场大小为`,
      choices: P2.nums.map(x => `${p(x, 0)} V/m`), answer: 2, nums: P2.nums,
      why: `<p><i>Q</i> = <i>C</i>Δ<i>V</i> = ${p(M.SPH.C * 1e12, 1)} pF × ${V0} V = ${p(M.SPH.Q * 1e9, 3)} nC，由高斯定理，两球之间是点电荷的电场：</p><div class="eq"><i>E</i> = <i>kQ</i>/<i>r</i><sup>2</sup> = ${p(K / 1e9, 2)}×10<sup>9</sup> × ${p(M.SPH.Q * 1e9, 3)}×10<sup>−9</sup> / ${r2}<sup>2</sup> = ${p(P2.E, 0)} V/m</div><p>Δ<i>V</i>/(<i>b</i> − <i>a</i>) = ${p(P2.nums[0], 0)} V/m 只对匀强电场成立；这里 <i>E</i> 按 1/<i>r</i><sup>2</sup> 减小。</p>` },
    { q: `两球之间的 ${V0} V 中，间隙内侧一半（从 <i>r</i> = ${sa * 100} cm 到 ${r2 * 100} cm）占多少？`,
      choices: P2.vnums.map(x => `${p(x, 1)} V`), answer: 0, nums: P2.vnums,
      why: `<p>对各部分积分 <i>E</i> = <i>kQ</i>/<i>r</i><sup>2</sup>；比值中 <i>kQ</i> 约掉：</p><div class="eq">Δ<i>V</i><sub>内</sub> / Δ<i>V</i> = ∫<sub><i>a</i></sub><sup><i>r</i></sup> <i>dr</i>/<i>r</i><sup>2</sup> ÷ ∫<sub><i>a</i></sub><sup><i>b</i></sup> <i>dr</i>/<i>r</i><sup>2</sup> = (1/<i>a</i> − 1/<i>r</i>)/(1/<i>a</i> − 1/<i>b</i>) = (${p(1 / sa, 2)} − ${p(1 / r2, 2)})/(${p(1 / sa, 2)} − ${p(1 / sb, 2)}) =${p(P2.dV / V0, 3)}</div><p>所以是 ${p(P2.dV, 1)} V。电场在内球附近最强，所以内侧一半占了一半以上；${p(P2.vnums[1], 1)} V 是按匀强电场算的。</p>` },
  ],
  3: [
    { q: `本页的同轴电容器（<i>a</i> = ${ca * 100} cm，<i>b</i> = ${cb * 100} cm，<i>L</i> = ${cL * 100} cm，<i>C</i> = ${p(M.CYL.C * 1e12, 1)} pF）换成更粗的管子，<i>b</i> = ${cb2 * 100} cm。它的电容变为`,
      choices: P3.nums.map(pF), answer: 2, nums: P3.nums,
      why: `<div class="eq"><i>C</i> = 2πε<sub>0</sub><i>L</i>/ln(<i>b</i>/<i>a</i>) = 2π × ${EPS0} × ${cL} / ln(${cb2 * 100}/${ca * 100}) = ${p(P3.C * 1e12, 1)} pF</div><p>从 ln 4 变到 ln 8 只增大到 3/2 倍，所以 <i>C</i> 变为 ${p(M.CYL.C * 1e12, 1)} pF 的 2/3，而不是一半：<i>C</i> 只通过对数依赖于 <i>b</i>。</p>` },
    { q: `本页的同轴电容器（<i>a</i> = ${ca * 100} cm，<i>b</i> = ${cb * 100} cm）充了电。它储存的能量中，有多大比例位于距轴线 ${2 * ca * 100} cm 以内（<i>r</i> = ${ca * 100} 到 ${2 * ca * 100} cm 之间）？`,
      choices: P3.fnums.map(x => `${p(x, 1)} %`), answer: 3, nums: P3.fnums,
      why: `<p>能量密度乘以体积为 2π<i>rL dr</i> 的薄圆柱壳，其中 <i>E</i> = λ/2πε<sub>0</sub><i>r</i>：</p><div class="eq"><i>dU</i> = ½ε<sub>0</sub><i>E</i><sup>2</sup> · 2π<i>rL dr</i> = (λ<sup>2</sup><i>L</i>/4πε<sub>0</sub>) <i>dr</i>/<i>r</i></div><div class="eq">比例 = ln(2<i>a</i>/<i>a</i>) / ln(<i>b</i>/<i>a</i>) = ln 2 / ln 4 = ${p(P3.frac, 3)}</div><p><i>r</i> 每翻一倍，所含能量都相同。按体积算只有 ${p(P3.fnums[0], 1)} %；但棒附近的电场要强得多。</p>` },
  ],
  4: [
    { q: '把一小份一小份的 <i>dq</i> 搬过去，使电容器的电荷量从 0 充到 <i>Q</i>。搬运<b>后一半</b>电荷（从 <i>Q</i>/2 到 <i>Q</i>）所做的功占总功的多大比例？',
      choices: P4.nums.map(x => `${p(x, 1)} %`), answer: 2, nums: P4.nums,
      why: '<p>每一份 <i>dq</i> 需要做功 Δ<i>V</i> <i>dq</i> = (<i>q</i>/<i>C</i>) <i>dq</i>，所以</p><div class="eq"><i>W</i> = ∫<sub><i>Q</i>/2</sub><sup><i>Q</i></sup> (<i>q</i>/<i>C</i>) <i>dq</i> = (<i>Q</i><sup>2</sup> − <i>Q</i><sup>2</sup>/4)/2<i>C</i> = ¾ · <i>Q</i><sup>2</sup>/2<i>C</i></div><p>75 %。后搬的电荷要克服更高的电压，所以更费功；50 % 是把每一份都当成一样。</p>' },
    { q: `本页的极板一直接在 ${V0} V 电池上（<i>U</i> = ${p(U0 * 1e9, 1)} nJ），把间距减半到 ${p(P4b.d2 * 100, 1)} cm。储存的能量变为`,
      choices: P4b.nums.map(x => `${p(x, 1)} nJ`), answer: 3, nums: P4b.nums,
      why: `<p>接着电源时 Δ<i>V</i> 不变；<i>C</i> = ε<sub>0</sub><i>A</i>/<i>d</i> 加倍：</p><div class="eq"><i>U</i> = ½<i>C</i>Δ<i>V</i><sup>2</sup> = 2<i>U</i><sub>0</sub> = ${p(P4b.U * 1e9, 1)} nJ</div><p>也可以用能量密度来算：<i>E</i> = Δ<i>V</i>/<i>d</i> 加倍，½ε<sub>0</sub><i>E</i><sup>2</sup> 变为 4 倍，体积减半。${p(P4b.nums[0], 1)} nJ 是 <i>Q</i> 不变（断开电池）时的答案。</p>` },
  ],
  5: [
    { q: `本页 ${C1 * 1e6} µF 和 ${C2 * 1e6} µF 的电容器<b>串联</b>后接在 ${CV} V 上。${C1 * 1e6} µF 电容器两端的电压为`,
      choices: P5.nums.map(x => `${p(x, 1)} V`), answer: 0, nums: P5.nums,
      why: `<p>串联时两者带相同的电荷量 <i>Q</i> = <i>C</i><sub>eq</sub>Δ<i>V</i> = ${p(S.C * 1e6, 3)} µF × ${CV} V = ${p(S.Q * 1e6, 0)} µC，所以</p><div class="eq">Δ<i>V</i><sub>1</sub> = <i>Q</i>/<i>C</i><sub>1</sub> = ${p(S.Q * 1e6, 0)} µC / ${C1 * 1e6} µF = ${p(P5.V1, 1)} V</div><p>电容<b>较小</b>的那个分得的电压更多；${p(P5.nums[1], 1)} V 是把分配关系弄反了。</p>` },
    { q: `从不带电开始给这对串联电容器充电，所做的功为 ∫ (<i>q</i>/<i>C</i><sub>1</sub> + <i>q</i>/<i>C</i><sub>2</sub>) <i>dq</i>，从 0 积分到最终电荷量。储存的总能量为`,
      choices: P5.unums.map(x => `${p(x, 0)} µJ`), answer: 3, nums: P5.unums,
      why: `<p>任意时刻两者上的 <i>q</i> 都相同，所以积分号内两个电压相加：</p><div class="eq"><i>U</i> = (<i>Q</i><sup>2</sup>/2)(1/<i>C</i><sub>1</sub> + 1/<i>C</i><sub>2</sub>) = <i>Q</i><sup>2</sup>/2<i>C</i><sub>eq</sub> = (${p(S.Q * 1e6, 0)} µC)<sup>2</sup>/(2 × ${p(S.C * 1e6, 3)} µF) = ${p(P5.U * 1e6, 0)} µJ</div><p><i>Q</i>Δ<i>V</i> = ${p(P5.unums[0], 0)} µJ 是电池提供的能量；其中一半在导线中以热的形式损失。${p(P5.unums[1], 0)} µJ 是并联时的结果。</p>` },
  ],
  6: [
    { q: `本页的极板充电到 ${V0} V 后断开电源，然后用 κ = ${KA} 的电介质板填满两极间。电势差变为`,
      choices: P6.nums.map(x => `${p(x, 1)} V`), answer: 1, nums: P6.nums,
      why: `<p>断开电源后 <i>Q</i> 不变。介质板表面的束缚电荷抵消了一部分电场：<i>E</i> = <i>E</i><sub>0</sub>/κ，所以</p><div class="eq">Δ<i>V</i> = <i>Ed</i> = Δ<i>V</i><sub>0</sub>/κ = ${V0}/${KA} = ${p(P6.V, 1)} V</div><p>也可以这样看：<i>C</i> 增大为 κ 倍，Δ<i>V</i> = <i>Q</i>/<i>C</i> 减小为 1/κ。只有电池仍接着时才保持 ${V0} V。</p>` },
    { q: `解答题。本页的极板（<i>A</i> = ${p(A, 2)} m²，<i>d</i> = ${p(d * 100, 0)} cm）间填满一种电介质，其相对介电常数沿间隙线性增大，κ(<i>x</i>) = 1 + 2<i>x</i>/<i>d</i>，从一块极板处的 1 增大到另一块极板处的 3。推导电容并求出其值。`,
      solution: `<p>自由电荷 ±<i>Q</i> 位于极板上；对电介质应用高斯定理，深度 <i>x</i> 处的电场为 <i>E</i>(<i>x</i>) = σ/κ(<i>x</i>)ε<sub>0</sub>，σ = <i>Q</i>/<i>A</i>。沿间隙积分：</p><div class="eq">Δ<i>V</i> = ∫<sub>0</sub><sup><i>d</i></sup> σ <i>dx</i> / ε<sub>0</sub>(1 + 2<i>x</i>/<i>d</i>) = (σ<i>d</i>/2ε<sub>0</sub>) ln 3</div><div class="eq"><i>C</i> = <i>Q</i>/Δ<i>V</i> = 2ε<sub>0</sub><i>A</i>/(<i>d</i> ln 3) = (2/ln 3)<i>C</i><sub>0</sub> = ${p(P6b.C / C0, 3)} × ${p(C0 * 1e12, 2)} pF = ${p(P6b.C * 1e12, 2)} pF</div><p>检验：结果介于 <i>C</i><sub>0</sub>（κ = 1）与 3<i>C</i><sub>0</sub>（κ = 3）之间，且小于简单平均值 2<i>C</i><sub>0</sub>，因为沿间隙叠放的各薄层是<b>串联</b>的。</p>`, val: P6b.C },
  ],
  7: [
    { q: `本页的极板一直接在 ${V0} V 电池上（<i>Q</i><sub>0</sub> = ${p(Q0 * 1e12, 0)} pC），κ = ${KA} 的电介质板完全插入。电池向 + 极板搬运了多少电荷？`,
      choices: P7.nums.map(x => `${p(x, 0)} pC`), answer: 3, nums: P7.nums,
      why: `<p>接着电源时 Δ<i>V</i> 保持 ${V0} V，<i>C</i> 变为 κ<i>C</i><sub>0</sub>，所以电荷量变为 κ<i>Q</i><sub>0</sub> = ${p(P7.nums[0], 0)} pC。流上去的是两者之差：</p><div class="eq">Δ<i>Q</i> = (κ − 1)<i>Q</i><sub>0</sub> = ${KA - 1} × ${p(Q0 * 1e12, 0)} pC = ${p(P7.dQ * 1e12, 0)} pC</div><p>${p(P7.nums[0], 0)} pC 是最终的总量，而不是增加的量。</p>` },
    { q: `本页的极板（边长 ${p(P7b.side * 100, 0)} cm，没有介质板时 <i>U</i><sub>0</sub> = ${p(U0 * 1e9, 1)} nJ）充电后断开电源。κ = ${KA} 的介质板插入一半，插入深度为 <i>s</i> 时 <i>C</i>(<i>s</i>) = <i>C</i><sub>0</sub>(1 + (κ − 1)<i>s</i>/ℓ)。把介质板吸进去的力为`,
      choices: P7b.nums.map(x => `${p(x, 1)} nN`), answer: 1, nums: P7b.nums,
      why: `<p><i>Q</i> 不变时 <i>U</i> = <i>Q</i><sup>2</sup>/2<i>C</i>(<i>s</i>)，力沿能量下降的方向：</p><div class="eq"><i>F</i> = −<i>dU</i>/<i>ds</i> = (<i>Q</i><sup>2</sup>/2<i>C</i><sup>2</sup>) <i>dC</i>/<i>ds</i> = <i>U</i><sub>0</sub>(κ − 1) / ℓ(1 + (κ − 1)<i>s</i>/ℓ)<sup>2</sup> = ${p(U0 * 1e9, 1)} nJ × ${KA - 1} / (${P7b.side} m × ${p((1 + (KA - 1) * P7b.x) ** 2, 0)}) = ${p(P7b.F * 1e9, 1)} nN</div><p>为正：介质板插入时 <i>U</i> 减小，所以它被吸进去。${p(P7b.nums[0], 1)} nN 是 Δ<i>V</i> 保持 ${V0} V 时的答案，而电池断开后并非如此。</p>` },
  ],
  8: [
    { q: '一个点电荷 +<i>q</i> 位于一个不带电的空心导体球空腔的中心。达到静电平衡时，内表面和外表面上的电荷分别为',
      choices: ['内表面 0，外表面 0', '内表面 −<i>q</i>，外表面 0', '内表面 −<i>q</i>，外表面 +<i>q</i>', '内表面 +<i>q</i>，外表面 −<i>q</i>'], answer: 2,
      why: '<p>在金属内部取高斯面，面上 <i>E</i> = 0，所以它所围的电荷为零：内表面必须带 −<i>q</i>。球壳整体不带电，所以外表面剩下 +<i>q</i>。在外部，电场就是位于球心的 +<i>q</i> 的电场。</p>' },
    { q: `本页不带电的球（<i>R</i> = ${p(cR * 100, 0)} cm，<i>E</i><sub>0</sub> = ${cE} V/m）上 σ = 3ε<sub>0</sub><i>E</i><sub>0</sub> cos θ。朝向电场下游的半球（0 ≤ θ ≤ 90°）上的总电荷为`,
      choices: P8.nums.map(x => `${p(x, 3)} nC`), answer: 3, nums: P8.nums,
      why: `<p>宽 <i>R dθ</i> 的环带面积为 2π<i>R</i><sup>2</sup> sin θ <i>dθ</i>：</p><div class="eq"><i>q</i> = ∫<sub>0</sub><sup>π/2</sup> 3ε<sub>0</sub><i>E</i><sub>0</sub> cos θ · 2π<i>R</i><sup>2</sup> sin θ <i>dθ</i> = 3ε<sub>0</sub><i>E</i><sub>0</sub>π<i>R</i><sup>2</sup> = ${p(P8.q * 1e9, 3)} nC</div><p>cos θ 在半球面上按面积的平均值是 ½，所以 σ<sub>max</sub> × 2π<i>R</i><sup>2</sup>（${p(P8.nums[0], 3)} nC）大了一倍。在<b>整个</b>球面上总和为零。</p>` },
  ],
};
