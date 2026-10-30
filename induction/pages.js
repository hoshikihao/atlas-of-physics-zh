// Chapter 15, page by page (after the AP Physics C E&M organizer, Unit 8). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS as ST } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const GREY = '#86868c';

// ---------- small SVG charts for the left page: two quantities, one axis each side ----------
const W = 420, HH = 160, P = { l: 44, r: 44, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (HH - P.t - P.b) };
function chart({ L, Rt, series, xlabel, ylabel, rlabel, marks = [], cursors = [], label, under = '' }) {
  const { x0, x1 } = L, sx = x => CH.sx(x, x0, x1), sy = (y, a = L) => CH.sy(y, a.y0, a.y1);
  const paths = series.map(s => { const a = s.r ? Rt : L, c = s.r ? GREY : null;
    return `<path class="curve"${c ? ` style="stroke:${c}"` : ''} d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y, a).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1], a) - 6}"${c ? ` style="fill:${c}"` : ''}>${s.tag[2]}</text>` : ''); }).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const zero = L.y0 < 0 ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  return `<svg class="chart" viewBox="0 0 ${W} ${HH}" role="img" aria-label="${label}">
    ${under}<rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${HH - P.t - P.b}"/>${zero}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(L.y1) + 4}" text-anchor="end">${L.y1}</text><text class="ax" x="${P.l - 6}" y="${sy(L.y0) + 4}" text-anchor="end">${L.y0}</text>
    <text class="ax" x="${W - P.r + 6}" y="${sy(Rt.y1, Rt) + 4}" style="fill:${GREY}">${Rt.y1}</text><text class="ax" x="${W - P.r + 6}" y="${sy(Rt.y0, Rt) + 4}" style="fill:${GREY}">${Rt.y0}</text>
    <text class="ax" x="${P.l}" y="${HH - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${HH - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="lab" x="${W - P.r - 6}" y="${P.t + 13}" text-anchor="end" style="fill:${GREY}">${rlabel}</text>
    <text class="ax" x="${(P.l + W - P.r) / 2}" y="${HH - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(([key, r]) => `<circle class="cursor" r="4.5" data-cursor="${key}"${r ? ` style="fill:${GREY}"` : ''}/>`).join('')}
  </svg>`;
}
const samples = (n, a, b, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });

// chart ranges (left and right axes), shared with the live cursors in main.js
export const R = {
  phi0: { x0: 0, x1: 6, y0: -40, y1: 40 }, emf0: { x0: 0, x1: 6, y0: -45, y1: 45 },
  i1: { x0: 0, x1: 6, y0: -2, y1: 2 }, emf2: { x0: 0, x1: 6, y0: -0.3, y1: 0.3 },
  phiW: { x0: 0, x1: 3, y0: 0, y1: 1.5 }, emfW: { x0: 0, x1: 3, y0: 0, y1: 2 },
  phiX: { x0: 0, x1: 2, y0: -40, y1: 40 }, emfX: { x0: 0, x1: 2, y0: -60, y1: 60 },
  v: { x0: 0, x1: 5, y0: 0, y1: 1 }, pw: { x0: 0, x1: 5, y0: 0, y1: 0.2 },
  iS: { x0: 0, x1: 4, y0: -2, y1: 2 }, eS: { x0: 0, x1: 4, y0: -6, y1: 6 },
  iRL: { x0: 0, x1: 8, y0: -3, y1: 3 }, vRL: { x0: 0, x1: 8, y0: -12, y1: 12 },
  qLC: { x0: 0, x1: +(2 * M.LC.T * 1e3).toFixed(2), y0: -100, y1: 100 }, iLC: { x0: 0, x1: +(2 * M.LC.T * 1e3).toFixed(2), y0: -100, y1: 100 },
};
// live energy bars (the LC circuit): heights set in main.js, full height = the total Q²/2C
export const BARS = { x: 90, w: 56, gap: 50, base: 112, top: 16 };
const barChart = (key, items, top) => `<svg class="chart" viewBox="0 0 ${W} ${BARS.base + 26}" role="img" aria-label="能量柱状图，实时">
  <line class="zero" x1="${BARS.x - 20}" x2="${BARS.x + items.length * (BARS.w + BARS.gap) - BARS.gap + 20}" y1="${BARS.base}" y2="${BARS.base}"/>
  <line class="grid" x1="${BARS.x - 20}" x2="${BARS.x + items.length * (BARS.w + BARS.gap) - BARS.gap + 20}" y1="${BARS.top}" y2="${BARS.top}" style="stroke:#d4d4d0;stroke-dasharray:3 3"/>
  <text class="ax" x="${BARS.x - 26}" y="${BARS.top + 4}" text-anchor="end">${top}</text><text class="ax" x="${BARS.x - 26}" y="${BARS.base + 4}" text-anchor="end">0</text>
  ${items.map(([k, name, color], i) => `<rect data-bar="${key}-${k}" x="${BARS.x + i * (BARS.w + BARS.gap)}" width="${BARS.w}" y="${BARS.base}" height="0" style="fill:${color};stroke:#6c6c72;stroke-width:.8"/>
    <text class="lab" x="${BARS.x + i * (BARS.w + BARS.gap) + BARS.w / 2}" y="${BARS.base + 18}" text-anchor="middle">${name}</text>
    <text class="ax" data-val="${key}-${k}" x="${BARS.x + i * (BARS.w + BARS.gap) + BARS.w / 2}" y="${BARS.base - 6}" text-anchor="middle"></text>`).join('')}
</svg>`;
const sq = k => `每格代表 ${k}`;
const two = (l, r, o) => `<div class="charts">${chart({ L: R[l], Rt: R[r], cursors: [[l], [r, 1]], ...o })}</div>`;

