import db from "../../../../../lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "List keahlian ID is required" },
      { status: 400 }
    );
  }

  const sql = "DELETE FROM list_keahlian WHERE keahlian_id = ?";
  try {
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "List Keahlian not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "List Keahlian deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting list keahlian:", error);
    return NextResponse.json(
      { message: "Failed to delete list keahlian" },
      { status: 500 }
    );
  }
}
