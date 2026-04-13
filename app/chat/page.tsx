import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChatInterface } from "@/components/chat/chat-interface"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Pet Advisor | PawFinder",
  description: "Get instant answers to all your pet care questions from our AI-powered assistant. Available 24/7 to help with nutrition, training, health, and more.",
}

export default function ChatPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ChatInterface />
      </main>
      <Footer />
    </div>
  )
}
