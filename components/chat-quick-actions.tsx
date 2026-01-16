"use client";

import { ChatQuickAction } from "@/lib/personalization";

interface ChatQuickActionsProps {
  suggestions: ChatQuickAction[];
  onSelect: (prompt: string) => void;
}

export function ChatQuickActions({ suggestions, onSelect }: ChatQuickActionsProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-600">Quick actions for you:</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSelect(suggestion.prompt)}
            className="group flex items-start gap-3 p-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-all duration-200 text-left hover:shadow-md"
          >
            <span className="text-2xl flex-shrink-0">{suggestion.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 group-hover:text-slate-700 text-sm">
                {suggestion.label}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
