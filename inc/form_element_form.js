form_element_form.inherits_from(form_element);
function form_element_form() {
}

form_element_form.prototype.path_name=function() {
  if(this.form_parent===null)
    return null;

  return this.parent("form_element_form").path_name.call(this);
}

form_element_form.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_form").init.call(this, id, def, options, form_parent);

  this.build_form();
}

form_element_form.prototype.connect=function(dom_parent) {
  this.parent("form_element_form").connect.call(this, dom_parent);

  for(var k in this.def.def) {
    var element_id=this.id+"_"+k;
    var element_dom_parent=document.getElementById(element_id);

    if(element_dom_parent)
      this.elements[k].connect(element_dom_parent);
  }

  this.dom_table = document.getElementById(this.id)
  this.dom_table_body = this.dom_table.firstChild
}

form_element_form.prototype.finish_connect=function() {
  this.parent("form_element_form").finish_connect.call(this);

  for(var k in this.def.def) {
    this.elements[k].finish_connect();
  }
}

form_element_form.prototype.build_form=function() {
  this.elements={};

  for(var k in this.def.def) {
    var element_class=get_form_element_class(this.def.def[k]);

    var element_id=this.id+"_"+k;
    var element_options=new clone(this.options);
    element_options.var_name = form_build_child_var_name(this.options, k)

    this.elements[k]=eval("new "+element_class+"()");
    this.elements[k].init(element_id, this.def.def[k], element_options, this);
  }
}

form_element_form.prototype.focus = function() {
  let list = Object.keys(this.elements)
  if (list.length === 0) {
    return
  }

  this.elements[list[0]].focus()
}

form_element_form.prototype.show_element=function() {
  this.dom_table = document.createElement("table");
  this.dom_table.className = 'form_element_form';
  this.dom_table.id = this.id;
  this.dom_elements = {};
  var element_list = [];

  this.dom_table_body = document.createElement('tbody')
  this.dom_table.appendChild(this.dom_table_body)

  for(var i in this.elements) {
    var element = this.elements[i];

    const d = element.show()
    this.dom_elements[i] = Array.isArray(d) ? d : [d];
    element_list.push([ element.weight(), i ]);
  }

  element_list = weight_sort(element_list);

  element_list.forEach(i => {
    this.dom_elements[i].forEach(d => this.dom_table_body.appendChild(d))
  })

  return this.dom_table;
}

form_element_form.prototype.get_data=function(data) {
  var ret={};

  for(var i in this.elements) {
    if(this.elements[i].include_data())
      ret[i]=this.elements[i].get_data();
  }

  return ret;
}

form_element_form.prototype.set_data=function(data) {
  if(!data)
    return;

  if(typeof data != 'object')
    return;

  for(var k in data) {
    if(typeof this.elements[k]!="undefined")
      this.elements[k].set_data(data[k]);
  }
}

form_element_form.prototype.set_orig_data=function(data) {
  for(var k in this.elements) {
    if(!data)
      this.elements[k].set_orig_data(null);
    else if((typeof data == 'object') && (k in data))
      this.elements[k].set_orig_data(data[k]);
    else
      this.elements[k].set_orig_data(null);
  }
}

form_element_form.prototype.get_orig_data=function() {
  var ret={};

  for(var i in this.elements) {
    ret[i]=this.elements[i].get_orig_data();
  }

  return ret;
}

form_element_form.prototype.all_errors=function(list) {
  this.parent("form_element_form").all_errors.call(this, list);

  for(var i in this.elements) {
    this.elements[i].all_errors(list);
  }
}


form_element_form.prototype.is_complete=function() {
  for(var i in this.elements) {
    if(!this.elements[i].is_complete())
      return false;
  }

  return true;
}

form_element_form.prototype.refresh=function(force) {
  this.parent("form_element_form").refresh.call(this, force);

  for(var i in this.elements)
    this.elements[i].refresh(force);
}

form_element_form.prototype.resize = function () {
  this.parent("form_element_form").resize.call(this);

  var width = this.dom_table.parentNode.offsetWidth;
  var em_height = get_em_height(this.dom_table);

  this.dom_table.classList.remove('small')
  this.dom_table.classList.remove('medium')

  if (width / em_height <= 25) {
    this.dom_table.classList.add('small')
  } else if (width / em_height <= 40) {
    this.dom_table.classList.add('medium')
  }

  for (var k in this.elements) {
    this.elements[k].resize()
  }
}

form_element_form.prototype.is_modified=function() {
  for(var i in this.elements)
    if(this.elements[i].is_modified())
      return true;

  return false;
}

form_element_form.prototype.show_errors=function() {
  this.parent("form_element_form").show_errors.call(this);

  for(var i in this.elements)
    this.elements[i].show_errors();
}

form_element_form.prototype.notify_child_change=function(element) {
  // show errors of current element
  this.parent("form_element_form").show_errors.call(this);

  this.parent("form_element_form").notify_child_change.call(this, element);
}
