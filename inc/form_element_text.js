form_element_text.inherits_from(form_element);
function form_element_text() {
}

form_element_text.prototype.init=function(id, def, options, form_parent) {
  this.parent.init.call(this, id, def, options, form_parent);
}

form_element_text.prototype.connect=function(dom_parent) {
  this.parent.connect.call(this, dom_parent);
  this.dom_element=this.dom_parent.getElementsByTagName("input")[0];

  this.dom_element.onchange=this.notify_change.bind(this);
}

form_element_text.prototype.show_element=function() {
  var div=this.parent.show_element.call(this);

  var cls="form_orig";
  if(this.orig_data&&this.data!=this.orig_data)
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

form_element_text.prototype.set_data=function(data) {
  this.parent.set_data.call(this, data);

  if(this.dom_element)
    this.dom_element.value=this.data;
}

form_element_text.prototype.refresh=function() {
  var cls;

  this.parent.refresh.call(this);

  if(!this.dom_element)
    return;

  this.data=this.dom_element.value;

  if(this.orig_data&&this.data!=this.orig_data)
    cls="form_modified";
  else
    cls="form_orig";

  this.dom_element.className=cls;
}

form_element_text.prototype.check_regexp=function(list, param) {
  if(param.length<1)
    return;

  if(!this.get_data().match(param[0])) {
    if(param.length<2)
      list.push("Ungültiger Wert");
    else
      list.push(param[1]);
  }
}
