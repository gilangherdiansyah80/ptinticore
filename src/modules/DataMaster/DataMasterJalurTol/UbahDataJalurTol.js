"use client";

import DashboardLayout from "../../../components/Dashboardlayout";
import { useState, useEffect } from "react";
import ButtonForm from "../../../components/ButtonForm";
import Alert from "../../../components/alert";

const UbahDataJalurTol = ({ params }) => {
  const [jalurTol, setJalurTol] = useState({
    nama_tol: "",
    ruas_tol: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { id } = params;

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://ptinticore.online/api/jalur_tol/${id}`
      );
      const data = await response.json();

      if (response.ok) {
        setJalurTol(data.payload.datas[0]);
      } else {
        console.error("Failed to fetch jalur tol:", data.message);
      }
    } catch (error) {
      console.error("Error fetching jalur tol:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJalurTol((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Validasi manual
    if (!jalurTol.nama_tol.trim() || !jalurTol.ruas_tol.trim()) {
      setAlertMessage("Semua input harus diisi!");
      setTimeout(() => setShowAlert(false), 2000);
      setShowAlert(true);
      return;
    }

    try {
      const response = await fetch(
        `https://ptinticore.online/api/jalur_tol/edit/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jalurTol),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setAlertMessage("Berhasil mengubah jalur tol!");
        setShowAlert(true);

        setTimeout(() => {
          window.location.href = "/dashboard/DataMaster/JalurTol";
        }, 1000);
      } else {
        setAlertMessage("❌ Gagal mengubah jalur tol: " + result.message);
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error updating jalur tol:", error);
      setAlertMessage("❌ Terjadi kesalahan saat mengupdate data.");
      setShowAlert(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      {showAlert && <Alert message={alertMessage} />}
      <main className="flex flex-col gap-y-5">
        <h1 className="text-2xl font-bold text-[#211C84]">Edit Jalur Tol</h1>
        <form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Input Nama Tol"
            name="nama_tol"
            value={jalurTol.nama_tol}
            onChange={handleChange}
            className="border border-[#211C84] rounded-lg p-3"
          />
          <select
            name="ruas_tol"
            value={jalurTol.ruas_tol}
            onChange={handleChange}
            className="border border-[#211C84] rounded-lg p-3"
          >
            <option value="">Pilih Ruas Tol</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
          <ButtonForm href="/dashboard/DataMaster/JalurTol" />
        </form>
      </main>
    </DashboardLayout>
  );
};

export default UbahDataJalurTol;
