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

form_element_numeric.prototype.errors=function(list) {
  var data=this.parent("form_element_numeric").errors.call(this, list);

  if((this.data===null)||(this.data===""))
    return;

  var regexp=null;
  switch(this.def.type) {
    case 'integer':
      regexp=/^\s*[-+]?[0-9]+\s*$/;
      break;
    case 'float':
    case 'numeric':
      regexp=/^\s*[-+]?[0-9]*(\.[0-9]+)?([Ee][+-][0-9]+)?\s*$/;
      break;
    default:
  }

  if(!this.data.match(regexp)) {
    list.push(this.path_name()+": Wert ungültig.");
  }
}
