import { HostListener, Injectable } from '@angular/core';
import { Application } from 'pixi.js';
import { Field, Point, ScrollBar, Square, SquareState } from './grid.model';
import { NONE_TYPE } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  app: Application;
  field: Field;
  lastClickedSquare: any;
  sb: ScrollBar;
  
  constructor() {
    this.app = new Application; 
    this.field = new Field(this.app);
    this.lastClickedSquare;

    this.sb = new ScrollBar();
    this.app.stage.addChild(this.sb.sprite);
  }
  async init() {
    await Square.loadTextures();
    await ScrollBar.loadTexture(); 
    this.sb.init()
  }

  resizeCanvas() {
    const canvas = this.app.canvas;
    this.field.updateSize(canvas.width, canvas.height)
  }
  handleGridClick(event: MouseEvent) {
    //console.log('Canvas clicked!', event);
    const pos = {x: event.offsetX, y: event.offsetY};
    this.lastClickedSquare = this.field.getSquareData(pos);   
    
    if (ScrollBar.dragTarget)
      return
    if (this.lastClickedSquare.state == undefined)
      return
    
    if (event.buttons === 1) {
      this.field.squareClick(pos);
    }
    this.lastClickedSquare = this.field.getSquareData(pos);
  }
  handleGridMousemove(event: MouseEvent) {
    const pos = {x: event.offsetX, y: event.offsetY};
    if (ScrollBar.dragTarget && event.buttons === 1) {
      ScrollBar.dragTarget.moveTo(pos);
    }
    else if (event.buttons === 1) {
      this.field.squareClick(pos, this.lastClickedSquare.state ?? SquareState.filled);
    }
    else if (event.buttons === 4) {
      this.field.moveToPoint(pos, this.lastClickedSquare.position);
    }
  }
  handleGridKeyboard(event: KeyboardEvent) {
    if (event.ctrlKey && event.shiftKey && event.key === 'Escape') {
      this.field.clear();
    }
  }


  setListeners() {
    this.app.canvas.addEventListener('contextmenu', e => e.preventDefault());
    this.app.canvas.addEventListener('mousedown', this.handleGridClick.bind(this));
    this.app.canvas.addEventListener('mousemove', this.handleGridMousemove.bind(this));
    window.addEventListener('keydown', this.handleGridKeyboard.bind(this));
    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }
}
