import { NextResponse } from "next/server";
import db from "../../../../lib/db";
export const dynamic = "force-dynamic";

export async function PUT(req) {
  try {
    const body = await req.json();
    const { penugasan_id } = body;

    if (!penugasan_id) {
      return NextResponse.json(
        { message: "penugasan_id wajib diisi" },
        { status: 400 }
      );
    }

    // Ambil kerusakan_id dari penugasan
    const [rows] = await db.query(
      `SELECT kerusakan_id FROM penugasan WHERE penugasan_id = ?`,
      [penugasan_id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Penugasan tidak ditemukan" },
        { status: 404 }
      );
    }

    const kerusakan_id = rows[0].kerusakan_id;

    // Update status kerusakan ke 'ditangani'
    await db.query(
      `UPDATE kerusakan SET status = 'ditangani' WHERE kerusakan_id = ?`,
      [kerusakan_id]
    );

    return NextResponse.json(
      { message: "Status kerusakan berhasil diperbarui ke 'ditangani'" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error update status kerusakan:", error);
    return NextResponse.json(
      { message: "Terjadi error", error: error.message },
      { status: 500 }
    );
  }
}
