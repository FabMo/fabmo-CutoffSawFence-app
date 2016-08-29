
$("#nav-showdro").click(function(evt) {
  fabmo.showDRO();
});
$("#nav-hidedro").click(function(evt) {
  fabmo.hideDRO();
});
$("#dash-info").click(function(evt) {
  fabmo.notify('info', 'Heads Up!');
});
$("#dash-success").click(function(evt) {
  fabmo.notify('success', 'Great Job!');
});
$("#dash-warning").click(function(evt) {
  fabmo.notify('warning', 'Uh Oh!');
});
$("#dash-error").click(function(evt) {
  fabmo.notify('error', 'Epic Fail!');
});
$("#dash-launch-job-manager").click(function(evt) {
  fabmo.launchApp('job-manager');
});
$("#dash-showinfo-same").click(function(evt) {
  fabmo.navigate('http://www.shopbottools.com/ShopBotDocs/files/SBG00253140912CommandRefV3.pdf', {target : '_top'});
});
$("#dash-showinfo-new").click(function(evt) {
  fabmo.navigate('http://www.shopbottools.com/ShopBotDocs/files/SBG00253140912CommandRefV3.pdf', {target : '_blank'});
});
$("#nav-list").click(function(evt) {
  var x = $('#part-list').val();
  var gcode = "G0 X" + x;
  fabmo.runGCode(gcode);
});
$("#part-list").click(function(evt) {
  changeColor();
});

// Update the position display every time a status report is recieved
function changeColor() {
    var x = $('#part-list').val();
    var k = parseFloat($('#ctrl-xdisplay2').val());
    if ( x == k ) {
      $('#nav-list').text('Ready');
      $('#nav-list').addClass('ready');
      $('#nav-list').removeClass('not-ready');      
    } else {
      $('#nav-list').text('Move Tool');
      $('#nav-list').addClass('not-ready');
      $('#nav-list').removeClass('ready');      
    }
};

// Update the position display every time a status report is recieved
fabmo.on('status', function(status) {
  $('#ctrl-xdisplay2').val(status.posx);
  changeColor();
});

fabmo.isOnline(function(err, online) {
	if(err) {
		$('#lbl-online').addClass('label-default').removeClass('label-danger label-success');
		$('#lbl-online').text('Unknown');	
		return;					
	}
	if(online) {
		$('#lbl-online').addClass('label-success').removeClass('label-danger label-default');
		$('#lbl-online').text('Online');				
	} else {
		$('#lbl-online').addClass('label-danger').removeClass('label-success label-default');
		$('#lbl-online').text('Offline');
	}
});