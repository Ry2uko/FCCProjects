'use strict';
require('dotenv').config();
const request = require('request');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const conn = mongoose.connection;
conn.on('error', err => console.error(err));
conn.once('open', () => {
  console.log('Connected to Database');
})

const stockSchema = new mongoose.Schema({
  likes: {
    type: Number,
    default: 0
  },
  name: {
    type: String,
    required: true
  },
  ip_addr: {
    type: Array,
    default: []
  }
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = function (app) {

  function getStockData(stock) {
    return new Promise((resolve, reject) => {
      request(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`,
      (err, res, body) => {
        if (!err) {
          let data = JSON.parse(body);
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  }
  function findStock(stockSymbol) {
    return new Promise(async (resolve, reject) => {
      let stock;
      try {
        stock = await Stock.find({name: stockSymbol});

        if (stock.length === 0) { // Assuming that stock is an array
          stock = new Stock({ name: stockSymbol }); 
          try {
            stock = await stock.save();
            stock = [ stock ];
          } catch (err) {
            reject('Stock not found');
          }
        } 

        resolve(stock);
      } catch (err) {
        reject(err.message);
      }

      
    });
  }

  app.route('/api/stock-prices')
    .get(getStock, checkStock, async (req, res) => {
      const addr = req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      like = req.query.like;

      if (typeof req.query.stock === 'object') {
        const stockObj = res.locals.stockObj;
        let ipObj = {},
        idObj = {},
        likesObj = {},
        updatedLikesObj = {},
        stockData = [];
        
        // Set objects
        for (let i in stockObj) {
          ipObj[i] = stockObj[i][0].ip_addr;
          idObj[i] = stockObj[i][0]._id;
          likesObj[i] = stockObj[i][0].likes;
        }

        if (like === 'true') {
          
          // 1 like per ip
          for (let i in stockObj) {
            let ipAddr = ipObj[i],
            ipValid = true;

            if (ipAddr.length > 0) {
              for (let j = 0; j < ipAddr.length; j++) {
                let ip = ipAddr[j];
                try {
                  if (await bcrypt.compare(addr, ip)) {
                    ipValid = false;
                    break;
                  } 
                } catch (err) {
                  return res.json({ error: err.message });
                }
              }
            }

            if (ipValid) {  
              const hashedIp = await bcrypt.hash(addr, 10);
              let stockId = idObj[i],
              newStock = {};

              newStock.ip_addr = [...ipAddr, hashedIp];
              newStock.likes = likesObj[i] + 1;

              Stock.findByIdAndUpdate(
                stockId,
                newStock,
                { new: true },
                (err, updatedStock) => {
                  if (err) {
                    return res.json({ error: err });
                  }
                }
              );
                
            }

          }

          // Updated Likes
          for (let i in stockObj) {
            let stockId = idObj[i],
            updatedStock;

            try  {
              updatedStock = await Stock.findById(stockId);

              if (updatedStock == null) {
                return res.json({ error: 'Stock not found' });
              }
              updatedLikesObj[i] = updatedStock.likes;
            } catch (err) {
              return res.json({ error: err.message });
            }

          }
          
        }
        
        for (let i in stockObj) {
          getStockData(stockObj[i][0].name).then(data => {
            let otherObj, rel_likes;
            Object.keys(stockObj).map(j => {
              if (i !== j) otherObj = j;
            });

            if (like === 'true') {
              rel_likes = updatedLikesObj[i] - updatedLikesObj[otherObj];
            } else {
              rel_likes = likesObj[i] - likesObj[otherObj];
            }

            stockData.push({
              "stock": data.symbol,
              "price": data.iexClose,
              rel_likes
            });
            
            if (stockData.length === 2) {
              return res.json({ stockData });
            }
          });
          
        }

      } else {
        const stockName = req.query.stock,
        stock = res.locals.stock[0];
  
        let likes = stock.likes;
  
        if (like === 'true') {
          let ipAddr = stock.ip_addr,
          ipValid = true;
  
          if (ipAddr.length > 0) {

            // 1 like per ip
            for (let i = 0; i < ipAddr.length; i++) {
              let ip = ipAddr[i];
              try {
                if (await bcrypt.compare(addr, ip)) {
                  ipValid = false;
                  break;
                }
              } catch (err) {
                return res.json({ error: err.message });
              }
            }
          }
  
          if (ipValid) {
            const hashedIp = await bcrypt.hash(addr, 10);
            let stockId = stock._id,
            newStock = {};
  
            newStock.ip_addr = [...stock.ip_addr, hashedIp];
            newStock.likes = stock.likes + 1;
  
            Stock.findByIdAndUpdate(
              stockId,
              newStock,
              { new: true},
              (err, updatedStock) => {
                if (!err && updatedStock) {
                  likes = stock.likes + 1;
                } else {
                  return res.json({ error: err });
                }
              }
            );
  
          }
          
        }
  
        getStockData(stockName).then(data => {
          let stockData = {
            "stock": data.symbol,
            "price": data.iexClose,
            likes
          };
    
          return res.json({ stockData });
        });
      }
    });

    async function getStock(req, res, next) {
      let stock = req.query.stock,
      stockObj = {},
      stockSymbol;

      if (typeof stock === 'object') {
        if (stock.length !== 2) {
          res.status(422).send('Invalid stock');
        }
        for (let i = 0; i < stock.length; i++) {
          getStockData(stock[i]).then(data => {
            stockObj[stock[i]] = data.symbol;
            if (Object.keys(stockObj).length === 2) {
              res.locals.stockObj = stockObj;
              next();
            }
          });
        }
      } else if (!stock) {
        res.status(422).send('Invalid stock');
      } else {
        getStockData(stock).then(data => {
          stockSymbol = data.symbol;
          res.locals.stockSymbol = stockSymbol;
          next();
        });
      }
    }

    async function checkStock(req, res, next) {
      let localsObj = res.locals.stockObj,
      stockObj = {};

      if (typeof req.query.stock === 'object') {
        for (let i in localsObj) {
          findStock(localsObj[i]).then(stock => {
            stockObj[i] = stock;
            if (Object.keys(stockObj).length === 2) {
              res.locals.stockObj = stockObj;
              next();
            }
          })
        }
      } else {
        let stockSymbol = res.locals.stockSymbol;
        
        findStock(stockSymbol).then(stock => {
          res.locals.stock = stock;
          next();
        }).catch(err => {
          return res.json({ error: err });
        });
      }
    }
};
