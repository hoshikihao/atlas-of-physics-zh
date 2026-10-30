// AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from model.js; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const p3 = x => (x < 0 ? '−' : '') + (Math.abs(x) >= 1000 ? Math.abs(x).toFixed(0) : Math.abs(x).toPrecision(3));   // 3 significant figures
const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const G = M.G, sin = d => Math.sin(d * Math.PI / 180), cos = d => Math.cos(d * Math.PI / 180), tan = d => Math.tan(d * Math.PI / 180);
const W = M.WHEEL, DS = M.DISC, DR = M.DOOR, PL = M.PLANK, LD = M.LADDER, SH = M.SHAPES, RD = M.ROD, WR = M.WRENCH, B = M.BOWL, WL = M.WELL, IM = M.IMP, SK = M.SKATE, HT = M.HIT;

// 0 · turns while speeding up
const Q0 = { th: 0.5 * W.alpha * W.tUp ** 2 };
Q0.rev = Q0.th / (2 * Math.PI);
// 1 · the edge rider at 1.6 s
const Q1 = { t: 1.6 };
Q1.p = M.pointAt(DS.r2, M.disc(Q1.t));
// 2 · the handle push at 30°, and α from the square push
const Q2 = { phi: 30 };
Q2.tau = M.torque(DR.cases[0].r, DR.F, Q2.phi);
Q2.alpha = DR.cases[0].tau / DR.I;
// 3 · crate 1.0 m from A
const Q3 = { x: 1.0 };
Q3.q = M.plank(Q3.x);
// 4 · ladder at 60°
const Q4 = { th: 60 };
Q4.f = M.ladder(Q4.th * Math.PI / 180).f;
// 5 · the disc after 2.0 s
const Q5 = { t: 2.0, disc: SH.list[1] };
Q5.w = Q5.disc.alpha * Q5.t;
// 6 · a rod whose density grows from one end, λ = Cx: I = ½ML²; an annulus R/2 → R: ⅝MR²
const Q6 = { I: 0.5 * RD.M * RD.L ** 2, Iann: 5 / 8 * SH.M * SH.R ** 2 };
// 7 · rod axis 0.30 m from one end; the end-pinned rod released from horizontal
const Q7 = { e: 0.30 };
Q7.d = RD.L / 2 - Q7.e;
Q7.I = RD.Icm + RD.M * Q7.d ** 2;
Q7.wBot = Math.sqrt(3 * G / RD.L);
// 8 · one 120° stroke
const Q8 = { W: WR.tau * WR.stroke };
// 9 · the disc at the bottom; h from the ramp
const Q9 = { h: M.RACE.h };
Q9.v = Math.sqrt(2 * G * Q9.h / 1.5);
// 10 · the bowling ball
const Q10 = { vf: 5 * B.v0 / 7, xStar: 12 * B.v0 ** 2 / (49 * B.muK * G) };
// 11 · bucket after the full 2.0 m
const Q11 = { v: Math.sqrt(2 * WL.a * WL.h) };
// 12 · a 100 N rim push for 0.90 s; a triangular torque pulse
const Q12 = { F: 100, dt: 0.9, peak: 200, T: 1.2 };
Q12.w = Q12.F * IM.R * Q12.dt / IM.I;
Q12.J = 0.5 * Q12.peak * Q12.T;
// 13 · the skater
const Q13 = { I0: M.inertia(SK.rOut), I1: M.inertia(SK.rIn) };
Q13.w = Q13.I0 * SK.w0 / Q13.I1;
Q13.wNoBody = (2 * SK.m * SK.rOut ** 2) * SK.w0 / (2 * SK.m * SK.rIn ** 2);
// 14 · the ball sticks to the rod; a ball dropped beside O
const Q14 = { w: HT.m * HT.v0 * HT.d / (HT.I + HT.m * HT.d ** 2), dLdt: HT.m * G * HT.d };

const eq = s => `<div class="eq">${s}</div>`;

