
import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { scenes } from '@/data/projectDetailData';

interface VideoControllerProps {
  selectedScene: number;
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: string;
  totalTime: string;
  onPreviousScene: () => void;
  onNextScene: () => void;
  onTogglePlayPause: () => void;
  onToggleMute: () => void;
}

const VideoController = ({
  selectedScene,
  isPlaying,
  isMuted,
  currentTime,
  totalTime,
  onPreviousScene,
  onNextScene,
  onTogglePlayPause,
  onToggleMute
}: VideoControllerProps) => {
  return (
    <div className="bg-white border-t border-slate-200 p-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        {/* Left side controls */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreviousScene}
            disabled={selectedScene === 0}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePlayPause}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onNextScene}
            disabled={selectedScene === scenes.length - 1}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMute}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>

        {/* Center: Time and Seekbar */}
        <div className="flex-1 flex items-center gap-4 mx-8">
          <span className="text-sm text-slate-600">{currentTime}</span>
          <div className="flex-1 bg-slate-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full w-1/4"></div>
          </div>
          <span className="text-sm text-slate-600">{totalTime}</span>
        </div>

        {/* Right side CTAs */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Settings
          </Button>
          <Button variant="outline" size="sm">
            Save Scene
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            Publish All Scenes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoController;
