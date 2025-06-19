
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { scenes } from '@/data/projectDetailData';

interface VideoPlayerProps {
  selectedScene: number;
}

const VideoPlayer = ({ selectedScene }: VideoPlayerProps) => {
  return (
    <div className="w-[40%] bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-full">
        <AspectRatio ratio={16 / 9} className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={scenes[selectedScene].thumbnail}
              alt={`Scene ${selectedScene + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        </AspectRatio>
        <p className="text-sm text-slate-300 text-center mt-2">Scene {selectedScene + 1} Preview</p>
      </div>
    </div>
  );
};

export default VideoPlayer;
