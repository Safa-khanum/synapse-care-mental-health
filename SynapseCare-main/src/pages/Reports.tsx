import { TrendingUp, TrendingDown, Activity, Brain, Heart, BarChart3, Download, FileText, Calendar } from 'lucide-react';

interface ReportsProps {
  onNavigate: (page: string) => void;
}

export default function Reports({ onNavigate }: ReportsProps) {
  const metrics = [
    {
      title: 'Mental Health Score',
      value: 78,
      change: 12,
      trend: 'up',
      color: 'blue',
      icon: Brain,
    },
    {
      title: 'Stress Level',
      value: 42,
      change: -8,
      trend: 'down',
      color: 'orange',
      icon: Activity,
    },
    {
      title: 'Overall Wellness',
      value: 85,
      change: 5,
      trend: 'up',
      color: 'green',
      icon: Heart,
    },
    {
      title: 'Therapy Progress',
      value: 67,
      change: 15,
      trend: 'up',
      color: 'teal',
      icon: BarChart3,
    },
  ];

  const weeklyData = [
    { day: 'Mon', mood: 65, stress: 45, energy: 70 },
    { day: 'Tue', mood: 70, stress: 40, energy: 75 },
    { day: 'Wed', mood: 68, stress: 50, energy: 65 },
    { day: 'Thu', mood: 75, stress: 35, energy: 80 },
    { day: 'Fri', mood: 80, stress: 30, energy: 85 },
    { day: 'Sat', mood: 85, stress: 25, energy: 90 },
    { day: 'Sun', mood: 82, stress: 28, energy: 88 },
  ];

  const recentReports = [
    { title: 'Weekly Mental Health Summary', date: 'Jan 8, 2025', type: 'Mental Health' },
    { title: 'Lab Results Analysis', date: 'Jan 5, 2025', type: 'Physical Health' },
    { title: 'Therapy Progress Report', date: 'Jan 1, 2025', type: 'Therapy' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Health Insights & Reports
          </h1>
          <p className="text-xl text-gray-600">
            Track your mental and physical health progress with comprehensive analytics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const colorClasses = {
              blue: 'from-blue-500 to-blue-600',
              orange: 'from-orange-500 to-orange-600',
              green: 'from-green-500 to-green-600',
              teal: 'from-teal-500 to-teal-600',
            };

            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[metric.color as keyof typeof colorClasses]}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(metric.change)}%</span>
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm mb-2">{metric.title}</h3>
                <div className="text-3xl font-bold text-gray-900">{metric.value}%</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Weekly Mental Health Trends</h2>
            <div className="space-y-6">
              {['mood', 'stress', 'energy'].map((metric) => (
                <div key={metric}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">{metric} Level</span>
                    <span className="text-sm text-gray-500">
                      {weeklyData[weeklyData.length - 1][metric as keyof typeof weeklyData[0]]}%
                    </span>
                  </div>
                  <div className="flex items-end space-x-2 h-32">
                    {weeklyData.map((day, index) => {
                      const value = day[metric as keyof typeof day] as number;
                      const colors = {
                        mood: 'bg-blue-500',
                        stress: 'bg-orange-500',
                        energy: 'bg-green-500',
                      };
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '100%' }}>
                            <div
                              className={`absolute bottom-0 w-full rounded-t ${colors[metric as keyof typeof colors]} transition-all`}
                              style={{ height: `${value}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 mt-2">{day.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 text-left font-medium text-white bg-gradient-to-r from-blue-500 to-green-400 rounded-lg hover:from-blue-600 hover:to-green-500 transition-all shadow-md hover:shadow-lg flex items-center space-x-3">
                <FileText className="w-5 h-5" />
                <span>Generate Report</span>
              </button>
              <button className="w-full px-4 py-3 text-left font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all flex items-center space-x-3">
                <Download className="w-5 h-5" />
                <span>Download Summary</span>
              </button>
              <button className="w-full px-4 py-3 text-left font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all flex items-center space-x-3">
                <BarChart3 className="w-5 h-5" />
                <span>Compare Progress</span>
              </button>
              <button className="w-full px-4 py-3 text-left font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all flex items-center space-x-3">
                <Calendar className="w-5 h-5" />
                <span>View History</span>
              </button>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-2">Next Check-in</h3>
              <p className="text-sm text-gray-600 mb-3">Your next mental health assessment is scheduled for:</p>
              <div className="text-lg font-bold text-blue-600">Jan 15, 2025</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Reports</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentReports.map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-500">{report.date} • {report.type}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-white rounded-lg transition-colors">
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
