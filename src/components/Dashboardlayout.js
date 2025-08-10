"use client";
import { useEffect, useState } from "react";
import Alert from "./alert";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", icon: "fa-gauge", label: "Beranda" },
  {
    href: "#",
    icon: "fa-database",
    icon2: "fa-chevron-down",
    label: "Data Master",
    hasDropdown: true,
  },
  {
    href: "/dashboard/Penugasan",
    icon: "fa-filter",
    label: "Penugasan Tim",
    role: "Project Officer",
  },
  {
    href: "/visualization",
    icon: "fa-chart-line",
    label: "Visualization",
    role: "user",
  },
  { href: "/kmeans", icon: "fa-chart-line", label: "Kmeans", role: "user" },
  {
    href: "/dashboard/TugasSaya",
    icon: "fa-chart-line",
    label: "Tugas Saya",
    role: "Tim A Padaleunyi",
  },
  {
    href: "/dashboard/TugasSaya",
    icon: "fa-chart-line",
    label: "Tugas Saya",
    role: "Tim B Padaleunyi",
  },
  {
    href: "/dashboard/TugasSaya",
    icon: "fa-chart-line",
    label: "Tugas Saya",
    role: "Tim A Cipularang",
  },
  {
    href: "/dashboard/TugasSaya",
    icon: "fa-chart-line",
    label: "Tugas Saya",
    role: "Tim B Cipularang",
  },
  {
    href: "/dashboard/TugasSaya",
    icon: "fa-chart-line",
    label: "Tugas Saya",
    role: "Tim Siaga",
  },
  {
    href: "/dashboard/Pelaporan",
    icon: "fa-chart-line",
    label: "Pelaporan",
    role: "Admin",
  },
  {
    href: "/dashboard/RiwayatPerbaikan",
    icon: "fa-chart-line",
    label: "Riwayat Perbaikan",
    role: "Admin",
  },
  {
    href: "/dashboard/RiwayatPerbaikan",
    icon: "fa-chart-line",
    label: "Riwayat Perbaikan",
    role: "Direktur",
  },
  {
    href: "/dashboard/Penugasan/TampilPenugasan",
    icon: "fa-chart-line",
    label: "Penugasan Tim",
    role: "Direktur",
  },
];

const subNavItems = [
  { href: "/dashboard/DataMaster/Users", label: "Users", role: "Admin" },
  { href: "/dashboard/DataMaster/Tim", label: "Tim", role: "Admin" },
  { href: "/dashboard/DataMaster/Tim", label: "Tim", role: "Direktur" },
  { href: "/dashboard/DataMaster/JalurTol", label: "Jalur Tol", role: "Admin" },
  {
    href: "/dashboard/DataMaster/JalurTol",
    label: "Jalur Tol",
    role: "Direktur",
  },
  {
    href: "/dashboard/DataMaster/Kerusakan",
    label: "Kerusakan",
  },
  {
    href: "/dashboard/DataMaster/ListKeahlian",
    label: "List Keahlian",
    role: "Project Officer",
  },
];

