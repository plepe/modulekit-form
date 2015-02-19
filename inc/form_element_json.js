form_element_json.inherits_from(form_element_textarea);
function form_element_json() {
  this._errors=[];
}

form_element_json.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_json").init.call(this, id, def, options, form_parent);
}

form_element_json.prototype.connect=function(dom_parent) {
  this.parent("form_element_json").connect.call(this, dom_parent);

  if(this.dom_element) {
    this.dom_element.onblur=this.notify_change.bind(this);

    // update element with formatted value
    try {
      var data = JSON.parse(this.dom_element.value);
      this.dom_element.value = JSON.stringify(data, null, '  ');
    }
    catch(e) {
      // ignore errors in parsing value
    }
  }
}

form_element_json.prototype.create_element=function() {
  var input=document.createElement("textarea");

  return input;
}

form_element_json.prototype.show_element=function() {
  var div=this.parent("form_element_json").show_element.call(this);

  if(this.data)
    this.dom_element.value=this.data;

  return div;
}

form_element_json.prototype.set_data=function(data) {
  this.parent("form_element_json").set_data.call(this, JSON.stringify(data, null, '  '));
}

form_element_json.prototype.get_data=function() {
  var data;

  if(this.dom_element) {
    if(!this.dom_element.value)
      return null;

    this.data=this.dom_element.value;
  }

  this._errors=[];

  try {
    data=JSON.parse(this.data);
  }
  catch(err) {
    data=null;
    this._errors.push(err.message);
  }

  return data;
}

form_element_json.prototype.is_modified=function() {
  return JSON.stringify(this.get_data())!==JSON.stringify(this.get_orig_data());
}
