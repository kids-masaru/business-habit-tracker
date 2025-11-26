'use client';

import { Record as WorkRecord } from '@/lib/types';
import { useMemo } from 'react';

interface TodaySummaryProps {
    userId: string;
    records: WorkRecord[];
}

export default function TodaySummary({ records }: TodaySummaryProps) {
    const todayRecords = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return records.filter((record) => record.date === today);
    }, [records]);

    const taskGroups = useMemo(() => {
        const groups: {
            [taskId: string]: {
                name: string;
                color: string;
                totalDuration: number;
                sessions: {
                    startTime: string;
                    endTime: string;
                    duration: number;
                }[];
            };
        } = {};

        todayRecords.forEach((record) => {
            if (!groups[record.task_id]) {
                groups[record.task_id] = {
                    name: record.task_name,
                    color: record.task_color,
                    totalDuration: 0,
                    sessions: [],
                };
            }

            groups[record.task_id].totalDuration += record.duration;
            groups[record.task_id].sessions.push({
                startTime: new Date(record.start_time).toLocaleTimeString(),
                endTime: new Date(record.end_time).toLocaleTimeString(),
                duration: record.duration,
            });
        });

        return groups;
    }, [todayRecords]);

    const totalTime = useMemo(() => {
        return todayRecords.reduce((sum, record) => sum + record.duration, 0);
    }, [todayRecords]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">今日の実績</h2>

            {todayRecords.length === 0 ? (
                <div className="text-center py-4 text-gray-400">今日の記録はまだありません</div>
            ) : (
                <>
                    <div className="space-y-3">
                        {Object.values(taskGroups).map((group, index) => (
                            <div key={index} className={`border-l-4 border-${group.color} pl-3`}>
                                <div className="flex justify-between items-center">
                                    <h3 className="font-medium">{group.name}</h3>
                                    <span className="text-sm text-gray-500">計 {group.totalDuration}分</span>
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    {group.sessions.map((session, idx) => (
                                        <div key={idx} className="flex justify-between">
                                            <span>
                                                {session.startTime} - {session.endTime}
                                            </span>
                                            <span>{session.duration}分</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-right">
                        <p className="text-sm text-gray-500">
                            合計時間: <span className="font-medium">{totalTime}分</span>
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
