import type { IGuidelineDetailResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/guidelineAutomate/guidelineDetail';

export const GetGuidelineDetail = async (guidelineId: string): Promise<IGuidelineDetailResponse> => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}?guidelineId=${guidelineId}`);
    return response as unknown as IGuidelineDetailResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
