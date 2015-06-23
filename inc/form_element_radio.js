form_element_radio.inherits_from(form_element);
function form_element_radio() {
}

form_element_radio.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_radio").init.call(this, id, def, options, form_parent);
}

form_element_radio.prototype.connect=function(dom_parent) {
  this.parent("form_element_radio").connect.call(this, dom_parent);

  var current=this.dom_parent.firstChild;
  this.dom_values={};
  while(current) {
    if(current.nodeName=="SPAN") {
      var dom=current.firstChild;
      this.dom_values[dom.value]=dom;

      dom.onchange=this.notify_change.bind(this);
    }

    current=current.nextSibling;
  }
}

form_element_radio.prototype.get_data=function() {
  if(!this.dom_values)
    return this.data;

  for(var i in this.dom_values) {
    this.data=null;

    if(this.dom_values[i].checked)
      return this.data=i;
  }

  return null;
}

form_element_radio.prototype.set_data=function(data) {
  this.parent("form_element_radio").set_data.call(this, data);

  if(!this.dom_values)
    return;

  for(var k in this.dom_values) {
    if(this.data==k)
      this.dom_values[k].checked=true;
  }
}

form_element_radio.prototype.show_element=function() {
  var div=this.parent("form_element_radio").show_element.call(this);
  this.get_data();

  this.update_options();

  return div;
}

form_element_radio.prototype.update_options = function() {
  while(this.dom.firstChild)
    this.dom.removeChild(this.dom.firstChild);

  this.dom_values={};
  var values=this.get_values();

  for(var k in values) {
    var id=this.id+"-"+k;

    var cls="form_orig";
    // TODO: check for changed data

    var span=document.createElement("span");
    span.className=cls;
    this.dom.appendChild(span);

    var input=document.createElement("input");
    input.type="radio";
    input.id=id;
    input.name=this.options.var_name;
    input.value=k;
    // TODO: indexOf not supported in IE8 and earlier
    if(this.data==k)
      input.checked=true;
    span.appendChild(input);
    this.dom_values[k]=input;

    input.onchange=this.notify_change.bind(this);

    var label=document.createElement("label");
    label.setAttribute("for", id);
    var text=document.createTextNode(get_value_string(values[k]));
    label.appendChild(text);
    span.appendChild(label);
  }
}

form_element_radio.prototype.refresh=function(force) {
  this.parent("form_element_radio").refresh.call(this, force);

  if(!this.dom_values)
    return;

  var old_values = this.values;
  this.values = this.get_values();

  if(!array_compare(this.values, old_values))
    this.update_options();

  for(var k in this.values) {
    var cls="form_orig";

    if(this.is_modified())
      cls="form_modified";

    if(this.dom_values[k])
      this.dom_values[k].parentNode.className=cls;
  }
}
