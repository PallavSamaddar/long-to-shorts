
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, FolderOpen, FileText, Globe, Settings, Search, Plus, Upload, FileVideo, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewProjectDialog from '@/components/NewProjectDialog';

const Sidebar = () => {
  const location = useLocation();
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: FolderOpen, label: 'Projects', path: '/projects' },
    { icon: FileText, label: 'Transcription', path: '/transcription' },
    { icon: Globe, label: 'Published Files', path: '/published' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen">
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-900">Slike Chopper</h1>
          <p className="text-sm text-slate-600 mt-1">Capture Important Segments</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Actions</h3>
          
          <div className="space-y-2 mb-4">
            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              <Upload className="w-3 h-3 mr-2" />
              Upload Slate
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              <FileVideo className="w-3 h-3 mr-2" />
              Upload Logo
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              <Share className="w-3 h-3 mr-2" />
              Publish Destinations
            </Button>
          </div>

          {/* New Project Button */}
          <Button 
            onClick={() => setIsNewProjectOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <NewProjectDialog 
        open={isNewProjectOpen} 
        onOpenChange={setIsNewProjectOpen} 
      />
    </>
  );
};

export default Sidebar;
