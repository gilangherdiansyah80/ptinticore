"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "../../components/Dashboardlayout";

const PelaporanSection = () => {
  const [dataPelaporan, setDataPelaporan] = useState([]);

  const fetchData = async () => {
    const response = await fetch("http://localhost:3000/api/pelaporan");
    const data = await response.json();
    setDataPelaporan(data.payload.datas);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <main className="flex flex-col gap-y-10">
        <h1 className="text-2xl text-[#211C84] font-semibold">
          Pelaporan Hasil Perbaikan
        </h1>
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
                  Permasalahan
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Tanggal Mulai
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Jam Mulai
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Tanggal Selesai
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Jam Selesai
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Durasi
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Kondisi Akhir
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Tindakan
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dataPelaporan.length > 0 ? (
                dataPelaporan.map((item, index) => (
                  <tr key={item.pelaporan_id}>
                    <td className="px-6 py-4 text-gray-700 text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-center">
                      {item.no_LHLKLP}
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-center">
                      {item.jenis_kerusakan}
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-center">
                      {item.tanggal_mulai.slice(0, 10)}
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-center">
                      {item.jam_mulai}
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-center">
                      {item.tanggal_selesai.slice(0, 10)}
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-center">
                      {item.jam_selesai}
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-center">
                      {item.durasi}
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-center">
                      {item.kondisi_akhir}
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-center">
                      {item.tindakan}
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-center">
                      {item.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    className="px-6 py-4 text-gray-700 text-center"
                  >
                    Tidak ada data pelaporan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default PelaporanSection;
