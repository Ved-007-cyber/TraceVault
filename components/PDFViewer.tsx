"use client";

interface PDFViewerProps {
  pdfUrl: string;
  userName: string;
}

export default function PDFViewer({
  pdfUrl,
  userName,
}: PDFViewerProps) {
  return (
    <div className="relative w-full h-[90vh] rounded-3xl overflow-hidden border border-cyan-500/20">

      {/* PDF */}
      <iframe
        src={pdfUrl}
        className="w-full h-full"
      />

      {/* Watermark Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div className="absolute top-[15%] left-[10%] rotate-[-35deg] text-white/10 text-6xl font-black">
          {userName}
        </div>

        <div className="absolute top-[30%] left-[25%] rotate-[-35deg] text-white/10 text-6xl font-black">
          {userName}
        </div>

        <div className="absolute top-[45%] left-[35%] rotate-[-35deg] text-white/10 text-6xl font-black">
          {userName}
        </div>

        <div className="absolute top-[60%] left-[45%] rotate-[-35deg] text-white/10 text-6xl font-black">
          {userName}
        </div>

        <div className="absolute top-[75%] left-[55%] rotate-[-35deg] text-white/10 text-6xl font-black">
          {userName}
        </div>
        
        <div className="absolute top-[90%] left-[65%] rotate-[-35deg] text-white/10 text-6xl font-black">
          {userName}
        </div>

      </div>
    </div>
  );
}