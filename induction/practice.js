// induction/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const MU0 = M.MU0;

// ---- page 0: average emf of a coil in a growing field; when a polynomial flux has zero emf ----
const P0 = { N: 200, A: 0.0050, B1: 0.10, B2: 0.50, dt: 0.20 };
P0.emf = P0.N * P0.A * (P0.B2 - P0.B1) / P0.dt;
P0.nums = [P0.A * (P0.B2 - P0.B1) / P0.dt, P0.emf, P0.N * P0.A * P0.B2 / P0.dt, P0.N * P0.A * (P0.B2 - P0.B1) * P0.dt];   // forgot N · right · used B₂ not ΔB · ×Δt
const P0b = { a: 4.0, b: 6.0 };                      // Φ = a t³ − b t (mWb)
P0b.t = Math.sqrt(P0b.b / (3 * P0b.a));
P0b.nums = [Math.sqrt(P0b.b / P0b.a), P0b.b / (3 * P0b.a), Math.sqrt(3 * P0b.a / P0b.b), P0b.t];   // where Φ = 0 · forgot the root · upside down · right

// ---- page 1: charge through the loop as the N pole comes in (page's magnet and loop) ----
const L1 = (() => { const c = M.CASES[0], a = M.lenzCase(c, 0), b = M.lenzCase(c, M.LENZ.run), dPhi = b.Phi - a.Phi;
  return { dPhi, Q: dPhi / M.LENZ.R, nums: [dPhi / M.LENZ.R / 2, dPhi / (M.LENZ.R * M.LENZ.run), dPhi * M.LENZ.run / M.LENZ.R, dPhi / M.LENZ.R].map(x => x * 1e3) }; })();
// ---- page 2: the iron core, I₁ = c t² ----
const P2 = { c: 2.0, t: 0.50 };
P2.dI = 2 * P2.c * P2.t;
P2.nums = [M.CORE.M * P2.c * P2.t ** 2, M.CORE.M * P2.dI, M.CORE.L1 * P2.dI, M.CORE.M * P2.c * P2.t].map(x => x * 1e3);   // M·I · right · L₁ · lost the 2
// ---- page 3: the page's loop leaving the wire, at r = 2 cm ----
const P3 = (() => { const { I, a, b, r0: r, v } = M.WIRE, k = MU0 * I / (2 * Math.PI);
  return { emf: k * a * b * v / (r * (r + a)), nums: [k / r * b * v, k * (1 / r + 1 / (r + a)) * b * v, k * (1 / r - 1 / (r + a)) * a * v, k * (1 / r - 1 / (r + a)) * b * v].map(x => x * 1e6) }; })();
// ---- page 4: a rod turning about one end ----
const P4 = { l: 0.50, w: 20, B: 0.40 };
P4.emf = 0.5 * P4.B * P4.w * P4.l ** 2;
P4.nums = [P4.B * P4.w * P4.l ** 2, P4.emf, P4.B * P4.w * P4.l, P4.emf / 2];   // tip speed for the whole rod · right · dropped an ℓ · ¼
// ---- page 5: pulling the page's loop into the field at constant speed ----
const P5 = (() => { const { B, h, w, v, R } = M.CROSS, F = B * B * h * h * v / R;
  return { F, nums: [B * B * h * w * v / R, 2 * F, F, B * h * h * v / R].map(x => x * 1e3) }; })();   // used w · both sides · right · one B only
