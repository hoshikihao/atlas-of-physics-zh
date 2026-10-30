// Builds equations/index.html: the AP Physics 1, C: Mechanics and C: E&M equation sheets, each
// row linked to the atlas pages that show it. Run: node equations/build.mjs (then node equations/check.mjs).
// Transcribed from the "Table of Information: Equations" appendix of each course's Course and Exam Description
// (apcentral.collegeboard.org, effective fall 2024; sheets © 2025 College Board), in the sheets' order and notation.
// Chip labels come from each chapter's pages.js (kicker + title), so they follow renumbering.
// Markup shorthand in the data: {x} italic, _{..} subscript, ^{..} superscript (may nest {x}), !{..} vector (arrow).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHAPTERS = 'kinematics newton circular energy momentum oscillations rotation fluids electrostatics gauss potential capacitors circuits magnetism induction'.split(' ');

// ---------- page titles from pages.js ----------
const pages = {};
for (const c of CHAPTERS) {
  const src = fs.readFileSync(path.join(ROOT, c, 'pages.js'), 'utf8');
  const list = [...src.matchAll(/kicker:\s*'([^']*)',\s*title:\s*'([^']*)'/g)];
  list.forEach(([, k, t], i) => {
    const ch = /^(?:Chapter|第) (\d+)/.exec(k), no = ch ? `第 ${ch[1]} 章` : k.split(' ')[0];
    pages[`${c}/${i}`] = [no, t];
  });
}

const md = s => {
  s = s.replace(/!\{([^{}]*)\}/g, '<i class="vec">$1</i>').replace(/(?<![_^])\{([^{}]*)\}/g, '<i>$1</i>');
  for (let p; p !== s;) { p = s; s = s.replace(/_\{([^{}]*)\}/g, '<sub>$1</sub>').replace(/\^\{([^{}]*)\}/g, '<sup>$1</sup>'); }
  return s;
};
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

let links = 0;
const chips = refs => {
  if (refs === null) return '';                      // math reference rows: no chips, no mark
  const list = refs.split(/\s+/).filter(Boolean);
  if (!list.length) return '<span class="none">图谱中暂无</span>';
  return list.map(r => {
    if (!pages[r]) throw new Error('unknown page ' + r);
    const [c, i] = r.split('/'); links++;
    const [no, t] = pages[r];
    return `<a href="../${c}/#${i}">${no} ${esc(t)}</a>`;
  }).join('');
};

// ---------- the sheets ----------
// constants: [name, value markup, refs]; rows: [equation markup, atlas label, refs ('' = not shown yet, null = math)]
// Groups with `same` are on that sheet too, identical to the group linked.
const G_CONST = ['万有引力常量', '{G} = 6.67 × 10^{−11} m^{3}/(kg·s^{2}) = 6.67 × 10^{−11} N·m^{2}/kg^{2}', 'circular/7 circular/8'];
const G_ACC = ['地球表面重力加速度的大小', '{g} = 9.8 m/s^{2}', 'kinematics/3 circular/7'];
const G_FIELD = ['地球表面引力场强度的大小', '{g} = 9.8 N/kg', 'circular/7'];
const PREFIXES = [['10^{12}', '太', 'T'], ['10^{9}', '吉', 'G'], ['10^{6}', '兆', 'M'], ['10^{3}', '千', 'k'], ['10^{−2}', '厘', 'c'],
  ['10^{−3}', '毫', 'm'], ['10^{−6}', '微', 'μ'], ['10^{−9}', '纳', 'n'], ['10^{−12}', '皮', 'p']];
const TRIG = [['θ', '0°', '30°', '37°', '45°', '53°', '60°', '90°'],
  ['sin θ', '0', '1/2', '3/5', '√2/2', '4/5', '√3/2', '1'],
  ['cos θ', '1', '√3/2', '4/5', '√2/2', '3/5', '1/2', '0'],
  ['tan θ', '0', '√3/3', '3/4', '1', '4/3', '√3', '∞']];
const MECH_VARS_L = '{a} = 加速度 · {d} = 距离 · {E} = 能量 · {f} = 频率 · {F} = 力 · {J} = 冲量 · {k} = 劲度系数 · {K} = 动能 · ℓ = 长度 · {m} = 质量 · {M} = 质量 · {p} = 动量 · {P} = 功率 · {r} = 半径、距离或位置 · {t} = 时间 · {T} = 周期 · {U} = 势能 · {v} = 速度或速率 · {W} = 功 · {x} = 位置或距离 · {y} = 竖直位置 · λ = 线密度 · μ = 摩擦因数';
const MECH_VARS_R = '{a} = 加速度 · {d} = 距离 · {f} = 频率 · {F} = 力 · {I} = 转动惯量 · {k} = 劲度系数 · {K} = 动能 · ℓ = 长度 · {L} = 角动量 · {m} = 质量 · {M} = 质量 · {p} = 动量 · {r} = 半径、距离或位置 · {t} = 时间 · {T} = 周期 · {v} = 速度或速率 · {W} = 功 · {x} = 位置或距离 · α = 角加速度 · θ = 角位置 · τ = 力矩 · φ = 初相 · ω = 角频率或角速度';

