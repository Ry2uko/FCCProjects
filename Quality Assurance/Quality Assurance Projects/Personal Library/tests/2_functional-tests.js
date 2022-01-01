'use strict';
const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

function postBook(title) {
  return new Promise((resolve, reject) => {
    chai.request(server)
    .post('/api/books')
    .set('content-type', 'application/json')
    .send({ title })
    .end((err, res) => {
      res.body._id 
      ? resolve(res.body)
      : reject();
    });
  });
}

suite('Functional Tests', function() {

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
          chai.request(server)
          .post('/api/books')
          .set('content-type', 'application/json')
          .send({ title: "Nineteen Eighty-Four"})
          .end((err, res) => {
            assert.equal(res.body.title, 'Nineteen Eighty-Four');
            assert.isOk(res.body._id);
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .set('content-type', 'application/json')
        .send({})
        .end((err, res) => {
          assert.equal(res.text, 'missing required field title');
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end((err, res) => {
          assert.isArray(res.body);
          assert.isAtLeast(res.body.length, 1);
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/invalidId')
        .end((err, res) => {
          assert.equal(res.text, 'no book exists');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        postBook({
          title: "Hairy Potter"
        }).then(data => {
          chai.request(server)
          .get(`/api/books/${data._id}`)
          .end((err, res) => {
            assert.isObject(res.body);
            assert.isOk(res.body._id);
            assert.equal(res.body.title, data.title);
            assert.equal(res.body.comments, []);
            assert.equal(res.body.commentcount, 0);
          });
        }).catch(err => {
          assert.fail('Should not return error')
        })
        done();
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        postBook({
          title: "Anna Karenina"
        }).then(data => {
          chai.request(server)
          .post(`/api/books/${data._id}`)
          .set('content-type', 'application/json')
          .send({
            comment: "the GOAT"
          })
          .end((err, res) => {
            assert.equal(res.body.commentcount, 1);
            assert.equal(res.body.comments[0], 'the GOAT');
            assert.equal(res.body.title, data.title);
            assert.equal(res.body._id, data._id);
          });
        }).catch(err => {
          assert.fail('should not return error');
        })
        done();
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        postBook({
          title: "Anna Karenina"
        }).then(data => {
          chai.request(server)
          .post(`/api/books/${data._id}`)
          .set('content-type', 'application/json')
          .send({})
          .end((err, res) => {
            assert.equal(res.text, 'missing required field comment');
          });
        }).catch(err => {
          assert.fail('should not return error');
        })
        done();
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post('/api/books/invalidId')
        .set('content-type', 'application/json')
        .send({
          comment: 'wow'
        })
        .end((err, res) => {
          assert.equal(res.text, 'no book exists');
          done();
        });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        postBook({
          title: "To Kill a Mockingbird"
        }).then(data => {
          chai.request(server)
          .delete(`/api/books/${data._id}`)
          .end((err, res) => {
            assert.equal(res.text, 'delete successful');
          });
        }).catch(err => {
          assert.fail('should not return error');
        });
        done();
      });

      test('Test DELETE /api/books/[id] with id not in db', function(done){
        chai.request(server)
        .delete('/api/books/invalidId')
        .end((err, res) => {
          assert.equal(res.text, 'no book exists');
          done();
        });
      });

    });

  });

});
