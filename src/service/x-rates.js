import * as axios from "axios"
import * as cheerio from "cheerio"

let urls = [
    "https://www.x-rates.com/table/?from=USD&amount=1",
    "https://www.x-rates.com/table/?from=EUR&amount=1",
    "https://www.x-rates.com/table/?from=GBP&amount=1",
    "https://www.x-rates.com/table/?from=JPY&amount=1",
]

let extractCodesPair = url => {
    const from = linkHref.substr(35, 3)
    const to = linkHref.substr(42, 3)
    return from + "/" + to
}

let parseData = html => {
    let result = [];
    const $ = cheerio.load(html)
    $('table.tablesorter.ratesTable > tbody > tr > td.rtRates:nth-child(2) > a')
        .each((i, rowEl) => {

            let datum = {}

            $(rowEl).find('td.rtRates:nth-child(2) > a').each((i, askLinkEl) => {
                datum.code = extractCodesPair($(askLinkEl).attr("href"))
                datum.ask = parseFloat($(askLinkEl).text())
            })

            datum.bid = 0
            /*$(rowEl).find('td.rtRates:nth-child(3) > a').each((i, bidLinkEl) => {
                datum.bid = parseFloat($(bidLinkEl).text())
            })*/

            result.push(datum)

        })
    return result
}

export function xRates() {
    for (let i = 0; i < urls.length; i++) {
        axios.get(urls[i])
            .then(response => {
                //console.log(response.data);
                console.log(parseData(response.data))
            })
            .catch(error => {
                console.error(error)
            })
    }
}
