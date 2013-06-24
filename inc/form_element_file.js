form_element_file.inherits_from(form_element);
function form_element_file() {
}

form_element_file.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_file").init.call(this, id, def, options, form_parent);
}

form_element_file.prototype.refresh=function() {
  var cls;

  //this.parent("form_element_file").check_modified.call(this);

  if(!this.dom_element)
    return;

  if(this.is_modified())
    cls="form_modified";
  else
    cls="form_orig";

  this.dom_element.className=cls;
  this.dom_element.onchange=this.notify_change.bind(this);
}

form_element_file.prototype.connect=function(dom_parent) {
  this.parent("form_element_file").connect.call(this, dom_parent);

  var obs=this.dom_parent.getElementsByTagName("input");
  for(var i=0; i<obs.length; i++) {
    if(obs[i].name==this.options.var_name+"[file]")
      this.dom_element=obs[i];
  }

  if(this.dom_element)
    this.dom_element.onchange=this.notify_change.bind(this);
}
