import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Play, Monitor, Smartphone, Layers, ExternalLink, Video, Pause, Volume2, VolumeX, CheckCircle, Trash2 } from 'lucide-react';
import { scenes } from '@/data/projectDetailData';

interface GeneratedVideosDialogProps {
  isOpen: boolean;
  onClose: () => void;
  generatedVideos: { [key: number]: { horizontal?: string; vertical?: string; generationType?: 'both' | 'horizontal' | 'vertical' } };
  updatedThumbnails?: { [key: number]: string };
}

const GeneratedVideosDialog: React.FC<GeneratedVideosDialogProps> = ({
  isOpen,
  onClose,
  generatedVideos,
  updatedThumbnails = {}
}) => {
  // Video Preview State - track playing state per clip and format
  const [playingVideos, setPlayingVideos] = useState<{[key: string]: boolean}>({});
  const [mutedVideos, setMutedVideos] = useState<{[key: string]: boolean}>({});
  const [videoDecisions, setVideoDecisions] = useState<{[key: string]: 'keep' | 'delete' | null}>({});
  const videoRefs = useRef<{[key: string]: HTMLVideoElement}>({});

  // Get all clips that have generated videos
  const generatedClips = Object.entries(generatedVideos).map(([clipIndex, videoData]) => ({
    clipIndex: parseInt(clipIndex),
    ...videoData,
    scene: scenes[parseInt(clipIndex)]
  }));

  // Get all available formats for the current clip
  const getAvailableFormats = (clipData: any) => {
    const formats = [];
    if (clipData.horizontal) {
      formats.push({ type: 'horizontal', data: clipData.horizontal });
    }
    if (clipData.vertical) {
      formats.push({ type: 'vertical', data: clipData.vertical });
    }
    return formats;
  };

  const getThumbnailForClip = (clipIndex: number) => {
    return updatedThumbnails[clipIndex] || scenes[clipIndex]?.thumbnail;
  };

  // Video Preview Functions
  const getVideoKey = (clipIndex: number, format: string) => `${clipIndex}-${format}`;

  const toggleVideoPlay = async (clipIndex: number, format: 'horizontal' | 'vertical', videoUrl: string) => {
    const videoKey = getVideoKey(clipIndex, format);
    const videoElement = videoRefs.current[videoKey];
    
    console.log(`🎬 Toggle video called for ${format} video:`, { clipIndex, videoKey, videoUrl });
    
    if (!videoElement) {
      console.error(`❌ Video element not found for key: ${videoKey}`);
      return;
    }

    const isCurrentlyPlaying = playingVideos[videoKey];
    
    if (isCurrentlyPlaying) {
      // Pause the video if it's currently playing
      console.log(`⏸️ Pausing video: ${videoKey}`);
      videoElement.pause();
    } else {
      // Play the video if it's not playing
      // First pause all other videos
      Object.keys(playingVideos).forEach(key => {
        if (key !== videoKey && playingVideos[key]) {
          const otherVideo = videoRefs.current[key];
          if (otherVideo) {
            console.log(`⏸️ Pausing other video: ${key}`);
            otherVideo.pause();
          }
        }
      });
      
      console.log(`▶️ Starting video playback ${videoKey}`);
      try {
        await videoElement.play();
        console.log(`✅ Video ${videoKey} started playing successfully`);
      } catch (error) {
        console.error(`❌ Error playing video ${videoKey}:`, error);
        console.error('Video element state:', {
          readyState: videoElement.readyState,
          networkState: videoElement.networkState,
          src: videoElement.src,
          currentSrc: videoElement.currentSrc
        });
      }
    }
  };

  const toggleVideoMute = (clipIndex: number, format: 'horizontal' | 'vertical') => {
    const videoKey = getVideoKey(clipIndex, format);
    const videoElement = videoRefs.current[videoKey];
    
    if (!videoElement) return;
    
    const isCurrentlyMuted = mutedVideos[videoKey];
    videoElement.muted = !isCurrentlyMuted;
    
    setMutedVideos(prev => ({
      ...prev,
      [videoKey]: !isCurrentlyMuted
    }));
  };

  const setVideoRef = (clipIndex: number, format: string, element: HTMLVideoElement | null) => {
    const videoKey = getVideoKey(clipIndex, format);
    if (element) {
      videoRefs.current[videoKey] = element;
      console.log(`📹 Video ref set for ${videoKey}:`, element.src);
    } else {
      delete videoRefs.current[videoKey];
      console.log(`🗑️ Video ref removed for ${videoKey}`);
    }
  };

  const handleVideoDecision = (clipIndex: number, format: 'horizontal' | 'vertical', decision: 'keep' | 'delete') => {
    const videoKey = getVideoKey(clipIndex, format);
    setVideoDecisions(prev => ({
      ...prev,
      [videoKey]: decision
    }));
  };

  const getGenerationTypeIcon = (type?: 'both' | 'horizontal' | 'vertical') => {
    switch (type) {
      case 'both':
        return <Layers className="w-4 h-4" />;
      case 'horizontal':
        return <Monitor className="w-4 h-4" />;
      case 'vertical':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  const getGenerationTypeBadge = (type?: 'both' | 'horizontal' | 'vertical') => {
    const config = {
      both: { label: 'Both Formats', className: 'bg-blue-100 text-blue-800' },
      horizontal: { label: 'Horizontal', className: 'bg-purple-100 text-purple-800' },
      vertical: { label: 'Vertical', className: 'bg-orange-100 text-orange-800' }
    };
    
    const typeConfig = config[type || 'horizontal'];
    return (
      <Badge variant="secondary" className={typeConfig.className}>
        {getGenerationTypeIcon(type)}
        <span className="ml-1">{typeConfig.label}</span>
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Generated Videos ({generatedClips.length} clips)
            </DialogTitle>
            {generatedClips.length > 0 && (
              <div className="text-sm text-slate-600">
                {(() => {
                  const totalVideos = generatedClips.reduce((acc, clip) => {
                    return acc + (clip.generationType === 'both' ? 2 : 1);
                  }, 0);
                  
                  const keepCount = Object.values(videoDecisions).filter(decision => decision === 'keep').length;
                  const deleteCount = Object.values(videoDecisions).filter(decision => decision === 'delete').length;
                  const undecidedCount = totalVideos - keepCount - deleteCount;

                  return (
                    <span>
                      Total: {totalVideos} videos • 
                      <span className="text-green-600 ml-1">Process: {keepCount}</span> • 
                      <span className="text-red-600 ml-1">Delete: {deleteCount}</span>
                      {undecidedCount > 0 && <span className="text-slate-500 ml-1"> • Undecided: {undecidedCount}</span>}
                    </span>
                  );
                })()}
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300">
          {generatedClips.length === 0 ? (
            <div className="text-center py-12">
              <Video className="w-16 h-16 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No Generated Videos</h3>
              <p className="text-slate-500">Start generating videos to see them here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {generatedClips.map(({ clipIndex, horizontal, vertical, generationType, scene }) => {
                const availableFormats = getAvailableFormats({ horizontal, vertical });
                
                if (availableFormats.length === 0) return null;

                return (
                  <div key={clipIndex} className="space-y-4">
                    {/* Clip Header */}
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-900 text-lg">Clip {clipIndex + 1}</h4>
                      {getGenerationTypeBadge(generationType)}
                    </div>

                    {/* All Available Formats */}
                    <div className="space-y-4">
                      {availableFormats.map((format) => (
                        <div
                          key={`${clipIndex}-${format.type}`}
                          className={`rounded-lg p-4 border-2 transition-all duration-200 ${
                            videoDecisions[getVideoKey(clipIndex, format.type)] === 'keep' 
                              ? 'bg-green-50 border-green-200' 
                              : videoDecisions[getVideoKey(clipIndex, format.type)] === 'delete'
                              ? 'bg-red-50 border-red-200'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          {/* Format Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {format.type === 'horizontal' ? (
                                <>
                                  <Monitor className="w-5 h-5 text-purple-600" />
                                  <span className="font-medium text-slate-900">Horizontal (16:9)</span>
                                </>
                              ) : (
                                <>
                                  <Smartphone className="w-5 h-5 text-orange-600" />
                                  <span className="font-medium text-slate-900">Vertical (9:16)</span>
                                </>
                              )}
                            </div>
                            {/* Keep and Delete Buttons */}
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleVideoDecision(clipIndex, format.type as 'horizontal' | 'vertical', 'keep')}
                                className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 h-8 px-3"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Process
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleVideoDecision(clipIndex, format.type as 'horizontal' | 'vertical', 'delete')}
                                className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 h-8 px-3"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>

                          {/* Video Preview */}
                          <div className="bg-white rounded-lg p-3 border">
                            <div className="relative mb-3">
                              <video
                                ref={(el) => setVideoRef(clipIndex, format.type, el)}
                                src={format.data}
                                poster={getThumbnailForClip(clipIndex)}
                                className="w-full object-cover rounded-md cursor-pointer"
                                style={{
                                  aspectRatio: format.type === 'horizontal' ? '16/9' : '9/16',
                                  height: format.type === 'horizontal' ? '300px' : '280px',
                                  maxWidth: format.type === 'horizontal' ? '100%' : '160px',
                                  margin: format.type === 'vertical' ? '0 auto' : 'unset',
                                  minWidth: format.type === 'horizontal' ? '533px' : 'unset'
                                }}
                                preload="metadata"
                                playsInline
                                controls={false}
                                muted={mutedVideos[getVideoKey(clipIndex, format.type)] ?? true}
                                onLoadStart={() => {
                                  console.log(`🎬 Video load started for ${format.type} format:`, format.data);
                                }}
                                onLoadedMetadata={() => {
                                  console.log(`✅ Video metadata loaded for ${format.type} format`);
                                }}
                                onCanPlay={() => {
                                  console.log(`🎮 Video can play for ${format.type} format`);
                                }}
                                onError={(e) => {
                                  console.error(`❌ Video error for ${format.type} format:`, e);
                                  console.error('Video source:', format.data);
                                }}
                                onPlay={() => {
                                  const videoKey = getVideoKey(clipIndex, format.type);
                                  setPlayingVideos(prev => ({ ...prev, [videoKey]: true }));
                                  console.log(`▶️ Video playing: ${format.type} format`);
                                }}
                                onPause={() => {
                                  const videoKey = getVideoKey(clipIndex, format.type);
                                  setPlayingVideos(prev => ({ ...prev, [videoKey]: false }));
                                  console.log(`⏸️ Video paused: ${format.type} format`);
                                }}
                                onEnded={() => {
                                  const videoKey = getVideoKey(clipIndex, format.type);
                                  setPlayingVideos(prev => ({ ...prev, [videoKey]: false }));
                                  console.log(`🏁 Video ended: ${format.type} format`);
                                }}
                                onClick={() => {
                                  console.log(`🖱️ Video clicked: ${format.type} format`);
                                  toggleVideoPlay(clipIndex, format.type as 'horizontal' | 'vertical', format.data);
                                }}
                              />
                              
                              {/* Video Controls Overlay */}
                              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-md flex items-center justify-center">
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleVideoPlay(clipIndex, format.type as 'horizontal' | 'vertical', format.data);
                                    }}
                                    className="bg-black/50 text-white hover:bg-black/70 h-10 w-10 p-0 rounded-full"
                                  >
                                    {playingVideos[getVideoKey(clipIndex, format.type)] ? 
                                      <Pause className="w-5 h-5" /> : 
                                      <Play className="w-5 h-5" />
                                    }
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleVideoMute(clipIndex, format.type as 'horizontal' | 'vertical');
                                    }}
                                    className="bg-black/50 text-white hover:bg-black/70 h-10 w-10 p-0 rounded-full"
                                  >
                                    {mutedVideos[getVideoKey(clipIndex, format.type)] ?? true ? 
                                      <VolumeX className="w-5 h-5" /> : 
                                      <Volume2 className="w-5 h-5" />
                                    }
                                  </Button>
                                </div>
                              </div>

                              {/* Duration Badge */}
                              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                {scene?.duration}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Divider between clips */}
                    {clipIndex < generatedClips.length - 1 && (
                      <div className="border-b border-slate-200 pt-2"></div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GeneratedVideosDialog;
