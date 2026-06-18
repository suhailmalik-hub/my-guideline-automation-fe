import { useVisaConfig } from '@/Neuron/hooks';
import { Loader } from '@/lib/ui';
import React, { useEffect, useState } from 'react';
import { VisaMasterHeader } from './Header';
import { VisaHierarchyTree } from './VisaHierarchy/VisaHierarchyTree';
import type { IVisaConfigPayload } from './modal/VisaConfigModal';
import { VisaConfigModal } from './modal/VisaConfigModal';

export const VisaMaster: React.FC = () => {
  const {
    isFetchingDestinationCountries,
    destinationCountriesList,
    fetchDestinationCountriesList,
    isVisaTypeCreating,
    createVisaType,
    isFetchingVisaTypeHierarchy,
    visaTypeHierarchy,
    fetchVisaTypeHierarchy,
  } = useVisaConfig();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDestinationCountriesList();
    fetchVisaTypeHierarchy();
  }, []);

  const handleVisaConfiguration = () => {
    setIsModalOpen(true);
  };

  const onCompleteVisaTypeCreation = (status: string) => {
    if (status === 'success') {
      setIsModalOpen(false);
      fetchVisaTypeHierarchy();
    }
  };

  const handleConfirm = (payload: IVisaConfigPayload) => {
    createVisaType(payload, onCompleteVisaTypeCreation);
  };

  return (
    <div className='flex flex-col h-full gap-4'>
      {(isFetchingDestinationCountries || isFetchingVisaTypeHierarchy) && <Loader overlay />}
      <VisaMasterHeader onCreateVisaType={handleVisaConfiguration} />
      <div className='flex-1 overflow-y-auto'>
        <VisaHierarchyTree data={visaTypeHierarchy} />
      </div>

      <VisaConfigModal
        key={String(isModalOpen)}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        destinationCountries={destinationCountriesList}
        isSubmitting={isVisaTypeCreating}
      />
    </div>
  );
};
