function setFieldSize() {
    const sizeX = document.getElementById('sizeXInput').value;
    const sizeY = document.getElementById('sizeYInput').value;

    fieldSize.X = getBetween(Number(sizeX), 1, fieldMaxSize);
    fieldSize.Y = getBetween(Number(sizeY), 1, fieldMaxSize);
    fieldOffset.X = getBetween(fieldOffset.X, 0, Math.max(0, fieldSize.X-Math.floor(size.x/2)));
    fieldOffset.Y = getBetween(fieldOffset.Y, 0, Math.max(0, fieldSize.Y-Math.floor(size.y/2)));

    drawGrid();
    drawControls();
}
function setDrawCrosses(value) {
    console.log(value);
    drawCrosses = value;
}
function clearGrid() {
    fieldData = new Array(fieldMaxSize).fill(0).map(() => new Array(fieldMaxSize).fill(0))
}

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
    slider_x_pos = Math.floor(fieldOffset.X/(fieldSize.X+size.x/2)*canvas_control_x.offsetWidth);
    slider_x_size = Math.floor(size.x/(fieldSize.X+size.x/2)*canvas_control_x.offsetWidth);
    slider_x.drawRect(slider_x_pos, 0, slider_x_size, canvas_control_x.offsetHeight);
    slider_x.endFill();
    control_x.stage.addChild(slider_x);

    control_y.stage.removeChildren();
    let slider_y = new PIXI.Graphics();
    slider_y.beginFill(0xFFFF00);
    slider_y_pos = Math.floor(fieldOffset.Y/(fieldSize.Y+size.y/2)*canvas_control_y.offsetHeight);
    slider_y_size = Math.floor(size.y/(fieldSize.Y+size.y/2)*canvas_control_y.offsetHeight);
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
            if (x+fieldOffset.X >= fieldSize.X || y+fieldOffset.Y >= fieldSize.Y) {
                color = backgroundColor;
            }
            else if (fieldData[x+fieldOffset.X][y+fieldOffset.Y] == 1) {
                color = 0xFFFF00;
            }
            else {
                color = (y%2 == 0) ? 0xFFFFFF : 0xF0F0F0;
            }
            square.beginFill(color);
            square.drawRect(x * squareSize+1, y * squareSize+1, squareSize-2, squareSize-2);
            square.endFill();
            app.stage.addChild(square);
        }
    }

    if (drawCrosses) {
        for (let x = 0; x < size.x+1; x++) {
            for (let y = 0; y < size.y+1; y++) {
                if (x+fieldOffset.X >= fieldSize.X || y+fieldOffset.Y+2 >= fieldSize.Y) {
                    continue;
                }
                if (fieldData[x+fieldOffset.X][y+fieldOffset.Y] % 2 == (y+fieldOffset.Y) % 2&& 
                    fieldData[x+fieldOffset.X][y+fieldOffset.Y] == fieldData[x+fieldOffset.X][y+fieldOffset.Y+1] && 
                    fieldData[x+fieldOffset.X][y+fieldOffset.Y] == fieldData[x+fieldOffset.X][y+fieldOffset.Y+2]) {
                    const cross = new PIXI.Sprite(crossTexture);
                    cross.x = x * squareSize+2;
                    cross.y = y * squareSize+2;
                    cross.width = squareSize-4;
                    cross.height = squareSize-4;
                    app.stage.addChild(cross);
                }
            }
        }
    }
}

function onAppMouseMove(event){
    onAppMouseClick(event, lastValue);
}
function onAppMouseClick(event, value = -1) {
    activeCanvas = "app";
    var rect = canvas.getBoundingClientRect();
    if (event.pageX < rect.left || event.pageX > rect.right || event.pageY < rect.top || event.pageY > rect.bottom) {
        return;
    }
    const x = Math.floor(event.offsetX/squareSize)+fieldOffset.X;
    const y = Math.floor(event.offsetY/squareSize)+fieldOffset.Y;
    if (x > fieldSize.X || y > fieldSize.Y) {
        return
    }
    if (value != -1) {
        fieldData[x][y] = value;
    }
    else {
        fieldData[x][y] = fieldData[x][y] == 1 ? 0 : 1;
        lastValue = fieldData[x][y];
    }
}
function getBetween(num, min, max) {
    if (num < min)
        return min;
    if (num > max)
        return max;
    return num
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
        fieldOffset.X = getBetween(fieldOffset.X, 0, Math.max(0, fieldSize.X-Math.floor(size.x/2)));
    }
    else {
        fieldOffset.Y += scrollSensitivity * direction;
        fieldOffset.Y = getBetween(fieldOffset.Y, 0, Math.max(0, fieldSize.Y-Math.floor(size.y/2)));
    }
}
function onControlXClick(event) {
    activeCanvas = "control_x";
    var rect = canvas_control_x.getBoundingClientRect();
    if (event.pageX < rect.left || event.pageX > rect.right) {
        return;
    }
    let slider_position = getBetween(event.offsetX - slider_x_size/2, 0, canvas_control_x.offsetWidth - slider_x_size)
    offset_new = Math.floor(slider_position*((fieldSize.X+size.x/2)/canvas_control_x.offsetWidth));
    if (offset_new != fieldOffset.X) {
        fieldOffset.X = offset_new;
    }
}
function onControlXMouseMove(event) {
        onControlXClick(event);
}
function onControlYClick(event) {
    activeCanvas = "control_y";
    var rect = canvas_control_y.getBoundingClientRect();
    if (event.pageY < rect.top || event.pageY > rect.bottom) {
        return;
    }
    let slider_position = getBetween(event.offsetY - slider_y_size/2, 0, canvas_control_y.offsetHeight - slider_y_size)
    let offset_new = Math.floor(slider_position*((fieldSize.Y+size.y/2)/canvas_control_y.offsetHeight));
    if (offset_new != fieldOffset.Y) {
        fieldOffset.Y = offset_new;
    }
}
function onControlYMouseMove(event) {
    onControlYClick(event);
}