// Twilio configuration for WhatsApp integration
export const TWILIO_CONFIG = {
  accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID,
  authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN,
  phoneNumber: import.meta.env.VITE_TWILIO_PHONE_NUMBER,
};

export class TwilioWhatsAppService {
  private accountSid: string;
  private authToken: string;
  private phoneNumber: string;

  constructor() {
    this.accountSid = TWILIO_CONFIG.accountSid;
    this.authToken = TWILIO_CONFIG.authToken;
    this.phoneNumber = TWILIO_CONFIG.phoneNumber;

    // Validate that credentials are provided
    if (!this.accountSid || !this.authToken || !this.phoneNumber) {
      console.warn('Twilio credentials not configured. WhatsApp integration will not work.');
    }
  }

  async sendMessage(to: string, message: string): Promise<boolean> {
    if (!this.accountSid || !this.authToken || !this.phoneNumber) {
      console.error('Twilio credentials not configured');
      return false;
    }

    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
      
      const body = new URLSearchParams({
        From: this.phoneNumber,
        To: to,
        Body: message
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.accountSid}:${this.authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Failed to send WhatsApp message:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return false;
    }
  }

  async getMessages(limit: number = 20): Promise<any[]> {
    if (!this.accountSid || !this.authToken) {
      console.error('Twilio credentials not configured');
      return [];
    }

    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json?Limit=${limit}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Basic ${btoa(`${this.accountSid}:${this.authToken}`)}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      console.error('Error fetching WhatsApp messages:', error);
      return [];
    }
  }

  getWebhookUrl(): string {
    // This should be your deployed Supabase edge function URL
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    return `${supabaseUrl}/functions/v1/whatsapp-webhook`;
  }

  isConfigured(): boolean {
    return !!(this.accountSid && this.authToken && this.phoneNumber);
  }
}

export const twilioService = new TwilioWhatsAppService();