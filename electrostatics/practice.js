// electrostatics/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const g = (x, n = 3) => x.toPrecision(n);
const sci = (x, n = 2) => { const e = Math.floor(Math.log10(Math.abs(x))), m = x / 10 ** e; return `${m.toFixed(n)} × 10<sup>${e < 0 ? '−' + -e : e}</sup>`; };
const K = M.K, nC = M.nC, uC = M.uC;

// ---- page 0: two metal spheres touched; a rod with λ = cx ----
const P0 = { q1: 6, q2: -2 };                                   // nC
P0.each = (P0.q1 + P0.q2) / 2;
P0.nums = [(Math.abs(P0.q1) + Math.abs(P0.q2)) / 2, P0.each, NaN, 0];   // added sizes · right · no flow · cancelled
const P0b = { c: 40 * nC, L: 0.50 };                           // λ = c x (C/m², m)
P0b.Q = P0b.c * P0b.L ** 2 / 2;
P0b.nums = [P0b.c * P0b.L ** 3 / 3, P0b.c * P0b.L ** 2, P0b.Q, P0b.c * P0b.L].map(q => q / M.QE);   // ∫x² · forgot ½ · right · λ(L)·1 m
// ---- page 1: the grounding current ----
const P1 = { I0: 2.4e-3, tau: 1.5e-6 };
P1.n = P1.I0 * P1.tau / M.QE;
P1.nums = [P1.n * (1 - 1 / Math.E), P1.n / 2, P1.n / Math.E, P1.n];   // stopped at τ · triangle · I(τ)·τ · right
// ---- page 2: the page's pair at 20 cm; work as a like pair flies apart ----
const P2 = { r: 0.20 };
P2.F = M.coulomb(M.PAIR.q1, M.PAIR.q2, P2.r);
P2.nums = [K * M.PAIR.q1 * -M.PAIR.q2 / P2.r, M.coulomb(M.PAIR.q1, M.PAIR.q1, P2.r), P2.F, P2.F / 2];   // 1/r · q1² · right · "smaller charge, smaller force"
const P2b = { q1: M.PAIR.q1, q2: M.PAIR.like, r1: 0.20, r2: 0.40 };
P2b.W = K * P2b.q1 * P2b.q2 * (1 / P2b.r1 - 1 / P2b.r2);
{ const F = r => M.coulomb(P2b.q1, P2b.q2, r), dr = P2b.r2 - P2b.r1;
  P2b.nums = [F(P2b.r1) * dr, F(P2b.r2) * dr, (F(P2b.r1) + F(P2b.r2)) / 2 * dr, P2b.W]; }   // start force · end force · mean force · right
