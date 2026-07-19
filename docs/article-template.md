# LuxTHE 文章模板

将以下内容复制到 `content/posts/文章别名/index.md`，替换字段后即可写作。

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

{{< figure src="" caption="" >}}

{{< figure src="" caption="" >}}
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
| `{{< figure >}}` | Hugo 短代码插图，`src` 填图片 URL，`caption` 填图片说明 | |

## 文件位置

```
content/posts/<slug>/index.md
```

每篇文章必须是 Hugo 页面包（Leaf Bundle），图片等资源放在同目录下。
