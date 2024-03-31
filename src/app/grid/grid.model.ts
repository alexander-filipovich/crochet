
import { Application, Assets, Graphics, Sprite, Texture } from 'pixi.js';

export enum zIndexes {
    background,
    square, 
    cross,
    scrollbar
}

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
    static textures = {
        empty: new Texture(),
        filled: new Texture(),
    };
    sprite: Sprite;
    size: number = 0;
    position: Point = { x: 0, y: 0 };
    state: SquareState = SquareState.empty;
    cleared: boolean = true;

    constructor(x?: number, y?: number) {
        this.sprite = new Sprite();
        this.sprite.anchor.set(0.5)
        this.sprite.zIndex = zIndexes.square;
        this.sprite.visible = false;
    }
    static async loadTextures() {
        Square.textures.filled = await Assets.load('assets/images/square/square-filled.png');
        Square.textures.empty = await Assets.load('assets/images/square/square-empty.png');
        console.log("Square textures loaded");
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
        if (this.state == SquareState.filled) 
            this.sprite.texture = Square.textures.filled;
        else 
            this.sprite.texture = Square.textures.empty;
        this.sprite.setSize(this.size-2, this.size-2); // change later with texture
        this.sprite.position.set(this.position.x*this.size+this.size/2, this.position.y*this.size+this.size/2);
        this.sprite.visible = true;
        this.cleared = false;
    }
    clear() {
        if (this.cleared)
            return
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

export class ScrollBar {
    static dragTarget?: ScrollBar;
    static texture: Texture;
    sprite: Sprite;
    size: Point = { x: 40, y: 40};
    position: Point = { x: 20, y: 20 };
    type: 'h' | 'v';

    constructor() {
        this.sprite = new Sprite();
        this.sprite.eventMode = 'static';
        this.sprite.zIndex = zIndexes.scrollbar;
        this.type = 'h';
    }
    static async loadTexture(texture = 'assets/images/scrollbar.png') {
        ScrollBar.texture = await Assets.load(texture);
    }
    init() {
        this.sprite.texture = ScrollBar.texture;
        this.sprite.setSize(this.size.x, this.size.y)
        this.moveTo({x: 20, y: 20}, true);
        this.sprite.anchor.set(0.5);
        this.sprite.on('pointerdown', this.onDragStart.bind(this));
        this.sprite.on('pointerup', this.onDragEnd.bind(this));
        this.sprite.on('pointerupoutside', this.onDragEnd.bind(this));
    }
    onDragStart() {
        ScrollBar.dragTarget = this;
    }
    onDragEnd() {
        ScrollBar.dragTarget = undefined;
    }
    moveTo(pos: Point, force: boolean = false) {
        if (this.type == 'h' || force)
            this.sprite.x = pos.x;
        if (this.type == 'v' || force)
            this.sprite.y = pos.y;
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
    offset: Point = { x: -1, y: -1 };

    fieldData: Array<Array<number>>;
    squares: Array<Array<Square>>;
    crosses: Array<Array<Cross>>;
    scrollbars: Array<ScrollBar>;
    
    constructor(app: Application) {
        this.app = app;

        const fieldDataStored = null; // localStorage.getItem('fieldData');
        this.fieldData = fieldDataStored ? 
            JSON.parse(fieldDataStored) : 
            Array.from({ length: this.fieldSize.X }, () => Array.from({ length: this.fieldSize.Y }, () => SquareState.empty));
        this.squares = Array.from({ length: 0 }, () => Array.from({ length: 0 }, () => new Square()));
        this.crosses = Array.from({ length: 0 }, () => Array.from({ length: 0 }, () => new Cross()));
        this.scrollbars = Array.from({ length: 2 }, () => new ScrollBar());
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
    clear() {
        this.fieldData = Array.from({ length: this.fieldSize.X }, () => Array.from({ length: this.fieldSize.Y }, () => SquareState.empty));
        this.updateGrid();
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