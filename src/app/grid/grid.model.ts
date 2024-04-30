import { config } from '../../config';
import { Application, Assets, Graphics, Sprite, Texture } from 'pixi.js';

export enum zIndexes {
    background,
    square, 
    cross,
    scrollbarBG,
    scrollbar
}

export interface Point {
    x: number;
    y: number;
}
export interface GridSize {
    X: number;
    Y: number;
}
export enum SquareState {
    empty,
    filled,
    __LENGTH
}

function getBetween(val: number, min: number, max: number) {
    max = Math.max(min, max);
    if (val < min)
        return min;
    if (val > max)
        return max;
    return val
}

export class Cross {
    static textures = {
        backgroundCross: new Texture(),
        primaryCross: new Texture(),
    } ;
    sprite: Sprite;
    cleared: boolean = true;

    constructor() {
        if (!Cross.textures) {
            throw new Error("Texture not loaded");
        }
        this.sprite = new Sprite(Cross.textures.backgroundCross);
        this.sprite.anchor.set(0.5)
        this.sprite.zIndex = zIndexes.cross;
        this.sprite.visible = false;
    }
    static async loadTextures() {
        Cross.textures.primaryCross = await Assets.load('assets/images/cross/CrossMainColor.svg');
        Cross.textures.backgroundCross = await Assets.load('assets/images/cross/CrossBGColor.svg');
    }
}

export class Square {
    static textures = {
        empty: new Texture(),
        filled: new Texture(),
        primaryRow: new Texture(),
    };
    static size: number = 40;
    static offset: Point = { x: 0.3, y: 0.3 };
    sprite: Sprite;
    position: Point = { x: 0, y: 0 };
    state: SquareState = SquareState.empty;
    cleared: boolean = true;

    static crossScale: number = 0.5;
    cross: Cross = new Cross();
    crossState: boolean = false;
    realPosition: Point = { x: 0, y: 0 };

    constructor() {
        this.sprite = new Sprite();
        this.sprite.anchor.set(0.5)
        this.sprite.zIndex = zIndexes.square;
        this.sprite.visible = false;
    }
    static async loadTextures() {
        Square.textures.filled = await Assets.load('assets/images/square/FilledSquare.svg');
        Square.textures.empty = await Assets.load('assets/images/square/EmptySquare.svg');
        Square.textures.primaryRow = await Assets.load('assets/images/square/PrimaryColorSquare.svg');
    }
    static setSize(size: number) {
        Square.size = size;
    }
    setPosition(x: number, y: number) {
        this.position = { x: x, y: y };
    }
    setState(state: SquareState, crossState: boolean = false) {
        if (this.state != state || this.cleared) {
            this.state = state;
            this.draw()
        }
        if (this.crossState != crossState || this.cleared) {
            this.crossState = crossState;
            this.drawCross()
        }
    }

    setStateAndPosition(state: SquareState, crossState: boolean = false, realPosition: Point) {
        if (this.realPosition != realPosition || this.state != state || this.cleared) {
            this.state = state;
            this.realPosition = realPosition;
            this.draw()
        }
        if (this.crossState != crossState || this.cleared) {
            this.crossState = crossState;
            this.drawCross()
        }
    }

    draw() {
        if (this.state == SquareState.filled) 
            this.sprite.texture = Square.textures.filled;
        else if((this.realPosition.y+Field.startRow) % 2 == 0)
            this.sprite.texture = Square.textures.empty;
        else
            this.sprite.texture = Square.textures.primaryRow;

        this.sprite.setSize(Square.size, Square.size);
        this.sprite.position.set(this.position.x*Square.size+Square.size*Square.offset.x, this.position.y*Square.size+Square.size*Square.offset.y);
        this.sprite.visible = true;
        this.cleared = false;
    }
    drawCross() {
        if (this.crossState) {
            if(this.state == SquareState.filled)
                this.cross.sprite.texture = Cross.textures.primaryCross;
            else
                this.cross.sprite.texture = Cross.textures.backgroundCross;

            this.cross.sprite.setSize(Square.size*Square.crossScale, Square.size*Square.crossScale);
            this.cross.sprite.position.set(this.sprite.position.x, this.sprite.position.y);
            this.cross.sprite.visible = true;
        }
        else {
            this.cross.sprite.visible = false;
        }
    }
    clear() {
        if (this.cleared)
            return
        this.sprite.visible = false;
        this.cross.sprite.visible = false;
        this.cleared = true;
    }
}