// Lenz's four cases, from the model at mid-run
const lenzRows = M.CASES.map(c => {
  const r = M.lenzCase(c, M.LENZ.run * 0.6), Bdir = r.Bx < 0 ? '←' : '→', grows = c.move === 'in';
  return `<tr><td>${c.pole} 极${c.move === 'in' ? '靠近' : '离开'}</td><td>${Bdir} ${grows ? '增大' : '减小'}</td><td>${f(r.emf * 1e6, 1)} µV</td><td>${r.emf > 0 ? '←' : '→'}</td></tr>`;
}).join('');
const steps = rows => `<table class="data eqs">${rows.map(([e, n]) => `<tr><td>${e}</td><td>${n}</td></tr>`).join('')}</table>`;

export const PAGES = [
  {
    kicker: '第 15 章', title: '电磁感应', sub: '变化的磁通量产生电动势',
    body: `
      <p class="lede">电流产生磁场。法拉第发现了反过来的现象：穿过线圈的磁通量发生<b>变化</b>时，会在线圈中驱动电流。</p>
      <div class="eq">Φ<sub><i>B</i></sub> = ∫<i>B</i>·<i>dA</i> &nbsp;&nbsp; ε = −<i>d</i>Φ<sub><i>B</i></sub>/<i>dt</i></div>
      <p>磁通量是磁场在以线圈为边界的曲面上的总和，单位为韦伯（T·m²）；<i>N</i> 匝线圈有 ε = −<i>N d</i>Φ/<i>dt</i>。电动势是<b>感生电场</b>的 ∮<i>E</i>·<i>ds</i>，这种电场没有起点也没有终点：它不是保守场。这里磁体靠近线圈后又离开；ε 等于 Φ 图线斜率的相反数。</p>
      ${two('phi0', 'emf0', { xlabel: 't (s)', ylabel: 'Φ (µWb)', rlabel: 'ε (µV)', label: '穿过线圈的磁通量和电动势随时间的变化',
        series: [{ pts: samples(160, 0, 6, t => M.fluxScene(t).Phi * 1e6) }, { r: 1, pts: samples(160, 0, 6, t => M.fluxScene(t).emf * 1e6) }] })}
      <p class="hintline">点击线圈，逐块查看 B·dA。1 m 画 10 格；${sq('5 mA')}。</p>`,
    cam: { target: [ST.flux + 1.0, 1.7, 0], az: 30, el: 12, dist: 13 }, lit: 'flux', scene: 'flux', look: {},
    fig: '磁体靠近又离开线圈',
  },
  {
    kicker: '15.1', title: '楞次定律', sub: '感应电流阻碍变化',
    body: `
      <p class="lede">负号的含义：感应电流产生的磁场 <i>B</i><sub>ind</sub> <b>阻碍磁通量的变化</b>，而不是阻碍磁通量本身。</p>
      <table class="data"><tr><th>情形</th><th>线圈处的 B</th><th>ε</th><th>B<sub>ind</sub></th></tr>${lenzRows}</table>
      <ul class="rules">
        <li>磁通量增大：<i>B</i><sub>ind</sub> 与 <i>B</i> 反向；</li>
        <li>磁通量减小：<i>B</i><sub>ind</sub> 与 <i>B</i> 同向；</li>
        <li>再用右手定则由 <i>B</i><sub>ind</sub> 得出 <i>I</i>。</li>
      </ul>
      <p>这是能量守恒的要求：线圈排斥靠近的磁极，又拉住离开的磁极，所以产生电流需要做功。在整块金属中，同样的阻碍作用会产生<b>涡流</b>，使金属发热。面积矢量取向左：<i>B</i> 向左时 Φ > 0。</p>
      <p class="hintline">点击线圈，查看它自己的磁场（虚线）。<i>I</i> 和虚线箭头只表示方向；${sq('10 mT')}。</p>`,
    cam: { target: [ST.lenz - 0.35, 2.1, 0], az: 26, el: 8, dist: 21 }, lit: 'nIn', scene: 'lenz', look: {},
    fig: 'N 极或 S 极，靠近或离开',
  },
  {
    kicker: '15.2', title: '互感', sub: '一个线圈的电流，另一个线圈的电动势',
    body: `
      <p class="lede">线圈 1 中变化的电流改变了它穿过线圈 2 的磁场。这部分磁通量与 <i>I</i><sub>1</sub> 成正比，所以</p>
      <div class="eq">ε<sub>2</sub> = −<i>N</i><sub>2</sub><i>d</i>Φ<sub>2</sub>/<i>dt</i> = −<i>M dI</i><sub>1</sub>/<i>dt</i></div>
      <p><b>互感</b> <i>M</i> 由几何形状决定：这两个 100 匝线圈为 ${f(M.COILS.M * 1e6, 0)} µH。绕在<b>铁芯</b>上时，铁芯引导磁通量穿过两个绕组，磁场强 μ<sub>r</sub> ≈ ${M.CORE.muR} 倍：<i>M</i> = ${f(M.CORE.M * 1e3, 0)} mH。<i>I</i>(<i>t</i>) 增大时，<i>B</i>(<i>t</i>) 向左增强，<i>B</i><sub>ind</sub> 指向右。</p>
      ${two('i1', 'emf2', { xlabel: 't (s)', ylabel: 'I₁ (A)', rlabel: 'ε₂ (mV)', label: '线圈 1 中的电流和线圈 2 中的电动势随时间的变化',
        series: [{ pts: samples(120, 0, 6, t => M.coilsScene(t).I1) }, { r: 1, pts: samples(120, 0, 6, t => M.coilsScene(t).emf * 1e3) }] })}
      <p class="hintline">两者都可点击。线圈 1 中${sq('4 A')}，线圈 2 中为 0.5 mA，铁芯中为 0.25 T。</p>`,
    cam: { target: [ST.mutual, 1.95, 0], az: 26, el: 10, dist: 13.5 }, lit: 'mutual', scene: 'mutual', look: {},
    fig: '两个线圈；一个铁芯',
  },
  {
    kicker: '15.3', title: '远离导线', sub: '进入更弱的磁场',
    body: `
      <p class="lede">一个 ${M.WIRE.b * 100} × ${M.WIRE.a * 100} cm 的线圈以 ${M.WIRE.v * 100} cm/s 远离一根通有 ${M.WIRE.I} A 电流的导线。<i>B</i> = μ<sub>0</sub><i>I</i>/2π<i>r</i> 随位置变化，所以分成细条求和：</p>
      ${steps([
        ['Φ = ∫<sub><i>r</i></sub><sup><i>r</i>+<i>a</i></sup> (μ<sub>0</sub><i>I</i>/2π<i>s</i>) <i>b ds</i>', '分条求和'],
        ['&nbsp;&nbsp;&nbsp;= (μ<sub>0</sub><i>Ib</i>/2π) ln((<i>r</i> + <i>a</i>)/<i>r</i>)', ''],
        ['ε = μ<sub>0</sub><i>Iabv</i> / 2π<i>r</i>(<i>r</i> + <i>a</i>)', '−<i>d</i>Φ/<i>dt</i>'],
      ])}
      <p>导线下方 <i>B</i> 垂直纸面向里且在减小，所以电流沿顺时针方向，补充垂直纸面向里的磁场。</p>
      ${two('phiW', 'emfW', { xlabel: 't (s)', ylabel: 'Φ (µWb)', rlabel: 'ε (µV)', label: '磁通量和电动势随时间的变化',
        series: [{ pts: samples(90, 0, 3, t => M.wireScene(t).Phi * 1e6) }, { r: 1, pts: samples(90, 0, 2.999, t => M.wireScene(t).emf * 1e6) }] })}
      <p class="hintline">点击线圈查看它的细条。⊗ 的大小 ∝ <i>B</i>。${sq('0.4 mA')}。</p>`,
    cam: { target: [ST.wire - 0.3, 2.2, 0], az: 6, el: 6, dist: 17 }, lit: 'wire', scene: 'wire', look: {},
    fig: '长直导线，线圈远离',
  },
  {
    kicker: '15.4', title: '动生电动势', sub: '在磁场中运动的导体棒',
    body: `
      <p class="lede">金属棒以 <i>v</i> 在 <i>B</i> 中运动。棒中每个电荷也随之运动，受到沿棒方向的力 <i>F</i> = <i>qv</i>×<i>B</i>。</p>
      <p>自由电荷沿棒滑动，直到 + 电荷堆积在一端，− 电荷堆积在另一端。它们产生的电场 <i>E</i> 把电荷往回推；当满足下式时，电荷不再移动：</p>
      <div class="eq"><i>qE</i> = <i>qvB</i> &nbsp;→&nbsp; ε = <i>EL</i> = <i>BLv</i></div>
      <table class="data">
        <tr><td><i>B</i>、<i>L</i>、<i>v</i></td><td>${M.BAR.B} T，${M.BAR.L * 100} cm，${M.BAR.v} m/s</td></tr>
        <tr><td><i>E</i> = <i>vB</i></td><td>${f(M.BAR.E, 2)} V/m</td></tr>
        <tr><td>ε = <i>BLv</i></td><td>${f(M.BAR.emf, 2)} V</td></tr>
      </table>
      <p>没有闭合回路，所以电荷分离完成后就<b>没有电流</b>。让棒停下，电荷又会散开。</p>
      <p class="hintline">点击棒，查看一个电荷受的两个力。1 m 画 4 格；${sq('0.25 V/m')}。</p>`,
    cam: { target: [ST.bar, 1.75, 0], az: 8, el: 6, dist: 15 }, lit: 'bar', scene: 'bar', look: {},
    fig: '以 0.5 m/s 穿过 0.4 T 磁场的棒',
  },
  {
    kicker: '15.5', title: '穿过磁场', sub: '只有边起作用',
    body: `
      <p class="lede">一个 ${M.CROSS.w * 100} × ${M.CROSS.h * 100} cm 的线圈以 ${M.CROSS.v} m/s 穿过宽 ${M.CROSS.W * 100} cm、${M.CROSS.B} T 的磁场区域。</p>
      <table class="data">
        <tr><th>阶段</th><th>Φ</th><th>ε</th></tr>
        <tr><td>进入</td><td>增大</td><td>−<i>Bhv</i> = −${f(M.CROSS.B * M.CROSS.h * M.CROSS.v * 1e3, 0)} mV</td></tr>
        <tr><td>完全在内</td><td>恒为 <i>Bhw</i></td><td>0</td></tr>
        <tr><td>离开</td><td>减小</td><td>+${f(M.CROSS.B * M.CROSS.h * M.CROSS.v * 1e3, 0)} mV</td></tr>
      </table>
      <p>在匀强磁场中，两条竖直边上都有 <i>BLv</i>，推动方向相同；绕线圈一周它们相互抵消。只有一条边在场内、另一条在场外时才有电流：${f(M.CROSS.B * M.CROSS.h * M.CROSS.v / M.CROSS.R * 1e3, 0)} mA 流过 ${M.CROSS.R} Ω。</p>
      ${two('phiX', 'emfX', { xlabel: 't (s)', ylabel: 'Φ (mWb)', rlabel: 'ε (mV)', label: '磁通量和电动势随时间的变化',
        series: [{ pts: samples(200, 0, 2, t => M.crossScene(t).Phi * 1e3) }, { r: 1, pts: samples(400, 0, 1.999, t => M.crossScene(t).emf * 1e3) }] })}
      <p class="hintline">点击线圈，查看每条边的推动作用。${sq('0.2 A')}。</p>`,
    cam: { target: [ST.crossing, 1.75, 0], az: 6, el: 6, dist: 15 }, lit: 'crossing', scene: 'crossing', look: {},
    fig: '进入，穿过，离开',
  },
  {
    kicker: '15.6', title: '导轨上的导体棒', sub: '构成回路的动生电动势',
    body: `
      <p class="lede">两条导轨由一个电阻连接，构成闭合回路。给棒 ${M.RAIL.v0} m/s 的初速度后松手。</p>
      ${steps([
        ['Φ = <i>BLx</i>, &nbsp;ε = <i>BLv</i>, &nbsp;<i>I</i> = <i>BLv</i>/<i>R</i>', '逆时针'],
        ['<i>F</i> = <i>ILB</i> = <i>B</i><sup>2</sup><i>L</i><sup>2</sup><i>v</i>/<i>R</i>', '向后'],
        ['<i>v</i> = <i>v</i><sub>0</sub><i>e</i><sup>−<i>t</i>/τ</sup>, &nbsp;τ = <i>mR</i>/<i>B</i><sup>2</sup><i>L</i><sup>2</sup>', `${f(M.RAIL.tau, 1)} s`],
      ])}
      <p>制动力随速度增大，所以棒按指数规律减速，总共滑行 ${f(M.RAIL.v0 * M.RAIL.tau * 100, 0)} cm。它损失的功率 <i>Fv</i> 恰好等于 <i>I</i><sup>2</sup><i>R</i>：全部 ${f(0.5 * M.RAIL.m * M.RAIL.v0 ** 2 * 1e3, 0)} mJ 动能最终都变成热。</p>
      ${two('v', 'pw', { xlabel: 't (s)', ylabel: 'v (m/s)', rlabel: 'P = I²R (W)', label: '棒的速度和耗散功率随时间的变化；阴影面积就是热量',
        under: `<path data-area="pw" style="fill:#e4e4e8"/>`, series: [{ pts: samples(100, 0, 5, t => M.railScene(t).v) }, { r: 1, pts: samples(100, 0, 5, t => M.railScene(t).P) }], marks: [[M.RAIL.tau, M.RAIL.v0 / Math.E, 'τ 时为 v₀/e']] })}
      <p class="live" id="raillive"></p>
      <p class="hintline">点击电路。${sq('2 A')}，或 0.25 N。</p>`,
    cam: { target: [ST.rails, 1.7, 0], az: 6, el: 7, dist: 15.5 }, lit: 'rails', scene: 'rails', look: {},
    fig: '被自身的电流制动',
  },
  {
    kicker: '15.7', title: '自感', sub: '线圈阻碍自身电流的变化',
    body: `
      <p class="lede">线圈中的电流在它自己的各匝中产生磁通量。电流变化时磁通量随之变化，感应出阻碍这种变化的<b>自感电动势</b>。</p>
      ${steps([
        ['<i>L</i> = <i>N</i>Φ/<i>I</i>, &nbsp;ε<sub><i>L</i></sub> = −<i>L dI</i>/<i>dt</i>', '单位亨利，H'],
        ['<i>B</i> = μ<sub>0</sub><i>nI</i> → <i>L</i> = μ<sub>0</sub><i>N</i><sup>2</sup><i>A</i>/ℓ', `${f(M.SOL.L * 1e3, 2)} mH`],
        ['<i>U</i> = ½<i>LI</i><sup>2</sup>, &nbsp;<i>u</i> = <i>B</i><sup>2</sup>/2μ<sub>0</sub>', '储存的能量'],
      ])}
      <p>${M.SOL.N} 匝，长 ${M.SOL.len * 100} cm，半径 ${M.SOL.r * 100} cm（对这么短的线圈，μ<sub>0</sub><i>nI</i> 偏高 ${f((1 - M.solCentreB(1) / (M.MU0 * M.SOL.n)) * 100, 0)} %）。在 ${M.SOL.ramp} s 内让电流 0 → ${M.SOL.Imax} A 均匀增大，得到 ε<sub><i>L</i></sub> = ${f(-M.SOL.L * M.SOL.Imax / M.SOL.ramp * 1e3, 2)} mV；电流恒定时则没有。电感器能平滑电流的突变。</p>
      ${two('iS', 'eS', { xlabel: 't (s)', ylabel: 'I (A)', rlabel: 'ε_L (mV)', label: '电流和自感电动势随时间的变化',
        series: [{ pts: samples(200, 0, 4, t => M.solCurrent(t).I) }, { r: 1, pts: samples(400, 0, 3.999, t => M.solScene(t).emfL * 1e3) }] })}
      <p class="hintline">只画出了 400 匝中的 25 匝。点击查看一匝的磁通量。${sq('5 mT')}。</p>`,
    cam: { target: [ST.solenoid, 1.85, 0], az: 22, el: 12, dist: 11.5 }, lit: 'solenoid', scene: 'solenoid', look: {},
    fig: '螺线管，电流均匀增大',
  },
  {
    kicker: '15.8', title: 'RL 电路', sub: '增长与衰减，τ = L/R',
    body: `
      <p class="lede">${M.RL.E} V，${M.RL.R} Ω，${M.RL.L} H。绕回路一周 ε − <i>IR</i> − <i>L dI</i>/<i>dt</i> = 0，所以</p>
      <div class="eq"><i>I</i> = (ε/<i>R</i>)(1 − <i>e</i><sup>−<i>t</i>/τ</sup>), &nbsp;τ = <i>L</i>/<i>R</i></div>
      <p>起初电感器相当于<b>断开的开关</b>：<i>I</i> = 0，全部 ${M.RL.E} V 都加在它两端。之后它相当于<b>一根普通导线</b>：<i>I</i> = ε/<i>R</i> = ${f(M.RL.Imax, 0)} A。把电池移出回路，电感器使电流继续流动，<i>I</i><sub>0</sub><i>e</i><sup>−<i>t</i>/τ</sup>，同时 ½<i>LI</i><sup>2</sup> = ${f(0.5 * M.RL.L * M.RL.Imax ** 2, 0)} J 变成热。τ = ${f(M.RL.tau, 1)} s。</p>
      ${two('iRL', 'vRL', { xlabel: 't (s)', ylabel: 'I (A)', rlabel: 'ΔV (V)', label: '电流和电感器两端电压随时间的变化：先增长后衰减',
        series: [{ pts: samples(320, 0, 7.999, t => M.rlScene(t).I) }, { r: 1, pts: samples(320, 0, 7.999, t => M.rlScene(t).VL), tag: [4.6, -8.5, 'L dI/dt'] }],
        marks: [[M.RL.tau, M.rlScene(M.RL.tau).I, '63 %'], [M.RL.phase + M.RL.tau, M.rlScene(M.RL.phase + M.RL.tau).I, '37 %']] })}
      <p class="hintline">黑线：<i>I</i>，按右侧刻度读也是 <i>IR</i>。点击电路查看各段的 ΔV。${sq('4 A')}。</p>`,
    cam: { target: [ST.rl - 0.15, 1.75, 0], az: 8, el: 8, dist: 14 }, lit: 'rl', scene: 'rl', look: {},
    fig: '12 V，4 Ω，2 H',
  },
  {
    kicker: '15.9', title: 'LC 振荡', sub: '电荷在线圈中来回流动',
    body: `
      <p class="lede">把 ${f(M.LC.C * 1e6, 0)} µF 的电容器充电到 ${f(M.LC.Q * 1e6, 0)} µC，再接到 ${f(M.LC.L * 1e3, 0)} mH 的线圈上。电荷经线圈流出，冲过了头，把两板反向充电，然后再流回来。</p>
      ${steps([
        ['<i>q</i>/<i>C</i> + <i>L dI</i>/<i>dt</i> = 0', '回路定律'],
        ['<i>L d</i><sup>2</sup><i>q</i>/<i>dt</i><sup>2</sup> + <i>q</i>/<i>C</i> = 0', '<i>I</i> = <i>dq</i>/<i>dt</i>'],
        ['<i>q</i> = <i>Q</i> cos ω<i>t</i>, &nbsp;<i>I</i> = −ω<i>Q</i> sin ω<i>t</i>', `ω = 1/√(<i>LC</i>) = ${f(M.LC.w, 0)} rad/s`],
      ])}
      <p>周期为 <i>T</i> = 2π√(<i>LC</i>) = ${f(M.LC.T * 1e3, 2)} ms（${f(M.LC.f, 0)} Hz）；图中放慢了 ${Math.round(M.LC.slow / 10) * 10}×。<i>q</i> 经过 0 时电流达到峰值 ω<i>Q</i> = ${f(M.LC.Imax * 1e3, 0)} mA，两板充满时电流为零：两者相差四分之一周期。正是线圈的自感电动势使电流越过 <i>q</i> = 0 继续流动。</p>
      ${two('qLC', 'iLC', { xlabel: 't (ms)', ylabel: 'q (µC)', rlabel: 'I (mA)', label: '上极板的电荷量和电流随时间的变化',
        series: [{ pts: samples(200, 0, 2 * M.LC.T * 1e3, t => M.lcScene(t * 1e-3).q * 1e6) }, { r: 1, pts: samples(200, 0, 2 * M.LC.T * 1e3, t => M.lcScene(t * 1e-3).I * 1e3) }],
        marks: [[M.LC.T * 1e3, 100, 'T', 6, 14]] })}
      <div class="eq"><i>q</i><sup>2</sup>/2<i>C</i> + ½<i>LI</i><sup>2</sup> = <i>Q</i><sup>2</sup>/2<i>C</i> = ${f(M.LC.U * 1e3, 2)} mJ</div>
      <div class="charts">${barChart('lc', [['UE', 'U_E = q²/2C', '#8fb0f0'], ['UB', 'U_B = ½LI²', '#c4c4c8'], ['U', '总和', '#f7f7f4']], `${f(M.LC.U * 1e3, 2)} mJ`)}</div>
      <table class="data"><tr><th>弹簧振子</th><th>LC 电路</th></tr>
        <tr><td><i>x</i>, &nbsp;<i>v</i></td><td><i>q</i>, &nbsp;<i>I</i></td></tr>
        <tr><td><i>m</i>, &nbsp;<i>k</i></td><td><i>L</i>, &nbsp;1/<i>C</i></td></tr>
        <tr><td>½<i>kx</i><sup>2</sup>, &nbsp;½<i>mv</i><sup>2</sup></td><td><i>q</i><sup>2</sup>/2<i>C</i>, &nbsp;½<i>LI</i><sup>2</sup></td></tr></table>
      <p class="hintline">点击极板或线圈，查看各自储存的能量。${sq('10 kV/m（E），2 mT（B），100 mA（I）')}。</p>`,
    cam: { target: [ST.lc + 0.3, 1.8, 0], az: 8, el: 8, dist: 12.5 }, lit: 'lcCap', scene: 'lc', look: {},
    fig: '25 µF，40 mH，100 µC',
  },
];

