"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PDFViewer from "@/components/PDFViewer";

export default function ViewPage() {
  const params = useParams();
  const [pdfUrl, setPdfUrl] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    loadDocument();
  }, []);

  async function loadDocument() {
    const documentId = params.id;

    const { data: doc } = await supabase
        .from("documents")
        .select("*")
        .eq("document_id", documentId)
        .single();

    if (doc) {
        setPdfUrl(doc.file_url);
    }

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user || !doc) return;

    // Prevent duplicate logs within 5 minutes
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(
        fiveMinutesAgo.getMinutes() - 5
    );

    const { data: existing } = await supabase
        .from("audit_logs")
        .select("id")
        .eq("document_id", doc.document_id)
        .eq("user_id", user.id)
        .eq("action", "Viewed")
        .gte(
        "created_at",
        fiveMinutesAgo.toISOString()
        );

    if (!existing?.length) {
        await supabase
        .from("audit_logs")
        .insert([
            {
            action: "Viewed",
            document_id: doc.document_id,
            user_id: user.id,
            user_email: user.email,
            },
        ]);
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

    setUserName(
        profile?.full_name || "TraceVault"
    );
    }

  return (
    <PDFViewer
      pdfUrl={pdfUrl}
      userName={userName}
    />
  );
}