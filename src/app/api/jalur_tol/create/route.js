import { NextResponse } from "next/server";
import db from "../../../../lib/db"; // Sesuaikan dengan path ke file koneksi database Anda
export const dynamic = "force-dynamic";

// Menggunakan multer untuk menangani file upload
export async function POST(req) {
  const formData = await req.formData(); // Mendapatkan formData dari request

  try {
    // Mengambil data lain dari formData
    const nama_tol = formData.get("nama_tol");
    const ruas_tol = formData.get("ruas_tol");

    // Validasi inputan
    if (!nama_tol || !ruas_tol) {
      return NextResponse.json(
        { error: "All fields except image are required" },
        { status: 400 }
      );
    }

    // SQL query untuk menambahkan data produk
    const sql = `INSERT INTO jalur_tol (nama_tol, ruas_tol) VALUES (?, ?)`;

    // Menjalankan query untuk menambahkan data produk ke database
    await db.query(sql, [nama_tol, ruas_tol]);

    return NextResponse.json(
      { message: "Jalur tol created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST function:", error);
    return NextResponse.json(
      { message: "Failed to create jalur tol", error: error.message },
      { status: 500 }
    );
  }
}
