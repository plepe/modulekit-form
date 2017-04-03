form_element_array.inherits_from(form_element);
function form_element_array() {
}

form_element_array.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_array").init.call(this, id, def, options, form_parent);

  this.build_form();
}

form_element_array.prototype.build_form=function() {
  this.elements={};
  this.element_divs = {};

  if(!this.data) {
    this.data={};
    for(var k=0; k<this.def['default']; k++) {
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
  var element_class=get_form_element_class(element_def);
  var element_id=this.id+"_"+k;
  var element_options=new clone(this.options);
  element_options.var_name = form_build_child_var_name(this.options, k)
  element_def._name=function(k) {
    return this.index_element(k);
  }.bind(this, k);

  if(class_exists(element_class)) {
    this.elements[k]=eval("new "+element_class+"()");
    this.elements[k].init(element_id, element_def, element_options, this);
  }
}

form_element_array.prototype.connect=function(dom_parent) {
  this.parent("form_element_array").connect.call(this, dom_parent);

  var current=this.dom_parent.firstChild;
  this.elements={};
  this.element_divs = {};
  while(current) {
    var k;
    if((current.nodeName=="DIV")&&(k=current.getAttribute("form_element_num"))) {
      this.element_divs[k] = current;
      var element_class="form_element_"+this.def.def.type;
      var element_id=this.id+"_"+k;
      var element_options=new clone(this.options);
      element_options.var_name=element_options.var_name+"["+k+"]";
      var element_def=new clone(this.def.def);
      element_def._name=function(k) {
	return this.index_element(k);
      }.bind(this, k);

      if(class_exists(element_class)) {
	this.elements[k]=eval("new "+element_class+"()");
	this.elements[k].init(element_id, element_def, element_options, this);
	this.elements[k].connect(current.firstChild.firstChild);
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
	else if(input.name==this.options.var_name+"[__order_up]["+k+"]") {
	  input.onclick=this.order_up.bind(this, k);
	}
	else if(input.name==this.options.var_name+"[__order_down]["+k+"]") {
	  input.onclick=this.order_down.bind(this, k);
	}
	input=input.nextSibling;
      }
    }

    // modify actions
    if(current.className=="form_element_array_actions") {
      input=current.firstChild;
      while(input) {
	if(input.name==this.options.var_name+"[__new]") {
	  this.action_add = input;
	  this.action_add.onclick = this.add_element.bind(this);
	}
	input=input.nextSibling;
      }
    }

    current=current.nextSibling;
  }
}

form_element_array.prototype.finish_connect=function() {
  this.parent("form_element_array").finish_connect.call(this);

  for(var k in this.elements) {
    this.elements[k].finish_connect();
  }
}

form_element_array.prototype.get_data=function() {
  var ret={};
  var count=0;

  for(var i in this.elements) {
    var d = this.elements[i].get_data();

    if(this.def.exclude_null_values && (d === null))
      continue;

    if(this.elements[i].include_data()) {
      ret[i] = d;
      count++;
    }
  }

  if(count==0)
    return this.def.empty_value || null;

  return ret;
}

form_element_array.prototype.set_data=function(data) {
  this.data=data;
  this.build_form();

  if(data)
    for(var k in data) {
      if(typeof this.elements[k]!="undefined")
	this.elements[k].set_data(data[k]);
    }

  if(this.dom) {
    var old_dom = this.dom;
    var par = this.dom.parentNode;
    var div = this.show_element();

    par.insertBefore(div, old_dom);
    par.removeChild(old_dom);
  }

  this.data=null;
}

form_element_array.prototype.set_orig_data=function(data) {
  for(var k in this.elements) {
    if(!data)
      this.elements[k].set_orig_data(null);
    else if(k in data)
      this.elements[k].set_orig_data(data[k]);
    else
      this.elements[k].set_orig_data(null);
  }
}

form_element_array.prototype.get_orig_data=function() {
  var ret={};

  for(var i in this.elements) {
    ret[i]=this.elements[i].get_orig_data();
  }

  return ret;
}

form_element_array.prototype.show_element_part=function(k, element) {
  var order;
  var removeable;
  if(!('order' in this.def) || this.def.order)
    order = 'order'
  else
    order = 'no_order';
  if(!('removeable' in this.def) || this.def.removeable !== false)
    removeable = 'removeable'
  else
    removeable = 'not_removeable';

  // wrapper #k
  var div=document.createElement("div");
  div.setAttribute("form_element_num", k);
  div.className="form_element_array_part";

  // element #k
  var el_div=document.createElement("span");
  el_div.setAttribute("form_element_num", k);
  el_div.className="form_element_array_part_element form_element_"+element.type() + " form_element_array_" + order + "_" + removeable;
  div.appendChild(el_div);

  el_div.appendChild(element.show_element());

  // errors #k
  el_div.appendChild(element.show_div_errors());

  // Actions #k
  var el_div=document.createElement("span");
  el_div.setAttribute("form_element_num", k);
  el_div.className="form_element_array_part_element_actions";
  div.appendChild(el_div);

  if(order == 'order') {
    var input=document.createElement("input");
    input.type="submit";
    input.name=this.options.var_name+"[__order_up]["+k+"]";
    input.value="↑";
    input.onclick=this.order_up.bind(this, k);
    el_div.appendChild(input);

    var input=document.createElement("input");
    input.type="submit";
    input.name=this.options.var_name+"[__order_down]["+k+"]";
    input.value="↓";
    input.onclick=this.order_down.bind(this, k);
    el_div.appendChild(input);
  }

  if (removeable === 'removeable') {
    var input=document.createElement("input");
    input.type="submit";
    input.name=this.options.var_name+"[__remove]["+k+"]";
    input.value="X";
    input.onclick=this.remove_element.bind(this, k);
    el_div.appendChild(input);
  }

  this.element_divs[k] = div
  return div;
}

form_element_array.prototype.show_element=function() {
  var div=this.parent("form_element_array").show_element.call(this);
  this.get_data();

  for(var k in this.elements) {
    var part_div=this.show_element_part(k, this.elements[k]);
    div.appendChild(part_div);
  }

  var el_div=document.createElement("div");
  el_div.className="form_element_array_actions";
  div.appendChild(el_div);

  this.action_add=document.createElement("input");
  this.action_add.type="submit";
  this.action_add.name=this.options.var_name+"[__new]";
  if("button:add_element" in this.def) {
    if(typeof(this.def['button:add_element']) == "object")
      this.action_add.value = lang(this.def['button:add_element']);
    else
      this.action_add.value = this.def['button:add_element'];
  }
  else
    this.action_add.value=lang('form:add_element');
  this.action_add.onclick=this.add_element.bind(this);
  el_div.appendChild(this.action_add);

  return div;
}

form_element_array.prototype.all_errors=function(list) {
  this.parent("form_element_array").all_errors.call(this, list);

  for(var k in this.elements)
    this.elements[k].all_errors(list);
}

form_element_array.prototype.errors=function(list) {
  this.parent("form_element_array").errors.call(this, list);

  var count = 0;
  for(var k in this.elements)
    count++;

  if('max' in this.def && (count > this.def.max))
    list.push(lang('form_element_array:error_max', 0, this.def.max));

  if('min' in this.def && (count < this.def.min))
    list.push(lang('form_element_array:error_min', 0, this.def.min));
}

form_element_array.prototype.is_complete=function() {
// TODO?
//  if(this.changed_count)
//    return false;

  for(var i in this.elements) {
    if(!this.elements[i].is_complete())
      return false;
  }

  return true;
}

form_element_array.prototype.add_element = function (id) {
  if (typeof id === 'undefined') {
    id = 0

    for (var i in this.elements) {
      i = parseInt(i)
      if (i > id) {
        highest_id = i
      }
    }

    id = parseInt(id) + 1
  }

  this.create_element(id)

  var current=document.getElementById(this.id).firstChild;
  while(current) {
    if(current.className=="form_element_array_actions") {
      current.parentNode.insertBefore(this.show_element_part(id, this.elements[id]), current);
      break;
    }
    current=current.nextSibling;
  }

  this.elements[id].resize()

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

  this.show_errors();
  this.resize();

  return false;
}

form_element_array.prototype.order_up=function(k) {
  var current=document.getElementById(this.id).firstChild;
  var prev=null;

  while(current) {
    if(current.className=="form_element_array_part") {
      if(current.getAttribute("form_element_num")==k) {
	if(prev)
	  current.parentNode.insertBefore(current, prev);
	break;
      }

      prev=current;
    }

    current=current.nextSibling;
  }

  this.show_errors();
  this.resize();

  return false;
}

form_element_array.prototype.order_down=function(k) {
  var current=document.getElementById(this.id).lastChild;
  var next=null;

  while(current) {
    if(current.className=="form_element_array_part") {
      if(current.getAttribute("form_element_num")==k) {
	if(next)
	  current.parentNode.insertBefore(next, current);
	break;
      }

      next=current;
    }

    current=current.previousSibling;
  }

  this.show_errors();
  this.resize();

  return false;
}

form_element_array.prototype.refresh=function(force) {
  this.parent("form_element_array").refresh.call(this, force);

  for(var i in this.elements)
    this.elements[i].refresh(force);

  var count = 0;
  for(var k in this.elements)
    count++;

  if (!this.action_add)
    return;
  else if ('max' in this.def && (count >= this.def.max))
    this.action_add.className = "reached_max";
  else
    this.action_add.className = "";
}

form_element_array.prototype.resize = function () {
  this.parent("form_element_array").resize.call(this);

  for (var k in this.elements) {
    this.elements[k].resize()
  }
}

form_element_array.prototype.is_modified=function() {
  var orig_data=this.get_orig_data();

  for(var i in this.elements) {
    // new key, was not present in orig_data
    if(typeof orig_data[i]=="undefined")
      return true;

    // data of sub-elements were changed
    if(this.elements[i].is_modified())
      return true;
  }

  for(var i in orig_data) {
    // key has been removed
    if(typeof this.elements[i]=="undefined")
      return true;
  }

  return false;
}

form_element_array.prototype.show_errors=function() {
  this.parent("form_element_array").show_errors.call(this);

  for(var i in this.elements)
    this.elements[i].show_errors();
}

form_element_array.prototype.notify_child_change=function(element) {
  // show errors of current element
  this.parent("form_element_array").show_errors.call(this);

  this.parent("form_element_array").notify_child_change.call(this, element);
}

form_element_array.prototype.check_required=function(list, param) {
  if(this.required()) {
    for(var k in this.elements)
      return;

    if(param.length<1)
      list.push(lang('form:require_value'));
    else
      list.push(param[0]);
  }
}
