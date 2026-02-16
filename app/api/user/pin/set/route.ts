import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pin } = await req.json();
    if (!pin || pin.length < 4 || pin.length > 6) {
        return NextResponse.json({ error: "PIN must be between 4 and 6 digits" }, { status: 400 });
    }

    await dbConnect();

    // Hash the PIN
    const hashedPin = await bcrypt.hash(pin, 10);

    // Save to user
    await User.findOneAndUpdate(
        { email: session.user.email },
        { privacyPin: hashedPin }
    );

    return NextResponse.json({ success: true });
}
