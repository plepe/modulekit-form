form_element_grid.inherits_from(form_element);
function form_element_grid() {
}

form_element_grid.prototype.path_name=function() {
  if(this.form_parent===null)
    return null;

  return this.parent("form_element_grid").path_name.call(this);
}

form_element_grid.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_grid").init.call(this, id, def, options, form_parent);

  this.build_form();
}

form_element_grid.prototype.connect=function(dom_parent) {
  this.parent("form_element_grid").connect.call(this, dom_parent);

  this.dom_table = this.dom_parent.firstChild
  var current = this.dom_table.rows[0]

  while(current) {
    if (current.hasAttribute("form_element_num")) {
      var n = current.getAttribute("form_element_num")

      this.create_element(n)

      for (var k in this.def.def) {
        var element_dom_parent = this.elements[n][k].id
        this.elements[n][k].connect(document.getElementById(element_dom_parent))
      }

      var el_div = current.lastChild
      var input = el_div.firstChild
      while (input) {
        if (input.name === this.options.var_name + '[__remove][' + n + ']') {
          input.onclick = this.remove_element.bind(this, n)
        }
        if (input.name === this.options.var_name + '[__order_up][' + n + ']') {
          input.onclick = this.order_up.bind(this, n)
        }
        if (input.name === this.options.var_name + '[__order_down][' + n + ']') {
          input.onclick = this.order_down.bind(this, n)
        }
        input = input.nextSibling
      }
    }
    current=current.nextSibling
  }

  this.action_add = this.dom_parent.lastChild
  this.action_add.onclick=this.add_element.bind(this);
}

form_element_grid.prototype.finish_connect=function() {
  this.parent("form_element_grid").finish_connect.call(this);

  for (var n in this.elements) {
    for (var k in this.elements[n]) {
      this.elements[n][k].finish_connect();
    }
  }
}

form_element_grid.prototype.build_form=function() {
  this.elements = {}
  this.headers = {}

  if(!this.data) {
    this.data={};
    for(var k=0; k<this.def['default']; k++) {
      this.data[k]=null;
    }
  }

  for(var k in this.def.def) {
    var element_class=get_form_element_class(this.def.def[k]);

    var element_id=this.id+"_"+n+"_"+k;
    var element_options=new clone(this.options);
    if(element_options.var_name)
      element_options.var_name=element_options.var_name+"[head]["+k+"]";
    else
      element_options.var_name="head_"+k;

    this.headers[k]=eval("new "+element_class+"()");
    this.headers[k].init(element_id, this.def.def[k], element_options, this);
  }

  for(var n in this.data) {
    this.create_element(n)
  }
}

form_element_grid.prototype.create_element = function (n) {
  this.elements[n] = {}

  for(var k in this.def.def) {
    var element_class=get_form_element_class(this.def.def[k]);

    var element_id=this.id+"_"+n+"_"+k;
    var element_options=new clone(this.options);
    if(element_options.var_name)
      element_options.var_name=element_options.var_name+"["+n+"]["+k+"]";
    else
      element_options.var_name=n+"_"+k;

    this.elements[n][k]=eval("new "+element_class+"()");
    this.elements[n][k].init(element_id, this.def.def[k], element_options, this);
  }
}

form_element_grid.prototype.show_element_part=function(n) {
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

  var tr = this.dom_table.insertRow(-1)
  tr.setAttribute('form_element_num', n)

  for (var k in this.elements[n]) {
    var element = this.elements[n][k]
    var td = document.createElement('td')
    tr.appendChild(td)
    td.appendChild(element.show_element())
  }

  // Actions #k
  var el_div=document.createElement("td");
  el_div.setAttribute("form_element_num", k);
  el_div.className="form_element_grid_part_element_actions";
  tr.appendChild(el_div);

  if(order == 'order') {
    var input=document.createElement("input");
    input.type="submit";
    input.name=this.options.var_name+"[__order_up]["+n+"]";
    input.value="↑";
    input.onclick=this.order_up.bind(this, n);
    el_div.appendChild(input);

    var input=document.createElement("input");
    input.type="submit";
    input.name=this.options.var_name+"[__order_down]["+n+"]";
    input.value="↓";
    input.onclick=this.order_down.bind(this, n);
    el_div.appendChild(input);
  }

  if (removeable === 'removeable') {
    var input=document.createElement("input");
    input.type="submit";
    input.name=this.options.var_name+"[__remove]["+n+"]";
    input.value="X";
    input.onclick=this.remove_element.bind(this, n);
    el_div.appendChild(input);
  }
}

form_element_grid.prototype.show_element=function() {
  var div=this.parent("form_element_grid").show_element.call(this);

  var table = document.createElement("table")
  table.id = this.id
  table.className = "grid"
  this.dom_table = table
  div.appendChild(table)

  var tr = document.createElement('tr')
  table.appendChild(tr)
  for (var k in this.headers) {
    var element = this.headers[k]
    var th = document.createElement('th')
    tr.appendChild(th)
    th.appendChild(element.show_desc())
  }

  for (var n in this.elements) {
    this.show_element_part(n)
  }

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
  div.appendChild(this.action_add);

  return div
}

