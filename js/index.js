// Constants
var apiUrl = 'https://untisexport.dengsn.com/v1';

// Variables
var years = {};
var departments = {};
var server = '', school = '', user = '';
var endpointUrl = '';

// Connect to the server and load years and departments
var connect = function()
{
  server = Cookies.get('untisexport.server');
  school = Cookies.get('untisexport.school');
  user = Cookies.get('untisexport.user');
  endpointUrl = apiUrl + '/' + server + '/' + school;
  
  // Clear inputs
  $('#yearInput').html('');
  $('#departmentInput').html('');
  $('#classInput').html('');
  
  // Get years
  $.ajax({
    url: endpointUrl + '/years',
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
    },
    error: function(xhr)
    {
      console.log(xhr.responseJSON);
    }
  });
  
  // Get departments
  $.ajax({
    url: endpointUrl + '/departments',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization','Basic ' + btoa(user + ':'));
    },
    success: function(data)
    {
      // Clear department selection
      $('#departmentInput').html('');
    
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
      console.log(xhr.responseJSON);
    }
  });
};

// Update the class input
var updateClasses = function()
{
  var yearId = $('#yearInput').val();
  var departmentId = $('#departmentInput').val();
  
  // Get classes
  $.ajax({
    url: endpointUrl + '/years/' + yearId + '/classes',
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
      console.log(xhr.responseJSON);
    }
  });
};

// If the document is ready
$(function()
{
  // Check if a server is specified
  if (typeof Cookies.get('untisexport.server') === 'undefined')
    $('#settingsModal').modal('show');
  else
    connect();
});

// If the year input is changed
$('#yearInput').change(function()
{
  // Set the period
  //$('#startDateInput').val(year.startDate.format('yyyy-mm-dd'));
  //$('#endDateInput').val(year.endDate.format('yyyy-mm-dd'));
  
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

// If the export button is clicked
$('#exportForm').submit(function(e)
{
  e.preventDefault();
  
  // Fill the export modal
  var yearId = $('#yearInput').val()
  var classId = $('#classInput').val();
  var link = 'https://' + encodeURIComponent(user) + '@untisexport.dengsn.com/v1/' + server + '/' + school + '/timetable/' + yearId + '/' + classId.join(',') + '.ics';
  $('#link').val(link);
  
  // Show the export modal
  $('#exportModal').modal('show');
});

// If the download button is clicked
$('#downloadLink').click(function()
{
  var link = $('#link').val();
  window.location.href = link;
});

// If the settings modal is opened
$('#settingsModal').on('show.bs.modal',function()
{
  // Set the settings in the modal
  $('#settingsServerInput').val(Cookies.get('untisexport.server'));
  $('#settingsSchoolInput').val(Cookies.get('untisexport.school'));
  $('#settingsUserInput').val(Cookies.get('untisexport.user'));
});

// If the settings are saved
$('#settingsForm').submit(function(e)
{
  e.preventDefault();
  
  // Close the modal
  $('#settingsModal').modal('hide');
  
  // Save the settings
  Cookies.set('untisexport.server',$('#settingsServerInput').val());
  Cookies.set('untisexport.school',$('#settingsSchoolInput').val());
  Cookies.set('untisexport.user',$('#settingsUserInput').val());
  
  // Connect to the server
  connect();
});