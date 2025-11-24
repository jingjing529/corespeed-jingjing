import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Get user's local timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
    const today = new Date();
    const todayDate = today.toISOString().split("T")[0]; // YYYY-MM-DD

    // Load events.json (if exists)
    const eventsFile = path.join(process.cwd(), "events.json");
    let eventsData: any[] = [];
    if (fs.existsSync(eventsFile)) {
      const content = fs.readFileSync(eventsFile, "utf-8");
      eventsData = JSON.parse(content);
      console.log("Loaded events data:", eventsData);
    }
    const eventsDataString = JSON.stringify(eventsData, null, 2); // pretty print for readability


    // AI prompt: handle insert/edit/delete automatically
    const prompt = `
You are a smart Google Calendar assistant. Greet the user first.
You can insert, edit, or delete events. Always ask for clarification if needed
(e.g., event name, description, start/end time). 

Use the user's local timezone: ${timezone}.
Use today's date: ${todayDate}.
The events you can refer to is only in ${eventsDataString} to find eventIds for edits or deletes.

Return **only valid JSON** in the following format:

{
  "action": "insert | edit | delete",
  "message": "Assistant message to display to user",
  "event": { ... },       // For insert or edit
  "eventId": "...",       // For edit or delete
}

Return valid times, names, and descriptions based on the user's request.
User request: ${message}
`;

    // Call Deno Zypher server
    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
    });

    const data = await res.json();

    // Parse JSON safely
    let output = null;
    try {
      output = JSON.parse(data.reply);
      console.log("Parsed output:", output);
    } catch (err) {
      console.error("Failed to parse JSON:", err, data.reply);
      output = { action: "unknown", message: data.reply, event: null, eventId: null, requestBody: null };
    }

    return NextResponse.json(output);
  } catch (err: any) {
    console.error("Message route error:", err);
    return NextResponse.json({
      action: "unknown",
      message: "Error processing your request",
      event: null,
      eventId: null,
      requestBody: null,
    });
  }
}