form_element_grid.prototype.elements_order = function() {
  if (!this.dom_table) {
    return Object.keys(this.elements)
  }

  var ret = []
  var current = this.dom_table.rows[0]
  while(current) {
    if (current.hasAttribute("form_element_num")) {
      ret.push(current.getAttribute("form_element_num"))
    }

    current = current.nextSibling
  }

  return ret
}

form_element_grid.prototype.get_data=function(data) {
  var ret = {}

  if (!this.dom_table) {
    return null
  }

  var order = this.elements_order()
  for (var i = 0; i < order.length; i++) {
    var n = order[i]
    ret[n] = {}

    for (var k in this.elements[n]) {
      if(this.elements[n][k].include_data()) {
        ret[n][k] = this.elements[n][k].get_data()
      }
    }
  }

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
        console.log(this.id + ': form_element_grid: unknown index_type "' + this.def.index_type + '"')
    }
  }

  return ret
}

form_element_grid.prototype.set_data=function(data) {
  if(!data)
    return

  this.data = data
  this.build_form()

  for(var n in data) {
    for (var k in data[n]) {
      if(typeof this.elements[n][k]!="undefined") {
        this.elements[n][k].set_data(data[n][k])
      }
    }
  }

  if(this.dom) {
    var old_dom = this.dom;
    var par = this.dom.parentNode;
    var div = this.show_element();

    par.insertBefore(div, old_dom);
    par.removeChild(old_dom);
  }

  this.data = null
}

form_element_grid.prototype.set_orig_data=function(data) {
  for(var n in this.elements) {
    for (var k in this.elements[n]) {
      if(!data)
        this.elements[n][k].set_orig_data(null);
      else if(n in data && k in data[n])
        this.elements[n][k].set_orig_data(data[n][k]);
      else
        this.elements[n][k].set_orig_data(null);
    }
  }
}

form_element_grid.prototype.get_orig_data=function() {
  var ret = {}

  for(var n in this.elements) {
    ret[n] = {}
    for (var k in this.elements[n]) {
      ret[n][k] = this.elements[n][k].get_orig_data()
    }
  }

  return ret
}

form_element_grid.prototype.all_errors=function(list) {
  this.parent("form_element_grid").all_errors.call(this, list);

  for (var n in this.elements) {
    for (var k in this.elements[n]) {
      this.elements[n][k].all_errors(list)
    }
  }
}


form_element_grid.prototype.is_complete=function() {
  for (var n in this.elements) {
    for (var k in this.elements) {
      if(!this.elements[n][k].is_complete())
        return false
    }
  }

  return true
}

form_element_grid.prototype.refresh=function(force) {
  this.parent("form_element_grid").refresh.call(this, force);

  for (var n in this.elements) {
    for (var k in this.elements[n]) {
      this.elements[n][k].refresh(force)
    }
  }
}

form_element_grid.prototype.is_modified=function() {
  for (var n in this.elements) {
    for (var k in this.elements[n]) {
      if(this.elements[n][k].is_modified()) {
        return true
      }
    }
  }

  return false
}

form_element_grid.prototype.show_errors=function() {
  this.parent("form_element_grid").show_errors.call(this);

  for (var n in this.elements) {
    for (var k in this.elements[n]) {
      this.elements[n][k].show_errors()
    }
  }
}

form_element_grid.prototype.notify_child_change=function(element) {
  // show errors of current element
  this.parent("form_element_grid").show_errors.call(this);

  this.parent("form_element_grid").notify_child_change.call(this, element);
}

form_element_grid.prototype.remove_element=function(n) {
  console.log(n)
  var current = this.dom_table.rows[0]
  while(current) {
    if (current.hasAttribute("form_element_num")) {
      if(current.getAttribute("form_element_num")==n) {
        current.parentNode.removeChild(current)
        delete(this.elements[n])
        break
      }
    }

    current=current.nextSibling
  }

  this.show_errors()
  this.form_root.form.resize()

  return false
}

form_element_grid.prototype.order_up=function(n) {
  var current = this.dom_table.rows[0]
  var prev = null

  while (current) {
    if (current.hasAttribute("form_element_num")) {
      if (current.getAttribute("form_element_num")==n) {
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

form_element_grid.prototype.order_down=function(n) {
  var current = this.dom_table.rows[this.dom_table.rows.length - 1]
  var next = null

  while(current) {
    if (current.hasAttribute("form_element_num")) {
      if(current.getAttribute("form_element_num")==n) {
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

form_element_grid.prototype.add_element = function() {
  var highest_id=0;

  for(var i in this.elements) {
    i = parseInt(i);
    if(i>highest_id)
      highest_id=i;
  }

  highest_id=parseInt(highest_id)+1;
  this.create_element(highest_id);
  this.show_element_part(highest_id)

  this.form_root.form.resize();

  return false;
}
