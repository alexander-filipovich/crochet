export enum EventType {
  ClearField,
  ZoomChange,
  ChangeFieldSize,
  OpenFile,
  SaveFile,
}

export interface AppEvent {
  type: EventType;
  payload: any;
}