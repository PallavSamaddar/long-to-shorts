
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
                    <div className="flex items-start gap-3">
                      <span className="text-sm font-medium text-slate-500 min-w-[24px]">
                        {index + 1}.
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
