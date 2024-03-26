import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { GridService } from './grid.service';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent implements AfterViewInit {
  @ViewChild('gridContainer') gridContainer!: ElementRef;
  
  gridServise: GridService;
  constructor() {
    this.gridServise = new GridService();
  }
  
  async ngAfterViewInit() {
    await this.gridServise.app.init({ background: 0xA0A0A0, resizeTo: this.gridContainer.nativeElement });
    this.gridContainer.nativeElement.appendChild(this.gridServise.app.canvas);
    this.gridServise.setListeners();
    this.gridServise.resizeCanvas();
  }

}
