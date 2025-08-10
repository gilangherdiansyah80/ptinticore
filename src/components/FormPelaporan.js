const FormPelaporan = ({ buttonCancel, buttonSubmit }) => {
  return (
    <main className="absolute inset-0 z-30 flex items-center justify-center bg-black/30">
      <div className="flex p-3 rounded-xl w-1/4 flex-col items-center justify-center bg-white">
        <h1 className="text-2xl text-[#211C84] font-semibold">
          Form Pelaporan
        </h1>

        <form className="flex flex-col gap-y-3 mt-3 w-full">
          <section className="flex gap-x-3 w-full">
            <div className="flex flex-col gap-y-2 w-1/2">
              <label className="text-black">Penugasan</label>
              <input
                className="p-2 rounded-md border-black border"
                type="text"
              />
            </div>
            <div className="flex flex-col gap-y-2 w-1/2">
              <label className="text-black">Durasi</label>
              <input
                className="p-2 rounded-md border-black border"
                type="time"
              />
            </div>
          </section>
          <section className="flex gap-x-3 w-full">
            <div className="flex flex-col gap-y-2 w-1/2">
              <label className="text-black">Tanggal Mulai</label>
              <input
                className="p-2 rounded-md border-black border"
                type="date"
              />
            </div>
            <div className="flex flex-col gap-y-2 w-1/2">
              <label className="text-black">Jam Mulai</label>
              <input
                className="p-2 rounded-md border-black border"
                type="time"
              />
            </div>
          </section>
          <section className="flex gap-x-3 w-full">
            <div className="flex flex-col gap-y-2 w-1/2">
              <label className="text-black">Tanggal Selesai</label>
              <input
                className="p-2 rounded-md border-black border"
                type="date"
              />
            </div>
            <div className="flex flex-col gap-y-2 w-1/2">
              <label className="text-black">Jam Selesai</label>
              <input
                className="p-2 rounded-md border-black border"
                type="time"
              />
            </div>
          </section>
          <div className="flex flex-col gap-y-2">
            <label className="text-black">Kondisi Akhir</label>
            <textarea className="p-2 rounded-md border-black border"></textarea>
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="text-black">Hasil Kunjungan</label>
            <textarea className="p-2 rounded-md border-black border"></textarea>
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="text-black">Tindakan</label>
            <textarea className="p-2 rounded-md border-black border"></textarea>
          </div>

          <div className="flex gap-x-3 w-full">
            <button
              onClick={buttonCancel}
              className="bg-red-600 p-3 text-white rounded-lg w-1/2 text-center cursor-pointer"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={buttonSubmit}
              className="bg-green-500 p-3 text-white rounded-lg w-1/2 cursor-pointer"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default FormPelaporan;
