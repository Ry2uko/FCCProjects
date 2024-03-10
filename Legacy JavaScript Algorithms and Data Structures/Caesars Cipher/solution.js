function rot13(str) {
  const tab1 = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
  const tab2 = ["N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

  return str.split("").reduce((a,b) => {
    if(/[a-zA-z]/.test(b)) {
      if(tab1.indexOf(b) >= 0) {
        a.push(tab2[tab1.indexOf(b)]);
      } else {
        a.push(tab1[tab2.indexOf(b)]);
      }
    } else {
      a.push(b)
    }
    return a;
  }, []).join("");

}

console.log(rot13("GUR DHVPX OEBJA SBK WHZCF BIRE GUR YNML QBT."));