form_element_unsupported.inherits_from(form_element_json);
function form_element_unsupported() {
}

form_element_unsupported.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_unsupported").init.call(this, id, def, options, form_parent);
}

form_element_unsupported.prototype.create_element=function() {
  var input=document.createElement("textarea");
  input.setAttribute("style", "display: none;");

  return input;
}

form_element_unsupported.prototype.show_element=function() {
  var div=this.parent("form_element_unsupported").show_element.call(this);

  var warning=document.createElement("div");
  warning.className="warning";
  warning.appendChild(document.createTextNode(
    lang('form:not_supported', 0, this.def.type)));

  div.appendChild(warning);

  return div;
}
