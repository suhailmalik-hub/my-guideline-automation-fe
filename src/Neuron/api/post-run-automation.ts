import type { IRunAutomationRequest, IRunAutomationResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/guidelineAutomate/run';

export const PostRunAutomation = async (
  runAutomationPayload: IRunAutomationRequest
): Promise<IRunAutomationResponse> => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, runAutomationPayload);
    return response as unknown as IRunAutomationResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
