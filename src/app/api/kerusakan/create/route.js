import { NextResponse } from "next/server";
import db from "../../../../lib/db";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const no_LHLKLP = formData.get("no_LHLKLP");
    const jam_kerusakan = formData.get("jam_kerusakan");
    const tanggal_kerusakan = formData.get("tanggal_kerusakan");
    const tingkat_kerusakan = formData.get("tingkat_kerusakan");
    const titik_lokasi = formData.get("titik_lokasi");
    const jalur_id = formData.get("jalur_id");
    const keahlian_id = formData.get("keahlian_id");

    if (
      !no_LHLKLP ||
      !jam_kerusakan ||
      !tanggal_kerusakan ||
      !tingkat_kerusakan ||
      !titik_lokasi ||
      !jalur_id ||
      !keahlian_id
    ) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // ✅ Validasi: no_LHLKLP harus unik
    const [checkNoLHLKLP] = await db.query(
      `SELECT no_LHLKLP FROM kerusakan WHERE no_LHLKLP = ?`,
      [no_LHLKLP]
    );
    if (checkNoLHLKLP.length > 0) {
      return NextResponse.json(
        { error: "Nomor LHLKLP sudah digunakan" },
        { status: 400 }
      );
    }

    // ✅ Validasi: kombinasi titik_lokasi, jalur_id, keahlian_id tidak boleh sama
    const [checkDuplicateCombo] = await db.query(
      `SELECT * FROM kerusakan WHERE titik_lokasi = ? AND jalur_id = ? AND keahlian_id = ?`,
      [titik_lokasi, jalur_id, keahlian_id]
    );
    if (checkDuplicateCombo.length > 0) {
      return NextResponse.json(
        {
          error:
            "Data dengan kombinasi titik lokasi, jalur tol, dan jenis kerusakan ini sudah ada",
        },
        { status: 400 }
      );
    }

    const status = "lapor";

    const sql = `
      INSERT INTO kerusakan (
        no_LHLKLP,
        jam_kerusakan,
        tanggal_kerusakan,
        tingkat_kerusakan,
        titik_lokasi,
        jalur_id,
        keahlian_id,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      no_LHLKLP,
      jam_kerusakan,
      tanggal_kerusakan,
      tingkat_kerusakan,
      titik_lokasi,
      jalur_id,
      keahlian_id,
      status,
    ];

    const [result] = await db.query(sql, values);

    return NextResponse.json(
      { message: "Data kerusakan berhasil ditambahkan", result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting kerusakan:", error);
    return NextResponse.json(
      { message: "Gagal menambahkan data kerusakan", error: error.message },
      { status: 500 }
    );
  }
}
