"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem, type Message } from "./message-item";
import { PromptInput } from "./prompt-input";

export function ChatInterface() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! How can I help you today?",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [attachments, setAttachments] = React.useState<File[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      setAttachments((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      attachments: attachments.map((file) => URL.createObjectURL(file)),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setAttachments([]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "This is a mock response. I received your message!",
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col  w-full max-w-5xl mx-auto relative h-full">
      <div className="flex-1 overflow-y-auto w-full h-full">
        <div className="flex flex-col gap-4 p-4 pb-32">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
              <span className="animate-pulse">AI is typing...</span>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 pb-6">
        <PromptInput
          value={input}
          onChange={setInput}
          onSubmit={handleSend}
          onFileSelect={handleFileSelect}
          attachments={attachments}
          onRemoveAttachment={handleRemoveAttachment}
          isLoading={isLoading}
        />
        <div className="text-center text-xs text-muted-foreground mt-2">
          Sarvam Chatbot can make mistakes. Check important info.
        </div>
      </div>
    </div>
  );
}
