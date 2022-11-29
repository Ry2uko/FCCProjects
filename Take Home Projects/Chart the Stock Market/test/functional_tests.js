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
};

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
      .post(url)
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
    });
  });

  suite('/api', () => {
    test('Handle valid POST request', done => {
      postReq('/api', { symbol: 'TSLA' }).then(resp => {
        const postData = resp.body;
        assert.isObject(postData);
        assert.equal(postData.symbol, 'TSLA');
        assert.exists(postData.monthlyTimeSeries);
        assert.isAtLeast(Object.keys(postData.monthlyTimeSeries).length, 1);
        done();
      }).catch(err => done(err));
    }).timeout(5000);
    test('Handle missing stock symbol', done => {
      postReq('/api', {}).then(resp => {
        const postData = resp.body;
        assert.isObject(postData);
        assert.equal(postData.error, 'Invalid/Missing symbol.');
        done();
      }).catch(err => done(err));
    }).timeout(5000);
    test('Handle invalid stock symbol', done => {
      postReq('/api', { symbol: 'GOOGOOO' }).then(resp => {
        const postData = resp.body;
        assert.isObject(postData);
        assert.equal(postData.error, 'Invalid symbol length.');
        done();
      }).catch(err => done(err));
    }).timeout(5000);
    test('Handle non-existent symbol', done => {
      postReq('/api', { symbol: 'XZF7' }).then(resp => {
        const postData = resp.body;
        assert.isObject(postData);
        assert.equal(postData.error, 'Invalid API call.');
        done();
      }).catch(err => done(err));
    }).timeout(5000);
  });
});