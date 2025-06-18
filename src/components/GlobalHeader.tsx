
import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const GlobalHeader = () => {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <h2 className="text-2xl font-bold text-slate-900">ContentCMS</h2>
        
        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            placeholder="Search projects, videos, transcriptions..." 
            className="pl-10 w-full"
          />
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

export default GlobalHeader;
