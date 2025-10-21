import React, { useRef, useState, useEffect } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw, Info, Upload, Eye, X, Maximize2, Minimize2 } from 'lucide-react';
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
  const [thumbnailIsPlaying, setThumbnailIsPlaying] = useState(false);
  const [thumbnailVideoLoaded, setThumbnailVideoLoaded] = useState(false);
  const [mainVideoLoaded, setMainVideoLoaded] = useState(false);
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
  const [showVerticalPreview, setShowVerticalPreview] = useState(false);
  const [verticalThumbnail, setVerticalThumbnail] = useState<string | null>(null);
  const [userThumbnails, setUserThumbnails] = useState<string[]>([]);
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const [videoViewMode, setVideoViewMode] = useState<'landscape' | 'portrait'>('landscape');
  const [selectedLayout, setSelectedLayout] = useState<number>(2); // Default to layout 2 (two horizontal rectangles)
  const [showLayoutSelection, setShowLayoutSelection] = useState(false);
  const [selectedVerticalLayout, setSelectedVerticalLayout] = useState<string>('focused-on-one');
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState<string>('none');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const verticalUploadRef = useRef<HTMLInputElement>(null);
  const thumbnailVideoRef = useRef<HTMLVideoElement>(null);

  // Layout options data - Enhanced with better names and clearer icons
  const layoutOptions = [
    { id: 0, name: 'Single Full', icon: 'single-full' },
    { id: 1, name: 'Split Vertical', icon: 'split-vertical' },
    { id: 2, name: 'Split Horizontal', icon: 'split-horizontal' },
    { id: 3, name: 'PIP Top-Right', icon: 'pip-top-right' },
    { id: 4, name: 'PIP Bottom-Right', icon: 'pip-bottom-right' },
    { id: 5, name: 'PIP Bottom-Left', icon: 'pip-bottom-left' },
    { id: 6, name: 'PIP Top-Left', icon: 'pip-top-left' },
    { id: 7, name: 'Sidebar Right', icon: 'sidebar-right' },
    { id: 8, name: 'Sidebar Left', icon: 'sidebar-left' },
    { id: 9, name: 'Header Layout', icon: 'header-layout' },
    { id: 10, name: 'Footer Layout', icon: 'footer-layout' }
  ];

  // Function to render layout icon - Enhanced with clear, descriptive icons
  const renderLayoutIcon = (iconType: string) => {
    const iconClass = "w-3 h-2";
    const rectClass = "bg-white rounded-sm";
    const smallRectClass = "bg-white rounded-sm";
    
    switch (iconType) {
      case 'single-full':
        return <div className={`${iconClass} ${rectClass}`}></div>;
      
      case 'split-vertical':
        return (
          <div className={`${iconClass} flex gap-0.5`}>
            <div className={`w-1 ${rectClass}`}></div>
            <div className={`w-1 ${rectClass}`}></div>
          </div>
        );
      
      case 'split-horizontal':
        return (
          <div className={`${iconClass} flex flex-col gap-0.5`}>
            <div className={`h-1 ${rectClass}`}></div>
            <div className={`h-1 ${rectClass}`}></div>
          </div>
        );
      
      case 'pip-top-right':
        return (
          <div className={`${iconClass} relative ${rectClass}`}>
            <div className="absolute top-0 right-0 w-1 h-1 bg-slate-400 rounded-sm"></div>
          </div>
        );
      
      case 'pip-bottom-right':
        return (
          <div className={`${iconClass} relative ${rectClass}`}>
            <div className="absolute bottom-0 right-0 w-1 h-1 bg-slate-400 rounded-sm"></div>
          </div>
        );
      
      case 'pip-bottom-left':
        return (
          <div className={`${iconClass} relative ${rectClass}`}>
            <div className="absolute bottom-0 left-0 w-1 h-1 bg-slate-400 rounded-sm"></div>
          </div>
        );
      
      case 'pip-top-left':
        return (
          <div className={`${iconClass} relative ${rectClass}`}>
            <div className="absolute top-0 left-0 w-1 h-1 bg-slate-400 rounded-sm"></div>
          </div>
        );
      
      case 'sidebar-right':
        return (
          <div className={`${iconClass} flex gap-0.5`}>
            <div className={`w-2 ${rectClass}`}></div>
            <div className={`w-1 ${rectClass}`}></div>
          </div>
        );
      
      case 'sidebar-left':
        return (
          <div className={`${iconClass} flex gap-0.5`}>
            <div className={`w-1 ${rectClass}`}></div>
            <div className={`w-2 ${rectClass}`}></div>
          </div>
        );
      
      case 'header-layout':
        return (
          <div className={`${iconClass} flex flex-col gap-0.5`}>
            <div className={`h-0.5 ${rectClass}`}></div>
            <div className={`h-1.5 ${rectClass}`}></div>
          </div>
        );
      
      case 'footer-layout':
        return (
          <div className={`${iconClass} flex flex-col gap-0.5`}>
            <div className={`h-1.5 ${rectClass}`}></div>
            <div className={`h-0.5 ${rectClass}`}></div>
          </div>
        );
      
      default:
        return <div className={`${iconClass} ${rectClass}`}></div>;
    }
  };

  // Get current scene data
  const currentScene = scenes[selectedScene];

  // Force video to load when component mounts or scene changes
  useEffect(() => {
    setMainVideoLoaded(false);
    if (videoRef.current) {
      console.log('🔄 Forcing video reload for scene:', selectedScene, currentScene?.videoUrl);
      videoRef.current.load();
    }
  }, [selectedScene, currentScene?.videoUrl]);

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
    // Don't manually set state here - let the video events handle it
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

  const selectThumbnailFromFileUpload = () => {
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

  const selectThumbnailFromGallery = (thumbnailUrl: string) => {
    setCustomThumbnail(thumbnailUrl);
    if (onThumbnailUpdate) {
      onThumbnailUpdate(selectedScene, thumbnailUrl);
    }
  };

  const removeThumbnailFromGallery = (index: number) => {
    setUserThumbnails(prev => prev.filter((_, i) => i !== index));
  };

  const selectVerticalLayout = (layout: string) => {
    setSelectedVerticalLayout(layout);
    console.log('📱 Selected vertical layout:', layout);
    // You can add logic here to apply the layout to the vertical video
  };

  const selectCaptionStyle = (style: string) => {
    setSelectedCaptionStyle(style);
    console.log('📝 Selected caption style:', style);
    // You can add logic here to apply the caption style to the video
  };

  const getCurrentThumbnail = () => {
    // Priority: customThumbnail (local) > updatedThumbnails (parent) > original scene thumbnail
    if (customThumbnail) return customThumbnail;
    if (updatedThumbnails?.[selectedScene]) return updatedThumbnails[selectedScene];
    return currentScene.thumbnail;
  };

  const captureFrameFromVideo = () => {
    const video = thumbnailVideoRef.current || videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      console.warn('❌ Video or canvas ref not available');
      return null;
    }

    // Check if video is loaded and has content
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.warn('❌ Video not loaded yet (dimensions:', video.videoWidth, 'x', video.videoHeight, ')');
      return getFallbackThumbnail();
    }

    console.log('✅ Video loaded with dimensions:', video.videoWidth, 'x', video.videoHeight);

    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return getFallbackThumbnail();

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
      
      console.log('🖼️ Captured thumbnail data URL length:', thumbnailDataUrl.length);
      
      // Update local state
      setCustomThumbnail(thumbnailDataUrl);
      
      // Add to user's thumbnail collection
      setUserThumbnails(prev => [...prev, thumbnailDataUrl]);
      
      return thumbnailDataUrl;
    } catch (error) {
      console.warn('❌ Canvas capture failed due to CORS or other security error:', error);
      return getFallbackThumbnail();
    }
  };

  const getFallbackThumbnail = () => {
    const video = thumbnailVideoRef.current || videoRef.current;
    
    // Try to use the current poster image as fallback
    const posterSrc = video?.poster;
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
    
    // Generate a placeholder thumbnail
    const placeholderThumbnail = generatePlaceholderThumbnail();
    if (placeholderThumbnail && onThumbnailUpdate) {
      console.log('🔄 Using generated placeholder thumbnail for scene:', selectedScene);
      onThumbnailUpdate(selectedScene, placeholderThumbnail);
      setCustomThumbnail(placeholderThumbnail);
      return placeholderThumbnail;
    }
    
    return currentThumbnail;
  };

  const generatePlaceholderThumbnail = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = 320;
    canvas.height = 180;
    
    // Create a gradient background
    const gradient = ctx.createLinearGradient(0, 0, 320, 180);
    gradient.addColorStop(0, '#4F46E5');
    gradient.addColorStop(1, '#7C3AED');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 320, 180);
    
    // Add text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Scene ' + (selectedScene + 1), 160, 100);
    
    ctx.font = '16px Arial';
    ctx.fillText('Thumbnail', 160, 130);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  // Function to render video player based on selected layout
  const renderLayoutBasedVideoPlayer = () => {
    const videoElement = (
      <video
        ref={videoRef}
        src={currentScene?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
        className="cursor-pointer transition-all duration-300 flex-shrink-0"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
        poster={getCurrentThumbnail()}
        muted={isMuted}
        preload="auto"
        autoPlay={false}
        playsInline
        controls={false}
        crossOrigin="anonymous"
        onClick={(e) => {
          e.stopPropagation();
          togglePlayPause();
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
            setMainVideoLoaded(true);
            console.log('✅ Main video metadata loaded - Duration:', videoRef.current.duration);
            console.log('📺 Main video dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
          }
        }}
        onTimeUpdate={() => {
          if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onCanPlay={() => {
          console.log('🎮 Main video can play');
        }}
        onLoadStart={() => {
          console.log('🎬 Main video load started:', videoRef.current?.src);
        }}
      >
        Your browser does not support the video tag.
      </video>
    );

    // Secondary video element for different parts of the same video
    const secondaryVideoElement = (
      <video
        src={currentScene?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
        className="cursor-pointer transition-all duration-300 flex-shrink-0"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
        poster={getCurrentThumbnail()}
        muted={isMuted}
        preload="auto"
        autoPlay={false}
        playsInline
        controls={false}
        crossOrigin="anonymous"
        onClick={(e) => {
          e.stopPropagation();
          togglePlayPause();
        }}
      >
        Your browser does not support the video tag.
      </video>
    );

    const layout = layoutOptions.find(l => l.id === selectedLayout);
    if (!layout) return videoElement;

    switch (layout.icon) {
      case 'single-full':
        return (
          <div className="w-full h-full relative">
            {videoElement}
          </div>
        );

      case 'split-vertical':
        return (
          <div className="w-full h-full flex gap-2">
            <div className="w-1/2 h-full relative">
              {videoElement}
            </div>
            <div className="w-1/2 h-full relative rounded overflow-hidden">
              {secondaryVideoElement}
            </div>
          </div>
        );

      case 'split-horizontal':
        return (
          <div className="w-full h-full flex flex-col gap-2">
            <div className="w-full h-1/2 relative">
              {videoElement}
            </div>
            <div className="w-full h-1/2 relative rounded overflow-hidden">
              {secondaryVideoElement}
            </div>
          </div>
        );

      case 'pip-top-right':
        return (
          <div className="w-full h-full relative">
            <div className="w-full h-full">
              {videoElement}
            </div>
            <div className="absolute top-4 right-4 w-1/3 h-1/3 rounded border-2 border-white overflow-hidden">
              {secondaryVideoElement}
            </div>
          </div>
        );

      case 'pip-bottom-right':
        return (
          <div className="w-full h-full relative">
            <div className="w-full h-full">
              {videoElement}
            </div>
            <div className="absolute bottom-4 right-4 w-1/3 h-1/3 rounded border-2 border-white overflow-hidden">
              {secondaryVideoElement}
            </div>
          </div>
        );

      case 'pip-bottom-left':
        return (
          <div className="w-full h-full relative">
            <div className="w-full h-full">
              {videoElement}
            </div>
            <div className="absolute bottom-4 left-4 w-1/3 h-1/3 rounded border-2 border-white overflow-hidden">
              {secondaryVideoElement}
            </div>
          </div>
        );

      case 'pip-top-left':
        return (
          <div className="w-full h-full relative">
            <div className="w-full h-full">
              {videoElement}
            </div>
            <div className="absolute top-4 left-4 w-1/3 h-1/3 rounded border-2 border-white overflow-hidden">
              {secondaryVideoElement}
            </div>
          </div>
        );

      case 'sidebar-right':
        return (
          <div className="w-full h-full flex gap-2">
            <div className="w-2/3 h-full relative">
              {videoElement}
            </div>
            <div className="w-1/3 h-full rounded flex flex-col gap-2">
              <div className="h-1/3 relative rounded overflow-hidden">
                {secondaryVideoElement}
              </div>
              <div className="h-1/3 relative rounded overflow-hidden">
                {secondaryVideoElement}
              </div>
              <div className="h-1/3 relative rounded overflow-hidden">
                {secondaryVideoElement}
              </div>
            </div>
          </div>
        );

      case 'sidebar-left':
        return (
          <div className="w-full h-full flex gap-2">
            <div className="w-1/3 h-full rounded flex flex-col gap-2">
              <div className="h-1/3 relative rounded overflow-hidden">
                {secondaryVideoElement}
              </div>
              <div className="h-1/3 relative rounded overflow-hidden">
                {secondaryVideoElement}
              </div>
              <div className="h-1/3 relative rounded overflow-hidden">
                {secondaryVideoElement}
              </div>
            </div>
            <div className="w-2/3 h-full relative">
              {videoElement}
            </div>
          </div>
        );

      case 'header-layout':
        return (
          <div className="w-full h-full flex flex-col gap-2">
            <div className="w-full h-1/4 relative rounded overflow-hidden">
              {secondaryVideoElement}
            </div>
            <div className="w-full h-3/4 relative">
              {videoElement}
            </div>
          </div>
        );

      case 'footer-layout':
        return (
          <div className="w-full h-full flex flex-col gap-2">
            <div className="w-full h-3/4 relative">
              {videoElement}
            </div>
            <div className="w-full h-1/4 relative rounded overflow-hidden">
              {secondaryVideoElement}
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full relative">
            {videoElement}
          </div>
        );
    }
  };

  const captureVerticalFrameFromVideo = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      console.warn('❌ Video or canvas ref not available for vertical capture');
      return null;
    }

    // Check if video is loaded and has content
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.warn('❌ Video not loaded yet for vertical capture');
      return null;
    }

    console.log('✅ Capturing vertical frame from video dimensions:', video.videoWidth, 'x', video.videoHeight);

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    
    // For vertical (9:16) aspect ratio
    const targetRatio = 9 / 16;
    const videoRatio = videoWidth / videoHeight;
    
    let cropWidth = videoWidth;
    let cropHeight = videoHeight;
    let offsetX = 0;
    let offsetY = 0;
    
    if (videoRatio > targetRatio) {
      // Video is wider than target, crop width
      cropWidth = videoHeight * targetRatio;
      offsetX = (videoWidth - cropWidth) / 2;
    } else {
      // Video is taller than target, crop height
      cropHeight = videoWidth / targetRatio;
      offsetY = (videoHeight - cropHeight) / 2;
    }

    canvas.width = cropWidth;
    canvas.height = cropHeight;
    
    // Set white background to prevent black frames
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cropWidth, cropHeight);
    
    // Draw video frame
    ctx.drawImage(video, offsetX, offsetY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

    const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    
    // Update vertical thumbnail state
    setVerticalThumbnail(thumbnailDataUrl);
    
    // Add to user's thumbnail collection
    setUserThumbnails(prev => [...prev, thumbnailDataUrl]);
    
    console.log('🖼️ Captured vertical thumbnail with data URL length:', thumbnailDataUrl.length);
    
    return thumbnailDataUrl;
  };

  const handleVerticalImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      if (imageUrl) {
        // Create a temporary image to check dimensions and crop if needed
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;

          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Calculate crop dimensions for 9:16 aspect ratio
          const targetRatio = 9 / 16;
          const imageRatio = img.width / img.height;
          
          let cropWidth = img.width;
          let cropHeight = img.height;
          let offsetX = 0;
          let offsetY = 0;
          
          if (imageRatio > targetRatio) {
            // Image is wider than target, crop width
            cropWidth = img.height * targetRatio;
            offsetX = (img.width - cropWidth) / 2;
          } else {
            // Image is taller than target, crop height
            cropHeight = img.width / targetRatio;
            offsetY = (img.height - cropHeight) / 2;
          }

          // Set canvas dimensions to target ratio
          canvas.width = cropWidth;
          canvas.height = cropHeight;
          
          // Set white background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, cropWidth, cropHeight);
          
          // Draw and crop the image
          ctx.drawImage(img, offsetX, offsetY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

          const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setVerticalThumbnail(croppedDataUrl);
          
          // Add to user's thumbnail collection
          setUserThumbnails(prev => [...prev, croppedDataUrl]);
          
          console.log('🖼️ Uploaded and cropped vertical thumbnail');
        };
        img.src = imageUrl;
      }
    };
    reader.readAsDataURL(file);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full flex flex-col overflow-y-auto overflow-x-hidden h-full min-w-0 max-w-full">
      {/* Landscape/Portrait Toggle - Top */}
      <div className="flex-shrink-0 min-h-0 mb-3">
        <div className="bg-slate-800 rounded-lg p-1 flex items-center justify-center w-fit mx-auto shadow-lg border border-slate-700">
          <button
            onClick={() => setVideoViewMode('landscape')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              videoViewMode === 'landscape'
                ? 'bg-slate-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            Landscape
          </button>
          <button
            onClick={() => setVideoViewMode('portrait')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              videoViewMode === 'portrait'
                ? 'bg-slate-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            Portrait
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className="flex flex-col min-h-0 w-full" style={{ minWidth: '500px' }}>
        {/* Main Video Container */}
        <div 
          className={`relative bg-black rounded-lg group shadow-lg transition-all duration-300 flex-shrink-0 flex items-center justify-center ${
            videoViewMode === 'portrait' 
              ? 'w-80 mx-auto aspect-[9/16]' 
              : 'w-full aspect-video'
          }`}
          style={{
            minWidth: videoViewMode === 'portrait' ? '320px' : '500px',
            maxWidth: videoViewMode === 'portrait' ? '320px' : '100%'
          }}
          onMouseEnter={() => setIsVideoHovered(true)}
          onMouseLeave={() => setIsVideoHovered(false)}
        >
          {/* Fallback image if video fails to load */}
          {!mainVideoLoaded && (
            <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-md absolute inset-0 z-10">
              <div className="text-center text-white">
                <div className="text-4xl mb-2">🎬</div>
                <p className="text-sm">Loading video...</p>
                <p className="text-xs text-gray-400 mt-1">Scene {selectedScene + 1}</p>
              </div>
            </div>
          )}
          {/* Layout-based Video Player */}
          {renderLayoutBasedVideoPlayer()}
          
          {/* Hover Overlay with Video Controls and Thumbnail Button */}
          {isVideoHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-30 z-20 transition-opacity duration-200 pointer-events-none">
              {/* Thumbnail Capture Button - Top Right */}
              <div className="absolute top-4 right-4 z-30 pointer-events-auto">
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent video click
                    console.log('🎬 Capture thumbnail clicked for scene:', selectedScene);
                    console.log('🎬 Video ref:', videoRef.current);
                    console.log('🎬 Video loaded:', videoRef.current?.readyState);
                    console.log('🎬 Video dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
                    console.log('🎬 onThumbnailUpdate callback:', !!onThumbnailUpdate);
                    
                    // Force update thumbnail even if video isn't loaded
                    let frameData = captureFrameFromVideo();
                    console.log('🎬 Capture result:', frameData ? 'Success' : 'Failed');
                    
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
                        console.log('📤 Notifying parent of thumbnail update for scene:', selectedScene);
                        onThumbnailUpdate(selectedScene, frameData);
                        
                        // Show success feedback
                        console.log('🎉 Thumbnail captured and updated successfully!');
                        console.log('📱 This should update the LHS scene list');
                        console.log('📋 This should update the publish popup thumbnails');
                      } else {
                        console.error('❌ onThumbnailUpdate callback is missing!');
                      }
                    } else {
                      console.error('❌ No thumbnail data available');
                    }
                  }}
                  size="sm"
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold flex items-center gap-2 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <span className="text-sm">📸</span>
                  <span className="text-xs">Capture</span>
                </Button>
              </div>

              {/* Video Controls - Bottom Center */}
              <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full px-4 z-30 pointer-events-auto ${
                videoViewMode === 'portrait' ? 'max-w-sm' : 'max-w-2xl'
              }`}>
                <div 
                  className="bg-black bg-opacity-80 rounded-lg p-3 backdrop-blur-sm"
                  onClick={(e) => e.stopPropagation()} // Prevent video click
                >
                  {/* All Controls in One Line */}
                  <div className="flex items-center gap-2">
                    {/* Play/Pause Button */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent video click
                        togglePlayPause();
                      }}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full transition-all duration-200 flex-shrink-0"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    
                    {/* Time Display */}
                    <span className="text-xs text-white font-mono min-w-[40px] flex-shrink-0">
                      {formatTime(currentTime)}
                    </span>
                    
                    {/* Progress Bar */}
                    <div className="flex-1 relative min-w-0">
                      <div 
                        className="h-2 w-full bg-white/30 rounded-full cursor-pointer overflow-hidden touch-none"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent video click
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
                          className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Duration Display */}
                    <span className="text-xs text-white font-mono min-w-[40px] text-right flex-shrink-0">
                      {formatTime(duration)}
                    </span>
                    
                    {/* Skip Backward */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent video click
                        skipBackward();
                      }}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full transition-all duration-200 flex-shrink-0"
                      title="Skip backward 10s"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    
                    {/* Skip Forward */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent video click
                        skipForward();
                      }}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full transition-all duration-200 flex-shrink-0"
                      title="Skip forward 10s"
                    >
                      <RotateCw className="w-4 h-4" />
                    </Button>
                    
                    {/* Volume Button */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent video click
                        toggleMute();
                      }}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full transition-all duration-200 flex-shrink-0"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    
                    {/* Speed Control - Only show in landscape mode */}
                    {videoViewMode === 'landscape' && (
                      <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                        <Select value={playbackRate.toString()} onValueChange={(value) => setPlaybackRate(parseFloat(value))}>
                          <SelectTrigger className="w-16 h-8 bg-white/20 border-white/30 text-white text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4].map(speed => (
                              <SelectItem key={speed} value={speed.toString()}>
                                {speed}x
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          

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
          
          
          {/* Hidden canvas for frame capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        {/* Unified Layout and Video Controls Bar */}
        <div className="mt-0 flex-shrink-0 min-h-0">
          {/* Layout Selection Section */}
          <div className="bg-slate-600 rounded-lg p-2 flex items-center justify-between gap-1 w-full">
            {/* Layout Options */}
            <div className="flex items-center justify-center gap-1 flex-1">
              {layoutOptions.map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => setSelectedLayout(layout.id)}
                  className={`w-8 h-6 rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                    selectedLayout === layout.id
                      ? 'bg-slate-800 border-2 border-blue-500'
                      : 'bg-slate-700 hover:bg-slate-800'
                  }`}
                  title={layout.name}
                >
                  {renderLayoutIcon(layout.icon)}
                </button>
              ))}
            </div>
            
            {/* Publish Button */}
            {onPublishAllScenes && (
              <Button
                onClick={() => onPublishAllScenes()}
                size="sm"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold flex items-center gap-2 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex-shrink-0"
                title="Publish Video"
              >
                <Upload className="w-4 h-4" />
                <span className="text-sm">Publish</span>
              </Button>
            )}
          </div>
          



        </div>
      </div>

      {/* Layout Selection Modal */}
      <Dialog open={showLayoutSelection} onOpenChange={setShowLayoutSelection}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Layout Options</DialogTitle>
          </DialogHeader>
          <div className="bg-slate-600 rounded-lg p-2 flex items-center justify-center gap-1 w-full">
            {layoutOptions.map((layout) => (
              <button
                key={layout.id}
                onClick={() => {
                  setSelectedLayout(layout.id);
                  setShowLayoutSelection(false);
                }}
                className={`w-8 h-6 rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                  selectedLayout === layout.id
                    ? 'bg-slate-800 border-2 border-blue-500'
                    : 'bg-slate-700 hover:bg-slate-800'
                }`}
                title={layout.name}
              >
                {renderLayoutIcon(layout.icon)}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom Thumbnail Status */}
      {customThumbnail && (
        <div className="mt-6 px-4 w-full">
          <div className="flex items-center justify-center gap-2">
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
        </div>
      )}


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
                      📱 Layouts
                    </Button>
                    <Button
                      variant={thumbnailMode === 'logo' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setThumbnailMode('logo')}
                      className={`flex-1 ${thumbnailMode === 'logo' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      📝 Caption Styles
                    </Button>
                  </div>

              {/* Vertical Video Layouts */}
              {thumbnailMode === 'preset' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">📱 Vertical Video Layouts</h3>
                    <p className="text-gray-600">Choose your preferred vertical video layout style</p>
                  </div>
                  
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {/* Layout 1: Focused on One */}
                    <div
                      onClick={() => selectVerticalLayout('focused-on-one')}
                      className={`cursor-pointer group border-2 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg bg-white ${
                        selectedVerticalLayout === 'focused-on-one' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-500'
                      }`}
                    >
                      <div className="aspect-[9/16] bg-gray-100 relative overflow-hidden">
                        {/* Mock vertical video content - Single focused element */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3/5 h-3/5 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-2xl">👤</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 text-center">
                        <h5 className="font-medium text-gray-900 text-xs">Focused on One</h5>
                        {selectedVerticalLayout === 'focused-on-one' && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
                        )}
                      </div>
                    </div>

                    {/* Layout 2: Half and Half */}
                    <div
                      onClick={() => selectVerticalLayout('half-and-half')}
                      className={`cursor-pointer group border-2 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg bg-white ${
                        selectedVerticalLayout === 'half-and-half' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-500'
                      }`}
                    >
                      <div className="aspect-[9/16] bg-gray-100 relative overflow-hidden">
                        {/* Mock vertical video content - Split vertically */}
                        <div className="absolute inset-0 flex flex-col">
                          <div className="h-1/2 bg-green-500 flex items-center justify-center">
                            <span className="text-white text-xl">A</span>
                          </div>
                          <div className="h-1/2 bg-blue-500 flex items-center justify-center">
                            <span className="text-white text-xl">B</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 text-center">
                        <h5 className="font-medium text-gray-900 text-xs">Half and Half</h5>
                        {selectedVerticalLayout === 'half-and-half' && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
                        )}
                      </div>
                    </div>

                    {/* Layout 3: Picture in Picture */}
                    <div
                      onClick={() => selectVerticalLayout('picture-in-picture')}
                      className={`cursor-pointer group border-2 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg bg-white ${
                        selectedVerticalLayout === 'picture-in-picture' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-500'
                      }`}
                    >
                      <div className="aspect-[9/16] bg-gray-100 relative overflow-hidden">
                        {/* Mock vertical video content - PiP */}
                        <div className="absolute inset-0 bg-purple-500"></div>
                        <div className="absolute bottom-4 right-4 w-1/3 h-1/4 bg-orange-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-lg">👤</span>
                        </div>
                      </div>
                      <div className="p-2 text-center">
                        <h5 className="font-medium text-gray-900 text-xs">Picture in Picture</h5>
                        {selectedVerticalLayout === 'picture-in-picture' && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
                        )}
                      </div>
                    </div>

                    {/* Layout 4: Full Screen */}
                    <div
                      onClick={() => selectVerticalLayout('full-screen')}
                      className={`cursor-pointer group border-2 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg bg-white ${
                        selectedVerticalLayout === 'full-screen' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-500'
                      }`}
                    >
                      <div className="aspect-[9/16] bg-gray-100 relative overflow-hidden">
                        {/* Mock vertical video content - Full screen */}
                        <div className="absolute inset-0 bg-red-500 flex items-center justify-center">
                          <span className="text-white text-2xl">📺</span>
                        </div>
                      </div>
                      <div className="p-2 text-center">
                        <h5 className="font-medium text-gray-900 text-xs">Full Screen</h5>
                        {selectedVerticalLayout === 'full-screen' && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
                        )}
                      </div>
                    </div>

                    {/* Layout 5: Split Screen */}
                    <div
                      onClick={() => selectVerticalLayout('split-screen')}
                      className={`cursor-pointer group border-2 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg bg-white ${
                        selectedVerticalLayout === 'split-screen' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-500'
                      }`}
                    >
                      <div className="aspect-[9/16] bg-gray-100 relative overflow-hidden">
                        {/* Mock vertical video content - Side by side */}
                        <div className="absolute inset-0 flex">
                          <div className="w-1/2 h-full bg-indigo-500 flex items-center justify-center">
                            <span className="text-white text-lg">L</span>
                          </div>
                          <div className="w-1/2 h-full bg-pink-500 flex items-center justify-center">
                            <span className="text-white text-lg">R</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 text-center">
                        <h5 className="font-medium text-gray-900 text-xs">Split Screen</h5>
                        {selectedVerticalLayout === 'split-screen' && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
                        )}
                      </div>
                    </div>

                    {/* Layout 6: Custom */}
                    <div
                      onClick={() => selectVerticalLayout('custom')}
                      className={`cursor-pointer group border-2 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg bg-white ${
                        selectedVerticalLayout === 'custom' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-500'
                      }`}
                    >
                      <div className="aspect-[9/16] bg-gray-100 relative overflow-hidden">
                        {/* Mock vertical video content - Custom layout */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                          <span className="text-gray-600 text-2xl">⚙️</span>
                        </div>
                      </div>
                      <div className="p-2 text-center">
                        <h5 className="font-medium text-gray-900 text-xs">Custom</h5>
                        {selectedVerticalLayout === 'custom' && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
                        )}
                      </div>
                    </div>
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

                    <div className="mb-6 flex justify-center">
                      <div className="relative max-w-md">
                        <video
                          ref={thumbnailVideoRef}
                          src={currentScene?.videoUrl}
                          poster={currentScene?.thumbnail}
                          className="object-cover rounded-lg shadow-lg cursor-pointer"
                          style={{ 
                            aspectRatio: aspectRatio === '16:9' ? '16/9' : aspectRatio === '9:16' ? '9/16' : '1/1',
                            width: aspectRatio === '9:16' ? '250px' : aspectRatio === '16:9' ? '400px' : '350px',
                            height: 'auto'
                          }}
                          preload="metadata"
                          controls={false}
                          muted
                          playsInline
                          onLoadStart={() => {
                            console.log('🎬 Thumbnail video load started:', currentScene?.videoUrl);
                          }}
                          onLoadedMetadata={() => {
                            if (thumbnailVideoRef.current) {
                              setDuration(thumbnailVideoRef.current.duration);
                              console.log('✅ Thumbnail video metadata loaded - Duration:', thumbnailVideoRef.current.duration);
                              console.log('📺 Thumbnail video dimensions:', thumbnailVideoRef.current.videoWidth, 'x', thumbnailVideoRef.current.videoHeight);
                            }
                          }}
                          onCanPlay={() => {
                            console.log('🎮 Thumbnail video can play');
                            // Reset playing state when video is ready
                            setThumbnailIsPlaying(false);
                            setThumbnailVideoLoaded(true);
                            console.log('📹 Video element ready:', thumbnailVideoRef.current?.readyState);
                          }}
                          onError={(e) => {
                            console.error('❌ Thumbnail video error:', e);
                            console.error('❌ Thumbnail video src:', currentScene?.videoUrl);
                            console.error('❌ Video error details:', {
                              error: e.currentTarget.error,
                              networkState: e.currentTarget.networkState,
                              readyState: e.currentTarget.readyState
                            });
                          }}
                          onTimeUpdate={() => {
                            if (thumbnailVideoRef.current) {
                              setCurrentTime(thumbnailVideoRef.current.currentTime);
                            }
                          }}
                          onEnded={() => {
                            setThumbnailIsPlaying(false);
                          }}
                          onPlay={() => {
                            setThumbnailIsPlaying(true);
                          }}
                          onPause={() => {
                            setThumbnailIsPlaying(false);
                          }}
                          onClick={() => {
                            console.log('🖱️ Video clicked');
                            console.log('📹 Video element:', thumbnailVideoRef.current);
                            console.log('▶️ Current playing state:', thumbnailIsPlaying);
                            console.log('📥 Video loaded:', thumbnailVideoLoaded);
                            
                            if (thumbnailVideoRef.current && thumbnailVideoLoaded) {
                              if (thumbnailIsPlaying) {
                                console.log('⏸️ Pausing video via click');
                                thumbnailVideoRef.current.pause();
                                setThumbnailIsPlaying(false);
                              } else {
                                console.log('▶️ Playing video via click');
                                thumbnailVideoRef.current.play().then(() => {
                                  console.log('✅ Video play started successfully via click');
                                }).catch((error) => {
                                  console.error('❌ Video play failed via click:', error);
                                });
                                setThumbnailIsPlaying(true);
                              }
                            } else {
                              console.error('❌ Video ref is null or not loaded on click:', {
                                videoRef: !!thumbnailVideoRef.current,
                                loaded: thumbnailVideoLoaded
                              });
                            }
                          }}
                        />
                        
                        {/* Interactive Timeline Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          {/* Timeline */}
                          <div className="mb-3">
                            <div className="relative">
                              <div className="h-1 bg-white/30 rounded-full">
                                <div 
                                  className="h-full bg-blue-500 rounded-full transition-all duration-150"
                                  style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
                              <div 
                                className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg cursor-pointer border-2 border-blue-500"
                                style={{ left: `${(currentTime / duration) * 100}%`, marginLeft: '-8px' }}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                                  if (rect && thumbnailVideoRef.current) {
                                    const handleMouseMove = (e: MouseEvent) => {
                                      const x = e.clientX - rect.left;
                                      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                                      const newTime = (percentage / 100) * duration;
                                      thumbnailVideoRef.current!.currentTime = newTime;
                                    };
                                    const handleMouseUp = () => {
                                      document.removeEventListener('mousemove', handleMouseMove);
                                      document.removeEventListener('mouseup', handleMouseUp);
                                    };
                                    document.addEventListener('mousemove', handleMouseMove);
                                    document.addEventListener('mouseup', handleMouseUp);
                                  }
                                }}
                              />
      </div>
                          </div>
                          
                          {/* Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  if (thumbnailVideoRef.current) {
                                    thumbnailVideoRef.current.currentTime = Math.max(0, thumbnailVideoRef.current.currentTime - 10);
                                  }
                                }}
                                className="text-white hover:bg-white/20"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  console.log('🎮 Play/Pause button clicked');
                                  console.log('📹 Video element:', thumbnailVideoRef.current);
                                  console.log('▶️ Current playing state:', thumbnailIsPlaying);
                                  console.log('📥 Video loaded:', thumbnailVideoLoaded);
                                  
                                  if (thumbnailVideoRef.current && thumbnailVideoLoaded) {
                                    if (thumbnailIsPlaying) {
                                      console.log('⏸️ Pausing video');
                                      thumbnailVideoRef.current.pause();
                                      setThumbnailIsPlaying(false);
                                    } else {
                                      console.log('▶️ Playing video');
                                      thumbnailVideoRef.current.play().then(() => {
                                        console.log('✅ Video play started successfully');
                                      }).catch((error) => {
                                        console.error('❌ Video play failed:', error);
                                      });
                                      setThumbnailIsPlaying(true);
                                    }
                                  } else {
                                    console.error('❌ Video ref is null or not loaded:', {
                                      videoRef: !!thumbnailVideoRef.current,
                                      loaded: thumbnailVideoLoaded
                                    });
                                  }
                                }}
                                className="text-white hover:bg-white/20"
                              >
                                {thumbnailIsPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  if (thumbnailVideoRef.current) {
                                    thumbnailVideoRef.current.currentTime = Math.min(duration, thumbnailVideoRef.current.currentTime + 10);
                                  }
                                }}
                                className="text-white hover:bg-white/20"
                              >
                                <RotateCw className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="text-white text-sm font-medium">
                              {formatTime(currentTime)} / {formatTime(duration)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Capture Button */}
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
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
                                onClick={selectThumbnailFromFileUpload}
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
                                onClick={selectThumbnailFromFileUpload}
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

              {/* User Thumbnail Gallery - Only for From Video and Upload Image tabs */}
              {userThumbnails.length > 0 && (thumbnailMode === 'timeline' || thumbnailMode === 'gallery') && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">🖼️ Your Thumbnail Collection</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {userThumbnails.map((thumbnail, index) => (
                      <div key={index} className="relative group">
                        <div 
                          className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                            customThumbnail === thumbnail 
                              ? 'border-blue-500 ring-2 ring-blue-200' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => selectThumbnailFromGallery(thumbnail)}
                          style={{ aspectRatio: aspectRatio === '16:9' ? '16/9' : aspectRatio === '9:16' ? '9/16' : '1/1' }}
                        >
                          <img
                            src={thumbnail}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Selection indicator */}
                          {customThumbnail === thumbnail && (
                            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center">
                              <Button
                                size="sm"
                                className="bg-white text-black hover:bg-gray-100 mb-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  selectThumbnailFromGallery(thumbnail);
                                }}
                              >
                                Use This
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-red-500 text-white border-red-500 hover:bg-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeThumbnailFromGallery(index);
                                }}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {userThumbnails.length > 0 && (
                    <div className="mt-3 text-center">
                      <p className="text-sm text-gray-500">
                        {userThumbnails.length} thumbnail{userThumbnails.length !== 1 ? 's' : ''} in your collection
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Caption Styles Tab */}
              {thumbnailMode === 'logo' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Caption Styles</h3>
                    <p className="text-sm text-gray-600 mb-6">Choose your preferred caption style for the video</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {/* No Captions */}
                      <div
                        onClick={() => selectCaptionStyle('none')}
                        className={`cursor-pointer group border-2 rounded-lg transition-all duration-200 hover:shadow-md bg-white p-4 ${
                          selectedCaptionStyle === 'none' 
                            ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <h5 className={`font-medium text-sm mb-3 ${
                          selectedCaptionStyle === 'none' ? 'text-blue-900' : 'text-gray-900'
                        }`}>No Captions</h5>
                        <p className={`text-xs ${
                          selectedCaptionStyle === 'none' ? 'text-blue-700' : 'text-gray-500'
                        }`}>No text overlays on video</p>
                      </div>

                      {/* Minimal Style */}
                      <div
                        onClick={() => selectCaptionStyle('minimal')}
                        className={`cursor-pointer group border-2 rounded-lg transition-all duration-200 hover:shadow-md bg-white p-4 ${
                          selectedCaptionStyle === 'minimal' 
                            ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <h5 className={`font-medium text-sm mb-3 ${
                          selectedCaptionStyle === 'minimal' ? 'text-blue-900' : 'text-gray-900'
                        }`}>Minimal</h5>
                        <p className={`text-xs leading-relaxed ${
                          selectedCaptionStyle === 'minimal' ? 'text-blue-700' : 'text-gray-500'
                        }`}>
                          This is an example text with{' '}
                          <span className="bg-gray-100 text-gray-700 px-1 rounded">highlighted</span>{' '}
                          word example.
                        </p>
                      </div>

                      {/* Modern Style */}
                      <div
                        onClick={() => selectCaptionStyle('modern')}
                        className={`cursor-pointer group border-2 rounded-lg transition-all duration-200 hover:shadow-md bg-white p-4 ${
                          selectedCaptionStyle === 'modern' 
                            ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <h5 className={`font-medium text-sm mb-3 ${
                          selectedCaptionStyle === 'modern' ? 'text-blue-900' : 'text-gray-900'
                        }`}>Modern</h5>
                        <p className={`text-xs leading-relaxed ${
                          selectedCaptionStyle === 'modern' ? 'text-blue-700' : 'text-gray-500'
                        }`}>
                          This is an example text with{' '}
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-medium shadow-sm">highlighted</span>{' '}
                          word example.
                        </p>
                      </div>

                      {/* Bold Style */}
                      <div
                        onClick={() => selectCaptionStyle('bold')}
                        className={`cursor-pointer group border-2 rounded-lg transition-all duration-200 hover:shadow-md bg-white p-4 ${
                          selectedCaptionStyle === 'bold' 
                            ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <h5 className={`font-medium text-sm mb-3 ${
                          selectedCaptionStyle === 'bold' ? 'text-blue-900' : 'text-gray-900'
                        }`}>Bold</h5>
                        <p className={`text-xs leading-relaxed ${
                          selectedCaptionStyle === 'bold' ? 'text-blue-700' : 'text-gray-500'
                        }`}>
                          This is an example text with{' '}
                          <span className="bg-yellow-400 text-gray-900 px-2 py-0.5 border border-yellow-500 font-bold">highlighted</span>{' '}
                          word example.
                        </p>
                      </div>

                      {/* Elegant Style */}
                      <div
                        onClick={() => selectCaptionStyle('elegant')}
                        className={`cursor-pointer group border-2 rounded-lg transition-all duration-200 hover:shadow-md bg-white p-4 ${
                          selectedCaptionStyle === 'elegant' 
                            ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <h5 className={`font-medium text-sm mb-3 ${
                          selectedCaptionStyle === 'elegant' ? 'text-blue-900' : 'text-gray-900'
                        }`}>Elegant</h5>
                        <p className={`text-xs leading-relaxed ${
                          selectedCaptionStyle === 'elegant' ? 'text-blue-700' : 'text-gray-500'
                        }`}>
                          This is an example text with{' '}
                          <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">highlighted</span>{' '}
                          word example.
                        </p>
                      </div>

                      {/* Neon Style */}
                      <div
                        onClick={() => selectCaptionStyle('neon')}
                        className={`cursor-pointer group border-2 rounded-lg transition-all duration-200 hover:shadow-md bg-white p-4 ${
                          selectedCaptionStyle === 'neon' 
                            ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <h5 className={`font-medium text-sm mb-3 ${
                          selectedCaptionStyle === 'neon' ? 'text-blue-900' : 'text-gray-900'
                        }`}>Neon</h5>
                        <p className={`text-xs leading-relaxed ${
                          selectedCaptionStyle === 'neon' ? 'text-blue-700' : 'text-gray-500'
                        }`}>
                          This is an example text with{' '}
                          <span className="bg-green-400 text-gray-900 px-2 py-0.5 font-bold shadow-md">highlighted</span>{' '}
                          word example.
                        </p>
                      </div>

                      {/* Retro Style */}
                      <div
                        onClick={() => selectCaptionStyle('retro')}
                        className={`cursor-pointer group border-2 rounded-lg transition-all duration-200 hover:shadow-md bg-white p-4 ${
                          selectedCaptionStyle === 'retro' 
                            ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <h5 className={`font-medium text-sm mb-3 ${
                          selectedCaptionStyle === 'retro' ? 'text-blue-900' : 'text-gray-900'
                        }`}>Retro</h5>
                        <p className={`text-xs leading-relaxed ${
                          selectedCaptionStyle === 'retro' ? 'text-blue-700' : 'text-gray-500'
                        }`}>
                          This is an example text with{' '}
                          <span className="bg-orange-300 text-gray-900 px-2 py-0.5 border border-orange-400 font-bold">highlighted</span>{' '}
                          word example.
                        </p>
                      </div>
                    </div>
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
                      <p>📱 Vertical Layouts</p>
                      <p className="text-xs text-gray-500 mt-1">Choose video layout style</p>
                    </div>
                  )}
                  {thumbnailMode === 'logo' && (
                    <div>
                      <p>📝 Caption Styles</p>
                      <p className="text-xs text-gray-500 mt-1">Choose text highlighting style</p>
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

      {/* Vertical Preview Modal */}
      <Dialog open={showVerticalPreview} onOpenChange={setShowVerticalPreview}>
        <DialogContent className="max-w-lg max-h-[70vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm">
              <Eye className="w-4 h-4" />
              Vertical Thumbnail
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-2">
            {/* Preview Container */}
            <div className="bg-black rounded-lg p-4 flex justify-center">
              <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ width: '180px', height: '320px' }}>
                {/* Vertical Video Preview */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900">
                  <div className="text-center text-white">
                    <div className="mb-2">
                      <video
                        src={currentScene?.videoUrl}
                        className="w-full h-auto max-h-full object-cover rounded"
                        style={{ aspectRatio: '9/16' }}
                        controls
                        muted
                        poster={verticalThumbnail || undefined}
                      />
                    </div>
                    <div className="text-xs text-gray-400">
                      Scene {selectedScene + 1} - Vertical Format
                    </div>
                  </div>
                </div>
                
                {/* Logo Overlay (if present) */}
                {logoWatermark.image && (
                  <div
                    className="absolute"
                    style={{
                      [logoWatermark.position.includes('top') ? 'top' : 'bottom']: '10px',
                      [logoWatermark.position.includes('left') ? 'left' : 'right']: '10px',
                      opacity: logoWatermark.opacity / 100
                    }}
                  >
                    <img
                      src={logoWatermark.image}
                      alt="Logo"
                      className="w-4 h-4 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Thumbnail Selection Button */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex gap-2">
                <Button
                  onClick={captureVerticalFrameFromVideo}
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  📸 Capture from Video
                </Button>
                <Button
                  onClick={() => verticalUploadRef.current?.click()}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  📁 Upload Image
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                💡 Capture the perfect frame from your video or upload a custom vertical thumbnail (9:16 ratio)
              </p>
            </div>
            
          </div>
          
          
          {/* Hidden file input for vertical thumbnail upload */}
          <input
            ref={verticalUploadRef}
            type="file"
            accept="image/*"
            onChange={handleVerticalImageUpload}
            className="hidden"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoPlayer;