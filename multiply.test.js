// multiply.test.js

const { multiply } = require('./multiply');

test('multiplies 2 * 3 to equal 6', () => {
    expect(multiply(2, 3)).toBe(6);
});

test('multiplies 0 * 5 to equal 0', () => {
    expect(multiply(0, 5)).toBe(0);
});

test('multiplies -2 * 4 to equal -8', () => {
    expect(multiply(-2, 4)).toBe(-8);
});
