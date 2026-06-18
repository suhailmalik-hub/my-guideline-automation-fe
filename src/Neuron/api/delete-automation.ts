import type { IDeleteAutomationResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/guidelineAutomate/delete';

export const DeleteAutomation = async (guidelineId: string): Promise<IDeleteAutomationResponse> => {
  try {
    const response = await axiosInstance.delete(`${API_ENDPOINT}?guidelineId=${guidelineId}`);
    return response as unknown as IDeleteAutomationResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
