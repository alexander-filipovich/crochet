
import { Assets, Graphics, Sprite, Texture } from 'pixi.js';

export class Square {
    sprite: Graphics;
    cleared: boolean = true;

    constructor() {
        this.sprite = new Graphics();
        this.sprite.visible = false;
    }
    draw(color: number | string, x: number, y: number, size: number) {
        this.sprite.clear();
        this.sprite.rect(x * size+1, y * size+1, size-2, size-2);
        this.sprite.fill(color);
        this.sprite.stroke({ width: 2, color: 0xfeeb77 });
        this.sprite.visible = true;
        this.cleared = false;
    }
    clear() {
        this.sprite.clear();
        this.sprite.visible = false;
        this.cleared = true;
    }
}


//const texture = await Assets.load('assets/images/cross.png');
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

export class fieldData {
    fieldMaxSize = {
        X: 1000,
        Y: 1000
    }
    size = { x:0, y:0 };
    squares: Array<Array<Square>>;
    fieldData: Array<Array<number>>;
    
    constructor() {
        const fieldDataStored = localStorage.getItem('fieldData');
        this.fieldData = fieldDataStored ? 
            JSON.parse(fieldDataStored) : 
            Array.from({ length: this.fieldMaxSize.Y }, () => Array.from({ length: this.fieldMaxSize.Y }, () => 0));
        this.squares = Array.from({ length: this.fieldMaxSize.Y }, () => Array.from({ length: this.fieldMaxSize.Y }, () => new Square()));
    }

    updateGridSize() {
        for (let x = 0; x <= this.size.x; x++) {
            if (this.squares.length <= x) { 
                this.squares.push(new Array()); 
            }
            for (let y = 0; y <= this.size.y; y++) {
                if (this.squares[x].length <= y || this.squares.length <= x) {
                    this.squares[x].push(new Square());
                    //app.stage.addChild(gridData.squares[x][y].sprite);
                }
            }
        }
    }

    clearSquares() {
        for (let x = 0; x <= this.size.x; x++) {
            for (let y = 0; y <= this.size.y; y++) {
                this.squares[x][y].clear();
            }
        }
    }
}