import type { IPlayAutomationRequest, IPlayAutomationResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/guidelineAutomate/play';

export const PostPlayAutomation = async (
  playAutomationPayload: IPlayAutomationRequest
): Promise<IPlayAutomationResponse> => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, playAutomationPayload);
    return response as unknown as IPlayAutomationResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
