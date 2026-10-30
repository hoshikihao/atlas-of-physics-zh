// circuits/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const { CU, E_CH } = M;

// ---- page 0: drift speed in a round copper wire; charge from a changing current ----
const P0 = { I: 3.0, D: 2.0e-3 };
const vd = A => P0.I / (CU.n * E_CH * A);
P0.v = vd(Math.PI * (P0.D / 2) ** 2);
P0.nums = [P0.v, vd(Math.PI * P0.D ** 2), vd(P0.D ** 2), vd((P0.D / 2) ** 2)].map(x => x * 1e3);   // right · diameter as radius · A = D² · forgot π
const P0b = { a: 4.0, b: 1.0, T: 4.0 };                     // I = a t − b t² (A), 0 to T
P0b.q = P0b.a * P0b.T ** 2 / 2 - P0b.b * P0b.T ** 3 / 3;
P0b.Imax = P0b.a ** 2 / (4 * P0b.b);
P0b.nums = [P0b.Imax * P0b.T, P0b.Imax * P0b.T / 2, P0b.q, P0b.a * P0b.T ** 2 / 2];   // peak × time · triangle · right · dropped the t² term
// ---- page 1: the page's thin nichrome wire; a tapered one ----
const { rho } = M.RES, L1 = 2.0, rA = M.RES.dThin / 2, rB = M.RES.dThick / 2;
const P1 = { R: M.rThin(L1) };
P1.nums = [rho * L1 / (Math.PI * M.RES.dThin ** 2), rho * L1 / rA ** 2, P1.R, rho * L1 / M.RES.dThin ** 2];   // diameter as radius · forgot π · right · A = d²
const P1b = { R: rho * L1 / (Math.PI * rA * rB) };
P1b.nums = [rho * L1 / (Math.PI * ((rA + rB) / 2) ** 2), (M.rThin(L1) + M.rThick(L1)) / 2, M.rThin(L1), P1b.R];   // mean radius · mean of the ends · thin end only · right
// ---- page 2: a hollow carbon cylinder, current flowing radially ----
const P2 = { rho: 3.5e-5, a: 0.010, b: 0.020, L: 0.050 };
P2.R = P2.rho * Math.log(P2.b / P2.a) / (2 * Math.PI * P2.L);
P2.nums = [P2.rho * (P2.b - P2.a) / (2 * Math.PI * P2.a * P2.L), P2.R, P2.rho * (P2.b - P2.a) / (2 * Math.PI * P2.b * P2.L), P2.rho * P2.L / (Math.PI * (P2.b ** 2 - P2.a ** 2))].map(x => x * 1e5);
// inner area only · right · outer area only · current along the axis instead
// ---- page 3: two of the page's bulbs in series; a ramped voltage ----
const { E: VB, R: RB } = M.BULB;
const P3 = { P: VB ** 2 / (2 * RB) };
P3.nums = [2 * VB ** 2 / RB, VB ** 2 / RB, P3.P, VB ** 2 / (4 * RB)];   // parallel · one bulb · right · each bulb
const P3b = { T: 10 };
P3b.E = VB ** 2 / RB * P3b.T / 3;
P3b.nums = [VB ** 2 / RB * P3b.T / 2, P3b.E, VB ** 2 / RB * P3b.T, (VB / 2) ** 2 / RB * P3b.T];   // average P linear · right · full P · P at the average V
// ---- page 4: the page's cell on 4 Ω; what r is best ----
const { E: EC, r: rC } = M.CELL, RL4 = 4;
const P4 = { V: EC * RL4 / (RL4 + rC) };
P4.nums = [EC, EC * rC / (RL4 + rC), P4.V, EC / 2];                 // ideal · the Ir drop · right · half
// ---- page 5: strips side by side ----
const P5 = { R0: 12 };
P5.R = P5.R0 / 2;                                                    // σ averages 2σ₀ across the width
P5.nums = [P5.R0 * Math.log(3) / 2, P5.R0 / 3, P5.R, P5.R0];         // strips in series · edge at 3σ₀ · right · σ₀ throughout
// ---- page 6: the page's combination with R₃ broken; R₃ as a variable resistor ----
const CB = M.COMBO;
const P6 = { I: CB.E / (CB.R1 + CB.R245) };
P6.nums = [CB.E / CB.Req, P6.I, CB.E / CB.R1, CB.E / CB.R245];      // unchanged · right · R₁ only · the 8 Ω only
const P6b = { R: CB.R1 * CB.R245 / (CB.R1 + CB.R245) };
P6b.nums = [P6b.R, CB.R1, CB.R245, CB.R1 + CB.R245];                 // right · R₁ only · the branch only · in series
// ---- page 7: the page's network with the 6 V battery replaced by a wire ----
const K7 = M.KIRCH, R345 = 1 / (1 / K7.R5 + 1 / (K7.R3 + K7.R4));
const P7 = { I: K7.E1 / (K7.R1 + K7.R2 + R345) };
const I1now = M.edgeI(K7, M.solve(K7.edges, 'bl'), 'R1');
P7.nums = [I1now, P7.I, K7.E1 / (K7.R1 + K7.R2), K7.E1 / (K7.R1 + K7.R2 + K7.R3 + K7.R4)].map(x => x * 1e3);   // unchanged · right · R₅ a short · R₅ ignored
const P7b = { dI: 1 / 44, E2zero: -2.4 };                            // from the solution below; checked numerically
// ---- page 8: the page's RC circuit ----
const { E: ER, tau } = M.RC, V8 = 9.0;
const P8 = { t: -tau * Math.log(1 - V8 / ER) };
P8.nums = [tau * Math.log(ER / V8), P8.t, tau * V8 / ER, tau];   // ln upside down · right · linear · τ
const P8b = { f: 1 - Math.exp(-2) };
P8b.nums = [(1 - Math.exp(-1)) * 100, P8b.f * 100, Math.exp(-1) * 100, 50];   // used e^(−t/RC) for the energy · right · what's left of q · half

