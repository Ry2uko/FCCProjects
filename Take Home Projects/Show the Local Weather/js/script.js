// Hacked by Ry2uko ;}
let scale = 'C', currTemp;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getWeather);
  } else {
    console.log('Geolocation is not supported by this browser.');
  }
}

function addListener() {
  $('.scale').on('click', function(){
    if (scale === 'C') {
      currTemp = currTemp*1.8 + 32;
      scale = 'F';
    } else if (scale === 'F') {
      currTemp = (currTemp-32)*0.5556;
      scale = 'C';
    }
    currTemp = Math.round(currTemp * 100) / 100; // Limit to 2 decimals
    $('.temp').html(`${currTemp} °<a class="scale" href="javascript:void(0)">${scale}</a>`);
    addListener();
  });
}

function getWeather(position) {
  fetch(`https://weather-proxy.freecodecamp.rocks/api/current?lon=${position.coords.longitude}&lat=${position.coords.latitude}`)
    .then(res => res.json())
    .then(data => {
      currTemp = data.main.temp;
      $('.loc-name').text(`${data.name}, ${data.sys.country}`);
      $('.temp').html(`${data.main.temp} °<a class="scale" href="javascript:void(0)">C</a>`);
      $('.weather').text('Clouds');
      $('.weather-icon img').attr('src', data.weather[0].icon);
      $('.weather-icon').css('display', 'block');
      addListener();
    });
}

$(document).ready(function(){
  getLocation();
});