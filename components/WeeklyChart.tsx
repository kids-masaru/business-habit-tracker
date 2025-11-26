'use client';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Record as WorkRecord, Task } from '@/lib/types';
import { useMemo } from 'react';
import { COLOR_MAP, hexToRgb } from '@/lib/colors';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface WeeklyChartProps {
    records: WorkRecord[];
    tasks: Task[];
}

export default function WeeklyChart({ records, tasks }: WeeklyChartProps) {
    const chartData = useMemo(() => {
        // 過去7日間の日付を生成
        const dates: string[] = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push(date.toISOString().split('T')[0]);
        }

        // データセットの作成
        const datasets = tasks.map((task) => {
            const data = dates.map((date) => {
                const dayRecords = records.filter(
                    (r) => r.task_id === task.id && r.date === date
                );
                return dayRecords.reduce((sum, r) => sum + r.duration, 0);
            });

            const color = hexToRgb(COLOR_MAP[task.color] || '#d1d5db');

            return {
                label: task.name,
                data: data,
                backgroundColor: `rgba(${color}, 0.7)`,
                borderColor: `rgba(${color}, 1)`,
                borderWidth: 1,
            };
        });

        // 曜日のラベル
        const labels = dates.map((date) => {
            const d = new Date(date);
            const days = ['日', '月', '火', '水', '木', '金', '土'];
            return date === new Date().toISOString().split('T')[0]
                ? '今日'
                : days[d.getDay()];
        });

        return {
            labels,
            datasets,
        };
    }, [records, tasks]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
                title: {
                    display: true,
                    text: '作業時間（分）',
                },
            },
        },
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
                    footer: (tooltipItems: any[]) => {
                        let total = 0;
                        tooltipItems.forEach((item) => {
                            total += item.parsed.y;
                        });
                        return `合計: ${total}分`;
                    },
                },
            },
        },
    };

    return (
        <div className="h-64">
            <Bar data={chartData} options={options} />
        </div>
    );
}
