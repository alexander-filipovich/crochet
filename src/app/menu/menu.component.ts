import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventType } from '../events/event-listener.model';
import { EventListenerService } from '../events/event-listener.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  constructor(private eventService: EventListenerService) {}

  clearField() {
    this.eventService.emitEvent({ type: EventType.ClearField, payload: null });
  }
  zoomChange(val: number) {
    this.eventService.emitEvent({ type: EventType.ZoomChange, payload: {delta: val} });
  }

}
