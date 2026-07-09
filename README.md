# SITCON Camp 2026 Game Docs

SITCON Camp 2026 前端教學文件站。內容以章節式 MDX 文件呈現，搭配 Astro、Svelte 5 與 UnoCSS，提供課程導讀、前端互動練習、Dify 嵌入與 prompt injection 安全觀念。

## 技術棧

- Astro 7
- Svelte 5
- MDX content collections
- UnoCSS
- Bun
- Pagefind

## 環境需求

- Node.js `>=22.12.0`
- Bun

如果不想在主機安裝依賴，也可以直接使用 Docker Compose 開發。

## 本機開發

安裝依賴：

```sh
bun install
```

啟動開發伺服器：

```sh
bun run dev
```

預設網址：

```text
http://localhost:4321
```

需要背景模式時可使用 Astro CLI：

```sh
bun astro dev --background
bun astro dev status
bun astro dev logs
bun astro dev stop
```

## Docker Compose 開發

使用 Compose 啟動文件站：

```sh
docker compose up
```

背景啟動：

```sh
docker compose up -d
```

停止服務：

```sh
docker compose down
```

容器會自動執行 `bun install --frozen-lockfile`，並以 `0.0.0.0:4321` 啟動 Astro dev server。主機端預設可從 `http://localhost:4321` 開啟。

若要改主機端 port：

```sh
DOCS_PORT=5173 docker compose up
```

容器內的 `node_modules` 使用 Docker named volume，不會覆蓋主機端的 `node_modules`。

## 常用指令

| 指令 | 說明 |
| --- | --- |
| `bun install` | 安裝依賴 |
| `bun run dev` | 啟動本機開發伺服器 |
| `bun run build` | 建置靜態網站到 `dist/` |
| `bun run preview` | 預覽建置結果 |
| `bun astro ...` | 執行 Astro CLI |
| `docker compose up` | 用 Docker Compose 啟動開發環境 |

## 專案結構

```text
├── public/                  # 靜態資源
├── src/
│   ├── components/docs/      # 文件站 UI 元件
│   ├── content/docs/         # 章節 MDX 內容
│   ├── layouts/              # Astro layout
│   ├── lib/                  # 文件資料與進度工具
│   ├── pages/                # Astro 路由
│   └── styles/               # 全站樣式
├── astro.config.mjs
├── docker-compose.yml
├── package.json
└── uno.config.ts
```

## 新增或修改章節

章節內容放在 `src/content/docs/*.mdx`。每個檔案都需要提供 content collection schema 定義的 frontmatter：

```yaml
---
order: 7
eyebrow: "07 章節"
title: "章節標題"
duration: "15 分鐘"
level: "入門"
tags: ["tag"]
summary: "章節摘要"
goals: ["學習目標"]
checklist: ["完成檢查"]
---
```

路由 ID 會由檔名產生，並移除開頭數字排序前綴。例如 `01-setup.mdx` 會產生 `/setup`。

## 建置

```sh
bun run build
```

建置輸出在 `dist/`。本專案啟用了 Pagefind，建置時會同步產生搜尋索引。
