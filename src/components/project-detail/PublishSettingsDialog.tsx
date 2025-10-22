import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Upload, Video, PlayCircle, FolderOpen, Smartphone, Monitor, RotateCcw, Download, DownloadCloud, Image } from 'lucide-react';

interface PublishSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishComplete?: () => void;
  currentSceneIndex?: number;
  totalScenes?: number;
  availableThumbnails?: { [key: number]: string };
}

const PublishSettingsDialog: React.FC<PublishSettingsDialogProps> = ({ 
  isOpen, 
  onClose, 
  onPublishComplete,
  currentSceneIndex = 0, 
  totalScenes = 7,
  availableThumbnails = {}
}) => {
  const [publishScope, setPublishScope] = useState<'current' | 'all'>('current');
  const [videoOrientation, setVideoOrientation] = useState<'vertical' | 'horizontal' | 'both'>('both');
  const [selectedThumbnails, setSelectedThumbnails] = useState<{ [key: number]: string }>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedThumbnail, setUploadedThumbnail] = useState<string | null>(null);
  const navigate = useNavigate();

  // Only Slike platform is available for publishing


  const handleThumbnailToggle = (sceneIndex: number, thumbnailUrl: string) => {
    setSelectedThumbnails(prev => {
      const newThumbnails = { ...prev };
      if (newThumbnails[sceneIndex] === thumbnailUrl) {
        delete newThumbnails[sceneIndex];
      } else {
        newThumbnails[sceneIndex] = thumbnailUrl;
      }
      return newThumbnails;
    });
  };

  // Get available thumbnails based on orientation
  const getAvailableThumbnails = () => {
    const thumbnails = Object.entries(availableThumbnails).map(([sceneIndex, thumbnailUrl]) => ({
      sceneIndex: parseInt(sceneIndex),
      thumbnailUrl
    }));
    
    // For now, show all available thumbnails regardless of orientation
    // In the future, we could store aspect ratio metadata with thumbnails
    return thumbnails;
  };

  const handlePublish = async () => {
    setIsProcessing(true);
    setProgress(0);

    // Simulate publishing process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }

    setIsProcessing(false);
    onClose();
    
    // Call the publish complete handler if provided
    if (onPublishComplete) {
      onPublishComplete();
    } else {
      // Fallback to navigation
      navigate('/projects');
    }
  };

  const handleDownloadAll = () => {
    // Simulate downloading all videos
    console.log('📥 Downloading all videos...');
    // In a real app, this would trigger actual download
    alert('Downloading all videos...');
  };

  const handleDownloadCurrent = () => {
    // Simulate downloading current video
    console.log('📥 Downloading current video...');
    // In a real app, this would trigger actual download
    alert('Downloading current video...');
  };

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedThumbnail(result);
        console.log('📸 Thumbnail uploaded:', file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveUploadedThumbnail = () => {
    setUploadedThumbnail(null);
  };


  if (isProcessing) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Publishing Videos...
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 text-center">
              Publishing to Slike... {progress}%
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="!max-w-[90vw] !w-[90vw] sm:!max-w-2xl sm:!w-full max-h-[85vh] mx-4 sm:mx-auto flex flex-col"
        style={{ 
          maxWidth: '90vw !important',
          width: '90vw !important',
          left: '50% !important',
          top: '50% !important',
          transform: 'translate(-50%, -50%) !important',
          marginLeft: 'auto !important',
          marginRight: 'auto !important'
        }}
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Publish Settings
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {/* Publish Scope Selection */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Video className="w-4 h-4" />
              What would you like to publish?
            </h3>
            <RadioGroup value={publishScope} onValueChange={(value) => setPublishScope(value as 'current' | 'all')}>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="current" id="current" />
                  <div className="flex items-center space-x-3 flex-1">
                    <PlayCircle className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <Label htmlFor="current" className="text-sm font-medium text-gray-900 cursor-pointer">
                        Current Scene Only
                      </Label>
                      <p className="text-xs text-gray-500">
                        Publish Scene {currentSceneIndex + 1} of {totalScenes} ({publishScope === 'current' ? 'Selected' : 'Click to select'})
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="all" id="all" />
                  <div className="flex items-center space-x-3 flex-1">
                    <FolderOpen className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <Label htmlFor="all" className="text-sm font-medium text-gray-900 cursor-pointer">
                        Publish
                      </Label>
                      <p className="text-xs text-gray-500">
                        Publish all {totalScenes} scenes as a complete project
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Video Orientation Selection */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Video Orientation
            </h3>
            <RadioGroup value={videoOrientation} onValueChange={(value) => setVideoOrientation(value as 'vertical' | 'horizontal' | 'both')}>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="vertical" id="vertical" />
                  <div className="flex items-center space-x-3 flex-1">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <Label htmlFor="vertical" className="text-sm font-medium text-gray-900 cursor-pointer">
                        Vertical Video (9:16)
                      </Label>
                      <p className="text-xs text-gray-500">
                        Optimized for mobile viewing, Instagram Stories, TikTok
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="horizontal" id="horizontal" />
                  <div className="flex items-center space-x-3 flex-1">
                    <Monitor className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <Label htmlFor="horizontal" className="text-sm font-medium text-gray-900 cursor-pointer">
                        Horizontal Video (16:9)
                      </Label>
                      <p className="text-xs text-gray-500">
                        Optimized for desktop viewing, YouTube, Facebook
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="both" id="both" />
                  <div className="flex items-center space-x-3 flex-1">
                    <Video className="w-5 h-5 text-purple-600" />
                    <div className="flex-1">
                      <Label htmlFor="both" className="text-sm font-medium text-gray-900 cursor-pointer">
                        Both Orientations
                      </Label>
                      <p className="text-xs text-gray-500">
                        Publish in both vertical and horizontal formats
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Debug Information */}
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200 mb-4">
            <p className="text-xs text-yellow-800">
              <strong>Debug:</strong> Orientation: {videoOrientation} | Thumbnails: {Object.keys(availableThumbnails).length} | 
              Available: {JSON.stringify(Object.keys(availableThumbnails))}
            </p>
          </div>

          {/* Vertical Thumbnail Selection - Only show when vertical is selected */}
          {videoOrientation === 'vertical' && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Choose Vertical Thumbnails
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                Select thumbnails optimized for vertical viewing (9:16 aspect ratio)
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {getAvailableThumbnails().map(({ sceneIndex, thumbnailUrl }) => (
                  <div
                    key={`vertical-${sceneIndex}-${thumbnailUrl}`}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedThumbnails[sceneIndex] === thumbnailUrl
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleThumbnailToggle(sceneIndex, thumbnailUrl)}
                    style={{ aspectRatio: '9/16' }}
                  >
                    <img
                      src={thumbnailUrl}
                      alt={`Scene ${sceneIndex + 1} vertical thumbnail`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Selection indicator */}
                    {selectedThumbnails[sceneIndex] === thumbnailUrl && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Scene number overlay */}
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      Scene {sceneIndex + 1}
                    </div>
                    
                    {/* Vertical indicator */}
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      📱 9:16
                    </div>
                  </div>
                ))}
              </div>
              
              {getAvailableThumbnails().length === 0 && (
                <div className="text-center py-8 text-blue-600">
                  <Smartphone className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No vertical thumbnails available</p>
                  <p className="text-sm">Create some thumbnails first to see them here</p>
                </div>
              )}
            </div>
          )}

          {/* Horizontal Thumbnail Selection - Only show when horizontal is selected */}
          {videoOrientation === 'horizontal' && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Choose Horizontal Thumbnails
              </h3>
              <p className="text-sm text-green-700 mb-4">
                Select thumbnails optimized for horizontal viewing (16:9 aspect ratio)
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {getAvailableThumbnails().map(({ sceneIndex, thumbnailUrl }) => (
                  <div
                    key={`horizontal-${sceneIndex}-${thumbnailUrl}`}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedThumbnails[sceneIndex] === thumbnailUrl
                        ? 'border-green-500 ring-2 ring-green-200'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => handleThumbnailToggle(sceneIndex, thumbnailUrl)}
                    style={{ aspectRatio: '16/9' }}
                  >
                    <img
                      src={thumbnailUrl}
                      alt={`Scene ${sceneIndex + 1} horizontal thumbnail`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Selection indicator */}
                    {selectedThumbnails[sceneIndex] === thumbnailUrl && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Scene number overlay */}
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      Scene {sceneIndex + 1}
                    </div>
                    
                    {/* Horizontal indicator */}
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      🖥️ 16:9
                    </div>
                  </div>
                ))}
              </div>
              
              {getAvailableThumbnails().length === 0 && (
                <div className="text-center py-8 text-green-600">
                  <Monitor className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No horizontal thumbnails available</p>
                  <p className="text-sm">Create some thumbnails first to see them here</p>
                </div>
              )}
            </div>
          )}

          {/* Both Orientations Thumbnail Selection - Stacked Layout */}
          {videoOrientation === 'both' && (
            <div className="space-y-6">
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Choose Thumbnails for Both Orientations
                </h3>
                <p className="text-sm text-purple-700">
                  Select thumbnails for each orientation separately
                </p>
              </div>
              
              {/* Vertical Thumbnails Section */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Vertical Thumbnails (9:16)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {getAvailableThumbnails().map(({ sceneIndex, thumbnailUrl }) => (
                    <div
                      key={`both-vertical-${sceneIndex}-${thumbnailUrl}`}
                      className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedThumbnails[sceneIndex] === thumbnailUrl
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => handleThumbnailToggle(sceneIndex, thumbnailUrl)}
                      style={{ aspectRatio: '9/16' }}
                    >
                      <img
                        src={thumbnailUrl}
                        alt={`Scene ${sceneIndex + 1} vertical thumbnail`}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Selection indicator */}
                      {selectedThumbnails[sceneIndex] === thumbnailUrl && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Scene number overlay */}
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        Scene {sceneIndex + 1}
                      </div>
                      
                      {/* Vertical indicator */}
                      <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        📱 9:16
                      </div>
                    </div>
                  ))}
                </div>
                
                {getAvailableThumbnails().length === 0 && (
                  <div className="text-center py-8 text-blue-600">
                    <Smartphone className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No vertical thumbnails available</p>
                    <p className="text-sm">Create some thumbnails first to see them here</p>
                  </div>
                )}
              </div>
              
              {/* Horizontal Thumbnails Section */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Horizontal Thumbnails (16:9)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {getAvailableThumbnails().map(({ sceneIndex, thumbnailUrl }) => (
                    <div
                      key={`both-horizontal-${sceneIndex}-${thumbnailUrl}`}
                      className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedThumbnails[sceneIndex] === thumbnailUrl
                          ? 'border-green-500 ring-2 ring-green-200'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => handleThumbnailToggle(sceneIndex, thumbnailUrl)}
                      style={{ aspectRatio: '16/9' }}
                    >
                      <img
                        src={thumbnailUrl}
                        alt={`Scene ${sceneIndex + 1} horizontal thumbnail`}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Selection indicator */}
                      {selectedThumbnails[sceneIndex] === thumbnailUrl && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Scene number overlay */}
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        Scene {sceneIndex + 1}
                      </div>
                      
                      {/* Horizontal indicator */}
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        🖥️ 16:9
                      </div>
                    </div>
                  ))}
                </div>
                
                {getAvailableThumbnails().length === 0 && (
                  <div className="text-center py-8 text-green-600">
                    <Monitor className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No horizontal thumbnails available</p>
                    <p className="text-sm">Create some thumbnails first to see them here</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 pt-4 border-t border-gray-200">
          {/* Thumbnail Upload Section */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Custom Thumbnail</h4>
            <div className="space-y-3">
              {uploadedThumbnail ? (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={uploadedThumbnail} 
                      alt="Uploaded thumbnail" 
                      className="w-20 h-14 object-cover rounded border"
                    />
                    <button
                      onClick={handleRemoveUploadedThumbnail}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Custom thumbnail uploaded</p>
                    <p className="text-xs text-gray-500">This will be used for the published video</p>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label 
                    htmlFor="thumbnail-upload" 
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Image className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Upload Custom Thumbnail</p>
                      <p className="text-xs text-gray-500">Click to select an image file</p>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Download Options */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Download Options</h4>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleDownloadCurrent}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Current Video
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadAll}
                className="flex items-center gap-2"
              >
                <DownloadCloud className="w-4 h-4" />
                Download All Videos
              </Button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handlePublish}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Process to Slike
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublishSettingsDialog;