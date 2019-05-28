form_element_color.inherits_from(require('./form_element_text'));
function form_element_color() {
}

form_element_color.prototype.create_element=function() {
  var input=document.createElement("input");
  input.type="color";

  return input;
}

module.exports = form_element_color
