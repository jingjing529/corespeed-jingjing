"use client";

interface GoogleCalendarProps {
  calendarId?: string;
  timezone?: string;
  view?: "week" | "month" | "agenda";
}

export default function GoogleCalendar({
  calendarId = "",
  timezone = "",
  view = "week",
}: GoogleCalendarProps) {
  const src = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
    calendarId
  )}&ctz=${encodeURIComponent(timezone)}&mode=${view}`;

  return (
    <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
      <iframe
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
