form_element_text.inherits_from(form_element);
function form_element_text() {
}

form_element_text.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_text").init.call(this, id, def, options, form_parent);
}

form_element_text.prototype.connect=function(dom_parent) {
  this.parent("form_element_text").connect.call(this, dom_parent);

  if(!this.dom_element)
    this.dom_element=this.dom_parent.getElementsByTagName("input")[0];

  this.dom_element.onblur=this.notify_change.bind(this);
}

form_element_text.prototype.create_element=function() {
  var input=document.createElement("input");
  input.type="text";

  return input;
}

form_element_text.prototype.show_element=function() {
  var div=this.parent("form_element_text").show_element.call(this);

  var cls="form_orig";
  if(this.is_modified())
    cls="form_modified";

  var input=this.create_element();

  if(this.def.html_attributes)
    for(var i in this.def.html_attributes)
      input.setAttribute(i, this.def.html_attributes[i]);

  input.className=cls;
  input.name=this.options.var_name;
  if(this.data)
    input.value=this.data;
  div.appendChild(input);
  this.dom_element=input;
  this.dom_element.onblur=this.notify_change.bind(this);

  this.update_options();

  return div;
}

form_element_text.prototype.update_options = function() {
  var values = this.get_values();

  if(values)
    this.dom_element.setAttribute("list", this.id+"-datalist");
  else {
    this.dom_element.removeAttribute("list");
    return;
  }

  if(!this.datalist_container) {
    this.datalist_container=document.createElement("span");
    this.datalist_container.setAttribute("class", "form_datalist_container");
    this.dom.appendChild(this.datalist_container);

    this.datalist=document.createElement("datalist");
    this.datalist.setAttribute("id", this.id+"-datalist");
    this.datalist_container.appendChild(this.datalist);
  }

  while(this.datalist.firstChild)
    this.datalist.removeChild(this.datalist.firstChild);

  for(var k in values) {
    var option=document.createElement("option");
    option.setAttribute("value", values[k]);
    this.datalist.appendChild(option);

    var text=document.createTextNode(values[k]);
    option.appendChild(text);
  }
}

form_element_text.prototype.get_data=function(data) {
  var data=this.parent("form_element_text").get_data.call(this);

  if((data==="")||(data===null)) {
    if('empty_value' in this.def)
      return this.def.empty_value;

    return null;
  }

  return data;
}

form_element_text.prototype.set_data=function(data) {
  this.parent("form_element_text").set_data.call(this, data);

  if(this.dom_element)
    this.dom_element.value=this.data;
}

form_element_text.prototype.refresh=function() {
  var cls;

  this.parent("form_element_text").refresh.call(this);

  if(!this.dom_element)
    return;

  if('values_func' in this.def) {
    this.update_options();
  }

  if(this.is_modified())
    cls="form_modified";
  else
    cls="form_orig";

  this.dom_element.className=cls;
}

form_element_text.prototype.check_regexp=function(list, param) {
  if(param.length<1)
    return;

  if(!this.get_data().match(param[0])) {
    if(param.length<2)
      list.push(lang('form:invalid_value'));
    else
      list.push(param[1]);
  }
}

form_element_text.prototype.errors=function(list) {
  this.parent("form_element_text").errors.call(this, list);

  if((this.data!="")&&(this.data!=null)) {
    if(this.def.force_values&&this.def.values) {
      if(!in_array(this.data, this.def.values))
        list.push(this.path_name()+": "+lang('form:invalid_value'));
    }
  }
}

form_element_text.prototype.is_modified=function() {
  this.get_data();

  if( ((this.orig_data==="")||(this.orig_data===null))
    &&((this.data==="")||(this.data===null)))
    return false;

  return this.parent("form_element_text").is_modified.call(this);
}
