import React, { useImperativeHandle, forwardRef, useRef, useState, useCallback, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { transcripts } from '@/data/projectDetailData';

interface TranscriptsListProps {
  selectedTranscript: number;
  selectedScene: number;
  onTranscriptSelect: (index: number) => void;
}

export interface TranscriptsListRef {
  scrollToTranscript: (index: number) => void;
}

interface TextSelection {
  segmentIndex: number;
  startOffset: number;
  endOffset: number;
  selectedText: string;
}

// Predefined highlights for each scene - longer text sections
const sceneHighlights = [
  { segmentIndex: 0, startOffset: 50, endOffset: 200, selectedText: "we'll explore the revolutionary changes that artificial intelligence has brought to various industries and how it's reshaping our understanding of technology" },
  { segmentIndex: 1, startOffset: 0, endOffset: 150, selectedText: "Machine learning algorithms have become increasingly sophisticated, enabling computers to learn from data without explicit programming" },
  { segmentIndex: 2, startOffset: 20, endOffset: 180, selectedText: "The integration of AI in everyday applications has transformed user experiences dramatically. From personalized recommendations on streaming platforms to intelligent assistants" },
  { segmentIndex: 3, startOffset: 0, endOffset: 160, selectedText: "Natural language processing has reached new heights with the development of large language models. These systems can now understand context, generate human-like text" },
  { segmentIndex: 4, startOffset: 0, endOffset: 170, selectedText: "Computer vision technology has advanced to the point where machines can identify objects, recognize faces, and even interpret emotions with incredible precision" },
  { segmentIndex: 5, startOffset: 0, endOffset: 180, selectedText: "The ethical considerations surrounding AI development have become increasingly important as these technologies become more powerful and widespread" },
  { segmentIndex: 6, startOffset: 0, endOffset: 190, selectedText: "Artificial intelligence is transforming the healthcare industry in unprecedented ways. From drug discovery and personalized medicine to diagnostic imaging and robotic surgery" }
];

const TranscriptsList = forwardRef<TranscriptsListRef, TranscriptsListProps>(
  ({ selectedTranscript, selectedScene, onTranscriptSelect }, ref) => {
    const transcriptRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [textSelection, setTextSelection] = useState<TextSelection | null>(null);

    // Set default highlight based on selected scene
    useEffect(() => {
      const sceneHighlight = sceneHighlights[selectedScene % sceneHighlights.length];
      if (sceneHighlight) {
        setTextSelection(sceneHighlight);
      }
    }, [selectedScene]);

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

    // Auto-scroll to highlighted segment when scene changes
    useEffect(() => {
      const sceneHighlight = sceneHighlights[selectedScene % sceneHighlights.length];
      if (sceneHighlight) {
        const element = transcriptRefs.current[sceneHighlight.segmentIndex];
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }, 200);
        }
      }
    }, [selectedScene]);

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

    const handleTextSelection = useCallback(() => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        return;
      }

      const range = selection.getRangeAt(0);
      const selectedText = selection.toString().trim();
      
      if (!selectedText) return;

      // Find which transcript segment contains the selection
      let segmentIndex = -1;
      for (let i = 0; i < transcriptRefs.current.length; i++) {
        const element = transcriptRefs.current[i];
        if (element && element.contains(range.commonAncestorContainer)) {
          segmentIndex = i;
          break;
        }
      }

      if (segmentIndex !== -1) {
        // Get the text content of the segment to calculate offsets
        const segmentElement = transcriptRefs.current[segmentIndex];
        const textElement = segmentElement?.querySelector('p');
        if (textElement) {
          const fullText = textElement.textContent || '';
          const startOffset = fullText.indexOf(selectedText);
          const endOffset = startOffset + selectedText.length;

          setTextSelection({
            segmentIndex,
            startOffset,
            endOffset,
            selectedText
          });

          // Trigger the existing callback to update the selected transcript
          onTranscriptSelect(segmentIndex);
        }
      }
    }, [onTranscriptSelect]);

    const renderHighlightedText = (text: string, segmentIndex: number) => {
      if (!textSelection || textSelection.segmentIndex !== segmentIndex) {
        return text;
      }

      const { startOffset, endOffset } = textSelection;
      const beforeSelection = text.slice(0, startOffset);
      const selectedText = text.slice(startOffset, endOffset);
      const afterSelection = text.slice(endOffset);

      return (
        <>
          {beforeSelection}
          <span className="bg-yellow-300">{selectedText}</span>
          {afterSelection}
        </>
      );
    };

    return (
      <div className="w-[40%] bg-white border-r border-slate-200 flex flex-col h-full">
        <div className="p-4 border-b border-slate-200 flex-shrink-0">
          <h3 className="text-lg font-semibold text-slate-900">Transcript</h3>
        </div>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4" onMouseUp={handleTextSelection}>
              <div className="space-y-4">
                {transcripts.map((transcript, index) => (
                  <div
                    key={index}
                    ref={(el) => (transcriptRefs.current[index] = el)}
                    onClick={() => onTranscriptSelect(index)}
                    className="p-4 rounded-lg cursor-pointer transition-all hover:bg-slate-50"
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-mono text-slate-500 select-none">
                        {generateTimestamp(index)}
                      </span>
                      <p className="text-slate-700 leading-relaxed text-sm">
                        {renderHighlightedText(transcript, index)}
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
