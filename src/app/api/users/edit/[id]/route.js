import { NextResponse } from "next/server";
import db from "../../../../../lib/db";

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

    // Update user
    await db.query(
      "UPDATE users SET username = ?, password = ?, role = ? WHERE user_id = ?",
      [username, password, role, id]
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
