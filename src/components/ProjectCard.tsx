
import React from 'react';
import { MoreHorizontal, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectCardProps {
  title: string;
  description: string;
  collaborators: number;
  lastModified: string;
  progress: number;
  image?: string;
}

const ProjectCard = ({ title, description, collaborators, lastModified, progress, image }: ProjectCardProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer">
      {image && (
        <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-white font-medium">{title.charAt(0)}</span>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-slate-900 truncate flex-1">{title}</h3>
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
      
      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{description}</p>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <Users className="w-4 h-4" />
            <span>{collaborators} collaborators</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Calendar className="w-4 h-4" />
            <span>{lastModified}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Progress</span>
            <span className="text-slate-900 font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
