/**
 * Vettri TN — AI Service
 * Integrates OpenAI GPT-4 with RAG-style context
 * for Tamil Nadu government services chatbot.
 *
 * Dependencies:
 *   npm install openai
 *
 * Replace EXPO_PUBLIC_OPENAI_API_KEY with your actual key in .env
 *
 * For LangChain integration, install:
 *   npm install langchain @langchain/openai
 */

import OpenAI from 'openai';

// ─── Config ───────────────────────────────────────────────────────────────────
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '';
const MODEL = 'gpt-4o';  // or 'gpt-3.5-turbo' for cost savings

const client = OPENAI_API_KEY
  ? new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    })
  : null;

// ─── Tamil Nadu Government Knowledge Base (RAG context) ───────────────────────
const TN_GOVT_CONTEXT = `
You are Vettri AI — the official AI assistant for the Vettri TN Citizen Super App,
inspired by the vision of Tamilaga Vettri Kazhagam (TVK) for a modern, transparent Tamil Nadu.

You help citizens of Tamil Nadu with:
1. Government certificates & documents (Income, Community, Birth, Caste, Nativity etc.)
2. Welfare scheme enrollment ( Magalir Urimai Thittam, Free Bus Travel, LPG Scheme etc.)
3. Grievance submission and tracking
4. New service requests (housing, utilities, transport, education, health)
5. General government information

Key government services in Tamil Nadu:
- Income Certificate: Submit Aadhaar + Ration Card. Processing: 7 working days. Fee: Free.
- Community Certificate: Submit Aadhaar + caste proof. Processing: 5 working days. Fee: Free.
- Birth Certificate: Submit hospital records. Processing: 3 working days. Fee: ₹20.
- Nativity Certificate: Submit school records + Aadhaar. Processing: 5 working days. Fee: Free.

Key welfare schemes:
-  Magalir Urimai Thittam: ₹1,000/month for women heads of household.
- Chief Minister Free Bus Travel: Free on all TN State Transport buses for women, students, journalists.
- Free LPG Cylinder: 4 free cylinders per year for eligible BPL families.
- Vettri TN Housing Scheme: ₹2.5 lakh subsidy for low-income families to build/repair homes.
- Student Merit Scholarship: ₹5,000/year for students with 75%+ marks from low-income families.
- Fishermen Safety Scheme: ₹20,000 per year for registered fishermen.

Grievance departments:
- Roads/Potholes: Highways Department or Corporation
- Street lights: Local Municipal Corporation
- Water supply: TWAD or Metropolitan Water Supply Board
- Sanitation: Local Body / Corporation
- Electricity: TNEB (TANGEDCO)
- Government service delay: District Collectorate

Always:
- Respond concisely in 3–5 short sentences or bullet points.
- Be warm, helpful, and use a conversational Tamil-friendly tone.
- If you don't know something specific, say so and suggest the citizen visit the nearest CSC or district collectorate.
- Never make up document numbers, eligibility amounts, or scheme names that don't exist.
`;

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ChatMessage {
  role:    'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  message:  string;
  success:  boolean;
  error?:   string;
}

// ─── Chat History Store (In-memory; use AsyncStorage for persistence) ─────────
let conversationHistory: ChatMessage[] = [];

const getOfflineResponse = (userMessage: string): string => {
  const msg = userMessage.toLowerCase();

  if (msg.includes('income') || msg.includes('certificate')) {
    return 'To apply for an Income Certificate:\n\n1. Go to Documents → Request New\n2. Select "Income Certificate"\n3. Upload Aadhaar + Ration Card\n4. Processing takes 7 working days\n\nShall I start your application?';
  }
  if (msg.includes('scheme') || msg.includes('eligible') || msg.includes('welfare')) {
    return 'Based on your profile, you are eligible for:\n\n●  Magalir Urimai Thittam — ₹1,000/month\n● Chief Minister Free Bus Travel\n● Free LPG Cylinder (4/year)\n\nWant me to enroll you in any of these?';
  }
  if (msg.includes('grievance') || msg.includes('gr-') || msg.includes('complaint')) {
    return 'Your grievance GR-2024-0892:\n\nIssue: Street light not working\nLocation: Perambur Main Road\nStatus: Under Review — Chennai Corporation\nETA: 2–3 working days\n\nShall I send a reminder to the assigned officer?';
  }
  if (msg.includes('housing') || msg.includes('house')) {
    return 'The Vettri TN Housing Scheme provides:\n\n● ₹2.5 lakh subsidy\n● For families earning < ₹3L/year\n● Apply via this app or nearest CSC\n\nWould you like to check your eligibility?';
  }
  if (msg.includes('bus') || msg.includes('travel') || msg.includes('transport')) {
    return 'The Free Bus Travel Scheme covers:\n\n● All TNSTC & MTC buses\n● Free for women, students & journalists\n● Show your Vettri TN Citizen ID at the bus stop\n\nYou are already enrolled in this scheme!';
  }
  return 'I can help you with:\n\n● Government certificates & documents\n● Welfare scheme enrollment\n● Grievance tracking\n● New service requests\n● Government scheme information\n\nWhat would you like help with?';
};

export const aiService = {
  /**
   * Send a message to Vettri AI and get a response.
   * Maintains full conversation history for context.
   */
  async sendMessage(userMessage: string): Promise<AIResponse> {
    try {
      if (!client) {
        return {
          message: getOfflineResponse(userMessage),
          success: false,
          error: 'Missing EXPO_PUBLIC_OPENAI_API_KEY',
        };
      }

      conversationHistory.push({ role: 'user', content: userMessage });

      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: TN_GOVT_CONTEXT },
        ...conversationHistory,
      ];

      const response = await client.chat.completions.create({
        model:       MODEL,
        messages,
        max_tokens:  500,
        temperature: 0.6,
      });

      const assistantMessage = response.choices[0]?.message?.content
        ?? 'Sorry, I could not process your request. Please try again.';

      conversationHistory.push({ role: 'assistant', content: assistantMessage });

      // Keep history to last 20 messages to manage token cost
      if (conversationHistory.length > 20) {
        conversationHistory = conversationHistory.slice(-20);
      }

      return { message: assistantMessage, success: true };
    } catch (err: any) {
      console.error('[VettriAI] Error:', err.message);
      return {
        message: 'I am having trouble connecting right now. Please try again in a moment.',
        success: false,
        error:   err.message,
      };
    }
  },

  /**
   * Clear conversation history (called on logout or screen reset)
   */
  clearHistory(): void {
    conversationHistory = [];
  },

  /**
   * Get quick suggestion responses without API call (for offline/demo mode)
   */
  getOfflineResponse(userMessage: string): string {
    return getOfflineResponse(userMessage);
  },
};

export default aiService;
