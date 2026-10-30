// AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from model.js; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const p3 = x => (x < 0 ? '−' : '') + (Math.abs(x) >= 1000 ? Math.abs(x).toFixed(0) : Math.abs(x).toPrecision(3));   // 3 significant figures
const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const G = M.G, RHO = M.RHO;
const AL = M.MATERIALS.find(m => m.key === 'al'), ICEM = M.MATERIALS.find(m => m.key === 'ice');
const BU = M.BUOY, PA = M.PASCAL, FL = M.FLOW, BE = M.BERN, TK = M.TANK;
const eq = s => `<div class="eq">${s}</div>`;

// 0 · a 5.0 cm ice cube
const S0 = 0.05, M0 = ICEM.rho * S0 ** 3;
// 1 · standing on one shoe
const A1 = M.SHOE.w * M.SHOE.l, P1 = M.PERSON.W / A1;
// 2 · the lake floor
const D2 = M.LAKE.depth, P2 = M.pAt(D2);
// 3 · a car lift: pistons of radius 2.0 cm and 10.0 cm, a 12 000 N car
const R3a = 0.020, R3b = 0.100, W3 = 12000, F3 = W3 * (R3a / R3b) ** 2;
const D3 = PA.stroke * PA.A1 / PA.A2;
// 4 · the cube all the way under
const T4 = BU.W - BU.Fb;
// 5 · wood in sea water; the steel ball on the floor
const FR5 = M.WOOD.rho / M.RHO_SEA, N5 = M.BALL.W - M.BALL.Fb;
// 6 · narrowing to 10 cm radius; filling a 1000 L tank from the wide part
const R6 = 0.10, V6 = FL.v1 * (FL.r1 / R6) ** 2, T6 = 1.0 / FL.Q;
// 7 · Bernoulli at the three points
const [B1, B2, B3] = BE.pts;
// 8 · the jet when the water is 0.60 m above the hole
const H8 = 0.60, X8 = 2 * Math.sqrt(H8 * TK.yh);
const kPa = (x, n = 1) => `${(x / 1000).toFixed(n)} kPa`;

