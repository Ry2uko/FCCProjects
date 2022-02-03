import Player from '../public/Player.mjs';
import Collectible from '../public/Collectible.mjs';
import { assert as _assert } from 'chai';
const assert = _assert;
import { JSDOM } from 'jsdom';

suite('Unit Tests', () => {
  
  suiteSetup(() => {
    // Mock the DOM for testing and load Solver
    return JSDOM.fromFile('./views/index.html')
      .then((dom) => {

        global.window = dom.window;
        global.document = dom.window.document;
      });
  });

  suite('Player Class', () => {
    test('Player class generates a player object.', done => {
      const testId = 'uniqueID00',
      testCoords = { x: 2, y: 5 };
      const testPlayer = new Player(testCoords.x, testCoords.y, testId);

      assert.isObject(testPlayer);
      assert.equal(testPlayer.x, testCoords.x);
      assert.equal(testPlayer.y, testCoords.y);
      assert.equal(testPlayer.id, testId);
      assert.equal(testPlayer.score, 0, 'default score should be 0');
      done();
    });
    test('movePlayer(dir) adjusts player\'s position.', done => {
      const testId = 'uniqueID00',
      testCoords = { x: 3, y: 8 };
      const testPlayer = new Player(testCoords.x, testCoords.y, testId);
      testPlayer.movePlayer('left');
      testCoords.x -= 1;
      assert.equal(testPlayer.x, testCoords.x);
      testPlayer.movePlayer('up');
      testCoords.y -= 1;
      assert.equal(testPlayer.y, testCoords.y);
      testPlayer.movePlayer('down');
      testCoords.y += 1;
      assert.equal(testPlayer.y, testCoords.y);
      testPlayer.movePlayer('right');
      testCoords.x += 1;
      assert.equal(testPlayer.x, testCoords.x);
      done();
    });
  });
  suite('Collectible class', () => {
    test('Collectible class generates a collectible object.', done => {
      const testCoords = { x: 3, y: 2 };
      const testCollectible = new Collectible(testCoords.x, testCoords.y);

      assert.isObject(testCollectible);
      assert.equal(testCollectible.x, testCoords.x);
      assert.equal(testCollectible.y, testCoords.y);
      assert.equal(testCollectible.value, 1, 'default value should be 1');
      done();
    });
  });
});