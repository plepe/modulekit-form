form_element_geolocation.inherits_from(form_element_json);
function form_element_geolocation() {
}

form_element_geolocation.prototype.create_element=function() {
  var input = this.parent("form_element_geolocation").create_element.call(this);
  input.setAttribute("style", "display: none;");

  return input;
}

form_element_geolocation.prototype.connect = function(dom_parent) {
  this.parent("form_element_geolocation").connect.call(this, dom_parent);

  var ds = this.dom.firstChild;
  while(ds) {
    if(ds.className == "display")
      this.display = ds;

    ds = ds.nextSibling;
  }

  this.api = null;
  if('geolocation' in navigator)
    this.api = navigator.geolocation;

  if(this.api)
    this.api.watchPosition(this.update.bind(this), null, this.def.options);
}

form_element_geolocation.prototype.show_element = function() {
  var div = this.parent("form_element_geolocation").show_element.call(this);

  this.display = document.createElement("div");
  this.display.setAttribute("class", "display");
  this.update_display();
  div.appendChild(this.display);

  this.api = null;
  if('geolocation' in navigator)
    this.api = navigator.geolocation;

  if(this.api)
    this.api.watchPosition(this.update.bind(this), null, this.def.options);

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

  this.dom_element.value = JSON.stringify(coords);

  this.notify_change();
}

form_element_geolocation.prototype.update_display = function() {
  if(!this.display)
    return;

  var data = this.get_data();

  var text;
  if(data)
    text = lang("form_element_geolocation:location_latlon", 0, data.latitude, data.longitude, data.accuracy);
  else
    text = lang("form_element_geolocation:unknown_location");

  this.display.innerHTML = text;
}
