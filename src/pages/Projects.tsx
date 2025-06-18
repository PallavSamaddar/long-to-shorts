
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { Search, Filter, Grid3X3, List, Plus, MoreVertical, Play, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Projects = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = useState('recent-projects');

  const filters = [
    { id: 'recent-projects', label: 'Recent projects', count: 24 },
    { id: 'all-projects', label: 'All projects', count: 156 },
    { id: 'shared-with-me', label: 'Shared with me', count: 8 },
    { id: 'archived', label: 'Archived', count: 12 },
  ];

  const projects = [
    {
      id: 1,
      title: 'Marketing Campaign Q4',
      description: 'Complete video series for product launch',
      thumbnail: '/api/placeholder/300/200',
      duration: '12:34',
      lastModified: '2 hours ago',
      collaborators: [
        { name: 'Sarah J', avatar: 'SJ' },
        { name: 'Mike C', avatar: 'MC' },
        { name: 'Alex R', avatar: 'AR' },
      ],
      type: 'video',
      status: 'in-progress'
    },
    {
      id: 2,
      title: 'Product Demo Video',
      description: 'Feature walkthrough and tutorial',
      thumbnail: '/api/placeholder/300/200',
      duration: '8:45',
      lastModified: '1 day ago',
      collaborators: [
        { name: 'Emma D', avatar: 'ED' },
        { name: 'John S', avatar: 'JS' },
      ],
      type: 'video',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Podcast Episode 15',
      description: 'Interview with industry expert',
      thumbnail: '/api/placeholder/300/200',
      duration: '45:20',
      lastModified: '3 days ago',
      collaborators: [
        { name: 'Lisa W', avatar: 'LW' },
      ],
      type: 'audio',
      status: 'in-progress'
    },
    {
      id: 4,
      title: 'Brand Guidelines Video',
      description: 'Corporate identity and usage guide',
      thumbnail: '/api/placeholder/300/200',
      duration: '6:12',
      lastModified: '5 days ago',
      collaborators: [
        { name: 'David K', avatar: 'DK' },
        { name: 'Maria L', avatar: 'ML' },
        { name: 'Tom B', avatar: 'TB' },
      ],
      type: 'video',
      status: 'completed'
    },
    {
      id: 5,
      title: 'Customer Testimonials',
      description: 'Collection of customer feedback videos',
      thumbnail: '/api/placeholder/300/200',
      duration: '15:30',
      lastModified: '1 week ago',
      collaborators: [
        { name: 'Anna P', avatar: 'AP' },
        { name: 'Chris M', avatar: 'CM' },
      ],
      type: 'video',
      status: 'review'
    },
    {
      id: 6,
      title: 'Training Module 3',
      description: 'Employee onboarding series',
      thumbnail: '/api/placeholder/300/200',
      duration: '22:15',
      lastModified: '1 week ago',
      collaborators: [
        { name: 'Rachel G', avatar: 'RG' },
      ],
      type: 'video',
      status: 'in-progress'
    },
  ];

  const ProjectCard = ({ project }: { project: typeof projects[0] }) => (
    <div className="bg-white rounded-lg border border-slate-200 hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer group">
      <div className="relative">
        <div className="w-full h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
          <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {project.duration}
        </div>
        <div className="absolute top-2 left-2">
          <div className={`w-2 h-2 rounded-full ${
            project.status === 'completed' ? 'bg-green-500' : 
            project.status === 'in-progress' ? 'bg-yellow-500' : 
            'bg-blue-500'
          }`} />
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-900 truncate flex-1">{project.title}</h3>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-xs text-slate-600 mb-3 line-clamp-2">{project.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-slate-400" />
            <span className="text-xs text-slate-500">{project.lastModified}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-slate-400" />
            <div className="flex -space-x-1">
              {project.collaborators.slice(0, 3).map((collaborator, index) => (
                <div 
                  key={index}
                  className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium border border-white"
                  title={collaborator.name}
                >
                  {collaborator.avatar}
                </div>
              ))}
              {project.collaborators.length > 3 && (
                <div className="w-5 h-5 bg-slate-300 rounded-full flex items-center justify-center text-slate-600 text-xs font-medium border border-white">
                  +{project.collaborators.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ProjectListItem = ({ project }: { project: typeof projects[0] }) => (
    <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-16 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center relative">
          <Play className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-xs px-1 rounded-tl text-[10px]">
            {project.duration}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-slate-900 truncate">{project.title}</h3>
            <div className={`w-2 h-2 rounded-full ${
              project.status === 'completed' ? 'bg-green-500' : 
              project.status === 'in-progress' ? 'bg-yellow-500' : 
              'bg-blue-500'
            }`} />
          </div>
          <p className="text-xs text-slate-600 truncate">{project.description}</p>
        </div>
        
        <div className="flex items-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{project.lastModified}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <div className="flex -space-x-1">
              {project.collaborators.slice(0, 3).map((collaborator, index) => (
                <div 
                  key={index}
                  className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-[10px] font-medium border border-white"
                  title={collaborator.name}
                >
                  {collaborator.avatar}
                </div>
              ))}
              {project.collaborators.length > 3 && (
                <div className="w-4 h-4 bg-slate-300 rounded-full flex items-center justify-center text-slate-600 text-[10px] font-medium border border-white">
                  +{project.collaborators.length - 3}
                </div>
              )}
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex w-full">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
                  <p className="text-slate-600 mt-1">Manage and organize your content projects</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>

              {/* Search and Filters */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input 
                    placeholder="Search projects..." 
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  
                  <div className="flex items-center border border-slate-200 rounded-lg">
                    <Button 
                      variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant={viewMode === 'list' ? 'default' : 'ghost'} 
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-6 border-b border-slate-200">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                      selectedFilter === filter.id
                        ? 'text-blue-600 border-blue-600'
                        : 'text-slate-600 border-transparent hover:text-slate-900'
                    }`}
                  >
                    {filter.label}
                    <span className="ml-2 text-xs text-slate-500">({filter.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <ProjectListItem key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Projects;
