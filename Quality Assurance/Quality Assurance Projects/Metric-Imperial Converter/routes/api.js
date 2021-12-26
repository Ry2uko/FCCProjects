'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {

  const convertHandler = new ConvertHandler();

  app.route('/api/convert').get((req, res) => {
    const input = req.query.input.toLowerCase(),
    initNum = convertHandler.getNum(input),
    initUnit = convertHandler.getUnit(input);
    if (initUnit === "invalid unit") {
      if(initNum === "invalid number") {
        return res.send("invalid number and unit");
      }
      return res.send(initUnit);
    } else if(initNum === "invalid number") {
      return res.send(initNum);
    } 

    const returnUnit = convertHandler.getReturnUnit(initUnit),
    returnNum = convertHandler.convert(initNum, initUnit),
    spelledInitUnit = convertHandler.spellOutUnit(initNum, initUnit),
    spelledReturnUnit = convertHandler.spellOutUnit(returnNum, returnUnit),
    string = convertHandler.getString(initNum, spelledInitUnit, returnNum, spelledReturnUnit);

    res.json({
      initNum: initNum,
      initUnit: initUnit,
      returnNum: returnNum,
      returnUnit: returnUnit,
      string: string
    });
  });

};
