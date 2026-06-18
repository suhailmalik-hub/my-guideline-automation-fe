import { Button } from '@/lib/ui/components';
import { useManageAutomation } from '@/Neuron/hooks';
import type { IVisaGuideline } from '@/Neuron/types';
import Editor from '@monaco-editor/react';
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  Banknote,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  GitCompareArrows,
  Globe,
  Info,
  Loader2,
  LogIn,
  MapPin,
  Plane,
  Save,
  ShieldCheck,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GuidelineDiffEditor } from '../diff-editor';

const MetaItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) => {
  if (!value) return null;
  return (
    <div className='flex items-start gap-2.5 py-2'>
      <Icon
        size={15}
        className='text-gray-400 mt-0.5 shrink-0'
      />
      <div className='min-w-0'>
        <p className='text-[11px] text-gray-400 uppercase tracking-wide'>{label}</p>
        <p className='text-sm text-gray-800 mt-0.5'>{value}</p>
      </div>
    </div>
  );
};

const GuidelineDetailView = ({ guidelineDetail }: { guidelineDetail: IVisaGuideline }) => {
  const meta = guidelineDetail?.visaMetaData;
  const docs = guidelineDetail?.visaDocumentsGuidelines;

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3 pb-4 border-b border-gray-100'>
        <div className='w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0'>
          <Globe
            size={20}
            className='text-blue-500'
          />
        </div>
        <div>
          <h3 className='text-base font-semibold text-gray-900'>{guidelineDetail.toCountryName}</h3>
          <div className='flex items-center gap-2 mt-0.5'>
            {meta?.visaName && <span className='text-xs text-gray-500'>{meta.visaName}</span>}
            {guidelineDetail.visaType && (
              <span className='px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100'>
                {guidelineDetail.visaType}
              </span>
            )}
            {guidelineDetail.visaCategory && (
              <span className='px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-50 text-violet-600 border border-violet-100'>
                {guidelineDetail.visaCategory}
              </span>
            )}
          </div>
        </div>
      </div>

      {meta && (
        <div>
          <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3'>Visa Information</h4>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 bg-gray-50 rounded-lg px-4 py-3'>
            <MetaItem
              icon={Clock}
              label='Processing Time'
              value={meta.processingTime}
            />
            <MetaItem
              icon={MapPin}
              label='Max Length of Stay'
              value={meta.maxLengthOfStay}
            />
            <MetaItem
              icon={Calendar}
              label='Earliest to Apply'
              value={meta.earliestTimeToApply}
            />
            <MetaItem
              icon={LogIn}
              label='Entries Allowed'
              value={meta.entriesAllowed}
            />
            <MetaItem
              icon={Plane}
              label='Duration'
              value={meta.duration}
            />
          </div>
        </div>
      )}

      {meta?.visaFees && meta.visaFees.length > 0 && (
        <div>
          <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3'>Visa Fees</h4>
          <div className='bg-gray-50 rounded-lg overflow-hidden'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-gray-200'>
                  <th className='text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider px-4 py-2.5'>
                    Fee Type
                  </th>
                  <th className='text-right text-[11px] font-medium text-gray-400 uppercase tracking-wider px-4 py-2.5'>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {meta.visaFees.map((fee, i) => (
                  <tr
                    key={i}
                    className='border-b border-gray-100 last:border-0'
                  >
                    <td className='px-4 py-2.5 text-gray-700 flex items-center gap-2'>
                      <Banknote
                        size={14}
                        className='text-gray-300 shrink-0'
                      />
                      {fee.feesType}
                    </td>
                    <td className='px-4 py-2.5 text-right font-medium text-gray-900'>{fee.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {meta?.additionalRequirements && meta.additionalRequirements.length > 0 && (
        <div>
          <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3'>Additional Requirements</h4>
          <div className='space-y-2'>
            {meta.additionalRequirements.map((req, i) => (
              <div
                key={i}
                className='bg-amber-50/60 border border-amber-100 rounded-lg px-4 py-3'
              >
                <div className='flex items-start gap-2'>
                  <Info
                    size={14}
                    className='text-amber-500 mt-0.5 shrink-0'
                  />
                  <div className='min-w-0'>
                    <p className='text-sm font-medium text-gray-800'>{req.requirements}</p>
                    {req.note && <p className='text-xs text-gray-500 mt-1'>{req.note}</p>}
                    {req.link && (
                      <a
                        href={req.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 mt-1.5'
                      >
                        <ExternalLink size={11} />
                        Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {docs && docs.length > 0 && (
        <div>
          <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3'>Document Guidelines</h4>
          <div className='space-y-3'>
            {docs.map((docGroup, i) => (
              <div
                key={i}
                className='border border-gray-200 rounded-lg overflow-hidden'
              >
                <div className='flex items-center gap-2.5 px-4 py-2.5 bg-gray-50 border-b border-gray-200'>
                  <ShieldCheck
                    size={15}
                    className='text-gray-400 shrink-0'
                  />
                  <span className='text-sm font-semibold text-gray-800'>{docGroup.docCategory}</span>
                  {docGroup.mandatory && (
                    <span className='px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-red-600 border border-red-100'>
                      Mandatory
                    </span>
                  )}
                  {!docGroup.mandatory && (
                    <span className='px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500 border border-gray-200'>
                      Optional
                    </span>
                  )}
                </div>
                <div className='divide-y divide-gray-100'>
                  {docGroup.documents?.map((doc, j) => (
                    <div
                      key={j}
                      className='px-4 py-3'
                    >
                      <div className='flex items-center gap-2'>
                        <BadgeCheck
                          size={14}
                          className='text-emerald-400 shrink-0'
                        />
                        <span className='text-sm font-medium text-gray-800'>{doc.documentName}</span>
                      </div>
                      {doc.requirements && doc.requirements.length > 0 && (
                        <ul className='mt-2 ml-6 space-y-1'>
                          {doc.requirements.map((req, k) => (
                            <li
                              key={k}
                              className='flex items-start gap-2 text-xs text-gray-600'
                            >
                              <CheckCircle2
                                size={11}
                                className='text-gray-300 mt-0.5 shrink-0'
                              />
                              {req}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
                {docGroup.conditions && docGroup.conditions.length > 0 && (
                  <div className='px-4 py-2.5 bg-amber-50/50 border-t border-amber-100'>
                    {docGroup.conditions.map((cond, c) => (
                      <p
                        key={c}
                        className='text-xs text-amber-700 flex items-start gap-1.5'
                      >
                        <Info
                          size={11}
                          className='mt-0.5 shrink-0'
                        />
                        {cond}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ReviewGuideline: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    isGuidelineDetailFetching,
    guidelineDetailFull,
    fetchGuidelineDetail,
    isConfirmingGuideline,
    confirmGuideline,
  } = useManageAutomation();

  const [editorValue, setEditorValue] = useState<string>('');
  const [editorInitialized, setEditorInitialized] = useState(false);

  useEffect(() => {
    if (id) {
      fetchGuidelineDetail(id);
    }
  }, [id]);

  const generatedJson = guidelineDetailFull?.generated_guideline
    ? JSON.stringify(guidelineDetailFull.generated_guideline, null, 2)
    : '';

  if (generatedJson && !editorInitialized) {
    setEditorValue(generatedJson);
    setEditorInitialized(true);
  }

  const isConfirmed = guidelineDetailFull?.is_confirmed;
  const isReview = guidelineDetailFull?.mode === 'review';
  const existingGuideline = guidelineDetailFull?.existing_guideline;
  const generatedGuideline = guidelineDetailFull?.generated_guideline;

  const onConfirmGuidelineSuccess = (status: string) => {
    if (status === 'success') {
      navigate('/workflow/list');
    }
  };

  const handleConfirmGuideline = () => {
    const mapToRequest = {
      guidelineId: id as string,
      guideline: JSON.parse(editorValue),
    };
    confirmGuideline(mapToRequest, onConfirmGuidelineSuccess);
  };

  const handleBack = () => {
    navigate('/workflow/list');
  };

  if (isGuidelineDetailFetching) {
    return (
      <div className='flex flex-col items-center justify-center h-full gap-3'>
        <Loader2
          size={28}
          className='animate-spin text-violet-400'
        />
        <span className='text-xs text-gray-400'>Loading guideline details…</span>
      </div>
    );
  }

  if (!guidelineDetailFull) {
    return (
      <div className='flex flex-col items-center justify-center h-full gap-2'>
        <AlertCircle
          size={24}
          className='text-gray-300'
        />
        <span className='text-sm text-gray-400'>No guideline data available</span>
        <button
          onClick={handleBack}
          className='mt-2 text-sm text-blue-500 hover:text-blue-600'
        >
          Back to list
        </button>
      </div>
    );
  }

  // Confirmed guideline — show detail view
  if (isConfirmed) {
    return (
      <div className='flex flex-col h-full bg-gray-50'>
        <div className='flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-white shrink-0'>
          <button
            onClick={handleBack}
            className='p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors'
          >
            <ArrowLeft size={18} />
          </button>
          <div className='p-2 rounded-xl bg-violet-100'>
            <FileText
              size={18}
              className='text-violet-600'
            />
          </div>
          <div className='flex-1 min-w-0'>
            <h2 className='text-sm font-semibold text-gray-900'>Guideline Details</h2>
            {existingGuideline && (
              <p className='text-xs text-gray-400 mt-0.5'>
                {existingGuideline.toCountryName} · {existingGuideline.visaType} · {existingGuideline.visaCategory}
              </p>
            )}
          </div>
        </div>
        <div className='flex-1 overflow-y-auto px-6 py-5'>
          {existingGuideline && <GuidelineDetailView guidelineDetail={existingGuideline} />}
        </div>
      </div>
    );
  }

  // Unconfirmed guideline — show editor (generate) or diff editor (review)
  return (
    <div className='flex flex-col h-full bg-gray-50'>
      <div className='flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-white shrink-0'>
        <button
          onClick={handleBack}
          className='p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors'
        >
          <ArrowLeft size={18} />
        </button>
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
          onClick={handleConfirmGuideline}
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
      </div>

      <div className='flex-1 min-h-0'>
        {isReview ? (
          <GuidelineDiffEditor
            existingGuideline={existingGuideline || ({} as IVisaGuideline)}
            generatedGuideline={generatedGuideline || ({} as IVisaGuideline)}
            onChange={setEditorValue}
          />
        ) : (
          <Editor
            height='100%'
            language='json'
            value={editorValue}
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
        )}
      </div>
    </div>
  );
};
