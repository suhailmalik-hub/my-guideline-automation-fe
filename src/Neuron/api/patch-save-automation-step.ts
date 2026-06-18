import type { IUpdateAutomationStepRequest, IUpdateAutomationStepResponse } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/guidelineAutomate/update-automation-step';

export const UpdateAutomationStep = async (
  updateAutomationStepPayload: IUpdateAutomationStepRequest
): Promise<IUpdateAutomationStepResponse> => {
  try {
    const response = await axiosInstance.patch(`${API_ENDPOINT}`, updateAutomationStepPayload);
    return response as unknown as IUpdateAutomationStepResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
