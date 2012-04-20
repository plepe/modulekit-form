function form(id, def, options) {
  this.id=id;
  this.def=def;
  this.options=options;

  this.table=document.getElementById(this.id);
  if(!this.table)
    return;

  this.orig_data=null;
  var inputs=this.table.getElementsByTagName("input");
  for(var i=0; i<inputs.length; i++) {
    if(inputs[i].name=="form_orig_"+this.options.var_name)
      this.orig_data=json_decode(inputs[i].value);
  }

  this.build_form();
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

form.prototype.get_data=function() {
  var ret={};

  for(var i in this.elements) {
    ret[i]=this.elements[i].get_data();
  }

  return ret;
}
