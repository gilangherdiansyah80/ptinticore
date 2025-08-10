"use client";

import DashboardLayout from "../../../components/Dashboardlayout";
import ButtonForm from "../../../components/ButtonForm";
import { useState, useEffect } from "react";
import Alert from "../../../components/alert";

const UbahDataUser = ({ params }) => {
  const [users, setUsers] = useState({
    username: "",
    password: "",
    role: "",
  });
  const { id } = params;
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fungsi untuk mendapatkan data produk
  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${id}`);
      const data = await response.json();

      if (response.ok) {
        setUsers(data.payload.datas[0]);
      } else {
        console.error("Failed to fetch user:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // Fungsi untuk menangani perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsers((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Fungsi untuk submit data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!users.username || !users.password || !users.role) {
      setAlertMessage("All fields are required!");
      setShowAlert(true);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/users/edit/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(users),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setAlertMessage("User Berhasil Ditambahkan!");
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
          window.location.href = "/dashboard/DataMaster/Users";
        }, 1000);
      } else {
        setAlertMessage(result.message || "Failed to update user");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setAlertMessage("An error occurred while updating user");
      setShowAlert(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      {showAlert ? (
        <Alert message={alertMessage} />
      ) : (
        <main className="flex flex-col gap-y-5">
          <h1 className="text-2xl font-bold text-[#211C84]">Edit Users</h1>
          <form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Input Username Product"
              name="username"
              value={users.username || ""}
              onChange={handleChange}
              className="border border-[#211C84] rounded-lg p-3"
              required
            />
            <input
              type="text"
              placeholder="Input Password"
              name="password"
              value={users.password || ""}
              onChange={handleChange}
              className="border border-[#211C84] rounded-lg p-3"
              required
            />
            <input
              type="text"
              placeholder="Input Role"
              name="role"
              value={users.role || ""}
              onChange={handleChange}
              className="border border-[#211C84] rounded-lg p-3"
              required
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

export default UbahDataUser;
