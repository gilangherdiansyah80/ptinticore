"use client";
import DashboardLayout from "../../components/Dashboardlayout";
import { useState, useEffect } from "react";
export const dynamic = "force-dynamic";

const Home = () => {
  const [dataTim, setDataTim] = useState([]);
  const [dataKerusakan, setDataKerusakan] = useState([]);
  const [dataPenugasan, setDataPenugasan] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/tim")
      .then((response) => response.json())
      .then((data) => setDataTim(data.payload.datas));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/api/kerusakan")
      .then((response) => response.json())
      .then((data) => setDataKerusakan(data.payload.datas));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/api/penugasan")
      .then((response) => response.json())
      .then((data) => setDataPenugasan(data.payload.datas));
  }, []);

  return (
    <DashboardLayout>
      <main className="flex flex-col gap-y-3">
        <ul className="flex flex-col gap-y-3 lg:flex-row lg:gap-x-3 w-full">
          <li className="bg-[#211C84] p-3 rounded-lg text-white w-full lg:w-1/2 flex gap-y-3 items-center justify-between">
            <i className="fa-solid fa-users text-4xl"></i>
            <section className="flex flex-col gap-y-1 items-center">
              <h1>Total Tim</h1>
              <h2>{dataTim.length}</h2>
            </section>
          </li>
          <li className="bg-[#211C84] p-3 rounded-lg text-white w-full lg:w-1/2 flex gap-y-3 items-center justify-between">
            <i className="fa-solid fa-bug text-4xl"></i>
            <section className="flex flex-col gap-y-1 items-center">
              <h1>Total Kerusakan</h1>
              <h2>{dataKerusakan.length}</h2>
            </section>
          </li>
          <li className="bg-[#211C84] p-3 rounded-lg text-white w-full lg:w-1/2 flex gap-y-3 items-center justify-between">
            <i className="fa-solid fa-bug text-4xl"></i>
            <section className="flex flex-col gap-y-1 items-center">
              <h1>Total Kerusakan</h1>
              <h2>{dataPenugasan.length}</h2>
            </section>
          </li>
        </ul>

        <section className="flex flex-col gap-y-3 items-center justify-center border border-[#211C84] rounded-xl p-3">
          <img
            src="/images/logo.png"
            alt="PT.Inticore Nusa Persada"
            className="w-48 lg:w-96"
          />
          <h1 className="text-2xl text-center">
            Selamat Datang Di Dashboard PT.Inticore Nusa Persada
          </h1>
        </section>
      </main>
    </DashboardLayout>
  );
};

export default Home;
