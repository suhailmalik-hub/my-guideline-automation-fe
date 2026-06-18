import type { ICreateAutomationRequest, ICreateAutomationResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/guidelineAutomate/create';

export const PostCreateAutomation = async (
  createAutomationPayload: ICreateAutomationRequest
): Promise<ICreateAutomationResponse> => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, createAutomationPayload);
    return response as unknown as ICreateAutomationResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
