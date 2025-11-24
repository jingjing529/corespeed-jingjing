"use client";

import { useEffect, useState } from "react";

interface GoogleCalendarProps {
  calendarId?: string;
  timezone?: string;
  view?: "week" | "month" | "agenda";
  refreshKey?: number; // increment this to refresh
}

export default function GoogleCalendar({
  refreshKey = 0,
}: GoogleCalendarProps) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "jingjw23@uci.edu";
  const timezone = process.env.TIME_ZONE || "America/Los_Angeles";
  const view = "week";
  const [src, setSrc] = useState(
    `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
      calendarId
    )}&ctz=${encodeURIComponent(timezone)}&mode=${view}`
  );

  // Whenever refreshKey changes, rebuild the iframe URL to reload it
  useEffect(() => {
    setSrc(
      `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
        calendarId
      )}&ctz=${encodeURIComponent(timezone)}&mode=${view}&rand=${Date.now()}`
    );
  }, [refreshKey, calendarId, timezone, view]);

  return (
    <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
      <iframe
        key={src} // force reload when src changes
        src={src}
        style={{ border: 0 }}
        width="100%"
        height="100%"
        className="h-full w-full"
        frameBorder="0"
        scrolling="no"
      ></iframe>
    </div>
  );
}
