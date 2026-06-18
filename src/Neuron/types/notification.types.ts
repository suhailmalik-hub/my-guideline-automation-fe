export interface INotification {
  id: string;
  readable_id: string;
  automation_id: string;
  notification_type: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string | null;
}

export interface INotificationResponse {
  success: boolean;
  message: string;
  data: INotification[];
}

export interface INotificationReadRequest {
  id: string;
}

export interface INotificationReadResponse {
  success: boolean;
  message: string;
  data: INotification;
}
