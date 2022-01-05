const chai = require('chai');
const assert = chai.assert;

const Controller = require('../controllers/sudoku-solver.js');
const Puzzles = require('../controllers/puzzle-strings.js');

const puzzlesAndSolutions = Puzzles.puzzlesAndSolutions;
const SudokuSolver = Controller.SudokuSolver;

const solver = new SudokuSolver();


suite('UnitTests', () => {
  suite('Puzzle String', () => {
    test('handle a valid puzzle string of 81 characters', done => {
      const puzzle = puzzlesAndSolutions[0][0];
      assert.isOk(solver.validate(puzzle));
      done();
    });
    test('handle a puzzle string with invalid characters', done => {
      const puzzle = '.2thi.s11!..i/:s5..143.inva.1?4.li1[]2..d324.2.3.';
      assert.isNotOk(solver.validate2(puzzle));
      done();
    });
    test('handle a puzzle string that is not 81 characters in length', done => {
      const puzzle = puzzlesAndSolutions[0][0].slice(50,);
      const puzzle2 = puzzlesAndSolutions[0][0] + '....8..214..8.2..12';
      assert.isNotOk(solver.validate(puzzle));
      assert.isNotOk(solver.validate(puzzle2));
      done();
    });
  });
  suite('Row Placement', () => {
    const puzzle = puzzlesAndSolutions[1][0];
    test('handle a valid row placement', done => {
      const result = solver.checkRowPlacement(puzzle, 'a', 6);
      assert.isOk(result);
      done();
    });
    test('handle an invalid row placement', done => {
      const result = solver.checkRowPlacement(puzzle, 'a', 5);
      assert.isNotOk(result);
      done();
    });
  });
  suite('Column Placement', () => {
    const puzzle = puzzlesAndSolutions[2][0];
    test('handle a valid column placement', done => {
      const result = solver.checkColPlacement(puzzle, '1', 1);
      assert.isOk(result);
      done();
    });
    test('handle an invalid column placement', done => {
      const result = solver.checkColPlacement(puzzle, '1', 7);
      assert.isNotOk(result);
      done();
    });
  });
  suite('Region Placement', () => {
    const puzzle = puzzlesAndSolutions[3][0];
    test('handle a valid region placement', done => {
      const result = solver.checkRegionPlacement(puzzle, '9', 'c', 2);
      assert.isOk(result);
      done();
    });
    test('handle an invalid region placement', done => {
      const result = solver.checkRegionPlacement(puzzle, '9', 'c', 1);
      assert.isNotOk(result);
      done();
    });
  });
  suite('Solver', () => {
    const puzzle = puzzlesAndSolutions[4][0];
    const solution = puzzlesAndSolutions[4][1];
    test('valid puzzle string passes the solver', done => {
      const result = solver.solve(puzzle);
      assert.isOk(result);
      assert.isOk(solver.checkSolution(result));
      done();
    });
    test('invalid puzzle string fails the solver', done => {
      const invalidPuzzle = '983246.9723419678.6.345438.73248967.932417861234.75243.879634.867435896.2435.713.';
      assert.isUndefined(solver.solve(invalidPuzzle));
      done();
    });
    test('solver returns the expected solution for a valid puzzle', done => {
      const result = solver.solve(puzzle);
      assert.equal(result, solution);
      assert.isOk(solver.checkSolution(result));
      done();
    });
  });
});
