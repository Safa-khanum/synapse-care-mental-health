import { useState } from 'react';
import { Send, Sparkles, Heart, Smile, TrendingUp, Book } from 'lucide-react';

interface TherapyProps {
  onNavigate: (page: string) => void;
}

export default function Therapy({ onNavigate }: TherapyProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: "Hello! I'm your AI therapist. I'm here to provide support and guidance. How are you feeling today?",
      time: '10:30 AM',
    },
  ]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      type: "user",
      content: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);

    const text = message;
    setMessage("");

    try {
      const response = await fetch("http://localhost:5001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();

      const botMessage = {
        type: "ai",
        content: data.reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (err) {
      console.error("Backend error:", err);
    }
  };



  const dailyTips = [
    {
      icon: Heart,
      title: 'Practice Gratitude',
      description: 'Take a moment to appreciate three things you are grateful for today.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Smile,
      title: 'Mindful Breathing',
      description: 'Try the 4-7-8 breathing technique to calm your mind and reduce stress.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: TrendingUp,
      title: 'Set Small Goals',
      description: 'Break down your tasks into manageable steps to build momentum.',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const copingExercises = [
    'Deep Breathing Exercise',
    'Progressive Muscle Relaxation',
    'Guided Meditation',
    'Journaling Prompts',
    'Positive Affirmations',
    'Grounding Techniques',
  ];

  const motivationalQuotes = [
    {
      quote: "You are stronger than you think, braver than you believe, and more capable than you imagine.",
      author: "Synapse Care",
    },
    {
      quote: "Every small step forward is progress. Be proud of how far you've come.",
      author: "Synapse Care",
    },
    {
      quote: "Your mental health is a priority, not a luxury. Take time for yourself today.",
      author: "Synapse Care",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Therapy & Support
          </h1>
          <p className="text-xl text-gray-600">
            Your personal AI therapist is here to provide support, guidance, and coping strategies
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="font-semibold">AI Therapist</h2>
                  <p className="text-sm text-green-100">Always here to support you</p>
                </div>
              </div>
            </div>

            <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md p-4 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-800 shadow-md'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-2 ${msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 text-left font-medium text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all shadow-md">
                  Start Therapy
                </button>
                <button className="w-full px-4 py-3 text-left font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all">
                  Track Mood
                </button>
                <button className="w-full px-4 py-3 text-left font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all">
                  Get Motivation
                </button>
                <button
                  onClick={() => onNavigate('reports')}
                  className="w-full px-4 py-3 text-left font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                >
                  View Progress
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-green-400 rounded-xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-bold mb-2">Today's Motivation</h3>
              <p className="text-sm text-blue-50 mb-4">
                "{motivationalQuotes[0].quote}"
              </p>
              <p className="text-xs text-blue-100">— {motivationalQuotes[0].author}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Tips & Wellness</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dailyTips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${tip.color} mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-gray-600 text-sm">{tip.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Book className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Coping Exercises</h2>
            </div>
            <div className="space-y-3">
              {copingExercises.map((exercise, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between group"
                >
                  <span className="text-gray-700 font-medium">{exercise}</span>
                  <span className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Start →
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Motivational Quotes</h2>
            </div>
            <div className="space-y-4">
              {motivationalQuotes.map((item, index) => (
                <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border border-blue-100">
                  <p className="text-gray-800 italic mb-2">"{item.quote}"</p>
                  <p className="text-sm text-gray-600">— {item.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
