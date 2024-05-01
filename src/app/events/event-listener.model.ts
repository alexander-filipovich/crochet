export enum EventType {
  ClearField,
  ZoomChange,
  ChangeFieldSize,
  OpenFile,
  SaveFile,
  UpdateUI,
}

export interface AppEvent {
  type: EventType;
  payload: any;
}