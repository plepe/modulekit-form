form_element_filters.inherits_from(form_element);
function form_element_filters() {
}

form_element_filters.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_filters").init.call(this, id, def, options, form_parent);

  this.build_form();
}

form_element_filters.prototype.build_form=function() {
  this.elements={};
  this.element_divs = {};

  if(!this.data) {
    this.data={};
  }
}

form_element_filters.prototype.create_element=function(k) {
  var element_def=new clone(this.def.def[k]);
  var element_class=get_form_element_class(element_def);
  var element_id=this.id+"_"+k;
  var element_options=new clone(this.options);
  element_options.var_name=element_options.var_name+"["+k+"]";

  if(class_exists(element_class)) {
    this.elements[k]=eval("new "+element_class+"()");
    this.elements[k].init(element_id, element_def, element_options, this);
  }
}

form_element_filters.prototype.connect=function(dom_parent) {
  this.parent("form_element_filters").connect.call(this, dom_parent);

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
      while((input)&&(input.className!="form_element_filters_part_element_actions")) input=input.nextSibling;
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
    if(current.className=="form_element_filters_actions") {
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

form_element_filters.prototype.finish_connect=function() {
  this.parent("form_element_filters").finish_connect.call(this);

  for(var k in this.elements) {
    this.elements[k].finish_connect();
  }
}

form_element_filters.prototype.get_data=function() {
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

form_element_filters.prototype.set_data=function(data) {
  this.data=data;

  if(data)
    for(var k in data) {
      if(typeof this.elements[k]=="undefined") {
        this.create_element(k)
      }

      this.elements[k].set_data(data[k]);
    }

  for (var k in this.elements) {
    if (!data || (!(k in data))) {
      this.remove_element(k)
    }
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

form_element_filters.prototype.set_orig_data=function(data) {
  // TODO!
  for(var k in this.elements) {
    if(!data)
      this.elements[k].set_orig_data(null);
    else if(k in data)
      this.elements[k].set_orig_data(data[k]);
    else
      this.elements[k].set_orig_data(null);
  }
}

form_element_filters.prototype.get_orig_data=function() {
  var ret={};

  for(var i in this.elements) {
    ret[i]=this.elements[i].get_orig_data();
  }

  return ret;
}

form_element_filters.prototype.show_element_part=function(k, element) {
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

  // element #k
  var tr = element.show()

  tr.setAttribute("form_element_num", k);
  tr.className = tr.className + " form_element_filters_part_element form_element_"+element.type() + " form_element_filters_" + order + "_" + removeable;

  // Actions #k
  var el_div=document.createElement("td");
  el_div.setAttribute("form_element_num", k);
  el_div.className="form_element_filters_part_element_actions";
  tr.appendChild(el_div);

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

  return tr;
}

form_element_filters.prototype.show_element=function() {
  var div=this.parent("form_element_filters").show_element.call(this);
  this.get_data();

  this.dom_table = document.createElement('table')
  this.dom_table.className = 'form_element_filters_table'
  div.appendChild(this.dom_table)

  for(var k in this.elements) {
    var part_div=this.show_element_part(k, this.elements[k]);
    this.element_divs[k] = part_div;
    this.dom_table.appendChild(part_div);
  }

  var el_div=document.createElement("div");
  el_div.className="form_element_filters_actions";
  div.appendChild(el_div);

  this.action_add=document.createElement("select");
  this.action_add.name=this.options.var_name+"[__new]";
  this.action_add.className = 'form_element_filters_action_add'

  var option = document.createElement('option');
  option.value = '';
  if("button:add_element" in this.def) {
    if(typeof(this.def['button:add_element']) == "object")
      option.appendChild(document.createTextNode(lang(this.def['button:add_element'])));
    else
      option.appendChild(document.createTextNode(this.def['button:add_element']));
  }
  else
    option.appendChild(document.createTextNode(lang('form:add_element')));
  this.action_add.appendChild(option);

  for (var k in this.def.def) {
    var element_def = this.def.def[k];
    var option = document.createElement('option');
    option.value = k;

    if (k in this.elements) {
      option.disabled = true;
    }

    option.appendChild(document.createTextNode(element_def.name));
    this.action_add.appendChild(option);
  }

  this.action_add.onchange=this.add_element.bind(this);
  el_div.appendChild(this.action_add);

  return div;
}

form_element_filters.prototype.all_errors=function(list) {
  this.parent("form_element_filters").all_errors.call(this, list);

  for(var k in this.elements)
    this.elements[k].all_errors(list);
}

form_element_filters.prototype.errors=function(list) {
  this.parent("form_element_filters").errors.call(this, list);

  var count = 0;
  for(var k in this.elements)
    count++;

  if('max' in this.def && (count > this.def.max))
    list.push(lang('form_element_filters:error_max', 0, this.def.max));

  if('min' in this.def && (count < this.def.min))
    list.push(lang('form_element_filters:error_min', 0, this.def.min));
}

form_element_filters.prototype.is_complete=function() {
// TODO?
//  if(this.changed_count)
//    return false;

  for(var i in this.elements) {
    if(!this.elements[i].is_complete())
      return false;
  }

  return true;
}

form_element_filters.prototype.add_element=function() {
  var id = this.action_add.value;

  if (id in this.elements) {
    return;
  }

  this.create_element(id);

  this.dom_table.appendChild(this.show_element_part(id, this.elements[id]))

  this.form_root.form.resize();

  this.action_add.value = '';
  for (var i = 0; i < this.action_add.options.length; i++) {
    var option = this.action_add.options[i];

    if (option.value === id) {
      option.disabled = true;
    }
  }

  return false;
}

form_element_filters.prototype.remove_element=function(k) {
  var current = this.dom_table.firstChild;
  while (current) {
    if (current.getAttribute("form_element_num") === k) {
      current.parentNode.removeChild(current)
      delete this.elements[k]
      break
    }

    current=current.nextSibling;
  }

  this.show_errors();
  this.form_root.form.resize();

  for (var i = 0; i < this.action_add.options.length; i++) {
    var option = this.action_add.options[i];

    if (option.value === k) {
      option.disabled = false;
    }
  }

  return false;
}

form_element_filters.prototype.order_up=function(k) {
  var current=document.getElementById(this.id).firstChild;
  var prev=null;

  while(current) {
    if(current.className=="form_element_filters_part") {
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
  this.form_root.form.resize();

  return false;
}

form_element_filters.prototype.order_down=function(k) {
  var current=document.getElementById(this.id).lastChild;
  var next=null;

  while(current) {
    if(current.className=="form_element_filters_part") {
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
  this.form_root.form.resize();

  return false;
}

form_element_filters.prototype.refresh=function(force) {
  this.parent("form_element_filters").refresh.call(this, force);

  for(var i in this.elements)
    this.elements[i].refresh(force);

  var count = 0;
  for(var k in this.elements)
    count++;

  var max_count = 0
  for(var k in this.def.def)
    max_count++

  if (!this.action_add)
    return;
  else if (count === max_count)
    this.action_add.parentNode.classList.add("reached_max")
  else
    this.action_add.parentNode.classList.remove("reached_max")
}

form_element_filters.prototype.is_modified=function() {
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

form_element_filters.prototype.show_errors=function() {
  this.parent("form_element_filters").show_errors.call(this);

  for(var i in this.elements)
    this.elements[i].show_errors();
}

form_element_filters.prototype.notify_child_change=function(element) {
  // show errors of current element
  this.parent("form_element_filters").show_errors.call(this);

  this.parent("form_element_filters").notify_child_change.call(this, element);
}

form_element_filters.prototype.check_required=function(list, param) {
  if(this.required()) {
    for(var k in this.elements)
      return;

    if(param.length<1)
      list.push(lang('form:require_value'));
    else
      list.push(param[0]);
  }
}
