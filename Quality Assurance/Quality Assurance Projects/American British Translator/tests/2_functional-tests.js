const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('POST request to /api/translate', () => {
    test('translation with text and locale fields', done => {
      chai.request(server)
      .post('/api/translate')
      .set('content-type', 'application/json')
      .send({
        text: "Mr. Barnes",
        locale: "american-to-british"
      })
      .end((err, res) => {
        assert.equal(res.body.text, 'Mr. Barnes');
        assert.notEqual(res.body.translation, 'Everything looks good to me!');
        assert.include(res.body.translation, '<span class="highlight">');
        done();
      });
    });
    test('translation with text and invlaid locale field', done => {
      chai.request(server)
      .post('/api/translate')
      .set('content-type', 'application/json')
      .send({
        text: "banana",
        locale: "bri ish"
      })
      .end((err, res) => {
        assert.deepEqual(res.body, {
          error: "Invalid value for locale field"
        });
        done();
      });
    });
    test('translation with missing text field', done => {
      chai.request(server)
      .post('/api/translate')
      .set('content-type', 'application/json')
      .send({
        locale: "british-to-american"
      })
      .end((err, res) => {
        assert.deepEqual(res.body, {
          error: "Required field(s) missing"
        });
        done();
      });
    });
    test('translation with missing locale field', done => {
      chai.request(server)
      .post('/api/translate')
      .set('content-type', 'application/json')
      .send({
        text: "Harry Potter"
      })
      .end((err, res) => {
        assert.deepEqual(res.body, {
          error: "Required field(s) missing"
        });
        done();
      });    
    });
    test('translation with empty text', done => {
      chai.request(server)
      .post('/api/translate')
      .set('content-type', 'application/json')
      .send({
        text: "",
        locale: "american-to-british"
      })
      .end((err, res) => {
        assert.deepEqual(res.body, {
          error: "No text to translate"
        });
        done();
      });
    });
    test('translation with text that needs no translation', done => {
      chai.request(server)
      .post('/api/translate')
      .set('content-type', 'application/json')
      .send({
        text: "nappy",
        locale: "american-to-british"
      })
      .end((err, res) => {
        assert.equal(res.body.text, 'nappy');
        assert.equal(res.body.translation, 'Everything looks good to me!');
        done();
      });
    });
  });
});
