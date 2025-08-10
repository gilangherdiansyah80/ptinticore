import { NextResponse } from "next/server";
import db from "../../../../lib/db";

export async function POST(req) {
  try {
    // Ambil data dari body request (dalam format JSON)
    const {
      jenis_kerusakan,
      tim_a_padeleunyi,
      tim_b_padaleunyi,
      tim_a_cipularang,
      tim_b_cipularang,
      tim_siaga,
    } = await req.json();

    // Validasi sederhana
    if (
      !jenis_kerusakan ||
      !tim_a_padeleunyi ||
      !tim_b_padaleunyi ||
      !tim_a_cipularang ||
      !tim_b_cipularang ||
      !tim_siaga
    ) {
      return NextResponse.json(
        { message: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO list_keahlian (
        jenis_kerusakan,
        tim_a_padeleunyi,
        tim_b_padaleunyi,
        tim_a_cipularang,
        tim_b_cipularang,
        tim_siaga
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      jenis_kerusakan,
      tim_a_padeleunyi,
      tim_b_padaleunyi,
      tim_a_cipularang,
      tim_b_cipularang,
      tim_siaga,
    ];

    const [result] = await db.query(sql, values);

    return NextResponse.json(
      { message: "Data list keahlian berhasil ditambahkan", result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting list_keahlian:", error);
    return NextResponse.json(
      { message: "Gagal menambahkan data list keahlian", error: error.message },
      { status: 500 }
    );
  }
}
