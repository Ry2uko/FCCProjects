// Hacked by Ry2uko ;D

$(document).ready(function(){
  const colors = [
    // needs to be rgb since $(this).css('backgroundColor') returns rgb values
    'rgb(255, 92, 20)',
    'rgb(255, 138, 27)',
    'rgb(252, 213, 20)',
    'rgb(152, 218, 0)',
    'rgb(31, 210, 36)'
  ];
  let mousedown = 0; // detect if mouse is down
  
  // choose color randomly that is not current color
  const getColor = currColor => {
    let randIndex = Math.floor(Math.random() * colors.length);
    console.log(colors[randIndex], currColor);
    if (colors[randIndex] !== currColor) {
      return colors[randIndex];
    } else {
      return getColor(currColor);
    }
  }
  
  $('.circle').on('click', function(){
    let currColor = $(this).css('backgroundColor');
    let color = getColor(currColor)
    $(this).css('backgroundColor', color);
    $(this).css('boxShadow', `0 0 5px ${color}, 0 0 20px ${color}`
    );
  });
  
  $('.circle').on('dblclick', function(){
    if ($(this).css('backgroundColor') === 'rgb(0,0,0)') return;
    $(this).css({
      'backgroundColor': '#000',
      'boxShadow': 'none'
    });
  });
  
  // drag clicking mouse
  $('.circle').on('mouseover', function(){
    if (mousedown) $(this).click();
  });
  
  $(document).on({
    'mousedown': () => {
      mousedown = 1;
    },
    'mouseup': () => {
      mousedown = 0;
    }
  });
  
  $('#resetBtn').on('click', () => {
    $('.circle').each(function(){
      console.log($(this));
      $(this).css({
        'backgroundColor': '#000',
        'boxShadow': 'none'
      });
    });
  });
  
  const MODAL_MS = 700;
  $('#helpBtn').on('click', () => { 
    // show modal
    $('.parent-container').animate({
      'opacity': 0.45,
      'pointerEvents': 'none'
    }, MODAL_MS);
    $('.modal-container').fadeIn(MODAL_MS);
  });
  
  $('#hideModal').on('click', () => { 
    $('.parent-container').animate({
      'opacity': 1,
      'pointerEvents': 'auto'
    }, MODAL_MS);
    $('.modal-container').fadeOut(MODAL_MS);
  });
}); 