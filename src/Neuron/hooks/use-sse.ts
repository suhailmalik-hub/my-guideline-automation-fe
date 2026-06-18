import { useEffect } from 'react';
import { createSseClient, setSseClientId } from '../api/sse-client';
import type { IAutomationExecutionVFSFlow, IRunAutomationResult } from '../types';

interface UseSseOptions {
  onConnected?: () => void;
  onDisconnected?: () => void;
  onAutomationStarted?: (data: { guidelineId: string }) => void;
  onAutomationCompleted?: (data: { guidelineId: string }) => void;
  onAutomationRunError?: (data: { guidelineId: string }) => void;
  onAutomationNotification?: (data: {
    id: string;
    notification_type: string;
    automation_id: string;
    message: string;
  }) => void;
  onGuidelinePlayStartNotification?: () => void;
  onGuidelinePlayCompleteNotification?: (data: {
    guidelineId: string;
    tabId: string;
    clientId: string;
    result: IAutomationExecutionVFSFlow;
  }) => void;

  onGuidelinePlayErrorNotification?: (data: {
    guidelineId: string;
    tabId: string;
    clientId: string;
    result: unknown;
  }) => void;
  onManualGuidelineRunStart?: (data: { guidelineId: string }) => void;
  onManualGuidelineRunComplete?: (data: {
    guidelineId: string;
    tabId: string;
    clientId: string;
    result: IRunAutomationResult;
  }) => void;
  onManualGuidelineRunError?: (data: { guidelineId: string; tabId: string; clientId: string; result: unknown }) => void;
}

export const useSSE = (options: UseSseOptions): void => {
  useEffect(() => {
    const es = createSseClient();

    let handleAutomationStarted: ((e: MessageEvent) => void) | null = null;
    let handleAutomationCompleted: ((e: MessageEvent) => void) | null = null;
    let handleAutomationRunError: ((e: MessageEvent) => void) | null = null;
    let handleAutomationNotification: ((e: MessageEvent) => void) | null = null;
    let handleGuidelinePlayStartNotification: ((e: MessageEvent) => void) | null = null;
    let handleGuidelinePlayCompleteNotification: ((e: MessageEvent) => void) | null = null;
    let handleGuidelinePlayErrorNotification: ((e: MessageEvent) => void) | null = null;
    let handleManualGuidelineRunStart: ((e: MessageEvent) => void) | null = null;
    let handleManualGuidelineRunComplete: ((e: MessageEvent) => void) | null = null;
    let handleManualGuidelineRunError: ((e: MessageEvent) => void) | null = null;

    const handleConnected = (dt: MessageEvent) => {
      try {
        const parsed = JSON.parse(dt.data);
        const clientId = parsed?.clientId ?? parsed?.client_id ?? parsed?.id ?? null;
        if (clientId) setSseClientId(String(clientId));
      } catch {
        // data is not JSON or has no recognised client ID field
      }
      options.onConnected?.();
    };
    es.addEventListener('connected', handleConnected);

    const handleError = () => options.onDisconnected?.();
    es.addEventListener('error', handleError);

    if (options.onAutomationStarted) {
      handleAutomationStarted = (e: MessageEvent) => {
        options.onAutomationStarted!(JSON.parse(e.data));
      };
      es.addEventListener('automation:started', handleAutomationStarted);
    }

    if (options.onAutomationCompleted) {
      handleAutomationCompleted = (e: MessageEvent) => {
        options.onAutomationCompleted!(JSON.parse(e.data));
      };
      es.addEventListener('automation:completed', handleAutomationCompleted);
    }

    if (options.onAutomationRunError) {
      handleAutomationRunError = (e: MessageEvent) => {
        options.onAutomationRunError!(JSON.parse(e.data));
      };
      es.addEventListener('automation:run_error', handleAutomationRunError);
    }

    if (options.onAutomationNotification) {
      handleAutomationNotification = (e: MessageEvent) => {
        options.onAutomationNotification!(JSON.parse(e.data));
      };
      es.addEventListener('automate:guideline_notification', handleAutomationNotification);
    }

    if (options.onGuidelinePlayStartNotification) {
      handleGuidelinePlayStartNotification = () => {
        options.onGuidelinePlayStartNotification!();
      };
      es.addEventListener('automation:play_started', handleGuidelinePlayStartNotification);
    }

    if (options.onGuidelinePlayCompleteNotification) {
      handleGuidelinePlayCompleteNotification = (e: MessageEvent) => {
        options.onGuidelinePlayCompleteNotification!(JSON.parse(e.data));
      };
      es.addEventListener('automation:play_completed', handleGuidelinePlayCompleteNotification);
    }

    if (options.onGuidelinePlayErrorNotification) {
      handleGuidelinePlayErrorNotification = (e: MessageEvent) => {
        options.onGuidelinePlayErrorNotification!(JSON.parse(e.data));
      };
      es.addEventListener('automation:play_error', handleGuidelinePlayErrorNotification);
    }

    if (options.onManualGuidelineRunStart) {
      handleManualGuidelineRunStart = (e: MessageEvent) => {
        options.onManualGuidelineRunStart!(JSON.parse(e.data));
      };
      es.addEventListener('automation:manual_run_started', handleManualGuidelineRunStart);
    }

    if (options.onManualGuidelineRunComplete) {
      handleManualGuidelineRunComplete = (e: MessageEvent) => {
        console.log('Event data: ', JSON.parse(e.data));
        options.onManualGuidelineRunComplete!(JSON.parse(e.data));
      };
      es.addEventListener('automation:manual_run_completed', handleManualGuidelineRunComplete);
    }

    if (options.onManualGuidelineRunError) {
      handleManualGuidelineRunError = (e: MessageEvent) => {
        options.onManualGuidelineRunError!(JSON.parse(e.data));
      };
      es.addEventListener('automation:manual_run_error', handleManualGuidelineRunError);
    }

    return () => {
      es.removeEventListener('connected', handleConnected as EventListener);
      es.removeEventListener('error', handleError);
      if (handleAutomationStarted)
        es.removeEventListener('automation:started', handleAutomationStarted as EventListener);
      if (handleAutomationCompleted)
        es.removeEventListener('automation:completed', handleAutomationCompleted as EventListener);
      if (handleAutomationRunError)
        es.removeEventListener('automation:run_error', handleAutomationRunError as EventListener);
      if (handleAutomationNotification)
        es.removeEventListener('automate:guideline_notification', handleAutomationNotification as EventListener);
      if (handleGuidelinePlayStartNotification)
        es.removeEventListener('automation:play_started', handleGuidelinePlayStartNotification as EventListener);
      if (handleGuidelinePlayCompleteNotification)
        es.removeEventListener('automation:play_completed', handleGuidelinePlayCompleteNotification as EventListener);
      if (handleGuidelinePlayErrorNotification)
        es.removeEventListener('automation:play_error', handleGuidelinePlayErrorNotification as EventListener);
      if (handleManualGuidelineRunStart)
        es.removeEventListener('automation:manual_run_started', handleManualGuidelineRunStart as EventListener);
      if (handleManualGuidelineRunComplete)
        es.removeEventListener('automation:manual_run_completed', handleManualGuidelineRunComplete as EventListener);
      if (handleManualGuidelineRunError)
        es.removeEventListener('automation:manual_run_error', handleManualGuidelineRunError as EventListener);
      options.onDisconnected?.();
    };
  }, []);
};
