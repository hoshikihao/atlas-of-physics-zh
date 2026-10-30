// gauss/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const g = (x, n = 3) => x.toPrecision(n);
const K = M.K, E0 = M.EPS0, PI = Math.PI;

// ---- page 0: the page's square at 60°; a field that grows across a square ----
const P0 = { th: 60 };
P0.F = M.flux(P0.th);
P0.nums = [M.FLUX.E * M.FLUX.A * Math.sin(P0.th * PI / 180), P0.F, M.FLUX.max, M.FLUX.E * M.FLUX.side * Math.cos(P0.th * PI / 180)];   // sin · right · face on · side not area
const P0b = { b: 3.0e4, s: 0.20 };
P0b.F = P0b.b * P0b.s ** 3 / 2;
P0b.nums = [P0b.b * P0b.s ** 3, P0b.b * P0b.s ** 3 / 3, P0b.b * P0b.s ** 2 / 2, P0b.F];   // E at the far edge × A · ∫y² · lost an s · right
// ---- page 1: a cube around the page's charge; E = c r inside a sphere ----
const P1 = { q: M.POINT.q };
P1.nums = [P1.q / (6 * E0), P1.q / E0, K * P1.q, P1.q / (2 * E0)];
const P1b = { c: 5.0e4, R: 0.10 };
P1b.q = 4 * PI * E0 * P1b.c * P1b.R ** 3;
P1b.nums = [E0 * P1b.c * P1b.R ** 3, 4 * PI * E0 * P1b.c * P1b.R ** 2, 4 / 3 * PI * E0 * P1b.c * P1b.R ** 3, P1b.q].map(q => q * 1e9);   // no 4π · lost an R · volume, not area · right
// ---- page 2: the page's line, at 5 cm; potential difference out to 20 cm ----
const lam = M.LINE.lam;
const P2 = { r: 0.05 };
P2.nums = [K * lam / P2.r, M.lineE(P2.r), 2 * K * lam / P2.r ** 2, lam / (2 * E0 * P2.r)];   // lost 2 · right · 1/r² · lost π
const P2b = { r1: 0.05, r2: 0.20 };
P2b.dV = 2 * K * lam * Math.log(P2b.r2 / P2b.r1);
P2b.nums = [2 * K * lam * (1 / P2b.r1 - 1 / P2b.r2), M.lineE(P2b.r1) * (P2b.r2 - P2b.r1), P2b.dV, M.lineE(P2b.r2) * (P2b.r2 - P2b.r1)];
// ---- page 3: two sheets ±σ; a slab with ρ = ρ₀|x|/d ----
const sg = M.SHEET.sigma;
const P3 = { nums: [sg / E0, sg / (2 * E0), 0, 2 * sg / E0] };      // field between the sheets, per choice
const P3b = { rho0: 4.0e-7, d: 0.05, x: 0.02 };
P3b.E = P3b.rho0 * P3b.x ** 2 / (2 * E0 * P3b.d);
P3b.nums = [2 * P3b.E, P3b.E, P3b.rho0 * P3b.x / (2 * E0), P3b.E / 2];   // one cap · right · ρ₀ uniform · lost a 2
// ---- page 4: field energy outside the page's metal sphere ----
const { Q, R } = M.SPH;
const P4 = { U: K * Q * Q / (2 * R) };
P4.nums = [2 * P4.U, P4.U / 2, P4.U / 3, P4.U].map(u => u * 1e6);   // kQ²/R · only out to 2R · surface density × sphere's volume · right
// ---- page 5: the page's insulating sphere at R/2 ----
const P5 = { r: R / 2 };
P5.E = M.iSphere.E(P5.r);
P5.nums = [K * Q / P5.r ** 2, P5.E, 0, 3 * P5.E];
// ---- page 6: the page's insulating rod at R/2 ----
const P6 = { r: M.ROD.R / 2 };
P6.E = M.iRod.E(P6.r);
P6.nums = [0, 2 * K * M.ROD.lam / P6.r, P6.E, M.ROD.lam * P6.r / (2 * E0 * M.ROD.R ** 2)];   // metal · outside formula · right · lost π
// ---- page 7: the page's ρ = br sphere at R/2; ρ = br² ----
const P7 = { r: R / 2 };
P7.E = M.nSphere.E(P7.r);
P7.nums = [M.nSphere.rho(P7.r) * P7.r / (3 * E0), M.iSphere.E(P7.r), P7.E, 4 * P7.E];   // local ρ as if uniform · uniform sphere · right · lost the 4
const P7b = { nums: [1 / 8, 1 / 32, 1 / 16, 1 / 4] };
// ---- page 8: the induced charge on the cage's right half ----
const P8 = { q: 3 * E0 * M.CAGE.E0 * PI * M.CAGE.R ** 2 };
P8.nums = [0, P8.q, 2 * P8.q, P8.q / 3].map(q => q * 1e9);   // net zero · right · σ_max × area · lost the 3

