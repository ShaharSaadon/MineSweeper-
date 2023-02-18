'use strict'

function setParam(key, value){
    let params = new URLSearchParams(window.location.search);
    params.delete(key)
    params.append(key, value)
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + params
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function deletParam(key){
    let params = new URLSearchParams(window.location.search);
    params.delete(key)
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + params
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function getValueFromParam(key){
    let params = new URLSearchParams(window.location.search);
    return params.get(key)
}
