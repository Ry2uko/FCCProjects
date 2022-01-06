const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

const americanEng = [
  americanOnly,
  americanToBritishSpelling,
  americanToBritishTitles
],
americanEng2 = [
  americanToBritishSpelling,
  americanToBritishTitles
],
titles = Object.keys(americanToBritishTitles);

class Translator {
  americanTranslate(translateStr, transWord) {
    // British to American
    let translateArr = translateStr.split(' '),
    translated = '';

    if (transWord) {
      let word = translateArr[0].toLowerCase();

      // time
      if (/^.*(0?[1-9]|1[012])\.[0-5][0-9].*$/.test(word)) {
        word = word.match(/(0?[1-9]|1[012])\.[0-5][0-9]/)[0];
        word = word.replace(".", ":");
        return word;
      }
      // title
      if(/[^a-z\s]*[a-z]+\.[^a-z\s]*/i.test(word)) {
        if (titles.includes(word.toLowerCase())) {
          word = word.match(/[a-z]+\./)[0];
        } else {
          word = word.match(/[a-z]+/)[0];
        }
      } else if(/^[^a-z\s]+$/i.test(word)) {
        return false;
      }

      for (let british in britishOnly) {
        if (word === british.toLowerCase()) {
          translated = britishOnly[british].toLowerCase();
          if (translateStr[0] === translateStr[0].toUpperCase()) {
            translated = translated.replace(/^./, translated[0].toUpperCase());
          }
          return translated;
        }
      }
      // else loop
      for (let i = 0; i < americanEng2.length; i++) {
        for (let american in americanEng2[i]) {
          if (word === americanEng2[i][american].toLowerCase()) {
            translated = american.toLowerCase();
            if (translateStr[0] === translateStr[0].toUpperCase()) {
              translated = translated.replace(
                /^./,
                translated[0].toUpperCase()
              );
            }
            return translated;
          }
        }
      }
      return false;
    } else {
      // spelling
      for (let i = 0; i < translateArr.length; i++) {
        let word = translateArr[i];
        let translationA = this.americanTranslate(word, true);
        if (translationA) {
          if (/[a-z]+\./i.test(word)) {
            // title
            translationA = `<span class="highlight">${translationA}</span>`;
            if (titles.includes(word.toLowerCase())) {
              word = word.replace(word.match(/[a-z]+\./i)[0], translationA);
            } else {
              word = word.replace(word.match(/[a-z]+/i)[0], translationA);
            }
          } else if (/(0?[1-9]|1[012]).[0-5][0-9]/.test(word)) {
            // time
            translationA = `<span class="highlight">${translationA}</span>`;
            word = word.replace(
              word.match(/(0?[1-9]|1[012]).[0-5][0-9]/)[0],
              translationA
            );
          } else {
            translationA = `<span class="highlight">${translationA}</span>`;
            word = word.replace(word.match(/([a-z]|\.)+/i)[0], translationA);
          }
          translateArr.splice(i, 1, word);
        }
      }
      let sentence = translateArr.join(" ");
      let translationB = sentence;
      for (let vocab in britishOnly) {
        if (vocab.split(' ').length > 1) {
          vocab = vocab.toLowerCase();
          let wordRegexp = new RegExp(`[^a-z\-]+${vocab}[^a-z\-]+|^${vocab}[^a-z\-]+|[^a-z\-]+${vocab}$|^${vocab}$`, 'i');
          if (wordRegexp.test(translationB)) {
            let highlighted = `<span class="highlight">${britishOnly[vocab]}</span>`,
              vocabRegexp = new RegExp(vocab, "i");
            translationB = translationB.replace(vocabRegexp, highlighted);
          }
        }
      }
      if (translationB.toLowerCase() !== sentence.toLowerCase()) {
        sentence = translationB;
      }
      return sentence === translateStr ? false : sentence;
    }
  }
  britishTranslate(translateStr, transWord) {
    // American to British
    let translateArr = translateStr.split(' '),
    translated = '';

    if (transWord) {
      let word = translateArr[0].toLowerCase();

      //time
      if (/^.*(0?[1-9]|1[012]):[0-5][0-9].*$/.test(word)) {
        word = word.match(/(0?[1-9]|1[012]):[0-5][0-9]/)[0];
        word = word.replace(':', '.');
        return word;
      }
      // title
      if(/[^a-z\s]*[a-z]+\.[^a-z\s]*/i.test(word)) {
        if (titles.includes(word.toLowerCase())) {
          word = word.match(/[a-z]+\./)[0];
        } else {
          word = word.match(/[a-z]+/)[0];
        }
      } else if(/^[^a-z\s]+$/i.test(word)) {
        return false;
      }

      for (let i = 0; i < americanEng.length; i++) {
        for (let american in americanEng[i]) {
          if (word === american.toLowerCase() && american.split(' ').length === 1) {
            translated = americanEng[i][american].toLowerCase();
            if (translateStr[0] === translateStr[0].toUpperCase()) {
              translated = translated.replace(/^./, translated[0].toUpperCase());
            }
            return translated;
          }
        }
      }
      return false;
    } else {
      

      // spelling
      for (let i = 0; i < translateArr.length; i++) {
        let word = translateArr[i];
        let translationA = this.britishTranslate(word, true); 
        if (translationA) {
          if (/[a-z]+\./i.test(word)) {
            // title
            translationA = `<span class="highlight">${translationA}</span>`;
            if (titles.includes(word.toLowerCase())) {
              word = word.replace(word.match(/[a-z]+\./i)[0], translationA);
            } else {
              word = word.replace(word.match(/[a-z]+/i)[0], translationA);
            }
          } else if (/(0?[1-9]|1[012]).[0-5][0-9]/.test(word)) {
            // time
            translationA = `<span class="highlight">${translationA}</span>`;
            word = word.replace(
              word.match(/(0?[1-9]|1[012]).[0-5][0-9]/)[0], 
              translationA
            );
          } else {
            translationA = `<span class="highlight">${translationA}</span>`;
            word = word.replace(word.match(/[a-z]+/i)[0], translationA);
          }
          translateArr.splice(i, 1, word);
        }
      }
      let sentence = translateArr.join(' ');

      let translationB = sentence;
      for (let vocab in americanOnly) {
        if (vocab.split(' ').length > 1) {
          vocab = vocab.toLowerCase();
          let wordRegexp = new RegExp(`[^a-z]+${vocab}[^a-z]+|^${vocab}[^a-z]+|[^a-z]+${vocab}$|^${vocab}$`, 'i');
          if (wordRegexp.test(translationB)) {
            let highlighted = `<span class="highlight">${americanOnly[vocab]}</span>`,
            vocabRegexp = new RegExp(vocab, 'i');
            translationB = translationB.replace(vocabRegexp, highlighted);
          } 
        }
      }
      
      
      if (translationB.toLowerCase() !== sentence.toLowerCase()) {
        sentence = translationB;
      }

      return sentence === translateStr ? false : sentence;
    }
  }
}

module.exports = Translator;