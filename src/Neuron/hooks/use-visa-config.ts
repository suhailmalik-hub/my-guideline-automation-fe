import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  GetDestinationCountries,
  GetSubVisaType,
  GetVisaType,
  GetVisaTypeHierarchy,
  GetWorldCountries,
  PostCreateVisaType,
} from '../api';
import type { ICountry, ICountryVisa, ICreateVisaTypeRequest, ISubVisaType, IVisaType } from '../types';

export const useVisaConfig = () => {
  // Create Visa Type
  const [isVisaTypeCreating, setIsVisaTypeCreating] = useState<boolean>(false);

  const createVisaType = (createVisaTypePayload: ICreateVisaTypeRequest, onComplete: (status: string) => void) => {
    setIsVisaTypeCreating(true);
    PostCreateVisaType(createVisaTypePayload)
      .then((res) => {
        setIsVisaTypeCreating(false);
        toast.success(res.message || 'Visa type created successfully!');
        onComplete('success');
      })
      .catch(() => {
        setIsVisaTypeCreating(false);
        onComplete('failed');
      });
  };

  //Get World Countries List

  const [isFetchingWorldCountries, setIsFetchingWorldCountries] = useState<boolean>(false);
  const [worldCountriesList, setWorldCountriesList] = useState<ICountry[] | null>(null);

  const fetchWorldCountriesList = () => {
    setIsFetchingWorldCountries(true);
    GetWorldCountries()
      .then((res) => {
        setIsFetchingWorldCountries(false);
        setWorldCountriesList(res?.data);
      })
      .catch(() => {
        setIsFetchingWorldCountries(false);
      });
  };

  // Get Destination Countries List

  const [isFetchingDestinationCountries, setIsFetchingDestinationCountries] = useState<boolean>(false);
  const [destinationCountriesList, setDestinationCountriesList] = useState<ICountry[] | null>(null);

  const fetchDestinationCountriesList = () => {
    setIsFetchingDestinationCountries(true);
    GetDestinationCountries()
      .then((res) => {
        setIsFetchingDestinationCountries(false);
        setDestinationCountriesList(res?.data);
      })
      .catch(() => {
        setIsFetchingDestinationCountries(false);
      });
  };

  // Get Visa Type
  const [isFetchingVisaType, setIsFetchingVisaType] = useState<boolean>(false);
  const [visaTypeList, setVisaTypeList] = useState<IVisaType[] | null>(null);

  const fetchVisaType = (destinationCountryId: string) => {
    setIsFetchingVisaType(true);
    GetVisaType(destinationCountryId)
      .then((res) => {
        setIsFetchingVisaType(false);
        setVisaTypeList(res?.data);
      })
      .catch(() => {
        setIsFetchingVisaType(false);
      });
  };

  // Get Visa Sub Type
  const [isFetchingVisaSubType, setIsFetchingVisaSubType] = useState<boolean>(false);
  const [visaSubTypeList, setVisaSubTypeList] = useState<ISubVisaType[] | null>(null);

  const fetchVisaSubType = (visaTypeId: string) => {
    setIsFetchingVisaSubType(true);
    GetSubVisaType(visaTypeId)
      .then((res) => {
        setIsFetchingVisaSubType(false);
        setVisaSubTypeList(res?.data);
      })
      .catch(() => {
        setIsFetchingVisaSubType(false);
      });
  };

  // Get VisaType Hierarchy
  const [isFetchingVisaTypeHierarchy, setIsFetchingVisaTypeHierarchy] = useState<boolean>(false);
  const [visaTypeHierarchy, setVisaTypeHierarchy] = useState<ICountryVisa[] | null>(null);

  const fetchVisaTypeHierarchy = () => {
    setIsFetchingVisaTypeHierarchy(true);
    GetVisaTypeHierarchy()
      .then((res) => {
        setIsFetchingVisaTypeHierarchy(false);
        setVisaTypeHierarchy(res?.data);
      })
      .catch(() => {
        setIsFetchingVisaTypeHierarchy(false);
      });
  };

  // Get Combined Api Call For World Countries, Destination Countries.

  const [isFetchingCountries, setIsFetchingCountries] = useState<boolean>(false);
  const [worldCountries, setWorldCountries] = useState<ICountry[] | null>(null);
  const [destinationCountries, setDestinationCountries] = useState<ICountry[] | null>(null);

  const fetchCountriesData = () => {
    setIsFetchingCountries(true);
    Promise.all([GetWorldCountries(), GetDestinationCountries()])
      .then(([worldRes, destinationRes]) => {
        setIsFetchingCountries(false);
        setWorldCountries(worldRes?.data);
        setDestinationCountries(destinationRes?.data);
      })
      .catch(() => {
        setIsFetchingCountries(false);
      });
  };

  return {
    // Create Visa Type
    isVisaTypeCreating,
    createVisaType,

    // Get World Countries
    isFetchingWorldCountries,
    worldCountriesList,
    fetchWorldCountriesList,

    // Get Destination Countries
    isFetchingDestinationCountries,
    destinationCountriesList,
    fetchDestinationCountriesList,

    // Get Visa Type
    isFetchingVisaType,
    visaTypeList,
    fetchVisaType,

    // Get Visa Sub Type
    isFetchingVisaSubType,
    visaSubTypeList,
    fetchVisaSubType,

    // Get Visa Type Hierarchy
    isFetchingVisaTypeHierarchy,
    visaTypeHierarchy,
    fetchVisaTypeHierarchy,

    // Get Countries Combined
    isFetchingCountries,
    worldCountries,
    destinationCountries,
    fetchCountriesData,
  };
};
