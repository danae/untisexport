<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Untis Export</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css">
    <link rel="stylesheet" href="css/styles.css">
  </head>
  
  <body>    
    <div class="modal fade" id="settingsModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <form id="settingsForm">
            <div class="modal-body">
              <h2>Connect to WebUntis</h2>
              
              <div class="form-group">
                <label for="settingsServerInput">Server</label>
                <input type="text" class="form-control" id="settingsServerInput">
                <small class="form-text text-muted">This is the hostname part of the WebUntis URL (e.g. mese.webuntis.com)</small>
              </div>
              <div class="form-group">
                <label for="settingsSchoolInput">School</label>
                <input type="text" class="form-control" id="settingsSchoolInput">
              </div>
              <div class="form-group">
                <label for="settingsUserInput">User name</label>
                <input type="text" class="form-control" id="settingsUserInput">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-light" data-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-dark">Connect</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <div class="container">
      <div class="alert alert-dark alert-dismissible fade show" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            This application uses cookies to store session data and previous entered settings.
          </div>
      
      <div class="row justify-content-center">
        <div class="col-lg-6">
          <h1>Untis Export</h1>
          
          <form>
            <div class="form-group">
              <label for="yearInput">Year</label>
              <select class="form-control" id="yearInput"></select>
            </div>
            <div class="form-group">
              <label for="departmentInput">Department</label>
              <select class="form-control" id="departmentInput"></select>
            </div>
            <div class="form-group">
              <label for="classInput">Classes</label>
              <select multiple class="form-control" id="classInput"></select>
              <small class="form-text text-muted">Use CTRL-click or SHIFT-click to select multiple classes at once</small>
            </div>
            <div class="form-group">
              <label>Period</label>
              <div class="form-row">
                <div class="col">
                  <input type="date" class="form-control" id="startDateInput">
                </div>
                <div class="col">
                  <input type="date" class="form-control" id="endDateInput">
                </div>
              </div>
            </div>
            
            <button type="button" class="btn btn-dark"><i class="fa fa-fw fa-calendar"></i> Export</button>
            <button type="button" class="btn btn-light" data-toggle="modal" data-target="#settingsModal"><i class="fa fa-fw fa-cog"></i> Server settings</button>
          </form>
        </div>
      </div>
    </div>
    
    <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js"></script>
    <script src="https://use.fontawesome.com/8e5420d111.js"></script>
    <script src="js/js.cookie-2.1.4.min.js"></script>
    <script src="js/date.format.js"></script>
    <script src="js/index.js"></script>
  </body>
</html>
