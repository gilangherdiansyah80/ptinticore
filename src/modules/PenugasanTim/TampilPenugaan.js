"use client";

import DashboardLayout from "../../components/Dashboardlayout";
import { useState, useEffect } from "react";

const TampilPenugasanSection = () => {
  const [dataPenugasan, setDataPenugasan] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/penugasan");
        const result = await response.json();
        setDataPenugasan(result.payload?.datas || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <main>
        <h1 className="text-3xl font-bold text-[#211C84]">Penugasan Tim</h1>
        <div className="overflow-x-auto w-full mt-4">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-xl">
            <thead className="bg-[#211C84] text-white">
              <tr>
                {[
                  "No",
                  "No. LH/LK/LP",
                  "Jam Kerusakan",
                  "Tanggal Kerusakan",
                  "Tingkat Kerusakan",
                  "Titik Lokasi",
                  "Permasalahan",
                  "Status",
                  "Jalur Tol (Ruas Tol)",
                ].map((title, idx) => (
                  <th
                    key={idx}
                    className="px-6 py-3 text-center text-sm font-semibold"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dataPenugasan.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-4 text-gray-500">
                    Tidak ada data penugasan.
                  </td>
                </tr>
              ) : (
                dataPenugasan.map((item, index) => (
                  <tr key={item.penugasan_id}>
                    <td className="px-6 py-4 text-center">{index + 1}</td>
                    <td className="px-6 py-4 text-center">{item.no_LHLKLP}</td>
                    <td className="px-6 py-4 text-center">
                      {item.jam_kerusakan}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.tanggal_kerusakan?.slice(0, 10)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.tingkat_kerusakan}
                    </td>
                    <td className="px-6 py-4 text-center">
                      KM{item.titik_lokasi}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.jenis_kerusakan}
                    </td>
                    <td className="px-6 py-4 text-center text-red-600">
                      {item.status_penugasan}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.nama_tol} ({item.ruas_tol})
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default TampilPenugasanSection;
