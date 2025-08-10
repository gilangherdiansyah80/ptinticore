import db from "../../../../../lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "Tim ID is required" },
      { status: 400 }
    );
  }

  const sql = "DELETE FROM tim WHERE tim_id = ?";
  try {
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Tim not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Tim deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting tim:", error);
    return NextResponse.json(
      { message: "Failed to delete tim" },
      { status: 500 }
    );
  }
}
