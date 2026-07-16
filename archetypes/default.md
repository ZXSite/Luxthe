---
title: "{{ replace .Name "-" " " | title }}"
description: ""
date: {{ .Date }}
categories: []
tags: []
draft: true
---

<!-- 
  Article bundle structure:
  content/posts/<slug>/
  ├── index.md          # Main content
  ├── cover.webp        # Article cover image
  ├── images/           # All inline images
  │   ├── 01.webp
  │   └── diagram.svg
  └── files/            # Downloadable attachments
      └── guide.pdf
-->
