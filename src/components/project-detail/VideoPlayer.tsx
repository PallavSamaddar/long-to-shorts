import React, { useRef, useState, useEffect } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Info, Upload } from 'lucide-react';
import { scenes } from '@/data/projectDetailData';
import LogoWatermark from './LogoWatermark';

interface VideoPlayerProps {
  selectedScene: number;
  onThumbnailUpdate?: (sceneIndex: number, thumbnailUrl: string) => void;
  onLogoUpdate?: (logoData: { image: string | null; position: string; opacity: number }) => void;
  onPublishAllScenes?: () => void;
  updatedThumbnails?: { [key: number]: string };
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ selectedScene, onThumbnailUpdate, onLogoUpdate, onPublishAllScenes, updatedThumbnails }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
      const [thumbnailMode, setThumbnailMode] = useState<'timeline' | 'gallery' | 'preset' | 'logo'>('timeline');
  const [customThumbnail, setCustomThumbnail] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [logoWatermark, setLogoWatermark] = useState<{
    image: string | null;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    opacity: number;
  }>({
    image: null,
    position: 'top-right',
    opacity: 50
  });
  const [showLogoSettings, setShowLogoSettings] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Get current scene data
  const currentScene = scenes[selectedScene];

  // Convert duration string to seconds
  const durationToSeconds = (durationStr: string) => {
    const [minutes, seconds] = durationStr.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  // Set duration when component mounts or scene changes
  useEffect(() => {
    setDuration(durationToSeconds(currentScene.duration));
  }, [currentScene.duration]);

  // Reset customThumbnail when scene changes to use parent's updated thumbnail
  useEffect(() => {
    setCustomThumbnail(null);
  }, [selectedScene]);

  // Video event handlers setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Load the video source
    video.src = currentScene.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    video.load();

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [selectedScene, currentScene.videoUrl]);

  // Video event handlers
  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (value: number[]) => {
    if (!videoRef.current) return;
    const newTime = (value[0] / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return;
    const newVolume = value[0] / 100;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const skipBackward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, currentTime - 10);
  };

  const skipForward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(duration, currentTime + 10);
  };

  const changePlaybackRate = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const selectThumbnailFromGallery = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files?.[0]) {
        const file = target.files[0];
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageData = e.target?.result as string;
            
            // Create a new image to crop according to aspect ratio
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              if (!ctx) return;
              
              const imgWidth = img.width;
              const imgHeight = img.height;
              let cropWidth = imgWidth;
              let cropHeight = imgHeight;
              let offsetX = 0;
              let offsetY = 0;
              
              // Calculate crop dimensions based on selected aspect ratio
              if (aspectRatio === '9:16') {
                const targetRatio = 9 / 16;
                const imgRatio = imgWidth / imgHeight;
                
                if (imgRatio > targetRatio) {
                  cropWidth = imgHeight * targetRatio;
                  offsetX = (imgWidth - cropWidth) / 2;
                } else {
                  cropHeight = imgWidth / targetRatio;
                  offsetY = (imgHeight - cropHeight) / 2;
                }
              } else if (aspectRatio === '1:1') {
                const minDimension = Math.min(imgWidth, imgHeight);
                cropWidth = minDimension;
                cropHeight = minDimension;
                offsetX = (imgWidth - minDimension) / 2;
                offsetY = (imgHeight - minDimension) / 2;
              } else { // 16:9
                const targetRatio = 16 / 9;
                const imgRatio = imgWidth / imgHeight;
                
                if (imgRatio > targetRatio) {
                  cropWidth = imgHeight * targetRatio;
                  offsetX = (imgWidth - cropWidth) / 2;
                } else {
                  cropHeight = imgWidth / targetRatio;
                  offsetY = (imgHeight - cropHeight) / 2;
                }
              }
              
              canvas.width = cropWidth;
              canvas.height = cropHeight;
              ctx.drawImage(img, offsetX, offsetY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
              
              setCustomThumbnail(canvas.toDataURL('image/jpeg', 0.9));
            };
            img.src = imageData;
          };
          reader.readAsDataURL(file);
        }
      }
    };
    input.click();
  };

  const getCurrentThumbnail = () => {
    // Priority: customThumbnail (local) > updatedThumbnails (parent) > original scene thumbnail
    if (customThumbnail) return customThumbnail;
    if (updatedThumbnails?.[selectedScene]) return updatedThumbnails[selectedScene];
    return currentScene.thumbnail;
  };

  const captureFrameFromVideo = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      console.warn('❌ Video or canvas ref not available');
      return null;
    }

    // Check if video is loaded and has content
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.warn('❌ Video not loaded yet (dimensions:', video.videoWidth, 'x', video.videoHeight, ')');
      // Try to use the current poster image as fallback
      const posterSrc = video.poster;
      if (posterSrc && onThumbnailUpdate) {
        console.log('🔄 Using poster image as thumbnail for scene:', selectedScene);
        onThumbnailUpdate(selectedScene, posterSrc);
        setCustomThumbnail(posterSrc);
        return posterSrc;
      }
      // If no poster, try to use the current scene's thumbnail
      const currentThumbnail = getCurrentThumbnail();
      if (currentThumbnail && onThumbnailUpdate) {
        console.log('🔄 Using current scene thumbnail as fallback for scene:', selectedScene);
        onThumbnailUpdate(selectedScene, currentThumbnail);
        setCustomThumbnail(currentThumbnail);
        return currentThumbnail;
      }
      return currentThumbnail;
    }

    console.log('✅ Video loaded with dimensions:', video.videoWidth, 'x', video.videoHeight);

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    let cropWidth = videoWidth;
    let cropHeight = videoHeight;
    let offsetX = 0;
    let offsetY = 0;

    // Calculate crop dimensions based on aspect ratio
    if (aspectRatio === '9:16') {
      const targetRatio = 9 / 16;
      const videoRatio = videoWidth / videoHeight;
      
      if (videoRatio > targetRatio) {
        cropWidth = videoHeight * targetRatio;
        offsetX = (videoWidth - cropWidth) / 2;
      } else {
        cropHeight = videoWidth / targetRatio;
        offsetY = (videoHeight - cropHeight) / 2;
      }
    } else if (aspectRatio === '1:1') {
      const minDimension = Math.min(videoWidth, videoHeight);
      cropWidth = minDimension;
      cropHeight = minDimension;
      offsetX = (videoWidth - minDimension) / 2;
      offsetY = (videoHeight - minDimension) / 2;
    } else {
      const targetRatio = 16 / 9;
      const videoRatio = videoWidth / videoHeight;
      
      if (videoRatio > targetRatio) {
        cropWidth = videoHeight * targetRatio;
        offsetX = (videoWidth - cropWidth) / 2;
      } else {
        cropHeight = videoWidth / targetRatio;
        offsetY = (videoHeight - cropHeight) / 2;
      }
    }

    canvas.width = cropWidth;
    canvas.height = cropHeight;
    
    // Set white background to prevent black frames
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cropWidth, cropHeight);
    
    // Draw video frame
    ctx.drawImage(video, offsetX, offsetY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

    const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    
    // Notify parent component about thumbnail update
    if (onThumbnailUpdate) {
      console.log('🖼️ Updating thumbnail for scene:', selectedScene, 'with data URL length:', thumbnailDataUrl.length);
      onThumbnailUpdate(selectedScene, thumbnailDataUrl);
    } else {
      console.warn('⚠️ onThumbnailUpdate callback not provided');
    }
    
    // Also update local state
    setCustomThumbnail(thumbnailDataUrl);
    
    return thumbnailDataUrl;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full bg-black flex flex-col p-2 md:p-4 overflow-y-auto overflow-x-hidden h-full min-w-0 max-w-full">
      {/* Video Player */}
      <div className="flex flex-col min-h-0 min-w-0">
        {/* Main Video Container */}
        <div className="relative bg-black rounded-md md:rounded-lg group w-full min-w-0">
          <video
            ref={videoRef}
            className="w-full h-auto cursor-pointer"
            poster={getCurrentThumbnail()}
            muted={isMuted}
            preload="metadata"
            onClick={togglePlayPause}
            style={{ 
              backgroundColor: '#000000',
              maxHeight: '60vh',
              minHeight: '200px'
            }}
          >
            <source src={currentScene.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Logo Watermark Overlay */}
          {logoWatermark.image && (
            <div 
              className={`absolute w-16 h-16 z-10 ${
                logoWatermark.position === 'top-left' ? 'top-3 left-3' :
                logoWatermark.position === 'top-right' ? 'top-3 right-3' :
                logoWatermark.position === 'bottom-left' ? 'bottom-3 left-3' :
                'bottom-3 right-3'
              }`}
              style={{ opacity: logoWatermark.opacity / 100 }}
            >
              <img
                src={logoWatermark.image}
                alt="Logo watermark"
                className="w-full h-full object-contain"
              />
            </div>
          )}
          
          {/* Control Buttons */}
          <div className="absolute top-2 md:top-3 right-2 md:right-3 flex flex-col md:flex-row gap-1 md:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLogoSettings(true)}
              className="bg-black bg-opacity-70 text-white border-white hover:bg-opacity-90 h-8 px-2 md:px-3 text-xs md:text-sm"
            >
              🏷️<span className="hidden sm:inline ml-1">Logo</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowThumbnails(true)}
              className="bg-black bg-opacity-70 text-white border-white hover:bg-opacity-90 h-8 px-2 md:px-3 text-xs md:text-sm"
            >
              🎨<span className="hidden sm:inline ml-1">Customize Preview</span>
            </Button>
          </div>

          {/* Quick Frame Capture Button */}
          <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              onClick={() => {
                console.log('🎬 Make Video thumbnail clicked for scene:', selectedScene);
                
                // Force update thumbnail even if video isn't loaded
                let frameData = captureFrameFromVideo();
                
                // If capture failed, use a test image or current thumbnail
                if (!frameData) {
                  console.log('🔄 Capture failed, using current scene thumbnail as test');
                  frameData = currentScene.thumbnail;
                }
                
                if (frameData) {
                  console.log('✅ Thumbnail ready, updating local and parent state');
                  setCustomThumbnail(frameData);
                  setShowThumbnails(false);
                  
                  // Force notify parent component
                  if (onThumbnailUpdate) {
                    console.log('📤 FORCE notifying parent of thumbnail update for scene:', selectedScene);
                    onThumbnailUpdate(selectedScene, frameData);
                    
                    // Also force a re-render by updating state again
                    setTimeout(() => {
                      console.log('🔄 Double-check: ensuring thumbnail update');
                      onThumbnailUpdate(selectedScene, frameData);
                    }, 100);
                  } else {
                    console.error('❌ onThumbnailUpdate callback is missing!');
                  }
                  
                  // Show brief success feedback
                  const button = document.querySelector('[data-capture-btn]');
                  if (button) {
                    button.textContent = '✅ Captured!';
                    setTimeout(() => {
                      button.textContent = '📸 Make Video thumbnail';
                    }, 1500);
                  }
                } else {
                  console.error('❌ No thumbnail data available');
                }
              }}
              data-capture-btn
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              <span className="hidden sm:inline">📸 Make Video thumbnail</span>
              <span className="sm:hidden">📸</span>
            </Button>
          </div>
          
          {/* Hidden canvas for frame capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        {/* Video Controls Section */}
        <div className="mt-4 space-y-4 flex-shrink-0 min-h-0">
          {/* Progress Bar Section */}
          <div className="bg-slate-800 rounded-lg p-2 md:p-4 mt-4 flex-shrink-0 w-full min-w-0">
            <div className="flex items-center gap-1 md:gap-2 lg:gap-4 w-full min-w-0">
              <span className="text-xs md:text-sm text-slate-300 font-medium min-w-[35px] md:min-w-[45px] lg:min-w-[50px] flex-shrink-0">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 relative min-w-0">
                <div 
                  className="h-2 w-full bg-slate-600 rounded-full cursor-pointer overflow-hidden touch-none"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percentage = (x / rect.width) * 100;
                    const newTime = (percentage / 100) * duration;
                    if (videoRef.current) {
                      videoRef.current.currentTime = newTime;
                      setCurrentTime(newTime);
                    }
                  }}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-200 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 h-4 w-4 bg-white rounded-full shadow-lg cursor-pointer transition-all duration-200 hover:scale-110"
                  style={{ left: `calc(${progress}% - 8px)` }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const startX = e.clientX;
                    const startProgress = progress;
                    
                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      const rect = (e.target as HTMLElement).parentElement?.getBoundingClientRect();
                      if (!rect) return;
                      
                      const deltaX = moveEvent.clientX - startX;
                      const deltaProgress = (deltaX / rect.width) * 100;
                      const newProgress = Math.max(0, Math.min(100, startProgress + deltaProgress));
                      const newTime = (newProgress / 100) * duration;
                      
                      if (videoRef.current) {
                        videoRef.current.currentTime = newTime;
                        setCurrentTime(newTime);
                      }
                    };
                    
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                />
              </div>
              <span className="text-xs md:text-sm text-slate-400 min-w-[35px] md:min-w-[45px] lg:min-w-[50px] text-right flex-shrink-0">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Control Buttons Section */}
          <div className="bg-slate-800 rounded-lg p-2 md:p-3 mt-4 flex-shrink-0 w-full min-w-0">
            <div className="flex flex-col space-y-2 lg:space-y-3 w-full min-w-0">
              {/* Primary Controls Row */}
              <div className="flex items-center justify-center gap-1 md:gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={skipBackward}
                  className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600 h-8 px-2 md:px-3 flex-shrink-0"
                  title="Skip back 10 seconds"
                >
                  <SkipBack className="w-4 h-4" />
                  <span className="ml-1 text-xs hidden sm:inline">10s</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePlayPause}
                  className="bg-blue-600 text-white border-blue-500 hover:bg-blue-700 h-8 px-3 md:px-4 flex-shrink-0"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={skipForward}
                  className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600 h-8 px-2 md:px-3 flex-shrink-0"
                  title="Skip forward 10 seconds"
                >
                  <SkipForward className="w-4 h-4" />
                  <span className="ml-1 text-xs hidden sm:inline">10s</span>
                </Button>
              </div>

              {/* Secondary Controls Row - Stacks vertically on very wide screens */}
              <div className="flex flex-col xl:flex-row items-center justify-center gap-2 xl:gap-4">
                {/* Volume Control */}
                <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleMute}
                    className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600 h-8 px-2 flex-shrink-0"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <div className="w-12 md:w-14 lg:w-16 relative flex-shrink-0">
                    <div 
                      className="h-2 w-full bg-slate-600 rounded-full cursor-pointer overflow-hidden"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                        const newVolume = percentage / 100;
                        if (videoRef.current) {
                          videoRef.current.volume = newVolume;
                          setVolume(newVolume);
                        }
                      }}
                    >
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-200 ease-out"
                        style={{ width: `${volume * 100}%` }}
                      />
                    </div>
                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 h-3 w-3 bg-white rounded-full shadow-md cursor-pointer transition-all duration-200 hover:scale-110"
                      style={{ left: `calc(${volume * 100}% - 6px)` }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const startX = e.clientX;
                        const startVolume = volume;
                        
                        const handleMouseMove = (moveEvent: MouseEvent) => {
                          const rect = (e.target as HTMLElement).parentElement?.getBoundingClientRect();
                          if (!rect) return;
                          
                          const deltaX = moveEvent.clientX - startX;
                          const deltaVolume = deltaX / rect.width;
                          const newVolume = Math.max(0, Math.min(1, startVolume + deltaVolume));
                          
                          if (videoRef.current) {
                            videoRef.current.volume = newVolume;
                            setVolume(newVolume);
                          }
                        };
                        
                        const handleMouseUp = () => {
                          document.removeEventListener('mousemove', handleMouseMove);
                          document.removeEventListener('mouseup', handleMouseUp);
                        };
                        
                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                      }}
                    />
                  </div>
                </div>

                {/* Speed Control */}
                <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                  <span className="text-xs md:text-sm text-slate-300 hidden lg:inline">Speed:</span>
                  <Select value={playbackRate.toString()} onValueChange={(value) => changePlaybackRate(parseFloat(value))}>
                    <SelectTrigger className="w-12 md:w-14 lg:w-16 h-8 bg-slate-700 border-slate-600 text-white text-xs flex-shrink-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">0.5x</SelectItem>
                      <SelectItem value="0.75">0.75x</SelectItem>
                      <SelectItem value="1">1x</SelectItem>
                      <SelectItem value="1.25">1.25x</SelectItem>
                      <SelectItem value="1.5">1.5x</SelectItem>
                      <SelectItem value="2">2x</SelectItem>
                      <SelectItem value="4">4x</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scene Info & Publish Button */}
      <div className="mt-3 px-2 w-full min-w-0">
        <div className="flex items-center justify-between gap-2 w-full min-w-0">
          <p className="text-sm md:text-base text-slate-300 font-medium flex-shrink-0 min-w-0">Scene {selectedScene + 1} Preview</p>
          {onPublishAllScenes && (
            <Button
              onClick={onPublishAllScenes}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-3 md:px-4 flex-shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Publish</span>
            </Button>
          )}
        </div>
        {customThumbnail && (
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="text-xs text-green-400">✅ Custom thumbnail set</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCustomThumbnail(null)}
              className="text-xs h-6 px-2 text-slate-300 border-slate-600 hover:bg-slate-700"
            >
              Reset
            </Button>
          </div>
        )}
      </div>

      {/* Enhanced Thumbnail Selection Modal */}
      {showThumbnails && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
              {/* Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">Customize Video Preview</h2>
                  <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                    <span>•</span>
                    <span>Thumbnails & Logos</span>
                    <span>•</span>
                    <span>Professional branding</span>
                  </div>
                </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowThumbnails(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕ Close
            </Button>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Side - Main Content */}
            <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
                  {/* Mode Selection Tabs */}
                  <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 shadow-sm">
                    <Button
                      variant={thumbnailMode === 'timeline' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setThumbnailMode('timeline')}
                      className={`flex-1 ${thumbnailMode === 'timeline' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      🎬 From Video
                    </Button>
                    <Button
                      variant={thumbnailMode === 'gallery' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setThumbnailMode('gallery')}
                      className={`flex-1 ${thumbnailMode === 'gallery' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      🖼️ Upload Image
                    </Button>
                    <Button
                      variant={thumbnailMode === 'preset' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setThumbnailMode('preset')}
                      className={`flex-1 ${thumbnailMode === 'preset' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      🎨 Presets
                    </Button>
                    <Button
                      variant={thumbnailMode === 'logo' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setThumbnailMode('logo')}
                      className={`flex-1 ${thumbnailMode === 'logo' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      🏷️ Logo & Branding
                    </Button>
                  </div>

              {/* Quick Scene Thumbnails */}
              {thumbnailMode === 'preset' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">📹 Quick Scene Selection</h3>
                    <p className="text-gray-600">Choose from existing scene thumbnails</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {scenes.map((scene, index) => (
                      <div
                        key={scene.id}
                        onClick={() => {
                          setCustomThumbnail(null);
                          setShowThumbnails(false);
                        }}
                        className="cursor-pointer group border-2 border-transparent hover:border-blue-500 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg"
                      >
                        <div className="relative">
                          <img
                            src={scene.thumbnail}
                            alt={`Scene ${index + 1}`}
                            className="w-full h-28 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                            <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-blue-600 px-3 py-1 rounded-full">
                              Select
                            </span>
                          </div>
                        </div>
                        <div className="p-3 bg-white">
                          <p className="text-sm text-center font-semibold text-gray-800">
                            Scene {index + 1}
                          </p>
                          <p className="text-xs text-center text-gray-500">
                            {scene.duration}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Frame Capture */}
              {thumbnailMode === 'timeline' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">🎬 Video Frame Capture</h3>
                        <p className="text-gray-600 mt-1">Extract the perfect moment from your video</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-2 rounded-lg">
                        <span className="font-semibold text-gray-700">{formatTime(currentTime)}</span>
                        <span className="text-gray-500">/</span>
                        <span className="text-gray-700">{formatTime(duration)}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="relative">
                        <div 
                          className="w-full mx-auto rounded-xl overflow-hidden shadow-2xl border-2 border-blue-300 bg-gradient-to-br from-gray-900 to-black"
                          style={{ 
                            aspectRatio: aspectRatio === '16:9' ? '16/9' : aspectRatio === '9:16' ? '9/16' : '1/1',
                            maxWidth: aspectRatio === '9:16' ? '300px' : aspectRatio === '1:1' ? '400px' : '600px'
                          }}
                        >
                          <img
                            src={getCurrentThumbnail()}
                            alt="Current frame preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                            <Button
                              onClick={() => {
                                console.log('🎬 Make Video thumbnail clicked for scene:', selectedScene);
                                const result = captureFrameFromVideo();
                                if (result) {
                                  console.log('✅ Thumbnail captured successfully');
                                } else {
                                  console.error('❌ Thumbnail capture failed');
                                }
                              }}
                              size="lg"
                              className="bg-white text-black hover:bg-gray-100 font-bold px-8 py-4 text-lg shadow-xl transform transition-all duration-300 hover:scale-105"
                            >
                              📸 Capture This Frame
                            </Button>
                          </div>
                          <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg">
                            <p className="text-sm font-medium">{aspectRatio} Format</p>
                            <p className="text-xs opacity-80">High Quality</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-4">📐 Choose Aspect Ratio</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <Button
                          variant={aspectRatio === '16:9' ? 'default' : 'outline'}
                          onClick={() => setAspectRatio('16:9')}
                          className="flex flex-col items-center p-4 h-auto hover:scale-105 transition-transform border-2"
                        >
                          <span className="text-2xl mb-2">📺</span>
                          <span className="font-bold text-sm">16:9</span>
                          <span className="text-xs text-gray-500 mt-1">Landscape</span>
                        </Button>
                        <Button
                          variant={aspectRatio === '9:16' ? 'default' : 'outline'}
                          onClick={() => setAspectRatio('9:16')}
                          className="flex flex-col items-center p-4 h-auto hover:scale-105 transition-transform border-2"
                        >
                          <span className="text-2xl mb-2">📱</span>
                          <span className="font-bold text-sm">9:16</span>
                          <span className="text-xs text-gray-500 mt-1">Portrait</span>
                        </Button>
                        <Button
                          variant={aspectRatio === '1:1' ? 'default' : 'outline'}
                          onClick={() => setAspectRatio('1:1')}
                          className="flex flex-col items-center p-4 h-auto hover:scale-105 transition-transform border-2"
                        >
                          <span className="text-2xl mb-2">⬜</span>
                          <span className="font-bold text-sm">1:1</span>
                          <span className="text-xs text-gray-500 mt-1">Square</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

                  {/* Gallery Upload */}
                  {thumbnailMode === 'gallery' && (
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Custom Image</h3>
                        
                        {/* Aspect Ratio Selection */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-4">📐 Choose Thumbnail Format</h4>
                          <div className="grid grid-cols-3 gap-4">
                            <Button
                              variant={aspectRatio === '16:9' ? 'default' : 'outline'}
                              onClick={() => setAspectRatio('16:9')}
                              className="flex flex-col items-center p-4 h-auto hover:scale-105 transition-transform border-2"
                            >
                              <span className="text-2xl mb-2">📺</span>
                              <span className="font-bold text-sm">16:9</span>
                              <span className="text-xs text-gray-500 mt-1">Horizontal</span>
                            </Button>
                            <Button
                              variant={aspectRatio === '9:16' ? 'default' : 'outline'}
                              onClick={() => setAspectRatio('9:16')}
                              className="flex flex-col items-center p-4 h-auto hover:scale-105 transition-transform border-2"
                            >
                              <span className="text-2xl mb-2">📱</span>
                              <span className="font-bold text-sm">9:16</span>
                              <span className="text-xs text-gray-500 mt-1">Vertical</span>
                            </Button>
                            <Button
                              variant={aspectRatio === '1:1' ? 'default' : 'outline'}
                              onClick={() => setAspectRatio('1:1')}
                              className="flex flex-col items-center p-4 h-auto hover:scale-105 transition-transform border-2"
                            >
                              <span className="text-2xl mb-2">⬜</span>
                              <span className="font-bold text-sm">1:1</span>
                              <span className="text-xs text-gray-500 mt-1">Square</span>
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-3 text-center">
                            💡 Choose the format that matches your target platform (YouTube: 16:9, Instagram: 9:16, etc.)
                          </p>
                        </div>
                        
                        {customThumbnail ? (
                          <div className="text-center">
                            <div className="mb-6">
                              <div className="relative inline-block">
                                <img
                                  src={customThumbnail}
                                  alt="Uploaded thumbnail preview"
                                  className="rounded-lg shadow-lg border-2 border-green-300"
                                  style={{ 
                                    aspectRatio: aspectRatio === '16:9' ? '16/9' : aspectRatio === '9:16' ? '9/16' : '1/1',
                                    maxWidth: aspectRatio === '9:16' ? '200px' : aspectRatio === '1:1' ? '300px' : '400px',
                                    height: aspectRatio === '9:16' ? '355px' : 'auto'
                                  }}
                                />
                                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                  {aspectRatio}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-3 justify-center">
                              <Button
                                onClick={selectThumbnailFromGallery}
                                variant="outline"
                                size="lg"
                              >
                                📁 Choose Different Image
                              </Button>
                              <Button
                                onClick={() => setShowThumbnails(false)}
                                size="lg"
                                className="bg-green-600 hover:bg-green-700 text-white px-8"
                              >
                                ✅ Use This Image
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 mb-6 bg-gray-50">
                              <div className="text-6xl mb-4">📁</div>
                              <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Your Custom Thumbnail</h4>
                              <p className="text-gray-600 mb-4">Perfect for branded content, custom artwork, or promotional images</p>
                              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                                <p className="text-sm text-blue-800 font-medium">
                                  📐 Selected Format: {aspectRatio === '16:9' ? 'Horizontal (16:9)' : 
                                                   aspectRatio === '9:16' ? 'Vertical (9:16)' : 
                                                   'Square (1:1)'}
                                </p>
                              </div>
                              <Button
                                onClick={selectThumbnailFromGallery}
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                              >
                                📁 Choose from Gallery
                              </Button>
                            </div>
                            <div className="bg-yellow-50 rounded-lg p-4">
                              <p className="text-sm text-yellow-800">
                                💡 <strong>Pro Tip:</strong> Your image will be automatically cropped to fit the selected {aspectRatio} format for optimal display across platforms.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

              {/* Logo & Branding Tab */}
              {thumbnailMode === 'logo' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🏷️ Logo & Branding Options</h3>
                    
                    {/* Logo Watermark Component */}
                    <LogoWatermark
                      onLogoChange={(logoData) => {
                        setLogoWatermark(logoData);
                        if (onLogoUpdate) {
                          onLogoUpdate(logoData);
                        }
                      }}
                      currentLogo={logoWatermark}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Quick Actions */}
            <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Current Selection</h4>
                <div className="text-sm text-gray-600">
                  {thumbnailMode === 'timeline' && (
                    <div>
                      <p>🎬 Video Frame Capture</p>
                      <p className="text-xs text-gray-500 mt-1">Format: {aspectRatio}</p>
                      <p className="text-xs text-gray-500">Time: {formatTime(currentTime)}</p>
                    </div>
                  )}
                  {thumbnailMode === 'gallery' && (
                    <div>
                      <p>{customThumbnail ? '🖼️ Custom Image Selected' : '📁 No Image Selected'}</p>
                      {customThumbnail && <p className="text-xs text-gray-500 mt-1">Ready to use</p>}
                    </div>
                  )}
                  {thumbnailMode === 'preset' && (
                    <div>
                      <p>🎨 Preset Thumbnails</p>
                      <p className="text-xs text-gray-500 mt-1">Choose from curated options</p>
                    </div>
                  )}
                  {thumbnailMode === 'logo' && (
                    <div>
                      <p>🏷️ Logo & Branding</p>
                      <p className="text-xs text-gray-500 mt-1">{logoWatermark.image ? 'Logo selected' : 'No logo selected'}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Quick Tips
                </h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>• Use keyboard shortcuts for faster navigation</p>
                  <p>• Preview thumbnails in different sizes</p>
                  <p>• Save multiple versions for A/B testing</p>
                  <p>• Consider your target audience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logo Watermark Settings Modal */}
      {showLogoSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Logo & Watermark Settings</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLogoSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕ Close
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              <LogoWatermark
                onLogoChange={(logoData) => {
                  setLogoWatermark(logoData);
                  if (onLogoUpdate) {
                    onLogoUpdate(logoData);
                  }
                }}
                currentLogo={logoWatermark}
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowLogoSettings(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;