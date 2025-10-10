import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Upload, Youtube, Globe, Instagram, Twitter, Facebook, Linkedin, Twitch,  Twitter as X, Video, PlayCircle, FolderOpen } from 'lucide-react';

interface PublishSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentSceneIndex?: number;
  totalScenes?: number;
}

const PublishSettingsDialog: React.FC<PublishSettingsDialogProps> = ({ 
  isOpen, 
  onClose, 
  currentSceneIndex = 0, 
  totalScenes = 7 
}) => {
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(['slike']);
  const [publishScope, setPublishScope] = useState<'current' | 'all'>('current');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  // All publishing destinations organized by category
  const publishDestinations = {
    socialMedia: [
      { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600', description: 'Instagram Feed & Stories' },
      { id: 'twitter', name: 'Twitter/X', icon: X, color: 'text-gray-900', description: 'Social media posts' },
      { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600', description: 'Facebook videos & posts' },
      { id: 'meta', name: 'Meta', icon: Facebook, color: 'text-blue-700', description: 'Meta platforms integration' },
      { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', description: 'Professional content' },
      { id: 'snapchat', name: 'Snapchat', icon: Globe, color: 'text-yellow-500', description: 'Snapchat Stories & Spotlight' },
      { id: 'pinterest', name: 'Pinterest', icon: Globe, color: 'text-red-600', description: 'Visual discovery platform' }
    ],
    videoPlatforms: [
      { id: 'youtube1', name: 'Tech Reviews Channel', icon: Youtube, color: 'text-red-600', description: '15.2K subscribers' },
      { id: 'youtube2', name: 'Educational Content', icon: Youtube, color: 'text-red-600', description: '8.7K subscribers' },
      { id: 'youtube3', name: 'Personal Vlogs', icon: Youtube, color: 'text-red-600', description: '3.1K subscribers' },
      { id: 'twitch', name: 'Twitch', icon: Twitch, color: 'text-purple-600', description: 'Live streaming platform' }
    ],
    generalPlatforms: [
      { id: 'slike', name: 'Slike', icon: Globe, color: 'text-gray-700', description: 'General publishing platform' },
      { id: 'dailymotion', name: 'Dailymotion', icon: Globe, color: 'text-blue-600', description: 'Video sharing platform' },
      { id: 'rumble', name: 'Rumble', icon: Globe, color: 'text-green-600', description: 'Independent video platform' },
      { id: 'odysee', name: 'Odysee', icon: Globe, color: 'text-orange-600', description: 'Decentralized video platform' }
    ]
  };

  const handleDestinationToggle = (destinationId: string) => {
    setSelectedDestinations(prev => 
      prev.includes(destinationId) 
        ? prev.filter(id => id !== destinationId)
        : [...prev, destinationId]
    );
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
    navigate('/projects');
  };

  const getCategoryTitle = (category: keyof typeof publishDestinations) => {
    switch (category) {
      case 'socialMedia':
        return 'Social Media Platforms';
      case 'videoPlatforms':
        return 'Video Platforms';
      case 'generalPlatforms':
        return 'General Platforms';
      default:
        return 'Platforms';
    }
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
              {publishScope === 'current' 
                ? `Uploading Scene ${currentSceneIndex + 1} to ${selectedDestinations.length} destination${selectedDestinations.length !== 1 ? 's' : ''}... ${progress}%`
                : `Uploading all scenes to ${selectedDestinations.length} destination${selectedDestinations.length !== 1 ? 's' : ''}... ${progress}%`
              }
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="!max-w-[85vw] !w-[85vw] sm:!max-w-xl sm:!w-full max-h-[80vh] overflow-hidden mx-4 sm:mx-auto"
        style={{ 
          maxWidth: '85vw !important',
          width: '85vw !important',
          left: '50% !important',
          top: '50% !important',
          transform: 'translate(-50%, -50%) !important',
          marginLeft: 'auto !important',
          marginRight: 'auto !important'
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Publish Settings
          </DialogTitle>
        </DialogHeader>

        {/* Publish Scope Selection */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
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

        <div className="space-y-6 max-h-96 overflow-y-auto pr-4">
          {/* Social Media Platforms */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">{getCategoryTitle('socialMedia')}</h3>
            <div className="grid grid-cols-1 gap-3">
              {publishDestinations.socialMedia.map((destination) => {
                const IconComponent = destination.icon;
                return (
                  <div
                    key={destination.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox
                      id={destination.id}
                      checked={selectedDestinations.includes(destination.id)}
                      onCheckedChange={() => handleDestinationToggle(destination.id)}
                    />
                    <div className="flex items-center space-x-3 flex-1">
                      <IconComponent className={`w-5 h-5 ${destination.color}`} />
                      <div className="flex-1">
                        <label htmlFor={destination.id} className="text-sm font-medium text-gray-900 cursor-pointer">
                          {destination.name}
                        </label>
                        <p className="text-xs text-gray-500">{destination.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Video Platforms */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">{getCategoryTitle('videoPlatforms')}</h3>
            <div className="grid grid-cols-1 gap-3">
              {publishDestinations.videoPlatforms.map((destination) => {
                const IconComponent = destination.icon;
                return (
                  <div
                    key={destination.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox
                      id={destination.id}
                      checked={selectedDestinations.includes(destination.id)}
                      onCheckedChange={() => handleDestinationToggle(destination.id)}
                    />
                    <div className="flex items-center space-x-3 flex-1">
                      <IconComponent className={`w-5 h-5 ${destination.color}`} />
                      <div className="flex-1">
                        <label htmlFor={destination.id} className="text-sm font-medium text-gray-900 cursor-pointer">
                          {destination.name}
                        </label>
                        <p className="text-xs text-gray-500">{destination.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* General Platforms */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">{getCategoryTitle('generalPlatforms')}</h3>
            <div className="grid grid-cols-1 gap-3">
              {publishDestinations.generalPlatforms.map((destination) => {
                const IconComponent = destination.icon;
                return (
                  <div
                    key={destination.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox
                      id={destination.id}
                      checked={selectedDestinations.includes(destination.id)}
                      onCheckedChange={() => handleDestinationToggle(destination.id)}
                    />
                    <div className="flex items-center space-x-3 flex-1">
                      <IconComponent className={`w-5 h-5 ${destination.color}`} />
                      <div className="flex-1">
                        <label htmlFor={destination.id} className="text-sm font-medium text-gray-900 cursor-pointer">
                          {destination.name}
                        </label>
                        <p className="text-xs text-gray-500">{destination.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handlePublish}
            disabled={selectedDestinations.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {publishScope === 'current' 
              ? `Publish Scene ${currentSceneIndex + 1} (${selectedDestinations.length} destination${selectedDestinations.length !== 1 ? 's' : ''})`
              : `Publish (${selectedDestinations.length} destination${selectedDestinations.length !== 1 ? 's' : ''})`
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublishSettingsDialog;