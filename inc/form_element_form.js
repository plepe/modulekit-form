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
}

form_element_form.prototype.build_form=function() {
  this.elements={};

  for(var k in this.def.def) {
    var element_class=get_form_element_class(this.def.def[k]);

    var element_id=this.id+"_"+k;
    var element_options=new clone(this.options);
    if(element_options.var_name)
      element_options.var_name=element_options.var_name+"["+k+"]";
    else
      element_options.var_name=k;

    this.elements[k]=eval("new "+element_class+"()");
    this.elements[k].init(element_id, this.def.def[k], element_options, this);
  }
}

form_element_form.prototype.show_element=function() {
  var table=document.createElement("table");
  table.id=this.id;
  table.className="form";

  for(var i in this.elements) {
    table.appendChild(this.elements[i].show());
  }

  return table;
}

form_element_form.prototype.get_data=function(data) {
  var ret={};

  for(var i in this.elements) {
    if(this.elements[i].is_shown())
      ret[i]=this.elements[i].get_data();
  }

  return ret;
}

form_element_form.prototype.set_data=function(data) {
  if(!data)
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
    else if(k in data)
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
