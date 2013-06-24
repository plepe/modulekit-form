/*
form_element_file.inherits_from(form_element);
function form_element_file() {
}

form_element_file.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_file").init.call(this, id, def, options, form_parent);
}

form_element_file.prototype.connect=function(dom_parent) {
  this.parent("form_element_file").connect.call(this, dom_parent);
  this.dom_element=this.dom_parent.getElementsByTagName("input")[0];

  this.dom_element.onchange=this.notify_change.bind(this);
}

form_element_file.prototype.show_element=function() {
  var div=this.parent("form_element_file").show_element.call(this);

  var cls="form_orig";
  if(this.is_modified())
    cls="form_modified";

  var input=document.createElement("input");
  input.type="text";
  input.className=cls;
  input.name=this.options.var_name;
  if(this.data)
    input.value=this.data;
  div.appendChild(input);
  this.dom_element=input;
  this.dom_element.onchange=this.notify_change.bind(this);

  return div;
}

form_element_file.prototype.set_data=function(data) {
  this.parent("form_element_file").set_data.call(this, data);

  if(this.dom_element)
    this.dom_element.value=this.data;
}

form_element_file.prototype.refresh=function() {
  var cls;

  this.parent("form_element_file").check_modified.call(this);

  if(!this.dom_element)
    return;

  if(this.is_modified())
    cls="form_modified";
  else
    cls="form_orig";

  this.dom_element.className=cls;
}
*/
