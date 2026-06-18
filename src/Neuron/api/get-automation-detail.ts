import type { IFetchAutomationDetailResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/guidelineAutomate/detail';

export const GetAutomationDetail = async (guidelineId: string): Promise<IFetchAutomationDetailResponse> => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}?guidelineId=${guidelineId}`);
    return response as unknown as IFetchAutomationDetailResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
