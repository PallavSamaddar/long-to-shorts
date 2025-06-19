
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import GlobalHeader from '@/components/GlobalHeader';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit2, Trash2, Save, Youtube, Facebook, Instagram, Check } from 'lucide-react';

const Settings = () => {
  const [activeProject, setActiveProject] = useState('default');
  const [selectedDestinations, setSelectedDestinations] = useState(['youtube1', 'youtube2']);
  const [selectedLayout, setSelectedLayout] = useState('centered');
  const [enableSlates, setEnableSlates] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState('logo1');
  const [selectedSlugStyle, setSelectedSlugStyle] = useState('modern');
  
  const [publishDestinations, setPublishDestinations] = useState([
    { id: 'youtube1', platform: 'YouTube', channel: 'Main Channel', status: 'connected' },
    { id: 'youtube2', platform: 'YouTube', channel: 'Shorts Channel', status: 'connected' },
    { id: 'facebook1', platform: 'Facebook', channel: 'Business Page', status: 'disconnected' },
  ]);

  const defaultProjects = [
    { id: 'default', name: 'Default Workspace', isDefault: true },
    { id: 'podcast', name: 'Podcast Template', isDefault: true },
    { id: 'shorts', name: 'YouTube Shorts', isDefault: true },
  ];

  const [customProjects, setCustomProjects] = useState([
    { id: 'custom1', name: 'Marketing Videos', isDefault: false },
  ]);

  const layouts = [
    { id: 'centered', name: 'Centered Speaker' },
    { id: 'side-by-side', name: 'Side-by-Side' },
    { id: 'picture-in-picture', name: 'Picture-in-Picture' },
    { id: 'full-screen', name: 'Full Screen' },
    { id: 'split-screen', name: 'Split Screen' },
    { id: 'custom', name: 'Custom' }
  ];

  const logoOptions = [
    { id: 'logo1', name: 'Corporate Logo', imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop&crop=center' },
    { id: 'logo2', name: 'Modern Logo', imageUrl: 'https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=100&h=100&fit=crop&crop=center' },
    { id: 'logo3', name: 'Creative Logo', imageUrl: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=100&h=100&fit=crop&crop=center' },
    { id: 'logo4', name: 'Tech Logo', imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop&crop=center' },
    { id: 'logo5', name: 'Brand Logo', imageUrl: 'https://images.unsplash.com/photo-1487252665478-49b61b47f302?w=100&h=100&fit=crop&crop=center' },
    { id: 'logo6', name: 'Custom Logo', imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop&crop=center' }
  ];

  const slugStyles = [
    { 
      id: 'minimal', 
      name: 'Minimal', 
      preview: 'This is an example text with ',
      highlightWord: 'highlighted',
      highlightStyle: 'bg-gray-200 text-gray-800 px-1 rounded font-normal'
    },
    { 
      id: 'modern', 
      name: 'Modern', 
      preview: 'This is an example text with ',
      highlightWord: 'highlighted',
      highlightStyle: 'bg-blue-500 text-white px-2 py-1 rounded-md font-semibold'
    },
    { 
      id: 'bold', 
      name: 'Bold', 
      preview: 'This is an example text with ',
      highlightWord: 'highlighted',
      highlightStyle: 'bg-yellow-400 text-black px-2 py-1 font-bold border-2 border-yellow-600'
    },
    { 
      id: 'elegant', 
      name: 'Elegant', 
      preview: 'This is an example text with ',
      highlightWord: 'highlighted',
      highlightStyle: 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium border border-purple-300'
    },
    { 
      id: 'neon', 
      name: 'Neon', 
      preview: 'This is an example text with ',
      highlightWord: 'highlighted',
      highlightStyle: 'bg-green-400 text-black px-2 py-1 font-bold shadow-lg border-2 border-green-600'
    },
    { 
      id: 'retro', 
      name: 'Retro', 
      preview: 'This is an example text with ',
      highlightWord: 'highlighted',
      highlightStyle: 'bg-orange-500 text-white px-3 py-1 font-bold transform -skew-x-12'
    }
  ];

  const handleDestinationToggle = (destinationId: string) => {
    setSelectedDestinations(prev => 
      prev.includes(destinationId) 
        ? prev.filter(id => id !== destinationId)
        : [...prev, destinationId]
    );
  };

  const isDefaultTemplate = (projectId: string) => {
    return defaultProjects.some(project => project.id === projectId && project.isDefault);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex w-full">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <GlobalHeader />
        
        {/* Settings Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-2">Manage your content creation preferences and workspace settings</p>
        </div>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Workspace Settings Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Workspace Settings</CardTitle>
                <CardDescription>Select or create workspace-specific settings templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Select value={activeProject} onValueChange={setActiveProject}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select workspace settings" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2">
                        <p className="text-xs text-slate-500 font-medium mb-2">DEFAULT TEMPLATES</p>
                        {defaultProjects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center gap-2">
                              {project.name}
                              {activeProject === project.id && project.isDefault && (
                                <Badge variant="secondary" className="text-xs">Default</Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                      <Separator />
                      <div className="p-2">
                        <p className="text-xs text-slate-500 font-medium mb-2">CUSTOM WORKSPACES</p>
                        {customProjects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Workspace
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditMode(!isEditMode)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    {isEditMode ? 'Done' : 'Edit'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Publish Destinations */}
            <Card>
              <CardHeader>
                <CardTitle>Publish Destinations</CardTitle>
                <CardDescription>Manage your connected social media and video platforms. Select multiple destinations as default.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {publishDestinations.map((destination) => (
                    <div key={destination.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={selectedDestinations.includes(destination.id)}
                          onCheckedChange={() => handleDestinationToggle(destination.id)}
                          disabled={!isEditMode}
                        />
                        {destination.platform === 'YouTube' && <Youtube className="w-5 h-5 text-red-600" />}
                        {destination.platform === 'Facebook' && <Facebook className="w-5 h-5 text-blue-600" />}
                        <div>
                          <p className="font-medium">{destination.platform}</p>
                          <p className="text-sm text-slate-600">{destination.channel}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={destination.status === 'connected' ? 'default' : 'secondary'}>
                          {destination.status}
                        </Badge>
                        <Button variant="outline" size="sm" disabled={!isEditMode}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" disabled={!isEditMode}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" disabled={!isEditMode}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Destination
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Video Settings</CardTitle>
                <CardDescription>Configure default video generation preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Clip Minimum Duration</label>
                    <Select defaultValue="30" disabled={!isEditMode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="60">1 minute</SelectItem>
                        <SelectItem value="120">2 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Number of Clips</label>
                    <Select defaultValue="5" disabled={!isEditMode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 clips</SelectItem>
                        <SelectItem value="5">5 clips</SelectItem>
                        <SelectItem value="10">10 clips</SelectItem>
                        <SelectItem value="15">15 clips</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Video Format</label>
                  <Select defaultValue="both" disabled={!isEditMode}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vertical">Vertical Only</SelectItem>
                      <SelectItem value="landscape">Landscape Only</SelectItem>
                      <SelectItem value="both">Both Formats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Video Layout Options</CardTitle>
                <CardDescription>Select your default video template</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {layouts.map((layout) => (
                    <div 
                      key={layout.id} 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedLayout === layout.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-slate-300 hover:border-blue-300'
                      } ${!isEditMode ? 'cursor-not-allowed opacity-50' : ''}`}
                      onClick={() => isEditMode && setSelectedLayout(layout.id)}
                    >
                      <div className="w-full h-20 bg-slate-200 rounded mb-2 flex items-center justify-center">
                        <span className="text-xs text-slate-500">Preview</span>
                      </div>
                      <p className="text-sm font-medium text-center">{layout.name}</p>
                      {selectedLayout === layout.id && (
                        <div className="flex justify-center mt-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Slates Settings</CardTitle>
                <CardDescription>Configure intro and outro slates for your videos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Enable Slates</label>
                    <p className="text-xs text-slate-600">Add intro and outro slates to your videos</p>
                  </div>
                  <Switch checked={enableSlates} onCheckedChange={setEnableSlates} disabled={!isEditMode} />
                </div>
                
                {enableSlates && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Pre Slates</label>
                      <Select defaultValue="intro1" disabled={!isEditMode}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="intro1">Company Intro</SelectItem>
                          <SelectItem value="intro2">Podcast Intro</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Upload Pre Slate Video</label>
                        <div className={`border-2 border-dashed border-slate-300 rounded-lg p-6 text-center ${!isEditMode ? 'opacity-50' : ''}`}>
                          <p className="text-sm text-slate-600">Drag and drop your pre slate video or click to browse</p>
                          <Button variant="outline" className="mt-2" disabled={!isEditMode}>Choose Video File</Button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Post Slates</label>
                      <Select defaultValue="outro1" disabled={!isEditMode}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="outro1">Subscribe & Follow</SelectItem>
                          <SelectItem value="outro2">Contact Info</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Upload Post Slate Video</label>
                        <div className={`border-2 border-dashed border-slate-300 rounded-lg p-6 text-center ${!isEditMode ? 'opacity-50' : ''}`}>
                          <p className="text-sm text-slate-600">Drag and drop your post slate video or click to browse</p>
                          <Button variant="outline" className="mt-2" disabled={!isEditMode}>Choose Video File</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Logo Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Logo Settings</CardTitle>
                <CardDescription>Configure logo placement and appearance in videos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Show Logo in Videos</label>
                    <p className="text-xs text-slate-600">Display your logo</p>
                  </div>
                  <Switch defaultChecked disabled={!isEditMode} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Logo Position</label>
                    <Select defaultValue="bottom-right" disabled={!isEditMode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top-left">Top Left</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Logo Opacity</label>
                    <Select defaultValue="80" disabled={!isEditMode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20">20%</SelectItem>
                        <SelectItem value="40">40%</SelectItem>
                        <SelectItem value="60">60%</SelectItem>
                        <SelectItem value="80">80%</SelectItem>
                        <SelectItem value="100">100%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Logo Selection Options */}
                <div className="space-y-4">
                  <label className="text-sm font-medium">Choose Logo</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {logoOptions.map((logo) => (
                      <div 
                        key={logo.id} 
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedLogo === logo.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-slate-300 hover:border-blue-300'
                        } ${!isEditMode ? 'cursor-not-allowed opacity-50' : ''}`}
                        onClick={() => isEditMode && setSelectedLogo(logo.id)}
                      >
                        <div className="w-full h-20 bg-slate-200 rounded mb-2 flex items-center justify-center overflow-hidden">
                          <img 
                            src={logo.imageUrl} 
                            alt={logo.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-xs font-medium text-center">{logo.name}</p>
                        {selectedLogo === logo.id && (
                          <div className="flex justify-center mt-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload Custom Logo</label>
                  <div className={`border-2 border-dashed border-slate-300 rounded-lg p-6 text-center ${!isEditMode ? 'opacity-50' : ''}`}>
                    <p className="text-sm text-slate-600">Drag and drop your logo or click to browse</p>
                    <Button variant="outline" className="mt-2" disabled={!isEditMode}>Choose File</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transcript Slugs */}
            <Card>
              <CardHeader>
                <CardTitle>Transcript Slugs</CardTitle>
                <CardDescription>Configure automatic text overlays from transcriptions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Enable Transcript Slugs</label>
                    <p className="text-xs text-slate-600">Automatically add text overlays from speech</p>
                  </div>
                  <Switch defaultChecked disabled={!isEditMode} />
                </div>
                
                <div className="space-y-4">
                  <label className="text-sm font-medium">Slug Style</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {slugStyles.map((style) => (
                      <div 
                        key={style.id} 
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedSlugStyle === style.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-slate-300 hover:border-blue-300'
                        } ${!isEditMode ? 'cursor-not-allowed opacity-50' : ''}`}
                        onClick={() => isEditMode && setSelectedSlugStyle(style.id)}
                      >
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-slate-700">{style.name}</p>
                          <div className="text-sm text-slate-600">
                            {style.preview}
                            <span className={style.highlightStyle}>
                              {style.highlightWord}
                            </span>
                            {' word example.'}
                          </div>
                        </div>
                        {selectedSlugStyle === style.id && (
                          <div className="flex justify-center mt-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Settings */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" disabled={!isEditMode}>Reset to Defaults</Button>
              <Button className="bg-blue-600 hover:bg-blue-700" disabled={!isEditMode}>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
