import React, { useRef, useState, useEffect } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Info } from 'lucide-react';
import { scenes } from '@/data/projectDetailData';
import LogoWatermark from './LogoWatermark';

interface VideoPlayerProps {
  selectedScene: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ selectedScene }) => {
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
            const result = e.target?.result as string;
            setCustomThumbnail(result);
          };
          reader.readAsDataURL(file);
        }
      }
    };
    input.click();
  };

  const getCurrentThumbnail = () => {
    if (customThumbnail) return customThumbnail;
    return currentScene.thumbnail;
  };

  const captureFrameFromVideo = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    // Check if video is loaded and has content
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.warn('Video not loaded yet, using thumbnail instead');
      return getCurrentThumbnail();
    }

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

    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-[40%] bg-black flex flex-col p-6">
      {/* Video Player */}
      <div className="flex-1 flex flex-col">
        {/* Main Video Container */}
        <div className="relative bg-black rounded-lg overflow-hidden group">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster={getCurrentThumbnail()}
            muted={isMuted}
            preload="metadata"
            style={{ 
              minHeight: '500px',
              maxHeight: '600px',
              aspectRatio: '16/9',
              backgroundColor: '#f3f4f6'
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
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLogoSettings(true)}
              className="bg-black bg-opacity-70 text-white border-white hover:bg-opacity-90"
            >
              🏷️ Logo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowThumbnails(true)}
              className="bg-black bg-opacity-70 text-white border-white hover:bg-opacity-90"
            >
              🎨 Customize Preview
            </Button>
          </div>

          {/* Quick Frame Capture Button */}
          <div className="absolute bottom-3 left-3">
            <Button
              onClick={() => {
                const frameData = captureFrameFromVideo();
                if (frameData) {
                  setCustomThumbnail(frameData);
                  setShowThumbnails(false);
                  // Show brief success feedback
                  const button = document.querySelector('[data-capture-btn]');
                  if (button) {
                    button.textContent = '✅ Captured!';
                    setTimeout(() => {
                      button.textContent = '📸 Make Video thumbnail';
                    }, 1500);
                  }
                }
              }}
              data-capture-btn
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              📸 Make Video thumbnail
            </Button>
          </div>
          
          {/* Hidden canvas for frame capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        {/* Video Controls Section */}
        <div className="mt-4 space-y-4">
          {/* Progress Bar Section */}
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300 font-medium min-w-[50px]">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[progress]}
                onValueChange={handleSeek}
                max={100}
                step={0.1}
                className="flex-1"
              />
              <span className="text-sm text-slate-400 min-w-[50px] text-right">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Control Buttons Section */}
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={skipBackward}
                  className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600"
                  title="Skip back 10 seconds"
                >
                  <SkipBack className="w-4 h-4" />
                  <span className="ml-1 text-xs">10s</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePlayPause}
                  className="bg-blue-600 text-white border-blue-500 hover:bg-blue-700"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={skipForward}
                  className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600"
                  title="Skip forward 10 seconds"
                >
                  <SkipForward className="w-4 h-4" />
                  <span className="ml-1 text-xs">10s</span>
                </Button>
              </div>

              <div className="flex items-center gap-4">
                {/* Volume Control */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleMute}
                    className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Slider
                    value={[volume * 100]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="w-20"
                  />
                </div>

                {/* Speed Control */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-300">Speed:</span>
                  <Select value={playbackRate.toString()} onValueChange={(value) => changePlaybackRate(parseFloat(value))}>
                    <SelectTrigger className="w-16 h-8 bg-slate-700 border-slate-600 text-white text-xs">
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

      {/* Scene Info */}
      <div className="mt-3 text-center">
        <p className="text-sm text-slate-300">Scene {selectedScene + 1} Preview</p>
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

              {/* Enhanced Preset Thumbnails */}
              {thumbnailMode === 'preset' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">🎨 Professional Thumbnail Templates</h3>
                    <p className="text-gray-600">High-converting, eye-catching designs for maximum engagement</p>
                  </div>

                  {/* Professional Template Categories */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { 
                        id: 1, 
                        title: "Tech & Innovation", 
                        category: "Technology", 
                        gradient: "from-blue-500 via-purple-500 to-pink-500",
                        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop&q=80",
                        stats: "95% CTR"
                      },
                      { 
                        id: 2, 
                        title: "Business & Finance", 
                        category: "Business", 
                        gradient: "from-emerald-500 via-teal-500 to-cyan-500",
                        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop&q=80",
                        stats: "87% CTR"
                      },
                      { 
                        id: 3, 
                        title: "Education & Learning", 
                        category: "Education", 
                        gradient: "from-orange-500 via-red-500 to-pink-500",
                        image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop&q=80",
                        stats: "92% CTR"
                      },
                      { 
                        id: 4, 
                        title: "Lifestyle & Health", 
                        category: "Lifestyle", 
                        gradient: "from-pink-500 via-rose-500 to-red-500",
                        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop&q=80",
                        stats: "89% CTR"
                      },
                      { 
                        id: 5, 
                        title: "Creative & Design", 
                        category: "Creative", 
                        gradient: "from-indigo-500 via-purple-500 to-pink-500",
                        image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=250&fit=crop&q=80",
                        stats: "94% CTR"
                      },
                      { 
                        id: 6, 
                        title: "Nature & Environment", 
                        category: "Nature", 
                        gradient: "from-green-500 via-emerald-500 to-teal-500",
                        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop&q=80",
                        stats: "91% CTR"
                      }
                    ].map((template) => (
                      <div key={template.id} className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105">
                        <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 group-hover:border-blue-500 transition-all duration-300 shadow-lg group-hover:shadow-2xl">
                          <img
                            src={template.image}
                            alt={template.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-70`}></div>
                          <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                            <div className="mb-2">
                              <h4 className="font-bold text-lg mb-1">{template.title}</h4>
                              <p className="text-sm opacity-90">{template.category}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full font-medium">
                                {template.stats}
                              </span>
                              <span className="text-xs opacity-75">High Performance</span>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                              <Button 
                                size="sm" 
                                className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-6 py-2 shadow-lg"
                              >
                                ✨ Use Template
                              </Button>
                            </div>
                          </div>
                          <div className="absolute top-3 right-3">
                            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                              PRO
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Scene Thumbnails */}
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">📹 Quick Scene Selection</h4>
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
                              onClick={captureFrameFromVideo}
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
                    
                    {customThumbnail ? (
                      <div className="text-center">
                        <div className="mb-6">
                          <img
                            src={customThumbnail}
                            alt="Uploaded thumbnail preview"
                            className="w-full max-w-md mx-auto rounded-lg shadow-lg border-2 border-green-300"
                            style={{ aspectRatio: '16/9' }}
                          />
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
                          <p className="text-gray-600 mb-6">Perfect for branded content, custom artwork, or promotional images</p>
                          <Button
                            onClick={selectThumbnailFromGallery}
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                          >
                            📁 Choose from Gallery
                          </Button>
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
                    
                    {/* Predefined Logos Section */}
                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-900 mb-4">🎨 Predefined Logos</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {[
                          { id: 'tech', name: 'Tech', icon: '💻', color: 'bg-blue-500' },
                          { id: 'business', name: 'Business', icon: '💼', color: 'bg-gray-600' },
                          { id: 'creative', name: 'Creative', icon: '🎨', color: 'bg-purple-500' },
                          { id: 'education', name: 'Education', icon: '📚', color: 'bg-green-500' },
                          { id: 'health', name: 'Health', icon: '🏥', color: 'bg-red-500' },
                          { id: 'finance', name: 'Finance', icon: '💰', color: 'bg-yellow-500' },
                          { id: 'fitness', name: 'Fitness', icon: '💪', color: 'bg-orange-500' },
                          { id: 'travel', name: 'Travel', icon: '✈️', color: 'bg-cyan-500' }
                        ].map((logo) => (
                          <div
                            key={logo.id}
                            onClick={() => {
                              // Create a simple logo placeholder
                              const canvas = document.createElement('canvas');
                              canvas.width = 200;
                              canvas.height = 200;
                              const ctx = canvas.getContext('2d');
                              if (ctx) {
                                ctx.fillStyle = logo.color.replace('bg-', '#');
                                ctx.fillRect(0, 0, 200, 200);
                                ctx.fillStyle = 'white';
                                ctx.font = 'bold 60px Arial';
                                ctx.textAlign = 'center';
                                ctx.fillText(logo.icon, 100, 120);
                                const logoData = canvas.toDataURL();
                                setLogoWatermark({ ...logoWatermark, image: logoData });
                              }
                            }}
                            className="cursor-pointer group border-2 border-gray-200 rounded-lg p-4 text-center hover:border-blue-500 transition-all duration-200 hover:shadow-lg"
                          >
                            <div className={`w-16 h-16 mx-auto mb-2 rounded-lg ${logo.color} flex items-center justify-center text-white text-2xl`}>
                              {logo.icon}
                            </div>
                            <p className="text-sm font-medium text-gray-700">{logo.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Custom Logo Upload */}
                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">📁 Upload Custom Logo</h4>
                      <LogoWatermark
                        onLogoChange={setLogoWatermark}
                        currentLogo={logoWatermark}
                      />
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
                onLogoChange={setLogoWatermark}
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