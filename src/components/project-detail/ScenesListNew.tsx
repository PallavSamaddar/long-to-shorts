import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { scenes } from '@/data/projectDetailData';

// MEGA BIG THUMBNAILS - w-36 h-24 - FIXED SCROLLBAR CROPPING - FORCE REFRESH v4

interface ScenesListNewProps {
  selectedScene: number;
  onSceneSelect: (index: number) => void;
  updatedThumbnails?: { [key: number]: string };
}

const ScenesListNew = ({ selectedScene, onSceneSelect, updatedThumbnails }: ScenesListNewProps) => {
  return (
    <div className="w-[18%] min-w-[220px] bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-1 border-b border-slate-200 flex-shrink-0">
        <h3 className="text-sm font-semibold text-slate-900">Clips</h3>
      </div>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="p-0 w-full">
            {scenes.map((scene, index) => (
              <div
                key={`big-scene-${scene.id}-${index}`}
                onClick={() => onSceneSelect(index)}
                className={`cursor-pointer mb-0 p-0 rounded-none border transition-all ${
                  selectedScene === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between p-1 w-full">
                  <img
                    src={updatedThumbnails?.[index] || scene.thumbnail}
                    alt={`Clip ${index + 1}`}
                    className="w-36 h-24 object-cover rounded flex-shrink-0"
                  />
                  <span className="text-xs text-slate-500 font-medium ml-1 flex-shrink-0">{scene.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ScenesListNew;
