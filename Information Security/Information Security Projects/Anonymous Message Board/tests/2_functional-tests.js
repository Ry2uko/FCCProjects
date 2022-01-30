const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { post } = require('../server');

chai.use(chaiHttp);

function getBody(url) {
  return new Promise((resolve, reject) => {
    chai.request(server)
    .get(url)
    .end((err, res) => {
      if (!err) {
        resolve(res.body);
      } else {
        reject(err);
      }
    });
  })
}

function postRequest(url, body) {
  return new Promise((resolve, reject) => {
    chai.request(server)
    .post(url)
    .set('content-type', 'application/json')
    .send(body)
    .end(err => {
      if (!err) {
        resolve()
      } else {
        reject(err);
      }
    });
  })
}

suite('Functional Tests', function() {
  const threadUrl = '/api/threads/test',
  repliesUrl = '/api/replies/test';

  suite('/api/threads/{board}', () => {
    test('Creating a new thread: POST request', done => {
      const text = 'Test Thread',
      delete_password = '1010';

      postRequest(threadUrl, { text, delete_password }).then(() => {
        getBody(threadUrl).then(data => {
          data = data[0];
          assert.equal(data.text, text);
          assert.isNotNull(data._id);
          assert.equal(data.created_on, data.bumped_on);
          assert.isArray(data.replies);
          done();
        }).catch(err => done(err));
      }).catch(err => done(err));
      
    }).timeout(8000);
    test('Viewing the 10 most recent threads with 3 replies each: GET request', done => {
      getBody(threadUrl).then(data => {
        assert.isAtMost(data.length, 10);
        for (let i = 0; i < data.length; i++) {
          assert.containsAllKeys(data[i], [
            '_id',
            'text',
            'created_on',
            'bumped_on',
            'replies',
            'replycount'
          ]);
          assert.isAtMost(data[i].replies.length, 3);
          assert.notExists(data[i].delete_password);
          assert.notExists(data[i].reported);

          for (let j = 0; j < data[i].replies.length; j++) {
            assert.notExists(data[i].replies[j].delete_password);
            assert.notExists(data[i].replies[j].reported);
          }

        }
        done();
      }).catch(err => done(err));
    }).timeout(8000);
    test('Deleting a thread with the incorrect password: DELETE request', done => {
      const text = 'Delete Me1',
      delete_password = '1010';

      postRequest(threadUrl, { text, delete_password }).then(() => {
        getBody(threadUrl).then(data => {
          const thread_id = data[0]._id,
          delete_password = '0101';
          chai.request(server)
          .delete(threadUrl)
          .set('content-type', 'application/json')
          .send({ thread_id, delete_password })
          .end((err, res) => {
            if (!err) {
              assert.equal(res.text, 'incorrect password');
              done();
            } else {
              done(err);
            }
          });
  
        }).catch(err => done(err));
      }).catch(err => done(err));
    }).timeout(8000);
    test('Deleting a thread with the correct password: DELETE request', done => {
      const text = 'Delete Me2',
      delete_password = '1010';
      postRequest(threadUrl, { text, delete_password }).then(() => {
        getBody(threadUrl).then(data => {
          const thread_id = data[0]._id,
          delete_password = '1010';
          chai.request(server)
          .delete(threadUrl)
          .set('content-type', 'application/json')
          .send({ thread_id, delete_password })
          .end((err, res) => {
            if (!err) {
              assert.equal(res.text, 'success');
              done();
            } else {
              done(err);
            }
          });
  
        }).catch(err => done(err));
      }).catch(err => done(err));
    }).timeout(8000);
    test('Reporting a thread: PUT request', done => {
      getBody(threadUrl).then(data => {
        const thread_id = data[0]._id;

        chai.request(server)
        .put(threadUrl)
        .set('content-type', 'application/json')
        .send({ thread_id })
        .end((err, res) => {
          if (!err) {
            assert.equal(res.text, 'reported');
            done();
          } else {
            done(err);
          }
        });

      }).catch(err => done(err));
    }).timeout(8000);
  });

  suite('/api/replies/{board}', () => {
    test('Creating a new reply: POST request', done => {
      getBody(threadUrl).then(data => {
        const thread_id = data[0]._id,
        replycount = data[0].replycount,
        text = 'Test Reply',
        delete_password = '1010';

        postRequest(repliesUrl, { text, delete_password, thread_id }).then(() => {
          getBody(threadUrl).then(data => {
            data = data[0];
            assert.notEqual(data.created_on, data.bumped_on);
            assert.equal(
              Math.round(new Date(data.replies[0].created_on).getTime() / 1000), 
              Math.round(new Date(data.bumped_on).getTime() / 1000), 
            );
            assert.equal(replycount + 1, data.replycount);
            assert.equal(thread_id, data._id);
            done();
          }).catch(err => done(err));
        }).catch(err => done(err));
      }).catch(err => done(err));
    }).timeout(8000);
    test('Viewing a single thread with all replies: GET request', done => {
      getBody(threadUrl).then(data => {
        const thread_id = data[0]._id,
        text = 'Test Reply',
        delete_password = '1010';

        postRequest(repliesUrl, { text, delete_password, thread_id }).then(() => {
          getBody(`${repliesUrl}?thread_id=${thread_id}`).then(data => {
            assert.isAtLeast(data.replies.length, 1);
            assert.isAtLeast(data.replycount, 1);
            assert.equal(data.replies.length, data.replycount);
            assert.equal(thread_id, data._id);
            assert.equal(data.replies[0].text, text);
            assert.notExists(data.reported);
            assert.notExists(data.delete_password);
            for (let i = 0; i < data.replies.length; i++) {
              assert.notExists(data.replies[i].reported);
              assert.notExists(data.replies[i].delete_password);
            }
            done();
          }).catch(err => done(err));
        }).catch(err => done(err));
      }).catch(err => done(err));
    }).timeout(8000);
    test('Deleting a reply with the incorrect password: DELETE request', done => {
      getBody(threadUrl).then(data =>{
        const text = 'Delete Me1',
        thread_id = data[0]._id,
        delete_password = '1010';

        postRequest(repliesUrl, { text, delete_password, thread_id }).then(() => {
          getBody(threadUrl).then(data => {
            const thread_id = data[0]._id,
            reply_id = data[0].replies[0]._id,
            delete_password = '0101';

            chai.request(server)
            .delete(repliesUrl)
            .set('content-type', 'application/json')
            .send({ thread_id, delete_password, reply_id })
            .end((err, res) => {
              if (!err) {
                assert.equal(res.text, 'incorrect password');
                done();
              } else {
                done(err);
              }
            });
    
          }).catch(err => done(err));
        }).catch(err => done(err));
      }).catch(err => done(err));
    }).timeout(8000);
    test('Deleting a reply with the correct password: DELETE request', done => {
      getBody(threadUrl).then(data =>{
        const text = 'Delete Me1',
        thread_id = data[0]._id,
        delete_password = '1010';

        postRequest(repliesUrl, { text, delete_password, thread_id }).then(() => {
          getBody(threadUrl).then(data => {
            const thread_id = data[0]._id,
            reply_id = data[0].replies[0]._id,
            delete_password = '1010';

            chai.request(server)
            .delete(repliesUrl)
            .set('content-type', 'application/json')
            .send({ thread_id, delete_password, reply_id })
            .end((err, res) => {
              if (!err) {
                assert.equal(res.text, 'success');
                done();
              } else {
                done(err);
              }
            });
    
          }).catch(err => done(err));
        }).catch(err => done(err));
      }).catch(err => done(err));
    }).timeout(8000);
    test('Reporting a thread: PUT request', done => {
      getBody(threadUrl).then(data => {
        const thread_id = data[0]._id,
        reply_id = data[0].replies[0]._id;

        chai.request(server)
        .put(repliesUrl)
        .set('content-type', 'application/json')
        .send({ thread_id, reply_id })
        .end((err, res) => {
          if (!err) {
            assert.equal(res.text, 'reported');
            done();
          } else {
            done(err);
          }
        });

      }).catch(err => done(err));
    }).timeout(8000);
  })

});
