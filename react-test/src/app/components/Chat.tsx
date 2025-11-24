"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
  event?: any;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");

    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();

      const assistantMessage: Message = {
        role: "assistant",
        text: "Event ready to insert.",
        event: data.event ?? undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Error: Could not get a response." },
      ]);
    }
  };

  const insertEventToCalendar = async (event: any) => {
    const res = await fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event }),
    });
    const data = await res.json();
    if (data.success) alert(`✅ Event created: ${data.eventLink}`);
    else alert(`❌ Error creating event: ${data.error}`);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col w-full max-w-md h-[80vh] bg-white rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className="flex flex-col">
            <div
              className={`p-3 rounded-lg max-w-[80%] whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-blue-400 text-white ml-auto"
                  : "bg-gray-200 text-black mr-auto"
              }`}
            >
              {m.text}
            </div>
            {m.role === "assistant" && m.event && (
              <button
                className="self-start mt-2 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                onClick={() => insertEventToCalendar(m.event)}
              >
                Insert Event into Calendar
              </button>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex p-3 border-t gap-2">
        <input
          type="text"
          className="flex-1 border rounded-lg p-2"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-500 text-white px-4 rounded-lg"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
