form_element_display.inherits_from(form_element);
function form_element_display() {
}

form_element_display.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_display").init.call(this, id, def, options, form_parent);
}

form_element_display.prototype.connect=function(dom_parent) {
  this.parent("form_element_display").connect.call(this, dom_parent);

  if(!this.dom_element) {
    this.dom_element=this.dom_parent.getElementsByTagName("input")[0];
    this.dom_display = this.dom_parent.firstChild;
  }
}

form_element_display.prototype.show_element=function() {
  var div=this.parent("form_element_display").show_element.call(this);

  var cls="form_orig";
  if(this.is_modified())
    cls="form_modified";

  var input=document.createElement("span");
  input.innerHTML = this.data;

  if(this.def.html_attributes)
    for(var i in this.def.html_attributes)
      input.setAttribute(i, this.def.html_attributes[i]);

  input.className=cls;
  div.appendChild(input);
  this.dom_display=input;

  input = document.createElement("input");
  input.type = "hidden";
  input.name=this.options.var_name;
  if(this.data)
    input.value=this.data;
  div.appendChild(input);
  this.dom_element=input;

  return div;
}

form_element_display.prototype.get_data=function(data) {
  var data=this.parent("form_element_display").get_data.call(this);

  if((data==="")||(data===null)) {
    if('empty_value' in this.def)
      return this.def.empty_value;

    return null;
  }

  return data;
}

form_element_display.prototype.set_data=function(data) {
  this.parent("form_element_display").set_data.call(this, data);

  if(this.dom_element) {
    this.dom_element.value=this.data;
    this.dom_display.innerHTML = this.data;
  }
}
