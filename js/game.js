'use strict'



const gLevel = {
    SIZE: 4,
    MINES: 2
}

const gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    lives: 3,
    secsPassed: 0
}

var gBoard = buildBoard()
const MINE_IMG = '<img src="/1st Delivery - Wednesday 2100/img/mine.png"'
const FLAG_IMG = '<img src="/1st Delivery - Wednesday 2100/img/flag.png"'

var gIsFirstMove
var gClickTime
var gInterval
var gIsHintMode


function onInit() {
    clearInterval(gInterval)
    gGame.isOn = true
    gIsFirstMove = true
    gGame.lives = 3
    gGame.markedCount = 0
    gGame.shownCount = 0
    renderTime(0)
    gBoard = buildBoard()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)

    var elGameMode = document.querySelector('h2 span')
    elGameMode.innerText = 'Wait for gamer to start \n 😑'

    var elMines = document.querySelector('.mines span')
    elMines.innerText = gLevel.MINES - gGame.markedCount

    var elLives = document.querySelector('.lives span')
    elLives.innerText = gGame.lives


}

function buildBoard() {


    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            const cell = {
                isShown: false,
                isMine: false,
                isMarked: false,
                minesAroundCount: 0,
            }
            board[i][j] = cell
        }
    }
    // board[2][2].isMine = true
    board[1][1].isMine = true
    setMinesNegsCount(board)
    return board
}

function renderBoard(board) {
    setMinesNegsCount(board)


    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr class="row-${i}" >\n`
        for (var j = 0; j < board.length; j++) {
            const cell = board[i][j]
            var dataName = `data-row="${i}" data-col="${j}"`
            var className = ` unshown`
            var cellContent = cell.minesAroundCount

            if (cell.isMine) {
                cellContent = MINE_IMG
                className += ' mine'
            }
            if (cell.isMarked) {
                cellContent = FLAG_IMG
                className = ' marked'
            } else if (cell.isShown) {
                className = ' shown'
            }

            strHTML += `\t<td class="cell${className}" ${dataName} onclick="onCellClicked(this,${i},${j})"><span>${cellContent}</span> </td>\n`

        }
    }
    strHTML += `</tr>\n`
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
    marked()


}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        var neighborsCount = 0
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine) board[i][j].minesAroundCount = -1
            neighborsCount = countNegs(i, j, board)
            board[i][j].minesAroundCount = neighborsCount
        }
    }
}

function timeUp(gClickTime) {
    var nowTime = Date.now()
    var strText
    var time = Math.round(((nowTime) - (gClickTime)) / 1000)
    strText = time
    renderTime(strText)
}

function renderTime(time) {
    var elH2Time = document.querySelector('.time span')
    elH2Time.innerText = time
}

function onCellClicked(elCell, i, j) {

    const cell = gBoard[i][j]

    if (!gGame.isOn) return
    if (cell.isMarked) return
    if (cell.isShown) return

    cell.isShown = true
    gGame.shownCount++

    if (gIsHintMode) {
        expandShown(gBoard,elCell,i,j)
        setTimeout(expandHide,1000,gBoard,i,j)
    }

    if (gIsFirstMove) {
        gClickTime = Date.now()
        gInterval = setInterval("timeUp(gClickTime)", 1000)
        putMines(i, j)
        gIsFirstMove = false
    }

    renderBoard(gBoard)
    if (cell.isMine) {
        gGame.lives--
        var elLives = document.querySelector('.lives span')
        elLives.innerText = gGame.lives
        if (gGame.lives === 0) return gameOver()
    }

    if (cell.minesAroundCount === 0) {
        expandShown(gBoard, cell, i, j)
        renderBoard(gBoard)
    }

    var elGameMode = document.querySelector('h2 span')
    elGameMode.innerText = 'Game On! \n😀'

    if (checkGameOver()) gameOver()



}

function onCellMarked(row, col) {

    var cell = gBoard[row][col]
    gGame.markedCount++
    console.log(gGame.markedCount)
    cell.isMarked = !(cell.isMarked)
    renderBoard(gBoard)

    var elMines = document.querySelector('.mines span')
    elMines.innerText = ((gLevel.MINES - gGame.markedCount) > 0) ? (gLevel.MINES - gGame.markedCount) : 0

    if (checkGameOver()) gameOver()

}

function putMines(rowFirstClick, colFirstClick) {
    var safeCells = getSafeCells(rowFirstClick, colFirstClick)

    for (var i = 0; i < gLevel.MINES; i++) {
        var randIdx = getRandomInt(0, safeCells.length)
        var randRow = safeCells[randIdx].i
        var randCol = safeCells[randIdx].j

        console.log('Row=' + randRow + ", Col=" + randCol)
        gBoard[randRow][randCol].isMine = true
        renderBoard(gBoard)
        safeCells.splice(randIdx, 1)
    }
}

function getSafeCells(rowFirstClick, colFirstClick) {
    var safeCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isMine && (rowFirstClick !== i && colFirstClick !== j)) safeCells.push({ i: i, j: j })
        }
    }
    return safeCells
}

function expandShown(board, elCell, rowIdx, colIdx) {
    
    if (gBoard[rowIdx][colIdx].isMine && !gIsHintMode) return
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[i].length) continue
            if (!gBoard[i][j].isShown) {
                gBoard[i][j].isShown = true
                if(!gIsHintMode)gGame.shownCount++
            }
        }
    }
}

function expandHide(board, rowIdx, colIdx){
    
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (gBoard[i][j].isShown) {
                gBoard[i][j].isShown = false
            }
            gIsHintMode=false

            renderBoard(gBoard)
        }
    }
}

function checkGameOver() {
    return (gGame.markedCount + gGame.shownCount === gLevel.SIZE ** 2)
}

function gameOver() {
    clearInterval(gInterval)
    var elGameMode = document.querySelector('h2 span')
    elGameMode.innerText = (checkGameOver()) ? 'Game over, you won! \n 😎' : 'Game over, you lost! \n 😞 '
    console.log(elGameMode)
    console.log('Game Over')
    gGame.isOn = false

}

function marked() {
    var cells = document.querySelectorAll('.cell'); // Select all cells in the table
    cells.forEach(cell => {
        cell.addEventListener('contextmenu', event => {
            event.preventDefault(); // prevent the browser's default context menu from appearing
            const row = event.target.dataset.row; // Get the row number of the clicked cell
            const col = event.target.dataset.col; // Get the column number of the clicked cell
            onCellMarked(row, col); // Run your function with the row and column of the clicked cell
        });
    });
}

function updateLevel(num) {
    switch (num) {
        case 4:
            gLevel.SIZE = 4
            gLevel.MINES = 2
            break;
        case 8:
            gLevel.SIZE = 8
            gLevel.MINES = 14
            break;
        case 12:
            gLevel.SIZE = 12
            gLevel.MINES = 32
            break;

        default:
            return null
    }

    onInit()
}

function hint(hintNum) {
    gIsHintMode = true
    var elHint = document.querySelector(`#hint${hintNum}`)
    elHint.style.backgroundColor = 'yellow'
}