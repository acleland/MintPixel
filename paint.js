const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext('2d');


canvas.width = 500;
canvas.height = 250;

center = (canvas.width);

let mouse = {
    x: 0,
    y: 0
}
let penDown = false;

let pen = {
    down: false,
    size: 1

}

canvas.addEventListener('mousemove', function(e) {
    mouse.px = mouse.x
    mouse.py = mouse.y
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
}, false);

canvas.addEventListener('mousedown', function(e) {
    ctx.beginPath();
    pen.down= true;
    pen.size = parseInt(document.querySelector('#pen-size').value);
    let color = document.querySelector('#color').value;
    ctx.strokeStyle = color;
    ctx.lineWidth = pen.size;
    canvas.addEventListener('mousemove', onPaint, false);
}, false);

canvas.addEventListener('mouseup', function() {
    canvas.removeEventListener('mousemove', onPaint, false);
    pen.down = false;
}, false);


var onPaint = function() {
    ctx.arc(mouse.x, mouse.y, pen.size/2, 0, 2*Math.PI);
    ctx.fill;
    ctx.stroke()
    ctx.moveTo(mouse.x, mouse.y);
};

