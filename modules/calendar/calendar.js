var calendars=[];

// options:
//   element: dom node after which calendar should be shown
//   date:    current date; will be highlighted
//   callback: JS function which will be called when a date is chosen; will be
//     passed RFC 3339 date
//   close_callback: JS function which will be called when calendar is being
//     closed; will be passed chosen date (if it has been selected) in RFC
//     3339 format

function calendar(options) {
  this.options=options;

  this.date=new Date(this.options.date);
  this.show_date=new Date(this.options.date);
  this.show_date.setDate(1);

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

  this.fill();

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
    this.options.close_callback(date_format("Y-m-d", this.date));
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

  this.options.callback(date_format("Y-m-d", day));
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
