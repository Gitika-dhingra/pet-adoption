import {
  streamText,
} from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

const gemini = createOpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: process.env.GEMINI_BASE_URL ?? 'https://gemini.googleapis.com/v1',
})

export const maxDuration = 30

const SYSTEM_PROMPT = `You are PawPal, a friendly and knowledgeable AI assistant specialized in pet care and animal welfare. You help users with:

1. Pet care advice (nutrition, grooming, training, health)
2. Information about different pet breeds and their characteristics
3. Adoption guidance and what to expect with new pets
4. Basic health information (always recommend consulting a vet for serious concerns)
5. Training tips and behavioral advice
6. Information about local pet services and resources

Guidelines:
- Be warm, friendly, and encouraging
- Use simple language that's easy to understand
- Always recommend consulting a veterinarian for health concerns
- Be supportive of pet adoption and animal welfare
- If asked about emergency situations, advise immediate vet contact
- Share relevant facts about animals when appropriate
- Be patient and understanding with first-time pet owners

You can also help users understand more about specific pets available for adoption on PawFinder.`

export async function POST(req: Request) {
  try {
    const { text }: { text: string } = await req.json()

    const messages = [{ role: 'user' as const, content: text }]

    const result = streamText({
      model: gemini('gemini-1.5-pro'),
      system: SYSTEM_PROMPT,
      messages: messages,
      abortSignal: req.signal,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 })
  }
}
