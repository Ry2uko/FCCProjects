const users = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
let filter = 'all';

function getData(route, user) {
  return $.ajax({
    url: `https://twitch-proxy.freecodecamp.rocks/twitch-api/${route}/${user}`,
    type: 'GET'
  });
}

function getStreams() {
  users.forEach(async (user) => {
    try {
      const user_data= await getData('users', user);
      const stream_data = await getData('streams', user);
      let stream_status = 'Offline';
  
      if (filter !== 'all') {
        if (filter === 'online' && stream_data.stream == null) {
          return;
        } else if (filter === 'offline' && stream_data.stream != null) {
          return;
        }
      }
  
      if (stream_data.stream != null) {
        stream_status = stream_data.stream.game;
      }
  
      $('#streamers-container').append(`
        <div class="streamer-tab ${stream_data.stream == null ? '' : 'online'}">
          <div class="streamer-img">
            <img alt="" src="${user_data.logo}" />
          </div>
          <div class="streamer-info">
            <span class="streamer-name"><a target="_blank" href="${'https://www.twitch.tv/'+user_data.display_name}">${user_data.display_name}</a></span>
            <span class="streamer-game">${stream_status}</span>
          </div>  
        </div>
      `);
    } catch (err) {
      console.error(err);
      return;
    }
  }); 
}

$(document).ready(function(){
  getStreams();

  $('#all').on('click', function(){
    if (filter === 'all') return;
    filter = 'all';
    $('#navbar a').removeClass('active');
    $(this).addClass('active');
    $('#streamers-container').empty();
    getStreams();
  });

  $('#online').on('click', function(){
    if (filter === 'online') return;
    filter = 'online';
    $('#navbar a').removeClass('active');
    $(this).addClass('active');
    $('#streamers-container').empty();
    getStreams();
  });

  $('#offline').on('click', function(){
    if (filter === 'offline') return;
    filter = 'offline';
    $('#navbar a').removeClass('active');
    $(this).addClass('active');
    $('#streamers-container').empty();
    getStreams();
  });
});
