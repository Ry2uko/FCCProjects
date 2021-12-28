const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
  suite('getNum()', () => {
    test('convertHandler should correctly read a whole number input', () => {
      const result = convertHandler.getNum('7mi');
      assert.equal(result, 7);
    });
    test('convertHandler should correctly read a decimal number input', () => {
      const result = convertHandler.getNum('3.5gal');
      assert.equal(result, 3.5);
    });
    test('convertHandler should correctly read a fractional input', () => {
      const result = convertHandler.getNum('3/4kg');
      assert.equal(result, 0.75);
    });
    test('convertHandler should correctly read a fractional input with a decimal', () => {
      const result = convertHandler.getNum('1.5/5lbs');
      assert.equal(result, 0.3);
    });
    test('convertHandler should correctly return an error on a double-fraction (i.e. 3/2/3)', () => {
      const result = convertHandler.getNum('3/2/3L');
      assert.equal(result, 'invalid number');
    });
    test('convertHandler should correctly default to a numerical input of 1 when no numerical input is provided', () => {
      const result = convertHandler.getNum('gal');
      assert.equal(result, 1);
    });
  });

  suite('getUnit()', () => {
    test('convertHandler should correctly read each valid input unit', () => {
      const result = convertHandler.getUnit('9.5/6L');
      assert.equal(result, 'L');
    });
    test('convertHandler should correctly return an error for an invalid input unit', () => {
      const result = convertHandler.getUnit('9melons');
      assert.equal(result, 'invalid unit');
    });
  });

  suite('getReturnUnit()', () => {
    test('convertHandler should return the correct return unit for each valid input unit', () => {
      const result = convertHandler.getReturnUnit('km');
      assert.equal(result, 'mi');
    });
  });

  suite('spellOutUnit()', () => {
    test('convertHandler should correctly return the spelled-out string unit for each valid input unit', () => {
      const result = convertHandler.spellOutUnit(2, 'lbs');
      assert.equal(result, 'pounds');
    });
  });

  suite('convert()', () => {
    test('convertHandler should correctly convert gal to L', () => {
      const result = convertHandler.convert(1, 'gal');
      assert.equal(result, 3.78541);
    });
    test('convertHandler should correctly convert L to gal', () => {
      const result = convertHandler.convert(3.78541, 'L');
      assert.equal(result, 1);
    });
    test('convertHandler should correctly convert mi to km', () => {
      const result = convertHandler.convert(1, 'mi');
      assert.equal(result, 1.60934);
    });
    test('convertHandler should correctly convert km to mi', () => {
      const result = convertHandler.convert(1.60934, 'km');
      assert.equal(result, 1);
    });
    test('convertHandler should correctly convert lbs to kg', () => {
      const result = convertHandler.convert(1, 'lbs');
      assert.equal(result, 0.45359);
    });
    test('convertHandler should correctly convert kg to lbs', () => {
      const result = convertHandler.convert(0.45359, 'kg');
      assert.equal(result, 1);
    });
  });
});
