// AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from model.js; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const p3 = x => (x < 0 ? '−' : '') + Math.abs(x).toPrecision(3);   // 3 significant figures
const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const G = M.G, sin = d => Math.sin(d * Math.PI / 180), cos = d => Math.cos(d * Math.PI / 180);
const TG = M.TUG, BD = M.BOARD, DR = M.DRAG;

// 0 · pressing down on the resting block
const PRESS = 5.0;
// 1 · strings at 25°
const TH1 = 25;
// 2 · hanging in an elevator moving up at constant speed
const VEL2 = 3.0;
// 3 · more thrust
const THRUST3 = 2400;
// 4 · distance in the push time
const X4 = 0.5 * M.A1 * M.PUSH_T ** 2;
// 5 · the car at highway speed, same forward push
const V5 = 30, D5 = M.CAR.k * V5 ** 2, A5 = (M.CAR.F - D5) / M.CAR.m;
// 6 · an 8.0 N push at rest; a 12.0 N push while sliding
const P6 = 8.0, P6b = 12.0, A6 = (P6b - M.F_K) / M.M1;
// 7 · the push moved to B's side
const C7 = M.M1 * M.PUSH / (M.M1 + M.M2);
// 8 · where the skaters meet, measured from A's start
const MEET = TG.d0 * TG.mB / TG.M;
// 9 · a harder pull on the board
const F9 = 24, ACM9 = F9 / BD.M, ABOARD9 = (F9 - BD.f) / BD.Mb;
// 10 · down the slope; with friction
const V10 = Math.sqrt(2 * M.A_INC * M.INC_LEN), A10 = G * (sin(M.THETA_DEG) - M.MU_K * cos(M.THETA_DEG));
// 11 · half of terminal speed; drag when a = g/4
const THALF = DR.tau * Math.log(2), D11 = 0.75 * DR.W;
// 12 · distance fallen in 1.00 s
const T12 = 1.00, X12 = M.linDrag(T12).x;

