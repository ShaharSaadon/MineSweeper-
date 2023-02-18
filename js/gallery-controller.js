'use strict'

function renderImages(images = gImgs) {
    let elGalleryContainer = document.querySelector('.images-grid-container')
    let strHtmls = images.map(img => `
    <img src="images/${img.id}.jpg" title="" onclick="onImgSelect(${img.id})" >
    `
    ).join('')
    elGalleryContainer.innerHTML = strHtmls

    renderSearchByKeywords()
}

function onImgSelect(imgId) {
    let elImageGallery = document.querySelector('.image-gallery')
    let elMemeCanvas = document.querySelector('.meme-container')
    elImageGallery.classList.toggle('hide')
    elMemeCanvas.classList.toggle('hide')
    if (!imgId) return
    setImg(imgId)
    renderMeme()
    document.querySelector('.meme-text').focus();

}

function onGallery(ev) {
    ev.preventDefault()

    let elImageGallery = document.querySelector('.image-gallery')
    let elMemeCanvas = document.querySelector('.meme-container')
    let elMemes = document.querySelector('.memes-gallery')

    if (elImageGallery.classList.contains('hide')) elImageGallery.classList.remove('hide')
    if (!elMemeCanvas.classList.contains('hide')) elMemeCanvas.classList.add('hide')
    if (!elMemes.classList.contains('hide')) elMemes.classList.add('hide')

    resetMeme()
    document.querySelector('.meme-text').value=''

}

function onMemes(ev) {
    ev.preventDefault()
    let elImageGallery = document.querySelector('.image-gallery')
    let elMemeCanvas = document.querySelector('.meme-container')
    let elMemes = document.querySelector('.memes-gallery')

    if (elMemes.classList.contains('hide')) elMemes.classList.remove('hide')
    if (!elMemeCanvas.classList.contains('hide')) elMemeCanvas.classList.add('hide')
    if (!elImageGallery.classList.contains('hide')) elImageGallery.classList.add('hide')

    renderMemes()
}

function onFilterImages(filterBy) {
    console.log('filterBy=', filterBy)
    const filteredImgaes = (filterImages(filterBy))
    renderImages(filteredImgaes)
}

    function renderSearchByKeywords() {
    var elSearchByKeywords = document.querySelector('.search-by-keywords')
    var strHtmls = ''
    for (const [key, value] of Object.entries(gKeywordSearchCountMap)) {
        strHtmls += `<span onclick="onFilterImages('${key}')" style="font-size:${value * 1.5}px;">${key}</span>`
    }
    elSearchByKeywords.innerHTML = strHtmls
}

function onSetLang(lang) {
    setLang(lang)
    if (lang === 'he') document.body.classList.add('rtl')
    else document.body.classList.remove('rtl')
    doTrans()
}