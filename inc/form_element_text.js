const { lang } = require('modulekit-lang')
const { array_compare, get_value_string, in_array } = require('./functions')

form_element_text.inherits_from(require('./form_element'));
function form_element_text() {
}

form_element_text.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_text").init.call(this, id, def, options, form_parent);
}

form_element_text.prototype.connect=function(dom_parent) {
  this.parent("form_element_text").connect.call(this, dom_parent);

  if(!this.dom_element)
    this.dom_element=this.dom_parent.getElementsByTagName("input")[0];

  if (this.def.change_on === 'keyup' || this.options.change_on_input) {
    this.dom_element.addEventListener('input', this.notify_change.bind(this))
  } else {
    this.dom_element.onblur = this.notify_change.bind(this)
  }
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
  if (this.options.var_name) {
    input.name=this.options.var_name;
  }
  if(this.data)
    input.value=this.data;
  div.appendChild(input);
  this.dom_element=input;
  if (this.def.change_on === 'keyup' || this.options.change_on_input) {
    this.dom_element.addEventListener('input', this.notify_change.bind(this))
  } else {
    this.dom_element.onblur = this.notify_change.bind(this)
  }

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
    option.setAttribute("value", get_value_string(values[k]));
    this.datalist.appendChild(option);

    var text=document.createTextNode(get_value_string(values[k]));
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

form_element_text.prototype.focus = function () {
  this.dom_element.focus()
}

form_element_text.prototype.set_data=function(data) {
  this.parent("form_element_text").set_data.call(this, data);

  if(this.dom_element)
    this.dom_element.value=this.data;
}

form_element_text.prototype.refresh=function(force) {
  var cls;

  this.parent("form_element_text").refresh.call(this, force);

  if(!this.dom_element)
    return;

  var old_values = this.values;
  this.values = this.get_values();

  if(!array_compare(this.values, old_values))
    this.update_options();

  if(this.is_modified())
    cls="form_modified";
  else
    cls="form_orig";

  this.dom_element.className=cls;
}

form_element_text.prototype.check_regexp=function(list, param) {
  if(param.length<1)
    return;

  var data = this.get_data();

  if(data === null)
    return;

  if(!data.match(param[0])) {
    if(param.length<2)
      list.push(lang('form:invalid_value'));
    else
      list.push(param[1]);
  }
}

form_element_text.prototype.check_not_regexp=function(list, param) {
  if(param.length<1)
    return;

  var data = this.get_data();

  if(data === null)
    return;

  if(data.match(param[0])) {
    if(param.length<2)
      list.push(lang('form:invalid_value'));
    else
      list.push(param[1]);
  }
}

form_element_text.prototype.errors=function(list) {
  this.parent("form_element_text").errors.call(this, list);

  if((this.data!="")&&(this.data!=null)) {
    if(this.def.force_values) {
      var values = this.get_values();

      if((!values) || (!in_array(this.data, values)))
        list.push(lang('form:invalid_value'));
    }

    if(this.def.max_length) {
      if(this.data.length > this.def.max_length)
        list.push(lang('form:max_length_exceeded', 0, this.def.max_length));
    }

    // TODO: this assumes that UTF-8 is being used!
    if(this.def.max_bytes) {
console.log(this.data, lengthInUtf8Bytes(this.data));
      if(lengthInUtf8Bytes(this.data) > this.def.max_bytes)
        list.push(lang('form:max_bytes_exceeded', 0, this.def.max_bytes));
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

module.exports = form_element_text
