
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { scenes } from '@/data/projectDetailData';

interface ScenesListProps {
  selectedScene: number;
  onSceneSelect: (index: number) => void;
}

const ScenesList = ({ selectedScene, onSceneSelect }: ScenesListProps) => {
  return (
    <div className="w-[20%] bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 flex-shrink-0">
        <h3 className="text-lg font-semibold text-slate-900">Scenes</h3>
      </div>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            <div className="space-y-3">
              {scenes.map((scene, index) => (
                <div
                  key={scene.id}
                  onClick={() => onSceneSelect(index)}
                  className={`cursor-pointer p-3 rounded-lg border transition-all ${
                    selectedScene === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-600 w-6">
                      {index + 1}
                    </span>
                    <img
                      src={scene.thumbnail}
                      alt={`Scene ${index + 1}`}
                      className="w-20 h-12 object-cover rounded"
                    />
                    <span className="text-xs text-slate-500">{scene.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ScenesList;
