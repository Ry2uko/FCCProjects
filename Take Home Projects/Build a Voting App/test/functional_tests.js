import chaiHttp from 'chai-http';
import chai, { Assertion } from 'chai';
import server from '../server.js';

const assert = chai.assert;
chai.use(chaiHttp);

const getReq = url => {
  return new Promise((resolve, reject) => {
    chai.request(server)
      .get(url) 
      .end((err, res) => !err ? resolve(res) : reject(res));
  });
}

const postReq = (url, body, auth) => {
  return new Promise((resolve, reject) => {
    let reqHeaders = { 'content-type': 'application/json' };
    if (auth) reqHeaders['auth-user'] = auth;

    chai.request(server)
      .post(url)
      .set(reqHeaders)
      .send(body)
      .end((err, res) => !err ? resolve(res) : reject(res));
  });
};

const deleteReq = (url, body, auth) => {
  return new Promise((resolve, reject) => {
    let reqHeaders = { 'content-type': 'application/json' };
    if (auth) reqHeaders['auth-user'] = auth;

    chai.request(server)
      .delete(url)
      .set(reqHeaders)
      .send(body)
      .end((err, res) => !err ? resolve(res) : reject(res));
  });
}

const putReq = (url, body, auth) => {
  return new Promise((resolve, reject) => {
    let reqHeaders = { 'content-type': 'application/json' }
    if (auth) reqHeaders['auth-user'] = auth;

    chai.request(server)
      .put(url)
      .set(reqHeaders)
      .send(body)
      .end((err, res) => !err ? resolve(res) : reject(res));
  });
};

