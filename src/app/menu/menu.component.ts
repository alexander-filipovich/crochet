import { Component } from '@angular/core';
import { EventType } from '../events/event-listener.model';
import { EventListenerService } from '../events/event-listener.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  dimensionsForm: FormGroup;
  isDrawCrossChecked: boolean = false;

  constructor(private eventService: EventListenerService) {
    this.eventService.isDrawCrossChecked$.subscribe(value => {
      this.isDrawCrossChecked = value;
    });

    this.dimensionsForm = new FormGroup({
      width: new FormControl(50),
      height: new FormControl(30)
    });
  }

  clearField() {
    this.eventService.emitEvent({ type: EventType.ClearField, payload: null });
  }
  zoomChange(val: number) {
    this.eventService.emitEvent({ type: EventType.ZoomChange, payload: {delta: val} });
  }

  onDrawCrossChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.eventService.setDrawCrossCheckbox(isChecked);
  }

  onFieldSizeUpdate() {
    const width = this.dimensionsForm.get('width')?.value;
    const height = this.dimensionsForm.get('height')?.value;
    this.eventService.emitEvent({ type: EventType.ChangeFieldSize, payload: {width: width, height: height} });
  }
}
