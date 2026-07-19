# LuxTHE 文章模板

将以下内容复制到 `content/posts/<slug>/index.md`，替换字段后即可写作。

## 完整模板

```markdown
+++
title = ""
description = ""
date = "2026-07-19"
lastmod = "2026-07-19"
draft = false

[taxonomies]
categories = [""]
tags = [""]

[params]
toc = true
image = ""
+++

<!--more-->

正文从这里开始……
```

## 字段说明

| 字段 | 用途 | 必填 |
|------|------|:--:|
| `title` | 文章标题 | ✅ |
| `description` | 摘要/SEO 描述，列表卡片也会显示 | |
| `date` | 发布日期，格式 `YYYY-MM-DD` | ✅ |
| `lastmod` | 最后修改日期，不填默认同 `date` | |
| `draft` | `true` = 草稿不发布，`false` = 发布 | ✅ |
| `categories` | 分类，四选一：`"生活"` `"工作"` `"学习"` `"分享"` | ✅ |
| `tags` | 标签列表，可多个，如 `["Hugo", "博客"]` | |
| `toc` | `true` 显示文章目录，`false` 隐藏 | |
| `image` | 封面图 URL，留空则使用主题随机几何封面 | |
| `<!--more-->` | 摘要分割线，在此之前的内容显示在首页列表卡片 | |

## 文件位置

```
content/posts/<slug>/index.md
```

每篇文章必须是 Hugo 页面包（Leaf Bundle），图片等资源放在同目录下。

---

## 支持的写作功能

### 插图

标准 Markdown 图片自动生成响应式 `srcset`：

```markdown
![图片说明](image.jpg)
```

### 引用块

```markdown
> 普通引用文字
```

### 提示框（Alert）

四种语义类型，自带图标和标题：

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

### 带署名的引用（Shortcode）

```markdown
{{< quote author="鲁迅" source="《呐喊》" url="https://example.com" >}}
其实地上本没有路，走的人多了，也便成了路。
{{< /quote >}}
```

### 视频（Shortcode）

```markdown
{{< video src="video.mp4" poster="cover.jpg" >}}
```

### B 站视频（Shortcode）

```markdown
{{< bilibili BV1xx411c7mD >}}
{{< bilibili av123456 2 >}}   <!-- 第二个参数是分 P -->
```

### 腾讯视频（Shortcode）

```markdown
{{< tencent vid="x0022vxqg4p" >}}
```

### 代码块

````markdown
```python
print("Hello, LuxTHE")
```
````

### 表格

```markdown
| 列 A | 列 B |
|------|------|
| 值 1 | 值 2 |
```

### 数学公式（KaTeX 需自行集成）

```markdown
$$
E = mc^2
$$
```

### 脚注

```markdown
这是一段文字[^1]

[^1]: 这是脚注内容。
```
