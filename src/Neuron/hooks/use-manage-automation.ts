import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  DeleteAutomation,
  GetAutomationDetail,
  GetGuidelineDetail,
  PostFetchAutomationList,
  UpdateConfirmGuideline,
} from '../api';
import type {
  IAutomationListRequest,
  IFetchAutomationDetailResponse,
  IGuidelineAutomation,
  IGuidelineDetailResponse,
  IPagination,
  IUpdateConfirmGuidelineRequest,
  IVisaGuideline,
} from '../types';

export const useManageAutomation = () => {
  // Fetch automation list
  const [isAutoamtionListFetching, setIsAutomationListFetching] = useState<boolean>(false);
  const [automationList, setAutomationList] = useState<IGuidelineAutomation[]>([]);
  const [autoamtionListPagination, setAutomationListPagination] = useState<IPagination | null>(null);
  // const [IFormattedAutomationList, setFormattedAutomationList] = useState<IGuidelineAutomation[]>([]);

  const fetchAutomationList = (automationListPayload: IAutomationListRequest) => {
    setIsAutomationListFetching(true);
    PostFetchAutomationList(automationListPayload)
      .then((res) => {
        const data = res?.data?.list;
        const convertedData = data.map((item: IGuidelineAutomation) => ({
          ...item,
          guideline_result: {
            ...item.guideline_result,
            guideline_state:
              item?.guideline_result?.is_confirmed === null
                ? 'UNRUN'
                : item?.guideline_result?.is_confirmed
                  ? 'VERIFIED'
                  : 'IN_REVIEW',
          },
        }));
        setAutomationList(convertedData);
        setAutomationListPagination(res?.data?.pagination);
        setIsAutomationListFetching(false);
      })
      .catch(() => {
        setIsAutomationListFetching(false);
      });
  };

  const updateAutomationListRecord = (guidelineId: string, updates: Partial<IGuidelineAutomation>) => {
    setAutomationList((prev) => prev.map((item) => (item.id === guidelineId ? { ...item, ...updates } : item)));
  };

  // Fetch automation detail

  const [isAutomationDetailFetching, setIsAutomationDetailFetching] = useState<boolean>(false);
  const [automationDetail, setAutomationDetail] = useState<IFetchAutomationDetailResponse | null>(null);

  const fetchAutomationDetail = (guidelineId: string) => {
    setIsAutomationDetailFetching(true);
    GetAutomationDetail(guidelineId)
      .then((res) => {
        setAutomationDetail(res);
        setIsAutomationDetailFetching(false);
      })
      .catch(() => {
        setIsAutomationDetailFetching(false);
      });
  };

  // Delete automation
  const [isAutomationDeleting, setIsAutomationDeleting] = useState<boolean>(false);

  const deleteAutomation = (guidelineId: string, onComplete: (status: string) => void) => {
    setIsAutomationDeleting(true);
    DeleteAutomation(guidelineId)
      .then((res) => {
        setIsAutomationDeleting(false);
        toast.success(res?.message || 'Automation deleted successfully');
        onComplete('success');
      })
      .catch(() => {
        setIsAutomationDeleting(false);
        onComplete('failure');
      });
  };

  // Update Confirm Guideline
  const [isConfirmingGuideline, setIsConfirmingGuideline] = useState<boolean>(false);

  const confirmGuideline = (
    updateConfirmGuidelinePayload: IUpdateConfirmGuidelineRequest,
    onComplete: (status: string) => void
  ) => {
    setIsConfirmingGuideline(true);
    UpdateConfirmGuideline(updateConfirmGuidelinePayload)
      .then((res) => {
        setIsConfirmingGuideline(false);
        toast.success(res?.message || 'Automation confirmed successfully');
        onComplete('success');
      })
      .catch(() => {
        setIsConfirmingGuideline(false);
        onComplete('failure');
      });
  };

  // Get Guideline Detail
  const [isGuidelineDetailFetching, setIsGuidelineDetailFetching] = useState<boolean>(false);
  const [guidelineDetail, setGuidelineDetail] = useState<IVisaGuideline | null>(null);
  const [guidelineDetailFull, setGuidelineDetailFull] = useState<IGuidelineDetailResponse['data'] | null>(null);

  const fetchGuidelineDetail = (guidelineId: string) => {
    setIsGuidelineDetailFetching(true);
    GetGuidelineDetail(guidelineId)
      .then((res) => {
        setGuidelineDetail(res?.data?.existing_guideline);
        setGuidelineDetailFull(res?.data);
        setIsGuidelineDetailFetching(false);
      })
      .catch(() => {
        setIsGuidelineDetailFetching(false);
      });
  };

  return {
    // Automation list
    isAutoamtionListFetching,
    automationList,
    autoamtionListPagination,
    fetchAutomationList,
    updateAutomationListRecord,

    // Automation detail
    isAutomationDetailFetching,
    automationDetail,
    fetchAutomationDetail,

    // Automation delete
    isAutomationDeleting,
    deleteAutomation,

    // Confirm guideline
    isConfirmingGuideline,
    confirmGuideline,

    // Guideline detail
    isGuidelineDetailFetching,
    guidelineDetail,
    guidelineDetailFull,
    fetchGuidelineDetail,
  };
};
