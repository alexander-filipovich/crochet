let isMouseDown = false;
let drawCrosses = false;
let activeCanvas = NaN;
let lastEventTimestamp = Date.now();

const canvas_control = document.getElementById("canvas_control");
const control = new PIXI.Application({
    backgroundColor: 0xAAAAAA 
});
canvas_control.appendChild(control.view);

const canvas_control_x = document.getElementById("canvas_top");
const control_x = new PIXI.Application({
    backgroundColor: 0xAAAAAA 
});
canvas_control_x.appendChild(control_x.view);

const canvas_control_y = document.getElementById("canvas_left");
const control_y = new PIXI.Application({
    backgroundColor: 0xAAAAAA 
});
canvas_control_y.appendChild(control_y.view);

const backgroundColor = 0xA0A0A0;
const canvas = document.getElementById("canvas_main");
const app = new PIXI.Application({
    backgroundColor: backgroundColor 
});
canvas.appendChild(app.view);

let size = {
    x: 0,
    y: 0
};

const minSquareSize = 20;
const maxSquareSize = 5*minSquareSize;
let squareSize = minSquareSize;

const fieldMaxSize = 1000;
let fieldSizeStored = localStorage.getItem('fieldSize');
const fieldSize = fieldSizeStored ? JSON.parse(fieldSizeStored) : {
    X: 50,
    Y: 50
}
let fieldOffset = {
    X: 0,
    Y: 0
};
let fieldDataStored = localStorage.getItem('fieldData');
let fieldData = fieldDataStored ? JSON.parse(fieldDataStored) : new Array(fieldMaxSize).fill(0).map(() => new Array(fieldMaxSize).fill(0));
let gridData = {
    size: { x:0, y:0 },
    squares: new Array(),
    isCrossesDrawn: false,
    crosses: new Array(),
    isSelectDrawn: false,
    selectedArea: null,
    copiedArea: null,
}
let lastValue = 0;

let slider_x_pos;
let slider_x_size;
let slider_y_pos;
let slider_y_size;

const crossTexture = PIXI.Texture.from('images/cross_128px.png');
const cursorBaseTexture = PIXI.Texture.from('images/cursor.png');

let cursorState = 0;
const cursorStates = [
    {state: 'draw',   texture: new PIXI.Texture(cursorBaseTexture, new PIXI.Rectangle(375, 25, 150, 150))},
    {state: 'move',   texture: new PIXI.Texture(cursorBaseTexture, new PIXI.Rectangle(575, 200, 150, 150))},
    {state: 'select', texture: new PIXI.Texture(cursorBaseTexture, new PIXI.Rectangle(575, 400, 150, 150))}
];

const moveState = {
    cell: null
}

const selectState = {
    cell: null,
    selectedRect: {
        pos: null,
        size: null
    },
    copiedRect: null,
    copiedData: null
}