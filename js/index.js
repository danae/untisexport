// Database constructor
var Database = function()
{
  this.years = {};
  this.departments = {};
};

// Constants
Database.endpointUrl = 'https://untisexport.dengsn.com/v1';

// Variables
var db = new Database();

// If the document is ready
$(function()
{
  // Check if a server is specified
  if (typeof Cookies.get('untisexport.server') === 'undefined')
  {
    // Open the modal
    $('#settingsModal').modal('show');
  }
  else
  {
    // Conenct to the server
    connect();
  }
});

// If the connection is made
var connect = function()
{
  var server = Cookies.get('untisexport.server');
  var school = Cookies.get('untisexport.school');
  var user = Cookies.get('untisexport.user');
  
  var endpointUrl = Database.endpointUrl + '/' + server + '/' + school;
  
  // Get years
  $.ajax({
    url: endpointUrl + '/years',
    username: user,
    password: '',
    success: function(data)
    {
      // Clear year selection
      $('#yearInput').html('');
    
      // Iterate over the data
      $.each(data,function(index, year)
      {
       // Save in the database
       db.years[year.id] = year;
      
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
    username: user,
    password: '',
    success: function(data)
    {
      // Clear department selection
      $('#departmentInput').html('');
    
      // Iterate over the data
      $.each(data,function(index, department)
      {
        // Save in the database
        db.departments[department.id] = department;
      
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