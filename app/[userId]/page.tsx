'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Task, Record as WorkRecord, Reminder } from '@/lib/types';
import TaskList from '@/components/TaskList';
import Timer from '@/components/Timer';
import TodaySummary from '@/components/TodaySummary';
import Charts from '@/components/Charts';
import TaskModal from '@/components/TaskModal';
import SettingsPanel from '@/components/SettingsPanel';

export default function AppPage() {
    const params = useParams();
    const userId = params.userId as string;

    const [tasks, setTasks] = useState<Task[]>([]);
    const [records, setRecords] = useState<WorkRecord[]>([]);
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // データの読み込み
    useEffect(() => {
        if (userId) {
            loadData();
        }
    }, [userId]);

    const loadData = async () => {
        try {
            setLoading(true);
            await Promise.all([loadTasks(), loadRecords(), loadReminders()]);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadTasks = async () => {
        try {
            const response = await fetch(`/api/tasks?userId=${userId}`);
            const data = await response.json();
            if (data.success) {
                setTasks(data.data);
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    };

    const loadRecords = async () => {
        try {
            const response = await fetch(`/api/records?userId=${userId}`);
            const data = await response.json();
            if (data.success) {
                setRecords(data.data);
            }
        } catch (error) {
            console.error('Error loading records:', error);
        }
    };

    const loadReminders = async () => {
        try {
            const response = await fetch(`/api/reminders?userId=${userId}`);
            const data = await response.json();
            if (data.success) {
                setReminders(data.data);
            }
        } catch (error) {
            console.error('Error loading reminders:', error);
        }
    };

    const handleTaskCreated = () => {
        loadTasks();
        setShowTaskModal(false);
    };

    const handleTaskDeleted = () => {
        loadTasks();
        loadReminders();
    };

    const handleRecordCreated = () => {
        loadRecords();
    };

    const handleStartTask = (task: Task) => {
        setActiveTask(task);
    };

    const handleStopTask = () => {
        setActiveTask(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-700">
                        データを読み込み中...
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                {/* ヘッダー */}
                <header className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">業務習慣化アプリ</h1>
                    <button
                        onClick={() => setShowSettings(true)}
                        className="text-gray-500 hover:text-gray-700 p-2 rounded-lg transition"
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
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </button>
                </header>

                {/* アクティブタイマー */}
                {activeTask && (
                    <Timer
                        task={activeTask}
                        userId={userId}
                        onStop={handleStopTask}
                        onRecordCreated={handleRecordCreated}
                    />
                )}

                {/* メインコンテンツ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 左カラム */}
                    <div className="space-y-6">
                        <TaskList
                            tasks={tasks}
                            userId={userId}
                            onTaskDeleted={handleTaskDeleted}
                            onStartTask={handleStartTask}
                            onAddTask={() => setShowTaskModal(true)}
                        />
                        <TodaySummary userId={userId} records={records} />
                    </div>

                    {/* 右カラム */}
                    <div>
                        <Charts userId={userId} records={records} tasks={tasks} />
                    </div>
                </div>

                {/* モバイル用FAB */}
                <button
                    onClick={() => setShowTaskModal(true)}
                    className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition z-30"
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
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                    </svg>
                </button>

                {/* タスク追加モーダル */}
                {showTaskModal && (
                    <TaskModal
                        userId={userId}
                        onClose={() => setShowTaskModal(false)}
                        onTaskCreated={handleTaskCreated}
                    />
                )}

                {/* 設定パネル */}
                {showSettings && (
                    <SettingsPanel
                        userId={userId}
                        tasks={tasks}
                        reminders={reminders}
                        onClose={() => setShowSettings(false)}
                        onDataCleared={loadData}
                        onRemindersUpdated={loadReminders}
                    />
                )}
            </div>
        </div>
    );
}
