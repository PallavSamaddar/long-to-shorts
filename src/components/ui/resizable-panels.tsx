import React, { useState, useRef, useEffect, ReactNode, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ResizablePanelsProps {
  children: [ReactNode, ReactNode, ReactNode]; // Left, Middle, Right
}

export const ResizablePanels: React.FC<ResizablePanelsProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [middleWidth, setMiddleWidth] = useState(400);
  const [isResizing, setIsResizing] = useState<'middle' | null>(null);
  const [startX, setStartX] = useState(0);
  const [startMiddleWidth, setStartMiddleWidth] = useState(0);

  const leftPanelWidth = 240;
  const minMiddleWidth = 300;
  const maxMiddleWidth = 800;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only prevent default if clicking on the resize handle, not on content
    if (e.target === e.currentTarget || (e.target as Element).closest('[data-resize-handle]')) {
      e.preventDefault();
      setIsResizing('middle');
      setStartX(e.clientX);
      setStartMiddleWidth(middleWidth);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }
  }, [middleWidth]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const deltaX = e.clientX - startX;
    const currentLeftWidth = isLeftPanelCollapsed ? 0 : leftPanelWidth;
    
    const newMiddleWidth = Math.max(minMiddleWidth, Math.min(maxMiddleWidth, startMiddleWidth + deltaX));
    
    // Ensure middle panel doesn't exceed available space
    const availableWidth = containerWidth - currentLeftWidth - 100; // 100px buffer for right panel
    if (newMiddleWidth <= availableWidth) {
      setMiddleWidth(newMiddleWidth);
    }
  }, [isResizing, startX, startMiddleWidth, minMiddleWidth, maxMiddleWidth, isLeftPanelCollapsed, leftPanelWidth]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(null);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div ref={containerRef} className="flex h-full w-full overflow-hidden">
      {/* Left Panel - Fixed width with collapse/expand */}
      <div 
        className={`relative flex-shrink-0 transition-all duration-300 ${
          isLeftPanelCollapsed ? 'w-0 overflow-hidden' : ''
        }`}
        style={{ width: isLeftPanelCollapsed ? '0px' : `${leftPanelWidth}px` }}
      >
        <div className={`h-full ${isLeftPanelCollapsed ? 'opacity-0' : 'opacity-100'}`}>
          {children[0]}
        </div>
      </div>
      
      {/* Collapse/Expand Button - Always visible */}
      <button
        onClick={() => setIsLeftPanelCollapsed(!isLeftPanelCollapsed)}
        className="absolute top-4 z-30 bg-white border border-slate-300 rounded-full p-1 shadow-md hover:shadow-lg transition-all duration-200 hover:bg-slate-50"
        style={{ 
          width: '24px', 
          height: '24px',
          left: isLeftPanelCollapsed ? '8px' : `${leftPanelWidth - 16}px`
        }}
      >
        {isLeftPanelCollapsed ? (
          <ChevronRight className="w-3 h-3 text-slate-600" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-slate-600" />
        )}
      </button>
      
      {/* Middle Panel - Resizable */}
      <div 
        className="relative flex-shrink-0"
        style={{ width: `${middleWidth}px` }}
      >
        {children[1]}
        <div
          className="absolute top-0 right-0 w-1 h-full bg-transparent hover:bg-blue-500 cursor-col-resize transition-colors duration-200 z-20"
          onMouseDown={handleMouseDown}
          data-resize-handle
          style={{ width: '4px' }}
        />
      </div>
      
      {/* Right Panel - Flexible */}
      <div className="flex-1 min-w-0">
        {children[2]}
      </div>
    </div>
  );
};

export default ResizablePanels;
