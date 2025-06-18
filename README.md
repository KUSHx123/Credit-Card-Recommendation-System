# Credit Card Advisor AI

An AI-powered credit card recommendation system that helps users find the perfect credit card based on their financial profile and spending habits.

## 🚀 Features

- **AI-Powered Conversations**: Uses OpenAI Assistants API for intelligent, context-aware conversations
- **Personalized Recommendations**: Analyzes user profile to suggest the best-fit credit cards
- **User Authentication**: Secure login/signup with Supabase Auth
- **Chat History**: Persistent conversation storage in Supabase database
- **Card Comparison**: Side-by-side comparison of selected credit cards
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Real-time Chat**: Interactive chat interface with typing indicators

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (Database + Auth)
- **AI**: OpenAI Assistants API
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📋 Prerequisites

Before running this project, make sure you have:

1. Node.js (v18 or higher)
2. A Supabase account and project
3. An OpenAI API account with access to Assistants API

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
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### 3. Supabase Database Setup

Run the following SQL commands in your Supabase SQL editor:

```sql
-- Create user profiles table
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  monthly_income INTEGER,
  spending_habits JSONB,
  preferred_benefits TEXT[],
  credit_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat sessions table
CREATE TABLE chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assistant_id TEXT,
  thread_id TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat messages table
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create credit cards table
CREATE TABLE credit_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  image_url TEXT,
  joining_fee INTEGER DEFAULT 0,
  annual_fee INTEGER DEFAULT 0,
  reward_type TEXT NOT NULL,
  reward_rate DECIMAL,
  min_income INTEGER,
  min_credit_score INTEGER,
  special_perks TEXT[],
  categories JSONB,
  features TEXT[],
  apply_link TEXT,
  welcome_bonus TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own profiles" ON user_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own chat sessions" ON chat_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access messages from their sessions" ON chat_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_messages.session_id 
      AND chat_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can read credit cards" ON credit_cards
  FOR SELECT USING (true);
```

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173
Deployed Link: https://credit-card-recommendation-system.vercel.app/`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth)
├── data/              # Static data (credit cards)
├── hooks/             # Custom React hooks
├── lib/               # External service configurations
├── pages/             # Page components
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── App.tsx            # Main application component
```

## 🔑 Key Features Explained

### AI-Powered Conversations
- Uses OpenAI Assistants API for natural language processing
- Maintains conversation context across messages
- Asks relevant questions to build user profile

### Recommendation Engine
- Analyzes user income, spending habits, and preferences
- Scores and ranks credit cards based on compatibility
- Provides detailed reasons for each recommendation

### User Authentication
- Secure authentication with Supabase Auth
- Protected routes for authenticated users
- Persistent user sessions

### Database Integration
- Stores user profiles and preferences
- Maintains chat history for each user
- Tracks conversation sessions and status

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
- `VITE_OPENAI_API_KEY`

## 📱 Usage

1. **Sign Up/Login**: Create an account or sign in
2. **Start Chat**: Begin conversation with the AI advisor
3. **Answer Questions**: Provide information about income, spending, preferences
4. **Get Recommendations**: Receive personalized credit card suggestions
5. **Compare Cards**: Select multiple cards for detailed comparison
6. **Apply**: Use provided links to apply for chosen cards

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please open an issue in the GitHub repository.
