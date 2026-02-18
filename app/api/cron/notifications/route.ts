import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Entry from "@/models/Entry";
import { getMemoriesByCategory } from "@/lib/mem0";
import nodemailer from 'nodemailer';
import { generateText } from '@/lib/gemini';

// CRON SECRET for security (optional for now, but good practice)
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(req: Request) {
    // 1. Authenticate Cron Request (Simple check)
    // const authHeader = req.headers.get('authorization');
    // if (authHeader !== `Bearer ${CRON_SECRET}`) {
    //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    await dbConnect();

    try {
        // 2. Find users who want Momentum Reminders
        const users = await User.find({ 'settings.momentumReminders': true });

        const results = [];

        for (const user of users) {
            // 3. Check for recent activity (Last 24 hours)
            const lastEntry = await Entry.findOne({ userId: user._id }).sort({ date: -1 });

            const now = new Date();
            const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

            if (!lastEntry || new Date(lastEntry.date) < twentyFourHoursAgo) {
                // User is inactive! Time to nudge.

                // 4. Generate Personalized Content using Mem0 Categories
                // Fetch memories specifically tagged as goals or habits
                const memories = await getMemoriesByCategory(user._id.toString(), ["goals", "habits"]);
                const context = memories.length > 0 ? memories.join('\n') : "User is focusing on general self-improvement.";

                const prompt = `
                    The user hasn't journaled in over 24 hours. 
                    Write a short, encouraging 2-sentence email notification to nudge them to reflect.
                    
                    USER CONTEXT (Goals/Habits):
                    ${context}
                    
                    Tone: Warm, curious, un-intrusive.
                    Format: Just the message body.
                `;

                const nudgeMessage = await generateText(prompt);

                // 5. Send Email
                const emailResult = await sendEmail(user.email, "Your arc is waiting...", nudgeMessage);

                results.push({
                    user: user.email,
                    status: 'Nudged',
                    message: nudgeMessage
                });
            } else {
                results.push({ user: user.email, status: 'Active (No nudge needed)' });
            }
        }

        return NextResponse.json({ success: true, results });

    } catch (error) {
        console.error("Cron Job Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

async function sendEmail(to: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });
        return true;
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error);
        return false;
    }
}
