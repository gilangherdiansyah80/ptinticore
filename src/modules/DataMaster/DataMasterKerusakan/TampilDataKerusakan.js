"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/Dashboardlayout";
import Link from "next/link";
import Alert from "../../../components/alert";
import tingkatUrgensi from "../../../utils/indeksUrgensi";

const TampilDataKerusakan = () => {
  const [dataKerusakan, setDataKerusakan] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (pageNumber = 1) => {
    const response = await fetch(
      `https://ptinticore.online/api/kerusakan/limir-kerusakan?page=${pageNumber}&limit=5`
    );
    const data = await response.json();
    setDataKerusakan(data.payload.datas.data || []); // pastikan sesuai struktur API
    setTotalPages(data.payload.datas.pagination.totalPages || 1);
    setPage(data.payload.datas.pagination.currentPage || 1);
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const filteredKerusakan = dataKerusakan.filter(
    (item) => item.status === "lapor"
  );

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://ptinticore.online/api/kerusakan/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setAlertMessage("Kerusakan Berhasil Dihapus");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 1000);
        fetchData(page);
      } else {
        console.error("Failed to delete kerusakan:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting kerusakan:", error);
    }
  };

  const userLogin = localStorage.getItem("users");

  return (
    <DashboardLayout>
      {showAlert ? (
        <Alert message={alertMessage} />
      ) : (
        <main className="flex flex-col gap-y-10">
          <section
            className={`flex justify-between items-center ${
              userLogin === "Admin" ? "block" : "hidden"
            }`}
          >
            <button className="flex justify-center items-center bg-[#211C84] text-white rounded-md p-3">
              <Link
                href="/dashboard/DataMaster/Kerusakan/TambahKerusakan"
                className="flex gap-x-3 items-center"
              >
                <i className="fas fa-add"></i>
                <h1>Tambah Data</h1>
              </Link>
            </button>
          </section>

          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-xl">
              <thead className="bg-[#211C84] text-white">
                <tr>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    No
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    No. LH/LK/LP
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Jam Kerusakan
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Tanggal Kerusakan
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Tingkat Kerusakan
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Titik Lokasi
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Permasalahan
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Jalur Tol (Ruas Tol)
                  </th>
                  <th
                    className={`px-6 py-3 text-center text-sm font-semibold ${
                      userLogin === "Admin" ? "block" : "hidden"
                    }`}
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredKerusakan.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-4">
                      Tidak Ada Kerusakan yang terjadi
                    </td>
                  </tr>
                ) : (
                  filteredKerusakan.map((item, index) => (
                    <tr key={item.kerusakan_id}>
                      <td className="px-6 py-4 text-gray-700 text-center">
                        {(page - 1) * 5 + index + 1}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-center">
                        {item.no_LHLKLP}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-center">
                        {item.jam_kerusakan}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-center">
                        {item.tanggal_kerusakan.slice(0, 10)}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-center">
                        {item.tingkat_kerusakan}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-center">
                        KM{item.titik_lokasi}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-center">
                        {item.jenis_kerusakan}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-center">
                        {item.status}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-center">
                        {item.nama_tol} ({item.ruas_tol})
                      </td>
                      <td
                        className={`px-6 py-4 flex gap-x-3 w-full ${
                          userLogin === "Admin" ? "block" : "hidden"
                        }`}
                      >
                        <Link
                          href={`/dashboard/DataMaster/Kerusakan/UbahKerusakan/${item.kerusakan_id}`}
                          className="w-1/2 bg-green-500 text-white px-4 py-2 rounded-md text-center"
                        >
                          <button>Edit Kerusakan</button>
                        </Link>
                        <button
                          onClick={() => handleDelete(item.kerusakan_id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md w-1/2 cursor-pointer"
                        >
                          Hapus Kerusakan
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination Buttons */}
            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Halaman {page} dari {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          {/* Tabel Tingkat Urgensi */}
          <div
            className={`overflow-x-auto w-full ${
              userLogin === "Project Officer" ? "block" : "hidden"
            }`}
          >
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-xl">
              <thead className="bg-[#211C84] text-white">
                <tr>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    indeks
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Tingkat Urgensi
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Keterangan
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tingkatUrgensi.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-gray-700 text-center">
                      {item.indeks}
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-center">
                      {item.tingkat_urgensi}
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-center">
                      {item.keterangan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      )}
    </DashboardLayout>
  );
};

export default TampilDataKerusakan;
