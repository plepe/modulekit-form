form_element_select.inherits_from(form_element);
function form_element_select() {
}

form_element_select.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_select").init.call(this, id, def, options, form_parent);

  this.data=null;
}

form_element_select.prototype.connect=function(dom_parent) {
  this.parent("form_element_select").connect.call(this, dom_parent);

  this.dom_element=this.dom_parent.firstChild;
  this.dom_element.onchange=this.notify_change.bind(this);

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

  return this.dom_element.value;
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
  div.appendChild(select);

  this.dom_element=select;

  for(var k in this.def.values) {
    var option=document.createElement("option");
    option.value=k;
    // TODO: indexOf not supported in IE8 and earlier
    if(this.data==k)
      option.selected=true;
    select.appendChild(option);
    this.dom_values[k]=option;

    var text=document.createTextNode(this.def.values[k]);
    option.appendChild(text);
  }

  return div;
}

form_element_select.prototype.refresh=function() {
  this.parent("form_element_select").refresh.call(this);

  if(!this.dom_element)
    return;

  if(this.is_modified())
    cls="form_modified";
  else
    cls="form_orig";

  this.dom_element.className=cls;
}
