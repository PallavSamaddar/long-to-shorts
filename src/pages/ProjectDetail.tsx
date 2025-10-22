import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectDetailHeader from '@/components/project-detail/ProjectDetailHeader';
import ScenesListFinal from '@/components/project-detail/ScenesListFinal';
import TranscriptsList from '@/components/project-detail/TranscriptsList';
import VideoPlayer from '@/components/project-detail/VideoPlayer';
import PublishSettingsDialog from '@/components/project-detail/PublishSettingsDialog';
import ClipsManager from '@/components/project-detail/ClipsManager';
import { ResizablePanels } from '@/components/ui/resizable-panels';
import { scenes } from '@/data/projectDetailData';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedScene, setSelectedScene] = useState(0);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [updatedThumbnails, setUpdatedThumbnails] = useState<{ [key: number]: string }>({});
  const [updatedTranscripts, setUpdatedTranscripts] = useState<{ [key: number]: string }>({});
  const [logoData, setLogoData] = useState<{ image: string | null; position: string; opacity: number }>({
    image: null,
    position: 'top-right',
    opacity: 50
  });
  const [projectStatus, setProjectStatus] = useState<'In queue' | 'Published'>('In queue');
  const [clips, setClips] = useState<Array<{
    id: string;
    name: string;
    transcript: string;
    startTime: number;
    endTime: number;
    createdAt: Date;
  }>>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isCreatingClip, setIsCreatingClip] = useState(false);

  const handleSceneSelect = (index: number) => {
    setSelectedScene(index);
  };

  const handleThumbnailUpdate = (sceneIndex: number, thumbnailUrl: string) => {
    console.log('🔄 Received thumbnail update for scene:', sceneIndex, 'with URL length:', thumbnailUrl.length);
    setUpdatedThumbnails(prev => {
      const newThumbnails = {
        ...prev,
        [sceneIndex]: thumbnailUrl
      };
      console.log('📸 Updated thumbnails state:', newThumbnails);
      return newThumbnails;
    });
  };

  const handleLogoUpdate = (logoData: { image: string | null; position: string; opacity: number }) => {
    setLogoData(logoData);
  };

  const handleTranscriptUpdate = (sceneIndex: number, newTranscript: string) => {
    console.log('📝 Received transcript update for scene:', sceneIndex);
    setUpdatedTranscripts(prev => ({
      ...prev,
      [sceneIndex]: newTranscript
    }));
  };


  const handlePreviousScene = () => {
    if (selectedScene > 0) {
      setSelectedScene(selectedScene - 1);
    }
  };

  const handleNextScene = () => {
    if (selectedScene < scenes.length - 1) {
      setSelectedScene(selectedScene + 1);
    }
  };


  const handlePublishAllScenes = () => {
    setIsPublishDialogOpen(true);
  };

  const handlePublishComplete = () => {
    setProjectStatus('Published');
    setIsPublishDialogOpen(false);
    // Navigate to home page
    navigate('/');
  };

  // Clip management functions
  const handleClipCreate = (clipData: {
    name: string;
    transcript: string;
    startTime: number;
    endTime: number;
  }) => {
    const newClip = {
      id: Date.now().toString(),
      ...clipData,
      createdAt: new Date()
    };
    setClips(prev => [...prev, newClip]);
  };

  const handleClipUpdate = (clipId: string, updates: Partial<{
    id: string;
    name: string;
    transcript: string;
    startTime: number;
    endTime: number;
    createdAt: Date;
  }>) => {
    setClips(prev => prev.map(clip => 
      clip.id === clipId ? { ...clip, ...updates } : clip
    ));
  };

  const handleClipDelete = (clipId: string) => {
    setClips(prev => prev.filter(clip => clip.id !== clipId));
  };

  const handleClipSelect = (clipId: string) => {
    const clip = clips.find(c => c.id === clipId);
    if (clip) {
      console.log('🎬 Selected clip:', clip.name);
      // You can add logic here to jump to the clip's time in the video
    }
  };

  const handleVideoTimeUpdate = (time: number, videoDuration: number) => {
    setCurrentTime(time);
    setDuration(videoDuration);
  };

  const handleCreateClipClick = () => {
    // Create a new clip with current video time as start time
    const newClip = {
      id: Date.now().toString(),
      name: `Clip ${clips.length + 1}`,
      transcript: '',
      startTime: currentTime,
      endTime: currentTime + 30, // Default 30 seconds duration
      createdAt: new Date()
    };
    setClips(prev => [...prev, newClip]);
    setIsCreatingClip(true);
  };


  return (
    <div className="h-screen bg-slate-50 flex flex-col w-full overflow-hidden">
      <ProjectDetailHeader />

      <main className="flex-1 flex overflow-hidden">
        <ResizablePanels>
          <ScenesListFinal 
            selectedScene={selectedScene}
            onSceneSelect={handleSceneSelect}
            onPreviousScene={handlePreviousScene}
            onNextScene={handleNextScene}
            updatedThumbnails={updatedThumbnails}
            projectStatus={projectStatus}
            clips={clips}
            onClipCreate={handleClipCreate}
            onClipUpdate={handleClipUpdate}
            onClipDelete={handleClipDelete}
            onClipSelect={handleClipSelect}
            currentTime={currentTime}
            duration={duration}
            onCreateClipClick={handleCreateClipClick}
          />
          
          <TranscriptsList
            selectedScene={selectedScene}
            onTranscriptUpdate={handleTranscriptUpdate}
            updatedTranscripts={updatedTranscripts}
            isCreatingClip={isCreatingClip}
            onClipModeExit={() => setIsCreatingClip(false)}
          />
          
          <VideoPlayer 
            selectedScene={selectedScene} 
            onThumbnailUpdate={handleThumbnailUpdate}
            onLogoUpdate={handleLogoUpdate}
            onPublishAllScenes={handlePublishAllScenes}
            updatedThumbnails={updatedThumbnails}
            onTimeUpdate={handleVideoTimeUpdate}
          />
        </ResizablePanels>
      </main>


      <PublishSettingsDialog
        isOpen={isPublishDialogOpen}
        onClose={() => setIsPublishDialogOpen(false)}
        onPublishComplete={handlePublishComplete}
        currentSceneIndex={selectedScene}
        totalScenes={scenes.length}
        availableThumbnails={updatedThumbnails}
      />
    </div>
  );
};

export default ProjectDetail;
