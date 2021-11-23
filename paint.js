const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext('2d');




canvas.width = 500;
canvas.height = 250;

let canvasStates = []

let mouse = {
    x: 0,
    y: 0,
    hist: []
}


let pen = {
    down: false,
    size: 1

}

// Helper functions
function get(el) {
    return document.querySelector(el);
}

function last(arr) {
    return arr[arr.length - 1];
}

function clearCanvas() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
}

function drawLine(x1, y1, x2, y2) {
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
}




canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
    mouse.hist.push({x: mouse.x, y: mouse.y}) 
    if (mouse.hist.length > 3) mouse.hist.shift();
}, false);

let counter = 0;
canvas.addEventListener('mousedown', function(e) {
    let tool = get('#select-tool').value;
    const currentState = ctx.getImageData(0,0,canvas.width,canvas.height)
    canvasStates.push(currentState)
    counter += 1
    console.log('mouse down event', counter);

    switch (tool) {
        case 'pen':
            console.log(tool);
            ctx.beginPath();
            pen.down= true;
            pen.size = parseInt(document.querySelector('#line-width').value);
            let color = document.querySelector('#color').value;
            ctx.strokeStyle = color;
            ctx.lineWidth = pen.size;
            ctx.lineCap = 'round';
            ctx.currentState = currentState;
            canvas.addEventListener('mousemove', freeDraw, false);
            break;
        case 'line':
            console.log(tool);
            ctx.save();
            mouse.px = mouse.x
            mouse.py = mouse.y
            canvas.addEventListener('mousemove', lineTool, false);
            break;
        case 'rectangle':
            console.log(tool);
            break;
        case 'circle':
            console.log(tool);
            break;
        case 'fill':
            console.log(tool);
            break;
        case 'eraser':
            console.log(tool);
            break;
        default:
            console.log('no tool selected');
            break;
    
    }
    
    
}, false);

clearButton = get('#clear-btn');
clearButton.addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
})

saveButton = get('#save-btn');
saveButton.addEventListener('click', function() {
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'drawing.png');
    // let canvas = document.getElementById('myCanvas');
    let dataURL = canvas.toDataURL('image/png');
    let url = dataURL.replace(/^data:image\/png/,'data:application/octet-stream');
    downloadLink.setAttribute('href',url);
    downloadLink.click();
    
})

const freeDraw = function(event) {
    // if (mouse.hist.length >=3){
    //     p3 = mouse.hist.pop();
    //     p2 = mouse.hist.pop();
    //     p1 = mouse.hist.pop();
    //     ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    // } 
    ctx.lineTo(mouse.x,mouse.y);
    ctx.stroke();
    canvas.addEventListener('mouseup', function() {
        canvas.removeEventListener('mousemove', freeDraw, false);
        pen.down = false;
    })
}

const lineTool = function(event) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(ctx.currentState,0,0);
    drawLine(mouse.px, mouse.py, mouse.x, mouse.y);

    canvas.addEventListener('mouseup', function() {
        canvas.removeEventListener('mousemove', lineTool, false);
    })
}

drawLine(10,20,40,60);
canvasStates.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
//ctx.clearRect(0,0,canvas.width,canvas.height);
ctx.putImageData(last(canvasStates), 50,0);



