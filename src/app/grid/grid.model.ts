
import { Application, Assets, Graphics, Sprite, Texture } from 'pixi.js';

export interface Point {
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
    setState(state: SquareState) {
        if (this.state != state || this.cleared) {
            this.state = state;
            this.draw()
        }
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
        if (this.cleared)
            return
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

    getScaledGridPosition(canvasPosition: Point) {
        return {
            x: Math.floor(canvasPosition.x/this.squareSize), 
            y: Math.floor(canvasPosition.y/this.squareSize)
        };
    }
    getScaledFieldPosition(canvasPosition: Point) {
        const position: Point = this.getScaledGridPosition(canvasPosition);
        return {
            x: position.x+this.offset.x, 
            y: position.y+this.offset.y
        };
    }
    getSquareState(position: Point) {
        return this.fieldData[position.x]?.[position.y] ?? null
    }
    getSquareData(canvasPosition: Point) {
        const position: Point = this.getScaledFieldPosition(canvasPosition);
        return {
            position: position,
            state: this.getSquareState(position)
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
                    this.squares[x].push(sq);
                    this.app.stage.addChild(sq.sprite);
                }
                if (x > newSize.X || y > newSize.Y){
                    this.squares[x][y].clear();
                }
            }
        }
        this.gridSize = newSize;
        this.updateGrid();
    }
    updateGrid() {
        for (let x = 0; x < this.gridSize.X; x++) {
            for (let y = 0; y < this.gridSize.Y; y++) {
                const pos = {
                    x: x+this.offset.x,
                    y: y+this.offset.y
                }     
                const state = this.getSquareState(pos);      
                if (state == undefined) {
                    this.squares[x][y].clear();
                }
                else {
                    this.squares[x][y].setState(state);
                }
            }
        }
    }
    updateSquare(position: Point, state?: SquareState) {
        if (this.getSquareState(position) == undefined)
            return
        const newState = (state != undefined) ? state : (this.fieldData[position.x][position.y] + 1) % SquareState.__LENGTH;
        this.fieldData[position.x][position.y] = newState;
        const sq = this.squares[position.x-this.offset.x][position.y-this.offset.y]
        sq.setState(newState);
    }
    squareClick(canvasPosition: Point, state?: SquareState) {
        this.updateSquare(this.getScaledFieldPosition(canvasPosition), state);
    }

    moveToPoint(canvasPosition: Point, squarePosition: Point) {
        const position: Point = this.getScaledGridPosition(canvasPosition);        
        this.offset = { 
            x: squarePosition.x-position.x, 
            y: squarePosition.y-position.y 
        };
        this.updateGrid();
    }
}