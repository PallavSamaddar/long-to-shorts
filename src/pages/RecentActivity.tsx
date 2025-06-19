
import React from 'react';
import Sidebar from '@/components/Sidebar';
import GlobalHeader from '@/components/GlobalHeader';
import { FileText, Image, Video, User } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTypeColor(activity.type)}`}>
                        <activity.icon className="w-4 h-4" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{activity.item}</p>
                        <p className="text-sm text-slate-600 capitalize">{activity.action}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-slate-900">{activity.user}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-slate-600">{activity.description}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-slate-900">{activity.date}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-slate-600">{activity.time}</p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecentActivity;
