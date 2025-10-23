import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Building2 } from 'lucide-react';

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
  
  const userDomains = getUserDomains();

  const handleDomainSelection = (domain: string) => {
    setSelectedDomain(domain);
    
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


  return (
    <div className="space-y-6">
      {/* Logo Selection Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        
        {/* Domain Logo Selection */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Select Domain Logo</h4>
            <div className={`grid gap-2 w-full ${
              userDomains.length === 1 ? 'grid-cols-1' :
              userDomains.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
              userDomains.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
              userDomains.length === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
              'grid-cols-1'
            }`}>
              {userDomains.map((domain) => {
                const logoData = domainLogos[domain as keyof typeof domainLogos];
                return (
                  <div
                    key={domain}
                    onClick={() => handleDomainSelection(domain)}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all w-full min-w-0 ${
                      selectedDomain === domain 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full min-w-0">
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
                          <Building2 className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-900 truncate">{logoData.name}</h5>
                        <p className="text-sm text-gray-500 truncate">{domain}</p>
                      </div>
                      {selectedDomain === domain && (
                        <div className="ml-auto flex-shrink-0">
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
A
      </div>

      {/* Position Settings - Always Visible */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h4 className="font-semibold text-gray-900 mb-3">📍 Logo Position</h4>
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant={currentLogo.position === 'top-left' ? 'default' : 'outline'}
              onClick={() => handlePositionChange('top-left')}
              className="w-full h-12 flex flex-col items-center justify-center gap-1 text-xs"
            >
              <span className="text-lg">↖️</span>
              <span>Top Left</span>
            </Button>
            <Button
              variant={currentLogo.position === 'top-right' ? 'default' : 'outline'}
              onClick={() => handlePositionChange('top-right')}
              className="w-full h-12 flex flex-col items-center justify-center gap-1 text-xs"
            >
              <span className="text-lg">↗️</span>
              <span>Top Right</span>
            </Button>
            <Button
              variant={currentLogo.position === 'bottom-left' ? 'default' : 'outline'}
              onClick={() => handlePositionChange('bottom-left')}
              className="w-full h-12 flex flex-col items-center justify-center gap-1 text-xs"
            >
              <span className="text-lg">↙️</span>
              <span>Bottom Left</span>
            </Button>
            <Button
              variant={currentLogo.position === 'bottom-right' ? 'default' : 'outline'}
              onClick={() => handlePositionChange('bottom-right')}
              className="w-full h-12 flex flex-col items-center justify-center gap-1 text-xs"
            >
              <span className="text-lg">↘️</span>
              <span>Bottom Right</span>
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Choose where to place the logo on your video
          </p>
        </div>

      {/* Opacity Settings - Always Visible */}
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
              </div>dev 
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
    </div>
  );
};

export default LogoWatermark;
