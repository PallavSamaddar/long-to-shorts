
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProjectDetailHeader = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/projects');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHomeClick}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </Button>
        </div>
        <h1 className="text-xl font-bold text-slate-900">Marketing Campaign Q4 - Video Overview</h1>
        <div className="w-32"></div>
      </div>
    </div>
  );
};

export default ProjectDetailHeader;
