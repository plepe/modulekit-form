form_element_keywords.inherits_from(form_element);
function form_element_keywords() {
}

form_element_keywords.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_keywords").init.call(this, id, def, options, form_parent);
}

form_element_keywords.prototype.connect=function(dom_parent) {
  this.parent("form_element_keywords").connect.call(this, dom_parent);
  this.dom_element=this.dom_parent.getElementsByTagName("input")[0];

  this.dom_element.onchange=this.notify_change.bind(this);

  this.keywords_list=document.createElement("div");
  this.keywords_list.className="keywords";
  this.dom_element.parentNode.appendChild(this.keywords_list);

  this.set_data(this.get_data());
}

form_element_keywords.prototype.create_element=function() {
  var input=document.createElement("input");
  input.type="text";

  return input;
}

form_element_keywords.prototype.show_element=function() {
  var div=this.parent("form_element_keywords").show_element.call(this);

  var cls="form_orig";
  if(this.orig_data&&this.data!=this.orig_data)
    cls="form_modified";
  cls+=" connected";

  var input=this.create_element();
  input.className=cls;
  input.name=this.options.var_name;
  if(this.data)
    input.value=this.data.join(", ");
  div.appendChild(input);
  this.dom_element=input;
  this.dom_element.onchange=this.notify_change.bind(this);

  this.keywords_list=document.createElement("div");
  this.keywords_list.className="keywords";
  this.dom_element.parentNode.appendChild(this.keywords_list);

  return div;
}

form_element_keywords.prototype.set_data=function(data) {
  this.parent("form_element_keywords").set_data.call(this, data);

  if(this.dom_element)
    this.dom_element.value=this.data.join(", ");

  while(this.keywords_list.firstChild)
    this.keywords_list.removeChild(this.keywords_list.firstChild);

  for(var i=0; i<this.data.length; i++) {
    var span=document.createElement("span");
    span.className="keyword";

    var text=document.createTextNode(this.data[i]);
    span.appendChild(text);

    this.keywords_list.appendChild(span);
  }

  this.notify_change();
}

form_element_keywords.prototype.notify_change=function() {
  this.check_modified();

  this.form_parent.notify_change();
}

form_element_keywords.prototype.get_data=function() {
  if(!this.dom_element)
    return this.data;

  this.data=this.dom_element.value;
  this.data=this.data.split(/ *, */);

  return this.data;
}

form_element_keywords.prototype.check_modified=function() {
  var cls;

  this.parent("form_element_keywords").check_modified.call();

  this.get_data();

  if(this.orig_data&&this.data.join(",")!=this.orig_data.join(","))
    cls="form_modified";
  else
    cls="form_orig";
  cls+=" connected";

  this.dom_element.className=cls;
}
