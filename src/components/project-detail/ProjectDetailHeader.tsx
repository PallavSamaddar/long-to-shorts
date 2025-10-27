
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Video, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectDetailHeaderProps {
  generatedVideos?: { [key: number]: { horizontal?: string; vertical?: string; generationType?: 'both' | 'horizontal' | 'vertical' } };
  totalClips?: number;
  onGeneratedVideosClick?: () => void;
}

const ProjectDetailHeader: React.FC<ProjectDetailHeaderProps> = ({ 
  generatedVideos = {}, 
  totalClips = 10, 
  onGeneratedVideosClick 
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/projects');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  // Calculate total generated videos by counting actual formats
  const calculateGeneratedCount = () => {
    let count = 0;
    Object.values(generatedVideos).forEach(video => {
      if (video.horizontal) count += 1;
      if (video.vertical) count += 1;
    });
    return count;
  };

  const generatedCount = calculateGeneratedCount();

  return (
    <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/60 px-6 py-3 flex-shrink-0 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </Button>
          <div className="w-px h-5 bg-slate-300/50"></div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHomeClick}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-lg transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Home</span>
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <h1 className="text-lg font-semibold text-slate-800 tracking-tight">Marketing Campaign Q4 - Video Overview</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={onGeneratedVideosClick}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-white/80 hover:bg-white border-slate-300 text-slate-700 hover:text-slate-900 transition-all duration-200"
          >
            <Video className="w-4 h-4" />
            <span className="text-sm font-medium">Generated Videos</span>
            <div className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
              {generatedCount}/{totalClips * 2}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailHeader;
