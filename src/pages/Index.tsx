
import React from 'react';
import Sidebar from '@/components/Sidebar';
import GlobalHeader from '@/components/GlobalHeader';
import StatsCard from '@/components/StatsCard';
import ProjectCard from '@/components/ProjectCard';
import RecentActivity from '@/components/RecentActivity';
import { FileText, FileVideo, Video, Users, Upload, Settings, Clock } from 'lucide-react';
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
      icon: <FileVideo className="w-6 h-6" />
    },
    {
      title: 'Unprocessed Files',
      value: '156',
      change: '+23%',
      trend: 'up' as const,
      icon: <Clock className="w-6 h-6" />
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
      title: 'AI Revolution in 2024',
      description: 'Complete overview of AI developments and their impact on technology.',
      duration: '12:34',
      lastModified: '2 hours ago',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=200&fit=crop',
      projectId: '1'
    },
    {
      title: 'Machine Learning Basics',
      description: 'Comprehensive guide to understanding machine learning fundamentals.',
      duration: '8:45',
      lastModified: '1 day ago',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop',
      projectId: '2'
    },
    {
      title: 'Tech Industry Analysis',
      description: 'Deep dive into current technology trends and market analysis.',
      duration: '15:22',
      lastModified: '3 days ago',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop',
      projectId: '3'
    },
    {
      title: 'Programming Tutorial Series',
      description: 'Educational content for developers learning new programming languages.',
      duration: '6:18',
      lastModified: '5 days ago',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=200&fit=crop',
      projectId: '4'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex w-full">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <GlobalHeader />
        
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
