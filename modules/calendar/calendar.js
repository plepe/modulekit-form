var calendars=[];

function calendar(element, date, callback) {
  this.date=new Date(date);
  this.show_date=new Date(date);
  this.show_date.setDate(1);
  this.callback=callback;

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

  element.parentNode.appendChild(this.div);

  calendars.push(this);
}

calendar.prototype.close=function() {
  var p=null;
  for(var i=0; i<calendars.length; i++) {
    if(calendars[i]===this)
      p=i;
  }

  if(p!==null)
    calendars=calendars.slice(0, p).concat(calendars.slice(p+1));
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

  this.callback(date_format("Y-m-d", day));
}
