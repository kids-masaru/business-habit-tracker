# 業務習慣化アプリ (Business Habit Tracker)

Notionウィジェットとして使用できる、業務時間管理・習慣化アプリケーションです。
Next.jsとVercel Postgresを使用して構築されており、デバイス間のデータ同期が可能です。

## 機能

- **タスク管理**: 業務の追加、編集、削除（色分け可能）
- **タイマー機能**: 作業時間の計測、一時停止、再開
- **実績可視化**:
  - 週間グラフ（棒グラフ）
  - 業務別割合（ドーナツグラフ）
  - 月間カレンダー（ヒートマップ風）
- **リマインダー**: ブラウザ通知による作業開始リマインダー
- **データ同期**: URL（ユーザーID）による複数デバイス間の同期

## デプロイ手順 (Vercel)

このアプリケーションをVercelにデプロイする手順です。

### 1. 準備

1. GitHubにこのリポジトリをプッシュします。
2. [Vercel](https://vercel.com)のアカウントを作成・ログインします。

### 2. プロジェクト作成

1. Vercelダッシュボードで「Add New...」 -> 「Project」を選択します。
2. GitHubリポジトリをインポートします。
3. Framework Presetは「Next.js」が自動選択されます。

### 3. データベース設定 (Vercel Postgres)

1. プロジェクト作成画面、または作成後の「Storage」タブから「Connect Store」を選択します。
2. 「Postgres」を選択し、「Create New」をクリックします。
3. データベース名（例: `habit-tracker-db`）とリージョン（日本なら `Tokyo (hnd1)` 推奨）を選択して作成します。
4. 作成後、環境変数が自動的にプロジェクトに追加されます（`POSTGRES_URL` など）。

### 4. デプロイと初期化

1. 「Deploy」ボタンをクリックしてデプロイを開始します。
2. デプロイが完了したら、アプリケーションのURLを開きます。
3. **初回のみ**、データベースの初期化が必要です。ブラウザで以下のURLにアクセスしてください：
   `https://あなたのアプリのURL/api/seed`
   
   `{"success":true,"message":"Database seeded successfully"}` と表示されれば成功です。

### 5. Notionへの埋め込み

1. アプリケーションのトップページを開くと、自動的にユーザーIDが生成され、専用URL（例: `.../app/ユーザーID`）にリダイレクトされます。
2. このURLをコピーします。
3. Notionページを開き、`/embed` と入力して「Embed」ブロックを選択します。
4. コピーしたURLを貼り付けます。
5. 必要に応じてサイズを調整してください。

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

## 技術スタック

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Vercel Postgres
- **Charts**: Chart.js / react-chartjs-2
