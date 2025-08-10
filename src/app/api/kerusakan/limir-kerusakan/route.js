import response from "../../../../utils/response";
import db from "../../../../lib/db";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    // Ambil query params untuk pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const offset = (page - 1) * limit;

    // Ambil total data
    const [totalRows] = await db.query(`
      SELECT COUNT(*) AS total
      FROM kerusakan
      JOIN jalur_tol ON kerusakan.jalur_id = jalur_tol.jalur_id
      JOIN list_keahlian ON kerusakan.keahlian_id = list_keahlian.keahlian_id
    `);

    const totalData = totalRows[0].total;
    const totalPages = Math.ceil(totalData / limit);

    // Ambil data sesuai halaman
    const [rows] = await db.query(
      `
      SELECT 
        kerusakan.kerusakan_id,
        kerusakan.jalur_id,
        kerusakan.no_LHLKLP,
        kerusakan.jam_kerusakan,
        kerusakan.tanggal_kerusakan,
        kerusakan.tingkat_kerusakan,
        kerusakan.titik_lokasi,
        kerusakan.status,
        jalur_tol.nama_tol,
        jalur_tol.ruas_tol,
        list_keahlian.jenis_kerusakan
      FROM kerusakan
      JOIN jalur_tol ON kerusakan.jalur_id = jalur_tol.jalur_id
      JOIN list_keahlian ON kerusakan.keahlian_id = list_keahlian.keahlian_id
      LIMIT ? OFFSET ?
    `,
      [limit, offset]
    );

    const pagination = {
      currentPage: page,
      totalPages: totalPages,
      totalData: totalData,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };

    const responseBody = response(
      200,
      { data: rows, pagination },
      "Data retrieved successfully"
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
