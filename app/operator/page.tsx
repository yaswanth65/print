'use client';

import { useRef, useEffect } from 'react';
import { Toolbar } from '@/components/toolbar/Toolbar';
import { EditorPanel } from '@/components/editor/EditorPanel';
import { PreviewPanel } from '@/components/preview/PreviewPanel';

export default function OperatorDashboard() {
  const printRef = useRef<HTMLDivElement>(null);

  // Prevent default save to allow our own if needed, or just let standard browser behavior happen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent ctrl+s to maybe trigger our print instead, but let's leave it standard for now.
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col h-screen h-[100dvh] w-full overflow-hidden text-slate-900 antialiased bg-[#f8f9fa]">
      {/* Top Toolbar */}
      <Toolbar printRef={printRef} />

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Editor */}
        <div className="w-[380px] border-r border-slate-200 print:hidden flex-shrink-0 bg-white z-10 relative">
          <EditorPanel />
        </div>

        {/* Right Side: Live Preview */}
        <div className="flex-1 overflow-hidden relative">
          <PreviewPanel ref={printRef} />
        </div>

      </div>
    </div>
  );
}
