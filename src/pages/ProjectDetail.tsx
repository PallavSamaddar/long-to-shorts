import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectDetailHeader from '@/components/project-detail/ProjectDetailHeader';
import ScenesListFinal from '@/components/project-detail/ScenesListFinal';
import TranscriptsList from '@/components/project-detail/TranscriptsList';
import VideoPlayer from '@/components/project-detail/VideoPlayer';
import PublishSettingsDialog from '@/components/project-detail/PublishSettingsDialog';
import GeneratedVideosDialog from '@/components/project-detail/GeneratedVideosDialog';
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
  const [clipGenerationStatus, setClipGenerationStatus] = useState<{ [key: number]: 'In queue' | 'Published' | 'Generating Both' | 'Generating Horizontal' | 'Generating Vertical' }>({});
  const [generatedVideos, setGeneratedVideos] = useState<{ [key: number]: { horizontal?: string; vertical?: string; generationType?: 'both' | 'horizontal' | 'vertical' } }>({});
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
  const [isGeneratedVideosDialogOpen, setIsGeneratedVideosDialogOpen] = useState(false);

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

  // Generation handlers
  const handleGenerateBoth = () => {
    console.log(`🎬 Starting generation of both horizontal and vertical videos for clip ${selectedScene + 1}`);
    setClipGenerationStatus(prev => ({
      ...prev,
      [selectedScene]: 'Generating Both'
    }));
    // TODO: Add actual generation logic here
    // Simulate generation completion after some time
    setTimeout(() => {
      // Use real video URLs for testing (in real app, these would come from your API)
      const testVideos = [
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
      ];
      
      const horizontalVideo = testVideos[selectedScene % testVideos.length];
      const verticalVideo = testVideos[(selectedScene + 1) % testVideos.length];
      
      setGeneratedVideos(prev => {
        const newData = {
          horizontal: horizontalVideo,
          vertical: verticalVideo
        };
        
        // Determine generationType based on available formats
        const hasHorizontal = !!newData.horizontal;
        const hasVertical = !!newData.vertical;
        
        return {
          ...prev,
          [selectedScene]: {
            ...newData,
            generationType: hasHorizontal && hasVertical ? 'both' : hasHorizontal ? 'horizontal' : 'vertical'
          }
        };
      });
      
      setClipGenerationStatus(prev => ({
        ...prev,
        [selectedScene]: 'Published'
      }));
      
      console.log(`✅ Generated both videos for clip ${selectedScene + 1}`);
    }, 5000); // 5 seconds for demo
  };

  const handleGenerateHorizontal = () => {
    console.log(`🖥️ Starting generation of horizontal video for clip ${selectedScene + 1}`);
    setClipGenerationStatus(prev => ({
      ...prev,
      [selectedScene]: 'Generating Horizontal'
    }));
    // TODO: Add actual generation logic here
    // Simulate generation completion after some time
    setTimeout(() => {
      // Use real video URLs for testing (in real app, these would come from your API)
      const testVideos = [
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
      ];
      
      const mockHorizontalVideo = testVideos[selectedScene % testVideos.length];
      
      setGeneratedVideos(prev => {
        const existingData = prev[selectedScene] || {};
        const newData = {
          ...existingData,
          horizontal: mockHorizontalVideo
        };
        
        // Determine generationType based on available formats
        const hasHorizontal = !!newData.horizontal;
        const hasVertical = !!newData.vertical;
        
        return {
          ...prev,
          [selectedScene]: {
            ...newData,
            generationType: hasHorizontal && hasVertical ? 'both' : hasHorizontal ? 'horizontal' : 'vertical'
          }
        };
      });
      
      setClipGenerationStatus(prev => ({
        ...prev,
        [selectedScene]: 'Published'
      }));
      
      console.log(`✅ Generated horizontal video for clip ${selectedScene + 1}`);
    }, 3000); // 3 seconds for demo
  };

  const handleGenerateVertical = () => {
    console.log(`📱 Starting generation of vertical video for clip ${selectedScene + 1}`);
    setClipGenerationStatus(prev => ({
      ...prev,
      [selectedScene]: 'Generating Vertical'
    }));
    // TODO: Add actual generation logic here
    // Simulate generation completion after some time
    setTimeout(() => {
      // Use real video URLs for testing (in real app, these would come from your API)
      const testVideos = [
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
      ];
      
      const mockVerticalVideo = testVideos[(selectedScene + 2) % testVideos.length];
      
      setGeneratedVideos(prev => {
        const existingData = prev[selectedScene] || {};
        const newData = {
          ...existingData,
          vertical: mockVerticalVideo
        };
        
        // Determine generationType based on available formats
        const hasHorizontal = !!newData.horizontal;
        const hasVertical = !!newData.vertical;
        
        return {
          ...prev,
          [selectedScene]: {
            ...newData,
            generationType: hasHorizontal && hasVertical ? 'both' : hasHorizontal ? 'horizontal' : 'vertical'
          }
        };
      });
      
      setClipGenerationStatus(prev => ({
        ...prev,
        [selectedScene]: 'Published'
      }));
      
      console.log(`✅ Generated vertical video for clip ${selectedScene + 1}`);
    }, 3000); // 3 seconds for demo
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
      <ProjectDetailHeader 
        generatedVideos={generatedVideos}
        totalClips={scenes.length}
        onGeneratedVideosClick={() => setIsGeneratedVideosDialogOpen(true)}
      />

      <main className="flex-1 flex overflow-hidden">
        <ResizablePanels>
          <ScenesListFinal 
            selectedScene={selectedScene}
            onSceneSelect={handleSceneSelect}
            onPreviousScene={handlePreviousScene}
            onNextScene={handleNextScene}
            updatedThumbnails={updatedThumbnails}
            projectStatus={projectStatus}
            clipGenerationStatus={clipGenerationStatus}
            generatedVideos={generatedVideos}
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
            onPreviousScene={handlePreviousScene}
            onNextScene={handleNextScene}
          />
          
          <VideoPlayer 
            selectedScene={selectedScene} 
            onThumbnailUpdate={handleThumbnailUpdate}
            onLogoUpdate={handleLogoUpdate}
            onPublishAllScenes={handlePublishAllScenes}
            updatedThumbnails={updatedThumbnails}
            onTimeUpdate={handleVideoTimeUpdate}
            onGenerateBoth={handleGenerateBoth}
            onGenerateHorizontal={handleGenerateHorizontal}
            onGenerateVertical={handleGenerateVertical}
            generatedVideos={generatedVideos}
            clipGenerationStatus={clipGenerationStatus}
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

      <GeneratedVideosDialog
        isOpen={isGeneratedVideosDialogOpen}
        onClose={() => setIsGeneratedVideosDialogOpen(false)}
        generatedVideos={generatedVideos}
        updatedThumbnails={updatedThumbnails}
      />
    </div>
  );
};

export default ProjectDetail;
