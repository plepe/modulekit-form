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
    this.div_time.className = 'time';
    this.div.appendChild(this.div_time);

    // Hour input
    this.div_hour = document.createElement('div');
    this.div_time.appendChild(this.div_hour);

    var b = document.createElement('input');
    b.type = 'button';
    b.value = '⋀';
    this.div_hour.appendChild(b);
    b.onclick = function() {
      if(++this.input_hour.value > 23)
        this.input_hour.value = 0;
      this.form_change();
    }.bind(this);

    this.input_hour = document.createElement('input');
    this.div_hour.appendChild(this.input_hour);
    this.input_hour.onchange = this.form_change.bind(this);
    this.input_hour.value = 0;

    var b = document.createElement('input');
    b.type = 'button';
    b.value = '⋁';
    this.div_hour.appendChild(b);
    b.onclick = function() {
      if(--this.input_hour.value < 0)
        this.input_hour.value = 23;
      this.form_change();
    }.bind(this);

    // Minute input
    this.div_minute = document.createElement('div');
    this.div_time.appendChild(this.div_minute);

    var b = document.createElement('input');
    b.type = 'button';
    b.value = '⋀';
    this.div_minute.appendChild(b);
    b.onclick = function() {
      if(++this.input_minute.value > 59)
        this.input_minute.value = 0;
      this.form_change();
    }.bind(this);

    this.input_minute = document.createElement('input');
    this.div_minute.appendChild(this.input_minute);
    this.input_minute.onchange = this.form_change.bind(this);
    this.input_minute.value = 0;

    var b = document.createElement('input');
    b.type = 'button';
    b.value = '⋁';
    this.div_minute.appendChild(b);
    b.onclick = function() {
      if(--this.input_minute.value < 0)
        this.input_minute.value = 59;
      this.form_change();
    }.bind(this);
  }

  if(this.options.date)
    this.set_date(this.options.date)
  else
    this.set_date(date_format(calendar_types[this.options.type], new Date()));

  this.options.element.parentNode.appendChild(this.div);

  this.age=new Date().getTime();

  // close old calendars
  for(var i=0; i<calendars.length; i++)
    calendars[i].close();

  // add current calendar to calendars list
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
  if(!this.options.type) {
    for(var k in calendar_types) {
      var d;
      if(d=date_parse_from_format(calendar_types[k], this.options.date)) {
	this.options.type=k;
	this.options.timezone=(typeof d.timezone=="undefined"?0:d.timezone);
      }
    }
  }
  else if(this.options.type=="datetime-local") {
    this.options.timezone=0;
  }
  else if(this.options.type=="datetime") {
    var d = date_parse_from_format('Y-m-d\\TH:i:sP', this.options.date);
    this.options.timezone = typeof d.timezone == "undefined" ? 0 : d.timezone;
  }

  // load 'date' from options
  this.date=new Date(date);

  this.show_date=new Date(this.date);

  if(this.input_hour) {
    this.input_hour.value = this.date.getHours();
    this.input_minute.value = this.date.getMinutes();
  }

  this.fill();
}

calendar.prototype.check_close=function(ev) {
  if((new Date().getTime()-this.age)<100)
    return false;

  if(ev.target==this.options.element)
    return false;

  return this.close();
}

calendar.prototype.close=function() {
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

  // print weekdays
  var tr=document.createElement("tr");
  table.appendChild(tr);

  for(var i=0; i<7; i++) {
    var td=document.createElement("th");
    tr.appendChild(td);

    td.innerHTML=lang("date:weekday_short:"+((i+1)%7));
  }

  // Calculate first day of month
  var curr_day=new Date(this.show_date);
  curr_day.setDate(1);
  // and now monday before the first
  curr_day=new Date(curr_day.getTime()-
		    (curr_day.getDay()-1)*86400000);

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

  return false;
}

calendar.prototype.choose_date=function(day) {
  this.date=day;
  this.show_date=new Date(day);

  this.fill();

  this.options.callback(this.get_date());
}

calendar.prototype.form_change=function() {
  this.date.setHours(this.input_hour.value);
  this.date.setMinutes(this.input_minute.value);
  this.date.setSeconds(0);

  this.options.callback(this.get_date());
}

function calendars_cleanup(ev) {
  if(typeof event!="undefined")
    ev=event;

  for(var i=0; i<calendars.length; i++) {
    var r=calendars[i].check_close(ev);

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
