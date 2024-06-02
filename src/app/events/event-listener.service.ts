import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, ReplaySubject  } from 'rxjs';
import { AppEvent } from './event-listener.model';

@Injectable({
  providedIn: 'root'
})
export class EventListenerService {
  private eventSource = new ReplaySubject<AppEvent>(10);
  events$ = this.eventSource.asObservable();

  private drawCrossCheckbox = new BehaviorSubject<boolean>(false);
  isDrawCrossChecked$ = this.drawCrossCheckbox.asObservable();

  private changeFirstRow = new BehaviorSubject<number>(0);
  isRowChanged$ = this.changeFirstRow.asObservable();

  constructor() { }
  emitEvent(event: AppEvent) {
    this.eventSource.next(event);
  }
  
  setDrawCrossCheckbox(isChecked: boolean) {
    this.drawCrossCheckbox.next(isChecked);
  }

  setRowNumber(rowNumber: number) {
    this.changeFirstRow.next(rowNumber);
  }
}
