import '@babel/polyfill'

import Nightmare from 'nightmare';
import * as cheerio from "cheerio"
import {QuotesDelta, Quote} from '../../service/quotes-delta';

const Client = require('pg-native');
let client = new Client();
client.connectSync('postgresql://postgres:postgres@localhost:15432/quotes_db?sslmode=disable');

let extractValue = cellEl => {
    const str = cellEl.find('.inline_int').text() + cellEl.find('.pip').text();
    return parseFloat(str)
};

const delta = new QuotesDelta();

let parseData = html => {

    const $ = cheerio.load(html);
    $('.inline_rates_container').each((ci, containerEl) => {

        $(containerEl).find('.rate_row').each((rri, rowEl) => {

            const code = $(rowEl).find('.inline.title.left:nth-child(1)').text().trim();

            const bidCell = $(rowEl).find('.inline.value.right:nth-child(2)');
            const askCell = $(rowEl).find('.inline.value.right:nth-child(3)');

            var date = new Date();
            var nowUTC = Date.UTC(
                date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
                date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

            const quote = new Quote(
                nowUTC / 1000,
                code,
                extractValue($(bidCell)),
                extractValue($(askCell))
            );

            const upd = delta.check(quote);
            if (upd) {
                console.log(quote);

                client.querySync('INSERT INTO quotes_history(created_at, instrument, bid, ask) ' +
                    'VALUES (to_timestamp(' + quote.timestamp + '), \'' + quote.instrument + '\', ' + quote.bid + ', ' + quote.ask + ')');
            }

        })
    });

};


const nightmare = Nightmare({
    show: false,
    // waitTimeout: 1000, // in ms
    // gotoTimeout: 1000, // in ms
    // loadTimeout: 1000,
    // executionTimeout: 1000,
    // pollInterval: 50, //in ms
});


nightmare
    .goto('https://www1.oanda.com/lang/ru/currency/live-exchange-rates/')
    .then(() => {

        setInterval(() => {
            // console.log('--------------------------------------------------');
            nightmare
                .evaluate(() => {
                    return document.querySelector('#core_content').innerHTML;
                })
                .then(parseData)
                .catch(err => {
                    console.error(err)
                })

        }, 500)

    })
    .catch((err) => {
        console.error(err)
    });
