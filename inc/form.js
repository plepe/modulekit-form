function form(id, def, options) {
  this.id=id;
  this.def=def;
  if(!options)
    options={};
  this.options=options;
  if(!this.options.var_name)
    this.options.var_name=this.id;

  this.has_data=false;

  this.orig_data=null;

  this.build_form();

  this.table=document.getElementById(this.id);
  if(this.table) {
    // read orig_data
    var inputs=this.table.getElementsByTagName("input");
    for(var i=0; i<inputs.length; i++) {
      if(inputs[i].name=="form_orig_"+this.options.var_name)
	this.orig_data=json_decode(inputs[i].value);
    }

    // connect elements to php-form
    this.connect(this.table);
  }
}

form.prototype.build_form=function() {
  this.elements={};
  for(var k in this.def) {
    var element_class="form_element_"+this.def[k].type;
    var element_id=this.id+"_"+k;
    var element_options=new clone(this.options);
    element_options.var_name=element_options.var_name+"["+k+"]";

    if(class_exists(element_class)) {
      this.elements[k]=eval("new "+element_class+"()");
      this.elements[k].init(element_id, this.def[k], element_options, null);
    }
  }
}

form.prototype.connect=function() {
  for(var k in this.def) {
    var element_id=this.id+"_"+k;
    var element_dom_parent=document.getElementById(element_id);

    if(element_dom_parent)
      this.elements[k].connect(element_dom_parent);
  }
}

form.prototype.get_data=function() {
  var ret={};

  for(var i in this.elements) {
    ret[i]=this.elements[i].get_data();
  }

  return ret;
}

form.prototype.set_data=function(data) {
  this.has_data=true;

  for(var k in this.elements) {
    if(data[k])
      this.elements[k].set_data(data[k]);
    else
      this.elements[k].set_data(null);
  }
}

form.prototype.show=function(dom_parent) {
  this.table=document.createElement("table");
  this.table.id=this.id;
  this.table.className="form";

  for(var i in this.elements) {
    this.table.appendChild(this.elements[i].show());
  }

  dom_parent.appendChild(this.table);
  return this.table;
}
