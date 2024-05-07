export enum EventType {
  ClearField,
  ZoomChange,
  ChangeFieldSize,
  OpenFile,
  SaveFile,
  UpdateUI,
  Copy,
  Paste,
  Cut,
}

export interface AppEvent {
  type: EventType;
  payload: any;
}