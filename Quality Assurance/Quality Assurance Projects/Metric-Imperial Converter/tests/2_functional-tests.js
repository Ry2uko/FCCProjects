const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test('Convert a valid input such as 10L: GET request to /api/convert', done => {
    chai.request(server)
    .get('/api/convert?input=10L')
    .end((req, res) => {
      
      if(res.text.slice(0,7) !== 'invalid') {
        assert.isObject(JSON.parse(res.text));
      } else {
        assert.fail('Should return an object');
      }
      
      done();
    });
  });
  test('Convert an invalid input such as 32g: GET request to /api/convert', done => {
    chai.request(server)
    .get('/api/convert?input=32g')
    .end((req, res) => {
      assert.equal(res.text, 'invalid unit');
      done();
    });
  });
  test('Convert an invalid number such as 3/7.2/4kg: GET request to /api/convert', done => {
    chai.request(server)
    .get('/api/convert?input=3/7.2/4kg')
    .end((req, res) => {
      assert.equal(res.text, 'invalid number');
      done();
    });
  });
  test('Convert an invalid number AND unit such as 3/7.2/4kilomegagram: GET request to /api/convert', done => {
    chai.request(server)
    .get('/api/convert?input=3/7.2/4kilomegagram')
    .end((req, res) => {
      assert.equal(res.text, 'invalid number and unit');
      done();
    });
  });
  test('Convert with no number such as kg: GET request to /api/convert', done => {
    chai.request(server)
    .get('/api/convert?input=kg')
    .end((req, res) => {
      if(res.text.slice(0,7) !== 'invalid') {
        const data = JSON.parse(res.text);
        assert.isObject(data);
        assert.equal(data.initNum, 1)
      } else {
        assert.fail('Should return an object');
      }
      done();
    })
  })
});
