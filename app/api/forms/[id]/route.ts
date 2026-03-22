import { NextResponse } from "next/server"

export async function GET(req: Request, context: any) {
  const { id } = context.params

  const res = await fetch(`${process.env.DASHBOARD_FORM_API}/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.DASHBOARD_FORM_API_KEY}`,
    },
  })

  if (!res.ok) return NextResponse.json({ error: "Failed to fetch form" }, { status: res.status })

  const data = await res.json()
  return NextResponse.json(data)
}