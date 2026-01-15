import { auth } from "@/auth";
import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";
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

    // Convert UI messages to model messages format
    const modelMessages = await convertToModelMessages(messages);

    // Create tools with userId already injected
    // const tools = createTripPlanningTools(userId);

    const result = streamText({
      model: openai("gpt-4o"),
      system: TRIP_PLANNER_SYSTEM_PROMPT,
      messages: modelMessages,
      // tools: tools,
      onFinish: async ({ text, toolCalls, toolResults }) => {
        // Save user message
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1];
          if (lastMessage.role === "user") {
            // Extract text from parts for UI messages
            const userContent = lastMessage.parts
              ?.filter((p: { type: string }) => p.type === "text")
              .map((p: { text: string }) => p.text)
              .join("") || "";
            await saveMessage({
              conversationId,
              role: "user",
              content: userContent,
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

    // useChat expects the AI SDK UI message stream protocol
    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error('[API /api/chat] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

