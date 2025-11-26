'use client';

import { useState, useEffect } from 'react';
import { Task, Reminder } from '@/lib/types';

interface ReminderPanelProps {
    userId: string;
    tasks: Task[];
    reminders: Reminder[];
    onClose: () => void;
    onUpdate: () => void;
}

export default function ReminderPanel({
    userId,
    tasks,
    reminders,
    onClose,
    onUpdate,
}: ReminderPanelProps) {
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if ('Notification' in window) {
            const result = await Notification.requestPermission();
            setPermission(result);
        }
    };

    const handleToggleReminder = async (task: Task, isActive: boolean) => {
        if (isActive) {
            // リマインダー作成（デフォルト値）
            try {
                await fetch('/api/reminders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId,
                        taskId: task.id,
                        taskName: task.name,
                        time: '18:00',
                        repeat: 'daily',
                    }),
                });
                onUpdate();
            } catch (error) {
                console.error('Error creating reminder:', error);
            }
        } else {
            // リマインダー削除
            try {
                await fetch(`/api/reminders?taskId=${task.id}&userId=${userId}`, {
                    method: 'DELETE',
                });
                onUpdate();
            } catch (error) {
                console.error('Error deleting reminder:', error);
            }
        }
    };

    const handleUpdateReminder = async (
        reminderId: string,
        taskId: string,
        taskName: string,
        time: string,
        repeat: string
    ) => {
        try {
            await fetch('/api/reminders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: reminderId,
                    userId,
                    taskId,
                    taskName,
                    time,
                    repeat,
                }),
            });
            onUpdate();
            alert('保存しました');
        } catch (error) {
            console.error('Error updating reminder:', error);
            alert('保存に失敗しました');
        }
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                onClick={onClose}
            ></div>
            <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl transform transition-transform z-50 overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-800">
                            リマインダー設定
                        </h3>
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

                    {permission !== 'granted' && (
                        <div className="bg-yellow-100 p-4 rounded-lg mb-6">
                            <p className="font-medium text-yellow-800 mb-2">
                                通知が許可されていません
                            </p>
                            <p className="text-sm text-yellow-700 mb-3">
                                リマインダー機能を使うには通知を許可してください
                            </p>
                            <button
                                onClick={requestPermission}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm w-full"
                            >
                                通知を許可
                            </button>
                        </div>
                    )}

                    <div className="space-y-4">
                        <p className="text-gray-500 text-sm">
                            業務ごとにリマインダーを設定できます。設定した時間にブラウザ通知が届きます。
                        </p>

                        {tasks.length === 0 ? (
                            <div className="text-center py-4 text-gray-400">
                                業務を追加するとリマインダーを設定できます
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tasks.map((task) => {
                                    const reminder = reminders.find((r) => r.task_id === task.id);
                                    const hasReminder = !!reminder;

                                    return (
                                        <div
                                            key={task.id}
                                            className={`p-3 border rounded-lg ${hasReminder ? 'border-blue-400 bg-blue-50' : ''
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    <div
                                                        className={`w-3 h-3 rounded-full bg-${task.color} mr-2`}
                                                    ></div>
                                                    <span className="font-medium">{task.name}</span>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={hasReminder}
                                                        onChange={(e) =>
                                                            handleToggleReminder(task, e.target.checked)
                                                        }
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>

                                            {hasReminder && reminder && (
                                                <div className="mt-3 grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">
                                                            時間
                                                        </label>
                                                        <input
                                                            type="time"
                                                            className="w-full text-sm p-1 border rounded"
                                                            defaultValue={reminder.time}
                                                            onBlur={(e) =>
                                                                handleUpdateReminder(
                                                                    reminder.id,
                                                                    task.id,
                                                                    task.name,
                                                                    e.target.value,
                                                                    reminder.repeat
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">
                                                            繰り返し
                                                        </label>
                                                        <select
                                                            className="w-full text-sm p-1 border rounded"
                                                            defaultValue={reminder.repeat}
                                                            onChange={(e) =>
                                                                handleUpdateReminder(
                                                                    reminder.id,
                                                                    task.id,
                                                                    task.name,
                                                                    reminder.time,
                                                                    e.target.value
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
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
