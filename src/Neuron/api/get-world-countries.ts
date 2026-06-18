import type { IWorldCountriesResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/country/world/list';

export const GetWorldCountries = async (): Promise<IWorldCountriesResponse> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINT);
    return response as unknown as IWorldCountriesResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