export const PRACTICE = {
  0: [
    { q: `轮子从静止开始，以 ${f(W.alpha, 1)} rad/s² 的角加速度加速 ${f(W.tUp, 1)} s。在这段时间内它转了多少圈？`,
      choices: [`${p3(Q0.th / Math.PI)} rev`, `${p3(Q0.th)} rev`, `${p3(Q0.rev)} rev`, `${p3(Q0.th * 2 * Math.PI)} rev`], answer: 2,
      why: `<p>从静止开始做匀加速转动：Δθ = ½αt²，单位是弧度。再除以每圈 2π rad。</p>${eq(`Δθ = ½ × ${f(W.alpha, 1)} × ${f(W.tUp, 1)}² = ${f(Q0.th)} rad = ${f(Q0.th)} / 2π = ${p3(Q0.rev)} rev`)}<p>${p3(Q0.th)} rev 忘了 ½αt² 算出的是弧度；${p3(Q0.th / Math.PI)} rev 漏掉了 ½。</p>` },
    { q: '取逆时针为正。轮子沿逆时针方向转动，同时在制动。ω 和 α 的符号是',
      choices: ['ω > 0，α > 0', 'ω < 0，α < 0', 'ω < 0，α > 0', 'ω > 0，α < 0'], answer: 3,
      why: '<p>它沿逆时针转动，所以 ω > 0。它在减速，所以 α 与 ω 反向：α < 0。ω 的符号表示转动方向；α 只表示 ω 往哪个方向变化。</p>' },
  ],
  1: [
    { q: `旋转木马以恒定的 ω 转动。${DS.r2} m 处乘客的向心加速度是 ${DS.r1} m 处乘客的多少倍？`,
      choices: ['1（ω 相同，加速度也相同）', '4', '2', '½'], answer: 2,
      why: '<p>两人的 ω 相同，<i>a</i><sub>c</sub> = <i>v</i>²/<i>r</i> = <i>r</i>ω²。ω 一定时它与 <i>r</i> 成正比：半径加倍，加速度加倍。</p><p>4 是用 <i>v</i>²/<i>r</i> 时只把 <i>v</i> 加倍，却忘了分母里的 <i>r</i>。</p>' },
    { q: `木马从静止开始以 α = ${f(DS.alpha, 1)} rad/s² 加速。<i>t</i> = ${f(Q1.t, 1)} s 时，${DS.r2} m 处乘客的总加速度大小是多少？`,
      choices: [`${p3(Q1.p.at)} m/s²`, `${p3(Q1.p.ac)} m/s²`, `${p3(Q1.p.a)} m/s²`, `${p3(Q1.p.at + Q1.p.ac)} m/s²`], answer: 2,
      why: `<p>ω = αt = ${f(DS.alpha * Q1.t)} rad/s。两个相互垂直的分量：</p>${eq(`<i>a</i><sub>t</sub> = rα = ${f(Q1.p.at)} m/s², <i>a</i><sub>c</sub> = rω² = ${f(Q1.p.ac)} m/s²`)}${eq(`<i>a</i> = √(${f(Q1.p.at)}² + ${f(Q1.p.ac)}²) = ${p3(Q1.p.a)} m/s²`)}<p>两者相互垂直，要按矢量相加，不能直接把数值相加（${p3(Q1.p.at + Q1.p.ac)}）。</p>` },
  ],
  2: [
    { q: `${f(DR.F, 0)} N 的推力作用在门把手处，距门轴 ${f(DR.cases[0].r, 2)} m，与门成 ${Q2.phi}°。它对门轴的力矩是多少？`,
      choices: [`${p3(DR.F * DR.cases[0].r)} N·m`, `${p3(Q2.tau)} N·m`, `${p3(DR.F * DR.cases[0].r * cos(Q2.phi))} N·m`, '0 N·m'], answer: 1,
      why: `<p>φ 是 <b>r</b>（沿门）与 <b>F</b> 的夹角，这里为 ${Q2.phi}°。</p>${eq(`τ = rF sin φ = ${f(DR.cases[0].r)} × ${f(DR.F, 0)} × sin ${Q2.phi}° = ${p3(Q2.tau)} N·m`)}<p>${p3(DR.F * DR.cases[0].r * cos(Q2.phi))} N·m 用了 cos：那是 F 沿门方向的分量，它只是推向门轴。</p>` },
    { q: `门（${DR.M} kg，宽 ${f(DR.W, 1)} m，I = ⅓MW²）在把手处受到垂直于门的推力，τ = ${f(DR.cases[0].tau, 1)} N·m。它的角加速度是`,
      choices: [`${p3(DR.cases[0].tau / (DR.M * DR.W ** 2))} rad/s²`, `${p3(DR.cases[0].tau / (DR.M * DR.W ** 2 / 2))} rad/s²`, `${p3(DR.cases[0].tau / (DR.M * DR.W ** 2 / 12))} rad/s²`, `${p3(Q2.alpha)} rad/s²`], answer: 3,
      why: `${eq(`I = ⅓MW² = ⅓ × ${DR.M} × ${f(DR.W, 1)}² = ${f(DR.I)} kg·m²`)}${eq(`α = τ/I = ${f(DR.cases[0].tau, 1)} / ${f(DR.I)} = ${p3(Q2.alpha)} rad/s²`)}<p>门绕它的边转动，而不是绕中线，所以用 <sup>1</sup>⁄<sub>12</sub>MW²（对中线）算出的 α 会大得多。</p>` },
  ],
  3: [
    { q: `${PL.m} kg 的箱子放在 ${f(PL.L, 1)} m 长、${PL.M} kg 的木板上，距支点 A ${f(Q3.x, 1)} m。支点 B 的作用力是多少？`,
      choices: [`${p3(Q3.q.FA)} N`, `${p3((PL.Wp + PL.Wc) / 2)} N`, `${p3(Q3.x * PL.Wc / PL.L)} N`, `${p3(Q3.q.FB)} N`], answer: 3,
      why: `<p>对 A 取力矩，<i>F</i><sub>A</sub> 在那里没有力臂：</p>${eq(`${f(PL.L, 1)}·<i>F</i><sub>B</sub> = ${f(PL.L / 2, 1)} × ${f(PL.Wp, 0)} + ${f(Q3.x, 1)} × ${f(PL.Wc, 0)} → <i>F</i><sub>B</sub> = ${p3(Q3.q.FB)} N`)}<p>箱子离 A 更近，所以 A 承担得多（${p3(Q3.q.FA)} N），B 承担得少。${p3(Q3.x * PL.Wc / PL.L)} N 忘了木板自身的重力。</p>` },
    { q: '箱子从 A 缓慢滑向 B。支持力如何变化？',
      choices: ['<i>F</i><sub>A</sub> 减小，<i>F</i><sub>B</sub> 增大，两者之和不变', '<i>F</i><sub>A</sub> 增大，<i>F</i><sub>B</sub> 减小', '两者都不变：总重力没有变', '<i>F</i><sub>A</sub> 减小，<i>F</i><sub>B</sub> 增大，两者之和增大'], answer: 0,
      why: '<p>Σ<i>F</i> = 0 使两者之和固定为 (M + m)g。对 A 的 Στ = 0 给出 <i>F</i><sub>B</sub> = [(L/2)Mg + x·mg]/L，随 x 增大。所以 <i>F</i><sub>B</sub> 增大，<i>F</i><sub>A</sub> 减小同样的量。</p>' },
  ],
  4: [
    { q: `${LD.m} kg 的梯子靠在光滑墙上，与地面成 ${Q4.th}°。地面必须提供多大的摩擦力？`,
      choices: [`${p3(LD.W / tan(Q4.th))} N`, `${p3(Q4.f)} N`, `${p3(LD.muS * LD.W)} N`, `${p3(LD.W * tan(Q4.th) / 2)} N`], answer: 1,
      why: `<p>对梯脚取力矩：(L sin θ)<i>F</i><sub>w</sub> = (½L cos θ)mg，所以 <i>F</i><sub>w</sub> = mg / (2 tan θ)。由 ΣF<sub>x</sub> = 0，摩擦力等于 <i>F</i><sub>w</sub>：</p>${eq(`<i>f</i> = ${f(LD.W, 0)} / (2 tan ${Q4.th}°) = ${p3(Q4.f)} N`)}<p>${p3(LD.muS * LD.W)} N 是静摩擦力<b>最多</b>能提供的值，不是实际提供的值。</p>` },
    { q: '换成一架重一倍、长度相同的梯子，放在同样的地面上。它能立住的最小倾角',
      choices: ['更大', '更小', '不变', '只有梯子也更长时才更大'], answer: 2,
      why: '<p>所需摩擦力 mg/(2 tan θ) 和最大静摩擦力 μ<sub>s</sub>mg 都与 m 成正比。令两者相等得 tan θ<sub>min</sub> = 1/(2μ<sub>s</sub>)：与 m 和 L 都无关。</p>' },
  ],
  5: [
    { q: '圆环、圆盘和实心球的质量、半径相同，受到的力矩也相同。按角加速度从大到小排列。',
      choices: ['圆环、圆盘、实心球', '实心球、圆盘、圆环', '圆盘、实心球、圆环', '全部相等'], answer: 1,
      why: '<p>α = τ/I，其中 I = MR²（圆环）、½MR²（圆盘）、⅖MR²（实心球）。实心球的质量离转轴最近，I 最小，α 最大。</p>' },
    { q: `圆盘（${f(SH.M, 1)} kg，${f(SH.R, 1)} m）从静止开始，绕在边缘的细绳施加 ${f(SH.F, 1)} N 的拉力。${f(Q5.t, 1)} s 后它的 ω 是`,
      choices: [`${p3(SH.F / Q5.disc.I * Q5.t)} rad/s`, `${p3(SH.tau / (SH.M * SH.R ** 2) * Q5.t)} rad/s`, `${p3(SH.tau / (0.4 * SH.M * SH.R ** 2) * Q5.t)} rad/s`, `${p3(Q5.w)} rad/s`], answer: 3,
      why: `${eq(`τ = FR = ${f(SH.tau)} N·m, I = ½MR² = ${f(Q5.disc.I)} kg·m²`)}${eq(`α = τ/I = ${f(Q5.disc.alpha)} rad/s², ω = αt = ${p3(Q5.w)} rad/s`)}<p>${p3(SH.F / Q5.disc.I * Q5.t)} rad/s 把力当成了力矩。</p>` },
  ],
  6: [
    { q: `一根 ${f(RD.M, 1)} kg、${f(RD.L, 1)} m 长的杆越往一端越密：λ = Cx，x 从较轻的一端 O 量起。它对过 O 且垂直于杆的轴的 I 是`,
      choices: [`${p3(RD.M * RD.L ** 2 / 3)} kg·m²`, `${p3(Q6.I)} kg·m²`, `${p3(RD.M * RD.L ** 2 / 4)} kg·m²`, `${p3(RD.M * RD.L ** 2)} kg·m²`], answer: 1,
      why: `<p>先由质量确定 C，再对 r² dm 积分，dm = Cx dx：</p>${eq(`M = ∫<sub>0</sub><sup>L</sup> Cx dx = ½CL² → C = 2M/L²`)}${eq(`I = ∫<sub>0</sub><sup>L</sup> x²·Cx dx = ¼CL⁴ = ½ML² = ${p3(Q6.I)} kg·m²`)}<p>比均匀杆的 ⅓ML²（${p3(RD.M * RD.L ** 2 / 3)}）大：质量分布得更靠外。¼ML² 忘了用 2M/L² 替换 C。</p>` },
    { q: `质量为 M 的扁平垫圈（圆环面）内半径为 R/2，外半径为 R。用 I = ∫r² dm 证明它对圆心的 I = ⅝MR²，并求 M = ${f(SH.M, 1)} kg、R = ${f(SH.R, 1)} m 时的值。`,
      solution: `<p>面密度 σ = M / [π(R² − R²/4)] = 4M / (3πR²)。半径 r 处、宽 dr 的细圆环 dm = σ·2πr dr。</p>${eq(`I = ∫<sub>R/2</sub><sup>R</sup> r²·σ2πr dr = 2πσ [r⁴/4]<sub>R/2</sub><sup>R</sup> = 2πσ · (15/64)R⁴`)}${eq(`I = 2π · 4M/(3πR²) · 15R⁴/64 = (120/192)MR² = ⅝MR²`)}${eq(`I = ⅝ × ${f(SH.M, 1)} × ${f(SH.R, 1)}² = ${p3(Q6.Iann)} kg·m²`)}<p>介于圆盘（½MR²）和圆环（MR²）之间，这是合理的：挖去中间部分使质量更靠外。</p>` },
  ],
  7: [
    { q: `${f(RD.M, 1)} kg、${f(RD.L, 1)} m 长的杆（I<sub>cm</sub> = ${f(RD.Icm)} kg·m²）绕一条垂直于杆、距一端 ${f(Q7.e, 2)} m 的轴转动。它的转动惯量是`,
      choices: [`${p3(RD.Icm + RD.M * Q7.d)} kg·m²`, `${p3(RD.M * Q7.d ** 2)} kg·m²`, `${p3(RD.Iend + RD.M * Q7.e ** 2)} kg·m²`, `${p3(Q7.I)} kg·m²`], answer: 3,
      why: `<p>平行轴定理要从过质心的轴出发，所以 d 从中点量起：d = ${f(RD.L / 2, 2)} − ${f(Q7.e, 2)} = ${f(Q7.d, 2)} m。</p>${eq(`I = I<sub>cm</sub> + Md² = ${f(RD.Icm)} + ${f(RD.M, 1)} × ${f(Q7.d, 2)}² = ${p3(Q7.I)} kg·m²`)}<p>${p3(RD.Iend + RD.M * Q7.e ** 2)} 是在端点的值上加 Md²，但端点不是质心。</p>` },
    { q: `杆的一端用转轴固定，从水平位置由静止释放。用平行轴定理求 I，把 Στ = Iα 写成关于杆在水平线下方转角 θ 的微分方程，并积分求出它摆过最低点时的 ω。`,
      solution: `<p>I = <sup>1</sup>⁄<sub>12</sub>ML² + M(L/2)² = ⅓ML²。重力作用在中点，距转轴 L/2，力臂为 (L/2)cos θ：</p>${eq(`⅓ML² · d²θ/dt² = Mg(L/2) cos θ`)}${eq(`d²θ/dt² = (3g / 2L) cos θ`)}<p>把 d²θ/dt² 写成 ω dω/dθ，从 θ = 0、ω = 0 开始积分：</p>${eq(`∫<sub>0</sub><sup>ω</sup> ω dω = (3g/2L) ∫<sub>0</sub><sup>θ</sup> cos θ dθ → ω² = (3g/L) sin θ`)}${eq(`在最低点 θ = 90°：ω = √(3g/L) = √(3 × ${f(G)} / ${f(RD.L, 1)}) = ${p3(Q7.wBot)} rad/s`)}<p>用能量验算：中点下降 L/2，所以 Mg(L/2) = ½(⅓ML²)ω²，结果相同。α 不是恒定的，所以不能用 ω² = 2αΔθ。</p>` },
  ],
  8: [
    { q: `${f(WR.F, 0)} N 的力垂直推 ${f(WR.r, 2)} m 长的扳手，使螺母转过 120°。所做的功是`,
      choices: [`${p3(WR.tau)} J`, `${p3(WR.F * WR.stroke)} J`, `${p3(Q8.W)} J`, `${p3(WR.tau * 120)} J`], answer: 2,
      why: `${eq(`W = τΔθ = (${f(WR.r, 2)} × ${f(WR.F, 0)}) × 2π/3 = ${f(WR.tau, 0)} × ${f(WR.stroke, 3)} = ${p3(Q8.W)} J`)}<p>Δθ 必须用弧度。${p3(WR.tau * 120)} J 是乘了 120 度。</p>` },
    { q: '拧同一个螺母需要同样的力矩。换用长一倍的扳手，所需推力和每转 120° 做的功分别',
      choices: ['推力减半，功减半', '推力减半，功不变', '推力不变，功加倍', '推力减半，功加倍'], answer: 1,
      why: '<p>τ = rF：r 加倍，F 减半。W = τΔθ：τ 相同、角度相同，功相同。手用一半的力走了两倍的距离。</p>' },
  ],
  9: [
    { q: `圆盘（I = ½mR²）从静止开始沿 ${f(M.RACE.len, 1)} m 长、倾角 ${(M.RACE.theta * 180 / Math.PI).toFixed(0)}° 的斜面纯滚动而下。它到达底部时的速率是`,
      choices: [`${p3(Math.sqrt(2 * G * Q9.h))} m/s`, `${p3(Math.sqrt(2 * G * Q9.h / 1.4))} m/s`, `${p3(Math.sqrt(G * Q9.h))} m/s`, `${p3(Q9.v)} m/s`], answer: 3,
      why: `<p>h = ${f(M.RACE.len, 1)} sin ${(M.RACE.theta * 180 / Math.PI).toFixed(0)}° = ${f(Q9.h, 3)} m。由 ω = v/R：</p>${eq(`mgh = ½mv² + ½(½mR²)(v/R)² = ¾mv² → v = √(4gh/3) = ${p3(Q9.v)} m/s`)}<p>${p3(Math.sqrt(2 * G * Q9.h))} m/s 是滑动的箱子，它不需要为转动付出能量。</p>` },
    { q: '实心球（⅖MR²）、空心球（⅔MR²）和圆环（MR²）从静止开始沿同一斜面滚下。它们到达的先后顺序是',
      choices: ['圆环、空心球、实心球', '同时到达', '实心球、空心球、圆环', '空心球、实心球、圆环'], answer: 2,
      why: '<p>a = g sin θ / (1 + f)，其中 I = fMR²。f 越小，用于转动的能量越少，越快：实心球（0.4），然后空心球（0.67），然后圆环（1）。质量和半径都约掉了。</p>' },
  ],
  10: [
    { q: `保龄球以 ${f(B.v0, 1)} m/s 离手，没有转动，打滑一段后开始滚动。它开始纯滚动时的速率是多少？`,
      choices: [`${p3(B.v0)} m/s`, `${p3(Q10.vf)} m/s`, `${p3(B.v0 / Math.sqrt(1.4))} m/s`, `${p3(2 * B.v0 / 7)} m/s`], answer: 1,
      why: `<p>对接触线而言摩擦力没有力矩，所以 mvR + Iω 保持为 mv<sub>0</sub>R。纯滚动时 ω = v/R：</p>${eq(`mv<sub>0</sub>R = mvR + ⅖mR²(v/R) → v = <sup>5</sup>⁄<sub>7</sub>v<sub>0</sub> = ${p3(Q10.vf)} m/s`)}<p>${p3(B.v0 / Math.sqrt(1.4))} m/s 假设动能守恒，但球打滑时滑动摩擦会把一部分动能变成热。</p>` },
    { q: `写出打滑阶段的 v(t) 和 ω(t)（μ<sub>k</sub> = ${f(B.muK, 1)}），求 v = Rω 的时刻 t*，并对 v(t) 积分求球打滑的距离。`,
      solution: `<p>摩擦力 μ<sub>k</sub>mg 作用在底部，方向向后：</p>${eq(`m dv/dt = −μ<sub>k</sub>mg → v = v<sub>0</sub> − μ<sub>k</sub>g t`)}${eq(`⅖mR² dω/dt = μ<sub>k</sub>mgR → ω = (5μ<sub>k</sub>g / 2R) t`)}${eq(`v<sub>0</sub> − μ<sub>k</sub>g t* = <sup>5</sup>⁄<sub>2</sub>μ<sub>k</sub>g t* → t* = 2v<sub>0</sub> / 7μ<sub>k</sub>g = ${f(B.tStar, 3)} s`)}${eq(`x* = ∫<sub>0</sub><sup>t*</sup> (v<sub>0</sub> − μ<sub>k</sub>g t) dt = v<sub>0</sub>t* − ½μ<sub>k</sub>g t*²`)}${eq(`x* = 12v<sub>0</sub>² / 49μ<sub>k</sub>g = ${p3(Q10.xStar)} m`)}<p>两者都与 R 和 m 无关。</p>` },
  ],
  11: [
    { q: `${f(WL.m, 1)} kg 的水桶从静止下落，带动 ${f(WL.M, 1)} kg 的辘轳（实心圆柱）转动。下落 ${f(WL.h, 1)} m 后它的速率是`,
      choices: [`${p3(Math.sqrt(2 * G * WL.h))} m/s`, `${p3(Math.sqrt(2 * WL.m * G / (WL.m + WL.M) * WL.h))} m/s`, `${p3(Q11.v)} m/s`, `${p3(Math.sqrt(WL.a * WL.h))} m/s`], answer: 2,
      why: `${eq(`a = mg / (m + ½M) = ${f(WL.m * G, 1)} / ${f(WL.m + WL.M / 2, 1)} = ${f(WL.a)} m/s²`)}${eq(`v = √(2ah) = √(2 × ${f(WL.a)} × ${f(WL.h, 1)}) = ${p3(Q11.v)} m/s`)}<p>${p3(Math.sqrt(2 * G * WL.h))} m/s 是自由落体，忽略了辘轳分走的能量；${p3(Math.sqrt(2 * WL.m * G / (WL.m + WL.M) * WL.h))} m/s 把辘轳当成了圆环（I = MR²）。</p>` },
    { q: '水桶下落时，绳的拉力',
      choices: ['等于水桶的重力', '大于水桶的重力', '小于水桶的重力，但大于零', '为零，因为水桶在下落'], answer: 2,
      why: `<p>水桶向下加速，所以 mg − T = ma > 0：T < mg。但绳必须拉辘轳才能使它越转越快（rT = Iα），所以 T > 0。这里 T = ${f(WL.T)} N，而 mg = ${f(WL.m * G, 1)} N。</p>` },
  ],
  12: [
    { q: `旋转木马（I = ${f(IM.I, 0)} kg·m²，R = ${f(IM.R, 1)} m）原来静止。沿边缘切向施加 ${Q12.F} N 的推力，持续 ${f(Q12.dt, 2)} s。它最终的 ω 是`,
      choices: [`${p3(Q12.F * Q12.dt / IM.I)} rad/s`, `${p3(Q12.w)} rad/s`, `${p3(Q12.F * IM.R * Q12.dt / (IM.M * IM.R ** 2))} rad/s`, `${p3(Q12.F * IM.R / IM.I)} rad/s`], answer: 1,
      why: `${eq(`ΔL = τΔt = (${Q12.F} × ${f(IM.R, 1)}) × ${f(Q12.dt, 2)} = ${f(Q12.F * IM.R * Q12.dt, 0)} kg·m²/s`)}${eq(`ω = ΔL / I = ${f(Q12.F * IM.R * Q12.dt, 0)} / ${f(IM.I, 0)} = ${p3(Q12.w)} rad/s`)}<p>${p3(Q12.F * Q12.dt / IM.I)} rad/s 用的是 FΔt（冲量）而不是 τΔt；${p3(Q12.F * IM.R / IM.I)} 是 τ/I，即角加速度，不是 ω。</p>` },
    { q: `作用在轮子上的力矩在 ${f(Q12.T / 2, 1)} s 内从 0 均匀增大到 ${Q12.peak} N·m，然后均匀减小，在 ${f(Q12.T, 1)} s 时回到 0。轮子角动量的变化量是`,
      choices: [`${p3(Q12.peak)} kg·m²/s`, `${p3(Q12.peak * Q12.T)} kg·m²/s`, `${p3(Q12.peak / Q12.T)} kg·m²/s`, `${p3(Q12.J)} kg·m²/s`], answer: 3,
      why: `<p>ΔL 是 τ–t 图线下的面积，这里是一个三角形：</p>${eq(`ΔL = ½ × ${f(Q12.T, 1)} s × ${Q12.peak} N·m = ${p3(Q12.J)} kg·m²/s`)}<p>${p3(Q12.peak * Q12.T)} 把它当成了矩形；${p3(Q12.peak / Q12.T)} 是斜率，不是面积。</p>` },
  ],
  13: [
    { q: `滑冰者（I<sub>body</sub> = ${f(SK.Ib, 1)} kg·m²）以 ${f(SK.w0, 1)} rad/s 旋转，${f(SK.m, 1)} kg 的哑铃在 ${f(SK.rOut, 2)} m 处，她把哑铃收到 ${f(SK.rIn, 2)} m 处。她新的 ω 是`,
      choices: [`${p3(SK.w0 * SK.rOut / SK.rIn)} rad/s`, `${p3(Q13.wNoBody)} rad/s`, `${p3(Q13.w)} rad/s`, `${p3(SK.w0)} rad/s`], answer: 2,
      why: `${eq(`I<sub>0</sub> = ${f(SK.Ib, 1)} + 2 × ${f(SK.m, 1)} × ${f(SK.rOut, 2)}² = ${f(Q13.I0)} kg·m², I<sub>f</sub> = ${f(SK.Ib, 1)} + 2 × ${f(SK.m, 1)} × ${f(SK.rIn, 2)}² = ${f(Q13.I1, 3)} kg·m²`)}${eq(`ω<sub>f</sub> = I<sub>0</sub>ω<sub>0</sub> / I<sub>f</sub> = ${p3(Q13.w)} rad/s`)}<p>${p3(Q13.wNoBody)} rad/s 漏掉了她身体的 ${f(SK.Ib, 1)} kg·m²，这部分不变。</p>` },
    { q: '她把哑铃收回的过程中，她的转动动能',
      choices: ['不变，因为 L 守恒', '减小，因为 I 减小', '增大，因为冰面施加了力矩', '增大，因为她的手臂对哑铃做了功'], answer: 3,
      why: `<p>K = L²/2I。L 不变而 I 减小，所以 K 增大：这里从 ${f(M.skater(0.5).K)} J 增大到 ${f(M.skater(3.5).K)} J。能量来自她的肌肉：哑铃有向外甩出的趋势，她要用力把它们拉向内侧。冰面（几乎）不提供力矩，所以 L 守恒。</p>` },
  ],
  14: [
    { q: `${f(HT.m, 1)} kg 的球以 ${f(HT.v0, 1)} m/s 撞在细杆（I = ⅓ML² = ${f(HT.I, 2)} kg·m²）上距转轴 O ${f(HT.d, 1)} m 处，并<b>粘在</b>杆上。碰后瞬间杆的 ω 是`,
      choices: [`${p3(HT.m * HT.v0 * HT.d / HT.I)} rad/s`, `${p3(Q14.w)} rad/s`, `${p3(HT.m * HT.v0 * HT.d / (HT.M * HT.L ** 2 / 12 + HT.m * HT.d ** 2))} rad/s`, `${p3(HT.m * HT.v0 / (HT.m + HT.M) / HT.d)} rad/s`], answer: 1,
      why: `<p>转轴对杆有作用力，所以动量不守恒；但转轴对 O 没有力矩，所以对 O 的 L 守恒：</p>${eq(`mv<sub>0</sub>d = (I + md²)ω → ω = ${f(HT.m * HT.v0 * HT.d, 2)} / (${f(HT.I, 2)} + ${f(HT.m * HT.d ** 2, 2)}) = ${p3(Q14.w)} rad/s`)}<p>${p3(HT.m * HT.v0 * HT.d / HT.I)} 忘了球此后随杆一起转动；${p3(HT.m * HT.v0 / (HT.m + HT.M) / HT.d)} 用了动量守恒，而转轴破坏了动量守恒。</p>` },
    { q: `一个 ${f(HT.m, 1)} kg 的球从 O 一侧 ${f(HT.d, 1)} m 处由静止释放，与 O 在同一竖直平面内。它下落时，对 O 的角动量以多大的速率变化？`,
      choices: [`${p3(Q14.dLdt / 2)} kg·m²/s²`, `${p3(2 * Q14.dLdt)} kg·m²/s²`, `${p3(Q14.dLdt)} kg·m²/s²`, '0：它沿直线运动'], answer: 2,
      why: `<p>以 O 为原点，球位于 (d, y)，p = (0, −mgt)。则</p>${eq(`L = xp<sub>y</sub> − yp<sub>x</sub> = −d·mgt → |dL/dt| = mgd = ${f(HT.m, 1)} × ${f(G)} × ${f(HT.d, 1)} = ${p3(Q14.dLdt)} kg·m²/s²`)}<p>这就是重力对 O 的力矩 d·mg。只有在不受力时，沿直线运动才能使 L 保持不变；这里速率在增大。</p>` },
  ],
};
