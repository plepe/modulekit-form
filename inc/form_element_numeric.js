form_element_type_alias['integer']='numeric';
form_element_type_alias['float']='numeric';

form_element_numeric.inherits_from(form_element_text);
function form_element_numeric() {
}

form_element_numeric.prototype.get_data=function() {
  var data=this.parent("form_element_numeric").get_data.call(this);

  if((data===null)||(data===""))
    return null;

  switch(this.def.type) {
    case 'integer':
      return parseInt(this.data);
    default:
      return parseFloat(this.data);
  }
}

form_element_numeric.prototype.get_orig_data=function() {
  var data=this.parent("form_element_numeric").get_orig_data.call(this);

  if((data===null)||(data===""))
    return null;

  switch(this.def.type) {
    case 'integer':
      return parseInt(data);
    default:
      return parseFloat(data);
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
      regexp=/^\s*[\-+]?[0-9]+\s*$/;
      break;
    case 'float':
    case 'numeric':
      regexp=/^\s*[\-+]?[0-9]*(\.[0-9]+)?([Ee][+-][0-9]+)?\s*$/;
      break;
    default:
  }

  if(!this.data.match(regexp)) {
    list.push(lang('form:invalid_value'));
  }
}

form_element_numeric.prototype.check_ge=function(list, param) {
  if(this.get_data() === null)
    return;

  if(this.get_data() < param[0]) {
    if(param.length<2)
      list.push(lang('form:check_ge_failed', 0, param[0]));
    else
      list.push(param[1]);
  }
}

form_element_numeric.prototype.check_le=function(list, param) {
  if(this.get_data() === null)
    return;

  if(this.get_data() > param[0]) {
    if(param.length<2)
      list.push(lang('form:check_le_failed', 0, param[0]));
    else
      list.push(param[1]);
  }
}

form_element_numeric.prototype.check_gt=function(list, param) {
  if(this.get_data() === null)
    return;

  if(this.get_data() <= param[0]) {
    if(param.length<2)
      list.push(lang('form:check_gt_failed', 0, param[0]));
    else
      list.push(param[1]);
  }
}

form_element_numeric.prototype.check_lt=function(list, param) {
  if(this.get_data() === null)
    return;

  if(this.get_data() >= param[0]) {
    if(param.length<2)
      list.push(lang('form:check_lt_failed', 0, param[0]));
    else
      list.push(param[1]);
  }
}
