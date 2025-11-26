import { NextRequest, NextResponse } from 'next/server';
import {
    getReminders,
    createReminder,
    updateReminder,
    deleteReminder,
    deleteReminderByTaskId,
} from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { Reminder } from '@/lib/types';

// GET /api/reminders?userId=xxx
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'userId is required' },
                { status: 400 }
            );
        }

        const reminders = await getReminders(userId);
        return NextResponse.json({ success: true, data: reminders });
    } catch (error) {
        console.error('Error fetching reminders:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch reminders' },
            { status: 500 }
        );
    }
}

// POST /api/reminders
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, taskId, taskName, time, repeat } = body;

        if (!userId || !taskId || !taskName || !time || !repeat) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const reminder: Omit<Reminder, 'created_at'> = {
            id: uuidv4(),
            user_id: userId,
            task_id: taskId,
            task_name: taskName,
            time,
            repeat,
        };

        const createdReminder = await createReminder(reminder);
        return NextResponse.json({ success: true, data: createdReminder });
    } catch (error) {
        console.error('Error creating reminder:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create reminder' },
            { status: 500 }
        );
    }
}

// PUT /api/reminders
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, userId, taskId, taskName, time, repeat } = body;

        if (!id || !userId || !taskId || !taskName || !time || !repeat) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const reminder: Reminder = {
            id,
            user_id: userId,
            task_id: taskId,
            task_name: taskName,
            time,
            repeat,
        };

        const updatedReminder = await updateReminder(reminder);
        return NextResponse.json({ success: true, data: updatedReminder });
    } catch (error) {
        console.error('Error updating reminder:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update reminder' },
            { status: 500 }
        );
    }
}

// DELETE /api/reminders?id=xxx&userId=xxx&taskId=xxx
export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');
        const userId = searchParams.get('userId');
        const taskId = searchParams.get('taskId');

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'userId is required' },
                { status: 400 }
            );
        }

        if (id) {
            // 特定のリマインダーを削除
            await deleteReminder(id, userId);
        } else if (taskId) {
            // タスクに紐づくリマインダーを削除
            await deleteReminderByTaskId(taskId, userId);
        } else {
            return NextResponse.json(
                { success: false, error: 'id or taskId is required' },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting reminder:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete reminder' },
            { status: 500 }
        );
    }
}
