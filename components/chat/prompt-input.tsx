import * as React from "react";
import { Paperclip, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onFileSelect: (files: FileList | null) => void;
  attachments: File[];
  onRemoveAttachment: (index: number) => void;
  isLoading?: boolean;
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  onFileSelect,
  attachments,
  onRemoveAttachment,
  isLoading,
}: PromptInputProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative flex w-full flex-col gap-2 rounded-2xl border bg-background/80 p-3 shadow-sm backdrop-blur-sm transition-all focus-within:ring-1 focus-within:ring-ring">
      {attachments.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 px-1">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-md border bg-muted"
            >
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-full w-full rounded-md object-cover"
                />
              ) : (
                <span className="text-xs text-muted-foreground">File</span>
              )}
              <button
                onClick={() => onRemoveAttachment(index)}
                className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-destructive text-[10px] text-destructive-foreground hover:bg-destructive/90"
              >
                <X className="h-2 w-2" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Send a message..."
        className="min-h-[44px] w-full resize-none border-0 bg-transparent p-2 shadow-none focus-visible:ring-0"
      />

      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={(e) => onFileSelect(e.target.files)}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:bg-muted/50 rounded-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" />
            <span className="sr-only">Attach file</span>
          </Button>
        </div>
        <Button
          size="sm"
          className={cn(
            "h-8 w-8 rounded-full p-0 transition-all",
            value.trim() || attachments.length > 0 ? "" : "opacity-50",
          )}
          onClick={onSubmit}
          disabled={(!value.trim() && attachments.length === 0) || isLoading}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
}
