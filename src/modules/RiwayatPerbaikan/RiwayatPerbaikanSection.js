"use client";
import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../components/Dashboardlayout";

const RiwayatPerbaikanSection = () => {
  const [dataPelaporan, setDataPelaporan] = useState([]);
  const tableRef = useRef(null); // 🔹 Tambah ref

  const fetchData = async () => {
    const response = await fetch(
      "https://ptinticore.online/api/riwayat_perbaikan"
    );
    const data = await response.json();
    setDataPelaporan(data.payload.datas);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCetakPDF = () => {
    const printContents = tableRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents; // tampilkan tabel saja
    window.print();
    document.body.innerHTML = originalContents; // kembalikan isi asli
    window.location.reload(); // reload supaya event binding balik
  };

  return (
    <DashboardLayout>
      <main className="flex flex-col gap-y-10">
        <section className="flex items-center justify-between">
          <h1 className="text-2xl text-[#211C84] font-semibold">
            Riwayat Perbaikan
          </h1>

          <button
            className="bg-[#211C84] p-3 text-white rounded-lg cursor-pointer"
            onClick={handleCetakPDF}
          >
            Cetak PDF
          </button>
        </section>
        <div
          className="overflow-x-auto w-full print:overflow-visible print-area"
          ref={tableRef}
        >
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
                  Nama Tol
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Ruas Tol
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dataPelaporan.length > 0 ? (
                dataPelaporan.map((item, index) => (
                  <tr key={item.pelaporan_id}>
                    <td className="px-6 py-4 text-center">{index + 1}</td>
                    <td className="px-6 py-4 text-center">{item.no_LHLKLP}</td>
                    <td className="px-6 py-4 text-center">
                      {item.jenis_kerusakan}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.tanggal_mulai?.slice(0, 10)}
                    </td>
                    <td className="px-6 py-4 text-center">{item.jam_mulai}</td>
                    <td className="px-6 py-4 text-center">
                      {item.tanggal_selesai?.slice(0, 10)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.jam_selesai}
                    </td>
                    <td className="px-6 py-4 text-center">{item.durasi}</td>
                    <td className="px-6 py-4 text-center">
                      {item.kondisi_akhir}
                    </td>
                    <td className="px-6 py-4 text-center">{item.tindakan}</td>
                    <td className="px-6 py-4 text-center">{item.status}</td>
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
                      {item.titik_lokasi}
                    </td>
                    <td className="px-6 py-4 text-center">{item.nama_tol}</td>
                    <td className="px-6 py-4 text-center">{item.ruas_tol}</td>
                    <td className="px-6 py-4 text-center">{item.role}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="18" className="px-6 py-4 text-center">
                    Tidak ada Riwayat Perbaikan
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

export default RiwayatPerbaikanSection;
