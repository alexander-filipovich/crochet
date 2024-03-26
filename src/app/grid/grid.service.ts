import { HostListener, Injectable } from '@angular/core';
import { Application } from 'pixi.js';
import { Field, SquareState } from './grid.model';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  app: Application;
  field: Field;
  lastState: SquareState;
  
  constructor() {
    this.app = new Application; 
    this.field = new Field(this.app);
    this.lastState = SquareState.empty;
  }
  
  @HostListener('window:resize', ['$event'])
  resizeCanvas() {
    const canvas = this.app.canvas;
    this.field.updateSize(canvas.width, canvas.height)
  }
  handleGridClick(event: MouseEvent) {
    //console.log('Canvas clicked!', event);
    if (event.buttons === 1) {
      this.lastState = this.field.updateSquare({x: event.offsetX, y: event.offsetY});
    }
  }
  handleGridMousemove(event: MouseEvent) {
    if (event.buttons === 1) {
      this.field.updateSquare({x: event.offsetX, y: event.offsetY}, this.lastState);
    }
  }
  setListeners() {
    this.app.canvas.addEventListener('contextmenu', e => e.preventDefault());
    this.app.canvas.addEventListener('mousedown', this.handleGridClick.bind(this));
    this.app.canvas.addEventListener('mousemove', this.handleGridMousemove.bind(this));
  }
}
