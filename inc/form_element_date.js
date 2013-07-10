form_element_type_alias['date']='date';
form_element_type_alias['datetime']='date';
form_element_type_alias['datetime-local']='date';

var form_element_date_display_format={
  'date': "j.n.Y",
  'datetime': "j.n.Y G:i:s P",
  'datetime-local': "j.n.Y G:i:s"
};
var form_element_date_value_format={
  'date': "Y-m-d",
  'datetime': "Y-m-d\\TH:i:sP",
  'datetime-local': "Y-m-d\\TH:i:s"
};

form_element_date.inherits_from(form_element_text);
function form_element_date() {
}

form_element_date.prototype.date_format=function() {
  if(this.def.format)
    return this.def.format;

  return form_element_date_display_format[this.type()];
}

form_element_date.prototype.create_element=function() {
  var input=document.createElement("input");
  input.type="text";

  input.onfocus=function() {
    if(typeof this.calendar=="undefined")
      this.calendar=new calendar({
	element:  this.dom_element,
	date:	  this.get_data(),
	callback: this.set_data.bind(this),
	close_callback: function() {
	  delete(this.calendar);
	}.bind(this)
      });
  }.bind(this);

  return input;
}

form_element_date.prototype.get_data=function() {
  var data=this.parent("form_element_date").get_data.call(this);

  if(data===null)
    return null;

  data=date_parse_from_format(form_element_date_display_format[this.type()], data);
  if(data)
    data=date_format(form_element_date_value_format[this.type()], data);

  return data;
}

form_element_date.prototype.set_data=function(data) {
  var d="";

  if(data!==null) {
    d=date_parse_from_format(form_element_date_value_format[this.type()], data);
    if(d)
      d=date_format(form_element_date_display_format[this.type()], d);
  }

  this.parent("form_element_date").set_data.call(this, d);
}
