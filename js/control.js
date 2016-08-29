/*
* NAVIGATION EXAMPLE
* 
* Very simple navigation script.  When the user clicks the button, the tool is
* moved to the specified position.  (Provided that position is valid)
* 
* Functions are also provided to show and hide the DRO
*
*/

// Validate the input of the provided form (just checks for a valid number, no range check)
// Mark the input as invalid if it contains bad data
// Return the value if it's valid, null otherwise
function validateInput(target) {
  var f = parseFloat(target.val());
  if(isNaN(f) || f === undefined) {
      target.parent().removeClass('has-success');
      target.parent().addClass('has-error');
      return null;
  } else {
      target.parent().removeClass('has-error');
      target.parent().addClass('has-success');
      return f;
  }
}

$(".btn-keypad").click(function(evt) {
  var int = $(this).data('id');
  var currentVal = $("#ctrl-xinput").val();
  var newVal = currentVal + int;
  console.log("newVal = " + newVal);
  $("#ctrl-xinput").val(newVal);
});

// When the go button is pressed, validate the inputs and move the tool (if valid)
$("#nav-go").click(function(evt) {
  var x = validateInput($("#ctrl-xinput"));
  if(x !== null) {
    // add limit checking
      var gcode = "G0 X" + x;
      $("#ctrl-xinput").val('');
      fabmo.runGCode(gcode);
  } else {
      alert("Position specified is invalid: " + x);
  }
  evt.preventDefault();
});

// When the go button is pressed, validate the inputs and move the tool (if valid)
$("#clear-num").click(function(evt) {
  $("#ctrl-xinput").val('');
  console.log("Clear");
});

// When the go button is pressed, validate the inputs and move the tool (if valid)
$("#back-space").click(function(evt) {
  var bx = $("#ctrl-xinput").val();
  if(bx !== null) {
    // add limit checking
    var len = bx.length - 1;
    var newX = bx.slice(0,len);
    $("#ctrl-xinput").val(newX);
  } else {
      alert("Position specified is invalid: " + x );
  }
  evt.preventDefault();
});

// Trigger a validation every time an input value changes
$(".num-input").change(function(evt) {
    validateInput($(evt.target));
});

// Update the position display every time a status report is recieved
fabmo.on('status', function(status) {
  $('#ctrl-xdisplay').val(status.posx);
});

fabmo.requestStatus();