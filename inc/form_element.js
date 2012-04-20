function form_element() {
}

form_element.prototype.init=function(id, def, options, parent) {
  this.id=id;
  this.def=def;
  this.options=options;
  this.parent=parent;

  this.tr=document.getElementById(this.id);
  if(this.tr)
    this.dom_parent=this.tr.cells[1];
  else
    this.dom_parent=document.createElement("div");
}

form_element.prototype.get_data=function() {
  return this.dom_element.value;
}
