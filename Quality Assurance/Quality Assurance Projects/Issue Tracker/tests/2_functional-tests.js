const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { post } = require('../server');

chai.use(chaiHttp);

const project = '/api/issues/testProject';

function postIssue(sendData) {
  return new Promise((resolve, reject) => {
    chai.request(server)
    post(project)
    .set('content-type', 'application/json')
    .send(sendData)
    .end((err, res) => {
      if(res.body._id) {
        resolve(res.body);
      } else {
        reject(res.body.error);
      }
    });
  });
}

suite('Functional Tests', () => {
  suite('POST requests', () => {
    test('Create an issue with every field: POST request to /api/issues/{project}', done => {
      chai.request(server)
      .post(project)
      .set('content-type', 'application/json')
      .send({
        issue_title: "Issue I",
        issue_text: "Issue Text",
        created_by: "Admin",
        assigned_to: "Users",
        status_text: "Pending"
      })
      .end((err, res) => {
        assert.isAtLeast(Object.keys(res.body).length, 9); 
        for (key in res.body) {
          if(key === "__v") continue; // Mongoose versionKey property defaults to 0
          assert.isOk(res.body[key]);
        }
        assert.equal(res.body.created_on, res.body.updated_on);
        done();
      });
    });
    test('Create an issue with only required fields: POST request to /api/issues/{project}', done => {
      chai.request(server)
      .post(project)
      .set('content-type', 'application/json')
      .send({
        issue_title: "Issue II",
        issue_text: "Issue Text",
        created_by: "Admin"        
      }).end((err, res) => {
        assert.isAtLeast(Object.keys(res.body).length, 9);
        for (key in res.body) {
          if(key === "__v") continue;
          if(key === "assigned_to" || key === "status_text") {
            assert.isNotOk(res.body[key]);
          } else {
            assert.isOk(res.body[key]);
          }
        }
        assert.equal(res.body.created_on, res.body.updated_on);
        done();
      });
    });
    test('Create an issue with missing required fields: POST request to /api/issues/{project}', done => {
      chai.request(server)
      .post(project)
      .set('content-type', 'application/json')
      .send({
        issue_title: "Issue III"
      })
      .end((err, res) => {
        assert.deepEqual(res.body, {
          error: "required field(s) missing"
        });
        done();
      });
    });
  });
  suite('GET requests', () => {
    test('View issues on a project: GET request to /api/issues/{project}', done => {
      chai.request(server)
      .get(project)
      .end((err, res) => {
        assert.isArray(res.body);
        assert.isAtLeast(Object.keys(res.body[0]).length, 9); 
        done();
      });
    });
    test('View issues on a project with one filter: GET request to /api/issues/{project}', done => {
      postIssue({
        issue_title: "Issue IV",
        issue_text: "Issue Text",
        created_by: "Admin"
      }).then(data => {
        chai.request(server)
        .get(`${project}?_id=${data._id}`)
        .end((err, res) => {
          assert.isArray(res.body);
          assert.equal(res.body.length, 1);
          assert.isAtLeast(Object.keys(res.body[0]).length, 9);
          assert.equal(res.body[0]._id, data._id);
        })
      }).catch(err => {
        assert.fail('Should not return error');
        console.error(err);
      });
      done();
    });
    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', done => {
      chai.request(server)
      .get(`${project}?issue_text=Issue Text&created_by=Admin&open=true`)
      .end((err, res) => {
        assert.isArray(res.body);
        assert.isAtLeast(res.body.length, 1);
        assert.isAtLeast(Object.keys(res.body[0]).length, 9);
        assert.equal(res.body[0].issue_text, "Issue Text");
        assert.equal(res.body[0].created_by, "Admin");
        assert.isOk(res.body[0].open);
        done();
      });
    });
  });
  suite('PUT requests', () => {
      test('Update one field on an issue: PUT request to /api/issues/{project}', done => {
        postIssue({
          issue_title: "Issue V",
          isuse_text: "Issue Text", 
          created_by: "Admin"
        }).then(data => {
          chai.request(server)
          .put(project)
          .set('content-type', 'application/json')
          .send({
            _id: data._id,
            open: false
          })
          .end((err, res) => {
            assert.deepEqual(res.body, {
              result: "successfully updated",
              _id: data._id
            });
          });

          chai.request(server)
          .get(`${project}?_id=${data._id}`)
          .end((err, res) => {
            assert.isNotOk(res.body[0].open);
            assert.equal(res.body[0]._id, data._id);
          });
        }).catch(err => {
          assert.fail('Should not return error');
          console.error(err);
        });
        done();
      });
      test('Update multiple fields on an issue: PUT request to /api/issues/{project}', done => {
        postIssue({
          issue_title: "Issue 6",
          isuse_text: "Issue Text", 
          created_by: "Admin",
          assigned_to: "Users",
          status_text: "Pending"
        }).then(data => {
          chai.request(server)
          .put(project)
          .set('content-type', 'application/json')
          .send({
            _id: data._id,
            issue_title: "Issue VI",
            status_text: "Completed",
            open: false
          })
          .end((err, res) => {
            assert.deepEqual(res.body, {
              result: "successfully updated",
              _id: data._id
            });
          });

          chai.request(server)
          .get(`${project}?_id=${data._id}`)
          .end((err, res) => {
            assert.equal(res.body[0].status_text, "Completed");
            assert.equal(res.body[0].issue_title, "Issue VI");
            assert.isNotOk(res.body[0].open);
            assert.equal(res.body[0]._id, data._id);
          });
        }).catch(err => {
          assert.fail('Should not return error');
          console.error(err);
        });
        done();
      });
      test('Update an issue with missing _id: PUT request to /api/issues/{project}', done => {
        chai.request(server)
        .put(project)
        .set('content-type', 'application/json')
        .send({
          open: false,
          status_text: "Completed"
        })
        .end((err, res) => {
          assert.deepEqual(res.body, {
            error: "missing _id"
          });
          done();
        });
      });
      test('Update an issue with no fields to update: PUT request to /api/issues/{project}', done => {
        postIssue({
          issue_title: "Issue VII",
          issue_text: "Issue Text",
          created_by: "Admin"
        }).then(data => {
          chai.request(server)
          .put(project)
          .set('content-type', 'application/json')
          .send({
            _id: data._id
          })
          .end((err, res) => {
            assert.deepEqual(res.body, {
              error: "no update field(s) sent",
              _id: data._id
            });
          });
        }).catch(err => {
          assert.fail('Should not return error');
          console.error(err);
        });
        done();
      });
      test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', done => {
        chai.request(server)
        .put(project)
        .set('content-type', 'application/json')
        .send({
          _id: "INVALID ID",
          open: false,
          status_text: "Completed"
        })
        .end((err, res) => {
          assert.deepEqual(res.body, {
            error: "could not update",
            _id: "INVALID ID"
          });
          done();
        });
      });
  });
  suite('DELETE requests', () => {
    test('Delete an issue: DELETE request to /api/issues/{project}', done => {
      postIssue({
        issue_title: "Issue VIII",
        issue_text: "Issue Text",
        created_by: "Admin"
      }).then(data => {
        chai.request(server)
        .delete(project)
        .set('content-type', 'application/json')
        .send({
          _id: data._id
        })
        .end((err, res) => {
          assert.deepEqual(res.body, {
            result: "successfully deleted",
            _id: data._id
          });
        });

        chai.request(server)
        .get(`${project}?_id=${data._id}`)
        .end((err, res) => {
          assert.isArray(res.body);
          assert.equal(res.body.length, 0);
        });
      }).catch(err => {
        assert.fail('Should not return error');
        console.error(err);
      });
      done();
    });
    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', done => {
      chai.request(server)
      .delete(project)
      .set('content-type', 'application/json')
      .send({
        _id: "INVALID ID"
      })
      .end((err, res) => {
        assert.deepEqual(res.body, {
          error: "could not delete", 
          _id: "INVALID ID"
        });
        done();
      });
    });
    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', done => {
      chai.request(server)
      .delete(project)
      .set('content-type', 'application/json')
      .send({})
      .end((err, res) => {
        assert.deepEqual(res.body, {
          error: "missing _id"
        });
        done();
      });
    });
  });
});
