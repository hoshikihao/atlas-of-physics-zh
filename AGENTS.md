# AGENTS.md

## Scope
- 本仓库是 nathanliow/atlas-of-physics 的中文汉化 fork，翻译基准为上游提交 `ac4c5d9`；不主动合并上游新提交。
- 在 `main` 上原地把英文替换为中文，不引入 i18n 框架、语言切换或构建步骤。
- 只改面向读者的文本：各章 `pages.js`、`practice.js`、`main.js` 与 `world.js` 中显示给读者的字符串、各章 `index.html`；`engine/` 界面文本、`engine/xrefs.js`、首页 `index.html`、`equations/build.mjs` 中的文本。
- 不改 `model.js`、`checks.mjs`、`tools/`、计算逻辑、数值、相机参数和 3D 场景结构；不翻译代码注释；不顺手重构或格式化。

## Translation Rules
- 术语以 `glossary.zh.md` 为准；遇到表里没有的术语，先补进术语表再用。
- `${...}` 插值、HTML 标签与属性、`class`、`data-*`、`<i>`/`<sup>` 包裹的物理量符号、公式和单位保持原样。
- 下标中的英文整词（含 `V_under` 这类纯文本下标）按 `glossary.zh.md` 的 Subscripts 表译成中文；字母、数字和缩写下标（cm、net、max、min、ext、app、esc、mech、enc、ind、avg 等）保持原样。
- `kicker`、`title` 保持单引号字符串、同一行、`kicker` 在 `title` 前，内容不得含 `'`。
- 练习题 `choices` 中每个选项的第一个数字必须仍是该选项原来的数值，数字前不得加其他数字。
- 用中文全角标点；中文与数字、拉丁字母之间加一个半角空格；保留原文的 `−`（U+2212）、`×`、`·` 等符号。
- 译文按中文物理教材的说法写，不逐词直译；不增删物理内容。

## Workflow
- 一章一个提交，提交信息格式：`zh: <章节目录名>`。
- 改完运行 `npm run check`，并用 `python3 -m http.server <端口>` 本地打开改过的每一页，确认文本显示正常、控制台无报错。
- `equations/index.html` 只在所有章节合并后由公式表任务运行 `node equations/build.mjs` 统一生成，章节任务不运行、不提交该文件。
- 部署：在仓库根目录运行 `wrangler deploy`，上传范围由 `.assetsignore` 控制；不用 `cf deploy`。
