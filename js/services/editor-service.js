'use strict'

let gMeme = createMeme()

function createMeme() {
    return {
        selectedImgId: null,
        selectedLineIdx: 0,
        lines: [
            {
                txt: '',
                size: 35,
                align: 'center',
                color: 'white',
                position: { x: 200, y: 100 },
                stroke: 'black',
                font: 'impact',
                isDrag: false,
            },
        ]
    }
}

function resetMeme() {
    gMeme = createMeme();
}

function getMeme() {
    return gMeme
}

function drawText(line) {
    let { txt, size, align, position, color, font, stroke } = line
    if (txt === null) return

    gCtx.beginPath()
    gCtx.lineWidth = 2
    gCtx.strokeStyle = `${stroke}`
    gCtx.fillStyle = `${color}`
    gCtx.font = `${size}px ${font}`
    gCtx.textAlign = `${align}`
    gCtx.fillText(txt, position.x, position.y)
    gCtx.strokeText(txt, position.x, position.y)
    gCtx.closePath()
}

// let textHeight = gCtx.measureText(txt).fontBoundingBoxAscent + gCtx.measureText(txt).fontBoundingBoxDescent
// line.height = textHeight
// let textHeight = gCtx.measureText(txt).fontBoundingBoxAscent + gCtx.measureText(txt).fontBoundingBoxDescent

function drawRectOnText(line) {

    if (line.align === 'left') {
        drawRec(
          line.position.x - 10,
          line.position.y - line.size,
          line.txt.length * (0.5 * line.size),
          1.2 * line.size
        );
      } else if (line.align === 'center') {
        drawRec( 
          line.position.x - 10 - (line.txt.length * 0.5 * line.size) / 2,
          line.position.y - 1 * line.size,
          line.txt.length * (0.5 * line.size),
          1.2 * line.size
        );
      } else {
        drawRec(
          line.position.x - 10 - line.txt.length * 0.5 * line.size,
          line.position.y - line.size,
          line.txt.length * (0.5 * line.size),
          1.2 * line.size
        );
      }
}

function drawRec(x, y, width, height) {
    gCtx.beginPath();
    gCtx.rect(x, y, width + 10, height);
    gCtx.strokeStyle = '#ffffff';
    gCtx.stroke();
  }

function downloadCanvas(elLink) {
    // Gets the canvas content and convert it to base64 data URL that can be save as an image
    const data = gElCanvas.toDataURL() // Method returns a data URL containing a representation of the image in the format specified by the type parameter.
    // console.log('data', data) // Decoded the image to base64
    elLink.href = data // Put it on the link
    elLink.download = 'my-img.jpg' // Can change the name of the file
}

function setLineText(txt) {
    if (!gMeme.lines.length) return
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setImg(imgId) {
   gMeme.selectedImgId = imgId
}

function changeColor(color) {
    if (!gMeme.lines.length) return;
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function changeStrokeColor(color) {
    if (!gMeme.lines.length) return;
    gMeme.lines[gMeme.selectedLineIdx].stroke = color
}

function changeFontSize(operator) {
    const lineIdx = gMeme.selectedLineIdx
    gMeme.lines[lineIdx].size += operator
}

function changeLines() {
    if (!gMeme.lines.length) return;
    console.log(gMeme.selectedLineIdx)
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0
    else gMeme.selectedLineIdx++
    renderMeme()
}

function changeFont(fontFamily) {
    if (!gMeme.lines.length) return;
    gMeme.lines[gMeme.selectedLineIdx].font = fontFamily
    console.log(fontFamily)
    renderMeme()
}

function changeAlign(direction) {
    if (!gMeme.lines.length) return;
    gMeme.lines[gMeme.selectedLineIdx].align = direction
    renderMeme()
}

function getDragLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

function addLine(txt='new line') {
    let posY
    if (!gMeme.lines.length) posY = 50
    if (gMeme.lines.length === 1) {
        posY = gElCanvas.height - 55
    } else if (gMeme.lines.length >= 2) posY = gElCanvas.height / 2

    console.log(posY, gMeme.lines.length)
    const line = {
        txt,
        size: 35,
        align: 'center',
        color: 'black',
        position: { x: 100, y: posY },
        height: 0,
        font: 'impact',
        isDrag: false,
    }

    gMeme.lines.push(line)
    gMeme.selectedLineIdx = gMeme.lines.length - 2
    onChangeLines(true)

}

function deleteSelectedLine() {
    console.log('Before delete=', gMeme.lines)
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    if (gMeme.selectedLineIdx !== 0) gMeme.selectedLineIdx--
    renderMeme()
    console.log('After delete=', gMeme.lines)

}

function randomMeme() {

    return {
        selectedImgId: getRandomIntInclusive(0, gImgs.length - 1),
        selectedLineIdx: 0,
        lines: [
            {
                txt: makeLorem(getRandomIntInclusive(0, 15)),
                size: getRandomIntInclusive(20, 45),
                align: 'center',
                color: getRandomColor(),
                position: { x: 50, y: 50 },
                height: 0,
                font: 'impact',
                isDrag: false
            }
        ],
    }
}

function createRandomMeme() {
    gMeme = randomMeme()
    onImgSelect(gMeme.selectedImgId)
    gMeme.lines.push(createRandomLine())
    renderMeme()
}

function createRandomLine() {
    return {
        txt: makeLorem(getRandomIntInclusive(0, 15)),
        size: getRandomIntInclusive(20, 45),
        align: 'center',
        color: getRandomColor(),
        position: { x: 50, y: gElCanvas.height - 50 },
        height: 0,
        font: 'impact',
        isDrag: false
    }
}

function moveLine(x, y) {
    gMeme.lines[gMeme.selectedLineIdx].position.x = x;
    gMeme.lines[gMeme.selectedLineIdx].position.y = y;
}

function saveMeme(userMeme) {
    var id = gUserMemes.length + 1
    const meme =
    {
        id,
        userMeme,
        url: gElCanvas.toDataURL()
    }

    gUserMemes.push(meme)
    saveToStorage(MEME_KEY, gUserMemes)

}

function loadMemes() {
    var gUserMemes = loadFromStorage(MEME_KEY)
    if (!gUserMemes || !gUserMemes.length) gUserMemes = [];
    saveToStorage(MEME_KEY, gUserMemes)
    return gUserMemes
}
