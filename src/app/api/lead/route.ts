// src/app/api/lead/route.ts
// Proxies lead submissions to Google Apps Script to avoid browser CORS issues.

export const runtime = "nodejs"; // ensure server runtime

const GAS_URL = "https://script.google.com/macros/s/AKfycbwVaxbTGK5DicLaaCR26g2fWM9iNdNsicMA0Aa-X3LfPG0MkvaLOALsjlH-mcVc-LONnA/exec";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as {
      vorname?: string;
      nachname?: string;
      email?: string;
      telefon?: string;
    };

    // Basic validation
    if (!data?.vorname || !data?.nachname || !data?.email || !data?.telefon) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Forward to Google Apps Script
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vorname: data.vorname,
        nachname: data.nachname,
        email: data.email,
        telefon: data.telefon,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return Response.json({ error: "Upstream error", details: text }, { status: 502 });
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
