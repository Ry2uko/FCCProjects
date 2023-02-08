// Hacked by Ry2uko ;D

function fetchData() {
  return $.ajax({
    url: 'https://forum-proxy.freecodecamp.rocks/latest',
    type: 'GET'
  });
}

$(document).ready(async function(){
  try {
    let fetchedData = await fetchData();
    let users = fetchedData['users'];
    let topics = fetchedData['topic_list'].topics;
    
    // get username by user id
    const getUserById = id => {
      for (let i = 0; i < users.length; i++) {
        if (users[i].id === id) return users[i];
      }
    }
    
    // convert to time (46000ms to 46s)
    const msToTime = ms => {
      const seconds = Math.floor(ms / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      let time;
      if (days >= 1) {
        time = `${days}d`;
      } else if (hours >= 1) {
        time = `${hours}h`;
      } else if (minutes >= 1) {
        time = `${minutes}m`;
      } else if (seconds >= 1) {
        time = `${seconds}s`;
      } else {
        time = '1s';
      }

      return time;
    }
    
    topics.forEach(topic => {
      let topicId, topicUser, topicLastActive, topicTitle, topicReplies, topicLikes, topicViews, topicPosters;
      topicId = topic.id;
      topicTitle = topic.title; 
      topicReplies = topic.reply_count;
      topicLikes = topic.like_count;
      topicViews = topic.views;
      topicUser = getUserById(topic.posters[0].user_id).username;
      topicLastActive = msToTime(new Date() - new Date(topic.last_posted_at));
      
      topicPosters = topic.posters.reduce((a, b, i) => {
        let poster = getUserById(b.user_id);
        
        // posters' avatar
        const AVATARSIZE = 25;
        let avatarTemplate = poster.avatar_template.replace('{size}', `${AVATARSIZE}`);
        let posterAvatar = avatarTemplate[0] === '/' 
        ? `https://forum.freecodecamp.org${avatarTemplate}`
        : avatarTemplate;
        
         a.push({
           username: poster.username,
           avatar: posterAvatar
         });
        
         return a;
      }, []);

      // for topic posters
      let topicPostersHTML = '';
      topicPosters.forEach(poster => {
        console.log(poster.avatar);
        topicPostersHTML += `<a class="topic-poster" href="https://forum.freecodecamp.org/u/${poster.username}" target="_blank" title="${poster.username}"><img alt="user-avatar" src="${poster.avatar}" /></a>`
      });
      
      $('.topics-container').append(`
        <div class="topic-container container-fluid text-start d-flex flex-column" topic-id=${topicId}>
          <div class="topic-info1-container text-center">
            <span class="topic-user"><a href="https://forum.freecodecamp.org/u/${topicUser}" target="_blank">${topicUser}</a></span> • <span class="topic-last-active">${topicLastActive}</span><span class="topic-users-container">${topicPostersHTML}</span>
          </div>
          <div class="topic-info2-container text-center flex-fill justify-content-center align-items-center d-flex">
            <span class="topic-title"><a href="https://forum.freecodecamp.org/t/${topicId}" target="_blank">${topicTitle}</a></span>
          </div>
          <div class="topic-info3-container d-flex justify-content-center">
            <span class="topic-replies-container">
              <i class="fa-solid fa-message text-primary"></i><span class="topic-replies">${topicReplies}</span>
            </span>
            <span class="topic-likes-container">
              <i class="fa-solid fa-heart text-danger"></i><span class="topic-likes">${topicLikes}</span>
            </span>
            <span class="topic-views-container">
              <i class="fa-solid fa-chart-simple text-secondary"></i><span class="topic-views">${topicViews}</span>
            </span>
          </div>
        </div>
      `)
    }); 
  } catch (err) {
    console.error(err);
    return;
  }
})