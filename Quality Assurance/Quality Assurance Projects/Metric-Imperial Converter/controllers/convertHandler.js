function ConvertHandler() {
  
  this.getNum = function(input) {
    let result = "invalid number"; 
    // Correct format 
    if (/^(\/|\d|\.)*[A-Za-z]+$/.test(input)) {
      if (/^[A-za-z]+$/.test(input)) { // No number
        result = 1;
      } else if (!(/(\/).*\1/.test(input))) { // Double fraction
        if(input.includes('/')) {
          const matchedInput = input.match(/(\d|\.)+\/\d+/)[0].split('/');
          result = parseFloat(matchedInput[0]) / parseFloat(matchedInput[1]);
        } else {
          result = parseFloat(input.match(/^(\/|\d|\.)*/));
        }
      }
    }

    return result;
  };
  
  this.getUnit = function(input) {
    const units = ["gal", "mi", "L", "lbs", "kg", "km"];
    let result = "invalid unit";

    if(/\d?[A-Za-z]+$/.test(input)) { // Checks if there is a unit
      let matchedInput = input.match(/[A-Za-z]+$/)[0];
      if(matchedInput === "l") matchedInput = matchedInput.toUpperCase();
      if (units.includes(matchedInput)) result = matchedInput;
    } 
    return result;
  };
  
  this.getReturnUnit = function(initUnit) {
    const unitConverts = {
      "gal": "L",
      "L": "gal",
      "lbs": "kg",
      "kg": "lbs",
      "mi": "km",
      "km": "mi"
    };

    let result = unitConverts[initUnit];
    
    return result;
  };

  this.spellOutUnit = function(num, unit) {
    const unitSpells = {
      "gal": "gallons",
      "L": "liters",
      "lbs": "pounds",
      "kg": "kilograms",
      "mi": "miles",
      "km": "kilometers"
    };

    let result = unitSpells[unit];

    if(num === 1) result = result.slice(0, -1); // Spelling
    
    return result;
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;

    let result = initNum;

    switch(initUnit) {
      case "gal":
        result *= galToL;
        break;
      case "L":
        result = galToL / result;
        break;
      case "lbs":
        result *= lbsToKg;
        break;
      case "kg":
        result = lbsToKg / result;
        break;
      case "mi":
        result *= miToKm;
        break;
      case "km":
        result = miToKm / result;
    }
    
    return result;
  };

  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    let convertStr = "convert";
    if(initNum === 1)  convertStr += "s"; // Spelling
    let result = `${initNum} ${initUnit} ${convertStr} to ${returnNum} ${returnUnit}`;
    
    return result;
  };
  
}

module.exports = ConvertHandler;
