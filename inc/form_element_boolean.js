form_element_boolean.inherits_from(form_element);
function form_element_boolean() {
}

form_element_boolean.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_boolean").init.call(this, id, def, options, form_parent);
}

form_element_boolean.prototype.connect=function(dom_parent) {
  this.parent("form_element_boolean").connect.call(this, dom_parent);
  this.dom_element=this.dom_parent.getElementsByTagName("input")[0];

  this.dom_element.onchange=this.notify_change.bind(this);
}

form_element_boolean.prototype.show_element=function() {
  var div=this.parent("form_element_boolean").show_element.call(this);

  var cls="form_orig";
  if(this.is_modified())
    cls="form_modified";

  var span=document.createElement("span");
  span.setAttribute("class", cls);
  div.appendChild(span);

  var input=document.createElement("input");
  input.type="checkbox";

  if(this.def.html_attributes)
    for(var i in this.def.html_attributes)
      input.setAttribute(i, this.def.html_attributes[i]);

  input.name=this.options.var_name;
  input.id=this.options.var_name;
  input.value="on";
  if((this.data==="on")||(this.data===true))
    input.setAttribute("checked", "checked");

  span.appendChild(input);
  this.dom_element=input;
  this.dom_element.onchange=this.notify_change.bind(this);

  var label=document.createElement("label");
  label.setAttribute("for", this.options.var_name);
  span.appendChild(label);

  return div;
}

form_element_boolean.prototype.get_data=function(data) {
  if(this.dom_element)
    return (this.dom_element.checked);

  return this.parent("form_element_boolean").get_data.call(this);
}

form_element_boolean.prototype.set_data=function(data) {
  this.parent("form_element_boolean").set_data.call(this, data);

  if(this.dom_element)
    this.dom_element.checked=data;
}

form_element_boolean.prototype.refresh=function() {
  var cls;

  this.parent("form_element_boolean").refresh.call(this);

  if(!this.dom_element)
    return;

  if(this.is_modified())
    cls="form_modified";
  else
    cls="form_orig";

  this.dom_element.parentNode.className=cls;
}

form_element_boolean.prototype.is_modified=function() {
  var orig_data=this.get_orig_data();
  var data=this.get_data();

  if(orig_data===null)
    return data;

  return (orig_data!=data);
}
