import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      studentEmail,
      facultyName,
      documentTitle,
    } = body;

    const RESEND_API_KEY =
      process.env.RESEND_API_KEY;

    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          from:
            "TraceVault <onboarding@resend.dev>",
          to: studentEmail,
          subject:
            "New Document Shared",
          html: `
            <h2>TraceVault</h2>

            <p>Hello,</p>

            <p>
              <b>${facultyName}</b>
              has shared a document with you.
            </p>

            <p>
              Document:
              <b>${documentTitle}</b>
            </p>

            <p>
              Login to TraceVault to view it.
            </p>

            <hr>

            <p>
              TraceVault Academic
              File Sharing System
            </p>
          `,
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Email failed",
      },
      {
        status: 500,
      }
    );
  }
}