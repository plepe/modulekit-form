form_element_form_chooser.inherits_from(form_element);
function form_element_form_chooser() {
}

form_element_form_chooser.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_form_chooser").init.call(this, id, def, options, form_parent);

  this.build_form(true);
}

form_element_form_chooser.prototype.build_form=function(show_default=false) {
  if ('elements' in this) {
    return
  }

  this.elements={};
  this.element_divs = {};
  this.available_elements = {};

  if(!this.data) {
    this.data={};
  }

  this.def.def = weight_sort(this.def.def)

  for (var k in this.def.def) {
    var element_def=new clone(this.def.def[k]);
    var element_class=get_form_element_class(element_def);
    var element_id=this.id+"_"+k;
    var element_options=new clone(this.options);
    element_options.var_name = form_build_child_var_name(this.options, k)

    if(class_exists(element_class)) {
      this.available_elements[k]=eval("new "+element_class+"()");
      this.available_elements[k].init(element_id, element_def, element_options, this);
    }

    if (show_default && element_def.show_default) {
      this.add_element(k);
    }
  }
}

form_element_form_chooser.prototype.connect=function(dom_parent) {
  var ret = this.parent("form_element_form_chooser").connect.call(this, dom_parent);

  this.dom_table = this.dom_parent.firstChild;
  this.dom_table_body = this.dom_table.firstChild
  var table_rows = this.dom_table.rows;
  this.elements={};
  this.element_divs = {};

  for (var i = 0; i < table_rows.length; i++) {
    var current = table_rows[i];
    var k;

    if((current.nodeName=="TR")&&(k=current.getAttribute("form_element_num"))) {
      if (!(k in this.available_elements)) {
        alert(this.id + ': can\'t connect to child "' + k + '" - not availabe')
        break
      }

      var element = this.available_elements[k]
      this.elements[k] = element
      element.connect(document.getElementById(element.id));

      // modify part actions
      var input=current.firstChild;
      while((input)&&(input.className!="form_element_form_chooser_part_element_actions")) input=input.nextSibling;
      if(!input)
	break;
      input=input.firstChild;
      while(input) {
	if(input.name==this.options.var_name+"[__remove]["+k+"]") {
	  input.onclick = function (k) {
            this.remove_element(k)
            this.notify_change()
            return false;
          }.bind(this, k)
	}
	else if(input.name==this.options.var_name+"[__order_up]["+k+"]") {
	  input.onclick = function (k) {
            this.order_up(k)
            this.notify_change()
            return false;
          }.bind(this, k)
	}
	else if(input.name==this.options.var_name+"[__order_down]["+k+"]") {
	  input.onclick = function (k) {
            this.order_down(k)
            this.notify_change()
            return false;
          }.bind(this, k)
	}
	input=input.nextSibling;
      }
    }
  }

  var divs = this.dom_parent.getElementsByClassName('form_element_form_chooser_actions');
  var div = null
  for (var i = 0; i < divs.length; i++) {
    if (divs[i].parentNode === this.dom_parent)
      div = divs[i]
  }

  if (div) {
    // modify actions
    input = div.firstChild;
    while(input) {
      const next = input.nextSibling

      if (input.name == this.options.var_name+"[__new]") {
	this.action_add = input
	this.action_add.onchange = function () {
          var k = this.action_add.value
          this.add_element(k)
          this.elements[k].focus()
          this.notify_change()
          this.action_add.value = ''
          return false
        }.bind(this)
      }
      else if (input.name == this.options.var_name+"[__preset]") {
	this.action_preset = input
	this.action_preset.onchange = function () {
          var k = this.action_preset.value
          var def = this.def.presets[k];
          this.set_data(def.value)
          this.notify_change()
          this.action_preset.value = ''
          return false
        }.bind(this)
      }
      else {
        div.removeChild(input)
      }

      input = next
    }
  }

  return ret;
}

form_element_form_chooser.prototype.focus = function() {
  let list = Object.keys(this.elements)
  if (list.length === 0) {
    return
  }

  this.elements[list[0]].focus()
}

