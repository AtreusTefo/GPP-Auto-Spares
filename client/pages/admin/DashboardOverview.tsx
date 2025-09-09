import React from 'react';
import { 
  Package, 
  Eye, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Users,
  ShoppingCart
} from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: React.ReactNode;
  color: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, color }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 font-montserrat truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2 font-montserrat">{value}</p>
          {change && (
            <div className="flex items-center mt-1 sm:mt-2">
              {change.type === 'increase' ? (
                <TrendingUp size={14} className="text-green-500 mr-1 flex-shrink-0" />
              ) : (
                <TrendingDown size={14} className="text-red-500 mr-1 flex-shrink-0" />
              )}
              <span className={`text-xs sm:text-sm font-medium ${
                change.type === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change.value > 0 ? '+' : ''}{change.value}%
              </span>
              <span className="text-xs text-gray-500 ml-1 hidden sm:inline">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-full ${color} flex-shrink-0 ml-2`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const SimpleBarChart: React.FC = () => {
  const data = [
    { month: 'Jan', listings: 45 },
    { month: 'Feb', listings: 52 },
    { month: 'Mar', listings: 48 },
    { month: 'Apr', listings: 61 },
    { month: 'May', listings: 55 },
    { month: 'Jun', listings: 67 },
  ];

  const maxValue = Math.max(...data.map(d => d.listings));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 font-montserrat">Listings Over Time</h3>
      <div 
        className="flex items-end space-x-2 sm:space-x-4 h-48 sm:h-64 overflow-x-auto"
        role="img"
        aria-label="Bar chart showing listings over time from January to June"
      >
        {data.map((item, index) => {
          const height = (item.listings / maxValue) * (window.innerWidth < 640 ? 160 : 200);
          return (
            <div key={index} className="flex-1 min-w-[40px] flex flex-col items-center">
              <div 
                className="w-full bg-gpp-blue rounded-t-md transition-all duration-300 hover:bg-gpp-navy cursor-pointer relative group touch-manipulation focus:outline-none focus:ring-2 focus:ring-gpp-blue focus:ring-offset-2"
                style={{ height: `${height}px` }}
                role="button"
                tabIndex={0}
                aria-label={`${item.month}: ${item.listings} listings`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Handle bar click if needed
                  }
                }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity z-10">
                  {item.listings}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 font-montserrat" aria-hidden="true">{item.month}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      action: 'New product added',
      item: 'VW Golf Engine Parts',
      time: '2 hours ago',
      type: 'success'
    },
    {
      id: 2,
      action: 'Price updated',
      item: 'BMW Headlights',
      time: '4 hours ago',
      type: 'info'
    },
    {
      id: 3,
      action: 'Product sold',
      item: 'Mercedes Gearbox',
      time: '6 hours ago',
      type: 'success'
    },
    {
      id: 4,
      action: 'Low stock alert',
      item: 'Toyota Brake Pads',
      time: '1 day ago',
      type: 'warning'
    }
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 font-montserrat">Recent Activity</h3>
      <div className="space-y-3 sm:space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start sm:items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 sm:mt-0 ${getActivityColor(activity.type).replace('text-', 'bg-').split(' ')[0]}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-900 font-montserrat">{activity.action}</p>
              <p className="text-xs sm:text-sm text-gray-600 truncate">{activity.item}</p>
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-montserrat">Dashboard Overview</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="text-xs sm:text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <KPICard
          title="Total Products"
          value={247}
          change={{ value: 12, type: 'increase' }}
          icon={<Package size={24} className="text-white" />}
          color="bg-gpp-blue"
        />
        <KPICard
          title="Active Listings"
          value={189}
          change={{ value: 8, type: 'increase' }}
          icon={<Eye size={24} className="text-white" />}
          color="bg-green-500"
        />
        <KPICard
          title="Total Sales"
          value="P 45,230"
          change={{ value: 15, type: 'increase' }}
          icon={<DollarSign size={24} className="text-white" />}
          color="bg-yellow-500"
        />
        <KPICard
          title="Pending Items"
          value={23}
          change={{ value: -5, type: 'decrease' }}
          icon={<Clock size={24} className="text-white" />}
          color="bg-orange-500"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <SimpleBarChart />
        <RecentActivity />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-3">
            <Users size={20} className="text-gpp-blue flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 font-montserrat">Total Customers</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 font-montserrat">1,234</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-3">
            <ShoppingCart size={20} className="text-green-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 font-montserrat">Orders This Month</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 font-montserrat">89</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center space-x-3">
            <TrendingUp size={20} className="text-yellow-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 font-montserrat">Conversion Rate</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 font-montserrat">3.2%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;