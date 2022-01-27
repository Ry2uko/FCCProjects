const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

function getStock() {
  return new Promise((resolve, reject) => {
    chai.request(server)
      .get('/api/stock-prices?stock=msft&like=true')
      .end((err, res) => {
        let likeCount = res.body.stockData.likes;
        if (likeCount) {
          resolve(likeCount);
        } else {
          reject()
        }
      });
  })
}

suite('Functional Tests', function() {
  suite('GET request to /api/stock-prices/', () => {
    test('Viewing one stock', done => {
      chai.request(server)
      .get('/api/stock-prices?stock=goog')
      .end((err, res) => {
        let stockData = res.body.stockData;

        assert.isObject(res.body);
        assert.equal(Object.keys(res.body)[0], 'stockData');
        assert.equal(Object.keys(stockData).length, 3);
        assert.equal(stockData.stock, 'GOOG');

        done();
      });
    }).timeout(5000);
    test('Viewing one stock and liking it', done => {
      this.timeout(5000);
      chai.request(server)
      .get('/api/stock-prices?stock=aapl&like=true')
      .end((err, res) => {
        let stockData = res.body.stockData;
        assert.equal(Object.keys(stockData).length, 3);
        assert.equal(stockData.stock, 'AAPL');
        assert.isAbove(stockData.likes, 0);

        staticLikeCount = stockData.likes;
        done();
      });
    }).timeout(5000);
    test('Viewing the same stock and liking it again', done => {
      this.timeout(5000);
      getStock().then(data => {
        chai.request(server)
        .get('/api/stock-prices?stock=msft&like=true')
        .end((err, res) => {
          let stockData = res.body.stockData;
          assert.equal(stockData.stock, 'MSFT');
          assert.equal(stockData.likes, data);
        });
      });
      done();
    }).timeout(5000);
    test('Viewing two stocks', done => {
      chai.request(server)
      .get('/api/stock-prices?stock=GOOG&stock=MSFT')
      .end((err, res) => {
        let stockData = res.body.stockData;
        assert.isObject(res.body);
        assert.equal(Object.keys(res.body)[0], 'stockData');

        let stockOne = res.body.stockData[0];  
        assert.equal(Object.keys(stockOne).length, 3);
        assert.include(['GOOG', 'MSFT'], stockOne.stock);

        let stockTwo = res.body.stockData[1];
        assert.equal(Object.keys(stockTwo).length, 3);
        assert.include(['GOOG', 'MSFT'], stockTwo.stock);

        done();
      });
    }).timeout(5000);
    test('Viewing two stocks and liking them', done => {
      chai.request(server)
      .get('/api/stock-prices?stock=GOOG&stock=AAPL&like=true')
      .end((err, res) => {
        let stockOne = res.body.stockData[0];  
        assert.equal(Object.keys(stockOne).length, 3);
        assert.include(['GOOG', 'AAPL'], stockOne.stock);

        let stockTwo = res.body.stockData[1];
        assert.equal(Object.keys(stockTwo).length, 3);
        assert.include(['GOOG', 'AAPL'], stockTwo.stock);

        if (stockOne.rel_likes === 0) {
          assert.equal(stockTwo.rel_likes, 0);
        } else {
          assert.notEqual(stockOne.rel_likes, stockTwo.rel_likes);
        }

        done();
      });
    }).timeout(5000);
  });
});
