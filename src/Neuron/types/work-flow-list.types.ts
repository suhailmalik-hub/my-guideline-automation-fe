import type { IPagination } from './common.types';

export interface IAutomationListRequest {
  page: number;
  limit: number;
  status: 'IN_PROGRESS' | 'PUBLISHED' | 'RUN_ERROR' | string;
}

export interface IGuidelineResultDetail {
  id: string | null;
  is_confirmed: boolean | null;
  guideline_state: string;
}

export interface IGuidelineResultDetail {
  id: string | null;
  is_confirmed: boolean | null;
  guideline_state: string;
}

export interface IGuidelineAutomation {
  id: string;
  readable_id: string;
  source_country: string;
  destination_country: string;
  visa_type: string;
  subvisa_type: string;
  is_running: boolean;
  guideline_result: IGuidelineResultDetail;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'RUN_ERROR' | 'PUBLISHED' | string;
}

export interface IAutomationListData {
  pagination: IPagination;
  list: IGuidelineAutomation[];
}

export interface IAutomationListResponse {
  success: boolean;
  message: string;
  data: IAutomationListData;
}

export interface IFetchAutomationDetailsRequest {
  guidelineId: string;
}

type AutomationActionType =
  | 'openUrl'
  | 'extract'
  | 'extractPDF'
  | 'extractScreenshot'
  | 'click'
  | 'selectDropdownOption'
  | 'fillTextInput'
  | 'selectRadioInput';

export interface AutomationBaseStep {
  name: string;
  order: number;
  action: AutomationActionType;
  targetElement?: string;
  targetDescription?: string;
  xpath?: string;
  snapshotBeforeStep?: boolean;
  waitBeforeStep?: number;
}

export interface ExtractContentStep extends AutomationBaseStep {
  action: 'extract';
}

export interface ExtractScreenshotStep extends AutomationBaseStep {
  action: 'extractScreenshot';
  contentFrom?: string;
  contentUpto?: string;
}

export interface ClickElementStep extends AutomationBaseStep {
  action: 'click';
}

export interface ExtractPdfStep extends AutomationBaseStep {
  action: 'extractPDF';
  pdfUrl: string;
}

export interface NavigateStep extends AutomationBaseStep {
  action: 'openUrl';
  url: string;
}

export interface SelectOptionStep extends AutomationBaseStep {
  action: 'selectDropdownOption';
  value: string;
}

export interface InputTextStep extends AutomationBaseStep {
  action: 'fillTextInput';
  value: string;
}

export interface SelectRadioInputStep extends AutomationBaseStep {
  action: 'selectRadioInput';
  value: string;
}

export type AutomationStep =
  | ExtractContentStep
  | ExtractScreenshotStep
  | ClickElementStep
  | ExtractPdfStep
  | NavigateStep
  | SelectOptionStep
  | SelectRadioInputStep
  | InputTextStep;

export interface VfsAutomationFlow {
  url: string;
  waitBeforeStart?: number;
  steps: AutomationStep[];
}

export interface AutomationFlowMap {
  [flowName: string]: VfsAutomationFlow | undefined;
}

export interface AutomationStepConfig {
  useSession: boolean;
  flows: AutomationFlowMap;
}

export interface FetchAutomationDetailData {
  id: string;
  readable_id: string;
  source_country: string;
  destination_country: string;
  visa_type: string;
  subvisa_type: string;
  status: 'DRAFT' | 'PUBLISHED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | string;
  automation_step: AutomationStepConfig;
}

export interface IFetchAutomationDetailResponse {
  success: boolean;
  message: string;
  data: FetchAutomationDetailData;
}

export interface IDeleteAutomationResponse {
  success: boolean;
  message: string;
}

export interface IRunAutomationRequest {
  tabId: string;
  clientId: string;
  guidelineId: string;
}

export interface IVisaGuideline {
  toCountryCode?: string;
  toCountryName?: string;
  visaType?: string;
  visaCategory?: string;
  syncedAt?: string;
  route?: string;
  visaMetaData?: {
    visaName?: string;
    visaFees?: {
      feesType?: string;
      amount?: string;
    }[];
    maxLengthOfStay?: string;
    duration?: string;
    processingTime?: string;
    earliestTimeToApply?: string;
    entriesAllowed?: string;
    additionalRequirements?: {
      requirements?: string;
      note?: string;
      link?: string;
    }[];
    baseUrls?: string[];
  };
  visaDocumentsGuidelines?: {
    docCategory?: string;
    documents?: {
      documentName?: string;
      category?: string;
      requirements?: string[];
      links?: string[];
    }[];
    notes?: string[];
    links?: string[];
    mandatory?: boolean;
    conditions?: string[];
  }[];
}

export interface IRunAutomationResult {
  generated_guideline: IVisaGuideline;
  existing_guideline: IVisaGuideline;
  mode: string;
}

export interface IRunAutomationResponse {
  success: true;
  message: string;
  result: IRunAutomationResult;
}

export interface IUpdateConfirmGuidelineRequest {
  guidelineId: string;
  guideline: IVisaGuideline;
}

export interface IUpdateConfirmGuidelineResponse {
  success: true;
  message: string;
}

interface GuidelineData {
  existing_guideline: IVisaGuideline;
  generated_guideline: IVisaGuideline;
  is_confirmed: boolean | null;
  mode: string;
}

export interface IGuidelineDetailResponse {
  success: boolean;
  message: string;
  data: GuidelineData;
}
