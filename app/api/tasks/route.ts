import { NextRequest, NextResponse } from 'next/server';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/lib/types';

// GET /api/tasks?userId=xxx
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

        const tasks = await getTasks(userId);
        return NextResponse.json({ success: true, data: tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch tasks' },
            { status: 500 }
        );
    }
}

// POST /api/tasks
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, name, duration, color } = body;

        if (!userId || !name || !duration || !color) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const task: Omit<Task, 'created_at'> = {
            id: uuidv4(),
            user_id: userId,
            name,
            duration: parseInt(duration),
            color,
        };

        const createdTask = await createTask(task);
        return NextResponse.json({ success: true, data: createdTask });
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create task' },
            { status: 500 }
        );
    }
}

// PUT /api/tasks
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, userId, name, duration, color } = body;

        if (!id || !userId || !name || !duration || !color) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const task: Task = {
            id,
            user_id: userId,
            name,
            duration: parseInt(duration),
            color,
        };

        const updatedTask = await updateTask(task);
        return NextResponse.json({ success: true, data: updatedTask });
    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update task' },
            { status: 500 }
        );
    }
}

// DELETE /api/tasks?id=xxx&userId=xxx
export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');
        const userId = searchParams.get('userId');

        if (!id || !userId) {
            return NextResponse.json(
                { success: false, error: 'id and userId are required' },
                { status: 400 }
            );
        }

        await deleteTask(id, userId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting task:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete task' },
            { status: 500 }
        );
    }
}
