
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { scenes } from '@/data/projectDetailData';

// Updated: Bigger thumbnails and no scene numbers - v2

interface ScenesListProps {
  selectedScene: number;
  onSceneSelect: (index: number) => void;
}

const ScenesList = ({ selectedScene, onSceneSelect }: ScenesListProps) => {
  return (
    <div className="w-[15%] min-w-[180px] bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-2 border-b border-slate-200 flex-shrink-0">
        <h3 className="text-lg font-semibold text-slate-900">Clips</h3>
      </div>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-1">
            {scenes.map((scene, index) => (
              <div
                key={`scene-${scene.id}-${index}`}
                onClick={() => onSceneSelect(index)}
                className={`cursor-pointer mb-1 p-1 rounded border transition-all ${
                  selectedScene === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <img
                    src={scene.thumbnail}
                    alt={`Clip ${index + 1}`}
                    className="w-20 h-14 object-cover rounded flex-shrink-0"
                  />
                  <span className="text-xs text-slate-500 font-medium ml-2">{scene.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ScenesList;
