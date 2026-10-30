// Chapter 13, page by page (after the AP Physics C E&M organizer, Units 5 and 6). Text and a chart
// on the left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, HS, MAG, SPEEDUP, LEN_SCALE, K_DOT } from './world.js';

const f = (x, n = 2) => (x < -1e-12 ? '−' : '') + Math.abs(x).toFixed(n);
const sci = (x, n = 2) => { const e = Math.floor(Math.log10(Math.abs(x))); return `${(x / 10 ** e).toFixed(n)} × 10<sup>${e < 0 ? '−' : ''}${Math.abs(e)}</sup>`; };
const heightNote = `高度：每格 ${f(1 / HS, 0)} V。`;

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], vlines = [], cursors = [], label }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(Math.min(Math.max(y, y0), y1)).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const vl = vlines.map(([x, t]) => `<line class="grid" x1="${sx(x)}" x2="${sx(x)}" y1="${P.t}" y2="${H - P.b}"/><text class="ax" x="${sx(x)}" y="${H - 9}" text-anchor="middle">${t}</text>`).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const cs = cursors.map(c => `<circle class="cursor" r="4.5" cx="-20" cy="-20" data-cursor="${c}"/>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${vl}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2 + 40}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cs}
  </svg>`;
}
const curve = (fn, a, b, n = 120) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });
// chart ranges, shared with main.js for the live cursors
export const R = {
  drude: { x0: 0, x1: 4, y0: 0, y1: 2.4 },
  res: { x0: 0, x1: 2, y0: 0, y1: 12 },
  energy: { x0: 0, x1: M.BULB.run, y0: 0, y1: 60 },
  term: { x0: 0, x1: 6, y0: 0, y1: 12 },
  pload: { x0: 0, x1: 8, y0: 0, y1: 20 },
  rc: { x0: 0, x1: M.RC.cycle, y0: -100, y1: 100 },
};

const { CU, RC } = M;
const ohmI = M.OHM.E / M.OHM.R, bulbI = M.BULB.E / M.BULB.R, bulbP = bulbI * M.BULB.E;
const kr = M.solve(M.KIRCH.edges, 'bl'), kI = n => M.edgeI(M.KIRCH, kr, n), kd = M.solve(M.kirchEdges(false), 'bl');

