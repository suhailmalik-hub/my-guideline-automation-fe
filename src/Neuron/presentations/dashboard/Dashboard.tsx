import { Bot, CheckCircle2, Clock, FileText, Globe, Layers, PlayCircle, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Total Workflows', value: '24', icon: Layers, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Published', value: '18', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Drafts', value: '4', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Executions Today', value: '37', icon: PlayCircle, color: 'text-violet-600', bg: 'bg-violet-50' },
];

const recentActivity = [
  { action: 'Workflow executed', name: 'India → Belgium · Business', time: '2 min ago', status: 'success' },
  { action: 'Workflow published', name: 'South Africa → USA · Tourist', time: '15 min ago', status: 'info' },
  { action: 'Workflow updated', name: 'India → Germany · Student', time: '1 hr ago', status: 'info' },
  { action: 'Execution failed', name: 'Nigeria → Canada · Work', time: '2 hrs ago', status: 'error' },
  { action: 'Workflow created', name: 'India → France · Schengen', time: '3 hrs ago', status: 'info' },
];

const topCountries = [
  { country: 'Belgium', workflows: 8, executions: 142 },
  { country: 'Germany', workflows: 5, executions: 98 },
  { country: 'USA', workflows: 4, executions: 76 },
  { country: 'Canada', workflows: 3, executions: 54 },
  { country: 'France', workflows: 2, executions: 31 },
];

export const Dashboard = () => {
  return (
    <div className='flex flex-col h-full bg-gray-50'>
      <div className='flex-1 overflow-auto p-6 space-y-6'>
        <div>
          <h1 className='text-lg font-semibold text-gray-900'>Dashboard</h1>
          <p className='text-sm text-gray-500 mt-0.5'>Overview of your automation workflows</p>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {stats.map((stat) => (
            <div
              key={stat.label}
              className='bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4'
            >
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                <stat.icon
                  size={20}
                  className={stat.color}
                />
              </div>
              <div>
                <p className='text-2xl font-bold text-gray-900'>{stat.value}</p>
                <p className='text-xs text-gray-500'>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm'>
            <div className='flex items-center gap-2 px-5 py-4 border-b border-gray-100'>
              <Clock
                size={16}
                className='text-gray-400'
              />
              <h2 className='text-sm font-semibold text-gray-900'>Recent Activity</h2>
            </div>
            <div className='divide-y divide-gray-50'>
              {recentActivity.map((item, idx) => (
                <div
                  key={idx}
                  className='flex items-center gap-3 px-5 py-3'
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      item.status === 'success'
                        ? 'bg-emerald-500'
                        : item.status === 'error'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                    }`}
                  />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm text-gray-800 truncate'>
                      <span className='font-medium'>{item.action}</span>
                      <span className='text-gray-400'> — </span>
                      {item.name}
                    </p>
                  </div>
                  <span className='text-xs text-gray-400 shrink-0'>{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='bg-white rounded-xl border border-gray-200 shadow-sm'>
            <div className='flex items-center gap-2 px-5 py-4 border-b border-gray-100'>
              <Globe
                size={16}
                className='text-gray-400'
              />
              <h2 className='text-sm font-semibold text-gray-900'>Top Destinations</h2>
            </div>
            <div className='divide-y divide-gray-50'>
              {topCountries.map((item) => (
                <div
                  key={item.country}
                  className='flex items-center gap-3 px-5 py-3'
                >
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-gray-800'>{item.country}</p>
                    <p className='text-xs text-gray-400'>
                      {item.workflows} workflows · {item.executions} runs
                    </p>
                  </div>
                  <TrendingUp
                    size={14}
                    className='text-emerald-500 shrink-0'
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='bg-white rounded-xl border border-gray-200 shadow-sm p-5'>
          <div className='flex items-center gap-2 mb-3'>
            <Bot
              size={16}
              className='text-gray-400'
            />
            <h2 className='text-sm font-semibold text-gray-900'>System Overview</h2>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <div className='bg-gray-50 rounded-lg p-3'>
              <p className='text-xs text-gray-500'>Avg. Execution Time</p>
              <p className='text-lg font-bold text-gray-900 mt-0.5'>12.4s</p>
            </div>
            <div className='bg-gray-50 rounded-lg p-3'>
              <p className='text-xs text-gray-500'>Success Rate</p>
              <p className='text-lg font-bold text-gray-900 mt-0.5'>94.2%</p>
            </div>
            <div className='bg-gray-50 rounded-lg p-3'>
              <p className='text-xs text-gray-500'>Total API Tokens Used</p>
              <p className='text-lg font-bold text-gray-900 mt-0.5'>1.2M</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
