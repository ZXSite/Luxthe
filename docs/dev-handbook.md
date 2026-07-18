# LuxTHE Hugo 主题开发完全工作手册

> 从 v1 到 v3.7.7 — 完整开发历程、架构演进、关键修复、核心优化与已知陷阱

**仓库**: `ZXSite/LuxTHE`  
**部署站点**: `luxen.cn` (Cloudflare Pages)  
**Hugo 版本**: Extended 0.164.0  
**当前版本**: v3.7.7 (`3db987e`)

---

## 目录

1. [版本时间线](#1-版本时间线)
2. [v2.x 时代：安全修复与工程奠基](#2-v2x-时代安全修复与工程奠基)
3. [v3.0.x：安全加固与 CI 体系化](#3-v30x安全加固与-ci-体系化)
4. [v3.1–v3.3：国际化、无障碍、移动端打磨](#4-v31v33国际化无障碍移动端打磨)
5. [v3.4–v3.5：固定模式布局架构重构](#5-v34v35固定模式布局架构重构)
6. [v3.6.x：正式发布与审计补完](#6-v36x正式发布与审计补完)
7. [v3.6.9.x–v3.7.7：增量修复与 CI 门禁](#7-v369xv377增量修复与-ci-门禁)
8. [架构决策记录 (ADR)](#8-架构决策记录-adr)
9. [Hugo 特有陷阱速查表](#9-hugo-特有陷阱速查表)
10. [CSS/SCSS 调试速查表](#10-cssscss-调试速查表)
11. [CI 体系完整清单](#11-ci-体系完整清单)
12. [发布检查清单](#12-发布检查清单)

---

## 1. 版本时间线

```
v2.2.0  ─── 初始发布 (含 5 个 P0 构建阻断)
v2.2.1  ─── P0 构建修复 (crypto.FNV32a → hash.FNV32a 等)
v2.3.0  ─── 安全加固: XSS 修复 (responsive-image %q), javascript: URL 过滤
v2.4.0  ─── 性能优化: partialCached, CI 扩展
v3.0.0  ─── 安全硬化 + 缓存正确性 + CI 修复

v3.1.0  ─── CI 恢复 + 双语示例站 + 空分类优雅处理
v3.2.0  ─── 触摸目标 44px + safe-area + 分页/RSS i18n
v3.3.0  ─── CI 修复 + i18n + 对比度 + 无障碍 + 移动端
v3.3.1  ─── 夜间提示框 + i18n + 移动端修复
v3.4.0  ─── 移动端 header + 紧凑搜索 + 归档三栏 + 页脚改造
v3.5.0  ─── 移除侧栏重复 (简介 + 日夜开关去重)
v3.5.1  ─── 固定模式布局: luxen.cn 全貌烘焙进主题

v3.6.0  ─── 头像支持 (桌面圆头像 + 移动端 mini)
v3.6.1  ─── 主题内置默认头像 (3 态语义: 空/关闭/自定义)
v3.6.2  ─── 四分类预设 + 默认配置驱动部署
v3.6.7  ─── P1 修复 (CI YAML + 代码高亮作用域 + search focus)
v3.6.8  ─── **正式发布**: 全部 P1+P2 解决, 内置 favicon, 13 封面, 对比度全达标

v3.6.9.1 ─── 英文分类页中文泄漏 + 双分隔线 + 文档同步
v3.6.9.2 ─── 移动端暗色开关强调色
v3.6.9.3 ─── 空侧栏守卫 + 中文本地化 + 分页配置清理
v3.7.7   ─── **正式版**: CI 门禁补全 + 空白卫生
```

---

## 2. v2.x 时代：安全修复与工程奠基

### 2.1 v2.2.0 → v2.2.1：5 个 P0 构建阻断修复

| # | 问题 | 位置 | 修复 |
|---|------|------|------|
| 1 | `sidebar/site.html` 多余的 `end` | layouts | 删除多余的结束语句 |
| 2 | site sidebar `class`/`aria-label` 语法损坏 | layouts | 修复属性拼接 |
| 3 | widgets aside 多余引号 | layouts | 修正引号配对 |
| 4 | `crypto.FNV32a` 不存在 | `helper/cover.html` | → `hash.FNV32a` |
| 5 | `zh-cn.toml` 重复 `[footer]` | i18n | 合并为单节 |

**教训**: Hugo 函数名以 `crypto.FNV32a` 出现是 Stack 主题残留，Hugo 0.164 中正名为 `hash.FNV32a`。TOTOML 重复 section 头会静默覆盖前一个 section。

### 2.2 v2.2.1 → v2.3.0：安全加固 (3 个 P0)

**P0-01: 图片属性 XSS (`%q | safeHTMLAttr`)**

**根因**: Go 的 `%q` 生成的是 Go 字符串转义（反斜杠），不是 HTML 属性编码。浏览器不认反斜杠转义，导致双引号可以闭合属性并注入新属性。

**受影响文件**:
- `layouts/_partials/helper/responsive-image.html`
- `layouts/_partials/helper/thumbnail-image.html`
- `head.html` / `opengraph/provider/base.html` / `opengraph/provider/twitter.html`

**攻击向量**:
```markdown
文章标题: X" onerror=alert(document.domain) x="
```

**修复**: 放弃动态属性拼接，显式输出每个属性：
```go-html-template
<img
    src="{{ index $attributes `src` }}"
    width="{{ index $attributes `width` }}"
    height="{{ index $attributes `height` }}"
    alt="{{ default `` (index $attributes `alt`) }}"
    {{ with index $attributes `loading` }}loading="{{ . }}"{{ end }}
>
```

每个值由 Hugo 的 HTML 上下文自动转义，不再绕过安全机制。

**P0-02: Markdown `javascript:` URL**

**位置**: `layouts/_markup/render-link.html`

**根因**: `safeURL` 的含义是"开发者确认此 URL 已可信"，会关闭 Hugo 默认的 `javascript:`/`data:` 等危险 scheme 过滤。

**修复**:
```go-html-template
<!-- 安全做法 -->
<a href="{{ $destination }}">...</a>
<!-- 需要额外 scheme 时用 urls.Parse + 白名单 -->
```

**白名单**: `http`, `https`, `mailto`, 可选 `tel`

**P0-03: 归档锚点 `year-` prefix**

Widget 链接 `/archives/#2026` 但归档页目标 `id="year-2026"`，锚点无法跳转。

**修复**: 在归档 widget 中拼接 `year-` prefix：
```go-html-template
{{- $id := printf "year-%s" (lower (replace $item.Key " " "-")) -}}
<a href="{{ $archivesPage.RelPermalink }}#{{ $id }}">
```

### 2.3 v2.3.0 → v3.0.0：性能与工程化

**封面计算缓存**:
```go-html-template
{{- $cover := partialCached "helper/cover.html" . .RelPermalink -}}
```
无 variant 的 `partialCached` 会导致跨页面共享首个计算结果（封面污染）。必须加 `.RelPermalink` 作为缓存 variant。

**CI 扩展**: 安全 fixture、双语构建、内部链接验证、i18n 键一致性检查。

**Hugo Themes 规范**:
```toml
# theme.toml
[module]
  [module.hugoVersion]
    extended = true
    min = "0.164.0"

[original]
    name = "Hugo Theme Stack"
    author = "Jimmy Cai"
    repo = "https://github.com/CaiJimmy/hugo-theme-stack"
```

---

## 3. v3.0.x：安全加固与 CI 体系化

### 3.1 双语示例站 + 空分类优雅处理 (v3.1.0)

**ContentDir 隔离**（🔴 关键）:
```toml
[languages.zh-cn]  contentDir = "content/zh-cn"
[languages.en]     contentDir = "content/en"
```
无 `contentDir` 时，Hugo 将 `content/en/` 下的文件也归入默认语言分类树，导致英文文章的分类泄漏到中文分类树。

### 3.2 触摸目标与移动端安全区 (v3.2.0)

| 修复 | 效果 |
|------|------|
| 汉堡按钮 44×44px | WCAG 2.5.5 最小触摸目标 |
| `safe-area-inset` | iPhone 刘海/底部条适配 |
| `dvh` 动态视口 | 移动浏览器地址栏收放 |
| 分页/RSS i18n | 全部硬编码英文 → i18n 键 |

### 3.3 代码高亮对比度 (v3.3.0)

**变量作用域陷阱**: 在 `.chroma {}` 块内定义的 SCSS 变量只在块内可见。声明必须放在文件顶部。

**模式**: 定义在 `light.scss`/`dark.scss` → 引用在 `common.scss` → 验证在编译 CSS。

---

## 4. v3.1–v3.3：国际化、无障碍、移动端打磨

### 4.1 无障碍补全

| 组件 | 修复 |
|------|------|
| Skip Link | `baseof.html` 新增，跳转到 `#main-content` |
| 汉堡按钮 | `:focus-visible { outline: 3px solid accent }` |
| 复制按钮 | `:focus-visible { opacity: 1 }` |
| 搜索框 | `outline: 0` → `&:focus-visible { outline: 3px }` |
| 页面 H1 | 首页/搜索/归档各补 visually-hidden H1 |
| widget-sidebar | DOM 顺序移到 main 之后（屏幕阅读器先读内容） |

### 4.2 移动端搜索统一几何结构

桌面搜索是浮动 label + 40px top padding。隐藏 label 后 padding 仍然存在（🔴 陷阱）。正确修复：
```scss
.widget-search .search-form label { display: none !important; }
.widget-search .search-form input {
    padding-top: 12px !important;   /* override 40px */
    padding-bottom: 12px !important;
    height: 44px !important;
}
```

移动端搜索使用 `grid-template-columns: minmax(0, 1fr) 44px` 统一输入框+按钮高度。

### 4.3 移动端日夜开关 (v3.6.9.2 补充)

**问题**: 移动端只有图标显隐规则，没有强调色。SVG 使用 `currentColor`，需要在按钮级别设置颜色。

**修复**:
```scss
[data-scheme="dark"] #dark-mode-toggle-mobile {
    color: var(--accent-color);
}
```

### 4.4 已知未解决的移动端开关问题

v3.6.8 中曾尝试 6 次修复移动端日夜开关在 iOS Safari 上不响应的问题（SCSS 注释、touch-action、双事件监听等），全部失败并已回退。已知可能原因：
- iOS Safari touch 事件模型与 grid-placed button 的交互
- `pointer-events` 被父级禁用
- 不可见覆盖层 (z-index/pseudo-element)

**教训**: 2 次失败即停止，不回退 → 不堆砌推测性修复。

---

## 5. v3.4–v3.5：固定模式布局架构重构

### 5.1 关键的架构教训

**v3.4.0 失败**: 模板被"主题风格"重写（而非逐字搬运），声称实现了未实际存在的功能，无构建 diff 验证。结果：重复简介+开关、文章页丢失 widget、归档崩成 2 列。

**v3.5.1 成功的关键**: 逐字复制站点覆盖 → 进主题 → 参数化仅个人信息（intro/email/telegram）→ 零变化 diff 验证后再推送。

**铁律**: 站点自定义覆盖文件原样搬入主题，不信任"通过配置实现相同效果"的间接方案。构建后必须与基线 diff 对比（CSS 指纹 + HTML 结构），零变化才可推送。

### 5.2 固定模式后的站点配置极简

```toml
[params.sidebar]
    introduction = "一位北京的大叔..."
    email = "hi@luxen.cn"
    telegram = "LuxenCN_bot"
```

仅此 3 行。主题自带：移动 header、紧凑搜索、归档三栏、文章 widget（搜索→分类→TOC）、可点击页脚。

---

## 6. v3.6.x：正式发布与审计补完

### 6.1 头像与 Favicon 的三态语义

| 参数 | 空值 | 设为 `"none"` | 自定义路径 |
|------|------|--------------|-----------|
| `sidebar.avatar` | 主题默认头像 | 不渲染 | 站点自己的图片 |
| `params.favicon` | 主题默认 favicon | 不渲染 | 站点自己的 favicon |

**Favicon 纯路径设计**: `<text>` 在不同平台渲染不一致，改用 `<path>` 几何形状。

### 6.2 Widget 解析器 (resolve.html)

解析器是 widget 渲染的**唯一真相源**。规则：
- 空配置数组 = 无 widget 侧栏
- `search` 仅在搜索页+JSON 输出存在时渲染
- `toc` 仅在文章有有效目录时渲染 (≥100 字符)
- 未知类型静默丢弃；同类型只渲染一次
- search/404 特殊页永远无 widget 侧栏
- `categories`/`tag-cloud` 在分类/标签为空时也跳过 (v3.6.9.3)
- `archives` 在归档页不存在或无条目时跳过 (v3.6.9.3)

### 6.3 随机封面系统

文章无 `image` frontmatter 时，`hash.FNV32a(.RelPermalink) % len(covers)` 从 13 个几何 SVG 中确定性选择封面。同一篇文章永远获得相同封面。

### 6.4 代码高亮全 Token 对比度 ≥4.5:1

| Token | 亮色 | 暗色 |
|-------|------|------|
| Pink | `#c0004f` (6.0:1) | `#ff80a0` (6.3:1) |
| Purple | `#6840a0` (7.1:1) | `#c09aff` (5.2:1) |
| Comment | `#5f6368` (5.8:1) | `#b8b39f` (7.1:1) |
| Highlight bg | `#eef1f3` | `#30363a` |

### 6.5 搜索框焦点无障碍

**双焦点环陷阱**: 父级 `:focus-within` + 子级 `:focus-visible` 同时存在→移动端出现两个焦点环。

**修复**: 移动端子元素抑制：
```scss
.site-sidebar__hamburger-search .search-form input:focus-visible,
.site-sidebar__hamburger-search .search-form button:focus-visible {
    outline: 0;
}
```

### 6.6 CSS 重复声明检测

v3.6.7 中发现 `.widget-search .search-form p` 的 margin/padding 规则被声明两次。检查方法：
```bash
grep -A3 '.widget-search .search-form p' *.scss | grep -c 'margin: 0'
# 结果 >1 = 重复
```

### 6.7 LibSass `rgb()` 空格语法陷阱

Hugo 内置 LibSass **不支持** `rgb(255 255 255 / 55%)`，必须使用逗号分隔的 `rgba(255, 255, 255, 0.55)`。

---

## 7. v3.6.9.x–v3.7.7：增量修复与 CI 门禁

### 7.1 v3.6.9.1：英文分类页中文泄漏 + 双分隔线

**问题 1**: `list.html` 硬编码 `{{ len .Pages }} 个标签` / `{{ len .Pages }} 个分类`，导致英文页面显示中文。

**修复**: 新增 i18n 键 `[list.tag]` / `[list.category]`，模板改用 `T "list.tag" (len .Pages)`。

**问题 2**: `.widget-categories { border-bottom }` 全局作用，与 widgets.scss 已有的 `+ :is(...)` 相邻选择器顶部边框重叠，形成双分隔线。

**修复**: 删除全局 border-bottom，改为作用域限定：
```scss
.widget-sidebar .widget-categories + .widget-toc {
    border-top: 1px solid var(--card-separator-color);
    padding-top: var(--widget-separation);
}
```

### 7.2 v3.6.9.3：中文本地化批量修复

**新增 `layouts/_partials/data/display-title.html`**: 统一页面标题 i18n 逻辑。

**修复范围**:

| 页面 | 修复前 | 修复后 |
|------|--------|--------|
| 中文分类根页 | `<title>Categories</title>` | `<title>分类</title>` |
| 中文分类详情 | `<p>Categories</p>` | `<p>分类</p>` |
| 中文 404 | `<title>404 Page not found</title>` | `<title>页面未找到</title>` |
| 中文第二页 | `<title>Page 2 - 首页</title>` | `<title>第 2 页 - 首页</title>` |
| 封面 alt | `Featured image of post 博客正式上线了` | `《博客正式上线了》的特色图片` |

**关键实现**: 封面 alt 使用 `T "article.featuredImage"` 而非 `printf`：
```go-html-template
"alt" (T "article.featuredImage" (dict "Title" $Page.Title))
```

### 7.3 主题级分页配置无效 (v3.6.9.3)

**根因**: Hugo 主题组件的 `[pagination] pagerSize` 不会生效，分页大小必须由使用主题的站点设置。

**修复**: 删除主题根 `hugo.toml` 中的 `[pagination] pagerSize = 6`，保留 exampleSite 中的 `pagerSize = 8`。

### 7.4 CI 门禁补全 (v3.7.7)

新增 3 个 CI 步骤：

1. **最终发布回归断言**: 中文分类标题、分类父级标签、中文 404、无 `Featured image of post` 残留
2. **最小空站点验证**: 无分类→无标签→无归档 → `layout-shell--without-widgets`，不渲染空侧栏
3. **分页标题 i18n**: pagerSize=1 构建，验证 `第 2 页 - 首页`

---

## 8. 架构决策记录 (ADR)

### ADR-001: 选择 Git Submodule 而非 Hugo Modules

**决策**: 不使用 `go.mod` / `module.toml` / Hugo Modules。

**理由**:
- CF Pages 无法克隆私有 GitHub 仓库的 HTTPS submodule（404 错误）
- Hugo Modules 引入 `GOPRIVATE` + GitHub token 配置复杂度
- Submodule 版本固定，部署可预测

**代价**: 需手动 `git submodule update --remote`

### ADR-002: 主题不承载站点级自定义 CSS

**决策**: `assets/scss/custom.scss` 是空的用户覆盖入口。核心样式放在 dedecated SCSS 文件中（`_sidebar-extras.scss` 等）。

**理由**: 用户创建自己的 `custom.scss` 会完全覆盖主题的同名文件。如果主题把核心样式放在 `custom.scss`，用户就会丢失这些功能。

### ADR-003: 固定模式 (Fixed Mode) 自 v3.5.1

**决策**: luxen.cn 的完整布局（侧栏、widget、归档三栏、页脚、移动 header、头像、分类预设）全部烘焙进主题。

**理由**: 站点级布局覆盖会导致版本漂移——站点和主题的 templates 不同步，升级时断裂。

### ADR-004: Widget 解析器作为唯一真相源

**决策**: `layouts/_partials/widget/resolve.html` 是 widget 决策的唯一真相源。其他模板（`baseof.html`、`widgets.html`、`has-widget.html`）只消费其输出。

### ADR-005: 版本号跳号

v3.5.x → v3.6.x 直接跳过中间版本号。v3.6.9.x → v3.7.7 也是跳号。版本号由用户指定，表示里程碑变更而非连续的增量卷。

---

## 9. Hugo 特有陷阱速查表

| 陷阱 | 症状 | 修复 |
|------|------|------|
| `crypto.FNV32a` 不存在 | 构建失败 | → `hash.FNV32a` |
| TOML 重复 `[section]` | 前一个 section 静默覆盖 | `grep -c` 检查重复 |
| `partialCached` 无 variant | 跨页面内容污染 | 加 `.RelPermalink` |
| `%q \| safeHTMLAttr` | XSS：双引号注入新属性 | 显式属性输出 |
| `safeURL` 无条件 | `javascript:` 通过审核 | 去掉或加白名单 |
| `return $value` in partial | 可能报错 | 用 simple return + Store |
| `--defaultContentLanguage` flag | Hugo 0.164 已移除 | 使用真实多语言配置 |
| `.Language.LanguageCode` | 已弃用 | → `.Language.Locale` |
| 动态 HTML 标签 `<{{ if }}h1{{ else }}h2{{ end }}>` | 被作为文本输出 | 用显式 if/else 分支 |
| ContentDir 未设置 | 分类泄漏/构建不确定 | 每种语言指定 contentDir |
| LibSass `rgb(R G B / A%)` | 编译错误 | → `rgba(R, G, B, A)` |
| SCSS 变量在 `.chroma {}` 内定义 | 外部不可见 | 移到文件顶部 |
| SCSS 注释在 selector 前 | Hugo minifier 切割 selector | 删除注释或移到块内 |
| `grep -c \|\| echo 0` 双零 | 变量含多行字符串 | → `if grep -q` 模式 |
| SCSS 重复声明 | 编译结果不稳定 | 搜索重复的 selector+属性 |
| `custom.scss` 不会自动加载 | 站点 CSS 不生效 | 需在 `head/style.html` 显式导入 |

---

## 10. CSS/SCSS 调试速查表

### Widget 分隔线作用域

```scss
/* ✅ 正确：作用域限定 */
.widget-sidebar {
    .widget-categories + .widget-toc {
        border-top: 1px solid var(--card-separator-color);
    }
}

/* ❌ 错误：全局作用 */
.widget-categories {
    border-bottom: 1px solid ...;
}
```

### 移动端搜索：父级 <p> 是统一卡片面

```scss
.site-sidebar__hamburger-search .search-form > p {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 44px;
    background: var(--card-background);
    border: 1px solid var(--card-separator-color);
}
/* 输入框+按钮：透明底色、无边线 */
.site-sidebar__hamburger-search .search-form input,
.site-sidebar__hamburger-search .search-form button {
    border: 0; background: transparent; box-shadow: none;
}
```

### 搜索框 40px padding 陷阱

```scss
/* 主题的 search.scss 给输入框 40px 顶部内边距（给浮动 label 留空间）*/
/* 隐藏 label 后 padding 仍在 */
/* 修复：显式覆盖 */
.widget-search .search-form input {
    padding-top: 12px !important;
    padding-bottom: 12px !important;
    height: 44px !important;
}
```

### 暗色模式选择器

```scss
/* ✅ 使用 data-scheme */
[data-scheme="dark"] .selector { }

/* ❌ 不用 @media 查询 — JS 切换不会触发 */
```

### 文章封面 max-height

```scss
/* 选择器链长达 4 个 class — 短选择器无法权重压制 */
.article-page .main-article .article-header .article-image img {
    max-height: 25vh; /* v3.6.8: 从 50vh 下调 */
}
```

---

## 11. CI 体系完整清单

### 当前 CI 步骤 (theme-ci.yml)

| 步骤 | 覆盖范围 |
|------|---------|
| 构建 exampleSite (多语言) | zh-cn + en 双语言 |
| 构建子路径 | `/preview/` subpath URL |
| 验证搜索 JSON | `jq empty` 语法检查 |
| `javascript:` URL 检查 | grep -qr |
| `onerror`/`onload` 检查 | grep -qrE |
| i18n 键一致性 | Python tomllib 扁平化对比 |
| 语言隔离断言 | /en/ 无 zh 幽灵页、搜索索引语言隔离 |
| Widget/DOM 断言 | widget css class ↔ aside 配对、search/404 noindex |
| 预设回归矩阵 | 空 widget、avatar=none、showEmptyPresets 开关 |
| 最终回归断言 | 中文分类标题、404、无英文 alt 残留 (v3.7.7) |
| 最小空站点验证 | 无分类无标签→无侧栏 (v3.7.7) |
| 分页标题验证 | pagerSize=1 → `第 2 页 - 首页` (v3.7.7) |
| 确定性构建 (5x) | 5 次构建 sha256sum 一致 |

### CI 覆盖的安全边界

- ✅ XSS (图片属性注入) — 通过显式属性输出架构防止
- ✅ javascript: URL — grep 检查
- ✅ 事件处理器 — grep 检查
- ✅ 跨语言分类泄漏 — ContentDir 隔离 + CI 断言
- ✅ 空侧栏占位 — 最小站点 CI 断言
- ✅ i18n 键不一致 — Python 自动检测
- ✅ 构建确定性 — 5 次 sha256sum 一致性

---

## 12. 发布检查清单

### 代码审查

- [ ] `git diff --check` 无尾随空白
- [ ] 无新增重复 SCSS 声明
- [ ] 无硬编码中文/英文混用
- [ ] `partialCached` 调用都有 variant（`.RelPermalink`）
- [ ] ContentDir 配置完整（每种语言）
- [ ] `--panicOnWarning` 通过

### 构建验证

- [ ] `hugo --gc --minify` 成功
- [ ] 子路径构建成功
- [ ] 确定性构建（2 次以上，sha256sum 一致）
- [ ] 搜索 JSON `jq empty` 语法通过
- [ ] 生成 JS `node --check` 语法通过

### 功能检查

- [ ] 首页、文章、分类、标签、归档、搜索、404 均能访问
- [ ] 中英文页面无相互泄漏（分类、标签、搜索索引）
- [ ] 暗色模式切换正常
- [ ] 移动端汉堡菜单展开/收起
- [ ] 分页链接正确
- [ ] RSS 输出正确
- [ ] 内部链接无断裂（包含 fragment 锚点）

### 国际化

- [ ] `i18n/zh-cn.toml` 与 `i18n/en.toml` 键名完全一致
- [ ] 无硬编码英文文案（`printf "Page %d"` 等）
- [ ] `en/tags/` 无 `个标签`，`en/categories/` 无 `个分类`
- [ ] `en/404.html` 标题是 `Page not found` 而非 `页面未找到`

### 无障碍

- [ ] Skip link 可键盘到达
- [ ] 汉堡/搜索/分页键盘焦点可见
- [ ] 移动端搜索无双重焦点环
- [ ] 代码复制按钮聚焦可见
- [ ] 所有 aside 有非空 aria-label
- [ ] Widget 侧栏 DOM 顺序在 main 之后

### 版本发布

- [ ] `theme.toml` version 已更新
- [ ] `git tag vX.Y.Z` 已创建
- [ ] `git push && git push origin vX.Y.Z`
- [ ] CI 全部通过后再推送
- [ ] 站点子模块已更新到新版本（如适用）

### 文档

- [ ] 版本字符串统一为当前版本
- [ ] `Luxthe` → `LuxTHE` 名称规范化
- [ ] 迁移路径与实际文件结构一致
- [ ] 搜索行为描述与实际 widget resolver 匹配

---

> **文档版本**: 1.0  
> **对应主题版本**: LuxTHE v3.7.7 (`3db987e`)  
> **作者**: Hermes Agent (Nous Research)  
> **编制日期**: 2026-07-18
