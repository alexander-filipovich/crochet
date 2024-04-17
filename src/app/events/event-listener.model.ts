export enum EventType {
  ClearField,
  ZoomChange,
  ChangeFieldSize,
}

export interface AppEvent {
  type: EventType;
  payload: any;
}