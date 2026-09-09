import { NextResponse } from "next/server";
import { z } from "zod";

const reminderSchema = z.object({
  recipient: z.string().email(),
  title: z.string().trim().min(1).max(160),
  eventType: z.string().trim().min(1).max(40),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/).optional().default(""),
  notes: z.string().trim().max(4000).optional().default(""),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = reminderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Provide a valid reminder and recipient email." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.REMINDER_FROM_EMAIL;

  if (!apiKey || !from) {
    return NextResponse.json(
      { error: "Email delivery is not configured. Set RESEND_API_KEY and REMINDER_FROM_EMAIL." },
      { status: 503 },
    );
  }

  const { recipient, title, eventType, date, time, notes } = parsed.data;
  const formattedDate = `${date}${time ? ` at ${time}` : ""}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [recipient],
      subject: `Job tracker reminder: ${title}`,
      text: [
        `You have a ${eventType.toLowerCase()} reminder for ${formattedDate}.`,
        `\n${title}`,
        notes ? `\nNotes:\n${notes}` : "",
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "The email provider could not deliver this reminder." }, { status: 502 });
  }

  const result = await response.json().catch(() => ({}));
  return NextResponse.json({ delivered: true, id: result.id ?? null });
}
