import { sql } from '@vercel/postgres';
import { Task, Record, Reminder, User } from './types';

// データベース接続テスト
export async function testConnection() {
    try {
        const result = await sql`SELECT NOW()`;
        return { success: true, time: result.rows[0].now };
    } catch (error) {
        console.error('Database connection error:', error);
        return { success: false, error };
    }
}

// ユーザー操作
export async function createUser(userId: string): Promise<User> {
    const result = await sql`
    INSERT INTO users (id)
    VALUES (${userId})
    ON CONFLICT (id) DO NOTHING
    RETURNING *
  `;
    return result.rows[0] as User;
}

export async function getUser(userId: string): Promise<User | null> {
    const result = await sql`
    SELECT * FROM users WHERE id = ${userId}
  `;
    return result.rows[0] as User || null;
}

// タスク操作
export async function getTasks(userId: string): Promise<Task[]> {
    const result = await sql`
    SELECT * FROM tasks
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
    return result.rows as Task[];
}

export async function createTask(task: Omit<Task, 'created_at'>): Promise<Task> {
    const result = await sql`
    INSERT INTO tasks (id, user_id, name, duration, color)
    VALUES (${task.id}, ${task.user_id}, ${task.name}, ${task.duration}, ${task.color})
    RETURNING *
  `;
    return result.rows[0] as Task;
}

export async function updateTask(task: Task): Promise<Task> {
    const result = await sql`
    UPDATE tasks
    SET name = ${task.name}, duration = ${task.duration}, color = ${task.color}
    WHERE id = ${task.id} AND user_id = ${task.user_id}
    RETURNING *
  `;
    return result.rows[0] as Task;
}

export async function deleteTask(taskId: string, userId: string): Promise<void> {
    await sql`
    DELETE FROM tasks
    WHERE id = ${taskId} AND user_id = ${userId}
  `;
}

// 記録操作
export async function getRecords(
    userId: string,
    startDate?: string,
    endDate?: string
): Promise<Record[]> {
    if (startDate && endDate) {
        const result = await sql`
      SELECT * FROM records
      WHERE user_id = ${userId}
        AND date >= ${startDate}
        AND date <= ${endDate}
      ORDER BY date DESC, start_time DESC
    `;
        return result.rows as Record[];
    } else {
        const result = await sql`
      SELECT * FROM records
      WHERE user_id = ${userId}
      ORDER BY date DESC, start_time DESC
      LIMIT 100
    `;
        return result.rows as Record[];
    }
}

export async function createRecord(record: Omit<Record, 'created_at'>): Promise<Record> {
    const result = await sql`
    INSERT INTO records (
      id, user_id, task_id, task_name, task_color,
      start_time, end_time, duration, date
    )
    VALUES (
      ${record.id}, ${record.user_id}, ${record.task_id}, ${record.task_name},
      ${record.task_color}, ${record.start_time}, ${record.end_time},
      ${record.duration}, ${record.date}
    )
    RETURNING *
  `;
    return result.rows[0] as Record;
}

export async function deleteRecord(recordId: string, userId: string): Promise<void> {
    await sql`
    DELETE FROM records
    WHERE id = ${recordId} AND user_id = ${userId}
  `;
}

// リマインダー操作
export async function getReminders(userId: string): Promise<Reminder[]> {
    const result = await sql`
    SELECT * FROM reminders
    WHERE user_id = ${userId}
    ORDER BY time ASC
  `;
    return result.rows as Reminder[];
}

export async function createReminder(reminder: Omit<Reminder, 'created_at'>): Promise<Reminder> {
    const result = await sql`
    INSERT INTO reminders (id, user_id, task_id, task_name, time, repeat)
    VALUES (
      ${reminder.id}, ${reminder.user_id}, ${reminder.task_id},
      ${reminder.task_name}, ${reminder.time}, ${reminder.repeat}
    )
    RETURNING *
  `;
    return result.rows[0] as Reminder;
}

export async function updateReminder(reminder: Reminder): Promise<Reminder> {
    const result = await sql`
    UPDATE reminders
    SET time = ${reminder.time}, repeat = ${reminder.repeat}
    WHERE id = ${reminder.id} AND user_id = ${reminder.user_id}
    RETURNING *
  `;
    return result.rows[0] as Reminder;
}

export async function deleteReminder(reminderId: string, userId: string): Promise<void> {
    await sql`
    DELETE FROM reminders
    WHERE id = ${reminderId} AND user_id = ${userId}
  `;
}

export async function deleteReminderByTaskId(taskId: string, userId: string): Promise<void> {
    await sql`
    DELETE FROM reminders
    WHERE task_id = ${taskId} AND user_id = ${userId}
  `;
}

// 統計データ取得
export async function getWeeklyStats(userId: string) {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const startDate = sevenDaysAgo.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];

    const result = await sql`
    SELECT task_id, task_name, task_color, date, SUM(duration) as total_duration
    FROM records
    WHERE user_id = ${userId}
      AND date >= ${startDate}
      AND date <= ${endDate}
    GROUP BY task_id, task_name, task_color, date
    ORDER BY date ASC
  `;

    return result.rows;
}

export async function getTasksStats(userId: string, days: number = 7) {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (days - 1));

    const startDateStr = startDate.toISOString().split('T')[0];

    const result = await sql`
    SELECT task_id, task_name, task_color, SUM(duration) as total_duration
    FROM records
    WHERE user_id = ${userId}
      AND date >= ${startDateStr}
    GROUP BY task_id, task_name, task_color
    ORDER BY total_duration DESC
  `;

    return result.rows;
}

export async function getTodayRecords(userId: string) {
    const today = new Date().toISOString().split('T')[0];

    const result = await sql`
    SELECT *
    FROM records
    WHERE user_id = ${userId}
      AND date = ${today}
    ORDER BY start_time ASC
  `;

    return result.rows as Record[];
}
