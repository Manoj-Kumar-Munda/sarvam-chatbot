import { UserButton } from "@clerk/nextjs";
import { ChatInterface } from "@/components/chat/chat-interface";

export default function Home() {
  return (
    <div
      className="min-h-screen font-sans"
      style={{
        backgroundImage: `
          radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #f59e0b 100%)
        `,
        backgroundSize: "100% 100%",
      }}
    >
      <div className="fixed right-4 top-4 z-50">
        <UserButton />
      </div>
      <ChatInterface />
    </div>
  );
}
