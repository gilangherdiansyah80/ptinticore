"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/Dashboardlayout";
import ButtonForm from "../../../components/ButtonForm";
import Alert from "../../../components/alert";

const TambahDataTim = () => {
  const [formData, setFormData] = useState({
    user_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [dataUsers, setDataUsers] = useState([]);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // Menggunakan `name` daripada `id`
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    // Validasi custom: inputan tidak boleh kosong
    if (!formData.user_id) {
      setAlertMessage("Pilih tim terlebih dahulu!");

      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
      setShowAlert(true);
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("user_id", formData.user_id);

      const response = await fetch("http://localhost:3000/api/tim/create", {
        method: "POST",
        body: form,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add tim");
      }

      setFormData({ user_id: "" });
      setAlertMessage("✅ Tim berhasil ditambahkan!");
      setShowAlert(true);

      setTimeout(() => {
        window.location.href = "/dashboard/DataMaster/Tim";
      }, 1000);
    } catch (error) {
      setError(error.message || "Something went wrong");
      console.error("Error adding tim:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users");
      const data = await response.json();
      setDataUsers(data.payload.datas);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchDataUsers();
  }, []);

  const excludeRole = ["Direktur", "Project Officer"];

  const fillteredUsers = dataUsers.filter(
    (user) => !excludeRole.includes(user.role)
  );

  return (
    <DashboardLayout>
      {showAlert ? (
        <Alert message={alertMessage} />
      ) : (
        <main className="flex flex-col gap-y-5">
          <h1 className="text-2xl font-bold text-[#211C84]">Add Tim</h1>
          {error && <p className="text-red-500">{error}</p>}
          <form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
            <select
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              className="border border-[#211C84] rounded-lg p-3"
            >
              <option value="">Pilih Tim</option>
              {fillteredUsers.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.role}
                </option>
              ))}
            </select>
            <ButtonForm
              href={"/dashboard/DataMaster/Tim"}
              loading={loading}
              styyle={`${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </form>
        </main>
      )}
    </DashboardLayout>
  );
};

export default TambahDataTim;
