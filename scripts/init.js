let isMouseDown = false;
let activeCanvas = NaN;
let lastEventTimestamp = Date.now();

const canvas_control = document.getElementById("canvas_top_left");
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

const fieldSize = 1000;
let fieldOffset = {
    X: 0,
    Y: 0
};
let fieldData = new Array(fieldSize).fill(0).map(() => new Array(fieldSize).fill(0));

let slider_x_pos;
let slider_x_size;
let slider_y_pos;
let slider_y_size;