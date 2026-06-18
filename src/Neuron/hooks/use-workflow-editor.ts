import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  PostCreateAutomation,
  PostPlayAutomation,
  PostRunAutomation,
  PostSaveAutomation,
  UpdateAutomationStep,
} from '../api';
import type {
  ICreateAutomationRequest,
  ICreateAutomationResponse,
  IPlayAutomationRequest,
  // IPlayAutomationResponse,
  IRunAutomationRequest,
  // IRunAutomationResult,
  ISaveAutomationRequest,
  IUpdateAutomationStepRequest,
} from '../types';

export const useWorkflowEditor = () => {
  // Creating Automation

  const [isAutomationCreating, setIsAutomationCreating] = useState<boolean>(false);
  // const [automationDetails, setAutomationDetails] = useState<ICreateAutomationResponse | null>(null);
  const [createdAutomation, setCreatedAutomation] = useState<ICreateAutomationResponse | null>(null);

  const createAutomation = (
    createAutomationPayload: ICreateAutomationRequest,
    onComplete: (status: string) => void
  ) => {
    setIsAutomationCreating(true);
    PostCreateAutomation(createAutomationPayload)
      .then((res) => {
        setIsAutomationCreating(false);
        setCreatedAutomation(res);
        toast.success(res.message || 'Automation created successfully!');
        onComplete('success');
      })
      .catch(() => {
        setIsAutomationCreating(false);
        onComplete('failure');
      });
  };

  // Play Automation
  const [isAutomationExecuting, setIsAutomationExecuting] = useState<boolean>(false);
  // const [automationExecutionResponse, setAutomationExecutionResponse] = useState<IPlayAutomationResponse | null>(null);

  const playAutomation = (playAutomationPayload: IPlayAutomationRequest, onComplete: (status: string) => void) => {
    setIsAutomationExecuting(true);
    PostPlayAutomation(playAutomationPayload)
      .then(() => {
        setIsAutomationExecuting(false);
        // the response was handles vis SSE notification
        // setAutomationExecutionResponse(res);
        onComplete('success');
      })
      .catch(() => {
        setIsAutomationExecuting(false);
        onComplete('failure');
      });
  };

  // Save Automation
  const [isAutomationSaving, setIsAutomationSaving] = useState<boolean>(false);

  const saveAutomation = (saveAutomationPayload: ISaveAutomationRequest, onComplete: (status: string) => void) => {
    setIsAutomationSaving(true);
    PostSaveAutomation(saveAutomationPayload)
      .then((res) => {
        setIsAutomationSaving(false);
        toast.success(res.message || 'Automation saved successfully!');
        onComplete('success');
      })
      .catch(() => {
        setIsAutomationSaving(false);
        onComplete('failure');
      });
  };

  // Update Automation Step

  const [isAutomationStepUpdating, setIsAutomationStepUpdating] = useState<boolean>(false);

  const updateAutomationStep = (updateAutomationStepPayload: IUpdateAutomationStepRequest) => {
    setIsAutomationStepUpdating(true);
    UpdateAutomationStep(updateAutomationStepPayload)
      .then((res) => {
        setIsAutomationStepUpdating(false);
        toast.success(res?.message || 'Automation step updated successfully!');
      })
      .catch(() => {
        setIsAutomationStepUpdating(false);
      });
  };

  // Run Automation

  const [isAutomationRunning, setIsAutomationRunning] = useState<boolean>(false);
  // const [automationRunResponse, setAutomationRunResponse] = useState<IRunAutomationResult | null>(null);

  const runAutomation = (guidelineId: IRunAutomationRequest, onComplete: (status: string) => void) => {
    setIsAutomationRunning(true);
    PostRunAutomation(guidelineId)
      .then(() => {
        setIsAutomationRunning(false);
        // the response was handles vis SSE notification
        // setAutomationRunResponse(res?.result);
        onComplete('success');
      })
      .catch(() => {
        setIsAutomationRunning(false);
        onComplete('failure');
      });
  };

  return {
    // Automation creation
    isAutomationCreating,
    createdAutomation,
    createAutomation,

    // Automation play
    isAutomationExecuting,
    // automationExecutionResponse,
    playAutomation,

    // Automation save
    isAutomationSaving,
    saveAutomation,

    // Automation step update
    isAutomationStepUpdating,
    updateAutomationStep,

    // Automation run
    isAutomationRunning,
    // automationRunResponse,
    runAutomation,
  };
};
