"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/Dashboardlayout";
import Link from "next/link";
import Alert from "../../../components/alert";

const TampilDataListKeahlian = () => {
  const [dataListKeahlian, setDataListKeahlian] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(7); // Bisa diubah kalau mau
  const [maxPage, setMaxPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://ptinticore.online/api/list_keahlian?page=${page}&limit=${limit}`
      );
      const data = await response.json();
      setDataListKeahlian(data.payload.datas);
      setMaxPage(data.pagination.max || 1);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://ptinticore.online/api/list_keahlian/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setAlertMessage("List Keahlian Berhasil Dihapus");
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
        }, 1000);
        fetchData(page); // Tetap di halaman sekarang
      } else {
        console.error("Gagal menghapus:", response.statusText);
      }
    } catch (error) {
      console.error("Error saat menghapus:", error);
    }
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < maxPage) setPage((prev) => prev + 1);
  };

  return (
    <DashboardLayout>
      {showAlert ? (
        <Alert message={alertMessage} />
      ) : (
        <main className="flex flex-col gap-y-10">
          <section className="flex justify-between items-center">
            <button className="flex justify-center items-center bg-[#211C84] text-white rounded-md p-3">
              <Link
                href="/dashboard/DataMaster/ListKeahlian/TambahListKeahlian"
                className="flex gap-x-3 items-center"
              >
                <i className="fas fa-add"></i>
                <h1>Tambah Data</h1>
              </Link>
            </button>
          </section>

          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-xl">
                <thead className="bg-[#211C84] text-white">
                  <tr>
                    <th className="px-6 py-3 text-center text-sm font-semibold">
                      No
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">
                      Jenis Kerusakan
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">
                      Tim A Padaleunyi
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">
                      Tim B Padaleunyi
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">
                      Tim A Cipularang
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">
                      Tim B Cipularang
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">
                      Tim Siaga
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dataListKeahlian.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-4 text-gray-500"
                      >
                        Tidak ada List Keahlian yang tersedia
                      </td>
                    </tr>
                  ) : (
                    dataListKeahlian.map((item, index) => (
                      <tr key={item.keahlian_id}>
                        <td className="px-6 py-4 text-gray-700 text-center">
                          {(page - 1) * limit + index + 1}
                        </td>
                        <td className="px-6 py-4 text-gray-700 text-center">
                          {item.jenis_kerusakan}
                        </td>
                        <td className="px-6 py-4 text-gray-700 text-center">
                          {item.tim_a_padeleunyi}
                        </td>
                        <td className="px-6 py-4 text-gray-700 text-center">
                          {item.tim_b_padaleunyi}
                        </td>
                        <td className="px-6 py-4 text-gray-700 text-center">
                          {item.tim_a_cipularang}
                        </td>
                        <td className="px-6 py-4 text-gray-700 text-center">
                          {item.tim_b_cipularang}
                        </td>
                        <td className="px-6 py-4 text-gray-700 text-center">
                          {item.tim_siaga}
                        </td>
                        <td className="px-6 py-4 flex gap-x-3 w-full">
                          <Link
                            href={`/dashboard/DataMaster/ListKeahlian/UbahListKeahlian/${item.keahlian_id}`}
                            className="w-1/2 bg-green-500 text-white px-4 py-2 rounded-md text-center"
                          >
                            <button>Edit</button>
                          </Link>
                          <button
                            onClick={() => handleDelete(item.keahlian_id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-md w-1/2"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="flex justify-center mt-4 gap-x-4">
                <button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded cursor-pointer ${
                    page === 1 ? "bg-gray-300" : "bg-[#211C84] text-white"
                  }`}
                >
                  Prev
                </button>
                <span className="self-center text-sm">
                  Halaman {page} dari {maxPage}
                </span>
                <button
                  onClick={handleNext}
                  disabled={page === maxPage}
                  className={`px-4 py-2 rounded cursor-pointer ${
                    page === maxPage ? "bg-gray-300" : "bg-[#211C84] text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      )}
    </DashboardLayout>
  );
};

export default TampilDataListKeahlian;
