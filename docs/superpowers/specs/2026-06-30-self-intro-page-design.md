# Chasen 自我介绍页面 — 设计文档

**日期**：2026-06-30
**状态**：已确认（部署现有页面）
**参考风格**：https://sac-ai.com/（editorial 编辑感 + 技术规格表）

## 1. 目标

将已完成的单文件 `index.html` 自我介绍页面上线：托管到 GitHub 仓库并用 Vercel CLI 部署，实现 push 即自动部署。

**现状**：页面本身已完成且包含真实内容（无需新建）。

## 2. 现有页面概况（index.html）

- **定位**：Chasen-Liao — CS UNDERGRAD × AI / FRONT-END BUILDER（广东财经大学计算机科学在读）
- **设计语言**：浅色纸张主题（`--paper:#F4EFE6` / `--ink:#1A1714` / `--accent:#F0652E`）；Playfair Display + Noto Serif SC + Inter + Noto Sans SC + monospace；技术规格表母题（蓝图档案卡、坐标、SPEC、LIVE/AVAILABLE 状态）
- **板块**：Hero（标语+头像占位）→ About（自我介绍 + 工程蓝图档案卡 + 技能信号台）→ Work（4 个作品档案行）→ Contact（Let's talk + marquee + 邮件/Blog/GitHub/简历二维码）
- **特性**：响应式（860px / 600px 断点）、滚动入场动画、IntersectionObserver 导航高亮、键盘焦点环、`prefers-reduced-motion` 支持

## 3. 部署方案（方案 A：直接部署现有 HTML）

- **源码托管**：GitHub 仓库（公开）
- **部署**：Vercel CLI 关联仓库，静态站托管
- **构建**：无构建——纯静态 HTML，Vercel 自动识别
- **自动部署**：push 到 main → Vercel 自动重新部署

**选型理由**：页面已完成且质量高，无需为"框架"重写；先上线，未来加博客/项目详情页时再评估迁移 Next.js。

## 4. 范围（IN）

- 初始化 git 仓库 + `.gitignore`
- 创建 GitHub 仓库并推送（含 `index.html`、`.claude/skills/`、本 spec、`skills-lock.json` 等）
- Vercel CLI 关联项目并完成首次部署
- 验证线上可访问

## 5. 范围外（OUT）

- 修改页面内容或样式（页面已完成）
- 迁移到 Next.js / Tailwind
- 自定义域名（后续）
- 博客、项目详情子页（后续）

## 6. 验收标准

- GitHub 仓库创建成功，代码已推送
- `vercel deploy --prod` 成功，生产 URL 可正常访问，页面完整渲染
- 后续 push 到 main 触发 Vercel 自动部署