// ---- page 6: how far the page's bar coasts ----
const P6 = (() => { const { v0, tau } = M.RAIL; return { d: v0 * tau, nums: [v0 * tau / 2, v0 * tau * (1 - 1 / Math.E), v0 * tau] }; })();
// ---- page 7: a solenoid's inductance; the page's solenoid driven sinusoidally ----
const P7 = { N: 500, l: 0.25, r: 0.010 };
P7.L = MU0 * P7.N ** 2 * Math.PI * P7.r ** 2 / P7.l;
P7.nums = [P7.L, MU0 * P7.N ** 2 * Math.PI * (2 * P7.r) ** 2 / P7.l, MU0 * P7.N * Math.PI * P7.r ** 2 / P7.l, MU0 * P7.N ** 2 * P7.r ** 2 / P7.l].map(x => x * 1e3);   // right · diameter · N not N² · forgot π
const P7b = { I0: 2.0, w: 50 };
P7b.emf = M.SOL.L * P7b.I0 * P7b.w;
P7b.nums = [M.SOL.L * P7b.I0, M.SOL.L * P7b.I0 / P7b.w, P7b.emf, M.SOL.L * P7b.I0 * P7b.w ** 2].map(x => x * 1e3);
// ---- page 8: the page's RL circuit reaching 2.0 A ----
const P8 = { I: 2.0 };
P8.t = -M.RL.tau * Math.log(1 - P8.I / M.RL.Imax);
P8.nums = [M.RL.tau, P8.t, M.RL.tau * Math.log(M.RL.Imax / P8.I), M.RL.tau * P8.I / M.RL.Imax];   // assumed τ · right · ln upside down · linear
// ---- page 9: the page's LC circuit, first maximum of the current ----
const P9 = { t: M.LC.T / 4, I: M.LC.Imax };

