'use client';

import { useState } from 'react';
import { Task, Reminder } from '@/lib/types';
import ReminderPanel from './ReminderPanel';

interface SettingsPanelProps {
    userId: string;
    tasks: Task[];
    reminders: Reminder[];
    onClose: () => void;
    onDataCleared: () => void;
    onRemindersUpdated: () => void;
}

export default function SettingsPanel({
    userId,
    tasks,
    reminders,
    onClose,
    onDataCleared,
    onRemindersUpdated,
}: SettingsPanelProps) {
    const [showReminders, setShowReminders] = useState(false);

    const handleClearData = async () => {
        if (
            !confirm(
                'すべてのデータ（業務、リマインダー、記録）を削除してもよろしいですか？この操作は元に戻せません。'
            )
        ) {
            return;
        }

        // ここでは簡易的にタスクを全削除する実装（実際にはAPIでユーザーデータ全削除エンドポイントを作ると良い）
        // 今回はタスクをループして削除する簡易実装
        try {
            // 実際にはユーザー削除APIなどを呼ぶべきだが、今回はタスク削除で代用
            // 本来は DELETE /api/user-data?userId=xxx のようなエンドポイントが望ましい
            alert('この機能は現在開発中です。個別にタスクを削除してください。');
            // onDataCleared();
        } catch (error) {
            console.error('Error clearing data:', error);
            alert('エラーが発生しました');
        }
    };

    if (showReminders) {
        return (
            <ReminderPanel
                userId={userId}
                tasks={tasks}
                reminders={reminders}
                onClose={() => setShowReminders(false)}
                onUpdate={onRemindersUpdated}
            />
        );
    }

    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                onClick={onClose}
            ></div>
            <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl transform transition-transform z-50 overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-800">設定</h3>
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

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-lg font-medium text-gray-700 mb-2">
                                アプリ設定
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <button
                                        onClick={() => setShowReminders(true)}
                                        className="w-full flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition"
                                    >
                                        <span className="font-medium">リマインダー設定</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-gray-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                {/* 
                <div>
                  <button
                    onClick={handleClearData}
                    className="w-full flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-lg text-red-500 transition"
                  >
                    <span className="font-medium">すべてのデータを削除</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                */}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-medium text-gray-700 mb-2">
                                このアプリについて
                            </h4>
                            <p className="text-sm text-gray-500">
                                このアプリは複数の副業を時間管理しながら習慣化するためのツールです。各業務の作業時間を記録し、実績をグラフやカレンダーで可視化します。
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                データはクラウドデータベースに保存され、URL（ユーザーID）を知っているデバイス間で同期されます。
                            </p>
                            <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-800 break-all">
                                <p className="font-bold mb-1">あなたのユーザーID:</p>
                                {userId}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
