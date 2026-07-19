# LuxTHE 文章模板

## Hugo Leaf Bundle 完整结构

```
content/posts/<slug>/
├── index.md          ← 文章正文（必需）
├── cover.jpg         ← 封面图（可选，frontmatter 用 image = "cover.jpg"）
├── image-1.jpg       ← 文章插图（可选，Markdown 中直接引用）
└── image-2.png       ← 更多插图……
```

每篇文章是一个 **Leaf Bundle**（叶子包），目录名即 `slug`。Hugo 会将该目录下所有资源视为页面资源，自动处理响应式图片。

## Frontmatter 模板

```markdown
+++
title = ""
description = ""
slug = ""
date = "2026-07-19T00:00:00+08:00"
lastmod = "2026-07-19T00:00:00+08:00"
draft = false

[taxonomies]
categories = [""]
tags = [""]

[params]
toc = true
image = "cover.jpg"
+++

<!--more-->

正文从这里开始……

![插图说明](image-1.jpg)
```

## 字段说明

| 字段 | 用途 | 必填 |
|------|------|:--:|
| `title` | 文章标题 | ✅ |
| `description` | 摘要/SEO 描述，列表卡片也会显示 | |
| `slug` | URL 路径，不填默认取目录名 | |
| `date` | 发布日期，ISO 8601 格式 | ✅ |
| `lastmod` | 最后修改日期 | |
| `draft` | `true` = 草稿不发布，`false` = 发布 | ✅ |
| `categories` | 四选一：`"生活"` `"工作"` `"学习"` `"分享"` | ✅ |
| `tags` | 标签列表，如 `["Hugo", "博客"]` | |
| `toc` | `true` 显示目录，`false` 隐藏 | |
| `image` | 封面图，支持：本地文件名 `"cover.jpg"` 或远程 URL `"https://..."` ，留空则使用随机几何封面 | |
| `<!--more-->` | 摘要分割线，之前的内容显示在首页列表卡片 | |

## 封面图的三种方式

| 方式 | `image` 值 | 说明 |
|------|-----------|------|
| 本地文件 | `"cover.jpg"` | 放在 Leaf Bundle 同目录下 |
| 远程 URL | `"https://images.unsplash.com/..."` | 构建时下载并处理 |
| 主题随机 | 留空或不写 | 从 13 个几何 SVG 中确定性选择 |

## 文章插图

图片直接放在 Leaf Bundle 目录中，Markdown 用相对路径引用：

```markdown
![Alt 文字](image-1.jpg)
```

Hugo 会自动生成响应式 `srcset`（480/800/1200/1600 宽度）。

---

## 支持的写作功能

### 提示框（Alert）

```markdown
> [!NOTE]
> 这是一条注意信息

> [!TIP]
> 这是一条提示

> [!IMPORTANT]
> 这是一条重要信息

> [!WARNING]
> 这是一条警告
```

### 引用署名（Shortcode）

```markdown
{{< quote author="鲁迅" source="《呐喊》" >}}
其实地上本没有路，走的人多了，也便成了路。
{{< /quote >}}
```

### 视频（Shortcode）

```markdown
{{< video src="demo.mp4" poster="cover.jpg" >}}
```

### B 站 / 腾讯视频（Shortcode）

```markdown
{{< bilibili BV1xx411c7mD >}}
{{< tencent vid="x0022vxqg4p" >}}
```

### 代码块

````markdown
```python
print("Hello, LuxTHE")
```
````

### 表格 / 脚注

```markdown
| 列 A | 列 B |
|------|------|
| 值 1 | 值 2 |

文字[^1]

[^1]: 脚注内容
```
