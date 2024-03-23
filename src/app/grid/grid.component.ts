import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Application, Assets, Container, Sprite } from 'pixi.js';
import { Cross, Square } from './grid.model';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent implements AfterViewInit {
  @ViewChild('gridContainer') gridContainer!: ElementRef;
  
  fieldMaxSize: number = 1000;
  fieldData: Array<Array<-1|0|1>>;

  private app: Application;
  constructor() {
    this.app = new Application();
    const fieldDataStored = localStorage.getItem('fieldData');
    this.fieldData = fieldDataStored ? JSON.parse(fieldDataStored) : new Array(this.fieldMaxSize).fill(-1).map(() => new Array(this.fieldMaxSize).fill(-1));
  }

  handleGridClick(event: MouseEvent) {
    //console.log('Canvas clicked!', event);
  }
  handleGridMousemove(event: MouseEvent) {
    if (event.buttons === 1) {
      //console.log('Mouse is moving over the canvas', event);
    }
  }

  
  async ngAfterViewInit() {
    await this.app.init({ background: 0xA0A0A0, resizeTo: window });
    if (this.gridContainer.nativeElement && this.app.canvas) {
      this.gridContainer.nativeElement.appendChild(this.app.canvas);
    } else {
      console.error('PixiJS view or container reference not found.');
    }
    this.setListeners();
    this.drawGrid();
  }
  setListeners() {
    this.app.canvas.addEventListener('click', this.handleGridClick.bind(this));
    this.app.canvas.addEventListener('mousemove', this.handleGridMousemove.bind(this));  
  }

  async drawGrid() {
    const container = new Container();

    this.app.stage.addChild(container);

    // Load the bunny texture
    await Cross.loadTexture();

    // Create a 5x5 grid of bunnies in the container
    for (let i = 0; i < 25; i++)
    {
        const sq = new Square();

        sq.draw(0xFAFA00, i % 5, Math.floor(i / 5), 40);
        container.addChild(sq.sprite);
    }

    // Move the container to the center
    container.x = this.app.screen.width / 2;
    container.y = this.app.screen.height / 2;

    // Center the bunny sprites in local container coordinates
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;

    // Listen for animate update
    this.app.ticker.add((time) =>
    {
        // Continuously rotate the container!
        // * use delta to create frame-independent transform *
        container.rotation -= 0.01 * time.deltaTime;
    });
  }

}
