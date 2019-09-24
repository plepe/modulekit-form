form_element_label.inherits_from(form_element);
function form_element_label() {
}

form_element_label.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_label").init.call(this, id, def, options, form_parent);
}

form_element_label.prototype.show_element=function() {
  var div=this.parent("form_element_label").show_element.call(this);

  this.dom_element1=document.createElement("input");
  this.dom_element1.type="hidden";
  if (this.options.var_name) {
    this.dom_element1.name=this.options.var_name;
  }
  if(this.data)
    this.dom_element1.value=this.data;

  div.appendChild(this.dom_element1);

  this.dom_element2=document.createElement("div");
  this.dom_element2.className="form_element_label";

  this.dom_element2.appendChild(document.createTextNode(this.data));

  div.appendChild(this.dom_element2);

  return div;
}

form_element_label.prototype.connect=function(dom_parent) {
  this.parent("form_element_label").connect.call(this, dom_parent);

  this.dom_element1=this.dom_parent.getElementsByTagName("input")[0];
  this.dom_element2=this.dom_parent.getElementsByTagName("div")[0];
}

form_element_label.prototype.set_data=function(data) {
  var div=this.parent("form_element_label").set_data.call(this, data);

  if(this.dom_element1) {
    this.dom_element1.value = this.data
  }

  if(this.dom_element2) {
    while(this.dom_element2.firstChild)
      this.dom_element2.removeChild(this.dom_element2.firstChild);

    this.dom_element2.appendChild(document.createTextNode(this.data));
  }
}

form_element_label.prototype.get_data=function(data) {
  if(!this.dom_element1)
    return null;

  return this.dom_element1.value;
}
