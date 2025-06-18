import OpenAI from 'openai';

// Initialize OpenAI with error handling
let openai: OpenAI | null = null;

try {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (apiKey && apiKey !== 'your_openai_api_key_here') {
    openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
  }
} catch (error) {
  console.warn('OpenAI initialization failed:', error);
}

export class OpenAIAssistant {
  private assistantId: string | null = null;
  private threadId: string | null = null;
  private isAvailable: boolean = false;

  constructor() {
    this.isAvailable = openai !== null;
  }

  async createAssistant() {
    if (!this.isAvailable || !openai) {
      throw new Error('OpenAI is not available. Please check your API key.');
    }

    try {
      const assistant = await openai.beta.assistants.create({
        name: "Credit Card Advisor",
        instructions: `You are a helpful credit card advisor for Indian consumers. Your role is to:

1. Ask relevant questions about the user's financial profile in a conversational manner:
   - Monthly income (ask for approximate range if they're hesitant)
   - Spending habits by category:
     * Fuel expenses per month
     * Travel/flight bookings per month  
     * Grocery shopping per month
     * Dining out per month
     * Online shopping per month
     * Utility bills per month
   - Preferred benefits (ask them to choose from: cashback, travel points, lounge access, movie tickets, fuel benefits, dining discounts)
   - Existing credit cards (optional - ask if they want to mention any)
   - Credit score (ask for approximate range: Excellent 750+, Good 650-750, Fair 600-650, or "I don't know")

2. Keep conversations friendly, professional, and focused. Ask ONE question at a time and wait for responses.

3. Use natural language and provide context for why you're asking each question.

4. When you have gathered enough information (at least income, 2-3 spending categories, and preferred benefits), summarize their profile and indicate that you're ready to provide personalized recommendations.

5. Always be encouraging and explain how the information will help provide better recommendations.

Start by greeting the user warmly and asking about their monthly income in a friendly way.`,
        model: "gpt-4o",
        tools: []
      });

      this.assistantId = assistant.id;
      return assistant.id;
    } catch (error) {
      console.error('Error creating assistant:', error);
      throw error;
    }
  }

  async createThread() {
    if (!this.isAvailable || !openai) {
      throw new Error('OpenAI is not available. Please check your API key.');
    }

    try {
      const thread = await openai.beta.threads.create();
      this.threadId = thread.id;
      return thread.id;
    } catch (error) {
      console.error('Error creating thread:', error);
      throw error;
    }
  }

  async sendMessage(message: string) {
    if (!this.threadId || !this.assistantId || !this.isAvailable || !openai) {
      throw new Error('Thread, Assistant not initialized, or OpenAI not available');
    }

    try {
      // Add message to thread
      await openai.beta.threads.messages.create(this.threadId, {
        role: "user",
        content: message
      });

      // Run the assistant
      const run = await openai.beta.threads.runs.create(this.threadId, {
        assistant_id: this.assistantId
      });

      // Wait for completion
      let runStatus = await openai.beta.threads.runs.retrieve(this.threadId, run.id);
      
      while (runStatus.status === 'running' || runStatus.status === 'queued') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(this.threadId, run.id);
      }

      if (runStatus.status === 'completed') {
        // Get the latest messages
        const messages = await openai.beta.threads.messages.list(this.threadId);
        const latestMessage = messages.data[0];
        
        if (latestMessage.role === 'assistant' && latestMessage.content[0].type === 'text') {
          return latestMessage.content[0].text.value;
        }
      }

      throw new Error('Failed to get response from assistant');
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  getAssistantId() {
    return this.assistantId;
  }

  getThreadId() {
    return this.threadId;
  }

  setAssistantId(id: string) {
    this.assistantId = id;
  }

  setThreadId(id: string) {
    this.threadId = id;
  }

  isOpenAIAvailable() {
    return this.isAvailable;
  }
}

export const openaiAssistant = new OpenAIAssistant();