export const PAGES = [
  {
    kicker: '第 13 章', title: '电流', sub: '运动着的电荷',
    body: `
      <p class="lede">电池使两个电极之间保持恒定的电势差。用导线把两极连起来，金属内部的电场就推动其中的自由电荷定向移动：这就是<b>电流</b>。</p>
      <div class="eq"><i>I</i> = d<i>q</i>/d<i>t</i> = <i>nqAv</i><sub>d</sub>,  <i>J</i> = <i>I</i>/<i>A</i> = <i>nqv</i><sub>d</sub> = σ<i>E</i></div>
      <p>1 A = 1 C/s，按<i>正</i>电荷移动的方向计；电子朝相反方向漂移。长为 Δ<i>x</i> = <i>v</i><sub>d</sub>Δ<i>t</i> 的一段导线含电荷 <i>nqA</i>Δ<i>x</i>，它们在 Δ<i>t</i> 内全部穿过截面 <i>A</i>。一般地，<i>I</i> = ∫<b>J</b>·d<b>A</b>。</p>
      <table class="data">
        <tr><td>1 mm² 铜导线中通 1 A：<i>n</i></td><td>${sci(CU.n, 1)} m⁻³</td></tr>
        <tr><td>漂移速度 <i>v</i><sub>d</sub></td><td>${f(CU.vd * 1e3, 3)} mm/s</td></tr>
      </table>
      <p>每个电子加速、撞上离子、停下、再出发（德鲁德模型），平均速度为 <i>v</i><sub>d</sub>：每走 1 米要 ${f(CU.hours, 1)} h。可灯一接通就亮，因为电场沿导线飞速传播。</p>
      <div class="charts">${chart({ ...R.drude, xlabel: '时间（碰撞次数）', ylabel: '单个电子的速率 / v_d', cursors: ['drude'], label: '单个电子的锯齿形速率，平均值为漂移速度',
        series: [{ pts: curve(t => M.drudeV(t, 1, 1), 0, 3.999, 400) }, { cls: 'trend', pts: [[0, 1], [4, 1]], tag: [3.25, 1, 'v_d'] }] })}</div>
      <p class="hintline">点击导线，看看哪一段会穿过 <i>A</i>。图中尺寸放大到实物的 ${MAG}×；漂移比实际快 ${SPEEDUP}×。</p>`,
    cam: { target: [STATIONS.wire, 0.95, 0], az: -16, el: 14, dist: 21 }, lit: 'wire', scene: 'wire', look: {},
    fig: '电子逆着电流方向漂移',
  },
  {
    kicker: '13.1', title: '电阻', sub: '越长越细，阻碍越大',
    body: `
      <p class="lede"><b>电阻</b> <i>R</i> = Δ<i>V</i>/<i>I</i>，单位为欧姆（V/A），表示让电流通过一个物体有多难。</p>
      <div class="eq"><i>R</i> = ρ<i>L</i>/<i>A</i> = <i>L</i>/σ<i>A</i></div>
      <p>材料决定<b>电阻率</b> ρ = 1/σ（铜 ${sci(M.RHO.copper, 2)}，镍铬合金 ${sci(M.RHO.nichrome, 2)} Ω·m）；形状决定 <i>L</i>/<i>A</i>。长度加倍：相当于两段串联，<i>R</i> 加倍。直径加倍：相当于四根细线并排，<i>R</i> 变为四分之一。</p>
      <p>两根镍铬合金导线，直径分别为 ${f(M.RES.dThin * 1e3, 1)} mm 和 ${f(M.RES.dThick * 1e3, 1)} mm，两端都加 1.5 V。两者中载流子漂移得一样快（<i>E</i> = Δ<i>V</i>/<i>L</i> 相同）；粗的那根载流子数是细的四倍。</p>
      <div class="charts">${chart({ ...R.res, xlabel: '长度 L（m）', ylabel: 'R (Ω)', cursors: ['thin', 'thick'], label: '两种直径导线的电阻随长度的变化',
        series: [{ pts: curve(M.rThin, 0, 2, 4), tag: [1.15, M.rThin(1.15), 'd'] }, { pts: curve(M.rThick, 0, 2, 4), tag: [1.5, M.rThick(1.5), '2d'] }] })}</div>
      <p class="hintline">点击，把粗导线拆成四根。长度按每米 ${LEN_SCALE * 100} cm 绘制；粗细经过放大。</p>`,
    cam: { target: [STATIONS.resist - 0.5, 0.35, 0], az: -14, el: 30, dist: 15 }, lit: 'wires', scene: 'wires', look: {},
    fig: '同样 1.5 V，不同形状',
  },
  {
    kicker: '13.2', title: '欧姆定律', sub: 'V = IR',
    body: `
      <p class="lede">对欧姆导体，电流与其两端电压成正比；电压与电流之比就是它的电阻。</p>
      <p>从金属中的欧姆定律 <i>J</i> = σ<i>E</i> 出发，沿导线 <i>E</i> = Δ<i>V</i>/<i>L</i>：</p>
      <div class="eq"><i>I</i> = <i>JA</i> = σ<i>A</i>Δ<i>V</i>/<i>L</i>  ⟹  Δ<i>V</i> = <i>IR</i></div>
      <p>${M.OHM.E} V 加在 ${M.OHM.R} Ω 上，产生 ${f(ohmI, 1)} A 的电流。图中每一点都画在其电势对应的高度上：电池把电荷抬高 ${M.OHM.E} V，理想导线保持水平，电阻是一段下坡。顺着电流方向通过电阻，电势<i>降低</i>。</p>
      <div class="charts">${chart({ x0: 0, x1: 9, y0: 0, y1: 3, xlabel: 'ΔV (V)', ylabel: 'I (A)', label: '3 Ω 电阻的电流随电压的变化：一条直线',
        series: [{ pts: [[0, 0], [9, 3]], tag: [6.6, 2.15, '斜率 1/R'] }], marks: [[M.OHM.E, ohmI, `${M.OHM.E} V, ${f(ohmI, 1)} A`, 8, 14]] })}</div>
      <p class="hintline">点击查看电阻中的电场。${heightNote}</p>`,
    cam: { target: [STATIONS.ohm, 0.8, 0.1], az: -34, el: 16, dist: 14 }, lit: 'ohm', scene: 'ohm', look: { ohm: 1 },
    fig: '经电池升高，经电阻降低',
  },
  {
    kicker: '13.3', title: '电功率', sub: 'P = IΔV',
    body: `
      <p class="lede">每库仑电荷在电池中获得 Δ<i>V</i> 焦耳的能量，在电阻中以热的形式交出；在灯泡中还以光的形式交出。</p>
      <div class="eq"><i>P</i> = d<i>U</i>/d<i>t</i> = <i>I</i>Δ<i>V</i> = <i>I</i>²<i>R</i> = Δ<i>V</i>²/<i>R</i></div>
      <p>后两式用到 Δ<i>V</i> = <i>IR</i>：已知电流时（串联）用 <i>I</i>²<i>R</i>，已知电压时（并联）用 Δ<i>V</i>²/<i>R</i>。单位：瓦特，J/s。</p>
      <table class="data">
        <tr><td><i>I</i>Δ<i>V</i></td><td>${f(bulbI, 2)} A × ${M.BULB.E} V = ${f(bulbP, 1)} W</td></tr>
        <tr><td><i>I</i>²<i>R</i></td><td>(${f(bulbI, 2)} A)² × ${M.BULB.R} Ω = ${f(bulbI ** 2 * M.BULB.R, 1)} W</td></tr>
        <tr><td>Δ<i>V</i>²/<i>R</i></td><td>(${M.BULB.E} V)² / ${M.BULB.R} Ω = ${f(M.BULB.E ** 2 / M.BULB.R, 1)} W</td></tr>
      </table>
      <p>能量 <i>E</i> = <i>Pt</i>：每 ${M.BULB.run} s 消耗 ${f(bulbP * M.BULB.run, 0)} J。</p>
      <div class="charts">${chart({ ...R.energy, xlabel: '时间（s）', ylabel: '能量（J）', cursors: ['energy'], label: '输出的能量随时间的变化：斜率为 P 的直线', series: [{ pts: [[0, 0], [M.BULB.run, bulbP * M.BULB.run]], tag: [5.2, 25, '斜率 P = 6 W'] }] })}</div>
      <p class="hintline">点击灯泡，揭开玻璃罩。</p>`,
    cam: { target: [STATIONS.power, 0.25, 0.05], az: -14, el: 42, dist: 12.5 }, lit: 'bulb', scene: 'bulb', look: {},
    fig: '6 W 的热和光',
  },
  {
    kicker: '13.4', title: '电动势', sub: '真实的电池',
    body: `
      <p class="lede"><b>电动势</b> ℰ 是电池内的化学反应给每库仑电荷提供的能量。英文名 electromotive force 里虽有 force，它却不是力。</p>
      <p>真实电池有<b>内阻</b> <i>r</i>，电流在电池内部要损失 <i>Ir</i>：</p>
      <div class="eq">Δ<i>V</i><sub>端</sub> = ℰ − <i>Ir</i>,  <i>I</i> = ℰ/(<i>R</i> + <i>r</i>)</div>
      <p>这里 ℰ = ${M.CELL.E} V，<i>r</i> = ${M.CELL.r} Ω，灯泡的 <i>R</i> 在 ${M.CELL.Rmin}–${M.CELL.Rmax} Ω 之间变化。电流越大，路端电压越低，<i>I</i>²<i>r</i> 也让电池发热。灯泡得到的功率为 ℰ²<i>R</i>/(<i>R</i> + <i>r</i>)²；在 <i>R</i> = <i>r</i> 处 d<i>P</i>/d<i>R</i> = 0，此时灯泡最亮：ℰ²/4<i>r</i> = ${f(M.CELL.E ** 2 / (4 * M.CELL.r), 0)} W。</p>
      <div class="charts">${chart({ ...R.pload, xlabel: '负载 R（Ω）', ylabel: '灯泡功率（W）', cursors: ['pload'], vlines: [[M.CELL.r, 'r']], label: '负载功率随负载电阻的变化，在 R = r 处达到峰值',
        series: [{ pts: curve(M.loadP, 0, 8) }] })}</div>
      <p class="hintline">点击电池，打开它。${heightNote}</p>`,
    cam: { target: [STATIONS.cell, 0.2, 0.05], az: -14, el: 42, dist: 14 }, lit: 'cell', scene: 'cell', look: {},
    fig: '电动势 12 V，内阻 2 Ω',
  },
  {
    kicker: '13.5', title: '串联和并联', sub: '一条路径，或并排相连',
    body: `
      <p class="lede"><b>串联</b>时电流只有一条路径，所以通过每个电阻的电流相同，各电阻的电压相加。<b>并联</b>时每条支路都跨接在同样两点之间，所以电压相同，各支路电流相加。</p>
      <div class="eq"><i>R</i><sub>s</sub> = <i>R</i><sub>1</sub> + <i>R</i><sub>2</sub>,  1/<i>R</i><sub>p</sub> = 1/<i>R</i><sub>1</sub> + 1/<i>R</i><sub>2</sub> + …</div>
      <table class="data cols">
        <tr><th>串联，9 V</th><th>并联，9 V</th></tr>
        <tr><td><i>R</i><sub>eq</sub> = 2 + 4 = 6 Ω</td><td><i>R</i><sub>eq</sub> = ${f(M.parallelR([2, 4, 6]), 3)} Ω</td></tr>
        <tr><td><i>I</i> = 9/6 = 1.5 A</td><td><i>I</i><sub>1</sub> = 9/2 = 4.5 A</td></tr>
        <tr><td>Δ<i>V</i><sub>1</sub> = 1.5 × 2 = 3 V</td><td><i>I</i><sub>2</sub> = 9/4 = 2.25 A</td></tr>
        <tr><td>Δ<i>V</i><sub>2</sub> = 1.5 × 4 = 6 V</td><td><i>I</i><sub>3</sub> = 9/6 = 1.5 A</td></tr>
        <tr><td>3 + 6 = 9 V ✓</td><td><i>I</i> = 8.25 A ✓</td></tr>
      </table>
      <p>串联的电阻越多，<i>R</i><sub>eq</sub> 越大；并联的越多，<i>R</i><sub>eq</sub> 越小，比最小的支路电阻还小。并联时，各支路电流在干路上汇合，所以小点沿干路跑得更快。</p>
      <p class="hintline">点击任一电路将其抬起。小点速度 ∝ 电流（并联中每安培对应的速度是串联中的 ${f(K_DOT.parallel / K_DOT.series, 1)}×）。</p>`,
    cam: { target: [STATIONS.sp + 0.07, 0.1, 0.1], az: -5, el: 50, dist: 20.5 }, lit: null, scene: 'sp', look: {},
    fig: '2 Ω 和 4 Ω；2、4 和 6 Ω',
  },
  {
    kicker: '13.6', title: '混联电路', sub: '先化简，再倒推',
    body: `
      <p class="lede">由串联和并联部分组成的电路，可以一步步化简为一个等效电阻。然后倒推回去，求出每个电阻的电压和电流。</p>
      <ol class="rules">
        <li>R<sub>2</sub>、R<sub>4</sub>、R<sub>5</sub> 通过同一个电流：串联，4 + 2 + 2 = ${M.COMBO.R245} Ω。</li>
        <li>R<sub>3</sub> 与这 ${M.COMBO.R245} Ω 跨接在同样两点之间：并联，1/(½ + ⅛) = ${f(M.COMBO.R2345, 1)} Ω。</li>
        <li>R<sub>1</sub> 与之串联：<i>R</i><sub>eq</sub> = 2 + ${f(M.COMBO.R2345, 1)} = ${f(M.COMBO.Req, 1)} Ω，所以 <i>I</i> = 9/${f(M.COMBO.Req, 1)} = ${f(9 / M.COMBO.Req, 1)} A。</li>
      </ol>
      <table class="data">
        <tr><th>倒推</th><th>Δ<i>V</i></th><th><i>I</i></th></tr>
        <tr><td>R<sub>1</sub></td><td>2.5 × 2 = 5 V</td><td>2.5 A</td></tr>
        <tr><td>R<sub>3</sub>（并联部分）</td><td>9 − 5 = 4 V</td><td>4/2 = 2.0 A</td></tr>
        <tr><td>R<sub>2</sub>、R<sub>4</sub>、R<sub>5</sub></td><td>2、1、1 V</td><td>4/8 = 0.5 A</td></tr>
      </table>
      <p>每一步化简得到的电路都从电池取同样的 2.5 A：这就是“等效”的含义。（参考讲义写的是 R<sub>245</sub> = 10 Ω 和 3.667 Ω；按图中标注，应为 4 + 2 + 2 = 8 Ω。）</p>
      <p class="hintline">点击完整电路（1）将其抬起。</p>`,
    cam: { target: [STATIONS.combo, 0.1, 0.15], az: -4, el: 56, dist: 27 }, lit: 'combo', scene: 'combo', look: {},
    fig: '五个电阻化为一个',
  },
  {
    kicker: '13.7', title: '基尔霍夫定律', sub: '电荷守恒，能量守恒',
    body: `
      <p class="lede">两个电池分处不同支路时，电路无法化简为一个电阻。基尔霍夫的两条定律总是适用。</p>
      <ul class="rules"><li><b>节点定律</b>（电荷守恒）：流入 = 流出。在 A 点，<i>I</i><sub>1</sub> = <i>I</i><sub>2</sub> + <i>I</i><sub>3</sub>。</li>
        <li><b>回路定律</b>（能量守恒）：沿任一回路一周 ΣΔ<i>V</i> = 0。顺着电流方向通过电阻，记 −<i>IR</i>；从电池 − 极到 + 极，记 +ℰ。</li></ul>
      <div class="eq">1:  −10<i>I</i><sub>1</sub> − 5<i>I</i><sub>2</sub> − 10<i>I</i><sub>1</sub> + 12 = 0</div>
      <div class="eq">2:  −20<i>I</i><sub>3</sub> + 6 − 20<i>I</i><sub>3</sub> + 5<i>I</i><sub>2</sub> = 0</div>
      <p>解得 <i>I</i><sub>1</sub> = ${f(kI('R1'), 2)} A，<i>I</i><sub>2</sub> = ${f(kI('R5'), 2)} A，<i>I</i><sub>3</sub> = ${f(kI('R3'), 2)} A，与参考讲义的答案一致。这要求 6 V 电池的 + 极朝下，如本图所画。讲义的图把 + 极画在上方：那样回路 2 中是 −6，<i>I</i><sub>3</sub> = ${f(kd.I[2], 3)} A，电流反向。</p>
      <p class="hintline">点击将其抬起，并沿每个回路走一圈。${heightNote}</p>`,
    cam: { target: [STATIONS.kirch, 0.3, 0.1], az: -8, el: 46, dist: 16 }, lit: 'kirch', scene: 'kirch', look: {},
    fig: 'I₁ = I₂ + I₃；沿每个回路 ΣΔV = 0',
  },
  {
    kicker: '13.8', title: 'RC 电路', sub: '充电与放电',
    body: `
      <p class="lede">开关接 <b>a</b> 时，电池通过 <i>R</i> 给电容器充电；接 <b>b</b> 时，电容器推动电流反向流过 <i>R</i>，直到电荷放完。</p>
      <div class="eq">ℰ − <i>IR</i> − <i>q</i>/<i>C</i> = 0, <i>I</i> = d<i>q</i>/d<i>t</i></div><div class="eq"><i>q</i> = ℰ<i>C</i>(1 − e<sup>−<i>t</i>/<i>RC</i></sup>)</div>
      <p>（分离变量：∫d<i>q</i>/(ℰ<i>C</i> − <i>q</i>) = ∫d<i>t</i>/<i>RC</i>。）<i>I</i> = (ℰ/<i>R</i>)e<sup>−<i>t</i>/<i>RC</i></sup>。τ = <i>RC</i> = ${f(RC.tau, 1)} s：经过一个 τ，<i>q</i> 达到 ℰ<i>C</i> = ${f(RC.Qmax * 1e3, 1)} mC 的 63.2%，<i>I</i> 降到 ℰ/<i>R</i> = ${f(RC.Imax * 1e3, 1)} mA 的 36.8%。放电时，<i>q</i> = <i>Q</i><sub>max</sub>e<sup>−<i>t</i>/<i>RC</i></sup>。</p>
      <p>电容器不带电时相当于一根导线；充满时相当于断路。电池提供的 <i>Q</i>ℰ = ${f(RC.Qmax * RC.E * 1e3, 1)} mJ 中，一半储存起来，一半变成热。</p>
      <div class="charts">${chart({ ...R.rc, xlabel: '时间（s）', ylabel: '占最大值的 %', cursors: ['rcq', 'rci'], vlines: [[RC.tau, 'τ'], [RC.Tch, 'b'], [RC.Tch + RC.tau, 'τ']],
        label: '充电和放电过程中电荷量与电流随时间的变化',
        series: [{ cls: 'zero', pts: [[0, 0], [RC.cycle, 0]] }, { pts: curve(t => 100 * M.rc(t).Q / RC.Qmax, 0, RC.cycle - 1e-6, 400), tag: [3.5, 92, 'q'] },
          { cls: 'curve total', pts: curve(t => 100 * M.rc(t).I / RC.Imax, 0, RC.cycle - 1e-6, 400), tag: [3.4, 14, 'I'] }],
        marks: [[RC.tau, 63.2, '63.2%'], [RC.tau, 36.8, '36.8%', 6, -6]] })}</div>
      <p class="hintline">点击将其抬起：Δ<i>V</i><sub>C</sub> 增大，Δ<i>V</i><sub>R</sub> 随之减小。</p>`,
    cam: { target: [STATIONS.rc, 0.25, 0.1], az: -10, el: 44, dist: 15 }, lit: 'rc', scene: 'rc', look: {},
    fig: '20 kΩ，100 µF：τ = 2.0 s',
  },
];

