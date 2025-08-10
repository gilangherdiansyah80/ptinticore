"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/Dashboardlayout";
import ButtonForm from "../../../components/ButtonForm";
import Alert from "../../../components/alert";

const UbahDataListKeahlian = ({ params }) => {
  const { id } = params;
  const [form, setForm] = useState({
    jenis_kerusakan: "",
    tim_a_padeleunyi: "",
    tim_b_padaleunyi: "",
    tim_a_cipularang: "",
    tim_b_cipularang: "",
    tim_siaga: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/list_keahlian/${id}`
        );
        const data = await response.json();
        setForm(data.payload.datas[0]);
      } catch (error) {
        console.error("Error fetching kerusakan:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi semua input
    const emptyField = Object.entries(form).find(
      ([, value]) => value === "" || value === null
    );

    if (emptyField) {
      setAlertMessage("Harap isi semua input sebelum menyimpan data!");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
      return; // hentikan proses submit jika ada yang kosong
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/list_keahlian/edit/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setAlertMessage("Data kerusakan berhasil diubah!");
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
          window.location.href = "/dashboard/DataMaster/ListKeahlian";
        }, 1000);
      } else {
        alert("Gagal mengubah data kerusakan: " + result.message);
      }
    } catch (error) {
      console.error("Error updating kerusakan:", error);
    }
  };

  if (!form) return <div>Loading...</div>;

  return (
    <DashboardLayout>
      {showAlert ? (
        <Alert message={alertMessage} />
      ) : (
        <main className="flex flex-col gap-y-3">
          <h1 className="text-3xl font-bold text-[#211C84]">
            Edit Data List Keahlian
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

            <ButtonForm href="/dashboard/DataMaster/ListKeahlian" />
          </form>
        </main>
      )}
    </DashboardLayout>
  );
};

export default UbahDataListKeahlian;
