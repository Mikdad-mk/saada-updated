import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hash } from "bcryptjs";
import { UserRole } from "@/lib/user-role";

// Validation function
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters long" };
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, error: "Password must contain at least one lowercase letter" };
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, error: "Password must contain at least one uppercase letter" };
  }
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, error: "Password must contain at least one number" };
  }
  return { isValid: true };
}

export async function POST(req: Request) {
  try {
    const { name, email, password, role = UserRole.USER } = await req.json();

    // Input validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters long" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const users = client.db().collection("users");

    // Check if user already exists
    const existingUser = await users.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Check if this is the first user (no users in database)
    const userCount = await users.countDocuments();
    const isFirstUser = userCount === 0;
    
    // Determine role: first user becomes admin, others become regular users
    const userRole = isFirstUser ? UserRole.ADMIN : UserRole.USER;

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user document
    const userData = {
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: userRole,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null,
      profile: {
        avatar: null,
        bio: "",
        phone: "",
        department: "",
        year: "",
        studentId: "",
      },
      preferences: {
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
      stats: {
        quizzesTaken: 0,
        quizzesWon: 0,
        totalScore: 0,
        averageScore: 0,
        joinDate: new Date(),
      },
    };

    // Insert user into database
    const result = await users.insertOne(userData);

    // Return success response (without sensitive data)
    return NextResponse.json({
      success: true,
      message: isFirstUser 
        ? "Admin account created successfully! You can now access the admin panel." 
        : "User registered successfully",
      user: {
        id: result.insertedId.toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
      },
      isFirstUser: isFirstUser,
    });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
} 