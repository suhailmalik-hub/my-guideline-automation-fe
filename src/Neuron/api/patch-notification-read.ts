import type { INotificationReadRequest, INotificationReadResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/notification/read';

export const UpdateNotificationRead = async (
  updateNotificationReadpaylod: INotificationReadRequest
): Promise<INotificationReadResponse> => {
  try {
    const response = await axiosInstance.patch(`${API_ENDPOINT}`, updateNotificationReadpaylod);
    return response as unknown as INotificationReadResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
