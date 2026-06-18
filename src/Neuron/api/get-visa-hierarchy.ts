import type { IVisaHierarchyResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/visaType/hierarchy';

export const GetVisaTypeHierarchy = async (): Promise<IVisaHierarchyResponse> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINT);
    return response as unknown as IVisaHierarchyResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