suite('Functional Tests', () => {
  suite('/', () => {
    test('Handle GET request to /', done => {
      getReq('/').then(resp => {
        assert.exists(resp.text);
        done();
      }).catch(err => done(err));
    }).timeout(5000);
    test('Handle GET request to /login', done => {
      getReq('/login').then(resp => {
        assert.exists(resp.text);
        done();
      }).catch(err => done(err));
    }).timeout(5000);
    test('Handle GET request to /signup', done => {
      getReq('/signup').then(resp => {
        assert.exists(resp.text);
        done();
      }).catch(err => done(err));
    }).timeout(5000);
  });

  suite('/poll', () => {
    suite('GET request to /poll', () => {
      test('Render index after request', () => {
        getReq('/poll').then(resp => {
          assert.exists(resp.text);
          done();
        }).catch(err => done(err));
      }).timeout(8000);
    });

    suite('GET request to /poll/api', () => {
      // assumes database is not empty
      test('Handle valid GET request', done => {
        getReq('/poll/api').then(resp => {
          const data = resp.body;
          assert.isArray(data.polls);
          assert.isAtLeast(data.polls.length, 1);
          let poll = data.polls[0];
          assert.exists(poll._id);
          assert.isString(poll.name);
          assert.isString(poll.created_by);
          assert.isString(poll.date_created);
          assert.isNumber(poll.total_votes);
          assert.isObject(poll.options);
          assert.isAtLeast(Object.keys(poll.options).length, 2);
          done();
        }).catch(err => done(err));
      }).timeout(10000);
      test('Handle GET request with one filter', done => {
        getReq('/poll/api?id=62f499d44b2ca50daf814115').then(resp => {
          const data = resp.body;
          assert.isAtLeast(data.polls.length, 1);
          done();
        }).catch(err => done(err));
      }).timeout(5000);
      test('Handle GET request with multiple filter', done => {
        getReq('/poll/api?id=62f499d44b2ca50daf814115&name=One Piece&created_by=Harveth').then(resp => {
          const data = resp.body;
          assert.isAtLeast(data.polls.length, 1);
          done();
        }).catch(err => done(err));
      }).timeout(5000);
      test('Handle GET request with filter with no result', done => {
        getReq('/poll/api?name=92345972345890234').then(resp => {
          const data = resp.body;
          assert.isEmpty(data.polls); 
          done();
        }).catch(err => done(err));
      }).timeout(5000);
    });

    suite('POST request to /poll/api', () => {
      test('Handle valid POST request', done => {
        getReq(`/user/api?name=DragonBourne`).then(resp => {
          const getUserData = resp.body;

          postReq('/poll/api', {
            name: 'Test Poll',
            options: ['A', 'B', 'C', 'D']
          }, 'DragonBourne').then(resp => {
            const postData = resp.body;

            assert.isObject(postData);
            assert.isString(postData.name);
            assert.equal(postData.created_by, 'DragonBourne');
            assert.isString(postData.date_created);
            assert.equal(postData.total_votes, 0);
            assert.isObject(postData.options);
            assert.deepEqual(Object.keys(postData.options), ['A', 'B', 'C', 'D']);
            assert.equal(postData.options['A'], 0);
            assert.isString(postData._id);
  
            getReq(`/user/api?name=${postData.created_by}`).then(resp => {
              const newGetUserData = resp.body;
              assert.equal(getUserData.user.polls_created+1, newGetUserData.user.polls_created);
              done();
            }).catch(err => done(err));

          }).catch(err => done(err));

        }).catch(err => done(err));
        
      }).timeout(10000);

      test('Handle unauthorized POST request', done => {
        postReq('/poll/api', {
          name: 'Test Poll 2',
          options: ['X', 'K', 'D']
        }).then(resp => {
          const data = resp.body;
          assert.isObject(data);
          assert.isString(data.error);
          assert.equal(data.error, 'Unauthorized');
          done();
        }).catch(err => done(err));
      }).timeout(8000);

      test('Handle invalid/missing poll name', done => {
        postReq('/poll/api', {
          options: ['X', 'Y']
        }).then(resp => {
          const data = resp.body;
          assert.isObject(data);
          assert.isString(data.error);
          assert.equal(data.error, 'Invalid or missing poll name.');
          done();
        }).catch(err => done(err));
      }).timeout(8000);

      test('Handle poll name with less than 4 characters', done => {
        postReq('/poll/api', {
          name: 'T',
          options: ['L', 'Y', 'D', 'A', 'C']
        }).then(resp => {
          const data = resp.body;
          assert.isObject(data);
          assert.isString(data.error);
          assert.equal(data.error, 'Poll name must be 4 characters or above.');
          done();
        }).catch(err => done(err));
      }).timeout(8000);

      test('Handle missing poll options', done => {
        postReq('/poll/api', {
          name: 'Test Poll 3',
        }).then(resp => {
          const data = resp.body;
          assert.isObject(data);
          assert.isString(data.error);
          assert.equal(data.error, 'Missing poll options.');
          done();
        }).catch(err => done(err));
      }).timeout(8000);

      test('Handle invalid poll options', done => {
        postReq('/poll/api', {
          name: 'Test Poll 4',
          options: {'L': 0, 'Y': 10, 'D': 16, 'A': 5, 'C': 5 }
        }).then(resp => {
          const data = resp.body;
          assert.isObject(data);
          assert.isString(data.error);
          assert.equal(data.error, 'Poll options must be an array of options.');
          done();
        }).catch(err => done(err));  
      }).timeout(8000);

      test('Handle invalid poll options count', done => {
        postReq('/poll/api', {
          name: 'Test Poll 5',
          options: ['A']
        }).then(resp => {
          const data = resp.body;
          assert.isObject(data);
          assert.isString(data.error);
          assert.equal(data.error, 'Poll options must have 2-20 options.');
          done();
        }).catch(err => done(err));
      }).timeout(8000);
    });

    suite('PUT request to /poll/api', () => {
      test('Handle valid PUT request', done => {
        getReq(`/user/api?name=DragonBourne`).then(resp => {
          const getUserData = resp.body.user;

          postReq('/poll/api', {
            name: 'Test Poll 1x',
            options: ['x1', 'x2', 'x3', 'x4']
          }, 'DragonBourne').then(resp => {
            const postData = resp.body;

            putReq('/poll/api', {
              id: postData._id,
              option: 'x3'
            }, 'DragonBourne').then(resp => {
              const putData = resp.body;
              assert.equal(postData.total_votes+1, putData.total_votes);
              assert.equal(putData.options['x3'], 1);

              getReq(`/user/api?name=DragonBourne`).then(resp => {
                const newGetUserData = resp.body.user;
                assert.equal(getUserData.total_votes+1, newGetUserData.total_votes);
                done();
              }).catch(err => done(err));

            }).catch(err => done(err));

          }).catch(err => done(err));

        }).catch(err => done(err));
      }).timeout(15000);
      test('Handle unauthorized PUT request', done => {
        postReq('/poll/api', {
          name: 'Test Poll 2x',
          options: ['x1', 'x2', 'x3', 'x4']
        }, 'DragonBourne').then(resp => {
          const postData = resp.body;

          putReq('/poll/api', {
            id: postData._id,
            option: 'x3'
          }).then(resp => {
            const putData = resp.body;

            assert.isObject(putData);
            assert.isString(putData.error);
            assert.equal(putData.error, 'Unauthorized');
            done();
          }).catch(err => done(err));

        }).catch(err => done(err));
      }).timeout(8000);
      test('Handle invalid/missing id', done => {
        postReq('/poll/api', {
          name: 'Test Poll 2x',
          options: ['x1', 'x2', 'x3', 'x4']
        }, 'DragonBourne').then(resp => {
          const postData = resp.body;

          putReq('/poll/api', {
            option: 'x3'
          }, 'DragonBourne').then(resp => {
            const putData = resp.body;

            assert.isObject(putData);
            assert.isString(putData.error);
            assert.equal(putData.error, 'Invalid/Missing id.');
            done();
          }).catch(err => done(err));

        }).catch(err => done(err));
      }).timeout(8000);
      test('Handle missing option', done => {
        postReq('/poll/api', {
          name: 'Test Poll 2x',
          options: ['x1', 'x2', 'x3', 'x4']
        }, 'DragonBourne').then(resp => {
          const postData = resp.body;

          putReq('/poll/api', {
            id: postData._id,
          }, 'DragonBourne').then(resp => {
            const putData = resp.body;

            assert.isObject(putData);
            assert.isString(putData.error);
            assert.equal(putData.error, 'Missing option.');
            done();
          }).catch(err => done(err));

        }).catch(err => done(err));
      }).timeout(8000);
      test('Handle same user vote', done => {
        postReq('/poll/api', {
          name: 'Test Poll 3x',
          options: ['x1', 'x2', 'x3', 'x4']
        }, 'DragonBourne').then(resp => {
          const postData = resp.body;

          putReq('/poll/api', {
            id: postData._id,
            option: 'x3'
          }, 'DragonBourne').then(resp => {

            putReq('/poll/api', {
              id: postData._id,
              option: 'x2'
            }, 'DragonBourne').then(resp => {
              const putData = resp.body;
  
              assert.isObject(putData);
              assert.isString(putData.error);
              assert.equal(putData.error, 'Same user cannot vote twice.');
              done();
            }).catch(err => done(err));

          }).catch(err => done(err));

        }).catch(err => done(err));
      }).timeout(8000);
      test('Handle non-existent option', done => {
        postReq('/poll/api', {
          name: 'Test Poll 4x',
          options: ['x1', 'x2', 'x3', 'x4']
        }, 'DragonBourne').then(resp => {
          const postData = resp.body;

          putReq('/poll/api', {
            id: postData._id,
            option: 'x8'
          }, 'DragonBourne').then(resp => {
            const putData = resp.body;

            assert.isObject(putData);
            assert.isString(putData.error);
            assert.equal(putData.error, 'Option does not exist.');
            done();
          }).catch(err => done(err));

        }).catch(err => done(err));
      }).timeout(8000);
    });

    suite('DELETE request to /poll/api', () => {
      test('Handle valid DELETE request', done => {
        postReq('/poll/api', {
          name: 'Test Poll 1zx',
          options: ['XA', 'XB', 'XC', 'XD']
        }, 'DragonBourne').then(resp => {
          const postData = resp.body;

          deleteReq('/poll/api', {
            id: postData._id
          }, 'DragonBourne').then(resp => {
            getReq(`/poll/api?id=${postData._id}`).then(resp => {
              assert.isEmpty(resp.body.polls);

              done();
            }).catch(err => done(err));

          }).catch(err => done(err));
        }).catch(err => done(err));
      }).timeout(12000);

      test('Handle unauthorized DELETE request', done => {
        postReq('/poll/api', {
          name: 'Test Poll 2zx',
          options: ['XA', 'XB', 'XC', 'XD']
        }, 'DragonBourne').then(resp => {
          const postData = resp.body;

          deleteReq('/poll/api', {
            id: postData._id
          }).then(resp => {
            const deletedPollData = resp.body;
            assert.isObject(deletedPollData);
            assert.isString(deletedPollData.error);
            assert.equal(deletedPollData.error, 'Unauthorized');
            done();
          }).catch(err => done(err));
        }).catch(err => done(err));
      }).timeout(8000);

      test('Handle invalid/missing id', done => {
        postReq('/poll/api', {
          name: 'Test Poll 2zx',
          options: ['XA', 'XB', 'XC', 'XD']
        }, 'DragonBourne').then(resp => {
          const postData = resp.body;

          deleteReq('/poll/api', {}, 'DragonBourne').then(resp => {
            const deletedPollData = resp.body;
            assert.isObject(deletedPollData);
            assert.isString(deletedPollData.error);
            assert.equal(deletedPollData.error, 'Missing id.');
            done();
          }).catch(err => done(err));
        }).catch(err => done(err));
      }).timeout(8000);

      test('Handle forbidden DELETE request', done => {
        postReq('/poll/api', {
          name: 'Test Poll 2zx',
          options: ['XA', 'XB', 'XC', 'XD']
        }, 'DragonBourne').then(resp => {
          const postData = resp.body;

          deleteReq('/poll/api', {
            id: postData._id
          }, 'Harveth').then(resp => {
            const deletedPollData = resp.body;
            assert.isObject(deletedPollData);
            assert.isString(deletedPollData.error);
            assert.equal(deletedPollData.error, 'Cannot delete poll (forbidden).');
            done();
          }).catch(err => done(err));
        }).catch(err => done(err));
      }).timeout(8000);
    });

    suite('GET request to /poll/:user/api', () => {
      test('Handle valid GET request', done => {
        getReq('/poll/DragonBourne/api').then(resp => {
          const data = resp.body;
          assert.isArray(data.polls);
          assert.isAtLeast(data.polls.length, 1);
          let poll = data.polls[0];
          assert.exists(poll._id);
          assert.isString(poll.name);
          assert.isString(poll.created_by);
          assert.isString(poll.date_created);
          assert.isNumber(poll.total_votes);
          assert.isObject(poll.options);
          assert.isAtLeast(Object.keys(poll.options).length, 2);
          done();
        }).catch(err => done(err));
      }).timeout(8000);
      test('Handle GET request with one filter', done => {
        getReq('/poll/DragonBourne/api?id=6308564dd7e387a7d451753e').then(resp => {
          const data = resp.body;
          assert.isAtLeast(data.polls.length, 1);
          done();
        }).catch(err => done(err));
      }).timeout(5000);
      test('Handle GET request with multiple filter', done => {
        getReq('/poll/DragonBourne/api?id=6308564dd7e387a7d451753e&name=Test').then(resp => {
          const data = resp.body;
          assert.isAtLeast(data.polls.length, 1);
          done();
        }).catch(err => done(err));
      }).timeout(5000);
      test('Handle GET request with filter with no result', done => {
        getReq('/poll/DragonBourne/api?id=6308564dd7e387a7d451763e').then(resp => {
          const data = resp.body;
          assert.isEmpty(data.polls); 
          done();
        }).catch(err => done(err));
      }).timeout(5000);
    });
  });
  
  suite('/user', () => {
    suite('GET request to /user/api', () => {
      test('Render index after request', done => {
        getReq('/user/api').then(resp => {
          assert.exists(resp.text);
          done();
        }).catch(err => done(err));
      }).timeout(5000);
    });
    suite('GET request to /user/:id/api', () => {
      test('Handle valid GET request', done => {
        getReq('/user/62f49d5ebc85be8b8863ff48/api').then(resp => {
          const data = resp.body.user;
          assert.isObject(data);
          assert.exists(data._id);
          assert.isString(data.username);
          assert.isNumber(data.polls_created);
          assert.isNumber(data.total_votes);
          assert.isString(data.date_created);
          done();
        }).catch(err => done(err));
      });
      test('Handle invalid id', done => {
        getReq('/user/0/api').then(resp => {
          const data = resp.body;
          assert.isObject(data);
          assert.isString(data.error);
          assert.equal(data.error, 'invalid id.');
          done();
        }).catch(err => done(err));
      }).timeout(5000);
      test('Handle non-existent user', done => {
        getReq('/user/62f49d5ebc85be8b8863ff49/api').then(resp => {
          const data = resp.body;
          assert.isObject(data);
          assert.isString(data.error);
          assert.equal(data.error, 'user not found.');
          done();
        }).catch(err => done(err));
      }).timeout(5000);
    });
  });
}); 