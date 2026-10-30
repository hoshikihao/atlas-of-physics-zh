// AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from model.js; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const p3 = x => (x < 0 ? '−' : '') + Math.abs(x).toPrecision(3);   // 3 significant figures
const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const G = M.G, rad = d => d * Math.PI / 180, RE = M.EARTH.R, GM = M.GM, m = M.SAT_M;
const B = M.BALL;

// 0 · twice the speed
const AC0 = M.ac(M.V2, B.r);
// 1 · half the string
const T1 = B.m * M.V1 ** 2 / (B.r / 2);
// 2 · a wet road
const MU2 = 0.40, V2MAX = Math.sqrt(MU2 * G * M.CAR.r);
// 3 · the cone at 60°
const TH3 = 60, R3 = M.CONE.L * Math.sin(rad(TH3)), V3 = Math.sqrt(R3 * G * Math.tan(rad(TH3))), T3 = M.CONE.m * G / Math.cos(rad(TH3));
// 4 · the loop's top at 9.0 m/s
const L = M.LOOP, V4 = 9.0, N4 = L.m * (V4 ** 2 / L.r - G);
// 5 · a wider banked curve
const R5 = 40, V5 = Math.sqrt(R5 * G * Math.tan(M.BANK.th));
// 6 · a record turntable
const RPM6 = 100 / 3, R6 = 0.15, V6 = R6 * RPM6 * 2 * Math.PI / 60;
// 7 · g one Earth radius up
const G7 = M.EARTH.g / 4;
// 8 · orbit at 3 R_E
const V8 = Math.sqrt(GM / (3 * RE));
// 9 · an ellipse from 2 R_E to 4 R_E
const RP9 = 2 * RE, RA9 = 4 * RE, VP9 = M.visViva(RP9, (RP9 + RA9) / 2), VA9 = VP9 * RP9 / RA9;
// 10 · the page's ellipse: K at apogee from energy
const KP = 0.5 * m * M.ELL.vp ** 2, UP = M.Ugrav(M.ELL.rp), UA = M.Ugrav(M.ELL.ra), KA = KP + UP - UA;
// 11 · gravity's work from 4 R_E in to 2 R_E; ΔU to 100 km
const W11 = GM * m * (1 / (2 * RE) - 1 / (4 * RE)), H11 = 100e3, DU11 = GM * m * (1 / RE - 1 / (RE + H11)), MGH11 = m * M.EARTH.g * H11;
// 12 · escape from 4 R_E; from a circular orbit at 2 R_E
const VE12 = M.vEsc(4 * RE), R12 = 2 * RE;
const GJ = x => f(x / 1e9, 2);

