const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext('2d');

canvas.width = 700;
canvas.height = 700;


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

function drawRectangle(x1, y1, x2, y2) {
    ctx.rect(x1,y1,x2-x1,y2-y1);
    ctx.stroke();
}

function drawCircle(x1, y1, x2, y2) {
    ctx.arc(x1,y1, Math.sqrt((x2-x1)**2 + (y2-y1)**2), 0, 2*Math.PI);
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
    canvasStates.push(currentState);
    ctx.beginPath();
    pen.size = parseInt(document.querySelector('#line-width').value);
    let color = document.querySelector('#color').value;
    ctx.strokeStyle = color;
    ctx.lineWidth = pen.size;
    ctx.lineCap = 'round';
    mouse.px = mouse.x
    mouse.py = mouse.y

    switch (tool) {
        case 'pen':
            canvas.addEventListener('mousemove', freeDraw, false);
            break;
        case 'line':
            canvas.addEventListener('mousemove', lineTool, false);
            break;
        case 'rectangle':
            canvas.addEventListener('mousemove', rectTool, false);
            break;
        case 'circle':
            canvas.addEventListener('mousemove', circleTool, false);
            break;
        case 'eraser':
            canvas.addEventListener('mousemove', eraserTool, false);
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
    })
}

const lineTool = function(event) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.putImageData(last(canvasStates),0,0);
    drawLine(mouse.px, mouse.py, mouse.x, mouse.y);

    canvas.addEventListener('mouseup', function() {
        canvas.removeEventListener('mousemove', lineTool, false);
    })
}

const rectTool = function(event) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.putImageData(last(canvasStates),0,0);
    drawRectangle(mouse.px, mouse.py, mouse.x, mouse.y);

    canvas.addEventListener('mouseup', function() {
        canvas.removeEventListener('mousemove', rectTool, false);
    })
}

const circleTool = function(event) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.putImageData(last(canvasStates),0,0);
    drawCircle(mouse.px, mouse.py, mouse.x, mouse.y);

    canvas.addEventListener('mouseup', function() {
        canvas.removeEventListener('mousemove', circleTool, false);
    })
}

const eraserTool = function(event) {
    ctx.strokeStyle = 'white'
    ctx.lineTo(mouse.x,mouse.y);
    ctx.stroke();
    canvas.addEventListener('mouseup', function() {
        canvas.removeEventListener('mousemove', freeDraw, false);
    })

    canvas.addEventListener('mouseup', function() {
        canvas.removeEventListener('mousemove', eraserTool, false);
    })
}

// const fillTool = function(event) {
//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     let startX = mouse.x;
//     let startY = mouse.y;
//     let startPos = (startY * canvas.width + startX) * 4;
//     let currentColor = get('#color').value;
//     //clicked color
//     let startR = imageData.data[startPos];
//     let startG = imageData.data[startPos + 1];
//     let startB = imageData.data[startPos + 2];
//     //exit if color is the same
//     if (
//         currentColor.r === startR &&
//         currentColor.g === startG &&
//         currentColor.b === startB
//     ) {
//         return;
//     }
//     //Start with click coords
//     let pixelStack = [[startX, startY]];
//     let newPos, x, y, pixelPos, reachLeft, reachRight;
//     floodFill();
//     function floodFill() {
//         newPos = pixelStack.pop();
//         x = newPos[0];
//         y = newPos[1];
//         //get current pixel position
//         pixelPos = (y * canvas.width + x) * 4;
//         // Go up as long as the color matches and are inside the canvas
//         while (y >= 0 && matchStartColor(pixelPos)) {
//             y--;
//             pixelPos -= canvas.width * 4;
//         }
//         //Don't overextend
//         pixelPos += canvas.width * 4;
//         y++;
//         reachLeft = false;
//         reachRight = false;
//         // Go down as long as the color matches and in inside the canvas
//         while (y < canvas.height && matchStartColor(pixelPos)) {
//             colorPixel(pixelPos);
//             if (x > 0) {
//                 if (matchStartColor(pixelPos - 4)) {
//                 if (!reachLeft) {
//                     //Add pixel to stack
//                     pixelStack.push([x - 1, y]);
//                     reachLeft = true;
//                 }
//                 } else if (reachLeft) {
//                 reachLeft = false;
//                 }
//             }
//             if (x < canvas.width - 1) {
//                 if (matchStartColor(pixelPos + 4)) {
//                 if (!reachRight) {
//                     //Add pixel to stack
//                     pixelStack.push([x + 1, y]);
//                     reachRight = true;
//                 }
//                 } else if (reachRight) {
//                 reachRight = false;
//                 }
//             }
//             y++;
//             pixelPos += canvas.width * 4;
//         }
//         //recursive until no more pixels to change
//         if (pixelStack.length) {
//             floodFill();
//         }
//     }
//     //render floodFill result
//     canvas.putImageData(imageData, 0, 0);
//     //helpers
//     function matchStartColor(pixelPos) {
//         let r = imageData.data[pixelPos];
//         let g = imageData.data[pixelPos + 1];
//         let b = imageData.data[pixelPos + 2];
//         return r === startR && g === startG && b === startB;
//     }
//     function colorPixel(pixelPos) {
//         imageData.data[pixelPos] = currentColor.r;
//         imageData.data[pixelPos + 1] = currentColor.g;
//         imageData.data[pixelPos + 2] = currentColor.b;
//         imageData.data[pixelPos + 3] = 255;
//     }
//     }
    