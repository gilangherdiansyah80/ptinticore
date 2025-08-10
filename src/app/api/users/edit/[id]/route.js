import { NextResponse } from "next/server";
import db from "../../../../../lib/db";
import bcrypt from "bcrypt"; // pastikan sudah install: npm install bcrypt
export const dynamic = "force-dynamic";

export async function PUT(req, { params }) {
  const { id } = params;
  const { username, password, role } = await req.json();

  try {
    // Validasi input kosong
    if (!username || !password || !role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Cek apakah username sudah ada untuk user lain
    const [existing] = await db.query(
      "SELECT * FROM users WHERE username = ? AND user_id != ?",
      [username, id]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 400 }
      );
    }

    // Hash password sebelum update
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user
    await db.query(
      "UPDATE users SET username = ?, password = ?, role = ? WHERE user_id = ?",
      [username, hashedPassword, role, id]
    );

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Failed to update user", error: error.message },
      { status: 500 }
    );
  }
}
