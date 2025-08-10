"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/Dashboardlayout";
import Link from "next/link";
import Alert from "../../../components/alert";

const TampilDataJalurTol = () => {
  const [dataJalurTol, setDataJalurTol] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const fetchData = async (id) => {
    const response = await fetch("http://localhost:3000/api/jalur_tol");
    const data = await response.json();
    setDataJalurTol(data.payload.datas);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/jalur_tol/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setAlertMessage("Jalur tol Berhasil Dihapus");
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
        }, 1000);
        fetchData();
      } else {
        console.error("Failed to delete jalur tol:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting jalur tol:", error);
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
                href="/dashboard/DataMaster/JalurTol/TambahJalurTol"
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
                    Nama Tol
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Ruas Tol
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
                {dataJalurTol.map((item, index) => (
                  <tr key={item.jalur_id}>
                    <td className="px-6 py-4 text-gray-500 text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-center">
                      {item.nama_tol}
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium text-center">
                      {item.ruas_tol}
                    </td>
                    <td
                      className={`px-6 py-4 flex gap-x-3 w-full ${
                        userLogin === "Admin" ? "block" : "hidden"
                      }`}
                    >
                      <Link
                        href={`/dashboard/DataMaster/JalurTol/UbahJalurTol/${item.jalur_id}`}
                        className="w-1/2 bg-green-500 text-white px-4 py-2 rounded-md text-center"
                      >
                        <button>Edit Jalur Tol</button>
                      </Link>
                      <button
                        onClick={() => handleDelete(item.jalur_id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md w-1/2 cursor-pointer"
                      >
                        Hapus Jalur Tol
                      </button>
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

export default TampilDataJalurTol;