form_element_form_chooser.prototype.finish_connect=function() {
  this.parent("form_element_form_chooser").finish_connect.call(this);

  for(var k in this.elements) {
    this.elements[k].finish_connect();
  }
}

form_element_form_chooser.prototype.get_data=function() {
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

  for (i in this.available_elements) {
    if (!(i in this.elements)) {
      var element = this.available_elements[i]

      if (element.def.non_used_value) {
        ret[i] = element.def.non_used_value
        count++
      }
    }
  }

  if (this.def.result_keep_order) {
    var d = {}
    for (var k in this.def.def) {
      if (k in ret) {
        d[k] = ret[k]
      }
    }
    ret = d
  }

  if(count==0)
    return this.def.empty_value || null;

  return ret;
}

form_element_form_chooser.prototype.set_data=function(data) {
  if (!('elements' in this)) {
    this.build_form()
  }

  this.data=data;

  if(data) {
    for(var k in data) {
      if (!(k in this.elements)) {
        this.add_element(k)
      }

      if (k in this.elements) {
        this.elements[k].set_data(data[k]);
      }
    }

    this.reorder(Object.keys(data));
  }

  for (var k in this.elements) {
    if (!data || (!(k in data))) {
      this.remove_element(k)
    }
  }

  this.resize();
}

form_element_form_chooser.prototype.set_orig_data=function(data) {
  if (!data) {
    data = {}
  }

  for (var k in this.available_elements) {
    var element = this.available_elements[k]

    if(k in data) {
      element.set_orig_data(data[k])
    } else {
      element.set_orig_data(null)
    }
  }

  this.orig_data_elements = Object.keys(data)
}

form_element_form_chooser.prototype.get_orig_data=function() {
  var ret = {}

  if (!this.orig_data_elements) {
    return {}
  }

  for (var i = 0; i < this.orig_data_elements.length; i++) {
    var k = this.orig_data_elements[i]

    if (k in this.available_elements) {
      ret[k] = this.available_elements[k].get_orig_data()
    }
  }

  return ret
}

form_element_form_chooser.prototype.show_element_part=function(k, element) {
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
  tr.className = tr.className + " form_element_form_chooser_part_element form_element_"+element.type() + " form_element_form_chooser_" + order + "_" + removeable;

  // Actions #k
  var el_div=document.createElement("td");
  el_div.setAttribute("form_element_num", k);
  el_div.className="form_element_form_chooser_part_element_actions";
  tr.appendChild(el_div);

  var input=document.createElement("input");
  input.type="hidden";
  if (this.options.var_name) {
    input.name=this.options.var_name+"[__placeholder]["+k+"]";
  }
  input.value="";
  el_div.appendChild(input)

  if(order == 'order') {
    var input=document.createElement("input");
    input.type="submit";
    if (this.options.var_name) {
      input.name=this.options.var_name+"[__order_up]["+k+"]";
    }
    input.value="↑";
    input.onclick = function (k) {
      this.order_up(k)
      this.notify_change()
      return false;
    }.bind(this, k)
    el_div.appendChild(input);

    var input=document.createElement("input");
    input.type="submit";
    if (this.options.var_name) {
      input.name=this.options.var_name+"[__order_down]["+k+"]";
    }
    input.value="↓";
    input.onclick = function (k) {
      this.order_down(k)
      this.notify_change()
      return false;
    }.bind(this, k)
    input.onclick=this.order_down.bind(this, k);
    el_div.appendChild(input);
  }

  if (removeable === 'removeable') {
    var input=document.createElement("input");
    input.type="submit";
    if (this.options.var_name) {
      input.name=this.options.var_name+"[__remove]["+k+"]";
    }
    input.value="X";
    input.onclick = function (k) {
      this.remove_element(k)
      this.notify_change()
      return false;
    }.bind(this, k)
    el_div.appendChild(input);
  }

  return tr;
}

