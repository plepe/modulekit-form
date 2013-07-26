form_element_textarea.inherits_from(form_element_text);
function form_element_textarea() {
}

form_element_textarea.prototype.connect=function(dom_parent) {
  this.tr=document.getElementById("tr-"+this.id);

  this.dom_element=dom_parent.getElementsByTagName("textarea")[0];

  this.dom_element.onblur=this.notify_change.bind(this);

  this.set_data(this.get_data());
}

form_element_textarea.prototype.create_element=function() {
  var input=document.createElement("textarea");

  return input;
}
