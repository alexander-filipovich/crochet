export enum EventType {
  ClearField,
  ZoomChange,
  ChangeFieldSize,
  OpenFile,
  SaveFile,
  SaveToPDF,
  GeneratePDF,
  UpdatePopupPDF,
  UpdateUI,
  Copy,
  Paste,
  Cut,
}

export interface AppEvent {
  type: EventType;
  payload: any;
}