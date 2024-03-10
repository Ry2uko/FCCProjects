function convertToRoman(num) {
  let romnum = [
      {val: 1000, rom: "M"},
      {val: 900, rom: "CM"},        
      {val: 500, rom: "D"},
      {val: 400, rom: "CD"},
      {val: 100, rom: "C"},
      {val: 90, rom: "XC"},
      {val: 50, rom: "L"},
      {val: 40, rom: "XL"},
      {val: 10, rom: "X"},
      {val: 9, rom: "IX"},
      {val: 5, rom: "V"},
      {val: 4, rom: "IV"},
      {val: 1, rom: "I"}
      
  ]
  const roman = [];
  while(num > 0) {
      for(let i = 0; i < romnum.length; i++) {
          if(num >= romnum[i].val) {
              num -= romnum[i].val
              roman.push(romnum[i].rom)
              break;
          }
      }
  }
return roman.join("");
}

console.log(convertToRoman(3999));