let drawer = [
  ["PENNY", 0.01],
  ["NICKEL", 0.05],
  ["DIME", 0.1],
  ["QUARTER", 0.25],
  ["ONE", 1.0],
  ["FIVE", 5.0],
  ["TEN", 10.0],
  ["TWENTY", 20.0],
  ["ONE HUNDRED", 100.0]
].reverse();
function checkCashRegister(price, cash, cid) {
  let change = cash - price;
  let status = ["INSUFFICIENT_FUNDS", "CLOSED", "OPEN"]
  let total = cid.reduce((a,b) => {a += b[1]; return a}, 0) * 100 / 100;
  if(total === change) {
    return {status: status[1], change: cid}
  }
  let subDrawer = cid.reduce((a,b) => {
    a[b[0]] = b[1];
    return a;
  }, {});
  let changeDrawer = drawer.reduce((a,b) => {
    let val = 0;
    while(subDrawer[b[0]] > 0 && change >= b[1]) {
      change -= b[1]
      subDrawer[b[0]] -= b[1]
      val += b[1]
      change = Math.round(change * 100) / 100;
    }
    if(val > 0) {
      a.push([b[0], val])
    }
    return a;
  }, []);
  
  if(changeDrawer.length < 1 || change > 0) {
    return {status: status[0], change: []};
  } else if(total < cash - price) {
    return {status: status[0], change: []};
  }
  return {status: status[2], change: changeDrawer};
}

console.log(checkCashRegister(
  19.5, 
  20, 
  [
    ["PENNY", 0.5], 
    ["NICKEL", 0], 
    ["DIME", 0], 
    ["QUARTER", 0], 
    ["ONE", 0], 
    ["FIVE", 0], 
    ["TEN", 0], 
    ["TWENTY", 0], 
    ["ONE HUNDRED", 0]
  ]
));