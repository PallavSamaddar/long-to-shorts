
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Upload, Youtube, Globe } from 'lucide-react';

interface PublishSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: () => void;
}

const PublishSettingsDialog: React.FC<PublishSettingsDialogProps> = ({
  isOpen,
  onClose,
  onPublish
}) => {
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(['slike']);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock YouTube destinations from settings
  const youtubeDestinations = [
    { id: 'channel1', name: 'Tech Reviews Channel', subscribers: '15.2K' },
    { id: 'channel2', name: 'Educational Content', subscribers: '8.7K' },
    { id: 'channel3', name: 'Personal Vlogs', subscribers: '3.1K' }
  ];

  const handleDestinationToggle = (destination: string) => {
    setSelectedDestinations(prev => 
      prev.includes(destination)
        ? prev.filter(d => d !== destination)
        : [...prev, destination]
    );
  };

  const handlePublish = async () => {
    if (selectedDestinations.length === 0) return;

    setIsProcessing(true);
    setProgress(0);

    // Simulate processing with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            onPublish();
            // Navigate back to the project page
            navigate(`/projects/${id}`);
          }, 500);
          return 100;
        }
        return prev + 25;
      });
    }, 1000);
  };

  if (isProcessing) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Processing Videos</h3>
            <p className="text-sm text-slate-600 text-center mb-4">
              Your videos are processing, all videos will be available under PUBLISHED FILES
            </p>
            <Progress value={progress} className="w-full max-w-xs" />
            <p className="text-xs text-slate-500 mt-2">{progress}% complete</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Publish Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-3">Publish Destinations</h4>
            
            {/* Slike Destination */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-slate-50">
                <Checkbox
                  id="slike"
                  checked={selectedDestinations.includes('slike')}
                  onCheckedChange={() => handleDestinationToggle('slike')}
                />
                <div className="flex items-center gap-2 flex-1">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <label htmlFor="slike" className="text-sm font-medium cursor-pointer">
                    Slike
                  </label>
                </div>
              </div>

              {/* YouTube Destinations */}
              <div className="space-y-2">
                <p className="text-sm text-slate-600 font-medium">YouTube Destinations</p>
                {youtubeDestinations.map((channel) => (
                  <div key={channel.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-slate-50">
                    <Checkbox
                      id={channel.id}
                      checked={selectedDestinations.includes(channel.id)}
                      onCheckedChange={() => handleDestinationToggle(channel.id)}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <Youtube className="w-4 h-4 text-red-600" />
                      <div className="flex-1">
                        <label htmlFor={channel.id} className="text-sm font-medium cursor-pointer block">
                          {channel.name}
                        </label>
                        <p className="text-xs text-slate-500">{channel.subscribers} subscribers</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handlePublish}
              disabled={selectedDestinations.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Publish ({selectedDestinations.length} destination{selectedDestinations.length !== 1 ? 's' : ''})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublishSettingsDialog;
