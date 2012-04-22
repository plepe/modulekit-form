form_element_checkbox.inherits_from(form_element);
function form_element_checkbox() {
}

form_element_checkbox.prototype.init=function(id, def, options, form_parent) {
  this.parent.init.call(this, id, def, options, form_parent);
}

form_element_checkbox.prototype.connect=function(dom_parent) {
  this.parent.connect.call(this, dom_parent);

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

form_element_checkbox.prototype.get_data=function() {
  var ret=[];

  for(var i in this.dom_values) {
    if(this.dom_values[i].checked)
      ret.push(i);
  }

  return ret;
}

