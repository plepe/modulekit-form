function form_element() {
}

form_element.prototype.init=function(id, def, options, parent, dom_parent) {
  this.id=id;
  this.def=def;
  this.options=options;
  this.parent=parent;
  this.dom_parent=dom_parent;

  if(!this.dom_parent)
    this.dom_parent=document.createElement("div");
}

form_element.prototype.get_data=function() {
  return this.dom_element.value;
}
