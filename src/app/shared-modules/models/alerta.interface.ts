export interface objAlert {
  type?: string;
  message: string;
  visible: boolean;
  typeMsg?: string;
}

export interface AlertInfo {
  type: string
  typeMsg?: string
  message: string
  visible: boolean
}

export class AlertInfo {
  type: string
  typeMsg?: string
  message: string
  visible: boolean
}
