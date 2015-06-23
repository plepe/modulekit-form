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

  var current = dom_parent.firstChild;
  while(current) {
    var k;
    if(k = current.getAttribute("form_element_switch")) {
      if(k in this.elements) {
        this.element_table[k] = current;

        var dom_parent = document.getElementById(this.id+"_"+k);
        this.elements[k].connect(dom_parent);
      }
    }

    current = current.nextSibling;
  }
}

form_element_switch.prototype.create_element=function(k, element_def) {
  var element_class=get_form_element_class(element_def);
  var element_id=this.id+"_"+k;
  var element_options=new clone(this.options);
  element_options.var_name=element_options.var_name+"["+k+"]";

  if(class_exists(element_class)) {
    this.elements[k]=eval("new "+element_class+"()");
    this.elements[k].init(element_id, element_def, element_options, this);
  }
}

form_element_switch.prototype.show_element=function() {
  var div=this.parent("form_element_switch").show_element.call(this);
  this.element_table = {};

  for(var k in this.elements) {
    var element = this.elements[k];

    this.element_table[k] = document.createElement("table");
    this.element_table[k].setAttribute("form_element_switch", k);
    this.element_table[k].setAttribute("class", "form form_element_switch_part");

    this.element_table[k].appendChild(element.show());

    div.appendChild(this.element_table[k]);
  }

  return div;
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

form_element_switch.prototype.refresh=function() {
  var el = this.get_active_element();

  for(var k in this.elements) {
    if(this.elements[k] == el)
      this.element_table[k].style.display = null;
    else
      this.element_table[k].style.display = 'none';
  }
}
