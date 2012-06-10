function form_element() {
}

form_element.prototype.init=function(id, def, options, form_parent) {
  this.id=id;
  this.def=def;
  this.options=options;
  this.form_parent=form_parent;
  this.data=null;
}

form_element.prototype.name=function() {
  if(this.def._name)
    return this.def._name;

  return this.def.name;
}

form_element.prototype.path_name=function() {
  var parent_path=this.form_parent.path_name();

  if(parent_path===null)
    return this.name();

  return parent_path+"/"+this.name();
}

form_element.prototype.connect=function(dom_parent) {
  this.dom_parent=dom_parent;
}

form_element.prototype.type=function() {
  if(this.def.type)
    return this.def.type;
  
  return "default";
}

form_element.prototype.get_data=function() {
  if(!this.dom_element)
    return this.data;

  this.data=this.dom_element.value;
  return this.data;
}

form_element.prototype.set_data=function(data) {
  this.data=data;
}

form_element.prototype.set_orig_data=function(data) {
  this.orig_data=data;
}

form_element.prototype.get_orig_data=function() {
  return this.orig_data;
}

form_element.prototype.show=function() {
  var tr=document.createElement("tr");
  var td=document.createElement("td");
  td.className="field_desc";
  tr.appendChild(td);

  if(!this.def.hide_field_name) {
    if(this.def.name) {
      var div=document.createElement("div");
      div.className="form_name";
      var text=document.createTextNode(this.def.name+":");
      div.appendChild(text);
      td.appendChild(div);
    }

    if(this.def.desc) {
      var div=document.createElement("div");
      div.className="form_desc";
      var text=document.createTextNode(this.def.desc+":");
      div.appendChild(text);
      td.appendChild(div);
    }
  }

  var td=document.createElement("td");
  td.className="field_value";
  tr.appendChild(td);
  td.appendChild(this.show_element());

  return tr;
}

form_element.prototype.show_element=function() {
  this.dom=document.createElement("div");
  this.dom.className="form_element_"+this.type();
  this.dom.id=this.id;
  return this.dom;
}

form_element.prototype.errors=function(list) {
  if((this.def.req)&&((!this.data)||(this.data=="")))
    list.push(this.path_name()+": Wert muss angegeben werden.");

  if(this.def.check) {
    var check_errors=[];

    this.check(check_errors, this.def.check);

    for(var i=0; i<check_errors.length; i++)
      list.push(this.path_name()+": "+check_errors[i]);

  }
}

form_element.prototype.check=function(list, param) {
  var check=this.def.check.slice(0);
  var check_fun="check_"+check.shift();

  if(typeof this[check_fun]==='function') {
    this[check_fun](list, check);
  }
}

form_element.prototype.check_modified=function() {
}
