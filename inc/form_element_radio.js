form_element_radio.inherits_from(form_element);
function form_element_radio() {
}

form_element_radio.prototype.init=function(id, def, options, form_parent) {
  this.parent.init.call(this, id, def, options, form_parent);

  this.data=null;
}

form_element_radio.prototype.connect=function(dom_parent) {
  this.parent.connect.call(this, dom_parent);

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
  this.parent.set_data.call(this, data);

  if(!this.dom_values)
    return;

  for(var k in this.dom_values) {
    if(this.data==k)
      this.dom_values[k].checked=true;
  }
}

form_element_radio.prototype.show_element=function() {
  var div=this.parent.show_element.call(this);
  this.get_data();
  this.dom_values={};

  for(var k in this.def.values) {
    var id=this.id+"-"+k;

    var cls="form_orig";
    // TODO: check for changed data

    var span=document.createElement("span");
    span.className=cls;
    div.appendChild(span);

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
    var text=document.createTextNode(this.def.values[k]);
    label.appendChild(text);
    span.appendChild(label);

    var br=document.createElement("br");
    div.appendChild(br);
  }

  return div;
}

form_element_radio.prototype.notify_change=function() {
  this.check_modified();
}

form_element_radio.prototype.check_modified=function() {
  this.parent.check_modified.call(this);

  this.data=this.get_data();

  for(var k in this.def.values) {
    var cls="form_orig";

    if(this.orig_data&&
       (this.data!=this.orig_data)&&
       ((k==this.data)||(k==this.orig_data)))
      cls="form_modified";

    this.dom_values[k].parentNode.className=cls;
  }
}
