# 📅 AI Calendar Assistant

A Next.js + Deno project that allows an AI agent to **create, edit, and delete Google Calendar events** using natural language.

The AI reads your message, extracts event details (date, time, summary, etc.), then calls your calendar API automatically.

---

## 🚀 Features

* 💬 Chat UI with AI agent
* ✨ Animated typing indicator (ChatGPT style)
* 🎨 Modern styled interface
* 📅 Live Google Calendar embedded page
* 🔁 Real-time refresh after event changes
* 🤖 Deno-powered AI agent with REST endpoint

---

## 📁 Project Structure

```
.
├── src
│   └── app
│       ├── api
│       │   ├── calendar
│       │   │   └── route.ts         # Insert/Edit/Delete Google Calendar events
│       │   └── message
│       │       └── route.ts         # Sends user message → AI agent → returns action + event data
│       ├── components
│       │   ├── CalendarPage.tsx     # Calendar + Chat interface
│       │   ├── GoogleCalendar.tsx   # Embedded Google Calendar
│       │   └── Chat.tsx             # Chat UI with typing animation
│       ├── scripts
│       │   └── getRefreshToken.ts   # Google OAuth tool
│       ├── layout.tsx
│       ├── page.tsx
│       └── globals.css
├── main.ts                           # Deno Zypher AI server
├── events.json                       # Stores cached event metadata
├── .env                              # Google OAuth + Calendar credentials
├── next.config.ts
├── deno.json
├── README.md
└── package.json
```

---

# 🛠 Installation

## 1. Install dependencies

```bash
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file in the project root:

```
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token
GOOGLE_CALENDAR_ID=primary or calendar-id@example.com

ANTHROPIC_API_KEY=your-anthropic-key
FIRECRAWL_API_KEY=your-firecrawl-key
GOOGLE_REDIRECT_URI=your-redirect-url
GOOGLE_CALENDAR_ID=your-calendar-id
TIME_ZONE=you-time-zone
```

---

# ▶️ How to Run the Project

The system contains **two servers**:

---

## ✅ 1. Start the Deno AI Agent (port 8000)

The AI agent interprets natural language and returns event metadata.

Run:

```bash
deno run -A --env-file main.ts
```

This launches a local REST endpoint at:

```
http://localhost:8000/chat
```

---

## ✅ 2. Start the Next.js App (port 3000)

Your UI, chat, and calendar view.

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

# 💬 How to Use the AI

Talk to the AI normally.
Examples:

---

## ➕ Insert an event

**You say:**

> Schedule a dentist appointment tomorrow at 3pm for 1 hour.

**AI will:**

* Understand it's an **insert**
* Extract date, time, title
* Insert into Google Calendar
* Refresh the calendar

---

## ✏️ Edit an event

**You say:**

> Change my dentist appointment to 4pm.

AI will:

* Detect it's an **edit**
* Find closest-existing event using stored `events.json`
* Update Google Calendar

---

## ❌ Delete an event

**You say:**

> Delete my dentist appointment.

AI will:

* Detect it's a **delete**
* Find eventId from `events.json`
* Remove the event from your calendar

---

# 🗂 How events.json Works

Whenever AI inserts an event, the backend stores:

```json
[
  {
    "id": "abc123",
    "event": {
      "summary": "Dentist",
      "description": "",
      "start": "2025-01-15T22:00:00Z",
      "end": "2025-01-15T23:00:00Z"
    },
    "createdAt": "2025-01-14T01:23:45.000Z"
  }
]
```

This allows AI to **edit or delete** events later without searching your entire calendar.

---

# 🔄 Refresh Behavior

The chat component triggers:

```ts
onEventUpdated?.();
```

Which updates `refreshKey` in `CalendarPage`, causing the embedded `GoogleCalendar` to reload.

---

# 📞 API Routes

### POST `/api/message`

* Sends natural language to Deno AI
* Returns:

```json
{
  "action": "insert" | "edit" | "delete",
  "event": {...},
  "eventId": "xxxx"
}
```

### POST `/api/calendar`

Handles:

* insert
* edit
* delete
  via the same endpoint.
