// accepts date as read from date_parse_from_format
function date_format(format, date, tz) {
  if(typeof tz=="undefined")
    tz=null;

  if(typeof date.getTime!="undefined") {
    date={
      'year': date.getFullYear(),
      'month': date.getMonth()+1,
      'day': date.getDate(),
      'hour': date.getHours(),
      'minute': date.getMinutes(),
      'second': date.getSeconds(),
      'timezone': (tz===null?-date.getTimezoneOffset()*60:tz)
    };
  }

  var value_format={
    'Y': function(v) { return pad(v.year, 4); },
    'y': function(v) { return pad(v.year%100, 2); },
    'm': function(v) { return pad(v.month, 2); },
    'n': function(v) { return parseInt(v.month); },
    'd': function(v) { return pad(v.day, 2); },
    'D': function(v) { return lang("date:weekday_short:"+date_to_jsdate(v).getDay()); },
    'l': function(v) { return lang("date:weekday:"+date_to_jsdate(v).getDay()); },
    'w': function(v) { return date_to_jsdate(v).getDay(); },
    'N': function(v) { v1=date_to_jsdate(v).getDay(); return (v1==0?1:v1); },
    'j': function(v) { return parseInt(v.day); },
    'H': function(v) { return pad(v.hour, 2); },
    'h': function(v) { return pad(v.hour%12==0?12:v.hour%12, 2); },
    'G': function(v) { return v.hour; },
    'g': function(v) { return v.hour%12==0?12:v.hour%12; },
    'i': function(v) { return pad(v.minute, 2); },
    's': function(v) { return pad(v.second, 2); },
    'O': function(v) {
        return (v.timezone<0?"-":"+")+
	  pad(Math.abs(v.timezone)/3600, 2)+
	  pad(Math.abs(v.timezone)/60, 2);
      },
    'P': function(v) {
        return (v.timezone<0?"-":"+")+
	  pad(Math.abs(v.timezone)/3600, 2)+":"+
	  pad(Math.abs(v.timezone)/60%60, 2);
      },
    'a': function(v) { return v.hour<12?"am":"pm"; },
    'A': function(v) { return v.hour<12?"AM":"PM"; }
  };

  var ret="";
  var esc=false;

  for(var i=0; i<format.length; i++) {
    if(!esc) {
      if(format[i]=="\\")
	esc=true;
      else {
	if(typeof value_format[format[i]]=="undefined")
	  ret+=format[i];
	else {
	  ret+=value_format[format[i]](date);
	}
      }
    }
    else {
      ret+=format[i];
      esc=false;
    }
  }

  return ret;
}
