import { Button } from '@/lib/ui/components';
import { useManageAutomation } from '@/Neuron/hooks';
import type { IVisaGuideline } from '@/Neuron/types';
import Editor from '@monaco-editor/react';
import { CheckCircle2, GitCompareArrows, Save } from 'lucide-react';
import { useState } from 'react';
import { GuidelineDiffEditor } from '../diff-editor';

interface RunResult {
  generated_guideline: IVisaGuideline;
  existing_guideline: IVisaGuideline;
  mode: 'generate' | 'review';
}

interface GuideLineResultsModalProps {
  response: unknown;
  guidelineId: string | null;
  onClose: () => void;
}

export const GuideLineResultsModal = ({ response, guidelineId, onClose }: GuideLineResultsModalProps) => {
  const result = response as RunResult;
  const isReview = result?.mode === 'review';
  const { isConfirmingGuideline, confirmGuideline } = useManageAutomation();
  const generatedGuidelineJson = JSON.stringify(result.generated_guideline || {}, null, 2);
  const [editorValue, setEditorValue] = useState(generatedGuidelineJson);

  const onConfirmGuideline = (status: string) => {
    if (status === 'success') {
      onClose();
    }
  };

  const handleConfirmGuideLine = () => {
    const mapToRequest = {
      guidelineId: guidelineId as string,
      guideline: JSON.parse(editorValue),
    };
    // console.log('[Neuron] Confirm guideline with payload:', mapToRequest);
    confirmGuideline(mapToRequest, onConfirmGuideline);
  };

  return (
    <div className='absolute inset-0 z-50'>
      <div
        className='absolute inset-0 bg-gray-900/60 backdrop-blur-[2px]'
        onClick={onClose}
      />
      <div className='absolute inset-0 flex items-center justify-center pointer-events-none px-4'>
        <div
          className={
            'relative bg-white rounded-sm shadow-md overflow-hidden pointer-events-auto flex flex-col max-h-[90vh] w-full max-w-6xl'
          }
        >
          <div className='h-1 shrink-0' />

          <div className='flex items-center gap-3 px-5 py-4 border-b border-gray-100 shrink-0'>
            <div className={`p-2 rounded-xl ${isReview ? 'bg-blue-50' : 'bg-emerald-50'}`}>
              {isReview ? (
                <GitCompareArrows
                  size={18}
                  className='text-blue-500'
                />
              ) : (
                <CheckCircle2
                  size={18}
                  className='text-emerald-500'
                />
              )}
            </div>
            <div className='flex-1 min-w-0'>
              <h2 className='text-sm font-semibold text-gray-900'>
                {isReview ? 'Review Guideline Changes' : 'Guideline Results'}
              </h2>
              <p className='text-xs text-gray-400 mt-0.5'>
                {isReview
                  ? 'Compare and confirm existing guideline with newly generated guideline'
                  : 'Verify the generated guideline and confirm'}
              </p>
            </div>

            <Button
              onClick={handleConfirmGuideLine}
              leftIcon={Save}
              iconSize={14}
              disabled={isConfirmingGuideline}
              isLoading={isConfirmingGuideline}
              loaderColor='#FFFFFF'
              loaderSize={15}
              className='h-8 px-4 rounded-lg text-sm'
            >
              Confirm Guideline
            </Button>
            <Button
              onClick={onClose}
              variant='text'
              disabled={isConfirmingGuideline}
              className='h-8 px-4 rounded-lg text-sm'
            >
              Cancel
            </Button>
          </div>
          {isReview ? (
            <div className='flex-1 min-h-0 h-[60vh]'>
              <GuidelineDiffEditor
                existingGuideline={result.existing_guideline || {}}
                generatedGuideline={result.generated_guideline || {}}
                onChange={setEditorValue}
              />
            </div>
          ) : (
            <div className='flex-1 min-h-0 h-[60vh]'>
              <Editor
                height='80vh'
                language='json'
                value={generatedGuidelineJson}
                onChange={(value) => setEditorValue(value || '')}
                options={{
                  readOnly: false,
                  minimap: { enabled: false },
                  fontSize: 12,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  padding: { top: 12, bottom: 12 },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
