
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Upload, Youtube, Video } from 'lucide-react';

const NewProjectDialog = () => {
  const [selectedOption, setSelectedOption] = useState('youtube');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Source Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Video Source</Label>
            <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="youtube" id="youtube" />
                <Label htmlFor="youtube" className="flex items-center gap-2 cursor-pointer">
                  <Youtube className="w-4 h-4 text-red-500" />
                  Paste a video link from YouTube
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="slike" id="slike" />
                <Label htmlFor="slike" className="flex items-center gap-2 cursor-pointer">
                  <Video className="w-4 h-4 text-blue-500" />
                  Paste video ID from Slike
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upload" id="upload" />
                <Label htmlFor="upload" className="flex items-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4 text-green-500" />
                  Upload a Video
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Input Field */}
          <div className="space-y-2">
            <Label htmlFor="video-input">
              {selectedOption === 'youtube' && 'YouTube Video URL'}
              {selectedOption === 'slike' && 'Slike Video ID'}
              {selectedOption === 'upload' && 'Video File'}
            </Label>
            {selectedOption === 'upload' ? (
              <Input id="video-input" type="file" accept="video/*" />
            ) : (
              <Input 
                id="video-input" 
                placeholder={
                  selectedOption === 'youtube' 
                    ? 'https://www.youtube.com/watch?v=...' 
                    : 'Enter Slike video ID'
                } 
              />
            )}
          </div>

          {/* Project Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-duration">Clip Minimum Duration</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30s">30 seconds</SelectItem>
                  <SelectItem value="1m">1 minute</SelectItem>
                  <SelectItem value="2m">2 minutes</SelectItem>
                  <SelectItem value="5m">5 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="num-clips">Number Of Clips</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select number" />
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="video-format">Video Format</Label>
              <Select>
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

            <div className="space-y-2">
              <Label htmlFor="workspace">Workspace</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select workspace" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal Workspace</SelectItem>
                  <SelectItem value="marketing">Marketing Team</SelectItem>
                  <SelectItem value="content">Content Creation</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Create Project</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
