const Nightmare = require('nightmare')
import * as cheerio from "cheerio"

let extractValue = cellEl => {
    const str = $(cellEl).find('.inline_int') + $(cellEl).find('.pip')
    return parseFloat(str)
}

let parseData = html => {
    let result = [];
    const $ = cheerio.load(html)
    $('.inline_rates_container').each((ci, containerEl) => {

        $(containerEl).find('.rate_row').each((rri, rowEl) => {

            const code = $(rowEl).find('.inline.title.left:nth-child(1)').text()

            const bidCell = $(rowEl).find('.inline.value.right:nth-child(2)')
            const askCell = $(rowEl).find('.inline.value.right:nth-child(3)')

            result.push({
                code: code,
                ask: extractValue(askCell),
                bid: extractValue(bidCell),
            })
        })

        const linkHref = $(linkEl).attr("href")
        const from = linkHref.substr(35, 3)
        const to = linkHref.substr(42, 3)
        result.push({
            code: from + "/" + to,
            ask: parseFloat($(linkEl).text())
        })


    })
    return result
}

const nightmare = Nightmare({ show: false })
const url = "https://www1.oanda.com/lang/ru/currency/live-exchange-rates/"

export function oanda() {
    nightmare
        .goto(url)
        //.wait(2500)
        .wait('body')
        .evaluate(() => document.querySelector('body'))
        .end()
        .then(response => {
            //console.log(response.data);
            console.log(parseData(response.data))
        })
        .catch(error => {
            console.error(error)
        })
}
