
import React from 'react';
import { FileText, Image, Video, User } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'document',
      action: 'created',
      item: 'Marketing Strategy',
      user: 'Sarah Johnson',
      time: '2 hours ago',
      icon: FileText
    },
    {
      id: 2,
      type: 'image',
      action: 'uploaded',
      item: 'hero-banner',
      user: 'Mike Chen',
      time: '4 hours ago',
      icon: Image
    },
    {
      id: 3,
      type: 'video',
      action: 'edited',
      item: 'Product Demo Video',
      user: 'Alex Rivera',
      time: '6 hours ago',
      icon: Video
    },
    {
      id: 4,
      type: 'user',
      action: 'joined',
      item: 'Project Alpha',
      user: 'Emma Davis',
      time: '1 day ago',
      icon: User
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <activity.icon className="w-4 h-4 text-blue-600" />
            </div>
            
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-medium text-slate-900">{activity.user}</span>
                <span className="text-slate-600"> {activity.action} </span>
                <span className="font-medium text-slate-900">{activity.item}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium mt-4 py-2 hover:bg-blue-50 rounded-lg transition-colors">
        View all activity
      </button>
    </div>
  );
};

export default RecentActivity;
