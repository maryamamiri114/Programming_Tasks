'use strict';


$(function() {

  var csv = '';

  /*
  |--------------------------------------------------------------------------
  | Prepare the CSV output and start crawling.
  |--------------------------------------------------------------------------
  */
  $('#start').on('click', function() {
    csv = "Type,Status,Priority,Resolution,Affects Version,Fix Version,Component,Labels,Patch Info,Estimated Complexity,Assignee,Reporter,Votes,Watchers,Created,Created_Epoch,Updated,Updated_Epoch,Resolved,Resolved_Epoch,Description,Comments\n";
    crawlIssue('10597');
  });


  /*
  |--------------------------------------------------------------------------
  | Save file using FileSaver.js
  |--------------------------------------------------------------------------
  */
  $('#save').on('click', function() {
    var blob = new Blob([ $('#result').val() ], {type: "text/csv;charset=utf-8"});
    saveAs(blob, "task2.csv");
  });


  /*
  |--------------------------------------------------------------------------
  | Crawl the issue and save values to `csv` variable.
  |--------------------------------------------------------------------------
  */
  var crawlIssue = function(id) {
    var url   = 'https://issues.apache.org/jira/browse/CAMEL-'+ id,
        row   = '', // Keep the row values
        value = ''; // A temp variable to hold data before inserting to `row` variable
    

    $.get('fetcher.php?url='+url, function(data){
      
      var content = $($.parseHTML(data)).find('#issue-content').html();
      $('#content').html(content);
      

      // Details
      // 
      $('#content').find('#details-module .wrap').each(function() {
        value = $(this).find('.value').text().trim();
        value = normalizeForCSV(value);
        value = value.replace(/\s\s/g, "");
        row += value + ',';
      });


      // People
      // 
      $('#content').find('#peoplemodule .mod-content dd').each(function() {
        value = $(this).find('span:first').text().trim();
        row += value + ',';
      });


      // Dates
      // 
      $('#content').find('#datesmodule .mod-content dd').each(function() {
        value = $(this).find('time').attr('datetime');
        row += value + ',' + toTimestamp(value) + ',';
      });


      // Description
      // 
      value = $('#content').find('#description-val > .user-content-block').text().trim();
      value = normalizeForCSV(value);
      row += value + ',';


      // Comments
      // 
      /*
       * It's a little tricky, since the data is not inside the html code, but
       * inside a Javascript variable. First, I parse the variable and then
       * retrieve the required data.
       */
      var panel_start = data.indexOf('WRM._unparsedData["activity-panel-pipe-id"]=') + 47;
      var panel_end = data.indexOf('if(window.WRM._dataArrived)window.WRM._dataArrived();', panel_start) - 6;
      var panel = data.substr(panel_start, panel_end-panel_start);
      panel = panel.replace(/\\\\n/g, "");
      panel = panel.replace(/\\u003c/g, "<");
      panel = panel.replace(/\\u003e/g, ">");
      panel = panel.replace(/\\\\\\"/g, '"');
      panel = panel.replace(/\\\\\//g, '/');
      panel = panel.replace(/\\'/g, '"');
      
      $('#content').html(panel);
      $('#content').find('#issue_actions_container .activity-comment').each(function() {
        var user = $(this).find('.user-avatar:first').text().trim();
        var time = $(this).find('.livestamp').attr('datetime');
        var comment = $(this).find('.action-body').text().trim();
        comment = normalizeForCSV(comment);
        value = user + ':' + toTimestamp(time) + ':' + time + ':"' + comment +'" — ';
        row += value;
      });


      csv += row + "\n";
      $('#result').val(csv);
    });
  }


  /*
  |--------------------------------------------------------------------------
  | Do some refinement for some of cells to make sure they won't break the
  | CSV format.
  |--------------------------------------------------------------------------
  */
  var normalizeForCSV = function(str) {
    str = str.replace(/\n/g, "");
    str = str.replace(/,/g, "—");
    return str;
  }


  /*
  |--------------------------------------------------------------------------
  | Convert a date-time string to Unix epoch.
  |--------------------------------------------------------------------------
  */
  var toTimestamp = function(strDate) {
    var datum = Date.parse(strDate);
    return datum/1000;
  }

});
