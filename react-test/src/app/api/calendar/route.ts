import { google } from "googleapis";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const EVENTS_FILE = path.join(process.cwd(), "events.json");

export async function POST(req: Request) {
  try {
    const { action, event, eventId } = await req.json();
    console.log("Received request:", { action, event, eventId });

    if (!action) {
      return NextResponse.json({ success: false, error: "No action provided" });
    }

    // Set up OAuth2 client
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oAuth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    // Read existing events
    let eventsData: any[] = [];
    if (fs.existsSync(EVENTS_FILE)) {
      const raw = fs.readFileSync(EVENTS_FILE, "utf-8");
      eventsData = JSON.parse(raw);
    }

    let result: any = {};

    if (action === "insert") {
      if (!event) throw new Error("No event provided for insert");

      const response = await calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID!,
        requestBody: event,
      });

      const newEventId = response.data.id;
      if (!newEventId) throw new Error("No event ID returned from Google Calendar");

      // Save to events.json
      eventsData.push({
        eventId: newEventId,
        event,
        createdAt: new Date().toISOString(),
      });
      fs.writeFileSync(EVENTS_FILE, JSON.stringify(eventsData, null, 2), "utf-8");

      result = { success: true, action, eventId: newEventId, event };
    } else if (action === "edit") {
      if (!eventId || !event) throw new Error("Missing eventId or requestBody for edit");

      await calendar.events.update({
        calendarId: process.env.GOOGLE_CALENDAR_ID!,
        eventId,
        requestBody: event,
      });

      // Update events.json
      const index = eventsData.findIndex((e) => e.eventId === eventId);
      if (index >= 0) {
        eventsData[index].event = event;
        fs.writeFileSync(EVENTS_FILE, JSON.stringify(eventsData, null, 2), "utf-8");
      }

      result = { success: true, action, eventId, event: event };
    } else if (action === "delete") {
      if (!eventId) throw new Error("Missing eventId for delete");

      await calendar.events.delete({
        calendarId: process.env.GOOGLE_CALENDAR_ID!,
        eventId,
      });

      // Remove from events.json
      eventsData = eventsData.filter((e) => e.eventId !== eventId);
      fs.writeFileSync(EVENTS_FILE, JSON.stringify(eventsData, null, 2), "utf-8");

      result = { success: true, action, eventId };
    } else {
      throw new Error(`Unknown action: ${action}`);
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Calendar API error:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
