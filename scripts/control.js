// Field functions

function setFieldSize(x = null, y = null) {
    const sizeXInput = document.getElementById('sizeXInput');
    const sizeYInput = document.getElementById('sizeYInput');

    const sizeX = x ? x : Number(sizeXInput.value);
    const sizeY = y ? y : Number(sizeYInput.value);

    fieldSize.X = getBetween(sizeX, 10, fieldMaxSize);
    fieldSize.Y = getBetween(sizeY, 10, fieldMaxSize);
    fieldOffset.X = getBetween(fieldOffset.X, 0, Math.max(0, fieldSize.X-Math.floor(size.x/2)));
    fieldOffset.Y = getBetween(fieldOffset.Y, 0, Math.max(0, fieldSize.Y-Math.floor(size.y/2)));

    sizeXInput.value = fieldSize.X;
    sizeYInput.value = fieldSize.Y;

    drawGrid();
    drawControls();
}
function setDrawCrosses(value) {
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
    control.stage.removeChildren()
    const state = new PIXI.Sprite(cursorStates[cursorState].texture);
    state.x = 0;
    state.y = 0;
    state.width = canvas_control.offsetWidth;
    state.height = canvas_control.offsetHeight;
    control.stage.addChild(state);
    
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


// Grid visual
function updateGridSize() {
    for (let x = 0; x <= size.x; x++) {
        if (gridData.squares.length <= x) { 
            gridData.squares.push(new Array()); 
            gridData.crosses.push(new Array());
        }
        for (let y = 0; y <= size.y; y++) {
            if (gridData.squares[x].length <= y || gridData.squares.length <= x) {
                gridData.squares[x].push({
                    val: -1,
                    sprite: new PIXI.Graphics()
                })
                app.stage.addChild(gridData.squares[x][y].sprite);

                gridData.crosses[x].push({
                    val: -1,
                    sprite: new PIXI.Sprite(crossTexture)
                })
                gridData.crosses[x][y].sprite.visible = false;
                app.stage.addChild(gridData.crosses[x][y].sprite);
            }
        }
    }

    if (gridData.selectedArea == null) {
        gridData.selectedArea = {
            rect: { x: 0, y: 0, width: 0, height: 0 },
            sprite: new PIXI.Graphics()
        }
        app.stage.addChild(gridData.selectedArea.sprite);
    }
    if (gridData.copiedArea == null) {
        gridData.copiedArea = {
            rect: { x: 0, y: 0, width: 0, height: 0 },
            sprite: new PIXI.Graphics()
        }
        app.stage.addChild(gridData.copiedArea.sprite);
    }
    gridData.size = { ...size };
}
function clearSquares() {
    for (let x = 0; x <= gridData.size.x; x++) {
        for (let y = 0; y <= gridData.size.y; y++) {
            gridData.squares[x][y].val = -1;
            gridData.squares[x][y].sprite.clear();
        }
    }
}
function clearCrosses() {
    for (let x = 0; x <= gridData.size.x; x++) {
        for (let y = 0; y <= gridData.size.y; y++) {
            gridData.crosses[x][y].val = -1
            gridData.crosses[x][y].sprite.visible = false;
        }
    }
}
function clearSelectedArea() {
    gridData.copiedArea.rect = { x: 0, y: 0, width: 0, height: 0 };
    gridData.copiedArea.sprite.clear();
    gridData.selectedArea.rect = { x: 0, y: 0, width: 0, height: 0 };
    gridData.selectedArea.sprite.clear();
    gridData.isSelectDrawn = false;
}
function drawGrid() {
    if (gridData.size.x != size.x || gridData.size.y != size.y) {
        clearSquares();
        clearCrosses();
        updateGridSize();
    }
    for (let x = 0; x <= size.x; x++) {
        for (let y = 0; y <= size.y; y++) {
            const square = gridData.squares[x][y];
            let color;
            if (x+fieldOffset.X >= fieldSize.X || y+fieldOffset.Y >= fieldSize.Y) {
                square.sprite.clear();
                square.val = -1;
                continue;
            }
            
            if (square.val == fieldData[x+fieldOffset.X][y+fieldOffset.Y]) {
                continue;
            }
            else {
                square.val = fieldData[x+fieldOffset.X][y+fieldOffset.Y];
            }

            if (fieldData[x+fieldOffset.X][y+fieldOffset.Y] == 1) {
                color = 0xFFFF00;
            }
            else {
                color = (y%2 == 0) ? 0xFFFFFF : 0xF0F0F0;
            }
            square.sprite.clear();
            square.sprite.beginFill(color);
            square.sprite.drawRect(x * squareSize+1, y * squareSize+1, squareSize-2, squareSize-2);
            square.sprite.endFill();
        }
    }

    if (drawCrosses) {
        for (let x = 0; x < size.x+1; x++) {
            for (let y = 0; y < size.y+1; y++) {
                const cross = gridData.crosses[x][y];
                if (x+fieldOffset.X >= fieldSize.X || y+fieldOffset.Y+2 >= fieldSize.Y) {
                    cross.sprite.visible = false;
                    cross.val = -1;
                    continue;
                }
                const val = (fieldData[x+fieldOffset.X][y+fieldOffset.Y] % 2 == (y+fieldOffset.Y) % 2 && 
                    fieldData[x+fieldOffset.X][y+fieldOffset.Y] == fieldData[x+fieldOffset.X][y+fieldOffset.Y+1] && 
                    fieldData[x+fieldOffset.X][y+fieldOffset.Y] == fieldData[x+fieldOffset.X][y+fieldOffset.Y+2]) ?
                    1 : 0;
                if (cross.val == val) {
                    continue;
                }
                else {
                    cross.val = val;
                }

                if (val == 1) {
                    cross.sprite.x = x * squareSize+2;
                    cross.sprite.y = y * squareSize+2;
                    cross.sprite.width = squareSize-4;
                    cross.sprite.height = squareSize-4;
                    cross.sprite.visible = true;
                }
                else {
                    cross.sprite.visible = false;
                }
            }
        }
        gridData.isCrossesDrawn = true;
    }
    else if (gridData.isCrossesDrawn) {
        clearCrosses();
    }

    if (cursorStates[cursorState].state == "select") {
        function scaledRectData (rectData) {
            const fixedRectData = fixRectData(rectData);
            const rect = {
                x: (fixedRectData.x-fieldOffset.X) * squareSize,
                y: (fixedRectData.y-fieldOffset.Y) * squareSize,
                width:  fixedRectData.width * squareSize,
                height: fixedRectData.height * squareSize
            }
            return rect;
        }
        if (selectState.cell != null) {
            const selectedArea = gridData.selectedArea;
            const rect = scaledRectData(selectState.selectedRect);
            if (selectedArea.rect.x != rect.x || selectedArea.rect.y != rect.y || 
                selectedArea.rect.width != rect.width || selectedArea.rect.height != rect.height) {
                selectedArea.sprite.clear();
                selectedArea.sprite.lineStyle(3, 0xDE3249, 1);
                selectedArea.sprite.drawRect(rect.x, rect.y, rect.width, rect.height);
                selectedArea.rect = { ...rect }
            }
        }
        if (selectState.copiedRect != null) {
            const copiedArea = gridData.copiedArea;
            const rect = scaledRectData(selectState.copiedRect);
            if (copiedArea.rect.x != rect.x || copiedArea.rect.y != rect.y || 
                copiedArea.rect.width != rect.width || copiedArea.rect.height != rect.height) {
                copiedArea.sprite.clear();
                copiedArea.sprite.lineStyle(3, 0x3249DE, 1);
                copiedArea.sprite.drawRect(rect.x, rect.y, rect.width, rect.height);
                copiedArea.rect = { ...rect }
            }
        }
        gridData.isSelectDrawn = true;
    }
    else if (gridData.isSelectDrawn == true) {
        clearSelectedArea();
    }
}

function onControlClick() {
    cursorState = (cursorState+1) % cursorStates.length;
}

function getRelativeRectPosition(event) {
    const posX = event.offsetX; 
    const posY = event.offsetY;
    const x = Math.floor(posX/squareSize);
    const y = Math.floor(posY/squareSize);
    return {x: x, y: y}
}
function getRealRectPosition(event) {
    const relativePos = getRelativeRectPosition(event);
    const x = relativePos.x+fieldOffset.X;
    const y = relativePos.y+fieldOffset.Y;
    if (x > fieldSize.X || y > fieldSize.Y) {
        return null
    }
    return {x: x, y: y}
}

function changeRectColor(event, value = null) {
    const pos = getRealRectPosition(event);
    if (!pos) return;
    
    let x, y;
    x = pos.x; 
    y = pos.y;

    if (value != null) {
        fieldData[x][y] = value;
    }
    else {
        fieldData[x][y] = fieldData[x][y] == 1 ? 0 : 1;
    }
    return fieldData[x][y];
}

function onAppMouseDown(event) {
    activeCanvas = "app";
    if (cursorStates[cursorState].state == "draw") {
        lastValue = changeRectColor(event);
    }
    if (cursorStates[cursorState].state == "move") {
        moveState.cell = getRealRectPosition(event);
    }
    if (cursorStates[cursorState].state == "select") {
        selectState.cell = getRealRectPosition(event);
        selectState.selectedRect.pos = selectState.cell;
        selectState.selectedRect.size = {x:0, y:0}
    }
}
function onAppMouseUp(event) {
    if (cursorStates[cursorState].state == "move") {
        moveState.cell = null;
    }
}
function onAppMouseMove(event) {
    var rect = canvas.getBoundingClientRect();
    if (event.pageX < rect.left || event.pageX > rect.right || event.pageY < rect.top || event.pageY > rect.bottom) {
        return;
    }
    if (cursorStates[cursorState].state == "draw") {
        changeRectColor(event, lastValue); 
    }
    else if (cursorStates[cursorState].state == "move") {
        const pos = getRelativeRectPosition(event);
        fieldOffset.X = moveState.cell.x-pos.x;
        fieldOffset.Y = moveState.cell.y-pos.y;
        fieldOffset.X = getBetween(fieldOffset.X, 0, Math.max(0, fieldSize.X-Math.floor(size.x/2)));
        fieldOffset.Y = getBetween(fieldOffset.Y, 0, Math.max(0, fieldSize.Y-Math.floor(size.y/2)));
    }
    else if (cursorStates[cursorState].state == "select") {
        const pos = getRealRectPosition(event);
        selectState.selectedRect.size = {
            x: pos.x - selectState.selectedRect.pos.x,
            y: pos.y - selectState.selectedRect.pos.y
        }
    }
}

// Copy and Paste controller
function copyPasteController(e) {
    if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) 
        copySelected()
    if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) 
        pasteCopied();
    if (e.key === "Delete" ) 
        deleteSelected();
}

