# Nail Size PoC

> スマートフォンで爪と 500 円玉を一緒に撮影するだけで、AI が実寸を推定し最適なネイルチップサイズを提案する PoC

UI プロトタイプの呼称は **Tsumelier**。

## 何を解決するか

ネイルチップを EC で買うとき、自分の爪のサイズが分からず「届いたら合わなかった」という失敗が起きやすい。本 PoC は、誰の財布にも入っている **500 円玉（直径 26.5mm）** を物差し代わりに使い、スマホで撮るだけで爪の実寸とおすすめサイズを返す。専用ツールも採寸スキルも要らない。

## 動作フロー

1. スマホのブラウザで爪と 500 円玉を一緒に上から撮影
2. Gemini Vision が 500 円玉を基準に爪の幅・長さ（mm）を推定
3. 推定値からショートオーバル 10 段階の中で最適なネイルチップサイズを提案

## 主要機能

- スマホブラウザ向けのカメラキャプチャ UI（背面カメラ優先・ガイド枠付き）
- 撮影画像の自動リサイズ（長辺 1024px / JPEG 圧縮）で API ペイロードを軽量化
- Gemini 2.5 Flash による画像 1 枚からの寸法推定（500 円玉を基準にピクセル↔mm 換算）
- 幅を主・長さを副とした加重距離マッチングで 10 段階サイズから最適を提示
- 信頼度（0〜1）と注意事項を結果カードに表示
- 過負荷（503）・タイムアウト時の指数バックオフリトライ／再試行 UI
- `USE_MOCK=true` でモック応答に切替可能（API キー不要のデモ）

## 技術スタック

- Next.js 16（App Router）／ React 19 ／ TypeScript
- Tailwind CSS v4 ／ Noto Sans JP・Noto Serif JP（`next/font`）
- Google Generative AI SDK（Gemini 2.5 Flash, Vision）
- Cloudflare Workers ＋ OpenNext（エッジデプロイ対応）／ Vercel でも動作
- Node.js ランタイム API Route（`maxDuration: 60s`）

## アーキテクチャ

- `app/page.tsx` — ランディング（ブランド説明・3 ステップ案内・撮影開始）
- `app/capture/page.tsx` — 撮影画面（カメラ起動／プレビュー／撮り直し）
- `app/result/page.tsx` — 解析結果（mm 表示・サイズチャートのハイライト・再試行）
- `app/api/estimate/route.ts` — Gemini 呼び出し用 API Route。リトライ・タイムアウト・JSON 検証込み
- `components/` — `CameraCapture` `GuideFrame` `LoadingOverlay` `ErrorView`
- `lib/` — Gemini プロンプト（`geminiPrompt.ts`）／サイズマッチング（`matchSize.ts`）／画像リサイズ（`resizeImage.ts`）／サイズ表（`sizeData.ts`）／モック応答

## セットアップ

```bash
git clone https://github.com/aonao44/nail-size-poc.git
cd nail-size-poc
npm install
cp .env.local.example .env.local   # GEMINI_API_KEY を設定
npm run dev
```

Gemini API キーは [Google AI Studio](https://aistudio.google.com/apikey) で発行できる。スマホ実機で動かす場合は HTTPS が必須（カメラ API の制約）なので、ngrok や Vercel プレビュー、Cloudflare のプレビュー URL を利用する。

### 環境変数

| 変数名 | 必須 | 説明 |
| --- | --- | --- |
| `GEMINI_API_KEY` | ✅ | Gemini API キー |
| `USE_MOCK` | - | `true` でモック応答（デモ・API キー不要） |
| `GEMINI_MODEL` | - | 既定 `gemini-2.5-flash` |

## デプロイ

- Cloudflare Workers（OpenNext 経由）

  ```bash
  npm run preview   # ローカルで Workers ランタイムで起動
  npm run deploy    # `opennextjs-cloudflare deploy`
  ```

- Vercel — GitHub 連携でそのままデプロイ可。環境変数に `GEMINI_API_KEY` を登録するだけ。

## 想定ユースケース

- ネイル EC のサイズ選びアシスタント（購入前のサイズ診断ウィジェット）
- ネイルサロンの事前カウンセリング（来店前の自宅採寸）
- AR / Try-On 機能の前段（ユーザーごとの実寸データ取得）

## ライセンス

MIT

## 作者

[aonao44](https://github.com/aonao44)
