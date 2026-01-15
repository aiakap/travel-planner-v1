import { auth } from "@/auth";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { tripPlanningTools } from "@/lib/ai/tools";
import { TRIP_PLANNER_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { saveMessage } from "@/lib/actions/chat-actions";

export const maxDuration = 30;

export async function POST(req: Request) {
  // #region agent log
  const fs = require('fs');
  fs.appendFileSync('/Users/alexkaplinsky/Library/CloudStorage/GoogleDrive-alex@shiftcapital.com/My Drive/AI/Project/travel-planner-v1/.cursor/debug.log', JSON.stringify({location:'chat/route.ts:13',message:'API route called',timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})+'\n');
  // #endregion

  const session = await auth();

  if (!session?.user?.id) {
    // #region agent log
    fs.appendFileSync('/Users/alexkaplinsky/Library/CloudStorage/GoogleDrive-alex@shiftcapital.com/My Drive/AI/Project/travel-planner-v1/.cursor/debug.log', JSON.stringify({location:'chat/route.ts:21',message:'Unauthorized - no session',timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})+'\n');
    // #endregion
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages, conversationId } = await req.json();

  // #region agent log
  fs.appendFileSync('/Users/alexkaplinsky/Library/CloudStorage/GoogleDrive-alex@shiftcapital.com/My Drive/AI/Project/travel-planner-v1/.cursor/debug.log', JSON.stringify({location:'chat/route.ts:30',message:'Request parsed',data:{conversationId:conversationId,messageCount:messages?.length,userId:session.user.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})+'\n');
  // #endregion

  const userId = session.user.id;

  // Wrap tools to inject userId
  const toolsWithContext = {
    create_trip: {
      ...tripPlanningTools.create_trip,
      execute: async (params: any) => {
        return tripPlanningTools.create_trip.execute({
          ...params,
          userId,
        });
      },
    },
    add_segment: tripPlanningTools.add_segment,
    suggest_reservation: tripPlanningTools.suggest_reservation,
    get_user_trips: {
      ...tripPlanningTools.get_user_trips,
      execute: async (params: any) => {
        return tripPlanningTools.get_user_trips.execute({
          ...params,
          userId,
        });
      },
    },
  };

  const result = await streamText({
    model: openai("gpt-4o"),
    system: TRIP_PLANNER_SYSTEM_PROMPT,
    messages: messages,
    tools: toolsWithContext,
    maxSteps: 5, // Allow multiple tool calls in sequence
    onFinish: async ({ text, toolCalls, toolResults }) => {
      // Save user message
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role === "user") {
          await saveMessage({
            conversationId,
            role: "user",
            content: lastMessage.content,
          });
        }
      }

      // Save assistant message with tool calls
      await saveMessage({
        conversationId,
        role: "assistant",
        content: text,
        toolCalls:
          toolCalls && toolCalls.length > 0
            ? JSON.stringify({
                calls: toolCalls,
                results: toolResults,
              })
            : null,
      });
    },
  });

  return result.toDataStreamResponse();
}

