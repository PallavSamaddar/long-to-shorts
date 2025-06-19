
import React from 'react';
import { MoreHorizontal, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  title: string;
  description: string;
  duration: string;
  lastModified: string;
  image?: string;
  projectId?: string;
}

const ProjectCard = ({ title, description, duration, lastModified, image, projectId = '1' }: ProjectCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div 
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer"
      onClick={handleCardClick}
    >
      {image ? (
        <div className="w-full h-32 rounded-lg mb-4 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-white font-medium text-2xl">{title.charAt(0)}</span>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-slate-900 truncate flex-1">{title}</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-slate-400 hover:text-slate-600"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
      
      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{description}</p>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-slate-500">
          <Clock className="w-4 h-4" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Calendar className="w-4 h-4" />
          <span>{lastModified}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