// ---- page 3: the page's balance point and its stiffness ----
const { qA, qB, D, q0 } = M.LINE;
const P3 = { x: M.LINE.xEq };
P3.nums = [D * Math.sqrt(qB) / (Math.sqrt(qA) + Math.sqrt(qB)), D * qA / (qA + qB), D / 2, P3.x].map(x => x * 100);   // nearer A · no root · midpoint · right
P3.k = 2 * K * q0 * (qA / P3.x ** 3 + qB / (D - P3.x) ** 3);
P3.nums2 = [P3.k, P3.k / 2, 2 * K * q0 * Math.abs(qA / P3.x ** 3 - qB / (D - P3.x) ** 3), K * q0 * (qA / P3.x ** 2 + qB / (D - P3.x) ** 2)];   // right · lost the 2 · subtracted · not differentiated
// ---- page 4: a −1 nC charge; a test charge moving out ----
const P4 = { Q: M.POINT.Q, r: 0.20 };
P4.E = M.pointMag(P4.Q, P4.r);
P4.nums = [P4.E, NaN, K * P4.Q / P4.r, K * P4.Q / (P4.r * 100) ** 2];
const P4b = { r: 0.20, v: 0.050 };
P4b.rate = 2 * K * M.POINT.Q * P4b.v / P4b.r ** 3;
P4b.nums = [P4b.rate / 2, P4b.rate, 2 * K * M.POINT.Q * P4b.v / P4b.r ** 2, 2 * K * M.POINT.Q * P4b.v / P4b.r ** 4];   // lost the 2 · right · one r short · one r too many
// ---- page 5: the page's dipole on its bisector ----
const P5 = { y: 0.10 }, dq = M.DIPOLE.q, da = M.DIPOLE.a;
P5.E = M.dipoleBisector(P5.y);
P5.nums = [2 * K * dq * da / P5.y ** 3, P5.E, 2 * K * dq / (da * da + P5.y * P5.y), P5.E / 2];   // far-field · right · no cos θ · one charge only
// ---- page 6: the page's rod, on its axis ----
const P6 = { a: 0.10 };
P6.E = M.rodAxis(P6.a);
P6.nums = [K * M.RODE.Q / P6.a ** 2, K * M.RODE.Q / (P6.a + M.RODE.L / 2) ** 2, P6.E, K * M.RODE.lambda / P6.a];   // all at the end · all at the middle · right · kλ/a
// ---- page 7: the page's ring at z = 15 cm; where it peaks ----
const P7 = { z: 0.15 }, RR = M.RING.R, RQ = M.RING.Q;
P7.E = M.ringAxis(P7.z);
P7.nums = [K * RQ / (P7.z ** 2 + RR ** 2), P7.E, K * RQ / P7.z ** 2, K * RQ * RR / (P7.z ** 2 + RR ** 2) ** 1.5];   // no cos φ · right · point charge · sin φ
P7.nums2 = [RR, RR / 2, RR * Math.SQRT2, RR / Math.SQRT2].map(x => x * 100);
// ---- page 8: the page's electron; a field that grows along the plates ----
const PL = M.PLATES;
const P8 = { nums: [2 * PL.yExit, 4 * PL.yExit, PL.yProton, PL.yExit].map(y => y * 1000) };     // forgot ½ · t = 2L/v₀ · proton · right
const P8b = { vy: PL.vyExit / 2 };
P8b.nums = [PL.vyExit, P8b.vy, PL.vyExit / 3, PL.vyExit / 4].map(v => v / 1e6);

const mm = x => x < 0.01 ? p(x, 5) : g(x);

