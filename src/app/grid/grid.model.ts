import { config } from '../../config';
import { EventType } from '../events/event-listener.model';
import { EventListenerService } from '../events/event-listener.service';
import { ParserService } from '../parser/parser.service';
import { jsPDF } from "jspdf";
import { Application, Assets, ColorMatrixFilter, Container, Graphics, Sprite, Texture } from 'pixi.js';

export enum zIndexes {
    background,
    square, 
    cross,
    selection,
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
    realPositionY: number = 0;

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
        this.sprite.filters = [];
        if (this.state != state || this.cleared) {
            this.state = state;
            this.draw()
        }
        if (this.crossState != crossState || this.cleared) {
            this.crossState = crossState;
            this.drawCross()
        }
    }
    setTemporaryState(state: SquareState) {
        this.setState(state);
        let colorMatrix = new ColorMatrixFilter();
        this.sprite.filters = [colorMatrix];
        //colorMatrix.brightness(0.8, false);
        colorMatrix.tint(config.selectionStyle.previewColor, true);
    }

    setStateAndPosition(state: SquareState, crossState: boolean = false, realPositionY: number) {
        if (this.realPositionY != realPositionY || this.state != state || this.cleared) {
            this.state = state;
            this.realPositionY = realPositionY;
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
        else if ((this.realPositionY+Field.startRow) % 2 == 0)
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

export class FieldSelection {
    overlay: Container;
    selection: Graphics;
    edges: {
        start: Point,
        end: Point,
        } = {
            start: {x: -1, y: -1},
            end: {x: 0, y: 0},
        };
    fixedEdges: {
        start: Point,
        end: Point,
        } = this.edges;
    gridEdges: {
        start: Point,
        size: GridSize,
        } = {
            start: {x: 0, y: 0},
            size: {X: 0, Y: 0},
        };
    data: Array<Array<number>> | undefined = undefined;
    constructor() {
        this.overlay = new Container();
        this.overlay.zIndex = zIndexes.selection;
        this.selection = new Graphics();
        this.overlay.addChild(this.selection);
        this.fixedEdges = this.edges;
        this.update();
    }
    update() {
        this.fixedEdges = {
            start: {x: Math.max(Math.min(this.edges.start.x, this.edges.end.x),0), y: Math.max(Math.min(this.edges.start.y, this.edges.end.y),0)},
            end: {x: Math.min(Math.max(this.edges.start.x, this.edges.end.x),Field.fieldSize.X-1), y: Math.min(Math.max(this.edges.start.y, this.edges.end.y),Field.fieldSize.Y-1)},
        };
        this.gridEdges.start = {
            x: this.fixedEdges.start.x-Field.offset.x-1,
            y: this.fixedEdges.start.y-Field.offset.y-1,
        };
        this.gridEdges.size = {
            X: this.fixedEdges.end.x-this.fixedEdges.start.x+1,
            Y: this.fixedEdges.end.y-this.fixedEdges.start.y+1,
        };
    }
    draw() {
        if (this.edges.start.x == -1) 
            return
        this.update();
        const fixedSize = this.gridEdges.size;
        this.move();
        this.selection.clear();
        this.selection.rect(0, 0, fixedSize.X*Square.size, fixedSize.Y*Square.size);
        this.selection.fill(config.selectionStyle);
    }
    move() {
        this.update();
        const fixedStart = this.gridEdges.start;
        this.overlay.x = fixedStart.x*Square.size+Square.size*(Square.offset.x-0.5);
        this.overlay.y = fixedStart.y*Square.size+Square.size*(Square.offset.y-0.5);
    }
    copy(data: Array<Array<number>>) {
        this.data = data;
    }
    clear() {
        //this.data = undefined;
        this.edges.start = {x: -1, y: -1};
        this.edges.end = {x: 0, y: 0};
        this.selection.clear();
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

export class FieldToPDF {
    static async loadTexture(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    }
    static async initializeTextures() {
        const filledSquareImage = await this.loadTexture('assets/images/square/FilledSquare.svg');
        const emptySquareImage = await this.loadTexture('assets/images/square/EmptySquare.svg');
        const primaryColorSquareImage = await this.loadTexture('assets/images/square/PrimaryColorSquare.svg');
        const primaryCrossImage = await this.loadTexture('assets/images/cross/CrossMainColor.svg');
        const backgroundCrossImage = await this.loadTexture('assets/images/cross/CrossBGColor.svg');
    
        return { filledSquareImage, emptySquareImage, primaryColorSquareImage, primaryCrossImage, backgroundCrossImage };
    }

    static addPageFooter(pdf: jsPDF, h: number, v: number, numHorizontalSegments: number, numVerticalSegments: number, size: number) {
        const pageSize = pdf.internal.pageSize;
        const rectSize = size / Math.max(numHorizontalSegments, numVerticalSegments); // Size of each small rectangle
        const xOffset = pageSize.getWidth() - (numHorizontalSegments * rectSize) - size; // Start from the right margin
        const yOffset = pageSize.getHeight() - (numVerticalSegments * rectSize) - size; // Bottom margin
        pdf.setDrawColor(0); // Black border for all rectangles
    
        // Draw the grid indicating page position
        for (let row = 0; row < numVerticalSegments; row++) {
            for (let col = 0; col < numHorizontalSegments; col++) {
                const fillColor = (col === h && row === v) ? 'black' : 'white';
                pdf.setFillColor(fillColor);
                pdf.rect(xOffset + col * rectSize, yOffset + row * rectSize, rectSize, rectSize, 'FD');
            }
        }
    
        // Footer text setup
        const fontSize = 45;
        const fullText = "Mycrochet.live - free pattern creator for mosaic crochet schemes";
        const linkText = "Mycrochet.live";
        const otherText = " - free pattern creator for mosaic crochet schemes";
    
        pdf.setFontSize(fontSize); // Set font size
        pdf.setFont("helvetica", 'normal'); // Ensuring we set the font without causing an error
    
        // Calculate the width of the text using scaleFactor
        const textScale = fontSize / pdf.internal.scaleFactor;
        const linkTextWidth = pdf.getStringUnitWidth(linkText) * textScale;
        const fullTextWidth = pdf.getStringUnitWidth(fullText) * textScale;
    
        // Calculate the starting X coordinate to center the full text
        const fullTextStartX = (pageSize.getWidth() - fullTextWidth) / 2;
        const textY = pageSize.getHeight() - 100; // Adjusted to not overlap with the grid
    
        // Render the clickable part of the text
        pdf.setTextColor(69, 98, 123); // Blue color for link
        pdf.text(linkText, fullTextStartX, textY);
        pdf.setDrawColor(69, 98, 123); // Blue underline
        pdf.setLineWidth(0.5);
        pdf.line(fullTextStartX, textY + 3, fullTextStartX + linkTextWidth, textY + 3);
    
        // Render the rest of the text
        pdf.setTextColor(121, 156, 186); // Dark gray for the rest of the text
        pdf.text(otherText, fullTextStartX + linkTextWidth, textY);
    
        // Link annotation
        pdf.link(fullTextStartX, textY - 10, linkTextWidth, 10, { url: 'https://www.mycrochet.live' });
    }
    
    
    
    static async exportPixelFieldToPDF(field: Field, fileName: string) {
        const segmentSize = config.PDF.pageSize;
        const squareSize = config.PDF.squareSize;
        const borderSize = config.PDF.borderSize;
        const { filledSquareImage, emptySquareImage, primaryColorSquareImage, primaryCrossImage, backgroundCrossImage } = await this.initializeTextures();
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [segmentSize.width * squareSize + borderSize * 2, segmentSize.height * squareSize + borderSize * 3.5] 
        });
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Canvas context is not available');
        }

        canvas.width = segmentSize.width * squareSize;
        canvas.height = segmentSize.height * squareSize;

        // Generate PDF content by segments
        const numHorizontalSegments = Math.ceil(Field.fieldSize.X / segmentSize.width);
        const numVerticalSegments = Math.ceil(Field.fieldSize.Y / segmentSize.height); 
    
        for (let v = 0; v < numVerticalSegments; v++) {
            for (let h = 0; h < numHorizontalSegments; h++) {
                if (h !== 0 || v !== 0) {
                    pdf.addPage();
                }
    
                const startX = h * segmentSize.width;
                const startY = v * segmentSize.height;
                const endX = Math.min(startX + segmentSize.width, Field.fieldSize.X);
                const endY = Math.min(startY + segmentSize.height, Field.fieldSize.Y);
    
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                for (let y = startY; y < endY; y++) {
                    for (let x = startX; x < endX; x++) {
                        const squareState = field.getSquareState({x: x, y: y});
                        const imageToUse = squareState === 1 ? filledSquareImage : 
                            ((Field.fieldSize.Y-y+Field.startRow) % 2 == 0) ? 
                            emptySquareImage : primaryColorSquareImage;
                        ctx.drawImage(imageToUse, (x - startX) * squareSize, (y - startY) * squareSize, squareSize, squareSize);

                        if (field.getCrossState({x: x, y: y}, true)) {
                            const crossImageToUse = squareState === 1 ? primaryCrossImage : backgroundCrossImage;
                            ctx.drawImage(crossImageToUse, 
                                (x - startX) * squareSize + squareSize / 4, 
                                (y - startY) * squareSize + squareSize / 4, 
                                squareSize / 2, squareSize / 2);
                        }
                    }
                }

                const imageData = canvas.toDataURL('image/jpeg');
                pdf.addImage(imageData, 'JPEG', borderSize, borderSize, canvas.width, canvas.height);
                this.addPageFooter(pdf, h, v, numHorizontalSegments, numVerticalSegments, borderSize);
            }
        }
    
        pdf.save(fileName);
    }
}

export class Field {
    app: Application;
    eventService: EventListenerService;

    static fieldSize: GridSize = { X: 50, Y: 30 };

    canvasSize: GridSize = { X: 0, Y: 0 };
    gridSize: GridSize = { X: 0, Y: 0 };
    static offset: Point = { x: -2, y: -2 };

    fieldData: Array<Array<number>>;
    squares: Array<Array<Square>>;
    drawCrosses: boolean = false;
    static startRow: number = 1;
    static colorCheck: boolean = false;

    history: any[] = [];

    selection: FieldSelection;
    
    constructor(app: Application, eventService: EventListenerService) {
        this.app = app;
        this.eventService = eventService;
        const fieldSizeStored = localStorage.getItem('fieldSize');
        Field.fieldSize = fieldSizeStored ? JSON.parse(fieldSizeStored) : Field.fieldSize;
        const fieldDataStored = localStorage.getItem('fieldData');
        this.fieldData = fieldDataStored ? 
            JSON.parse(fieldDataStored) : 
            Array.from({ length: Field.fieldSize.X }, () => Array.from({ length: Field.fieldSize.Y }, () => SquareState.empty));
        this.squares = Array.from({ length: 0 }, () => Array.from({ length: 0 }, () => new Square()));
        this.selection = new FieldSelection();
        this.app.stage.addChild(this.selection.overlay);
        this.sendUpdateMenuEvent();
        this.updateHistory();
    }
    init() {}

    // External events
    sendUpdateMenuEvent(filename?: string) {
        const payload = {
            fieldSize: Field.fieldSize,
            projectName: filename?.substring(0, filename.lastIndexOf(".")) ?? '',
        }
        this.eventService.emitEvent({ type: EventType.UpdateUI, payload: payload });
    }


    async loadFile(file: File) {
        if (file.type == 'application/json') {
            const data = await ParserService.parseJson(file);
            const size: GridSize = {X: data.length, Y: data[0].length};
            Field.fieldSize = size;
            this.fieldData = data;
        }
        else if (file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            const data = await ParserService.parseExcel(file);            
            const size: GridSize = {
                X: data.reduce((max, row) => Math.max(max, row.length), 0), 
                Y: data.length
            };
            const fieldData = Array.from({ length: size.X }, () => Array.from({ length: size.Y }, () => SquareState.empty));
            for (let x = 0; x < size.X; x++) {
                for (let y = 0; y < size.Y; y++) {
                    fieldData[x][y] = data?.[size.Y-y-1]?.[size.X-x-1] ?? 0;
                }
            }
            Field.fieldSize = size;
            this.fieldData = fieldData;
        }
        this.updateGrid();
        this.sendUpdateMenuEvent(file.name);
    }
    async saveFile(fileName: string) {
        const data = this.fieldData;
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    }
    saveToPDF(fileName: string) {
        FieldToPDF.exportPixelFieldToPDF(this, fileName)
    }

    updateHistory() {
        if (this.history.length === config.history.maxSize) {
            this.history.shift();
        }
        this.history.push(JSON.stringify(this.fieldData));
    }
    undo() {
        if (this.history.length > 1) {
            this.history.pop();
            
            this.fieldData = JSON.parse(this.history.at(-1))
            this.clearGrid();
            this.updateGrid();
        }
    }

    changeFieldSize(size: GridSize) {
        const fieldData = Array.from({ length: size.X }, () => Array.from({ length: size.Y }, () => SquareState.empty));
        for (let x = 0; x < Math.min(size.X, Field.fieldSize.X); x++) {
            for (let y = 0; y < Math.min(size.Y, Field.fieldSize.Y); y++) {
                fieldData[x][y] = this.fieldData[x][y];
            }
        }
        Field.fieldSize = size;
        this.fieldData = fieldData;
        this.updateGrid();
    }

    updateSquareOffset(offset: Point, fix: boolean = false) {
        Square.offset = offset;
        if (!fix)
            return
        // Prevent square offset from changes on field borders
        const offsetBorders = this.getOffsetBorders();
        if (Field.offset.x == offsetBorders.left)
            Square.offset.x = 0;
        if (Field.offset.x == offsetBorders.right)
            Square.offset.x = 1;
        if (Field.offset.y == offsetBorders.top)
            Square.offset.y = 0;
        if (Field.offset.y == offsetBorders.bottom)
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
            x: Math.floor(position.x-Square.offset.x+0.5)+Field.offset.x, 
            y: Math.floor(position.y-Square.offset.y+0.5)+Field.offset.y,
        };
    }
    getSquareState(position: Point) {
        // return this.fieldData[position.x]?.[position.y] ?? null;
        // mirrored state
        return this.fieldData[Field.fieldSize.X-position.x-1]?.[Field.fieldSize.Y-position.y-1] ?? null
    }
    setSquareState(position: Point, state: SquareState) {
        if (this.getSquareState(position) == undefined) 
            return;
        // this.fieldData[position.x][position.y] = state;
        // mirrored state
        this.fieldData[Field.fieldSize.X-position.x-1][Field.fieldSize.Y-position.y-1] = state;
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
                    x: x+Field.offset.x,
                    y: y+Field.offset.y
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
        this.selection.move();
    }
    clear() {
        this.fieldData = Array.from({ length: Field.fieldSize.X }, () => Array.from({ length: Field.fieldSize.Y }, () => SquareState.empty));
        this.updateGrid();
    }

    updateSelection(startPosition?: Point, endPosition?: Point) {
        if (startPosition) {
            this.selection.edges.start = this.getSquareData(startPosition).position;
            this.selection.edges.end = this.selection.edges.start;
        }
        if (endPosition) {
            this.selection.edges.end = this.getSquareData(endPosition).position;
        }
        this.selection.draw();
    }
    clearSelection() {
        this.selection.clear();
    }
    copySelected() {
        const selectedData = Array.from({ length: this.selection.gridEdges.size.X }, 
            () => Array.from({ length: this.selection.gridEdges.size.Y }, 
                () => SquareState.empty));
        for (let x = this.selection.fixedEdges.start.x; x <= this.selection.fixedEdges.end.x; x++) {
            for (let y = this.selection.fixedEdges.start.y; y <= this.selection.fixedEdges.end.y; y++) {
                const pos = {x:x, y:y};
                selectedData[x-this.selection.fixedEdges.start.x][y-this.selection.fixedEdges.start.y] = this.getSquareState(pos);
            }
        }
        this.selection.copy(selectedData);
    }
    drawSelected(startPosition: Point, additive: boolean = false) {
        this.updateGrid();
        const data = this.selection.data;
        if (data === undefined)
            return 
        for (let x = 0; x < data.length; x++) {
            for (let y = 0; y < data[0].length; y++) {
                const pos = {x: startPosition.x+x, y: startPosition.y+y};
                const sqPos = {x: pos.x-Field.offset.x, y:pos.y-Field.offset.y};
                const square = this.squares[sqPos.x][sqPos.y];
                if (this.getSquareState(pos) != undefined) {
                    if (!additive || data[x][y] == 1) {
                        square.setTemporaryState(data[x][y]);
                    }
                }
            }
        }
    }
    pasteSelected(startPosition: Point) {
        const data = this.selection.data;
        if (data === undefined)
            return 
        for (let x = 0; x < data.length; x++) {
            for (let y = 0; y < data[0].length; y++) {
                const pos = {x:startPosition.x+x, y:startPosition.y+y};
                this.setSquareState(pos, data[x][y]);
            }
        }
        this.updateHistory();
        this.updateGrid();
    }
    pasteSelectedAdditive(startPosition: Point) {
        const data = this.selection.data;
        if (data === undefined)
            return 
        for (let x = 0; x < data.length; x++) {
            for (let y = 0; y < data[0].length; y++) {
                const pos = {x:startPosition.x+x, y:startPosition.y+y};
                if (data[x][y] == 1) {
                    this.setSquareState(pos, data[x][y]);
                }
            }
        }
        this.updateHistory();
        this.updateGrid();
    }

    clearSelected() {
        for (let x = this.selection.fixedEdges.start.x; x <= this.selection.fixedEdges.end.x; x++) {
            for (let y = this.selection.fixedEdges.start.y; y <= this.selection.fixedEdges.end.y; y++) {
                const pos = {x:x, y:y};
                this.setSquareState(pos, SquareState.empty);
            }
        }
        this.updateHistory();
        this.updateGrid();
    }
    cutSelected() {
        this.copySelected();
        this.clearSelected();
    }

    getCrossState(position: Point, force: boolean = false) {
        return (this.getSquareState(position) != undefined
        && this.getSquareState(position) == this.getSquareState({x: position.x, y: position.y+1})
        && this.getSquareState(position) == this.getSquareState({x: position.x, y: position.y+2})
        && (this.getSquareState(position)+(Field.fieldSize.Y-position.y)+Field.startRow) % 2 == 0
        && (this.drawCrosses || force)
        ) ? true : false;
    }
    updateCross(position: Point) {
        if (this.getSquareState(position) == undefined)
            return
        const sq = this.squares[position.x-Field.offset.x][position.y-Field.offset.y];
        const sqState = this.getSquareState(position);
        const crossState = this.getCrossState(position);
        sq.setStateAndPosition(sqState, crossState, Field.fieldSize.Y-position.y);
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
            right: Field.fieldSize.X-Math.floor((this.canvasSize.X-config.gridMaxOffsetPx.right)/Square.size),
            top: -Math.floor(config.gridMaxOffsetPx.top/Square.size),
            bottom: Field.fieldSize.Y-Math.floor((this.canvasSize.Y-config.gridMaxOffsetPx.bottom)/Square.size),
        }
    }
    getOffsetPercent() {
        const offsetBorders = this.getOffsetBorders();
        return {
            x: (Field.offset.x - Square.offset.x - offsetBorders.left)/(offsetBorders.right - offsetBorders.left - 1),
            y: (Field.offset.y - Square.offset.y - offsetBorders.top)/(offsetBorders.bottom - offsetBorders.top - 1)
        }
    }
    fixOffset() {
        const offsetBorders = this.getOffsetBorders();
        Field.offset.x = getBetween(Field.offset.x, offsetBorders.left, offsetBorders.right);
        Field.offset.y = getBetween(Field.offset.y, offsetBorders.top, offsetBorders.bottom);
    }
    moveToPoint(canvasPosition: Point, squarePosition: Point) {
        const position: Point = this.getScaledGridPosition(canvasPosition); 
        Field.offset = { 
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
        Field.offset = {
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
        this.selection.move();
    }

    changeSquareSize(val: number, canvasPosition: Point) {
        const squarePosition: Point = this.getSquareData(canvasPosition).position;
        Square.size = getBetween(Square.size+val, config.squareSizeRange.min, config.squareSizeRange.max);
        this.fixOffset();
        this.updateSize();
        this.clearGrid();
        this.moveToPoint(canvasPosition, squarePosition);
        this.updateSelection();
    }
}