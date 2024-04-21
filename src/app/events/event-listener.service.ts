import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject  } from 'rxjs';
import { AppEvent, EventType } from './event-listener.model';

@Injectable({
  providedIn: 'root'
})
export class EventListenerService {
  private eventSource = new Subject<AppEvent>();
  events$ = this.eventSource.asObservable();

  private drawCrossCheckbox = new BehaviorSubject<boolean>(false);
  isDrawCrossChecked$ = this.drawCrossCheckbox.asObservable();

  constructor() { }
  emitEvent(event: AppEvent) {
    this.eventSource.next(event);
  }
  
  setDrawCrossCheckbox(isChecked: boolean) {
    this.drawCrossCheckbox.next(isChecked);
  }
}
