
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import GlobalHeader from '@/components/GlobalHeader';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProjectDetail = () => {
  const { id } = useParams();
  const [selectedScene, setSelectedScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00:00");
  const [totalTime] = useState("00:12:34");

  // Sample data - replace with actual data
  const scenes = [
    { id: 1, thumbnail: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=150&h=100&fit=crop', duration: '2:30' },
    { id: 2, thumbnail: 'https://images.unsplash.com/photo-1611532736542-dfa22be3f816?w=150&h=100&fit=crop', duration: '3:45' },
    { id: 3, thumbnail: 'https://images.unsplash.com/photo-1611532736540-78dd3bc2ce90?w=150&h=100&fit=crop', duration: '1:50' },
    { id: 4, thumbnail: 'https://images.unsplash.com/photo-1611532736594-42d3e4b2e3a0?w=150&h=100&fit=crop', duration: '4:29' },
    { id: 5, thumbnail: 'https://images.unsplash.com/photo-1611532736596-8e1b4f38b891?w=150&h=100&fit=crop', duration: '2:15' },
  ];

  const transcripts = [
    "Welcome to our comprehensive overview of AI developments in 2024. In this segment, we'll explore the revolutionary changes that artificial intelligence has brought to various industries and how it's reshaping our understanding of technology.",
    "Machine learning algorithms have become increasingly sophisticated, enabling computers to learn from data without explicit programming. This fundamental shift has opened new possibilities for automation and intelligent decision-making across multiple sectors.",
    "The integration of AI in everyday applications has transformed user experiences. From personalized recommendations to intelligent assistants, artificial intelligence is now seamlessly woven into the fabric of our digital interactions.",
    "Looking ahead, the future of AI promises even more groundbreaking developments. Emerging technologies like quantum computing and advanced neural networks are set to push the boundaries of what's possible in artificial intelligence.",
    "As we conclude this overview, it's clear that AI will continue to be a driving force in technological innovation. The key is to harness its potential responsibly while addressing the challenges it presents to society."
  ];

  const handleSceneSelect = (index: number) => {
    setSelectedScene(index);
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

  return (
    <div className="min-h-screen bg-slate-50 flex w-full">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <GlobalHeader />
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 bg-white">
              <h1 className="text-2xl font-bold text-slate-900">Marketing Campaign Q4</h1>
              <p className="text-slate-600 mt-1">Project Details</p>
            </div>

            {/* Main Content - 3 Columns */}
            <div className="flex-1 flex overflow-hidden">
              {/* Column 1: Scene Thumbnails (30%) */}
              <div className="w-[30%] bg-white border-r border-slate-200 overflow-y-auto">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Scenes</h3>
                  <div className="space-y-3">
                    {scenes.map((scene, index) => (
                      <div
                        key={scene.id}
                        onClick={() => handleSceneSelect(index)}
                        className={`cursor-pointer p-3 rounded-lg border transition-all ${
                          selectedScene === index
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-slate-600 w-6">
                            {index + 1}
                          </span>
                          <img
                            src={scene.thumbnail}
                            alt={`Scene ${index + 1}`}
                            className="w-20 h-12 object-cover rounded"
                          />
                          <span className="text-xs text-slate-500">{scene.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 2: Transcripts (35%) */}
              <div className="w-[35%] bg-white border-r border-slate-200 overflow-y-auto">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Transcript</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-slate-700 leading-relaxed">
                      {transcripts[selectedScene]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Column 3: Video Player (35%) */}
              <div className="w-[35%] bg-black flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-full h-64 bg-slate-800 rounded-lg flex items-center justify-center mb-4">
                    <img
                      src={scenes[selectedScene].thumbnail}
                      alt={`Scene ${selectedScene + 1}`}
                      className="max-w-full max-h-full object-contain rounded"
                    />
                  </div>
                  <p className="text-sm text-slate-300">Scene {selectedScene + 1} Preview</p>
                </div>
              </div>
            </div>

            {/* Footer: Video Controller */}
            <div className="bg-white border-t border-slate-200 p-4">
              <div className="flex items-center justify-between">
                {/* Left side controls */}
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePreviousScene}
                    disabled={selectedScene === 0}
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNextScene}
                    disabled={selectedScene === scenes.length - 1}
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </div>

                {/* Center: Time and Seekbar */}
                <div className="flex-1 flex items-center gap-4 mx-8">
                  <span className="text-sm text-slate-600">{currentTime}</span>
                  <span className="text-sm text-slate-400">/</span>
                  <span className="text-sm text-slate-600">{totalTime}</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-1/4"></div>
                  </div>
                </div>

                {/* Right side CTAs */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Publish Settings
                  </Button>
                  <Button variant="outline" size="sm">
                    Save Scene
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Publish All Scenes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetail;
