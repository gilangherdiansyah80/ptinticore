import db from "../../../../../lib/db";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const { id } = params; // Mengambil ID dari params
  const { user_id } = await req.json(); // Parsing body request

  // Validasi input
  if (!id || !user_id) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  // Query SQL untuk update data
  const sql = "UPDATE tim SET user_id = ? WHERE tim_id = ?"; // Menggunakan tim_id sebagai FK
  const queryParams = [user_id, id]; // Ubah nama variabel params

  try {
    const [result] = await db.query(sql, queryParams);
    return NextResponse.json(
      { message: "Tim updated successfully", result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating tim:", error);
    return NextResponse.json(
      { message: "Error updating tim" },
      { status: 500 }
    );
  }
}
