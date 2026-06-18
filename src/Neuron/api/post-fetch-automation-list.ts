import type { IAutomationListRequest, IAutomationListResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/guidelineAutomate/list';

export const PostFetchAutomationList = async (
  automationListPayload: IAutomationListRequest
): Promise<IAutomationListResponse> => {
  try {
    const response = await axiosInstance.post(`${API_ENDPOINT}`, automationListPayload);
    return response as unknown as IAutomationListResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
