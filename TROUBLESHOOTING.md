# トラブルシューティングガイド

## エラー: `VercelPostgresError - 'missing_connection_string'`

このエラーは、VercelプロジェクトにPostgresデータベースが正しく接続されていない（環境変数が設定されていない）場合に発生します。

### 解決手順

1. **Vercelダッシュボードを開く**
   [Vercel Dashboard](https://vercel.com/dashboard) にアクセスし、`business-habit-tracker` プロジェクトを開きます。

2. **データベースを接続する**
   - 上部メニューの **"Storage"** タブをクリックします。
   - **"Connect Store"** ボタンをクリックします。
   - 作成済みのPostgresデータベースを選択し、**"Connect"** をクリックします。
     （まだ作成していない場合は "Create New" から作成してください）

3. **環境変数の確認**
   - **"Settings"** -> **"Environment Variables"** を確認します。
   - `POSTGRES_URL`, `POSTGRES_PRISMA_URL` などが追加されていることを確認します。

4. **再デプロイ（重要）**
   環境変数はビルド時に適用されるため、接続しただけでは反映されません。
   - **"Deployments"** タブをクリックします。
   - 最新のデプロイの右側にある3点リーダー（...）をクリックします。
   - **"Redeploy"** を選択します。
   - "Redeploy" ボタンを押して再デプロイを実行します。

5. **動作確認**
   - デプロイ完了後、アプリを開きます。
   - データベース初期化のため、一度 `https://あなたのアプリURL/api/seed` にアクセスします。
   - その後、タスク追加を試してください。
