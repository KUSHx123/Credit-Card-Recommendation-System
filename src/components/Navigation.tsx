import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, LogOut, MessageCircle, Home, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Navigation: React.FC = () => {
  const { user, isGuest, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Don't show navigation if neither authenticated nor guest
  if (!user && !isGuest) return null;

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/chat" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CardAdvisor AI</h1>
                <p className="text-sm text-gray-600">Find Your Perfect Credit Card</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/chat"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/chat'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Chat
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isGuest ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                  <User className="w-4 h-4" />
                  Guest Mode
                </div>
                <Link
                  to="/"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Sign Up for Full Features
                </Link>
              </div>
            ) : (
              <span className="text-sm text-gray-600">
                Welcome, {user?.email}
              </span>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {isGuest ? 'Exit Guest Mode' : 'Sign Out'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};