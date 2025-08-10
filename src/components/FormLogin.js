"use client";
import { useState, useEffect } from "react";
import Alert from "./alert";

const FormLogin = () => {
  const [dataForm, setDataForm] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    setDataForm({
      ...dataForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!dataForm.username.trim()) {
      setAlertMessage("Username harus diisi");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    } else if (!dataForm.password.trim()) {
      setAlertMessage("Password harus diisi");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    } else if (!dataForm.username.trim() && !dataForm.password.trim()) {
      setAlertMessage("Username dan Password harus diisi");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataForm),
      });

      const data = await response.json();

      if (data.payload?.datas) {
        localStorage.setItem("users", data.payload.datas.user.role);
        setAlertMessage("Login Berhasil");
        setShowAlert(true);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } else {
        setAlertMessage(
          "Login Gagal: " + (data.message || "Periksa username/password")
        );
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000);
      }
    } catch (error) {
      setAlertMessage("Terjadi kesalahan saat login");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleShowPassword = () => {
    const passwordInput = document.getElementById("password");
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
  };

  return (
    <main className="relative w-full h-screen flex items-center justify-center bg-gray-50">
      {showAlert && <Alert message={alertMessage} />}

      <section
        className={`flex flex-col gap-y-3 p-3 lg:w-1/2 transition-all duration-300 ${
          showAlert ? "blur-sm pointer-events-none" : ""
        }`}
      >
        <img
          src="/images/logo.png"
          alt="PT.Inticore Nusa Persada"
          className="w-52 self-center"
        />
        <h1 className="text-center text-2xl">
          Selamat datang di sistem penugasan tim PT.Inticore Nusa Persada
        </h1>
        <form
          className="flex flex-col gap-y-3 border border-gray-400 p-3 rounded-xl w-full bg-white shadow-lg"
          onSubmit={handleLogin}
        >
          <section className="flex flex-col gap-y-3">
            <label>Username</label>
            <input
              type="text"
              placeholder="Input Username"
              id="username"
              name="username"
              value={dataForm.username}
              onChange={handleChange}
              className="p-3 rounded-xl border border-gray-400"
            />
          </section>

          <section className="flex flex-col gap-y-3">
            <label>Password</label>
            <div className="w-full relative">
              <input
                type="password"
                placeholder="*****"
                id="password"
                name="password"
                value={dataForm.password}
                onChange={handleChange}
                className="p-3 rounded-xl border border-gray-400 w-full"
              />
              <i
                className="fa-solid fa-eye absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={handleShowPassword}
              ></i>
            </div>
          </section>

          <button
            type="submit"
            className="p-3 bg-[#211C84] text-white rounded-xl cursor-pointer"
            disabled={loading}
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default FormLogin;
