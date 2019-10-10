"use strict";

export class Quote {

    /**
     *
     * @param {Number} timestamp
     * @param {String} instrument
     * @param {Number} bid
     * @param {Number} ask
     */
    constructor(timestamp, instrument, bid, ask) {
        this.timestamp = timestamp;
        this.instrument = instrument;
        this.bid = bid;
        this.ask = ask;
    }

}

export class QuotesDelta {

    /**
     *
     * @param {Quote[]} storage
     */
    constructor(storage = []) {
        this.storage = storage;
    }

    /**
     *
     * @param {Quote} quote
     * @return {Boolean}
     */
    check(quote) {
        let pos = this.storage.findIndex(q => q.instrument === quote.instrument);

        if (pos === -1) {
            this.storage.push(quote);
            return true;
        }

        let oldQuote = this.storage[pos];

        if (oldQuote.timestamp >= quote.timestamp)
            return false;

        if (oldQuote.bid !== quote.bid || oldQuote.ask !== quote.ask) {
            this.storage[pos] = quote;
            return true
        }

        return false
    }

    /**
     * Returns size of storage
     * @returns {number}
     */
    size() {
        return this.storage.length
    }
}