function fixRectData(rectData) {
    return {
        x: rectData.size.x >=0 ? rectData.pos.x : rectData.pos.x+rectData.size.x,
        y: rectData.size.y >=0 ? rectData.pos.y : rectData.pos.y+rectData.size.y,
        width:  (1 + Math.abs(rectData.size.x)),
        height: (1 + Math.abs(rectData.size.y))
    }
}
function copySelected() {
    selectState.copiedRect = structuredClone(selectState.selectedRect);
    const fixedRectData = fixRectData(selectState.copiedRect);
    selectState.copiedData = fieldData
        .slice(fixedRectData.x, fixedRectData.x + fixedRectData.width)
        .map(row => row.slice(fixedRectData.y, fixedRectData.y + fixedRectData.height));
}
function pasteCopied() {
    const fixedRectData = fixRectData(selectState.selectedRect);
    const copiedDataSize = {
        width: selectState.copiedData.length,
        height: selectState.copiedData[0].length
    }
    for (let x = 0; x < copiedDataSize.width; x++) {
        for (let y = 0; y < copiedDataSize.height; y++) {
            fieldData[fixedRectData.x+x][fixedRectData.y+y] = selectState.copiedData[x][y];
        }
    }
}
function deleteSelected() {
    const fixedRectData = fixRectData(selectState.selectedRect);

    for (let x = 0; x < fixedRectData.width; x++) {
        for (let y = 0; y < fixedRectData.height; y++) {
            fieldData[fixedRectData.x+x][fixedRectData.y+y] = 0;
        }
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




// Excel parser

function parseExcel(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        const data = new Uint8Array(arrayBuffer);
        let binaryString = "";

        for(let i = 0; i < data.length; i++) {
            binaryString += String.fromCharCode(data[i]);
        }
        
        const workbook = XLSX.read(binaryString, {
            type: 'binary',
            cellStyles: true
        });
        //console.log(workbook);
    
        let first_sheet_name = workbook.SheetNames[0];
        let worksheet = workbook.Sheets[first_sheet_name];
    
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        clearGrid();
        for (let R = range.s.r; R <= range.e.r; R++) {
            for (let C = range.s.c; C <= range.e.c; C++) {
                let cell_ref = XLSX.utils.encode_cell({r: R, c: C}); // Create cell reference
                let cell = worksheet[cell_ref];
                //console.log(cell_ref, cell);
                fieldData[C][R] = cell?.s?.bgColor?.rgb != 0xFFFFFF ? 1 : 0;
            }
        }
        setFieldSize(x = range.e.c+1, y = range.e.r+1);
    };
    reader.readAsArrayBuffer(file);
}