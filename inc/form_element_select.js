form_element_select.inherits_from(form_element);
function form_element_select() {
}

form_element_select.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_select").init.call(this, id, def, options, form_parent);

  if(!('null_value' in this.def))
    this.def.null_value = '';
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

  if (this.data) {
    this.set_data(this.data)
  }
}

form_element_select.prototype.get_data=function() {
  if(!this.dom_element)
    return this.data;

  if (this.def.other && this.dom_element.selectedOptions.length && this.dom_element.selectedOptions[0] === this.other_option) {
    return this.other_form.get_data()
  }

  var data = this.dom_element.value;

  if((data===this.def.null_value)||(data===null)) {
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
    if(this.data==k) {
      this.dom_values[k].setAttribute('selected', 'selected');
      return
    }
  }

  if (this.def.other) {
    this.other_option.setAttribute('selected', 'selected')
    this.other_form.set_data(data)
  }
}

form_element_select.prototype.show_element_option=function(select, k, v) {
  var option=document.createElement("option");
  option.value=k;
  // TODO: indexOf not supported in IE8 and earlier
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
  if (this.data) {
    this.set_data(this.data)
  }

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

  this.show_element_option(this.dom_element, this.def.null_value, placeholder);
  for(var k in values) {
    this.show_element_option(this.dom_element, k, values[k]);
  }

  if (this.def.other) {
    this.other_option = document.createElement('option')
    this.other_option.appendChild(document.createTextNode(this.def['button:other'] || 'Other'))

    this.dom_element.appendChild(this.other_option)

    var other_options = new clone(this.options)
    other_options.var_name = this.options.var_name + '[other]'
    this.other_form = form_create_element(this.id + '_other', this.def.other_def, other_options, this)

    this.other_dom = document.createElement('div')
    var d = this.other_form.show_element()
    this.dom.appendChild(d)
  }
}

form_element_select.prototype.refresh=function(force) {
  this.parent("form_element_select").refresh.call(this, force);

  if(!this.dom_element)
    return;

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

  if(this.is_modified())
    cls="form_modified";
  else
    cls="form_orig";

  this.dom_element.className=cls;
}
