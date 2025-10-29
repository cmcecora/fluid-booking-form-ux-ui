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

    // Store original name before first modification (so we can restore it later)
    if (!$member.data('original-name')) {
      $member.data('original-name', $member.find('.name').text());
    }

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

// ===== LOCATION SEARCH FUNCTIONALITY =====

// Mock location data
const mockLocations = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
  'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
  'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL',
  'Fort Worth, TX', 'Columbus, OH', 'San Francisco, CA', 'Charlotte, NC',
  'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Washington, DC',
  'Boston, MA', 'El Paso, TX', 'Nashville, TN', 'Detroit, MI',
  'Oklahoma City, OK', 'Portland, OR', 'Las Vegas, NV', 'Memphis, TN',
  'Louisville, KY', 'Baltimore, MD', 'Milwaukee, WI', 'Albuquerque, NM',
  'Tucson, AZ', 'Fresno, CA', 'Mesa, AZ', 'Sacramento, CA',
  'Atlanta, GA', 'Kansas City, MO', 'Colorado Springs, CO', 'Miami, FL',
  'Raleigh, NC', 'Omaha, NE', 'Long Beach, CA', 'Virginia Beach, VA',
  'Oakland, CA', 'Minneapolis, MN', 'Tampa, FL', 'Tulsa, OK',
  'Arlington, TX', 'New Orleans, LA'
];

// Initialize location search after date selection
function initLocationSearch() {
  const $input = $('.selected .location-input');
  $input.focus();
  attachLocationListeners();
}

// Attach all location-related event listeners
function attachLocationListeners() {
  const $selected = $('.selected');

  // Location input handler - wait for 2+ characters
  $selected.find('.location-input').off('input').on('input', function() {
    handleLocationInput($(this));
  });

  // Auto-select text on click if there's any text present
  $selected.find('.location-input').off('click').on('click', function() {
    if (this.value) {
      this.select();
    }
  });

  // Geolocation icon click handler
  $selected.find('.location-icon').off('click').on('click', function() {
    handleGeolocation();
  });
}

// Handle location input with autocomplete
function handleLocationInput($input) {
  const query = $input.val().trim().toLowerCase();
  const $results = $('.selected .location-results');

  // Require at least 2 characters
  if (query.length < 2) {
    $results.html('').removeClass('visible');
    return;
  }

  // Mock API simulation with setTimeout
  setTimeout(function() {
    // Filter locations that match the query
    const filtered = mockLocations.filter(loc =>
      loc.toLowerCase().includes(query)
    ).slice(0, 6); // Max 6 results

    if (filtered.length > 0) {
      let resultsHTML = '';
      filtered.forEach(location => {
        resultsHTML += '<li>' + location + '</li>';
      });
      $results.html(resultsHTML).addClass('visible');

      // Attach click handlers to results
      $results.find('li').on('click', function() {
        handleLocationSelect($(this));
      });
    } else {
      $results.html('<li class="no-results">No locations found</li>').addClass('visible');
    }
  }, 200); // Simulate network delay
}

// Handle geolocation icon click
function handleGeolocation() {
  if (navigator.geolocation) {
    const $input = $('.selected .location-input');
    const $icon = $('.selected .location-icon');
    const $results = $('.selected .location-results');

    // Visual feedback
    $icon.addClass('loading');

    navigator.geolocation.getCurrentPosition(
      function(position) {
        // Mock reverse geocoding - in production, this would call a geocoding API
        // For now, just pick a random city to simulate
        const mockCity = mockLocations[Math.floor(Math.random() * mockLocations.length)];
        $input.val(mockCity);
        $icon.removeClass('loading');

        // Auto-select the location without showing dropdown
        // Clear and hide any existing results
        $results.html('').removeClass('visible');

        // Store location for confirmation message
        $('.selected.member').data('selected-location', mockCity);

        // Add location-selected state to trigger form reveal
        $('.wrap').addClass('location-selected');

        // Focus the name input after animation
        setTimeout(function() {
          $('.selected.member input[name="name"]').focus();
        }, 700);
      },
      function(error) {
        $icon.removeClass('loading');
        alert('Unable to get your location. Please enter it manually.');
        console.error('Geolocation error:', error);
      }
    );
  } else {
    alert('Geolocation is not supported by your browser.');
  }
}

// Handle location selection from dropdown
function handleLocationSelect($item) {
  if ($item.hasClass('no-results')) {
    return;
  }

  const locationText = $item.text();
  const $input = $('.selected .location-input');
  const $results = $('.selected .location-results');

  // Set the input value
  $input.val(locationText);

  // Clear and hide results
  $results.html('').removeClass('visible');

  // Mark this location as selected
  $item.addClass('selected');

  // Store location for confirmation message
  $('.selected.member').data('selected-location', locationText);

  // Add location-selected state to trigger form reveal
  $('.wrap').addClass('location-selected');

  // Focus the name input after animation
  setTimeout(function() {
    $('.selected.member input[name="name"]').focus();
  }, 700);
}

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

