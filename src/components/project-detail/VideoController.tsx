
import React from 'react';
import { SkipBack, SkipForward, Upload, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { scenes } from '@/data/projectDetailData';

interface VideoControllerProps {
  selectedScene: number;
  onPreviousScene: () => void;
  onNextScene: () => void;
  onPublishAllScenes: () => void;
  onSave: () => void;
  onReset: () => void;
}

const VideoController: React.FC<VideoControllerProps> = ({
  selectedScene,
  onPreviousScene,
  onNextScene,
  onPublishAllScenes,
  onSave,
  onReset
}) => {
  return (
    <div className="bg-white border-t border-slate-200 p-4 flex-shrink-0">
      <div className="flex items-center justify-between w-full">
        {/* Left side - Scene navigation */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviousScene}
            disabled={selectedScene === 0}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <span className="text-sm text-slate-600 whitespace-nowrap">
            Scene {selectedScene + 1} of {scenes.length}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onNextScene}
            disabled={selectedScene === scenes.length - 1}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Right side - Action buttons */}
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
          
          <Button
            onClick={onPublishAllScenes}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Upload className="w-4 h-4" />
            Publish All Scenes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoController;
