# FWTI — 恋爱废物人格测试

> 本分支保留 FWTI、MBTI、自嘲型恋爱人格测试、原题库与原结果内容，并在其上增加焦糖橙 / 奶油粉移动端视觉、订单门禁、管理员入口、丰富建议、结果长图、打印与保存 PDF。原项目说明仍完整保留在下方。

## 这份网页版新增了什么

- 普通客户必须输入 `P` 开头、共 19 位的小红书订单编号，且订单指纹必须存在于 GitHub 授权名单。
- 管理员使用单独的高强度口令进入，不占用客户订单编号。
- GitHub 只保存订单号的 SHA-256 指纹，不保存明文订单号；浏览器也不会把输入的明文订单号写入本地记录。
- 首次验证成功后，本机只保存该订单号的哈希绑定；同一手机或电脑以后只能继续使用首次绑定的订单号。
- 保留 FWTI / MBTI 名称、原题库、原人格结果、隐藏人格、四维分析、配对、作答证据、AI 解读入口与参考文献。
- 新增个性化优势、风险提醒、行动建议、沟通话术、7 天微练习。
- 新增 1080×1440 结果长图、系统分享、复制图片、打印和“另存为 PDF”。
- 已移除原站遥测上报；答案与历史记录只保存在当前浏览器。

## GitHub 订单授权名单

授权数据保存在 [`public/access-registry.json`](public/access-registry.json)。请不要把明文订单号直接写入仓库。

```bash
# 查看已授权数量
pnpm access:list

# 添加一个真实订单号
pnpm access:add P123456789012345678

# 移除订单号
pnpm access:remove P123456789012345678

# 更换管理员口令（至少 24 个字符）
pnpm access:set-admin 你的高强度管理员口令
```

修改后提交并推送，GitHub Pages 会重新构建，新的订单白名单才会生效。交付包另附一份“管理员凭据（请勿上传 GitHub）”，其中的测试订单只用于首次验收；正式发布前请将测试订单移除并换成真实订单。

> 安全边界：GitHub Pages 是静态网页。哈希白名单不会公开明文订单号，本机也会拒绝换单登录，但它不能在多台设备之间共享绑定状态，熟悉开发者工具的人也仍可绕过前端门禁。若要“一张订单全网只能绑定一台设备”，必须把验单与设备绑定迁到服务器或小红书官方订单接口，前端只接收一次性会话凭证。

## 一键发布到 GitHub Pages

1. 在 GitHub 新建仓库，把本目录内的全部文件上传到仓库根目录。
2. 打开仓库 **Settings → Pages**，在 **Build and deployment / Source** 选择 **GitHub Actions**。
3. 推送到 `main` 或 `master` 后，工作流 `.github/workflows/deploy-pages.yml` 会自动检查、构建并发布。
4. 发布完成后，地址通常为 `https://你的用户名.github.io/仓库名/`。

本项目使用 `#` 路由，分享出的结果链接可在 GitHub Pages 子目录中直接打开，并且仍会先显示订单验证页。

正式面向付费客户前，请阅读 [发布与合规说明](发布与合规说明.md) 与 [第三方声明](THIRD_PARTY_NOTICES.md)。

**Fèiwù Type Indicator · v0.4** — 自嘲式恋爱人格测试，测测你在恋爱里是哪种废物。

