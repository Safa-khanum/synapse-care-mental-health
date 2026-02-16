import { Brain, MessageCircle, AlertTriangle, FileText, ArrowRight, Heart, Shield, Sparkles } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const features = [
    {
      icon: Brain,
      title: 'Anxiety & Depression Detection',
      description: 'AI-powered analysis using CNN + NLP on voice & text patterns',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: MessageCircle,
      title: 'AI Therapist',
      description: 'Personalized therapy sessions and coping strategies',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: AlertTriangle,
      title: 'Suicide Risk Prediction',
      description: 'Early detection using behavioral and text pattern analytics',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: FileText,
      title: 'Lab Report Analyzer',
      description: 'OCR + NLP to digitize and simplify medical reports',
      color: 'from-teal-500 to-teal-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="pt-20 pb-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Healthcare Innovation</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your Personal
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent"> AI Health </span>
            Companion
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            An integrated platform for mental & physical health monitoring, providing intelligent insights
            and personalized support for your wellness journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => onNavigate('features')}
              className="px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-green-400 rounded-lg hover:from-blue-600 hover:to-green-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Try Synapse Care
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="px-8 py-4 text-lg font-medium text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Learn More
            </button>
          </div>

          <div className="relative mx-auto max-w-4xl">
            <div className="bg-gradient-to-br from-blue-500 to-green-400 rounded-2xl p-1 shadow-2xl">
              <div className="bg-white rounded-xl p-8 flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-green-400 rounded-full mb-4">
                    <Brain className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-gray-500 text-sm">AI-Powered Health Analytics Dashboard</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Our Core Features
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive AI-driven tools for holistic health management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer group"
                  onClick={() => onNavigate('features')}
                >
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="py-16">
          <div className="bg-gradient-to-br from-blue-500 to-green-400 rounded-2xl p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                About Synapse Care
              </h2>
              <p className="text-lg text-blue-50 mb-8">
                Synapse Care is an innovative AI-powered platform designed to bridge the gap between
                mental and physical health monitoring. Our mission is to provide accessible, intelligent,
                and personalized healthcare support to everyone who needs it.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <Heart className="w-8 h-8 mb-3 mx-auto" />
                  <h3 className="font-semibold mb-2">Compassionate Care</h3>
                  <p className="text-sm text-blue-50">Empathetic AI that understands your needs</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <Shield className="w-8 h-8 mb-3 mx-auto" />
                  <h3 className="font-semibold mb-2">Secure & Private</h3>
                  <p className="text-sm text-blue-50">Your health data is protected and confidential</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <Brain className="w-8 h-8 mb-3 mx-auto" />
                  <h3 className="font-semibold mb-2">Intelligent Insights</h3>
                  <p className="text-sm text-blue-50">Advanced AI for accurate health analysis</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="bg-blue-50 rounded-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              To revolutionize healthcare accessibility by leveraging artificial intelligence
              to provide early detection, personalized support, and comprehensive health monitoring
              for mental and physical wellness.
            </p>
            <button
              onClick={() => onNavigate('about')}
              className="px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-green-400 rounded-lg hover:from-blue-600 hover:to-green-500 transition-all shadow-lg hover:shadow-xl"
            >
              Meet Our Team
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
