import Image from "next/image";
import Chat from "./components/Chat";
import GoogleCalendar from "./components/GoogleCalendar";

export default function Home() {
  return (
   <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 p-4 gap-4">
      {/* Left: Chat */}
      <div className="flex-1 max-w-md">
        <Chat />
      </div>

      {/* Right: Google Calendar */}
      <GoogleCalendar
        calendarId="jingjw23@uci.edu"
        timezone="America/Los_Angeles"
        view="week"
      />
    </div>
  );
}