> 🔗 在线体验：[fwti.innei.dev](https://fwti.innei.dev)

完整题库、计分规则与学术锚定以仓库根目录 `**[DRAFT.md](DRAFT.md)`** 为设计母本（实现以代码为准；二者若有出入，以 DRAFT 为语义 brief）。

## 关于

1 道前置题（META，不计分，仅分流措辞与扩展题库）+ **20 道共享主干**维度题 + **1 道共享彩蛋** + 四状态专属扩展（dating / ambiguous / crush / solo，各 **7–9** 题）+ 选项触发的 **follow-up** 子题；单路径约 **30–37** 题，随状态与路径浮动。

**10** 个可叠加隐藏标签 + **10** 种隐藏人格，四大维度 **ratio** 归一化计分后交叉分析，匹配你的恋爱废料类型。

仅供娱乐，请勿用于相亲、挽回、分手、发律师函或自我攻击。

虽然是纯娱乐，四大维度的理论锚都有文献出处（见文末「学术依据」与 DRAFT「一、四大维度」表）。

## 测验结构（v0.4 摘要）

- **前置 META**：恋爱状态四选一，决定扩展段题库；途中改选会清空其余答案（扩展集合不同）。
- **共享主干**：全体必经的 20 维题 + Q31 共用彩蛋；措辞在去语境化前提下四状态可读。
- **扩展段**：按状态加载切身场景题；部分题目含分支，可递归触发 follow-up（深度有硬上限）。
- **题型**：程度类题为 **5 档**（±2/±1/0），情境角色类题为 **3 档**（+2/0/-2），按题归一化后按维度取比例均值，避免题量偏差。
- **分享链接**：**Codec v2** 携带状态前缀；**v1 旧链**走 legacy 解码与渲染，结果页带「旧版结果」徽标，不与新 runtime 混算。

## 四大维度


| 维度       | 极性 A      | 极性 B       | 理论锚（简述）                                            | 核心问题      |
| -------- | --------- | ---------- | -------------------------------------------------- | --------- |
| **主动性**  | G（Go·冲）   | D（Dwell·蹲） | 接近–回避 / BIS-BAS（Gable, 2006; Carver & White, 1994） | 冲锋还是蹲坑？   |
| **情绪表达** | Z（Zha·炸）  | R（Ren·忍）   | 情绪调节 ERQ（Gross & John, 2003）                       | 炸了还是忍了？   |
| **亲密需求** | N（Nian·黏） | L（Li·离）    | 依恋「回避」维（Brennan et al., 1998; Fraley et al., 2000） | 黏人精还是独处王？ |
| **安全感**  | Y（Yi·疑）   | F（Fo·佛）    | 依恋「焦虑」维（同上）                                        | 疑心病还是佛祖？  |


四字母组合 → 2⁴ = **16 种** 明面人格 + **10 种** 隐藏人格。

**隐藏人格判定**（命中即覆盖 16 格，优先级见 DRAFT §5）：  
`MAD → RAT → PURE → CPU → CHAOS → E-DOG → BENCH → VOID → LIMBO → ALL`  
其中 **VOID · 电子断联户** 仅 **solo** 状态可触发；**LIMBO · 意难平学家** 仅 **crush** 可触发。**ALL · 我全都要** 为多维平票等情形的兜底。命名史与 DRNY `GHOST` 的区分见 DRAFT 「v0.4 修订说明」。

## 16 种人格一览

（英文梗、网络梗别名与触发细节见 DRAFT 表。）


| 代号   | 人格      | 英文梗   | 一句话                  |
| ---- | ------- | ----- | -------------------- |
| GZNY | 自爆卡车    | BOOM  | 爱你爱到自毁，怀疑你怀疑到自闭。     |
| GZNF | 恋爱脑     | CRUSH    | 脑子空了，全是你。            |
| GZLY | 醋王      | LEMON    | 我不是在吃醋，我是在喝醋。        |
| GZLF | 海王 / 浪子 | HW       | 爱得热烈，走得潇洒，鱼塘永远在扩建。   |
| GRNY | 卑微战士    | BEIWEI   | 把自己低到尘埃里，还觉得尘埃嫌弃我。   |
| GRNF | 舔狗      | SIMP     | 你骂我我汪汪叫，你打我我摇尾巴。     |
| GRLY | 钓系大师    | LVCHA    | 我不是在恋爱，我在下棋。         |
| GRLF | 正常人     | NPC      | 理论上存在的生物。            |
| DZNY | 定时炸弹    | FUZE     | 表面风平浪静，内心已经核爆十七次了。   |
| DZNF | 林黛玉     | LINDDY   | 风吹一下我就能哭半小时。         |
| DZLY | 刺猬      | OUCH     | 别靠近我！……你怎么真走了？       |
| DZLF | 猫系恋人    | MEOW     | 叫你别碰我，没叫你走啊。         |
| DRNY | 透明人     | GHOST    | 我的存在感和我的安全感一样低。      |
| DRNF | 树懒      | BAILAN   | 恋爱这件事急不来的……大概……三年后见？ |
| DRLY | 仙人掌     | FROST    | 三年浇一次水就够了。           |
| DRLF | 已读不回    | GONE     | 看到了。然后呢？             |


另有隐藏人格：**ALL / RAT / PURE / MAD / E-DOG / CHAOS / CPU / BENCH / VOID / LIMBO**（释义与立绘提示见 `[PROMPT.md](PROMPT.md)`）。

## 隐藏叠加标签

不改变四字母结果，满足条件时在结果页叠加显示。**v0.4** 触发条件以语义锚 + 维度 ratio 为主（见 DRAFT §3 简表；题面 ↔ 语义 id 见 `src/logic/semanticIds.ts`）。  
含：**撤回大师 / 夜谈冠军 / 朋友圈考古学家 / 薛定谔的前任 / 电子乙方 / 人形 ATM / 空想家 / 典中典 / 普信选手 / 退退退**（退退退依赖答题「改答」次数，**不**写入分享 hash）。

## Explain-result skill

仓库自带一个 agent skill，可让支持 skill 协议的 AI 助手在拿到任意一条 FWTI 分享链接（或裸 hash）时，从解码、重算四维 ratio、复跑隐藏人格与叠加标签触发、到对照学术锚一气呵成地回答「我为什么被判成这一种」。脚本本身不做任何 AI 调用，只输出结构化 JSON，真正的叙事由 AI 按 skill 模板完成。

**结果页右上角的「AI 解读」按钮会自动复制分享链接并把你跳到这一节** —— 之后把链接交给 AI，让 AI 按下文调用即可。

### 能做什么

- 把 hash 解码为完整答题路径，逐题展示选项原文与 delta。
- 按 |ratio| 递降展示四维得分，并标出每维最决定性的证据题。
- 跑一遍九型隐藏人格的触发条件，告诉你差在哪一步、要改哪道题才能翻盘。
- 列出 10 条叠加称号的命中 / 未中情况（退退退除外，因其不入 hash）。
- 对齐 `DRAFT.md` §八 的引文给出构念对应（ECR-R / ERQ / BIS-BAS 等）。
- 自动处理 v1 旧链：识别后拒绝套用 v0.4 规则，避免误读。

### Skill 存放位置

Skill 定义在 `.claude/skills/explain-result/SKILL.md`，同时在 `.agents/skills` 下做了符号链接——`.claude/`、`.agents/` 两个约定目录下都能被发现，凡是读取这两个目录中任意一个的 agent 运行时（Claude Code、其他支持 skill 规范的 CLI、自建的 agent 框架等）都可自动加载，无需复制。新增其他厂商的约定目录时，再追加一条软链即可。

脚本在 `scripts/explain-result.ts`，依赖 [Bun](https://bun.sh)（`bun` 需在 PATH）。

### 使用方法

在装有 skill 的 agent 会话里，于仓库根目录启动后直接调用：

```
/explain-result https://fwti.innei.dev/result/v2.c.MTAz...
/explain-result v2.c.MTAz...
```

或直接把链接丢给 AI 并要求「用 explain-result skill 解读这条链接」。

### 想手动跑脚本也可以

```bash
bun scripts/explain-result.ts "<url-or-hash>"
```

输出为一段 JSON（四维 ratio、perQuestion、hiddenPersonalityEval、hiddenTitleEval、citations 等），可直接塞给任何 LLM 做二次解读，或接到自建工具链里。

### 叙事风格

Skill 的叙事目标读者是「完全不懂心理学、不懂打分逻辑的普通用户」，全程大白话优先、学理作为注脚、引用题目原文作为证据。技术 token（code、英文构念名、作者年份引文）第一次出现时会在旁边给出白话翻译。详见 `.claude/skills/explain-result/SKILL.md` 的 Voice 段落。

### 不适用的场景

- 要新增 / 修改题目或评分逻辑——请直接改 `src/data/` + `src/logic/`。
- 链接非本仓库产物——skill 只认 FWTI 自家 codec。

## 技术栈

- **Solid.js** — UI
- **Vike** — 文件路由、预渲染与客户端路由
- **Vite** — 构建
- **html-to-image** — 结果分享图
- 部署 **Vercel**

## 本地开发

```bash
pnpm install
pnpm dev
```

构建：

```bash
pnpm build
```

肖像管线见 `CLAUDE.md`（`pnpm portraits:build`）。

## 学术依据

四大维度设计参考成人依恋（Hazan & Shaver, 1987; Brennan, Clark & Shaver, 1998; Fraley et al., 2000）、情绪调节量表（Gross & John, 2003 ERQ）、接近–回避动机（Carver & White, 1994 BIS/BAS; Gable, 2006）。

本测试 **未经心理测量学信效度验证**，不是诊断工具。若要严肃了解依恋风格，请使用正规 **ECR-R** 等量表。

## License

[MIT](LICENSE)
