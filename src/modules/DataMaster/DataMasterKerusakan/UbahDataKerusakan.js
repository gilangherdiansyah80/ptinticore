"use client";

import DashboardLayout from "../../../components/Dashboardlayout";
import ButtonForm from "../../../components/ButtonForm";
import { useState, useEffect } from "react";
import Alert from "../../../components/alert";

const UbahDataKerusakan = ({ params }) => {
  const { id } = params;

  const [kerusakan, setKerusakan] = useState({
    no_LHLKLP: "",
    jam_kerusakan: "",
    tanggal_kerusakan: "",
    tingkat_kerusakan: "",
    titik_lokasi: "",
    jalur_id: "",
    keahlian_id: "",
    status: "",
  });

  const [dataJalur, setDataJalur] = useState([]);
  const [jenisKerusakan, setJenisKerusakan] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Fetch data kerusakan by ID
  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/kerusakan/${id}`);
      const data = await response.json();
      if (response.ok) {
        setKerusakan(data.payload.datas[0]);
      } else {
        console.error("Failed to fetch kerusakan:", data.message);
      }
    } catch (error) {
      console.error("Error fetching kerusakan:", error);
    }
  };

  const fetchDataJenisKerusakan = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/list_keahlian/jenis-kerusakan`
      );
      const data = await response.json();
      if (response.ok) {
        setJenisKerusakan(data.payload.datas);
      } else {
        console.error("Failed to fetch kerusakan:", data.message);
      }
    } catch (error) {
      console.error("Error fetching kerusakan:", error);
    }
  };

  // Fetch opsi jalur untuk dropdown
  const fetchJalur = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/jalur_tol");
      const data = await response.json();
      setDataJalur(data.payload.datas);
    } catch (error) {
      console.error("Error fetching jalur:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchJalur();
    fetchDataJenisKerusakan();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKerusakan((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi manual: cek jika ada inputan kosong
    for (const key in kerusakan) {
      if (kerusakan[key] === "" || kerusakan[key] === null) {
        setAlertMessage("Harap isi semua input sebelum menyimpan data!");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
        return; // hentikan proses submit
      }
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/kerusakan/edit/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(kerusakan),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setAlertMessage("Data kerusakan berhasil diubah!");
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
          window.location.href = "/dashboard/DataMaster/Kerusakan";
        }, 1000);
      } else {
        setAlertMessage("Gagal mengubah data kerusakan: " + result.message);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating kerusakan:", error);
      setAlertMessage("Terjadi kesalahan saat menyimpan data.");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }
  };

  return (
    <DashboardLayout>
      {showAlert ? (
        <Alert message={alertMessage} />
      ) : (
        <main className="flex flex-col gap-y-5">
          <h1 className="text-2xl font-bold text-[#211C84]">
            Edit Data Kerusakan
          </h1>
          <form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
            <input
              type="text"
              name="no_LHLKLP"
              value={kerusakan.no_LHLKLP}
              onChange={handleChange}
              placeholder="Nomor LHLKLP"
              className="border border-[#211C84] rounded-lg p-3"
            />
            <input
              type="time"
              name="jam_kerusakan"
              value={kerusakan.jam_kerusakan}
              onChange={handleChange}
              className="border border-[#211C84] rounded-lg p-3"
            />
            <input
              type="date"
              name="tanggal_kerusakan"
              value={kerusakan.tanggal_kerusakan}
              onChange={handleChange}
              className="border border-[#211C84] rounded-lg p-3"
            />
            <select
              name="tingkat_kerusakan"
              value={kerusakan.tingkat_kerusakan}
              onChange={handleChange}
              className="border border-[#211C84] rounded-lg p-3"
            >
              <option value="">{kerusakan.tingkat_kerusakan}</option>
              <option value="1">Tingkat 1</option>
              <option value="2">Tingkat 2</option>
              <option value="3">Tingkat 3</option>
              <option value="4">Tingkat 4</option>
              <option value="5">Tingkat 5</option>
            </select>
            <input
              type="text"
              name="titik_lokasi"
              value={kerusakan.titik_lokasi}
              onChange={handleChange}
              placeholder="Titik Lokasi"
              className="border border-[#211C84] rounded-lg p-3"
            />
            <select
              name="jalur_id"
              value={kerusakan.jalur_id}
              onChange={handleChange}
              className="border border-[#211C84] rounded-lg p-3"
            >
              <option value="">Pilih Jalur</option>
              {dataJalur.map((jalur) => (
                <option key={jalur.jalur_id} value={jalur.jalur_id}>
                  {jalur.nama_tol}({jalur.ruas_tol})
                </option>
              ))}
            </select>
            <select
              name="keahlian_id"
              value={kerusakan.keahlian_id}
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
            <select
              name="status"
              value={kerusakan.status}
              onChange={handleChange}
              className="border border-[#211C84] rounded-lg p-3"
            >
              <option value="">Pilih Status</option>
              <option value="lapor">Lapor</option>
              <option value="ditangani">Ditangani</option>
              <option value="selesai">Selesai</option>
            </select>

            <ButtonForm href="/dashboard/DataMaster/Kerusakan" />
          </form>
        </main>
      )}
    </DashboardLayout>
  );
};

export default UbahDataKerusakan;
