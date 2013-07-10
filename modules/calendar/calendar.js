var calendars=[];

// options:
//   element: dom node after which calendar should be shown
//   date:    current date; will be highlighted
//   callback: JS function which will be called when a date is chosen; will be
//     passed RFC 3339 date
//   close_callback: JS function which will be called when calendar is being
//     closed; will be passed chosen date (if it has been selected) in RFC
//     3339 format
//   type: date, datetime or datetime-local (default: chosen from format of
//     'date' parameter)

var calendar_types={
  'date': "Y-m-d",
  'datetime-local': "Y-m-d\\TH:i:s",
  'datetime': "Y-m-d\\TH:i:sP"
};

function range(start, end, step) {
  var ret=[];

  if(!step)
    step=1;

  for(var i=start; i<=end; i+=step) {
    ret.push(i);
  }

  return ret;
}

function calendar(options) {
  this.options=options;

  this.div=document.createElement("div");
  this.div.className="calendar";

  var div_header=document.createElement("div");
  this.div.appendChild(div_header);

  var input_month_prev=document.createElement("button");
  input_month_prev.innerHTML="<";
  input_month_prev.onclick=this.nav_month.bind(this, -1);
  div_header.appendChild(input_month_prev);

  this.div_year_month=document.createElement("span");
  this.div_year_month.className="year_month";
  div_header.appendChild(this.div_year_month);

  var input_month_next=document.createElement("button");
  input_month_next.innerHTML=">";
  input_month_next.onclick=this.nav_month.bind(this, +1);
  div_header.appendChild(input_month_next);

  this.div_days=document.createElement("div");
  this.div.appendChild(this.div_days);

  if((this.options.type=="datetime")||(this.options.type=="datetime-local")) {
    this.div_time=document.createElement("div");
    this.div.appendChild(this.div_time);

    this.time_form=new form(null, {
      'hour': {
	'name': "Hour",
	'type': "select",
        'values': range(0, 23)
      },
      'minute': {
	'name': "Minute",
	'type': "select",
        'values': range(0, 59, 5)
      }
    });
    this.time_form.show(this.div_time);

    this.time_form.onchange=this.form_change.bind(this);
  }

  if(this.options.date)
    this.set_date(this.options.date)
  else
    this.set_date(date_format(calendar_types[this.options.type], new Date()));

  this.options.element.parentNode.appendChild(this.div);

  this.age=new Date().getTime();
  calendars.push(this);

  if(window.addEventListener) {
    this.div.addEventListener('click', this.avoid_close.bind(this));
  }
  else {
    this.div.attachEvent('onclick', this.avoid_close.bind(this));
  }
}

calendar.prototype.avoid_close=function(event) {
  event.stopPropagation();
}

calendar.prototype.get_date=function() {
  return date_format(calendar_types[this.options.type], this.date, this.options.timezone);
}

calendar.prototype.set_date=function(date) {
  this.options.timezone=0;

  if(!this.options.type)
    for(var k in calendar_types) {
      var d;
      if(d=date_parse_from_format(calendar_types[k], this.options.date)) {
	this.options.type=k;
	this.options.timezone=(typeof d.timezone=="undefined"?0:d.timezone);
      }
    }

  // load 'date' from options
  this.date=new Date(date);
  // let's ignore timezone offset
  var tz_offset=this.date.getTimezoneOffset()*60;
  this.date=new Date(this.date.getTime()+(tz_offset+this.options.timezone)*1000);

  this.show_date=new Date(this.date);
  this.show_date.setDate(1);

  if(this.time_form)
    this.time_form.set_data({
      'hour': this.date.getHours(),
      'minute': this.date.getMinutes()
    });

  this.fill();
}

calendar.prototype.close=function() {
  if((new Date().getTime()-this.age)<100)
    return false;

  var p=null;
  for(var i=0; i<calendars.length; i++) {
    if(calendars[i]===this)
      p=i;
  }

  if(p!==null)
    calendars=calendars.slice(0, p).concat(calendars.slice(p+1));

  this.div.parentNode.removeChild(this.div);

  if(this.options.close_callback) {
    this.options.close_callback(this.get_date())
  }

  return true;
}

calendar.prototype.fill=function() {
  var table=document.createElement("table");

  // remove old table
  var current=this.div_days.firstChild;
  while(current) {
    var n=current.nextSibling;
    current.parentNode.removeChild(current);
    current=n;
  }

  var curr_day=new Date(this.show_date.getTime()-
                        (this.show_date.getDay()-1)*86400000);

  for(var week=0; week<6; week++) {
    var tr=document.createElement("tr");
    table.appendChild(tr);

    for(var weekday=0; weekday<7; weekday++) {
      var td=document.createElement("td");
      tr.appendChild(td);

      td.innerHTML=curr_day.getDate();
      td.onclick=this.choose_date.bind(this, curr_day);

      if(date_format("Ymd", curr_day)==date_format("Ymd", this.date))
        td.className="chosen_date";
      if(curr_day.getMonth()!=this.show_date.getMonth())
	td.className="wrong_month";

      curr_day=new Date(curr_day.getTime()+86400000);
    }
  }

  // show new table
  this.div_year_month.innerHTML=lang("date:month:"+(this.show_date.getMonth()+1))+" "+this.show_date.getFullYear();
  this.div_days.appendChild(table);
}

calendar.prototype.nav_month=function(offset) {
  var m=this.show_date.getMonth()+offset;

  while(m<0) {
    m+=12;
    this.show_date.setFullYear(this.show_date.getFullYear()-1);
  }
  while(m>11) {
    m-=12;
    this.show_date.setFullYear(this.show_date.getFullYear()+1);
  }

  this.show_date.setMonth(m);

  this.fill();
}

calendar.prototype.choose_date=function(day) {
  this.date=day;
  this.show_date=new Date(day);
  this.show_date.setDate(1);

  this.fill();

  this.options.callback(this.get_date());
}

calendar.prototype.form_change=function() {
  var d=this.time_form.get_data();

  this.date.setHours(d.hour);
  this.date.setMinutes(d.minute);

  this.options.callback(this.get_date());
}

function calendars_cleanup() {
  for(var i=0; i<calendars.length; i++) {
    var r=calendars[i].close();

    if(i===true)
      i--;
  }
}

if(window.addEventListener) {
  document.addEventListener('click', calendars_cleanup);
}
else {
  document.attachEvent('onclick', calendars_cleanup);
}
