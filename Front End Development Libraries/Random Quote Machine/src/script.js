// Project by @Ry2uko
// Quotes Source: https://www.keepinspiring.me/famous-quotes/

const quotes = [
 {qt: "That which does not kill us makes us stronger.", at: "Friedrich Nietzsche"},
  {qt: "The journey of a thousand miles begins with one step.", at: "Lao Tzu"},
  {qt: "Life is what happens when you’re busy making other plans.", at: "John Lennon"},
  {qt: "When the going gets tough, the tough get going.", at: "Joe Kennedy"},
  {qt: "You must be the change you wish to see in the world.", at: "Mahatma Gandhi"},
  {qt: "You only live once, but if you do it right, once is enough.", at: "Mae West"},
  {qt: "Tough times never last but tough people do.", at: "Robert H. Schuller"},
  {qt: "Get busy living or get busy dying.", at: "Stephen King"},
  {qt: "Whether you think you can or you think you can’t, you’re right.", at: "Henry Ford "},
  {qt: "Tis better to have loved and lost than to have never loved at all.", at: "Alrded Lord Tennyson"},
  {qt: "A man is but what he knows.", at: "Sir Francis Bacon"},
  {qt: "You miss 100 percent of the shots you never take.", at: "Wayne Gretzky"},
  {qt: "If you’re going through hell, keep going.", at: "Winston Churchill"},
  {qt: "Strive not to be a success, but rather to be of value.", at: "Albert Einstein"},
  {qt: "Twenty years from now you will be more disappointed by the things that you didn’t do than by the ones you did do.", at: "Mark Twain"},
  {qt: "Great minds discuss ideas; average minds discuss events; small minds discuss people.", at: "Eleanor Roosevelt"},
  {qt: "Those who dare to fail miserably can achieve greatly.", at: "John F. Kennedy"},
  {qt: "The opposite of love is not hate; it’s indifference.", at: "Elie Wiesel"},
  {qt: "Never let the fear of striking out keep you from playing the game.", at: "Babe Ruth"},
  {qt: "Life is like a box of chocolates. You never know what you’re going to get.", at: "Forrest Gump"},
  {qt: "He that falls in love with himself will have no rivals.", at: "Benjamin Franklin"},
  {qt: "Life is ten percent what happens to you and ninety percent how you respond to it.", at: "Charles Swindoll"},
  {qt: "Dream big and dare to fail.", at: "Norman Vaughan"},
  {qt: "A great man is always willing to be little.", at: "Ralph Waldo Emerson"},
  {qt: "That’s one small step for a man, one giant leap for mankind.", at: "Neil Armstrong"},
  {qt: "Every man is guilty of all the good he did not do.", at: "Voltaire"},
  {qt: "In three words I can sum up everything I’ve learned about life: It goes on.", at: "Robert Frost"},
  {qt: "If you judge people, you have no time to love them.", at: "Mother Teresa"},
  {qt: "The future belongs to those who prepare for it today.", at: "Malcolm X"},
  {qt: "Don’t be afraid to give up the good to go for the great.", at: "John D. Rockefeller"},
]


$(document).ready(function(){
  let dur = 400;
  let randInt = Math.floor(Math.random() * quotes.length);
  let randQuote = quotes[randInt].qt;
  let randAuthor = quotes[randInt].at;
  // Page load
  $("#text").fadeOut(dur);
    $("#author").fadeOut(dur);
    setTimeout(function() {
      $("#text").text(randQuote).fadeIn(dur);
      $("#author").text("- " + randAuthor).fadeIn(dur);
    }, dur+100);
});
  function random(btn) {
    let dur = 400;
    btn.disabled = true
    setTimeout(() => { btn.disabled = false }, dur+200)
    let randInt = Math.floor(Math.random() * quotes.length); 
    
    // Prevents the same quote from generating
    if($("#text").text() === quotes[randInt].qt) {
       if(randInt === quotes.length - 1) randInt -= 1
       else randInt += 1;
    } 
    let randQuote = quotes[randInt].qt;
    let randAuthor = quotes[randInt].at;
    $("#text").fadeOut(dur);
    $("#author").fadeOut(dur);
    
    setTimeout(function() {
      $("#text").text(randQuote).fadeIn(dur);
      $("#author").text("- " + randAuthor).fadeIn(dur);
    }, dur+100); // Fade in/out

  }
