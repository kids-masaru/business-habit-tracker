import { NextRequest, NextResponse } from 'next/server';
import { getRecords, createRecord, deleteRecord, createUser } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { Record } from '@/lib/types';

// GET /api/records?userId=xxx&startDate=xxx&endDate=xxx
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'userId is required' },
                { status: 400 }
            );
        }

        const records = await getRecords(
            userId,
            startDate || undefined,
            endDate || undefined
        );
        return NextResponse.json({ success: true, data: records });
    } catch (error) {
        console.error('Error fetching records:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch records' },
            { status: 500 }
        );
    }
}

// POST /api/records
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            userId,
            taskId,
            taskName,
            taskColor,
            startTime,
            endTime,
            duration,
            date,
        } = body;

        if (
            !userId ||
            !taskId ||
            !taskName ||
            !taskColor ||
            !startTime ||
            !endTime ||
            !duration ||
            !date
        ) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const record: Omit<Record, 'created_at'> = {
            id: uuidv4(),
            user_id: userId,
            task_id: taskId,
            task_name: taskName,
            task_color: taskColor,
            start_time: startTime,
            end_time: endTime,
            duration: parseInt(duration),
            date,
        };

        // ユーザーが存在しない場合は作成（FK制約のため）
        await createUser(userId);

        const createdRecord = await createRecord(record);
        return NextResponse.json({ success: true, data: createdRecord });
    } catch (error) {
        console.error('Error creating record:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create record' },
            { status: 500 }
        );
    }
}

// DELETE /api/records?id=xxx&userId=xxx
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

        await deleteRecord(id, userId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting record:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete record' },
            { status: 500 }
        );
    }
}
