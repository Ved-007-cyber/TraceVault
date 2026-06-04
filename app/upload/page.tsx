export default function UploadPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">
        Upload Document
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

        <input
          type="file"
          className="block w-full text-white"
        />

        <button
          className="mt-6 bg-cyan-500 text-black px-6 py-3 rounded-xl"
        >
          Upload
        </button>

      </div>
    </main>
  );
}