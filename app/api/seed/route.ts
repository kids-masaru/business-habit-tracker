import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
    try {
        // ユーザーテーブル
        await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

        // タスクテーブル
        await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        duration INTEGER NOT NULL,
        color VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

        // 記録テーブル
        await sql`
      CREATE TABLE IF NOT EXISTS records (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        task_id VARCHAR(255) NOT NULL,
        task_name VARCHAR(255) NOT NULL,
        task_color VARCHAR(50) NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        duration INTEGER NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
      );
    `;

        // リマインダーテーブル
        await sql`
      CREATE TABLE IF NOT EXISTS reminders (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        task_id VARCHAR(255) NOT NULL,
        task_name VARCHAR(255) NOT NULL,
        time VARCHAR(10) NOT NULL,
        repeat VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
      );
    `;

        // インデックス作成
        await sql`CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);`;
        await sql`CREATE INDEX IF NOT EXISTS idx_records_user_id ON records(user_id);`;
        await sql`CREATE INDEX IF NOT EXISTS idx_records_date ON records(date);`;
        await sql`CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);`;
        await sql`CREATE INDEX IF NOT EXISTS idx_reminders_task_id ON reminders(task_id);`;

        return NextResponse.json({ success: true, message: 'Database seeded successfully' });
    } catch (error) {
        console.error('Error seeding database:', error);
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}
