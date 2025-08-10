import db from "../../../../../lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function PUT(req, { params }) {
  const { id } = params; // Mengambil ID dari params
  const { nama_tol, ruas_tol } = await req.json(); // Parsing body request

  // Validasi input
  if (!id || !nama_tol || !ruas_tol) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  // Query SQL untuk update data
  const sql =
    "UPDATE jalur_tol SET nama_tol = ?, ruas_tol = ? WHERE jalur_id = ?";
  const queryParams = [nama_tol, ruas_tol, id]; // Ubah nama variabel params

  try {
    const [result] = await db.query(sql, queryParams);
    return NextResponse.json(
      { message: "Jalur tol updated successfully", result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating jalur tol:", error);
    return NextResponse.json(
      { message: "Error updating jalur tol" },
      { status: 500 }
    );
  }
}
