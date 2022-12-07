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

form_element.prototype.focus = function () {
}

form_element.prototype.name=function() {
  var name = this.id;

  if(this.def._name)
    name=this.def._name();
  else
    name=this.def.name;

  if (!name) {
    return '';
  }

  if(typeof name=="object") {
    return lang(name);
  }

  return name;
}

form_element.prototype.weight=function() {
  if(this.def.weight) {
    if(typeof this.def.weight == 'object') {
      const test = [];
      this.check(test, this.def.weight, true);
      return test.length ? parseNumber(test[0]) : 0
    }

    return this.def.weight;
  }

  return 0;
}

form_element.prototype.path_name=function() {
  if (!this.form_parent) {
    return this.name();
  }

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

  current = this.td_value && this.td_value.firstChild
  while (current) {
    if (current.className === 'message') {
      this.dom_message = current
    }

    current = current.nextSibling
  }
}

form_element.prototype.finish_connect=function(dom_parent) {
  call_hooks('form_element_connected', this);

  this.data = this.get_data();
}

form_element.prototype.type=function() {
  if(this.def.type)
    return this.def.type;
  
  return "default";
}

form_element.prototype.include_data=function() {
  if('include_data' in this.def) {
    if((this.def.include_data === true) || (this.def.include_data === false))
      return this.def.include_data;

    if(this.def.include_data === 'not_null')
      return this.get_data() !== null;

    errors=[];

    this.check(errors, this.def.include_data);

    if(errors.length)
      return false;
  }

  return true;
}

form_element.prototype.get_data=function() {
  if(!this.dom_element)
    return this.data;

  var data=this.dom_element.value.replace(/\r\n/, "\n");
  return data;
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

  call_hooks('form_element_connected', this);

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
      req = req_test.length != 0;
    }

    return req;
  }

  return false;
}

form_element.prototype.disabled=function() {
  if('disabled' in this.def) {
    let v = this.def.disabled
    let v_test = []

    if(typeof v == 'object') {
      this.check(v_test, v)
      v = v_test.length == 0
    }

    return v
  }

  if (this.form_parent) {
    return this.form_parent.disabled()
  }

  return false;
}

form_element.prototype.message = function() {
  if('message' in this.def) {
    let v = this.def.message

    if(typeof v == 'object') {
      const list = []
      this.check(list, v)
      return list.join('\n')
    }

    return v
  }

  return false;
}

form_element.prototype.check_required=function(list, param, no_path=0) {
  var data=this.get_data();

  if(this.required() && (data === null)) {
    if(param.length<1)
      list.push(lang('form:require_value'));
    else
      list.push(param[0]);
  }
}

