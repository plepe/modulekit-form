form_element_json.inherits_from(form_element_textarea);
function form_element_json() {
  this._errors=[];
}

form_element_json.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_json").init.call(this, id, def, options, form_parent);
}

form_element_json.prototype.connect=function(dom_parent) {
  var ret = this.parent("form_element_json").connect.call(this, dom_parent);

  if(this.dom_element)
    this.dom_element.onblur=this.notify_change.bind(this);

  return ret;
}

form_element_json.prototype.show_element=function() {
  var div=this.parent("form_element_json").show_element.call(this);

  if(this.data)
    this.dom_element.value=this.data;

  return div;
}

form_element_json.prototype.set_data=function(data) {
  this.parent("form_element_json").set_data.call(this, json_readable_encode(data));
}

form_element_json.prototype.get_data=function() {
  var data;

  if(this.dom_element) {
    if(!this.dom_element.value)
      return null;

    data=this.dom_element.value;
  }

  this._errors=[];

  try {
    data=JSON.parse(data);
  }
  catch(err) {
    data=null;
    this._errors.push(err.message);
  }

  return data;
}

form_element_json.prototype.errors = function(list) {
  try {
    JSON.parse(this.dom_element.value)
  }
  catch (err) {
    list.push(err.message)
  }

  this.parent("form_element_json").errors.call(this, list);
}

form_element_json.prototype.is_modified=function() {
  return JSON.stringify(this.get_data())!==JSON.stringify(this.get_orig_data());
}
