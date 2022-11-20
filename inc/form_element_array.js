const { lang } = require('modulekit-lang')
const { clone, form_build_child_var_name } = require('./functions')
const form_create_element = require('./form_create_element')

form_element_array.inherits_from(require('./form_element'));
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

form_element_array.prototype.focus = function() {
  let list = Object.keys(this.elements)
  if (list.length === 0) {
    return
  }

  this.elements[list[0]].focus()
}

form_element_array.prototype.create_element=function(k) {
  var element_id=this.id+"_"+k;
  var element_options=new clone(this.options);
  element_options.var_name = form_build_child_var_name(this.options, k)
  var element_def=new clone(this.def.def);
  element_def._name=function(k) {
    return this.index_element(k);
  }.bind(this, k);

  this.elements[k] = form_create_element(element_id, element_def, element_options, this)
}

form_element_array.prototype.connect=function(dom_parent) {
  this.parent("form_element_array").connect.call(this, dom_parent);

  var current=this.dom.firstChild;
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
	  input.onclick = function (k) {
            this.remove_element(k)
            this.notify_change()
            return false
          }.bind(this, k)
	}
	else if(input.name==this.options.var_name+"[__order_up]["+k+"]") {
	  input.onclick = function (k) {
            this.order_up(k)
            this.notify_change()
            return false
          }.bind(this, k)
	  input.onclick=this.order_up.bind(this, k);
	}
	else if(input.name==this.options.var_name+"[__order_down]["+k+"]") {
	  input.onclick = function (k) {
            this.order_down(k)
            this.notify_change()
            return false
          }.bind(this, k)
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
	  input.onclick = function (k) {
            this.add_element()
            this.notify_change()
            return false
          }.bind(this)
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
  var order = [];
  var count=0;

  if (!this.dom) {
    return this.data
  }

  var current=this.dom.firstChild;
  while(current) {
    var i = current.getAttribute("form_element_num")

    if(current.nodeName === "DIV" && i) {
      var d = this.elements[i].get_data();

      if((!this.def.exclude_null_values || d !== null) &&
        this.elements[i].include_data()) {
        ret[i] = d;
        order.push(i)
        count++;
      }
    }

    current = current.nextSibling
  }

  if(count==0)
    return this.def.empty_value || null;

  if (this.def.index_type) {
    switch (this.def.index_type) {
      case 'keep':
        break;
      case '_keys':
        ret._keys = order
        break;
      case 'array':
        var ret1 = []
        order.forEach(function (i) {
          ret1.push(ret[i])
        })
        ret = ret1
        break;
      default:
        console.log(this.id + ': form_element_array: unknown index_type "' + this.def.index_type + '"')
    }
  }

  return ret;
}

form_element_array.prototype.set_data=function(data) {
  this.data = data
  var new_elements = {}
  var new_element_divs = {}

  if(data)
    for(var k in data) {
      if(typeof this.elements[k] === "undefined") {
        this.add_element(k)
      }

      this.elements[k].set_data(data[k])
      new_elements[k] = this.elements[k]
      new_element_divs[k] = this.element_divs[k]
    }

  for (var k in this.elements) {
    if (!(k in data)) {
      this.remove_element(k)
    }
  }

  this.elements = new_elements
  this.element_divs = new_element_divs
  for (var k in new_element_divs) {
    var div = this.element_divs[k]
    if (div) {
      this.dom.insertBefore(div, this.action_add.parentNode)
    }
  }
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
    if (this.options.var_name) {
      input.name=this.options.var_name+"[__order_up]["+k+"]";
    }
    input.value="↑";
    input.onclick = function (k) {
      this.order_up(k)
      this.notify_change()
      return false
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
      return false
    }.bind(this, k)
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
      return false
    }.bind(this, k)
    el_div.appendChild(input);
  }

  this.element_divs[k] = div
  return div;
}

form_element_array.prototype.show_element=function() {
  var createable
  var div=this.parent("form_element_array").show_element.call(this);

  if(!('createable' in this.def) || this.def.createable !== false)
    createable = 'createable'
  else
    createable = 'not_createable'

  if (this.tr) {
    this.tr.setAttribute('class', this.tr.getAttribute('class') + ' ' + createable)
  }
  this.dom.setAttribute('class', this.dom.getAttribute('class') + ' ' + createable)

  for(var k in this.elements) {
    var part_div=this.show_element_part(k, this.elements[k]);
    div.appendChild(part_div);
  }

  var el_div=document.createElement("div");
  el_div.className="form_element_array_actions";
  div.appendChild(el_div);

  if (createable === 'createable') {
    this.action_add=document.createElement("input");
    this.action_add.type="submit";
    if (this.options.var_name) {
      this.action_add.name=this.options.var_name+"[__new]";
    }
    if("button:add_element" in this.def) {
      if(typeof(this.def['button:add_element']) == "object")
        this.action_add.value = lang(this.def['button:add_element']);
      else
        this.action_add.value = this.def['button:add_element'];
    }
    else {
      this.action_add.value=lang('form:add_element');
    }

    this.action_add.onclick = function (k) {
      this.add_element()
      this.notify_change()
      return false
    }.bind(this)
  }
  else {
    // create empty span, because we add before new items will be added before
    // the 'action_add' input
    this.action_add = document.createElement('span')
  }
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
        id = i
      }
    }

    id = parseInt(id) + 1
  }

  this.create_element(id)

  if (!this.dom) {
    return false;
  }

  var current=this.dom.firstChild;
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
  var current = this.dom.firstChild;
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
  var current = this.dom.firstChild;
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
  var current = this.dom.lastChild;
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

  const disabled = this.disabled()
  this.action_add.disabled = disabled

  Object.keys(this.element_divs).forEach(k => {
    const current = this.element_divs[k]
    let el = current.firstChild
    while (el && el.className !== "form_element_array_part_element_actions") {
      el = el.nextSibling
    }
    if (!el) { return }

    el = el.firstChild
    while (el) {
      if (el.name) {
        if (el.name.substr(0, this.options.var_name.length) === this.options.var_name) {
          const action = el.name.substr(this.options.var_name.length)
          if (action.match(/^\[__(remove|order_up|order_down)\]/)) {
            el.disabled = disabled
          }
        }
      }

      el = el.nextSibling
    }
  })

  if ('max' in this.def && (count >= this.def.max))
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

form_element_array.prototype.get_count = function () {
  return this.get_data().length
}

form_element_array.prototype.check_count=function(list, param) {
  var op = param[0]
  var value = param[1]
  var count = this.get_count()
  var result

  switch (op) {
    case '>=':
      result = count >= value
      break
    case '>':
      result = count > value
      break
    case '<':
      result = count < value
      break
    case '<=':
      result = count <= value
      break
    case '==':
      result = count == value
      break
    case '!=':
      result = count != value
      break
    default:
      list.push('invalid operator')
  }

  if(!result) {
    if (param.length < 3)
      list.push(lang('form:require_value'));
    else
      list.push(param[2]);
  }
}

module.exports = form_element_array
