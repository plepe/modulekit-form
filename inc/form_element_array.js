form_element_array.inherits_from(form_element);
function form_element_array() {
}

form_element_array.prototype.init=function(id, def, options, form_parent) {
  this.parent.init.call(this, id, def, options, form_parent);

  this.build_form();
}

form_element_array.prototype.build_form=function() {
  this.elements={};

  if(!this.data) {
    this.data={};
    for(var k=0; k<this.def.count.default; k++) {
      this.data[k]=null;
    }
  }

  for(var k in this.data) {
    var element_def=new clone(this.def.def);
    var element_class="form_element_"+element_def.type;
    var element_id=this.id+"_"+k;
    var element_options=new clone(this.options);
    element_options.var_name=element_options.var_name+"["+k+"]";
    element_def._name="#"+(k+1);

    if(class_exists(element_class)) {
      this.elements[k]=eval("new "+element_class+"()");
      this.elements[k].init(element_id, element_def, element_options, this);
    }
  }
}

form_element_array.prototype.connect=function(dom_parent) {
  this.parent.connect.call(this, dom_parent);

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
	this.elements[k].init(element_id, this.def.def, element_options, this);
	this.elements[k].connect(current);
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

form_element_array.prototype.set_data=function(data) {
  this.data=data;
  this.build_form();

  for(var k in this.elements) {
    if(data[k])
      this.elements[k].set_data(data[k]);
    else
      this.elements[k].set_data(null);
  }

  var p=this.dom.parentNode;
  p.removeChild(this.dom);
  var div=this.show_element();
  p.appendChild(div);

  this.data=null;
}

form_element_array.prototype.show_element=function() {
  var div=this.parent.show_element.call(this);
  this.get_data();

  for(var k in this.elements) {
    var el_div=document.createElement("div");
    el_div.setAttribute("form_element_num", k);
    el_div.className="form_element_array_part";
    div.appendChild(el_div);

    el_div.appendChild(this.elements[k].show_element());

    var input=document.createElement("input");
    input.type="submit";
    input.name=this.options.var_name+"[__remove]["+k+"]";
    input.value="X";

    div.appendChild(input);

    var br=document.createElement("br");
    div.appendChild(br);
  }

  var input=document.createElement("input");
  input.type="submit";
  input.name=this.options.var_name+"[__new]";
  input.value="Element hinzufügen";
  div.appendChild(input);

  return div;
}
