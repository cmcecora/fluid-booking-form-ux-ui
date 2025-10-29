// ===== MEDICAL TEST SEARCH FUNCTIONALITY =====

// Store medical tests data
let medicalTests = [];
let isDataLoaded = false;

// Load medical tests data on page load
$(document).ready(function(){
  loadMedicalTests();
});

// Load medical tests from JSON file
function loadMedicalTests(){
  const loadStart = Date.now();
  const $dropdown = $('.search-dropdown');
  const $skeleton = $('.skeleton-loading');

  // Show skeleton only if loading takes more than 200ms
  const skeletonTimeout = setTimeout(function(){
    $skeleton.addClass('active');
    $dropdown.addClass('active');
  }, 200);

  fetch('medical-tests.json')
    .then(response => response.json())
    .then(data => {
      medicalTests = data;
      isDataLoaded = true;

      // Clear skeleton loading
      clearTimeout(skeletonTimeout);
      $skeleton.removeClass('active');
      $dropdown.removeClass('active');
    })
    .catch(error => {
      console.error('Error loading medical tests:', error);
      clearTimeout(skeletonTimeout);
      $skeleton.removeClass('active');
      $dropdown.removeClass('active');
    });
}

// Debounce function to limit search frequency
let searchTimeout;
function debounce(func, delay){
  return function(){
    const context = this;
    const args = arguments;
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function(){
      func.apply(context, args);
    }, delay);
  };
}

// Search input handler
$('.search-input').on('input', debounce(function(){
  const query = $(this).val().trim();

  if (query.length >= 3 && isDataLoaded){
    performSearch(query);
  } else {
    closeSearchDropdown();
  }
}, 250));

// Perform search and display results
function performSearch(query){
  const $dropdown = $('.search-dropdown');
  const $results = $('.search-results');

  // Filter tests (case-insensitive)
  const queryLower = query.toLowerCase();
  const matches = medicalTests.filter(test =>
    test.name.toLowerCase().includes(queryLower)
  );

  // Sort: exact matches first, then partial matches
  matches.sort((a, b) => {
    const aStartsWith = a.name.toLowerCase().startsWith(queryLower);
    const bStartsWith = b.name.toLowerCase().startsWith(queryLower);
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    return a.name.localeCompare(b.name);
  });

  // Limit to top 10 results
  const topMatches = matches.slice(0, 10);

  // Generate results HTML
  if (topMatches.length > 0){
    let resultsHTML = '';
    topMatches.forEach(test => {
      const highlightedName = highlightMatch(test.name, query);
      resultsHTML += `
        <div class="search-result-item" data-test-id="${test.id}" data-test-name="${test.name}">
          <div class="result-name">${highlightedName}</div>
          <div class="result-category">${test.category}</div>
        </div>
      `;
    });
    $results.html(resultsHTML);
  } else {
    $results.html('<div class="no-results">No matching tests found</div>');
  }

  // Show dropdown
  $dropdown.addClass('active');

  // Attach click handlers to result items
  attachResultClickHandlers();
}

// Highlight matching characters in result
function highlightMatch(text, query){
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
}