export const PRACTICE = {
  0: [
    { q: `${f(M.M1, 1)} kg 的木块静止在地板上，你用 ${f(PRESS, 1)} N 的力竖直向下压它。地板对它的支持力是多少？`,
      choices: [`${p3(M.W1 + PRESS)} N`, `${p3(M.W1)} N`, `${p3(M.W1 - PRESS)} N`, `${p3(PRESS)} N`], answer: 0,
      why: `<p>受力分析图：重力 ${f(M.W1, 1)} N 向下，你的压力 ${f(PRESS, 1)} N 向下，支持力向上。木块保持静止，所以 Σ<i>F</i> = 0：</p><div class="eq"><i>F</i><sub>N</sub> = <i>mg</i> + <i>F</i><sub>推</sub> = ${f(M.W1, 1)} + ${f(PRESS, 1)} = ${p3(M.W1 + PRESS)} N</div><p>支持力是接触面必须提供多少就是多少；只有在竖直方向没有其他力时它才等于 <i>mg</i>。</p>` },
    { q: '木块在光滑地板上匀速滑行（不计空气阻力）。它的受力分析图上应画哪些力？',
      choices: ['重力、支持力，以及维持它运动的向前的力', '只有重力', '支持力和一个向前的力', '只有重力和支持力'], answer: 3,
      why: `<p>只有与木块接触的物体（以及重力）才对它施力。地板给它支持力，地球给它重力。没有什么向前推它：它的速度保持不变，是因为合力为零，而不是因为有东西在驱动它。</p>` },
  ],
  1: [
    { q: `${f(M.M1, 1)} kg 的木块用两根绳静止悬挂，每根绳与水平方向成 ${TH1}°。每根绳的拉力是多少？`,
      choices: [`${p3(M.W1 / (2 * cos(TH1)))} N`, `${p3(M.W1 / (2 * sin(TH1)))} N`, `${p3(M.W1 / sin(TH1))} N`, `${p3(M.W1 / 2)} N`], answer: 1,
      why: `<p>水平分量互相抵消，两个竖直分量托住重力：</p><div class="eq">2<i>T</i> sin θ = <i>mg</i> &nbsp;→ <i>T</i> = ${f(M.W1, 1)} / (2 sin ${TH1}°) = ${p3(M.W1 / (2 * sin(TH1)))} N</div><p>角度是从水平方向量起的，所以竖直分量是 <i>T</i> sin θ，而不是 <i>T</i> cos θ。每根绳承受的拉力都大于重力的一半 ${p3(M.W1 / 2)} N。</p>` },
    { q: '两根绳被拉得越来越平，趋于水平，木块仍静止悬挂。拉力会怎样变化？',
      choices: ['趋于零。', '保持为重力的一半。', '无限增大；绳不可能完全水平。', '趋于整个重力。'], answer: 2,
      why: `<p><i>T</i> = <i>mg</i>/(2 sin θ)。当 θ → 0 时，sin θ → 0，<i>T</i> → ∞。水平的绳完全没有竖直分量，所以任何有限的拉力都托不住木块。</p>` },
  ],
  2: [
    { q: `${f(M.M1, 1)} kg 的木块用绳挂在电梯里，电梯正<b>以恒定的 ${f(VEL2, 1)} m/s 向上</b>运动。绳的拉力是多少？`,
      choices: [`${p3(M.W1 + M.M1 * VEL2)} N`, `${p3(M.M1 * VEL2)} N`, `${p3(M.W1 - M.M1 * VEL2)} N`, `${p3(M.W1)} N`], answer: 3,
      why: `<p>速度恒定意味着 <i>a</i> = 0，木块处于平衡状态：Σ<i>F</i> = <i>T</i> − <i>mg</i> = 0。</p><div class="eq"><i>T</i> = <i>mg</i> = ${f(M.M1, 1)} × ${f(G)} = ${p3(M.W1)} N</div><p>速率根本不出现；力改变速度，而维持速度不需要力。（<i>mv</i> 甚至不是力。）</p>` },
    { q: '冰球在光滑冰面上匀速滑行。维持它运动需要什么？',
      choices: ['什么都不需要；合力为零时它的速度保持不变。', '一个与其重力相等的恒定向前的力', '一个缓慢减小的向前的力', '它的“惯性力”，会随时间耗尽'], answer: 0,
      why: `<p>牛顿第一定律：Σ<i>F</i> = 0 时速度保持不变，无论是否在运动。惯性是一种性质（抵抗速度变化），不是力，也不会耗尽。</p>` },
  ],
  3: [
    { q: `${M.PLANE.m} kg 的飞机在水平巡航，阻力为 ${M.PLANE.D} N。飞行员把推力加大到 ${THRUST3} N。刚加大推力、阻力还没来得及变化时，飞机的加速度是多少？`,
      choices: [`${p3(THRUST3 / M.PLANE.m)} m/s²`, `${p3(M.PLANE.D / M.PLANE.m)} m/s²`, `${p3((THRUST3 - M.PLANE.D) / M.PLANE.m)} m/s²`, `${p3((THRUST3 + M.PLANE.D) / M.PLANE.m)} m/s²`], answer: 2,
      why: `<p>升力仍与重力抵消。沿飞行方向的合力是推力减去阻力：</p><div class="eq"><i>a</i> = (${THRUST3} − ${M.PLANE.D}) / ${M.PLANE.m} = ${p3((THRUST3 - M.PLANE.D) / M.PLANE.m)} m/s²，向前</div><p>只用推力计算，就忽略了仍在作用的阻力。</p>` },
    { q: `以 ${M.PLANE.v} m/s 匀速水平飞行时，向前的推力与阻力相比如何？`,
      choices: ['推力更大，否则飞机会减速。', '两者相等。', '推力比阻力大一个飞机的重力。', '阻力更大，因为飞机在运动。'], answer: 1,
      why: `<p>速度恒定意味着合力为零（牛顿第一定律），所以推力 = 阻力 = ${M.PLANE.D} N。推力大于阻力会使飞机加速，而不只是保持运动。</p>` },
  ],
  4: [
    { q: `${f(M.PUSH, 1)} N 的推力作用在光滑平面上静止的 ${f(M.M1, 1)} kg 木块上。${f(M.PUSH_T, 1)} s 内它走多远？`,
      choices: [`${p3(2 * X4)} m`, `${p3(0.5 * M.A2 * M.PUSH_T ** 2)} m`, `${p3(M.A1 * M.PUSH_T)} m`, `${p3(X4)} m`], answer: 3,
      why: `<p><i>a</i> = Σ<i>F</i>/<i>m</i> = ${f(M.PUSH, 1)}/${f(M.M1, 1)} = ${f(M.A1, 2)} m/s²，恒定，所以</p><div class="eq">Δ<i>x</i> = ½<i>at</i>² = ½ × ${f(M.A1, 2)} × (${f(M.PUSH_T, 1)})² = ${p3(X4)} m</div><p>${p3(2 * X4)} m 漏掉了 ½；${p3(M.A1 * M.PUSH_T)} 是达到的速率，单位 m/s。</p>` },
    { q: '小车受到的合力加倍，质量也加倍。它的加速度变为',
      choices: ['原来的四分之一', '不变', '原来的两倍', '原来的四倍'], answer: 1,
      why: `<p><i>a</i> = Σ<i>F</i>/<i>m</i> = (2Σ<i>F</i>)/(2<i>m</i>)：两个因子相互约去。</p>` },
  ],
  5: [
    { q: '汽车在水平路面上加速。是什么外力推动汽车向前？',
      choices: ['发动机对汽车的力', '轮胎对路面的力', '路面对轮胎的静摩擦力', '路面对轮胎的滑动摩擦力'], answer: 2,
      why: `<p>发动机是汽车的一部分；内力不能使汽车加速。轮胎向后推路面，由牛顿第三定律，路面向前推轮胎。轮胎表面在路面上没有打滑，所以这是<b>静</b>摩擦力。轮胎对路面的力作用在路面上，而不是汽车上。</p>` },
    { q: `路面同样以 ${f(M.CAR.F / 1000, 1)} kN 的力向前推，${M.CAR.m} kg 的汽车达到 ${V5} m/s，此时阻力为 ${f(D5, 0)} N。这时它的加速度是多少？`,
      choices: [`${p3(M.CAR.F / M.CAR.m)} m/s²`, `${p3(A5)} m/s²`, `${p3((M.CAR.F + D5) / M.CAR.m)} m/s²`, `${p3(D5 / M.CAR.m)} m/s²`], answer: 1,
      why: `<p>阻力向后，与运动方向相反：</p><div class="eq"><i>a</i> = (<i>F</i> − <i>F</i><sub>d</sub>)/<i>m</i> = (${M.CAR.F} − ${f(D5, 0)}) / ${M.CAR.m} = ${p3(A5)} m/s²</div><p>${p3(M.CAR.F / M.CAR.m)} m/s² 忽略了阻力，这也是真实汽车在高速时加速变慢的原因。</p>` },
  ],
  6: [
    { q: `${f(M.M1, 1)} kg 的木块放在粗糙地板上（μ<sub>s</sub> = ${f(M.MU_S)}，μ<sub>k</sub> = ${f(M.MU_K)}）。你用 ${f(P6, 1)} N 的力水平推它。它受到的摩擦力是多少？`,
      choices: [`${p3(M.F_SMAX)} N`, `${p3(M.F_K)} N`, `${p3(P6)} N`, '0 N'], answer: 2,
      why: `<p>上限是 μ<sub>s</sub><i>F</i><sub>N</sub> = ${f(M.MU_S)} × ${f(M.FN, 1)} = ${f(M.F_SMAX)} N。${f(P6, 1)} N 低于上限，所以木块不动，静摩擦力恰好与推力平衡：${p3(P6)} N。μ<sub>s</sub><i>F</i><sub>N</sub> 是<b>最大值</b>，不是实际值。</p>` },
    { q: `木块滑动起来后，推力已增大到 ${f(P6b, 1)} N。木块的加速度是多少？`,
      choices: [`${p3((P6b - M.F_SMAX) / M.M1)} m/s²`, `${p3(P6b / M.M1)} m/s²`, `${p3((P6b + M.F_K) / M.M1)} m/s²`, `${p3(A6)} m/s²`], answer: 3,
      why: `<p>木块在滑动，所以受到向后的滑动摩擦力 μ<sub>k</sub><i>mg</i> = ${f(M.F_K)} N：</p><div class="eq"><i>a</i> = (${f(P6b, 1)} − ${f(M.F_K)}) / ${f(M.M1, 1)} = ${p3(A6)} m/s²</div><p>一旦滑动，静摩擦力 ${f(M.F_SMAX)} N 的上限就不再适用。</p>` },
  ],
  7: [
    { q: `现在把同样 ${f(M.PUSH, 1)} N 的推力作用在 B（${f(M.M2, 1)} kg）上，让它在光滑地板上推着 A（${f(M.M1, 1)} kg）。两个木块之间的相互作用力多大？`,
      choices: [`${p3(C7)} N`, `${p3(M.CONTACT)} N`, `${p3(M.PUSH)} N`, `${p3(M.PUSH / 2)} N`], answer: 0,
      why: `<p>整体：<i>a</i> = ${f(M.PUSH, 1)}/(${f(M.M1, 1)} + ${f(M.M2, 1)}) = ${f(M.A_PAIR, 2)} m/s²。接触力是 A 在水平方向受到的唯一的力，所以</p><div class="eq"><i>F</i><sub>BA</sub> = <i>m</i><sub>A</sub><i>a</i> = ${f(M.M1, 1)} × ${f(M.A_PAIR, 2)} = ${p3(C7)} N</div><p>从后面推较轻的木块，只需要很小的接触力；${p3(M.CONTACT)} N 是推力作用在 A 上时的答案。</p>` },
    { q: '木块静止在桌面上。木块所受重力（地球向下吸引木块）的反作用力是什么？',
      choices: ['桌面向上推木块', '木块向上吸引地球', '木块向下压桌面', '桌子向下压地板'], answer: 1,
      why: `<p>一对作用力与反作用力是同一相互作用从两边看：地球吸引木块，木块吸引地球，大小相等，方向相反，作用在不同物体上。桌面的支持力也作用在木块上，所以它不可能是反作用力，尽管这里两者大小相等。</p>` },
  ],
  8: [
    { q: `滑冰者 A（${TG.mA} kg）和 B（${TG.mB} kg）在光滑冰面上相距 ${f(TG.d0, 1)} m，拉一根轻绳直到相遇。他们在离 A 出发点多远处相遇？`,
      choices: [`${p3(TG.d0 / 2)} m`, `${p3(TG.d0 * TG.mA / TG.M)} m`, `${p3(MEET)} m`, `${p3(TG.d0 * TG.mA / TG.mB)} m`], answer: 2,
      why: `<p>水平方向只有内力作用，所以质心不动；他们就在质心处相遇。以 A 为起点：</p><div class="eq"><i>x</i><sub>cm</sub> = (<i>m</i><sub>A</sub> · 0 + <i>m</i><sub>B</sub> · <i>d</i>) / (<i>m</i><sub>A</sub> + <i>m</i><sub>B</sub>) = ${TG.mB} × ${f(TG.d0, 1)} / ${TG.M} = ${p3(MEET)} m</div><p>较轻的滑冰者移动得更远。${p3(TG.d0 * TG.mA / TG.M)} m 是把两人的质量弄反了。</p>` },
    { q: '把两名滑冰者和绳作为系统，他们拉绳的过程中，下列哪种说法正确？',
      choices: ['质心向较重的滑冰者移动。', '绳的拉力使系统的质心加速。', '只有当 A 和 B 质量相等时，他们受到的拉力才相互抵消。', '质心保持静止，因为拉力是内力。'], answer: 3,
      why: `<p>绳对 A 和 B 的拉力等大反向，且都在系统内部，所以无论质量如何，总和都为零。重力和支持力互相抵消。Σ<i>F</i><sub>ext</sub> = 0，所以 <i>a</i><sub>cm</sub> = 0，而质心开始时是静止的。</p>` },
  ],
  9: [
    { q: `木板受到的拉力增大到 ${F9} N；${f(BD.m, 1)} kg 的木块仍在 ${f(BD.Mb, 1)} kg 的木板上打滑（μ<sub>k</sub> = ${f(BD.mu_k)}）。木块的加速度是多少？`,
      choices: [`${p3(ACM9)} m/s²`, `${p3(BD.aBlock)} m/s²`, `${p3(BD.mu_s * G)} m/s²`, `${p3(ABOARD9)} m/s²`], answer: 1,
      why: `<p>木块在水平方向受到的唯一的力是滑动摩擦力 μ<sub>k</sub><i>mg</i> = ${f(BD.f)} N，与拉力大小无关：</p><div class="eq"><i>a</i> = μ<sub>k</sub><i>g</i> = ${f(BD.mu_k)} × ${f(G)} = ${p3(BD.aBlock)} m/s²</div><p>绳拉的是木板，不是木块。${p3(ACM9)} m/s² 是质心的加速度。</p>` },
    { q: `同样 ${F9} N 的拉力。木块 + 木板的质心加速度是多少？`,
      choices: [`${p3(F9 / BD.Mb)} m/s²`, `${p3(ABOARD9)} m/s²`, `${p3((F9 - BD.f) / BD.M)} m/s²`, `${p3(ACM9)} m/s²`], answer: 3,
      why: `<p>木块与木板之间的摩擦力是内力，互相抵消。水平方向唯一的外力是拉力：</p><div class="eq"><i>a</i><sub>cm</sub> = Σ<i>F</i><sub>ext</sub>/<i>M</i> = ${F9} / ${f(BD.M, 1)} = ${p3(ACM9)} m/s²</div><p>验算：(${f(BD.m, 1)} × ${f(BD.aBlock)} + ${f(BD.Mb, 1)} × ${f(ABOARD9)}) / ${f(BD.M, 1)} = ${f(ACM9)} m/s²。</p>` },
  ],
  10: [
    { q: `木块由静止沿 ${M.THETA_DEG}° 的光滑斜面下滑 ${f(M.INC_LEN, 1)} m。到底端时速率多大？`,
      choices: [`${p3(Math.sqrt(2 * G * M.INC_LEN))} m/s`, `${p3(Math.sqrt(G * sin(M.THETA_DEG) * M.INC_LEN))} m/s`, `${p3(V10)} m/s`, `${p3(Math.sqrt(2 * G * cos(M.THETA_DEG) * M.INC_LEN))} m/s`], answer: 2,
      why: `<p>沿斜面 <i>a</i> = <i>g</i> sin θ = ${f(M.A_INC)} m/s²。由静止出发，且没有给出时间：</p><div class="eq"><i>v</i> = √(2<i>aL</i>) = √(2 × ${f(M.A_INC)} × ${f(M.INC_LEN, 1)}) = ${p3(V10)} m/s</div><p>${p3(Math.sqrt(2 * G * M.INC_LEN))} m/s 用了完整的 <i>g</i>，好像它竖直下落了 ${f(M.INC_LEN, 1)} m；cos θ 对应的是<b>垂直压向</b>斜面的分量。</p>` },
    { q: `现在斜面粗糙，μ<sub>k</sub> = ${f(M.MU_K)}。木块沿斜面下滑的加速度是多少？`,
      choices: [`${p3(M.A_INC)} m/s²`, `${p3(G * (sin(M.THETA_DEG) + M.MU_K * cos(M.THETA_DEG)))} m/s²`, `${p3(A10)} m/s²`, `${p3(G * (sin(M.THETA_DEG) - M.MU_K))} m/s²`], answer: 2,
      why: `<p>摩擦力为 μ<sub>k</sub><i>F</i><sub>N</sub>，而在斜面上 <i>F</i><sub>N</sub> = <i>mg</i> cos θ。它沿斜面向上，与滑动方向相反：</p><div class="eq"><i>a</i> = <i>g</i>(sin θ − μ<sub>k</sub> cos θ) = ${f(G)}(${f(sin(M.THETA_DEG), 3)} − ${f(M.MU_K)} × ${f(cos(M.THETA_DEG), 3)}) = ${p3(A10)} m/s²</div><p>${p3(G * (sin(M.THETA_DEG) - M.MU_K))} m/s² 用了 <i>F</i><sub>N</sub> = <i>mg</i>，这只在水平地面上成立。</p>` },
  ],
  11: [
    { q: `${f(DR.m, 2)} kg 的小球（<i>b</i> = ${f(DR.b)} kg/s）由静止释放。经过多长时间它达到终端速率的一半？`,
      choices: [`${p3(DR.tau / 2)} s`, `${p3(THALF)} s`, `${p3(DR.tau)} s`, `${p3(Math.log(2))} s`], answer: 1,
      why: `<p>由 <i>m</i> d<i>v</i>/d<i>t</i> = <i>mg</i> − <i>bv</i> 分离变量并积分，得 <i>v</i> = <i>v</i><sub>t</sub>(1 − e<sup>−<i>t</i>/τ</sup>)，τ = <i>m</i>/<i>b</i> = ${f(DR.tau)} s。令 <i>v</i> = <i>v</i><sub>t</sub>/2：</p><div class="eq">e<sup>−<i>t</i>/τ</sup> = ½ &nbsp;→ <i>t</i> = τ ln 2 = ${f(DR.tau)} × ${f(Math.log(2), 3)} = ${p3(THALF)} s</div><p>速率不是线性增长的，所以不是 τ/2；而到 τ 时它已经达到 63%。</p>` },
    { q: `对同一个小球（<i>m</i> d<i>v</i>/d<i>t</i> = <i>mg</i> − <i>bv</i>，由静止释放），对 <i>v</i>(<i>t</i>) 求导得到 <i>a</i>(<i>t</i>)。再求 <i>a</i> = <i>g</i>/4 那一瞬间的阻力，以及该时刻。`,
      solution: `<p>1. <i>v</i> = <i>v</i><sub>t</sub>(1 − e<sup>−<i>t</i>/τ</sup>)，所以 <i>a</i> = d<i>v</i>/d<i>t</i> = (<i>v</i><sub>t</sub>/τ) e<sup>−<i>t</i>/τ</sup> = <i>g</i> e<sup>−<i>t</i>/τ</sup>，因为 <i>v</i><sub>t</sub>/τ = (<i>mg</i>/<i>b</i>)(<i>b</i>/<i>m</i>) = <i>g</i>。</p><p>2. 由微分方程，<i>ma</i> = <i>mg</i> − <i>F</i><sub>d</sub>。代入 <i>a</i> = <i>g</i>/4：</p><div class="eq"><i>F</i><sub>d</sub> = <i>mg</i> − <i>mg</i>/4 = ¾<i>mg</i> = ¾ × ${f(DR.W, 2)} = ${f(D11, 2)} N</div><p>3. 由 e<sup>−<i>t</i>/τ</sup> = ¼ 得 <i>t</i> = τ ln 4 = ${f(DR.tau)} × ${f(Math.log(4), 3)} = ${f(DR.tau * Math.log(4), 3)} s。验算：<i>v</i> = ¾<i>v</i><sub>t</sub> = ${f(0.75 * DR.vt)} m/s，<i>bv</i> = ${f(DR.b * 0.75 * DR.vt, 2)} N。</p>` },
  ],
  12: [
    { q: `小球（<i>v</i><sub>t</sub> = ${f(DR.vt)} m/s，τ = ${f(DR.tau)} s）由静止释放后 ${f(T12)} s，下落了多远？`,
      choices: [`${p3(DR.vt * T12)} m`, `${p3(X12)} m`, `${p3(DR.vt * (T12 - DR.tau))} m`, `${p3(0.5 * G * T12 ** 2)} m`], answer: 1,
      why: `<p>对速度积分：</p><div class="eq"><i>x</i> = ∫<sub>0</sub><sup><i>t</i></sup> <i>v</i><sub>t</sub>(1 − e<sup>−<i>t</i>′/τ</sup>) d<i>t</i>′ = <i>v</i><sub>t</sub>[<i>t</i> − τ(1 − e<sup>−<i>t</i>/τ</sup>)]</div><div class="eq">= ${f(DR.vt)} × [${f(T12)} − ${f(DR.tau)}(1 − e<sup>−${f(T12 / DR.tau, 1)}</sup>)] = ${p3(X12)} m</div><p>${p3(DR.vt * (T12 - DR.tau))} m 是较长时间后的渐近线 <i>v</i><sub>t</sub>(<i>t</i> − τ)；在 <i>t</i> = ${f(T12 / DR.tau, 1)}τ 时，e<sup>−<i>t</i>/τ</sup> 项还不能忽略。${p3(0.5 * G * T12 ** 2)} m 忽略了阻力。</p>` },
    { q: '两个小球大小、形状相同，一个质量是另一个的 4 倍，都下落到终端速率。在线性阻力（<i>bv</i>）和平方阻力（<i>kv</i>²）下，较重小球的 <i>v</i><sub>t</sub> 分别是较轻小球的几倍？',
      choices: ['线性 2×，平方 4×', '线性 4×，平方 4×', '线性 2×，平方 2×', '线性 4×，平方 2×'], answer: 3,
      why: `<p>达到终端速率时，阻力 = <i>mg</i>。线性：<i>bv</i><sub>t</sub> = <i>mg</i>，<i>v</i><sub>t</sub> = <i>mg</i>/<i>b</i> ∝ <i>m</i>，所以是 4×。平方：<i>kv</i><sub>t</sub>² = <i>mg</i>，<i>v</i><sub>t</sub> = √(<i>mg</i>/<i>k</i>) ∝ √<i>m</i>，所以是 2×。大小、形状相同，<i>b</i> 和 <i>k</i> 也就相同。</p>` },
  ],
};
