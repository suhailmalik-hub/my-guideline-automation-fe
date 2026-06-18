import type { IVisaGuideline } from '@/Neuron/types';
import {
  AlertCircle,
  BadgeCheck,
  Banknote,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  Info,
  Loader2,
  LogIn,
  MapPin,
  Plane,
  ShieldCheck,
  X,
} from 'lucide-react';

interface GuidelineDetailModalProps {
  isLoading: boolean;
  guidelineDetail: IVisaGuideline | null;
  onClose: () => void;
}

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

export const GuidelineDetailModal = ({ isLoading, guidelineDetail, onClose }: GuidelineDetailModalProps) => {
  const meta = guidelineDetail?.visaMetaData;
  const docs = guidelineDetail?.visaDocumentsGuidelines;

  return (
    <div className='absolute inset-0 z-50'>
      <div
        className='absolute inset-0 bg-gray-900/60 backdrop-blur-[2px]'
        onClick={onClose}
      />
      <div className='absolute inset-0 flex items-center justify-center pointer-events-none px-4'>
        <div className='relative bg-white rounded-xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh] w-full max-w-5xl'>
          <div className='flex items-center gap-3 px-6 py-4 border-b border-gray-100 shrink-0 bg-gradient-to-r from-violet-50/60 to-white'>
            <div className='p-2 rounded-xl bg-violet-100'>
              <FileText
                size={18}
                className='text-violet-600'
              />
            </div>
            <div className='flex-1 min-w-0'>
              {guidelineDetail && (
                <p className='text-sm font-semibold text-gray-900'>
                  {guidelineDetail.toCountryName} · {guidelineDetail.visaType} · {guidelineDetail.visaCategory}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className='w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0'
              aria-label='Close'
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div className='flex-1 overflow-y-auto px-6 py-5 min-h-[300px]'>
            {isLoading ? (
              <div className='flex flex-col items-center justify-center h-full min-h-[250px] gap-3'>
                <Loader2
                  size={28}
                  className='animate-spin text-violet-400'
                />
                <span className='text-xs text-gray-400'>Loading guideline details…</span>
              </div>
            ) : !guidelineDetail ? (
              <div className='flex flex-col items-center justify-center h-full min-h-[250px] gap-2'>
                <AlertCircle
                  size={24}
                  className='text-gray-300'
                />
                <span className='text-sm text-gray-400'>No guideline data available</span>
              </div>
            ) : (
              <div className='space-y-6'>
                {/* Country & Visa Info */}
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

                {/* Visa Metadata Grid */}
                {meta && (
                  <div>
                    <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3'>
                      Visa Information
                    </h4>
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

                {/* Visa Fees */}
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

                {/* Additional Requirements */}
                {meta?.additionalRequirements && meta.additionalRequirements.length > 0 && (
                  <div>
                    <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3'>
                      Additional Requirements
                    </h4>
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

                {/* Document Guidelines */}
                {docs && docs.length > 0 && (
                  <div>
                    <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3'>
                      Document Guidelines
                    </h4>
                    <div className='space-y-3'>
                      {docs.map((docGroup, i) => (
                        <div
                          key={i}
                          className='border border-gray-200 rounded-lg overflow-hidden'
                        >
                          {/* Category Header */}
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

                          {/* Documents */}
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

                          {/* Conditions */}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
