import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: Request) {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email }).select('-privacyPin'); // Exclude hash
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
}

export async function PATCH(req: Request) {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { name, themePreference, currentFocus, settings, isOnboarded, privacy } = body;

    const updateFields: any = {};
    if (name) updateFields.name = name;
    if (themePreference) updateFields.themePreference = themePreference;
    if (currentFocus) updateFields.currentFocus = currentFocus;
    if (typeof isOnboarded === 'boolean') updateFields.isOnboarded = isOnboarded;

    // Handle nested settings updates carefully
    if (settings) {
        if (typeof settings.emailNotifications === 'boolean') updateFields['settings.emailNotifications'] = settings.emailNotifications;
        if (typeof settings.dailyReminders === 'boolean') updateFields['settings.dailyReminders'] = settings.dailyReminders;
        if (typeof settings.growthInsights === 'boolean') updateFields['settings.growthInsights'] = settings.growthInsights;
        if (typeof settings.momentumReminders === 'boolean') updateFields['settings.momentumReminders'] = settings.momentumReminders;
    }

    // Handle privacy settings
    if (privacy) {
        if (typeof privacy.enableConcealedMode === 'boolean') updateFields['settings.privacy.enableConcealedMode'] = privacy.enableConcealedMode;
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            { $set: updateFields },
            { new: true }
        ).select('-privacyPin');

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