const SHEETS = [
  {
    id: 'physics-1', nav: '物理 1', title: 'AP 物理 1', sub: '基于代数 · 2024 年秋季起施行',
    constants: [
      G_CONST,
      ['1 标准大气压', '1 atm = 1.0 × 10^{5} N/m^{2} = 1.0 × 10^{5} Pa', 'fluids/2'],
      G_ACC, G_FIELD,
    ],
    units: [['赫兹', 'Hz'], ['焦耳', 'J'], ['千克', 'kg'], ['米', 'm'], ['牛顿', 'N'], ['帕斯卡', 'Pa'], ['秒', 's'], ['瓦特', 'W']],
    conventions: ['除非另有说明，所有问题的参考系都视为惯性系。',
      '除非另有说明，空气阻力忽略不计。',
      '除非另有说明，弹簧和绳都视为理想的。',
      '除非另有说明，流体视为理想流体，管道视为被流体完全充满。'],
    groups: [
      { h: '几何与三角', id: 'geometry', vars: '{A} = 面积 · {b} = 底 · {C} = 周长 · {h} = 高 · ℓ = 长度 · {r} = 半径 · {s} = 弧长 · {S} = 表面积 · {V} = 体积 · {w} = 宽 · θ = 角',
        rows: [
          ['{A} = {b}{h}', '矩形', null],
          ['{A} = ½{b}{h}', '三角形', 'energy/5 momentum/10'],
          ['{A} = π{r}^{2} &nbsp; {C} = 2π{r} &nbsp; {s} = {r}θ', '圆', 'circular/0 fluids/6 circular/6 rotation/1'],
          ['{V} = ℓ{w}{h}', '长方体', 'fluids/0'],
          ['{V} = π{r}^{2}ℓ &nbsp; {S} = 2π{r}ℓ + 2π{r}^{2}', '圆柱', 'gauss/2 gauss/6'],
          ['{V} = <sup>4</sup>⁄<sub>3</sub>π{r}^{3} &nbsp; {S} = 4π{r}^{2}', '球', 'gauss/1 gauss/5'],
          ['{a}^{2} + {b}^{2} = {c}^{2} &nbsp; sin θ = {a}/{c} &nbsp; cos θ = {b}/{c} &nbsp; tan θ = {a}/{b}', '直角三角形', 'kinematics/7 kinematics/8 newton/10 momentum/7'],
        ] },
      { h: '力学与流体 · 左栏', vars: '{a} = 加速度 · {d} = 距离 · {E} = 能量 · {F} = 力 · {J} = 冲量 · {k} = 劲度系数 · {K} = 动能 · {m} = 质量 · {p} = 动量 · {P} = 功率 · {r} = 半径或距离 · {t} = 时间 · {U} = 势能 · {v} = 速度或速率 · {W} = 功 · {x} = 位置 · {y} = 竖直位置 · θ = 角 · μ = 摩擦因数',
        rows: [
          ['{v}_{{x}} = {v}_{{x}0} + {a}_{{x}}{t}', '匀变速运动的速度', 'kinematics/5 kinematics/3'],
          ['{x} = {x}_{0} + {v}_{{x}0}{t} + ½{a}_{{x}}{t}^{2}', '匀变速运动的位置', 'kinematics/5 kinematics/6 electrostatics/8'],
          ['{v}_{{x}}^{2} = {v}_{{x}0}^{2} + 2{a}_{{x}}({x} − {x}_{0})', '不含时间的速度公式', 'kinematics/5'],
          ['!{x}_{cm} = Σ{m}_{{i}}!{x}_{{i}} / Σ{m}_{{i}}', '质心', 'newton/8 momentum/8 momentum/11'],
          ['!{a}_{sys} = Σ!{F} / {m}_{sys} = !{F}_{net} / {m}_{sys}', '牛顿第二定律', 'newton/4 newton/9 circular/1'],
          ['|!{F}_{{g}}| = {G}{m}_{1}{m}_{2} / {r}^{2}', '万有引力定律', 'circular/7 circular/8'],
          ['|!{F}_{{f}}| ≤ |μ!{F}_{{N}}|', '摩擦力', 'newton/6 circular/2 energy/10 rotation/4 rotation/10'],
          ['!{F}_{{s}} = −{k}Δ!{x}', '胡克定律：弹簧弹力', 'energy/5 oscillations/1 oscillations/4'],
          ['{a}_{{c}} = {v}^{2} / {r}', '向心加速度', 'circular/0 circular/1 circular/3 circular/4 circular/5 circular/8 rotation/1'],
          ['{K} = ½{m}{v}^{2}', '动能', 'energy/3 energy/1 momentum/0'],
          ['{W} = {F}_{∥}{d} = {F}{d} cos θ', '恒力做功', 'energy/0 energy/2 rotation/8'],
          ['Δ{K} = Σ{W}_{{i}} = Σ{F}_{∥,{i}}{d}_{{i}}', '动能定理', 'energy/3 energy/1'],
          ['{U}_{{s}} = ½{k}(Δ{x})^{2}', '弹性势能', 'energy/5 oscillations/3 oscillations/11'],
          ['{U}_{{G}} = −{G}{m}_{1}{m}_{2} / {r}', '引力势能（任意距离）', 'circular/10 circular/11 circular/12'],
          ['Δ{U}_{{g}} = {m}{g}Δ{y}', '地面附近的重力势能', 'energy/4 energy/7 circular/11 momentum/6'],
          ['{P}_{avg} = {W} / Δ{t} = Δ{E} / Δ{t}', '平均功率', 'energy/11'],
          ['{P}_{inst} = {F}_{∥}{v} = {F}{v} cos θ', '瞬时功率', 'energy/11 induction/6'],
          ['!{p} = {m}!{v}', '动量', 'momentum/0 momentum/3'],
          ['!{F}_{net} = Δ!{p} / Δ{t} = {m}Δ!{v} / Δ{t} = {m}!{a}', '合力与动量变化', 'momentum/1 momentum/2'],
          ['!{J} = !{F}_{avg}Δ{t} = Δ!{p}', '冲量', 'momentum/1 momentum/2 momentum/6'],
          ['!{v}_{cm} = Σ!{p}_{{i}} / Σ{m}_{{i}} = Σ{m}_{{i}}!{v}_{{i}} / Σ{m}_{{i}}', '质心的速度', 'momentum/3 momentum/8 newton/8'],
        ] },
      { h: '力学与流体 · 右栏', vars: '{a} = 加速度 · {A} = 振幅或面积 · {d} = 距离 · {f} = 频率 · {F} = 力 · {h} = 高 · {I} = 转动惯量 · {k} = 劲度系数 · {K} = 动能 · ℓ = 长度 · {L} = 角动量 · {m} = 质量 · {M} = 质量 · {P} = 压强 · {r} = 半径或距离 · {t} = 时间 · {T} = 周期 · {v} = 速度或速率 · {V} = 体积 · {W} = 功 · {x} = 位置 · {y} = 竖直位置 · α = 角加速度 · θ = 角度或角位置 · ρ = 密度 · τ = 力矩 · ω = 角速度',
        rows: [
          ['ω = ω_{0} + α{t}', 'α 恒定时的角速度', 'rotation/0'],
          ['θ = θ_{0} + ω_{0}{t} + ½α{t}^{2}', 'α 恒定时的角度', 'rotation/0'],
          ['ω^{2} = ω_{0}^{2} + 2α(θ − θ_{0})', '不含时间的角速度公式', 'rotation/0'],
          ['{v} = {r}ω', '线速度与角速度', 'circular/6 rotation/1 rotation/9'],
          ['{a}_{{T}} = {r}α', '切向加速度', 'rotation/1 rotation/11'],
          ['τ = {r}_{⊥}{F} = {r}{F} sin θ', '力矩', 'rotation/2 rotation/3 rotation/4 oscillations/9'],
          ['{I} = Σ{m}_{{i}}{r}_{{i}}^{2}', '转动惯量', 'rotation/5 rotation/6'],
          ['{I}′ = {I}_{cm} + {M}{d}^{2}', '平行轴定理', 'rotation/7 oscillations/9'],
          ['α_{sys} = Στ / {I}_{sys} = τ_{net} / {I}_{sys}', '转动的牛顿第二定律', 'rotation/5 rotation/7 rotation/10 rotation/11'],
          ['{K} = ½{I}ω^{2}', '转动动能', 'rotation/9 rotation/13 rotation/8'],
          ['{W} = τΔθ', '力矩做功', 'rotation/8'],
          ['{L} = {I}ω', '刚体的角动量', 'rotation/12 rotation/13'],
          ['{L} = {r}{m}{v} sin θ', '质点的角动量', 'rotation/14 circular/9'],
          ['Δ{L} = τΔ{t}', '角冲量', 'rotation/12'],
          ['Δ{x}_{cm} = {r}Δθ', '纯滚动', 'rotation/9 rotation/10'],
          ['{T} = 1 / {f}', '周期与频率', 'oscillations/0'],
          ['{T}_{{s}} = 2π√({m} / {k})', '弹簧振子的周期', 'oscillations/6 oscillations/7 oscillations/11'],
          ['{T}_{{p}} = 2π√(ℓ / {g})', '单摆的周期', 'oscillations/5 oscillations/6 oscillations/11'],
          ['{x} = {A} cos(2π{f}{t})', '简谐运动的位置（从 x = A 开始）', 'oscillations/2'],
          ['{x} = {A} sin(2π{f}{t})', '简谐运动的位置（从 x = 0 开始）', ''],
          ['ρ = {m} / {V}', '密度', 'fluids/0 fluids/5'],
          ['{P} = {F}_{⊥} / {A}', '压强', 'fluids/1 fluids/3'],
          ['{P} = {P}_{0} + ρ{g}{h}', '液体中某深度处的绝对压强', 'fluids/2 fluids/4'],
          ['{P}_{表} = ρ{g}{h}', '表压', 'fluids/2'],
          ['{F}_{{b}} = ρ{V}{g}', '浮力', 'fluids/4 fluids/5 newton/12'],
          ['{A}_{1}{v}_{1} = {A}_{2}{v}_{2}', '连续性方程', 'fluids/6'],
          ['{P}_{1} + ρ{g}{y}_{1} + ½ρ{v}_{1}^{2} = {P}_{2} + ρ{g}{y}_{2} + ½ρ{v}_{2}^{2}', '伯努利方程', 'fluids/7 fluids/8'],
        ] },
    ],
  },
  {
    id: 'mechanics', nav: 'C：力学', title: 'AP 物理 C：力学', sub: '基于微积分 · 2024 年秋季起施行',
    constants: [G_CONST, G_ACC, G_FIELD],
    units: [['赫兹', 'Hz'], ['焦耳', 'J'], ['千克', 'kg'], ['米', 'm'], ['牛顿', 'N'], ['秒', 's'], ['瓦特', 'W']],
    conventions: ['除非另有说明，所有问题的参考系都视为惯性系。',
      '除非另有说明，空气阻力忽略不计。',
      '除非另有说明，弹簧和绳都视为理想的。'],
    groups: [
      { h: '力学 · 左栏', id: 'mechanics-c', vars: MECH_VARS_L,
        rows: [
          ['{v}_{{x}} = {v}_{{x}0} + {a}_{{x}}{t}', '匀变速运动的速度', 'kinematics/5'],
          ['{x} = {x}_{0} + {v}_{{x}0}{t} + ½{a}_{{x}}{t}^{2}', '匀变速运动的位置', 'kinematics/5 kinematics/6'],
          ['{v}_{{x}}^{2} = {v}_{{x}0}^{2} + 2{a}_{{x}}({x} − {x}_{0})', '不含时间的速度公式', 'kinematics/5'],
          ['Δ{x} = ∫{v}_{{x}}({t}) d{t}', '位移的积分形式', 'kinematics/9'],
          ['Δ{v}_{{x}} = ∫{a}_{{x}}({t}) d{t}', '速度变化的积分形式', 'kinematics/9'],
          ['!{x}_{cm} = Σ{m}_{{i}}!{x}_{{i}} / Σ{m}_{{i}}', '质心', 'newton/8 momentum/8 momentum/11'],
          ['!{r}_{cm} = ∫!{r} d{m} / ∫d{m}', '连续物体的质心', 'momentum/9 momentum/10'],
          ['λ = (d/dℓ) {m}(ℓ)', '线密度', 'momentum/9 rotation/6'],
          ['!{a}_{sys} = Σ!{F} / {m}_{sys} = !{F}_{net} / {m}_{sys}', '牛顿第二定律', 'newton/4 newton/9 newton/11'],
          ['|!{F}_{{g}}| = {G}{m}_{1}{m}_{2} / {r}^{2}', '万有引力定律', 'circular/7 circular/8'],
          ['|!{F}_{{f}}| ≤ |μ!{F}_{{N}}|', '摩擦力', 'newton/6 circular/2 energy/10 rotation/10'],
          ['!{F}_{{s}} = −{k}Δ!{x}', '胡克定律：弹簧弹力', 'energy/5 oscillations/1'],
          ['{a}_{{c}} = {v}^{2} / {r} = {r}ω^{2}', '向心加速度', 'circular/0 circular/1 circular/4 circular/6 rotation/1'],
          ['{T} = 1 / {f}', '周期与频率', 'oscillations/0'],
          ['{K} = ½{m}{v}^{2}', '动能', 'energy/3'],
          ['{W} = ∫_{{a}}^{{b}} !{F} · d!{r}', '功', 'energy/6 energy/0'],
          ['Δ{K} = Σ{W}_{{i}} = Σ{F}_{∥,{i}}{d}_{{i}}', '动能定理', 'energy/3 energy/6'],
          ['Δ{U} = −∫_{{a}}^{{b}} !{F}_{cf}({r}) · d!{r}', '由保守力求势能', 'circular/11 energy/8'],
          ['{F}_{{x}} = −d{U}({x}) / d{x}', '由势能求力', 'energy/8 energy/9 circular/11'],
          ['{U}_{{s}} = ½{k}(Δ{x})^{2}', '弹性势能', 'energy/5 oscillations/3'],
          ['{U}_{{G}} = −{G}{m}_{1}{m}_{2} / {r}', '引力势能', 'circular/10 circular/11 circular/12'],
          ['Δ{U}_{{g}} = {m}{g}Δ{y}', '地面附近的重力势能', 'energy/4 circular/11'],
          ['{P}_{avg} = {W} / Δ{t} = Δ{E} / Δ{t}', '平均功率', 'energy/11'],
          ['{P}_{inst} = d{W} / d{t}', '瞬时功率', 'energy/11 induction/6'],
          ['!{p} = {m}!{v}', '动量', 'momentum/0'],
          ['!{F}_{net} = d!{p} / d{t}', '合力等于动量的变化率', 'momentum/1'],
          ['!{J} = ∫_{{t}_{1}}^{{t}_{2}} !{F}_{net}({t}) d{t} = Δ!{p}', '冲量', 'momentum/1 momentum/2'],
          ['!{v}_{cm} = Σ!{p}_{{i}} / Σ{m}_{{i}} = Σ{m}_{{i}}!{v}_{{i}} / Σ{m}_{{i}}', '质心的速度', 'momentum/3 momentum/8'],
        ] },
      { h: '力学 · 右栏', vars: MECH_VARS_R,
        rows: [
          ['ω = dθ / d{t}', '角速度', 'rotation/0 circular/6'],
          ['α = dω / d{t}', '角加速度', 'rotation/0 rotation/10'],
          ['ω = ω_{0} + α{t}', 'α 恒定时的角速度', 'rotation/0'],
          ['θ = θ_{0} + ω_{0}{t} + ½α{t}^{2}', 'α 恒定时的角度', 'rotation/0'],
          ['ω^{2} = ω_{0}^{2} + 2α(θ − θ_{0})', '不含时间的角速度公式', 'rotation/0'],
          ['{v} = {r}ω', '线速度与角速度', 'circular/6 rotation/1'],
          ['{a}_{{T}} = {r}α', '切向加速度', 'rotation/1 rotation/11'],
          ['!{τ} = !{r} × !{F}', '力矩', 'rotation/2 rotation/3 rotation/4 oscillations/9'],
          ['{I}_{tot} = Σ{I}_{{i}} = Σ{m}_{{i}}{r}_{{i}}^{2}', '转动惯量', 'rotation/5 rotation/6'],
          ['{I} = ∫{r}^{2} d{m}', '连续物体的转动惯量', 'rotation/6'],
          ['{I}′ = {I}_{cm} + {M}{d}^{2}', '平行轴定理', 'rotation/7 oscillations/9'],
          ['α_{sys} = Στ / {I}_{sys} = τ_{net} / {I}_{sys}', '转动的牛顿第二定律', 'rotation/5 rotation/10 rotation/11 oscillations/10'],
          ['{K}_{rot} = ½{I}ω^{2}', '转动动能', 'rotation/9 rotation/13'],
          ['{W} = ∫τ · dθ', '力矩做功', 'rotation/8'],
          ['!{L} = !{r} × !{p} = {I}!{ω}', '角动量', 'rotation/14 circular/9 rotation/12 rotation/13'],
          ['Δ{L} = ∫τ d{t}', '角冲量', 'rotation/12'],
          ['Δ{x}_{cm} = {r}Δθ', '纯滚动', 'rotation/9 rotation/10'],
          ['{T} = 2π / ω = 1 / {f}', '周期与频率', 'oscillations/0 oscillations/8'],
          ['{T}_{{s}} = 2π√({m} / {k})', '弹簧振子的周期', 'oscillations/6 oscillations/4'],
          ['{T}_{{p}} = 2π√(ℓ / {g})', '单摆的周期', 'oscillations/5 oscillations/6'],
          ['{T}_{phys} = 2π√({I} / {m}{g}{d})', '复摆的周期', 'oscillations/9'],
          ['{x} = {x}_{max} cos(ω{t} + φ)', '简谐运动的位置', 'oscillations/8 oscillations/2'],
        ] },
      { h: '几何与三角', same: '#geometry', label: '「物理 1」公式表' },
      { h: '矢量', id: 'vectors', vars: '原表附的数学参考。',
        rows: [
          ['!{A} · !{B} = {AB} cos θ', '点积', 'energy/0 gauss/0'],
          ['|!{A} × !{B}| = {AB} sin θ', '叉积', 'rotation/2 magnetism/1'],
          ['!{r} = ({A}{î} + {B}{ĵ} + {C}{k̂})', '由分量表示矢量', null],
          ['!{C} = !{A} + !{B}', '矢量和', 'kinematics/7 kinematics/8'],
          ['!{C} = ({A}_{{x}} + {B}_{{x}}){î} + ({A}_{{y}} + {B}_{{y}}){ĵ}', '用分量求矢量和', null],
        ] },
      { h: '微积分', id: 'calculus', vars: '原表附的数学参考。',
        rows: [
          ['d{f}/d{x} = (d{f}/d{u})(d{u}/d{x})', '链式法则', null],
          ['d/d{x} ({x}^{{n}}) = {n}{x}^{{n}−1}', '幂函数的导数', 'kinematics/10'],
          ['d/d{x} ({e}^{{ax}}) = {a}{e}^{{ax}}', '指数函数的导数', null],
          ['d/d{x} (ln {ax}) = 1/{x}', '对数函数的导数', null],
          ['d/d{x} [sin({ax})] = {a} cos({ax})', '正弦函数的导数', 'oscillations/2 oscillations/8'],
          ['d/d{x} [cos({ax})] = −{a} sin({ax})', '余弦函数的导数', 'oscillations/2 oscillations/8'],
          ['∫{x}^{{n}} d{x} = (1/({n} + 1)) {x}^{{n}+1}, {n} ≠ −1', '幂函数的积分', 'kinematics/9 momentum/9 rotation/6'],
          ['∫{e}^{{ax}} d{x} = (1/{a}) {e}^{{ax}}', '指数函数的积分', 'newton/12'],
          ['∫d{x} / ({x} + {a}) = ln|{x} + {a}|', '结果为对数的积分', 'newton/11 capacitors/3 circuits/8'],
          ['∫cos({ax}) d{x} = (1/{a}) sin({ax})', '余弦函数的积分', null],
          ['∫sin({ax}) d{x} = −(1/{a}) cos({ax})', '正弦函数的积分', 'momentum/1'],
        ] },
      { h: '恒等式', id: 'identities', vars: '原表附的数学参考。',
        rows: [
          ['log({a} · {b}^{{x}}) = log {a} + {x} log {b}', '积与幂的对数', null],
          ['sin^{2} θ + cos^{2} θ = 1', '平方关系', null],
          ['sin(2θ) = 2 sin θ cos θ', '二倍角公式', null],
          ['sin θ / cos θ = tan θ', '商数关系', null],
        ] },
    ],
  },
  {
    id: 'em', nav: 'C：电磁学', title: 'AP 物理 C：电磁学', sub: '基于微积分 · 2024 年秋季起施行',
    constants: [
      ['静电力常量', '{k} = 1/4πε_{0} = 9.0 × 10^{9} (N·m^{2})/C^{2}', 'electrostatics/2'],
      ['真空介电常量', 'ε_{0} = 8.85 × 10^{−12} C^{2}/(N·m^{2})', 'gauss/1'],
      ['真空磁导率', 'μ_{0} = 4π × 10^{−7} (T·m)/A', 'magnetism/5'],
      ['质子质量', '{m}_{{p}} = 1.67 × 10^{−27} kg', 'electrostatics/0 magnetism/2'],
      ['中子质量', '{m}_{{n}} = 1.67 × 10^{−27} kg', 'electrostatics/0'],
      ['电子质量', '{m}_{{e}} = 9.11 × 10^{−31} kg', 'electrostatics/0 electrostatics/8'],
      ['元电荷', '{e} = 1.60 × 10^{−19} C', 'electrostatics/0'],
      ['1 电子伏特', '1 eV = 1.60 × 10^{−19} J', 'potential/8'],
      ['光速', '{c} = 3.00 × 10^{8} m/s', ''],
      ['1 原子质量单位', '1 u = 1.66 × 10^{−27} kg = 931 MeV/{c}^{2}', ''],
      G_CONST, G_ACC, G_FIELD,
    ],
    units: [['安培', 'A'], ['库仑', 'C'], ['电子伏特', 'eV'], ['法拉', 'F'], ['亨利', 'H'], ['赫兹', 'Hz'], ['焦耳', 'J'], ['千克', 'kg'],
      ['米', 'm'], ['牛顿', 'N'], ['欧姆', 'Ω'], ['秒', 's'], ['特斯拉', 'T'], ['伏特', 'V'], ['瓦特', 'W']],
    conventions: ['除非另有说明，本考试采用以下约定：',
      '所有问题的参考系都是惯性系。',
      '摩擦力和空气阻力忽略不计。',
      '绳、弹簧、电池、导线和电表都是理想的。',
      '孤立点电荷在无穷远处的电势为零。',
      '电流方向是正电荷定向移动的方向。',
      '电阻器和灯泡都是欧姆导体。',
      '电容器内充满空气（κ = 1.0）。'],
    groups: [
      { h: '电磁学 · 左栏', vars: '{A} = 面积 · {C} = 电容 · {d} = 距离 · {E} = 电场强度 · {F} = 力 · {I} = 电流 · {J} = 电流密度 · ℓ = 长度 · {P} = 功率 · {q} = 电荷量 · {Q} = 电荷量 · {r} = 半径、距离或位置 · {R} = 电阻 · {t} = 时间 · {U} = 势能 · {V} = 电势或体积 · ε = 介电常量 · ρ = 电阻率或电荷密度 · κ = 相对介电常数 · Φ = 通量',
        rows: [
          ['|!{F}_{{E}}| = (1/4πε_{0}) |{q}_{1}{q}_{2}| / {r}^{2} = {k}|{q}_{1}{q}_{2}| / {r}^{2}', '库仑定律', 'electrostatics/2 electrostatics/3'],
          ['!{E} = !{F}_{{E}} / {q}', '电场强度', 'electrostatics/4 electrostatics/8'],
          ['!{E} = (1/4πε_{0}) ∫ (d{q} / {r}^{2}) {r̂}', '连续带电体的电场', 'electrostatics/6 electrostatics/7'],
          ['Φ_{{E}} = ∫!{E} · d!{A}', '电通量', 'gauss/0'],
          ['∮!{E} · d!{A} = {q}_{enc} / ε_{0}', '高斯定理', 'gauss/1 gauss/2 gauss/3 gauss/4 gauss/5 gauss/6 gauss/7 capacitors/1'],
          ['{Q}_{总} = ∫ρ({r}) d{V}', '由电荷密度求总电荷', 'gauss/7'],
          ['{U}_{{E}} = (1/4πε_{0}) {q}_{1}{q}_{2} / {r}', '两个点电荷的电势能', 'potential/0 potential/1'],
          ['{V} = (1/4πε_{0}) ∫ d{q} / {r}', '连续带电体的电势', 'potential/5 potential/6'],
          ['Δ{V} = −∫_{{a}}^{{b}} !{E} · d!{r}', '由电场求电势差', 'potential/2 potential/3 potential/7 capacitors/1 capacitors/2 capacitors/3'],
          ['{E}_{{x}} = −d{V} / d{x}', '由电势求电场', 'potential/3'],
          ['Δ{U}_{{E}} = {q}Δ{V}', '由电势求电势能', 'potential/2 potential/8 magnetism/2'],
          ['{C} = {Q} / Δ{V}', '电容', 'capacitors/0 capacitors/1 capacitors/2 capacitors/3'],
          ['{C} = κε_{0}{A} / {d}', '平行板电容器', 'capacitors/1 capacitors/6 capacitors/8'],
          ['{U}_{{C}} = ½{Q}Δ{V}', '电容器储存的能量', 'capacitors/4 capacitors/7'],
          ['κ = ε / ε_{0}', '相对介电常数', 'capacitors/6'],
          ['{I} = d{q} / d{t}', '电流', 'circuits/0 circuits/8'],
          ['{I} = ∫!{J} · d!{A}', '由电流密度求电流', 'circuits/0'],
          ['!{E} = ρ!{J}', '材料中的欧姆定律', 'circuits/0 circuits/2'],
          ['{R} = ρℓ / {A}', '导线的电阻', 'circuits/1'],
          ['{I} = Δ{V} / {R}', '欧姆定律', 'circuits/2 circuits/5 circuits/6'],
          ['{P} = {I}Δ{V}', '电功率', 'circuits/3 circuits/4'],
        ] },
      { h: '电磁学 · 右栏', vars: '{A} = 面积 · {B} = 磁感应强度 · {C} = 电容 · {E} = 电场强度 · {F} = 力 · {I} = 电流 · ℓ = 长度 · {L} = 电感 · {n} = 单位长度的匝数 · {N} = 匝数 · {q} = 电荷量 · {r} = 半径、距离或位置 · {R} = 电阻 · {t} = 时间 · {U} = 势能 · {v} = 速度或速率 · ε = 电动势 · μ = 磁导率 · τ = 时间常数 · Φ = 通量 · ω = 角频率',
        rows: [
          ['{R}_{eq,{s}} = Σ_{{i}} {R}_{{i}}', '电阻串联', 'circuits/5 circuits/6'],
          ['1 / {R}_{eq,{p}} = Σ_{{i}} 1 / {R}_{{i}}', '电阻并联', 'circuits/5 circuits/6'],
          ['1 / {C}_{eq,{s}} = Σ_{{i}} 1 / {C}_{{i}}', '电容器串联', 'capacitors/5 capacitors/8'],
          ['{C}_{eq,{p}} = Σ_{{i}} {C}_{{i}}', '电容器并联', 'capacitors/5 capacitors/7'],
          ['τ = {R}_{eq}{C}_{eq}', 'RC 电路的时间常数', 'circuits/8'],
          ['∮!{B} · d!{A} = 0', '不存在磁单极子', 'magnetism/0'],
          ['!{F}_{{B}} = {q}(!{v} × !{B})', '洛伦兹力', 'magnetism/1 magnetism/2 magnetism/3 induction/4'],
          ['d!{B} = (μ_{0}/4π) {I}(d!{ℓ} × {r̂}) / {r}^{2}', '毕奥–萨伐尔定律', 'magnetism/6'],
          ['!{F}_{{B}} = ∫{I}(d!{ℓ} × !{B})', '安培力', 'magnetism/4 magnetism/7 induction/6'],
          ['∮!{B} · d!{ℓ} = μ_{0}{I}_{enc}', '安培环路定理', 'magnetism/5 magnetism/8'],
          ['{B}_{sol} = μ_{0}{n}{I}', '螺线管内的磁场', 'magnetism/8 induction/7'],
          ['Φ_{{B}} = ∫!{B} · d!{A}', '磁通量', 'induction/0 induction/3 induction/6 magnetism/0'],
          ['ε = ∮!{E} · d!{ℓ} = −dΦ_{{B}} / d{t}', '法拉第电磁感应定律', 'induction/0 induction/1 induction/2 induction/3 induction/5'],
          ['|ε_{sol}| = {N}|dΦ_{{B}} / d{t}|', 'N 匝线圈的电动势', 'induction/0'],
          ['{L}_{sol} = μ_{芯}{N}^{2}{A} / ℓ', '螺线管的自感', 'induction/7'],
          ['{U}_{{L}} = ½{L}{I}^{2}', '电感器储存的能量', 'induction/7 induction/9'],
          ['ε = −{L} d{I} / d{t}', '自感电动势', 'induction/7 induction/8'],
          ['τ = {L} / {R}_{eq}', 'RL 电路的时间常数', 'induction/8'],
          ['ω_{{LC}} = 1 / √({L}{C})', 'LC 振荡的角频率', 'induction/9'],
        ] },
      { h: '力学', same: '#mechanics-c', label: '「C：力学」公式表（左右两栏）' },
      { h: '几何与三角', same: '#geometry', label: '「物理 1」公式表' },
      { h: '矢量、微积分与恒等式', same: '#vectors', label: '「C：力学」公式表' },
    ],
  },
];

