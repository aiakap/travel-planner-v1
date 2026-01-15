import { auth } from "@/auth";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createTripPlanningTools } from "@/lib/ai/tools";
import { TRIP_PLANNER_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { saveMessage } from "@/lib/actions/chat-actions";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { messages, conversationId } = await req.json();
    const userId = session.user.id;

    // Create tools with userId already injected
    const tools = createTripPlanningTools(userId);

    const result = await streamText({
      model: openai("gpt-4o"),
      system: TRIP_PLANNER_SYSTEM_PROMPT,
      messages: messages,
      tools: tools,
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

  return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('[API /api/chat] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

