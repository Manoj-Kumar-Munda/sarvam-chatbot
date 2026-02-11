"use client";

import { useChat } from "@ai-sdk/react";
import { isTextUIPart } from "ai";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "../ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "../ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
} from "../ai-elements/prompt-input";
import { ScrollArea } from "../ui/scroll-area";

export function ChatInterface() {
  const { messages, sendMessage, status, stop } = useChat();

  const handleSubmit = async ({ text, files }: PromptInputMessage) => {
    const trimmedText = text.trim();

    if (!trimmedText && files.length === 0) {
      return;
    }

    if (trimmedText) {
      await sendMessage({ text: trimmedText, files });
      return;
    }

    await sendMessage({ files });
  };

  return (
    <section className="mx-auto flex h-screen w-full px-4 md:px-12 flex-col py-6">
      <Conversation className="rounded-xl h-full border bg-background/90 shadow-sm">
        <ScrollArea className="grow h-full flex flex-col">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                description="Ask anything to begin chatting with Sarvam AI."
                title="Start a conversation"
              />
            ) : (
              messages.map((message) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    {message.parts.map((part, index) => {
                      if (isTextUIPart(part)) {
                        return (
                          <MessageResponse key={`${message.id}-${index}`}>
                            {part.text}
                          </MessageResponse>
                        );
                      }

                      return null;
                    })}
                  </MessageContent>
                </Message>
              ))
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </ScrollArea>
      </Conversation>

      <div className="mt-4">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea disabled={status === "submitted"} />
          <PromptInputFooter>
            <PromptInputSubmit onStop={stop} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </section>
  );
}

export default ChatInterface;
