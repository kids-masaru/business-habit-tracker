'use client';

import { Record as WorkRecord, Task } from '@/lib/types';
import { useMemo } from 'react';

interface CalendarProps {
    records: WorkRecord[];
    tasks: Task[];
}

export default function Calendar({ records, tasks }: CalendarProps) {
    const { calendarDays, monthName, year } = useMemo(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const monthName = new Date(year, month).toLocaleString('ja-JP', { month: 'long' });

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        const days = [];

        // 先月の空白
        for (let i = 0; i < firstDay; i++) {
            days.push({ day: null });
        }

        // 今月の日付
        for (let i = 1; i <= lastDate; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

            const dayRecords = records.filter(r => r.date === dateStr);
            const totalDuration = dayRecords.reduce((sum, r) => sum + r.duration, 0);

            const taskDurations: { [key: string]: { duration: number, color: string } } = {};

            dayRecords.forEach(r => {
                if (!taskDurations[r.task_id]) {
                    taskDurations[r.task_id] = { duration: 0, color: r.task_color };
                }
                taskDurations[r.task_id].duration += r.duration;
            });

            days.push({
                day: i,
                date: dateStr,
                totalDuration,
                taskDurations,
                isToday: i === now.getDate(),
                dayOfWeek: new Date(year, month, i).getDay()
            });
        }

        return { calendarDays: days, monthName, year };
    }, [records]);

    return (
        <div className="p-5">
            <div className="text-center text-lg font-medium py-2 mb-2">
                {year}年{monthName}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                    <div
                        key={index}
                        className={`text-center text-xs font-medium py-1 ${index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : ''
                            }`}
                    >
                        {day}
                    </div>
                ))}

                {calendarDays.map((item, index) => {
                    if (item.day === null) {
                        return <div key={index} className="text-center text-gray-300 text-xs p-1"></div>;
                    }

                    const isWeekend = item.dayOfWeek === 0 || item.dayOfWeek === 6;

                    return (
                        <div
                            key={index}
                            className={`text-center p-1 min-h-[60px] border border-transparent rounded hover:border-gray-200 ${item.isToday ? 'bg-blue-50 ring-1 ring-blue-200' : ''
                                } ${isWeekend && !item.isToday ? 'bg-gray-50' : ''}`}
                        >
                            <div className={`text-xs font-medium mb-1 ${item.dayOfWeek === 0 ? 'text-red-500' : item.dayOfWeek === 6 ? 'text-blue-500' : ''
                                }`}>
                                {item.day}
                            </div>

                            {item.totalDuration > 0 && (
                                <>
                                    <div className="h-2 flex w-full rounded-full overflow-hidden bg-gray-100">
                                        {Object.entries(item.taskDurations).map(([taskId, info]) => (
                                            <div
                                                key={taskId}
                                                className={`bg-${info.color}`}
                                                style={{ width: `${(info.duration / item.totalDuration) * 100}%` }}
                                                title={`${info.duration}分`}
                                            ></div>
                                        ))}
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-1">{item.totalDuration}分</div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