export const PRACTICE = {
  0: [
    { q: '小球以恒定速率做圆周运动。它的加速度指向哪里？',
      choices: ['沿速度方向，与圆相切', '指向圆心', '背离圆心', '没有方向：速率恒定意味着加速度为零'], answer: 1,
      why: `<p>速度是矢量；它的方向不断朝圆心偏转，所以 Δ<i>v</i>（以及 <i>a</i>）指向圆心，⟂ <i>v</i>。<b>速率</b>恒定意味着 <i>a</i> 没有沿 <i>v</i> 的分量，而不是 <i>a</i> 为零。</p>` },
    { q: `小球在同样 ${f(B.r)} m 的圆周上以 ${f(M.V2, 1)} m/s 而不是 ${f(M.V1, 1)} m/s 运动。它的向心加速度是多少？`,
      choices: [`${p3(2 * M.ac(M.V1, B.r))} m/s²`, `${p3(M.ac(M.V1, B.r))} m/s²`, `${p3(AC0)} m/s²`, `${p3(M.ac(M.V1, B.r) / 2)} m/s²`], answer: 2,
      why: `<div class="eq"><i>a</i><sub>c</sub> = <i>v</i>²/<i>r</i> = (${f(M.V2, 1)})² / ${f(B.r)} = ${p3(AC0)} m/s²</div><p>速率要平方：速率加倍，加速度变为 ${f(M.ac(M.V1, B.r))} m/s² 的四倍，而不是两倍。</p>` },
  ],
  1: [
    { q: `${f(B.m)} kg 的小球仍以 ${f(M.V1, 1)} m/s 运动，但绳长减半为 ${f(B.r / 2)} m。拉力是多少？`,
      choices: [`${p3(T1)} N`, `${p3(T1 / 4)} N`, `${p3(2 * T1)} N`, `${p3(T1 / 2)} N`], answer: 0,
      why: `<p>在光滑桌面上，拉力是唯一的水平力，所以它就是全部的向心力：</p><div class="eq"><i>T</i> = <i>mv</i>²/<i>r</i> = ${f(B.m)} × (${f(M.V1, 1)})² / ${f(B.r / 2)} = ${p3(T1)} N</div><p>速率不变而 <i>r</i> 减半，<i>T</i> 加倍（原来是 ${f(M.tension(M.V1))} N）。</p>` },
    { q: '从上方看，小球做圆周运动时绳突然断了。紧接着小球',
      choices: ['沿螺旋线向外运动', '沿原来绳的方向，从圆心径直向外运动', '沿该点的切线做直线运动', '仍在同一圆周上运动，逐渐减速'], answer: 2,
      why: `<p>绳断后没有水平力，所以（牛顿第一定律）小球保持原来的速度：沿圆的切线做直线运动。并不存在把它沿半径甩出去的向外的力。</p>` },
  ],
  2: [
    { q: `雨天轮胎的 μ<sub>s</sub> 降到 ${f(MU2)}。汽车通过半径 ${M.CAR.r} m 的水平弯道的最大速率是多少？`,
      choices: [`${p3(M.CAR.vmax)} m/s`, `${p3(M.CAR.vmax / 2)} m/s`, `${p3(MU2 * G * M.CAR.r)} m/s`, `${p3(V2MAX)} m/s`], answer: 3,
      why: `<p>达到极限时，静摩擦力的最大值恰好等于所需的向心力：μ<sub>s</sub><i>mg</i> = <i>mv</i>²/<i>r</i>。</p><div class="eq"><i>v</i><sub>max</sub> = √(μ<sub>s</sub><i>gr</i>) = √(${f(MU2)} × ${f(G)} × ${M.CAR.r}) = ${p3(V2MAX)} m/s</div><p>μ<sub>s</sub> 减半，<i>v</i><sub>max</sub> 变为原来的 1/√2，而不是 1/2。</p>` },
    { q: '一辆质量是汽车两倍的卡车，轮胎和水平弯道都相同，以最大可能的速率过弯。与汽车的最大速率相比，卡车的最大速率',
      choices: ['是汽车的一半', '是汽车的 1/√2', '相同', '是汽车的 √2 倍'], answer: 2,
      why: `<p>μ<sub>s</sub><i>mg</i> = <i>mv</i>²/<i>r</i>：质量出现在两边并约去，<i>v</i><sub>max</sub> = √(μ<sub>s</sub><i>gr</i>)。卡车需要两倍的摩擦力，但它加倍的重量也让路面能提供两倍的摩擦力。</p>` },
  ],
  3: [
    { q: `把 ${f(M.CONE.L, 1)} m 长绳上 ${f(M.CONE.m)} kg 的小球甩得更快，直到绳偏离竖直方向 ${TH3}°。小球的速率是多少？`,
      choices: [`${p3(Math.sqrt(M.CONE.L * G * Math.tan(rad(TH3))))} m/s`, `${p3(Math.sqrt(R3 * G / Math.tan(rad(TH3))))} m/s`, `${p3(V3)} m/s`, `${p3(Math.sqrt(G * M.CONE.L))} m/s`], answer: 2,
      why: `<p>半径是水平方向的距离 <i>r</i> = <i>L</i> sin θ = ${f(R3, 3)} m，而不是 <i>L</i>。由 <i>g</i> tan θ = <i>v</i>²/<i>r</i>：</p><div class="eq"><i>v</i> = √(<i>rg</i> tan θ) = √(${f(R3, 3)} × ${f(G)} × ${f(Math.tan(rad(TH3)), 3)}) = ${p3(V3)} m/s</div><p>${p3(Math.sqrt(R3 * G / Math.tan(rad(TH3))))} m/s 用了与水平方向夹角的正切。</p>` },
    { q: `同一个小球，绳偏离竖直方向 ${TH3}°。绳的拉力是多少？`,
      choices: [`${p3(T3)} N`, `${p3(M.CONE.m * G * Math.cos(rad(TH3)))} N`, `${p3(M.CONE.m * G / Math.sin(rad(TH3)))} N`, `${p3(M.CONE.m * G)} N`], answer: 0,
      why: `<p>竖直方向没有加速度，所以绳的竖直分量托住重力：</p><div class="eq"><i>T</i> cos θ = <i>mg</i> &nbsp;→ <i>T</i> = ${f(M.CONE.m * G, 2)} / cos ${TH3}° = ${p3(T3)} N</div><p>拉力必须<b>大于</b> <i>mg</i>，因为只有它的一部分向上；<i>mg</i> cos θ 方向反了。</p>` },
  ],
  4: [
    { q: `${L.m} kg 的过山车倒挂着以 ${f(V4, 1)} m/s 通过半径 ${f(L.r, 1)} m 的回环最高点。轨道对它的压力多大？`,
      choices: [`${p3(L.m * (V4 ** 2 / L.r + G) / 1000)} kN`, `${p3(N4 / 1000)} kN`, `${p3(L.m * V4 ** 2 / L.r / 1000)} kN`, `${p3(L.W / 1000)} kN`], answer: 1,
      why: `<p>在最高点，两个力都向下、指向圆心，合起来提供 <i>mv</i>²/<i>r</i>：</p><div class="eq"><i>F</i><sub>N</sub> + <i>mg</i> = <i>mv</i>²/<i>r</i> &nbsp;→ <i>F</i><sub>N</sub> = ${L.m}(${f(V4 ** 2 / L.r, 2)} − ${f(G)}) = ${f(N4, 0)} N = ${p3(N4 / 1000)} kN</div><p>把 <i>mg</i> 加上去，是回环<b>最低点</b>的方程。</p>` },
    { q: `过山车以多小的速率通过半径 ${f(L.r, 1)} m 的回环最高点，仍能不脱离轨道？`,
      choices: [`${p3(Math.sqrt(2 * G * L.r))} m/s`, `${p3(G * L.r)} m/s`, `${p3(Math.sqrt(G * L.r / 2))} m/s`, `${p3(L.vmin)} m/s`], answer: 3,
      why: `<p>速率越小，轨道的压力越小。极限是 <i>F</i><sub>N</sub> = 0，只由重力提供向心力：</p><div class="eq"><i>mg</i> = <i>mv</i>²/<i>r</i> &nbsp;→ <i>v</i><sub>min</sub> = √(<i>gr</i>) = √(${f(G)} × ${f(L.r, 1)}) = ${p3(L.vmin)} m/s</div><p>质量约去了；比这更慢，重力就会把过山车拉到圆周以内，使它脱离轨道。</p>` },
  ],
  5: [
    { q: `半径 ${R5} m 的弯道同样倾斜 ${M.BANK.thetaDeg}°。汽车以多大速率过弯时完全不需要摩擦力？`,
      choices: [`${p3(M.BANK.v)} m/s`, `${p3(Math.sqrt(R5 * G))} m/s`, `${p3(R5 * G * Math.tan(M.BANK.th))} m/s`, `${p3(V5)} m/s`], answer: 3,
      why: `<p>竖直方向：<i>F</i><sub>N</sub> cos θ = <i>mg</i>。水平方向：<i>F</i><sub>N</sub> sin θ = <i>mv</i>²/<i>r</i>。两式相除：</p><div class="eq">tan θ = <i>v</i>²/(<i>rg</i>) &nbsp;→ <i>v</i> = √(${R5} × ${f(G)} × tan ${M.BANK.thetaDeg}°) = ${p3(V5)} m/s</div><p>半径变为四倍，速率是 ${M.BANK.r} m 弯道上 ${f(M.BANK.v)} m/s 的两倍。</p>` },
    { q: '在结冰（无摩擦）的倾斜弯道上，汽车的速率超过了这个倾角的设计速率。会发生什么？',
      choices: ['它向坡上漂移，朝弯道外侧滑去。', '它向坡下滑，朝弯道内侧滑去。', '它仍沿弯道行驶，因为支持力会相应增大。', '它不再转弯，沿斜坡径直下滑。'], answer: 0,
      why: `<p>没有摩擦力时，支持力既要托住汽车（<i>F</i><sub>N</sub> cos θ = <i>mg</i>），又要让它转弯，所以它的水平分量固定为 <i>mg</i> tan θ。更快的汽车需要比这更大的向心力，所以它无法沿这个圆周运动，会漂向更大的半径，即向坡上滑。</p>` },
  ],
  6: [
    { q: `唱片以 33⅓ rpm 转动。距中心 ${f(R6)} m 处的一粒灰尘运动得多快？`,
      choices: [`${p3(R6 * RPM6 / 60)} m/s`, `${p3(V6)} m/s`, `${p3(R6 * RPM6)} m/s`, `${p3(2 * R6 * RPM6 * 2 * Math.PI / 60)} m/s`], answer: 1,
      why: `<p>先换算成 rad/s：ω = 33⅓ × 2π/60 = ${f(RPM6 * 2 * Math.PI / 60, 3)} rad/s。于是</p><div class="eq"><i>v</i> = <i>r</i>ω = ${f(R6)} × ${f(RPM6 * 2 * Math.PI / 60, 3)} = ${p3(V6)} m/s</div><p><i>v</i> = <i>r</i>ω 只在 ω 以 rad/s 为单位时成立；${p3(R6 * RPM6)} 直接用了 rpm，${p3(R6 * RPM6 / 60)} 用了转每秒却漏掉了 2π。</p>` },
    { q: `转动圆盘上的木块分别距中心 ${f(M.DISC.r1)} m 和 ${f(M.DISC.r2)} m。与内侧木块相比，外侧木块的向心加速度`,
      choices: ['是它的一半', '相同', '是它的两倍', '是它的四倍'], answer: 2,
      why: `<p>两者的 ω 相同，所以 <i>a</i><sub>c</sub> = <i>v</i>²/<i>r</i> = <i>r</i>ω² 与 <i>r</i> 成正比。（用 <i>v</i>²/<i>r</i> 算：<i>v</i> 加倍，<i>r</i> 也加倍：4/2 = 2，而不是 4。）</p>` },
  ],
  7: [
    { q: '两个球之间的引力为 <i>F</i>。把其中一个的质量变为三倍，中心距离变为两倍，引力变为',
      choices: [`${(3 / 4).toFixed(3)} <i>F</i>`, `${(3 / 2).toFixed(2)} <i>F</i>`, `${(3 / 8).toFixed(3)} <i>F</i>`, `${(3 * 4).toFixed(1)} <i>F</i>`], answer: 0,
      why: `<p><i>F</i> ∝ <i>m</i><sub>1</sub><i>m</i><sub>2</sub>/<i>r</i>²：把各个因子相乘，3 × 1 / 2² = ¾。忘了把 <i>r</i> 平方，就会得到 1.5 <i>F</i>。</p>` },
    { q: `在地面以上一个地球半径的高度处，引力场强度（自由落体加速度）是多少？（地面处 <i>g</i> = ${f(M.EARTH.g)} m/s²）`,
      choices: [`${p3(M.EARTH.g / 2)} m/s²`, `${p3(G7)} m/s²`, `${p3(M.EARTH.g / 9)} m/s²`, `${p3(M.EARTH.g)} m/s²`], answer: 1,
      why: `<p>在<b>地面以上</b>一个半径处，到地心的距离是 2<i>R</i><sub>E</sub>，而 <i>g</i> = <i>GM</i>/<i>r</i>² 按 1/<i>r</i>² 减小：</p><div class="eq"><i>g</i>′ = ${f(M.EARTH.g)} / 2² = ${p3(G7)} m/s²</div><p>直接减半是把引力当成了按 1/<i>r</i> 变化。</p>` },
  ],
  8: [
    { q: '卫星 B 的轨道半径是卫星 A 的两倍（绕同一行星的圆轨道）。B 的周期是 A 的几倍？',
      choices: [`${p3(Math.SQRT2)}`, `${p3(2)}`, `${p3(4)}`, `${p3(2 ** 1.5)}`], answer: 3,
      why: `<p>由开普勒第三定律，<i>T</i>² ∝ <i>r</i>³，所以 <i>T</i> ∝ <i>r</i><sup>3/2</sup>：2<sup>3/2</sup> = ${p3(2 ** 1.5)}。（对照表中 2 <i>R</i><sub>E</sub> 和 4 <i>R</i><sub>E</sub>：${f(M.orbitT(M.SAT.r1) / 3600)} h 和 ${f(M.orbitT(M.SAT.r2) / 3600)} h。）</p>` },
    { q: `卫星在半径 3 <i>R</i><sub>E</sub> 的圆轨道上运动得多快？（<i>GM</i><sub>E</sub> = ${f(GM / 1e14)} × 10<sup>14</sup> m³/s²，<i>R</i><sub>E</sub> = ${f(RE / 1e6)} × 10<sup>6</sup> m）`,
      choices: [`${p3(Math.sqrt(GM / RE) / 3 / 1000)} km/s`, `${p3(Math.sqrt(2 * GM / (3 * RE)) / 1000)} km/s`, `${p3(V8 / 1000)} km/s`, `${p3(Math.sqrt(GM / RE) / 1000)} km/s`], answer: 2,
      why: `<p>万有引力提供向心力：<i>GMm</i>/<i>r</i>² = <i>mv</i>²/<i>r</i>，所以</p><div class="eq"><i>v</i> = √(<i>GM</i>/<i>r</i>) = √(${f(GM / 1e14)} × 10<sup>14</sup> / ${f(3 * RE / 1e7, 3)} × 10<sup>7</sup>) = ${p3(V8 / 1000)} km/s</div><p><i>v</i> ∝ 1/√<i>r</i>，而不是 1/<i>r</i>；带 √2 的那个是逃逸速度。</p>` },
  ],
  9: [
    { q: `卫星的轨道从近地点 2 <i>R</i><sub>E</sub> 延伸到远地点 4 <i>R</i><sub>E</sub>。它在近地点的速率为 ${f(VP9 / 1000)} km/s。在远地点速率多大？`,
      choices: [`${p3(VP9 * (RP9 / RA9) ** 2 / 1000)} km/s`, `${p3(VA9 / 1000)} km/s`, `${p3(VP9 * Math.sqrt(RP9 / RA9) / 1000)} km/s`, `${p3(2 * VP9 / 1000)} km/s`], answer: 1,
      why: `<p>卫星对地心的角动量守恒（万有引力对地心没有力矩），而在两端 <i>v</i> ⟂ <i>r</i>：</p><div class="eq"><i>r</i><sub>p</sub><i>v</i><sub>p</sub> = <i>r</i><sub>a</sub><i>v</i><sub>a</sub> &nbsp;→ <i>v</i><sub>a</sub> = ${f(VP9 / 1000)} × 2/4 = ${p3(VA9 / 1000)} km/s</div><p>按 √(<i>GM</i>/<i>r</i>) 换算（${p3(VP9 * Math.sqrt(RP9 / RA9) / 1000)} km/s）只适用于<b>圆</b>轨道之间的比较。</p>` },
    { q: '对于椭圆轨道上的卫星，下列哪个量在近地点和远地点相同？',
      choices: ['速率', '动能', '对地心的角动量', '它受到的万有引力'], answer: 2,
      why: `<p>万有引力指向地心，对地心不产生力矩，所以 <i>L</i> = <i>mvr</i><sub>⊥</sub> 保持不变。速率和动能在近地点最大；引力在那里也最大（<i>r</i> 更小）。</p>` },
  ],
  10: [
    { q: `本页轨道上 ${m} kg 的卫星在近地点 <i>K</i> = ${GJ(KP)} GJ，<i>U</i> = ${GJ(UP)} GJ。在远地点 <i>U</i> = ${GJ(UA)} GJ。远地点的 <i>K</i> 是多少？`,
      choices: [`${p3(KP / 1e9)} GJ`, `${p3(KP / 3 / 1e9)} GJ`, `${p3(KA / 1e9)} GJ`, `${p3((KP - UP + UA) / 1e9)} GJ`], answer: 2,
      why: `<p>只有万有引力做功，且它是保守力，所以两端的 <i>K</i> + <i>U</i> 相同：</p><div class="eq"><i>K</i><sub>a</sub> = <i>K</i><sub>p</sub> + <i>U</i><sub>p</sub> − <i>U</i><sub>a</sub> = ${GJ(KP)} + (${GJ(UP)}) − (${GJ(UA)}) = ${p3(KA / 1e9)} GJ</div><p>验算：速率是三分之一，所以动能是九分之一。${p3((KP - UP + UA) / 1e9)} GJ 来自负的 <i>U</i> 的符号弄错了。</p>` },
    { q: '卫星从近地点向远地点爬升时，卫星–地球系统的各种能量如何变化？',
      choices: ['K 减小，U 增大（负得更少），E 不变', 'K 减小，U 减小，E 减小', 'K 不变，U 增大，E 增大', 'K 和 U 都增大，所以 E 增大'], answer: 0,
      why: `<p>向外爬升时，引力有一个与 <i>v</i> 相反的分量，做负功，所以 <i>K</i> 减小。<i>U</i> = −<i>GMm</i>/<i>r</i> 向零增大同样的量。没有外力做功，所以 <i>E</i> = <i>K</i> + <i>U</i> 恒定。</p>` },
  ],
  11: [
    { q: `${m} kg 的卫星从 <i>r</i> = 4 <i>R</i><sub>E</sub> 落到 2 <i>R</i><sub>E</sub>，万有引力对它做了多少功？（<i>GM</i><sub>E</sub> = ${f(GM / 1e14)} × 10<sup>14</sup> m³/s²）`,
      choices: [`${p3(-W11 / 1e9)} GJ`, `${p3(W11 / 1e9)} GJ`, `${p3(m * G * 2 * RE / 1e9)} GJ`, `${p3(2 * W11 / 1e9)} GJ`], answer: 1,
      why: `<p>力随 <i>r</i> 变化，所以要积分。引力指向内，<i>F</i><sub>r</sub> = −<i>GMm</i>/<i>r</i>²：</p><div class="eq"><i>W</i> = ∫<sub>4<i>R</i></sub><sup>2<i>R</i></sup> (−<i>GMm</i>/<i>r</i>²) d<i>r</i> = <i>GMm</i>[1/<i>r</i>]<sub>4<i>R</i></sub><sup>2<i>R</i></sup> = <i>GMm</i>/4<i>R</i> = ${p3(W11 / 1e9)} GJ</div><p>为正：力和位移都指向内。用 <i>mgh</i>、取 <i>h</i> = 2<i>R</i><sub>E</sub>（${p3(m * G * 2 * RE / 1e9)} GJ），是假定 <i>g</i> 一路都保持 ${f(G)} m/s²。</p>` },
    { q: `求把 ${m} kg 的物体从地面升到 <i>h</i> = ${f(H11 / 1000, 0)} km 时势能变化的精确值，与 <i>mgh</i> 比较，并证明两者的相对差约为 <i>h</i>/<i>R</i><sub>E</sub>。`,
      solution: `<p>1. Δ<i>U</i> = −∫<sub><i>R</i></sub><sup><i>R</i>+<i>h</i></sup> <i>F</i><sub>r</sub> d<i>r</i> = ∫<sub><i>R</i></sub><sup><i>R</i>+<i>h</i></sup> <i>GMm</i>/<i>r</i>² d<i>r</i> = <i>GMm</i>(1/<i>R</i> − 1/(<i>R</i> + <i>h</i>)) = <i>GMmh</i> / [<i>R</i>(<i>R</i> + <i>h</i>)]。</p><div class="eq">Δ<i>U</i> = ${f(DU11 / 1e9, 4)} GJ</div><p>2. 取 <i>g</i> = <i>GM</i>/<i>R</i>² = ${f(M.EARTH.g)} m/s²：<i>mgh</i> = <i>GMmh</i>/<i>R</i>² = ${f(MGH11 / 1e9, 4)} GJ。</p><p>3. 比值：<i>mgh</i>/Δ<i>U</i> = (<i>R</i> + <i>h</i>)/<i>R</i> = 1 + <i>h</i>/<i>R</i> = 1 + ${f(H11 / 1000, 0)}/${f(RE / 1000, 0)} = ${f(MGH11 / DU11, 4)}。所以 <i>mgh</i> 偏大 ${f(100 * (MGH11 / DU11 - 1), 1)}%，因为它一路都把 <i>g</i> 保持为地面上的值。</p>` },
  ],
  12: [
    { q: `距地心 4 <i>R</i><sub>E</sub> 处的逃逸速度是多少？（<i>GM</i><sub>E</sub> = ${f(GM / 1e14)} × 10<sup>14</sup> m³/s²，<i>R</i><sub>E</sub> = ${f(RE / 1e6)} × 10<sup>6</sup> m）`,
      choices: [`${p3(M.orbitV(4 * RE) / 1000)} km/s`, `${p3(VE12 / 1000)} km/s`, `${p3(M.vEsc(RE) / 4 / 1000)} km/s`, `${p3(2 * M.orbitV(4 * RE) / 1000)} km/s`], answer: 1,
      why: `<p>恰好到达无穷远处，需要 <i>E</i> = ½<i>mv</i>² − <i>GMm</i>/<i>r</i> = 0：</p><div class="eq"><i>v</i><sub>esc</sub> = √(2<i>GM</i>/<i>r</i>) = √(2 × ${f(GM / 1e14)} × 10<sup>14</sup> / ${f(4 * RE / 1e7, 3)} × 10<sup>7</sup>) = ${p3(VE12 / 1000)} km/s</div><p>它是该处圆轨道速率（${p3(M.orbitV(4 * RE) / 1000)} km/s）的 √2 倍，而不是 2 倍；它按 1/√<i>r</i> 变化，而不是 1/<i>r</i>。</p>` },
    { q: `${m} kg 的卫星在 <i>r</i> = 2 <i>R</i><sub>E</sub> 的圆轨道上。证明 <i>K</i> = −<i>U</i>/2，再求使它逃逸至少需要增加的能量，以及沿运动方向一次点火所需的速度增量。`,
      solution: `<p>1. 圆轨道：<i>GMm</i>/<i>r</i>² = <i>mv</i>²/<i>r</i>，所以 <i>K</i> = ½<i>mv</i>² = <i>GMm</i>/2<i>r</i> = −<i>U</i>/2，<i>E</i> = <i>K</i> + <i>U</i> = −<i>GMm</i>/2<i>r</i>。</p><div class="eq"><i>E</i> = −${f(GM / 1e14)} × 10<sup>14</sup> × ${m} / (2 × ${f(R12 / 1e7, 3)} × 10<sup>7</sup>) = ${GJ(M.circE(R12))} GJ</div><p>2. 逃逸需要 <i>E</i> ≥ 0（等价地说，要有足够的 <i>K</i> 来克服引力做功 ∫<sub><i>r</i></sub><sup>∞</sup> <i>GMm</i>/<i>r</i>′² d<i>r</i>′ = <i>GMm</i>/<i>r</i>）。所以至少要增加 ${GJ(-M.circE(R12))} GJ。</p><p>3. 速率：<i>v</i><sub>c</sub> = √(<i>GM</i>/<i>r</i>) = ${f(M.orbitV(R12) / 1000)} km/s，<i>v</i><sub>esc</sub> = √(2<i>GM</i>/<i>r</i>) = ${f(M.vEsc(R12) / 1000)} km/s，所以要沿 <i>v</i> 方向增加 ${f((M.vEsc(R12) - M.orbitV(R12)) / 1000)} km/s。</p>` },
  ],
};
