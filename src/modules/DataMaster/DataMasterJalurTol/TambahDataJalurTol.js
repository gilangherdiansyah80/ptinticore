"use client";
import { useState } from "react";
import DashboardLayout from "../../../components/Dashboardlayout";
import ButtonForm from "../../../components/ButtonForm";
import Alert from "../../../components/alert";

const TambahDataJalurTol = () => {
  const [formData, setFormData] = useState({
    nama_tol: "",
    ruas_tol: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    // 🔹 Validasi manual
    if (!formData.nama_tol.trim() || !formData.ruas_tol.trim()) {
      setAlertMessage("Semua input harus diisi!");

      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
      setShowAlert(true);
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("nama_tol", formData.nama_tol);
      form.append("ruas_tol", formData.ruas_tol);

      const response = await fetch(
        "https://ptinticore.online/api/jalur_tol/create",
        {
          method: "POST",
          body: form,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add jalur tol");
      }

      setFormData({ nama_tol: "", ruas_tol: "" });
      setAlertMessage("Jalur tol berhasil ditambahkan!");
      setShowAlert(true);

      setTimeout(() => {
        window.location.href = "/dashboard/DataMaster/JalurTol";
      }, 1000);
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {showAlert && <Alert message={alertMessage} />}
      <main className="flex flex-col gap-y-5">
        <h1 className="text-2xl font-bold text-[#211C84]">Add Jalur Tol</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nama_tol"
            value={formData.nama_tol}
            onChange={handleChange}
            placeholder="Input Nama Tol"
            className="border border-[#211C84] rounded-lg p-3"
          />
          <select
            name="ruas_tol"
            value={formData.ruas_tol}
            onChange={handleChange}
            className="border border-[#211C84] rounded-lg p-3"
          >
            <option value="">Pilih Ruas Tol</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
          <ButtonForm
            href="/dashboard/DataMaster/JalurTol"
            loading={loading}
            style={`${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          />
        </form>
      </main>
    </DashboardLayout>
  );
};

export default TambahDataJalurTol;
