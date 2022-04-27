function validateInput(query, page, imgCount, imgSize) {
  const displayError = msg => {
    $('.error-msg').text(msg).css('color', '#d22d2d');
    return false;
  },
  sizes = ['all', 'small', 'regular', 'full'],
  numberRegex = new RegExp('^[0-9]+$');


  if (query === '') return displayError('Query is missing');

  if (!numberRegex.test(page)) return displayError('Page is not a number');
  else if (parseInt(page) < 1 || parseInt(page) > 100) return displayError('Page is not equal or between 1 to 100');

  if (!numberRegex.test(imgCount)) return displayError('Image count is not a number');
  else if (parseInt(imgCount) < 1 || parseInt(imgCount) > 100) return displayError('Image count is not equal or between 1 to 100');

  if (imgSize === '') return displayError('Image size is missing');
  else if (!sizes.includes(imgSize.toLowerCase())) return displayError('Image size is invalid');

  return true;
}

$(document).ready(function(){
  $('#btnSearch').on('click', () => {
    const query = $('#querySearch').val(),
    page = $('#pageCount').val() || '1',
    imgCount = $('#imgCount').val() || '12',
    imgSize = $('#imgSize').val() || 'all';

    if(!validateInput(query, page, imgCount, imgSize)) return;

    window.location.href = `${window.location.href}api/query/${query}?page=${page}&imgCount=${imgCount}&imgSize=${imgSize}`;

  });

  $('input.form-control').on('keypress', () => {
    $('.error-msg').text('Easter bunny lesgo').css('color', '#fff');
  });
  $('select.form-select').on('change', () => {
    $('.error-msg').text('Easter bunny2').css('color', '#fff');
  });
})