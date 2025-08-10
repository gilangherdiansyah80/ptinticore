import { NextResponse } from "next/server";
import db from "../../../../lib/db"; // Sesuaikan dengan path ke file koneksi database Anda
export const dynamic = "force-dynamic";

// Menggunakan multer untuk menangani file upload
export async function POST(req) {
  const formData = await req.formData(); // Mendapatkan formData dari request

  try {
    // Mengambil data lain dari formData
    const user_id = formData.get("user_id");

    // Validasi inputan
    if (!user_id) {
      return NextResponse.json(
        { error: "All fields except image are required" },
        { status: 400 }
      );
    }

    // SQL query untuk menambahkan data produk
    const sql = `INSERT INTO tim (user_id, status) VALUES (?, 'Tidak Bertugas (KM 0)')`;

    // Menjalankan query untuk menambahkan data produk ke database
    await db.query(sql, [user_id]);

    return NextResponse.json(
      { message: "Tim created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST function:", error);
    return NextResponse.json(
      { message: "Failed to create tim", error: error.message },
      { status: 500 }
    );
  }
}