const DashboardLayout = ({ title, children }) => {
  const [alertShow, setAlertShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [userRole, setUserRole] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("users");
    if (userData) {
      try {
        const parsedUser = userData.replace(/"/g, "");
        setUserRole(parsedUser || "");
      } catch (error) {
        console.error("Invalid user data in localStorage");
      }
    }
  }, []);

  const handleButton = () => {
    setShowButton(!showButton);
  };

  const handleLogoutButton = () => {
    setShowLogout(!showLogout);
  };

  const toggleDropdown = (label) => {
    setActiveMenu(activeMenu === label ? null : label);
  };

  const handleLogout = () => {
    setAlertMessage("Logout Berhasil");
    setAlertShow(true);
    localStorage.removeItem("users");

    setTimeout(() => {
      setAlertShow(false);
      window.location.href = "/";
    }, 2000);
  };

  return (
    <main className="bg-gray-200 flex w-full overflow-hidden lg:p-3">
      {/* Sidebar dekstop */}
      <aside className="text-white bg-[#211C84] hidden lg:flex lg:flex-col lg:w-1/6 lg:h-[922px] lg:fixed rounded-xl lg:justify-between">
        <section className="flex flex-col gap-y-10 overflow-y-auto">
          {/* Logo */}
          <div className="flex flex-col items-center mt-10">
            <div className="bg-[#7A73D1] rounded-full flex justify-center items-center w-20 h-20">
              <img
                src="/images/logo.png"
                alt="logo"
                className="rounded-full w-20 h-20"
              />
            </div>
            <h1 className="text-2xl font-bold mt-3">
              PT.Inticore Nusa Persada
            </h1>
            <hr className="bg-white w-72 h-1 rounded-full mt-10" />
          </div>

          {/* Navigation */}
          <nav>
            <ul className="flex flex-col gap-y-4">
              {navItems
                .filter((item) => !item.role || item.role === userRole)
                .map(({ href, icon, icon2, label, hasDropdown }) => (
                  <li key={label}>
                    <div
                      onClick={() =>
                        hasDropdown ? toggleDropdown(label) : null
                      }
                      className="flex items-center gap-x-4 px-6 text-white cursor-pointer"
                    >
                      <Link
                        href={href}
                        className="flex justify-between items-center w-full"
                      >
                        <section className="flex gap-x-3">
                          <i className={`fa-solid ${icon} text-2xl`}></i>
                          <span>{label}</span>
                        </section>
                        {hasDropdown && (
                          <i
                            className={`fa-solid ${
                              activeMenu === label
                                ? "fa-chevron-up"
                                : "fa-chevron-down"
                            } text-xs`}
                          ></i>
                        )}
                      </Link>
                    </div>

                    {hasDropdown && activeMenu === label && (
                      <ul className="pl-12 mt-2 flex flex-col gap-y-3 bg-[#4D55CC] p-3">
                        {subNavItems
                          .filter((sub) => !sub.role || sub.role === userRole)
                          .map((sub) => (
                            <li key={sub.href}>
                              <Link
                                href={sub.href}
                                className="flex items-center gap-x-2 text-white"
                              >
                                <span>{sub.label}</span>
                              </Link>
                            </li>
                          ))}
                      </ul>
                    )}
                  </li>
                ))}
            </ul>
          </nav>
        </section>

        {/* User & Logout */}
        <div className="flex flex-col items-center bg-[#4D55CC] py-8 gap-y-6">
          <div className="flex items-center gap-x-3 cursor-pointer">
            <div className="border-2 border-white rounded-full w-12 h-12 flex justify-center items-center">
              <i className="fas fa-user text-white text-2xl"></i>
            </div>
            <h1 className="text-xl font-bold text-white capitalize">
              {userRole}
            </h1>
          </div>

          <div
            onClick={handleLogout}
            className="flex items-center gap-x-3 cursor-pointer"
          >
            <i className="fa-solid fa-right-from-bracket text-white text-2xl"></i>
            <h1 className="text-xl font-bold text-white">Logout</h1>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-[17.5%] w-full lg:w-5/6 h-full flex flex-col rounded-t-xl">
        <header className="bg-[#4D55CC] p-4 lg:hidden flex justify-center items-center gap-x-3">
          <img
            src="/images/logo.png"
            alt="logo"
            className="rounded-full w-10 h-10"
          />
          <h1 className="text-xl md:text-2xl text-white font-bold">
            Dashboard Optimalisasi Penugasan Tim
          </h1>
        </header>
        <header className="flex justify-between items-center shadow p-4 bg-[#211C84] xl:rounded-t-xl">
          <section className="lg:hidden">
            {showButton ? (
              <i
                className="fa-solid fa-xmark text-2xl text-white cursor-pointer"
                onClick={handleButton}
              ></i>
            ) : (
              <i
                className="fa-solid fa-bars text-2xl text-white cursor-pointer"
                onClick={handleButton}
              ></i>
            )}
          </section>
          <h1 className="text-xl md:text-2xl text-white font-bold hidden lg:block">
            Dashboard Optimalisasi Penugasan Tim
          </h1>

          {/* mobile */}
          <button
            className={`border-2 border-white rounded-full w-12 h-12 flex justify-center items-center lg:hidden`}
            onClick={handleLogoutButton}
          >
            <i className="fas fa-user text-white text-2xl"></i>
          </button>

          {showLogout && (
            <div className="flex flex-col items-center lg:hidden absolute top-44 right-3 w-2/3 border border-white">
              <section className="flex flex-col items-center gap-y-1 bg-[#211C84] w-full p-3">
                <div className="flex items-center gap-x-3 cursor-pointer w-20 h-20 bg-gray-400 rounded-full justify-center">
                  <i className="fas fa-user text-white text-2xl"></i>
                </div>
                <h1 className="text-xl font-bold text-white capitalize">
                  {userRole}
                </h1>
              </section>

              <section className="w-full bg-gray-200 p-3 flex justify-end">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-x-3 cursor-pointer border border-black p-3 rounded-lg"
                >
                  <i className="fa-solid fa-right-from-bracket text-black text-2xl"></i>
                  <h1 className="text-xl text-black">Logout</h1>
                </button>
              </section>
            </div>
          )}
        </header>

        <section className="flex border-t border-[#4D55CC]">
          {/* Sidebar Mobile */}
          {showButton && (
            <aside className="text-white bg-[#211C84] lg:hidden flex flex-col w-1/2 h-screen items-center">
              <section className="flex flex-col gap-y-10">
                {/* Logo */}
                <div className="flex flex-col items-center mt-10">
                  <div className="bg-[#7A73D1] rounded-full flex justify-center items-center w-20 h-20">
                    <img
                      src="/images/logo.png"
                      alt="logo"
                      className="rounded-full w-20 h-20"
                    />
                  </div>
                  <h1 className="text-xl font-bold mt-3">
                    PT.Inticore Nusa Persada
                  </h1>
                  <hr className="bg-white w-72 h-1 rounded-full mt-10" />
                </div>

                {/* Navigation */}
                <nav>
                  <ul className="flex flex-col gap-y-4 p-3">
                    {navItems
                      .filter((item) => !item.role || item.role === userRole)
                      .map(({ href, icon, icon2, label, hasDropdown }) => (
                        <li key={label}>
                          <div
                            onClick={() =>
                              hasDropdown ? toggleDropdown(label) : null
                            }
                            className="flex items-center gap-x-4 px-6 text-white cursor-pointer"
                          >
                            <Link
                              href={href}
                              className="flex justify-between items-center w-full"
                            >
                              <section className="flex gap-x-3">
                                <i className={`fa-solid ${icon} text-2xl`}></i>
                                <span>{label}</span>
                              </section>
                              {hasDropdown && (
                                <i
                                  className={`fa-solid ${
                                    activeMenu === label
                                      ? "fa-chevron-up"
                                      : "fa-chevron-down"
                                  } text-xs`}
                                ></i>
                              )}
                            </Link>
                          </div>

                          {hasDropdown && activeMenu === label && (
                            <ul className="pl-12 mt-2 flex flex-col gap-y-3 bg-[#4D55CC] p-3">
                              {subNavItems
                                .filter(
                                  (sub) => !sub.role || sub.role === userRole
                                )
                                .map((sub) => (
                                  <li key={sub.href}>
                                    <Link
                                      href={sub.href}
                                      className="flex items-center gap-x-2 text-white"
                                    >
                                      <span>{sub.label}</span>
                                    </Link>
                                  </li>
                                ))}
                            </ul>
                          )}
                        </li>
                      ))}
                  </ul>
                </nav>
              </section>
            </aside>
          )}

          <section className="p-4 bg-white w-full lg:hidden">
            {children}
          </section>
        </section>

        <section className="p-4 bg-white w-full overflow-y-auto flex-1 hidden lg:block">
          {children}
        </section>
      </div>

      {/* Alert */}
      {alertShow && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/30">
          <Alert message={alertMessage} />
        </div>
      )}
    </main>
  );
};

export default DashboardLayout;
