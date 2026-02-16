import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// POST /api/user/pin/set - Set new PIN
// POST /api/user/pin/verify - Verify PIN

export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pin } = await req.json();
    if (!pin || pin.length < 4) {
        return NextResponse.json({ error: "Invalid PIN" }, { status: 400 });
    }

    const url = new URL(req.url);
    const action = url.pathname.split('/').pop(); // 'set' or 'verify' but we are using same route for simplicity for now? 
    // Wait, the client is calling /api/user/pin/verify, so we need to handle paths or methods.
    // Let's make this route handle both based on a query param or dedicated folders.
    // For now, let's assume this file is at api/user/pin/verify/route.ts based on the client call.

    // Actually, looking at the client call: fetch('/api/user/pin/verify'
    // So this file should be at app/api/user/pin/verify/route.ts

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify PIN
    if (user.privacyPin) {
        const isValid = await bcrypt.compare(pin, user.privacyPin);
        if (isValid) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: "Incorrect PIN" }, { status: 401 });
        }
    } else {
        return NextResponse.json({ error: "PIN not set" }, { status: 400 });
    }
}
