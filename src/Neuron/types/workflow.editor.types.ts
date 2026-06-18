export type StepCategory = 'browser' | 'extract' | 'interact' | string;

export type ActionType =
  | 'openUrl'
  | 'extract'
  | 'extractPDF'
  | 'extractScreenshot'
  | 'click'
  | 'selectDropdownOption'
  | 'fillTextInput'
  | 'selectRadioInput'
  | string;

export interface WorkflowStep {
  id: string;
  actionType: ActionType;
  category: StepCategory;
  name: string;
  description: string;
  snapshotBeforeStep?: boolean;
  targetElement?: string;
  url?: string;
  value?: string;
  pdfUrl?: string;
  xpath?: string;
  waitBeforeStep?: number;
  contentFrom?: string;
  contentUpto?: string;
  createdAt: string;
}

export function getCategoryFromActionType(actionType: ActionType): StepCategory {
  switch (actionType) {
    case 'openUrl':
      return 'browser';
    case 'extract':
    case 'extractPDF':
    case 'extractScreenshot':
      return 'extract';
    case 'click':
    case 'selectDropdownOption':
    case 'selectRadioInput':
    case 'fillTextInput':
      return 'interact';
  }
  return 'interact'; // default category
}

export function getDefaultStepName(actionType: ActionType): string {
  const names: Record<ActionType, string> = {
    openUrl: 'Open URL',
    extract: 'Extract Content',
    extractPDF: 'Extract PDF',
    extractScreenshot: 'Extract Screen Shot',
    click: 'Click Element',
    selectDropdownOption: 'Select DropDown Option',
    fillTextInput: 'Fill Text Input',
    selectRadioInput: 'Select Radio Input',
  };
  return names[actionType];
}

export interface WorkflowFlow {
  id: string;
  name: string;
  url?: string;
  waitBeforeStart?: number;
  steps: WorkflowStep[];
  collapsed: boolean;
  createdAt: string;
}

export type CanvasItemRef = { kind: 'step'; id: string } | { kind: 'flow'; id: string };

/** Stable sortable ID used in outer SortableContext — avoids UUID collisions */
export function getCanvasItemSortableId(item: CanvasItemRef): string {
  return `${item.kind}::${item.id}`;
}

// Api Types
// export interface ICreateAutomationRequest {
//   sourceCountry: string;
//   destinationCountry: string;
//   visaType: string;
//   subvisaType?: string;
// }

// Need to be altered

export interface ICreateAutomationRequest {
  sourceCountryId: string;
  sourceCountry: string;
  destinationCountryId: string;
  destinationCountry: string;
  visaTypeId: string;
  visaType: string;
  subVisaTypeId: string;
  subvisaType: string;
}

export interface IAutomationData {
  id: string;
  is_running: boolean;
  active_status: boolean;
  source_country_id: string;
  source_country: string;
  destination_country_id: string;
  destination_country: string;
  visa_type_id: string;
  visa_type: string;
  sub_visa_type_id: string;
  subvisa_type: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'PENDING' | string;
  updated_at: string;
  created_at: string;
  readable_id: string;
  automation_step: unknown | null;
  created_by: unknown | null;
  updated_by: unknown | null;
}

export interface ICreateAutomationResponse {
  success: boolean;
  message: string;
  data: IAutomationData;
}

export interface BaseStep {
  name: string;
  order: number;
  action: ActionType;
  targetElement: string;
  targetDescription?: string;
  snapshotBeforeStep?: boolean;
  xpath?: string;
  waitBeforeStep?: number;
}

export interface ExtractStep extends BaseStep {
  action: 'extract';
}

export interface ScreenshotStep extends BaseStep {
  action: 'extractScreenshot';
  contentFrom?: string;
  contentUpto?: string;
}

export interface ClickStep extends BaseStep {
  action: 'click';
}

export interface ExtractPDFStep extends BaseStep {
  action: 'extractPDF';
  pdfUrl: string;
}

export interface OpenUrlStep extends BaseStep {
  action: 'openUrl';
  url: string;
}

export interface SelectDropDownOptionStep extends BaseStep {
  action: 'selectDropdownOption';
  value?: string;
}

export interface FillTextInputStep extends BaseStep {
  action: 'fillTextInput';
  value?: string;
}

export interface SelectInputRadioStep extends BaseStep {
  action: 'selectRadioInput';
  value?: string;
}

export type flowStep =
  | ExtractStep
  | ScreenshotStep
  | ClickStep
  | ExtractPDFStep
  | OpenUrlStep
  | SelectDropDownOptionStep
  | SelectInputRadioStep
  | FillTextInputStep;

export interface VFSFlow {
  url: string;
  waitBeforeStart?: number;
  steps: flowStep[];
}

// Execution response types
export interface IPlayAutomationRequest {
  guidelineId?: string;
  useSession: boolean;
  flows: VFSFlow;
}

interface IUsage {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
}

export interface IExecutionBaseStep {
  name: string;
  order: number;
  action: ActionType;
  targetElement: string;
  targetDescription?: string;
  snapshotBeforeStep?: boolean;
  xpath?: string;
  waitBeforeStep?: number;
  extractedContent?: string;
  usage: IUsage;
}

export interface ExecutionExtractStep extends IExecutionBaseStep {
  action: 'extract';
}

export interface ExecutionExtractScreenshotStep extends IExecutionBaseStep {
  action: 'extractScreenshot';
  contentFrom?: string;
  contentUpto?: string;
}

export interface ExecutionClickStep extends IExecutionBaseStep {
  action: 'click';
}

export interface ExecutionExtractPDFStep extends IExecutionBaseStep {
  action: 'extractPDF';
  pdfUrl: string;
}

export interface ExecutionOpenUrlStep extends IExecutionBaseStep {
  action: 'openUrl';
  url: string;
}

export interface ExecutionSelectDropDownOptionStep extends IExecutionBaseStep {
  action: 'selectDropdownOption';
  value?: string;
}

export interface ExecutionFillTextInputStep extends IExecutionBaseStep {
  action: 'fillTextInput';
  value?: string;
}

export interface ExecutionSelectInputRadioStep extends IExecutionBaseStep {
  action: 'selectRadioInput';
  value?: string;
}

type IExecutionFlowStep =
  | ExecutionExtractStep
  | ExecutionExtractScreenshotStep
  | ExecutionClickStep
  | ExecutionExtractPDFStep
  | ExecutionOpenUrlStep
  | ExecutionSelectDropDownOptionStep
  | ExecutionFillTextInputStep
  | ExecutionSelectInputRadioStep;

export interface IAutomationExecutionVFSFlow {
  flows: {};
  url: string;
  waitBeforeStart?: number;
  steps: IExecutionFlowStep[];
}

export interface IPlayAutomationResponse {
  // success: boolean;
  // message: string;
  guidelineId: string;
  tabId: string;
  clientId: string;
  result: IAutomationExecutionVFSFlow;
}

export interface AutomationConfig {
  useSession: boolean;
  flows: VFSFlow;
}

export interface ISaveAutomationRequest {
  guidelineId: string;
  automationConfig: AutomationConfig;
}

export interface ISaveAutomationResponse {
  success: boolean;
  message: string;
}

export interface AutomationStepUpdate {
  useSession: boolean;
  flows: VFSFlow;
}

export interface IUpdateAutomationStepRequest {
  guidelineId: string;
  automationStep: AutomationStepUpdate;
}

export interface IUpdateAutomationStepResponse {
  success: true;
  message: string;
}
