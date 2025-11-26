'use client';

import { Task } from '@/lib/types';

interface TaskListProps {
    tasks: Task[];
    userId: string;
    onTaskDeleted: () => void;
    onStartTask: (task: Task) => void;
    onAddTask: () => void;
}

export default function TaskList({
    tasks,
    userId,
    onTaskDeleted,
    onStartTask,
    onAddTask,
}: TaskListProps) {
    const handleDelete = async (taskId: string) => {
        if (!confirm('このタスクを削除してもよろしいですか？関連する記録も削除されます。')) {
            return;
        }

        try {
            const response = await fetch(`/api/tasks?id=${taskId}&userId=${userId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                onTaskDeleted();
            } else {
                alert('タスクの削除に失敗しました');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('エラーが発生しました');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">登録済み業務</h2>
                <button
                    onClick={onAddTask}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py- 1.5 rounded-md text-sm font-medium transition hidden lg:block"
                >
                    業務を追加
                </button>
            </div>

            {tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                    まだ業務が登録されていません
                    <br />
                    「業務を追加」ボタンから業務を登録してください
                </div>
            ) : (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="p-4 border rounded-lg hover:border-blue-400 bg-white transition"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className={`w-3 h-3 rounded-full bg-${task.color} mr-2`}></div>
                                    <span className="font-medium">{task.name}</span>
                                </div>
                                <span className="text-sm text-gray-500">{task.duration}分</span>
                            </div>
                            <div className="mt-3 flex space-x-2">
                                <button
                                    onClick={() => onStartTask(task)}
                                    className={`flex-1 bg-${task.color} hover:opacity-90 text-white py-2 px-3 rounded text-sm font-medium transition`}
                                >
                                    開始
                                </button>
                                <button
                                    onClick={() => handleDelete(task.id)}
                                    className="p-2 text-gray-500 hover:text-red-500 transition"
                                    title="削除"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
