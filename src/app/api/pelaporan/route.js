import response from "../../../utils/response";
import db from "../../../lib/db";

export async function GET(request) {
  try {
    const [rows] = await db.query(`
      SELECT 
        n.penugasan_id,
        n.tanggal_mulai,
        n.jam_mulai,
        n.tanggal_selesai,
        n.jam_selesai,
        n.durasi,
        n.kondisi_akhir,
        n.hasil_kunjungan,
        n.tindakan,

        gs.status,

        k.no_LHLKLP,
        l.jenis_kerusakan
      FROM pelaporan n
      JOIN penugasan gs ON n.penugasan_id = gs.penugasan_id
      JOIN kerusakan k ON gs.kerusakan_id = k.kerusakan_id
      JOIN list_keahlian l ON k.keahlian_id = l.keahlian_id
    `);

    const responseBody = response(
      200,
      rows,
      "Data penugasan beserta relasinya berhasil diambil"
    );

    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Database Query Error:", error);

    const responseBody = response(500, null, error.message);

    return new Response(JSON.stringify(responseBody), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
