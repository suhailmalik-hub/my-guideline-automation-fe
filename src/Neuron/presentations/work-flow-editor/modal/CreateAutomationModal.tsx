import { Button } from '@/lib/ui/components';
import { Dropdown } from '@/lib/ui/components/drop-down/DropDown';
import { useVisaConfig } from '@/Neuron/hooks';
import { BookOpen, ChevronRight, FileText, Globe2, MapPin, Plane, Tag, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface AutomationFormValues {
  sourceCountryId: string;
  sourceCountry: string;
  destinationCountryId: string;
  destinationCountry: string;
  visaTypeId: string;
  visaType: string;
  subVisaTypeId: string;
  subvisaType: string;
}

interface IAutomationFormData {
  automationType: AutomationType | null;
  sourceCountryId: string;
  sourceCountry: string;
  destinationCountryId: string;
  destinationCountry: string;
  visaTypeId: string;
  visaType: string;
  subVisaTypeId: string;
  subvisaType: string;
}

interface CreateAutomationModalProps {
  onDone: (values: AutomationFormValues) => void;
  onClose?: () => void;
  isAutomationCreating: boolean;
}

type AutomationType = 'guideline' | 'form';

const AUTOMATION_OPTIONS: {
  type: AutomationType;
  title: string;
  description: string;
  icon: typeof BookOpen;
  badge: string;
}[] = [
  {
    type: 'guideline',
    title: 'Guideline Automation',
    description:
      'Scrape and extract visa guidelines, requirements, and documentation from embassy or consulate portals.',
    icon: BookOpen,
    badge: 'Scraping',
  },
  {
    type: 'form',
    title: 'Form Automation',
    description: 'Automate multi-step visa application forms including field filling, uploads, and submissions.',
    icon: FileText,
    badge: 'Form Fill',
  },
];

export const CreateAutomationModal = ({ onDone, onClose, isAutomationCreating }: CreateAutomationModalProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<IAutomationFormData>({
    automationType: null,
    sourceCountryId: '',
    sourceCountry: '',
    destinationCountryId: '',
    destinationCountry: '',
    visaTypeId: '',
    visaType: '',
    subVisaTypeId: '',
    subvisaType: '',
  });

  const {
    isFetchingCountries,
    worldCountries,
    destinationCountries,
    fetchCountriesData,
    isFetchingVisaType,
    visaTypeList,
    fetchVisaType,
    isFetchingVisaSubType,
    visaSubTypeList,
    fetchVisaSubType,
  } = useVisaConfig();

  useEffect(() => {
    fetchCountriesData();
  }, []);

  useEffect(() => {
    if (formData.destinationCountryId) {
      fetchVisaType(formData.destinationCountryId);
    }
  }, [formData.destinationCountryId]);

  useEffect(() => {
    if (formData.visaTypeId) {
      fetchVisaSubType(formData.visaTypeId);
    }
  }, [formData.visaTypeId]);

  const canProceed = formData.automationType !== null;
  const canSubmit =
    formData.sourceCountryId && formData.destinationCountryId && formData.visaTypeId && formData.subVisaTypeId;

  const handleAutomationTypeChange = (type: AutomationType) => {
    setFormData((prev) => ({ ...prev, automationType: type }));
  };

  const handleSourceCountryChange = (option: { id?: string; label: string; value: string | number }) => {
    setFormData((prev) => ({
      ...prev,
      sourceCountryId: String(option.value),
      sourceCountry: option.label,
    }));
  };

  const handleDestinationCountryChange = (option: { id?: string; label: string; value: string | number }) => {
    setFormData((prev) => ({
      ...prev,
      destinationCountryId: String(option.value),
      destinationCountry: option.label,
      visaTypeId: '',
      visaType: '',
      subVisaTypeId: '',
      subvisaType: '',
    }));
  };

  const handleVisaTypeChange = (option: { id?: string; label: string; value: string | number }) => {
    setFormData((prev) => ({
      ...prev,
      visaTypeId: String(option.value),
      visaType: option.label,
      subVisaTypeId: '',
      subvisaType: '',
    }));
  };

  const handleSubVisaTypeChange = (option: { id?: string; label: string; value: string | number }) => {
    setFormData((prev) => ({
      ...prev,
      subVisaTypeId: String(option.value),
      subvisaType: option.label,
    }));
  };

  const handleConfirm = () => {
    if (!canSubmit || !formData.automationType) return;
    const values: AutomationFormValues = {
      sourceCountryId: formData.sourceCountryId,
      sourceCountry: formData.sourceCountry,
      destinationCountryId: formData.destinationCountryId,
      destinationCountry: formData.destinationCountry,
      visaTypeId: formData.visaTypeId,
      visaType: formData.visaType,
      subVisaTypeId: formData.subVisaTypeId,
      subvisaType: formData.subvisaType,
    };
    console.log('[Neuron] Automation Form Values:', values);
    onDone(values);
  };

  const handleReset = () => {
    setFormData({
      automationType: null,
      sourceCountryId: '',
      sourceCountry: '',
      destinationCountryId: '',
      destinationCountry: '',
      visaTypeId: '',
      visaType: '',
      subVisaTypeId: '',
      subvisaType: '',
    });
    setStep(1);
    if (onClose) onClose();
  };

  const handleNext = () => {
    if (canProceed) setStep(2);
  };

  const worldCountriesOptions =
    worldCountries?.map((country) => ({
      id: country.id,
      label: country.name,
      value: country.id,
    })) ?? [];

  const destinationCountriesOptions =
    destinationCountries?.map((country) => ({
      id: country.id,
      label: country.name,
      value: country.id,
    })) ?? [];

  const visaTypeOptions =
    visaTypeList?.map((visa) => ({
      id: visa.id,
      label: visa.visa_name,
      value: visa.id,
    })) ?? [];

  const subVisaTypeOptions =
    visaSubTypeList?.map((subVisa) => ({
      id: subVisa.id,
      label: subVisa.sub_visa_name,
      value: subVisa.id,
    })) ?? [];

  return (
    <div className='absolute inset-0 z-50'>
      <div className='absolute inset-0 bg-gray-900/50 backdrop-blur-[2px]' />
      <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
        <div className='relative w-full max-w-lg mx-4 bg-white rounded-md shadow-2xl overflow-hidden pointer-events-auto'>
          <div className='px-6 pt-6 pb-4 border-b border-gray-100'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center'>
                  <Plane
                    size={18}
                    className='text-blue-600'
                  />
                </div>
                <div>
                  <h2 className='text-base font-semibold text-gray-900'>Create Automation</h2>
                  <p className='text-xs text-gray-400 mt-0.5'>
                    {step === 1 ? 'Select the type of automation you want to build' : 'Enter the workflow details'}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                {onClose && (
                  <button
                    type='button'
                    onClick={() => {
                      handleReset();
                    }}
                    disabled={isAutomationCreating}
                    className='text-gray-400 hover:text-gray-600 transition-colors'
                    aria-label='Close modal'
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className='px-6 py-5'>
            {step === 1 && (
              <div className='space-y-3'>
                {AUTOMATION_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = formData.automationType === opt.type;
                  return (
                    <button
                      key={opt.type}
                      type='button'
                      onClick={() => handleAutomationTypeChange(opt.type)}
                      className={`w-full text-left rounded-xl border-2 p-4 transition-all group ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/60'
                          : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white'
                      }`}
                    >
                      <div className='flex items-start gap-3'>
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'bg-blue-100' : 'bg-white border border-gray-200 group-hover:border-gray-300'
                          }`}
                        >
                          <Icon
                            size={18}
                            className={isSelected ? 'text-blue-600' : 'text-gray-400'}
                          />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2 mb-1'>
                            <span className={`text-sm font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                              {opt.title}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 text-[10px] font-medium rounded-md ${
                                isSelected ? 'bg-blue-200 text-blue-700' : 'bg-gray-200 text-gray-500'
                              }`}
                            >
                              {opt.badge}
                            </span>
                          </div>
                          <p className='text-xs text-gray-500 leading-relaxed'>{opt.description}</p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isSelected ? 'border-blue-500' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <div className='w-2 h-2 rounded-full bg-blue-500' />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {step === 2 && (
              <div className='space-y-4'>
                <button
                  type='button'
                  onClick={() => setStep(1)}
                  className='flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-1'
                >
                  <ChevronRight
                    size={13}
                    className='rotate-180'
                  />
                  Back
                </button>
                <div className='flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-100'>
                  {formData.automationType === 'guideline' ? (
                    <BookOpen
                      size={14}
                      className='text-blue-500 shrink-0'
                    />
                  ) : (
                    <FileText
                      size={14}
                      className='text-blue-500 shrink-0'
                    />
                  )}
                  <span className='text-xs font-medium text-blue-700'>
                    {formData.automationType === 'guideline' ? 'Guideline Automation' : 'Form Automation'}
                  </span>
                </div>
                <div className='space-y-3'>
                  <div>
                    <label className='block text-xs font-medium text-gray-600 mb-1.5'>
                      <span className='flex items-center gap-1.5'>
                        <MapPin
                          size={12}
                          className='text-gray-400'
                        />
                        From Country
                        <span className='text-red-400'>*</span>
                      </span>
                    </label>
                    <Dropdown
                      placeholder={isFetchingCountries ? 'Loading...' : 'Select from country'}
                      options={worldCountriesOptions}
                      selectedOption={
                        formData.sourceCountryId
                          ? (worldCountriesOptions.find((o) => o.value === formData.sourceCountryId) ?? null)
                          : null
                      }
                      onSelect={handleSourceCountryChange}
                      isDisabled={isFetchingCountries}
                    />
                  </div>

                  <div>
                    <label className='block text-xs font-medium text-gray-600 mb-1.5'>
                      <span className='flex items-center gap-1.5'>
                        <Globe2
                          size={12}
                          className='text-gray-400'
                        />
                        Destination Country
                        <span className='text-red-400'>*</span>
                      </span>
                    </label>
                    <Dropdown
                      placeholder={isFetchingCountries ? 'Loading...' : 'Select destination country'}
                      options={destinationCountriesOptions}
                      selectedOption={
                        formData.destinationCountryId
                          ? (destinationCountriesOptions.find((o) => o.value === formData.destinationCountryId) ?? null)
                          : null
                      }
                      onSelect={handleDestinationCountryChange}
                      isDisabled={isFetchingCountries}
                    />
                  </div>

                  <div>
                    <label className='block text-xs font-medium text-gray-600 mb-1.5'>
                      <span className='flex items-center gap-1.5'>
                        <Plane
                          size={12}
                          className='text-gray-400'
                        />
                        Visa Type
                        <span className='text-red-400'>*</span>
                      </span>
                    </label>
                    <Dropdown
                      placeholder={isFetchingVisaType ? 'Loading...' : 'Select visa type'}
                      options={visaTypeOptions}
                      selectedOption={
                        formData.visaTypeId
                          ? (visaTypeOptions.find((o) => o.value === formData.visaTypeId) ?? null)
                          : null
                      }
                      onSelect={handleVisaTypeChange}
                      isDisabled={!formData.destinationCountryId || isFetchingVisaType}
                    />
                  </div>
                  <div>
                    <label className='block text-xs font-medium text-gray-600 mb-1.5'>
                      <span className='flex items-center gap-1.5'>
                        <Tag
                          size={12}
                          className='text-gray-400'
                        />
                        Sub Visa Type
                        <span className='text-red-400'>*</span>
                      </span>
                    </label>
                    <Dropdown
                      placeholder={isFetchingVisaSubType ? 'Loading...' : 'Select sub visa type'}
                      options={subVisaTypeOptions}
                      selectedOption={
                        formData.subVisaTypeId
                          ? (subVisaTypeOptions.find((o) => o.value === formData.subVisaTypeId) ?? null)
                          : null
                      }
                      onSelect={handleSubVisaTypeChange}
                      isDisabled={!formData.visaTypeId || isFetchingVisaSubType}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className='px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3'>
            <div className='flex items-center gap-1.5'>
              <div className={`w-2 h-2 rounded-full transition-colors ${step >= 1 ? 'bg-blue-500' : 'bg-gray-200'}`} />
              <div className={`w-2 h-2 rounded-full transition-colors ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`} />
            </div>
            <div className='flex items-center gap-2'>
              {step === 1 && (
                <Button
                  type='button'
                  onClick={handleNext}
                  disabled={!canProceed}
                  rightIcon={ChevronRight}
                  iconSize={15}
                  className='!h-auto px-5 py-2 rounded-lg text-sm'
                >
                  Next
                </Button>
              )}
              {step === 2 && (
                <Button
                  type='button'
                  onClick={handleConfirm}
                  disabled={!canSubmit || isAutomationCreating}
                  rightIcon={ChevronRight}
                  iconSize={15}
                  className='!h-auto px-5 py-2 rounded-lg text-sm'
                  isLoading={isAutomationCreating}
                  loaderColor='#FFFFFF'
                  loaderSize={15}
                >
                  Save &amp; Continue
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
