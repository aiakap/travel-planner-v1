"use client";

import { Sparkles } from "lucide-react";

interface ChatWelcomeMessageProps {
  userName?: string;
  hobbies?: string[];
  recentTrips?: Array<{ title: string }>;
}

export function ChatWelcomeMessage({ 
  userName, 
  hobbies = [], 
  recentTrips = [] 
}: ChatWelcomeMessageProps) {
  const hasHobbies = hobbies.length > 0;
  const hasRecentTrips = recentTrips.length > 0;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 shadow-sm border border-slate-100">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1">
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-3">
            {userName ? `Hi ${userName}!` : 'Welcome!'}
          </h2>
          
          <div className="space-y-2 text-slate-700">
            {hasHobbies ? (
              <>
                <p>
                  Based on your interests in{' '}
                  <span className="font-semibold">
                    {hobbies.slice(0, 2).join(' and ')}
                  </span>
                  {hobbies.length > 2 && ` and ${hobbies.length - 2} more`}, 
                  I can help you plan amazing trips tailored just for you.
                </p>
              </>
            ) : (
              <p>
                I'm here to help you plan your perfect trip! Tell me about your travel dreams, 
                and I'll create a personalized itinerary just for you.
              </p>
            )}
            
            {hasRecentTrips && (
              <p className="text-sm text-slate-600 mt-3">
                I see you've been to {recentTrips[0].title} recently. 
                Want to explore somewhere similar or try something completely different?
              </p>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              <span className="font-medium">Try asking me:</span>
            </p>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>• "Plan a week-long trip to Japan"</li>
              <li>• "Find me a romantic weekend getaway"</li>
              <li>• "Suggest activities for my upcoming Paris trip"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
