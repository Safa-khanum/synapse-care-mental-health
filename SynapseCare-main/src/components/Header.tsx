import { Menu, X, Brain } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'labreport', label: 'Lab Report' }, // ✅ ADD HERE
  { id: 'reports', label: 'Reports' },
  { id: 'therapy', label: 'Therapy' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];


  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="bg-gradient-to-br from-blue-500 to-green-400 p-2 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Synapse Care</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => onNavigate('therapy')}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Learn More
            </button>
            <button
              onClick={() => onNavigate('features')}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-green-400 rounded-lg hover:from-blue-600 hover:to-green-500 transition-all shadow-md hover:shadow-lg"
            >
              Try Synapse Care
            </button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="px-4 pt-2 space-y-2">
              <button
                onClick={() => {
                  onNavigate('therapy');
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Learn More
              </button>
              <button
                onClick={() => {
                  onNavigate('features');
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-green-400 rounded-lg hover:from-blue-600 hover:to-green-500 transition-all"
              >
                Try Synapse Care
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