const fr = x => ({ 0.125: '1/8', 0.03125: '1/32', 0.0625: '1/16', 0.25: '1/4' })[x];

export const PRACTICE = {
  0: [
    { q: `本页边长 ${p(M.FLUX.side * 100, 0)} cm 的正方形处在 ${p(M.FLUX.E / 1000, 1)} kN/C 的匀强电场中，它的面积矢量与 <b>E</b> 成 ${P0.th}°。穿过它的电通量为`,
      choices: P0.nums.map(x => `${p(x, 1)} N·m²/C`), answer: 1, nums: P0.nums,
      why: `<div class="eq">Φ = <i>EA</i> cos θ = ${M.FLUX.E} × ${p(M.FLUX.A, 3)} m² × cos ${P0.th}° = ${p(P0.F, 1)} N·m²/C</div><p>θ 是从<b>面积矢量</b>（法线）量起的，所以用 cos，而不是 sin；只有当 θ 是与面本身的夹角时，才该用 sin。</p>` },
    { q: `电场 <b>E</b> = <i>by</i> <b>x̂</b>，<i>b</i> = ${p(P0b.b / 1e4, 1)} × 10<sup>4</sup> N/C 每米，穿过 <i>yz</i> 平面内边长 ${p(P0b.s * 100, 0)} cm 的正方形，0 ≤ <i>y</i> ≤ ${p(P0b.s, 2)} m。穿过该正方形（法线为 +<b>x̂</b>）的电通量为`,
      choices: P0b.nums.map(x => `${g(x)} N·m²/C`), answer: 3, nums: P0b.nums,
      why: `<p><i>E</i> 在正方形上各处不同，所以把它切成宽 d<i>y</i>、长 <i>s</i> 的窄条，每条的电通量为 <i>E</i>(<i>y</i>) <i>s</i> d<i>y</i>：</p><div class="eq">Φ = ∫<sub>0</sub><sup><i>s</i></sup> <i>by</i> · <i>s</i> d<i>y</i> = <i>bs</i>³/2 = ${g(P0b.F)} N·m²/C</div><p>整个正方形都用远边处的电场，会得到它的两倍，${g(P0b.nums[0])}。</p>` },
  ],
  1: [
    { q: `本页 ${p(P1.q * 1e9, 1)} nC 的电荷位于一个立方体的中心。穿过立方体<b>一个</b>面的电通量为`,
      choices: P1.nums.map(x => `${p(x, 1)} N·m²/C`), answer: 0, nums: P1.nums,
      why: `<p>由高斯定理，整个立方体的电通量是 <i>q</i>/ε<sub>0</sub> = ${p(P1.nums[1], 0)} N·m²/C。由对称性，六个面各分得相同的一份：</p><div class="eq">Φ<sub>面</sub> = <i>q</i>/6ε<sub>0</sub> = ${p(P1.nums[0], 1)} N·m²/C</div><p><i>kq</i> = ${p(P1.nums[2], 2)} 的单位也是 N·m²/C，但它是 <i>q</i>/4πε<sub>0</sub>，并不是穿过任何面的电通量。</p>` },
    { q: `某区域内电场沿径向，<i>E</i> = <i>cr</i>，<i>c</i> = ${p(P1b.c / 1e4, 1)} × 10<sup>4</sup> N/C 每米。以原点为球心、半径 ${p(P1b.R * 100, 0)} cm 的球内有多少电荷？`,
      choices: P1b.nums.map(x => `${g(x)} nC`), answer: 3, nums: P1b.nums,
      why: `<p>球面上 <b>E</b> ∥ d<b>A</b>，且处处 <i>E</i> = <i>cR</i>，所以</p><div class="eq">∮<b>E</b> · d<b>A</b> = <i>cR</i> · 4π<i>R</i>² = <i>q</i><sub>enc</sub>/ε<sub>0</sub> &nbsp;→&nbsp; <i>q</i><sub>enc</sub> = 4πε<sub>0</sub><i>cR</i>³ = ${g(P1b.q * 1e9)} nC</div><p>球面面积是 4π<i>R</i>²，而不是 ⁴⁄₃π<i>R</i>³：电通量是对面积的积分。</p>` },
  ],
  2: [
    { q: `本页的带电直线 λ = ${p(lam * 1e9, 1)} nC/m。距它 ${p(P2.r * 100, 0)} cm 处的电场为`,
      choices: P2.nums.map(x => `${p(x, 0)} N/C`), answer: 1, nums: P2.nums,
      why: `<p>取同轴圆柱面：底面没有电通量，<i>E</i> · 2π<i>rL</i> = λ<i>L</i>/ε<sub>0</sub>，所以</p><div class="eq"><i>E</i> = λ/2πε<sub>0</sub><i>r</i> = 2<i>k</i>λ/<i>r</i> = ${p(P2.nums[1], 0)} N/C</div><p>带电直线的电场按 1/<i>r</i> 减小，而不是按 1/<i>r</i>² 减小（${p(P2.nums[2], 0)} N/C）。</p>` },
    { q: `距该直线 ${p(P2b.r1 * 100, 0)} cm 处的电势比距它 ${p(P2b.r2 * 100, 0)} cm 处高多少？`,
      choices: P2b.nums.map(x => `${p(x, 1)} V`), answer: 2, nums: P2b.nums,
      why: `<div class="eq"><i>V</i>(<i>r</i><sub>1</sub>) − <i>V</i>(<i>r</i><sub>2</sub>) = ∫<sub><i>r</i><sub>1</sub></sub><sup><i>r</i><sub>2</sub></sup> (2<i>k</i>λ/<i>r</i>) d<i>r</i> = 2<i>k</i>λ ln(<i>r</i><sub>2</sub>/<i>r</i><sub>1</sub>) = ${p(2 * K * lam, 2)} × ln ${p(P2b.r2 / P2b.r1, 0)} = ${p(P2b.dV, 1)} V</div><p>1/<i>r</i> 积分得到对数。按点电荷的习惯写成 1/<i>r</i><sub>1</sub> − 1/<i>r</i><sub>2</sub>，会得到 ${p(P2b.nums[0], 1)} V；用近处的电场乘以距离得到 ${p(P2b.nums[1], 1)} V，忽略了 <i>E</i> 在减小。</p>` },
  ],
  3: [
    { q: `两块平行的不导电大平板分别带 +σ 和 −σ，σ = ${p(sg * 1e9, 1)} nC/m²。电场为`,
      choices: [`两板之间 ${p(P3.nums[0], 0)} N/C，外侧为 0`, `两板之间和外侧都是 ${p(P3.nums[1], 0)} N/C`, `两板之间为 0，外侧为 ${p(P3.nums[0], 0)} N/C`, `两板之间 ${p(P3.nums[3], 0)} N/C，外侧为 0`], answer: 0, nums: P3.nums,
      why: `<p>每块板单独在两侧产生 σ/2ε<sub>0</sub> = ${p(P3.nums[1], 0)} N/C 的电场，背离 +、指向 −。在两板之间两个电场同向，相加；在外侧方向相反，抵消：</p><div class="eq">两板之间 <i>E</i> = σ/2ε<sub>0</sub> + σ/2ε<sub>0</sub> = σ/ε<sub>0</sub> = ${p(P3.nums[0], 0)} N/C</div>` },
    { q: `一块不导电的厚板充满 −<i>d</i> ≤ <i>x</i> ≤ <i>d</i>（<i>d</i> = ${p(P3b.d * 100, 0)} cm），ρ = ρ<sub>0</sub>|<i>x</i>|/<i>d</i>，ρ<sub>0</sub> = ${p(P3b.rho0 * 1e7, 1)} × 10<sup>−7</sup> C/m³。<i>x</i> = ${p(P3b.x * 100, 0)} cm 处的电场为`,
      choices: P3b.nums.map(x => `${g(x)} N/C`), answer: 1, nums: P3b.nums,
      why: `<p>取一个底面积为 <i>A</i>、从 −<i>x</i> 延伸到 <i>x</i> 的扁圆柱高斯面。由对称性，电场从<b>两个</b>底面穿出：</p><div class="eq">2<i>EA</i> = (1/ε<sub>0</sub>) · 2<i>A</i>∫<sub>0</sub><sup><i>x</i></sup> ρ<sub>0</sub><i>x</i>′/<i>d</i> d<i>x</i>′ = <i>A</i>ρ<sub>0</sub><i>x</i>²/ε<sub>0</sub><i>d</i> &nbsp;→&nbsp; <i>E</i> = ρ<sub>0</sub><i>x</i>²/2ε<sub>0</sub><i>d</i> = ${g(P3b.E)} N/C</div><p>只算一个底面会使结果加倍（${g(P3b.nums[0])} N/C）。</p>` },
  ],
  4: [
    { q: '一个带电 +<i>Q</i> 的金属球位于一个同心厚金属球壳的中心，球壳的净电荷为 −3<i>Q</i>。球壳<b>外</b>表面上的电荷为',
      choices: ['−3<i>Q</i>', '−<i>Q</i>', '+<i>Q</i>', '−2<i>Q</i>'], answer: 3,
      why: '<p>在球壳金属内部取高斯球面，面上 <i>E</i> = 0，所以它所围的电荷为零：内表面必须带 −<i>Q</i>，抵消金属球的 +<i>Q</i>。球壳 −3<i>Q</i> 中余下的部分到了外表面：−3<i>Q</i> − (−<i>Q</i>) = −2<i>Q</i>。</p>' },
    { q: `本页的金属球（<i>Q</i> = ${p(Q * 1e9, 1)} nC，<i>R</i> = ${p(R * 100, 0)} cm）外部的电场中储存了多少能量？（能量密度为 ε<sub>0</sub><i>E</i>²/2。）`,
      choices: P4.nums.map(x => `${g(x)} μJ`), answer: 3, nums: P4.nums,
      why: `<p>金属内部 <i>E</i> = 0。在外部，把体积为 4π<i>r</i>² d<i>r</i> 的球壳层加起来：</p><div class="eq"><i>U</i> = ∫<sub><i>R</i></sub><sup>∞</sup> (ε<sub>0</sub>/2)(<i>kQ</i>/<i>r</i>²)² 4π<i>r</i>² d<i>r</i> = <i>kQ</i>²/2<i>R</i> = ${g(P4.U * 1e6)} μJ</div><p>只积分到 2<i>R</i> 只得到一半（${g(P4.nums[1])} μJ）：远处的电场里仍有能量。用表面处的能量密度乘以球的体积（${g(P4.nums[2])} μJ）则把能量放错了地方：金属内部根本没有能量。</p>` },
  ],
  5: [
    { q: `本页的绝缘球（<i>Q</i> = ${p(Q * 1e9, 1)} nC 均匀分布，<i>R</i> = ${p(R * 100, 0)} cm）。距球心 ${p(P5.r * 100, 0)} cm 处的电场为`,
      choices: P5.nums.map(x => `${p(x, 0)} N/C`), answer: 1, nums: P5.nums,
      why: `<p>半径为 <i>r</i> 的高斯球面包围 <i>Q</i>(<i>r</i>/<i>R</i>)³ = <i>Q</i>/8：</p><div class="eq"><i>E</i> · 4π<i>r</i>² = <i>Q</i>(<i>r</i>/<i>R</i>)³/ε<sub>0</sub> &nbsp;→&nbsp; <i>E</i> = <i>kQr</i>/<i>R</i>³ = ${p(P5.E, 0)} N/C</div><p>零是<i>金属</i>球的结果；<i>kQ</i>/<i>r</i>² 把高斯球面外的电荷也算了进去。</p>` },
    { q: '一个绝缘球壳内半径为 <i>a</i>，外半径为 <i>b</i>，电荷体密度 ρ 均匀。求三个区域中的 <i>E</i>(<i>r</i>)。',
      solution: '<p>球对称：在半径为 <i>r</i> 的高斯球面上，<i>E</i> · 4π<i>r</i>² = <i>q</i><sub>enc</sub>/ε<sub>0</sub>，其中 <i>q</i><sub>enc</sub> = ∫ ρ 4π<i>r</i>′² d<i>r</i>′，积分只取球面内带电的部分。</p><div class="eq"><i>r</i> &lt; <i>a</i>：&nbsp;<i>q</i><sub>enc</sub> = 0，&nbsp;<i>E</i> = 0</div><div class="eq"><i>a</i> &lt; <i>r</i> &lt; <i>b</i>：&nbsp;<i>q</i><sub>enc</sub> = ∫<sub><i>a</i></sub><sup><i>r</i></sup> ρ4π<i>r</i>′² d<i>r</i>′ = ⁴⁄₃πρ(<i>r</i>³ − <i>a</i>³)，&nbsp;<i>E</i> = ρ(<i>r</i>³ − <i>a</i>³)/3ε<sub>0</sub><i>r</i>²</div><div class="eq"><i>r</i> &gt; <i>b</i>：&nbsp;<i>E</i> = ρ(<i>b</i>³ − <i>a</i>³)/3ε<sub>0</sub><i>r</i>² = <i>kQ</i>/<i>r</i>²</div><p>检验：<i>r</i> = <i>a</i> 时中间的式子为 0，<i>r</i> = <i>b</i> 时与外部的式子相接，所以 <i>E</i> 连续。令 <i>a</i> = 0，就变成实心球的 ρ<i>r</i>/3ε<sub>0</sub>。</p>' },
  ],
  6: [
    { q: `本页的绝缘棒（λ = ${p(M.ROD.lam * 1e9, 1)} nC/m 均匀分布，<i>R</i> = ${p(M.ROD.R * 100, 0)} cm）。距其轴线 ${p(P6.r * 100, 1)} cm 处的电场为`,
      choices: P6.nums.map(x => `${p(x, 0)} N/C`), answer: 2, nums: P6.nums,
      why: `<p>半径为 <i>r</i>、长为 <i>L</i> 的同轴圆柱面包围 λ<i>L</i>(<i>r</i>/<i>R</i>)²：</p><div class="eq"><i>E</i> · 2π<i>rL</i> = λ<i>L</i><i>r</i>²/<i>R</i>²ε<sub>0</sub> &nbsp;→&nbsp; <i>E</i> = 2<i>k</i>λ<i>r</i>/<i>R</i>² = ${p(P6.E, 0)} N/C</div><p>2<i>k</i>λ/<i>r</i>（${p(P6.nums[1], 0)} N/C）只在外部成立，那里全部 λ 都被包围；0 是金属棒的结果。</p>` },
    { q: '一根半径为 <i>R</i> 的长绝缘圆柱，ρ = ρ<sub>0</sub><i>r</i>/<i>R</i>。在它内部（<i>r</i> &lt; <i>R</i>），电场为',
      choices: ['ρ<sub>0</sub><i>r</i>/2ε<sub>0</sub>', 'ρ<sub>0</sub><i>r</i>²/3ε<sub>0</sub><i>R</i>', 'ρ<sub>0</sub><i>r</i>²/2ε<sub>0</sub><i>R</i>', 'ρ<sub>0</sub><i>r</i>³/3ε<sub>0</sub><i>R</i>²'], answer: 1,
      why: '<p>把一层层薄圆柱壳加起来，每层体积为 2π<i>r</i>′<i>L</i> d<i>r</i>′：</p><div class="eq"><i>q</i><sub>enc</sub> = ∫<sub>0</sub><sup><i>r</i></sup> (ρ<sub>0</sub><i>r</i>′/<i>R</i>) 2π<i>r</i>′<i>L</i> d<i>r</i>′ = 2πρ<sub>0</sub><i>Lr</i>³/3<i>R</i></div><div class="eq"><i>E</i> · 2π<i>rL</i> = <i>q</i><sub>enc</sub>/ε<sub>0</sub> &nbsp;→&nbsp; <i>E</i> = ρ<sub>0</sub><i>r</i>²/3ε<sub>0</sub><i>R</i></div><p>ρ<sub>0</sub><i>r</i>²/2ε<sub>0</sub><i>R</i> 是把局部的 ρ(<i>r</i>) 直接代入均匀棒的结果，没有积分。</p>' },
  ],
  7: [
    { q: `本页的球 ρ = <i>br</i>（<i>Q</i> = ${p(Q * 1e9, 1)} nC，<i>R</i> = ${p(R * 100, 0)} cm，<i>b</i> = ${p(M.SPH.b * 1e6, 2)} μC/m⁴）。距球心 ${p(P7.r * 100, 0)} cm 处的电场为`,
      choices: P7.nums.map(x => `${p(x, 0)} N/C`), answer: 2, nums: P7.nums,
      why: `<div class="eq"><i>q</i><sub>enc</sub> = ∫<sub>0</sub><sup><i>r</i></sup> <i>br</i>′ 4π<i>r</i>′² d<i>r</i>′ = π<i>br</i>⁴，&nbsp;<i>E</i> = π<i>br</i>⁴/(4πε<sub>0</sub><i>r</i>²) = <i>br</i>²/4ε<sub>0</sub> = ${p(P7.E, 0)} N/C</div><p>由于电荷向外聚集，<i>R</i>/2 以内只有 <i>Q</i>/16。<i>Q</i> 相同的均匀球给出 ${p(P7.nums[1], 0)} N/C；把 ρ(<i>r</i>) 代入 ρ<i>r</i>/3ε<sub>0</sub> 给出 ${p(P7.nums[0], 0)} N/C。</p>` },
    { q: '一个半径为 <i>R</i> 的球，ρ = <i>br</i>²。它的总电荷中有多大比例位于 <i>r</i> = <i>R</i>/2 以内？',
      choices: P7b.nums.map(fr), answer: 1, nums: P7b.nums,
      why: '<div class="eq"><i>q</i>(<i>r</i>) = ∫<sub>0</sub><sup><i>r</i></sup> <i>br</i>′² 4π<i>r</i>′² d<i>r</i>′ = ⁴⁄₅π<i>br</i>⁵ &nbsp;→&nbsp; <i>q</i>(<i>R</i>/2)/<i>q</i>(<i>R</i>) = (½)⁵ = 1/32</div><p>1/8 是均匀球的 (½)³；1/16 是 ρ = <i>br</i> 时的 (½)⁴。</p>' },
  ],
  8: [
    { q: '一个点电荷 +<i>q</i> 偏离中心地放在一个不带电的球形厚金属壳的空腔里。在球壳外部，电场',
      choices: ['为零', '为 <i>kq</i>/<i>r</i>²，<i>r</i> 从点电荷量起', '为 <i>kq</i>/<i>r</i>²，<i>r</i> 从球壳中心量起', '在靠近点电荷的一侧更强'], answer: 2,
      why: '<p>−<i>q</i> 不均匀地聚集在内表面上，使金属中的电场为零。这就把外部与电荷所在的位置隔开了。外表面上剩下的 +<i>q</i> 感受不到来自内部的电场，所以像孤立球上的电荷一样均匀分布。在外部，用同心球面应用高斯定理，得到从<b>球壳</b>中心量起的 <i>kq</i>/<i>r</i>²。</p>' },
    { q: `本页不带电的球壳（<i>R</i> = ${p(M.CAGE.R * 100, 0)} cm）处在 ${p(M.CAGE.E0 / 1000, 1)} kN/C 的电场中，σ = 3ε<sub>0</sub><i>E</i><sub>0</sub> cos θ。下游半球（cos θ &gt; 0）上的总电荷为`,
      choices: P8.nums.map(x => `${x ? g(x) : '0'} nC`), answer: 1, nums: P8.nums,
      why: `<p>宽 <i>R</i> dθ 的环带面积为 2π<i>R</i>² sin θ dθ：</p><div class="eq"><i>q</i> = ∫<sub>0</sub><sup>π/2</sup> 3ε<sub>0</sub><i>E</i><sub>0</sub> cos θ · 2π<i>R</i>² sin θ dθ = 3πε<sub>0</sub><i>E</i><sub>0</sub><i>R</i>² = ${g(P8.q * 1e9)} nC</div><p>另一半带 −${g(P8.q * 1e9)} nC，所以球壳保持中性；用 σ<sub>max</sub> 乘以半球面积（${g(P8.nums[2])} nC）忽略了 σ 在边缘处降为 0。</p>` },
  ],
};
