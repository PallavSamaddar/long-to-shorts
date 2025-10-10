import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { scenes } from '@/data/projectDetailData';
import { Button } from '@/components/ui/button';

// FINAL VERSION - MEGA BIG THUMBNAILS - NO CROPPING - NO SCENE NUMBERS v1

interface ScenesListFinalProps {
  selectedScene: number;
  onSceneSelect: (index: number) => void;
  onPreviousScene?: () => void;
  onNextScene?: () => void;
  updatedThumbnails?: { [key: number]: string };
  isLeftPanelCollapsed?: boolean;
  onToggleLeftPanel?: () => void;
}

const ScenesListFinal = ({ selectedScene, onSceneSelect, onPreviousScene, onNextScene, updatedThumbnails, isLeftPanelCollapsed, onToggleLeftPanel }: ScenesListFinalProps) => {
  // Debug log to verify updated thumbnails are received
  console.log('📱 ScenesListFinal received updatedThumbnails:', updatedThumbnails);
  
  // Function to get thumbnail for a scene
  const getThumbnailForScene = (index: number) => {
    const thumbnail = updatedThumbnails?.[index] || scenes[index]?.thumbnail;
    console.log(`🖼️ Thumbnail for scene ${index}:`, thumbnail ? 'Updated' : 'Original');
    return thumbnail;
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
            <span className="text-sm text-slate-500">Scene {selectedScene + 1} of {scenes.length}</span>
          </div>
          
          {/* Right side - Navigation arrows */}
          <div className="w-16 flex justify-end gap-1">
            <button
              onClick={onPreviousScene}
              disabled={selectedScene === 0}
              className="p-1 hover:bg-slate-100 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous Scene"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={onNextScene}
              disabled={selectedScene === scenes.length - 1}
              className="p-1 hover:bg-slate-100 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next Scene"
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
              <div className="flex items-center justify-between w-full">
                <img
                  src={getThumbnailForScene(index)}
                  alt={`Scene ${index + 1}`}
                  className="w-40 h-28 object-cover rounded flex-shrink-0"
                />
                <span className="text-sm text-slate-500 font-medium ml-3 flex-shrink-0">{scene.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScenesListFinal;