export const PRACTICE = {
  0: [
    { q: `一根<b>直径</b>为 ${p(P0.D * 1e3, 1)} mm 的铜导线通有 ${p(P0.I, 1)} A 的电流（<i>n</i> = 8.5 × 10<sup>28</sup> m<sup>−3</sup>）。其中电子的漂移速度为`,
      choices: P0.nums.map(x => `${p(x, 4)} mm/s`), answer: 0, nums: P0.nums,
      why: `<p>面积要用<b>半径</b>算：<i>A</i> = π(${p(P0.D / 2 * 1e3, 1)} mm)<sup>2</sup> = ${p(Math.PI * (P0.D / 2) ** 2 * 1e6, 3)} mm²。于是</p><div class="eq"><i>v</i><sub>d</sub> = <i>I</i>/<i>neA</i> = ${P0.I} / (8.5×10<sup>28</sup> × 1.60×10<sup>−19</sup> × ${p(Math.PI * (P0.D / 2) ** 2 * 1e6, 3)}×10<sup>−6</sup>) = ${p(P0.v * 1e3, 4)} mm/s</div><p>把直径当成半径，得到 ${p(P0.nums[1], 4)} mm/s，只有正确值的四分之一。</p>` },
    { q: `导线中的电流为 <i>I</i>(<i>t</i>) = ${p(P0b.a, 1)}<i>t</i> − ${p(P0b.b, 1)}<i>t</i><sup>2</sup>（单位 A，<i>t</i> 的单位为 s），从 <i>t</i> = 0 持续到 ${p(P0b.T, 1)} s。这段时间内通过某一横截面的电荷量为`,
      choices: P0b.nums.map(x => `${p(x, 1)} C`), answer: 2, nums: P0b.nums,
      why: `<div class="eq"><i>q</i> = ∫<i>I dt</i> = ∫<sub>0</sub><sup>${P0b.T}</sup> (${P0b.a}<i>t</i> − <i>t</i><sup>2</sup>) <i>dt</i> = ${p(P0b.a / 2, 0)}(${P0b.T})<sup>2</sup> − (${P0b.T})<sup>3</sup>/3 = ${p(P0b.a * P0b.T ** 2 / 2, 0)} − ${p(P0b.b * P0b.T ** 3 / 3, 2)} = ${p(P0b.q, 1)} C</div><p>即 <i>I</i>(<i>t</i>) 图线下的面积，图线是峰值为 ${p(P0b.Imax, 0)} A 的抛物线。峰值 × 时间（${p(P0b.nums[0], 1)} C）算多了；按三角形算（${p(P0b.nums[1], 1)} C）又算少了。</p>` },
  ],
  1: [
    { q: `本页那根细镍铬合金导线（ρ = 1.10 × 10<sup>−6</sup> Ω·m，<b>直径</b> ${p(M.RES.dThin * 1e3, 1)} mm）长 ${p(L1, 1)} m。它的电阻为`,
      choices: P1.nums.map(x => `${p(x, 2)} Ω`), answer: 2, nums: P1.nums,
      why: `<div class="eq"><i>R</i> = ρ<i>L</i>/<i>A</i> = ρ<i>L</i>/π<i>r</i><sup>2</sup> = 1.10×10<sup>−6</sup> × ${L1} / (π × (${p(rA * 1e3, 2)}×10<sup>−3</sup>)<sup>2</sup>) = ${p(P1.R, 2)} Ω</div><p>半径是直径的一半；用直径代入，结果只有答案的四分之一：${p(P1.nums[0], 2)} Ω。</p>` },
    { q: `一根长 ${p(L1, 1)} m 的镍铬合金棒粗细渐变：半径从一端的 ${p(rA * 1e3, 2)} mm 线性增大到另一端的 ${p(rB * 1e3, 2)} mm。它两端之间的电阻为`,
      choices: P1b.nums.map(x => `${p(x, 2)} Ω`), answer: 3, nums: P1b.nums,
      why: `<p>各薄片 <i>dx</i> 串联；每片 <i>dR</i> = ρ <i>dx</i>/π<i>r</i>(<i>x</i>)<sup>2</sup>，其中 <i>r</i> = <i>a</i> + (<i>b</i> − <i>a</i>)<i>x</i>/<i>L</i>，所以 <i>dx</i> = <i>L dr</i>/(<i>b</i> − <i>a</i>)：</p><div class="eq"><i>R</i> = (ρ<i>L</i>/π(<i>b</i> − <i>a</i>)) ∫<sub><i>a</i></sub><sup><i>b</i></sup> <i>dr</i>/<i>r</i><sup>2</sup> = ρ<i>L</i>/π<i>ab</i> = ${p(P1b.R, 2)} Ω</div><p>既不是按平均半径算的值（${p(P1b.nums[0], 2)} Ω），也不是两端对应电阻的平均值（${p(P1b.nums[1], 2)} Ω）：细的一端起主要作用，但不是全部。</p>` },
  ],
  2: [
    { q: '在本页的电路中（6 V 电池、3 Ω 电阻、理想导线），连接电池 + 极与电阻的那段导线，两端的电势差是多少？',
      choices: ['6 V', '3 V', '2 V', '0 V'], answer: 3,
      why: '<p>理想导线的 <i>R</i> = 0，所以无论电流多大，沿导线 Δ<i>V</i> = <i>IR</i> = 0。这段导线上每一点都处于电池 + 极的电势；6 V 的电压降全部发生在电阻上。</p>' },
    { q: `一根碳管（ρ = ${p(P2.rho * 1e5, 1)} × 10<sup>−5</sup> Ω·m），内半径 ${p(P2.a * 100, 0)} cm，外半径 ${p(P2.b * 100, 0)} cm，长 ${p(P2.L * 100, 0)} cm，电流从内表面<b>沿径向</b>流到外表面。它的电阻为`,
      choices: P2.nums.map(x => `${p(x, 2)} × 10<sup>−5</sup> Ω`), answer: 1, nums: P2.nums,
      why: `<p>把管子看成一层层串联的薄圆柱壳；每层沿电流方向的长度为 <i>dr</i>，面积为 2π<i>rL</i>：</p><div class="eq"><i>R</i> = ∫<sub><i>a</i></sub><sup><i>b</i></sup> ρ <i>dr</i>/2π<i>rL</i> = (ρ/2π<i>L</i>) ln(<i>b</i>/<i>a</i>) = ${p(P2.R * 1e5, 2)} × 10<sup>−5</sup> Ω</div><p>面积随 <i>r</i> 增大，所以只用内表面积（${p(P2.nums[0], 2)}）或只用外表面积（${p(P2.nums[2], 2)}）都不对。</p>` },
  ],
  3: [
    { q: `把两个本页的灯泡（每个 ${RB} Ω）<b>串联</b>后接在 ${VB} V 的电池上。它们消耗的总功率为`,
      choices: P3.nums.map(x => `${p(x, 1)} W`), answer: 2, nums: P3.nums,
      why: `<p>串联时 <i>R</i><sub>eq</sub> = ${2 * RB} Ω，所以</p><div class="eq"><i>P</i> = Δ<i>V</i><sup>2</sup>/<i>R</i><sub>eq</sub> = ${VB}<sup>2</sup>/${2 * RB} = ${p(P3.P, 1)} W</div><p>是单个灯泡单独接入时（${p(P3.nums[1], 1)} W）的一半：电流减半，每个灯泡只得到原来四分之一的功率（${p(P3.nums[3], 1)} W）。若并联，它们共消耗 ${p(P3.nums[0], 1)} W。</p>` },
    { q: `一个 ${RB} Ω 电阻两端的电压在 ${P3b.T} s 内从 0 均匀升高到 ${VB} V。这段时间内它产生的热为`,
      choices: P3b.nums.map(x => `${p(x, 1)} J`), answer: 1, nums: P3b.nums,
      why: `<p>Δ<i>V</i> = (${VB}/${P3b.T})<i>t</i>，<i>P</i> = Δ<i>V</i><sup>2</sup>/<i>R</i> 随 <i>t</i><sup>2</sup> 增长：</p><div class="eq"><i>E</i> = ∫<i>P dt</i> = ∫<sub>0</sub><sup><i>T</i></sup> (${VB}<i>t</i>/${P3b.T})<sup>2</sup>/${RB} <i>dt</i> = (${VB}<sup>2</sup>/${RB})·<i>T</i>/3 = ${p(P3b.E, 1)} J</div><p>把 <i>P</i> 当作线性变化取平均（${p(P3b.nums[0], 1)} J），或用平均电压计算（${p(P3b.nums[3], 1)} J），都忽略了 <i>P</i> 与 Δ<i>V</i> 的平方成正比。</p>` },
  ],
  4: [
    { q: `本页的电池（ℰ = ${EC} V，<i>r</i> = ${rC} Ω）给一个 ${RL4} Ω 的灯泡供电。电池两极间的电势差为`,
      choices: P4.nums.map(x => `${p(x, 1)} V`), answer: 2, nums: P4.nums,
      why: `<div class="eq"><i>I</i> = ℰ/(<i>R</i> + <i>r</i>) = ${EC}/${RL4 + rC} = ${p(EC / (RL4 + rC), 1)} A, &nbsp; Δ<i>V</i> = ℰ − <i>Ir</i> = ${EC} − ${p(EC / (RL4 + rC) * rC, 1)} = ${p(P4.V, 1)} V</div><p>只有没有电流时，路端电压才等于电动势；${p(P4.nums[1], 1)} V 是电池<i>内部</i>的电压降。</p>` },
    { q: `现在灯泡固定为 <i>R</i> = ${RL4} Ω，电池的内阻 <i>r</i> 可以任选（ℰ 不变）。<i>r</i> 取多少时灯泡最亮？`,
      choices: [`<i>r</i> = ${2 * RL4} Ω`, `<i>r</i> = ${RL4} Ω，与负载匹配`, `<i>r</i> = ${RL4 / 2} Ω`, '<i>r</i> = 0'], answer: 3,
      why: `<p><i>P</i> = ℰ<sup>2</sup><i>R</i>/(<i>R</i> + <i>r</i>)<sup>2</sup>，现在 <i>r</i> 是变量：</p><div class="eq"><i>dP</i>/<i>dr</i> = −2ℰ<sup>2</sup><i>R</i>/(<i>R</i> + <i>r</i>)<sup>3</sup> < 0</div><p>对所有 <i>r</i> 都成立，所以 <i>r</i> 越小 <i>P</i> 越大，最小取零。<i>R</i> = <i>r</i> 时功率最大，说的是电池固定、改变<b>负载</b>的情形，反过来不成立。</p>` },
  ],
  5: [
    { q: '在本页接于理想 9 V 电池的 2 Ω、4 Ω、6 Ω 电阻旁，再并联第四个电阻。(i) 2 Ω 支路中的电流、(ii) 电池输出的电流各如何变化？',
      choices: ['(i) 增大；(ii) 增大', '(i) 不变；(ii) 增大', '(i) 减小；(ii) 增大', '(i) 减小；(ii) 不变'], answer: 1,
      why: '<p>每条支路两端仍是完整的 9 V，所以 2 Ω 支路仍为 9/2 = 4.5 A。新支路增加了自己的电流，电池提供各支路电流之和：路径越多，<i>R</i><sub>eq</sub> 越小，总电流越大。（若电池有内阻，路端电压会下降，支路电流也会略微减小。）</p>' },
    { q: `一根电导率均匀为 σ<sub>0</sub> 的导体棒，两端之间的电阻为 ${P5.R0} Ω。现在让它的电导率<b>沿宽度方向</b>线性增大，从一侧的 σ<sub>0</sub> 增大到另一侧的 3σ<sub>0</sub>。它两端之间的电阻为`,
      choices: P5.nums.map(x => `${p(x, 2)} Ω`), answer: 2, nums: P5.nums,
      why: `<p>沿长度方向切成宽 <i>dy</i> 的细条，它们都跨接在同样的两端之间：是<b>并联</b>，所以电导相加：</p><div class="eq">1/<i>R</i> = ∫<sub>0</sub><sup><i>w</i></sup> σ(<i>y</i>)<i>t dy</i>/<i>L</i> = (σ<sub>0</sub><i>wt</i>/<i>L</i>)·∫<sub>0</sub><sup>1</sup>(1 + 2<i>u</i>) <i>du</i> = 2/<i>R</i><sub>0</sub></div><p><i>R</i> = ${P5.R0}/2 = ${p(P5.R, 2)} Ω。把细条当作串联相加，得到 (ln 3/2)<i>R</i><sub>0</sub> = ${p(P5.nums[0], 2)} Ω。</p>` },
  ],
  6: [
    { q: `本页的混联电路中（9 V；R<sub>1</sub> = 2 Ω，R<sub>3</sub> = 2 Ω，R<sub>2</sub> + R<sub>4</sub> + R<sub>5</sub> = ${CB.R245} Ω），R<sub>3</sub> 烧断（断路）。通过 R<sub>1</sub> 的电流变为`,
      choices: P6.nums.map(x => `${p(x, 2)} A`), answer: 1, nums: P6.nums,
      why: `<p>R<sub>3</sub> 断开后，R<sub>1</sub> 与那串 ${CB.R245} Ω 电阻就是简单的串联：</p><div class="eq"><i>I</i> = 9 V / (2 + ${CB.R245}) Ω = ${p(P6.I, 2)} A</div><p>比原来的 ${p(P6.nums[0], 2)} A 小：去掉一条并联路径会使 <i>R</i><sub>eq</sub> <i>增大</i>。</p>` },
    { q: 'R<sub>3</sub> 换成可变电阻 <i>x</i>，其余不变。<i>x</i> 取多少时它消耗的功率最大？',
      choices: P6b.nums.map(x => `${p(x, 1)} Ω`), answer: 0, nums: P6b.nums,
      why: `<p>从 <i>x</i> 两端看进去，电路其余部分是带电池的 R<sub>1</sub> 与那串 ${CB.R245} Ω 电阻并联。去掉 <i>x</i> 时，这两端的电压为 ℰ<sub>th</sub> = 9 × ${CB.R245}/${CB.R1 + CB.R245} = ${p(9 * CB.R245 / (CB.R1 + CB.R245), 1)} V，等效电阻为 <i>R</i><sub>th</sub> = 2 × ${CB.R245}/(2 + ${CB.R245}) = ${p(P6b.R, 1)} Ω。于是</p><div class="eq"><i>P</i>(<i>x</i>) = ℰ<sub>th</sub><sup>2</sup><i>x</i>/(<i>R</i><sub>th</sub> + <i>x</i>)<sup>2</sup>, &nbsp; <i>dP</i>/<i>dx</i> = 0 → <i>x</i> = <i>R</i><sub>th</sub> = ${p(P6b.R, 1)} Ω</div><p>只算 R<sub>1</sub>（2 Ω）就忽略了那串 ${CB.R245} Ω 电阻也接在 <i>x</i> 两端。</p>` },
  ],
  7: [
    { q: `把本页网络中的 ${K7.E2} V 电池换成一根导线。通过 ${K7.E1} V 电池的电流（<i>I</i><sub>1</sub>）变为`,
      choices: P7.nums.map(x => `${p(x, 0)} mA`), answer: 1, nums: P7.nums,
      why: `<p>只剩一个电池，网络就可以化简：R<sub>3</sub> + R<sub>4</sub> = ${K7.R3 + K7.R4} Ω 与 R<sub>5</sub> = ${K7.R5} Ω 并联得 ${p(R345, 3)} Ω，再与 R<sub>1</sub> + R<sub>2</sub> = ${K7.R1 + K7.R2} Ω 串联：</p><div class="eq"><i>I</i><sub>1</sub> = ${K7.E1} V / ${p(K7.R1 + K7.R2 + R345, 3)} Ω = ${p(P7.I * 1e3, 0)} mA</div><p>比原来的 ${p(I1now * 1e3, 0)} mA 小：由叠加原理，6 V 电池（+ 极朝下）原先给 <i>I</i><sub>1</sub> 贡献了 ${p((I1now - P7.I) * 1e3, 0)} mA。把 R<sub>5</sub> 当作短路，得 ${p(P7.nums[2], 0)} mA；忽略 R<sub>5</sub>，得 ${p(P7.nums[3], 0)} mA。</p>` },
    { q: `解答题。在本页的网络中，把第二个电池的电动势 ℰ<sub>2</sub>（+ 极朝下，如图所画）当作变量。利用本页的两个回路方程和 <i>I</i><sub>1</sub> = <i>I</i><sub>2</sub> + <i>I</i><sub>3</sub>，求 <i>dI</i><sub>3</sub>/<i>d</i>ℰ<sub>2</sub>，以及使 <i>I</i><sub>3</sub> = 0 的 ℰ<sub>2</sub>。`,
      solution: `<p>回路 1：20<i>I</i><sub>1</sub> + 5<i>I</i><sub>2</sub> = 12。回路 2：40<i>I</i><sub>3</sub> − 5<i>I</i><sub>2</sub> = ℰ<sub>2</sub>。把 <i>I</i><sub>1</sub> = <i>I</i><sub>2</sub> + <i>I</i><sub>3</sub> 代入回路 1：</p><div class="eq">25<i>I</i><sub>2</sub> + 20<i>I</i><sub>3</sub> = 12 &nbsp;→&nbsp; <i>I</i><sub>2</sub> = (12 − 20<i>I</i><sub>3</sub>)/25</div><div class="eq">40<i>I</i><sub>3</sub> − (12 − 20<i>I</i><sub>3</sub>)/5 = ℰ<sub>2</sub> &nbsp;→&nbsp; <i>I</i><sub>3</sub> = (ℰ<sub>2</sub> + 2.4)/44</div><p>所以 <i>dI</i><sub>3</sub>/<i>d</i>ℰ<sub>2</sub> = 1/44 A/V，即每伏 ${p(P7b.dI * 1e3, 1)} mA：电路是线性的，所以对任意 ℰ<sub>2</sub> 都成立。ℰ<sub>2</sub> = 6 V 时，<i>I</i><sub>3</sub> = 8.4/44 = ${p(8.4 / 44, 3)} A，与本页结果一致。ℰ<sub>2</sub> = ${p(P7b.E2zero, 1)} V 时 <i>I</i><sub>3</sub> = 0：相当于一个 + 极朝<b>上</b>的 2.4 V 电池，恰好抵消 12 V 电池在 R<sub>5</sub> 两端产生的推动作用。</p>`, val: P7b },
  ],
  8: [
    { q: `本页的 RC 电路中（ℰ = ${ER} V，τ = <i>RC</i> = ${p(tau, 1)} s），电容器起初不带电，经过多长时间其电压达到 ${p(V8, 1)} V？`,
      choices: P8.nums.map(x => `${p(x, 2)} s`), answer: 1, nums: P8.nums,
      why: `<div class="eq">Δ<i>V</i><sub>C</sub> = ℰ(1 − e<sup>−<i>t</i>/τ</sup>) &nbsp;→&nbsp; <i>t</i> = −τ ln(1 − Δ<i>V</i><sub>C</sub>/ℰ) = ${p(tau, 1)} s × ln ${p(ER / (ER - V8), 0)} = ${p(P8.t, 2)} s</div><p>不是线性的（${p(P8.nums[2], 2)} s）：电容器越满，充电越慢。一个 τ 只能充到 ${ER} V 的 63%。</p>` },
    { q: '现在充满电的电容器通过 <i>R</i> 放电。经过一个时间常数后，它储存的能量中有多大比例已在 <i>R</i> 中变成热？',
      choices: P8b.nums.map(x => `${p(x, 1)} %`), answer: 1, nums: P8b.nums,
      why: `<p>电流为 <i>I</i><sub>0</sub>e<sup>−<i>t</i>/τ</sup>，所以功率 <i>I</i><sup>2</sup><i>R</i> 衰减得快一倍：</p><div class="eq"><i>E</i> = ∫<sub>0</sub><sup>τ</sup> <i>I</i><sub>0</sub><sup>2</sup><i>R</i> e<sup>−2<i>t</i>/τ</sup> <i>dt</i> = ½<i>I</i><sub>0</sub><sup>2</sup><i>R</i>τ(1 − e<sup>−2</sup>) = <i>U</i><sub>0</sub>(1 − e<sup>−2</sup>)</div><p>（½<i>I</i><sub>0</sub><sup>2</sup><i>R</i>τ = <i>Q</i><sup>2</sup>/2<i>C</i> = <i>U</i><sub>0</sub>。）所以是 ${p(P8b.f * 100, 1)} %。电荷量降到了 36.8 %，但能量与 <i>q</i><sup>2</sup> 成正比：只剩 e<sup>−2</sup> = ${p(Math.exp(-2) * 100, 1)} %。</p>` },
  ],
};
