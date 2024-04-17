import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppEvent, EventType } from './event-listener.model';

@Injectable({
  providedIn: 'root'
})
export class EventListenerService {
  private eventSource = new Subject<AppEvent>();
  events$ = this.eventSource.asObservable();

  constructor() { }
  emitEvent(event: AppEvent) {
    this.eventSource.next(event);
  }
}