form_element_form_chooser.prototype.show_element=function() {
  var div=this.parent("form_element_form_chooser").show_element.call(this);
  this.get_data();

  this.dom_table = document.createElement('table')
  this.dom_table.className = 'form_element_form_chooser_table'
  this.dom_table.id = this.id
  div.appendChild(this.dom_table)
  this.dom_table_body = document.createElement('tbody')
  this.dom_table.appendChild(this.dom_table_body)

  for(var k in this.elements) {
    var part_div=this.show_element_part(k, this.elements[k]);
    this.element_divs[k] = part_div;
    this.dom_table_body.appendChild(part_div);
  }

  var el_div=document.createElement("div");
  el_div.className="form_element_form_chooser_actions";
  div.appendChild(el_div);

  this.action_add=document.createElement("select");
  if (this.options.var_name) {
    this.action_add.name=this.options.var_name+"[__new]";
  }
  this.action_add.className = 'form_element_form_chooser_action_add'

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

  for (var k in this.available_elements) {
    var element = this.available_elements[k]
    var option = document.createElement('option');
    option.value = k;

    if (k in this.elements) {
      option.disabled = true;
    }

    option.appendChild(document.createTextNode(element.name()));
    this.action_add.appendChild(option);
  }

  this.action_add.onchange = function () {
    var k = this.action_add.value
    this.add_element(k)
    this.elements[k].focus()
    this.notify_change()
    this.action_add.value = ''
    return false
  }.bind(this)

  el_div.appendChild(this.action_add);

  this.show_preset(el_div);

  return div;
}

form_element_form_chooser.prototype.show_preset=function(el_div) {
  if (!this.def.presets) {
    return
  }

  this.action_preset=document.createElement("select");
  if (this.options.var_name) {
    this.action_preset.name=this.options.var_name+"[__preset]";
  }
  this.action_preset.className = 'form_element_form_chooser_action_preset'

  var option = document.createElement('option');
  option.value = '';
  if("presets:label" in this.def) {
    if(typeof(this.def['presets:label']) == "object")
      option.appendChild(document.createTextNode(lang(this.def['presets:label'])));
    else
      option.appendChild(document.createTextNode(this.def['presets:label']));
  }
  else
    option.appendChild(document.createTextNode(lang('form:load_preset')));
  this.action_preset.appendChild(option);

  for (var k in this.def.presets) {
    var def = this.def.presets[k];
    var option = document.createElement('option');
    option.value = k;

    option.appendChild(document.createTextNode(def.name));
    this.action_preset.appendChild(option);
  }

  this.action_preset.onchange = function () {
    var k = this.action_preset.value
    var def = this.def.presets[k];
    this.set_data(def.value)
    this.notify_change()
    this.action_preset.value = ''
    return false
  }.bind(this)

  el_div.appendChild(this.action_preset);
}

form_element_form_chooser.prototype.all_errors=function(list) {
  this.parent("form_element_form_chooser").all_errors.call(this, list);

  for(var k in this.elements)
    this.elements[k].all_errors(list);
}

form_element_form_chooser.prototype.errors=function(list) {
  this.parent("form_element_form_chooser").errors.call(this, list);

  var count = 0;
  for(var k in this.elements)
    count++;

  if('max' in this.def && (count > this.def.max))
    list.push(lang('form_element_form_chooser:error_max', 0, this.def.max));

  if('min' in this.def && (count < this.def.min))
    list.push(lang('form_element_form_chooser:error_min', 0, this.def.min));
}

form_element_form_chooser.prototype.is_complete=function() {
// TODO?
//  if(this.changed_count)
//    return false;

  for(var i in this.elements) {
    if(!this.elements[i].is_complete())
      return false;
  }

  return true;
}

form_element_form_chooser.prototype.add_element = function(k) {
  if (k in this.elements) {
    return false
  }

  if(!(k in this.available_elements)) {
    //console.log(this.id + ' - add_element: "' + k + '" not found')
    return false
  }

  this.elements[k] = this.available_elements[k]

  if (this.dom_table_body) {
    const tr = this.show_element_part(k, this.elements[k])
    this.element_divs[k] = tr
    this.dom_table_body.appendChild(tr)

    this.resize()

    for (var i = 0; i < this.action_add.options.length; i++) {
      var option = this.action_add.options[i]

      if (option.value === k) {
        option.disabled = true
      }
    }
  }

  return false
}

