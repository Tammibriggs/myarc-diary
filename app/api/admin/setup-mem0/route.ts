import { NextResponse } from 'next/server';
import { initializeMem0Project } from '@/lib/mem0';

export async function GET() {
    try {
        await initializeMem0Project();
        return NextResponse.json({ success: true, message: "Mem0 Project Initialized with Categories (goals, habits, preferences)" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
