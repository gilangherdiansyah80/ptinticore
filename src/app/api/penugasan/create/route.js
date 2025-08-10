import { NextResponse } from "next/server";
import db from "../../../../lib/db";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Data harus berupa array" },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO penugasan (
        status,
        tim_id,
        kerusakan_id
      ) VALUES ?
    `;

    // Map data menjadi array of array untuk query batch insert
    const values = body.map((item) => [
      "aktif",
      item.tim_id,
      item.kerusakan_id,
    ]);

    await db.query(sql, [values]);

    return NextResponse.json(
      { message: "Data penugasan berhasil ditambahkan" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting penugasan:", error);
    return NextResponse.json(
      { message: "Gagal menambahkan data penugasan", error: error.message },
      { status: 500 }
    );
  }
}
