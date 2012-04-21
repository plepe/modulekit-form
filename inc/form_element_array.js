form_element_array.inherits_from(form_element);
function form_element_array() {
}

form_element_array.prototype.init=function(id, def, options, parent, dom_parent) {
  this.parent.init.call(this, id, def, options, parent, dom_parent);

  var current=this.dom_parent.firstChild;
  this.elements={};
  while(current) {
    if(current.nodeName=="DIV") {
      var k=current.getAttribute("form_element_num");
      var element_class="form_element_"+this.def.def.type;
      var element_id=this.id+"-"+k;
      var element_options=new clone(this.options);
      element_options.var_name=element_options.var_name+"["+k+"]";

      if(class_exists(element_class)) {
	this.elements[k]=eval("new "+element_class+"()");
	this.elements[k].init(element_id, this.def.def, element_options, this, current);
      }
    }

    current=current.nextSibling;
  }
}

form_element_array.prototype.get_data=function() {
  var ret={};

  for(var i in this.elements) {
    ret[i]=this.elements[i].get_data();
  }

  return ret;
}
