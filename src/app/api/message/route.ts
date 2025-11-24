import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function extractJsonBlock(text: string) {
  const fenceMatch = text.match(/```json([\s\S]*?)```/i);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch (e) {
      console.error("Failed fenced JSON:", e);
    }
  }

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    try {
      return JSON.parse(text.slice(firstBrace, lastBrace + 1));
    } catch (e) {
      console.error("Failed brace JSON:", e);
    }
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
    const today = new Date();
    const todayDate = today.toISOString().split("T")[0];

    const eventsFile = path.join(process.cwd(), "events.json");
    let eventsData: any[] = [];
    if (fs.existsSync(eventsFile)) {
      eventsData = JSON.parse(fs.readFileSync(eventsFile, "utf8"));
    }

    const prompt = `
You are a smart Google Calendar assistant. Greet the user first.
Use only the following events list to find eventIds: ${JSON.stringify(eventsData, null, 2)}
Timezone: ${timezone}
Today's date: ${todayDate}

Return **ONLY valid JSON** in this format:

{
  "action": "insert | edit | delete",
  "message": "...",
  "event": { ... },
  "eventId": "..."
}

User request: ${message}
`;

    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
    });

    const data = await res.json();

    // Safe JSON extraction
    let output = extractJsonBlock(data.reply);
    if (!output) {
      output = { action: "unknown", message: data.reply, event: null, eventId: null, requestBody: null };
    }

    return NextResponse.json(output);
  } catch (err) {
    return NextResponse.json({
      action: "unknown",
      message: "Server error",
      error: String(err),
    });
  }
}
