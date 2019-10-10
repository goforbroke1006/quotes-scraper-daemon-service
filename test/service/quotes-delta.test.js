import {Quote, QuotesDelta} from "../../src/service/quotes-delta";

const assert = require('assert');

describe('QuotesDelta', function () {

    describe('#size()', function () {
        it('should return 1 when the new quote was added', function () {
            const delta = new QuotesDelta();
            delta.check(new Quote(0, "", 0, 0));
            assert.strictEqual(delta.size(), 1);
        });
    });

    describe('#check()', function () {
        it('should return true when the new quote was added', function () {
            const delta = new QuotesDelta();
            const upd = delta.check(new Quote(0, "", 0, 0));
            assert.strictEqual(upd, true);
        });
        it('should return false when the same quote was added', function () {
            const delta = new QuotesDelta();
            delta.check(new Quote(0, "USD/EUR", 0, 0));
            const upd = delta.check(new Quote(0, "USD/EUR", 0, 0));
            assert.strictEqual(upd, false);
        });
        it('should return true when the quote has different ask', function () {
            const delta = new QuotesDelta();
            delta.check(new Quote(0, "USD/EUR", 0, 0));
            const upd = delta.check(new Quote(1, "USD/EUR", 0, 0.00001));
            assert.strictEqual(upd, true);
        });
    });

});