'use strict'

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

let gElCanvas
let gCtx
let gLastPos = { x: null, y: null }



function onInit() {
    renderImages()
    gElCanvas = document.getElementById('my-canvas')
    gCtx = gElCanvas.getContext('2d')
    addListeners()
    renderMemes()
    renderSlider()
    //reseize canvas

}

function renderMeme() {
    onDrawImage()
    onDrawText()
}

function onDrawImage() {
    const img = new Image()
    const meme = getMeme()

    if (!meme.selectedImgId) {
        img.src = gUserImage
    } else {
        const memeImg = getSelectedImg(meme.selectedImgId)
        img.src = memeImg.url
    }
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function onDrawText() {
    const meme = getMeme()

    if (!meme.lines.length) return;
    if (!meme.selectedImgId) return;

    meme.lines.forEach(line => {
        drawText(line);
    });

    drawRectOnText(gMeme.lines[gMeme.selectedLineIdx])
}

function onSetLineText() {
    let elText = document.querySelector('.meme-text')
    setLineText(elText.value)
    renderMeme()
}

function onChangeColor(color) {
    changeColor(color)
    renderMeme()
}

function onChangeStrokeColor(color) {
    changeStrokeColor(color)
    renderMeme()
}

function onChangeFontSize(operator) {
    changeFontSize(operator)
    renderMeme()
}

function onChangeAlign(direction) {
    changeAlign(direction)
}

function onChangeText(txt) {
    const currLine = getDragLine();
    setLineText(txt);
    renderMeme();
    drawRectOnText(currLine);
}

function onChangeLines(isNewLine) {
    changeLines()
    document.querySelector('.meme-text').focus()
    if (isNewLine) {
        document.querySelector('.meme-text').value = ''
    } else {
        let elText = document.querySelector('.meme-text')
        elText.value = getMeme().lines[gMeme.selectedLineIdx].txt
    }

}

function onChangeFont(fontFamily) {
    changeFont(fontFamily)
}

function addListeners() {
    addMouseListeners()
    // addTouchListeners()
    //Listen for resize ev
    //   window.addEventListener('resize', () => {
    //     onInit()
    // })
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
}

function onDown(ev) {
    document.body.style.cursor = 'grabbing'
    const pos = getEvPos(ev)
    if (!isTouchLine(pos)) return
    gLastPos = pos
    gMeme.lines[gMeme.selectedLineIdx].isDrag = true
}

// function isTouchLine(pos) {
//     var isTouchLine = false
//     const meme = getMeme()
//     const { x, y } = pos
//     var possibleLines = meme.lines.filter(line =>
//         y > line.position.y && y < line.position.y + line.height)

//     possibleLines.forEach((line) => {
//         var text = line.txt
//         var textWidth = gCtx.measureText(text)
//         console.log('x', x, 'y', y)
//         if ((x > (gElCanvas.width - textWidth.width) / 2) && (x < (gElCanvas.width - textWidth.width))) {
//             var lineIdx = gMeme.lines.findIndex(line => line.txt === text)
//             console.log('yes', lineIdx)
//             gMeme.selectedLineIdx = lineIdx
//             isTouchLine = true
//         }
//     });
//     renderMeme()
//     return isTouchLine
// }

function isTouchLine(clickedPos) {
    const lineIdx = gMeme.lines.findIndex(function (line) {
        if (line.align === 'left') {
            return (
                clickedPos.x > line.position.x &&
                clickedPos.x < line.position.x + (line.size / 2) * line.txt.length &&
                clickedPos.y < line.position.y &&
                clickedPos.y > line.position.y - line.size
            );
        } else if (line.align === 'center') {
            const halfWordPx = ((line.size / 2) * line.txt.length) / 2;
            return (
                clickedPos.x > line.position.x - halfWordPx &&
                clickedPos.x < line.position.x + halfWordPx &&
                clickedPos.y < line.position.y &&
                clickedPos.y > line.position.y - line.size
            );
        } else {
            return (
                (clickedPos.x > line.position.x - (line.size / 2) * line.txt.length) &
                (clickedPos.x < line.position.x) &&
                clickedPos.y < line.position.y &&
                clickedPos.y > line.position.y - line.fontSize
            );
        }
    });

    if (lineIdx === -1) return false;
    gMeme.selectedLineIdx = lineIdx;
    gMeme.lines[lineIdx].isDrag = true;
    gMeme.isDrag = true;
    let elText = document.querySelector('.meme-text')
    elText.value = getMeme().lines[gMeme.selectedLineIdx].txt
    document.querySelector('.meme-text').focus()
    return true;
}

function onMove(ev) {
    const line = getDragLine()
    if (!line) return
    if (!line.isDrag) return
    const pos = getEvPos(ev)
    const { x, y } = pos
    moveLine(x, y);
    gLastPos = pos
    renderMeme()
}

function onUp() {
    gMeme.lines[gMeme.selectedLineIdx].isDrag = false;
    document.body.style.cursor = 'auto';
    renderMeme()
}

function getEvPos(ev) {
    // Gets the offset pos , the default pos
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }
    // Check if its a touch ev
    if (TOUCH_EVS.includes(ev.type)) {
        //soo we will not trigger the mouse ev
        ev.preventDefault()
        //Gets the first touch point
        ev = ev.changedTouches[0]
        //Calc the right pos according to the touch screen
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}

function onAddLine() {
    addLine()
}

function onDeleteSelectedLine() {
    deleteSelectedLine()
}

function onSave() {
    const userMeme = getMeme()
    saveMeme(userMeme)
    onClearTextInput()
    resetMeme()
}

function onClearTextInput() {
    const elMemeText = document.querySelector('.meme-text')
    elMemeText.value = ''
}

function onRandomMeme() {
    createRandomMeme()
}

function renderSlider() {
    const emojiRange = document.querySelector('.emoji-range');
    const emojiContainer = document.querySelector('.moji');
    const mojis = ['😄', '🙂', '😐', '😑', '☹️', '😩', '😠', '😡', '🤢', '😤', '💩'];

    emojiRange.addEventListener('input', (e) => {
        let rangeValue = e.target.value;
        emojiContainer.textContent = mojis[rangeValue];

    });



}

function onGetEmoji() {
    const elEmoji = document.querySelector('.moji').textContent
    console.log(elEmoji)
    addLine(elEmoji)
}


