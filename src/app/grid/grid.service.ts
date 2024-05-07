import { config } from '../../config';
import { Injectable } from '@angular/core';
import { Application } from 'pixi.js';
import { Cross, Field, FieldSelection, Point, ScrollBar, Square, SquareState } from './grid.model';
import { EventType } from '../events/event-listener.model';
import { EventListenerService } from '../events/event-listener.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GridService {  
  app: Application;
  field: Field;
  scrollbars = {
      h: new ScrollBar('h'),
      v: new ScrollBar('v'),
  };
  lastClickedSquare: any;
  
  constructor(private eventService: EventListenerService) {
    this.app = new Application; 
    this.field = new Field(this.app, this.eventService);
    this.lastClickedSquare = this.field.getSquareData({x: 0, y: 0});
  }
  async init() {
    await Square.loadTextures();
    await Cross.loadTextures();
    await ScrollBar.loadTexture(); 
    this.field.init()
    Object.entries(this.scrollbars).forEach(([key, scrollbar]) => {
        scrollbar.init();
        this.app.stage.addChild(scrollbar.bg);
        this.app.stage.addChild(scrollbar.sprite);
        scrollbar.moveToPercent(this.field.getOffsetPercent(), this.app.canvas);
    });
  }

  resizeCanvas() {
    const canvas = this.app.canvas;
    this.field.updateSize({X: canvas.width, Y: canvas.height})
  }
  handleGridClick(event: MouseEvent) {
    const pos = {x: event.offsetX, y: event.offsetY};
    this.lastClickedSquare = this.field.getSquareData(pos);   
    
    if (ScrollBar.dragTarget)
      return
    if (this.lastClickedSquare.state == undefined)
      return
    
    if (event.buttons === 1) {
      this.field.squareClick(pos);
    }
    if (event.buttons === 2) {
      this.field.updateSelection(pos, undefined);
    }
    this.lastClickedSquare = this.field.getSquareData(pos);
  }
  handleGridMousemove(event: MouseEvent) {
    const pos = {x: event.offsetX, y: event.offsetY};
    if (ScrollBar.dragTarget && event.buttons === 1) {
      ScrollBar.dragTarget.moveTo(pos, this.app.canvas);
      this.field.moveToPercent({
        x: this.scrollbars.h.getPercent(this.app.canvas),
        y: this.scrollbars.v.getPercent(this.app.canvas),
      });
    }
    else if (event.buttons === 1) {
      this.field.squareClick(pos, this.lastClickedSquare.state ?? SquareState.filled);
    }
    if (event.buttons === 2) {
      this.field.updateSelection(undefined, pos);
    }
    else if (event.buttons === 4) {
      this.field.moveToPoint(pos, this.lastClickedSquare.position);
      Object.entries(this.scrollbars).forEach(([key, scrollbar]) => {
          scrollbar.moveToPercent(this.field.getOffsetPercent(), this.app.canvas)
      });
    }
  }
  handleGridWheel(event: WheelEvent) {
    const pos = {x: event.offsetX, y: event.offsetY};
    this.field.changeSquareSize(-Math.sign(event.deltaY), pos);
  }
  handleGridKeyboard(event: KeyboardEvent) {
    //console.log(event.key);
    if (event.ctrlKey && event.shiftKey && event.key === 'Escape') {
      this.field.clear();
    }
    if (event.key === '-'){
      this.field.changeSquareSize(-5, {x: 0, y: 0});
    }
    if (event.key === '='){
      this.field.changeSquareSize(5, {x: 0, y: 0});
    }
    if (event.ctrlKey && event.key === 'c') {
      this.field.copySelected();
    }
    if (event.ctrlKey && event.key === 'v') {
      this.field.pasteSelected();
    }
    if (event.ctrlKey && event.key === 'x') {
      this.field.cutSelected();
    }
    if (event.key === 'Delete'){
      this.field.clearSelected();
    }
    if (event.key === 'Escape'){
      this.field.clearSelection();
    }
  }


  setListeners() {
    this.app.canvas.addEventListener('contextmenu', e => e.preventDefault());
    this.app.canvas.addEventListener('pointerdown', this.handleGridClick.bind(this));
    this.app.canvas.addEventListener('pointermove', this.handleGridMousemove.bind(this));
    this.app.canvas.addEventListener('wheel', this.handleGridWheel.bind(this), {'passive': true}); 
    window.addEventListener('keydown', this.handleGridKeyboard.bind(this));
    window.addEventListener('resize', this.resizeCanvas.bind(this));

    this.eventService.events$.subscribe(event => {
      switch (event.type) {
        case EventType.ClearField:
          this.field.clear();
          break;
        case EventType.ZoomChange:
          const pos = {x: 0, y: 0};
          this.field.changeSquareSize(event.payload.delta, pos);
          break;
        case EventType.ChangeFieldSize:
          this.field.changeFieldSize({X: event.payload.width, Y: event.payload.height});
          break;
        case EventType.OpenFile:
          this.field.loadFile(event.payload.file);
          break;
        case EventType.SaveFile:
          this.field.saveFile(event.payload.fileName);
          break;
        case EventType.Copy:
          this.field.copySelected();
          break;
        case EventType.Paste:
          this.field.pasteSelected();
          break;
        case EventType.Cut:
          this.field.cutSelected();
          break;
      }
    });
    
    this.eventService.isDrawCrossChecked$.subscribe(checked => {
      this.field.drawCrosses = checked;
      this.field.updateGrid();
    });

    this.eventService.isRowChanged$.subscribe(row => {
      Field.startRow = row;
      this.field.clearGrid();
      this.field.updateGrid();
    });

    
    setInterval(() => {
      this.resizeCanvas();
    }, config.timeouts.autoUpdate);

    setInterval(() => {
      localStorage.setItem('fieldData', JSON.stringify(this.field.fieldData));
      localStorage.setItem('fieldSize', JSON.stringify(this.field.fieldSize));
    }, config.timeouts.autoSave);

  }
}
