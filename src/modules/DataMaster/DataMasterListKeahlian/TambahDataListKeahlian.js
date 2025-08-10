"use client";
import { useState } from "react";
import DashboardLayout from "../../../components/Dashboardlayout";
import Alert from "../../../components/alert";
import ButtonForm from "../../../components/ButtonForm";

const TambahDataListKeahlian = () => {
  const [form, setForm] = useState({
    jenis_kerusakan: "",
    tim_a_padeleunyi: "",
    tim_b_padaleunyi: "",
    tim_a_cipularang: "",
    tim_b_cipularang: "",
    tim_siaga: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // Validasi semua field
    const emptyField = Object.entries(form).find(
      ([, value]) => value === "" || value === null
    );

    if (emptyField) {
      setAlertMessage("Harap isi semua input sebelum menyimpan data!");
      setShowAlert(true);
      setLoading(false);
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
      return; // hentikan proses submit
    }

    try {
      const response = await fetch(
        "https://ptinticore.online/api/list_keahlian/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menambahkan keahlian");
      }

      const data = await response.json();
      console.log("Keahlian added:", data);

      setAlertMessage("Data keahlian berhasil ditambahkan!");
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
        window.location.href = "/dashboard/DataMaster/ListKeahlian";
      }, 2000);
    } catch (error) {
      setError(error.message || "Terjadi kesalahan");
      console.error("Error adding keahlian:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {showAlert ? (
        <Alert message={alertMessage} />
      ) : (
        <>
          <h1 className="text-2xl font-bold text-[#211C84]">
            Tambah Data Kerusakan
          </h1>
          {error && <p className="text-red-500">{error}</p>}
          <form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
            <input
              type="text"
              name="jenis_kerusakan"
              placeholder="Jenis Kerusakan"
              value={form.jenis_kerusakan}
              onChange={handleChange}
              className="border border-[#211C84] rounded-lg p-3"
            />
            <select
              name="tim_a_padeleunyi"
              value={form.tim_a_padeleunyi}
              onChange={handleChange}
              className="border border-[#211C84] rounded-lg p-3"
            >
              <option value="">Pilih Tingkat Keahlian</option>
              <option value="1">Tingkat 1</option>
              <option value="2">Tingkat 2</option>
              <option value="3">Tingkat 3</option>
              <option value="4">Tingkat 4</option>
              <option value="5">Tingkat 5</option>
            </select>
            <select
              name="tim_b_padaleunyi"
              value={form.tim_b_padaleunyi}
              onChange={handleChange}
              className="border border-[#211C84] rounded-lg p-3"
            >
              <option value="">Pilih Tingkat Keahlian</option>
              <option value="1">Tingkat 1</option>
              <option value="2">Tingkat 2</option>
              <option value="3">Tingkat 3</option>
              <option value="4">Tingkat 4</option>
              <option value="5">Tingkat 5</option>
            </select>
            <select
              name="tim_a_cipularang"
              value={form.tim_a_cipularang}
              onChange={handleChange}
              className="border border-[#211C84] rounded-lg p-3"
            >
              <option value="">Pilih Tingkat Keahlian</option>
              <option value="1">Tingkat 1</option>
              <option value="2">Tingkat 2</option>
              <option value="3">Tingkat 3</option>
              <option value="4">Tingkat 4</option>
              <option value="5">Tingkat 5</option>
            </select>
            <select
              name="tim_b_cipularang"
              value={form.tim_b_cipularang}
              onChange={handleChange}
              className="border border-[#211C84] rounded-lg p-3"
            >
              <option value="">Pilih Tingkat Keahlian</option>
              <option value="1">Tingkat 1</option>
              <option value="2">Tingkat 2</option>
              <option value="3">Tingkat 3</option>
              <option value="4">Tingkat 4</option>
              <option value="5">Tingkat 5</option>
            </select>
            <select
              name="tim_siaga"
              value={form.tim_siaga}
              onChange={handleChange}
              className="border border-[#211C84] rounded-lg p-3"
            >
              <option value="">Pilih Tingkat Keahlian</option>
              <option value="1">Tingkat 1</option>
              <option value="2">Tingkat 2</option>
              <option value="3">Tingkat 3</option>
              <option value="4">Tingkat 4</option>
              <option value="5">Tingkat 5</option>
            </select>

            <ButtonForm
              href="/dashboard/DataMaster/ListKeahlian"
              loading={loading}
              style={`${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </form>
        </>
      )}
    </DashboardLayout>
  );
};

export default TambahDataListKeahlian;
