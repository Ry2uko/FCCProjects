function palindrome(str) {
  const regex = /[a-z]|\d/;
  const fixed = str
  .toLowerCase()  
  .split("")
  .reduce((x,y) => {
    if(regex.test(y)) x.unshift(y);
    return x;
  }, []);
  return [...fixed].reverse().join("") === fixed.join("");
}

console.log(palindrome("Racecar"));
