# LuxTHE


- 需要 Hugo Extended 0.164.0 或更高版本
- 示例站默认简体中文，英文界面完整可切换
- 支持明暗模式、本地搜索、归档、分类、标签、目录、RSS 和真实 404
- 构建时不需要 Node、Hugo Module 或网络下载

## 安装

用 Git 子模块安装：

```bash
git submodule add https://github.com/ZXSite/LuxTHE.git themes/LuxTHE
```

也可以把仓库完整复制到 `themes/LuxTHE`。站点配置中启用：

```toml
theme = "LuxTHE"
```

可参考 `exampleSite/hugo.toml`，也可以直接启动演示站：

```bash
hugo server --source exampleSite --themesDir ../.. --theme LuxTHE
```

## 文章目录

每篇文章使用 Hugo Leaf Bundle：

```text
content/posts/my-post/
├── index.md
├── cover.webp
├── images/
│   └── 01.webp
└── files/
    └── guide.pdf
```

正文直接写 `![示意图](images/01.webp)` 和 `[下载文档](files/guide.pdf)`。Front matter 没有 `image` 时，主题依次查找 `cover.avif`、`cover.webp`、`cover.jpg`、`cover.jpeg`、`cover.png`。执行 `hugo new content posts/my-post/index.md` 会使用内置原型。

## 搜索与双语

每种语言创建一个搜索页，设置 `layout = "search"` 和 `outputs = ["HTML", "JSON"]`，可直接参考 `exampleSite/content/zh-cn/search`。索引仅包含 `params.mainSections`，搜索完全在浏览器本地运行，支持方向键、Enter、Escape 和 Ctrl/Cmd+K。

主题只交付 `zh-cn` 与 `en` 两套完整翻译，配置方法见演示站 `[languages]`。

## 自定义

在站点中创建同路径文件即可覆盖主题。推荐扩展点：

- `layouts/_partials/head/custom.html`
- `layouts/_partials/footer/custom.html`
- `layouts/_partials/extensions/comments.html`
- `layouts/_partials/extensions/analytics.html`
- `assets/scss/custom.scss`

评论与统计默认关闭且不输出内容。自行接入第三方服务后，默认“零外部请求”承诺不再成立，也必须同步修改 Content Security Policy。

主题支持分别设置 SVG、PNG、Apple Touch Icon 和 Web Manifest：使用 `params.faviconSVG`、`params.faviconPNG`、`params.appleTouchIcon`、`params.webmanifest`。旧的单一 `params.favicon` 参数仍作为兼容回退。

完整参数见[配置手册](docs/configuration.md)。旧 LuxTHE 站点请先按 [LuxTHE 迁移指南](docs/migrating-from-luxrex.md)清理布局和配置覆盖；部署步骤见 [Cloudflare Pages 指南](docs/cloudflare-pages.md)，英文介绍见 [README](README.md)。

## 许可证与署名

