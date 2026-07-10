# Camp 2026 遊戲文件索引

這個資料夾保存目前遊戲的玩家向說明、Staff 發獎指引、靜態內容資料與流程圖。文件內容以現有程式碼為準，重點是讓玩家、隊輔、Staff 和後續維護者可以快速理解遊戲正在支援哪些玩法。

## 目前遊戲結構

- 玩家從 Telegram 小隊群登入，帳號會綁定 Telegram 使用者與小隊。
- 首頁顯示個人開源力、小石數、道具數、小隊排名與可用行動。
- 主要導覽包含首頁、戰鬥、小石、商店與通行證。
- 戰鬥支援雙人現場配對、四人多人房、可設定開關的電腦戰，以及可設定開關的電腦補位。
- 小石可以出戰，影響小石掉落、答題分數、勝利開源力與刪除錯誤選項。
- 商店使用開源力購買道具；部分商品可重複購買，部分商品鎖定或不可購買。
- 合成會消耗小石與道具，產出新的小石或道具。
- 社群攤位、Staff 直接發獎、Staff 短效獎勵 QR Code 都可以發放小石、道具或開源力。
- 排行榜分為小隊榜與個人榜，小隊榜使用人均小石數與人均開源力排序。

## 玩家向文件

| 檔案 | 主題 |
| --- | --- |
| `01-game-overview.mdx` | 遊戲目標、日常玩法與整體循環 |
| `02-login-and-passport.mdx` | Telegram 登入、個人 QR Code、暱稱與頭像 |
| `03-open-power-and-rewards.mdx` | 開源力來源、花費與結算 |
| `04-sitones-and-loadout.mdx` | 小石類型、出戰組合與被動效果 |
| `05-quiz-battle.mdx` | 知識王戰、配對、多人房、分數與掉落 |
| `06-shop-and-fusion.mdx` | 商店、道具、合成與自動補材料 |
| `07-community-and-staff-rewards.mdx` | 社群攤位、Staff 發獎與 QR Code |
| `08-leaderboard-and-good-play.mdx` | 排行榜排序與有效玩法 |
| `current-game-analysis.md` | 目前程式碼實作解析，供 Staff 與維護者對照 |

## Staff 與內容資料

- `../README.md`：Staff 發放小石指引與合成樹圖片。
- `item.md`、`fusion_recipes.md`、`more_stone.md`、`speical_effect.md`：內容規劃與靜態資料說明。
- `role.csv`：角色或隊伍相關資料。
- `main-cycle.dot`、`main-cycle.svg`：主要遊戲循環圖。
- `little_stone_tree.dot`、`little_stone_tree.svg`：小石合成樹。

## 圖表更新

更新 dot 畫成易讀的 svg：

```bash
dot -Tsvg:cairo little_stone_tree.dot -o little_stone_tree.svg
dot -Tsvg:cairo main-cycle.dot -o main-cycle.svg
```
