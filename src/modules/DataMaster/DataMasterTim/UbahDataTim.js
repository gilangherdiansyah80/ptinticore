"use client";

import DashboardLayout from "../../../components/Dashboardlayout";
import Link from "next/link";
import { useState, useEffect } from "react";

const UbahDataTim = ({ params }) => {
  const [tim, settim] = useState({
    user_id: "",
  });
  const { id } = params;
  const [dataUser, setDataUser] = useState([]); // Ganti nama dari dataTim ke dataUser agar lebih tepat

  // Mendapatkan data tim berdasarkan ID
  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/tim/${id}`);
      const data = await response.json();

      if (response.ok) {
        settim({
          user_id: data.payload.datas.user_id || "",
        });
      } else {
        console.error("Failed to fetch tim:", data.message);
      }
    } catch (error) {
      console.error("Error fetching tim:", error);
    }
  };

  // Mengambil data semua user untuk opsi select
  const fetchDataUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users");
      const data = await response.json();
      setDataUser(data.payload.datas);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    settim((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/tim/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tim),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Tim updated successfully!");
        window.location.href = "/dashboard/DataMaster/Tim";
      } else {
        alert("Failed to update tim: " + result.message);
      }
    } catch (error) {
      console.error("Error updating tim:", error);
    }
  };

  return (
    <DashboardLayout>
      <main className="flex flex-col gap-y-5">
        <h1 className="text-2xl font-bold text-[#211C84]">Edit Tim</h1>
        <form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
          <select
            name="user_id"
            value={tim.user_id}
            onChange={handleChange}
            className="border border-[#211C84] rounded-lg p-3"
            required
          >
            <option value="">Pilih User</option>
            {dataUser.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.username} ({user.role})
              </option>
            ))}
          </select>
          <section className="w-full flex gap-x-3">
            <Link
              href="/dashboard/DataMaster/Tim"
              className="bg-[#211C84] p-3 text-white rounded-lg w-1/2 text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="bg-[#211C84] p-3 text-white rounded-lg w-1/2"
            >
              Submit
            </button>
          </section>
        </form>
      </main>
    </DashboardLayout>
  );
};

export default UbahDataTim;
