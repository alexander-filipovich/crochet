import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Application, Assets, Container, Sprite } from 'pixi.js';
import { Cross, Square } from './grid.model';
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

  @HostListener('window:resize', ['$event'])
  resizeCanvas() {
    //console.log('Field size changed!', this.app.canvas.width, this.app.canvas.height);
    const canvas = this.gridServise.app.canvas;
    this.gridServise.field.updateSize(canvas.width, canvas.height)
  }
  handleGridClick(event: MouseEvent) {
    //console.log('Canvas clicked!', event);
  }
  handleGridMousemove(event: MouseEvent) {
    if (event.buttons === 1) {
      //console.log('Mouse is moving over the canvas', event);
    }
  }
  setListeners() {
    //this.app.canvas.addEventListener('click', this.handleGridClick.bind(this));
    //this.app.canvas.addEventListener('mousemove', this.handleGridMousemove.bind(this));
  }


  
  async ngAfterViewInit() {
    await this.gridServise.app.init({ background: 0xA0A0A0, resizeTo: this.gridContainer.nativeElement });
    this.gridContainer.nativeElement.appendChild(this.gridServise.app.canvas);
    this.setListeners();
    this.resizeCanvas();
  }

}
