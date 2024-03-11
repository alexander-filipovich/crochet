function resizeCanvas() {
    control.renderer.resize(canvas_control.offsetWidth, canvas_control.offsetHeight);
    control_x.renderer.resize(canvas_control_x.offsetWidth, canvas_control_x.offsetHeight);
    control_y.renderer.resize(canvas_control_y.offsetWidth, canvas_control_y.offsetHeight);
    app.renderer.resize(canvas.offsetWidth, canvas.offsetHeight);
    resizeApp();
}
function resizeApp() {
    size.x = Math.floor(canvas.offsetWidth/squareSize);
    size.y = Math.floor(canvas.offsetHeight/squareSize);
}

function drawControls() {
    control_x.stage.removeChildren();
    let slider_x = new PIXI.Graphics();
    slider_x.beginFill(0xFFFF00);
    slider_x_pos = Math.floor(fieldOffset.X/(fieldSize+size.x/2)*canvas_control_x.offsetWidth);
    slider_x_size = Math.floor(size.x/(fieldSize+size.x/2)*canvas_control_x.offsetWidth);
    slider_x.drawRect(slider_x_pos, 0, slider_x_size, canvas_control_x.offsetHeight);
    slider_x.endFill();
    control_x.stage.addChild(slider_x);

    control_y.stage.removeChildren();
    let slider_y = new PIXI.Graphics();
    slider_y.beginFill(0xFFFF00);
    slider_y_pos = Math.floor(fieldOffset.Y/(fieldSize+size.y/2)*canvas_control_y.offsetHeight);
    slider_y_size = Math.floor(size.y/(fieldSize+size.y/2)*canvas_control_y.offsetHeight);
    slider_y.drawRect(0, slider_y_pos, canvas_control_x.offsetWidth, slider_y_size);
    slider_y.endFill();
    control_y.stage.addChild(slider_y);
}

function drawGrid() {
    app.stage.removeChildren();

    for (let x = 0; x < size.x+1; x++) {
        for (let y = 0; y < size.y+1; y++) {
            let square = new PIXI.Graphics();
            let color;
            if (x+fieldOffset.X >= fieldSize || y+fieldOffset.Y >= fieldSize) {
                color = backgroundColor;
            }
            else if (fieldData[x+fieldOffset.X][y+fieldOffset.Y] == 1) {
                color = 0xFFFF00;
            }
            else {
                color = ((x+y)%2 == 0) ? 0xFFFFFF : 0xF0F0F0;
            }
            square.beginFill(color);
            square.drawRect(x * squareSize+1, y * squareSize+1, squareSize-2, squareSize-2);
            square.endFill();
            app.stage.addChild(square);
        }
    }
}

function onAppMouseClick(event) {
    activeCanvas = "app";
    const x = Math.floor(event.offsetX/squareSize)+fieldOffset.X;
    const y = Math.floor(event.offsetY/squareSize)+fieldOffset.Y;
    if (x > fieldSize || y > fieldSize) {
        return
    }
    fieldData[x][y] = fieldData[x][y] == 1 ? 0 : 1;
    drawGrid();
}
function getBetween(num, min, max) {
    return Math.min(Math.max(min, num), max);
}
function onMouseScroll(event) {
    const direction = Math.sign(event.deltaY);
    const zoomSensitivity = -5;
    const scrollSensitivity = 5-Math.floor(squareSize/minSquareSize)+1;
    if (event.ctrlKey) {
        event.preventDefault(); 
        const delta = zoomSensitivity * direction
        squareSize += delta;
        squareSize = getBetween(squareSize, minSquareSize, maxSquareSize);
        resizeApp();
    }
    else if (event.shiftKey) {
        fieldOffset.X += scrollSensitivity * direction;
        fieldOffset.X = getBetween(fieldOffset.X, 0, fieldSize-Math.floor(size.x/2));
    }
    else {
        fieldOffset.Y += scrollSensitivity * direction;
        fieldOffset.Y = getBetween(fieldOffset.Y, 0, fieldSize-Math.floor(size.y/2));
    }
    drawGrid();
    drawControls();
}
function onControlXClick(event) {
    activeCanvas = "control_x";
    //console.log(event.offsetX);
    let slider_position = getBetween(event.offsetX - slider_x_size/2, 0, canvas_control_x.offsetWidth - slider_x_size)
    offset_new = Math.floor(slider_position*((fieldSize+size.x/2)/canvas_control_x.offsetWidth));
    if (offset_new != fieldOffset.X) {
        fieldOffset.X = offset_new;
        drawGrid();
        drawControls();
    }
}
function onControlXMouseMove(event) {
    if (isMouseDown) {
        onControlXClick(event);
    }
}
function onControlYClick(event) {
    activeCanvas = "control_y";
    let slider_position = getBetween(event.offsetY - slider_y_size/2, 0, canvas_control_y.offsetHeight - slider_y_size)
    let offset_new = Math.floor(slider_position*((fieldSize+size.y/2)/canvas_control_y.offsetHeight));
    if (offset_new != fieldOffset.Y) {
        fieldOffset.Y =offset_new;
        drawGrid();
        drawControls();
    }
}
function onControlYMouseMove(event) {
    if (isMouseDown) {
        onControlYClick(event);
    }
}