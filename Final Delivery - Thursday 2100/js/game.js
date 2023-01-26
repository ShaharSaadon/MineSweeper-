'use strict'

const gLevel = {
    SIZE: 4,
    MINES: 2
}

const gGame = {
    isOn: true,
    isManuallyMode: false,
    shownCount: 0,
    markedCount: 0,
    lives: 3,
    secsPassed: 0,
    safeclicks: 3
}

var gBoard = buildBoard()
const MINE_IMG = '<img src="img/mine.png"'
const FLAG_IMG = '<img src="img/flag.png"'

var gRecordMoves = []
var gIsFirstMove
var gIsSafeClick
var gClickTime
var gInterval
var gCurrBoard



function onInit() {
    clearInterval(gInterval)
    gGame.isOn = true
    gIsFirstMove = true
    gGame.isManuallyMode = false
    gIsHintMode = false
    gIsMegaHint = 0
    gRecordMoves = []
    gMegaHintPositions = []
    gGame.lives = 3
    gGame.markedCount = 0
    gGame.shownCount = 0
    gGame.safeclicks = 3
    gBoard = buildBoard()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    onInitRenders()


    document.addEventListener('contextmenu', event => {
        event.preventDefault();
    })


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
    return board
}

function renderBoard(board) {


    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr class="row-${i}" >\n`
        for (var j = 0; j < board.length; j++) {
            const cell = board[i][j]
            var dataName = `data-row="${i}" data-col="${j}"`
            var className = ` unshown`
            var cellContent = (cell.minesAroundCount) ? cell.minesAroundCount : ''

            if (cell.isMine) {
                cellContent = `<img ${dataName} src="img/mine.png"`
                className += ' mine'
            }
            if (cell.isMarked) {
                cellContent = `<img ${dataName} src="img/flag.png"`
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

function onInitRenders() {

    renderTime(0)

    var elGameMode = document.querySelector('h2 span')
    elGameMode.innerText = 'Wait for gamer to start \n 😑'

    var elNumOfMines = document.querySelector('.mines span')
    elNumOfMines.innerText = gLevel.MINES - gGame.markedCount

    var elNumOfLives = document.querySelector('.lives span')
    elNumOfLives.innerText = gGame.lives

    var elCell = document.querySelector('h3 span')
    console.log(elCell)
    elCell.innerText = gGame.safeclicks

    var elHints = document.querySelectorAll(`.hint`)
    for (var i = 0; i < elHints.length; i++) {
        elHints[i].style.backgroundColor = 'inherit'
        elHints[i].style.display = 'inline'

    }

    var elExterminator = document.querySelector('.mine-exterminator')
    elExterminator.style.display = 'inline'

    var elBestScore = document.querySelector('.best-score span')
    elBestScore.innerText = localStorage.getItem(`BestScore${gLevel.SIZE}`)


}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        var neighborsCount = 0
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine) board[i][j].minesAroundCount = -1
            else {
                neighborsCount = countNegs(i, j, board)
                board[i][j].minesAroundCount = neighborsCount
            }
        }
    }
}

function onCellClicked(elCell, i, j) {
    const cell = gBoard[i][j]

    if (gGame.isManuallyMode) return (onCellClickedManually(elCell, i, j))
    if (gIsHintMode) return hintMove(gBoard, i, j)
    if (gIsMegaHint) return (onCellClickedMegaHint(elCell, i, j))
    if (!gGame.isOn) return
    if (cell.isMarked) return
    if (cell.isShown) return
    
    gCurrBoard = JSON.parse(JSON.stringify(gBoard))
    gRecordMoves.push(gCurrBoard)
    cell.isShown = true
    gGame.shownCount++

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

    if (!gBoard[row][col].isMarked && gGame.markedCount === gLevel.MINES) return
    if (cell.isMarked) {
        cell.isMarked = false
        gGame.markedCount--
    } else {
        cell.isMarked = true
        gGame.markedCount++

    }
    gRecordMoves.push(gBoard)
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
        gBoard[randRow][randCol].isMine = true
        renderBoard(gBoard)
        safeCells.splice(randIdx, 1)
    }
    setMinesNegsCount(gBoard)

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

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[i].length) continue
            if (!gBoard[i][j].isShown && !gBoard[i][j].isShown.isMine && !gBoard[i][j].isMarked) {
                onCellClicked(null, i, j)
            }
        }
    }
}

function checkGameOver() {
    if ((gGame.shownCount + gGame.markedCount) >= gLevel.SIZE ** 2 && gGame.lives > 0) return true
    else return false
}

function gameOver() {
    clearInterval(gInterval)
    var elGameMode = document.querySelector('h2 span')
    elGameMode.innerText = (checkGameOver()) ? 'Game over, you won! \n 😎' : 'Game over, you lost! \n 😞 '
    if (checkGameOver()) checkingHighScore()
    console.log('Game Over')
    gGame.isOn = false
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

function handleMouseRightClick(ev) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    console.log(ev)
    if (ev.button === 2) (onCellMarked(row, col))
}

function safeCell() {
    var safeCells = getUnshownSafeCells()
    var randIdx = getRandomInt(0, safeCells.length)
    var randRow = safeCells[randIdx].i
    var randCol = safeCells[randIdx].j

    if (gIsSafeClick && !gGame.isOn && gGame.safeclicks === 0) return
    gIsSafeClick = true
    gGame.safeclicks--

    var elCell = document.querySelector(`[data-row='${randRow}'][data-col='${randCol}']`)
    elCell.style.transition = '3s'
    elCell.style.backgroundColor = 'black'
    
    var elCell = document.querySelector('h3 span')
    elCell.innerText = gGame.safeclicks

    setTimeout(() => {
        gIsSafeClick = false
        elCell.style.backgroundColor = 'white'
    }, 4000);



    // gBoard[randRow][randCol].isMine = true
    // renderBoard(gBoard)
    // safeCells.splice(randIdx, 1)
}

function getUnshownSafeCells() {
    var safeCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) safeCells.push({ i: i, j: j })
        }
    }
    return safeCells
}

function getMinesCells() {
    var mineCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) mineCells.push({ i: i, j: j })
        }
    }
    return mineCells
}

function mineExterminator() {

    var mineCells = getMinesCells()
    var numOfMines = (gLevel.MINES === 2) ? 2 : 3
    for (var i = 0; i < numOfMines; i++) {
        var randIdx = getRandomInt(0, mineCells.length)
        var randRow = mineCells[randIdx].i
        var randCol = mineCells[randIdx].j
        gBoard[randRow][randCol].isMine = false
        gGame.markedCount++

        var elMines = document.querySelector('.mines span')
        elMines.innerText = gLevel.MINES - gGame.markedCount
        mineCells.splice(randIdx, 1)
    }
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    alert(`${numOfMines} mines were exploded!`)
    setTimeout(() => {
        var elExterminator = document.querySelector('.mine-exterminator')
        console.log(elExterminator)
        elExterminator.style.display = 'none'
    }, 1000);



}

function undo() {
    var lastMove = gRecordMoves.pop()
    gBoard = JSON.parse(JSON.stringify(lastMove))
    renderBoard(gBoard)
}

function checkingHighScore() {

    if (localStorage.getItem(`BestScore${gLevel.SIZE}`)) {
        if (gGame.secsPassed < +localStorage.getItem(`BestScore${gLevel.SIZE}`)) {
            localStorage.setItem(`BestScore${gLevel.SIZE}`, gGame.secsPassed)
            alert('Congratulations you got the best score')
        }
    } else {
        localStorage.setItem(`BestScore${gLevel.SIZE}`, gGame.secsPassed)
    }

    var elBestScore = document.querySelector('.best-score span')
    elBestScore.innerText = localStorage.getItem(`BestScore${gLevel.SIZE}`)

}

