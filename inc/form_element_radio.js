form_element_radio.inherits_from(form_element);
function form_element_radio() {
}

form_element_radio.prototype.init=function(id, def, options, parent, dom_parent) {
  this.parent.init.call(this, id, def, options, parent, dom_parent);

  var current=this.dom_parent.firstChild;
  this.dom_values={};
  while(current) {
    if(current.nodeName=="SPAN") {
      var dom=current.firstChild;
      this.dom_values[dom.value]=dom;
    }

    current=current.nextSibling;
  }
}

form_element_radio.prototype.get_data=function() {
  for(var i in this.dom_values) {
    if(this.dom_values[i].checked)
      return i;
  }

  return null;
}