export const PRACTICE = {
  0: [
    { q: `两个相同的金属球分别带 +${P0.q1} nC 和 −${-P0.q2} nC。让它们接触后再分开，此时每个球带电`,
      choices: [`+${p(P0.nums[0], 0)} nC`, `+${p(P0.each, 0)} nC`, `+${P0.q1 / 2} nC 和 −${-P0.q2 / 2} nC`, '0'], answer: 1, nums: P0.nums,
      why: `<p>电荷守恒：总电荷量 ${P0.q1} + (−${-P0.q2}) = +${P0.q1 + P0.q2} nC，由两个相同的球平分。</p><div class="eq"><i>q</i> = (${P0.q1} − ${-P0.q2})/2 = +${p(P0.each, 0)} nC（每个）</div><p>把大小直接相加（+${p(P0.nums[0], 0)} nC）忽略了正负号；带负电的球上的电子中和了带正电的球的一部分电荷。</p>` },
    { q: `一根细塑料棒沿 <i>x</i> 轴从 0 放到 ${p(P0b.L, 2)} m，线电荷密度 λ = <i>cx</i>，<i>c</i> = +${p(P0b.c / nC, 0)} nC/m²。它失去了多少个电子？`,
      choices: P0b.nums.map(n => sci(n)), answer: 2, nums: P0b.nums,
      why: `<p>λ 沿棒变化，所以要把各小段 d<i>q</i> = λ d<i>x</i> 加起来：</p><div class="eq"><i>Q</i> = ∫<sub>0</sub><sup><i>L</i></sup> <i>cx</i> d<i>x</i> = <i>cL</i>²/2 = ${p(P0b.c / nC, 0)} × ${p(P0b.L, 2)}²/2 = ${p(P0b.Q / nC, 2)} nC</div><div class="eq"><i>n</i> = <i>Q</i>/<i>e</i> = ${p(P0b.Q / nC, 2)} × 10<sup>−9</sup>/${sci(M.QE)} = ${sci(P0b.nums[2])}</div><p>漏掉 ½（用棒远端的 λ 乘以长度）会得到两倍的电子数。</p>` },
  ],
  1: [
    { q: '本页那个中性金属球：把带负电的棒移近，将球接地，断开接地线，然后移走棒。球最终',
      choices: ['不带电', '带负电，均匀分布在表面', '带正电，均匀分布在表面', '带正电，集中在棒原来所在的一侧'], answer: 2,
      why: `<p>棒把球内的自由电子推到远侧，接地让其中一部分电子流走。先断开接地，就把电子的缺额留在了球上：球带正电（这里是 +${p(M.QG / nC, 2)} nC），与棒的电性相反。棒移走后，没有什么再把电荷吸在一侧，于是电荷均匀分布在表面。</p>` },
    { q: `在另一个感应起电装置中，球接地期间接地线中的电流为 <i>I</i>(<i>t</i>) = <i>I</i><sub>0</sub><i>e</i><sup>−<i>t</i>/τ</sup>，<i>I</i><sub>0</sub> = ${p(P1.I0 * 1e3, 1)} mA，τ = ${p(P1.tau * 1e6, 1)} μs。一共有多少个电子流走？`,
      choices: P1.nums.map(n => sci(n)), answer: 3, nums: P1.nums,
      why: `<p>电荷量是电流对时间的积分：</p><div class="eq"><i>Q</i> = ∫<sub>0</sub><sup>∞</sup> <i>I</i><sub>0</sub><i>e</i><sup>−<i>t</i>/τ</sup> d<i>t</i> = <i>I</i><sub>0</sub>τ = ${p(P1.I0 * P1.tau / nC, 2)} nC，&nbsp;<i>n</i> = <i>Q</i>/<i>e</i> = ${sci(P1.n)}</div><p>只积分到 <i>t</i> = τ，只算到其中的 63%，即 ${sci(P1.nums[0])}。</p>` },
  ],
  2: [
    { q: `本页的 +${M.PAIR.q1 / uC} μC 和 −${-M.PAIR.q2 / uC} μC 两个电荷相距 ${p(P2.r * 100, 0)} cm。−${-M.PAIR.q2 / uC} μC 电荷受力的大小为`,
      choices: P2.nums.map(x => `${g(x)} N`), answer: 2, nums: P2.nums,
      why: `<div class="eq"><i>F</i> = <i>k</i>|<i>q</i><sub>1</sub><i>q</i><sub>2</sub>|/<i>r</i>² = ${sci(K)} × (${M.PAIR.q1 / uC} × 10<sup>−6</sup>)(${-M.PAIR.q2 / uC} × 10<sup>−6</sup>)/(${p(P2.r, 2)})² = ${g(P2.F)} N</div><p>两个电荷受到的力都是 ${g(P2.F)} N，是一对作用力与反作用力；电荷量较小的那个受的力并不是一半（${g(P2.nums[3])} N）。</p>` },
    { q: `本页的一对同种电荷 +${P2b.q1 / uC} μC 和 +${P2b.q2 / uC} μC 相距 ${p(P2b.r1 * 100, 0)} cm，被固定住。释放 +${P2b.q2 / uC} μC 电荷（另一个保持固定）。当两者相距 ${p(P2b.r2 * 100, 0)} cm 时，电场力对它做了多少功？`,
      choices: P2b.nums.map(x => `${g(x)} J`), answer: 3, nums: P2b.nums,
      why: `<p>运动过程中力在变化，所以要积分：</p><div class="eq"><i>W</i> = ∫<sub><i>r</i><sub>1</sub></sub><sup><i>r</i><sub>2</sub></sup> <i>kq</i><sub>1</sub><i>q</i><sub>2</sub>/<i>r</i>² d<i>r</i> = <i>kq</i><sub>1</sub><i>q</i><sub>2</sub>(1/<i>r</i><sub>1</sub> − 1/<i>r</i><sub>2</sub>) = ${g(K * P2b.q1 * P2b.q2)} × (${p(1 / P2b.r1, 1)} − ${p(1 / P2b.r2, 1)}) = ${g(P2b.W)} J</div><p>用初始的力乘以距离（${g(P2b.nums[0])} J）偏大：推力按 1/<i>r</i>² 减弱。取首末两个力的平均值（${g(P2b.nums[2])} J）也不对，因为 <i>F</i> 与 <i>r</i> 不成线性关系。</p>` },
  ],
  3: [
    { q: `本页中 A（+${qA / uC} μC）和 B（+${qB / uC} μC）相距 ${p(D * 100, 0)} cm。两者之间的试探电荷在距 A 多远处所受合力为零？`,
      choices: P3.nums.map(x => `${p(x, 1)} cm`), answer: 3, nums: P3.nums,
      why: `<div class="eq"><i>kq</i><sub>A</sub>/<i>x</i>² = <i>kq</i><sub>B</sub>/(<i>d</i> − <i>x</i>)² &nbsp;→&nbsp; (<i>d</i> − <i>x</i>)/<i>x</i> = √(<i>q</i><sub>B</sub>/<i>q</i><sub>A</sub>) = ${p(Math.sqrt(qB / qA), 2)} &nbsp;→&nbsp; <i>x</i> = ${p(P3.x * 100, 1)} cm</div><p>平衡点更靠近电荷量<b>较小</b>的 B。按电荷量之比分割 <i>d</i>（${p(P3.nums[1], 1)} cm）忘了力与 1/<i>r</i>² 成正比，所以距离之比应是电荷量之比的平方根。</p>` },
    { q: `把 +${p(q0 / uC, 1)} μC 试探电荷从该平衡点沿直线轻推一小段距离 <i>s</i>，此时合力 <i>F</i> ≈ −κ<i>s</i>。κ 为`,
      choices: P3.nums2.map(x => `${g(x)} N/m`), answer: 0, nums: P3.nums2,
      why: `<p>κ 是 <i>x</i><sub>eq</sub> 处的 −d<i>F</i>/d<i>x</i>，其中 <i>F</i>(<i>x</i>) = <i>kq</i><sub>0</sub><i>q</i><sub>A</sub>/<i>x</i>² − <i>kq</i><sub>0</sub><i>q</i><sub>B</sub>/(<i>d</i> − <i>x</i>)²：</p><div class="eq">κ = 2<i>kq</i><sub>0</sub>[<i>q</i><sub>A</sub>/<i>x</i>³ + <i>q</i><sub>B</sub>/(<i>d</i> − <i>x</i>)³] = ${g(P3.k)} N/m</div><p>两项相加：向 B 移动时，A 的推力减弱，<i>同时</i> B 的推力增大，两者都把电荷推回去。两项相减会得到 ${g(P3.nums2[2])} N/m。</p>` },
  ],
  4: [
    { q: `一个 −${M.POINT.Q / nC}.0 nC 的点电荷位于原点。它正东方 ${p(P4.r * 100, 0)} cm 处的电场为`,
      choices: [`${p(P4.E, 0)} N/C，向西`, `${p(P4.E, 0)} N/C，向东`, `${p(P4.nums[2], 1)} N/C，向西`, `${p(P4.nums[3], 4)} N/C，向西`], answer: 0, nums: P4.nums,
      why: `<div class="eq"><i>E</i> = <i>k</i>|<i>Q</i>|/<i>r</i>² = ${sci(K)} × 1.0 × 10<sup>−9</sup>/(${p(P4.r, 2)})² = ${p(P4.E, 0)} N/C</div><p>负电荷的电场<b>指向</b>它：在它东边的正试探电荷被拉向西。<i>r</i> 用 cm 代入会得到 ${p(P4.nums[3], 4)} N/C；<i>kQ</i>/<i>r</i> 是电势，不是电场。</p>` },
    { q: `一个试探电荷以 ${p(P4b.v * 100, 1)} cm/s 的速度沿直线远离本页的 +${M.POINT.Q / nC} nC 电荷。当它距电荷 ${p(P4b.r * 100, 0)} cm 时，它所在位置的电场减小得有多快？`,
      choices: P4b.nums.map(x => `${g(x)} N/C 每秒`), answer: 1, nums: P4b.nums,
      why: `<p>用链式法则：<i>E</i>(<i>r</i>) = <i>kQ</i>/<i>r</i>²，而 <i>r</i> 以 <i>v</i> 增大：</p><div class="eq">d<i>E</i>/d<i>t</i> = (d<i>E</i>/d<i>r</i>)(d<i>r</i>/d<i>t</i>) = −(2<i>kQ</i>/<i>r</i>³)<i>v</i> = −2 × ${p(K * M.POINT.Q, 2)} × ${p(P4b.v, 3)}/${p(P4b.r, 2)}³ = −${g(P4b.rate)} N/C 每秒</div><p>求导时漏掉幂次带下来的 2，会得到 ${g(P4b.nums[0])}。</p>` },
  ],
  5: [
    { q: `本页的电偶极子（±${dq / nC} nC，相距 ${p(2 * da * 100, 0)} cm）在中垂线上距中心 ${p(P5.y * 100, 0)} cm 处的电场大小为`,
      choices: P5.nums.map(x => `${p(x, 0)} N/C`), answer: 1, nums: P5.nums,
      why: `<p>每个电荷到该点的距离都是 √(<i>a</i>² + <i>y</i>²) = ${p(Math.hypot(da, P5.y) * 100, 1)} cm，产生的电场为 <i>kq</i>/(<i>a</i>² + <i>y</i>²) = ${p(K * dq / (da * da + P5.y * P5.y), 0)} N/C。<i>y</i> 分量抵消；<i>x</i> 分量各乘以 cos θ = <i>a</i>/√(<i>a</i>² + <i>y</i>²) 后相加：</p><div class="eq"><i>E</i> = 2<i>kqa</i>/(<i>a</i>² + <i>y</i>²)<sup>3/2</sup> = ${p(P5.E, 0)} N/C，平行于轴线，从 + 指向 −</div><p>远场公式 2<i>kqa</i>/<i>y</i>³（${p(P5.nums[0], 0)} N/C）只在 <i>y</i> ≫ <i>a</i> 时成立；这里 <i>y</i> = <i>a</i>。</p>` },
    { q: '一个电偶极子的 +<i>q</i> 位于 <i>x</i> = +<i>a</i>，−<i>q</i> 位于 <i>x</i> = −<i>a</i>。求轴线上 <i>x</i> ≫ <i>a</i> 处的电场，并证明它按 1/<i>x</i>³ 减小。',
      solution: `<p>两个电场都沿轴线方向；较近的 +<i>q</i> 占优：</p><div class="eq"><i>E</i> = <i>kq</i>/(<i>x</i> − <i>a</i>)² − <i>kq</i>/(<i>x</i> + <i>a</i>)² = <i>kq</i> · 4<i>ax</i>/(<i>x</i>² − <i>a</i>²)²</div><p>当 <i>x</i> ≫ <i>a</i> 时，(<i>x</i>² − <i>a</i>²)² → <i>x</i>⁴，所以 <i>E</i> → 4<i>kqa</i>/<i>x</i>³ = 2<i>kp</i>/<i>x</i>³，其中 <i>p</i> = 2<i>qa</i>，方向沿 +<i>x</i>。另一种思路：<i>f</i>(<i>x</i>) = <i>kq</i>/<i>x</i>² 在两个电荷之间的变化约为 <i>f</i>′(<i>x</i>) · (−2<i>a</i>)，所以 <i>E</i> ≈ −2<i>a</i> · (−2<i>kq</i>/<i>x</i>³) = 4<i>kqa</i>/<i>x</i>³。两个电场几乎抵消，剩下的差值比其中任何一个都多衰减一次幂。</p>` },
  ],
  6: [
    { q: `本页的细棒（${p(M.RODE.L * 100, 0)} cm 长，带 +${M.RODE.Q / nC} nC）在轴线上、距一端 ${p(P6.a * 100, 0)} cm 处的电场为`,
      choices: P6.nums.map(x => `${p(x, 0)} N/C`), answer: 2, nums: P6.nums,
      why: `<div class="eq"><i>E</i> = ∫<sub><i>a</i></sub><sup><i>a</i>+<i>L</i></sup> <i>k</i>λ d<i>x</i>/<i>x</i>² = <i>kQ</i>/(<i>a</i>(<i>a</i> + <i>L</i>)) = ${p(K * M.RODE.Q, 2)}/(${p(P6.a, 2)} × ${p(P6.a + M.RODE.L, 2)}) = ${p(P6.E, 0)} N/C</div><p>把全部电荷当作集中在近端（${p(P6.nums[0], 0)} N/C）或中点（${p(P6.nums[1], 0)} N/C）都不对：各小段的距离不同，而 1/<i>x</i>² 的权重不是线性的。</p>` },
    { q: '细棒（线电荷密度 λ，长 <i>L</i>）沿 <i>x</i> 轴从 −<i>L</i>/2 放到 <i>L</i>/2。哪个积分给出其中点正上方距离 <i>a</i> 处的电场？',
      choices: ['∫ <i>k</i>λ d<i>x</i>/(<i>x</i>² + <i>a</i>²)', '∫ <i>k</i>λ<i>x</i> d<i>x</i>/(<i>x</i>² + <i>a</i>²)<sup>3/2</sup>', '∫ <i>k</i>λ d<i>x</i>/(<i>x</i>² + <i>a</i>²)<sup>1/2</sup>', '∫ <i>k</i>λ<i>a</i> d<i>x</i>/(<i>x</i>² + <i>a</i>²)<sup>3/2</sup>'], answer: 3,
      why: '<p>每一小段产生 d<i>E</i> = <i>k</i>λ d<i>x</i>/(<i>x</i>² + <i>a</i>²)。横向分量成对抵消，所以只保留沿 <i>a</i> 方向的部分，乘以 cos θ = <i>a</i>/√(<i>x</i>² + <i>a</i>²)：</p><div class="eq"><i>E</i> = ∫<sub>−<i>L</i>/2</sub><sup><i>L</i>/2</sup> <i>k</i>λ<i>a</i> d<i>x</i>/(<i>x</i>² + <i>a</i>²)<sup>3/2</sup> = <i>kQ</i>/(<i>a</i>√(<i>L</i>²/4 + <i>a</i>²))</div><p>第一个只把大小相加，没有考虑抵消；含 <i>x</i> d<i>x</i> 的积分是横向分量，结果为零；1/2 次幂的那个是电势。</p>' },
  ],
  7: [
    { q: `本页的圆环（+${p(RQ / nC, 0)} nC，<i>R</i> = ${p(RR * 100, 0)} cm）在轴线上距中心 ${p(P7.z * 100, 0)} cm 处的电场为`,
      choices: P7.nums.map(x => `${p(x, 0)} N/C`), answer: 1, nums: P7.nums,
      why: `<p>每一小段到该点的距离都是 √(<i>z</i>² + <i>R</i>²) = ${p(Math.hypot(P7.z, RR) * 100, 0)} cm；只有轴向分量保留下来，cos φ = <i>z</i>/√(<i>z</i>² + <i>R</i>²) = ${p(P7.z / Math.hypot(P7.z, RR), 2)}：</p><div class="eq"><i>E</i> = <i>kQz</i>/(<i>z</i>² + <i>R</i>²)<sup>3/2</sup> = ${p(P7.E, 0)} N/C</div><p>不乘 cos φ 会得到 ${p(P7.nums[0], 0)} N/C；在这个距离上圆环不能当作点电荷（${p(P7.nums[2], 0)} N/C）。</p>` },
    { q: `在该圆环的轴线上，距中心多远处电场最强？`,
      choices: P7.nums2.map(x => `${p(x, 1)} cm`), answer: 3, nums: P7.nums2,
      why: `<p>对 <i>E</i> = <i>kQz</i>(<i>z</i>² + <i>R</i>²)<sup>−3/2</sup> 令 d<i>E</i>/d<i>z</i> = 0：</p><div class="eq"><i>kQ</i>[(<i>z</i>² + <i>R</i>²) − 3<i>z</i>²]/(<i>z</i>² + <i>R</i>²)<sup>5/2</sup> = 0 &nbsp;→&nbsp; <i>z</i> = <i>R</i>/√2 = ${p(P7.nums2[3], 1)} cm</div><p><i>E</i> 在中心为零，在远处按 1/<i>z</i>² 减小，所以峰值在两者之间。</p>` },
  ],
  8: [
    { q: `本页的电子以 ${p(PL.v0 / 1e7, 1)} × 10<sup>7</sup> m/s 的速度平行于 ${p(PL.L * 100, 0)} cm 长的极板射入 ${M.PLATES.E} N/C 的电场。它离开极板时，在垂直方向上偏移了多少？`,
      choices: P8.nums.map(x => `${mm(x)} mm`), answer: 3, nums: P8.nums,
      why: `<p>垂直方向受恒力，平行方向不受力：这是抛体运动。</p><div class="eq"><i>a</i> = <i>eE</i>/<i>m</i><sub>e</sub> = ${sci(PL.a)} m/s²，&nbsp;<i>t</i> = <i>L</i>/<i>v</i><sub>0</sub> = ${p(PL.tCross * 1e9, 1)} ns，&nbsp;<i>y</i> = ½<i>at</i>² = ${mm(P8.nums[3])} mm</div><p>漏掉 ½ 会使结果加倍。用质子的质量会得到 ${mm(P8.nums[2])} mm，只有电子的 1/${p(M.MP / M.ME, 0)}。</p>` },
    { q: `假设极板间的电场沿极板方向增大，<i>E</i> = <i>E</i><sub>0</sub><i>x</i>/<i>L</i>（远端 <i>E</i><sub>0</sub> = ${M.PLATES.E} N/C）。电子离开极板时的垂直速度为`,
      choices: P8b.nums.map(x => `${p(x, 2)} × 10<sup>6</sup> m/s`), answer: 1, nums: P8b.nums,
      why: `<p><i>x</i> = <i>v</i><sub>0</sub><i>t</i>，所以垂直方向的加速度随时间增大，<i>a</i>(<i>t</i>) = (<i>eE</i><sub>0</sub>/<i>m</i>)(<i>v</i><sub>0</sub><i>t</i>/<i>L</i>)：</p><div class="eq"><i>v<sub>y</sub></i> = ∫<sub>0</sub><sup><i>L</i>/<i>v</i><sub>0</sub></sup> (<i>eE</i><sub>0</sub><i>v</i><sub>0</sub>/<i>mL</i>) <i>t</i> d<i>t</i> = ½(<i>eE</i><sub>0</sub>/<i>m</i>)(<i>L</i>/<i>v</i><sub>0</sub>) = ${p(P8b.vy / 1e6, 2)} × 10<sup>6</sup> m/s</div><p>是匀强电场时（${p(PL.vyExit / 1e6, 2)} × 10<sup>6</sup> m/s）的一半：平均来看电场只有一半强。</p>` },
  ],
};
