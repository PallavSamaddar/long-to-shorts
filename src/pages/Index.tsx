import React from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import StatsCard from '@/components/StatsCard';
import ProjectCard from '@/components/ProjectCard';
import RecentActivity from '@/components/RecentActivity';
import { FileText, Image, Video, Users, Plus, Upload, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const statsData = [
    {
      title: 'Total Projects',
      value: '24',
      change: '+12%',
      trend: 'up' as const,
      icon: <FileText className="w-6 h-6" />
    },
    {
      title: 'Media Published',
      value: '1,847',
      change: '+8%',
      trend: 'up' as const,
      icon: <Image className="w-6 h-6" />
    },
    {
      title: 'Unprocessed Files',
      value: '156',
      change: '+23%',
      trend: 'up' as const,
      icon: <Users className="w-6 h-6" />
    },
    {
      title: 'Videos Created',
      value: '89',
      change: '+5%',
      trend: 'up' as const,
      icon: <Video className="w-6 h-6" />
    }
  ];

  const projects = [
    {
      title: 'Marketing Campaign 2024',
      description: 'Complete marketing strategy and content creation for the upcoming product launch.',
      collaborators: 8,
      lastModified: '2 hours ago',
      progress: 75,
      image: true
    },
    {
      title: 'Product Documentation',
      description: 'Comprehensive documentation for new features and user guides.',
      collaborators: 4,
      lastModified: '1 day ago',
      progress: 60,
      image: true
    },
    {
      title: 'Brand Guidelines',
      description: 'Updated brand guidelines including logo usage, colors, and typography.',
      collaborators: 6,
      lastModified: '3 days ago',
      progress: 90,
      image: true
    },
    {
      title: 'Video Tutorial Series',
      description: 'Educational video content for customer onboarding and feature tutorials.',
      collaborators: 12,
      lastModified: '5 days ago',
      progress: 45,
      image: true
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex w-full">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Projects Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Recent Projects</h2>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                  <ProjectCard key={index} {...project} />
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline" className="text-slate-600 hover:text-slate-900">
                  View All Projects
                </Button>
              </div>
            </div>

            {/* Activity Sidebar */}
            <div className="lg:col-span-1">
              <RecentActivity />
              
              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Slate
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Image className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Publish Destination
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
