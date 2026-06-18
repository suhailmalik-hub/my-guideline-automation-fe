import type { IUpdateConfirmGuidelineRequest, IUpdateConfirmGuidelineResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/guidelineAutomate/confirmGuideline';

export const UpdateConfirmGuideline = async (
  updateConfirmGuidelinePayload: IUpdateConfirmGuidelineRequest
): Promise<IUpdateConfirmGuidelineResponse> => {
  try {
    const response = await axiosInstance.patch(`${API_ENDPOINT}`, updateConfirmGuidelinePayload);
    return response as unknown as IUpdateConfirmGuidelineResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
