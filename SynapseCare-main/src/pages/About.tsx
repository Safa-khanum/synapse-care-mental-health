import { Brain, Target, Users, Lightbulb, Code, Palette, Database, FileText } from 'lucide-react';

interface AboutProps {
  onNavigate: (page: string) => void;
}

export default function About({ onNavigate }: AboutProps) {
  const team = [
    {
      name: 'Safakhanum',
      role: 'Team Leader & Full Stack Developer',
      icon: Code,
      color: 'from-blue-500 to-blue-600',
      description: 'Leading the technical architecture and full-stack implementation of Synapse Care.',
    },
    {
      name: 'Pakhi',
      role: 'Front-End Developer & UI/UX Designer',
      icon: Palette,
      color: 'from-green-500 to-green-600',
      description: 'Crafting beautiful, intuitive user interfaces and experiences.',
    },
    {
      name: 'Rakshita',
      role: 'Backend Developer & Data Manager',
      icon: Database,
      color: 'from-teal-500 to-teal-600',
      description: 'Building robust backend systems and managing data infrastructure.',
    },
    {
      name: 'Rekha',
      role: 'Documentation & Presentation',
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      description: 'Creating comprehensive documentation and project presentations.',
    },
  ];

  const values = [
    {
      icon: Brain,
      title: 'Innovation',
      description: 'Leveraging cutting-edge AI technology to revolutionize healthcare accessibility.',
    },
    {
      icon: Target,
      title: 'Accuracy',
      description: 'Providing precise and reliable health insights through advanced analytics.',
    },
    {
      icon: Users,
      title: 'Empathy',
      description: 'Understanding and supporting users with compassionate, personalized care.',
    },
    {
      icon: Lightbulb,
      title: 'Accessibility',
      description: 'Making mental and physical health support available to everyone, anytime.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Synapse Care
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pioneering the future of integrated mental and physical healthcare through artificial intelligence
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-green-400 rounded-2xl p-12 text-white mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Purpose</h2>
            <p className="text-lg text-blue-50 leading-relaxed mb-8">
              Synapse Care was born from a vision to transform healthcare by bridging the gap between mental and
              physical wellness. We believe that comprehensive health monitoring should be accessible, intelligent,
              and personalized for everyone. Our AI-powered platform combines advanced machine learning, natural
              language processing, and deep neural networks to provide early detection, continuous support, and
              actionable insights for your health journey.
            </p>
            <div className="flex justify-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full">
                <Brain className="w-10 h-10 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              To revolutionize healthcare accessibility by leveraging artificial intelligence to provide early
              detection, personalized support, and comprehensive health monitoring for mental and physical wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all text-center"
                >
                  <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-blue-500 to-green-400 mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet the Team</h2>
            <p className="text-lg text-gray-600">
              A dedicated group of innovators from BMS Institute of Technology, Yelahanka, Bangalore
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, index) => {
              const Icon = member.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-start space-x-6">
                    <div className={`flex-shrink-0 p-4 rounded-xl bg-gradient-to-br ${member.color}`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                      <p className="text-gray-600">{member.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-12 shadow-lg">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
              Project Overview
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                Synapse Care is a comprehensive AI-powered platform designed to provide integrated mental and
                physical health monitoring. Developed at BMS Institute of Technology, our project represents
                the convergence of healthcare expertise and cutting-edge artificial intelligence.
              </p>
              <p>
                Our platform utilizes advanced technologies including Convolutional Neural Networks (CNN),
                Natural Language Processing (NLP), and Optical Character Recognition (OCR) to deliver four
                core features: mental health detection, AI therapy chatbot, suicide risk prediction, and
                lab report digitization.
              </p>
              <p>
                By making healthcare more accessible, intelligent, and personalized, Synapse Care aims to
                empower individuals to take control of their wellness journey with confidence and support.
              </p>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">BMS Institute of Technology</h3>
                  <p className="text-gray-600 text-sm">
                    Yelahanka, Bangalore, Karnataka, India
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => onNavigate('contact')}
                className="px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-green-400 rounded-lg hover:from-blue-600 hover:to-green-500 transition-all shadow-lg hover:shadow-xl"
              >
                Get in Touch
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
