'use client';

import { useState } from 'react';
import { Record as WorkRecord, Task } from '@/lib/types';
import WeeklyChart from './WeeklyChart';
import TasksChart from './TasksChart';
import Calendar from './Calendar';

interface ChartsProps {
    userId: string;
    records: WorkRecord[];
    tasks: Task[];
}

export default function Charts({ userId, records, tasks }: ChartsProps) {
    const [activeTab, setActiveTab] = useState<'weekly' | 'tasks' | 'calendar'>('weekly');

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex border-b">
                <button
                    className={`flex-1 py-3 px-4 font-medium text-center transition ${activeTab === 'weekly'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('weekly')}
                >
                    週間グラフ
                </button>
                <button
                    className={`flex-1 py-3 px-4 font-medium text-center transition ${activeTab === 'tasks'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('tasks')}
                >
                    業務別
                </button>
                <button
                    className={`flex-1 py-3 px-4 font-medium text-center transition ${activeTab === 'calendar'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('calendar')}
                >
                    月間カレンダー
                </button>
            </div>

            <div className="p-1">
                {activeTab === 'weekly' && <WeeklyChart records={records} tasks={tasks} />}
                {activeTab === 'tasks' && <TasksChart records={records} tasks={tasks} />}
                {activeTab === 'calendar' && <Calendar records={records} tasks={tasks} />}
            </div>
        </div>
    );
}
