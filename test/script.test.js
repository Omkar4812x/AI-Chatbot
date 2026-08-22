const test = require('node:test');
const assert = require('node:assert');
const { sanitizeInput } = require('../script.js');

test('sanitizeInput prevents HTML injection', () => {
    assert.strictEqual(sanitizeInput('<script>'), '&lt;script&gt;');
});
