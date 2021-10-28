const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const size = 100
const width = canvas.width / size
const tiles = new Array(width ** 2)

const redCandy = new Image()
const orangeCandy = new Image()
const yellowCandy = new Image()
const greenCandy = new Image()
const blueCandy = new Image()
const purpleCandy = new Image()

const candies = [
    redCandy,
    orangeCandy,
    yellowCandy,
    greenCandy,
    blueCandy,
    purpleCandy
]

let isSelected = false
let origin = 0
let destination = 0
let selection = 0

function mouseToPosition([mouseX, mouseY]) {
  const offsetX = parseInt(window.getComputedStyle(canvas).marginLeft) + parseInt(window.getComputedStyle(document.body).marginLeft)
  const offsetY = parseInt(window.getComputedStyle(canvas).marginTop) + parseInt(window.getComputedStyle(document.body).marginTop)
  let column = Math.floor((mouseX - offsetX) / size)
  while (column >= width) column--
  let row = Math.floor((mouseY - offsetY) / size)
  while (row >= width) row--
  return column + width * row
}

function positionToCoordinates(i) {
  return [i % width, Math.floor(i / width)]
}

function swap(i, j) {
  const temp = tiles[i]
  tiles[i] = tiles[j]
  tiles[j] = temp
}

function drawSelection(i) {
  ctx.fillStyle = '#9B59B6'
  ctx.globalAlpha = 0.2
  const [x, y] = positionToCoordinates(i)
  ctx.fillRect(x * size, y * size, size, size)
  ctx.globalAlpha = 1
}

function checkRowOfThree () {
  for (let i = 0; i < width ** 2; i++) {

    if (i % width > width - 3) {
      console.log(i)
      continue
    }

    const row = [i, i + 1, i + 2]
    const decidedColor = tiles[i]
    const isBlank = tiles[i] === null

    if (row.every(candy => tiles[candy] === decidedColor && !isBlank)) {
      row.forEach(candy => tiles[candy] = null)
      return true
    }
  }
  return false
}

function checkColumnOfThree() {
  for (let i = 0; i < (width * (width - 2)); i++) {
    const column = [i, i + width, i + width * 2]
    const decidedColor = tiles[i]
    const isBlank = decidedColor === null

    if (column.every(candy => tiles[candy] === decidedColor && !isBlank)) {
      column.forEach(candy => tiles[candy] = null)
      return true
    }
  }
  return false
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function moveDown() {

  let isFalling = false
  do {
    isFalling = false
    for (let i = 0, showChanges = false; i <= (width * (width - 1)); i++) {
      const isFirstRow = i < width
      if (isFirstRow && tiles[i] === null) {
        tiles[i] = candies[Math.floor(Math.random() * candies.length)]
        isFalling = true
        showChanges = true
      }

      if ((tiles[i + width]) === null) {
        tiles[i + width] = tiles[i]
        tiles[i] = null
        isFalling = true
        showChanges = true
      }

      if (showChanges && i % width === 0) {
        drawBoard()
        await sleep(100)
        showChanges = false
      }

    }
    if (!isFalling) {
      if (checkColumnOfThree() || checkRowOfThree()) isFalling = true
    }
  } while (isFalling)

}

function mouseDown(e) {
  origin = mouseToPosition([e.pageX, e.pageY])
}

async function mouseUp(e) {

  destination = mouseToPosition([e.pageX, e.pageY])

  if (origin === destination) {

    if (!isSelected) {
      isSelected = true
      selection = origin
      drawSelection(selection)
      return
    } else {
      isSelected = false
      origin = selection
      drawCandy(selection)
    }
  }

  swap(origin, destination)
  drawBoard()
  await sleep(100)

  const validMoves = [
    origin - 1,
    origin - width,
    origin + 1,
    origin + width
  ]

  const validMove = validMoves.includes(destination)
  const isColumnOfThree = checkColumnOfThree()
  const isRowOfThree = checkRowOfThree()

  console.log(validMove, isColumnOfThree)

  if (validMove && (isColumnOfThree || isRowOfThree)) {
    moveDown()
  } else {
    swap(destination, origin)
    drawBoard()
    await sleep(100)
  }
}

function drawCandy(i) {
  const [x, y] = positionToCoordinates(i)
  // Background grid
  ctx.fillStyle = (x % 2 === y % 2) ? '#2980B9' : '#3498DB'
  ctx.fillRect(x * size, y * size, size, size)
  // Candy
  if (!tiles[i]) return

  const offset = size * 0.7
  const ratio = Math.min(offset / tiles[i].width, offset / tiles[i].height);

  ctx.drawImage(
      tiles[i],
      x * size + size / 2 - tiles[i].width * ratio / 2,
      y * size + size / 2 - tiles[i].height * ratio / 2,
      tiles[i].width * ratio,
      tiles[i].height * ratio
  )
}

function drawBoard() {
  for (let i = 0; i < tiles.length; i++) {
    drawCandy(i)
  }
}

function createBoard() {
  for (let i = 0; i < tiles.length; i++) {
    tiles[i] = candies[Math.floor(Math.random() * candies.length)]
  }
}

async function init() {
  redCandy.src = 'images/red.png'
  orangeCandy.src = 'images/orange.png'
  yellowCandy.src = 'images/yellow.png'
  greenCandy.src = 'images/green.png'
  blueCandy.src = 'images/blue.png'
  purpleCandy.src = 'images/purple.png'

  canvas.onmousedown = mouseDown
  canvas.onmouseup = mouseUp
  ctx.font = "50px Verdana"

  createBoard()
  await sleep(100)
  drawBoard()
  moveDown()
}

init()
console.log(tiles.map(item => item.src))
