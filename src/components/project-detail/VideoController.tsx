
import React from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoControllerProps {
  onSave: () => void;
  onReset: () => void;
}

const VideoController: React.FC<VideoControllerProps> = ({
  onSave,
  onReset
}) => {
  return (
    <div className="bg-white border-t border-slate-200 p-4 flex-shrink-0">
      <div className="flex items-center justify-end w-full">
        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            onClick={onSave}
            variant="outline"
            size="sm"
          >
            <Save className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoController;
