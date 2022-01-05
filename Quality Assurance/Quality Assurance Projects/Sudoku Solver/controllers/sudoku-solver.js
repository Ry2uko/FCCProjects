'use strict';

const colChart = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
  i: 8,
};
let puzzleSolution;

class SudokuSolver {

  validate(puzzleString) {
    return puzzleString.length === 81;
  }

  validate2(toValidate, type) {
    switch (type) {
      case 'coordinate':
        return /^[a-i][1-9]$/i.test(toValidate);
        break;
      case 'value':
        return /^[1-9]$/.test(toValidate);
        break;
      case 'puzzle':
        return /^(\d|\.){81}$/.test(toValidate);
    }
    return false;
  }

  checkRowPlacement(puzzleString, column, value) {
    const rowArr = [];
    let str = "", char;
    for (char in puzzleString) {
      str += puzzleString[char];
      if (str.length === 9) {
        rowArr.push(str);
        str = "";
      }
    }
    return !(rowArr[colChart[column]].includes(value));
  }

  checkColPlacement(puzzleString, row, value) {
    const colArr = [];
    let str = "";
    for (let j = 0; j < 9; j++) {
      for (let i = 0; i < 9; i++) {
        let skip = (i*9)+j;
        str += puzzleString[skip];
        if(str.length === 9) {
          colArr.push(str);
          str = "";
        }
      }
    }
    return !(colArr[row-1].includes(value));
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionArr = [];
    let str = "", arr = [];
    for (let i = 0; i < 3; i++) {
      let regionRowStart = i*27;
      for (let k = 0; k < 3; k++) {
        let skipCol = (k*3)+regionRowStart;
        for (let j = 0; j < 3; j++) {
          let skipRow = (j*9)+skipCol;
          str += puzzleString.slice(skipRow, skipRow+3);

          if (str.length === 9) {
            arr.push(str);
            str = "";
            if (arr.length === 3) {
              regionArr.push(arr);
              arr = [];
            }
          }
        }
      }
    }

    return !(regionArr
    [Math.floor(colChart[column] / 3)]
    [Math.floor((row-1) / 3)].includes(value));
  }

  solve(puzzleString) {
    if (!puzzleString.includes('.')) puzzleSolution = puzzleString;
    let isEmpty = true, row, col, val, cellIndex;
    for (let i in colChart) {
      for (let j = 1; j <= 9; j++) {
        cellIndex = (j+(9*colChart[i]))-1;
        if (puzzleString[cellIndex] === '.') {
          col = i;
          row = j;
          isEmpty = false;
          break;
        }
      }
      if (!isEmpty) {
        break;
      }
    }

    if (isEmpty) {
      return true;
    }

    for (val = 1; val <= 9; val++) {
      if(
        this.checkRegionPlacement(puzzleString, row, col, val)
        && this.checkRowPlacement(puzzleString, col, val)
        && this.checkColPlacement(puzzleString, row, val)
      ) {
        let puzzleArr = puzzleString.split('');
        puzzleArr.splice(cellIndex, 1, val);
        puzzleString = puzzleArr.join('');

        if (this.solve(puzzleString)) {
          return puzzleSolution;
        } else {
          let puzzleArr = puzzleString.split('');
          puzzleArr.splice(cellIndex, 1, '.');
          puzzleString = puzzleArr.join('');
        }
      }
    }
  }

  checkSolution(puzzleString) {
    if (!puzzleString 
      || puzzleString.includes('.')
      || puzzleString.length !== 81
      ) return false;

    for (let col in colChart) {
      for (let row = 1; row <= 9; row++) {
        let cellIndex = (row+(9*colChart[col]))-1;
        let val = parseInt(puzzleString[cellIndex]);
        let puzzleArr = puzzleString.split('');
        puzzleArr.splice(cellIndex, 1, '.');
        let tempString = puzzleArr.join('');
        if (!(
          this.checkRegionPlacement(tempString, row, col, val)
          && this.checkRowPlacement(tempString, col, val)
          && this.checkColPlacement(tempString, row, val)
        )) {
          return false;
        }
      }
    }
    return true;
  }
        
}

module.exports = {
  SudokuSolver,
  colChart
};
  