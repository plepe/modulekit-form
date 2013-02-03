form_element_json.inherits_from(form_element);
function form_element_json() {
}

form_element_json.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_json").init.call(this, id, def, options, form_parent);
}

form_element_json.prototype.connect=function(dom_parent) {
  this.parent("form_element_json").connect.call(this, dom_parent);
  this.dom_element=this.dom_parent.getElementsByTagName("input")[0];

  this.dom_element.onchange=this.notify_change.bind(this);
}

form_element_json.prototype.create_element=function() {
  var input=document.createElement("input");
  input.type="text";

  return input;
}

form_element_json.prototype.show_element=function() {
  var div=this.parent("form_element_json").show_element.call(this);

  var cls="form_orig";
  if(this.is_modified())
    cls="form_modified";

  var input=this.create_element();
  input.className=cls;
  input.name=this.options.var_name;
  if(this.data)
    input.value=JSON.stringify(this.data);
  div.appendChild(input);
  this.dom_element=input;
  this.dom_element.onchange=this.notify_change.bind(this);

  return div;
}

form_element_json.prototype.set_data=function(data) {
  this.parent("form_element_json").set_data.call(this, data);

  if(this.dom_element)
    this.dom_element.value=JSON.stringify(this.data);
}

form_element_json.prototype.get_data=function() {
  if(!this.dom_element)
    return this.data;

  this.data=JSON.parse(this.dom_element.value);
  return this.data;
}

form_element_json.prototype.refresh=function() {
  this.parent("form_element_json").refresh.call(this);

  if(!this.dom_element)
    return;

  var cls;
  if(this.is_modified())
    cls="form_modified";
  else
    cls="form_orig";

  this.dom_element.className=cls;
}

form_element_json.prototype.is_modified=function() {
  return JSON.stringify(this.get_data())!==JSON.stringify(this.get_orig_data());
}
