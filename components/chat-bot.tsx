"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE = `# Welcome to Our Shopping Assistant! 👋

I can help you with:

## 1. Sacred Geometry Products
- Information about our Platonic Solids:
  - Tetrahedron
  - Cube
  - Octahedron
  - Icosahedron
  - Dodecahedron
- Their elemental associations
- Metaphysical properties
- Pricing and availability

## 2. Bach Flower Remedies
- Details about specific flower essences
- Their emotional and healing properties
- Usage recommendations
- Pricing and availability

*What would you like to know about our products?*`;

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: INITIAL_MESSAGE,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      // Get response from API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Add assistant response to chat
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("Error getting response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I'm having trouble processing your request at the moment. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[600px] flex flex-col p-4 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Shopping Assistant</h3>
      </div>
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              {message.role === "user" ? (
                <div className="whitespace-pre-wrap">{message.content}</div>
              ) : (
                <ReactMarkdown
                  className="prose prose-sm dark:prose-invert max-w-none"
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-lg font-bold mb-2">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-base font-semibold mb-2">
                        {children}
                      </h2>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-2">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => <li className="ml-2">{children}</li>,
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold">{children}</strong>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "..." : "Send"}
        </Button>
      </form>
    </Card>
  );
}
