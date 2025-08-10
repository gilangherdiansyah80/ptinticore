"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/Dashboardlayout";
import Link from "next/link";
import Alert from "../../../components/alert";

const TampilDataTim = () => {
  const [dataTim, setDataTim] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const fetchData = async () => {
    const response = await fetch("http://localhost:3000/api/tim");
    const data = await response.json();
    setDataTim(data.payload.datas);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/tim/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json(); // Tambahkan ini

      if (response.ok) {
        setShowAlert(true);
        setAlertMessage("Tim Berhasil Dihapus");
        fetchData(); // Perbarui data

        setTimeout(() => {
          setShowAlert(false);
        }, 1000);
      } else {
        setShowAlert(true);
        setAlertMessage(
          "Gagal menghapus tim:",
          result.message || response.statusText
        );

        setTimeout(() => {
          setShowAlert(false);
        }, 500);
      }
    } catch (error) {
      console.error("Error saat menghapus tim:", error);
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
                href="/dashboard/DataMaster/Tim/TambahTim"
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
                    Nama Tim
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Status
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
                {dataTim.length > 0 ? (
                  dataTim.map((item, index) => (
                    <tr key={item.tim_id}>
                      <td className="px-6 py-4 text-gray-700 text-center">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-center">
                        {item.role}
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium text-center">
                        {item.status}
                      </td>
                      <td
                        className={`px-6 py-4 space-y-2 flex gap-x-3 w-full ${
                          userLogin === "Admin" ? "block" : "hidden"
                        }`}
                      >
                        {/* <Link
                      href={`/dashboard/DataMaster/Tim/EditTim/${item.tim_id}`}
                      className="w-1/2 bg-[#211C84] text-white px-4 py-2 rounded-md text-center"
                    >
                      <button>Edit Tim</button>
                    </Link> */}
                        <button
                          onClick={() => handleDelete(item.tim_id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md w-full"
                        >
                          Hapus Tim
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center">
                      Tidak ada Tim
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      )}
    </DashboardLayout>
  );
};

export default TampilDataTim;
