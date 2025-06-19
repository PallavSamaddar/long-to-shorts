
import React from 'react';
import Sidebar from '@/components/Sidebar';
import GlobalHeader from '@/components/GlobalHeader';
import { FileText, Image, Video, User, Clock, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const RecentActivity = () => {
  const allActivities = [
    {
      id: 1,
      type: 'document',
      action: 'created',
      item: 'Marketing Strategy',
      user: 'Sarah Johnson',
      time: '2 hours ago',
      date: 'Dec 19, 2025',
      icon: FileText,
      description: 'Created a new marketing strategy document for Q1 2025'
    },
    {
      id: 2,
      type: 'image',
      action: 'uploaded',
      item: 'hero-banner.jpg',
      user: 'Mike Chen',
      time: '4 hours ago',
      date: 'Dec 19, 2025',
      icon: Image,
      description: 'Uploaded a new hero banner image for the homepage'
    },
    {
      id: 3,
      type: 'video',
      action: 'edited',
      item: 'Product Demo Video',
      user: 'Alex Rivera',
      time: '6 hours ago',
      date: 'Dec 19, 2025',
      icon: Video,
      description: 'Made edits to the product demo video for final review'
    },
    {
      id: 4,
      type: 'user',
      action: 'joined',
      item: 'Project Alpha',
      user: 'Emma Davis',
      time: '1 day ago',
      date: 'Dec 18, 2025',
      icon: User,
      description: 'Joined Project Alpha as a collaborator'
    },
    {
      id: 5,
      type: 'document',
      action: 'updated',
      item: 'Brand Guidelines',
      user: 'David Kim',
      time: '1 day ago',
      date: 'Dec 18, 2025',
      icon: FileText,
      description: 'Updated brand guidelines with new color palette'
    },
    {
      id: 6,
      type: 'video',
      action: 'published',
      item: 'Tutorial Series Ep 1',
      user: 'Lisa Williams',
      time: '2 days ago',
      date: 'Dec 17, 2025',
      icon: Video,
      description: 'Published the first episode of the tutorial series'
    },
    {
      id: 7,
      type: 'image',
      action: 'uploaded',
      item: 'team-photo.jpg',
      user: 'Rachel Green',
      time: '2 days ago',
      date: 'Dec 17, 2025',
      icon: Image,
      description: 'Uploaded new team photo for the about page'
    },
    {
      id: 8,
      type: 'document',
      action: 'created',
      item: 'User Research Report',
      user: 'John Smith',
      time: '3 days ago',
      date: 'Dec 16, 2025',
      icon: FileText,
      description: 'Created comprehensive user research report with insights'
    },
    {
      id: 9,
      type: 'video',
      action: 'uploaded',
      item: 'Customer Testimonial',
      user: 'Anna Park',
      time: '3 days ago',
      date: 'Dec 16, 2025',
      icon: Video,
      description: 'Uploaded new customer testimonial video'
    }
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      document: 'bg-blue-100 text-blue-600',
      image: 'bg-green-100 text-green-600',
      video: 'bg-purple-100 text-purple-600',
      user: 'bg-orange-100 text-orange-600'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex w-full">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <GlobalHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Recent Activity</h1>
            <p className="text-slate-600 mt-1">Track all recent actions and updates across your projects</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allActivities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(activity.type)}`}>
                      <activity.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        {activity.user} {activity.action}
                      </p>
                      <p className="text-sm font-semibold text-slate-900 mt-1">
                        {activity.item}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-4">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>{activity.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{activity.date}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecentActivity;