form_element_form_chooser.prototype.remove_element=function(k) {
  var table_rows = this.dom_table.rows;

  for (var i = 0; i < table_rows.length; i++) {
    var current = table_rows[i];

    if (current.getAttribute("form_element_num") === k) {
      current.parentNode.removeChild(current)
      delete this.elements[k]
      break
    }
  }

  this.show_errors();
  this.resize();

  for (var i = 0; i < this.action_add.options.length; i++) {
    var option = this.action_add.options[i];

    if (option.value === k) {
      option.disabled = false;
    }
  }

  return false;
}

form_element_form_chooser.prototype.reorder = function (keys) {
  const newElements = {}
  const table_rows = this.dom_table.rows;
  for (let i = keys.length - 1; i >= 0; i--) {
    const k = keys[i]
    const tr = this.element_divs[k]

    if (tr) {
      tr.parentNode.insertBefore(tr, tr.parentNode.firstChild)
    }
  }

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i]
    newElements[k] = this.elements[k]
  }

  for (const k in this.elements) {
    if (!(k in newElements)) {
      newElements[k] = this.elements[k]
    }
  }

  this.elements = newElements
}

form_element_form_chooser.prototype.order_up=function(k) {
  var table_rows = this.dom_table.rows;
  var new_elements = {}

  for (var i = 0; i < table_rows.length; i++) {
    var current = table_rows[i];
    var l = current.getAttribute("form_element_num");

    if (i + 1 < table_rows.length) {
      var next = table_rows[i + 1];
      var n = next.getAttribute("form_element_num");

      if (n == k) {
        current.parentNode.insertBefore(next, current);
        new_elements[n] = this.elements[n]
        i++
      }
    }

    new_elements[l] = this.elements[l]
  }

  this.elements = new_elements

  this.show_errors();
  this.resize();

  return false;
}

form_element_form_chooser.prototype.order_down=function(k) {
  var table_rows = this.dom_table.rows;
  var new_elements = {}

  for (var i = 0; i < table_rows.length; i++) {
    var current = table_rows[i];
    var l = current.getAttribute("form_element_num");

    if (i + 1 < table_rows.length) {
      var next = table_rows[i + 1];
      var n = next.getAttribute("form_element_num");

      if (l == k) {
        current.parentNode.insertBefore(next, current);
        new_elements[n] = this.elements[n]
        i++
      }
    }

    new_elements[l] = this.elements[l]
  }

  this.elements = new_elements

  this.show_errors();
  this.resize();

  return false;
}

form_element_form_chooser.prototype.refresh=function(force) {
  this.parent("form_element_form_chooser").refresh.call(this, force);

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

form_element_form_chooser.prototype.resize = function () {
  this.parent("form_element_form_chooser").resize.call(this);

  if (this.dom_table && this.dom_table.rows.length >= 1) {
    var width = this.dom_table.parentNode.parentNode.offsetWidth - this.dom_table.rows[0].cells[2].offsetWidth
    var em_height = get_em_height(this.dom_table);

    if (width / em_height <= 25) {
      this.dom_table.classList.remove('medium')
      this.dom_table.classList.add('small')
    } else if (width / em_height <= 40) {
      this.dom_table.classList.remove('small')
      this.dom_table.classList.add('medium')
    } else {
      this.dom_table.classList.remove('small')
      this.dom_table.classList.remove('medium')
    }
  }

  for (var k in this.elements) {
    this.elements[k].resize()
  }
}

form_element_form_chooser.prototype.is_modified=function() {
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

form_element_form_chooser.prototype.show_errors=function() {
  this.parent("form_element_form_chooser").show_errors.call(this);

  for(var i in this.elements)
    this.elements[i].show_errors();
}

form_element_form_chooser.prototype.notify_child_change=function(element) {
  // show errors of current element
  this.parent("form_element_form_chooser").show_errors.call(this);

  this.parent("form_element_form_chooser").notify_child_change.call(this, element);
}

form_element_form_chooser.prototype.check_required=function(list, param) {
  if(this.required()) {
    for(var k in this.elements)
      return;

    if(param.length<1)
      list.push(lang('form:require_value'));
    else
      list.push(param[0]);
  }
}
