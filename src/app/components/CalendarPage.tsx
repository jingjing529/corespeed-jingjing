"use client";

import { useState } from "react";
import Chat from "../../../Chat";
import GoogleCalendar from "./GoogleCalendar";

export default function CalendarPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEventInserted = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col md:flex-row max-h-screen bg-gray-100 p-4 gap-4">
      <div className="flex-1 max-w-md">
        <Chat onEventUpdated={handleEventInserted} />
      </div>

      <GoogleCalendar
        refreshKey={refreshKey}
      />
    </div>
  );
}
