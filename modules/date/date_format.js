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
    // Year
    'Y': function(v) { return pad(v.year, 4); },
    'y': function(v) { return pad(v.year%100, 2); },
    // Month
    'm': function(v) { return pad(v.month, 2); },
    'n': function(v) { return parseInt(v.month); },
    'F': function(v) { return lang("date:month:"+parseInt(v.month)); },
    'M': function(v) { return lang("date:month_short:"+parseInt(v.month)); },
    // Day
    'd': function(v) { return pad(v.day, 2); },
    'D': function(v) { return lang("date:weekday_short:"+date_to_jsdate(v).getDay()); },
    'l': function(v) { return lang("date:weekday:"+date_to_jsdate(v).getDay()); },
    'w': function(v) { return date_to_jsdate(v).getDay(); },
    'N': function(v) { v1=date_to_jsdate(v).getDay(); return (v1==0?1:v1); },
    'j': function(v) { return parseInt(v.day); },
    // Hour
    'H': function(v) { return pad(v.hour, 2); },
    'h': function(v) { return pad(v.hour%12==0?12:v.hour%12, 2); },
    'G': function(v) { return v.hour; },
    'g': function(v) { return v.hour%12==0?12:v.hour%12; },
    // Minute
    'i': function(v) { return pad(v.minute, 2); },
    's': function(v) { return pad(v.second, 2); },
    // Timezone
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
    'Z': function(v) { return v.timezone; },
    // Day Period (AM/PM)
    'a': function(v) { return v.hour<12?"am":"pm"; },
    'A': function(v) { return v.hour<12?"AM":"PM"; },
    // Full Date/Time
    'c': function(v) { return date_format("Y-m-d\TH:i:sP", v); }
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
