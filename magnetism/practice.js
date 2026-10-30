// magnetism/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const { MU0, QE, MP } = M;
const k2 = MU0 / (2 * Math.PI);                                       // μ₀/2π = 2×10⁻⁷ T·m/A

// ---- page 0: flux through a dome in a uniform field ----
const P0 = { B: 0.40, R: 0.050 };
P0.phi = P0.B * Math.PI * P0.R ** 2;
P0.nums = [P0.B * 2 * Math.PI * P0.R ** 2, 0, P0.phi, P0.B * 4 * Math.PI * P0.R ** 2].map(x => x * 1e3);   // dome's area · closed-surface zero · right · whole sphere
// ---- page 1: the force averaged over the page's sweep of θ ----
const F1 = M.RHR.Fmax;
const P1 = { avg: 2 / Math.PI * F1 };
P1.nums = [F1 / 2, P1.avg, F1, F1 / Math.SQRT2].map(x => x / 1e-14);    // linear in θ · right · peak · rms
// ---- page 2: a deuteron through the page's 200 V ----
const rp = M.CYC.r[1];
const P2 = { m: 2 * MP, V: M.CYC.dV[1] };
P2.r = Math.sqrt(2 * P2.m * QE * P2.V) / (QE * M.CYC.B);
P2.nums = [2 * rp, rp, rp / Math.SQRT2, P2.r].map(x => x * 100);       // r ∝ m · unchanged · upside down · right
// ---- page 3: the page's selector ----
const { E: SE, B: SB, v0 } = M.SEL;
const P3 = { v: 1.25 * v0 };
P3.F = QE * (P3.v * SB - SE);
P3.nums = [QE * SE, P3.F, QE * P3.v * SB, QE * (P3.v * SB + SE)].map(x => x / 1e-17);   // qE only · right · qvB only · added
const S0 = M.SEL.paths[0], s0 = S0[S0.length - 1];
const P3b = { vi: M.SEL.k[0] * v0, dy: +Math.abs(s0.p[1] * 100).toFixed(3) / 100 };   // the drop as shown, from the model's path
P3b.v = Math.sqrt(P3b.vi ** 2 + 2 * QE * SE * P3b.dy / MP);
P3b.nums = [P3b.vi, Math.sqrt(P3b.vi ** 2 - 2 * QE * SE * P3b.dy / MP), P3b.v, v0].map(x => x / 1e4);   // unchanged · sign · right · E/B
// ---- page 4: turning the page's loop over; a semicircular wire ----
const { mu, B: LB } = M.LOOP;
const P4 = { W: 2 * mu * LB };
P4.nums = [mu * LB, Math.PI * mu * LB, 0, P4.W];                      // only to 90° · τ_max × π · start = end? · right
const P4b = { I: 2.0, R: 0.10, B: 0.50 };
P4b.F = 2 * P4b.I * P4b.R * P4b.B;
P4b.nums = [Math.PI * P4b.I * P4b.R * P4b.B, P4b.F, 0, P4b.I * P4b.R * P4b.B];   // arc length · right · cancels · radius
// ---- page 5: inside the page's thick wire; the page's rectangle ----
const { I: AI, a: Aa } = M.AMP, r5 = 0.005;
const P5 = { B: MU0 * AI * r5 / (2 * Math.PI * Aa ** 2) };
P5.nums = [k2 * AI / r5, k2 * AI / Aa, k2 * AI * r5 ** 2 / Aa ** 3, P5.B].map(x => x * 1e6);   // outside formula · surface value · ∝ r² · right
const { a: Fa, c: Fc, b: Fb } = M.FLUX, area5 = Fb * Fc;
P5.fnums = [k2 * AI / (Fa + Fc / 2) * area5, k2 * AI / Fa * area5, M.FLUX.phi, k2 * AI / (Fa + Fc) * area5].map(x => x * 1e6);   // B at the middle · near side · right · far side
// ---- page 6: the page's ring on its axis; a semicircle with radial leads ----
const { R: RR, I: RI, Bc } = M.RING;
const P6 = { B: M.ringAxis(RR) };
P6.nums = [P6.B, Bc / 2, Bc, Bc / 4].map(x => x * 1e6);              // right · halved · centre · 1/z²
const P6b = { B: Bc / 2 };
P6b.nums = [Bc, Bc / 2 + k2 * RI / RR, P6b.B, k2 * RI / RR].map(x => x * 1e6);   // whole loop · leads added · right · leads only
// ---- page 7: a rod perpendicular to a long wire ----
const P7 = { I1: M.WIRES.I, I2: M.WIRES.I, r1: 0.05, r2: 0.25 };
P7.F = k2 * P7.I1 * P7.I2 * Math.log(P7.r2 / P7.r1);
const L7 = P7.r2 - P7.r1;
P7.nums = [P7.F, k2 * P7.I1 / ((P7.r1 + P7.r2) / 2) * P7.I2 * L7, k2 * P7.I1 / P7.r1 * P7.I2 * L7, k2 * P7.I1 / P7.r2 * P7.I2 * L7].map(x => x * 1e3);   // right · B at the middle · near end · far end
// ---- page 8: the page's toroid at 12 cm; the end of the page's solenoid ----
const { N: TN, I: TI, R0 } = M.TOR, r8 = 0.12;
const P8 = { B: MU0 * TN * TI / (2 * Math.PI * r8) };
P8.nums = [MU0 * TN * TI / (2 * Math.PI * M.TOR.a), 0, MU0 * TN * TI / (2 * Math.PI * R0), P8.B].map(x => x * 1e6);   // used the tube radius · "outside" · mean radius · right
const { L: SL, R: SR } = M.SOL;
const P8b = { B: M.SOL.B / 2 * SL / Math.hypot(SL, SR) };
P8b.nums = [P8b.B, M.SOL.B, M.SOL.B / 4, 0].map(x => x * 1e6);       // right · the long-solenoid value · quarter · "outside"

