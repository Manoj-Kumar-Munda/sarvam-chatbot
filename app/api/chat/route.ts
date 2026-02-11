import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  isTextUIPart,
  type UIMessage,
} from "ai";
import { SarvamAIClient, type SarvamAI } from "sarvamai";

type ChatRequestBody = {
  messages?: UIMessage[];
};

const apiKey = process.env.SARVAM_API_KEY;

const client = apiKey
  ? new SarvamAIClient({
      apiSubscriptionKey: apiKey,
    })
  : null;

const getTextContent = (message: UIMessage): string =>
  message.parts
    .filter(isTextUIPart)
    .map((part) => part.text)
    .join("\n")
    .trim();

const toSarvamMessages = (
  messages: UIMessage[],
): SarvamAI.ChatCompletionRequestMessage[] =>
  messages
    .map((message) => ({
      content: getTextContent(message),
      role: message.role,
    }))
    .filter((message): message is SarvamAI.ChatCompletionRequestMessage => {
      if (message.content.length === 0) {
        return false;
      }

      return (
        message.role === "assistant" ||
        message.role === "system" ||
        message.role === "user"
      );
    });

export async function POST(req: Request) {
  if (!client) {
    return Response.json(
      { error: "Missing SARVAM_API_KEY environment variable." },
      { status: 500 },
    );
  }

  let body: ChatRequestBody;

  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];

  if (messages.length === 0) {
    return Response.json(
      { error: "Expected a non-empty messages array." },
      { status: 400 },
    );
  }

  const promptMessages = toSarvamMessages(messages);

  if (promptMessages.length === 0) {
    return Response.json(
      { error: "No text content found in messages." },
      { status: 400 },
    );
  }

  const stream = createUIMessageStream({
    originalMessages: messages,
    execute: async ({ writer }) => {
      const completion = await client.chat.completions({
        messages: promptMessages,
        temperature: 0.5,
        top_p: 1,
        max_tokens: 1000,
      });

      const text = completion.choices[0]?.message?.content?.trim();

      if (!text) {
        writer.write({
          type: "error",
          errorText: "Sarvam returned an empty response.",
        });
        return;
      }

      const textId = crypto.randomUUID();

      writer.write({ type: "start" });
      writer.write({ type: "text-start", id: textId });
      writer.write({ type: "text-delta", id: textId, delta: text });
      writer.write({ type: "text-end", id: textId });
      writer.write({ type: "finish", finishReason: "stop" });
    },
    onError: (error) =>
      error instanceof Error ? error.message : "Failed to generate response.",
  });

  return createUIMessageStreamResponse({ stream });
}
