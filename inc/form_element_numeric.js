form_element_type_alias['integer']='numeric';
form_element_type_alias['float']='numeric';

form_element_numeric.inherits_from(form_element_text);
function form_element_numeric() {
}

form_element_numeric.prototype.get_data=function() {
  this.parent("form_element_numeric").get_data.call(this);

  if(this.data=="")
    return null;

  switch(this.def.type) {
    case 'integer':
      return parseInt(this.data);
    default:
      return parseFloat(this.data);
  }
}

form_element_numeric.prototype.set_data=function(data) {
  var d="";
  if(data!==null)
    d=data.toString();

  this.parent("form_element_numeric").set_data.call(this, d);
}
