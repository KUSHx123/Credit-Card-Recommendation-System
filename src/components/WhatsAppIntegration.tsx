import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Phone, CheckCircle, AlertCircle, Copy, ExternalLink, Shield } from 'lucide-react';
import { twilioService } from '../lib/twilio';

export const WhatsAppIntegration: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    setWebhookUrl(twilioService.getWebhookUrl());
    setIsConfigured(twilioService.isConfigured());
    if (twilioService.isConfigured()) {
      checkConnection();
    }
  }, []);

  const checkConnection = async () => {
    setLoading(true);
    try {
      const messages = await twilioService.getMessages(5);
      setRecentMessages(messages);
      setIsConnected(true);
    } catch (error) {
      console.error('WhatsApp connection check failed:', error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const sendTestMessage = async () => {
    const testNumber = 'whatsapp:+919667846370'; // Your WhatsApp number
    const testMessage = 'Hello! This is a test message from CardAdvisor AI. WhatsApp integration is working! 🎉';
    
    setLoading(true);
    try {
      const success = await twilioService.sendMessage(testNumber, testMessage);
      if (success) {
        alert('Test message sent successfully!');
        checkConnection(); // Refresh messages
      } else {
        alert('Failed to send test message. Please check your Twilio configuration.');
      }
    } catch (error) {
      alert('Error sending test message: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    alert('Webhook URL copied to clipboard!');
  };

  if (!isConfigured) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">WhatsApp Integration</h3>
            <p className="text-gray-600">Configuration Required</p>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-orange-800">Twilio Credentials Required</span>
          </div>
          <p className="text-orange-700 text-sm">
            WhatsApp integration requires Twilio credentials to be configured in your environment variables.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Required Environment Variables</h4>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-700">VITE_TWILIO_ACCOUNT_SID</p>
              <p className="text-xs text-gray-500">Your Twilio Account SID</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-700">VITE_TWILIO_AUTH_TOKEN</p>
              <p className="text-xs text-gray-500">Your Twilio Auth Token</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-700">VITE_TWILIO_PHONE_NUMBER</p>
              <p className="text-xs text-gray-500">Your Twilio WhatsApp number (format: whatsapp:+1234567890)</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Setup Instructions</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Create a Twilio account at <a href="https://twilio.com" target="_blank" rel="noopener noreferrer" className="underline">twilio.com</a></li>
              <li>2. Set up WhatsApp Sandbox in Twilio Console</li>
              <li>3. Get your Account SID and Auth Token from Twilio Console</li>
              <li>4. Add the environment variables to your .env file</li>
              <li>5. Restart your application</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">WhatsApp Integration</h3>
          <p className="text-gray-600">Connect with users via WhatsApp</p>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-6">
        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          isConnected ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          {isConnected ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <span className={`font-medium ${isConnected ? 'text-green-800' : 'text-red-800'}`}>
            {isConnected ? 'WhatsApp Connected' : 'WhatsApp Disconnected'}
          </span>
        </div>
      </div>

      {/* Webhook Configuration */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Webhook Configuration</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">Configure this webhook URL in your Twilio Console:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white px-3 py-2 rounded border text-sm font-mono">
              {webhookUrl}
            </code>
            <button
              onClick={copyWebhookUrl}
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              title="Copy webhook URL"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3">
            <a
              href="https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Configure in Twilio Console
            </a>
          </div>
        </div>
      </div>

      {/* Test Connection */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Test Integration</h4>
        <div className="flex gap-3">
          <button
            onClick={checkConnection}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
          >
            {loading ? 'Checking...' : 'Check Connection'}
          </button>
          <button
            onClick={sendTestMessage}
            disabled={loading || !isConnected}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
          >
            {loading ? 'Sending...' : 'Send Test Message'}
          </button>
        </div>
      </div>

      {/* Recent Messages */}
      {recentMessages.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Recent Messages</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {recentMessages.map((message, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {message.direction === 'inbound' ? 'From' : 'To'}: {message.from || message.to}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.dateCreated).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{message.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Setup Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Setup Instructions</h4>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Copy the webhook URL above</li>
          <li>2. Go to Twilio Console → WhatsApp Sandbox Settings</li>
          <li>3. Paste the webhook URL in the "When a message comes in" field</li>
          <li>4. Set HTTP method to POST</li>
          <li>5. Save configuration and test with a WhatsApp message</li>
        </ol>
      </div>

      {/* How It Works */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-2">How It Works</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Users send WhatsApp messages to your Twilio number</li>
          <li>• Twilio forwards messages to your webhook endpoint</li>
          <li>• Your AI assistant processes the message and generates responses</li>
          <li>• Responses are sent back to users via WhatsApp</li>
          <li>• Full conversation history is stored in your database</li>
        </ul>
      </div>
    </div>
  );
};