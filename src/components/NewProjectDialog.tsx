
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Upload, Link, Database } from 'lucide-react';

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewProjectDialog = ({ open, onOpenChange }: NewProjectDialogProps) => {
  const [projectType, setProjectType] = useState('youtube');
  const [videoInput, setVideoInput] = useState('');
  const [clipDuration, setClipDuration] = useState('');
  const [numClips, setNumClips] = useState('');
  const [videoFormat, setVideoFormat] = useState('');
  const [workspace, setWorkspace] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle project creation logic here
    console.log('Creating project:', {
      projectType,
      videoInput,
      clipDuration,
      numClips,
      videoFormat,
      workspace
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Type Selection */}
          <div className="space-y-3">
            <Label>Video Source</Label>
            <RadioGroup value={projectType} onValueChange={setProjectType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="youtube" id="youtube" />
                <Label htmlFor="youtube" className="flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  Paste a video link from YouTube
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="slike" id="slike" />
                <Label htmlFor="slike" className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Paste video ID from Slike
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upload" id="upload" />
                <Label htmlFor="upload" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload a Video
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Video Input */}
          <div>
            <Label htmlFor="video-input">
              {projectType === 'youtube' ? 'YouTube URL' : 
               projectType === 'slike' ? 'Slike Video ID' : 'Video File'}
            </Label>
            {projectType === 'upload' ? (
              <Input
                id="video-input"
                type="file"
                accept="video/*"
                onChange={(e) => setVideoInput(e.target.value)}
              />
            ) : (
              <Input
                id="video-input"
                placeholder={projectType === 'youtube' ? 'https://youtube.com/watch?v=...' : 'Enter video ID'}
                value={videoInput}
                onChange={(e) => setVideoInput(e.target.value)}
              />
            )}
          </div>

          {/* Clip Settings */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="clip-duration">Clip Minimum Duration</Label>
              <Select value={clipDuration} onValueChange={setClipDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15s">15 seconds</SelectItem>
                  <SelectItem value="30s">30 seconds</SelectItem>
                  <SelectItem value="60s">1 minute</SelectItem>
                  <SelectItem value="120s">2 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="num-clips">Number Of Clips</Label>
              <Select value={numClips} onValueChange={setNumClips}>
                <SelectTrigger>
                  <SelectValue placeholder="Select count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 clips</SelectItem>
                  <SelectItem value="10">10 clips</SelectItem>
                  <SelectItem value="15">15 clips</SelectItem>
                  <SelectItem value="20">20 clips</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Video Format */}
          <div>
            <Label htmlFor="video-format">Video Format</Label>
            <Select value={videoFormat} onValueChange={setVideoFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vertical">Vertical</SelectItem>
                <SelectItem value="landscape">Landscape</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Workspace */}
          <div>
            <Label htmlFor="workspace">Workspace</Label>
            <Select value={workspace} onValueChange={setWorkspace}>
              <SelectTrigger>
                <SelectValue placeholder="Select workspace" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal Workspace</SelectItem>
                <SelectItem value="team">Team Workspace</SelectItem>
                <SelectItem value="enterprise">Enterprise Workspace</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
