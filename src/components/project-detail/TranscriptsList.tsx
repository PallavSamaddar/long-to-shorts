import React, { useState } from 'react';
import { Edit3, Save, X, Plus, Expand } from 'lucide-react';
import { scenes } from '@/data/projectDetailData';
import { Button } from '@/components/ui/button';

interface TranscriptsListProps {
  selectedScene: number;
  onTranscriptUpdate?: (sceneIndex: number, newTranscript: string) => void;
  updatedTranscripts?: { [key: number]: string };
}

const TranscriptsList: React.FC<TranscriptsListProps> = ({ selectedScene, onTranscriptUpdate, updatedTranscripts }) => {
  const [transcriptText, setTranscriptText] = useState('');
  const [fullScriptText, setFullScriptText] = useState('');
  const [currentSceneHeight, setCurrentSceneHeight] = useState(150); // Default height for current scene
  const [isResizing, setIsResizing] = useState(false);

  // Get current scene's transcript (prioritize updated transcript over original)
  const currentScene = scenes[selectedScene];
  const currentTranscript = updatedTranscripts?.[selectedScene] || currentScene?.transcript || '';

  // Initialize transcript text and full script when component mounts or scene changes
  React.useEffect(() => {
    setTranscriptText(currentTranscript);
    setFullScriptText(getFullScript());
  }, [currentTranscript, updatedTranscripts]);

  // Get full script (all scenes combined)
  const getFullScript = () => {
    return scenes.map((scene, index) => {
      const transcript = updatedTranscripts?.[index] || scene.transcript || '';
      return `Scene ${index + 1}:\n${transcript}`;
    }).join('\n\n');
  };

  // Handle direct transcript editing (local state only)
  const handleTranscriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setTranscriptText(newText);
  };

  // Handle saving current scene transcript
  const handleSaveCurrentScene = () => {
    if (onTranscriptUpdate) {
      onTranscriptUpdate(selectedScene, transcriptText);
    }
  };

  // Update full script when individual transcripts change
  React.useEffect(() => {
    setFullScriptText(getFullScript());
  }, [transcriptText, updatedTranscripts]);


  // Handle resize functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const container = document.querySelector('[data-transcript-container]') as HTMLElement;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const relativeY = e.clientY - containerRect.top;
      
      // Set minimum and maximum heights
      const minHeight = 100;
      const maxHeight = containerRect.height - 200; // Leave space for full script
      
      const newHeight = Math.max(minHeight, Math.min(maxHeight, relativeY));
      setCurrentSceneHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

    return (
    <div className="w-full bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Header */}
        <div className="p-4 border-b border-slate-200 flex-shrink-0">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900">Transcript</h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden" data-transcript-container>
        <div className="p-4 h-full flex flex-col">
          {/* Current Scene Transcript - Directly Editable */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-700">Current Transcript:</h4>
              <Button
                onClick={handleSaveCurrentScene}
                className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 h-7"
                size="sm"
              >
                <Save className="w-3 h-3 mr-1" />
                <span className="text-xs">Update</span>
              </Button>
            </div>
            <textarea
              value={transcriptText}
              onChange={handleTranscriptChange}
              placeholder="Enter transcript text for this scene..."
              className="w-full p-3 border border-slate-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left"
              style={{
                fontSize: '14px',
                lineHeight: '1.6',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                height: `${currentSceneHeight}px`
              }}
            />
          </div>

          {/* Resizable Divider */}
          <div 
            className="w-full h-2 bg-slate-200 hover:bg-slate-300 cursor-ns-resize flex items-center justify-center group transition-colors duration-200"
            onMouseDown={handleMouseDown}
          >
            <div className="w-8 h-0.5 bg-slate-400 group-hover:bg-slate-500 rounded-full"></div>
          </div>

          {/* Full Video Script - Read-only for Reference */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex-1 flex flex-col min-h-0">
            <h4 className="text-sm font-semibold text-blue-700 mb-3">Full Video Script:</h4>
            <textarea
              value={fullScriptText}
              readOnly
              placeholder="Full video script for reference..."
              className="flex-1 w-full p-3 border border-blue-300 rounded resize-none bg-slate-100 text-slate-700 text-left"
              style={{
                fontSize: '14px',
                lineHeight: '1.6',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            />
            <p className="text-xs text-blue-600 mt-2 flex-shrink-0">
              Copy and paste into the Current Transcript to edit.
                      </p>
                    </div>
                  </div>
        </div>
      </div>
    );
};

export default TranscriptsList;