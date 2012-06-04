form_element_checkbox.inherits_from(form_element);
function form_element_checkbox() {
}

form_element_checkbox.prototype.init=function(id, def, options, form_parent) {
  this.parent.init.call(this, id, def, options, form_parent);
  this.data=[];
  this.dom_values=null;
}

form_element_checkbox.prototype.connect=function(dom_parent) {
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

form_element_checkbox.prototype.get_data=function() {
  if(!this.dom_values)
    return this.data;

  this.data=[];

  for(var i in this.dom_values) {
    if(this.dom_values[i].checked)
      this.data.push(i);
  }

  if(!this.data.length)
    return null;

  return this.data;
}

form_element_checkbox.prototype.set_data=function(data) {
  this.parent.set_data.call(this, data);

  if(!this.dom_values)
    return;

  for(var k in this.dom_values) {
    this.dom_values[k].checked=false;
  }

  if(!this.data)
    return;

  for(var i=0; i<this.data.length; i++) {
    var k=this.data[i];
    this.dom_values[k].checked=true;
  }
}

form_element_checkbox.prototype.show_element=function() {
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
    input.type="checkbox";
    input.id=id;
    input.name=this.options.var_name+"[]";
    input.value=k;
    // TODO: indexOf not supported in IE8 and earlier
    if(this.data.indexOf(k)!=-1)
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

form_element_checkbox.prototype.notify_change=function() {
  this.check_modified();
}

form_element_checkbox.prototype.check_modified=function() {
  this.parent.check_modified.call();

  this.data=this.get_data();

  for(var k in this.def.values) {
    var cls="form_orig";

    if(this.orig_data&&
       (this.data!=this.orig_data)&&
       (in_array(k, this.orig_data)!=in_array(k, this.data)))
      cls="form_modified";

    this.dom_values[k].parentNode.className=cls;
  }
}
