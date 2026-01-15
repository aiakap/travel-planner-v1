"use client";

import { useChat } from "@ai-sdk/react";
import { UIMessage } from "ai";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { generateGetLuckyPrompt } from "@/lib/ai/get-lucky-prompts";

interface ChatInterfaceProps {
  conversationId: string;
  initialMessages?: UIMessage[];
}

// Helper to extract text content from message parts
function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("");
}

// Helper to check for tool invocations in message parts
function getToolInvocations(message: UIMessage) {
  return message.parts.filter(
    (part): part is { type: "tool-invocation"; toolInvocation: { toolName: string; state: string } } =>
      part.type === "tool-invocation"
  );
}

export default function ChatInterface({
  conversationId,
  initialMessages = [],
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error } = useChat({
    api: "/api/chat",
    body: { conversationId },
    initialMessages,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "in_progress";

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle "Get Lucky" button click
  const handleGetLucky = () => {
    if (isLoading) return;
    const luckyPrompt = generateGetLuckyPrompt();
    sendMessage({ text: luckyPrompt });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-lg font-medium mb-2">
              👋 Hi! I&apos;m your AI travel planning assistant
            </p>
            <p className="text-sm mb-6">
              Tell me about your dream trip and I&apos;ll help you plan it!
            </p>
            
            {/* Get Lucky Button - prominent when no messages */}
            <Button
              onClick={handleGetLucky}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Get Lucky ✨
            </Button>
            <p className="text-xs text-gray-400 mt-3">
              Generate a random dream trip with a complete itinerary!
            </p>
          </div>
        )}

        {messages.map((message) => {
          const textContent = getMessageText(message);
          const toolInvocations = getToolInvocations(message);

          return (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <div className="whitespace-pre-wrap">{textContent}</div>

                {/* Show tool calls if present */}
                {toolInvocations.length > 0 && (
                  <div className="mt-2 text-xs opacity-75 border-t border-gray-300 pt-2">
                    {toolInvocations.map((tool, idx) => (
                      <div key={idx} className="mb-1">
                        ✓ {tool.toolInvocation.toolName === "create_trip" && "Created trip"}
                        {tool.toolInvocation.toolName === "add_segment" && "Added segment"}
                        {tool.toolInvocation.toolName === "suggest_reservation" &&
                          "Added reservation"}
                        {tool.toolInvocation.toolName === "get_user_trips" && "Fetched trips"}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-gray-600">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t p-4 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim() && !isLoading) {
              sendMessage({ text: input });
              setInput("");
            }
          }}
          className="flex gap-2"
        >
          {/* Get Lucky button (compact version) */}
          <Button
            type="button"
            onClick={handleGetLucky}
            disabled={isLoading}
            variant="outline"
            className="border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400"
            title="Generate a random dream trip!"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
          
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your dream trip..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        {error && (
          <div className="mt-2 text-sm text-red-600">
            Error: {error.message}
          </div>
        )}
      </div>
    </div>
  );
}

