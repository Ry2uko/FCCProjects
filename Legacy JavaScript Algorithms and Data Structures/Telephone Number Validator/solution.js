function telephoneCheck(str) {
  let regexp = /(^(\d\d\d(-|\s)\d\d\d(-|\s)\d\d\d\d)$)|(^(1\s\d\d\d(-|\s)\d\d\d(-|\s)\d\d\d\d)$)|(^(\d{10})$)|(^([(]\d\d\d[)]\d\d\d(-|\s)\d\d\d\d)$)|(^([(]\d\d\d[)](-|\s)\d\d\d(-|\s)\d\d\d\d)$)|(^(1(\s|)[(]\d\d\d[)]\d\d\d(-|\s)\d\d\d\d)$)|(^(1(\s|)[(]\d\d\d[)](-|\s)\d\d\d(-|\s)\d\d\d\d)$)/;
  return regexp.test(str);
}

console.log(telephoneCheck("555-555-5555"));