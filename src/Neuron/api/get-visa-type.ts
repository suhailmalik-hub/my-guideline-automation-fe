import type { IVisaTypeResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/visaType/list';

export const GetVisaType = async (destinationCountryId: string): Promise<IVisaTypeResponse> => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}?destinationCountryId=${destinationCountryId}`);
    return response as unknown as IVisaTypeResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
