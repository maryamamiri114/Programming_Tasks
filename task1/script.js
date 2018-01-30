'use strict';


$(function() {

  var matrix = [], word, cols, rows;


  /*
  |--------------------------------------------------------------------------
  | Start the script after pressing search button.
  |--------------------------------------------------------------------------
  */
  $('#search').on('click', function() {
    inputToMatrix();

    word = $('#word').val().toUpperCase().split('');
    rows = matrix[0].length;
    cols = matrix.length;

    var result = searchTheMatrix();
    $('#result').text(result);
  });


  /*
  |--------------------------------------------------------------------------
  | Convert the textarea input to a 2D array and save to `matrix` variable.
  |--------------------------------------------------------------------------
  */
  var inputToMatrix = function() {
    matrix = [];
    var input = $('#grid').val().toUpperCase().split("\n");
    for (var i = 0; i < input.length; i++) {
      matrix.push( input[i].split(' ') );
    }
  }



  /*
  |--------------------------------------------------------------------------
  | Start searching the matrix and try to find the sequence if the first
  | character found.
  |--------------------------------------------------------------------------
  */
  var searchTheMatrix = function() {
    var found = false;

    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {

        if ( matrix[i][j] == word[0] ) {
          found = findSequence(i, j, 1); // Find the sequence from second character
          if ( found ) {
            return 'TRUE';
          }
        }

      }
    }

    return 'FALSE';
  }



  /*
  |--------------------------------------------------------------------------
  | Recursively try to follow the sequence and return true upon occurrence.
  |
  | i:    Column to check
  | j:    Row to check
  | from: The start point of the word to find
  | omit: The adjacent direction to omit searching for, so we don't use
  |       a sell more than once
  |--------------------------------------------------------------------------
  */
  var findSequence = function(i, j, from, omit='') {
    
    // We arrived at the end of word, so return true
    if ( from >= word.length ) {
      return true;
    }

    var char  = word[from],
        found = false;

    // Left
    // 
    if ( j - 1 >= 0 && omit != 'left' ) {
      if ( matrix[i][j-1] == char ) {
        found = findSequence(i, j-1, from+1, 'right');
        if (found) {
          return true;
        }
      }
    }

    // Right
    // 
    if ( j + 1 < rows && omit != 'right' ) {
      if ( matrix[i][j+1] == char ) {
        found = findSequence(i, j+1, from+1, 'left');
        if (found) {
          return true;
        }
      }
    }

    // Top
    // 
    if ( i - 1 >= 0 && omit != 'top' ) {
      if ( matrix[i-1][j] == char ) {
        found = findSequence(i-1, j, from+1, 'bottom');
        if (found) {
          return true;
        }
      }
    }

    // Bottom
    // 
    if ( i + 1 < cols && omit != 'bottom' ) {
      if ( matrix[i+1][j] == char ) {
        found = findSequence(i+1, j, from+1, 'top');
        if (found) {
          return true;
        }
      }
    }

    return false;

  }

});