export const PRACTICE = {
  0: [
    { q: `把一个边长 10 cm 的铝立方体（ρ = ${AL.rho} kg/m³）切成八个相同的小立方体。每个小立方体的密度是`,
      choices: [`${AL.rho / 8} kg/m³`, `${AL.rho / 2} kg/m³`, `${AL.rho} kg/m³`, `${AL.rho * 8} kg/m³`], answer: 2,
      why: `<p>每一块的质量和体积都是原来的 ⅛，所以 ρ = m/V 不变。密度属于材料，而不属于物体。</p>` },
    { q: `边长 ${f(S0 * 100, 1)} cm 的冰块质量是多少？（ρ<sub>ice</sub> = ${ICEM.rho} kg/m³）`,
      choices: [`${p3(ICEM.mass / 2)} kg`, `${p3(M0)} kg`, `${p3(ICEM.mass / 4)} kg`, `${p3(ICEM.rho * (S0 * 10) ** 3)} kg`], answer: 1,
      why: `<p>先换算成米：V = (${f(S0, 2)} m)³ = ${f(S0 ** 3 * 1e4, 2)} × 10<sup>−4</sup> m³。</p>${eq(`m = ρV = ${ICEM.rho} × ${f(S0 ** 3 * 1e4, 2)} × 10<sup>−4</sup> = ${p3(M0)} kg`)}<p>边长减半，体积变为 ⅛ 而不是 ½：10 cm 立方体的 ${f(ICEM.mass, 3)} kg 变为 ${p3(M0)} kg。</p>` },
  ],
  1: [
    { q: `${M.PERSON.m} kg 的人用<b>一只</b>鞋（鞋底 ${f(M.SHOE.w * 100, 0)} cm × ${f(M.SHOE.l * 100, 0)} cm）站在雪地上。对雪地的压强是`,
      choices: [`${kPa(M.P_SHOE)}`, `${kPa(M.PERSON.m / A1, 2)}`, `${kPa(2 * P1)}`, `${kPa(P1)}`], answer: 3,
      why: `${eq(`P = F/A = mg / A = ${f(M.PERSON.W, 0)} N / ${f(A1, 3)} m² = ${kPa(P1)}`)}<p>面积是两只鞋的一半，所以压强是两只鞋时 ${kPa(M.P_SHOE)} 的两倍。${kPa(M.PERSON.m / A1, 2)} 是用质量而不是重力除以面积。</p>` },
    { q: `你用 ${M.NAIL.F} N 的力按住 1 cm² 的钉帽把钉子压进木头，钉子没有加速。与拇指对钉帽相比，钉尖对木头施加的`,
      choices: ['力相同，压强也相同', '力更大，压强也更大', '力相同，压强大得多', '力更小，压强更大'], answer: 2,
      why: `<p>钉子处于平衡（且质量几乎为零），所以木头以同样的 ${M.NAIL.F} N 推回。钉尖的面积小 200 倍，所以压强大 200 倍：${f(M.NAIL.F / M.NAIL.tip / 1e6, 0)} MPa 对 ${f(M.NAIL.F / M.NAIL.head / 1e3, 0)} kPa。</p>` },
  ],
  2: [
    { q: `${D2} m 深的湖底的绝对压强是多少？（<i>P</i><sub>0</sub> = ${kPa(M.P0)}）`,
      choices: [`${kPa(M.gauge(D2))}`, `${kPa(P2)}`, `${kPa(M.P0)}`, `${kPa(2 * M.P0)}`], answer: 1,
      why: `${eq(`<i>P</i> = <i>P</i><sub>0</sub> + ρ<i>gh</i> = ${kPa(M.P0)} + ${RHO} × ${f(G)} × ${D2} = ${kPa(M.P0)} + ${kPa(M.gauge(D2))} = ${kPa(P2)}`)}<p>${kPa(M.gauge(D2))} 是表压：它漏掉了水面上的大气压。</p>` },
    { q: '一个细高的花瓶、一个宽碗和一个上窄下宽的锥形容器装水到相同深度。底部的压强',
      choices: ['宽碗中最大，因为它装的水最多', '锥形容器中最大，因为水被挤在里面', '细花瓶中最大', '三者相同'], answer: 3,
      why: '<p><i>P</i> = <i>P</i><sub>0</sub> + ρ<i>gh</i> 只取决于开口水面以下的深度，与容器形状和水的多少无关。重力的差别由器壁承担。</p>' },
  ],
  3: [
    { q: `汽车举升机两个活塞的半径分别为 ${f(R3a * 100, 1)} cm 和 ${f(R3b * 100, 1)} cm。要在大活塞上托住 ${W3} N 的汽车，小活塞上需要施加多大的力？`,
      choices: [`${p3(W3 * R3a / R3b)} N`, `${p3(F3)} N`, `${p3(W3)} N`, `${p3(W3 * (R3b / R3a) ** 2)} N`], answer: 1,
      why: `<p>两个活塞受到同样的 Δ<i>P</i>，所以 <i>F</i><sub>1</sub>/<i>A</i><sub>1</sub> = <i>F</i><sub>2</sub>/<i>A</i><sub>2</sub>，而面积与 r² 成正比：</p>${eq(`<i>F</i><sub>1</sub> = ${W3} × (${f(R3a * 100, 1)} / ${f(R3b * 100, 1)})² = ${p3(F3)} N`)}<p>${p3(W3 * R3a / R3b)} N 用的是半径之比而不是面积之比。</p>` },
    { q: `本页的液压机中，小活塞（${f(PA.A1 * 1e4, 0)} cm²）被压下 ${f(PA.stroke * 100, 0)} cm。大活塞（${f(PA.A2 * 1e4, 0)} cm²）升高多少？`,
      choices: [`${p3(PA.stroke * 100 * PA.r1 / PA.r2)} cm`, `${p3(PA.stroke * 100)} cm`, `${p3(PA.stroke * 100 * PA.A2 / PA.A1)} cm`, `${p3(D3 * 100)} cm`], answer: 3,
      why: `<p>水不可压缩，压下去多少体积就升起多少：<i>A</i><sub>1</sub><i>d</i><sub>1</sub> = <i>A</i><sub>2</sub><i>d</i><sub>2</sub>。</p>${eq(`<i>d</i><sub>2</sub> = ${f(PA.stroke * 100, 0)} cm × ${f(PA.A1 * 1e4, 0)} / ${f(PA.A2 * 1e4, 0)} = ${p3(D3 * 100)} cm`)}<p>力是十六倍，距离是十六分之一：输入功等于输出功。</p>` },
  ],
  4: [
    { q: `${f(BU.s * 100, 0)} cm 的铝立方体（W = ${f(BU.W, 0)} N）用细绳吊着，完全浸没在水中。绳的拉力是`,
      choices: [`${p3(BU.W)} N`, `${p3(BU.Fb)} N`, `${p3(BU.W + BU.Fb)} N`, `${p3(T4)} N`], answer: 3,
      why: `${eq(`<i>F</i><sub>b</sub> = ρ<sub>water</sub><i>Vg</i> = ${RHO} × ${f(BU.V, 3)} × ${f(G)} = ${f(BU.Fb, 0)} N`)}${eq(`<i>T</i> = <i>W</i> − <i>F</i><sub>b</sub> = ${f(BU.W, 0)} − ${f(BU.Fb, 0)} = ${p3(T4)} N`)}<p>浮力用的是<b>水</b>的密度，不是铝的密度；${p3(BU.Fb)} N 是浮力，不是拉力。</p>` },
    { q: '立方体完全浸没后，再继续往深处放。它受到的浮力',
      choices: ['增大，因为越深压强越大', '减小，因为它上方的水更多', '不变', '增大，直到等于重力'], answer: 2,
      why: '<p>更深处，顶面和底面的压强都增加同样的 ρgΔh。两者之差 ρgs，因而 <i>F</i><sub>b</sub> = ρ<i>Vg</i>，都不变。（水视为不可压缩。）</p>' },
  ],
  5: [
    { q: `${M.WOOD.rho} kg/m³ 的木块漂浮在海水（${M.RHO_SEA} kg/m³）中，而不是淡水中。它有多大比例在水下？`,
      choices: [`${f(100 * M.WOOD.rho / RHO, 1)}%`, `${f(100 * (1 - FR5), 1)}%`, `${f(100 * FR5, 1)}%`, `${f(100 * (1 - M.WOOD.rho / RHO), 1)}%`], answer: 2,
      why: `<p>漂浮时 <i>F</i><sub>b</sub> = <i>W</i>：ρ<sub>sea</sub><i>V</i><sub>under</sub><i>g</i> = ρ<sub>wood</sub><i>Vg</i>。</p>${eq(`<i>V</i><sub>under</sub>/<i>V</i> = ${M.WOOD.rho} / ${M.RHO_SEA} = ${f(100 * FR5, 1)}%`)}<p>密度更大的水用更小的体积就能托住它，所以比在淡水中的 ${f(100 * M.WOOD.rho / RHO, 1)}% 略少。${f(100 * (1 - FR5), 1)}% 是露出水面的部分。</p>` },
    { q: `钢球（半径 ${f(M.BALL.r, 2)} m，ρ = ${M.BALL.rho} kg/m³）静止在水池底部。池底对它向上的支持力是`,
      choices: [`${p3(M.BALL.W)} N`, `${p3(N5)} N`, `${p3(M.BALL.Fb)} N`, `${p3(M.BALL.W + M.BALL.Fb)} N`], answer: 1,
      why: `${eq(`V = ⁴⁄₃πr³ = ${f(M.BALL.V, 4)} m³, W = ρ<sub>steel</sub>Vg = ${f(M.BALL.W, 0)} N, <i>F</i><sub>b</sub> = ρ<sub>water</sub>Vg = ${f(M.BALL.Fb, 0)} N`)}${eq(`<i>F</i><sub>N</sub> = W − <i>F</i><sub>b</sub> = ${p3(N5)} N`)}<p>水对沉底的球仍有向上的浮力；池底只承担剩下的部分。</p>` },
  ],
  6: [
    { q: `半径 ${f(FL.r1 * 100, 0)} cm 的管中流速为 ${f(FL.v1, 1)} m/s 的水流入半径 ${f(R6 * 100, 0)} cm 的一段。水在那里的流速是`,
      choices: [`${p3(FL.v1 * FL.r1 / R6)} m/s`, `${p3(V6)} m/s`, `${p3(FL.v1 * (R6 / FL.r1) ** 2)} m/s`, `${p3(FL.v1 * R6 / FL.r1)} m/s`], answer: 1,
      why: `${eq(`<i>A</i><sub>1</sub><i>v</i><sub>1</sub> = <i>A</i><sub>2</sub><i>v</i><sub>2</sub> → <i>v</i><sub>2</sub> = <i>v</i><sub>1</sub>(r<sub>1</sub>/r<sub>2</sub>)² = ${f(FL.v1, 1)} × 3² = ${p3(V6)} m/s`)}<p>面积与 r² 成正比，所以半径变为三分之一，面积变为九分之一。${p3(FL.v1 * FL.r1 / R6)} m/s 用的是半径之比。</p>` },
    { q: `粗管（半径 ${f(FL.r1 * 100, 0)} cm，流速 ${f(FL.v1, 1)} m/s）注满一个 1000 L 的水箱需要多长时间？`,
      choices: [`${p3(1.0 / (Math.PI * (2 * FL.r1) ** 2 * FL.v1))} s`, `${p3(1.0 / (2 * Math.PI * FL.r1 * FL.v1))} s`, `${p3(T6)} s`, `${p3(1.0 / (FL.r1 ** 2 * FL.v1))} s`], answer: 2,
      why: `${eq(`<i>Q</i> = <i>Av</i> = π(${f(FL.r1, 2)})² × ${f(FL.v1, 1)} = ${f(FL.Q, 4)} m³/s`)}${eq(`t = V/Q = 1.000 m³ / ${f(FL.Q, 4)} m³/s = ${p3(T6)} s`)}<p>1000 L 就是 1 m³。把 60 cm 的直径当成半径，面积会大四倍。</p>` },
  ],
  7: [
    { q: `本页的管子中，粗段水流速度 ${f(B1.v, 1)} m/s、表压 ${kPa(B1.P, 0)}，在同一高度的细段加速到 ${f(B2.v, 1)} m/s。细段的表压是`,
      choices: [`${kPa(B1.P + (B2.P - B1.P) * -1, 0)}`, `${kPa(B1.P, 0)}`, `${kPa(B1.P * B1.v / B2.v, 1)}`, `${kPa(B2.P, 0)}`], answer: 3,
      why: `${eq(`<i>P</i><sub>2</sub> = <i>P</i><sub>1</sub> + ½ρ(<i>v</i><sub>1</sub>² − <i>v</i><sub>2</sub>²) = ${kPa(B1.P, 0)} + ½ × ${RHO} × (${f(B1.v, 0)}² − ${f(B2.v, 0)}²) = ${kPa(B2.P, 0)}`)}<p>流速大，压强小。${kPa(B1.P + (B2.P - B1.P) * -1, 0)} 把符号弄反了：水之所以加速，是因为它后方的压强更高。</p>` },
    { q: `流速回到 ${f(B3.v, 1)} m/s 后，管子又升高 ${f(BE.H, 1)} m。高处粗段的表压是`,
      choices: [`${kPa(B1.P + RHO * G * BE.H)}`, `${kPa(B3.P)}`, `${kPa(B1.P)}`, `${kPa(B1.P - 2 * RHO * G * BE.H)}`], answer: 1,
      why: `<p>流速与点 1 相同，所以 ½ρv² 项相互抵消：</p>${eq(`<i>P</i><sub>3</sub> = <i>P</i><sub>1</sub> − ρ<i>g</i>Δy = ${kPa(B1.P, 0)} − ${RHO} × ${f(G)} × ${f(BE.H, 1)} = ${kPa(B3.P)}`)}<p>把水抬高要消耗压强，正如潜得更深压强会增加。</p>` },
  ],
  8: [
    { q: '小孔上方的水位升高到原来的四倍。射流离开小孔的速度',
      choices: ['不变', `是原来的 √2 倍`, '是原来的两倍', '是原来的四倍'], answer: 2,
      why: '<p><i>v</i> = √(2<i>gh</i>)：<i>h</i> 变为四倍，速度变为 √4 = 2 倍，与石块从四倍高度落下一样。</p>' },
    { q: `小孔在地面上方 ${f(TK.yh, 2)} m 处。当小孔上方的水深为 ${f(H8, 2)} m 时，射流落在离水箱多远处？`,
      choices: [`${p3(Math.sqrt(H8 * TK.yh))} m`, `${p3(X8)} m`, `${p3(M.jetRange(TK.h0))} m`, `${p3(Math.sqrt(2 * H8 * TK.yh))} m`], answer: 1,
      why: `${eq(`<i>v</i> = √(2 × ${f(G)} × ${f(H8, 2)}) = ${f(M.torricelli(H8))} m/s, t = √(2 × ${f(TK.yh, 2)} / ${f(G)}) = ${f(M.jetFlight, 3)} s`)}${eq(`x = vt = 2√(h y<sub>hole</sub>) = ${p3(X8)} m`)}<p>${p3(M.jetRange(TK.h0))} m 是水箱满（${f(TK.h0, 1)} m）时的射程，不是现在的。</p>` },
  ],
};
