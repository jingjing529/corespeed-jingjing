import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json(); // client can send timezone
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const today = new Date();
  const todayDate = today.toISOString().split("T")[0]; // YYYY-MM-DD

  // Modify your prompt so the agent ONLY returns the event object
  const prompt = `You are an assistant creating a Google Calendar event.
Use the user's local timezone: ${timezone || "America/New_York"}.
Use today's date: ${todayDate}.

When the user asks you to create a Google Calendar event, respond with ONLY a JSON object representing the event, without any extra text or explanation. 

Example JSON format:

{
  "summary": "Meeting",
  "description": "Scheduled meeting",
  "start": { "dateTime": "...", "timeZone": "${timezone || "America/New_York"}" },
  "end": { "dateTime": "...", "timeZone": "${timezone || "America/New_York"}" }
}

User request: ${message}
Return only valid JSON, no explanations, no code blocks.
`;

  // Call your Deno Zypher server
  const res = await fetch("http://localhost:8000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: prompt }),
  });

  const data = await res.json();

  // Parse JSON safely
  let event = null;
  try {
    event = JSON.parse(data.reply);
    console.log("Parsed event:", event);
  } catch (err) {
    console.error("Failed to parse event JSON:", err, data.reply);
  }

  return NextResponse.json({ event });
}
