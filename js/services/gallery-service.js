'use strict'

const MEME_KEY = 'memeDB'

let gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2, 'shalom': 10, 'Bibi': 20, 'Korona': 12, 'freedom': 10 }
let gUserMemes = loadMemes()

let gImgs = [
    {
        id: 1,
        url: '/images/1.jpg',
        keywords: ['trump', 'america']
    },
    {
        id: 2,
        url: '/images/2.jpg',
        keywords: ['dog', 'cute']
    },
    {
        id: 3,
        url: '/images/3.jpg',
        keywords: ['dog', 'baby']
    },
    {
        id: 4,
        url: '/images/4.jpg',
        keywords: ['cute', 'cat']
    },
    {
        id: 5,
        url: '/images/5.jpg',
        keywords: ['kid', 'funny']
    },
    {
        id: 6,
        url: '/images/6.jpg',
        keywords: ['funny', 'awsome']
    },
    {
        id: 7,
        url: '/images/7.jpg',
        keywords: ['kid', 'baby', 'funny']
    },
    {
        id: 8,
        url: '/images/8.jpg',
        keywords: ['wired', 'clown']
    },
    {
        id: 9,
        url: '/images/9.jpg',
        keywords: ['baby', 'funny']
    },
    {
        id: 10,
        url: '/images/10.jpg',
        keywords: ['obamba', 'america', 'government']
    },
    {
        id: 11,
        url: '/images/11.jpg',
        keywords: ['funny', 'sport', 'kiss']
    },
    {
        id: 12,
        url: '/images/12.jpg',
        keywords: ['haim', 'what', 'glasses']
    },
    {
        id: 13,
        url: '/images/13.jpg',
        keywords: ['beautiful', 'leonardo',]
    },
    {
        id: 14,
        url: '/images/14.jpg',
        keywords: ['glasses', 'matrix',]
    },
    {
        id: 15,
        url: '/images/15.jpg',
        keywords: ['regular']
    },
    {
        id: 16,
        url: '/images/16.jpg',
        keywords: ['haim']
    },
    {
        id: 17,
        url: '/images/17.jpg',
        keywords: ['government']
    },
    {
        id: 18,
        url: '/images/18.jpg',
        keywords: ['toy']
    },


]

function getSelectedImg(id) {
    const img = gImgs.find(img => id === img.id)
    return img
}

function filterImages(filterBy) {
    const filteredImages = gImgs.filter(img =>
        img.keywords.some(word => word.includes(filterBy))
    )
    return filteredImages
}

function loadMemes() {
    var gUserMemes = loadFromStorage(MEME_KEY)
    if (!gUserMemes || !gUserMemes.length) gUserMemes = [];
    saveToStorage(MEME_KEY, gUserMemes)
    return gUserMemes
}

function onUserMemeSelect(memeId) {
    const meme = getMemeById(memeId)
    gMeme = meme.userMeme

    let elMemesContainer = document.querySelector('.memes-gallery')
    let elMemeCanvas = document.querySelector('.meme-container')
    elMemesContainer.classList.toggle('hide')
    elMemeCanvas.classList.toggle('hide')
    renderMeme()
    document.querySelector('.meme-text').focus();
}

function getMemeById(memeId) {
    const meme = gUserMemes.find(meme => memeId === meme.id)
    return meme
}

