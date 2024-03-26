
import { Application, Assets, Graphics, Sprite, Texture } from 'pixi.js';

interface Point {
    x: number;
    y: number;
}

export enum SquareState {
    empty,
    filled,
    __LENGTH
}

export class Square {
    static readonly colors = {
        empty: 0xF0F0F0,
        filled: 0xFFFF00,
    };
    sprite: Graphics;
    size: number;
    position: Point;
    state: SquareState;
    cleared: boolean = true;

    constructor(x?: number, y?: number) {
        this.sprite = new Graphics();
        this.size = 0;
        this.position = { x: 0, y: 0 };
        this.state = SquareState.empty;
        this.sprite.visible = false;
    }
    setSize(size: number) {
        this.size = size;
    }
    setPosition(x: number, y: number) {
        this.position = { x: x, y: y };
    }
    draw() {
        let color;
        if (this.state == SquareState.filled) 
            color = Square.colors.filled;
        else 
            color = Square.colors.empty;

        if (!this.cleared)
            this.sprite.clear();

        this.sprite.rect(this.position.x * this.size+1, this.position.y * this.size+1, this.size-2, this.size-2);
        this.sprite.fill(color);
        this.sprite.visible = true;
        this.cleared = false;
    }
    clear() {
        this.sprite.clear();
        this.sprite.visible = false;
        this.cleared = true;
    }
}


export class Cross {
    static texture: Texture;
    sprite: Sprite;
    cleared: boolean = true;

    constructor() {
        if (!Cross.texture) {
            throw new Error("Texture not loaded");
        }
        this.sprite = new Sprite(Cross.texture);
        this.sprite.visible = false;
    }
    static async loadTexture(texture = 'assets/images/cross.png') {
        Cross.texture = await Assets.load(texture);
    }
}


interface GridSize {
    X: number;
    Y: number;
}
export class Field {
    app: Application;

    fieldSize: GridSize = { X: 20, Y: 10 };

    squareSize: number = 40;
    gridSize: GridSize = { X: 0, Y: 0 };
    offset: Point = { x: 0, y: 0 };

    fieldData: Array<Array<number>>;
    squares: Array<Array<Square>>;
    
    constructor(app: Application) {
        this.app = app;

        const fieldDataStored = null; // localStorage.getItem('fieldData');
        this.fieldData = fieldDataStored ? 
            JSON.parse(fieldDataStored) : 
            Array.from({ length: this.fieldSize.X }, () => Array.from({ length: this.fieldSize.Y }, () => SquareState.empty));
        this.squares = Array.from({ length: 0 }, () => Array.from({ length: 0 }, () => new Square()));
    }

    getScaledPosition(position: Point) {
        return {
            x: Math.floor(position.x/this.squareSize), 
            y: Math.floor(position.y/this.squareSize)
        };
    }

    updateSize(canvasWidth: number, canvasHeight: number) {
        const newSize: GridSize = {
            X: Math.floor(canvasWidth/this.squareSize)+1, 
            Y: Math.floor(canvasHeight/this.squareSize)+1
        };
        if (this.gridSize.X == newSize.X && this.gridSize.Y == newSize.Y)
            return
        
        for (let x = 0; x < Math.max(this.gridSize.X, newSize.X); x++) {
            if (this.squares.length <= x) 
                this.squares.push(Array.from({ length: 0 }, () => new Square()));
            for (let y = 0; y < Math.max(this.gridSize.Y, newSize.Y); y++) {
                if (this.squares[x].length <= y) {
                    const sq = new Square();
                    sq.setPosition(x, y);
                    sq.setSize(this.squareSize);
                    sq.draw();
                    this.squares[x].push(sq);
                    this.app.stage.addChild(sq.sprite);
                }
                if ((x > newSize.X || y > newSize.Y) || (x+this.offset.x >= this.fieldSize.X || y+this.offset.y >= this.fieldSize.Y)) {
                    this.squares[x][y].clear();
                }
                else {
                    this.squares[x][y].draw();
                }
            }
        }
        this.gridSize = newSize;
    }
    updateSquare(position: Point, state?: SquareState) {
        const p: Point = this.getScaledPosition(position);        
        const newState = typeof state != 'undefined' ? state : (this.fieldData[p.x][p.y] + 1) % SquareState.__LENGTH;
        this.fieldData[p.x][p.y] = newState;
        this.squares[p.x][p.y].state = newState;
        this.squares[p.x][p.y].draw();
        return newState;
    }
}