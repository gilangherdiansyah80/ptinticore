import response from "../../../utils/response";
import db from "../../../lib/db";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    // Melakukan join antara tabel tim dan users berdasarkan FK user_id
    const [rows] = await db.query(`
      SELECT 
        tim.tim_id,
        tim.user_id,
        users.role,
        tim.status
      FROM tim
      JOIN users ON tim.user_id = users.user_id
    `);

    const responseBody = response(200, rows, "Data retrieved successfully");

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
