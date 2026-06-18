import type { ISubVisaTypeResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/visaType/sub-visa/list';

export const GetSubVisaType = async (visaTypeId: string): Promise<ISubVisaTypeResponse> => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}?visaTypeId=${visaTypeId}`);
    return response as unknown as ISubVisaTypeResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
