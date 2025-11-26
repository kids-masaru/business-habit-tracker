import { NextRequest, NextResponse } from 'next/server';
import { getWeeklyStats, getTasksStats, getTodayRecords } from '@/lib/db';

// GET /api/stats?userId=xxx&type=weekly|tasks|today
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');
        const type = searchParams.get('type') || 'weekly';

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'userId is required' },
                { status: 400 }
            );
        }

        let data;

        switch (type) {
            case 'weekly':
                data = await getWeeklyStats(userId);
                break;
            case 'tasks':
                const days = parseInt(searchParams.get('days') || '7');
                data = await getTasksStats(userId, days);
                break;
            case 'today':
                data = await getTodayRecords(userId);
                break;
            default:
                return NextResponse.json(
                    { success: false, error: 'Invalid type parameter' },
                    { status: 400 }
                );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
