import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectDetailHeader from '@/components/project-detail/ProjectDetailHeader';
import ScenesList from '@/components/project-detail/ScenesList';
import TranscriptsList, { TranscriptsListRef } from '@/components/project-detail/TranscriptsList';
import VideoPlayer from '@/components/project-detail/VideoPlayer';
import VideoController from '@/components/project-detail/VideoController';
import PublishSettingsDialog from '@/components/project-detail/PublishSettingsDialog';
import { scenes, transcripts } from '@/data/projectDetailData';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedScene, setSelectedScene] = useState(0);
  const [selectedTranscript, setSelectedTranscript] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00:00");
  const [totalTime] = useState("00:12:34");
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  
  const transcriptsRef = useRef<TranscriptsListRef>(null);

  const handleSceneSelect = (index: number) => {
    setSelectedScene(index);
    // Randomly select a different transcript when scene changes
    const randomTranscriptIndex = Math.floor(Math.random() * transcripts.length);
    setSelectedTranscript(randomTranscriptIndex);
    
    // Auto-scroll to the selected transcript
    setTimeout(() => {
      transcriptsRef.current?.scrollToTranscript(randomTranscriptIndex);
    }, 100);
  };

  const handleTranscriptSelect = (index: number) => {
    setSelectedTranscript(index);
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

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handlePublishAllScenes = () => {
    setIsPublishDialogOpen(true);
  };

  const handlePublishComplete = () => {
    setIsPublishDialogOpen(false);
    // Navigate to home page
    navigate('/');
  };

  const handleSave = () => {
    console.log('Saving project...');
    // Add save functionality here
  };

  const handleReset = () => {
    console.log('Resetting project...');
    // Add reset functionality here
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col w-full overflow-hidden">
      <ProjectDetailHeader />

      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex h-full">
          <ScenesList 
            selectedScene={selectedScene}
            onSceneSelect={handleSceneSelect}
          />
          
          <TranscriptsList
            ref={transcriptsRef}
            selectedTranscript={selectedTranscript}
            selectedScene={selectedScene}
            onTranscriptSelect={handleTranscriptSelect}
          />
          
          <VideoPlayer selectedScene={selectedScene} />
        </div>
      </main>

      <VideoController
        selectedScene={selectedScene}
        isPlaying={isPlaying}
        isMuted={isMuted}
        currentTime={currentTime}
        totalTime={totalTime}
        onPreviousScene={handlePreviousScene}
        onNextScene={handleNextScene}
        onTogglePlayPause={togglePlayPause}
        onToggleMute={toggleMute}
        onPublishAllScenes={handlePublishAllScenes}
        onSave={handleSave}
        onReset={handleReset}
      />

      <PublishSettingsDialog
        isOpen={isPublishDialogOpen}
        onClose={() => setIsPublishDialogOpen(false)}
        onPublish={handlePublishComplete}
      />
    </div>
  );
};

export default ProjectDetail;
