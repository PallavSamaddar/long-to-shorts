
import React, { useImperativeHandle, forwardRef, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { transcripts } from '@/data/projectDetailData';

interface TranscriptsListProps {
  selectedTranscript: number;
  onTranscriptSelect: (index: number) => void;
}

export interface TranscriptsListRef {
  scrollToTranscript: (index: number) => void;
}

const TranscriptsList = forwardRef<TranscriptsListRef, TranscriptsListProps>(
  ({ selectedTranscript, onTranscriptSelect }, ref) => {
    const transcriptRefs = useRef<(HTMLDivElement | null)[]>([]);

    useImperativeHandle(ref, () => ({
      scrollToTranscript: (index: number) => {
        const element = transcriptRefs.current[index];
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }
    }));

    // Generate timestamps for each transcript segment
    const generateTimestamp = (index: number) => {
      const startSeconds = index * 15; // 15 seconds per segment
      const endSeconds = (index + 1) * 15;
      
      const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const milliseconds = Math.floor(Math.random() * 999); // Random milliseconds for variety
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
      };

      return `${formatTime(startSeconds)} --> ${formatTime(endSeconds)}`;
    };

    return (
      <div className="w-[40%] bg-white border-r border-slate-200 flex flex-col h-full">
        <div className="p-4 border-b border-slate-200 flex-shrink-0">
          <h3 className="text-lg font-semibold text-slate-900">Transcript</h3>
        </div>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4">
              <div className="space-y-4">
                {transcripts.map((transcript, index) => (
                  <div
                    key={index}
                    ref={(el) => (transcriptRefs.current[index] = el)}
                    onClick={() => onTranscriptSelect(index)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedTranscript === index
                        ? 'bg-yellow-100 border-2 border-yellow-300'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-mono text-slate-500">
                        {generateTimestamp(index)}
                      </span>
                      <p className="text-slate-700 leading-relaxed text-sm">
                        {transcript}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }
);

TranscriptsList.displayName = 'TranscriptsList';

export default TranscriptsList;