// ---------- click a scene: what it breaks into ----------
const vC = n => n.toFixed(2);
export const PLATES = {
  wire: { text: `蓝色薄片是从 <i>A</i> 往上游 Δ<i>x</i> = <i>v</i><sub>d</sub>Δ<i>t</i> 这一段导线。其中每个电子都会在 Δ<i>t</i> 内穿过 <i>A</i>，所以通过 <i>A</i> 的电荷量为 <i>nqA</i>Δ<i>x</i>，电流为 <i>nqAv</i><sub>d</sub>。`,
    facts: () => { const dx = 1.5 / MAG, dt = dx / CU.vd, Q = CU.n * M.E_CH * CU.A * dx; return [['薄片长度 Δx', `${f(dx * 1e3, 2)} mm（图中 1.5 个单位）`], ['穿过所需时间 Δt = Δx/v_d', `${f(dt, 1)} s`], ['其中的电荷量 nqAΔx', `${f(Q, 1)} C`], ['I = Q/Δt', `${f(Q / dt, 2)} A`], ['两次碰撞的间隔', `${f(CU.tauC * 1e15, 0)} fs`]]; } },
  wires: { text: `粗导线拆成四根细丝，每根都和那根细导线一样。四条相同的路径并排，在同样的电压下通过四倍的电流：电阻为四分之一。`,
    facts: s => { const L = M.resLength(s.clock); return [['长度 L', `${f(L)} m`], ['细线：R = ρL/A', `${f(M.rThin(L))} Ω，I ${f(1.5 / M.rThin(L))} A`], ['粗线：R/4', `${f(M.rThick(L))} Ω，I ${f(1.5 / M.rThick(L))} A`], ['ρ（镍铬合金）', `${sci(M.RES.rho, 2)} Ω·m`]]; } },
  ohm: { text: `蓝色箭头：电阻中的电场，沿斜坡向下。理想导线没有坡度，因而不需要电场：电阻为零，电压也为零。全部 ${M.OHM.E} V 都降在电阻上。`,
    facts: () => [['电池升高', `+${M.OHM.E} V`], ['导线', '0 V'], ['电阻上的电压降 IR', `−${f(ohmI * M.OHM.R, 1)} V`], ['电流', `${f(ohmI, 1)} A`], ['绕回路一周', '0 V']] },
  bulb: { text: `玻璃罩下是一圈细钨丝：一个热到发光的电阻。灯泡在电路中不过是一个 ${M.BULB.R} Ω 的电阻。`,
    facts: s => { const t = s.clock % M.BULB.run; return [['P = IΔV', `${f(bulbP, 1)} W`], ['P = I²R', `${f(bulbI ** 2 * M.BULB.R, 1)} W`], ['P = ΔV²/R', `${f(M.BULB.E ** 2 / M.BULB.R, 1)} W`], ['已消耗的能量 E = Pt', `${f(bulbP * t, 1)} J`]]; } },
  cell: { text: `内部：一个 ${M.CELL.E} V 的理想电动势与一个 ${M.CELL.r} Ω 的电阻串联。抬起后可见，电池把电荷抬高 ${M.CELL.E} V，到达电极之前内阻又拿走 <i>Ir</i>。`,
    facts: s => { const R = M.cellLoad(s.clock), I = M.cellI(R); return [['负载 R', `${f(R)} Ω`], ['电流 I = ℰ/(R + r)', `${f(I)} A`], ['内部损失 Ir', `${f(I * M.CELL.r)} V`], ['路端电压 ΔV = ℰ − Ir', `${f(M.terminalV(I))} V`], ['灯泡功率', `${f(M.loadP(R))} W`], ['内部耗散 I²r', `${f(I * I * M.CELL.r)} W`]]; } },
  series: { text: `抬起后可见，电池升高 9 V，电流依次走下两段坡：在 2 Ω 上降 3 V，在 4 Ω 上降 6 V。电阻越大，分得的电压越多。`,
    facts: () => [['R_eq', '6 Ω'], ['I（处处相同）', '1.5 A'], ['ΔV₁', '3.0 V'], ['ΔV₂', '6.0 V'], ['总和', '9.0 V']] },
  parallel: { text: `抬起后可见，左侧干路处于 9 V，右侧处于 0 V，所以每条支路都降落整整 9 V。各支路取各自的电流 ΔV/R；干路上通过的是它们的和。`,
    facts: () => [['每条支路的 ΔV', '9.0 V'], ['I₁（2 Ω）', '4.50 A'], ['I₂（4 Ω）', '2.25 A'], ['I₃（6 Ω）', '1.50 A'], ['电池', '8.25 A'], ['R_eq', `${f(M.parallelR([2, 4, 6]), 3)} Ω`]] },
  combo: { text: `抬起后可见：R<sub>1</sub> 上降 5 V，剩下的 4 V 同时分两路降完：沿 R<sub>3</sub> 一次降完，或沿 R<sub>2</sub>、R<sub>4</sub>、R<sub>5</sub> 分 2、1、1 V 三步降完。`,
    facts: () => [['R_eq', `${f(M.COMBO.Req, 1)} Ω`], ['电池电流', '2.5 A'], ['R₁ 两端', '5.0 V'], ['R₃ 两端', '4.0 V，2.0 A'], ['R₂、R₄、R₅', '2.0、1.0、1.0 V，电流 0.5 A']] },
  kirch: { text: `抬起后，每一点都处于其电势对应的高度。蓝色小球先走回路 1，再走回路 2，把每一次升高和降低累加起来。它总会回到出发时的高度：ΣΔV = 0。`,
    facts: s => [['A 点的 V', `${f(kr.V.a)} V`], ['B 点的 V', `${f(kr.V.b)} V`], ['I₁ = I₂ + I₃', `${f(kI('R1'), 3)} = ${f(kI('R5'), 3)} + ${f(kI('R3'), 3)} A`], ['正在走的回路', `${s.walk.loop}`], ['目前的 ΣΔV', `${f(s.walk.sum)} V`]] },
  rc: { text: `抬起后可见：电池升高 12 V；电阻的斜坡为 <i>IR</i>，电容器的台阶为 <i>q</i>/<i>C</i>。充电时，电阻分得的电压随电容器分得的电压增大而减小；两者之和始终为 12 V。放电时，电池被断开，电容器的台阶推动电流反向流动。`,
    facts: s => { const r = s.rc; return [['开关', r.charging ? 'a：充电' : 'b：放电'], ['切换后的时间 t', `${f(r.s, 1)} s = ${f(r.s / RC.tau, 2)} τ`], ['q', `${vC(r.Q * 1e3)} mC（${f(100 * r.Q / RC.Qmax, 1)}%）`], ['I', `${f(r.I * 1e3, 3)} mA`], ['ΔV_R', `${f(Math.abs(r.VR))} V`], ['ΔV_C', `${f(r.Vc)} V`], ['储能 q²/2C', `${f(r.Q ** 2 / (2 * RC.C) * 1e3)} mJ`]]; } },
};
