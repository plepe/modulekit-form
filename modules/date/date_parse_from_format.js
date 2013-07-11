function date_parse_from_format(format, date) {
  var value={
    'Y': 'year',
    'y': 'year',
    'm': 'month',
    'n': 'month',
    'd': 'day',
    'j': 'day',
    'H': 'hour',
    'h': 'hour',
    'G': 'hour',
    'g': 'hour',
    'i': 'minute',
    's': 'second',
    'a': 'day_period',
    'A': 'day_period',
    'O': 'timezone',
    'P': 'timezone'
  };

  var regexp={
    'Y': '([0-9]{4})',
    'y': '([0-9]{2})',
    'm': '(1[012]|0[0-9])',
    'n': '(1[012]|[0-9])',
    'd': '(3[01]|[012][0-9])',
    'j': '(3[01]|[12][0-9]|[0-9])',
    'H': '(2[0-3]|[01][0-9])',
    'h': '(2[0-3]|[01][0-9])',
    'G': '(2[0-3]|1[0-9]|[0-9])',
    'g': '(2[0-3]|1[0-9]|[0-9])',
    'i': '([0-5][0-9])',
    's': '(6[01]|[0-5][0-9])',
    'a': '(am|pm)',
    'A': '(AM|PM)',
    'O': '(Z|[+\\-][01][0-9][0-5][0-9])',
    'P': '(Z|[+\\-][01][0-9]:[0-5][0-9])',
    // other characters
    '.': '\\.'
  };

  var fix_format={
    'y': function(v) { v.year=(v.year<70?2000:1900)+parseInt(v.year); },
    'a': function(v) {
	v.hour=(v.hour==12?0:parseInt(v.hour));
	v.hour=(v.day_period=="pm"?v.hour+12:v.hour);
	delete v.day_period;
      },
    'A': function(v) {
	v.hour=(v.hour==12?0:parseInt(v.hour));
	v.hour=(v.day_period=="PM"?v.hour+12:v.hour);
	delete v.day_period;
      },
    'O': function(v) {
	if(v.timezone=="Z")
	  v.timezone=0;
	else {
	  var m=v.timezone.match(/^([+\-])([01][0-9])([0-5][0-9])$/);
	  v.timezone=(m[1]=="+"?1:-1)*(m[2]*3600+m[3]*60);
	}
      },
    'P': function(v) {
	if(v.timezone=="Z")
	  v.timezone=0;
	else {
	  var m=v.timezone.match(/^([+\-])([01][0-9]):([0-5][0-9])$/);
	  v.timezone=(m[1]=="+"?1:-1)*(m[2]*3600+m[3]*60);
	}
      }
  };

  var format_regexp="";
  var esc=false;

  for(var i=0; i<format.length; i++) {
    if(!esc) {
      if(format[i]=="\\")
	esc=true;
      else {
	if(typeof regexp[format[i]]=="undefined")
	  format_regexp+=format[i];
	else
	  format_regexp+=regexp[format[i]];
      }
    }
    else {
      format_regexp+=format[i];
      esc=false;
    }
  }

  var date_array=date.match(format_regexp);
  if(!date_array)
    return null;

  var ret={
    'year':	new Date().getFullYear(),
    'month':	0,
    'day':	0,
    'hour':	0,
    'minute':	0,
    'second':	0,
    'timezone': null
  };
  var pos=1;
  var esc=false;
  for(var i=0; i<format.length; i++) {
    if(!esc) {
      if(format[i]=="\\")
	esc=true;
      else {
	if(typeof value[format[i]]!="undefined") {
	  ret[value[format[i]]]=date_array[pos];
	  pos++;
	}
      }
    }
    else {
      esc=false;
    }
  }

  var esc=false;
  for(var i=0; i<format.length; i++) {
    if(!esc) {
      if(format[i]=="\\")
	esc=true;
      else {
	if(typeof fix_format[format[i]]!="undefined")
	  fix_format[format[i]](ret);
      }
    }
    else {
      esc=false;
    }
  }

  return ret;
}
