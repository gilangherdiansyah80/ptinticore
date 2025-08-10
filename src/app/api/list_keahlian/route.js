import db from "../../../lib/db";
import response from "../../../utils/response";

export async function GET(request) {
  try {
    // Ambil parameter dari URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 7;
    const offset = (page - 1) * limit;

    // Hitung total data
    const [countResult] = await db.query(
      "SELECT COUNT(*) as total FROM list_keahlian"
    );
    const totalData = countResult[0].total;
    const maxPage = Math.ceil(totalData / limit);

    // Query data dengan limit dan offset
    const [rows] = await db.query(
      "SELECT * FROM list_keahlian LIMIT ? OFFSET ?",
      [limit, offset]
    );

    // Buat response body dengan pagination
    const responseBody = response(200, rows, "Data retrieved successfully");

    responseBody.pagination = {
      prev: page > 1 ? page - 1 : null,
      next: page < maxPage ? page + 1 : null,
      max: maxPage,
    };

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
