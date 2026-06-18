export interface ICreateVisaTypeRequest {
  destinationCountryId: string;
  destinationCountry: string;
  visaType: string;
  subVisaType: string;
}

export interface ICreateVisaTypeResponse {
  success: boolean;
  message: string;
}

export interface ICountry {
  id: string;
  name: string;
  alpha2: string;
  alpha3: string;
}

export interface IWorldCountriesResponse {
  success: boolean;
  message: string;
  data: ICountry[];
}

export interface IDestinationCountriesResponse {
  success: boolean;
  message: string;
  data: ICountry[];
}

export interface IVisaType {
  id: string;
  visa_name: string;
}
export interface IVisaTypeResponse {
  success: boolean;
  message: string;
  data: IVisaType[];
}

export interface ISubVisaType {
  id: string;
  sub_visa_name: string;
}

export interface ISubVisaTypeResponse {
  success: boolean;
  message: string;
  data: ISubVisaType[];
}

export interface ISubVisaOption {
  id: string;
  sub_visa_name: string;
}

export interface IVisaOption {
  id: string;
  visa_name: string;
  subVisaTypes: ISubVisaOption[];
}

export interface ICountryVisa {
  id: string;
  name: string;
  visaTypes: IVisaOption[];
}

export interface IVisaHierarchyResponse {
  success: boolean;
  message: string;
  data: ICountryVisa[];
}
