'use strict'

function renderMemes() {
    let elMemesContainer = document.querySelector('.memes-grid-container')
    let strHtmls = gUserMemes.map(meme => `
    <img src='${meme.url}' title="${meme.userMeme.lines[0].txt}" onclick="onUserMemeSelect(${meme.id})">
    `
    ).join('')
    elMemesContainer.innerHTML = strHtmls
}
