form_element_intermediate_text.inherits_from(form_element);
function form_element_intermediate_text() {
}

form_element_intermediate_text.prototype.show=function() {
  this.tr = document.createElement("tr");

  this.td = document.createElement("td");
  this.td.setAttribute("colspan", 2);
  this.td.innerHTML = this.def.text;

  this.tr.appendChild(this.td);

  return this.tr;
}

form_element_intermediate_text.prototype.get_data=function() {
  return null;
}
