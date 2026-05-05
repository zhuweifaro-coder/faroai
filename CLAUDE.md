# 给 AI Agent 的工作手册（CLAUDE.md / AGENTS.md）

> **重要**：你（Claude / OpenClaw / 任何 AI 助手）读这个文件之前，**不要**对本仓库做任何修改。
> 这个文件优先级 > README.md > 你自己对网站结构的猜测。

---

## 一、仓库性质

这是一个**纯静态网站**（HTML + CSS + JS，无生成器、无构建步骤），通过 Cloudflare Pages 部署到 `https://www.faroai.net`。

仓库根目录所有文件直接对应线上 URL：
- `index.html`  →  `https://www.faroai.net/`
- `blog.html`   →  `https://www.faroai.net/blog.html`

---

## 二、文件职责映射（**必须严格遵守**）

| 文件 | 是什么 | 什么时候改 |
|---|---|---|
| `index.html` | **主页**（首页 / Hero / 功能介绍 / 定价等） | **仅当**用户明确说"主页"、"首页"、"index"、"hero 区"、"功能卡片"、"定价"、"导航栏" |
| `blog.html` | **博客页面**（独立页面，含文章列表 + 文章正文）| **仅当**用户说"博客"、"博文"、"文章"、"blog"、"加一篇"、"更新博客"、"发布"、"posts" |
| `styles.css` | 全站共用样式 | 改全局风格、配色、字体时 |
| `blog.css` | 博客**专属**样式 | 仅当只影响博客页 |
| `script.js` | 主页交互 | 仅改主页交互时 |
| `blog.js` | 博客交互 | 仅改博客交互时 |
| `个人概况_2026_v3.html` | **个人简历附件**（不要主动修改）| 用户明确要求时才动 |
| `deploy-to-cloudflare.sh` | 部署脚本 | 不要改 |
| `deploy.sh` | git push 辅助 | 不要改 |
| `README.md` | 项目说明 | 不要改 |
| `CLAUDE.md` | **本文件**（Agent 操作手册）| 不要改 |

### 决策规则（避免误判）

```
用户说"更新博客" / "加一篇博文" / "改下博客"
   →  你的目标文件是 blog.html
   →  绝对不要改 index.html

用户说"更新主页" / "改首页" / "调整 hero 区"
   →  你的目标文件是 index.html
   →  绝对不要改 blog.html

用户没说清楚（比如"更新一下网站"）
   →  停下来问用户："你要改哪一页？主页(index.html) 还是博客页(blog.html)？"
   →  不要凭直觉去改
```

---

## 三、博客增删文章的标准流程

`blog.html` 内部结构：
- 顶部导航 / 头部
- 文章列表区：每篇文章是一个 `<article class="blog-post">` 块
- 每个 `<article>` 含标题 `<h2>`、日期、标签、摘要 `<p>`、正文等

**加新文章**：
1. 在 `blog.html` 文章列表区**最上面**插入新的 `<article class="blog-post">` 块（让最新文章排在最上面）
2. 复用现有文章的 HTML 结构（class 名要保持一致，否则 blog.css 样式不生效）
3. 不要新建文件，直接在 `blog.html` 里加 `<article>` 块

**改现有文章**：
1. 找到对应 `<article>`（用文章标题或日期搜索）
2. 修改正文、摘要等
3. 不要碰其他 `<article>` 块

**删文章**：
1. 找到对应 `<article>`
2. 删除整个 `<article>...</article>` 块（含开闭标签）

---

## 四、改完之后的部署步骤（**必须执行**）

改完代码后，**不要只 commit 不 push**——线上看不到改动。完整流程：

```bash
cd <仓库路径>

# 1. 看你改了什么
git status
git diff

# 2. commit
git add -A
git commit -m "<具体改了什么>，比如：blog: 添加 2026-05-04 量化交易心得"

# 3. push 到 GitHub（main 分支）
git push origin main

# 4. Cloudflare Pages 会自动从 GitHub 抓 main 分支并部署
#    通常 1-2 分钟后 https://www.faroai.net 生效
#    不需要手动跑 deploy-to-cloudflare.sh（除非 Cloudflare 自动部署关了）

# 5. （可选）等 90 秒后 curl 验证线上生效
sleep 90 && curl -s https://www.faroai.net/blog.html | grep "<你刚加的关键字>"
```

---

## 五、常见误操作避免清单

❌ **不要做**：
- 把博客文章的内容塞进 `index.html`（除非用户说"在主页加一段简介"）
- 改 `<header>` 导航栏的链接结构（除非用户明确要加新页面入口）
- 删除现有 `<article>` 块（除非用户明确说删哪一篇）
- 在仓库根新建 `blog/` 目录、把 `blog.html` 移进去（重构改动应该用户明确批准）
- 创建新 .html 页面（这个网站只有 index/blog 两个主页面，不要随便加）
- 改 `deploy*.sh` 部署脚本

✅ **应该做**：
- 改之前先 `cat blog.html | head -50` 看现有结构
- 在 `<article>` 里直接加内容，保持 class 名一致
- commit message 写清楚"blog:" 或 "index:" 前缀，标明改了哪一页

---

## 六、你不确定时的兜底动作

> 当你对"用户到底要改哪一页"有 5% 以上的不确定，**停下来问**。
> 不要"猜测着改"——主页和博客被混淆是这个项目最常见的事故。

模板提问：
> 炜哥，我准备 `<具体动作>`，先确认一下：
> - 你说的"<用户原话里的关键词>"对应的是
>   主页 (`index.html`) 还是博客页 (`blog.html`)？
> 等你回复后我再动手。

---

最后更新：2026-05-04


---

## 七、🚨 index.html 保护铁律（2026-05-05 加）

**因为发生过多次 "AI 把主页简化" 的事故，新增以下绝对禁令：**

1. **index.html 是经过精心设计的完整版**（约 880 行，含：6 个核心功能卡 / 4 个使用场景 / 3 个定价 / 团队介绍 / 登录模态框）。**这个版本是 canonical，永远不要"简化"它。**

2. 修改 blog.html 时，**严格禁止**任何对 index.html 的"顺手优化"、"清理冗余"、"改进结构"等行为。即使你觉得 index.html 有"问题"——**忽略它**。

3. 改 blog.html 后 push 前必跑：
   ```bash
   git diff origin/main -- index.html
   ```
   如果有任何输出（不论多少），**立即 git checkout origin/main -- index.html 还原**，不要 push 包含 index.html 改动的 commit。

4. 用户**只有明确说**「修改主页 / 改 index.html / 调整 hero 区 / 改主页定价」时，才能动 index.html。其它一切情况都不许碰。

5. 如果模型自己觉得 "我应该顺便整理一下 index.html"——**这是幻觉，立即停下**。
