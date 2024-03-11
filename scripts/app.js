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
    document.getElementById('clearButton').addEventListener('click', clearGrid);
});

// Function to update a value in the array and redraw the grid
setInterval(() => {
    drawGrid();
    drawControls();
}, 100);

setInterval(() => {
    localStorage.setItem('fieldData', JSON.stringify(fieldData));
}, 1000);
