# Credit Card Advisor AI

An AI-powered credit card recommendation system that helps users find the perfect credit card based on their financial profile and spending habits. Now with WhatsApp integration and guest mode support!

## 🚀 Features

- **AI-Powered Conversations**: Uses OpenAI Assistants API for intelligent, context-aware conversations with fallback to guided questionnaire
- **Guest Mode**: Full access to recommendations without requiring account creation
- **Personalized Recommendations**: Analyzes user profile to suggest the best-fit credit cards from 20+ Indian banks
- **User Authentication**: Secure login/signup with Supabase Auth
- **Profile Management**: Comprehensive user profile page with spending habits and preferences
- **WhatsApp Integration**: Complete WhatsApp bot integration using Twilio API
- **Chat History**: Persistent conversation storage in Supabase database
- **Card Comparison**: Side-by-side comparison of selected credit cards
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Real-time Chat**: Interactive chat interface with option-based questions

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (Database + Auth + Edge Functions)
- **AI**: OpenAI Assistants API (with intelligent fallback)
- **WhatsApp**: Twilio API integration
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📋 Prerequisites

Before running this project, make sure you have:

1. Node.js (v18 or higher)
2. A Supabase account and project
3. An OpenAI API account with access to Assistants API (optional - fallback mode available)
4. A Twilio account for WhatsApp integration (optional)

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd credit-card-advisor-ai
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Required - Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional - OpenAI Configuration (fallback mode if not provided)
VITE_OPENAI_API_KEY=your_openai_api_key

# Optional - Twilio WhatsApp Integration
VITE_TWILIO_ACCOUNT_SID=your_twilio_account_sid
VITE_TWILIO_AUTH_TOKEN=your_twilio_auth_token
VITE_TWILIO_PHONE_NUMBER=whatsapp:+your_twilio_whatsapp_number
```

### 3. Supabase Database Setup

The database schema is automatically set up using Supabase migrations. The migrations include:

- User profiles table
- Chat sessions and messages
- Credit cards database
- WhatsApp sessions and messages
- Row Level Security (RLS) policies
- Proper indexes for performance

### 4. Deploy Supabase Edge Functions (for WhatsApp)

If you want to use WhatsApp integration:

```bash
# Deploy the WhatsApp webhook function
supabase functions deploy whatsapp-webhook
```

### 5. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

**Deployed Link**: [CardAdvisor AI](https://credit-card-recommendation-system.vercel.app/)

Video link: [LINK](https://animoto.com/play/pMlQaAJ4YIi14PTUtTK53Q)

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CardRecommendation.tsx
│   ├── ChatInterface.tsx
│   ├── ComparisonView.tsx
│   ├── Navigation.tsx
│   ├── ProtectedRoute.tsx
│   └── WhatsAppIntegration.tsx
├── contexts/           # React contexts (Auth with guest mode)
├── data/              # Static data (20+ credit cards)
├── lib/               # External service configurations
│   ├── openai.ts      # OpenAI Assistants API
│   ├── supabase.ts    # Supabase client
│   └── twilio.ts      # Twilio WhatsApp service
├── pages/             # Page components
│   ├── HomePage.tsx   # Landing page with auth
│   ├── ChatPage.tsx   # Main chat interface
│   └── ProfilePage.tsx # User profile management
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
│   └── recommendationEngine.ts # AI recommendation logic
└── App.tsx            # Main application component
```

## 🔑 Key Features Explained

### AI-Powered Conversations with Fallback
- Primary: Uses OpenAI Assistants API for natural language processing
- Fallback: Guided questionnaire system when OpenAI is unavailable
- Maintains conversation context across messages
- Option-based responses for better user experience

### Guest Mode
- Full access to credit card recommendations without account creation
- Seamless upgrade path to full account
- No feature limitations for guest users
- Persistent session management

### WhatsApp Integration
- Complete WhatsApp bot using Twilio API
- Guided conversation flow via WhatsApp messages
- Automatic webhook handling with Supabase Edge Functions
- Message history storage and session management
- Easy setup through profile page

### Recommendation Engine
- Analyzes user income, spending habits, and preferences
- Scores and ranks 20+ credit cards based on compatibility
- Provides detailed reasons for each recommendation
- Estimates annual rewards based on spending patterns

### User Profile Management
- Comprehensive profile page for authenticated users
- Spending habits tracking across multiple categories
- Benefit preferences selection
- Credit score range input
- WhatsApp integration configuration

### Database Integration
- Stores user profiles and preferences
- Maintains chat history for each user
- Tracks conversation sessions and status
- WhatsApp conversation storage
- Row Level Security for data protection

## 📱 WhatsApp Bot Setup

1. **Create Twilio Account**: Sign up at [twilio.com](https://twilio.com)
2. **WhatsApp Sandbox**: Set up WhatsApp Sandbox in Twilio Console
3. **Environment Variables**: Add Twilio credentials to your `.env` file
4. **Deploy Webhook**: Deploy the Supabase edge function
5. **Configure Webhook**: Set webhook URL in Twilio Console
6. **Test Integration**: Use the profile page to test the connection

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Environment Variables for Production

Make sure to set these in your deployment platform:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_OPENAI_API_KEY` (optional)
- `VITE_TWILIO_ACCOUNT_SID` (optional)
- `VITE_TWILIO_AUTH_TOKEN` (optional)
- `VITE_TWILIO_PHONE_NUMBER` (optional)

## 📱 Usage

### Web Application
1. **Visit Website**: Go to the deployed URL or run locally
2. **Choose Mode**: Sign up/login or continue as guest
3. **Start Chat**: Begin conversation with the AI advisor
4. **Answer Questions**: Provide information about income, spending, preferences
5. **Get Recommendations**: Receive personalized credit card suggestions
6. **Compare Cards**: Select multiple cards for detailed comparison
7. **Apply**: Use provided links to apply for chosen cards

### WhatsApp Bot
1. **Add Number**: Add the Twilio WhatsApp number to your contacts
2. **Send Message**: Send any message to start the conversation
3. **Follow Prompts**: Answer questions using numbered options
4. **Get Recommendations**: Receive top 3 personalized recommendations
5. **Restart**: Send "restart" to begin a new consultation

## 🎯 Credit Card Database

The system includes 20+ Indian credit cards from major banks:
- HDFC Bank, SBI, Axis Bank, ICICI Bank
- Kotak Mahindra, IndusInd, YES Bank
- Standard Chartered, Citibank, RBL Bank
- And many more regional banks

Each card includes:
- Detailed fee structure
- Reward rates and categories
- Eligibility criteria
- Special perks and benefits
- Application links

## 🔒 Security Features

- Row Level Security (RLS) on all database tables
- Secure authentication with Supabase Auth
- Environment variable protection
- Guest mode with no data persistence
- Encrypted API communications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please open an issue in the GitHub repository.

## 🔄 Recent Updates

- ✅ Added guest mode for immediate access
- ✅ Implemented WhatsApp bot integration
- ✅ Enhanced chat interface with option-based responses
- ✅ Added comprehensive profile management
- ✅ Improved recommendation engine
- ✅ Added fallback mode for OpenAI unavailability
- ✅ Enhanced mobile responsiveness
- ✅ Added card comparison feature
