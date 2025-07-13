import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const users = client.db().collection("users");
    
    const user = await users.findOne({ _id: new ObjectId(session.user.id) });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user profile data (excluding sensitive information)
    const profileData = {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status || "active",
      createdAt: user.createdAt || new Date(),
      lastLogin: user.lastLogin || new Date(),
      profile: user.profile || {
        avatar: null,
        bio: "",
        phone: "",
        department: "",
        year: "",
        studentId: "",
      },
      preferences: user.preferences || {
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        privacy: {
          profileVisibility: "public",
          showEmail: false,
          showPhone: false,
        },
      },
      stats: user.stats || {
        quizzesTaken: 0,
        quizzesWon: 0,
        totalScore: 0,
        averageScore: 0,
        joinDate: user.createdAt || new Date(),
      },
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, profile, preferences } = body;

    // Validation
    if (name && name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters long" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const users = client.db().collection("users");
    
    // Update user profile
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name) {
      updateData.name = name.trim();
    }

    if (profile) {
      updateData.profile = {
        avatar: profile.avatar || null,
        bio: profile.bio || "",
        phone: profile.phone || "",
        department: profile.department || "",
        year: profile.year || "",
        studentId: profile.studentId || "",
      };
    }

    if (preferences) {
      updateData.preferences = {
        notifications: {
          email: preferences.notifications?.email ?? true,
          push: preferences.notifications?.push ?? true,
          sms: preferences.notifications?.sms ?? false,
        },
        privacy: {
          profileVisibility: preferences.privacy?.profileVisibility || "public",
          showEmail: preferences.privacy?.showEmail ?? false,
          showPhone: preferences.privacy?.showPhone ?? false,
        },
      };
    }

    const result = await users.updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Profile updated successfully" 
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 