export class ScrollBar {
    static dragTarget?: ScrollBar;
    static texture: Texture;
    static textureBG: Texture;
    sprite: Sprite;
    bg: Sprite;
    size: Point = { x: 40, y: 40 };
    offset: Point = { x: 40, y: 40 };
    type: 'h' | 'v';

    constructor(type: 'h' | 'v') {
        this.bg = new Sprite();
        this.bg.zIndex = zIndexes.scrollbarBG;

        this.sprite = new Sprite();
        this.sprite.eventMode = 'static';
        this.sprite.zIndex = zIndexes.scrollbar;
        this.type = type;
    }
    static async loadTexture() {
        ScrollBar.texture = await Assets.load('assets/images/ScrollBar.png');
        ScrollBar.textureBG = await Assets.load('assets/images/ScrollBG.svg');
    }
    init() {
        this.bg.texture = ScrollBar.textureBG;
        this.bg.width = 10000; // Just a big number cause I don't want to resize it, will fix it later

        this.sprite.texture = ScrollBar.texture;
        //this.sprite.setSize(this.size.x, this.size.y);
        this.sprite.position.set(this.sprite.height/2, this.sprite.height/2);
        this.sprite.anchor.set(0.5);
        if (this.type == 'v') {
            this.bg.anchor.set(0, 1);
            this.bg.rotation = Math.PI/2;
            this.sprite.rotation = Math.PI/2;
        }
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
    moveTo(pos: Point, canvas: HTMLCanvasElement) {
        if (this.type == 'h')
            this.sprite.x = getBetween(pos.x, this.sprite.width/2, canvas.width - this.sprite.width/2);
        if (this.type == 'v')
            this.sprite.y = getBetween(pos.y, this.sprite.width/2, canvas.height - this.sprite.width/2); 
    }
    moveToPercent(percent: Point, canvas: HTMLCanvasElement) {
        if (this.type == 'h')
            this.sprite.x = this.sprite.width/2 + getBetween(percent.x, 0, 1)*(canvas.width  - this.sprite.width);
        if (this.type == 'v')
            this.sprite.y = this.sprite.width/2 + getBetween(percent.y, 0, 1)*(canvas.height - this.sprite.width);
    }
    getPercent(canvas: HTMLCanvasElement) {
        if (this.type == 'h')
            return (this.sprite.x - this.sprite.width/2)/(canvas.width - this.sprite.width)
        if (this.type == 'v')
            return (this.sprite.y - this.sprite.width/2)/(canvas.height - this.sprite.width)
        return 0
    }
}

export class Field {
    app: Application;

    fieldSize: GridSize = { X: 50, Y: 30 };

    canvasSize: GridSize = { X: 0, Y: 0 };
    gridSize: GridSize = { X: 0, Y: 0 };
    offset: Point = { x: -2, y: -2 };

    fieldData: Array<Array<number>>;
    squares: Array<Array<Square>>;
    drawCrosses: boolean = false;
    static startRow: number = 1;
    static colorCheck: boolean = false;
    
    constructor(app: Application) {
        this.app = app;
        const fieldSizeStored = localStorage.getItem('fieldSize');
        this.fieldSize = fieldSizeStored ? JSON.parse(fieldSizeStored) : this.fieldSize;
        const fieldDataStored = localStorage.getItem('fieldData');
        this.fieldData = fieldDataStored ? 
            JSON.parse(fieldDataStored) : 
            Array.from({ length: this.fieldSize.X }, () => Array.from({ length: this.fieldSize.Y }, () => SquareState.empty));
        this.squares = Array.from({ length: 0 }, () => Array.from({ length: 0 }, () => new Square()));
    }
    init() {}

