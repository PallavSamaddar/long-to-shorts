import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectDetailHeader from '@/components/project-detail/ProjectDetailHeader';
import ScenesListFinal from '@/components/project-detail/ScenesListFinal';
import TranscriptsList from '@/components/project-detail/TranscriptsList';
import VideoPlayer from '@/components/project-detail/VideoPlayer';
import PublishSettingsDialog from '@/components/project-detail/PublishSettingsDialog';
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
    setIsPublishDialogOpen(false);
    // Navigate to home page
    navigate('/');
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
          />
          
          <TranscriptsList
            selectedScene={selectedScene}
            onTranscriptUpdate={handleTranscriptUpdate}
            updatedTranscripts={updatedTranscripts}
          />
          
          <VideoPlayer 
            selectedScene={selectedScene} 
            onThumbnailUpdate={handleThumbnailUpdate}
            onLogoUpdate={handleLogoUpdate}
            onPublishAllScenes={handlePublishAllScenes}
            updatedThumbnails={updatedThumbnails}
          />
        </ResizablePanels>
      </main>


      <PublishSettingsDialog
        isOpen={isPublishDialogOpen}
        onClose={() => setIsPublishDialogOpen(false)}
        currentSceneIndex={selectedScene}
        totalScenes={scenes.length}
      />
    </div>
  );
};

export default ProjectDetail;
