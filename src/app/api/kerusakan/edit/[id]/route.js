import db from "../../../../../lib/db";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const { id } = params;

  const {
    no_LHLKLP,
    jam_kerusakan,
    tanggal_kerusakan,
    tingkat_kerusakan,
    titik_lokasi,
    jalur_id,
    keahlian_id,
    status,
  } = await req.json();

  // Validasi input kosong
  if (
    !no_LHLKLP ||
    !jam_kerusakan ||
    !tanggal_kerusakan ||
    !tingkat_kerusakan ||
    !titik_lokasi ||
    !jalur_id ||
    !keahlian_id ||
    !status
  ) {
    return NextResponse.json(
      { message: "Semua field wajib diisi" },
      { status: 400 }
    );
  }

  // Validasi nilai status
  const allowedStatus = ["lapor", "ditangani", "selesai"];
  if (!allowedStatus.includes(status.toLowerCase())) {
    return NextResponse.json(
      {
        message: "Status tidak valid. Pilih antara: lapor, ditangani, selesai",
      },
      { status: 400 }
    );
  }

  // Validasi tingkat kerusakan
  const allowedTingkat = ["1", "2", "3", "4", "5"];
  if (!allowedTingkat.includes(String(tingkat_kerusakan))) {
    return NextResponse.json(
      { message: "Tingkat kerusakan harus antara 1 sampai 5" },
      { status: 400 }
    );
  }

  // Query SQL
  const sql = `
    UPDATE kerusakan
    SET
      no_LHLKLP = ?,
      jam_kerusakan = ?,
      tanggal_kerusakan = ?,
      tingkat_kerusakan = ?,
      titik_lokasi = ?,
      jalur_id = ?,
      keahlian_id = ?,
      status = ?
    WHERE kerusakan_id = ?
  `;
  const queryParams = [
    no_LHLKLP,
    jam_kerusakan,
    tanggal_kerusakan,
    tingkat_kerusakan,
    titik_lokasi,
    jalur_id,
    keahlian_id,
    status.toLowerCase(),
    id,
  ];

  try {
    const [result] = await db.query(sql, queryParams);
    return NextResponse.json(
      { message: "Data kerusakan berhasil diupdate", result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating kerusakan:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengupdate data" },
      { status: 500 }
    );
  }
}
