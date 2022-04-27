import chaiHttp from 'chai-http';
import chai from 'chai';
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

suite('Functional Tests', () => {
  suite('GET request to /api/query/:query', () => {
    // Validation Tests
    test('Handle non-numeric page', done => {
      getReq('/api/query/dog?page=e2e').then(resp => {
        assert.equal(resp.body.error, 'Page is not a number');
        assert.equal(resp.statusCode, 400);
        done();
      }).catch(err => done(err));
    }).timeout(2500);
    test('Handle page not equal or between 1-100', done => {
      getReq('/api/query/cat?page=0').then(resp => {
        assert.equal(resp.body.error, 'Page is not equal or between 1 to 100');
        assert.equal(resp.statusCode, 400);
        done();
      }).catch(err => done(err));
    }).timeout(2500);
    test('Handle non-numeric image count', done => {
      getReq('/api/query/night?imgCount=f2f').then(resp => {
        assert.equal(resp.body.error, 'Image count is not a number');
        assert.equal(resp.statusCode, 400);
        done();
      }).catch(err => done(err));
    }).timeout(2500);
    test('Handle image count not equal or between 1-100', done => {
      getReq('/api/query/sun?imgCount=99999').then(resp => {
        assert.equal(resp.body.error, 'Image count is not equal or between 1 to 100');
        assert.equal(resp.statusCode, 400);
        done();
      }).catch(err => done(err));
    }).timeout(2500);
    test('Handle invalid image size', done => {
      getReq('/api/query/tree?imgSize=verybig').then(resp => {
        assert.equal(resp.body.error, 'Image size is invalid');
        assert.equal(resp.statusCode, 400);
        done();
      }).catch(err => done(err));
    }).timeout(2500);

    test('Handle no result', done => {
      getReq('/api/query/mjcaedalxg3oi3').then(resp => {
        assert.equal(resp.body.error, 'No result');
        assert.equal(resp.statusCode, 404);
        done();
      }).catch(err => done(err));
    }).timeout(2500);
    test('GET request with complete and valid queries', done => {
      getReq('/api/query/banana?page=5&imgCount=25&imgSize=all').then(resp => {
        const images = resp.body.images;
        let image = images[0];

        assert.isAtMost(images.length, 25, 'image count is greater than 5');
        assert.isAtLeast(images.length, 1, 'image count is less than 1');

        assert.isDefined(image.width, 'missing width');
        assert.isDefined(image.height, 'missing height');
        assert.isDefined(image.size, 'missing size');

        assert.isDefined(image.url.small, 'missing small image url');
        assert.isDefined(image.url.regular, 'missing regular image url');
        assert.isDefined(image.url.full, 'missing full image url');

        assert.isDefined(image.description, 'missing description');
        assert.isDefined(image.thumbnail, 'missing thumbnail');
        assert.isDefined(image.download, 'missing download');
        assert.isDefined(image.uploadedBy, 'missing uploadedBy');
        done();
      }).catch(err => done(err));
    }).timeout(8000);
  });
  suite('GET request to /api/recent', () => {
    test('GET /api/recent', done => {
      getReq('/api/query/bread').then(() => {
        getReq('/api/recent').then(resp => {
          const recent = resp.body.history[resp.body.history.length - 1];
          assert.equal(recent.searchQuery, 'bread');
          assert.equal(resp.statusCode, 200);
          done();
        }).catch(err => done(err));
      }).catch(err => done(err)); 
    }).timeout(5000);
  });
  suite('Misc', () => {
    test('GET non-existing route', done => {
      getReq('/non-existent').then(resp => {
        assert.equal(resp.body.error, 'Not found');
        assert.equal(resp.statusCode, 404);
        done();
      }).catch(err => done(err));
    }).timeout(2500);
    test('GET /', done => {
      getReq('/').then(resp => {
        assert.exists(resp.text);
        assert.equal(resp.statusCode, 200);
        done();
      }).catch(err => done(err));
    }).timeout(2500);
  });
});