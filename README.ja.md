# 🚀 OpenAPI to TypeScript コンバーター

OpenAPI仕様をTypeScriptの型定義とインターフェース宣言に素早く変換する強力なオンラインツールです。

# オンライン体験
- 🌐 オンラインツール：[font_openApi_to_ts オンラインツール](https://doweinide.github.io/font_openApi_to_ts/)

## 📖 プロジェクト概要

OpenAPI to TypeScript コンバーターは、Vue 3 + TypeScript + Tailwind CSS で構築された現代的なWebアプリケーションで、OpenAPI/Swagger文書を解析し、高品質なTypeScriptコードを生成することに特化しています。APIインターフェースの型、データモデル、リクエスト・レスポンス構造など、すべてワンクリックで標準的なTypeScript定義として生成できます。

## 🎯 解決する問題

### 開発の課題
- **手動での型定義作成は時間がかかる**：従来の方法では、API文書に基づいてTypeScriptインターフェースを手動で作成する必要がある
- **型定義とAPIの同期が取れない**：APIが更新された際、フロントエンドの型定義の更新が漏れやすい
- **コード品質のばらつき**：異なる開発者が書く型定義のスタイルが統一されていない
- **重複作業**：複数のプロジェクトで類似の型定義を繰り返し作成する必要がある

### 解決策
✅ **自動化された生成**：OpenAPI文書をワンクリックでTypeScriptコードに変換  
✅ **同期の維持**：最新のAPI文書に基づいて生成し、型定義が常にバックエンドインターフェースと同期  
✅ **標準化された出力**：TypeScriptのベストプラクティスに従った高品質なコードを生成  
✅ **効率の向上**：手動での型定義作成にかかる時間コストを大幅に削減  

## ✨ 主要機能

### 🔧 コード生成機能
- **完全な型サポート**：OpenAPI 3.0+仕様のすべてのデータ型をサポート
- **スマートなインターフェース生成**：APIインターフェース関数と型定義を自動生成
- **ネストした型の処理**：複雑なネストしたオブジェクトと配列型の完璧な処理
- **列挙型の変換**：OpenAPIの列挙型をTypeScriptのユニオン型に変換
- **オプションフィールドの認識**：必須フィールドとオプションフィールドを正確に識別

### 📝 コード品質の最適化
- **スマートなコメント生成**：OpenAPIのtitleとdescriptionを自動的にコードコメントとして抽出
- **命名規則の変換**：複数の命名スタイル変換をサポート（camelCase、PascalCaseなど）
- **コードフォーマット**：整形された読みやすいTypeScriptコードを生成
- **重複排除の最適化**：重複する型定義とインターフェース宣言を自動的に削除

### 🎨 ユーザーエクスペリエンス
- **リアルタイムプレビュー**：OpenAPI文書を入力後、リアルタイムで生成プレビュー
- **シンタックスハイライト**：JSONとTypeScriptコードのシンタックスハイライトをサポート
- **ワンクリックコピー**：生成されたコードをクリップボードにワンクリックでコピー
- **ファイルダウンロード**：生成されたコードパッケージのダウンロードをサポート
- **エラープロンプト**：詳細なエラーメッセージと修正提案

### 🔄 柔軟な設定
- **カスタムオプション**：生成オプションの設定をサポート（コメントを含むかどうか、命名スタイルなど）
- **タグによるグループ化**：OpenAPIタグによる自動グループ化とファイル生成
- **パスフィルタリング**：特定のパスのインターフェースを選択的に生成
- **型インポートの最適化**：型インポートと依存関係のスマートな処理

## 🛠️ 技術スタック

### フロントエンドフレームワーク
- **Vue 3**：Composition APIを使用し、現代的な開発体験を提供
- **TypeScript**：包括的な型安全性の保証
- **Vite**：超高速な開発ビルドツール

### UIフレームワーク
- **Tailwind CSS**：アトミックCSSフレームワークで美しいインターフェースを素早く構築
- **レスポンシブデザイン**：デスクトップとモバイルに完璧に対応

### 主要な依存関係
- **OpenAPI Parser**：OpenAPI/Swagger文書の解析
- **TypeScript Compiler API**：高品質なTypeScriptコードの生成
- **Monaco Editor**：プロフェッショナルなコード編集体験を提供

### 開発ツール
- **ESLint + Prettier**：コード品質とフォーマットの保証
- **Husky + lint-staged**：Gitコミットフックとコードチェック
- **GitHub Actions**：自動化されたCI/CDパイプライン

## 📁 プロジェクト構造

```
vue3-Ts-Tailwind-template-Pro-private/
├── 📁 .github/                    # GitHub Actionsワークフロー
│   └── workflows/
│       └── deploy.yml             # 自動デプロイ設定
├── 📁 public/                     # 静的アセット
│   └── favicon.ico               # ウェブサイトアイコン
├── 📁 src/                       # ソースコードディレクトリ
│   ├── 📁 types/                 # TypeScript型定義
│   │   └── openapi.d.ts          # OpenAPI関連の型
│   ├── 📁 utils/                 # ユーティリティ関数
│   │   ├── typescript-generator.ts # TypeScriptコードジェネレーター
│   │   └── openapi-parser.ts     # OpenAPIパーサー
│   ├── 📁 views/                 # ビューコンポーネント
│   │   ├── GenerateView.vue      # 生成ビュー
│   │   └── HomeView.vue          # ホームビュー
│   ├── 📁 styles/                # スタイルファイル
│   │   └── main.css              # メインスタイルシート
│   ├── App.vue                   # ルートコンポーネント
│   └── main.ts                   # アプリケーションエントリー
├── 📁 template/                  # ビルド出力ディレクトリ
├── 📄 package.json               # プロジェクト依存関係設定
├── 📄 vite.config.ts             # Vite設定
├── 📄 tailwind.config.js         # Tailwind CSS設定
├── 📄 tsconfig.json              # TypeScript設定
├── 📄 .env.*                     # 環境変数設定
└── 📄 README.md                  # プロジェクトドキュメント
```

### 主要ファイルの説明

#### 🎯 メインコンポーネント
- **`GenerateView.vue`**：入力エリアと出力プレビューを含むメインインターフェースコンポーネント
- **`CodeEditor.vue`**：シンタックスハイライトとフォーマット機能付きのコードエディター
- **`FileTree.vue`**：タグでグループ化された生成ファイルを表示するファイルツリー

#### ⚙️ 主要ツール
- **`typescript-generator.ts`**：TypeScriptコード生成エンジン
  - `generateApiFiles()`: APIインターフェースファイルの生成
  - `schemaToTypeScript()`: OpenAPI SchemaをTypeScript型に変換
  - `generateFileStructure()`: ファイル構造ツリーの生成
- **`openapi-parser.ts`**：OpenAPI文書パーサー

#### 🔧 設定ファイル
- **`vite.config.ts`**：ビルド設定、templateディレクトリに出力
- **`tailwind.config.js`**：UIスタイル設定
- **`.env.production`**：本番環境変数設定

## 🚀 クイックスタート

### 要件
- Node.js >= 20.0.0
- pnpm >= 10.0.0（推奨）

### 依存関係のインストール
```bash
# pnpmを使用（推奨）
pnpm install

# またはnpmを使用
npm install
```

### 開発モード
```bash
# 開発サーバーを起動
pnpm dev

# http://localhost:5173 にアクセス
```

### ビルドとデプロイ
```bash
# 本番版をビルド
pnpm build

# ビルド結果をプレビュー
pnpm preview
```

### 使用方法

1. **OpenAPI文書の入力**
   - 左側のエディターにOpenAPI JSON/YAML文書を貼り付けまたは入力
   - OpenAPI 3.0+仕様をサポート

2. **生成オプションの設定**
   - コメントを含むかどうかを選択
   - 命名スタイルを設定
   - ファイルグループ化方法を設定

3. **TypeScriptコードの生成**
   - 「コード生成」ボタンをクリック
   - 右側で生成されたTypeScriptコードをプレビュー
   - ファイルツリー構造を確認

4. **コードのエクスポート**
   - 個別ファイルの内容をコピー
   - 完全なコードパッケージをダウンロード

## 🌟 特徴

### 🎨 現代的なインターフェース
- **レスポンシブデザイン**：様々な画面サイズに完璧に対応
- **ダークテーマ**：目に優しいダークインターフェースデザイン
- **直感的な操作**：シンプルで明確なユーザーインタラクション

### ⚡ 高性能
- **リアルタイム生成**：ミリ秒レベルのコード生成速度
- **メモリ最適化**：効率的なメモリ使用とガベージコレクション
- **遅延読み込み**：必要に応じてコンポーネントとリソースを読み込み

### 🔒 コード品質
- **型安全性**：100% TypeScriptカバレッジ
- **コード標準**：ESLint + Prettierでコード品質を保証

### 🌐 デプロイフレンドリー
- **静的デプロイ**：GitHub Pages、Vercel、Netlifyなどのプラットフォームをサポート
- **CDN最適化**：リソース圧縮とキャッシュ最適化
- **SEOフレンドリー**：優れた検索エンジン最適化

## 🚀 デプロイ

### GitHub Pages自動デプロイ

プロジェクトはGitHub Actions自動デプロイワークフローを設定済み：

1. **コードをプッシュ**：`main`ブランチにコードをプッシュ
2. **自動ビルド**：GitHub Actionsが自動的にビルドを実行
3. **オンラインデプロイ**：ビルド完了後、自動的にGitHub Pagesにデプロイ

### 手動デプロイ

```bash
# 1. プロジェクトをビルド
pnpm build:prod
pnpm build:dev
pnpm build:test

# 2. templateディレクトリを静的サーバーにデプロイ
# 例：Nginx、Apache、またはCDNにアップロード
```

### 環境変数設定

本番環境では以下の環境変数が必要：

```bash
# .env.production
VITE_OUTDIR_PATH=template/
VITE_APP_TITLE=OpenAPI to TypeScript コンバーター
```

## 🤝 貢献

あらゆる形の貢献を歓迎します！

### 開発ワークフロー

1. **プロジェクトをフォーク**
   ```bash
   git clone https://github.com/your-username/vue3-Ts-Tailwind-template-Pro-private.git
   ```

2. **機能ブランチを作成**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **開発とテスト**
   ```bash
   pnpm dev        # 開発サーバーを起動
   pnpm test       # テストを実行
   pnpm lint       # コードチェック
   ```

4. **コードをコミット**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **プッシュしてPRを作成**
   ```bash
   git push origin feature/your-feature-name
   ```

### コード標準

- ESLintとPrettierの設定に従う
- すべてのコードをTypeScriptで記述
- 適切なコメントとドキュメントを追加
- 新機能をカバーする単体テストを作成

### コミットメッセージ標準

[Conventional Commits](https://www.conventionalcommits.org/)仕様を使用：

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント更新
- `style`: コードフォーマット調整
- `refactor`: コードリファクタリング
- `test`: テスト関連
- `chore`: ビルドまたは補助ツールの変更

## 📄 ライセンス

このプロジェクトは[MIT License](LICENSE)の下でライセンスされています。

## 🙏 謝辞

以下のオープンソースプロジェクトのサポートに感謝します：

- [Vue.js](https://vuejs.org/) - プログレッシブJavaScriptフレームワーク
- [TypeScript](https://www.typescriptlang.org/) - JavaScriptのスーパーセット
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストCSSフレームワーク
- [Vite](https://vitejs.dev/) - 次世代フロントエンドビルドツール

## 📞 お問い合わせ

ご質問やご提案がございましたら、以下の方法でお気軽にお問い合わせください：

- 📧 [Issue](https://github.com/doweinide/font_openApi_to_ts/issues)を提出
- 💬 [Discussion](https://github.com/doweinide/font_openApi_to_ts/discussions)を開始

---

⭐ このプロジェクトがお役に立ちましたら、Starをお願いします！

## 📚 他言語版

- [English Version](README.md)
- [中文版本 (Chinese)](README.zh-cn.md)