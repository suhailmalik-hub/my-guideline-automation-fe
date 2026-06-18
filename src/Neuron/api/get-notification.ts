import type { INotificationResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/notification/unread';

export const GetNotification = async (): Promise<INotificationResponse> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINT);
    return response as unknown as INotificationResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
