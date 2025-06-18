
import React from 'react';
import { MoreVertical, Edit, Trash2, Copy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const ProjectRowActions = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem className="flex items-center gap-2">
          <Edit className="w-4 h-4" />
          Rename Project
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2">
          <Copy className="w-4 h-4" />
          Duplicate Project
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Project Access
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2 text-red-600">
          <Trash2 className="w-4 h-4" />
          Delete Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProjectRowActions;
