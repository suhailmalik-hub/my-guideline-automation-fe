import type { IDestinationCountriesResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/country/destination/list';

export const GetDestinationCountries = async (): Promise<IDestinationCountriesResponse> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINT);
    return response as unknown as IDestinationCountriesResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
