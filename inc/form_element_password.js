form_element_password.inherits_from(form_element_text);
function form_element_password() {
}

form_element_password.prototype.create_element=function() {
  var input=document.createElement("input");
  input.type="password";

  return input;
}
