<h2 align="center">✨ HFS NEXT ✨</h2>
<h5 align="center">你的下一个好分数，何必是好分数？</h5>
<h5 align="center">
  在线访问：<a href="https://hfs.uselesslab.top" target="_blank">hfs.uselesslab.top</a>
</h5>

---

## 这是啥

好分数家长版的摇一摇广告、开屏弹窗和 VIP 引导让人想把手机砸了，所以有了这个。
直接调好分数官方接口，只干一件事：把考试列表、排名、答题卡干净地摆在你眼前。

本仓库是 [yanyao2333/HFS-NEXT](https://github.com/yanyao2333/HFS-NEXT) 的 fork，
当前由 [@qeeryyu](https://134687.xyz) 维护，在上游基础上做了一些 UX、性能和可访问性方面的调整。

## 特性

- **一页看完所有考试**：列表、分数、发布时间平铺，不用点进去再退出来
- **考试详情 + 答题卡**：班级/年级排名、单科成绩、答题卡图（可放大翻页浏览）
- **最近一次概览**：排名变化、分数波动、薄弱学科一目了然
- **一键导出截图**：把当前考试页面导成图片发给家人
- **轻、无广告、无第三方 tracking**

## 本地开发

需要 Node.js 20+ 和 pnpm 10+。

```bash
pnpm install
pnpm dev          # 本地开发
pnpm build        # 生产构建
pnpm start        # 启动生产构建
pnpm lint         # 代码检查
```

技术栈：Next.js 15（App Router）· React 19 · TanStack Query · Tailwind v4 · Radix UI · Biome。

## 隐私

- 账号密码只用于向好分数官方接口换取 token，不经过本项目服务器
- 登录 token 保存在浏览器 `localStorage`，退出登录时清除
- 部署在 Vercel，使用 Vercel Analytics 统计匿名访问量（实际上几乎没人用，纯自娱自乐）

## License

沿用上游的 [MIT License](./LICENSE)。
