'use strict'



const gLevel = {
    SIZE: 4,
    MINES: 2
}

const gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gBoard = buildBoard()
const MINE_IMG = '<img src="/Day13-14-Sprint1/1st Delivery - Wednesday 2100/img/mine.png">'
const FLAG_IMG = '<img src="/Day13-14-Sprint1/1st Delivery - Wednesday 2100/img/flag.png">'


function onInit() {
    gGame.isOn = true
    gGame.markedCount = 0
    gGame.shownCount = 0
    gBoard = buildBoard()
    renderBoard(gBoard)
    var elGameMode = document.querySelector('h2 span')
    elGameMode.innerText = 'Wait for gamer to start'
    marked()


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
    board[2][2].isMine = true
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


}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        var neighborsCount = 0
        for (var j = 0; j < board[0].length; j++) {
            neighborsCount = countNegs(i, j, board)
            board[i][j].minesAroundCount = neighborsCount
        }
    }
}

function onCellClicked(elCell, i, j) {
    debugger
     if(checkGameOver()) gameOver()

    const cell = gBoard[i][j]

    if (!gGame.isOn) return
    if (cell.isMarked) return
    if (cell.isShown) return

    cell.isShown = true
    gGame.shownCount++
    renderBoard(gBoard)
    if (cell.isMine) return gameOver(i, j)

    if (cell.minesAroundCount === 0) {
        expandShown(gBoard, cell, i, j)
        renderBoard(gBoard)
    }
    var elGameMode = document.querySelector('h2 span')
    elGameMode.innerText = 'Game On!'


}

function onCellMarked(row, col) {
    const cell = gBoard[row][col]
    cell.isMarked = true
    renderBoard(gBoard)

}

function putMines() {
    var safeCells = getSafeCells()

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

function getSafeCells() {
    var safeCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isMine) safeCells.push({ i: i, j: j })
        }
    }
    return safeCells
}

function expandShown(board, elCell, rowIdx, colIdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[i].length) continue
            if (!gBoard[i][j].isShown) {
                gBoard[i][j].isShown = true
                gGame.shownCount++
                if(checkGameOver()) gameOver()
            }
        }
    }
}

function checkGameOver() {

    return ((gGame.shownCount+gGame.markedCount===((gLevel.SIZE**2)-gLevel.MINES)))
}

function gameOver() {
    var elGameMode = document.querySelector('h2 span')
    elGameMode.innerText = 'Game Over'
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
            gLevel.SIZE=4
            gLevel.MINES=2
            break;
        case 8:
            gLevel.SIZE=8
            gLevel.MINES=14
            break;
        case 12:
            gLevel.SIZE=12
            gLevel.MINES=32
            break;

        default:
            return null
    }

onInit()
}