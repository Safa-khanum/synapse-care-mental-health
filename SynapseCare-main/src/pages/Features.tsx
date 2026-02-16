import { useState } from 'react';
import { Brain, MessageCircle, AlertTriangle, FileText, Play, BookOpen, ChevronRight } from 'lucide-react';

interface FeaturesProps {
  onNavigate: (page: string) => void;
}

export default function Features({ onNavigate }: FeaturesProps) {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 0,
      icon: Brain,
      title: 'AI Mental Health Detection',
      subtitle: 'Advanced Neural Network Analysis',
      description: 'Our sophisticated AI system uses Convolutional Neural Networks (CNN) and Natural Language Processing (NLP) to analyze voice patterns, text content, and behavioral indicators. The system can accurately detect signs of anxiety, depression, and stress levels through multi-modal data analysis.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      capabilities: [
        'Real-time voice tone analysis',
        'Text sentiment and pattern recognition',
        'Behavioral trend monitoring',
        'Personalized risk assessment',
      ],
    },
    {
      id: 1,
      icon: MessageCircle,
      title: 'AI Therapy Chatbot',
      subtitle: 'Your 24/7 Mental Health Support',
      description: 'An intelligent conversational AI that provides personalized therapy sessions, evidence-based coping strategies, and motivational content. The chatbot adapts to your communication style and emotional state, offering empathetic support whenever you need it.',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      capabilities: [
        'Personalized therapy sessions',
        'Cognitive behavioral techniques',
        'Mindfulness and relaxation exercises',
        'Daily motivational content',
      ],
    },
    {
      id: 2,
      icon: AlertTriangle,
      title: 'Suicide Risk Prediction',
      subtitle: 'Early Detection & Intervention',
      description: 'A critical safety feature that uses advanced behavioral analytics, communication pattern analysis, and psychological indicators to identify individuals at risk. The system provides early warnings and connects users with appropriate support resources immediately.',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      capabilities: [
        'Behavioral pattern analysis',
        'Crisis detection algorithms',
        'Immediate alert system',
        'Emergency resource connection',
      ],
    },
    {
      id: 3,
      icon: FileText,
      title: 'Lab Report Digitizer',
      subtitle: 'Simplify Complex Medical Data',
      description: 'Utilizing OCR technology and Natural Language Processing, this feature converts physical lab reports into digital, easy-to-understand summaries. Results are color-coded for quick interpretation, with explanations of what each metric means for your health.',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      capabilities: [
        'OCR document scanning',
        'Intelligent data extraction',
        'Color-coded health metrics',
        'Plain language explanations',
      ],
    },
  ];

  const activeFeatureData = features[activeFeature];
  const ActiveIcon = activeFeatureData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features for Complete Health Care
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive suite of AI-powered tools designed to support your mental and physical wellness
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`p-6 rounded-xl text-left transition-all transform hover:scale-105 ${
                  activeFeature === feature.id
                    ? `bg-gradient-to-br ${feature.color} text-white shadow-xl`
                    : 'bg-white text-gray-600 hover:shadow-lg'
                }`}
              >
                <Icon className={`w-8 h-8 mb-3 ${activeFeature === feature.id ? 'text-white' : 'text-gray-400'}`} />
                <h3 className={`font-semibold text-lg ${activeFeature === feature.id ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
              </button>
            );
          })}
        </div>

        <div className={`${activeFeatureData.bgColor} rounded-2xl p-8 md:p-12 mb-8`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${activeFeatureData.color} mb-6`}>
                <ActiveIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {activeFeatureData.title}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {activeFeatureData.subtitle}
              </p>
              <p className="text-gray-700 mb-8 leading-relaxed">
                {activeFeatureData.description}
              </p>

              <div className="space-y-3 mb-8">
                {activeFeatureData.capabilities.map((capability, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${activeFeatureData.color}`} />
                    <span className="text-gray-700">{capability}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate('therapy')}
                  className={`px-6 py-3 font-medium text-white bg-gradient-to-r ${activeFeatureData.color} rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2`}
                >
                  <span>Try Now</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="px-6 py-3 font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>View Demo</span>
                </button>
                <button className="px-6 py-3 font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Learn More</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br ${activeFeatureData.color} rounded-full mb-4 animate-pulse`}>
                    <ActiveIcon className="w-16 h-16 text-white" />
                  </div>
                  <p className="text-gray-500">Feature Visualization</p>
                  <p className="text-sm text-gray-400 mt-2">Demo content placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
            <p className="text-gray-600">Detection Accuracy</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
            <p className="text-gray-600">AI Support Available</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl font-bold text-teal-600 mb-2">100%</div>
            <p className="text-gray-600">Privacy Protected</p>
          </div>
        </div>
      </div>
    </div>
  );
}
