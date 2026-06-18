/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IVisaGuideline } from '@/Neuron/types';
import { DiffEditor } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';

interface GuidelineDiffEditorProps {
  existingGuideline: IVisaGuideline;
  generatedGuideline: IVisaGuideline;
  onChange?: (value: string) => void;
}

export const GuidelineDiffEditor = ({ existingGuideline, generatedGuideline, onChange }: GuidelineDiffEditorProps) => {
  const editorRef = useRef<any>(null);
  const originalCode = JSON.stringify(existingGuideline, null, 2);
  const modifiedCode = JSON.stringify(generatedGuideline, null, 2);

  useEffect(() => {
    return () => {
      if (editorRef.current) {
        editorRef.current.setModel(null);
      }
    };
  }, []);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    if (onChange) {
      const modifiedEditor = editor.getModifiedEditor();
      modifiedEditor.onDidChangeModelContent(() => {
        onChange(modifiedEditor.getValue());
      });
    }
  };

  return (
    <div className='flex flex-col h-full'>
      <div className='flex items-center px-4 py-2 bg-gray-50 border-b border-gray-200 shrink-0'>
        <div className='flex items-center gap-2 w-1/2'>
          <span className='inline-block w-2.5 h-2.5 rounded-full bg-amber-400' />
          <span className='text-xs font-medium text-gray-600'>Existing Guideline</span>
        </div>
        <div className='flex items-center gap-2 w-1/2'>
          <span className='inline-block w-2.5 h-2.5 rounded-full bg-emerald-400' />
          <span className='text-xs font-medium text-gray-600'>Updated Guideline</span>
        </div>
      </div>
      <div className='flex-1 min-h-0'>
        <DiffEditor
          height='80vh'
          language='json'
          original={originalCode}
          modified={modifiedCode}
          onMount={handleEditorDidMount}
          options={{
            readOnly: false,
            originalEditable: false,
            renderSideBySide: true,
            minimap: { enabled: false },
            fontSize: 12,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            diffWordWrap: 'on',
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  );
};
