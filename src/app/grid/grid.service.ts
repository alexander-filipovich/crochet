import { Injectable } from '@angular/core';
import { Application } from 'pixi.js';
import { Field, Square } from './grid.model';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  app: Application;
  field: Field;
  
  constructor() {
    this.app = new Application; 
    this.field = new Field(this.app);
  }
}
