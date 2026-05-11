# ネイルチップサイズ測定ツール PoC版

## 📱 プロジェクト概要

スマートフォンのカメラで爪を撮影し、500円玉を基準スケールとして爪の寸法を推定し、適切なネイルチップサイズを提案するWebツールのPoC版です。

**対象形状:** ショートオーバル（1種類）

**⚠️ 注意:** PoC段階のため、測定精度は保証されません。

## 🛠 技術スタック

- **フレームワーク:** Next.js 16 (App Router) + TypeScript
- **スタイリング:** Tailwind CSS v4
- **AI:** Gemini 2.5 Flash ([@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) v0.24.1)
- **デプロイ:** Vercel
- **ランタイム:** Node.js

## 📥 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

```bash
cp .env.local.example .env.local
```

`.env.local` を編集して以下を設定します：

```env
GEMINI_API_KEY=your_api_key_here
USE_MOCK=false
```

**Gemini API キーの取得方法:**
1. [Google AI Studio](https://aistudio.google.com/apikey) にアクセス
2. 「API キーを作成」をクリック
3. 生成されたキーを `.env.local` に貼り付け

## 🚀 開発サーバ起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

### スマートフォンでの動作確認

スマートフォン実機でテストする場合：

- **同一LAN接続:** PCのIPアドレスでアクセス（例：`http://192.168.1.100:3000`）
- **HTTPS必須:** カメラ使用には HTTPS が必須のため、以下を推奨します
  - [ngrok](https://ngrok.com/) でローカルサーバをHTTPS公開
  - Vercel プレビューデプロイ（自動HTTPS対応）

## ⚙️ 環境変数一覧

| 変数名 | 必須 | 説明 | デフォルト |
|---|---|---|---|
| `GEMINI_API_KEY` | ✅ | Gemini API のキー | - |
| `USE_MOCK` | - | `true` でモック応答を返す（開発・デモ用） | `false` |

## 🌐 Vercel へのデプロイ

### デプロイ手順

1. **GitHub リポジトリと連携**
   - Vercel にログイン
   - 該当の GitHub リポジトリを選択

2. **環境変数設定**
   - プロジェクト設定で以下を追加：
     - `GEMINI_API_KEY`: 取得したAPIキー
     - `USE_MOCK`: 本番で不要（省略可、デフォルト`false`）

3. **デプロイ**
   - リポジトリへのプッシュで自動デプロイ
   - または Vercel Dashboard から手動デプロイ

4. **動作確認**
   - 発行された URL にアクセス
   - スマートフォンで動作確認

## ✅ 動作確認チェックリスト

実装・デプロイ後、以下の項目で動作確認してください：

- [ ] トップ画面が表示される
- [ ] 「はじめる」ボタンで撮影画面に遷移する
- [ ] カメラ権限のリクエストが表示される
- [ ] **撮影ステップ（真上から1枚）**
  - [ ] カメラで撮影できる
  - [ ] 撮り直しボタンで再撮影できる
  - [ ] 「解析する」ボタンで結果画面に遷移する
- [ ] **解析中**
  - [ ] ローディング画面が表示される
- [ ] **結果画面**
  - [ ] 推定値（幅・長さ mm）が表示される
  - [ ] 推奨サイズが表示される
  - [ ] サイズ表のハイライトが正しい
  - [ ] 「もう一度測る」ボタンでトップに戻る
- [ ] **デバイス互換性**
  - [ ] iOS Safari で動作する
  - [ ] Android Chrome で動作する
- [ ] **エラーハンドリング**
  - [ ] Gemini API エラー時の挙動が適切

## 📁 ディレクトリ構成

```
.
├── app/                      # Next.js App Router
│   ├── page.tsx             # トップ画面
│   ├── capture/page.tsx     # 撮影画面
│   ├── result/page.tsx      # 結果画面
│   ├── api/estimate/route.ts # Gemini API エンドポイント
│   ├── layout.tsx           # ルートレイアウト
│   ├── globals.css          # グローバルスタイル
│   └── favicon.ico
├── components/              # UIコンポーネント
│   ├── CameraCapture.tsx    # カメラキャプチャ
│   ├── GuideFrame.tsx       # 撮影ガイド枠
│   ├── LoadingOverlay.tsx   # ローディング表示
│   └── ErrorView.tsx        # エラー表示
├── lib/                      # ビジネスロジック
│   ├── geminiPrompt.ts      # Gemini プロンプト定義
│   ├── matchSize.ts         # サイズマッチング処理
│   ├── mockResponse.ts      # モック応答
│   ├── resizeImage.ts       # 画像リサイズ処理
│   └── sizeData.ts          # サイズデータ定義
├── types/                    # TypeScript 型定義
│   └── index.ts
├── docs/                     # ドキュメント
│   ├── 要件定義書.md
│   └── 質問事項.md
├── public/                   # 静的ファイル
├── .env.local.example       # 環境変数テンプレート
├── next.config.ts           # Next.js 設定
├── tailwind.config.ts       # Tailwind CSS 設定
├── tsconfig.json            # TypeScript 設定
├── package.json
└── README.md
```

## 🔄 開発ワークフロー

### ビルド

```bash
npm run build
```

### 本番環境で起動

```bash
npm run start
```

### Lint チェック

```bash
npm run lint
```

## 🚧 PoC 範囲外（将来対応予定）

以下は将来のバージョンで対応予定です：

- 他の爪形状対応（ベリーショート、ショートバレリーナ、ショートアーモンド、オーバル、ショートスクエア等）
- AI 測定精度の向上・プロンプト最適化
- 複数の 500 円玉検出
- ECサイト（ネイルチップ販売店）との連携
- 撮影履歴の保存機能
- ユーザー認証・マイページ
- より詳細なエラーハンドリング
- アクセス解析・利用ログ
- 多言語対応

## 📝 ライセンス

未設定

## 👤 作成者

Coconala PoC チーム
