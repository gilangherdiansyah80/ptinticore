import db from "../../../../../lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function DELETE(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    // Hapus data yang berelasi di tabel tim
    const deleteTim = "DELETE FROM tim WHERE user_id = ?";
    await db.query(deleteTim, [id]);

    // Hapus data user dari tabel users
    const deleteUser = "DELETE FROM users WHERE user_id = ?";
    const [result] = await db.query(deleteUser, [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Failed to delete user", detail: error.message },
      { status: 500 }
    );
  }
}
