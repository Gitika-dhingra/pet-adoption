import { streamText, convertToModelMessages } from 'ai'
import { groq } from '@ai-sdk/groq'

const groqModel = groq('llama-3.3-70b-versatile')

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
    const { messages } = await req.json()

    const result = streamText({
      model: groqModel,
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      abortSignal: req.signal,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 })
  }
}
