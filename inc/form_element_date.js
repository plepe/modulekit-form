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
var form_element_date_calender_format={
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

form_element_date.prototype.value_format=function() {
  if(this.def.value_format)
    return this.def.value_format;

  return form_element_date_value_format[this.type()];
}

form_element_date.prototype.create_element=function() {
  var input=document.createElement("input");
  input.type="text";

  this.activate_calendar(input);

  return input;
}

form_element_date.prototype.connect=function(dom_parent) {
  this.parent("form_element_date").connect.call(this, dom_parent);

  this.activate_calendar(this.dom_element);
}

form_element_date.prototype.activate_calendar=function(input) {
  input.onfocus=function() {
    if(typeof this.calendar=="undefined")
      this.calendar=new calendar({
	element:  this.dom_element,
	date:	  this.get_data(form_element_date_calender_format[this.type()]),
	callback: this.set_data_from_calendar.bind(this),
	type:	  this.type(),
	close_callback: function() {
	  delete(this.calendar);
	}.bind(this)
      });
  }.bind(this);
}

form_element_date.prototype.get_data=function(format) {
  var data=this.parent("form_element_date").get_data.call(this);

  if(data===null)
    return null;

  if(!format)
    format=this.value_format();

  data=date_parse_from_format(this.date_format(), data, { 'sloppy': true });
  if(data)
    data=date_format(format, data);

  return data;
}

form_element_date.prototype.set_data=function(data, format) {
  var d="";

  if(!format)
    format=this.value_format();

  if(data!==null) {
    d=date_parse_from_format(format, data);
    if(d)
      d=date_format(this.date_format(), d);
  }

  this.parent("form_element_date").set_data.call(this, d);
}

form_element_date.prototype.set_data_from_calendar=function(data) {
  this.set_data(data, form_element_date_calender_format[this.type()]);

  this.notify_change();
}

form_element_date.prototype.check_after=function(list, param) {
  for(var i=0; i<param.length; i++) {
    if(typeof param[i]=="string")
      param[i]=this.parse_data(param[i]);
  }

  if(this.get_data()<=param[0])
    list.push(param[1]);
}

form_element_date.prototype.notify_change=function() {
  this.parent("form_element_date").notify_change.call(this);

  if(this.calendar) {
    var data=this.get_data(form_element_date_calender_format[this.type()]);

    if(data)
      this.calendar.set_date(data);
  }
}

form_element_date.prototype.errors=function(list) {
  var data=this.get_data();

  if((this.parent("form_element_date").get_data.call(this) !== null) && (this.get_data() === null))
    list.push(lang('form_element_date:format_error'));
}
