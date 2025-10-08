import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface LogoWatermarkProps {
  onLogoChange: (logo: {
    image: string | null;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    opacity: number;
  }) => void;
  currentLogo: {
    image: string | null;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    opacity: number;
  };
}

const LogoWatermark: React.FC<LogoWatermarkProps> = ({ onLogoChange, currentLogo }) => {
  const [selectedLogo, setSelectedLogo] = useState<string | null>(currentLogo.image);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedLogo(result);
        onLogoChange({
          image: result,
          position: currentLogo.position,
          opacity: currentLogo.opacity
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePositionChange = (position: string) => {
    onLogoChange({
      image: currentLogo.image,
      position: position as 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right',
      opacity: currentLogo.opacity
    });
  };

  const handleOpacityChange = (value: number[]) => {
    onLogoChange({
      image: currentLogo.image,
      position: currentLogo.position,
      opacity: value[0]
    });
  };

  const removeLogo = () => {
    setSelectedLogo(null);
    onLogoChange({
      image: null,
      position: 'top-right',
      opacity: 0.5
    });
  };

  return (
    <div className="space-y-6">
      {/* Logo Upload Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo/Watermark Settings</h3>
        
        {selectedLogo ? (
          <div className="text-center">
            <div className="mb-4">
              <img
                src={selectedLogo}
                alt="Selected logo"
                className="w-32 h-32 object-contain mx-auto rounded-lg border-2 border-gray-200"
              />
            </div>
            <Button
              onClick={removeLogo}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-2" />
              Remove Logo
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 mb-4 bg-gray-50">
              <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Your Logo</h4>
              <p className="text-gray-600 mb-4">Add your brand logo or watermark to the video</p>
              <Button
                onClick={() => document.getElementById('logo-upload')?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Logo File
              </Button>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500">
              Supported formats: PNG, JPG, SVG. Recommended: Transparent PNG for best results.
            </p>
          </div>
        )}
      </div>

      {/* Position Settings */}
      {selectedLogo && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Logo Position</h4>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={currentLogo.position === 'top-left' ? 'default' : 'outline'}
              onClick={() => handlePositionChange('top-left')}
              className="w-full"
            >
              Top Left
            </Button>
            <Button
              variant={currentLogo.position === 'top-right' ? 'default' : 'outline'}
              onClick={() => handlePositionChange('top-right')}
              className="w-full"
            >
              Top Right
            </Button>
            <Button
              variant={currentLogo.position === 'bottom-left' ? 'default' : 'outline'}
              onClick={() => handlePositionChange('bottom-left')}
              className="w-full"
            >
              Bottom Left
            </Button>
            <Button
              variant={currentLogo.position === 'bottom-right' ? 'default' : 'outline'}
              onClick={() => handlePositionChange('bottom-right')}
              className="w-full"
            >
              Bottom Right
            </Button>
          </div>
        </div>
      )}

      {/* Opacity Settings */}
      {selectedLogo && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Logo Opacity</h4>
          <div className="space-y-3">
            <Slider
              value={[currentLogo.opacity]}
              onValueChange={handleOpacityChange}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Transparent</span>
              <span className="font-medium">{Math.round(currentLogo.opacity)}%</span>
              <span>Opaque</span>
            </div>
            <p className="text-xs text-gray-500">
              Adjust opacity to make your logo subtle or prominent
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoWatermark;
