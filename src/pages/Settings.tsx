import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Save, Youtube, Facebook, Instagram } from 'lucide-react';

const Settings = () => {
  const [activeProject, setActiveProject] = useState('default');
  const [publishDestinations, setPublishDestinations] = useState([
    { id: 1, platform: 'YouTube', channel: 'Main Channel', status: 'connected' },
    { id: 2, platform: 'YouTube', channel: 'Shorts Channel', status: 'connected' },
  ]);

  const defaultProjects = [
    { id: 'default', name: 'Default Workspace', isDefault: true },
    { id: 'podcast', name: 'Podcast Template', isDefault: true },
    { id: 'shorts', name: 'YouTube Shorts', isDefault: true },
  ];

  const [customProjects, setCustomProjects] = useState([
    { id: 'custom1', name: 'Marketing Videos', isDefault: false },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 flex w-full">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
              <p className="text-slate-600 mt-2">Manage your content creation preferences and workspace settings</p>
            </div>

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
                              <Badge variant="secondary" className="text-xs">Default</Badge>
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
                  <Button variant="outline" size="sm">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Publish Destinations */}
            <Card>
              <CardHeader>
                <CardTitle>Publish Destinations</CardTitle>
                <CardDescription>Manage your connected social media and video platforms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {publishDestinations.map((destination) => (
                    <div key={destination.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
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
                        <Button variant="outline" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Destination
                </Button>
              </CardContent>
            </Card>

            {/* Video Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Video Settings</CardTitle>
                <CardDescription>Configure default video generation preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Clip Minimum Duration</label>
                    <Select defaultValue="30">
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
                    <Select defaultValue="5">
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
                  <Select defaultValue="both">
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

            {/* Video Layout Options */}
            <Card>
              <CardHeader>
                <CardTitle>Video Layout Options</CardTitle>
                <CardDescription>Select your default video template</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Centered Speaker', 'Side-by-Side', 'Picture-in-Picture', 'Full Screen', 'Split Screen', 'Custom'].map((template) => (
                    <div key={template} className="p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                      <div className="w-full h-20 bg-slate-200 rounded mb-2 flex items-center justify-center">
                        <span className="text-xs text-slate-500">Preview</span>
                      </div>
                      <p className="text-sm font-medium text-center">{template}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Slates Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Slates Settings</CardTitle>
                <CardDescription>Configure intro and outro slates for your videos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Pre Slates</label>
                    <Select defaultValue="intro1">
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
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                        <p className="text-sm text-slate-600">Drag and drop your pre slate video or click to browse</p>
                        <Button variant="outline" className="mt-2">Choose Video File</Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Post Slates</label>
                    <Select defaultValue="outro1">
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
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                        <p className="text-sm text-slate-600">Drag and drop your post slate video or click to browse</p>
                        <Button variant="outline" className="mt-2">Choose Video File</Button>
                      </div>
                    </div>
                  </div>
                </div>
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
                    <p className="text-xs text-slate-600">Display your logo as a watermark</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Logo Position</label>
                    <Select defaultValue="bottom-right">
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
                    <Select defaultValue="80">
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
                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload Logo</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                    <p className="text-sm text-slate-600">Drag and drop your logo or click to browse</p>
                    <Button variant="outline" className="mt-2">Choose File</Button>
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
                  <Switch defaultChecked />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Slug Style</label>
                    <Select defaultValue="modern">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                        <SelectItem value="elegant">Elegant</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Words per Slug</label>
                    <Select defaultValue="3">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 words</SelectItem>
                        <SelectItem value="3">3 words</SelectItem>
                        <SelectItem value="4">4 words</SelectItem>
                        <SelectItem value="5">5 words</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Settings */}
            <div className="flex justify-end gap-4">
              <Button variant="outline">Reset to Defaults</Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
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
