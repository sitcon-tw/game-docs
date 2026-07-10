# 目前遊戲實作解析

最後更新：2026-07-10

本文件整理目前程式碼實際支援的遊戲規則與系統行為。玩家向規則請看 `01-game-overview.mdx` 到 `08-leaderboard-and-good-play.mdx`。

## 1. 遊戲核心循環

玩家透過 Telegram 小隊群登入，取得玩家帳號、小隊、個人 QR Code、初始小石與瀏覽器登入 cookie。登入後主要行動是：

1. 查看首頁狀態與小隊排名。
2. 設定小石出戰組合。
3. 進行知識王戰取得開源力與基礎小石掉落。
4. 用開源力購買道具。
5. 用小石與道具合成更高階小石。
6. 掃描社群攤位或 Staff 獎勵 QR Code 取得現場獎勵。
7. 透過排行榜比較小隊與個人成果。

## 2. 帳號與登入

- Telegram Bot 指令是 `vip-666`。
- 群組登入 request 預設有效時間是 10 分鐘。
- Telegram 群組和遊戲小隊由 `TG_GROUP_TEAM_MAP` 綁定。
- 玩家 ID 以 Telegram user ID 建立，格式是 `tg_<telegram_user_id>`。
- 登入成功會寫入 `camp2026_auth` cookie，Max-Age 是 365 天。
- 個人 QR Code token 前綴是 `qr_`，供 Staff 掃描識別玩家。
- 玩家頭像只能選自己擁有的小石圖示；小隊頭像可選小隊任一隊員擁有的小石圖示。

## 3. 對戰

目前有三種對戰模式：

| 模式 | 人數 | 加入方式 | 備註 |
| --- | --- | --- | --- |
| PVP | 2 人 | 短效配對 QR Code | 同一對玩家每天最多完成 10 場，日界線使用 Asia/Taipei |
| Multiplayer | 最多 4 人 | 短效配對 QR Code | 房主可在設定允許時加入電腦補位 |
| Computer | 1 位真人 + 1 位電腦 | 直接建立電腦戰 | 是否開放由後台設定控制 |

對戰常數：

- 每場 10 題。
- 每題作答 15 秒。
- 每題揭曉 4 秒。
- 答對基礎分數是 `100 + floor(剩餘秒數) * 5`。
- 答錯 0 分。
- 勝利開源力是 `總分 / 10 + 20`，再套用開源力百分比加成。
- 平手沒有勝利開源力。
- 勝者基礎小石掉落率 25%，敗者基礎小石掉落率 15%。
- 掉落池是五種基礎小石，系統優先從玩家持有數較少的基礎小石中抽。

對戰開關：

- 上課時間鎖定、強制開放、強制關閉與維護模式會影響是否能建立或開始對戰。
- 電腦戰、多人房電腦補位、同隊 PVP 是否允許，都由後台設定控制。

## 4. 小石與御守

小石類型與能力：

| 類型 | ability_kind | 效果 |
| --- | --- | --- |
| exploration | `material_drop_rate` | 對戰結束小石掉落率加成 |
| inspiration | `eliminate_wrong_choice` | 題目開始時有機率刪除錯誤選項 |
| resonance | `open_power_bonus` | 對戰勝利開源力加成 |
| engineering | `answer_score_bonus` | 答對分數加成 |
| entertainment | `open_power_bonus` | 對戰勝利開源力加成 |

出戰組合限制：

- 最少 1 顆小石。
- 最多 5 顆小石。
- 可重複攜帶同一小石，但不能超過持有數量。
- 等待房可修改；準備後或開戰後本場鎖定。
- 對戰開始時會 snapshot 小石與御守效果，因此中途購買或合成不影響本場。

御守效果：

- `item_charm_connection`：有探索型小石上場時，掉落率 +15%。
- `item_charm_debug`：有工程型小石上場時，答對分數 +10%。
- `item_charm_all_nighter`：有靈光型小石上場時，刪錯誤選項機率 +20%，至少刪 1 個。
- `item_charm_success`：有娛樂型小石上場時，勝利開源力 +20%。
- `item_charm_harmony`：有共鳴型小石上場時，勝利開源力 +20%。

## 5. 商店與合成

商店只列出 `enabled = true` 且 `purchasable = true` 的道具。

- `locked = true` 的商品會顯示但不能購買。
- 非 repeatable 商品同一玩家只能買一次。
- `repeatable = true` 商品可以重複購買。
- 購買會新增一筆負數 open power record，並把道具加入玩家背包。

合成行為：

- 只允許 enabled recipe。
- 配方 input 會被扣除，output 會加入背包。
- 合成需要 MongoDB transaction 支援。
- 自動補材料可購買或遞迴合成缺少材料，但不能處理鎖定、未開放、開源力不足、數量超過上限、路徑循環或輸出路徑不唯一的情況。

## 6. 社群攤位與 Staff 獎勵

社群攤位：

- 展示頁會產生短效 QR token。
- 社群攤位 QR token TTL 是 2 分鐘。
- 每位玩家每個攤位只能 claim 一次。
- Claim 可發小石、道具或開源力。
- 掃描攤位會記錄 visit，claim 會另外記錄 claim。

Staff 發獎：

- Staff 可直接發獎給單一玩家、小隊、宿舍房間或全體玩家。
- Staff 可建立短效獎勵 QR token。
- Staff 獎勵 QR token TTL 是 10 分鐘。
- 每位玩家每張 Staff 獎勵 QR token 只能 claim 一次。

QR 掃描冷卻：

- 社群攤位 claim 和 Staff reward token claim 共用 QR scan cooldown。
- 預設冷卻時間是 5 分鐘。
- 冷卻是否啟用由後台設定控制。

## 7. 排行榜

小隊榜排序：

1. 平均小石數。
2. 平均開源力。
3. 小隊名稱。
4. 小隊 ID。

個人榜排序：

1. 小石總數。
2. 開源力。
3. 暱稱。
4. 玩家 ID。

排行榜會提供：

- 小隊榜與個人榜。
- 目前玩家或小隊的 current entry。
- 與前一名的 gap。
- 小隊成員明細。
- 玩家公開背包明細。

## 8. 主要資料來源

- 小石定義：`server/content/sitones.toml`
- 道具定義：`server/content/items.toml`
- 合成配方：`server/content/fusion_recipes.toml`
- 對戰規則：`server/internal/http/handler/matches`
- 商店規則：`server/internal/http/handler/shop`
- 合成規則：`server/internal/http/handler/fusions`
- 社群攤位規則：`server/internal/http/handler/communitystands`
- Staff 獎勵規則：`server/internal/http/handler/staff`
- 排行榜規則：`server/internal/http/handler/leaderboards`
- Telegram 登入：`tgbot/internal/bot/service.go`
