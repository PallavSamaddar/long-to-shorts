import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { scenes } from '@/data/projectDetailData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// FINAL VERSION - MEGA BIG THUMBNAILS - NO CROPPING - NO SCENE NUMBERS v1

interface Clip {
  id: string;
  name: string;
  transcript: string;
  startTime: number;
  endTime: number;
  createdAt: Date;
}

interface ScenesListFinalProps {
  selectedScene: number;
  onSceneSelect: (index: number) => void;
  onPreviousScene?: () => void;
  onNextScene?: () => void;
  updatedThumbnails?: { [key: number]: string };
  isLeftPanelCollapsed?: boolean;
  onToggleLeftPanel?: () => void;
  projectStatus?: 'In queue' | 'Published';
  clipGenerationStatus?: { [key: number]: 'In queue' | 'Published' | 'Generating Both' | 'Generating Horizontal' | 'Generating Vertical' };
  generatedVideos?: { [key: number]: { horizontal?: string; vertical?: string; generationType?: 'both' | 'horizontal' | 'vertical' } };
  clips?: Clip[];
  onClipCreate?: (clip: Omit<Clip, 'id' | 'createdAt'>) => void;
  onClipUpdate?: (clipId: string, updates: Partial<Clip>) => void;
  onClipDelete?: (clipId: string) => void;
  onClipSelect?: (clipId: string) => void;
  currentTime?: number;
  duration?: number;
  onCreateClipClick?: () => void;
}

const ScenesListFinal = ({ 
  selectedScene, 
  onSceneSelect, 
  onPreviousScene,
  onNextScene, 
  updatedThumbnails, 
  isLeftPanelCollapsed, 
  onToggleLeftPanel, 
  projectStatus = 'In queue',
  clipGenerationStatus = {},
  generatedVideos = {},
  clips = [],
  onClipCreate,
  onClipUpdate,
  onClipDelete,
  onClipSelect,
  currentTime = 0,
  duration = 0,
  onCreateClipClick
}: ScenesListFinalProps) => {
  // Debug log to verify updated thumbnails are received
  console.log('📱 ScenesListFinal received updatedThumbnails:', updatedThumbnails);
  
  // Clips state
  const [isCreatingClip, setIsCreatingClip] = useState(false);
  
  // Function to get thumbnail for a scene
  const getThumbnailForScene = (index: number) => {
    const thumbnail = updatedThumbnails?.[index] || scenes[index]?.thumbnail;
    console.log(`🖼️ Thumbnail for scene ${index}:`, thumbnail ? 'Updated' : 'Original');
    return thumbnail;
  };

  // Clip management functions
  const handleCreateClip = () => {
    onCreateClipClick?.();
  };
  
  return (
    <div className="w-full bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-3 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center relative">
          {/* Left side - Collapse button or spacer */}
          <div className="w-8 flex justify-start">
            {onToggleLeftPanel && (
              <button
                onClick={onToggleLeftPanel}
                className="p-1 hover:bg-slate-100 rounded transition-colors duration-200"
                title={isLeftPanelCollapsed ? "Expand panel" : "Collapse panel"}
              >
                {isLeftPanelCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                ) : (
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                )}
              </button>
            )}
          </div>
          
          {/* Center - Scene Counter */}
          <div className="flex-1 flex justify-center">
            <span className="text-sm text-slate-500">Clip {selectedScene + 1} of {scenes.length}</span>
          </div>
          
          {/* Right side - Navigation arrows */}
          <div className="w-16 flex justify-end gap-1">
            <button
              onClick={onPreviousScene}
              disabled={selectedScene === 0}
              className="p-1 hover:bg-slate-100 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous Clip"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={onNextScene}
              disabled={selectedScene === scenes.length - 1}
              className="p-1 hover:bg-slate-100 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next Clip"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="space-y-1 p-2">
          {scenes.map((scene, index) => (
            <div
              key={`final-scene-${scene.id}-${index}`}
              onClick={() => onSceneSelect(index)}
              className={`cursor-pointer p-2 rounded border transition-all w-full ${
                selectedScene === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center justify-between w-full">
                  <img
                    src={getThumbnailForScene(index)}
                    alt={`Clip ${index + 1}`}
                    className="w-40 h-28 object-cover rounded flex-shrink-0"
                  />
                  <span className="text-sm text-slate-500 font-medium ml-3 flex-shrink-0">{scene.duration}</span>
                </div>
                <div className="flex justify-center">
                  {(() => {
                    const clipStatus = clipGenerationStatus[index] || 'In queue';
                    const generatedVideo = generatedVideos?.[index];
                    
                    // Determine what was actually generated
                    const getGeneratedText = () => {
                      if (clipStatus !== 'Published' || !generatedVideo) {
                        return clipStatus;
                      }
                      
                      const hasHorizontal = !!generatedVideo.horizontal;
                      const hasVertical = !!generatedVideo.vertical;
                      
                      if (hasHorizontal && hasVertical) {
                        return 'Generated Both';
                      } else if (hasHorizontal) {
                        return 'Generated Horizontal';
                      } else if (hasVertical) {
                        return 'Generated Vertical';
                      } else {
                        return 'Generated';
                      }
                    };
                    
                    return (
                      <Badge 
                        variant="secondary" 
                        className={`flex items-center gap-1 text-xs ${
                          clipStatus === 'Published' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : clipStatus?.startsWith('Generating')
                              ? 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse'
                              : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}
                      >
                        {clipStatus === 'Published' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : clipStatus?.startsWith('Generating') ? (
                          <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {getGeneratedText()}
                      </Badge>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clips Section */}
      {clips.length > 0 && (
        <div className="border-t border-slate-200 flex-shrink-0">
          <div className="p-3 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900">Clips</h3>
          </div>
          <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
            {clips.map((clip) => (
              <div
                key={clip.id}
                className="cursor-pointer p-2 rounded border transition-all w-full border-slate-200 hover:border-slate-300 hover:bg-slate-50 group"
                onClick={() => onClipSelect?.(clip.id)}
              >
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center justify-between w-full">
                    <div className="w-40 h-28 bg-slate-100 rounded flex items-center justify-center">
                      <span className="text-2xl">🎬</span>
                    </div>
                    <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                      <span className="text-sm text-slate-500 font-medium">
                        {Math.floor((clip.endTime - clip.startTime) / 60)}:{(Math.floor(clip.endTime - clip.startTime) % 60).toString().padStart(2, '0')}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClipDelete?.(clip.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="text-xs font-semibold text-slate-900 truncate">{clip.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{clip.transcript}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create New Clip CTA */}
      <div className="p-3 border-t border-slate-200 flex-shrink-0">
        <Button 
          onClick={handleCreateClip}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Clip
        </Button>
      </div>
    </div>
  );
};


export default ScenesListFinal;
