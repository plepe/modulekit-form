form_element_numeric.inherits_from(form_element_text);
function form_element_numeric() {
}

form_element_numeric.prototype.get_data=function() {
  var data=this.parent("form_element_numeric").get_data.call(this);

  if(data=="")
    this.data=null;
  else
    this.data=parseFloat(data);

  return this.data;
}
