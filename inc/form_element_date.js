form_element_type_alias['date']='date';
form_element_type_alias['datetime']='date';
form_element_type_alias['datetime-local']='date';

form_element_date.inherits_from(form_element_text);
function form_element_date() {
}

form_element_date.prototype.create_element=function() {
  var input=document.createElement("input");
  input.type=this.def.type;

  return input;
}
