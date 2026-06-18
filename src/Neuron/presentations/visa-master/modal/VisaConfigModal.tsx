import { Button } from '@/lib/ui';
import { Dropdown } from '@/lib/ui/components/drop-down/DropDown';
import type { ICountry } from '@/Neuron/types';
import { Globe, IdCard, Tags, X } from 'lucide-react';
import React, { useState } from 'react';

export interface IVisaConfigPayload {
  destinationCountryId: string;
  destinationCountry: string;
  visaType: string;
  subVisaType: string;
}

interface IVisaConfigModal {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: IVisaConfigPayload) => void;
  destinationCountries: ICountry[] | null;
  isSubmitting?: boolean;
}

interface IFormData {
  destinationCountryId: string;
  destinationCountry: string;
  visaType: string;
  subVisaType: string;
}

export const VisaConfigModal: React.FC<IVisaConfigModal> = ({
  isOpen,
  onClose,
  onConfirm,
  destinationCountries,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<IFormData>({
    destinationCountryId: '',
    destinationCountry: '',
    visaType: '',
    subVisaType: '',
  });

  const countryOptions =
    destinationCountries?.map((country) => ({
      id: country.id,
      label: country.name,
      value: country.id,
    })) ?? [];

  const selectedCountryOption = countryOptions.find((o) => o.value === formData.destinationCountryId) ?? null;

  const handleDestinationCountryChange = (option: { id?: string; label: string; value: string | number }) => {
    setFormData((prev) => ({
      ...prev,
      destinationCountryId: String(option.value),
      destinationCountry: option.label,
    }));
  };

  const handleCapitalLetterInput = (value: string) => value.replace(/[^A-Za-z_]/g, '').toUpperCase();

  const handleVisaTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, visaType: handleCapitalLetterInput(e.target.value) }));
  };

  const handleSubVisaTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, subVisaType: handleCapitalLetterInput(e.target.value) }));
  };

  const handleConfirm = () => {
    const payload: IVisaConfigPayload = {
      destinationCountryId: formData.destinationCountryId,
      destinationCountry: formData.destinationCountry,
      visaType: formData.visaType,
      subVisaType: formData.subVisaType,
    };
    onConfirm(payload);
  };

  const handleReset = () => {
    setFormData({ destinationCountryId: '', destinationCountry: '', visaType: '', subVisaType: '' });
  };

  const isFormValid = formData.destinationCountryId && formData.visaType && formData.subVisaType;

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-2xl'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200'>
          <h2 className='text-lg font-semibold text-gray-800'>Create Visa Type</h2>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            disabled={isSubmitting}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X size={20} />
          </button>
        </div>

        <div className='px-6 py-5 space-y-5'>
          <div>
            <label className='flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5'>
              <Globe
                size={14}
                className='text-blue-500'
              />
              Destination Country <span className='text-red-500'>*</span>
            </label>
            <Dropdown
              options={countryOptions}
              onSelect={handleDestinationCountryChange}
              selectedOption={selectedCountryOption}
              placeholder='Select a country'
              isDisabled={isSubmitting}
            />
          </div>

          {/* Visa Type */}
          <div>
            <label className='flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5'>
              <IdCard
                size={14}
                className='text-blue-500'
              />
              Visa Type <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              placeholder='e.g. LONG_TERM_VISITOR'
              value={formData.visaType}
              onChange={handleVisaTypeChange}
              disabled={isSubmitting}
              className='w-full px-3 h-11 border border-[#D6DBDE] rounded-[4px] text-base font-medium text-[#4E5053] placeholder:text-[#BBC0C3] focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed'
            />
            <p className='text-xs text-gray-400 mt-1'>Capital letters and underscores only</p>
          </div>

          {/* Sub Visa Type */}
          <div>
            <label className='flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5'>
              <Tags
                size={14}
                className='text-blue-500'
              />
              Sub Visa Type <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              placeholder='e.g. LONG_TERM_TOURISM'
              value={formData.subVisaType}
              onChange={handleSubVisaTypeChange}
              disabled={isSubmitting}
              className='w-full px-3 h-11 border border-[#D6DBDE] rounded-[4px] text-base font-medium text-[#4E5053] placeholder:text-[#BBC0C3] focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed'
            />
            <p className='text-xs text-gray-400 mt-1'>Capital letters and underscores only</p>
          </div>
        </div>
        <div className='flex gap-3 px-6 py-4 border-t border-gray-200 justify-end'>
          <Button
            onClick={handleConfirm}
            disabled={!isFormValid || isSubmitting}
            className='px-4 py-2'
            isLoading={isSubmitting}
            loaderSize={16}
            loaderColor='#FFFFFF'
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};