// ---------- click a scene: what it breaks into ----------
const lenzPlate = c => ({
  text: c.move === 'in'
    ? `${c.pole} 极靠近，它穿过线圈的磁感线增多。线圈以电流回应，电流自身的磁场（虚线）反向穿过线圈，线圈靠近磁体的一面也成为 ${c.pole} 极：同名磁极相斥，磁体被推回。`
    : `${c.pole} 极离开，它穿过线圈的磁感线减少。此时电流产生的磁场（虚线）同向穿过线圈，以弥补减少的部分；线圈靠近磁体的一面成为 ${c.pole === 'N' ? 'S' : 'N'} 极，把磁体往回拉。`,
  facts: s => { const r = M.lenzCase(c, s.lenz.t); return [['距离', `${f(r.d * 100, 1)} cm`], ['中心处的 B', `${f(Math.abs(r.Bx) * 1e3, 2)} mT ${r.Bx < 0 ? '←' : '→'}`], ['Φ（面积矢量 ←）', `${f(r.Phi * 1e6, 2)} µWb`], ['ε = −dΦ/dt', `${f(r.emf * 1e6, 2)} µV`], ['I = ε/R（R = 10 mΩ）', `${f(r.I * 1e3, 2)} mA`]]; },
});
export const PLATES = {
  flux: { text: `在线圈上铺一个平面，把它分成许多小块 dA。每一块上的 B·dA 等于垂直穿过它的磁场乘以这块的面积（灰色箭头：沿线圈轴线的分量）。把它们全部加起来就是 Φ。磁体靠近时箭头很长；磁体离开时，箭头缩短到几乎为零。`,
    facts: s => { const r = M.fluxScene(s.flux.t); return [['磁体距离', `${f(r.d * 100, 1)} cm`], ['中心处的 B', `${f(r.Bc * 1e3, 2)} mT`], ['Φ = ∫B·dA', `${f(r.Phi * 1e6, 2)} µWb`], ['ε = −dΦ/dt', `${f(r.emf * 1e6, 1)} µV`], ['I = ε/R（R = 10 mΩ）', `${f(r.I * 1e3, 2)} mA`]]; } },
  ...Object.fromEntries(M.CASES.map(c => [c.key, lenzPlate(c)])),
  mutual: { text: `线圈 1 的磁感线（随其电流增减而浓淡变化）穿过线圈 2。穿过线圈 2 每一匝的磁通量为 MI₁/N₂。I₁ 增大时，线圈 2 的电流产生与之反向的磁场（虚线）；I₁ 减小时则同向。`,
    facts: s => { const r = M.coilsScene(s.coil.t); return [['I₁', `${f(r.I1, 2)} A`], ['dI₁/dt', `${f(r.dI1, 2)} A/s`], ['M', `${f(M.COILS.M * 1e6, 0)} µH`], ['ε₂ = −M dI₁/dt', `${f(r.emf * 1e3, 3)} mV`], ['I₂（R = 1 Ω）', `${f(r.I2 * 1e3, 3)} mA`]]; } },
  core: { text: `把次级线圈抬起后可见：铁芯引导磁通量，所以同样的 Φ = BA 穿过两个绕组的每一匝。次级线圈的电动势是单匝的 N₂ 倍，ε₂/ε₁ = N₂/N₁，变压器就是这样改变电压的。`,
    facts: s => { const r = M.coreScene(s.coil.t); return [['I₁', `${f(r.I1, 3)} A`], ['B = μᵣμ₀N₁I₁/ℓ', `${f(r.B, 3)} T`], ['无铁芯时', `${f(r.Bair * 1e3, 3)} mT`], ['每匝的 Φ', `${f(r.Phi * 1e6, 1)} µWb`], ['ε₂ = −N₂ dΦ/dt', `${f(r.emf2 * 1e3, 2)} mV`], ['ε₂/ε₁', `${f(r.emf2 / (r.emf1 || 1e-30), 2)}`]]; } },
  wire: { text: `B 在线圈上随离导线的距离变化，但沿导线方向不变，所以把线圈切成平行于导线的细条，每条宽 b、高 dr（颜色深浅表示其磁场强弱）。每条的磁通量为 B(r)·b dr；积分得到对数。等价地，近边以 B_near bv 切割磁感线，远边以 B_far bv 切割，两者之差就是 ε。`,
    facts: s => { const r = M.wireScene(s.wire.t); return [['r（近边）', `${f(r.r * 100, 1)} cm`], ['近边 B', `${f(r.Bnear * 1e6, 0)} µT`], ['远边 B', `${f(r.Bfar * 1e6, 0)} µT`], ['Φ', `${f(r.Phi * 1e6, 3)} µWb`], ['ε = (B_near − B_far)bv', `${f(r.emf * 1e6, 3)} µV`], ['I（R = 10 mΩ）', `${f(r.I * 1e3, 3)} mA`]]; } },
  bar: { text: `棒中的一个 + 电荷。磁场力 qv×B 沿棒向上推它；已堆积在两端的电荷产生的电场 E 以 qE 向下推它。两者平衡时，它只随棒一起运动。沿棒移动单位电荷所做的功为 vB·L = ε。`,
    facts: s => { const r = M.barScene(s.bar.t, s.bar.resting); return [['v', `${f(r.v, 2)} m/s`], ['qvB（一个质子的电荷量）', `${(r.Fmag).toExponential(2)} N`], ['qE', `${(M.E_CHARGE * r.E).toExponential(2)} N`], ['E = vB', `${f(r.E, 2)} V/m`], ['ε = BLv', `${f(r.emf, 3)} V`], ['电流', '0']]; } },
  crossing: { text: `在磁场中的每条竖直边上，v×B 以电动势 BLv 沿边向上推动电荷。只有一条边在场内时，这个推动作用驱动电流绕线圈流动。两条边都在场内时，两个推动作用绕线圈方向迎面相对，相互抵消：ε = 0，尽管线圈正在磁场中运动。`,
    facts: s => { const r = M.crossScene(s.cross.t); return [['前边', r.inLead ? '在磁场中' : '在场外'], ['后边', r.inTrail ? '在磁场中' : '在场外'], ['每条边的 BLv', `${f(r.sideEmf * 1e3, 0)} mV`], ['Φ', `${f(r.Phi * 1e3, 1)} mWb`], ['绕线圈一周的 ε', `${f(r.emf * 1e3, 0)} mV`], ['I = ε/R', `${f(r.I * 1e3, 0)} mA`]]; } },
  rails: { text: `阴影面积 Lx 就是磁通量穿过的回路，随棒的运动而增大。它感应出的电流沿棒向上流，这个电流受的 ILB 指向后方（红色：唯一的水平力，即合力）。制动功率 Fv 就是电阻发热的功率。`,
    facts: s => { const r = M.railScene(s.rail.t); return [['v', `${f(r.v, 3)} m/s`], ['ε = BLv', `${f(r.emf, 3)} V`], ['I = ε/R', `${f(r.I, 3)} A`], ['F = ILB', `${f(r.F, 3)} N`], ['Fv', `${f(r.F * r.v, 4)} W`], ['I²R', `${f(r.P, 4)} W`], ['已产生的热', `${f(r.heat * 1e3, 1)} mJ`]]; } },
  solenoid: { text: `长线圈内部 B = μ₀nI 是均匀的，所以每一匝的磁通量为 Φ = BA（阴影那一匝）。全部 N 匝合起来为 NΦ，NΦ/I 就是电感。I 变化时 NΦ 随之变化，自感电动势 −L dI/dt 的方向阻碍这种变化：电流增大时，电流流入的一端为 +。`,
    facts: s => { const r = M.solScene(s.sol.t); return [['I', `${f(r.I, 2)} A`], ['B = μ₀nI', `${f(r.B * 1e3, 2)} mT`], ['每匝的 Φ = BA', `${f(r.Phi * 1e6, 2)} µWb`], ['NΦ = LI', `${f(r.NPhi * 1e3, 3)} mWb`], ['ε_L = −L dI/dt', `${f(r.emfL * 1e3, 2)} mV`], ['U = ½LI²', `${f(r.U * 1e3, 2)} mJ`]]; } },
  rl: { text: `顺着电流绕回路一周：经过电池升高（+ε，电池在回路中时），经过电阻降低（−IR），经过电感器降低（−L dI/dt）。三者之和始终为零。增长阶段，电阻没有分到的电压由电感器承担；衰减阶段，电感器成为电源。`,
    facts: s => { const r = M.rlScene(s.rl.t); return [[r.growing ? '增长，t' : '衰减，t', `${f(r.s, 2)} s`], ['I', `${f(r.I, 3)} A`], ['ε（电池）', `${f(r.emfBat, 1)} V`], ['IR', `${f(r.VR, 2)} V`], ['L dI/dt', `${f(r.VL, 2)} V`], ['U = ½LI²', `${f(r.U, 2)} J`], ['发热功率 I²R', `${f(r.P, 2)} W`]]; } },
  lcCap: { text: `能量储存在两板之间的电场中（阴影：能量越多颜色越深）。ΔV = q/C，U_E = q²/2C = ½CΔV²。两板通过线圈放电时阴影变淡；两板反向充电后阴影又出现，E 反向。`,
    facts: s => { const r = M.lcScene(s.lc.t); return [['t（真实时间）', `${f(s.lc.t * 1e3, 2)} ms`], ['q（上极板）', `${f(r.q * 1e6, 1)} µC`], ['ΔV = q/C', `${f(r.V, 2)} V`], ['E = ΔV/d（d = 1 mm）', `${f(r.E / 1e3, 2)} kV/m`], ['U_E = q²/2C', `${f(r.UE * 1e3, 3)} mJ`], ['U_E + U_B', `${f((r.UE + r.UB) * 1e3, 3)} mJ`]]; } },
  lcCoil: { text: `能量储存在线圈的磁场中（阴影）。q 经过 0 时 U_B = ½LI² 最大。线圈的自感电动势每一时刻都等于电容器的 ΔV，所以 L dI/dt = −q/C：两板充电时它使电流减慢，两板放电时它使电流维持下去。`,
    facts: s => { const r = M.lcScene(s.lc.t); return [['I = dq/dt', `${f(r.I * 1e3, 1)} mA`], ['dI/dt = −q/LC', `${f(r.dI, 0)} A/s`], ['L dI/dt', `${f(M.LC.L * r.dI, 2)} V`], ['B = LI/NA（1600 匝）', `${f(r.B * 1e3, 3)} mT`], ['U_B = ½LI²', `${f(r.UB * 1e3, 3)} mJ`], ['U_E + U_B', `${f((r.UE + r.UB) * 1e3, 3)} mJ`]]; } },
};
