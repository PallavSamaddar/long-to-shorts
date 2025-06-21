
import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Upload } from 'lucide-react';
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
  onPublishAllScenes: () => void;
}

const VideoController: React.FC<VideoControllerProps> = ({
  selectedScene,
  isPlaying,
  isMuted,
  currentTime,
  totalTime,
  onPreviousScene,
  onNextScene,
  onTogglePlayPause,
  onToggleMute,
  onPublishAllScenes
}) => {
  return (
    <div className="bg-white border-t border-slate-200 p-4 flex-shrink-0">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Left side - Scene navigation */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviousScene}
            disabled={selectedScene === 0}
            className="flex items-center gap-2"
          >
            <SkipBack className="w-4 h-4" />
            Previous Scene
          </Button>
          
          <span className="text-sm text-slate-600">
            Scene {selectedScene + 1} of {scenes.length}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onNextScene}
            disabled={selectedScene === scenes.length - 1}
            className="flex items-center gap-2"
          >
            Next Scene
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Center - Playback controls */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onTogglePlayPause}
            className="flex items-center gap-2"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onToggleMute}
            className="flex items-center gap-2"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {isMuted ? 'Unmute' : 'Mute'}
          </Button>

          <span className="text-sm text-slate-600 font-mono">
            {currentTime} / {totalTime}
          </span>
        </div>

        {/* Right side - Publish button */}
        <div className="flex items-center">
          <Button
            onClick={onPublishAllScenes}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
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
