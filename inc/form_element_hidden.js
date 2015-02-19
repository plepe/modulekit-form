form_element_hidden.inherits_from(form_element_json);
function form_element_hidden() {
}

form_element_hidden.prototype.create_element=function() {
  var input = this.parent("form_element_json").create_element.call(this);
  input.setAttribute("style", "display: none;");

  return input;
}

form_element_hidden.prototype.show=function() {
  var ob = this.show_element();

  return ob;
}
