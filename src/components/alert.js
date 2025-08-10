const Alert = ({ message }) => {
  return (
    <main className="absolute inset-0 z-30 flex items-center justify-center bg-black/30">
      <div className="flex p-3 rounded-xl w-1/2 md:w-1/5 h-30 flex-col items-center justify-center bg-[#211C84]">
        <h1 className="text-white">{message}</h1>
      </div>
    </main>
  );
};

export default Alert;
