import db from "../../../../../lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function DELETE(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "Jalur tol ID is required" },
      { status: 400 }
    );
  }

  const sql = "DELETE FROM jalur_tol WHERE jalur_id = ?";
  try {
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "jalur tol not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Jalur tol deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting jalur tol:", error);
    return NextResponse.json(
      { message: "Failed to delete jalur tol" },
      { status: 500 }
    );
  }
}
