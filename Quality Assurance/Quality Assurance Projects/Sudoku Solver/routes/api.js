'use strict';

const Controller = require('../controllers/sudoku-solver.js');
const SudokuSolver = Controller.SudokuSolver;
const colChart = Controller.colChart;

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      
      if (
        !(req.body.coordinate) 
        || !(req.body.value)
        || !(req.body.puzzle)
      ) {
        return res.json({
          error: "Required field(s) missing"
        })
      }

      let validatePuzzle = solver.validate(req.body.puzzle);
      let validatePuzzle2 = solver.validate2(req.body.puzzle, 'puzzle');
      let validateCoord = solver.validate2(req.body.coordinate, 'coordinate');
      let validateValue = solver.validate2(req.body.value, 'value');

      if (!(validatePuzzle2)) {
        if(!validatePuzzle) {
          return res.json({ 
            error: "Expected puzzle to be 81 characters long" 
          });
        }
        return res.json({
          error: "Invalid characters in puzzle"
        });
      } else if (!validateCoord) {
        if(!validateValue) {
          return res.json({
            error: "Invalid coordinate and value"
          });
        }
        return res.json({
          error: "Invalid coordinate"
        });
      } else if (!validateValue) {
        return res.json({
          error: "Invalid value"
        });
      }

      let column = (req.body.coordinate.slice(0, 1)).toLowerCase(),
      row = parseInt(req.body.coordinate.slice(1,)),
      value = parseInt(req.body.value),
      puzzleString = req.body.puzzle,
      cellIndex = (row+(9*colChart[column]))-1,
      conflict = [];

      if (puzzleString[cellIndex] !== '.') {
        let puzzleArr = puzzleString.split('');
        puzzleArr.splice(cellIndex, 1, '.');
        puzzleString = puzzleArr.join('');
      }

      let rowResult = solver.checkRowPlacement(puzzleString, column, value),
      colResult = solver.checkColPlacement(puzzleString, row, value),
      regionResult = solver.checkRegionPlacement(puzzleString, row, column, value);

      if (!rowResult) conflict.push('row');
      if (!colResult) conflict.push('column');
      if (!regionResult) conflict.push('region');

      if (conflict.length > 0) {
        res.json({
          valid: false,
          conflict
        });
      } else {
        res.json({ valid: true });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzleString = req.body.puzzle;
      if(!puzzleString) {
        return res.json({
          error: "Required field missing"
        });
      } else if (!(/^(\d|\.)+$/.test(puzzleString))) {
        return res.json({
          error: "Invalid characters in puzzle"
        });
      } else if(!solver.validate(puzzleString)) {
        return res.json({ 
          error: "Expected puzzle to be 81 characters long" 
        });
      } 

      let solution = solver.solve(puzzleString);
      if (solver.checkSolution(solution)) {
        res.json({ solution });
      } else {
        res.json({
          error: "Puzzle cannot be solved"
        });
      }
    });
};
