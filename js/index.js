// Constants
var apiUrl = 'https://api.dengsn.com/webuntis/v2';

// Variables
var years = {};
var departments = {};
var server = '', school = '', user = '';
var endpointUrl = '';

// Create an alert
var createAlert = function(message, $el)
{
  $alert = $(document.createElement('div'))
    .addClass('alert alert-danger alert-dismissible fade show');
  $el.append($alert);
  
  $button = $(document.createElement('button'))
    .addClass('close')
    .attr('type','button')
    .attr('data-dismiss','alert')
    .html('&times;');
  $alert.append($button);
  
  $text = $(document.createElement('span'))
    .html('<h2>Something went terribly wrong!</h2><p>If you bump into an administrator, show him the following error message:</p><p class="mb-0">' + message + '</p>');
  $alert.append($text);
  
  return $el;
};

// Reset the connect form
var resetConnectForm = function()
{
  $('#connectButton').prop('disabled',false);
  $('#connectIcon').removeClass('fa-spinner fa-spin').addClass('fa-folder-open');
}

// Connect to the server and load years and departments
var connect = function()
{
  server = $('#connectServerInput').val();
  school = $('#connectSchoolInput').val();
  user = $('#connectUserInput').val();
  endpointUrl = apiUrl + '/' + server + '/' + school;
  
  // Clear inputs
  $('#yearInput').html('');
  $('#departmentInput').html('');
  $('#classInput').html('');
  
  // Get years and departments
  $.when($.ajax({
    url: endpointUrl + '/years/',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization','Basic ' + btoa(user + ':'));
    },
    success: function(data)
    {
      // Clear year selection
      $('#yearInput').html('');
    
      // Iterate over the data
      $.each(data,function(index, year)
      {
       // Save in the database
       year.startDate = new Date(year.startDate);
       year.endDate = new Date(year.endDate);
       years[year.id] = year;
      
        // Set in the year selection
        var $option = $(document.createElement('option'))
          .attr('value',year.id)
          .html(year.name);
        $('#yearInput').append($option);
      });
      
      // Select the year that is currently active
      var now = new Date();
      $.each(years,function(index, year)
      {
        if (year.startDate.getTime() <= now.getTime() && now.getTime() <= year.endDate.getTime())
          $('#yearInput').val(year.id);
      });
    },
    error: function(xhr)
    {
      createAlert(xhr.responseJSON.error,$('#alerts'));
      resetConnectForm();
    }
  }),$.ajax({
    url: endpointUrl + '/departments/',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization','Basic ' + btoa(user + ':'));
    },
    success: function(data)
    {
      // Clear department selection
      $('#departmentInput').html('');
      
      // Sort the departments
      data.sort(function(a,b) {
        return a.longName.localeCompare(b.longName);
      });
    
      // Iterate over the data
      $.each(data,function(index, department)
      {
        // Save in the database
        departments[department.id] = department;
      
        // Set in the department selection
        var $option = $(document.createElement('option'))
          .attr('value',department.id)
          .html(department.longName);
        $('#departmentInput').append($option);
      });
    },
    error: function(xhr)
    {
      createAlert(xhr.responseJSON.error,$('#alerts'));
      resetConnectForm();
    }
  })).done(function()
  {
    // Update the classes
    updateClasses();
  
    // Show the export tab
    $('#exportTab').tab('show');
  });
};

// Update the class input
var updateClasses = function()
{
  var yearId = $('#yearInput').val();
  var year = years[yearId];
  
  var departmentId = $('#departmentInput').val();
    
  // Set the period
  $('#startDateInput').val(year.startDate.format('yyyy-mm-dd'));
  $('#endDateInput').val(year.endDate.format('yyyy-mm-dd'));
  
  // Get classes
  $.ajax({
    url: endpointUrl + '/years/' + yearId + '/classes/',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization','Basic ' + btoa(user + ':'));
    },
    success: function(data)
    {
      // Clear class selection
      $('#classInput').html('');
    
      // Iterate over the data
      $.each(data,function(index, clazz)
      {      
        // If the department doesn't match, then continue
        if (clazz.department === null || clazz.department.id != departmentId)
          return;
        
        // Set in the class selection
        var $option = $(document.createElement('option'))
          .attr('value',clazz.id)
          .html(clazz.longName);
        $('#classInput').append($option);
      });
    },
    error: function(xhr)
    {
      createAlert(xhr.responseJSON.error,$('#alerts'));
    }
  });
};

// If the document is ready
$(function()
{
  resetConnectForm();
  
  // Set the inputs in the connect form
  if (typeof Cookies.get('untisexport.server') !== 'undefined')
  {
    $('#connectServerInput').val(Cookies.get('untisexport.server'));
    $('#connectSchoolInput').val(Cookies.get('untisexport.school'));
    $('#connectUserInput').val(Cookies.get('untisexport.user'));
  }
});

// If the connect form is submitted
$('#connectForm').submit(function(e)
{
  e.preventDefault();
  
  // Validate the inputs
  if (!e.target.checkValidity())
  {
    // Stop the event
    e.stopPropagation();  
      
    // Add validation class to the form
    $(e.target).addClass('was-validated');
  }
  else
  {
    // Save settings
    Cookies.set('untisexport.server',$('#connectServerInput').val(),{expires: 14});
    Cookies.set('untisexport.school',$('#connectSchoolInput').val(),{expires: 14});
    Cookies.set('untisexport.user',$('#connectUserInput').val(),{expires: 14});
    
    // Set the icon
    $('#connectButton').prop('disabled',true);
    $('#connectIcon').removeClass('fa-plug').addClass('fa-spinner fa-spin')
        
    // Connect to the server
    connect();
  }
});

// If the year input is changed
$('#yearInput').change(function()
{
  // Update the classes
  updateClasses();
});

// If the department input is changed
$('#departmentInput').change(function()
{
  // Update the classes
  updateClasses();
});

// If the class input is changed
$('#classInput').change(function(e)
{
  // Check if classes are selected
  var classes = $(e.target).val();
  if (classes.length === 0)
    $('#exportButton').prop('disabled',true);
  else
    $('#exportButton').prop('disabled',false);
});

// If the settings button is clicked
$('#settingsButton').click(function()
{
  // Show the settings tab
  resetConnectForm();
  $('#connectTab').tab('show');
});

// If the download button is clicked
$('#exportForm').submit(function(e)
{
  e.preventDefault();
  
  // Fill the export modal
  var yearId = $('#yearInput').val();
  var classId = $('#classInput').val();
  var startDate = $('#startDateInput').val();
  var endDate = $('#endDateInput').val();
  
  var link = 'https://' + encodeURIComponent(user) + '@api.dengsn.com/webuntis/v2/' + server + '/' + school + '/years/' + yearId + '/classes/' + classId.join(',') + '/calendar.ics?startDate=' + startDate + '&endDate=' + endDate;
  window.location.href = link;
});