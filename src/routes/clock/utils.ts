function zeroPadded(number) {
    return number >= 10 ? number.toString() : `0${number}`
}

function lastDigit(number) {
    return number.toString()[number.toString().length - 1]
}

export function formatTime(millisecs: number) {
    const hh = zeroPadded(Math.floor(millisecs / 1000 / 60 / 60))
    const mm = zeroPadded(Math.floor(millisecs / 1000 / 60) % 60)
    const ss = zeroPadded(Math.floor(millisecs / 1000) % 60)
    const t = lastDigit(Math.floor(millisecs / 100))
    if (hh === '00')
        return `${mm}:${ss}.${t}`
    else
        return `${hh}:${mm}:${ss}`
}
