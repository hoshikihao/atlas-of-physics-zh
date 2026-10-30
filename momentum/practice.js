// momentum/practice.js — AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from the model or from the givens; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const G = M.G;
const f = (x, n = 2) => (x < -1e-12 ? '−' : '') + Math.abs(x).toFixed(n);
const sg = (x, n = 2) => (x > 1e-12 ? '+' : '') + f(x, n);   // signed, for velocities on a track

// 0 · the ball and the cart; a ball bouncing back
const Bl = M.BALL, Ct = M.CART, vb = 3.0, dp0 = Bl.m * (Bl.v + vb);
// 1 · the wall pulse
const Wl = M.WALL;
// 2 · the egg on the floor
const Eg = M.EGG, Fhard = Eg.J / Eg.tauHard;
// 3–5 · the carts
const S = M.STICK, Bo = M.BOUNCE, X = M.BURST;
const K0s = M.ke(S.m1, S.u1) + M.ke(S.m2, S.u2), K1s = M.ke(S.m1 + S.m2, S.v1);
// 6 · the ballistic pendulum
const Pd = M.PEND, Kclay = M.ke(Pd.m, Pd.u), Kafter = M.ke(Pd.m + Pd.M, Pd.v);
// 7 · the crash
const Cr = M.CRASH;
// 8 · the shell
const Sh = M.SHELL;
// 9 · rods (Physics C): λ = λ0 x/L, and λ = λ0 x²/L²
const Rd = M.ROD, xq = 3 * Rd.L / 4, Mq = Rd.lam0 * Rd.L / 3;
// 10 · plates (Physics C)
const Tr = M.TRI, Se = M.SEMI;
// 11 · the L and the holed square (Physics C)
const Ll = M.ELL, Ho = M.HOLE;

