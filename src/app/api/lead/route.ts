// Route handler: /api/lead
// Proxies lead submissions to Google Apps Script to avoid browser CORS issues.

export const runtime = "nodejs"; // ensure server runtime

const GAS_URL = "https://script.google.com/macros/s/AKfycbygVcah5cSd18V2fjFL_8dyLdSa272zscKtGE-SOhEwVS_Cj-l8HBYZEu4pwX9J3sMb/exec";

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

    // Forward to Google Apps Script (server-side has no CORS restrictions)
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vorname: data.vorname,
        nachname: data.nachname,
        email: data.email,
        telefon: data.telefon,
      }),
      // server fetch follows redirects by default
    });

    // Some GAS deployments return 200, others 302 -> 200 after redirect.
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return Response.json({ error: "Upstream error", details: text }, { status: 502 });
    }

    // Try to pass-through minimal info
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Unexpected server error" }, { status: 500 });
  }
}