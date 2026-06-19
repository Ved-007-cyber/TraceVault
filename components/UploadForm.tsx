"use client";

const [selectedFile, setSelectedFile] = useState<File | null>(null);

export default function UploadForm({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div
            className="
            w-[700px]
            rounded-3xl
            border border-cyan-500/30
            bg-slate-900/95
            shadow-[0_0_40px_rgba(0,255,255,0.15)]
            overflow-hidden
            "
        >
            {/* Header */}
            <div className="p-8 border-b border-slate-800">
            <h2 className="text-4xl font-bold text-white">
                Upload Document
            </h2>

            <p className="text-slate-400 mt-2">
                Upload files securely into TraceVault
            </p>
            </div>

            {/* Body */}
            <div className="p-8">

            <label className="block mb-3 text-slate-300">
                Select File
            </label>

            <div
                className="
                border-2
                border-dashed
                border-cyan-500/40
                rounded-2xl
                p-10
                text-center
                hover:border-cyan-400
                transition
                "
            >
                <div className="text-6xl mb-4">
                📄
                </div>

                {selectedFile ? (
                    <>
                        <p className="text-xl font-semibold text-cyan-400">
                        {selectedFile.name}
                        </p>

                        <p className="text-slate-400 mt-2">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                    </>
                    ) : (
                    <>
                        <p className="text-xl text-white">
                        Drag & Drop File Here
                        </p>

                        <p className="text-slate-400 mt-2">
                        PDF, DOCX, PPTX
                        </p>
                    </>
                )}

                <input
                    type="file"
                    id="file-upload"
                    hidden
                    onChange={(e) => {
                        if (e.target.files?.[0]) {
                        setSelectedFile(e.target.files[0]);
                        }
                    }}
                />
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 mt-8">

                <input
                type="text"
                placeholder="Document Title"
                className="
                h-14
                p-4
                rounded-xl
                bg-slate-800
                border border-slate-700
                text-white
                "
                />

                <select
                className="
                p-4
                rounded-xl
                bg-slate-800
                border border-slate-700
                text-white
                "
                >
                <option>Public</option>
                <option>Internal</option>
                <option>Restricted</option>
                </select>

            </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-800 flex gap-4">

            <button
                onClick={() => setShowUploadModal(false)}
                className="
                h-14
                flex-1
                py-4
                rounded-2xl
                bg-slate-800
                hover:bg-slate-700
                text-white
                font-semibold
                "
            >
                Cancel
            </button>

            <button
                className="
                h-14
                flex-1
                py-4
                rounded-2xl
                bg-cyan-500
                hover:bg-cyan-400
                text-black
                font-bold
                "
            >
                Upload Document
            </button>

            </div>
        </div>
        </div>
  );
}