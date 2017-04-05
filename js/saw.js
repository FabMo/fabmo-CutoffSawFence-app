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

var ChopSawApp = function(fabmo) {
  this.offsets = {
    'steel' : 0.0,
    'aluminum' : 0.0
  }
  this.parts = [];
  this.fabmo = fabmo;
  this.tool = 'aluminum'
}

ChopSawApp.prototype.init = function(callback) {
  callback = callback || function() {};
  this.loadConfig(function(err) {
    this.initToolControls();
    this.initKeypad();
    this.initSettingsControls();
    this.applyConfig();
  }.bind(this));
}

ChopSawApp.prototype.initKeypad = function() {
  // When the go button is pressed, validate the inputs and move the tool (if valid)
  $("#back-space").click(function(evt) {
    var bx = new String($("#ctrl-xinput").val());
    if(bx !== null) {
      // add limit checking
      var len = bx.length - 1;
      var newX = bx.substr(0,len);
      $("#ctrl-xinput").val(newX );
    } else {
        this.fabmo.notify('error', "Position specified is invalid: " + x );
    }
    evt.preventDefault();
  });

  $(".btn-keypad").click(function(evt) {
    var int = $(this).data('id');
    if(int >= 0 || int === '.') {
      var currentVal = $("#ctrl-xinput").val();
      var newVal = currentVal + int;
      $("#ctrl-xinput").val(newVal);      
    }
  });
}

ChopSawApp.prototype.initToolControls = function() {
  var app = this;
  $(".btn-tool-select").click(function(evt) {
    app.tool = app.tool === 'aluminum' ? 'steel' : 'aluminum';
    app.saveConfig();
    app.applyConfig();
  })

  $(".btn-run-macro").click(function(evt) {
    this.fabmo.runMacro($(this).data('macro'));
  }.bind(this));

  // Drive tool
  $("#ctrl-movetool").click(function(evt) {
    var x = validateInput($("#ctrl-xinput"));
    if(x !== null) {
      // add limit checking
        x -= this.offsets[this.tool];
        var gcode = "G0 X" + x;
        $("#ctrl-xinput").val('');
        this.fabmo.runGCode(gcode);
    } else {
        this.fabmo.notify('error', "Position specified is invalid: " + x);
    }
    evt.preventDefault();
  }.bind(this));

  $("#ctrl-xinput").click(function(evt) {
    $("#ctrl-xinput").val('');
  });

  // Update the position display every time a status report is recieved
  this.fabmo.on('status', function(status) {
    $('#ctrl-xdisplay').val(status.posx + this.offsets[this.tool]);
  }.bind(this));

}

ChopSawApp.prototype.initSettingsControls = function(callback) {
  $(".txt-tool-offset").change(function(evt) {

      var tool = $(evt.target).data('tool');
      console.log(tool)
      console.log(this)

      var offset = validateInput($(evt.target));
      if(offset != null) { this.offsets[tool] = offset; }
      this.saveConfig();
  }.bind(this));
/*
  $("#ctrl-settings-aluminum-offset").change(function(evt) {
      var offset = validateInput($(evt.target));
      if(offset != null) { this.offsets['aluminum'] = offset; }
      this.saveConfig();
  }.bind(this));

  $("#ctrl-settings-steel-offset").change(function(evt) {
    console.log("steel changed")
      var offset = validateInput($(evt.target));
      if(offset != null) { this.offsets['steel'] = offset; }
      this.saveConfig();
  }.bind(this));
  */
}

ChopSawApp.prototype.saveConfig = function(callback) {
  callback = callback || function() {};
  var config = {
    'tool' : this.tool,
    'offsets' : this.offsets,
    'parts' : this.parts
  }
  this.fabmo.setAppConfig(config, callback);
}

ChopSawApp.prototype.loadConfig = function(callback) {
  callback = callback || function(){};
  this.fabmo.getAppConfig(function(err, config) {
      if(err) {
        return callback(err);
      }
      config = config || {};
      this.parts = config.parts || [];
      this.offsets = config.offsets || {'steel' : 0.0,'aluminum' : 0.0};
      this.tool = config.tool || 'aluminum';
      callback();
   }.bind(this));
}

ChopSawApp.prototype.applyConfig = function() {
  switch(this.tool) {
    case 'aluminum':
      $("#ctrl-select").removeClass('steel').addClass('aluminum').text('Aluminum');
      break;
    case 'steel':
      $("#ctrl-select").removeClass('aluminum').addClass('steel').text('Steel');
      break;
    default:
      console.warn("Unknown tool in configuration: " + this.tool);
      break;
  }

  $("#ctrl-settings-steel-offset").val(this.offsets['steel']);
  $("#ctrl-settings-aluminum-offset").val(this.offsets['aluminum']);
  this.fabmo.requestStatus();
}
