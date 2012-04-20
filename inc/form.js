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
  for(var i in this.def) {
    var cls="form_element_"+this.def[i].type;

    if(class_exists(cls)) {
      this.elements[i]=eval("new "+cls+"()");
    }

  }
}
