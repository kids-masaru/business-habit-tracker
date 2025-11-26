'use client';

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Record as WorkRecord, Task } from '@/lib/types';
import { useMemo } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TasksChartProps {
    records: WorkRecord[];
    tasks: Task[];
}

export default function TasksChart({ records, tasks }: TasksChartProps) {
    const chartData = useMemo(() => {
        // 過去7日間のデータを対象とする
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        const startDateStr = sevenDaysAgo.toISOString().split('T')[0];

        const filteredRecords = records.filter(r => r.date >= startDateStr);

        // タスクごとの集計
        const taskTotals: { [key: string]: number } = {};

        filteredRecords.forEach(record => {
            if (!taskTotals[record.task_id]) {
                taskTotals[record.task_id] = 0;
            }
            taskTotals[record.task_id] += record.duration;
        });

        // データがあるタスクのみ抽出
        const activeTasks = tasks.filter(task => taskTotals[task.id] > 0);

        // データがない場合のダミー
        if (activeTasks.length === 0) {
            return {
                labels: ['データなし'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['rgba(209, 213, 219, 0.3)'],
                    borderColor: ['rgba(209, 213, 219, 1)'],
                    borderWidth: 1,
                }]
            };
        }

        // カラーマッピング
        const getColor = (colorName: string) => {
            const colors: { [key: string]: string } = {
                'blue-500': '59, 130, 246',
                'green-500': '34, 197, 94',
                'red-500': '239, 68, 68',
                'yellow-500': '234, 179, 8',
                'purple-500': '168, 85, 247',
                'pink-500': '236, 72, 153',
                'indigo-500': '99, 102, 241',
                'teal-500': '20, 184, 166',
                'orange-500': '249, 115, 22',
                'cyan-500': '6, 182, 212',
            };
            return colors[colorName] || '209, 213, 219';
        };

        return {
            labels: activeTasks.map(t => t.name),
            datasets: [{
                data: activeTasks.map(t => taskTotals[t.id]),
                backgroundColor: activeTasks.map(t => `rgba(${getColor(t.color)}, 0.7)`),
                borderColor: activeTasks.map(t => `rgba(${getColor(t.color)}, 1)`),
                borderWidth: 1,
            }]
        };
    }, [records, tasks]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    boxWidth: 12,
                    font: {
                        size: 10,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value}分 (${percentage}%)`;
                    }
                }
            }
        },
    };

    return (
        <div className="h-64">
            <Doughnut data={chartData} options={options} />
        </div>
    );
}