// ---------- render ----------
let rows = 0;
const counts = {};
const unshown = [];
const sectionHTML = SHEETS.map(S => {
  counts[S.title] = 0;
  const consts = `
      <div class="group consts">
        <h3>常量与换算因子</h3>
        <table class="ctab">${S.constants.map(([n, v, r]) => `
          <tr><th>${n}</th><td class="cv">${md(v)}</td><td>${r === null ? '' : `<span class="chips">${chips(r)}</span>`}</td></tr>`).join('')}
        </table>
      </div>`;
  const tables = `
      <div class="group ref">
        <div class="rgrid">
          <div><h3>词头</h3><table class="rtab"><tr><th>因数</th><th>词头</th><th>符号</th></tr>${PREFIXES.map(([f, p, s]) => `<tr><td>${md(f)}</td><td>${p}</td><td>${s}</td></tr>`).join('')}</table></div>
          <div><h3>单位符号</h3><table class="rtab">${S.units.map(([n, s]) => `<tr><td>${n}</td><td>${s}</td></tr>`).join('')}</table></div>
          <div><h3>常用角的三角函数值</h3><table class="rtab trig">${TRIG.map(r => `<tr>${r.map((c, i) => i ? `<td>${c}</td>` : `<th>${c}</th>`).join('')}</tr>`).join('')}</table></div>
        </div>
      </div>
      <div class="group ref">
        <h3>约定</h3>
        <p class="vars">${S.conventions[0].endsWith('：') ? S.conventions[0] : '本考试采用以下约定：'}</p>
        <ul class="conv">${S.conventions.filter(c => !c.endsWith('：')).map(c => `<li>${md(c)}</li>`).join('')}</ul>
      </div>`;
  const groups = S.groups.map(G => G.same ? `
      <div class="group ref">
        <h3>${G.h}</h3>
        <p class="vars">本表也有这一部分，与<a href="${G.same}">${G.label}</a>中的完全相同。</p>
      </div>` : `
      <div class="group"${G.id ? ` id="${G.id}"` : ''}>
        <h3>${G.h}</h3>
        <p class="vars">${md(G.vars)}</p>
        <ul>${G.rows.map(([e, n, r]) => {
          rows++; counts[S.title]++;
          if (r === '') unshown.push(`${S.title} · ${G.h}: ${n}`);
          return `
          <li${r === '' ? ' class="unshown"' : ''}><div class="e">${md(e)}</div><div class="m"><span class="n">${n}</span><span class="chips">${chips(r)}</span></div></li>`;
        }).join('')}
        </ul>
      </div>`).join('');
  return `
    <section class="sheet" id="${S.id}">
      <div class="shead"><h2>${S.title}</h2><span>${S.sub}</span></div>${consts}${tables}${groups}
    </section>`;
}).join('');

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>公式表 · 物理图谱</title>
<link rel="icon" href="data:,">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../atlas.css">
<!-- Generated by equations/build.mjs: edit the data there and rebuild. -->
<style>
  html { scroll-padding-top: 76px; }
  body { min-height: 100vh; padding: 0 16px 80px; }
  header { max-width: 1180px; margin: 0 auto; padding: 22px 12px; display: flex; justify-content: space-between; gap: 12px; font: 500 12px var(--mono); letter-spacing: .06em; color: var(--muted); text-transform: uppercase; }
  header a { font: 500 19px var(--serif); letter-spacing: 0; text-transform: none; color: var(--strong); text-decoration: none; }
  header span { text-align: right; padding-top: 5px; margin-left: auto; }
  header a.gh { display: flex; padding-top: 3px; color: var(--muted); }
  header a.gh:hover { color: var(--strong); }
  .hero { text-align: center; margin: 56px auto 40px; max-width: 760px; }
  .hero h1 { font: 400 clamp(46px, 7vw, 84px)/1 var(--serif); color: var(--strong); letter-spacing: -.015em; }
  .hero p { font: italic 400 clamp(19px, 2.2vw, 24px)/1.4 var(--serif); color: var(--muted); margin-top: 16px; }
  nav { position: sticky; top: 0; z-index: 2; margin: 0 -16px; padding: 10px 16px; background: color-mix(in srgb, var(--page) 92%, transparent); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-bottom: 1px solid var(--faint); }
  nav .in { max-width: 1180px; margin: 0 auto; display: flex; align-items: center; gap: 6px 22px; flex-wrap: wrap; }
  nav a { font: 500 12px var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--muted); text-decoration: none; padding: 8px 0; }
  nav a:hover { color: var(--strong); }
  nav input { margin-left: auto; width: min(100%, 280px); font: 14px var(--sans); color: var(--strong); background: var(--card); border: 1px solid var(--faint); border-radius: 999px; padding: 8px 14px; }
  nav input:focus { outline: none; border-color: var(--mid); }
  main { max-width: 1180px; margin: 0 auto; }
  .sheet { padding-top: 48px; }
  .shead { display: flex; align-items: baseline; justify-content: space-between; gap: 8px 16px; flex-wrap: wrap; border-bottom: 1px solid var(--mid); padding: 0 4px 10px; margin-bottom: 18px; }
  .shead h2 { font: 400 clamp(30px, 4vw, 42px)/1.05 var(--serif); color: var(--strong); }
  .shead span { font: 500 12px var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
  .group { background: var(--card); border-radius: 14px; box-shadow: var(--lift); padding: 18px 22px 8px; margin-bottom: 18px; }
  .group h3 { font: 500 12px/1 var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
  .vars { font-size: 12.5px; line-height: 1.55; color: var(--muted); margin: 8px 0 6px; max-width: 920px; }
  .vars i, .ctab i { font-family: var(--serif); font-size: 1.12em; color: var(--hi); }
  .vars a { color: var(--hi); }
  ul { list-style: none; padding: 0; }
  li { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr); gap: 4px 24px; align-items: baseline; padding: 11px 0; border-top: 1px solid var(--faint); }
  .e { font: 400 21px/1.35 var(--serif); color: var(--strong); overflow-x: auto; overflow-y: hidden; padding-left: 14px; border-left: 1px solid var(--mid); }
  .e sub, .e sup, .cv sub, .cv sup { font-size: .68em; line-height: 0; }
  .m { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.3fr); gap: 6px 18px; align-items: baseline; }
  .n { font-size: 14px; color: var(--text); }
  .chips { display: flex; flex-wrap: wrap; gap: 5px; }
  .chips a, .none { font: 11px/1.3 var(--mono); letter-spacing: .02em; color: var(--hi); text-decoration: none; border: 1px solid var(--faint); background: var(--page); border-radius: 999px; padding: 3px 9px; white-space: nowrap; }
  .chips a:hover, .chips a:focus-visible { border-color: var(--hi); color: var(--lit); }
  .none { color: var(--lo); border-style: dashed; background: none; font-style: italic; }
  li.unshown .e { color: var(--mid); border-left-style: dashed; }
  .vec { position: relative; display: inline-block; }
  .vec::before { content: '→'; position: absolute; left: 55%; transform: translateX(-50%); top: -.42em; font-size: .7em; font-style: normal; line-height: 1; }
  .rgrid { display: grid; grid-template-columns: auto auto minmax(0, 1fr); gap: 14px 36px; margin: 2px 0 14px; align-items: start; }
  .rgrid > div { min-width: 0; overflow-x: auto; }
  .rtab { border-collapse: collapse; margin-top: 10px; font: 15px var(--serif); color: var(--strong); }
  .rtab th, .rtab td { border: 1px solid var(--faint); padding: 4px 10px; text-align: center; font-weight: 400; white-space: nowrap; }
  .rtab sup { font-size: .68em; line-height: 0; }
  .conv li { display: list-item; list-style: disc; margin-left: 20px; padding: 3px 0; border: 0; font-size: 14px; color: var(--text); }
  .conv { padding-bottom: 10px; }
  .ctab { border-collapse: collapse; width: 100%; margin: 10px 0 10px; }
  .ctab th, .ctab td { text-align: left; vertical-align: baseline; padding: 9px 16px 9px 0; border-top: 1px solid var(--faint); }
  .ctab th { font: 400 14px var(--sans); color: var(--text); width: 30%; }
  .ctab .cv { font: 17px var(--serif); color: var(--strong); white-space: nowrap; }
  .ctab td:last-child { padding-right: 0; }
  .empty { display: none; text-align: center; font: italic 20px var(--serif); color: var(--muted); padding: 48px 0; }
  .hidden { display: none !important; }
  footer { max-width: 1180px; margin: 40px auto 0; padding: 0 4px; font-size: 12.5px; color: var(--muted); }
  @media (max-width: 1000px) {
    .m { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    html { scroll-padding-top: 112px; }
    header span { display: none; }
    .hero { margin: 28px auto 28px; }
    nav .in { gap: 0 16px; }
    nav input { margin: 4px 0 2px; width: 100%; }
    .group { padding: 16px 16px 6px; border-radius: 12px; }
    li { grid-template-columns: 1fr; padding: 12px 0; }
    .e { font-size: 20px; }
    .ctab, .ctab tbody, .ctab tr, .ctab th, .ctab td { display: block; width: auto; }
    .ctab tr { border-top: 1px solid var(--faint); padding: 9px 0; }
    .ctab th, .ctab td { border: 0; padding: 2px 0; }
    .ctab .cv { white-space: normal; }
    .rgrid { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>
  <header><a href="../">物理图谱</a><span>AP 公式表，逐条链接到图谱页面</span><a class="gh" href="https://github.com/nathanliow/atlas-of-physics" aria-label="GitHub 上的源代码"><svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg></a></header>
  <section class="hero">
    <h1>公式表</h1>
    <p>AP 物理 1 与物理 C 的官方公式表，逐行收录。每个公式都链接到图谱中展示或用到它的每一页。</p>
  </section>
  <nav aria-label="公式表"><div class="in">
    ${SHEETS.map(S => `<a href="#${S.id}">${S.nav}</a>`).join('\n    ')}
    <input type="search" id="q" placeholder="筛选：力矩、ω、高斯…" aria-label="筛选公式" autocomplete="off">
  </div></nav>
  <main>${sectionHTML}
    <p class="empty" id="empty">没有匹配的公式。</p>
  </main>
  <footer>转录自美国大学理事会（College Board）AP 物理 1、物理 C：力学和物理 C：电磁学《课程与考试说明》中的信息表（2024 年秋季起施行；公式表 © 2025 College Board），顺序和记号与原表一致。箭头表示矢量，与原表相同。每个公式旁的名称是本图谱加的标签，不属于原表。标签按钮标明节号和页面；颜色较淡的行在原表中有，但图谱中还没有画出。</footer>
<script>
  // Filter rows by their text (equation, name and linked page titles); hide groups and sheets left empty.
  const q = document.getElementById('q'), norm = s => s.normalize('NFKD').toLowerCase();
  const items = [...document.querySelectorAll('.group:not(.ref) li, .ctab tr')].map(el => [el, norm(el.textContent)]);
  q.addEventListener('input', () => {
    const t = norm(q.value.trim());
    for (const [el, txt] of items) el.classList.toggle('hidden', !!t && !txt.includes(t));
    for (const g of document.querySelectorAll('.group')) g.classList.toggle('hidden', !!t && (g.matches('.ref') || !g.querySelector('li:not(.hidden), tr:not(.hidden)')));
    for (const s of document.querySelectorAll('.sheet')) s.classList.toggle('hidden', !!t && !s.querySelector('.group:not(.hidden)'));
    document.getElementById('empty').style.display = t && !document.querySelector('.sheet:not(.hidden)') ? 'block' : 'none';
  });
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(ROOT, 'equations', 'index.html'), html);
console.log(`rows ${rows}`, counts, `links ${links}`);
console.log('not shown yet:\n  ' + unshown.join('\n  '));
