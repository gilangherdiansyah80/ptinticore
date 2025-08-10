"use client";

import DashboardLayout from "../../components/Dashboardlayout";
import { useState, useEffect } from "react";
import Alert from "../../components/alert";

const TugasSayaSection = () => {
  const [dataPenugasan, setDataPenugasan] = useState([]);
  const [activePengerjaan, setActivePengerjaan] = useState(true);
  const [activePenugasanSelesai, setActivePenugasanSelesai] = useState(false);
  const [showPelaporan, setShowPelaporan] = useState(false);
  const [penugasanId, setPenugasanId] = useState(null);
  const [rowStatus, setRowStatus] = useState({});
  const [dataForm, setDataForm] = useState({
    tanggal_mulai: "",
    jam_mulai: "",
    tanggal_selesai: "",
    jam_selesai: "",
    durasi: "",
    kondisi_akhir: "",
    hasil_kunjungan: "",
    tindakan: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // NEW: Disable status per baris
  const [disabledRows, setDisabledRows] = useState({});

  const handleFormChange = (e) => {
    setDataForm({
      ...dataForm,
      [e.target.name]: e.target.value,
    });
  };

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

  const storedUser = localStorage.getItem("users");

  const filteredPenugasan = dataPenugasan.filter(
    (item) => item.role === storedUser
  );

  const handlePengerjaan = async (penugasanId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/kerusakan/update-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ penugasan_id: penugasanId }),
        }
      );

      if (response.ok) {
        console.log("Status kerusakan berhasil diperbarui ke 'ditangani'");
        setRowStatus((prev) => ({
          ...prev,
          [penugasanId]: { pengerjaan: false, selesai: true },
        }));
      }
    } catch (error) {
      console.error("Error update kerusakan:", error);
    }
  };

  const handleShowPelaporan = (id) => {
    setShowPelaporan(!showPelaporan);
    setPenugasanId(id);
  };

  const handlePenugasanSelesai = async (e) => {
    e.preventDefault();

    // Validasi form: cek apakah semua field terisi
    const emptyField = Object.entries(dataForm).find(
      ([, value]) => value === "" || value === null
    );

    if (emptyField) {
      setAlertMessage("Harap isi semua input sebelum menyimpan data!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return; // Hentikan proses jika ada field kosong
    }

    setShowPelaporan(false);

    try {
      const response = await fetch(
        `http://localhost:3000/api/pelaporan/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            penugasan_id: penugasanId,
            tanggal_mulai: dataForm.tanggal_mulai,
            jam_mulai: dataForm.jam_mulai,
            tanggal_selesai: dataForm.tanggal_selesai,
            jam_selesai: dataForm.jam_selesai,
            durasi: dataForm.durasi,
            kondisi_akhir: dataForm.kondisi_akhir,
            hasil_kunjungan: dataForm.hasil_kunjungan,
            tindakan: dataForm.tindakan,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.message) {
          setAlertMessage(result.message);
          setShowAlert(true);

          // Tandai row ini jadi disabled
          setDisabledRows((prev) => ({
            ...prev,
            [penugasanId]: true,
          }));

          setActivePengerjaan(false);
          setActivePenugasanSelesai(false);

          setTimeout(() => {
            setShowAlert(false);
          }, 2000);
        }
      } else {
        console.error("Failed to update penugasan:", response.statusText);
        alert("Gagal menambahkan pelaporan");
      }
    } catch (error) {
      console.error("Error updating penugasan:", error);
    }
  };

  return (
    <DashboardLayout>
      <main>
        <h1 className="text-3xl font-bold text-[#211C84]">Tugas Saya</h1>
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
                  "Aksi",
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
              {filteredPenugasan.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-4 text-gray-500">
                    Tidak ada data penugasan.
                  </td>
                </tr>
              ) : (
                filteredPenugasan.map((item, index) => (
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
                      {item.permasalahan}
                    </td>
                    <td className="px-6 py-4 text-center text-red-600">
                      {item.status_penugasan}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.nama_tol} ({item.ruas_tol})
                    </td>
                    <td className="px-6 py-4 flex gap-x-3 justify-center">
                      <button
                        onClick={() => handlePengerjaan(item.penugasan_id)}
                        disabled={
                          disabledRows[item.penugasan_id] ||
                          rowStatus[item.penugasan_id]?.pengerjaan === false
                        }
                        className={`text-white px-4 py-2 rounded-md ${
                          disabledRows[item.penugasan_id] ||
                          rowStatus[item.penugasan_id]?.pengerjaan === false
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-green-500 cursor-pointer"
                        }`}
                      >
                        Mulai Penugasan
                      </button>

                      <button
                        onClick={() => handleShowPelaporan(item.penugasan_id)}
                        disabled={
                          disabledRows[item.penugasan_id] ||
                          rowStatus[item.penugasan_id]?.selesai !== true
                        }
                        className={`text-white px-4 py-2 rounded-md ${
                          disabledRows[item.penugasan_id] ||
                          rowStatus[item.penugasan_id]?.selesai !== true
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-green-500 cursor-pointer"
                        }`}
                      >
                        Selesai Penugasan
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showPelaporan && (
          <main className="absolute inset-0 z-30 flex items-center justify-center bg-black/30">
            <div className="flex p-3 rounded-xl w-2/3 md:w-1/4 flex-col items-center justify-center bg-white">
              <h1 className="text-2xl text-[#211C84] font-semibold">
                Form Pelaporan
              </h1>

              <form className="flex flex-col gap-y-3 mt-3 w-full">
                <section className="flex gap-x-3 w-full">
                  <div className="flex flex-col gap-y-2 w-1/2">
                    <label className="text-black">Penugasan</label>
                    <input
                      className="p-2 rounded-md border-black border"
                      name="penugasan_id"
                      value={penugasanId}
                      onChange={(e) => setPenugasanId(e.target.value)}
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-y-2 w-1/2">
                    <label className="text-black">Durasi</label>
                    <input
                      className="p-2 rounded-md border-black border"
                      type="time"
                      name="durasi"
                      value={dataForm.durasi}
                      onChange={handleFormChange}
                    />
                  </div>
                </section>
                <section className="flex gap-x-3 w-full">
                  <div className="flex flex-col gap-y-2 w-1/2">
                    <label className="text-black">Tanggal Mulai</label>
                    <input
                      className="p-2 rounded-md border-black border"
                      type="date"
                      name="tanggal_mulai"
                      value={dataForm.tanggal_mulai}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="flex flex-col gap-y-2 w-1/2">
                    <label className="text-black">Jam Mulai</label>
                    <input
                      className="p-2 rounded-md border-black border"
                      type="time"
                      name="jam_mulai"
                      value={dataForm.jam_mulai}
                      onChange={handleFormChange}
                    />
                  </div>
                </section>
                <section className="flex gap-x-3 w-full">
                  <div className="flex flex-col gap-y-2 w-1/2">
                    <label className="text-black">Tanggal Selesai</label>
                    <input
                      className="p-2 rounded-md border-black border"
                      type="date"
                      name="tanggal_selesai"
                      value={dataForm.tanggal_selesai}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="flex flex-col gap-y-2 w-1/2">
                    <label className="text-black">Jam Selesai</label>
                    <input
                      className="p-2 rounded-md border-black border"
                      type="time"
                      name="jam_selesai"
                      value={dataForm.jam_selesai}
                      onChange={handleFormChange}
                    />
                  </div>
                </section>
                <div className="flex flex-col gap-y-2">
                  <label className="text-black">Kondisi Akhir</label>
                  <textarea
                    className="p-2 rounded-md border-black border"
                    name="kondisi_akhir"
                    value={dataForm.kondisi_akhir}
                    onChange={handleFormChange}
                  ></textarea>
                </div>
                <div className="flex flex-col gap-y-2">
                  <label className="text-black">Hasil Kunjungan</label>
                  <textarea
                    className="p-2 rounded-md border-black border"
                    name="hasil_kunjungan"
                    value={dataForm.hasil_kunjungan}
                    onChange={handleFormChange}
                  ></textarea>
                </div>
                <div className="flex flex-col gap-y-2">
                  <label className="text-black">Tindakan</label>
                  <textarea
                    className="p-2 rounded-md border-black border"
                    name="tindakan"
                    value={dataForm.tindakan}
                    onChange={handleFormChange}
                  ></textarea>
                </div>

                <div className="flex gap-x-3 w-full">
                  <button
                    onClick={handleShowPelaporan}
                    className="bg-red-600 p-3 text-white rounded-lg w-1/2 text-center cursor-pointer"
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePenugasanSelesai}
                    className="bg-green-500 p-3 text-white rounded-lg w-1/2 cursor-pointer"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </main>
        )}
      </main>

      {showAlert && <Alert message={alertMessage} />}
    </DashboardLayout>
  );
};

export default TugasSayaSection;
