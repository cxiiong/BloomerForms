import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  if (!id) {
    return NextResponse.json({ error: "Missing form ID" }, { status: 400 })
  }

  if (!process.env.DASHBOARD_FORM_API || !process.env.DASHBOARD_FORM_API_KEY) {
    return NextResponse.json(
      { error: "Missing DASHBOARD_FORM_API or DASHBOARD_FORM_API_KEY" },
      { status: 500 }
    )
  }

  console.log("Fetching form from:", `${process.env.DASHBOARD_FORM_API}/${id}`)

  try {
    const res = await fetch(`${process.env.DASHBOARD_FORM_API}/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.DASHBOARD_FORM_API_KEY}`,
      },
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json(
        { error: "Failed to fetch form", details: text },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error("Fetch error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}