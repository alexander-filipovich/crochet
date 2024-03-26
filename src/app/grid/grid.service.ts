import { HostListener, Injectable } from '@angular/core';
import { Application } from 'pixi.js';
import { Field, Point, SquareState } from './grid.model';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  app: Application;
  field: Field;
  lastClickedSquare: any;
  
  constructor() {
    this.app = new Application; 
    this.field = new Field(this.app);
    this.lastClickedSquare;
  }
  
  @HostListener('window:resize', ['$event'])
  resizeCanvas() {
    const canvas = this.app.canvas;
    this.field.updateSize(canvas.width, canvas.height)
  }
  handleGridClick(event: MouseEvent) {
    //console.log('Canvas clicked!', event);
    const pos = {x: event.offsetX, y: event.offsetY};
    this.lastClickedSquare = this.field.getSquareData(pos);   
    
    if (this.lastClickedSquare.state == undefined)
      return
    
    if (event.buttons === 1) {
      this.field.squareClick(pos);
    }
    this.lastClickedSquare = this.field.getSquareData(pos);
  }
  handleGridMousemove(event: MouseEvent) {
    const pos = {x: event.offsetX, y: event.offsetY};
    if (event.buttons === 1) {
      this.field.squareClick(pos, this.lastClickedSquare.state ?? SquareState.filled);
    }
    if (event.buttons === 4) {
      this.field.moveToPoint(pos, this.lastClickedSquare.position);
    }
  }
  handleGridKeyboard(event: KeyboardEvent) {
    if (event.ctrlKey && event.shiftKey && event.key === 'Escape') {
      console.log("Field cleared");
    }
  }


  setListeners() {
    this.app.canvas.addEventListener('contextmenu', e => e.preventDefault());
    this.app.canvas.addEventListener('mousedown', this.handleGridClick.bind(this));
    this.app.canvas.addEventListener('mousemove', this.handleGridMousemove.bind(this));
    window.addEventListener('keydown', this.handleGridKeyboard.bind(this));
  }
}
