"use client";
import { useState } from "react";
import DashboardLayout from "../../../components/Dashboardlayout";
import Alert from "../../../components/alert";
import ButtonForm from "../../../components/ButtonForm";

const TambahDataUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
    setLoading(true);
    setError("");

    // 1️⃣ Validasi input kosong di frontend
    if (!formData.username || !formData.password || !formData.role) {
      setError("Semua field harus diisi");
      setLoading(false);
      return;
    }

    try {
      const form = new FormData();
      form.append("username", formData.username);
      form.append("password", formData.password);
      form.append("role", formData.role);

      const response = await fetch(
        "https://ptinticore.online/api/users/create",
        {
          method: "POST",
          body: form,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // 2️⃣ Menangani pesan error dari backend (username sudah ada, dll)
        setError(data.error || "Gagal menambahkan user");
        setAlertMessage(error);
        setLoading(false);
        return;
      }

      // 3️⃣ Jika sukses
      setFormData({ username: "", password: "", role: "" });
      setAlertMessage("User berhasil ditambahkan!");
      setShowAlert(true);
      setTimeout(() => {
        window.location.href = "/dashboard/DataMaster/Users";
      }, 1500);
    } catch (err) {
      setError("Terjadi kesalahan saat menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {showAlert ? (
        <Alert message={alertMessage} />
      ) : (
        <main className="flex flex-col gap-y-5">
          <h1 className="text-2xl font-bold text-[#211C84]">Add Users</h1>

          {error && <p className="text-red-500">{error}</p>}

          <form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Input Username"
              className={`border rounded-lg p-3 ${
                error && !formData.username
                  ? "border-red-500"
                  : "border-[#211C84]"
              }`}
            />
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Input Password"
              className={`border rounded-lg p-3 ${
                error && !formData.password
                  ? "border-red-500"
                  : "border-[#211C84]"
              }`}
            />
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Input Role"
              className={`border rounded-lg p-3 ${
                error && !formData.role ? "border-red-500" : "border-[#211C84]"
              }`}
            />
            <ButtonForm
              href="/dashboard/DataMaster/Users"
              loading={loading}
              style={`${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </form>
        </main>
      )}
    </DashboardLayout>
  );
};

export default TambahDataUser;
