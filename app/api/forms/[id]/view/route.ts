import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  if (!id) {
    return NextResponse.json({ error: "Missing form ID" }, { status: 400 })
  }

  try {
    const res = await fetch(
      `${process.env.DASHBOARD_FORM_API}/${id}/view`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.DASHBOARD_FORM_API_KEY}`,
        },
      }
    )

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json(
        { error: "Failed to increment view", details: text },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}