"use client";
import DashboardLayout from "../../components/Dashboardlayout";
import { useState, useEffect } from "react";
import Alert from "../../components/alert";
// import { s } from "framer-motion/client";

const PenugasanTimPage = () => {
  const [dataKerusakan, setDataKerusakan] = useState([]);
  const [dataTim, setDataTim] = useState([]);
  const [penugasan, setPenugasan] = useState(null);
  const [listKeahlian, setListKeahlian] = useState([]);
  const [selectedKerusakan, setSelectedKerusakan] = useState([]);
  const [selectedTim, setSelectedTim] = useState([]);
  const [timPositions, setTimPositions] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Fungsi untuk mendapatkan tanggal hari ini dalam format yang konsisten
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fungsi untuk memformat tanggal dari database ke format yang sama
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchDataKerusakan = async () => {
    try {
      const response = await fetch("https://ptinticore.online/api/kerusakan");
      const data = await response.json();

      console.log("Raw kerusakan data:", data);
      console.log("Kerusakan payload:", data.payload?.datas);

      // Filter data kerusakan untuk hari ini saja
      const todayDate = getTodayDate();
      const filteredData = data.payload.datas.filter((item) => {
        const itemDate = formatDate(item.tanggal_kerusakan);
        console.log("Comparing dates:", itemDate, "vs", todayDate);
        return itemDate === todayDate;
      });

      console.log("Filtered kerusakan data:", filteredData);
      setDataKerusakan(filteredData);
    } catch (error) {
      console.error("Error fetching kerusakan data:", error);
      setDataKerusakan([]);
    }
  };

  const fetchDataTim = async () => {
    try {
      const response = await fetch("https://ptinticore.online/api/tim");
      const data = await response.json();

      console.log("Raw tim data:", data);
      console.log("Tim payload:", data.payload?.datas);

      setDataTim(data.payload.datas);
    } catch (error) {
      console.error("Error fetching tim data:", error);
      setDataTim([]);
    }
  };

  const fetchListKeahlian = async () => {
    try {
      const response = await fetch(
        "https://ptinticore.online/api/list_keahlian/allData"
      );
      const data = await response.json();

      console.log("Raw keahlian data:", data);
      console.log("Keahlian payload:", data.payload?.datas);

      if (response.ok) {
        setListKeahlian(data.payload.datas);
      } else {
        console.error("Failed to fetch keahlian:", data.message);
      }
    } catch (error) {
      console.error("Error fetching keahlian:", error);
    }
  };

  useEffect(() => {
    fetchDataKerusakan();
    fetchDataTim();
    fetchListKeahlian();
  }, []);

  // Fungsi untuk menangani checkbox kerusakan
  const handleKerusakanChange = (kerusakan) => {
    const newSelected = [...selectedKerusakan];
    const index = newSelected.findIndex(
      (k) => k.kerusakan_id === kerusakan.kerusakan_id
    );

    if (index > -1) {
      newSelected.splice(index, 1);
    } else {
      // Cek apakah kerusakan baru memiliki jalur tol dan ruas yang sama dengan yang sudah dipilih
      if (newSelected.length > 0) {
        const firstSelected = newSelected[0];
        if (
          firstSelected.nama_tol !== kerusakan.nama_tol ||
          firstSelected.ruas_tol !== kerusakan.ruas_tol
        ) {
          alert(
            `Kerusakan harus berada di jalur tol dan ruas yang sama: ${firstSelected.nama_tol} (${firstSelected.ruas_tol})`
          );
          return;
        }
      }
      newSelected.push(kerusakan);
    }

    setSelectedKerusakan(newSelected);
  };

  // Fungsi untuk menangani checkbox tim
  const handleTimChange = (tim) => {
    const newSelected = [...selectedTim];
    const index = newSelected.findIndex((t) => t.tim_id === tim.tim_id);

    if (index > -1) {
      newSelected.splice(index, 1);
      // Hapus posisi tim yang di-uncheck
      const newPositions = { ...timPositions };
      delete newPositions[tim.tim_id];
      setTimPositions(newPositions);
    } else {
      newSelected.push(tim);
    }

    setSelectedTim(newSelected);
  };

  // Fungsi untuk mengatur posisi tim
  const handleTimPositionChange = (timId, position) => {
    setTimPositions((prev) => ({
      ...prev,
      [timId]: position,
    }));
  };

  // Fungsi untuk menghitung waktu tempuh berdasarkan jarak (sesuai dokumen MILP)
  const hitungWaktuTempuh = (lokasiKerusakan, lokasiTim, kecepatan = 60) => {
    const jarak = Math.abs(Number(lokasiKerusakan) - Number(lokasiTim));
    // Rumus: r_(i,j) = (jarak / kecepatan) × 60 menit
    return (jarak / kecepatan) * 60;
  };

  // Fungsi untuk mendapatkan keahlian tim berdasarkan jenis kerusakan
  const getKeahlianTim = (roleNama, jenisKerusakan) => {
    console.log("Getting keahlian for:", roleNama, "vs", jenisKerusakan);
    console.log("Available keahlian data:", listKeahlian);

    // Cari kecocokan berdasarkan jenis kerusakan
    const keahlianItem = listKeahlian.find(
      (item) =>
        item.jenis_kerusakan.toLowerCase() === jenisKerusakan.toLowerCase() ||
        jenisKerusakan
          .toLowerCase()
          .includes(item.jenis_kerusakan.toLowerCase()) ||
        item.jenis_kerusakan
          .toLowerCase()
          .includes(jenisKerusakan.toLowerCase())
    );

    if (!keahlianItem) {
      console.log("Keahlian item not found for:", jenisKerusakan);
      return 3; // Default value
    }

    console.log("Found keahlian item:", keahlianItem);

    // Mapping nama tim ke field yang sesuai di database
    const timMapping = {
      "Tim A Padaleunyi": "tim_a_padeleunyi",
      "Tim B Padaleunyi": "tim_b_padaleunyi",
      "Tim A Cipularang": "tim_a_cipularang",
      "Tim B Cipularang": "tim_b_cipularang",
      "Tim Siaga": "tim_siaga",
    };

    // Cari field yang sesuai berdasarkan nama tim
    let fieldName = null;
    for (const [key, field] of Object.entries(timMapping)) {
      if (
        roleNama.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(roleNama.toLowerCase())
      ) {
        fieldName = field;
        break;
      }
    }

    // Jika tidak ada mapping yang cocok, coba mapping alternatif berdasarkan kata kunci
    if (!fieldName) {
      const lowerRoleNama = roleNama.toLowerCase();
      if (
        lowerRoleNama.includes("tim a") &&
        lowerRoleNama.includes("padaleunyi")
      ) {
        fieldName = "tim_a_padeleunyi";
      } else if (
        lowerRoleNama.includes("tim b") &&
        lowerRoleNama.includes("padaleunyi")
      ) {
        fieldName = "tim_b_padaleunyi";
      } else if (
        lowerRoleNama.includes("tim a") &&
        lowerRoleNama.includes("cipularang")
      ) {
        fieldName = "tim_a_cipularang";
      } else if (
        lowerRoleNama.includes("tim b") &&
        lowerRoleNama.includes("cipularang")
      ) {
        fieldName = "tim_b_cipularang";
      } else if (lowerRoleNama.includes("siaga")) {
        fieldName = "tim_siaga";
      }
    }

    console.log("Field name mapping:", fieldName);

    if (fieldName && keahlianItem[fieldName] !== undefined) {
      console.log("Returning keahlian value:", keahlianItem[fieldName]);
      return keahlianItem[fieldName];
    }

    console.log("Using default keahlian value: 3");
    return 3; // Default keahlian jika tidak ditemukan
  };

  // Fungsi untuk menghitung bobot kriteria (sesuai dokumen MILP)
  const hitungBobotKriteria = (waktuTempuhData, keahlianData, urgensiData) => {
    // Hitung rata-rata masing-masing kriteria
    const rataRataWaktu =
      waktuTempuhData.reduce((sum, val) => sum + val, 0) /
      waktuTempuhData.length;

    // Untuk keahlian, gunakan (5 - keahlian) seperti dalam dokumen
    const keahlianTerbalik = keahlianData.map((val) => 5 - val);
    const rataRataKeahlian =
      keahlianTerbalik.reduce((sum, val) => sum + val, 0) /
      keahlianTerbalik.length;

    const rataRataUrgensi =
      urgensiData.reduce((sum, val) => sum + val, 0) / urgensiData.length;

    // Hitung total
    const total = rataRataWaktu + rataRataKeahlian + rataRataUrgensi;

    // Hitung bobot masing-masing kriteria
    const w_r = rataRataWaktu / total; // Bobot waktu tanggap
    const w_s = rataRataKeahlian / total; // Bobot keahlian
    const w_u = rataRataUrgensi / total; // Bobot urgensi

    return { w_r, w_s, w_u, rataRataWaktu, rataRataKeahlian, rataRataUrgensi };
  };

  // Fungsi untuk generate semua kemungkinan penugasan
  const generateAllAssignments = (kerusakanList, timList) => {
    const assignments = [];
    const n = kerusakanList.length;
    const m = timList.length;

    // Generate semua kemungkinan kombinasi penugasan
    function generatePermutations(kerusakanIndex, currentAssignment) {
      if (kerusakanIndex === n) {
        assignments.push([...currentAssignment]);
        return;
      }

      for (let timIndex = 0; timIndex < m; timIndex++) {
        currentAssignment[kerusakanIndex] = timIndex;
        generatePermutations(kerusakanIndex + 1, currentAssignment);
      }
    }

    generatePermutations(0, new Array(n));
    return assignments;
  };

  const hitungPenugasan = () => {
    // Validasi input
    if (selectedKerusakan.length === 0) {
      setAlertMessage("Pilih minimal satu kerusakan!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }

    if (selectedTim.length === 0) {
      setAlertMessage("Pilih minimal satu tim!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }

    // Validasi posisi tim
    for (const tim of selectedTim) {
      if (!timPositions[tim.tim_id]) {
        setAlertMessage(`Masukkan posisi untuk ${tim.role}!`);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000);
        return;
      }
    }

    console.log("Selected kerusakan:", selectedKerusakan);
    console.log("Selected tim:", selectedTim);
    console.log("Tim positions:", timPositions);

    // Hitung semua nilai Z untuk setiap kombinasi tim-kerusakan
    const waktuTempuhData = [];
    const keahlianData = [];
    const urgensiData = selectedKerusakan.map((k) =>
      Number(k.tingkat_kerusakan)
    );

    const nilaiZ = {};

    selectedTim.forEach((tim, timIndex) => {
      selectedKerusakan.forEach((kerusakan, kerusakanIndex) => {
        const waktuTempuh = hitungWaktuTempuh(
          kerusakan.titik_lokasi,
          timPositions[tim.tim_id]
        );
        const keahlian = getKeahlianTim(tim.role, kerusakan.jenis_kerusakan);

        waktuTempuhData.push(waktuTempuh);
        keahlianData.push(keahlian);

        nilaiZ[`${timIndex}_${kerusakanIndex}`] = {
          waktuTempuh,
          keahlian,
          urgensi: Number(kerusakan.tingkat_kerusakan),
        };
      });
    });

    // Hitung bobot kriteria
    const bobotKriteria = hitungBobotKriteria(
      waktuTempuhData,
      keahlianData,
      urgensiData
    );
    const { w_r, w_s, w_u } = bobotKriteria;
    const s_max = 5;

    // Generate semua kemungkinan penugasan
    const allAssignments = generateAllAssignments(
      selectedKerusakan,
      selectedTim
    );

    const iterasi = allAssignments.map((assignment, index) => {
      let totalZ = 0;
      let detailPenugasan = [];
      let variabelKeputusan = {};

      // Initialize all decision variables to 0
      selectedTim.forEach((tim, timIndex) => {
        selectedKerusakan.forEach((kerusakan, kerusakanIndex) => {
          variabelKeputusan[`x_${timIndex}_${kerusakanIndex}`] = 0;
        });
      });

      assignment.forEach((timIndex, kerusakanIndex) => {
        const tim = selectedTim[timIndex];
        const kerusakan = selectedKerusakan[kerusakanIndex];
        const data = nilaiZ[`${timIndex}_${kerusakanIndex}`];

        // Set decision variable to 1 for this assignment
        variabelKeputusan[`x_${timIndex}_${kerusakanIndex}`] = 1;

        // Hitung Z untuk penugasan ini
        const z =
          w_r * data.waktuTempuh +
          w_s * (s_max - data.keahlian) +
          w_u * data.urgensi;
        totalZ += z;

        detailPenugasan.push({
          tim: tim.role,
          kerusakan: kerusakan.no_LHLKLP,
          jenis_kerusakan: kerusakan.jenis_kerusakan,
          waktuTempuh: data.waktuTempuh,
          keahlian: data.keahlian,
          urgensi: data.urgensi,
          nilaiZ: z,
        });
      });

      return {
        iterasi: index + 1,
        penugasan: detailPenugasan
          .map((d) => `${d.tim} menangani ${d.kerusakan}`)
          .join(" dan "),
        totalZ: totalZ,
        detailPenugasan: detailPenugasan,
        variabelKeputusan: variabelKeputusan,
        detailPerhitungan: detailPenugasan
          .map((d) => `${d.nilaiZ.toFixed(1)}`)
          .join(" + "),
      };
    });

    // Cari solusi optimal (nilai Z terkecil)
    const solusiOptimal = iterasi.reduce((min, current) =>
      current.totalZ < min.totalZ ? current : min
    );

    setPenugasan({
      iterasi: iterasi,
      solusiOptimal: solusiOptimal,
      metodologi: {
        bobot: { w_r, w_s, w_u },
        bobot_detail: bobotKriteria,
        nilaiZ: nilaiZ,
      },
      selectedKerusakan: selectedKerusakan,
      selectedTim: selectedTim,
      timPositions: timPositions,
    });
  };

  const handleReset = () => {
    setSelectedKerusakan([]);
    setSelectedTim([]);
    setTimPositions({});
    setPenugasan(null);
  };

  const handleSimpanPenugasan = async () => {
    if (!penugasan || !penugasan.solusiOptimal) {
      alert("Belum ada hasil penugasan yang dihitung.");
      return;
    }

    try {
      const dataToSave = penugasan.solusiOptimal.detailPenugasan.map(
        (detail) => {
          const tim = selectedTim.find((t) => t.role === detail.tim);
          const kerusakan = selectedKerusakan.find(
            (k) => k.no_LHLKLP === detail.kerusakan
          );

          return {
            tim_id: tim?.tim_id,
            kerusakan_id: kerusakan?.kerusakan_id,
          };
        }
      );

      console.log("Data yang akan dikirim:", dataToSave);

      const response = await fetch(
        "https://ptinticore.online/api/penugasan/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSave),
        }
      );

      if (response.ok) {
        setAlertMessage("Penugasan berhasil dibuat");
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
        }, 1000);

        handleReset();
      } else {
        alert("Gagal menyimpan penugasan.");
      }
    } catch (error) {
      console.error("Error saat menyimpan penugasan:", error);
      alert("Terjadi kesalahan saat menyimpan penugasan.");
    }
  };

  return (
    <DashboardLayout>
      {showAlert ? (
        <Alert message={alertMessage} />
      ) : (
        <main className="flex flex-col gap-y-5 w-full">
          {/* Header */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
            <h1 className="text-2xl font-bold mb-2">
              🎯 Sistem Penugasan Tim Optimal
            </h1>
            <p className="text-blue-100">
              Menggunakan metode Mixed-Integer Linear Programming (MILP) untuk
              optimalisasi penugasan tim
            </p>
          </section>

          {/* Tabel Kerusakan dan Tim */}
          <section className="flex flex-col gap-y-3 lg:flex-row lg:justify-between lg:gap-x-3 w-full">
            <div className="w-full">
              <h1 className="text-xl font-bold mb-2 flex items-center gap-2">
                📋 List Kerusakan Hari Ini
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {dataKerusakan.length} kerusakan
                </span>
                {selectedKerusakan.length > 0 && (
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {selectedKerusakan.length} dipilih
                  </span>
                )}
              </h1>
              {dataKerusakan.length > 0 ? (
                <div className="overflow-x-auto w-full">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-xl shadow-sm">
                    <thead className="bg-[#211C84] text-white">
                      <tr>
                        <th className="px-6 py-3 text-center text-sm font-semibold">
                          Pilih
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">
                          No
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">
                          No. LH/LK/LP
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">
                          Tingkat Urgensi
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">
                          Titik Lokasi
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">
                          Permasalahan
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">
                          Jalur Tol
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dataKerusakan.map((item, index) => (
                        <tr
                          key={item.kerusakan_id || item.user_id}
                          className={`hover:bg-gray-50 ${
                            selectedKerusakan.some(
                              (k) => k.kerusakan_id === item.kerusakan_id
                            )
                              ? "bg-blue-50 border-l-4 border-blue-500"
                              : ""
                          }`}
                        >
                          <td className="px-6 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={selectedKerusakan.some(
                                (k) => k.kerusakan_id === item.kerusakan_id
                              )}
                              onChange={() => handleKerusakanChange(item)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 text-gray-700 text-center">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 text-gray-700 text-center font-medium">
                            {item.no_LHLKLP}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.tingkat_kerusakan >= 4
                                  ? "bg-red-100 text-red-800"
                                  : item.tingkat_kerusakan >= 3
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              Level {item.tingkat_kerusakan}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-700 text-center">
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              KM {item.titik_lokasi}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-700 text-center">
                            {item.jenis_kerusakan}
                          </td>
                          <td className="px-6 py-4 text-gray-700 text-center">
                            {item.nama_tol} ({item.ruas_tol})
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-xl h-64 flex justify-center items-center p-8">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">📋</div>
                    <p className="text-lg font-medium">
                      Tidak ada kerusakan hari ini
                    </p>
                    <p className="text-sm">Tanggal: {getTodayDate()}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full lg:w-1/2">
              <h1 className="text-xl font-bold mb-2 flex items-center gap-2">
                👥 Data Tim
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {dataTim.length} tim
                </span>
                {selectedTim.length > 0 && (
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {selectedTim.length} dipilih
                  </span>
                )}
              </h1>
              <div className="overflow-x-auto w-full">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-xl shadow-sm">
                  <thead className="bg-[#211C84] text-white">
                    <tr>
                      <th className="px-6 py-3 text-center text-sm font-semibold">
                        Pilih
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold">
                        No
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold">
                        Nama Tim
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold">
                        Posisi (KM)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dataTim.map((item, index) => (
                      <tr
                        key={item.tim_id}
                        className={`hover:bg-gray-50 ${
                          selectedTim.some((t) => t.tim_id === item.tim_id)
                            ? "bg-green-50 border-l-4 border-green-500"
                            : ""
                        }`}
                      >
                        <td className="px-6 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedTim.some(
                              (t) => t.tim_id === item.tim_id
                            )}
                            onChange={() => handleTimChange(item)}
                            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                          />
                        </td>
                        <td className="px-6 py-4 text-gray-700 text-center">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-gray-700 text-center font-medium">
                          {item.role}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === "Tersedia"
                                ? "bg-green-100 text-green-800"
                                : item.status === "Sibuk"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {selectedTim.some((t) => t.tim_id === item.tim_id) ? (
                            <input
                              type="number"
                              placeholder="45"
                              value={timPositions[item.tim_id] || ""}
                              onChange={(e) =>
                                handleTimPositionChange(
                                  item.tim_id,
                                  e.target.value
                                )
                              }
                              className="w-16 p-1 border border-gray-300 rounded text-center text-sm"
                            />
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Kontrol Penugasan */}
          <section className="mt-3 bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">
                  🧮 Perhitungan Penugasan Tim
                </h2>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  MILP Method
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  📋 Kerusakan Dipilih
                </h3>
                {selectedKerusakan.length > 0 ? (
                  <ul className="text-sm text-blue-700">
                    {selectedKerusakan.map((k, idx) => (
                      <li key={k.kerusakan_id}>
                        {idx + 1}. {k.no_LHLKLP} (KM {k.titik_lokasi})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-blue-600">
                    Belum ada yang dipilih
                  </p>
                )}
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">
                  👥 Tim Dipilih
                </h3>
                {selectedTim.length > 0 ? (
                  <ul className="text-sm text-green-700">
                    {selectedTim.map((t, idx) => (
                      <li key={t.tim_id}>
                        {idx + 1}. {t.role}
                        {timPositions[t.tim_id] && (
                          <span className="ml-2 bg-green-200 px-1 rounded">
                            KM {timPositions[t.tim_id]}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-green-600">
                    Belum ada yang dipilih
                  </p>
                )}
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  ℹ️ Info Penugasan
                </h3>
                <div className="text-sm text-yellow-700">
                  <p>Kerusakan: {selectedKerusakan.length}</p>
                  <p>Tim: {selectedTim.length}</p>
                  {selectedKerusakan.length > 0 && (
                    <p className="mt-1">
                      Jalur: {selectedKerusakan[0].nama_tol} (
                      {selectedKerusakan[0].ruas_tol})
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={hitungPenugasan}
                  disabled={
                    selectedKerusakan.length === 0 || selectedTim.length === 0
                  }
                  className={`px-4 py-2 rounded-lg cursor-pointer w-1/2 ${
                    selectedKerusakan.length === 0 || selectedTim.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  Hitung Penugasan
                </button>
                <button
                  onClick={handleReset}
                  className="bg-red-500 hover:bg-red-600 w-1/2 text-white px-4 py-2 rounded-lg cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          </section>

          {/* Hasil Penugasan */}
          {penugasan && (
            <section className="mt-8 bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                📊 Hasil Perhitungan MILP
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {penugasan.iterasi.length} Iterasi
                </span>
              </h2>

              {/* Tabel Iterasi Penyelesaian Model */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  🔄 Tabel Iterasi Penyelesaian Model
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300 rounded-lg">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="px-4 py-3 text-center font-semibold border-r border-blue-500">
                          Iterasi
                        </th>
                        <th className="px-4 py-3 text-center font-semibold border-r border-blue-500">
                          Solusi
                        </th>
                        {selectedTim.map((tim, timIndex) =>
                          selectedKerusakan.map((kerusakan, kerusakanIndex) => (
                            <th
                              key={`${timIndex}_${kerusakanIndex}`}
                              className="px-3 py-3 text-center font-semibold border-r border-blue-500 text-xs"
                            >
                              X{timIndex + 1},{kerusakanIndex + 1}
                            </th>
                          ))
                        )}
                        <th className="px-4 py-3 text-center font-semibold">
                          Z (Total Skor)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {penugasan.iterasi.map((iterasi, index) => (
                        <tr
                          key={index}
                          className={`border-b border-gray-200 hover:bg-gray-50 ${
                            iterasi.iterasi === penugasan.solusiOptimal.iterasi
                              ? "bg-green-50 font-medium"
                              : ""
                          }`}
                        >
                          <td className="px-4 py-3 text-center border-r border-gray-200">
                            Iterasi {iterasi.iterasi}
                            {iterasi.iterasi ===
                              penugasan.solusiOptimal.iterasi && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-1 rounded">
                                OPTIMAL
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm border-r border-gray-200">
                            {iterasi.penugasan}
                          </td>
                          {selectedTim.map((tim, timIndex) =>
                            selectedKerusakan.map(
                              (kerusakan, kerusakanIndex) => (
                                <td
                                  key={`${timIndex}_${kerusakanIndex}`}
                                  className="px-3 py-3 text-center border-r border-gray-200"
                                >
                                  {
                                    iterasi.variabelKeputusan[
                                      `x_${timIndex}_${kerusakanIndex}`
                                    ]
                                  }
                                </td>
                              )
                            )
                          )}
                          <td className="px-4 py-3 text-center font-medium">
                            {iterasi.detailPerhitungan} ={" "}
                            {iterasi.totalZ.toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Solusi Optimal */}
              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                  🎯 Solusi Optimal (Iterasi {penugasan.solusiOptimal.iterasi})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-green-700 mb-2">
                      Penugasan:
                    </p>
                    <p className="text-green-800">
                      {penugasan.solusiOptimal.penugasan}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-green-700 mb-2">
                      Total Skor Z:
                    </p>
                    <p className="text-green-800 text-xl font-bold">
                      {penugasan.solusiOptimal.totalZ.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detail Penugasan per Tim */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  📌 Detail Penugasan Optimal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {penugasan.solusiOptimal.detailPenugasan.map(
                    (detail, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg border"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-800">
                            {detail.tim}
                          </h4>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            Z = {detail.nilaiZ.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Kerusakan:</strong> {detail.kerusakan}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>jenis_kerusakan:</strong>{" "}
                          {detail.jenis_kerusakan}
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <p className="text-gray-500">Waktu Tempuh</p>
                            <p className="font-medium">
                              {detail.waktuTempuh.toFixed(1)} menit
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-500">Keahlian</p>
                            <p className="font-medium">{detail.keahlian}/5</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-500">Urgensi</p>
                            <p className="font-medium">
                              Level {detail.urgensi}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Informasi Metodologi */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  📈 Bobot Kriteria (Dinamis)
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-blue-600 text-sm">Waktu Tanggap (w_r)</p>
                    <p className="text-blue-800 font-bold text-lg">
                      {(penugasan.metodologi.bobot.w_r * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-600 text-sm">Keahlian (w_s)</p>
                    <p className="text-blue-800 font-bold text-lg">
                      {(penugasan.metodologi.bobot.w_s * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-600 text-sm">Urgensi (w_u)</p>
                    <p className="text-blue-800 font-bold text-lg">
                      {(penugasan.metodologi.bobot.w_u * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2 text-center">
                  Rumus: Z = w_r × r_(i,j) + w_s × (5 - s_(i,j)) + w_u × a_j
                </p>
              </div>

              {/* Tombol Simpan */}
              <div className="flex justify-center">
                <button
                  onClick={handleSimpanPenugasan}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg cursor-pointer font-medium"
                >
                  💾 Simpan Penugasan Optimal
                </button>
              </div>
            </section>
          )}
        </main>
      )}
    </DashboardLayout>
  );
};

export default PenugasanTimPage;
