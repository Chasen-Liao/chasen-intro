# Chasen 首页头像粒子融合保真台账

**日期**：2026-07-23  
**实现范围**：Hero 头像、头像粒子与 Open Graph 头像路径  
**参考图**：`docs/references/hero-avatar-particles-reference.png`

## Hero / 桌面端

| 检查项 | 参考 / 清单目标 | 渲染证据 | 结果 |
| --- | --- | --- | --- |
| 暖纸张与编辑式外框 | 按参考图还原首屏骨架 | 1665 × 944 本地浏览器截图检查；导航高 100px | 通过 |
| 大标题层级 | `Chasen` 从 x=134、y=245 起，跨入右栏 | 标题盒 583 × 194px；参考图坐标对齐 | 通过 |
| 右侧可视画框 | 约 x=720、y=128 至首屏底部上方 | 实测 x=717、y=128、853 × 740px，底部 y=868 | 通过 |
| 头像占画框宽度 | 桌面端大幅铺开并保持参考图中心 | 头像变换后约 713 × 713px，x=813、y=142 | 通过 |
| 头像清晰度 | settled 状态清晰可辨 | settled opacity 0.72，`mix-blend-mode:multiply` | 通过 |
| 原色粒子 | 保留暖棕、青色和少量粉色 | Canvas 直接使用源像素；青色与粉色分类检查通过 | 通过 |
| 聚合过程 | 从左侧信号流聚合 | 850ms 中间态截图检查：头像由稀疏粒子逐步成形 | 通过 |
| 悬停扰动 | 局部可逆排斥，青色短拖尾 | 指针进入画框后 `.is-pointer-active=true`，局部粒子散开 | 通过 |
| 页面宽度 | 不出现横向滚动 | `scrollWidth - clientWidth = 0` | 通过 |
| 正文与 CTA | 520px 四行正文，两枚约 228 × 72px 按钮 | 正文 x=134、y=499；CTA x=134、y=727、480 × 72px | 通过 |

## Hero / 移动端

| 检查项 | 参考 / 清单目标 | 渲染证据 | 结果 |
| --- | --- | --- | --- |
| 视口 | 390 × 844 | 本地浏览器响应式检查 | 通过 |
| 头像占画框宽度 | 约 68% | 画框 300px；头像变换后 207.28px；69.09% | 通过，偏差 +1.09pp |
| 头像与文字顺序 | 保持现有移动端首屏节奏 | 头像框在上、标题与正文在下，无重叠 | 通过 |
| 页面宽度 | 不出现横向滚动 | `scrollWidth - clientWidth = 0` | 通过 |
| 动效密度 | 移动端降低粒子数量 | 目标粒子上限从桌面 6400 降为 2600 | 通过 |

## 可访问性与运行状态

- `prefers-reduced-motion: reduce`：匹配成功；不创建粒子 Canvas；头像直接进入可见状态；opacity 0.72。
- 离屏暂停与页面隐藏暂停：保留原有 `IntersectionObserver` 和 `visibilitychange` 路径。
- 粒子指针命中区：Hero 统一接收指针移动，并以整个 `.hero__right` 作为有效范围；右栏中的指针坐标按比例映射到头像 Canvas。即使 `Chasen` 标题位于最上层，标题覆盖区及头像下方空白区也能触发粒子扰动，离开右栏后立即复位。
- 浏览器控制台：无 error 或 warning。
- 自动测试：`node --test tests\portrait-particles.test.cjs tests\social-mode.test.cjs tests\github-content.test.cjs`，23/23 通过。

## Social 默认模式

| 检查项 | 目标 | 渲染证据 | 结果 |
| --- | --- | --- | --- |
| 默认界面 | 每次打开或刷新都进入 Social | `body[data-mode="social"]`；SOCIAL 胶囊激活 | 通过 |
| X 定位 | AI 原住民、Vibe Coding、AI Agent 实战分享 | Hero 与 About 使用 Social 专属文案 | 通过 |
| 首屏行动 | 优先关注 X，同时可浏览构建记录 | `关注 X` 外链与 `浏览构建记录` 锚点独立显示 | 通过 |
| 模式切换 | Resume 内容仍可正常访问 | 浏览器点击切换后 Resume CTA 显示、Social CTA 隐藏 | 通过 |
| X 粉丝数 | 使用用户确认的实时数字 | `data-x-followers="1120"`；显示 `1,120 followers` | 通过 |
| 信号台内容 | 技术栈之外呈现日常 AI Coding 工具 | 顶部新增 Claude Code（CORE / DAILY）与 OpenAI Codex（ACTIVE / DAILY） | 通过 |
| 移动端 | Social 文案和 CTA 不溢出 | 390 × 844；CTA 各 154 × 54px；横向溢出为 0 | 通过 |

## GitHub 内容快照

**校准时间**：2026-07-23  
**事实源**：GitHub 用户与仓库官方 API；仓库 API 数字优先于可能存在缓存的主页卡片。

| 内容 | 当前值 |
| --- | --- |
| 公开仓库 / followers | 52 / 88 |
| Pi Agent Desktop | 20 Stars |
| SuperMew | 3 Stars |
| resume-skills | 10 Stars |
| Everything Claude Code | 12 Stars |

站内蓝图指标、项目卡片、底部联系栏和完整作品集链接均已同步。每次页面加载会以 `cache: no-store` 向 GitHub 官方 API 发起 2 个请求（用户数据 + 仓库列表）并更新全部字段；请求失败或触发限流时保留本表记录的静态快照。浏览器实测回填成功，无横向溢出、无控制台错误。

## 不匹配与允许偏差

- 概念图的粒子密度高于实际实现；实际版本降低非强调色粒子的 settled alpha，以保证脸部清晰和运行性能。这是已批准的允许偏差。
- 移动端头像宽度比清单目标高 1.09 个百分点，处于允许的几个百分点范围内。
- 概念图里的生成文字细节没有复刻；页面继续使用现有真实文案和技术标签。

## 最终结论

Hero 的构图、头像比例、配色边界、聚合节奏和响应式行为均达到已接受参考图与复刻简报的目标，没有剩余阻塞项。
