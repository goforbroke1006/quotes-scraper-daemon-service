import Nightmare from 'nightmare';
import * as cheerio from "cheerio"

let extractValue = cellEl => {
    const str = cellEl.find('.inline_int').text() + cellEl.find('.pip').text()
    return parseFloat(str)
}

let parseData = html => {
    let result = [];
    const $ = cheerio.load(html)
    $('.inline_rates_container').each((ci, containerEl) => {
        if (result.length > 4) return false;

        $(containerEl).find('.rate_row').each((rri, rowEl) => {

            const code = $(rowEl).find('.inline.title.left:nth-child(1)').text().trim()

            const bidCell = $(rowEl).find('.inline.value.right:nth-child(2)')
            const askCell = $(rowEl).find('.inline.value.right:nth-child(3)')

            result.push({
                code: code,
                ask: extractValue($(askCell)),
                bid: extractValue($(bidCell)),
            })

        })
    })
    return result
}

const nightmare = Nightmare({ show: false })

export function oanda() {

    nightmare
        .goto('https://www1.oanda.com/lang/ru/currency/live-exchange-rates/')
.then(() => {

    while(true) {

(async function() {

        console.log('--------------------------------------------------')
        await nightmare
            .evaluate(() => {
                return document.querySelector('#core_content').innerHTML;
            })
            .then((responseHtml) => {
                console.log(parseData(responseHtml))
            })
            .catch(err => {console.error(err)})


})()

    }

})

}


