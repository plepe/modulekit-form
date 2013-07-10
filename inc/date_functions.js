function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

// accepts date as read from date_parse_from_format
function date_format(format, date) {
  if(typeof date.getTime!="undefined") {
    date={
      'year': date.getFullYear(),
      'month': date.getMonth()+1,
      'day': date.getDate(),
      'hour': date.getHours(),
      'minute': date.getMinutes(),
      'second': date.getSeconds(),
      'timezone': date.getTimezoneOffset()
    };
  }

  var value_format={
    'Y': function(v) { return pad(v.year, 4); },
    'y': function(v) { return pad(v.year%100, 2); },
    'm': function(v) { return pad(v.month, 2); },
    'n': function(v) { return parseInt(v.month); },
    'd': function(v) { return pad(v.day, 2); },
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

  var ret={};
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
