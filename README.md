# 在场 · Tech Notes

一个以源码阅读和工程实践为核心的静态技术博客。视觉版式参考纪录公社的留白、双栏与标签系统，文章内容整理自 RAG、Agent、ETL 和 Python 项目。

## 阅读地址与托管方式

目标仓库：[xiaocha653830-tech.github.io](https://github.com/xiaocha653830-tech/xiaocha653830-tech.github.io)。它是 GitHub Pages 用户站点仓库；站点地址为 `https://xiaocha653830-tech.github.io/`。仓库的 Pages 来源应设为 `main` 分支的根目录；首页为根目录的 `index.html`。上线状态需要在推送后以实际站点响应确认。

所有页面使用 hash 路由，无服务端重写要求。首屏内容、文章正文、字体和代码高亮文件都打包在站点中。Tailwind 和 Font Awesome 保留用户指定的 CDN，核心布局和交互由本地 CSS 与 JavaScript 提供。

## 已实现

- 首页、技术文章、四个专题、项目实践和关于页。
- 八篇 Markdown 技术文章，含目录、代码高亮、代码复制、来源链接和阅读进度。
- 全文搜索、分类与标签筛选、阅读时长排序、浏览器本地收藏、Markdown 下载。
- 手机布局、键盘导航、减少动态效果和打印样式。

文章来源指向已核对的 GitHub 仓库文件；未单独发布的示例与工具摘录收录在 `content/references/`。本博客不会在公开页面或下载文件中引用个人电脑上的绝对路径。文章标明了核对范围，避免把设计建议写成已上线功能。

## 本地预览

在项目目录中运行：

```powershell
node scripts/build-content.mjs
python scripts/preview.py
```

然后打开 `http://127.0.0.1:4173/`。预览脚本仅监听本机，只提供发布所需的静态页面与资源，不会运行来源项目的数据库或后台服务。按 `Ctrl+C` 结束预览。

也可直接打开 `index.html`。部分浏览器对 `file://` 页面的剪贴板和下载操作有限制，交互验收以本机 HTTP 预览为准。

## 新增或修改文章

1. 在 `content/articles/` 中编辑或新增 `<id>.md`，正文使用二级标题、代码围栏和 Markdown 表格。
2. 在 `content/catalog.json` 的 `articles` 中维护标题、摘要、日期、标签、专题、来源仓库链接与行号。新文章还需加入专题和项目的 `articles` 列表。
3. 运行 `node scripts/build-content.mjs` 更新 `content.generated.js`。
4. 运行 `node scripts/build-site.mjs` 检查内容并生成 `dist/`。该命令只复制固定清单中的公开资源。
5. 本地打开文章，检查来源链接、代码块、目录、筛选与手机布局。

`content.generated.js` 是页面运行时使用的内容包；`content/articles/` 和 `content/catalog.json` 是维护源文件。修改正文后必须重新生成内容包。

## GitHub Pages 文件

`dist/` 中的文件对应目标仓库根目录。根目录已有的 `index.html` 占位文件需要由本项目首页替换。`.nojekyll` 避免 GitHub Pages 的 Jekyll 处理静态目录。这里不需要改动 GitHub Actions 或配置秘钥。

发布前请检查 `dist/` 的文件清单和 `content/catalog.json` 的引用；不要把 `research/` 或用户目录中的原始文档同步到公开仓库。目录 `assets/vendor/` 包含 Marked、DOMPurify、highlight.js 的固定版本及许可证；`assets/` 含 Barlow Condensed 字体和 Unsplash 示例摄影。

## 内容与核对范围

八篇文章按四条路径组织：RAG 与检索、Agent 工作流、数据工程、Python 工具。上游仓库主要是 [RAG-KnowledgeBase](https://github.com/xiaocha653830-tech/RAG-KnowledgeBase)、[ETL-Agent](https://github.com/xiaocha653830-tech/ETL-Agent) 和 [Deep-Agent](https://github.com/xiaocha653830-tech/Deep-Agent)。具体文件链接位于各文章末尾。

项目列表中的状态只说明文章核对范围，不代表完整产品验收。已发布的源文件与文章中的代码叙述对应；如果上游仓库继续变化，应复核相关段落和行号。

## 设计素材

- 版式灵感：[纪录公社](https://jilucommune.com/cn)
- 首页摄影：[Unsplash 图片](https://images.unsplash.com/photo-1511818966892-d7d671e672a2)
- 字体：Barlow Condensed，许可证见 `assets/OFL.txt`
- Markdown：Marked、DOMPurify、highlight.js，许可证见 `assets/vendor/`

文章与品牌文本为此博客独立整理。没有管理后台、服务端评论或订阅系统；收藏只保存在当前浏览器。
