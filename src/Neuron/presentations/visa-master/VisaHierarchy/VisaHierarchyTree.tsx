import { ChevronDown, ChevronRight, Globe, IdCard, Lock, Tags } from 'lucide-react';
import React, { useState } from 'react';

interface SubVisaType {
  id: string;
  sub_visa_name: string;
}

interface VisaType {
  id: string;
  visa_name: string;
  subVisaTypes: SubVisaType[];
}

interface Country {
  id: string;
  name: string;
  visaTypes: VisaType[];
}

interface VisaHierarchyTreeProps {
  data: Country[] | null;
}

export const VisaHierarchyTree: React.FC<VisaHierarchyTreeProps> = ({ data }) => {
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
  const [expandedVisaTypes, setExpandedVisaTypes] = useState<Record<string, boolean>>({});

  const toggleCountry = (countryId: string) => {
    setExpandedCountries((prev) => ({ ...prev, [countryId]: !prev[countryId] }));
  };

  const toggleVisaType = (visaTypeId: string) => {
    setExpandedVisaTypes((prev) => ({ ...prev, [visaTypeId]: !prev[visaTypeId] }));
  };

  if (!data || data.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-center text-gray-400'>
        <div className='w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4'>
          <Lock
            size={24}
            className='text-gray-300'
          />
        </div>
        <p className='text-sm font-medium text-gray-500'>No visa hierarchy configured</p>
        <p className='text-xs text-gray-400 mt-1'>Create a visa type to get started</p>
      </div>
    );
  }

  return (
    <div className='px-6 pb-6 space-y-2'>
      {data.map((country) => {
        const isCountryOpen = !!expandedCountries[country.id];
        const hasVisaTypes = country.visaTypes.length > 0;

        return (
          <div
            key={country.id}
            className='bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm'
          >
            {/* Country Row */}
            <button
              onClick={() => toggleCountry(country.id)}
              className='w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left'
            >
              <div className='w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0'>
                <Globe
                  size={14}
                  className='text-blue-600'
                />
              </div>
              <span className='font-semibold text-gray-900 flex-1 text-sm'>{country.name}</span>
              <span className='text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100'>
                {country.visaTypes.length} visa type{country.visaTypes.length !== 1 ? 's' : ''}
              </span>
              {hasVisaTypes ? (
                isCountryOpen ? (
                  <ChevronDown
                    size={15}
                    className='text-gray-400 shrink-0'
                  />
                ) : (
                  <ChevronRight
                    size={15}
                    className='text-gray-400 shrink-0'
                  />
                )
              ) : null}
            </button>

            {/* Visa Types */}
            {isCountryOpen && (
              <div className='border-t border-gray-100 bg-gray-50/50'>
                {!hasVisaTypes ? (
                  <div className='flex items-center gap-2 px-6 py-4 text-gray-400'>
                    <IdCard
                      size={14}
                      className='shrink-0'
                    />
                    <span className='text-xs'>No visa types configured for this country</span>
                  </div>
                ) : (
                  <div className='py-2 px-3 space-y-1'>
                    {country.visaTypes.map((visaType) => {
                      const isVisaOpen = !!expandedVisaTypes[visaType.id];
                      const hasSubTypes = visaType.subVisaTypes.length > 0;

                      return (
                        <div
                          key={visaType.id}
                          className='bg-white border border-gray-100 rounded-lg overflow-hidden'
                        >
                          {/* Visa Type Row */}
                          <button
                            onClick={() => toggleVisaType(visaType.id)}
                            className='w-full flex items-center gap-3 px-3 py-2.5 hover:bg-amber-50/50 transition-colors text-left'
                          >
                            <div className='w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center shrink-0'>
                              <IdCard
                                size={12}
                                className='text-amber-600'
                              />
                            </div>
                            <span className='font-medium text-gray-800 flex-1 text-xs'>{visaType.visa_name}</span>
                            <span className='text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100'>
                              {visaType.subVisaTypes.length} sub type{visaType.subVisaTypes.length !== 1 ? 's' : ''}
                            </span>
                            {hasSubTypes ? (
                              isVisaOpen ? (
                                <ChevronDown
                                  size={13}
                                  className='text-gray-400 shrink-0'
                                />
                              ) : (
                                <ChevronRight
                                  size={13}
                                  className='text-gray-400 shrink-0'
                                />
                              )
                            ) : null}
                          </button>

                          {/* Sub Visa Types */}
                          {isVisaOpen && (
                            <div className='border-t border-gray-100 bg-gray-50/30'>
                              {!hasSubTypes ? (
                                <div className='flex items-center gap-2 px-5 py-3 text-gray-400'>
                                  <Tags
                                    size={12}
                                    className='shrink-0'
                                  />
                                  <span className='text-[11px]'>No sub visa types configured</span>
                                </div>
                              ) : (
                                <div className='px-3 py-2 space-y-1'>
                                  {visaType.subVisaTypes.map((subVisaType) => (
                                    <div
                                      key={subVisaType.id}
                                      className='flex items-center gap-2.5 px-3 py-2 rounded-md bg-white border border-purple-100 hover:border-purple-200 transition-colors'
                                    >
                                      <div className='w-5 h-5 rounded bg-purple-100 flex items-center justify-center shrink-0'>
                                        <Tags
                                          size={11}
                                          className='text-purple-600'
                                        />
                                      </div>
                                      <span className='text-xs text-gray-700 font-medium'>
                                        {subVisaType.sub_visa_name}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
