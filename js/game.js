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

function onInit() {
    gGame.isOn = true
    gGame.markedCount = 0
    gGame.shownCount = 0
    gBoard = buildBoard()
    renderBoard(gBoard)
    var elGameMode = document.querySelector('h2 span')
    elGameMode.innerText = 'Wait for gamer to start'
    // putMines(gBoard)

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
            var className = ` cell-${i}-${j}`
            var cellContent = gBoard[i][j].isMine ? MINE_IMG : gBoard[i][j].minesAroundCount
            className += cell.isMine ? ' mine' : ''
            className += cell.isMarked ? ' marked' : ''
            className += cell.isShown ? ' shown' : ' unshown'
            strHTML += `\t<td class="cell${className}"  onclick="onCellClicked(this,${i},${j})"><span>${cellContent}</span> </td>\n`

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
    const cell = gBoard[i][j]

    if (!gGame.isOn) return
    if (cell.isMarked) return

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

function onCellMarked(elCell) {
    const cell = gBoard[i][j]
    cell.isShown = true

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
            }
        }
    }
}

function gameOver() {
    var elGameMode = document.querySelector('h2 span')
    elGameMode.innerText = 'Game Over'
    console.log('Game Over')
    gGame.isOn = false


}