    changeFieldSize(size: GridSize) {
        const fieldData = Array.from({ length: size.X }, () => Array.from({ length: size.Y }, () => SquareState.empty));
        for (let x = 0; x < Math.min(size.X, this.fieldSize.X); x++) {
            for (let y = 0; y < Math.min(size.Y, this.fieldSize.Y); y++) {
                fieldData[x][y] = this.fieldData[x][y];
            }
        }
        this.fieldSize = size;
        this.fieldData = fieldData;
        this.updateGrid();
    }

    updateSquareOffset(offset: Point, fix: boolean = false) {
        Square.offset = offset;
        if (!fix)
            return
        // Prevent square offset from changes on field borders
        const offsetBorders = this.getOffsetBorders();
        if (this.offset.x == offsetBorders.left)
            Square.offset.x = 0;
        if (this.offset.x == offsetBorders.right)
            Square.offset.x = 1;
        if (this.offset.y == offsetBorders.top)
            Square.offset.y = 0;
        if (this.offset.y == offsetBorders.bottom)
            Square.offset.y = 1;
    }
    getScaledGridPosition(canvasPosition: Point) {
        return {
            x: canvasPosition.x/Square.size+1, 
            y: canvasPosition.y/Square.size+1,
        };
    }
    getScaledFieldPosition(canvasPosition: Point) {
        const position: Point = this.getScaledGridPosition(canvasPosition);
        return {
            x: Math.floor(position.x-Square.offset.x+0.5)+this.offset.x, 
            y: Math.floor(position.y-Square.offset.y+0.5)+this.offset.y,
        };
    }
    getSquareState(position: Point) {
        // return this.fieldData[position.x]?.[position.y] ?? null;
        // mirrored state
        return this.fieldData[this.fieldSize.X-position.x-1]?.[this.fieldSize.Y-position.y-1] ?? null
    }
    setSquareState(position: Point, state: SquareState) {
        if (this.getSquareState(position) == undefined) 
            return;
        // this.fieldData[position.x][position.y] = state;
        // mirrored state
        this.fieldData[this.fieldSize.X-position.x-1][this.fieldSize.Y-position.y-1] = state;
    }
    getSquareData(canvasPosition: Point) {
        const position: Point = this.getScaledFieldPosition(canvasPosition);
        return {
            position: position,
            state: this.getSquareState(position)
        };
    }

    updateSize(canvasSize?: GridSize) {
        this.canvasSize = canvasSize ?? this.canvasSize;
        const newSize: GridSize = {
            X: Math.floor(this.canvasSize.X/Square.size)+3, 
            Y: Math.floor(this.canvasSize.Y/Square.size)+3,
        };
        if (this.gridSize.X == newSize.X && this.gridSize.Y == newSize.Y)
            return
        
        for (let x = 0; x < Math.max(this.gridSize.X, newSize.X); x++) {
            if (this.squares.length <= x) 
                this.squares.push(Array.from({ length: 0 }, () => new Square()));
            for (let y = 0; y < Math.max(this.gridSize.Y, newSize.Y); y++) {
                if (this.squares[x].length <= y) {
                    const sq = new Square();
                    sq.setPosition(x-1, y-1); // I want to have 1 additional square on top and left sides
                    this.squares[x].push(sq);
                    this.app.stage.addChild(sq.sprite);
                    this.app.stage.addChild(sq.cross.sprite);
                }
                const square = this.squares[x][y];
                if (x > newSize.X || y > newSize.Y){
                    square.clear();
                }
            }
        }
        this.gridSize = newSize;
        this.updateGrid();
    }
    clearGrid() {
        this.squares.flat().forEach(square => { square.clear() });
    }
    updateGrid() {
        for (let x = 0; x < this.gridSize.X; x++) {
            for (let y = 0; y < this.gridSize.Y; y++) {
                const square = this.squares[x][y];
                const pos = {
                    x: x+this.offset.x,
                    y: y+this.offset.y
                }
                const state = this.getSquareState(pos);    
                if (state == undefined) {
                    square.clear();
                }
                else {
                    square.setState(state);
                    this.updateCross(pos);
                }
            }
        }
    }
    clear() {
        this.fieldData = Array.from({ length: this.fieldSize.X }, () => Array.from({ length: this.fieldSize.Y }, () => SquareState.empty));
        this.updateGrid();
    }


