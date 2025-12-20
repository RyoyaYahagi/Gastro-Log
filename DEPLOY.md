# Gastro Log デプロイガイド

Cloudflare + Supabase へのデプロイ手順書

---

## 1. Supabase セットアップ

### 1.1 テーブル作成

Supabase Dashboard → **SQL Editor** → 以下を実行:

```sql
-- supabase_setup.sql の内容をコピー＆ペースト
```

### 1.2 Google OAuth 有効化

1. **Authentication** → **Providers** → **Google**
2. **Enabled** を ON
3. Google Cloud Console で OAuth 認証情報を作成:
   - https://console.cloud.google.com/apis/credentials
   - **OAuth 2.0 クライアント ID** を作成
   - **承認済みのリダイレクト URI** に追加:
     ```
     https://fbyrpgjiwqkdxwdmitqh.supabase.co/auth/v1/callback
     ```
4. クライアント ID とシークレットを Supabase に貼り付け
5. **Save**

---

## 2. GitHub Actions 自動デプロイ設定（推奨）

### 2.1 本番用 API_BASE を設定

`index.html` の `API_BASE` を本番URLに変更:

```javascript
const API_BASE = 'https://gastro-log-api.yhgry.workers.dev';
```

### 2.2 GitHub リポジトリの Secrets を設定

リポジトリ → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret名                    | 値                                                     |
| --------------------------- | ------------------------------------------------------ |
| `CLOUDFLARE_API_TOKEN`      | Cloudflare API トークン（Workers と Pages の編集権限） |
| `CLOUDFLARE_ACCOUNT_ID`     | Cloudflare アカウント ID                               |
| `SUPABASE_URL`              | `https://fbyrpgjiwqkdxwdmitqh.supabase.co`             |
| `SUPABASE_ANON_KEY`         | Supabase の anon public key                            |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase の service role key                           |

### 2.3 Cloudflare API トークン作成

1. https://dash.cloudflare.com/profile/api-tokens
2. **Create Token** → **Edit Cloudflare Workers** テンプレート
3. **Account Resources**: 対象アカウント
4. **Zone Resources**: All zones（または対象ゾーン）
5. **Create Token** → トークンをコピー

### 2.4 デプロイ

```bash
git add .
git commit -m "Deploy"
git push origin main
```

これで自動的に Pages と Workers がデプロイされます。

---

## 3. 手動デプロイ（オプション）

### 3.1 Workers デプロイ

```bash
cd worker
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_ANON_KEY
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler deploy
```

### 3.2 Pages デプロイ

```bash
npx wrangler pages deploy . --project-name=gastro-log
```

---

## 動作確認

1. Pages URL にアクセス
2. 設定画面で「Googleでログイン」
3. ログイン後、同期インジケーターが表示される
4. 食事を記録 → 同期が実行される
