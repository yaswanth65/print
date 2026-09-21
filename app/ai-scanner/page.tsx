'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { UploadCloud, FileText, Printer, Download, Clock, Trash2, ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface SavedDocument {
  id: string;
  date: string;
  title: string;
  content: string;
}

export default function AiScannerPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [documentContent, setDocumentContent] = useState('');
  const [history, setHistory] = useState<SavedDocument[]>([]);
  
  const printRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const saved = localStorage.getItem('ai_scanned_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveToHistory = (content: string) => {
    const newDoc: SavedDocument = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      title: `Scanned Document ${history.length + 1}`,
      content
    };
    const newHistory = [newDoc, ...history];
    setHistory(newHistory);
    localStorage.setItem('ai_scanned_history', JSON.stringify(newHistory));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });

  const handleScan = async () => {
    if (files.length === 0) return alert('Please select at least one file to scan.');
    
    setLoading(true);
    try {
      const fileData = await Promise.all(
        files.map(async (file) => ({
          base64: await toBase64(file),
          mimeType: file.type || 'image/jpeg'
        }))
      );

      const res = await fetch('/api/ai-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: fileData })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      // Convert Markdown-ish text to HTML basics
      let html = data.text
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br/>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      html = `<p>${html}</p>`;

      setDocumentContent(html);
      saveToHistory(html);
      setFiles([]);
    } catch (err: any) {
      alert(err.message || 'Error scanning document');
    } finally {
      setLoading(false);
    }
  };

  const triggerPrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Scanned_Document',
  });

  const downloadWord = () => {
    if (!documentContent) return;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
      "xmlns:w='urn:schemas-microsoft-com:office:word' " +
      "xmlns='http://www.w3.org/TR/REC-html40'>" +
      "<head><meta charset='utf-8'><title>Export HTML to Word</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + documentContent + footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = 'Scanned_Document.doc';
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const loadHistoryItem = (item: SavedDocument) => {
    if (confirm('Load this document? Any unsaved changes in the current editor will be lost.')) {
      setDocumentContent(item.content);
    }
  };

  const deleteHistoryItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem('ai_scanned_history', JSON.stringify(newHistory));
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col font-sans">
      {/* Top Nav */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI Document Scanner</h1>
            <p className="text-xs text-slate-500 font-medium">Standalone Extraction Tool</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (documentContent) {
                // update current top history item
                const newHistory = [...history];
                if (newHistory.length > 0) {
                  newHistory[0].content = documentContent;
                  setHistory(newHistory);
                  localStorage.setItem('ai_scanned_history', JSON.stringify(newHistory));
                  alert('Changes saved to history');
                }
              }
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors cursor-pointer"
          >
            Save Edit
          </button>
          <button
            onClick={downloadWord}
            disabled={!documentContent}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Word
          </button>
          <button
            onClick={() => triggerPrint()}
            disabled={!documentContent}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Upload & History */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-blue-500" />
              Upload Files
            </h3>
            
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 relative group hover:border-blue-400 transition-colors">
              <input 
                type="file" 
                multiple 
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-8 h-8 text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" />
              <p className="text-sm font-semibold text-slate-700">Click or drag files here</p>
              <p className="text-xs text-slate-500 mt-1">Images or PDFs</p>
            </div>
            
            {files.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-slate-600 mb-2">{files.length} file(s) selected</p>
                <ul className="text-xs text-slate-500 space-y-1 max-h-24 overflow-y-auto">
                  {files.map((f, i) => <li key={i} className="truncate truncate">- {f.name}</li>)}
                </ul>
                <button
                  onClick={handleScan}
                  disabled={loading}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-70 cursor-pointer shadow-sm"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                  {loading ? 'Scanning AI...' : 'Scan Document'}
                </button>
              </div>
            )}
          </div>

          <div className="p-5 flex-1">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              Saved Scans
            </h3>
            {history.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No saved documents yet.</p>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => loadHistoryItem(item)}
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-lg cursor-pointer transition-colors group relative"
                  >
                    <p className="text-sm font-bold text-slate-700 group-hover:text-blue-700 truncate pr-6">{item.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.date}</p>
                    <button 
                      onClick={(e) => deleteHistoryItem(e, item.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Editor Area */}
        <div className="flex-1 p-8 overflow-y-auto flex justify-center bg-slate-200/50">
          <div className="relative shadow-xl border-t border-l border-white bg-white w-[210mm] min-h-[297mm]">
            <div 
              ref={printRef}
              className="w-full h-full p-[20mm] bg-white outline-none"
              style={{
                fontFamily: "'Telugu MN', 'Ramabhadra', 'Gautami', 'Arial', sans-serif",
                fontSize: '14pt',
                lineHeight: '1.6',
                color: '#000'
              }}
            >
              {loading ? (
                <div className="w-full h-[60vh] flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
                  <p className="font-semibold text-slate-600">Extracting text using Kie.ai...</p>
                  <p className="text-sm mt-1">This may take 10-20 seconds.</p>
                </div>
              ) : documentContent ? (
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => setDocumentContent(e.currentTarget.innerHTML)}
                  dangerouslySetInnerHTML={{ __html: documentContent }}
                  className="w-full min-h-full outline-none focus:ring-2 focus:ring-blue-100 rounded-sm"
                />
              ) : (
                <div className="w-full h-[60vh] flex flex-col items-center justify-center text-slate-300">
                  <FileText className="w-16 h-16 mb-4 opacity-50" />
                  <p className="font-semibold text-lg">No Document Loaded</p>
                  <p className="text-sm mt-2 text-slate-400">Upload a file on the left to extract its contents.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
