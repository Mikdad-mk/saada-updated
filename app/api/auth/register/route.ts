import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const client = await clientPromise;
  const users = client.db().collection("users");
  const existing = await users.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
  const hashed = await hash(password, 10);
  await users.insertOne({ name, email, password: hashed });
  return NextResponse.json({ success: true });
} 