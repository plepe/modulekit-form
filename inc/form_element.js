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
  else
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
  this.div_errors=document.getElementById("errors-"+this.id);
  this.dom=document.getElementById(this.id);

  var current;
  if(this.tr)
    current = this.tr.firstChild;

  while(current) {
    if(current.className) {
      var classes = current.className.split(" ");
      if(classes.indexOf("field_desc") != -1)
	this.td_desc = current;
      if(classes.indexOf("field_value") != -1)
	this.td_value = current;
    }

    current = current.nextSibling;
  }
}

form_element.prototype.finish_connect=function(dom_parent) {
  call_hooks('form_element_connected', this);
}

form_element.prototype.type=function() {
  if(this.def.type)
    return this.def.type;
  
  return "default";
}

form_element.prototype.get_data=function() {
  if(!this.dom_element)
    return this.data;

  this.data=this.dom_element.value.replace(/\r\n/, "\n");
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

form_element.prototype.show_desc=function() {
  var ret = document.createElement("div");

  if(!this.def.hide_field_name) {
    if(this.def.name) {
      var div=document.createElement("div");
      div.className="form_name";
      var text=document.createTextNode(this.name()+":");
      div.appendChild(text);
      ret.appendChild(div);
    }

    if(this.def.desc) {
      var div=document.createElement("div");
      div.className="form_desc";
      div.innerHTML=(typeof this.def.desc=="object"?lang(this.def.desc):this.def.desc);
      ret.appendChild(div);
    }
  }

  call_hooks('form_element_connected', this);

  return ret;
}

form_element.prototype.show_div_errors=function() {
  this.div_errors=document.createElement("div");
  this.div_errors.className="field_errors";
  this.div_errors.id="errors-"+this.id;

  return this.div_errors;
}

form_element.prototype.show=function() {
  var req = this.required();

  this.tr=document.createElement("tr");
  this.tr.id="tr-"+this.id;
  this.tr.className = "";

  if(!this.is_shown())
    this.tr.style.display="none";

  if(!this.def.hide_label) {
    this.td_desc=document.createElement("td");
    this.td_desc.className="field_desc";
    this.tr.appendChild(this.td_desc);

    this.td_desc.appendChild(this.show_desc());
  }

  this.td_value=document.createElement("td");
  this.td_value.className="field_value";
  if(this.def.hide_label)
    this.td_value.setAttribute("colspan", 2);
  this.tr.appendChild(this.td_value);

  this.td_value.appendChild(this.show_element());

  this.td_value.appendChild(this.show_div_errors());

  return this.tr;
}

form_element.prototype.show_element=function() {
  this.dom=document.createElement("span");
  this.dom.className="form_element_"+this.type();
  this.dom.id=this.id;

  return this.dom;
}

form_element.prototype.required=function() {
  if('req' in this.def) {
    var req = this.def.req;
    var req_test = [];

    if(typeof req == 'object') {
      this.check(req_test, req);
      req = req_test.length == 0;
    }

    return req;
  }

  return false;
}

form_element.prototype.errors=function(list) {
  var data=this.get_data();

  if(this.required() && ((!this.data)||(data===null)))
    list.push(lang("form:require_value"));

  if(this.def.check&&(data!==null)) {
    var check_errors=[];

    this.check(check_errors, this.def.check);

    for(var i=0; i<check_errors.length; i++)
      list.push(check_errors[i]);

  }
}

form_element.prototype.all_errors=function(list) {
  var new_list = []

  this.errors(new_list);

  for(var i=0; i<new_list.length; i++)
    list.push(this.path_name() + ": " + new_list[i]);
}

form_element.prototype.is_complete=function() {
  return true;
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

  if(param.length == 0)
    list_errors.push(lang('form:check_empty_or'));

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

form_element.prototype.resolve_other_element=function(path) {
  var curr_parent = this.form_parent;

  while(path.substr(0, 3) == "../") {
    curr_parent = curr_parent.form_parent;
    path = path.substr(3);
  }

  return curr_parent.elements[path];
}

// call check() on another form element of the same hierarchy
form_element.prototype.check_check=function(list, param) {
  var check_errors=[];

  other=this.resolve_other_element(param[0]);
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

form_element.prototype.check_contains=function(list, param) {
  if(param.length<1)
    return;

  var data = this.get_data();

  if(typeof param[0] == "object") {
    for(var i=0; i<param[0].length; i++)
      if(data.indexOf(param[0][i]) != -1)
	return;
  }
  else {
    if(data.indexOf(param[0]) != -1)
      return;
  }

  if(param.length<2)
    list.push(lang('form:invalid_value'));
  else
    list.push(param[1]);
}

form_element.prototype.show_errors=function() {
  var check_errors=[];
  this.errors.call(this, check_errors);

  // remove old error indicator
  if(this.tr) {
    if(!this.tr.className)
      this.tr.className="";
    this.tr.className=this.tr.className.replace(/ has_errors/, "");
  }

  // remove old error texts
  if(this.div_errors)
    while(this.div_errors.firstChild)
      this.div_errors.removeChild(this.div_errors.firstChild);

  // create an 'ul' in div_errors and print errors there
  if(check_errors.length) {
    var ul=document.createElement("ul");

    for(var i=0; i<check_errors.length; i++) {
      var li=document.createElement("li");
      li.appendChild(document.createTextNode(check_errors[i]));
      ul.appendChild(li);
    }
    
    if(this.div_errors)
      this.div_errors.appendChild(ul);
    if(this.tr)
      this.tr.className+=" has_errors";
  }
}

form_element.prototype.notify_change=function(ev) {
  this.form_root.refresh();

  this.show_errors.call(this);

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

form_element.prototype.refresh=function(force) {
  this.data=this.get_data();

  if(!this.tr)
    return;

  if(this.is_shown())
    this.tr.setAttribute("style", "");
  else
    this.tr.setAttribute("style", "display: none;");

  var req = this.required();

  if(req) {
    if(this.tr)
      add_class(this.tr, "required");
    if(this.td_desc)
      add_class(this.td_desc, "required");
    if(this.td_value)
      add_class(this.td_value, "required");
    if(this.dom)
      add_class(this.dom, "required");
  }
  else {
    if(this.tr)
      remove_class(this.tr, "required");
    if(this.td_desc)
      remove_class(this.td_desc, "required");
    if(this.td_value)
      remove_class(this.td_value, "required");
    if(this.dom)
      remove_class(this.dom, "required");
  }
}

form_element.prototype.is_modified=function() {
  return this.get_data()!==this.get_orig_data();
}

form_element.prototype.get_values=function() {
  var ret={};

  if('values_func' in this.def) {
    var fun = null;

    if('js' in this.def.values_func)
      fun = this.def.values_func['js'];

    if(typeof fun == "function")
      this.def.values = fun(this.get_data(), this, this.form_root.form);
    else if(fun in window)
      this.def.values = window[fun](this.get_data(), this, this.form_root.form);
    else
      this.def.values = null;
  }

  if(!this.def.values||(typeof this.def.values!="object"))
    return ret;

  // check mode
  if(!this.def.values_mode)
    this.def.values_mode=this.def.values.length?"values":"keys";

  for(var k in this.def.values) {
    var val=this.def.values[k];

    if(val === null)
      continue;
    if(typeof val=="object") {
      if('show_depend' in val) {
	var check_errors=[];
	this.check(check_errors, val.show_depend);

	if(check_errors.length)
	  continue;
      }
    }

    switch(this.def.values_mode) {
      case "keys":
	ret[k]=val;
	break;
      case "values":
        ret[val]={ 'name': val };
	break;
      default:
        // invalid mode
    }
  }

  return ret;
}

// replaces tags like [name] in str by the value of an element on the same
// hierarchy, e.g.
// parse_data("foo [name] bar") will return "foo Max bar" when
// element 'name' has value "Max"
form_element.prototype.parse_data=function(str) {
  var offset=0;
  var p1, p2;

  while((p1=str.indexOf("[", offset))!=-1) {
    p2=str.indexOf("]", p1);

    var key=str.substr(p1+1, p2-p1-1);
    var data=this.form_parent.get_data();

    if(key in data)
      data=data[key];
    else
      data="";

    str=str.substr(0, p1) + data + str.substr(p2+1);

    offset=p1+data.length;
  }

  return str;
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
