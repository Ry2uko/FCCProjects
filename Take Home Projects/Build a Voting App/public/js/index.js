$(document).ready(function(){
  
  const toggleDropdown = query => {
    let dropdown = $(query);
    if(dropdown.css('display') === 'none') {
      dropdown.slideDown(325).css('display', 'flex');
    } else {
      dropdown.slideUp(325);
    }
  }
  const renderVotes = (ctx, pollData)  => {
    if (ctx.attr('charted') === 'true') return;
    ctx.attr('charted', 'true');

    const data = {};
    for (let key in pollData) {
      if (key === 'length') break; // jquery object 
      data[pollData[key].innerText] = $(pollData[key]).attr('option-votes');
    }

    const dataColors = [
      '#18cca8',
      '#16b897',
      '#13a386',
      '#118f76',
      '#0e7a65',
      '#0c6654',
      '#0a5243',
      '#073d32',
      '#052922',
      '#021411',

      '#18cca8',
      '#2fd1b1',
      '#46d6b9',
      '#5ddbc2',
      '#74e0cb',
      '#8ce6d4',
      '#a3ebdc',
      '#baf0e5',
      '#d1f5ee',
      '#e8faf6'
    ];

    const config = {
      type: 'doughnut',
      data: {
        labels: Object.keys(data),
        datasets: [{
          data: Object.values(data),
          backgroundColor: dataColors.slice(0, Object.keys(data).length),
          borderColor: '#000',
          borderWidth: 2
        }]
      }
    },
    setup = {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: 10
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    const chart = new Chart(ctx, {...config, ...setup});
  }

  // document load
  $('.poll-container').each(function(){
    let authed = $('.user-authed-dd').length;
    if (!authed) return;
    
    if ($(this).hasClass('disabled')) {
      let optionIndex = $(this).attr('selected-index');
      $(this).find(`.poll-option[option-index=${optionIndex}]`).addClass('selected')
      $(this).find('.voteBtn').text('Voted');
    } else {
      $(this).find('.voteBtn').css({
        opacity: 1,
        cursor: 'pointer'
      });
    }
    
  })
  $('#resLogin').on('click', () => window.location.href = '/login');
  $('#resSignUp').on('click', () => window.location.href = '/signup');
  
  // navbar events
  $('#openResNav').on('click', () => {
    $('.responsive-navbar').css('maxHeight') === '0px' 
    ? $('.responsive-navbar').css('maxHeight', '180px')
    : $('.responsive-navbar').css('maxHeight', '0px');
  });
  $('#userDDBtn').on('click', () => {
    $('.navbar .user-dd-container').css('width', `${$('.navbar .user-authed-dd').width()}px`)
    toggleDropdown('.navbar .user-dd-container');

    if ($('.navbar .user-dd-container').css('display') !== 'none') {
      // blur
      $(document).on('click', e => {
        if ($('.navbar .user-dd-container').has(e.target).length || $('#userDDBtn').is(e.target)) return;
        $('.navbar .user-dd-container').slideUp(325);
      });
      return;
    }

    $(document).off('click');
  });
  $('#resUserDDBtn').on('click', e => {
    toggleDropdown('.responsive-navbar .user-dd-container  ')

    if ($('.responsive-navbar .user-dd-container').css('display') !== 'none') {
      // blur
      $(document).on('click', e => {
        if ($('.responsive-navbar .user-dd-container').has(e.target).length || $('#resUserDDBtn').is(e.target)) return;
        $('.responsive-navbar .user-dd-container').slideUp(325);
      });
      return;
    }

    $(document).off('click');
  });
  $('#searchPoll').on('keyup', function(e){
    if (e.key === 'Enter') $('#searchBtn').click();
  });
  $('#searchBtn').on('click', () => {
    let href = window.location.href;
    const searchPoll = $('#searchPoll').val();

    if (searchPoll.length < 1) return;

    if (href.includes('?name=') || href.includes('&name=')) {
      let sliced, slicedRef
      slicedA = href.indexOf('?name='), 
      slicedB = href.indexOf('&name=');

      let slicedIndex = Math.max(slicedA, slicedB)+6;
      sliced = href.slice(0, slicedIndex)
      slicedRef = href.slice(slicedIndex)
      let searchQueryIndex = slicedRef.search(new RegExp('&.+='));

      if (searchQueryIndex >= 0) {
        slicedRef = slicedRef.split('');
        slicedRef.splice(0, searchQueryIndex, searchPoll)
        slicedRef = slicedRef.join('');
        href = sliced + slicedRef;
      } else href = sliced + searchPoll;

      window.location.replace(href);
      return;
    }

    new RegExp('\/polls.*\?(id|created_by)=.*', 'i').test(href)
    ? window.location.replace(`${href}&name=${searchPoll}`)
    : window.location.replace(`/polls?name=${searchPoll}`);
  });

  const TRANSITION_MS = 420;
  const createPollOffcanvasFn = {
    open: () => {
      if ($('.offcanvas-create-poll').css('display') !== 'none') return;

      $('.page-wrapper').css('pointerEvents', 'none').animate({ 'opacity': 0.45 }, TRANSITION_MS);
      $('.offcanvas-create-poll').css({
        'display': 'flex',
        'opacity': 0
      }).animate({ 'opacity': 1 }, TRANSITION_MS, () => {
        $(document).on('click', e => {
          if(!$(e.target).is('body')) return;

          createPollOffcanvasFn.close();
        });  
      });
    },
    close: () => {
      if ($('.offcanvas-create-poll').css('display') === 'none') return;

      $('.offcanvas-create-poll').animate({ 'opacity': 0 }, TRANSITION_MS, () => {
        $('.offcanvas-create-poll').css({
          'display': 'none' ,
          'opacity': 1
        });
      });
      $('.page-wrapper').animate({ 'opacity': 1 }, TRANSITION_MS, () => {
        $('.page-wrapper').css('pointerEvents', 'auto');
        if ($('.creation-input-group').length) {
          $('.creation-input-group').replaceWith(`
            <button type="button" id="creationAddOption"><i class="fa-solid fa-plus"></i>Add Option</button>
          `);
          $('#creationAddOption').on('click', creationAddOptionFoo);
        }
      });

      $(document).off('click');
    }
  }
  $('#addPoll').on('click', () => createPollOffcanvasFn.open());
  $('#resAddPoll').on('click', () => createPollOffcanvasFn.open());

  const creationAddOptionFoo = function(){
    if ($('.creation-option').length >= 20) return;

    $(this).replaceWith(`
      <div class="creation-input-group">
        <input type="text" id="creationOptionName" placeholder="Option Name..." autocomplete="off"/>
        <button type="button" id="creationOptionBtn"><i class="fa-solid fa-plus"></i></button>
      </div>
    `);

    $('#creationOptionBtn').on('click', () => {
      if ($('.creation-option').length >= 20) return;

      let optionName = $('#creationOptionName').val().trim();
      if (optionName.length < 1) return;

      if ($('.creation-option').length === 19) {
        $('.creation-input-group').replaceWith(`
        <div class="creation-option">
          ${optionName}<button type="button" class="creationRemoveOption"><i class="fa-solid fa-xmark"></i></button>
        </div>
        `);
      } else {
        if ($('.creation-option').length === 0) {
          $('.creation-input-group').before(`
          <div class="creation-option">
            ${optionName}<button type="button" class="creationRemoveOption"><i class="fa-solid fa-xmark"></i></button>
          </div>
          `)
        } else {
          $('.creation-input-group').prev().after(`
          <div class="creation-option">
            ${optionName}<button type="button" class="creationRemoveOption"><i class="fa-solid fa-xmark"></i></button>
          </div>
        `);
        }
        
        $('.creation-input-group').replaceWith(`
          <button type="button" id="creationAddOption"><i class="fa-solid fa-plus"></i>Add Option</button>
        `);
        $('#creationAddOption').on('click', creationAddOptionFoo);
      }

      $('.creationRemoveOption').on('click', function(){
          if ($('.creation-option').length === 20) {
            $(this).parents('.creation-option').remove();
            $('.options-container').append(`
              <button type="button" id="creationAddOption"><i class="fa-solid fa-plus"></i>Add Option</button>
            `);
            $('#creationAddOption').on('click', creationAddOptionFoo);
          } else $(this).parents('.creation-option').remove();
      });

      $('#creationOptionBtn').off('click');
      $('#creationOptionName').off('click');
    }); 
    $('#creationOptionName').on('keyup', function(e){
      if (e.key === 'Enter') $('#creationOptionBtn').click();
    });
    $('#creationOptionName').focus();
  }

  $('#creationAddOption').on('click', creationAddOptionFoo);
  let creationPollLock = false;
  $('#creationCreatePoll').on('click', () => {
    if (creationPollLock) return;
    const pollName = $('#creationPollName').val().trim(), 
    pollOptions = [];
    $('.creation-option').each(function(){
      pollOptions.push($(this).text().trim());
    });

    creationPollLock = true;
    $.ajax({
      method: 'POST',
      url: '/polls/api',
      data: {
        name: pollName,
        options: pollOptions
      },
      success: () => location.reload(),
      error: resp => {
        const errMsg = resp.responseJSON.error;
        creationPollLock = false;
        alert('Failed to create poll: ' + errMsg);
      }
    });
  });

  // poll (container) events
  $('.poll-container').on('click', function(e){
    const minimizeContainer = $(this).find('.minimize-container'),
    clientHeight = $(this).find('.client-height')[0].clientHeight;
    if (minimizeContainer.css('maxHeight') === '0px') {
      if (
        $(e.target).hasClass('pUser') 
        || $(e.target).hasClass('pName') 
        || $(e.target).hasClass('deletePoll')
        || $(e.target).hasClass('fa-trash-can')
      ) return;
      minimizeContainer.css('maxHeight', `${clientHeight}px`);
      return;
    }

    const clickSafe = [
      'poll-name',
      'minimize-container',
      'poll-options-container',
      'poll-container'
    ];
    
    if (!clickSafe.includes($(e.target).attr('class'))) return;
    
    const votesContainer = $(this).find('.votes-container');
    if (votesContainer.css('maxHeight') !== '0px') votesContainer.css('maxHeight', '0px');
    minimizeContainer.css('maxHeight', '0px');

  });
  $('.poll-option').on('click', function(){
    let disabled = $(this).parents('.poll-container').hasClass('disabled');
    if (disabled) return;

    const pollContainer = $($(this).parents('.poll-container')[0]),
    optionIndex = $(this).attr('option-index');
    const selectedIndex = pollContainer.attr('selected-index'),
    pollOptions = pollContainer.find('.poll-option');

    if (selectedIndex === optionIndex) {
      $(this).attr('class', 'poll-option')
      pollContainer.attr('selected-index', '');
      return;
    } 
  
    if (selectedIndex) pollOptions.attr('class', 'poll-option');
    pollContainer.attr('selected-index', optionIndex);
    $(this).addClass('selected');
  });
  let voteLock = false;
  $('.voteBtn').on('click', function(){
    let disabled = $(this).parents('.poll-container').hasClass('disabled'),
    authed = $('.user-authed-dd').length;
    if (!authed || disabled || voteLock) return;

    let selectedIndex = $(this).parents('.poll-container').attr('selected-index');
    if (selectedIndex === '') return;

    let selectedPoll = $(this).siblings('.poll-options-container').children(`.poll-option[option-index=${selectedIndex}]`),
    pollId = $(this).parents('.poll-container').attr('poll-id');

    voteLock = true;
    $.ajax({
      method: 'PUT',
      url: '/polls/api',
      data: {
        id: pollId,
        option: selectedPoll.text()
      },
      success: () => location.reload(), 
      error: resp => {
        const errMsg = resp.responseJSON.error;
        voteLock = false;
        alert('Failed to vote: ' + errMsg);
      }
    })
  });  
  $('.showVotes').on('click', function(){
    const votesContainer = $(this).parents('.minimize-container').siblings('.votes-container');
    votesContainer.css('maxHeight') === '0px'
    ? votesContainer.css('maxHeight', '860px')
    : votesContainer.css('maxHeight', '0px');
    renderVotes(
      $(this).parents('.minimize-container')
      .siblings('.votes-container')
      .find('canvas.votes-graph'),
      $(this).siblings('.poll-options-container').children('.poll-option')
    );
  });
  let delLock = false;
  $('.deletePoll').on('click', function(){
    let authed = $('.user-authed-dd').length;
    if (!authed || delLock) return;

    let authedUser = $('.user-authed-dd #userDDBtn').text().trim(),
    pollUser = $(this).parents('.poll-container').find('.pUser').text().trim(),
    pollId = $(this).parents('.poll-container').attr('poll-id');

    if (authedUser !== pollUser) return;
    if(!confirm('Are you sure you want to delete this poll?')) return;
    
    delLock = true;
    $.ajax({
      method: 'DELETE',
      url: '/polls/api',
      data: { id: pollId },
      success: () => location.reload(), 
      error: resp => {
        const errMsg = resp.responseJSON.error;
        delLock = false;
        alert('Failed to delete: ' + errMsg);
      }
    });
  });

});