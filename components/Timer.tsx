'use client';

import { useState, useEffect, useRef } from 'react';
import { Task } from '@/lib/types';

interface TimerProps {
    task: Task;
    userId: string;
    onStop: () => void;
    onRecordCreated: () => void;
}

export default function Timer({ task, userId, onStop, onRecordCreated }: TimerProps) {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [startTime] = useState(new Date().toISOString());
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef(Date.now());
    const pausedTimeRef = useRef(0);

    useEffect(() => {
        if (!isPaused) {
            intervalRef.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000);
                setElapsedSeconds(elapsed);
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPaused]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePause = () => {
        if (isPaused) {
            // 再開
            pausedTimeRef.current += Date.now() - pauseStartRef.current;
            setIsPaused(false);
        } else {
            // 一時停止
            pauseStartRef.current = Date.now();
            setIsPaused(true);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    };

    const pauseStartRef = useRef(0);

    const handleStop = async () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        const endTime = new Date().toISOString();
        const duration = Math.floor(elapsedSeconds / 60); // 分単位

        if (duration < 1) {
            alert('作業時間が1分未満のため、記録されませ ん。');
            onStop();
            return;
        }

        try {
            const response = await fetch('/api/records', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    taskId: task.id,
                    taskName: task.name,
                    taskColor: task.color,
                    startTime,
                    endTime,
                    duration,
                    date: new Date().toISOString().split('T')[0],
                }),
            });

            if (response.ok) {
                onRecordCreated();
                onStop();
            } else {
                alert('記録の保存に失敗しました');
            }
        } catch (error) {
            console.error('Error saving record:', error);
            alert('エラーが発生しました');
        }
    };

    const progress = Math.min(100, (elapsedSeconds / (task.duration * 60)) * 100);

    return (
        <div className="bg-white p-5 rounded-lg shadow-md mb-6 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">作業タイマー</h2>
            <div className="mb-4 flex items-center">
                <div className={`w-4 h-4 rounded-full bg-${task.color} mr-2`}></div>
                <span className="font-medium">{task.name}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-sm text-gray-500">
                        開始時間: {new Date(startTime).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-500">目標時間: {task.duration} 分</p>
                </div>
                <div>
                    <div className={`text-3xl font-bold ${isPaused ? 'text-yellow-600' : 'text-blue-600'}`}>
                        {formatTime(elapsedSeconds)}
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">進捗状況</div>
                <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-${task.color} transition-all duration-300`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="flex space-x-2">
                <button
                    onClick={handlePause}
                    className="w-1/2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition"
                >
                    {isPaused ? '再開' : '一時停止'}
                </button>
                <button
                    onClick={handleStop}
                    className="w-1/2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition"
                >
                    終了
                </button>
            </div>
        </div>
    );
}
