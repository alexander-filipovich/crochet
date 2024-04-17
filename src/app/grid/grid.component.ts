import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { GridService } from './grid.service';
import { ScrollBar } from './grid.model';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent implements AfterViewInit {
  @ViewChild('gridContainer') gridContainer!: ElementRef;
  
  constructor(private gridService: GridService) { }
  
  async ngAfterViewInit() {
    await this.gridService.app.init({ background: 0xA0A0A0, resizeTo: this.gridContainer.nativeElement });
    await this.gridService.init();
    this.gridContainer.nativeElement.appendChild(this.gridService.app.canvas);
    this.gridService.setListeners();
    this.gridService.resizeCanvas();
  }

}
