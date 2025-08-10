import response from "../../../utils/response";
import db from "../../../lib/db";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.*,

        k.kerusakan_id,
        k.jalur_id,
        k.no_LHLKLP,
        k.jam_kerusakan,
        k.tanggal_kerusakan,
        k.tingkat_kerusakan,
        k.titik_lokasi,
        k.jalur_id,
        

        j.nama_tol,
        j.ruas_tol,

        u.user_id,
        u.role,

        l.jenis_kerusakan
      FROM pelaporan p
      JOIN penugasan gs ON p.penugasan_id = gs.penugasan_id
      JOIN kerusakan k ON gs.kerusakan_id = k.kerusakan_id
      JOIN list_keahlian l ON k.keahlian_id = l.keahlian_id
      JOIN tim t ON gs.tim_id = t.tim_id
      JOIN users u ON t.user_id = u.user_id
      JOIN jalur_tol j ON k.jalur_id = j.jalur_id
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