form_element.prototype.errors=function(list) {
  var data=this.get_data();

  this.check_required(list, []);

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

form_element.prototype.check=function(list, param, no_path=0) {
  var check=param.slice(0);
  var check_fun="check_"+check.shift();

  if(typeof this[check_fun]==='function') {
    this[check_fun](list, check, no_path);
  }

  for(var i = 0; i < list.length; i++) {
    if(typeof list[i] == "object") {
      var p = list[i];
      list.splice(i, 1);
      for(var j = 0; j < p.length; j++)
	list.splice(i, 0, p[j]);
    }
  }
}

// check if element has a value
form_element.prototype.check_has_value=function(list, param, no_path=0) {
  if(this.get_data() === null) {
    if(param.length<1)
      list.push(lang('form:invalid_value'));
    else
      list.push(param[0]);
  }
}

// call check() for all elements of the param-array
// if last element is a string it wil be returned as error message (if any of the checks returned an error)
form_element.prototype.check_and=function(list, param, no_path=0) {
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
form_element.prototype.check_or=function(list, param, no_path=0) {
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
      this.check(check_errors, param[i], no_path);

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
form_element.prototype.check_not=function(list, param, no_path=0) {
  var check_errors=[];

  this.check(check_errors, param[0], no_path);

  if(check_errors.length)
    return;

  if(param.length<2)
    list.push(lang('form:invalid_value'));
  else
    list.push(param[1]);
}

form_element.prototype.resolve_other_elements=function(path) {
  if(!path)
    return [ this ];

  var p = path.split("/");

  var p_first = p[0];
  p.splice(0, 1);
  var p_other = p.join("/");

  if(p_first == "..") {
    return this.form_parent.resolve_other_elements(p_other);
  }
  else if(p_first == "*") {
    var ret = [];

    for(var k in this.elements)
      ret = ret.concat(this.elements[k].resolve_other_elements(p_other));

    return ret;
  }
  else if(p_first in this.elements) {
    return [ this.elements[p_first] ];
  }
  else
    alert("Path '" + p_first + "' not known");

  return [ ];
}

// call check() on another form element of the same hierarchy
form_element.prototype.check_check=function(list, param, no_path=0) {
  var check_errors=[];

  var other_list=this.form_parent.resolve_other_elements(param[0]);

  for(var i=0; i<other_list.length; i++) {
    var other = other_list[i];

    other.check(check_errors, param[1], no_path);

    if(check_errors.length) {
      if(param.length>2)
	list.push(param[2]);
      else
	for(var i=0; i<check_errors.length; i++)
	  list.push(no_path ? check_errors[i] : other.path_name()+": "+check_errors[i]);
    }
  }
}

// call check() on another form element of the same hierarchy
form_element.prototype.check_is=function(list, param, no_path=0) {
  if(param.length<1)
    return;

  if(this.get_data()!=param[0]) {
    if(param.length<2)
      list.push(lang('form:invalid_value'));
    else
      list.push(param[1]);
  }
}

form_element.prototype.check_contains=function(list, param, no_path=0) {
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

form_element.prototype.check_fun=function(list, param, no_path=0) {
  var fun;
  var ret = null;

  if('js' in param[0])
    fun = param[0]['js'];
  else
    return;

  if(typeof fun == "function")
    ret = fun(this.get_data(), this, this.form_root.form);
  else if(fun in window)
    ret = window[fun](this.get_data(), this, this.form_root.form);
  else if(typeof fun == "string") {
    var dom = document.createElement('script');
    dom.type = 'text/javascript';
    dom.appendChild(document.createTextNode('var __ = ' + fun));

    document.body.appendChild(dom);
    fun = param[0]['js'] = __;
    document.body.removeChild(dom);

    ret = fun(this.get_data(), this, this.form_root.form);
  }

  if(ret)
    list.push(ret);
}

form_element.prototype.check_unique=function(list, param, no_path=0) {
  var done = [];
  var dupl = [];
  var data = [];

  if((param.length == 0) || (param[0] == null)) {
    data = this.get_data();

    for(var k in data) {
      if(done.indexOf(data[k]) != -1)
	dupl.push(JSON.stringify(data[k]));

      done.push(data[k]);
    }
  }
  else {
    var this_data = this.get_data();
    var this_data_enc = JSON.stringify(this_data);

    var other_list = this.form_parent.resolve_other_elements(param[0]);
    for(var i=0; i<other_list.length; i++) {
      var other = other_list[i];

      if((other != this) && (JSON.stringify(other.get_data()) == this_data_enc)) {
	dupl = [ this_data ];
	break;
      }
    }
  }

  if(dupl.length) {
    if(param.length > 1)
      list.push(lang(param[1], dupl.length, dupl.join(", ")));
    else
      list.push(lang("form:duplicate", dupl.length, dupl.join(", ")));
  }
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
  var data = this.get_data()
  if (this.data === data) {
    return
  }

  this.data = data;

  this.show_errors.call(this);

  if(this.form_parent)
    this.form_parent.notify_child_change([this]);

  this.form_root.refresh();

  this.form_root.form.notify_change();
}

form_element.prototype.notify_child_change=function(elements) {
  var el = [this].concat(elements);

  if(this.form_parent)
    this.form_parent.notify_child_change(el);
}

form_element.prototype.is_shown=function() {
  if(this.def.show_depend === false)
    return this.def.show_depend;

  if(this.def.show_depend) {
    errors=[];

    this.check(errors, this.def.show_depend);

    if(errors.length)
      return false;
  }

  return true;
}

form_element.prototype.refresh=function(force) {
  if(!this.tr)
    return;

  if(this.is_shown())
    this.tr.setAttribute("style", "");
  else
    this.tr.setAttribute("style", "display: none;");

  if(('default_func' in this.def) && (this.data == null)) {
    var v = this.func_call(this.def.default_func);
    this.set_data(v);
    this.set_orig_data(v);
  }

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

  var message = this.message()
  if (this.dom_message) {
    this.dom_message.innerHTML = message
  }
  else if (message && !this.dom_message) {
    this.dom_message = document.createElement('div')
    this.dom_message.className = 'message'
    this.dom_message.innerHTML = message

    this.td_value.appendChild(this.dom_message)
  }
}

form_element.prototype.resize = function () {
}

form_element.prototype.is_modified=function() {
  return this.get_data()!==this.get_orig_data();
}

form_element.prototype.func_call=function(def) {
  var fun = null;

  if('js' in def)
    fun = def['js'];

  if(typeof fun == "function")
    return fun(this.get_data(), this, this.form_root.form);
  else if(fun in window)
    return window[fun](this.get_data(), this, this.form_root.form);
  else if(typeof fun == "string") {
    var dom = document.createElement('script');
    dom.type = 'text/javascript';
    dom.appendChild(document.createTextNode('var __ = ' + fun));

    document.body.appendChild(dom);
    def.js = __;
    document.body.removeChild(dom);

    return def.js(this.get_data(), this, this.form_root.form);
  }

  return null;
}

form_element.prototype.get_values=function() {
  var ret={};

  if('values_func' in this.def) {
    this.def.values = this.func_call(this.def.values_func);
  }

  if(!this.def.values||(typeof this.def.values!="object"))
    return ret;

  // check mode
  if(!this.def.values_mode)
    this.def.values_mode=this.def.values.length?"values":"keys";

  if (this.def.values_mode === 'property') {
    if (!this.def.values_property) {
      this.def.values_property = 'id'
    }
  }

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
      case "property":
        ret[val[this.def.values_property]] = val;
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

function form_create_element (id, def, options, parent) {
  var element_class=get_form_element_class(def)
  var element_options=new clone(this.options)

  var element = eval("new " + element_class + "()")
  element.init(id, def, options, parent)

  return element
}
