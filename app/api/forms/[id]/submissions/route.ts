import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> } 
) {
 
  const { id: formId } = await context.params;

  if (!formId) {
    return NextResponse.json({ error: "Missing form ID" }, { status: 400 });
  }

  const payload = await req.json();

  try {
    const res = await fetch(`${process.env.DASHBOARD_FORM_API}/${formId}/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DASHBOARD_FORM_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => {
      throw new Error("Invalid response from main API");
    });

    if (!res.ok) throw new Error(data.error || "Submission failed");

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    console.error("Submission error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}