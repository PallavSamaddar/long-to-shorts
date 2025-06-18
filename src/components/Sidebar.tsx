
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Home, FileText, Video, Settings, Folder, Mic, Upload } from 'lucide-react';
import NewProjectDialog from './NewProjectDialog';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/' },
    { icon: Folder, label: 'Projects', href: '/projects' },
    { icon: Mic, label: 'Transcription', href: '/transcription' },
    { icon: Upload, label: 'Published Files', href: '/published' },
    { icon: Video, label: 'Videos', href: '/videos' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold">ContentCMS</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your content</p>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-4">
        <NewProjectDialog />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-6">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={index}>
                <a
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">JD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
