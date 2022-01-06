const chai = require('chai');
const assert = chai.assert;

const Translator = require('../components/translator.js');
const translator = new Translator();

function removeHighlight(str) {
  str = str.replace(/<span class="highlight">/g, '');
  return str.replace(/<\/span>/g, '');
}

suite('Unit Tests', () => {
  suite('Translate to British English', () => {
    test('Mangoes are my favorite fruit.', done => {
      let translation = removeHighlight(translator
      .britishTranslate('Mangoes are my favorite fruit.'));
      assert.equal(translation, 'Mangoes are my favourite fruit.');
      done();
    });
    test('I ate yogurt for breakfast.', done => {
      let translation = removeHighlight(translator
      .britishTranslate('I ate yogurt for breakfast.'));
      assert.equal(translation, 'I ate yoghurt for breakfast.');
      done();
    });
    test('We had a party at my friend\'s condo.', done => {
      let translation = removeHighlight(translator
      .britishTranslate('We had a party at my friend\'s condo.'));
      assert.equal(translation, 'We had a party at my friend\'s flat.')
      done();
    });
    test('Can you toss this in the trashcan for me?', done => {
      let translation = removeHighlight(translator
      .britishTranslate('Can you toss this in the trashcan for me?'));
      assert.equal(translation, 'Can you toss this in the bin for me?');
      done();
    });
    test('The parking lot was full.', done => {
      let translation = removeHighlight(translator
      .britishTranslate('The parking lot was full.'));
      assert.equal(translation, 'The car park was full.');
      done();
    });
    test('Like a high tech Rube Goldberg machine.', done => {
      let translation = removeHighlight(translator
      .britishTranslate('Like a high tech Rube Goldberg machine.'));
      assert.equal(translation, 'Like a high tech Heath Robinson device.');
      done();
    });
    test('To play hooky means to skip class or work.', done => {
      let translation = removeHighlight(translator
      .britishTranslate('To play hooky means to skip class or work.'));
      assert.equal(translation, 'To bunk off means to skip class or work.');
      done();
    });
    test('No Mr. Bond, I expect you to die.', done => {
      let translation = removeHighlight(translator
      .britishTranslate('No Mr. Bond, I expect you to die.'));
      assert.equal(translation, 'No Mr Bond, I expect you to die.');
      done();
    });
    test('Dr. Grosh will see you now.', done => {
      let translation = removeHighlight(translator
      .britishTranslate('Dr. Grosh will see you now.'));      
      assert.equal(translation, 'Dr Grosh will see you now.');
      done();
    });
    test('Lunch is at 12:15 today.', done => {
      let translation = removeHighlight(translator
      .britishTranslate('Lunch is at 12:15 today.'));
      assert.equal(translation, 'Lunch is at 12.15 today.');
      done();
    });
  });
  suite('Translate to American English', () => {
    test('We watched the footie match for a while.', done => {
      let translation = removeHighlight(translator
      .americanTranslate('We watched the footie match for a while.'));
      assert.equal(translation, 'We watched the soccer match for a while.');
      done();
    });
    test('Paracetamol takes up to an hour to work.', done => {
      let translation = removeHighlight(translator
      .americanTranslate('Paracetamol takes up to an hour to work.'));
      assert.equal(translation, 'Tylenol takes up to an hour to work.');
      done();
    });
    test('First, caramelise tho onions.', done => {
      let translation = removeHighlight(translator
      .americanTranslate('First, caramelise the onions.'));
      assert.equal(translation, 'First, caramelize the onions.');
      done();
    });
    test('I spent the bank holiday at the funfair.', done => {
      let translation = removeHighlight(translator
      .americanTranslate('I spent the bank holiday at the funfair.'));
      assert.equal(translation, 'I spent the public holiday at the carnival.');
      done();
    });
    test('I had a bicky then went to the chippy.', done => {
      let translation = removeHighlight(translator
      .americanTranslate('I had a bicky then went to the chippy'));
      assert.equal(translation, 'I had a cookie then went to the fish-and-chip shop');
      done();
    });
    test('I\'ve just got bits and bobs in my bum bag.', done => {
      let translation = removeHighlight(translator
      .americanTranslate('I\'ve just got bits and bobs in my bum bag'));
      assert.equal(translation, 'I\'ve just got odds and ends in my fanny pack');
      done();
    });
    test('The car boot sale at Boxted Airfield was called off.', done => {
      let translation = removeHighlight(translator
      .americanTranslate('The car boot sale at Boxted Airfield was called off.'));
      assert.equal(translation, 'The swap meet at Boxted Airfield was called off.');
      done();
    });
    test('Have you met Mrs Kalyani?', done => {
      let translation = removeHighlight(translator
      .americanTranslate('Have you met Mrs Kalyani?'));
      assert.equal(translation, 'Have you met Mrs. Kalyani?');
      done();
    });
    test('Prof Joyner of King\'s College, London.', done => {
      let translation = removeHighlight(translator
      .americanTranslate('Prof Joyner of King\'s College, London.'));
      assert.equal(translation, 'Prof. Joyner of King\'s College, London.');
      done();
    });
    test('Tea time is usually around 4 or 4.30.', done => {
      let translation = removeHighlight(translator
      .americanTranslate('Tea time is usually around 4 or 4.30.'));
      assert.equal(translation, 'Tea time is usually around 4 or 4:30.');
      done();
    });
  });
  suite('Highlight Translation', () => {
    test('Mangoes are my favorite fruit.', done => {
      let translation = translator.britishTranslate('Mangoes are my favorite fruit.');
      assert.include(translation, '<span class="highlight">favourite</span>');
      done();
    });
    test('I ate yogurt for breakfast.', done => {
      let translation = translator.britishTranslate('I ate yogurt for breakfast.');
      assert.include(translation, '<span class="highlight">yoghurt</span>');
      done();
    });
    test('We watched the footie match for a while.', done => {
      let translation = translator.americanTranslate('We watched the footie match for a while.');
      assert.include(translation, '<span class="highlight">soccer</span>');
      done();
    });
    test('Paracetamol takes up to an hour to work.', done => {
      let translation = translator.americanTranslate('Paracetamol takeks up to an hour to work.');
      assert.include(translation, '<span class="highlight">Tylenol</span>');
      done();
    });
  });
});
