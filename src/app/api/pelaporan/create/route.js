import { NextResponse } from "next/server";
import db from "../../../../lib/db";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const conn = await db.getConnection();
  try {
    const form = await req.json();
    const {
      penugasan_id,
      tanggal_mulai,
      jam_mulai,
      tanggal_selesai,
      jam_selesai,
      durasi,
      kondisi_akhir,
      hasil_kunjungan,
      tindakan,
    } = form;

    if (
      !penugasan_id ||
      !tanggal_mulai ||
      !jam_mulai ||
      !tanggal_selesai ||
      !jam_selesai ||
      !durasi ||
      !kondisi_akhir ||
      !hasil_kunjungan ||
      !tindakan
    ) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    await conn.beginTransaction();

    // 1) Insert ke pelaporan
    const insertPelaporanSQL = `
      INSERT INTO pelaporan (
        penugasan_id,
        tanggal_mulai,
        jam_mulai,
        tanggal_selesai,
        jam_selesai,
        durasi,
        kondisi_akhir,
        hasil_kunjungan,
        tindakan
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const pelaporanValues = [
      penugasan_id,
      tanggal_mulai,
      jam_mulai,
      tanggal_selesai,
      jam_selesai,
      durasi,
      kondisi_akhir,
      hasil_kunjungan,
      tindakan,
    ];
    const [pelaporanResult] = await conn.query(
      insertPelaporanSQL,
      pelaporanValues
    );

    const pelaporan_id = pelaporanResult.insertId;

    // 2) Insert ke riwayat_perbaikan
    const insertRiwayatSQL = `
      INSERT INTO riwayat_perbaikan (pelaporan_id) VALUES (?)
    `;
    await conn.query(insertRiwayatSQL, [pelaporan_id]);

    // 3) Update penugasan.status
    const updatePenugasanSQL = `
      UPDATE penugasan
      SET status = 'selesai'
      WHERE penugasan_id = ?
    `;
    await conn.query(updatePenugasanSQL, [penugasan_id]);

    // 4) Ambil kerusakan_id dari penugasan
    const [rows] = await conn.query(
      `SELECT kerusakan_id FROM penugasan WHERE penugasan_id = ?`,
      [penugasan_id]
    );

    if (rows.length === 0) {
      throw new Error("Penugasan tidak ditemukan");
    }

    const kerusakan_id = rows[0].kerusakan_id;

    // 5) Update kerusakan.status
    const updateKerusakanSQL = `
      UPDATE kerusakan
      SET status = 'selesai'
      WHERE kerusakan_id = ?
    `;
    await conn.query(updateKerusakanSQL, [kerusakan_id]);

    await conn.commit();

    return NextResponse.json(
      {
        message: "Pelaporan berhasil ditambahkan",
        pelaporan_id: pelaporan_id,
        kerusakan_id: kerusakan_id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting pelaporan:", error);
    await conn.rollback();
    return NextResponse.json(
      { message: "Gagal menambahkan data pelaporan", error: error.message },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}
