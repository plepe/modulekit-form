form_element_select.inherits_from(form_element);
function form_element_select() {
}

form_element_select.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_select").init.call(this, id, def, options, form_parent);
}

form_element_select.prototype.connect=function(dom_parent) {
  this.parent("form_element_select").connect.call(this, dom_parent);

  this.dom_element=this.dom_parent.firstChild;
  this.dom_element.onchange=this.notify_change.bind(this);
  this.dom_element.onblur=this.notify_change.bind(this);

  if(this.dom_parent.firstChild.nextSibling)
    this.div_desc=this.dom_parent.firstChild.nextSibling;

  var current=this.dom_element.firstChild;
  this.dom_values={};
  while(current) {
    if(current.nodeName=="OPTION") {
      this.dom_values[current.value]=current;
    }

    current=current.nextSibling;
  }
}

form_element_select.prototype.get_data=function() {
  if(!this.dom_element)
    return this.data;

  var data = this.dom_element.value;

  if((data==="")||(data===null)) {
    if('empty_value' in this.def)
      return this.def.empty_value;

    return null;
  }

  return data;
}

form_element_select.prototype.set_data=function(data) {
  this.parent("form_element_select").set_data.call(this, data);

  if(!this.dom_values)
    return;

  for(var k in this.dom_values) {
    if(this.data==k)
      this.dom_values[k].selected=true;
  }
}

form_element_select.prototype.show_element_option=function(select, k, v) {
  var option=document.createElement("option");
  option.value=k;
  // TODO: indexOf not supported in IE8 and earlier
  if(this.data==k)
    option.selected=true;
  select.appendChild(option);
  this.dom_values[k]=option;

  var text=document.createTextNode(get_value_string(v));

  option.appendChild(text);
}

form_element_select.prototype.show_element=function() {
  var div=this.parent("form_element_select").show_element.call(this);
  this.get_data();
  this.dom_values={};

  var cls="form_orig";
  // TODO: check for changed data

  var select=document.createElement("select");
  select.className=cls;
  select.id=this.id;
  select.name=this.options.var_name;
  select.onchange=this.notify_change.bind(this);
  select.onblur=this.notify_change.bind(this);
  div.appendChild(select);

  this.dom_element=select;

  this.div_desc=document.createElement("div");
  this.div_desc.className="description";
  div.appendChild(this.div_desc);

  this.update_options();

  return div;
}

form_element_select.prototype.update_options=function() {
  while(this.dom_element.firstChild)
    this.dom_element.removeChild(this.dom_element.firstChild);

  var values=this.get_values();

  var placeholder;
  if('placeholder' in this.def)
    if(typeof this.def.placeholder == 'object')
      placeholder = lang(this.def.placeholder);
    else
      placeholder = this.def.placeholder;
  else
    placeholder = lang('form_element:please_select');

  this.show_element_option(this.dom_element, "", placeholder);
  for(var k in values) {
    this.show_element_option(this.dom_element, k, values[k]);
  }
}

form_element_select.prototype.refresh=function(force) {
  this.parent("form_element_select").refresh.call(this, force);

  if(!this.dom_element)
    return;

  if(this.is_modified())
    cls="form_modified";
  else
    cls="form_orig";

  if('div_desc' in this) {
    this.div_desc.innerHTML="";

    var old_values = this.values;
    this.values = this.get_values();

    if(!array_compare(this.values, old_values))
      this.update_options();

    for(var k in this.values)
      if(this.data == k) {
	var desc = get_value_string(this.values[k], 'desc');

	if(desc)
	  this.div_desc.innerHTML = desc;
      }
  }

  this.dom_element.className=cls;
}
