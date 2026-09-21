'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { UploadCloud, FileText, Printer, Download, Clock, Trash2, Loader2, Save } from 'lucide-react';

interface SavedDocument {
  id: string;
  date: string;
  title: string;
  content: string;
}

export default function AiScannerTab() {
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

      // We use pre-wrap so newlines and spaces are naturally preserved.
      // We don't need to inject <br/> or <p> tags manually, which ruins spacing.
      const html = data.text;

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
    <div className="h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col font-sans">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50 gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            AI Document Scanner
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">Extract text from images using Gemini Flash</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (documentContent) {
                const newHistory = [...history];
                if (newHistory.length > 0) {
                  newHistory[0].content = documentContent;
                  setHistory(newHistory);
                  localStorage.setItem('ai_scanned_history', JSON.stringify(newHistory));
                  alert('Changes saved to history');
                }
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Save Edit
          </button>
          <button
            onClick={downloadWord}
            disabled={!documentContent}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Word
          </button>
          <button
            onClick={() => triggerPrint()}
            disabled={!documentContent}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden min-h-[600px]">
        {/* Left Sidebar - Upload & History */}
        <div className="w-72 bg-slate-50/30 border-r border-slate-100 flex flex-col h-full overflow-y-auto">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-[13px] font-bold text-slate-700 mb-3 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-blue-500" />
              Upload Files
            </h3>
            
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-white relative group hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
              <input 
                type="file" 
                multiple 
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-6 h-6 text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" />
              <p className="text-xs font-semibold text-slate-700">Click or drag files</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Images or PDFs</p>
            </div>
            
            {files.length > 0 && (
              <div className="mt-3">
                <p className="text-[11px] font-semibold text-slate-600 mb-1">{files.length} file(s) selected</p>
                <ul className="text-[10px] text-slate-500 space-y-0.5 max-h-20 overflow-y-auto">
                  {files.map((f, i) => <li key={i} className="truncate truncate">- {f.name}</li>)}
                </ul>
                <button
                  onClick={handleScan}
                  disabled={loading}
                  className="w-full mt-3 flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-70 cursor-pointer shadow-sm"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                  {loading ? 'Scanning AI...' : 'Scan Document'}
                </button>
              </div>
            )}
          </div>

          <div className="p-4 flex-1">
            <h3 className="text-[13px] font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              Saved Scans
            </h3>
            {history.length === 0 ? (
              <p className="text-[11px] text-slate-400 text-center py-4">No saved documents yet.</p>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => loadHistoryItem(item)}
                    className="p-2.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg cursor-pointer transition-colors group relative"
                  >
                    <p className="text-xs font-bold text-slate-700 group-hover:text-blue-700 truncate pr-6">{item.title}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">{item.date}</p>
                    <button 
                      onClick={(e) => deleteHistoryItem(e, item.id)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Editor Area */}
        <div className="flex-1 p-6 overflow-auto flex justify-center bg-slate-100/50">
          <div className="relative shadow-sm border border-slate-200 bg-white w-[210mm] min-h-[297mm] shrink-0">
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
                <div className="w-full h-full min-h-[40vh] flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
                  <p className="font-semibold text-sm text-slate-600">Extracting text using OpenRouter AI...</p>
                  <p className="text-xs mt-1">This may take 10-15 seconds.</p>
                </div>
              ) : documentContent ? (
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => setDocumentContent(e.currentTarget.innerHTML)}
                  dangerouslySetInnerHTML={{ __html: documentContent }}
                  style={{ whiteSpace: 'pre-wrap' }}
                  className="w-full min-h-full outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-8 rounded-sm whitespace-pre-wrap"
                />
              ) : (
                <div className="w-full h-full min-h-[40vh] flex flex-col items-center justify-center text-slate-300">
                  <FileText className="w-12 h-12 mb-3 opacity-50" />
                  <p className="font-semibold text-sm">No Document Loaded</p>
                  <p className="text-xs mt-1 text-slate-400">Upload a file on the left to extract its contents.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
