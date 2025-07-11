import React from "react";

const ChatWindow = ({ messages }) => (
  <div className="fixed bottom-24 right-6 w-80 max-h-[400px] bg-white rounded-xl shadow-xl overflow-y-auto p-4 z-40 border border-blue-400">
    <h2 className="text-lg font-semibold mb-2 text-blue-600">AI Chat</h2>
    <div className="space-y-3">
      {messages.map((msg, index) => (
        <div key={index} className="text-sm">
          <p className="font-medium text-gray-800">
            🧑‍💻 You: {msg.question || "..."}
          </p>
          <p className="text-blue-600">🤖 AI: {msg.answer || "..."}</p>
        </div>
      ))}
    </div>
  </div>
);

export default ChatWindow;
