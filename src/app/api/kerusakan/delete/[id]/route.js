import db from "../../../../../lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function DELETE(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "Kerusakan ID is required" },
      { status: 400 }
    );
  }

  try {
    // Hapus dulu data dari tabel penugasan yang berelasi
    const deletePenugasan = "DELETE FROM penugasan WHERE kerusakan_id = ?";
    await db.query(deletePenugasan, [id]);

    // Kemudian hapus dari tabel kerusakan
    const deleteKerusakan = "DELETE FROM kerusakan WHERE kerusakan_id = ?";
    const [result] = await db.query(deleteKerusakan, [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Kerusakan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Kerusakan deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting kerusakan:", error);
    return NextResponse.json(
      { message: "Failed to delete kerusakan", detail: error.message },
      { status: 500 }
    );
  }
}
