function ConvertHandler() {
  
  this.getNum = function(input) {
    let result = "invalid number"; 
    // Correct format 
    if (/^(\/|\d|\.)*[A-Za-z]*$/.test(input)) {
      if (/^[A-za-z]+$/.test(input)) { // No number
        result = 1;
      } else if (!(/(\/).*\1/.test(input))) { // Double fraction
        if(input.includes('/')) {
          const matchedInput = input.match(/(\d|\.)+\/(\d|\.)+/)[0].split('/');
          result = parseFloat(matchedInput[0]) / parseFloat(matchedInput[1]);
          result = parseFloat(result.toFixed(5));
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
        result /= galToL;
        break;
      case "lbs":
        result *= lbsToKg;
        break;
      case "kg":
        result /= lbsToKg;
        break;
      case "mi":
        result *= miToKm;
        break;
      case "km":
        result /= miToKm;
    }
    return parseFloat(result.toFixed(5));  // 5 decimal digits
  };

  this.getString = function(initNum, initUnit, returnNum, returnUnit) {

    let result = `${initNum} ${initUnit} converts to ${returnNum} ${returnUnit}`;
    
    return result;
  };
  
}

module.exports = ConvertHandler;
