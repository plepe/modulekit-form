form_element_text.inherits_from(form_element);
function form_element_text() {
}

form_element_text.prototype.init=function(id, def, options, parent, dom_parent) {
  this.parent.init.call(this, id, def, options, parent, dom_parent);

  this.dom_element=this.dom_parent.getElementsByTagName("input")[0];
}
