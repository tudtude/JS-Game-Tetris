const display = document.getElementById('display').getContext('2d') // 1 
const row = 20  
const column = 10 
const vacant = 'white'

let frameCount = 0
let gameStatus = 'running'
let score = 0

display.scale(20, 20) 

const board = [] 
for (let r = 0; r < row; r++) {
    board[r] = []
    for (let c = 0; c < column; c++) {
        if (!board[r][c]) {
            board[r][c] = vacant
        }
    }
}

let tetris = createTetris()

function createTetris() {
    let itemsNumber = Math.floor( Math.random() * items.length )
    return {
        x: 3,
        y: -1,
        rotate: 0,
        body: items[itemsNumber][0],
        color: items[itemsNumber][1]
    }
}

function drawSquare(x, y, color) {
    display.fillStyle = color
    display.fillRect(x, y, 1, 1)
    
    display.strokeStyle = 'black'
    display.lineWidth = 1/60
    display.strokeRect( x, y, 1, 1)
}

function drawBoard() { // 8
    for (let r = 0; r < row; r++) {
        for (let c = 0; c < column; c++) {
            drawSquare(c, r, board[r][c])
        }
    }
}

function gameInterval() {
    frameCount++
    if (frameCount % 60 == 0) {
        drop()
        drawBoard()
        drawTetris()
    }
    if( gameStatus == 'gameOver' ){
        console.log( 'over at loop')
        return
    }
    requestAnimationFrame(gameInterval)
}

function drawTetris() {
    let item = tetris.body[tetris.rotate]
    for (let r = 0; r < item.length; r++) {
        for (let c = 0; c < item[r].length; c++) {
            if (item[r][c]) {
                drawSquare(c + tetris.x, r + tetris.y, tetris.color )
            }
        }
    }
}

function drop() {
    if( isCollide(0, 1, tetris.body[tetris.rotate]) ){
        fixed()
        tetris = createTetris()
        drawBoard()
        drawTetris()
    }else{
        tetris.y++
        drawBoard()
        drawTetris()
    }
}

function move(direction) {
    if( !isCollide( direction, 0, tetris.body[tetris.rotate])){
        tetris.x += direction
        drawBoard()
        drawTetris()
    }
}

function rotate(direction) {
    let oldRotate = tetris.rotate
    tetris.rotate += direction
    tetris.rotate = tetris.rotate % 4
    if( tetris.rotate < 0){
        tetris.rotate = 4 + tetris.rotate
    }
    if( isCollide ( 0, 0, tetris.body[tetris.rotate])){
        if( tetris.x < column/2){
            tetris.x += 1
        }
        if( tetris.x > column/2){
            tetris.x -= 1
        }
    }
    if( isCollide(0, 0, tetris.body[tetris.rotate])){
        if( tetris.x < column/2){
            tetris.x += 1
        }
        if( tetris.x > column/2){
            tetris.x -= 1
        }
    }
    drawBoard()
    drawTetris()
}

function isCollide( x, y, testTetris ){
    for( let r = 0; r < testTetris.length; r ++ ){
        for( let c = 0; c < testTetris[r].length; c ++ ){
            let newX = tetris.x + x + c 
            let newY = tetris.y + y + r
            if( testTetris[r][c]){
                if( newX > column || newX < 0 || newY >= row ){
                    return true
                }
                if( newY < 0 ){
                    continue
                }
                if( board[newY][newX] != vacant ){
                    return true
                }
            }
        }
    }
    return false
}

function fixed(){
    let tetrisBody = tetris.body[tetris.rotate]
    if( tetris.y < 0 ){
        gameStatus = 'gameOver'
        return
    }
    for( let r = 0; r < tetrisBody.length; r ++ ){
        for( let c = 0; c < tetrisBody[r].length; c ++ ){
            if(tetrisBody[r][c]){
                board[ tetris.y + r ][ tetris.x + c] = tetris.color
            }
        }
    }
    removeFull()
}

function removeFull(){
    let multiplier = 1
    for( let r = 0; r < row; r ++ ){
        let isFull = true
        for( let c = 0; c < column; c ++ ){
            isFull = isFull && ( board[r][c] != vacant )
        }
        if( isFull ){
            for( let y = r; y > 1; y --){
                for( let c = 0; c < column; c ++){
                    board[y][c] = board[y-1][c]
                }
            }
            score += 10*multiplier
            multiplier ++
            updateScore()
        }
    }
}

function updateScore(){
    document.getElementById('score').innerHTML = 'Score = ' + score
}

drawBoard()
drawTetris()
gameInterval()

document.getElementById('score').innerHTML = 'Score = ' + score
document.addEventListener('keydown', function (event) {
    if( gameStatus == 'running'){
        if (event.keyCode == 40) drop()
        if (event.keyCode == 37) move(-1)
        if (event.keyCode == 39) move(1)
        if (event.keyCode == 17) rotate( -1)
        if (event.keyCode == 32) rotate( 1 )
    }
})