export const PRACTICE = {
  0: [
    { q: '一个闭合盒子只包住本页条形磁体的 N 端。从盒子穿出的净磁通量',
      choices: ['为零：穿入和穿出的磁通量一样多', '为正：磁感线从 N 极出发', '为负：磁体内部的磁场穿入盒子', '为正，且盒子越大越大'], answer: 0,
      why: '<p>通过任何闭合曲面都有 ∮<b>B</b>·<i>d</i><b>A</b> = 0：不存在磁荷。磁感线从外侧各面穿出，但同样多的磁感线从切过磁体的那一面穿入，那里磁体内部的磁场从 S 指向 N，即朝向 N 端。磁极并不像电荷是 <b>E</b> 的源那样是 <b>B</b> 的源。</p>' },
    { q: `${p(P0.B, 2)} T 的匀强磁场竖直向上。一个半径 ${p(P0.R * 100, 0)} cm 的开口半球形罩子扣在水平桌面上，球面朝上。从弯曲表面穿出的磁通量为`,
      choices: P0.nums.map(x => `${p(x, 2)} mWb`), answer: 2, nums: P0.nums,
      why: `<p>半球面加上它下面的平面圆盘构成闭合曲面，两者的磁通量相互抵消：从半球面穿出的磁通量等于从圆盘穿入的磁通量 <i>B</i>π<i>R</i><sup>2</sup>。也可以积分，θ 从竖直方向量起：</p><div class="eq">Φ = ∫ <i>B</i> cos θ · 2π<i>R</i><sup>2</sup> sin θ <i>d</i>θ（从 0 到 π/2）= <i>B</i>π<i>R</i><sup>2</sup> = ${p(P0.phi * 1e3, 2)} mWb</div><p><i>B</i> × 2π<i>R</i><sup>2</sup>（${p(P0.nums[0], 2)} mWb）忽略了半球面大部分地方 <b>B</b> 并不垂直于表面。</p>` },
  ],
  1: [
    { q: '电子沿 +<i>x</i> 方向运动，穿过沿 +<i>y</i> 方向的匀强磁场。它受的磁场力指向',
      choices: ['+<i>z</i> 方向', '−<i>y</i> 方向', '没有方向：力为零', '−<i>z</i> 方向'], answer: 3,
      why: '<p><b>F</b> = <i>q</i><b>v</b> × <b>B</b>，且 <i>x̂</i> × <i>ŷ</i> = +<i>ẑ</i>。电子带负电，方向反过来：−<i>z</i>。这个力从不沿 <b>B</b>；它同时垂直于 <b>v</b> 和 <b>B</b>。</p>' },
    { q: `本页中，质子的 <b>v</b> 与 <b>B</b> 之间的夹角 θ 从 0 匀速扫到 180°（<i>F</i><sub>max</sub> = <i>qvB</i> = ${p(F1 / 1e-14, 2)} × 10<sup>−14</sup> N）。这一过程中力的大小的平均值为`,
      choices: P1.nums.map(x => `${p(x, 2)} × 10<sup>−14</sup> N`), answer: 1, nums: P1.nums,
      why: `<p>θ 随时间均匀增大，所以对时间的平均就是对 θ 的平均：</p><div class="eq">⟨<i>F</i>⟩ = (1/π) ∫<sub>0</sub><sup>π</sup> <i>qvB</i> sin θ <i>d</i>θ = (2/π)<i>qvB</i> = ${p(P1.avg / 1e-14, 2)} × 10<sup>−14</sup> N</div><p>不是峰值的一半（${p(P1.nums[0], 2)}）：sin θ 不是直线，它在峰值附近停留得更久。</p>` },
  ],
  2: [
    { q: `一个氘核（电荷 +<i>e</i>，质量 2<i>m</i><sub>p</sub>）从静止经本页的 ${P2.V} V 加速后，进入同样的 ${p(M.CYC.B, 2)} T 磁场；经 ${P2.V} V 加速的质子在其中做半径 <i>r</i> = ${p(rp * 100, 2)} cm 的圆周运动。氘核的轨道半径为`,
      choices: P2.nums.map(x => `${p(x, 2)} cm`), answer: 3, nums: P2.nums,
      why: `<p>电荷和 Δ<i>V</i> 都相同，所以动能同为 <i>e</i>Δ<i>V</i>；于是 <i>mv</i> = √(2<i>m</i> · <i>e</i>Δ<i>V</i>)，</p><div class="eq"><i>r</i> = <i>mv</i>/<i>qB</i> = √(2<i>m</i>Δ<i>V</i>/<i>q</i>)/<i>B</i> ∝ √<i>m</i> &nbsp;→&nbsp; √2 × ${p(rp * 100, 2)} cm = ${p(P2.r * 100, 2)} cm</div><p>质量加倍并不意味着半径加倍（${p(P2.nums[0], 2)} cm）：氘核的速率也小了，为质子的 1/√2。</p>` },
    { q: `解答题。电荷量为 <i>q</i>、质量为 <i>m</i> 的粒子以速度 <b>v</b> 运动，<b>v</b> 垂直于匀强磁场 <b>B</b> = <i>B</i><i>ẑ</i>。从牛顿第二定律出发，写出 <i>v<sub>x</sub></i> 和 <i>v<sub>y</sub></i> 满足的微分方程，求解，并求出周期。对本页的质子（<i>B</i> = ${p(M.CYC.B, 2)} T）计算其数值。`,
      solution: `<p><b>F</b> = <i>q</i><b>v</b> × <b>B</b>，其中 <b>v</b> × <i>ẑ</i> = (<i>v<sub>y</sub></i>, −<i>v<sub>x</sub></i>, 0)：</p><div class="eq"><i>m dv<sub>x</sub></i>/<i>dt</i> = <i>qBv<sub>y</sub></i>, &nbsp; <i>m dv<sub>y</sub></i>/<i>dt</i> = −<i>qBv<sub>x</sub></i></div><p>对第一式求导，再代入第二式：<i>d</i><sup>2</sup><i>v<sub>x</sub></i>/<i>dt</i><sup>2</sup> = −ω<sup>2</sup><i>v<sub>x</sub></i>，ω = <i>qB</i>/<i>m</i>。所以</p><div class="eq"><i>v<sub>x</sub></i> = <i>v</i> cos ω<i>t</i>, &nbsp; <i>v<sub>y</sub></i> = −<i>v</i> sin ω<i>t</i></div><p>速率保持为 <i>v</i>；再积分一次，得到半径为 <i>v</i>/ω = <i>mv</i>/<i>qB</i> 的圆，<i>q</i> > 0 时从 +<i>z</i> 方向看是顺时针转动。周期与 <i>v</i> 无关：</p><div class="eq"><i>T</i> = 2π/ω = 2π<i>m</i>/<i>qB</i> = 2π × 1.67×10<sup>−27</sup> / (1.60×10<sup>−19</sup> × ${p(M.CYC.B, 2)}) = ${p(M.CYC.T * 1e6, 3)} μs</div><p>这就是本页中经 50 V 和 200 V 加速的两个质子每转一圈都在起点重新相遇的原因。</p>`, val: M.CYC.T },
  ],
  3: [
    { q: `在本页的速度选择器中（<i>E</i> = ${p(SE, 0)} V/m，向下；<i>B</i> = ${p(SB, 3)} T，垂直纸面向里），一个质子以 1.25<i>E</i>/<i>B</i> = ${p(P3.v / 1e5, 3)} × 10<sup>5</sup> m/s 射入。刚射入时它所受合力的大小为`,
      choices: P3.nums.map(x => `${p(x, 1)} × 10<sup>−17</sup> N`), answer: 1, nums: P3.nums,
      why: `<p>两个力方向相反：<i>qE</i> 向下，<i>qvB</i> 向上。速率大于 <i>E</i>/<i>B</i> 时，磁场力占优：</p><div class="eq"><i>F</i> = <i>q</i>(<i>vB</i> − <i>E</i>) = 1.60×10<sup>−19</sup> × (${p(P3.v * SB, 0)} − ${p(SE, 0)}) = ${p(P3.F / 1e-17, 1)} × 10<sup>−17</sup> N，向上</div><p>把两者相加（${p(P3.nums[3], 1)}）就忽略了它们方向相反，而这正是这个装置的关键。</p>` },
    { q: `本页中较慢的质子以 ${p(P3b.vi / 1e4, 1)} × 10<sup>4</sup> m/s 射入，离开两板时比射入时低了 ${p(P3b.dy * 100, 3)} cm（朝 − 板方向）。它离开时的速率为`,
      choices: P3b.nums.map(x => `${p(x, 2)} × 10<sup>4</sup> m/s`), answer: 2, nums: P3b.nums,
      why: `<p>功是 ∫<b>F</b>·<i>d</i><b>s</b>。磁场力始终 ⊥ <i>d</i><b>s</b>，所以不做功；质子下落时，电场力做功 <i>qE</i>Δ<i>y</i>：</p><div class="eq">½<i>mv</i><sup>2</sup> = ½<i>mv</i><sub>i</sub><sup>2</sup> + <i>qE</i>Δ<i>y</i> &nbsp;→&nbsp; <i>v</i> = √(<i>v</i><sub>i</sub><sup>2</sup> + 2<i>qE</i>Δ<i>y</i>/<i>m</i>) = ${p(P3b.v / 1e4, 2)} × 10<sup>4</sup> m/s</div><p>它向低电势处下落，所以加速。它不会达到 <i>E</i>/<i>B</i> = ${p(v0 / 1e4, 1)} × 10<sup>4</sup> m/s；并没有什么力把速率推向这个值。</p>` },
  ],
  4: [
    { q: `把本页的线圈（μ = ${p(mu, 2)} A·m²，<i>B</i> = ${p(LB, 2)} T）从 θ = 0（μ 沿 <b>B</b>）缓慢转到 θ = 180°。转动它的人做的功为`,
      choices: P4.nums.map(x => `${p(x, 3)} J`), answer: 3, nums: P4.nums,
      why: `<p>克服回复力矩 μ<i>B</i> sin θ 做功：</p><div class="eq"><i>W</i> = ∫<sub>0</sub><sup>π</sup> μ<i>B</i> sin θ <i>d</i>θ = 2μ<i>B</i> = ${p(P4.W, 3)} J</div><p>与 Δ<i>U</i> = (−μ<i>B</i> cos 180°) − (−μ<i>B</i> cos 0) = 2μ<i>B</i> 相同。只转到 90° 只需 μ<i>B</i>；τ<sub>max</sub> × π（${p(P4.nums[1], 3)} J）把力矩当成了常量。</p>` },
    { q: `一根导线弯成半径 ${p(P4b.R * 100, 0)} cm 的半圆，通有 ${p(P4b.I, 1)} A 的电流，处在垂直于半圆平面的 ${p(P4b.B, 2)} T 匀强磁场中。半圆所受的合磁场力为`,
      choices: P4b.nums.map(x => `${p(x, 3)} N`), answer: 1, nums: P4b.nums,
      why: `<p>把 <i>d</i><b>F</b> = <i>I d</i><b>s</b> × <b>B</b> 加起来。<b>B</b> 是匀强的，可以提到积分号外，而 ∫<i>d</i><b>s</b> 就是从一端指向另一端的直线矢量，长 2<i>R</i>：</p><div class="eq"><i>F</i> = <i>I</i>(2<i>R</i>)<i>B</i> = ${P4b.I} × ${p(2 * P4b.R, 2)} × ${P4b.B} = ${p(P4b.F, 3)} N</div><p>各小段受力的侧向分量相互抵消，所以用弧长 π<i>R</i>（${p(P4b.nums[0], 3)} N）算多了。</p>` },
  ],
  5: [
    { q: `本页的导线（半径 ${p(Aa * 100, 0)} cm，${AI} A 电流均匀分布在横截面上）。导线<b>内部</b>距轴线 ${p(r5 * 1000, 0)} mm 处的磁场为`,
      choices: P5.nums.map(x => `${p(x, 0)} μT`), answer: 3, nums: P5.nums,
      why: `<p>半径 <i>r</i> < <i>a</i> 的安培环路圆只包围了电流的 <i>r</i><sup>2</sup>/<i>a</i><sup>2</sup>：</p><div class="eq"><i>B</i>(2π<i>r</i>) = μ<sub>0</sub><i>I</i><i>r</i><sup>2</sup>/<i>a</i><sup>2</sup> &nbsp;→&nbsp; <i>B</i> = μ<sub>0</sub><i>Ir</i>/2π<i>a</i><sup>2</sup> = ${p(P5.B * 1e6, 0)} μT</div><p>μ<sub>0</sub><i>I</i>/2π<i>r</i>（${p(P5.nums[0], 0)} μT）把圆外的电流也算了进去。</p>` },
    { q: `本页的矩形（与 ${AI} A 导线平行的两边长 ${p(Fb * 100, 0)} cm，近边距导线 ${p(Fa * 100, 0)} cm，宽 ${p(Fc * 100, 0)} cm）。穿过它的磁通量为`,
      choices: P5.fnums.map(x => `${p(x, 2)} μWb`), answer: 2, nums: P5.fnums,
      why: `<p>矩形上各处 <i>B</i> 不同，所以把细条 <i>b dr</i> 加起来：</p><div class="eq">Φ = ∫<sub><i>a</i></sub><sup><i>a</i>+<i>c</i></sup> (μ<sub>0</sub><i>I</i>/2π<i>r</i>) <i>b dr</i> = (μ<sub>0</sub><i>Ib</i>/2π) ln(${p((Fa + Fc) / Fa, 0)}) = ${p(M.FLUX.phi * 1e6, 2)} μWb</div><p>用中间处的 <i>B</i> 乘面积得 ${p(P5.fnums[0], 2)} μWb：偏小，因为 1/<i>r</i> 是曲线，靠近导线的细条贡献更多。</p>` },
  ],
  6: [
    { q: `本页的圆环（<i>R</i> = ${p(RR * 100, 0)} cm，圆心处 <i>B</i> = ${p(Bc * 1e6, 1)} μT）。在其轴线上距圆心 <i>z</i> = <i>R</i> 处，磁场为`,
      choices: P6.nums.map(x => `${p(x, 1)} μT`), answer: 0, nums: P6.nums,
      why: `<div class="eq"><i>B</i> = μ<sub>0</sub><i>IR</i><sup>2</sup>/2(<i>R</i><sup>2</sup> + <i>z</i><sup>2</sup>)<sup>3/2</sup> = (μ<sub>0</sub><i>I</i>/2<i>R</i>) · 1/2<sup>3/2</sup> = ${p(Bc * 1e6, 1)}/${p(2 ** 1.5, 3)} = ${p(P6.B * 1e6, 1)} μT</div><p>不是一半：每一小段的距离变为 √2 倍（1/<i>r</i><sup>2</sup> → ½），而且其 d<b>B</b> 只有 cos 45° 沿轴线（再乘 1/√2）。</p>` },
    { q: `通有 ${RI} A 电流的导线沿一段指向圆心的直导线进入，绕过半径 ${p(RR * 100, 0)} cm 的半圆，再沿一段背离圆心的直导线离开。圆心处的磁场为`,
      choices: P6b.nums.map(x => `${p(x, 1)} μT`), answer: 2, nums: P6b.nums,
      why: `<p>在两段直导线上，<i>d</i><b>l</b> 沿 <b>r̂</b>，所以 <i>d</i><b>l</b> × <b>r̂</b> = 0：它们没有贡献。在圆弧上，每一小段都 ⊥ <b>r̂</b>，距离都是 <i>R</i>：</p><div class="eq"><i>B</i> = (μ<sub>0</sub><i>I</i>/4π<i>R</i><sup>2</sup>) ∫<i>dl</i> = (μ<sub>0</sub><i>I</i>/4π<i>R</i><sup>2</sup>)(π<i>R</i>) = μ<sub>0</sub><i>I</i>/4<i>R</i> = ${p(P6b.B * 1e6, 1)} μT</div><p>是整个圆环的一半。把两段直导线当成旁边的半无限长导线来算（${p(P6b.nums[1], 1)} μT）是陷阱。</p>` },
  ],
  7: [
    { q: '两根长直平行导线分别通有 20 A 和 10 A 的电流，方向<b>相反</b>。与 20 A 导线受的力相比，10 A 导线受的力',
      choices: ['是它的两倍，两导线相互吸引', '大小相同，两导线相互吸引', '大小相同，两导线相互排斥', '是它的一半，两导线相互排斥'], answer: 2,
      why: '<p><i>F</i>/<i>L</i> = μ<sub>0</sub><i>I</i><sub>1</sub><i>I</i><sub>2</sub>/2π<i>d</i> 对两个电流是对称的（牛顿第三定律）：大小相等。反向电流相互排斥。10 A 导线所处的磁场强一倍，但它的电流只有一半。</p>' },
    { q: `一根直棒与长直导线<b>垂直</b>，位于同一平面内，从距导线 ${p(P7.r1 * 100, 0)} cm 处延伸到 ${p(P7.r2 * 100, 0)} cm 处。两者都通有本页的 ${P7.I1} A 电流。直棒受的磁场力为`,
      choices: P7.nums.map(x => `${p(x, 3)} mN`), answer: 0, nums: P7.nums,
      why: `<p>导线的磁场处处 ⊥ 直棒，但沿棒逐渐减弱，所以积分 <i>dF</i> = <i>I</i><sub>2</sub><i>B</i>(<i>r</i>) <i>dr</i>：</p><div class="eq"><i>F</i> = ∫<sub><i>r</i><sub>1</sub></sub><sup><i>r</i><sub>2</sub></sup> (μ<sub>0</sub><i>I</i><sub>1</sub>/2π<i>r</i>) <i>I</i><sub>2</sub> <i>dr</i> = (μ<sub>0</sub><i>I</i><sub>1</sub><i>I</i><sub>2</sub>/2π) ln(${p(P7.r2 / P7.r1, 0)}) = ${p(P7.F * 1e3, 3)} mN</div><p>用棒中点处的 <i>B</i>（${p(P7.nums[1], 3)} mN）低估了靠近导线处的强磁场。</p>` },
  ],
  8: [
    { q: `本页的螺绕环（${TN} 匝，${TI} A；环芯从距中心 ${p((R0 - M.TOR.a) * 100, 0)} cm 延伸到 ${p((R0 + M.TOR.a) * 100, 0)} cm）。环芯内 <i>r</i> = ${p(r8 * 100, 0)} cm 处的磁场为`,
      choices: P8.nums.map(x => `${p(x, 1)} μT`), answer: 3, nums: P8.nums,
      why: `<p>环芯内半径为 <i>r</i> 的安培环路圆与每一匝各交链一次：</p><div class="eq"><i>B</i>(2π<i>r</i>) = μ<sub>0</sub><i>NI</i> &nbsp;→&nbsp; <i>B</i> = μ<sub>0</sub><i>NI</i>/2π<i>r</i> = 2×10<sup>−7</sup> × ${TN} × ${TI} / ${r8} = ${p(P8.B * 1e6, 1)} μT</div><p><i>B</i> 与 <i>r</i> 有关：用平均半径 ${p(R0 * 100, 0)} cm 得到 ${p(P8.nums[2], 1)} μT，那只是 ${p(R0 * 100, 0)} cm 处的值。</p>` },
    { q: `把本页螺线管（<i>n</i> = ${p(M.SOL.n, 0)} 匝/m，<i>I</i> = ${M.SOL.I} A，<i>L</i> = ${p(SL * 100, 0)} cm，<i>R</i> = ${p(SR * 100, 0)} cm）沿长度方向的各圈电流环加起来，得到轴线上 <i>B</i> = (μ<sub>0</sub><i>nI</i>/2)(cos θ<sub>1</sub> − cos θ<sub>2</sub>)。一个<b>端面</b>中心处的磁场为`,
      choices: P8b.nums.map(x => `${p(x, 1)} μT`), answer: 0, nums: P8b.nums,
      why: `<p>每一薄片 <i>dx</i> 是一个通有 <i>nI dx</i> 的电流环；把它们的轴向磁场加起来：</p><div class="eq"><i>B</i> = ∫<sub>0</sub><sup><i>L</i></sup> μ<sub>0</sub><i>nI R</i><sup>2</sup> <i>dx</i> / 2(<i>R</i><sup>2</sup> + <i>x</i><sup>2</sup>)<sup>3/2</sup> = (μ<sub>0</sub><i>nI</i>/2) · <i>L</i>/√(<i>L</i><sup>2</sup> + <i>R</i><sup>2</sup>) = ${p(P8b.B * 1e6, 1)} μT</div><p>非常接近 μ<sub>0</sub><i>nI</i> = ${p(M.SOL.B * 1e6, 1)} μT 的一半：从端面看，线圈只向一侧延伸。</p>` },
  ],
};