export const PRACTICE = {
  0: [
    { q: `一个 ${P0.N} 匝、面积 ${p(P0.A * 1e4, 0)} cm² 的线圈平放在与它垂直的匀强磁场中。磁场在 ${p(P0.dt, 2)} s 内从 ${p(P0.B1, 2)} T 均匀增大到 ${p(P0.B2, 2)} T。感应电动势的大小为`,
      choices: P0.nums.map(x => `${p(x, 3)} V`), answer: 1, nums: P0.nums,
      why: `<p>每匝 Φ = <i>BA</i>，${P0.N} 匝全部相加：</p><div class="eq">|ε| = <i>NA</i> Δ<i>B</i>/Δ<i>t</i> = ${P0.N} × ${P0.A} m² × ${p(P0.B2 - P0.B1, 2)} T / ${P0.dt} s = ${p(P0.emf, 3)} V</div><p>只有 <i>B</i> 的<b>变化量</b>起作用：只用 ${P0.B2} T 得 ${p(P0.nums[2], 3)} V；漏掉 <i>N</i> 得到的是单匝的 ${p(P0.nums[0], 3)} V。</p>` },
    { q: `穿过线圈的磁通量为 Φ<sub><i>B</i></sub>(<i>t</i>) = ${p(P0b.a, 1)}<i>t</i><sup>3</sup> − ${p(P0b.b, 1)}<i>t</i>（单位 mWb，<i>t</i> 的单位为 s）。在 <i>t</i> > 0 的哪一时刻感应电动势为零？`,
      choices: P0b.nums.map(x => `${p(x, 2)} s`), answer: 3, nums: P0b.nums,
      why: `<p>电动势等于 Φ 图线<b>斜率</b>的相反数，而不是 Φ 本身：</p><div class="eq">ε = −<i>d</i>Φ/<i>dt</i> = −(${p(3 * P0b.a, 0)}<i>t</i><sup>2</sup> − ${p(P0b.b, 0)}) = 0 &nbsp;→&nbsp; <i>t</i> = √(${p(P0b.b, 0)}/${p(3 * P0b.a, 0)}) = ${p(P0b.t, 2)} s</div><p>在 ${p(P0b.nums[0], 2)} s 时磁通量为零，但仍在变化，所以电动势不为零。</p>` },
  ],
  1: [
    { q: '把条形磁体的 N 极沿线圈轴线直接拉离线圈。从磁体一侧看，线圈中的感应电流',
      choices: ['沿逆时针方向，线圈排斥磁体', '沿顺时针方向，线圈排斥磁体', '沿逆时针方向，线圈吸引磁体', '沿顺时针方向，线圈吸引磁体'], answer: 3,
      why: '<p>N 极的磁场背离观察者穿过线圈，并且在减弱。感应磁场与它同向，也背离观察者，以弥补减少的部分：由右手定则，从磁体一侧看是<b>顺时针</b>电流。磁感线从线圈靠近磁体的一面穿入，所以这一面是 S 极，把 N 极往回拉：线圈阻碍磁体的运动。</p>' },
    { q: `本页的线圈中（<i>R</i> = ${p(M.LENZ.R * 1e3, 0)} mΩ），N 极在 ${p(M.LENZ.run, 1)} s 内靠近，磁通量从 ${p(M.lenzCase(M.CASES[0], 0).Phi * 1e6, 2)} µWb 增大到 ${p(M.lenzCase(M.CASES[0], M.LENZ.run).Phi * 1e6, 2)} µWb。绕线圈流过的总电荷量为`,
      choices: L1.nums.map(x => `${p(x, 2)} mC`), answer: 3, nums: L1.nums,
      why: `<p>对电流积分，时间就消去了：</p><div class="eq"><i>Q</i> = ∫<i>I dt</i> = ∫(ε/<i>R</i>) <i>dt</i> = (1/<i>R</i>)∫|<i>d</i>Φ| = ΔΦ/<i>R</i> = ${p(L1.dPhi * 1e6, 2)} µWb / ${M.LENZ.R} Ω = ${p(L1.Q * 1e3, 2)} mC</div><p>与磁体运动的快慢无关。${p(L1.nums[1], 2)} 是以 mA 为单位的平均电流，不是电荷量。</p>` },
  ],
  2: [
    { q: '两个线圈绕在同一个铁芯上。若把<b>次级线圈</b>的匝数加倍，互感 <i>M</i>',
      choices: ['加倍', '不变', '变为四倍', '减半'], answer: 0,
      why: '<p><i>M</i> = <i>N</i><sub>2</sub>Φ<sub>2</sub>/<i>I</i><sub>1</sub>。每匝的磁通量由初级线圈的电流和匝数决定，保持不变；次级匝数加倍，磁链也加倍。<i>M</i> = μ<sub>r</sub>μ<sub>0</sub><i>N</i><sub>1</sub><i>N</i><sub>2</sub><i>A</i>/ℓ 与每个 <i>N</i> 都成正比；随 <i>N</i><sup>2</sup> 变化的是自感。</p>' },
    { q: `本页的铁芯上（<i>M</i> = ${p(M.CORE.M * 1e3, 1)} mH，<i>L</i><sub>1</sub> = ${p(M.CORE.L1 * 1e3, 1)} mH），初级线圈的电流为 <i>I</i><sub>1</sub> = ${p(P2.c, 1)}<i>t</i><sup>2</sup>（单位 A，<i>t</i> 的单位为 s）。<i>t</i> = ${p(P2.t, 2)} s 时次级线圈电动势的大小为`,
      choices: P2.nums.map(x => `${p(x, 1)} mV`), answer: 1, nums: P2.nums,
      why: `<div class="eq">ε<sub>2</sub> = −<i>M dI</i><sub>1</sub>/<i>dt</i> = −<i>M</i>(${p(2 * P2.c, 1)}<i>t</i>) = −${p(M.CORE.M * 1e3, 1)} mH × ${p(P2.dI, 2)} A/s = −${p(P2.nums[1], 1)} mV</div><p>要用电流的变化率，而不是 <i>I</i><sub>1</sub> 本身（${p(P2.nums[0], 1)} mV）；而且次级线圈对应的是 <i>M</i>，不是初级线圈自己的 <i>L</i><sub>1</sub>。</p>` },
  ],
  3: [
    { q: '矩形线圈的边 <i>b</i> 与通有电流 <i>I</i> 的长直导线平行；近边距导线 <i>r</i>，远边距导线 <i>r</i> + <i>a</i>。穿过线圈的磁通量为',
      choices: ['(μ<sub>0</sub><i>Ib</i>/2π<i>r</i>)<i>a</i>', '(μ<sub>0</sub><i>Ib</i>/2π) ln((<i>r</i> + <i>a</i>)/<i>r</i>)', '(μ<sub>0</sub><i>Ia</i>/2π) ln((<i>r</i> + <i>b</i>)/<i>r</i>)', '(μ<sub>0</sub><i>Ib</i>/2π)(1/<i>r</i> − 1/(<i>r</i> + <i>a</i>))'], answer: 1,
      why: '<p><i>B</i> = μ<sub>0</sub><i>I</i>/2π<i>s</i> 随距离 <i>s</i> 变化，所以把线圈切成平行于导线的细条 <i>b ds</i>：</p><div class="eq">Φ = ∫<sub><i>r</i></sub><sup><i>r</i>+<i>a</i></sup> (μ<sub>0</sub><i>I</i>/2π<i>s</i>) <i>b ds</i> = (μ<sub>0</sub><i>Ib</i>/2π) ln((<i>r</i> + <i>a</i>)/<i>r</i>)</div><p>选项 A 把 <i>B</i> 当作处处等于近边处的值；选项 D 是导数的形式，不是积分的形式。</p>' },
    { q: `本页的线圈（沿导线方向 <i>b</i> = ${p(M.WIRE.b * 100, 0)} cm，垂直导线方向 <i>a</i> = ${p(M.WIRE.a * 100, 0)} cm）以 ${p(M.WIRE.v * 100, 0)} cm/s 径直远离一根 ${M.WIRE.I} A 的导线。当近边距导线 ${p(M.WIRE.r0 * 100, 0)} cm 时，|ε| 为`,
      choices: P3.nums.map(x => `${p(x, 3)} µV`), answer: 3, nums: P3.nums,
      why: `<p>只有平行于导线的两条边切割磁感线。每条边的动生电动势为 <i>Bbv</i>，绕线圈一周两者方向相反：</p><div class="eq">ε = (<i>B</i><sub>近</sub> − <i>B</i><sub>远</sub>)<i>bv</i> = μ<sub>0</sub><i>Iabv</i> / 2π<i>r</i>(<i>r</i> + <i>a</i>) = ${p(P3.emf * 1e6, 3)} µV</div><p>与对数式的 −<i>d</i>Φ/<i>dt</i> 结果相同。只算近边得 ${p(P3.nums[0], 3)} µV；把两条边相加得 ${p(P3.nums[1], 3)} µV。</p>` },
  ],
  4: [
    { q: '一根竖直的金属棒在垂直纸面向里的匀强磁场中向右运动，没有接入电路。片刻之后，',
      choices: ['上端电势较高，没有电流', '下端电势较高，有电流', '下端电势较高，没有电流', '上端电势较高，电流沿棒向下流'], answer: 0,
      why: '<p><i>F</i> = <i>qv</i>×<i>B</i>：向右 × 垂直纸面向里 = 向上，所以正电荷聚集在上端。它们的电场把电荷往回推，直到 <i>qE</i> = <i>qvB</i>；此后沿棒不再有电荷移动。没有闭合路径时，有电动势 <i>BLv</i>，但没有持续的电流。</p>' },
    { q: `一根 ${p(P4.l * 100, 0)} cm 长的金属棒绕一端以 ${P4.w} rad/s 转动，转动平面与 ${p(P4.B, 2)} T 的匀强磁场垂直。棒两端之间的电动势为`,
      choices: P4.nums.map(x => `${p(x, 2)} V`), answer: 1, nums: P4.nums,
      why: `<p>每一小段 <i>dr</i> 的速度为 <i>v</i> = ω<i>r</i>，所以它的电动势为 <i>B</i>ω<i>r dr</i>。沿棒加起来：</p><div class="eq">ε = ∫<sub>0</sub><sup>ℓ</sup> <i>B</i>ω<i>r dr</i> = ½<i>B</i>ωℓ<sup>2</sup> = ½ × ${P4.B} × ${P4.w} × ${P4.l}<sup>2</sup> = ${p(P4.emf, 2)} V</div><p>整根棒都用棒端速度 ωℓ 计算，得 ${p(P4.nums[0], 2)} V，大了一倍：平均速度只有棒端速度的一半。</p>` },
  ],
  5: [
    { q: `线圈（高 <i>h</i> = ${p(M.CROSS.h * 100, 0)} cm，宽 ${p(M.CROSS.w * 100, 0)} cm，<i>R</i> = ${M.CROSS.R} Ω）以 ${M.CROSS.v} m/s 的恒定速度被拉入 ${M.CROSS.B} T 的磁场。当前边在场内、后边在场外时，所需的拉力为`,
      choices: P5.nums.map(x => `${p(x, 1)} mN`), answer: 2, nums: P5.nums,
      why: `<div class="eq"><i>I</i> = <i>Bhv</i>/<i>R</i>, &nbsp;<i>F</i> = <i>IhB</i> = <i>B</i><sup>2</sup><i>h</i><sup>2</sup><i>v</i>/<i>R</i> = ${p(P5.F * 1e3, 1)} mN</div><p>只有前边是在磁场中通有电流的边（上下两边受力相互抵消），也只有高度 <i>h</i> 切割磁感线。验算：<i>Fv</i> = ${p(P5.F * M.CROSS.v * 1e3, 1)} mW = ε<sup>2</sup>/<i>R</i>。</p>` },
    { q: '质量为 <i>m</i>、电阻为 <i>R</i>、高为 <i>h</i> 的线圈以速度 <i>v</i><sub>0</sub> <b>自由</b>滑入（无拉力）匀强磁场 <i>B</i>。在后边仍在场外时，求它的速度与前边进入磁场的距离 <i>x</i> 的关系。',
      solution: `<p>只有前边在磁场中时，电流为 <i>Bhv</i>/<i>R</i>，磁场以 <i>IhB</i> 的力把它往回推：</p><div class="eq"><i>m dv</i>/<i>dt</i> = −<i>B</i><sup>2</sup><i>h</i><sup>2</sup><i>v</i>/<i>R</i></div><p>把 <i>dv</i>/<i>dt</i> 写成 <i>v dv</i>/<i>dx</i>，约去 <i>v</i>：</p><div class="eq"><i>m dv</i>/<i>dx</i> = −<i>B</i><sup>2</sup><i>h</i><sup>2</sup>/<i>R</i> &nbsp;→&nbsp; <i>v</i>(<i>x</i>) = <i>v</i><sub>0</sub> − <i>B</i><sup>2</sup><i>h</i><sup>2</sup><i>x</i>/<i>mR</i></div><p>速度<b>随距离线性减小</b>（随时间按指数规律减小）。若 <i>x</i> 还没达到线圈宽度 <i>v</i> 就减到 0，线圈会停在半途。</p>` },
  ],
  6: [
    { q: `本页的导体棒（τ = <i>mR</i>/<i>B</i><sup>2</sup><i>L</i><sup>2</sup> = ${p(M.RAIL.tau, 2)} s）以 ${p(M.RAIL.v0, 2)} m/s 的速度释放，此后不受推力。它停下前滑行多远？`,
      choices: [`${p(P6.nums[0], 2)} m`, `${p(P6.nums[1], 2)} m`, '它永远不会停下，所以距离无限增大', `${p(P6.nums[2], 2)} m`], answer: 3, nums: [P6.nums[0], P6.nums[1], NaN, P6.nums[2]],
      why: `<p>速度按指数规律衰减，但它的积分是有限的：</p><div class="eq"><i>x</i> = ∫<sub>0</sub><sup>∞</sup> <i>v</i><sub>0</sub><i>e</i><sup>−<i>t</i>/τ</sup> <i>dt</i> = <i>v</i><sub>0</sub>τ = ${p(P6.d, 2)} m</div><p>${p(P6.nums[1], 2)} m 只是到 <i>t</i> = τ 时滑过的距离；${p(P6.nums[0], 2)} m 假定了减速度恒定。</p>` },
    { q: '把连接导轨的电阻换成阻值加倍的电阻，并以同样的速度推出导体棒。棒停下的过程中产生的总热量',
      choices: ['加倍', '减半', '不变', '变为四倍'], answer: 2,
      why: '<p>无论 <i>R</i> 多大，棒的全部动能 ½<i>mv</i><sub>0</sub><sup>2</sup> 最终都变成热。<i>R</i> 越大，电流越小，制动越弱，所以 τ 加倍，棒滑行的距离也加倍，但总热量不变。</p>' },
  ],
  7: [
    { q: `一个螺线管在 ${p(P7.l * 100, 0)} cm 的长度上绕 ${P7.N} 匝，半径 ${p(P7.r * 100, 1)} cm。它的自感约为`,
      choices: P7.nums.map(x => x < 0.01 ? `${p(x * 1e3, 2)} µH` : `${p(x, 3)} mH`), answer: 0, nums: P7.nums,
      why: `<p>每一匝中都有 <i>B</i> = μ<sub>0</sub><i>nI</i>，所以 <i>N</i>Φ = <i>N</i>(μ<sub>0</sub><i>NI</i>/ℓ)π<i>r</i><sup>2</sup>，</p><div class="eq"><i>L</i> = μ<sub>0</sub><i>N</i><sup>2</sup>π<i>r</i><sup>2</sup>/ℓ = ${p(P7.L * 1e3, 3)} mH</div><p>把直径当作 <i>r</i>，结果大了 4 倍；用 <i>N</i> 代替 <i>N</i><sup>2</sup>，就忘了匝数增多既产生更强的磁场，又能接住更多的磁通量。</p>` },
    { q: `本页的螺线管（<i>L</i> = ${p(M.SOL.L * 1e3, 2)} mH）中的电流为 <i>I</i>(<i>t</i>) = (${p(P7b.I0, 1)} A) sin(${P7b.w}<i>t</i>)。其自感电动势的最大值为`,
      choices: P7b.nums.map(x => x < 1 ? `${p(x, 3)} mV` : x < 10 ? `${p(x, 2)} mV` : x < 1000 ? `${p(x, 1)} mV` : `${p(x / 1e3, 1)} V`), answer: 2, nums: P7b.nums,
      why: `<div class="eq">ε<sub><i>L</i></sub> = −<i>L dI</i>/<i>dt</i> = −<i>LI</i><sub>0</sub>ω cos ω<i>t</i>, &nbsp;max <i>LI</i><sub>0</sub>ω = ${p(M.SOL.L * 1e3, 2)} mH × ${P7b.I0} A × ${P7b.w} s<sup>−1</sup> = ${p(P7b.emf * 1e3, 1)} mV</div><p>峰值出现在 <i>I</i> = 0、电流变化最快的时刻；<i>LI</i><sub>0</sub> = ${p(P7b.nums[0], 2)} mV 实际上是以 mWb 为单位的磁链，不是电动势。</p>` },
  ],
  8: [
    { q: `本页的电路中（ε = ${M.RL.E} V，<i>R</i> = ${M.RL.R} Ω，<i>L</i> = ${M.RL.L} H），从 <i>I</i> = 0 开始，经过多长时间电流达到 ${p(P8.I, 1)} A？`,
      choices: P8.nums.map(x => `${p(x, 3)} s`), answer: 1, nums: P8.nums,
      why: `<p>从 <i>I</i> = 0 出发解 <i>L dI</i>/<i>dt</i> = ε − <i>IR</i>：<i>I</i> = (ε/<i>R</i>)(1 − <i>e</i><sup>−<i>t</i>/τ</sup>)，τ = <i>L</i>/<i>R</i> = ${p(M.RL.tau, 2)} s。</p><div class="eq"><i>t</i> = −τ ln(1 − <i>IR</i>/ε) = −${p(M.RL.tau, 2)} ln(1 − ${p(P8.I, 1)}/${p(M.RL.Imax, 1)}) = ${p(P8.t, 3)} s</div><p>${p(P8.I, 1)} A 是 ${p(M.RL.Imax, 0)} A 的 ${p(P8.I / M.RL.Imax * 100, 0)} %，超过 τ 时达到的 63 %，所以所需时间比 τ 长。</p>` },
    { q: '含电池的 RL 电路接通很长时间后，突然把电池移出回路（回路经电阻保持闭合）。紧接着，',
      choices: ['电流为 ε/<i>R</i>，开始减小，电感器充当电源', '电流为零', '电流为 ε/<i>R</i>，保持不变', '电流反向'], answer: 0,
      why: '<p>电感器不允许电流突变，所以 <i>I</i> 从 ε/<i>R</i> 开始，方向不变。没有电池时，<i>L dI</i>/<i>dt</i> = −<i>IR</i>：此时电感器的电动势驱动电流流过 <i>R</i>，电流按 <i>e</i><sup>−<i>t</i>/τ</sup> 衰减，½<i>LI</i><sup>2</sup> 变成热。</p>' },
  ],
  9: [
    { q: `本页的电容器（${p(M.LC.C * 1e6, 0)} µF，${p(M.LC.Q * 1e6, 0)} µC）在 <i>t</i> = 0 时接到 ${p(M.LC.L * 1e3, 0)} mH 的线圈上。电流第一次达到最大是在`,
      choices: [`<i>t</i> = ${p(M.LC.T / 2 * 1e3, 2)} ms，${p(P9.I * 1e3, 0)} mA`, `<i>t</i> = ${p(P9.t * 1e3, 2)} ms，${p(M.LC.f * M.LC.Q * 1e3, 1)} mA`, `<i>t</i> = ${p(P9.t * 1e3, 2)} ms，${p(P9.I * 1e3, 0)} mA`, `<i>t</i> = 0，${p(P9.I * 1e3, 0)} mA`], answer: 2,
      nums: [M.LC.T / 2 * 1e3, P9.t * 1e3, P9.t * 1e3, 0], nums2: [P9.I * 1e3, M.LC.f * M.LC.Q * 1e3, P9.I * 1e3, P9.I * 1e3],
      why: `<p>ω = 1/√(<i>LC</i>) = ${p(M.LC.w, 0)} rad/s，<i>T</i> = 2π/ω = ${p(M.LC.T * 1e3, 2)} ms。<i>q</i> = <i>Q</i> cos ω<i>t</i>，<i>I</i> = −ω<i>Q</i> sin ω<i>t</i> 第一次达到最大是在 ω<i>t</i> = π/2，即四分之一周期时，此时两板电荷已放完：</p><div class="eq"><i>t</i> = <i>T</i>/4 = ${p(P9.t * 1e3, 2)} ms, &nbsp;|<i>I</i>| = ω<i>Q</i> = ${p(P9.I * 1e3, 0)} mA</div><p><i>t</i> = 0 时电流为零：线圈不允许它突变。${p(M.LC.f * M.LC.Q * 1e3, 1)} mA 是误用 <i>f</i> 代替 ω 的结果。</p>` },
    { q: '对没有电阻的 LC 电路，证明 <i>U</i> = <i>q</i><sup>2</sup>/2<i>C</i> + ½<i>LI</i><sup>2</sup> 保持不变，并用能量求电容器带电荷量为 <i>Q</i>/2 时的电流（最大电荷量为 <i>Q</i>）。',
      solution: `<p>利用 <i>I</i> = <i>dq</i>/<i>dt</i> 求导：</p><div class="eq"><i>dU</i>/<i>dt</i> = (<i>q</i>/<i>C</i>)<i>I</i> + <i>LI dI</i>/<i>dt</i> = <i>I</i>(<i>q</i>/<i>C</i> + <i>L dI</i>/<i>dt</i>)</div><p>括号内就是回路定律，每一时刻都为零，所以 <i>U</i> 始终等于 <i>Q</i><sup>2</sup>/2<i>C</i>。在 <i>q</i> = <i>Q</i>/2 时：</p><div class="eq">½<i>LI</i><sup>2</sup> = <i>Q</i><sup>2</sup>/2<i>C</i> − <i>Q</i><sup>2</sup>/8<i>C</i> = 3<i>Q</i><sup>2</sup>/8<i>C</i> &nbsp;→&nbsp; |<i>I</i>| = (√3/2) <i>Q</i>/√(<i>LC</i>) = (√3/2)ω<i>Q</i></div><p>对本页的电路，这个值为 ${p(Math.sqrt(3) / 2 * M.LC.Imax * 1e3, 1)} mA。电荷只放出一半时，四分之三的能量已经在线圈中。</p>` },
  ],
};
