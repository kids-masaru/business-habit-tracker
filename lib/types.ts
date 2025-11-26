// 型定義

export interface Task {
  id: string;
  user_id: string;
  name: string;
  duration: number; // 分単位
  color: string;
  created_at?: string;
}

export interface Record {
  id: string;
  user_id: string;
  task_id: string;
  task_name: string;
  task_color: string;
  start_time: string;
  end_time: string;
  duration: number; // 分単位
  date: string; // YYYY-MM-DD形式
  created_at?: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  task_id: string;
  task_name: string;
  time: string; // HH:MM形式
  repeat: 'daily' | 'weekdays' | 'weekends';
  created_at?: string;
}

export interface User {
  id: string;
  created_at?: string;
}

// API レスポンス型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 統計データ型
export interface WeeklyStats {
  dates: string[];
  tasks: {
    [taskId: string]: {
      name: string;
      color: string;
      data: number[];
    };
  };
}

export interface TasksStats {
  tasks: {
    id: string;
    name: string;
    color: string;
    totalDuration: number;
  }[];
}

export interface TodayRecord {
  task_id: string;
  task_name: string;
  task_color: string;
  total_duration: number;
  sessions: {
    start_time: string;
    end_time: string;
    duration: number;
  }[];
}

// カラーオプション
export const COLORS = [
  'blue-500',
  'green-500',
  'emerald-500',
  'lime-500',
  'red-500',
  'rose-500',
  'orange-500',
  'amber-500',
  'yellow-500',
  'purple-500',
  'violet-500',
  'fuchsia-500',
  'pink-500',
  'indigo-500',
  'sky-500',
  'teal-500',
  'cyan-500'
] as const;

export type ColorType = typeof COLORS[number];
