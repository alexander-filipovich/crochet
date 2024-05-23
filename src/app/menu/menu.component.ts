import { Component } from '@angular/core';
import { EventType } from '../events/event-listener.model';
import { EventListenerService } from '../events/event-listener.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [ ReactiveFormsModule, FormsModule ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  dimensionsForm: FormGroup;
  isDrawCrossChecked: boolean = false;
  startRow: boolean = true;
  projectName: string = '';

  constructor(private eventService: EventListenerService) {
    this.dimensionsForm = new FormGroup({
      width: new FormControl(50),
      height: new FormControl(30)
    });
    const projectNameStored = localStorage.getItem('projectName');
    this.projectName = projectNameStored ?? this.projectName;
    this.setListeners();
  }

  openFile(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files) return;
    const file = target.files[0];
    this.eventService.emitEvent({ type: EventType.OpenFile, payload: {file: file} });
    target.value = '';
  }
  openFileChooser() {
    const fileInput = document.getElementById('input-file') as HTMLInputElement;
    fileInput.click();
  }

  copySelected() {
    this.eventService.emitEvent({ type: EventType.Copy, payload: null });
  }  
  pasteSelected() {
    this.eventService.emitEvent({ type: EventType.Paste, payload: null });
  }  
  cutSelected() {
    this.eventService.emitEvent({ type: EventType.Cut, payload: null });
  }


  downloadData() {
    const name = this.projectName ? this.projectName : 'data';
    this.eventService.emitEvent({ type: EventType.SaveFile, payload: {fileName: `${name}.json`} });
  }
  saveToPDF() {
    const name = this.projectName ? this.projectName : 'data';
    this.eventService.emitEvent({ type: EventType.SaveToPDF, payload: {fileName: `${name}.pdf`} });
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

  onFirstRowChanged(event: Event) {
    const rowNumber = (event.target as HTMLInputElement).checked ? 0 : 1;
    this.eventService.setRowNumber(rowNumber);
  }

  onFieldSizeUpdate() {
    const width = this.dimensionsForm.get('width')?.value;
    const height = this.dimensionsForm.get('height')?.value;
    this.eventService.emitEvent({ type: EventType.ChangeFieldSize, payload: {width: width, height: height} });
  }

  setListeners() {
    this.eventService.isDrawCrossChecked$.subscribe(value => {
      this.isDrawCrossChecked = value;
    });

    this.eventService.isRowChanged$.subscribe(value => {
      this.startRow = (value == 0);
    });
    
    this.eventService.events$.subscribe(event => {
      switch (event.type) {
        case EventType.UpdateUI:
          this.dimensionsForm.setValue({
            width: event.payload.fieldSize.X,
            height: event.payload.fieldSize.Y,
          });
          if (event.payload.projectName)
            this.projectName = event.payload.projectName;
          break;
      }
    });
    setInterval(() => {
      localStorage.setItem('projectName', this.projectName);
    }, 1000);
  }
}
