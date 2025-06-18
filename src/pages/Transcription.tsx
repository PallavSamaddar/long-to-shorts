
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { Search, Filter, Plus, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const Transcription = () => {
  const [selectedFilter, setSelectedFilter] = useState('all-projects');

  const filters = [
    { id: 'all-projects', label: 'All Projects', count: 156 },
    { id: 'recent-projects', label: 'Recent Projects', count: 24 },
    { id: 'archived', label: 'Archived', count: 12 },
  ];

  const projects = [
    {
      id: 1,
      name: 'Marketing Campaign Q4',
      duration: '12:34',
      owner: 'Sarah Johnson',
      created: '2 hours ago',
      status: 'Processing' as const
    },
    {
      id: 2,
      name: 'Product Demo Video',
      duration: '8:45',
      owner: 'Mike Chen',
      created: '1 day ago',
      status: 'Ready' as const
    },
    {
      id: 3,
      name: 'Podcast Episode 15',
      duration: '45:20',
      owner: 'Lisa Williams',
      created: '3 days ago',
      status: 'Processing' as const
    },
    {
      id: 4,
      name: 'Brand Guidelines Video',
      duration: '6:12',
      owner: 'David Kim',
      created: '5 days ago',
      status: 'Ready' as const
    },
    {
      id: 5,
      name: 'Customer Testimonials',
      duration: '15:30',
      owner: 'Anna Park',
      created: '1 week ago',
      status: 'Error' as const
    },
    {
      id: 6,
      name: 'Training Module 3',
      duration: '22:15',
      owner: 'Rachel Green',
      created: '1 week ago',
      status: 'Processing' as const
    },
    {
      id: 7,
      name: 'Company Overview',
      duration: '9:45',
      owner: 'John Smith',
      created: '2 weeks ago',
      status: 'Ready' as const
    },
    {
      id: 8,
      name: 'Team Introduction',
      duration: '14:20',
      owner: 'Emma Davis',
      created: '2 weeks ago',
      status: 'Error' as const
    },
  ];

  const getStatusBadge = (status: 'Processing' | 'Ready' | 'Error') => {
    const statusConfig = {
      Processing: { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      Ready: { variant: 'secondary' as const, className: 'bg-green-100 text-green-800' },
      Error: { variant: 'destructive' as const, className: 'bg-red-100 text-red-800' }
    };

    return (
      <Badge variant={statusConfig[status].variant} className={statusConfig[status].className}>
        {status}
      </Badge>
    );
  };

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
                  <h1 className="text-2xl font-bold text-slate-900">Transcription</h1>
                  <p className="text-slate-600 mt-1">Manage and organize your transcription projects</p>
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
                
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
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

            {/* Projects Table */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold text-slate-900">Name</TableHead>
                    <TableHead className="font-semibold text-slate-900">Duration</TableHead>
                    <TableHead className="font-semibold text-slate-900">Owner</TableHead>
                    <TableHead className="font-semibold text-slate-900">Created</TableHead>
                    <TableHead className="font-semibold text-slate-900">Status</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id} className="hover:bg-slate-50 cursor-pointer">
                      <TableCell>
                        <div className="font-medium text-slate-900">{project.name}</div>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-600">{project.duration}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-600">{project.owner}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-600">{project.created}</span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(project.status)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Transcription;
