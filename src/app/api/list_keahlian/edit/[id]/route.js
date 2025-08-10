import db from "../../../../../lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function PUT(req, { params }) {
  const { id } = params;

  const {
    jenis_kerusakan,
    tim_a_padeleunyi,
    tim_b_padaleunyi,
    tim_a_cipularang,
    tim_b_cipularang,
    tim_siaga,
  } = await req.json();

  // Validasi input kosong
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
    UPDATE list_keahlian
    SET
      jenis_kerusakan = ?,
      tim_a_padeleunyi = ?,
      tim_b_padaleunyi = ?,
      tim_a_cipularang = ?,
      tim_b_cipularang = ?,
      tim_siaga = ?
    WHERE keahlian_id = ?
  `;

  const queryParams = [
    jenis_kerusakan,
    tim_a_padeleunyi,
    tim_b_padaleunyi,
    tim_a_cipularang,
    tim_b_cipularang,
    tim_siaga,
    id,
  ];

  try {
    const [result] = await db.query(sql, queryParams);
    return NextResponse.json(
      { message: "Data list keahlian berhasil diupdate", result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating list_keahlian:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat mengupdate data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
