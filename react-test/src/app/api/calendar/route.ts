import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { event } = await req.json();
    console.log("Received event to insert:", event);

    if (!event) {
      return NextResponse.json({ success: false, error: "No event provided" });
    }

    // Set up OAuth2 client
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oAuth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
    console.log("process.env.GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
    // Create calendar instance
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    // Insert event
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      requestBody: event,
    });

    return NextResponse.json({
      success: true,
      eventLink: response.data.htmlLink,
    });
  } catch (err: any) {
    console.error("Calendar insert error:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
