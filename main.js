var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var isSelected = false;
var selectX = 0;
var selectY = 0;
var size = 100;
var offs = 68;
var mouseX = 0;
var mouseY = 0;
var tiles = new Array(canvas.height/size);

canvas.onmousedown = mouseDown;
canvas.onmouseup = mouseUp;
ctx.font = "50px Verdana";

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
function swap(a, b, c, d) {
  var s = tiles[a][b];
  tiles[a][b] = tiles[c][d];
  tiles[c][d] = s;
}
function mouseDown(e) {
  drawBoard();
  mouseX = Math.floor(e.layerX/size);
  mouseY = Math.floor(e.layerY/size);
}
function mouseUp(e) {
  var ax = Math.floor(e.layerX/size) - mouseX;
  var ay = mouseY - Math.floor(e.layerY/size);
  if (ax == 0 && ay == 0) { //Selection
    if (isSelected == false) {
      isSelected = true;
      selectX = mouseX;
      selectY = mouseY;
      ctx.fillStyle = '#9B59B6';
      ctx.globalAlpha = 0.2;
      ctx.fillRect(mouseX*size, mouseY*size, size, size);
      ctx.globalAlpha = 1;
    } else {
      isSelected = false;
      ax = Math.floor(e.layerX/size) - selectX;
      ay = selectY - Math.floor(e.layerY/size);
      if (ax >= -1 && ax <= 1 && ay >= -1 && ay <= 1 && Math.abs(ax) + Math.abs(ay) < 2) {
        swap(selectX, selectY, Math.floor(e.layerX/size), Math.floor(e.layerY/size));
        drawBoard();
      }
    }
  } else if (ax >= -1 && ax <= 1 && ay >= -1 && ay <= 1 && Math.abs(ax) + Math.abs(ay) < 2) { //Drag
    swap(mouseX, mouseY, Math.floor(e.layerX/size), Math.floor(e.layerY/size));
    drawBoard();
  }
}
function addSquare(x, y) {
  if (x/size%2 == y/size%2) {
    color = '#2980B9';
  } else {
    color = '#3498DB';
  }
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
  ctx.fillStyle = "black";
  ctx.fillText(tiles[x/size][y/size], x + offs/2, y + offs);
}
function drawBoard() {
  for (var x = 0; x < canvas.width; x++) {
    for (var y = 0; y < canvas.height; y++) {
      if (x%size == 0 && y%size == 0) {
        addSquare(x, y);
      }
    }
  }
}

for (var i = 0; i < tiles.length; i++) {
  tiles[i] = new Array(canvas.width/size);
  for (var j = 0; j < tiles[i].length; j++) {
    tiles[i][j] = rand(1,5);
  }
}
drawBoard();
