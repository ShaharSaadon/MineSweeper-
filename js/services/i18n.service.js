'use strict'

// instructions:
// <h1 data-trans="title">Book-Shop</h1>
// setLang()
// doTrans()

// function setLangByParam() {
//     let lang = getValueFromParam('lang')
//     setLang(lang)
//     // DONE: if lang is hebrew add RTL class to document.body
//     if (lang === 'he') document.body.classList.add('rtl')
//     else document.body.classList.remove('rtl')
// }


var gCurrLang = 'en'

var gTrans = {
    title: {
        en: 'Book Shop',
        he: 'חנות ספרים'
    },
    'gallery':{
        en: 'Gallery',
        he: 'גלריה'
    },
    'memes':{
        en:'MEMES',
        he:'מימים',
    },
    'contact':{
        en:'Contact',
        he:'צור קשר'
    },
    'flexible':{
        en:'i\'m Flexible',
        he:'הגרל מימ',
    },
    'home':{
        en:'Home',
        he:'דף בית',
    },
    'quick-links':{
        en:'Quick Links',
        he:'קישורים מהירים',
    },
    'extra-links':{
        en:'Extra Links',
        he:'קישורים נוספים',
    },
    'questions':{
        en:'ASK QUESTION',
        he:'תשאל אותנו שאלה',
    },
    'about':{
        en:'ABOUT US',
        he:'עלינו'
    },
    'privacy':{
        en:'PRIVACY POLICY',
        he:'תנאי פרטיות',
    },
    'terms':{
        en:'TERMS OF USE',
        he:'תנאי השימוש',
    },
    'petach-tikva':{
        en:'Petah Tikva, Israel - 4965217',
        he: 'פתח תקווה - ישראל, 496527',
    },
    'follow-us':{
        en:'Follow Us',
        he: 'תעקבו אחרינו',
    },
    'contact-info':{
        en:'contat info',
        he: 'דברו איתנו!',
    },
    'meme-generator':{
        en:'MEME-GENERATOR.',
        he: 'מגריל הממים',
    },
    'created':{
        en:'created with ❤ by shahar saadon',
        he: 'נוצר ב♥ על ידי שחר סעדון',
    },
    


}


function getTrans(transKey) {
    // DONE: if key is unknown return 'UNKNOWN'
    const transMap = gTrans[transKey]
    if (!transMap) return 'UNKNOWN'
    // DONE: get from gTrans
    let translation = transMap[gCurrLang]
    // DONE: If translation not found - use english
    if (!translation) translation = transMap.en
    return translation
}

function doTrans() {
    // DONE: 
    var els = document.querySelectorAll('[data-trans]')
    els.forEach(el => {
        const transKey = el.dataset.trans
        const translation = getTrans(transKey)
        if (el.placeholder) el.placeholder = translation
        else el.innerText = translation

        // const prop = el.placeholder ? 'placeholder': 'innerText'
        // el[prop] = translation


        // for each el:
        // get the data-trans and use getTrans to replace the innerText 
        // ITP: support placeholder    
    })
}

function setLang(lang) {
    gCurrLang = lang
}

function formatNumSimple(num) {
    return num.toLocaleString('es')
}

function formatNum(num) {
    return new Intl.NumberFormat(gCurrLang).format(num)
}

function formatCurrency(num) {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(num)
}

function formatDate(time) {

    const options = {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: 'numeric',
        hour12: true,
    }

    return new Intl.DateTimeFormat(gCurrLang, options).format(time)
}

// Kilometers to Miles
function kmToMiles(km) {
    return km / 1.609
}

// Kilograms to Pounds:
function kgToLbs(kg) {
    return kg * 2.20462262185
}


function getPastRelativeFrom(ts) {
    const diff = Date.now() - new Date(ts)
    const seconds = diff / 1000
    const minutes = seconds / 60
    const hours = minutes / 60
    const days = hours / 24

    const formatter = new Intl.RelativeTimeFormat('en-US', {
        numeric: 'auto'
    })
    if (seconds <= 60) return formatter.format(-seconds, 'seconds')
    if (minutes <= 60) return formatter.format(-minutes, 'minutes')
    if (hours <= 24) return formatter.format(-hours, 'hours')
    return formatter.format(-days, 'days')
}
