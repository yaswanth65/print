import React, { useEffect, useState } from 'react';
import { useDocumentStore } from '@/store/useDocumentStore';
import styles from './aiScannedDocument.module.css';
import { marked } from 'marked';

export default function AiScannedDocumentPreview() {
  const { data, updateField } = useDocumentStore();
  const docData = data.ai_scanned_document || {};
  
  const [htmlContent, setHtmlContent] = useState('');
  
  useEffect(() => {
    if (docData.content) {
      // Simple parse markdown if it contains formatting
      const parsed = marked.parse(docData.content) as string;
      setHtmlContent(parsed);
    }
  }, [docData.content]);

  return (
    <div className={styles.container}>
      {docData.content ? (
        <div
          className={styles.editor}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          onBlur={(e) => {
            // we don't save raw HTML back to content usually, but since the user edits it visually, 
            // saving the text or HTML back to store is needed if we want persistence.
            // For now, let's keep it simple.
          }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20">
          <p>No scanned text available.</p>
          <p className="text-sm mt-2">Use the "Scan Document" button in the toolbar to upload an image.</p>
        </div>
      )}
    </div>
  );
}
