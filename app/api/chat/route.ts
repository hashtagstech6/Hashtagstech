import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages } from 'ai';

/**
 * POST /api/chat
 *
 * Streaming chat API using OpenAI GPT-4o-mini via Vercel AI SDK v6.
 * Edge Runtime for global low-latency deployment.
 */
export const runtime = 'edge';
export const maxDuration = 30;

const SYSTEM_PROMPT = `You are the AI assistant for Hashtag Tech — a digital agency operating in Europe, Middle East & Pakistan. You help visitors learn about the company, its services, and guide them to the right pages.

ABOUT THE COMPANY:
- Hashtag Tech is a full-service digital agency specializing in web & app development, AI solutions, and social media marketing.
- Operating globally from Europe, Middle East & Pakistan.
- CEO: Nasir Siddique

SERVICES:
- Full-Stack Web & App Development
- AI Solutions & Automation
- Social Media Marketing & Digital Strategy
- UI/UX Design
- E-Commerce Solutions

WEBSITE PAGES (use markdown links when relevant):
- Home: [Home](/)
- About Us: [About Us](/about)
- Services: [Services](/services)
- Team: [Our Team](/team)
- Blog: [Blog](/blog)
- Careers: [Careers](/career)
- Contact: [Contact Us](/contact)

GUIDELINES:
- Be friendly, professional, and concise (1-3 sentences per response).
- If the user simply greets you, only reply with a polite greeting back. Do NOT add extra information unless asked.
- When mentioning pages or services, use markdown links.
- If someone asks about pricing, suggest they reach out via the [Contact](/contact) page.
- You can answer general knowledge questions too, but steer back to Hashtag Tech when relevant.
- Never make up information about the company that isn't listed above.`;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: await convertToModelMessages(messages),
      system: SYSTEM_PROMPT,
      temperature: 0.7,
      maxOutputTokens: 500,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('[API /api/chat] Error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An error occurred',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
