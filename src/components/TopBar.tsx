
import React from 'react';
import { Bell, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TopBar = () => {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <div className="text-sm text-slate-500">
          Welcome back! Here's what's happening with your content.
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
