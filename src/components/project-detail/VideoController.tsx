
import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Upload, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
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
  onSave: () => void;
  onReset: () => void;
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
  onPublishAllScenes,
  onSave,
  onReset
}) => {
  // Convert time strings to seconds for slider calculation
  const timeToSeconds = (timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const currentSeconds = timeToSeconds(currentTime);
  const totalSeconds = timeToSeconds(totalTime);
  const progress = totalSeconds > 0 ? (currentSeconds / totalSeconds) * 100 : 0;

  const handleSeek = (value: number[]) => {
    const seekTime = (value[0] / 100) * totalSeconds;
    console.log(`Seeking to ${seekTime} seconds`);
    // TODO: Implement actual seek functionality
  };

  return (
    <div className="bg-white border-t border-slate-200 p-4 flex-shrink-0">
      <div className="flex items-center gap-4 w-full">
        {/* Left side - Scene navigation and playback controls */}
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

          <Button
            variant="outline"
            size="sm"
            onClick={onTogglePlayPause}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onToggleMute}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>

        {/* Center - Responsive seekbar */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-xs text-slate-600 font-mono whitespace-nowrap flex-shrink-0">
            {currentTime}
          </span>
          
          <Slider
            value={[progress]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="flex-1 min-w-0"
          />
          
          <span className="text-xs text-slate-600 font-mono whitespace-nowrap flex-shrink-0">
            {totalTime}
          </span>
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
