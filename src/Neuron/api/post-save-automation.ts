import type { ISaveAutomationRequest, ISaveAutomationResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/guidelineAutomate/save';

export const PostSaveAutomation = async (
  saveAutomationPayload: ISaveAutomationRequest
): Promise<ISaveAutomationResponse> => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, saveAutomationPayload);
    return response as unknown as ISaveAutomationResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
