'use client';

import { useState } from 'react';
import { COLORS, ColorType } from '@/lib/types';

interface TaskModalProps {
    userId: string;
    onClose: () => void;
    onTaskCreated: () => void;
}

export default function TaskModal({ userId, onClose, onTaskCreated }: TaskModalProps) {
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('60');
    const [color, setColor] = useState<ColorType>('blue-500');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // リマインダー設定（簡易版）
    const [setReminder, setSetReminder] = useState(false);
    const [reminderTime, setReminderTime] = useState('18:00');
    const [reminderRepeat, setReminderRepeat] = useState<'daily' | 'weekdays' | 'weekends'>('daily');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !duration) return;

        setIsSubmitting(true);

        try {
            // タスク作成
            const taskResponse = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    name,
                    duration,
                    color,
                }),
            });

            const taskData = await taskResponse.json();

            if (!taskResponse.ok) {
                throw new Error(taskData.error || 'Failed to create task');
            }

            // リマインダー作成（設定されている場合）
            if (setReminder && taskData.success && taskData.data) {
                await fetch('/api/reminders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId,
                        taskId: taskData.data.id,
                        taskName: taskData.data.name,
                        time: reminderTime,
                        repeat: reminderRepeat,
                    }),
                });
            }

            onTaskCreated();
        } catch (error: any) {
            console.error('Error creating task:', error);
            alert(`タスクの作成に失敗しました: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn">
            <div className="bg-white rounded-lg w-full max-w-md p-6 m-4 shadow-xl transform transition-all">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">業務を追加</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-medium mb-2"
                            htmlFor="task-name"
                        >
                            業務名
                        </label>
                        <input
                            id="task-name"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="例: デザイン業務"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-medium mb-2"
                            htmlFor="task-duration"
                        >
                            目標時間（分）
                        </label>
                        <input
                            id="task-duration"
                            type="number"
                            min="5"
                            step="5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                        />
                    </div>
                    checked={setReminder}
                    onChange={(e) => setSetReminder(e.target.checked)}
                            />
                    <span className="ml-2 text-sm text-gray-700">
                        リマインダーを設定する
                    </span>
                </label>
            </div>

            {setReminder && (
                <div className="mb-4 grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-md">
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">時間</label>
                        <input
                            type="time"
                            className="w-full text-sm p-1 border rounded"
                            value={reminderTime}
                            onChange={(e) => setReminderTime(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">
                            繰り返し
                        </label>
                        <select
                            className="w-full text-sm p-1 border rounded"
                            value={reminderRepeat}
                            onChange={(e) =>
                                setReminderRepeat(
                                    e.target.value as 'daily' | 'weekdays' | 'weekends'
                                )
                            }
                        >
                            <option value="daily">毎日</option>
                            <option value="weekdays">平日のみ</option>
                            <option value="weekends">週末のみ</option>
                        </select>
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
            >
                {isSubmitting ? '追加中...' : '追加する'}
            </button>
        </form>
            </div >
        </div >
    );
}