export const PRACTICE = {
  0: [
    { q: `${f(Bl.m, 1)} kg 的球和 ${f(Ct.m, 1)} kg 的小车动量相同。球的动能与小车的动能之比是多少？`,
      choices: [f(1, 1), f(Bl.m / Ct.m), f(Ct.m / Bl.m, 1), f(Math.sqrt(Ct.m / Bl.m), 1)], answer: 2,
      why: `<p><i>p</i> 相同时，<i>K</i> = <i>p</i>²/2<i>m</i>，所以 <i>K</i><sub>球</sub>/<i>K</i><sub>车</sub> = <i>m</i><sub>车</sub>/<i>m</i><sub>球</sub> = ${f(Ct.m, 1)}/${f(Bl.m, 1)} = ${f(Ct.m / Bl.m, 1)}。验算：${f(M.ke(Bl.m, Bl.v), 1)} J 对 ${f(M.ke(Ct.m, Ct.v), 1)} J。动量相等不等于能量相等。</p>` },
    { q: `${f(Bl.m, 1)} kg 的球以 ${f(Bl.v, 1)} m/s 向东运动，以 ${f(vb, 1)} m/s 向西弹回。它的动量变化量大小是多少？`,
      choices: [f(Bl.m * (Bl.v - vb)) + ' kg·m/s', f(Bl.m * Bl.v) + ' kg·m/s', f(dp0) + ' kg·m/s', f(Bl.v + vb) + ' kg·m/s'], answer: 2,
      why: `<p>取向东为正。Δ<i>p</i> = <i>m</i>(<i>v</i><sub>f</sub> − <i>v</i><sub>0</sub>) = ${f(Bl.m, 1)} × (−${f(vb, 1)} − ${f(Bl.v, 1)}) = −${f(dp0)} kg·m/s，所以 |Δ<i>p</i>| = ${f(dp0)} kg·m/s。把速率相减（${f(Bl.m * (Bl.v - vb))}）忽略了速度已经反向。</p>` },
  ],
  1: [
    { q: `墙在 ${f(Wl.tau)} s 内使 ${f(Wl.m, 1)} kg 的球速度从 +${f(Wl.v, 1)} m/s 变为 −${f(Wl.v, 1)} m/s。球所受平均作用力的大小是多少？`,
      choices: [`${f(Wl.m * Wl.v / Wl.tau, 1)} N`, `${f(Wl.J / Wl.tau, 1)} N`, `${f(Wl.J * Wl.tau, 2)} N`, `${f(Wl.Fpk, 1)} N`], answer: 1,
      why: `<div class="eq"><i>F</i><sub>avg</sub> = |Δ<i>p</i>|/Δ<i>t</i> = 2<i>mv</i>/Δ<i>t</i> = ${f(Wl.J, 1)} / ${f(Wl.tau)} = ${f(Wl.J / Wl.tau, 1)} N</div><p>${f(Wl.m * Wl.v / Wl.tau, 1)} N 只能让球停下，而球还要弹回。${f(Wl.Fpk, 1)} N 是脉冲的峰值，不是平均值。</p>` },
    { q: `墙的作用力为 <i>F</i>(<i>t</i>) = <i>F</i><sub>pk</sub> sin(π<i>t</i>/τ)（0 ≤ <i>t</i> ≤ τ），其中 <i>F</i><sub>pk</sub> = ${f(Wl.Fpk, 1)} N，τ = ${f(Wl.tau)} s。它给球的冲量是多少？`,
      choices: [`${f(Wl.Fpk * Wl.tau / 2)} N·s`, `${f(Wl.Fpk * Wl.tau)} N·s`, `${f(Wl.Fpk * Wl.tau / Math.PI)} N·s`, `${f(2 * Wl.Fpk * Wl.tau / Math.PI)} N·s`], answer: 3,
      why: `<div class="eq"><i>J</i> = ∫<sub>0</sub><sup>τ</sup> <i>F</i><sub>pk</sub> sin(π<i>t</i>/τ) d<i>t</i> = <i>F</i><sub>pk</sub>(τ/π)[−cos(π<i>t</i>/τ)]<sub>0</sub><sup>τ</sup> = 2<i>F</i><sub>pk</sub>τ/π = ${f(2 * Wl.Fpk * Wl.tau / Math.PI)} N·s</div><p>这与 2<i>mv</i> = ${f(Wl.J)} N·s 一致。<i>F</i><sub>pk</sub>τ 相当于把峰值当成持续了整段时间；<i>F</i><sub>pk</sub>τ/2 是三角形的面积，不是正弦拱形的面积。</p>` },
  ],
  2: [
    { q: `${f(Eg.m, 3)} kg 的鸡蛋以 ${f(Eg.v0, 1)} m/s 落到地板上，在 ${f(Eg.tauHard)} s 内停下，没有反弹。它所受平均合力的大小是多少？`,
      choices: [`${f(Fhard)} N`, `${f(2 * Fhard, 1)} N`, `${f(Eg.J, 3)} N`, `${f(M.ke(Eg.m, Eg.v0) / Eg.tauHard)} N`], answer: 0,
      why: `<div class="eq"><i>F</i><sub>net</sub>Δ<i>t</i> = Δ<i>p</i> &nbsp;⇒&nbsp; <i>F</i><sub>net</sub> = <i>mv</i>/Δ<i>t</i> = ${f(Eg.J, 3)} / ${f(Eg.tauHard)} = ${f(Fhard)} N</div><p>鸡蛋停下而没有反弹，所以 Δ<i>p</i> = <i>mv</i>，而不是 2<i>mv</i>。${f(M.ke(Eg.m, Eg.v0) / Eg.tauHard)} N 是用能量除以时间（那是功率）。</p>` },
    { q: '与落在地板上相比，鸡蛋落在枕头上时',
      choices: ['冲量更小，平均作用力也更小', '冲量更大，作用时间更长', '平均作用力相同，作用时间更长', '冲量相同，平均作用力更小'], answer: 3,
      why: '<p>无论落在哪里，鸡蛋的速度都从 <i>v</i> 变为 0，所以 Δ<i>p</i>（即冲量）相同。枕头延长了 Δ<i>t</i>，所以 <i>F</i> = Δ<i>p</i>/Δ<i>t</i> 更小。</p>' },
  ],
  3: [
    { q: `取向右为正。${f(S.m1, 1)} kg、速度 ${sg(S.u1, 1)} m/s 的小车与 ${f(S.m2, 1)} kg、速度 ${sg(S.u2, 1)} m/s 的小车相碰并粘在一起。碰后它们的速度是多少？`,
      choices: [`${sg((S.m1 * S.u1 - S.m2 * S.u2) / (S.m1 + S.m2))} m/s`, `${sg((S.u1 + S.u2) / 2)} m/s`, `${sg(S.v1)} m/s`, `${sg(S.m1 * S.u1 + S.m2 * S.u2)} m/s`], answer: 2,
      why: `<div class="eq"><i>v</i>′ = (<i>m</i>₁<i>v</i>₁ + <i>m</i>₂<i>v</i>₂)/(<i>m</i>₁ + <i>m</i>₂) = (${f(S.m1 * S.u1, 1)} − ${f(-S.m2 * S.u2, 1)})/${f(S.m1 + S.m2, 1)} = ${sg(S.v1)} m/s</div><p>第二辆车向左运动，动量为负；若按 +${f(-S.m2 * S.u2, 1)} 相加，会得到 ${sg((S.m1 * S.u1 - S.m2 * S.u2) / (S.m1 + S.m2))} m/s。直接对速度取平均则忽略了质量。</p>` },
    { q: '这次碰撞损失了多少动能？',
      choices: [`${f(K1s)} J`, `${f(K0s)} J`, '0 J', `${f(K0s - K1s)} J`], answer: 3,
      why: `<p>碰前：½(${f(S.m1, 1)})(${f(S.u1, 1)})² + ½(${f(S.m2, 1)})(${f(S.u2, 1)})² = ${f(K0s)} J。碰后：½(${f(S.m1 + S.m2, 1)})(${f(S.v1, 1)})² = ${f(K1s)} J。损失：${f(K0s - K1s)} J，变成了热、声音和凹痕。动量守恒，动能不守恒。</p>` },
  ],
  4: [
    { q: `取向右为正。${f(Bo.m1, 1)} kg、速度 ${sg(Bo.u1, 1)} m/s 的小车与静止的 ${f(Bo.m2, 1)} kg 小车发生弹性碰撞。碰后 ${f(Bo.m1, 1)} kg 小车的速度是多少？`,
      choices: [`${sg(-Bo.v1)} m/s`, `${sg(Bo.v1)} m/s`, `${f(0)} m/s`, `${sg(Bo.m1 * Bo.u1 / (Bo.m1 + Bo.m2))} m/s`], answer: 1,
      why: `<p>弹性碰撞中，相对速度反向：<i>v</i>₂′ − <i>v</i>₁′ = ${f(Bo.u1, 1)} m/s。再结合动量守恒 ${f(Bo.m1, 1)} × ${f(Bo.u1, 1)} = ${f(Bo.m1, 1)}<i>v</i>₁′ + ${f(Bo.m2, 1)}<i>v</i>₂′：</p><div class="eq"><i>v</i>₁′ = (<i>m</i>₁ − <i>m</i>₂)<i>v</i>₁/(<i>m</i>₁ + <i>m</i>₂) = ${sg(Bo.v1)} m/s，&nbsp; <i>v</i>₂′ = ${sg(Bo.v2)} m/s</div><p>较轻的小车被弹回。${sg(Bo.m1 * Bo.u1 / (Bo.m1 + Bo.m2))} m/s 是两车粘在一起时的答案。</p>` },
    { q: '如果改为运动的小车与一辆完全相同的静止小车发生弹性碰撞，那么碰后',
      choices: ['两车都以一半的速度继续前进', '第一辆停下，第二辆以第一辆原来的速度开出', '第一辆以原速率弹回', '两车都停下'], answer: 1,
      why: '<p><i>m</i>₁ = <i>m</i>₂ 时，<i>v</i>₁′ = (<i>m</i>₁ − <i>m</i>₂)<i>v</i>₁/(<i>m</i>₁ + <i>m</i>₂) = 0，<i>v</i>₂′ = <i>v</i>₁。两车以一半速度一起前进虽然满足动量守恒，却会损失一半动能，所以不是弹性碰撞。</p>' },
  ],
  5: [
    { q: `${f(X.m1, 1)} kg 小车和 ${f(X.m2, 1)} kg 小车都静止，它们之间的弹簧释放了 ${f(X.Q, 1)} J 能量。${f(X.m2, 1)} kg 小车被弹开的速率是多少？`,
      choices: [`${f(-X.v1)} m/s`, `${f(Math.sqrt(2 * X.Q / X.m2))} m/s`, `${f(Math.sqrt(2 * X.Q / (X.m1 + X.m2)))} m/s`, `${f(X.v2)} m/s`], answer: 3,
      why: `<p>总动量保持为零：<i>m</i>₁<i>v</i>₁′ = −<i>m</i>₂<i>v</i>₂′，所以 ${f(X.m1, 1)} kg 小车的速率是另一辆的 ${f(X.m2 / X.m1, 0)} 倍。能量：½<i>m</i>₁(${f(X.m2 / X.m1, 0)}<i>v</i>)² + ½<i>m</i>₂<i>v</i>² = ${f(X.Q, 1)} J，得 <i>v</i> = ${f(X.v2)} m/s（轻车为 ${f(-X.v1)} m/s）。</p><p>${f(Math.sqrt(2 * X.Q / X.m2))} m/s 是把全部能量都给了一辆车，这会违反动量守恒。</p>` },
    { q: `在这次爆炸中，${f(X.m1, 1)} kg 小车的动能与 ${f(X.m2, 1)} kg 小车的动能之比是多少？`,
      choices: [f(X.m1 / X.m2), f(1, 1), f(X.m2 / X.m1, 1), f((X.m2 / X.m1) ** 2, 1)], answer: 2,
      why: `<p>两车动量大小相等、方向相反，又 <i>K</i> = <i>p</i>²/2<i>m</i>，所以比值为 <i>m</i>₂/<i>m</i>₁ = ${f(X.m2 / X.m1, 1)}：${f(M.ke(X.m1, X.v1), 1)} J 对 ${f(M.ke(X.m2, X.v2), 1)} J。轻车得到了弹簧的大部分能量。</p>` },
  ],
  6: [
    { q: `${f(Pd.m, 1)} kg、速度 ${f(Pd.u, 0)} m/s 的黏土嵌入 ${f(Pd.M, 1)} kg 的木块。木块能摆多高？`,
      choices: [`${f(Pd.dy * 100, 1)} cm`, `${f(Kclay / ((Pd.m + Pd.M) * G) * 100, 1)} cm`, `${f(Pd.v ** 2 / G * 100, 1)} cm`, `${f(Pd.u ** 2 / (2 * G) * 100, 0)} cm`], answer: 0,
      why: `<p>碰撞：用动量，<i>v</i>′ = <i>mu</i>/(<i>m</i> + <i>M</i>) = ${f(Pd.m * Pd.u, 1)}/${f(Pd.m + Pd.M, 1)} = ${f(Pd.v, 3)} m/s。摆起：用能量，Δ<i>y</i> = <i>v</i>′²/2<i>g</i> = ${f(Pd.dy * 100, 1)} cm。</p><p>${f(Kclay / ((Pd.m + Pd.M) * G) * 100, 1)} cm 假设黏土的动能在碰撞后全部保留；实际上黏土嵌入时大部分动能都损失了。</p>` },
    { q: '碰撞中黏土的动能损失了多大比例？',
      choices: [`${f(100 * Pd.m / (Pd.m + Pd.M), 1)}%`, '0%', `${f(100 * (1 - Kafter / Kclay), 1)}%`, '50.0%'], answer: 2,
      why: `<p>碰前：½(${f(Pd.m, 1)})(${f(Pd.u, 0)})² = ${f(Kclay, 1)} J。碰后：½(${f(Pd.m + Pd.M, 1)})(${f(Pd.v, 3)})² = ${f(Kafter)} J。保留的比例为 <i>m</i>/(<i>m</i> + <i>M</i>) = ${f(100 * Pd.m / (Pd.m + Pd.M), 1)}%，所以损失了 ${f(100 * (1 - Kafter / Kclay), 1)}%。</p>` },
  ],
  7: [
    { q: `${Cr.m1} kg 的轿车（向东 ${f(Cr.v1, 0)} m/s）与 ${Cr.m2} kg 的卡车（向北 ${f(Cr.v2, 0)} m/s）相撞后卡在一起。碰后瞬间残骸的速率是多少？`,
      choices: [`${f((Cr.px + Cr.py) / (Cr.m1 + Cr.m2))} m/s`, `${f(Cr.v)} m/s`, `${f((Cr.v1 + Cr.v2) / 2, 1)} m/s`, `${f(Math.hypot(Cr.v1, Cr.v2), 1)} m/s`], answer: 1,
      why: `<p>分方向计算：<i>v</i>′<sub>x</sub> = ${Cr.px}/${Cr.m1 + Cr.m2} = ${f(Cr.vx)} m/s，<i>v</i>′<sub>y</sub> = ${Cr.py}/${Cr.m1 + Cr.m2} = ${f(Cr.vy)} m/s。</p><div class="eq"><i>v</i>′ = √(${f(Cr.vx)}² + ${f(Cr.vy)}²) = ${f(Cr.v)} m/s</div><p>${f((Cr.px + Cr.py) / (Cr.m1 + Cr.m2))} m/s 是把两个动量当成同向直接相加。</p>` },
    { q: '残骸沿什么方向运动？',
      choices: [`东偏北 ${f(90 - Cr.angle, 1)}°`, `东偏北 ${f(Math.atan2(Cr.v2, Cr.v1) * 180 / Math.PI, 1)}°`, `东偏北 ${f(Math.atan2(Cr.v1, Cr.v2) * 180 / Math.PI, 1)}°`, `东偏北 ${f(Cr.angle, 1)}°`], answer: 3,
      why: `<div class="eq">tan θ = <i>p</i><sub>y</sub>/<i>p</i><sub>x</sub> = ${Cr.py}/${Cr.px} &nbsp;⇒&nbsp; 东偏北 θ = ${f(Cr.angle, 1)}°</div><p>要用动量而不是速率：卡车虽慢，却重八倍，所以它占上风。${f(Math.atan2(Cr.v2, Cr.v1) * 180 / Math.PI, 1)}° 是用速率算出的。</p>` },
  ],
  8: [
    { q: `炮弹（${f(Sh.v0, 0)} m/s，仰角 ${Sh.deg}°，若不炸开射程 <i>R</i> = ${f(Sh.R)} m）在最高点炸成质量相等的两半，后半块竖直落下。前半块落在哪里？`,
      choices: [`${f(Sh.R / 2)} m`, `${f(Sh.R)} m`, `${f(1.5 * Sh.R)} m`, `${f(2 * Sh.R)} m`], answer: 2,
      why: `<p>质心仍落在 <i>R</i> 处，就像什么都没发生。后半块落在 <i>R</i>/2 = ${f(Sh.R / 2)} m 处，两半质量相等，所以前半块落在 <i>R</i> 之外同样远的地方：<i>x</i> = 2<i>R</i> − <i>R</i>/2 = 3<i>R</i>/2 = ${f(1.5 * Sh.R)} m。</p><p>也可以直接算：它以 2<i>v</i><sub>x</sub> 离开最高点，下落时间相同，所以水平飞行距离是剩余 <i>R</i>/2 的两倍。</p>` },
    { q: '从爆炸到第一块碎片落地之间，系统质心的加速度是',
      choices: ['零', '<i>g</i>，竖直向下', '2<i>g</i>，竖直向下', '向前，由爆炸引起'], answer: 1,
      why: '<p>爆炸力是内力，成对抵消。唯一的外力仍是总重力 <i>Mg</i>，所以 <i>a</i><sub>cm</sub> = <i>g</i>，竖直向下，与爆炸前完全一样。</p>' },
  ],
  9: [
    { q: `一根杆从 <i>x</i> = 0 延伸到 <i>L</i> = ${f(Rd.L, 1)} m，线密度 λ(<i>x</i>) = λ<sub>0</sub><i>x</i>/<i>L</i>。它的质心在哪里？`,
      choices: [`<i>x</i> = ${f(Rd.L / 2)} m`, `<i>x</i> = ${f(Rd.L / 3, 3)} m`, `<i>x</i> = ${f(Rd.xN)} m`, `<i>x</i> = ${f(3 * Rd.L / 4)} m`], answer: 2,
      why: `<div class="eq"><i>M</i> = ∫<sub>0</sub><sup><i>L</i></sup> λ<sub>0</sub><i>x</i>/<i>L</i> d<i>x</i> = λ<sub>0</sub><i>L</i>/2, &nbsp; ∫<i>x</i> d<i>m</i> = ∫<sub>0</sub><sup><i>L</i></sup> λ<sub>0</sub><i>x</i>²/<i>L</i> d<i>x</i> = λ<sub>0</sub><i>L</i>²/3</div><div class="eq"><i>x</i><sub>cm</sub> = (λ<sub>0</sub><i>L</i>²/3)/(λ<sub>0</sub><i>L</i>/2) = 2<i>L</i>/3 = ${f(Rd.xN)} m</div><p>质心偏向密度大的一端。<i>L</i>/3 是从错误的一端量起；<i>L</i>/2 忽略了密度分布。</p>` },
    { q: `解答题。一根杆从 <i>x</i> = 0 延伸到 <i>L</i> = ${f(Rd.L, 1)} m，线密度 λ(<i>x</i>) = λ<sub>0</sub><i>x</i>²/<i>L</i>²，λ<sub>0</sub> = ${f(Rd.lam0, 1)} kg/m。求它的质量和质心位置。`,
      solution: `<p>把它切成 d<i>m</i> = λ d<i>x</i> 的小段：</p><div class="eq"><i>M</i> = ∫<sub>0</sub><sup><i>L</i></sup> λ<sub>0</sub><i>x</i>²/<i>L</i>² d<i>x</i> = λ<sub>0</sub><i>L</i>/3 = ${f(Rd.lam0, 1)} × ${f(Rd.L, 1)}/3 = ${f(Mq)} kg</div><div class="eq">∫<i>x</i> d<i>m</i> = ∫<sub>0</sub><sup><i>L</i></sup> λ<sub>0</sub><i>x</i>³/<i>L</i>² d<i>x</i> = λ<sub>0</sub><i>L</i>²/4</div><div class="eq"><i>x</i><sub>cm</sub> = (λ<sub>0</sub><i>L</i>²/4)/(λ<sub>0</sub><i>L</i>/3) = 3<i>L</i>/4 = ${f(xq)} m</div><p>比线性变化的杆的 2<i>L</i>/3 更偏向密度大的一端，这是合理的：更多质量集中在 <i>x</i> = <i>L</i> 附近。</p>` },
  ],
  10: [
    { q: `一块均匀的半圆形薄板，半径 <i>R</i> = ${f(Se.R, 1)} m。它的质心离直边多远？`,
      choices: [`${f(Se.R / 2, 3)} m`, `${f(2 * Se.R / Math.PI, 3)} m`, `${f(Se.R / 3, 3)} m`, `${f(Se.ucm, 3)} m`], answer: 3,
      why: `<p>取平行于直径的窄条，宽度为 2√(<i>R</i>² − <i>u</i>²)：</p><div class="eq"><i>u</i><sub>cm</sub> = ∫<sub>0</sub><sup><i>R</i></sup> 2<i>u</i>√(<i>R</i>² − <i>u</i>²) d<i>u</i> / (π<i>R</i>²/2) = (2<i>R</i>³/3)/(π<i>R</i>²/2) = 4<i>R</i>/3π = ${f(Se.ucm, 3)} m</div><p><i>R</i>/2 忽略了窄条离直边越远越窄；2<i>R</i>/π = ${f(2 * Se.R / Math.PI, 3)} m 对应的是细半圆环导线，它的质量全部分布在圆弧上。</p>` },
    { q: `一块均匀的三角形薄板，底边上的高 <i>h</i> = ${f(Tr.h, 1)} m。它的质心在底边上方多高处？`,
      choices: [`${f(Tr.h / 2, 3)} m`, `${f(Tr.ucm, 3)} m`, `${f(2 * Tr.h / 3, 3)} m`, `${f(Tr.h / 4, 3)} m`], answer: 1,
      why: `<p>平行于底边的窄条宽 <i>w</i> = <i>b</i>(1 − <i>u</i>/<i>h</i>)：在底边处最宽，在顶点处为零。</p><div class="eq"><i>u</i><sub>cm</sub> = ∫<sub>0</sub><sup><i>h</i></sup> <i>u</i>·<i>b</i>(1 − <i>u</i>/<i>h</i>) d<i>u</i> / (<i>bh</i>/2) = (<i>bh</i>²/6)/(<i>bh</i>/2) = <i>h</i>/3 = ${f(Tr.ucm, 3)} m</div><p>2<i>h</i>/3 是到顶点的距离。</p>` },
  ],
  11: [
    { q: `L 形板：A 臂 ${f(Ll.pA.m)} kg，中心在 <i>x</i> = ${f(Ll.pA.c[0])} m；B 臂 ${f(Ll.pB.m)} kg，中心在 <i>x</i> = ${f(Ll.pB.c[0])} m。L 形板的 <i>x</i><sub>cm</sub> 是多少？`,
      choices: [`${f((Ll.pA.c[0] + Ll.pB.c[0]) / 2, 3)} m`, `${f(Ll.pA.c[0], 3)} m`, `${f((Ll.pB.m * Ll.pA.c[0] + Ll.pA.m * Ll.pB.c[0]) / Ll.M, 3)} m`, `${f(Ll.cm[0], 3)} m`], answer: 3,
      why: `<div class="eq"><i>x</i><sub>cm</sub> = (${f(Ll.pA.m)} × ${f(Ll.pA.c[0])} + ${f(Ll.pB.m)} × ${f(Ll.pB.c[0])})/${f(Ll.M)} = ${f(Ll.cm[0], 3)} m</div><p>每个中心要按各自的质量加权。${f((Ll.pA.c[0] + Ll.pB.c[0]) / 2, 3)} m 是两个中心的简单平均，只在质量相等时才对。</p>` },
    { q: `解答题。从 <i>x</i><sub>cm</sub> = (1/<i>M</i>)∫<i>x</i> d<i>m</i> 出发，说明为什么可以把孔当作负质量处理。然后求边长 ${f(Ho.s, 1)} m 的正方形板（σ = ${f(M.SIGMA, 1)} kg/m²，中心在原点）挖去一个半径 ${f(Ho.r, 1)} m、圆心在 <i>x</i> = ${f(Ho.c[0])} m 的孔后的 <i>x</i><sub>cm</sub>。`,
      solution: `<p>对一个区域的积分可以拆成对各部分积分之和。带孔板等于完整的正方形减去圆片，所以</p><div class="eq">∫<sub>板</sub> <i>x</i> d<i>m</i> = ∫<sub>正方形</sub> <i>x</i> d<i>m</i> − ∫<sub>圆盘</sub> <i>x</i> d<i>m</i> = <i>m</i><sub>整</sub><i>x</i><sub>整</sub> − <i>m</i><sub>孔</sub><i>x</i><sub>孔</sub></div><p>同样 <i>M</i> = <i>m</i><sub>整</sub> − <i>m</i><sub>孔</sub>：孔的作用恰好等同于在其中心放一个质量 −<i>m</i><sub>孔</sub>。</p><p><i>m</i><sub>整</sub> = σ<i>s</i>² = ${f(Ho.mFull)} kg，位于 <i>x</i> = 0；<i>m</i><sub>孔</sub> = σπ<i>r</i>² = ${f(Ho.mPlug, 3)} kg，位于 <i>x</i> = ${f(Ho.c[0])} m；<i>M</i> = ${f(Ho.M, 3)} kg。</p><div class="eq"><i>x</i><sub>cm</sub> = (0 − ${f(Ho.mPlug, 3)} × ${f(Ho.c[0])})/${f(Ho.M, 3)} = ${f(Ho.cm[0] * 100)} cm</div><p>结果为负：质心向远离孔的方向移动。</p>` },
  ],
};
