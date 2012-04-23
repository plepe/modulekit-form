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
    this.create_element(k);
  }
}

form_element_array.prototype.index_element=function(el) {
  var i=1;
  for(var k in this.elements) {
    if(el==k)
      return "#"+i;
    i++;
  }

  return null;
}

form_element_array.prototype.create_element=function(k) {
  var element_def=new clone(this.def.def);
  var element_class="form_element_"+element_def.type;
  var element_id=this.id+"_"+k;
  var element_options=new clone(this.options);
  element_options.var_name=element_options.var_name+"["+k+"]";
  element_def.__defineGetter__("_name", this.index_element.bind(this, k));

  if(class_exists(element_class)) {
    this.elements[k]=eval("new "+element_class+"()");
    this.elements[k].init(element_id, element_def, element_options, this);
  }
}

form_element_array.prototype.connect=function(dom_parent) {
  this.parent.connect.call(this, dom_parent);

  var current=this.dom_parent.firstChild;
  this.elements={};
  while(current) {
    var k;
    if((current.nodeName=="DIV")&&(k=current.getAttribute("form_element_num"))) {
      var element_class="form_element_"+this.def.def.type;
      var element_id=this.id+"-"+k;
      var element_options=new clone(this.options);
      element_options.var_name=element_options.var_name+"["+k+"]";

      if(class_exists(element_class)) {
	this.elements[k]=eval("new "+element_class+"()");
	this.elements[k].init(element_id, this.def.def, element_options, this);
	this.elements[k].connect(current);
      }

      // modify part actions
      var input=current.firstChild;
      while((input)&&(input.className!="form_element_array_part_element_actions")) input=input.nextSibling;
      if(!input)
	break;
      input=input.firstChild;
      while(input) {
	if(input.name==this.options.var_name+"[__remove]["+k+"]") {
	  input.onclick=this.remove_element.bind(this, k);
	}
	input=input.nextSibling;
      }
    }

    // modify actions
    if(current.className=="form_element_array_actions") {
      var input=current.firstChild;
      while(input) {
	if(input.name==this.options.var_name+"[__new]") {
	  input.onclick=this.add_element.bind(this);
	}
	input=input.nextSibling;
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

form_element_array.prototype.show_element_part=function(k, element) {
  // wrapper #k
  var div=document.createElement("div");
  div.setAttribute("form_element_num", k);
  div.className="form_element_array_part";

  // element #k
  var el_div=document.createElement("div");
  el_div.setAttribute("form_element_num", k);
  el_div.className="form_element_array_part_element";
  div.appendChild(el_div);

  el_div.appendChild(element.show_element());

  // Actions #k
  var el_div=document.createElement("div");
  el_div.setAttribute("form_element_num", k);
  el_div.className="form_element_array_part_element_actions";
  div.appendChild(el_div);

  var input=document.createElement("input");
  input.type="submit";
  input.name=this.options.var_name+"[__remove]["+k+"]";
  input.value="X";
  input.onclick=this.remove_element.bind(this, k);
  el_div.appendChild(input);

  return div;
}

form_element_array.prototype.show_element=function() {
  var div=this.parent.show_element.call(this);
  this.get_data();

  for(var k in this.elements) {
    var part_div=this.show_element_part(k, this.elements[k]);
    div.appendChild(part_div);
  }

  var el_div=document.createElement("div");
  el_div.className="form_element_array_actions";
  div.appendChild(el_div);

  var input=document.createElement("input");
  input.type="submit";
  input.name=this.options.var_name+"[__new]";
  input.value="Element hinzufügen";
  input.onclick=this.add_element.bind(this);
  el_div.appendChild(input);

  return div;
}

form_element_array.prototype.errors=function(list) {
  for(var k in this.elements)
    this.elements[k].errors(list);
}

form_element_array.prototype.add_element=function() {
  var highest_id=0;

  for(var i in this.elements)
    if(i>highest_id)
      highest_id=i;

  highest_id=parseInt(highest_id)+1;
  this.create_element(highest_id);

  var current=document.getElementById(this.id).firstChild;
  while(current) {
    if(current.className=="form_element_array_actions") {
      current.parentNode.insertBefore(this.show_element_part(highest_id, this.elements[highest_id]), current);
      break;
    }
    current=current.nextSibling;
  }

  return false;
}

form_element_array.prototype.remove_element=function(k) {
  var current=document.getElementById(this.id).firstChild;
  while(current) {
    if((current.className=="form_element_array_part")&&(current.getAttribute("form_element_num")==k)) {
      current.parentNode.removeChild(current);
      delete(this.elements[k]);
      break;
    }

    current=current.nextSibling;
  }

  return false;
}
