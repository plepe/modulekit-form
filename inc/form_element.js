var form_element_type_alias={};

function form_element() {
}

form_element.prototype.init=function(id, def, options, form_parent) {
  this.id=id;
  this.def=def;
  this.options=options;
  this.form_parent=form_parent;
  if(form_parent==null)
    this.form_root=this;
  else
    this.form_root=form_parent.form_root;

  this.data=null;
  this.orig_data=null;

  if('default' in this.def) {
    this.set_data.call(this, this.def['default']);
    this.set_orig_data.call(this, this.def['default']);
  }
}

form_element.prototype.name=function() {
  var name;

  if(this.def._name)
    name=this.def._name();

  name=this.def.name;

  if(typeof name=="object") {
    return lang(name);
  }

  return name;
}

form_element.prototype.path_name=function() {
  var parent_path=this.form_parent.path_name();

  if(parent_path===null)
    return this.name();

  return parent_path+"/"+this.name();
}

form_element.prototype.connect=function(dom_parent) {
  this.dom_parent=dom_parent;

  this.tr=document.getElementById("tr-"+this.id);
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
  tr.id="tr-"+this.id;
  this.tr=tr;

  if(!this.is_shown())
    tr.style.display="none";

  var td=document.createElement("td");
  td.className="field_desc";
  tr.appendChild(td);

  if(!this.def.hide_field_name) {
    if(this.def.name) {
      var div=document.createElement("div");
      div.className="form_name";
      var text=document.createTextNode(this.name()+":");
      div.appendChild(text);
      td.appendChild(div);
    }

    if(this.def.desc) {
      var div=document.createElement("div");
      div.className="form_desc";
      div.innerHTML=(typeof this.def.desc=="object"?lang(this.def.desc):this.def.desc);
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
  this.dom=document.createElement("span");
  this.dom.className="form_element_"+this.type();
  this.dom.id=this.id;
  return this.dom;
}

form_element.prototype.errors=function(list) {
  var data=this.get_data();

  if((this.def.req)&&((!this.data)||(data===null)))
    list.push(this.path_name()+": "+lang("form:require_value"));

  if(this.def.check) {
    var check_errors=[];

    this.check(check_errors, this.def.check);

    for(var i=0; i<check_errors.length; i++)
      list.push(this.path_name()+": "+check_errors[i]);

  }
}

form_element.prototype.check=function(list, param) {
  var check=param.slice(0);
  var check_fun="check_"+check.shift();

  if(typeof this[check_fun]==='function') {
    this[check_fun](list, check);
  }
}

// call check() for all elements of the param-array
// if last element is a string it wil be returned as error message (if any of the checks returned an error)
form_element.prototype.check_and=function(list, param) {
  var list_errors=[];

  for(var i=0; i<param.length; i++) {
    if((typeof param[i] == "string")&&(i==param.length-1)) {
      if(list_errors.length)
	errors.push(param[i]);

      list_errors=[];
    }
    else {
      this.check(list_errors, param[i]);
    }
  }

  for(var i=0; i<list_errors.length; i++)
    list.push(list_errors[i]);
}

// call check() for all elements of the param-array until one successful check is found
// if last element is a string it wil be returned as error message (if all of the checks returned an error)
form_element.prototype.check_or=function(list, param) {
  var list_errors=[];

  for(var i=0; i<param.length; i++) {
    var check_errors=[];

    if((typeof param[i] == "string")&&(i==param.length-1)) {
      if(list_errors.length)
	errors.push(param[i]);

      list_errors=[];
    }
    else {
      this.check(check_errors, param[i]);

      if(!check_errors.length)
	return;
    }

    for(var j=0; j<check_errors.length; j++)
      list_errors.push(check_errors[j]);
  }

  for(var j=0; j<list_errors.length; j++)
    list.push(list_errors[j]);
}

// call check() for the first element of the param-array, return second element as error message if check() returns successful
form_element.prototype.check_not=function(list, param) {
  var check_errors=[];

  this.check(check_errors, param[0]);

  if(check_errors.length)
    return;

  if(param.length<2)
    list.push(lang('form:invalid_value'));
  else
    list.push(param[1]);
}

// call check() on another form element of the same hierarchy
form_element.prototype.check_check=function(list, param) {
  var check_errors=[];

  other=this.form_parent.elements[param[0]];
  if(!other)
    return;

  other.check(check_errors, param[1]);

  if(check_errors.length) {
    if(param.length>2)
      list.push(param[2]);
    else
      for(var i=0; i<check_errors.length; i++)
	list.push(other.path_name()+": "+check_errors[i]);
  }
}

// call check() on another form element of the same hierarchy
form_element.prototype.check_is=function(list, param) {
  if(param.length<1)
    return;

  if(this.get_data()!=param[0]) {
    if(param.length<2)
      list.push(lang('form:invalid_value'));
    else
      list.push(param[1]);
  }
}

form_element.prototype.notify_change=function() {
  this.form_root.refresh();

  var check_errors=[];
  this.errors.call(this, check_errors);

  if(check_errors.length) {
    var text=[];

    for(var i=0; i<check_errors.length; i++) {
      text.push(check_errors[i]);
    }

    alert(text.join("\n"));
  }

  this.form_root.form.notify_change();
}

form_element.prototype.is_shown=function() {
  if(this.def.show_depend) {
    errors=[];

    this.check(errors, this.def.show_depend);

    if(errors.length)
      return false;
  }

  return true;
}

form_element.prototype.refresh=function() {
  this.data=this.get_data();

  if(!this.tr)
    return;

  if(this.is_shown())
    this.tr.setAttribute("style", "");
  else
    this.tr.setAttribute("style", "display: none;");
}

form_element.prototype.is_modified=function() {
  return this.get_data()!==this.get_orig_data();
}

form_element.prototype.get_values=function() {
  var ret={};

  if(!this.def.values||(typeof this.def.values!="object"))
    return ret;

  // check mode
  if(!this.def.values_mode)
    this.def.values_mode=this.def.values.length?"values":"keys";

  for(var k in this.def.values) {
    var val=this.def.values[k];

    if(typeof val=="object")
      val=lang(val);

    switch(this.def.values_mode) {
      case "keys":
	ret[k]=val;
	break;
      case "values":
        ret[val]=val;
	break;
      default:
        // invalid mode
    }
  }

  return ret;
}

function get_form_element_class(def) {
  var type=def.type;

  if(form_element_type_alias[def.type])
    type=form_element_type_alias[def.type];

  var element_class="form_element_"+type;

  if(!class_exists(element_class))
    element_class="form_element_unsupported";

  return element_class;
}
