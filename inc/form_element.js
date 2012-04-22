function form_element() {
}

form_element.prototype.init=function(id, def, options, form_parent) {
  this.id=id;
  this.def=def;
  this.options=options;
  this.form_parent=form_parent;
}

form_element.prototype.connect=function(dom_parent) {
  this.dom_parent=dom_parent;
}

form_element.prototype.get_data=function() {
  return this.dom_element.value;
}
