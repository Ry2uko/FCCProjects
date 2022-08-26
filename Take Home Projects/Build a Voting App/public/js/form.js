$(document).ready(function(){
  $('#showPassword1, #showPassword2').prop('checked', false);

  $('#showPassword1').on('click', function(){
    $(this).is(':checked')
    ? $('#passwordInput').attr('type', 'text')
    : $('#passwordInput').attr('type', 'password'); 
  });
  $('#showPassword2').on('click', function(){
    if ($(this).is(':checked')) {
      $('#passwordInput').attr('type', 'text');
      $('#confirmPasswordInput').attr('type', 'text');
    } else {
      $('#passwordInput').attr('type', 'password');
      $('#confirmPasswordInput').attr('type', 'password');
    }
  });

});