var form_element_geolocation_keys = [ "latitude", "longitude" ];

form_element_geolocation.inherits_from(form_element);
function form_element_geolocation() {
}

form_element_geolocation.prototype.connect = function(dom_parent) {
  this.parent("form_element_geolocation").connect.call(this, dom_parent);

  var ds = this.dom.firstChild;
  while(ds) {
    if(ds.className == "display")
      this.display = ds;

    ds = ds.nextSibling;
  }

  this.input = {};
  var nodes = this.display.getElementsByTagName("input");
  for(var i = 0; i < nodes.length; i++) {
    var k = nodes[i].name.match(/\[([^\[]*)\]$/);
    if(k) {
      k = k[1];

      this.input[k] = nodes[i];
      this.input[k].onchange = this.notify_input_change.bind(this);
    }
  }

  this.show_enable_tracking();

  this.enable_tracking();
}

form_element_geolocation.prototype.show_element = function() {
  var div = this.parent("form_element_geolocation").show_element.call(this);

  this.display = document.createElement("div");
  this.display.setAttribute("class", "display");
  this.update_display();
  div.appendChild(this.display);

  var data = this.get_data();

  var cls="form_orig";
  if(this.is_modified())
    cls="form_modified";

  // base data
  this.input = {};

  this.input._base_ = document.createElement("input");
  this.input._base_.setAttribute("type", "hidden");
  this.input._base_.setAttribute("name", this.options.var_name + "[_base_]");
  this.input._base_.setAttribute("value", JSON.stringify(data));
  this.display.appendChild(this.input._base_);

  // latitude, longitude
  for(var ki = 0; ki < form_element_geolocation_keys.length; ki++) {
    var k = form_element_geolocation_keys[ki];

    var span = document.createElement("span");
    this.display.appendChild(span);

    span.appendChild(
      document.createTextNode(lang("form_element_geolocation:short:" + k) + ": "));
    this.input[k] = document.createElement("input");
    this.input[k].setAttribute("name", this.options.var_name + "[" + k + "]");
    this.input[k].setAttribute("class", cls + " geolocation");
    this.input[k].setAttribute("disabled", "true");
    this.input[k].setAttribute("type", "text");
    this.input[k].onchange = this.notify_input_change.bind(this);
    if(data && (k in data))
      this.input[k].setAttribute("value", sprintf("%.5f", data[k]));
    span.appendChild(this.input[k]);
  }

  this.show_enable_tracking();

  div.appendChild(this.display);

  this.enable_tracking();

  return div;
}

form_element_geolocation.prototype.show_enable_tracking = function() {
  // track GPS?
  var span = document.createElement("span");
  this.input.enable_tracking = document.createElement("input");
  this.input.enable_tracking.setAttribute("name", this.options.var_name + "[enable_tracking]");
  this.input.enable_tracking.setAttribute("id", this.id + "[enable_tracking]");
  this.input.enable_tracking.setAttribute("type", "checkbox");
  this.input.enable_tracking.onchange = this.toggle_tracking.bind(this);
  span.appendChild(this.input.enable_tracking);
  var label = document.createElement("label");
  label.setAttribute("for", this.id + "[enable_tracking]");
  label.appendChild(document.createTextNode(lang("form_element_geolocation:enable_tracking")));
  span.appendChild(label);
  this.display.appendChild(span);
}

form_element_geolocation.prototype.refresh = function() {
  var div = this.parent("form_element_geolocation").refresh.call(this);

  this.update_display();
}

form_element_geolocation.prototype.enable_tracking = function() {
  if(this.input && this.input.enable_tracking)
    this.input.enable_tracking.checked = true;

  this.toggle_tracking(true);
}

form_element_geolocation.prototype.disable_tracking = function() {
  if(this.input && this.input.enable_tracking)
    this.input.enable_tracking.checked = false;

  this.toggle_tracking(false);
}

form_element_geolocation.prototype.toggle_tracking = function(state) {
  if((state !== true) && (state !== false)) {
    if(this.input && this.input.enable_tracking)
      state = this.input.enable_tracking.checked;
    else
      return;
  }

  if(state) {
    if(!this.api) {
      if('geolocation' in navigator)
        this.api = navigator.geolocation;

      if(this.api)
        this.api.watchPosition(this.update.bind(this));
      else
        return this.disable_tracking();
    }

    for(var ki = 0; ki < form_element_geolocation_keys.length; ki++) {
      var k = form_element_geolocation_keys[ki];

      this.input[k].setAttribute("disabled", "true");
    }
  }
  else {
    if(this.api)
      this.api.clearWatch(this.update.bind(this));

    for(var ki = 0; ki < form_element_geolocation_keys.length; ki++) {
      var k = form_element_geolocation_keys[ki];

      this.input[k].removeAttribute("disabled");
    }
  }
}

form_element_geolocation.prototype.update = function(position) {
  var coords = {};
  for(var k in position.coords)
    coords[k] = position.coords[k];

  if(this.input)
    this.input._base_.value = JSON.stringify(coords);

  this.notify_change();
}

form_element_geolocation.prototype.notify_input_change = function(ev) {
  if(!ev)
    ev = event;

  var data = JSON.parse(this.input._base_.value);

  for(var ki = 0; ki < form_element_geolocation_keys.length; ki++) {
    var k = form_element_geolocation_keys[ki];

    if(ev.target == this.input[k])
      data[k] = parseFloat(this.input[k].value);
  }

  this.data = data;
  this.input._base_.value = JSON.stringify(data);

  this.notify_change.call(this);
}

form_element_geolocation.prototype.set_data = function(data) {
  this.parent("form_element_geolocation").set_data.call(this, data);

  if(this.input)
    this.input._base_.value = JSON.stringify(data);
}

form_element_geolocation.prototype.get_data = function() {
  var data = {};

  if(this.input) {
    data = JSON.parse(this.input._base_.value);

    if(this.input.enable_tracking)
      data.enable_tracking = this.input.enable_tracking.checked;
  }

  return data;
}

form_element_geolocation.prototype.update_display = function() {
  if(!this.display)
    return;

  var data = this.get_data();

  if(this.input && data) {
    this.input._base_.value = JSON.stringify(data);

    for(var k in this.input) {
      if((k != "_base_") && (k in data))
        this.input[k].value = sprintf("%.5f", data[k]);
    }
  }
}
