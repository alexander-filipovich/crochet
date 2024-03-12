function init() {
    // Function to resize the PixiJS application
    resizeCanvas();

    // Initially draw the grid
    drawGrid();
    drawControls();
}
init()


window.addEventListener('mousedown', function(event) {
    isMouseDown = true;
});
window.addEventListener('mouseup', function(event) {
    isMouseDown = false;
});

window.addEventListener('wheel', onMouseScroll, { passive: false }); 
control_x.view.addEventListener('mousedown', onControlXClick);
control_y.view.addEventListener('mousedown', onControlYClick);

app.view.addEventListener('mousedown', onAppMouseClick);


window.addEventListener('mousemove', function(event) {
    if (Date.now() - lastEventTimestamp < 200) {
        //return;
    }
    if (isMouseDown) {
        if (activeCanvas == "control_x") {onControlXMouseMove(event)}
        else if (activeCanvas == "control_y") {onControlYMouseMove(event)}
        else if (activeCanvas == "app") {onAppMouseMove(event)}
    }
    lastEventTimestamp = Date.now();
});
activeCanvas = "control_x";
// Listen for window resize events
window.addEventListener('resize', resizeCanvas);

document.addEventListener('DOMContentLoaded', function() {
    const drawCrossesCheckbox = document.getElementById('drawCrossesCheckbox');

    const sizeXInput = document.getElementById('sizeXInput');
    const sizeYInput = document.getElementById('sizeYInput');
    sizeXInput.value = fieldSize.X;
    sizeYInput.value = fieldSize.Y;

    const clearButton = document.getElementById('clearButton');

    drawCrossesCheckbox.addEventListener('change', () => {setDrawCrosses(drawCrossesCheckbox.checked)});
    sizeXInput.addEventListener('change', setFieldSize);
    sizeYInput.addEventListener('change', setFieldSize);
    clearButton.addEventListener('click', clearGrid);
});

// Function to update a value in the array and redraw the grid
setInterval(() => {
    drawGrid();
    drawControls();
}, 100);

setInterval(() => {
    localStorage.setItem('fieldData', JSON.stringify(fieldData));
    localStorage.setItem('fieldSize', JSON.stringify(fieldSize));
}, 1000);