$(document).on('click', '.deselect-member, .restart', function(e){
  // Restore original test name if it was changed via search
  const $firstMember = $('.member').first();
  const originalName = $firstMember.data('original-name');
  if (originalName) {
    $firstMember.find('.name').text(originalName);
    $firstMember.removeData('original-name');
  }

  $('.member').removeClass('selected');
  $('.wrap').removeClass('member-selected date-selected location-selected booking-complete');
  e.preventDefault();
  e.stopPropagation();
});

$('.deselect-date').on('click', function(e){
  $('.wrap').removeClass('date-selected location-selected');
  $('.calendar *').removeClass('selected');
  e.preventDefault();
  e.stopPropagation();
});

$('.deselect-location').on('click', function(e){
  $('.wrap').removeClass('location-selected');
  $('.location-results li').removeClass('selected');
  $('.selected .location-input').val('');
  e.preventDefault();
  e.stopPropagation();
});

$('.form').on('submit', function(e){
  // Get the selected location
  const location = $('.selected.member').data('selected-location');
  const $confirmMessage = $('.selected.member .confirm-message');

  // Update confirmation message to include location
  if (location) {
    const originalText = 'Booking Complete!';
    $confirmMessage.html(originalText + '<br><small style="font-size: 0.7em; opacity: 0.8;">Location: ' + location + '</small><span class="restart">Book Again?</span>');
  }

  $('.wrap').toggleClass('booking-complete');
  e.preventDefault();
  e.stopPropagation();
})

function invokeCalendarListener(){
  $('.calendar td:not(.disabled)').on('click', function(e){
    initLocationSearch();
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


function addCalendar(container, monthOffset){
  // Initialize monthOffset if not provided
  if (typeof monthOffset === 'undefined') {
    monthOffset = 0;
  }
  
  // Store the month offset in the container
  container.data('month-offset', monthOffset);
  
  //get dates
  var today = new Date();
  var currentDate = today.getDate();
  var currentMonth = today.getMonth();
  var currentYear = today.getFullYear();
  
  // Calculate display month/year based on offset
  var displayDate = new Date(currentYear, currentMonth + monthOffset, 1);
  var month = displayDate.getMonth();
  var year = displayDate.getFullYear();
  
  var first = new Date(year, month, 1);
  var startDay = first.getDay();
  var dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  var monthLengths = [31,28,31,30,31,30,31,31,30,31,30,31];
  
  // Check for leap year
  if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
    monthLengths[1] = 29;
  }
  
  var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var dayNames = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  
  var current = 1 - startDay;
  var lastDay = monthLengths[month];

  //assemble calendar with icon and navigation
  var calendar = '<svg class="calendar-icon" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10z"></path></svg>';
  
  // Add navigation arrows
  // Show previous arrow if not on current month (monthOffset > 0)
  if (monthOffset > 0) {
    calendar += '<svg class="calendar-nav calendar-prev" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>';
  }
  
  // Show next arrow if not at max offset (monthOffset < 4)
  if (monthOffset < 4) {
    calendar += '<svg class="calendar-nav calendar-next" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>';
  }
  
  calendar += '<label class="date"></label><label class="month">'+monthNames[month]+'</label> <label class="year">'+year+'</label>';
  
  calendar += '<table><tr>';
  dayLabels.forEach(function(label){
    calendar += '<th>'+label+'</th>';
  })
  calendar += '</tr><tr>';
  var dayClasses = '';
  
  while( current <= lastDay){
    if (current > 0){
      dayClasses = '';
      var checkDate = new Date(year, month, current);
      
      // Disable weekends
      if (checkDate.getDay() == 0 || checkDate.getDay() == 6){
        dayClasses += ' disabled';
      }
      
      // Disable past dates only in current month
      if (monthOffset === 0 && current < currentDate){
        dayClasses += ' disabled';
      }
      
      // Mark today
      if (monthOffset === 0 && current == currentDate){
        dayClasses += ' today';
      }
      
      calendar += '<td class="'+dayClasses+'" data-day="'+dayNames[checkDate.getDay()]+'">'+current+'</td>';
    } else {
      calendar += '<td class="disabled"></td>';
    }
    
    if ( (current + startDay) % 7 == 0){
      calendar += '</tr><tr>';
    }
    
    current++
  }
  
  calendar += '</tr></table>';
  container.html(calendar);
  
  // Add navigation listeners
  addCalendarNavigation(container);
  
  invokeCalendarListener();
}

function addCalendarNavigation(container){
  // Previous month handler
  container.find('.calendar-prev').on('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    var monthOffset = container.data('month-offset') || 0;
    if (monthOffset > 0) {
      addCalendar(container, monthOffset - 1);
    }
  });
  
  // Next month handler
  container.find('.calendar-next').on('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    var monthOffset = container.data('month-offset') || 0;
    if (monthOffset < 4) {
      addCalendar(container, monthOffset + 1);
    }
  });
}
