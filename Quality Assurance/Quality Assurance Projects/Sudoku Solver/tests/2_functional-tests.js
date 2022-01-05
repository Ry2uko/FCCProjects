const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const Puzzles = require('../controllers/puzzle-strings.js');
const puzzlesAndSolutions = Puzzles.puzzlesAndSolutions;

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('POST request to /api/solve', () => {
    const puzzle = puzzlesAndSolutions[0][0],
    solution = puzzlesAndSolutions[0][1],
    invalidPuzzle = '983246.9723419678.6.345438.73248967.932417861234.75243.879634.867435896.2435.713.',
    route = '/api/solve';

    test('solve a puzzle with valid puzzle string', done => {
      chai.request(server)
      .post(route)
      .set('content-type', 'application/json')
      .send({ puzzle })
      .end((err, res) => {
        assert.deepEqual(res.body, { solution });
        done();
      });  
    });
    test('solve a puzzle with missing puzzle string', done => {
      chai.request(server)
      .post(route)
      .set('content-type', 'application/json')
      .send({})
      .end((err, res) => {
        assert.deepEqual(res.body, {
          error: "Required field missing"
        });
        done();
      });
    });
    test('solve a puzzle with invalid characters', done => {
      chai.request(server)
      .post(route)
      .set('content-type', 'application/json')
      .send({
        puzzle: '8.c3l.pi98oeux9834y9xgpd'
      })
      .end((err, res) => {
        assert.deepEqual(res.body, {
          error: "Invalid characters in puzzle"
        });
        done();
      });
    });
    test('solve a puzzle with incorrect length', done => {
      chai.request(server)
      .post(route)
      .set('content-type', 'application/json')
      .send({
        puzzle: puzzle.slice(34,)
      })
      .end((err, res) => {
        assert.deepEqual(res.body, {
          error: "Expected puzzle to be 81 characters long"
        })
        done();
      });
    });
    test('solve a puzzle that cannot be solved', done => {
      chai.request(server)
      .post(route)
      .set('content-type', 'application/json')
      .send({
        puzzle: invalidPuzzle
      })
      .end((err, res) => {
        assert.deepEqual(res.body, {
          error: "Puzzle cannot be solved"
        });
        done();
      });
    });
  }); 
  suite('POST request to /api/check', () => {
    const puzzle = puzzlesAndSolutions[1][0],
    conflictChart = ['row', 'column', 'region'],
    route = '/api/check';

    test('check a puzzle placement with all fields', done => {
      chai.request(server)
      .post(route)
      .set('content-type', 'application/json')
      .send({
        coordinate: 'C3',
        value: '1',
        puzzle
      })
      .end((err, res) => {
        assert.deepEqual(res.body, {
          valid: true
        });
        done();
      });
    });
    test('check a puzzle placement with single placement conflict', done => {
      chai.request(server)
      .post(route)
      .set('content-type', 'application/json')
      .send({
        coordinate: 'C3',
        value: '2',
        puzzle
      })
      .end((err, res) => {
        assert.isNotOk(res.body.valid);
        assert.equal(res.body.conflict.length, 1);
        assert.include(conflictChart, res.body.conflict[0]);
        done();
      });      
    });
    test('check a puzzle placement with multiple placement conflict', done => {
      chai.request(server)
      .post(route)
      .set('content-type', 'application/json')
      .send({
        coordinate: 'C3',
        value: '9',
        puzzle
      })
      .end((err, res) => {
        assert.isNotOk(res.body.valid);
        assert.isAbove(res.body.conflict.length, 1);
        for (let i in res.body.conflict) {
          assert.include(conflictChart, res.body.conflict[i]);
        }
        done();
      });
    });
    test('check a puzzle placement with all placement conflicts', done => {
      chai.request(server)
      .post(route)
      .set('content-type', 'application/json')
      .send({
        coordinate: 'A3',
        value: '9',
        puzzle
      })
      .end((err, res) => {
        assert.isNotOk(res.body.valid);
        assert.equal(res.body.conflict.length, 3);
        assert.deepEqual(conflictChart, res.body.conflict);
        done();
      });
    });
    test('check a puzzle placement with missing required fields', done => {
      console.log(route);
      chai.request(server)
      .post(route)
      .set('content-type', 'application/json')
      .send({})
      .end((err, res) => {
        assert.deepEqual(res.body, {
          error: "Required field(s) missing"
        });
        done();
      });
    });
    test('check a puzzle placement with invalid characters', done => {
      chai.request(server)
      .post(route)
      .set('content-type', 'application/json')
      .send({
        coordinate: 'A2',
        value: '4',
        puzzle: '..2.8.54.3.13.4.1.587..2609invalid715.06...870211.961.96781.76.1679.19.9..6.61.76'
      })
      .end((err, res) => {
        assert.deepEqual(res.body, {
          error: "Invalid characters in puzzle"
        });
        done();
      });
    });
    test('check a puzzle placement with incorrect length', done => {
      chai.request(server)
      .post(route)
      .set('content-type', 'application/json')
      .send({
        coordinate: 'A2',
        value: '4',
        puzzle: puzzle.slice(45,)
      })
      .end((err, res) => {
        assert.deepEqual(res.body, {
          error: "Expected puzzle to be 81 characters long"
        });
        done();
      });
    });
    test('check a puzzle placement with invalid placement coordinate', done => {
      chai.request(server)
      .post(route)
      .set('content-type', 'application/json')
      .send({
        coordinate: 'xyz',
        value: '9',
        puzzle
      })
      .end((err, res) => {
        assert.deepEqual(res.body, {
          error: "Invalid coordinate"
        });
        done();
      });
    });
    test('check a puzzle placament with invalid placement value', done => {
      chai.request(server)
      .post(route)
      .set('content-type', 'application/json')
      .send({
        coordinate: 'A2',
        value: 'x',
        puzzle
      })
      .end((err, res) => {
        assert.deepEqual(res.body, {
          error: "Invalid value"
        })
        done();
      });
    });
    test('check a puzzle placement with invalid placement coordinate and value', done => {
      chai.request(server)
      .post(route)
      .set('content-type', 'application/json')
      .send({
        coordinate: 'xyz',
        value: 'x',
        puzzle
      })
      .end((err, res) => {
        assert.deepEqual(res.body, {
          error: "Invalid coordinate and value"
        });
        done();
      });
    });
  });
});

