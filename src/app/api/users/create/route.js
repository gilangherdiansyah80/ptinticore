import { NextResponse } from "next/server";
import db from "../../../../lib/db"; // Sesuaikan path koneksi database
import bcrypt from "bcrypt"; // install dengan: npm install bcrypt

export async function POST(req) {
  const formData = await req.formData();

  try {
    const username = formData.get("username");
    const password = formData.get("password");
    const role = formData.get("role");

    // Validasi input kosong
    if (!username || !password || !role) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // Cek apakah username sudah ada
    const [existingUser] = await db.query(
      "SELECT user_id FROM users WHERE username = ? LIMIT 1",
      [username]
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Username sudah digunakan, silakan pilih username lain" },
        { status: 400 }
      );
    }

    // Hash password sebelum disimpan
    const saltRounds = 10; // tingkat keamanan, makin tinggi makin aman tapi lebih lambat
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user baru dengan password yang sudah di-hash
    const sql = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
    await db.query(sql, [username, hashedPassword, role]);

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST function:", error);
    return NextResponse.json(
      { message: "Failed to create users", error: error.message },
      { status: 500 }
    );
  }
}
