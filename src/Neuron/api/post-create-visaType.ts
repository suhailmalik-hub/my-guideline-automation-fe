import type { ICreateVisaTypeRequest, ICreateVisaTypeResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/visaType/create';

export const PostCreateVisaType = async (
  createVisaTypePayload: ICreateVisaTypeRequest
): Promise<ICreateVisaTypeResponse> => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, createVisaTypePayload);
    return response as unknown as ICreateVisaTypeResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
