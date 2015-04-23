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
      this.input[k].setAttribute("disabled", "true");
    }
  }

  this.api = null;
  if('geolocation' in navigator)
    this.api = navigator.geolocation;

  if(this.api)
    this.api.watchPosition(this.update.bind(this));
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
    if(data && (k in data))
      this.input[k].setAttribute("value", sprintf("%.5f", data[k]));
    span.appendChild(this.input[k]);
  }

  div.appendChild(this.display);

  this.api = null;
  if('geolocation' in navigator)
    this.api = navigator.geolocation;

  if(this.api)
    this.api.watchPosition(this.update.bind(this));

  return div;
}

form_element_geolocation.prototype.refresh = function() {
  var div = this.parent("form_element_geolocation").refresh.call(this);

  this.update_display();
}

form_element_geolocation.prototype.update = function(position) {
  var coords = {};
  for(var k in position.coords)
    coords[k] = position.coords[k];

  if(this.input)
    this.input._base_.value = JSON.stringify(coords);

  this.notify_change();
}

form_element_geolocation.prototype.set_data = function(data) {
  this.parent("form_element_geolocation").set_data.call(this, data);

  if(this.input)
    this.input._base_.value = JSON.stringify(data);
}

form_element_geolocation.prototype.get_data = function() {
  var data = {};

  if(this.input)
    data = JSON.parse(this.input._base_.value);

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
