import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon, Building2, Globe } from 'lucide-react';

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

// Simulate user's domain access (in real app, this would come from user profile/auth)
const getUserDomains = () => {
  // Mock user domains - in real app, this would be fetched from user profile
  return ['timesofindia.com', 'economicstimes.com', 'maharashtratimes.com'];
};

// Predefined logos for different domains
const domainLogos = {
  'timesofindia.com': {
    name: 'Times of India',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Times_of_India_logo.svg/200px-Times_of_India_logo.svg.png',
    color: '#1e40af'
  },
  'economicstimes.com': {
    name: 'Economic Times',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/The_Economic_Times_logo.svg/200px-The_Economic_Times_logo.svg.png',
    color: '#059669'
  },
  'maharashtratimes.com': {
    name: 'Maharashtra Times',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Maharashtra_Times_logo.svg/200px-Maharashtra_Times_logo.svg.png',
    color: '#dc2626'
  },
  'default': {
    name: 'Custom Logo',
    logo: null,
    color: '#6b7280'
  }
};

const LogoWatermark: React.FC<LogoWatermarkProps> = ({ onLogoChange, currentLogo }) => {
  const [selectedLogo, setSelectedLogo] = useState<string | null>(currentLogo.image);
  const [selectedDomain, setSelectedDomain] = useState<string>('default');
  const [logoSource, setLogoSource] = useState<'domain' | 'custom'>('custom');
  
  const userDomains = getUserDomains();

  const handleDomainSelection = (domain: string) => {
    setSelectedDomain(domain);
    setLogoSource('domain');
    
    if (domain !== 'default' && domainLogos[domain as keyof typeof domainLogos]) {
      const logoData = domainLogos[domain as keyof typeof domainLogos];
      if (logoData.logo) {
        setSelectedLogo(logoData.logo);
        onLogoChange({
          image: logoData.logo,
          position: currentLogo.position,
          opacity: currentLogo.opacity
        });
      }
    }
  };

  const handleLogoSourceChange = (source: 'domain' | 'custom') => {
    setLogoSource(source);
    if (source === 'domain' && selectedDomain !== 'default') {
      const logoData = domainLogos[selectedDomain as keyof typeof domainLogos];
      if (logoData.logo) {
        setSelectedLogo(logoData.logo);
        onLogoChange({
          image: logoData.logo,
          position: currentLogo.position,
          opacity: currentLogo.opacity
        });
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedLogo(result);
        setLogoSource('custom');
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
      {/* Logo Selection Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🏢 Logo & Watermark Settings</h3>
        
        {/* Logo Source Selection */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Choose Logo Source</h4>
          <div className="flex gap-2">
            <Button
              variant={logoSource === 'domain' ? 'default' : 'outline'}
              onClick={() => handleLogoSourceChange('domain')}
              className="flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              Domain Logos
            </Button>
            <Button
              variant={logoSource === 'custom' ? 'default' : 'outline'}
              onClick={() => handleLogoSourceChange('custom')}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Custom Upload
            </Button>
          </div>
        </div>

        {/* Domain Logo Selection */}
        {logoSource === 'domain' && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Select Domain Logo</h4>
            <div className="grid grid-cols-1 gap-3">
              {userDomains.map((domain) => {
                const logoData = domainLogos[domain as keyof typeof domainLogos];
                return (
                  <div
                    key={domain}
                    onClick={() => handleDomainSelection(domain)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedDomain === domain 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: logoData.color }}
                      >
                        {logoData.logo ? (
                          <img 
                            src={logoData.logo} 
                            alt={logoData.name}
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <Globe className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{logoData.name}</h5>
                        <p className="text-sm text-gray-500">{domain}</p>
                      </div>
                      {selectedDomain === domain && (
                        <div className="ml-auto">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Custom Logo Upload */}
        {logoSource === 'custom' && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Upload Custom Logo</h4>
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
          </div>
        )}

        {/* Current Logo Preview */}
        {selectedLogo && (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="mb-3">
              <img
                src={selectedLogo}
                alt="Selected logo"
                className="w-24 h-24 object-contain mx-auto rounded-lg border-2 border-gray-200"
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
        )}
      </div>

      {/* Position Settings */}
      {selectedLogo && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">📍 Logo Position</h4>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={currentLogo.position === 'top-left' ? 'default' : 'outline'}
              onClick={() => handlePositionChange('top-left')}
              className="w-full h-12 flex items-center justify-center gap-2"
            >
              <span>↖️</span>
              Top Left
            </Button>
            <Button
              variant={currentLogo.position === 'top-right' ? 'default' : 'outline'}
              onClick={() => handlePositionChange('top-right')}
              className="w-full h-12 flex items-center justify-center gap-2"
            >
              <span>↗️</span>
              Top Right
            </Button>
            <Button
              variant={currentLogo.position === 'bottom-left' ? 'default' : 'outline'}
              onClick={() => handlePositionChange('bottom-left')}
              className="w-full h-12 flex items-center justify-center gap-2"
            >
              <span>↙️</span>
              Bottom Left
            </Button>
            <Button
              variant={currentLogo.position === 'bottom-right' ? 'default' : 'outline'}
              onClick={() => handlePositionChange('bottom-right')}
              className="w-full h-12 flex items-center justify-center gap-2"
            >
              <span>↘️</span>
              Bottom Right
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Choose where to place the logo on your video
          </p>
        </div>
      )}

      {/* Opacity Settings */}
      {selectedLogo && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">🎨 Logo Opacity</h4>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Transparency Level</span>
                <span className="text-lg font-bold text-blue-600">{Math.round(currentLogo.opacity)}%</span>
              </div>
              <Slider
                value={[currentLogo.opacity]}
                onValueChange={handleOpacityChange}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                <span>👻 Invisible</span>
                <span>🎯 Perfect</span>
                <span>💪 Bold</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpacityChange([25])}
                className="text-xs"
              >
                Light (25%)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpacityChange([50])}
                className="text-xs"
              >
                Medium (50%)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpacityChange([75])}
                className="text-xs"
              >
                Strong (75%)
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              💡 Lower opacity makes the logo subtle, higher opacity makes it prominent
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoWatermark;