// Escape special regex characters
function escapeRegex(string){
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Attach click handlers to search result items
function attachResultClickHandlers(){
  $('.search-result-item').on('click', function(e){
    const testName = $(this).data('test-name');

    // Find the member element to trigger (or use first one for demo purposes)
    // Since we have a dropdown that's independent, we'll trigger the first member
    // and update its name to match the selected test
    const $member = $('.member').first();

    // Update the member's name
    $member.find('.name').text(testName);

    // Trigger the member selection
    if (!$member.hasClass('selected')){
      $member.addClass('selected');
      $('.wrap').addClass('member-selected');
      addCalendar($member.find('.calendar'));
    }

    // Clear search and close dropdown
    $('.search-input').val('');
    closeSearchDropdown();

    e.preventDefault();
    e.stopPropagation();
  });
}

// Close search dropdown
function closeSearchDropdown(){
  $('.search-dropdown').removeClass('active');
  $('.search-results').html('');
}

// Close dropdown on ESC key
$(document).on('keydown', function(e){
  if (e.key === 'Escape'){
    closeSearchDropdown();
  }
});

// Close dropdown when clicking outside
$(document).on('click', function(e){
  const $target = $(e.target);
  if (!$target.closest('.search-container').length){
    closeSearchDropdown();
  }
});

// Prevent closing when clicking inside search container
$('.search-container').on('click', function(e){
  e.stopPropagation();
});

// ===== EXISTING MEMBER SELECTION FUNCTIONALITY =====

$('.member').on('click', function(e){
  if (!$(this).hasClass('selected')){
    $(this).addClass('selected');
    $('.wrap').addClass('member-selected');
    addCalendar($(this).find('.calendar'));
    e.preventDefault();
    e.stopPropagation();
  }
});

$('.deselect-member, .restart').on('click', function(e){
  $('.member').removeClass('selected');
  $('.wrap').removeClass('member-selected date-selected slot-selected booking-complete');
  e.preventDefault();
  e.stopPropagation();
});

$('.deselect-date').on('click', function(e){
  $('.wrap').removeClass('date-selected slot-selected');
  $('.calendar *').removeClass('selected');
  e.preventDefault();
  e.stopPropagation();
});

$('.deselect-slot').on('click', function(e){
  $('.wrap').removeClass('slot-selected');
  $('.slots *').removeClass('selected');
  e.preventDefault();
  e.stopPropagation();
});

$('.form').on('submit', function(e){
  $('.wrap').toggleClass('booking-complete');
  e.preventDefault();
  e.stopPropagation();
})

function invokeCalendarListener(){
  $('.calendar td:not(.disabled)').on('click', function(e){
    addSlots();
    var date = $(this).html();
    var day = $(this).data('day');
    $('.date').html(day + ',  ' + date);
    $(this).addClass('selected');
    setTimeout(function(){
      $('.wrap').addClass('date-selected');
    },10);
    e.preventDefault();
    e.stopPropagation();
  });
}


function invokeSlotsListener(){
  $('.slots li').on('click', function(e){
    $(this).addClass('selected');
    $('.wrap').addClass('slot-selected');
    setTimeout(function(){
      $('.selected.member input[name="name"]').focus();
    }, 700);
    e.preventDefault();
    e.stopPropagation();
  });
}



function addSlots(container){
  
  var number = Math.ceil(Math.random()*5 + 1);
  var time = 7;
  var endings = [':00', ':15', ':30', ':45'];
  var timeDisplay = '';
  var slots = ''
  for(var i = 0; i < number; i++){
    time += Math.ceil(Math.random()*3);
    timeDisplay = time + endings[Math.floor(Math.random()*4)];
    slots += '<li>'+timeDisplay+'</li>';
  }
  
  $('.selected .slots').html(slots);
  
  invokeSlotsListener();
  
}



function addCalendar(container){
  //get dates
  var today = new Date();
  var day = today.getDay()
  var date = today.getDate();
  var month = today.getMonth();
  var year = today.getFullYear();
  var first = new Date();
  first.setDate(1);
  var startDay = first.getDay();
  var dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  var monthLengths = [31,28,31,30,31,30,31,31,30,31,30,31];
  var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var dayNames = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  
  var current = 1 - startDay;
  
  //assemble calendar
  var calendar = '<label class="date"></label><label class="month">'+monthNames[month]+'</label> <label class="year">'+year+'</label>';
  
  calendar += '<table><tr>';
  dayLabels.forEach(function(label){
    calendar += '<th>'+label+'</th>';
  })
  calendar += '</tr><tr>';
  var dayClasses = '';
  while( current <= 30){
    if (current > 0){
      dayClasses = '';
      today.setDate(current);
      if (today.getDay() == 0 || today.getDay() == 6){
        dayClasses += ' disabled';
      }
      if (current < date){
        dayClasses += ' disabled';
      }
      if (current == date){
        dayClasses += ' today';
      }
      calendar += '<td class="'+dayClasses+'" data-day="'+dayNames[(current + startDay)%7]+'">'+current+'</td>';
    } else {
      calendar += '<td></td>';
    }
    
    if ( (current + startDay) % 7 == 0){
      calendar += '</tr><tr>';
    }
    
    current++
  }
  
  calendar += '</tr></table>';
  container.html(calendar);
  
  invokeCalendarListener();
}
