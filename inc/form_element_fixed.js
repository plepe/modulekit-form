form_element_fixed.inherits_from(form_element);
function form_element_fixed() {
}

form_element_fixed.prototype.connect=function(dom_parent) {
  var ret = this.parent("form_element_fixed").connect.call(this, dom_parent);

  if(!this.dom_element) {
    this.dom_element=this.dom_parent.getElementsByTagName("input")[0];
  }

  return ret;
}

form_element_fixed.prototype.show_element=function() {
  var div=this.parent("form_element_fixed").show_element.call(this);

  var cls="form_orig";
  if(this.is_modified())
    cls="form_modified";

  var input=document.createElement("span");
  input.innerHTML = this.get_data();

  if(this.def.html_attributes)
    for(var i in this.def.html_attributes)
      input.setAttribute(i, this.def.html_attributes[i]);

  input.className=cls;
  div.appendChild(input);
  this.dom_element=input;

  return div;
}

form_element_fixed.prototype.get_data=function() {
  return this.def.value;
}

form_element_fixed.prototype.set_data=function(data) {
}