    updateCross(position: Point) {
        //Field.colorCheck = this.getSquareState(position)+position.y+Field.startRow) % 2 == 0 ? true: false;

        if (this.getSquareState(position) == undefined)
            return
        const sq = this.squares[position.x-this.offset.x][position.y-this.offset.y];
        const sqState = this.getSquareState(position);
        const crossState = (this.getSquareState(position) != undefined
            && this.getSquareState(position) == this.getSquareState({x: position.x, y: position.y+1})
            && this.getSquareState(position) == this.getSquareState({x: position.x, y: position.y+2})
            && (this.getSquareState(position)+position.y+Field.startRow) % 2 == 0
            && this.drawCrosses
            ) ? true : false;
        sq.setStateAndPosition(sqState, crossState, position);
    }
    updateSquare(position: Point, state?: SquareState) {
        if (this.getSquareState(position) == undefined)
            return
        const newState = (state != undefined) ? state : (this.getSquareState(position) + 1) % SquareState.__LENGTH;
        this.setSquareState(position, newState);
        for (let _y = 0; _y <= 2; _y++)
            this.updateCross({x: position.x, y: position.y-_y});
    }
    squareClick(canvasPosition: Point, state?: SquareState) {
        this.updateSquare(this.getScaledFieldPosition(canvasPosition), state);
    }

    getOffsetBorders() {
        return {
            left: -Math.floor(config.gridMaxOffsetPx.left/Square.size),
            right: this.fieldSize.X-Math.floor(config.gridMaxOffsetPx.left/Square.size),
            top: -Math.floor(config.gridMaxOffsetPx.top/Square.size),
            bottom: this.fieldSize.Y-Math.floor(config.gridMaxOffsetPx.top/Square.size),
        }
    }
    getOffsetPercent() {
        const offsetBorders = this.getOffsetBorders();
        return {
            x: (this.offset.x - Square.offset.x - offsetBorders.left)/(offsetBorders.right - offsetBorders.left - 1),
            y: (this.offset.y - Square.offset.y - offsetBorders.top)/(offsetBorders.bottom - offsetBorders.top - 1)
        }
    }
    fixOffset() {
        const offsetBorders = this.getOffsetBorders();
        this.offset.x = getBetween(this.offset.x, offsetBorders.left, offsetBorders.right);
        this.offset.y = getBetween(this.offset.y, offsetBorders.top, offsetBorders.bottom);
    }
    moveToPoint(canvasPosition: Point, squarePosition: Point) {
        const position: Point = this.getScaledGridPosition(canvasPosition); 
        this.offset = { 
            x: squarePosition.x - Math.floor(position.x), 
            y: squarePosition.y - Math.floor(position.y), 
        };
        this.fixOffset(); 
        this.updateSquareOffset({
            x: position.x % 1, 
            y: position.y % 1,
        }, true); 
        this.clearGrid();
        this.updateGrid();
    }
    moveToPercent(percent: Point) {
        const offsetBorders = this.getOffsetBorders();
        this.offset = {
            x: Math.floor(offsetBorders.left + percent.x * (offsetBorders.right  - offsetBorders.left - 1)),
            y: Math.floor(offsetBorders.top  + percent.y * (offsetBorders.bottom - offsetBorders.top  - 1)),
        };
        this.fixOffset();
        this.updateSquareOffset({
            x: -(percent.x * (offsetBorders.right  - offsetBorders.left - 1)) % 1, 
            y: -(percent.y * (offsetBorders.bottom - offsetBorders.top  - 1)) % 1,
        }); 
        this.clearGrid();
        this.updateGrid();
    }

    changeSquareSize(val: number, canvasPosition: Point) {
        const squarePosition: Point = this.getSquareData(canvasPosition).position;
        Square.size = getBetween(Square.size+val, config.squareSizeRange.min, config.squareSizeRange.max);
        this.fixOffset();
        this.updateSize();
        this.clearGrid();
        this.moveToPoint(canvasPosition, squarePosition);
    }
}