form_element_switch.inherits_from(form_element);
function form_element_switch() {
}

form_element_switch.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_switch").init.call(this, id, def, options, form_parent);
  if(!('hide_label' in this.def))
    this.def.hide_label = true;

  this.build_form();
}

form_element_switch.prototype.build_form=function() {
  this.elements={};

  for(var k in this.def.def) {
    this.create_element(k, this.def.def[k]);
  }
}

form_element_switch.prototype.connect=function(dom_parent) {
  this.parent("form_element_switch").connect.call(this, dom_parent);

  this.element_table = {};

  var reload_dom = document.getElementById(this.id);
  reload_dom.style.display = 'none';

  for(var k in this.elements) {
    var dom_parent = document.getElementById('tr-' + this.id + "_" + k);
    this.elements[k].connect(dom_parent);
    this.element_table[k] = dom_parent;

  }
}

form_element_switch.prototype.create_element=function(k, element_def) {
  var element_class=get_form_element_class(element_def);
  var element_id=this.id+"_"+k;
  var element_options=new clone(this.options);
  if (this.options.var_name) {
    element_options.var_name=element_options.var_name+"["+k+"]";
  }

  if(class_exists(element_class)) {
    this.elements[k]=eval("new "+element_class+"()");
    this.elements[k].init(element_id, element_def, element_options, this);
  }
}

form_element_switch.prototype.show=function() {
  this.element_table = {};
  var ret = [];

  for(var k in this.elements) {
    var element = this.elements[k];

    this.element_table[k] = element.show();
    ret.push(this.element_table[k]);
  }

  return ret;
}

form_element_switch.prototype.get_switch_element=function() {
  if(!this.switch_element) {
    this.switch_element = this.form_parent.resolve_other_elements(this.def['switch']);

    if((!this.switch_element) || (!this.switch_element.length)) {
      alert("Switch " + this.id + " can't resolve switch element " + this.def['switch']);
      return null;
    }

    this.switch_element = this.switch_element[0];
  }

  return this.switch_element;
}

form_element_switch.prototype.get_active_element=function() {
  var switch_data = this.get_switch_element().get_data();

  if(!(switch_data in this.elements))
    return null;

  return this.elements[switch_data];
}

form_element_switch.prototype.get_data=function() {
  var el = this.get_active_element();

  if(el == null)
    return null;

  return el.get_data();
}

form_element_switch.prototype.set_data=function(data) {
  for(var k in this.elements)
    this.elements[k].set_data(data);
}

form_element_switch.prototype.set_orig_data=function(data) {
  for(var k in this.elements)
    this.elements[k].set_orig_data(data);
}

form_element_switch.prototype.refresh=function(force) {
  this.parent("form_element_switch").refresh.call(this, force);

  var el = this.get_active_element();

  for(var k in this.elements) {
    this.elements[k].refresh(force);

    if(this.elements[k] == el)
      this.element_table[k].style.display = null;
    else
      this.element_table[k].style.display = 'none';
  }
}

// save changes of the active element to the other children
form_element_switch.prototype.notify_child_change=function(children) {
  this.parent("form_element_switch").notify_child_change.call(this, children);

  if(children.length == 0)
    return;

  // check if the changed child was the currently active child
  var el = this.get_active_element();
  if(el != children[0])
    return;

  // load data from the active child
  var data = el.get_data();

  // save changes of the active element to the other children
  for(var k in this.elements) {
    if(this.elements[k] != el)
      this.elements[k].set_data(data);
  }
}
