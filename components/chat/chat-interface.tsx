"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Send, 
  Bot, 
  User, 
  PawPrint, 
  Stethoscope, 
  Heart, 
  HelpCircle,
  Sparkles
} from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const suggestedQuestions = [
  { icon: Stethoscope, text: "How often should I take my dog to the vet?" },
  { icon: Heart, text: "What should I feed a new kitten?" },
  { icon: PawPrint, text: "How do I train my puppy not to bite?" },
  { icon: HelpCircle, text: "What are signs my cat might be sick?" },
]

export function ChatInterface() {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput("")
  }

  const handleSuggestedQuestion = (question: string) => {
    if (isLoading) return
    sendMessage({ text: question })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="container mx-auto flex h-[calc(100vh-10rem)] max-w-4xl flex-col px-4 py-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Bot className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mb-2 text-2xl font-bold md:text-3xl">PawPal AI Assistant</h1>
        <p className="text-muted-foreground">
          Ask me anything about pet care, training, health, or adoption!
        </p>
      </div>

      {/* Messages Area */}
      <Card className="flex-1 overflow-hidden border-border/50">
        <CardContent className="flex h-full flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center">
                <Sparkles className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="mb-6 text-center text-muted-foreground">
                  Start a conversation or try one of these questions:
                </p>
                <div className="grid w-full max-w-lg gap-3 sm:grid-cols-2">
                  {suggestedQuestions.map((q, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(q.text)}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left text-sm transition-colors hover:border-primary/30 hover:bg-secondary"
                    >
                      <q.icon className="h-5 w-5 shrink-0 text-primary" />
                      <span>{q.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" && "flex-row-reverse"
                    )}
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback
                        className={cn(
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent text-accent-foreground"
                        )}
                      >
                        {message.role === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      )}
                    >
                      {message.parts.map((part, index) => {
                        if (part.type === "text") {
                          return (
                            <p key={index} className="whitespace-pre-wrap leading-relaxed">
                              {part.text}
                            </p>
                          )
                        }
                        return null
                      })}
                    </div>
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3">
                      <Spinner className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about pet care, training, health..."
                className="min-h-[52px] resize-none"
                rows={1}
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="h-[52px] w-[52px] shrink-0"
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? (
                  <Spinner className="h-5 w-5" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              For emergencies, always contact a veterinarian immediately.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
