$(document).ready(function(){
  $('#roomNameInput').val(''); // defdault

  $('#enterRoom').on('click', () => {
    const roomName = $('#roomNameInput').val();
    let invalidMessage = '';

    // Validation
    if (roomName === '') {
      invalidMessage = 'No room name?';
    } else if (roomName.split(' ').length > 1) {
      invalidMessage = 'Invalid room name';
    }

    if (invalidMessage) {
      $('.invalid-text').text(invalidMessage).css('opacity', 1);
      return;
    }

    window.location.href = `/room/${roomName}`;

  });

  $('#roomNameInput').on('keyup', e => {  
    $('.invalid-text').css('opacity', 0);
    if (e.key === 'Enter')  {
      $('#enterRoom').click();
    }
  });

});