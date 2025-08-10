"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/Dashboardlayout";
import ButtonForm from "../../../components/ButtonForm";
import Alert from "../../../components/alert";

const TambahDataKerusakan = () => {
  const [formData, setFormData] = useState({
    no_LHLKLP: "",
    tanggal_kerusakan: "",
    jam_kerusakan: "",
    tingkat_kerusakan: "",
    titik_lokasi: "",
    jalur_id: "",
    keahlian_id: "",
  });
  const [jenisKerusakan, setJenisKerusakan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataJalur, setDataJalur] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const fetchJenisKerusakan = async () => {
    try {
      const response = await fetch(
        "https://ptinticore.online/api/list_keahlian/jenis-kerusakan"
      );
      const data = await response.json();
      setJenisKerusakan(data.payload.datas);
    } catch (error) {
      console.error("Error fetching jenis kerusakan:", error);
    }
  };

  const fetchJalur = async () => {
    try {
      const response = await fetch("https://ptinticore.online/api/jalur_tol");
      const data = await response.json();
      setDataJalur(data.payload.datas);
    } catch (error) {
      console.error("Error fetching jalur:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // 🔹 Validasi manual
    for (const key in formData) {
      if (!formData[key] || formData[key].toString().trim() === "") {
        setAlertMessage("Semua input harus diisi!");
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
        setLoading(false);
        return;
      }
    }

    try {
      const form = new FormData();
      for (const key in formData) {
        form.append(key, formData[key]);
      }

      const response = await fetch(
        "https://ptinticore.online/api/kerusakan/create",
        {
          method: "POST",
          body: form,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menambahkan kerusakan");
      }

      const data = await response.json();
      console.log("Kerusakan added:", data);

      setAlertMessage("Data kerusakan berhasil ditambahkan!");
      setShowAlert(true);

      setTimeout(() => {
        window.location.href = "/dashboard/DataMaster/Kerusakan";
      }, 1000);
    } catch (error) {
      setError(error.message || "Terjadi kesalahan");
      console.error("Error adding kerusakan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJalur();
    fetchJenisKerusakan();
  }, []);

  return (
    <DashboardLayout>
      {showAlert && <Alert message={alertMessage} />}
      <main className="flex flex-col gap-y-5">
        <h1 className="text-2xl font-bold text-[#211C84]">
          Tambah Data Kerusakan
        </h1>
        {error && <p className="text-red-500">{error}</p>}
        <form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
          <input
            type="text"
            name="no_LHLKLP"
            placeholder="Nomor LHLKLP"
            value={formData.no_LHLKLP}
            onChange={handleChange}
            className="border border-[#211C84] rounded-lg p-3"
          />
          <input
            type="date"
            name="tanggal_kerusakan"
            value={formData.tanggal_kerusakan}
            onChange={handleChange}
            className="border border-[#211C84] rounded-lg p-3"
          />
          <input
            type="time"
            name="jam_kerusakan"
            value={formData.jam_kerusakan}
            onChange={handleChange}
            className="border border-[#211C84] rounded-lg p-3"
          />
          <select
            name="tingkat_kerusakan"
            value={formData.tingkat_kerusakan}
            onChange={handleChange}
            className="border border-[#211C84] rounded-lg p-3"
          >
            <option value="">Pilih Tingkat Kerusakan</option>
            <option value="1">Tingkat 1</option>
            <option value="2">Tingkat 2</option>
            <option value="3">Tingkat 3</option>
            <option value="4">Tingkat 4</option>
            <option value="5">Tingkat 5</option>
          </select>
          <input
            type="number"
            name="titik_lokasi"
            placeholder="Titik Lokasi"
            value={formData.titik_lokasi}
            onChange={handleChange}
            className="border border-[#211C84] rounded-lg p-3"
          />
          <select
            name="jalur_id"
            value={formData.jalur_id}
            onChange={handleChange}
            className="border border-[#211C84] rounded-lg p-3"
          >
            <option value="">Pilih Jalur</option>
            {dataJalur.map((jalur) => (
              <option key={jalur.jalur_id} value={jalur.jalur_id}>
                {jalur.nama_tol} ({jalur.ruas_tol})
              </option>
            ))}
          </select>
          <select
            name="keahlian_id"
            value={formData.keahlian_id}
            onChange={handleChange}
            className="border border-[#211C84] rounded-lg p-3"
          >
            <option value="">Pilih Jenis Kerusakan</option>
            {jenisKerusakan.map((item) => (
              <option key={item.keahlian_id} value={item.keahlian_id}>
                {item.jenis_kerusakan}
              </option>
            ))}
          </select>
          <ButtonForm
            href="/dashboard/DataMaster/Kerusakan"
            loading={loading}
            style={`${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          />
        </form>
      </main>
    </DashboardLayout>
  );
};

export default TambahDataKerusakan;
