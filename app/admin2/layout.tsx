import Link from 'next/link';
import { FilePlus2 } from 'lucide-react';

export default function Admin2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#eef1f6] text-slate-900">
      <header className="bg-[#1e293b] text-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-500 rounded-lg flex items-center justify-center">
              <FilePlus2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold tracking-tight leading-tight">Form Builder</div>
              <div className="text-[10px] text-slate-300 font-medium">
                Upload any document → auto-detect blanks → fillable form
              </div>
            </div>
          </div>
          <Link
            href="/"
            className="text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/15 rounded-md px-3 py-1.5 transition-colors"
          >
            ← Open Print Studio
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 min-h-[calc(100vh-57px)]">{children}</main>
    </div>
  );
}