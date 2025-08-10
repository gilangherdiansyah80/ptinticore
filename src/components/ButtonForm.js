import Link from "next/link";

const ButtonForm = ({ href, style, loading }) => {
  return (
    <section className="w-full flex gap-x-3">
      <Link
        href={href}
        className="bg-red-600 p-3 text-white rounded-lg w-1/2 text-center"
      >
        Cancel
      </Link>
      <button
        type="submit"
        className={`bg-green-500 p-3 text-white rounded-lg w-1/2 cursor-pointer ${style}`}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </section>
  );
};

export default ButtonForm;
