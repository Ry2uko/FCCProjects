$(document).ready(function(){
  const socket = io('/');
  const peer = new Peer(undefined, {
    host: '/',
    port: 3001, 
  });
  const peers = {};
  const video = document.createElement('video');
  video.muted = true;

  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(stream => {
    addVideoStream(video, stream);

    peer.on('call', call => {
      call.answer(stream);
      const video = document.createElement('video');
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on('user-connected', userID => {
      connectToNewUser(userID, stream);
    });
  })

  socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close();
  });

  peer.on('open', id => {
    socket.emit('join-room', roomName, id);
  });

  function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });

    $('.video-grid').append(video);
  }

  function connectToNewUser(userId, stream) {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream);
    });

    call.on('close', () => {
      console.log('close');
      video.remove();
    });

    peers[userId] = call;
  }

  $('#homeBtn').on('click', () => {
    window.location.href = '/';
  });
});