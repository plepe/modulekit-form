var form_kal_ob;
var form_on_the_fly;
var form_element_typing_timeout;
var form_element_error_timeout;
var form_last_check;

function name_change(ob, orig, ch) {
  if(ob.name)
    ob.name=ob.name.replace(orig, ch);
  if(ob.id)
    ob.id=ob.id.replace(orig, ch);
  if(ob.value)
    ob.value=ob.value.replace(orig, ch);

  var subob=ob.firstChild;
  while(subob) {
    name_change(subob, orig, ch);
    subob=subob.nextSibling;
  }
}

function form_add_element(id, form_data) {
  ob=document.getElementById("form_mark_"+id);
  obnew=document.createElement("div");
  ob.parentNode.insertBefore(obnew, ob);
  obnew.innerHTML=form_data[0];
  name_change(obnew, "NUM"+id, form_data[1]);

  while(ob=ob.parentNode) {
    if(fid=ob.form_id) {
      name_change(obnew, "NUM"+fid, ob.form_count);
    }
  }

  form_data[1]++;
}

function form_day_choose(date) {
  var fin=true;

  kal=document.getElementById("form_kalender");
  kal.parentNode.removeChild(kal);

  if(form_kal_ob.getAttribute("form_type")=="datetime") {
    if(m=form_kal_ob.value.match(/ ([^ ]+)$/)) {
      date=date_get_human(date+" "+time_get_machine(m[1]), 0, 2);
    }
    else {
      date=date_get_human(date, 0, 1)+" ";
      fin=false;
    }
  }
  else {
    date=date_get_human(date, 0, 3);
  }

  if(fin) {
    // Event onChange im form_kal ausloesen
    //ev=document.createEvent("HTMLEvents");
    //ev.initEvent("change", false, false);
    //form_kal_ob.dispatchEvent(ev);
    form_set_value(form_kal_ob.name, date);
  }
  else {
    form_kal_ob.value=date;
    form_kal_ob.focus();
  }
}

function form_show_cal(varname, with_clock) {
  form_kal_ob=document.getElementById(varname);
  var kal_day=false;
  if(form_kal_ob.value) {
    if(form_kal_ob.getAttribute("form_type")=="datetime")
      kal_day=date_get_array(form_kal_ob.value, 0, 2);
    else
      kal_day=date_get_array(form_kal_ob.value, 0, 1);
    kal_day=date_get_machine(kal_day);
  }

  kal=document.createElement("div");
  document.body.appendChild(kal);
  kal.className="form_kalender";
  kal.id="form_kalender";

  p=get_abs_pos(form_kal_ob);
  kal.style.position="absolute";
  kal.style.left=p[0]+"px";
  kal.style.top=p[1]+form_kal_ob.offsetHeight+"px";
  kal.setAttribute("kal_choose_fun", "form_day_choose");

  if(kal_day) {
    kal.setAttribute("kal_shown_start", kal_day);
    kal.setAttribute("kal_shown_ende", kal_day);
  }
  kal.setAttribute("kal_curr_date", kal_day);

  kal_fill_month("form_kalender");
}

function form_show_cal_clock(varname) {
  form_show_cal(varname, 1);
}

function form_element_typing_pause() {
  if(form_on_the_fly) {
    var x=new Function("return "+form_on_the_fly+"();");
    x();
  }
}

function form_element_typing(ob) {
  clearTimeout(form_element_typing_timeout);
  form_element_typing_timeout=setTimeout("form_element_typing_pause()", 500);
}

function form_element_get_data(ob) {
  var m;

  switch(ob.getAttribute("form_type")) {
    case "person":
      if(m=ob.value.match(/\| ([0-9]*)$/)) {
        return m[1];
      }
      return "invalid";
    case "date":
      return date_get_machine(ob.value, 0, 1);
    case "datetime":
      return date_get_machine(ob.value, 0, 2);
    case "time":
      return time_get_machine(ob.value);
    default:
      return ob.value;
  }

}

function form_register_as_orig(data, varname) {
  var k;

  for(k in data) {
    if(typeof data[k]=="object")
      form_register_as_orig(data[k], varname+"]["+k);
    else {
      var ob=document.getElementsByName("form_orig_data["+varname+"]["+k+"]");
      if(ob.length>0)
	ob[0].value=data[k];
      form_element_set_class(varname+"["+k+"]", "form_modified", "form_orig");
    }
  }
}

function form_element_orig_name(name) {
  var m;

  if(m=name.match(/^([^\[]+)(\[.*)$/))
    return "form_orig_data["+m[1]+"]"+m[2];
}

function form_element_error_focus(ob) {
  var obs=document.getElementsByName(ob);
  ob=obs[0];

  ob.focus();
}

function form_element_error(ob, msg) {
  form_element_set_class(ob, "form_error");
  alert(msg);
  setTimeout("form_element_error_focus(\""+ob.name+"\")", 1);

  return null;
}

function form_element_check_person(xmldata) {
  obs=document.getElementsByName(ajax_read_value(xmldata, "form_name"));
  if(obs.length>0)
    ob=obs[0];
  else
    return;
  form_autocomp_count=xmldata.getElementsByTagName('ac').length;

  if(form_autocomp_count>1) {
    return form_element_error(ob, "Personenangabe nicht eindeutig");
  }
  else if(form_autocomp_count==0) {
    return form_element_error(ob, "Person nicht gefunden");
  }
  else {
    ob.value=xmldata.getElementsByTagName('ac')[0].firstChild.nodeValue;
  }
}

function form_get_compare_ob(ob, name) {
  var match;
  var m;
  var obs;
  var i;

  //match=ob.getAttribute(compare_attr);
  if(!name)
    return;

  // Wenn mehrere Constraints angegeben wurden, dann rekursiv werden
  var l=name.split(/,/);
  if(l.length>1) {
    var ret=new Array;
    for(i=0; i<l.length; i++) {
      var nob=form_get_compare_ob(ob, l[i]);
      var j;

      if(nob)
        for(j=0; j<nob.length; j++)
          ret.push(nob[j]);
    }
    return ret;
  }

  // Nur ein Constraint ... suchen
  if(name) {
    if(name.match(/\[LAST\]/)) {
      var id=ob.name.match(/\[([0-9]+)\]/);
      name=name.replace(/\[LAST\]/, "\["+(id[1]-1)+"\]");
    }

    if(m=name.match(/\[/)) {
      obs=document.getElementsByName(name);
    }
    else {
      m=ob.name.match(/^(.*)\[[^\]]*\]$/);
      obs=document.getElementsByName(m[1]+"["+name+"]");
    }
    if(obs.length>0) {
      return obs;
    }
  }

  return null;
}

function form_get_compare_values(obs) {
  var i;
  var list;

  list=new Array();
  for(i=0; i<obs.length; i++) {
    var t=obs[i].value;
    if(t)
      list.push(t);
  }

  return list;
}

function form_element_check(ob) {
  var val=ob.value;
  var other_ob;
  var other_time;
  var other_name;

  switch(ob.getAttribute("form_type")) {
    case "date":
      other_time="";
      if(other_ob=form_get_compare_ob(ob, ob.getAttribute("form_after"))) {
        other_time=form_get_compare_values(other_ob);
      }
      if((val)&&(!(val=date_get_machine(ob.value, other_time, 1))))
        return form_element_error(ob, "Datumsformat nicht erkannt!");
      break;
    case "datetime":
      other_time="";
      if(other_ob=form_get_compare_ob(ob, ob.getAttribute("form_after"))) {
        other_time=form_get_compare_values(other_ob);
      }
      if((val)&&(!(val=date_get_machine(ob.value, other_time, 2))))
        return form_element_error(ob, "Datumsformat nicht erkannt!");
      break;
    case "time":
      if((val)&&(!(val=time_get_machine(ob.value))))
        return form_element_error(ob, "Zeitformat nicht erkannt!");
      break;
    case "integer":
      if(!(val=ob.value.match(/^\-?[0-9]*$/)))
        return form_element_error(ob, "Bitte eine Ganzzahl angeben!");
      if(ob.value!="")
	val=parseInt(ob.value);
      break;
    case "person":
      if(form_autocomp_blur_state) { // ist true, wenn sich die maus nicht ueberm form_autocomp-dingens befindet
        if(val!="") {
          if(form_last_check!=val) {
            form_last_check=val;
            ajax_start_request("plugin/forms", { "todo": "check_person", "value": val, "form_name": ob.name }, form_element_check_person);
          }
        }
        else {
          form_last_check="";
        }
      }
      break;
    case "text":
    default:
  }

  var match;
  if(match=ob.getAttribute("form_match")) {
    if(!ob.value.match(match)) {
      var err;
      if(err=ob.getAttribute("form_match_error"))
        form_element_error(ob, err);
      else
        form_element_error(ob, "Angabe erfuellt Constraint nicht");
    }
  }

  if(other_ob=form_get_compare_ob(ob, ob.getAttribute("form_before"))) {
    var i;
    other_time=new Array();
    for(i=0; i<other_ob.length; i++) {
      var t;
      if(other_ob[i].getAttribute("form_type")=="datetime")
        t=date_get_machine(other_ob[i].value, 0, 2);
      else
        t=date_get_machine(other_ob[i].value, 0, 1);

      if(t) {
        t=t+","+other_ob[i].getAttribute("form_name");
        other_time.push(t);
      }
    }

    if(other_time.length>0) {
      var m;
      other_time.sort();
      //alert("before: "+other_time);
      m=other_time[0].match(/^([0-9 \-:]*),(.*)$/);
      other_time=m[1];
      other_name=m[2];

      switch(ob.getAttribute("form_type")) {
        case "date":
          if(date_is_after(val, other_time))
            return form_element_error(ob, "Datum muss vor "+
               other_name+" liegen.");
          break;
        case "datetime":
          if(date_is_after(val, other_time))
            return form_element_error(ob, "Datum muss vor "+
               other_name+" liegen.");
          break;
      }
    }
  }

  if(other_ob=form_get_compare_ob(ob, ob.getAttribute("form_after"))) {
    var i;
    other_time=new Array();
    for(i=0; i<other_ob.length; i++) {
      var t;
      if(other_ob[i].getAttribute("form_type")=="date")
        t=date_get_machine(other_ob[i].value);
      else
        t=date_get_machine(other_ob[i].value);

      if(t) {
        t=t+","+other_ob[i].getAttribute("form_name");
        other_time.push(t);
      }
    }

    if(other_time.length>0) {
      var m;
      other_time.sort();
      other_time.reverse();
      //alert("after: "+other_time);
      m=other_time[0].match(/^([0-9 \-:]*),(.*)$/);
      other_time=m[1];
      other_name=m[2];

      switch(ob.getAttribute("form_type")) {
        case "date":
          if(date_is_after(other_time, val))
            return form_element_error(ob, "Datum muss nach "+
               other_name+" liegen.");
         break;
        case "datetime":
          if(date_is_after(other_time, val))
            return form_element_error(ob, "Datum muss nach "+
               other_name+" liegen.");
         break;
      }
    }
  }

  if(val=="")
    return val;

  return val;
}

function form_element_set_value(ob, val) {
  switch(ob.getAttribute("form_type")) {
    case "date":
      val=date_get_human(val, 0, 3);
      break;
    case "datetime":
      val=date_get_human(val, 0, 2);
      break;
    case "time":
      val=time_get_human(val);
      break;
  }

  ob.value=val;
}

function array_is_member(needle, haystack) {
  for(var i=0; i<haystack.length; i++) {
    if(haystack[i]==needle)
      return true;
  }
  return false;
}

function form_element_set_class(ob, mod_class, orig_class) {
  if(typeof(ob)=="string") {
    ob=document.getElementsByName(ob);
    if(ob.length>0)
      ob=ob[0];
    else
      return;
  }

  if(!orig_class)
    orig_class=mod_class;

  // Checken, ob sich die Daten zum Original-Formular veraendert haben
  var orig_name=form_element_orig_name(ob.name);
  var orig_ob=document.getElementsByName(orig_name);
  var orig_values=new Array();
  for(var i=0; i<orig_ob.length; i++) {
    orig_values.push(orig_ob[i].value);
  }

  switch(ob.getAttribute("form_type")) {
    case "checkbox":
      var obs=document.getElementsByName(ob.name);
      for(var i=0; i<obs.length; i++) {
	if(obs[i]==ob) {
	  if((ob.checked&&array_is_member(ob.value, orig_values))||
	     (!ob.checked&&!array_is_member(ob.value, orig_values)))
	    obs[i].parentNode.className=orig_class;
	  else
	    obs[i].parentNode.className=mod_class;
	}
      }
      break;
    case "radio":
      var obs=document.getElementsByName(ob.name);
      for(var i=0; i<obs.length; i++) {
	if(obs[i]==ob)
	  obs[i].parentNode.className=mod_class;
	else
	  obs[i].parentNode.className="form_orig";
      }
      break;
    default:
      if(orig_values[0]==ob.value)
	ob.className=orig_class;
      else
	ob.className=mod_class;
  }
}

function form_element_changed(ob, generated) {
  var val;
  var x;

  if(form_on_the_fly) {
    x=new Function("ob", "return "+form_on_the_fly+"(ob);");
    x();
  }

  if(ob.getAttribute("cookie_remember")) {
    var cookie_name=ob.getAttribute("cookie_remember");
    var cookie=json_decode(cookie_read(cookie_name));
    if(!cookie)
      cookie={};
    cookie[ob.name]=ob.value;
    cookie_write(cookie_name, json_encode(cookie));
  }

  // Checken, ob die Daten plausibel sind
  if((val=form_element_check(ob))!=null)
    form_element_set_value(ob, val);

  if(val!=null) {
    if(generated)
      form_element_set_class(ob, "form_generated", "form_orig");
    else
      form_element_set_class(ob, "form_modified", "form_orig");
  }

  if(x=ob.getAttribute("form_onchange")) {
    x=new Function("ob", "return "+x+"(ob);");
    x(ob);
  }
}

function form_set_value(form_ob, value, generated) {
  if(typeof form_ob=="string")
    form_ob=document.getElementsByName(form_ob);

  if(form_ob.length==0)
    alert("form_set_value(): Kein Element gefunden!");

  switch(form_ob[0].getAttribute("form_type")) {
    case "radio":
      for(var j=0; j<form_ob.length; j++) {
        if(form_ob[j].value==value) {
          form_ob[j].checked=true;
          form_element_changed(form_ob[j], generated);
        }
      }
      break;
    case "text":
    case "person":
    case "integer":
      form_ob[0].value=value;
      form_element_changed(form_ob[0], generated);
      break;
    case "date":
      form_ob[0].value=date_get_human(value, 0, 3);
      form_element_changed(form_ob[0], generated);
      break;
    case "datetime":
      form_ob[0].value=date_get_human(value, 0, 2);
      form_element_changed(form_ob[0], generated);
      break;
    case "time":
      form_ob[0].value=time_get_human(value);
      form_element_changed(form_ob[0], generated);
      break;
    case "select":
      for(var j=0; j<form_ob[0].length; j++) {
        if(form_ob[0].options[j].value==value) {
          form_ob[0].options[j].selected=true;
        }
        form_element_changed(form_ob[0], generated);
      }
      break;
    default:
      form_element_changed(form_ob[0], generated);
  }
}

function form_get_value(form_ob) {
  if(typeof form_ob=="string")
    form_ob=document.getElementsByName(form_ob);

  if(form_ob.length==0)
    alert("form_get_value(): Kein Element gefunden!");

  switch(form_ob[0].getAttribute("form_type")) {
    case "date":
      return date_get_machine(form_ob[0].value, 3);
    case "datetime":
      return date_get_machine(form_ob[0].value, 2);
    case "text":
    case "select":
      return form_ob[0].value;
  }
}

var form_textarea_active=null;
var form_textarea_pos=null;

function form_textarea_down(ob, event) {
  ob=document.getElementsByName(ob);
  ob=ob[0];

  form_textarea_active=ob;

  form_textarea_pos=get_abs_pos(ob);
  //alert(p+" "+event.clientX+" "+event.clientY);
  ob.style.width=(event.clientX-form_textarea_pos[0])+"px";
  ob.style.height=(event.clientY-form_textarea_pos[1])+"px";
  
  document.onmousemove=form_textarea_move;
  document.onmouseup=form_textarea_up;
}

function form_textarea_move(ev) {
  var ob;

  if(ev)
    event=ev;

  if(!(ob=form_textarea_active))
    return;

  ob.style.width=(event.clientX-form_textarea_pos[0])+"px";
  ob.style.height=(event.clientY-form_textarea_pos[1])+"px";
}

function form_textarea_up() {
  form_textarea_active=null;
}

function form_file_overwrite(id) {
  var el=document.getElementById(id+"-oldfile");
  el.style.display="none";
  var el=document.getElementById(id+"-newfile");
  el.style.display="inline";
}

var form_autocomp_box;
var form_autocomp_timer;
var form_autocomp_cur_ob;
var form_autocomp_blur_state;
var form_autocomp_pos;
var form_autocomp_count;
var form_autocomp_selected;
var form_autocomp_nosubmit;
var IE=false;

function form_autocomp_onsubmit() {
  if(form_autocomp_nosubmit) {
    form_autocomp_nosubmit=false;
    return false;
  }
}

function form_autocomp_clean_box(ob) {
  if(!ob)
    ob=form_autocomp_cur_ob;

  form_autocomp_cur_ob=ob;

  if(!form_autocomp_box) {
    form_autocomp_box=document.createElement("div");
    form_autocomp_box.className="form_autocomp_box";
    form_autocomp_box.onmousemotion=form_autocomp_noblur;
    form_autocomp_box.onmouseover=form_autocomp_noblur;
    form_autocomp_box.onmouseout=form_autocomp_blur;

    ob.form.onsubmit=form_autocomp_onsubmit;
  }
  else {
    while(x=form_autocomp_box.firstChild)
      form_autocomp_box.removeChild(x);
  }

  document.body.appendChild(form_autocomp_box);
  p=get_abs_pos(ob);
  form_autocomp_box.style.position="absolute";
  form_autocomp_box.style.left=p[0] + "px";
  form_autocomp_box.style.top =(p[1]+ob.offsetHeight) + "px";
  form_autocomp_box.style.width=(ob.offsetWidth-1)+"px";
  form_autocomp_pos=-1;
  form_autocomp_count=0;
  form_autocomp_selected=null;
}

function form_autocomp_choose_text() {
  form_autocomp_cur_ob.value=this.firstChild.data;
  form_autocomp_hide_box();
}

function form_autocomp_add_text(s, value) {
  ob1=document.createElement("span");
  form_autocomp_box.appendChild(ob1);
  ob1.onclick=form_autocomp_choose_text;
  ob1.className="form_autocomp_entry";
  ob1.value=value;

  text=document.createTextNode(s);
  ob1.appendChild(text);

  br=document.createElement("br");
  form_autocomp_box.appendChild(br);
}

function form_autocomp_hide_box() {
  form_autocomp_pos=-1;
  form_autocomp_count=0;
  clearTimeout(form_autocomp_timer);

  if((!form_autocomp_box)||(!form_autocomp_box.parentNode))
    return;

  form_autocomp_box.style.display="none";
  form_autocomp_box.parentNode.removeChild(form_autocomp_box);
  form_autocomp_box=null;

  form_autocomp_blur_state=1;
  if(form_autocomp_cur_ob.onchange)
    form_autocomp_cur_ob.onchange();
}

function form_autocomp_highlight() {
  if(form_autocomp_selected)
    form_autocomp_selected.className="form_autocomp_entry";

  ob=form_autocomp_box.firstChild;
  while(ob&&(ob.nodeName!="SPAN"))
    ob=ob.nextSibling;

  for(i=0;i<form_autocomp_pos;i++) {
    ob=ob.nextSibling;
    while(ob&&(ob.nodeName!="SPAN"))
      ob=ob.nextSibling;
  }

  if(ob.offsetTop+ob.offsetHeight-ob.offsetParent.scrollTop+1>ob.offsetParent.clientHeight) {
    ob.offsetParent.scrollTop=ob.offsetTop+ob.offsetHeight+1-ob.offsetParent.clientHeight;
  }
  if(ob.offsetTop-ob.offsetParent.scrollTop<0) {
    ob.offsetParent.scrollTop=ob.offsetTop;
  }

  ob.className="form_autocomp_selected";
  form_autocomp_selected=ob;
}

function form_autocomp_movecursor(ob, event) {
  if(!form_autocomp_box)
    return;
  if(form_autocomp_count==0)
    return;

  if(event.keyCode==40) {
    form_autocomp_pos++;
    if(form_autocomp_pos>=form_autocomp_count)
      form_autocomp_pos=0;

    form_autocomp_highlight();
    return 1;
  }

  if(event.keyCode==38) {
    form_autocomp_pos--;
    if(form_autocomp_pos<0)
      form_autocomp_pos=form_autocomp_count-1;

    form_autocomp_highlight();
    return 1;
  }

}

function form_autocomp_onkeypress(ob, event) {
  if(!IE)
    if(form_autocomp_movecursor(ob, event))
      return false;
}

function form_autocomp_onkeydown(ob, event) {
  if(IE) {
    if(form_autocomp_movecursor(ob, event))
      return false;
  }
  else {
    if((event.keyCode==38)||(event.keyCode==40))
      return;
  }

  if((form_autocomp_box)&&(event.keyCode==13)) {
    form_autocomp_blur_state=1;
    form_autocomp_cur_ob.value=form_autocomp_selected.firstChild.data;
    form_autocomp_hide_box();
    form_autocomp_nosubmit=true;
  }

//  if((form_autocomp_box)&&(event.keyCode!=16)) {
//    alert(event.keyCode);
//  }

  if((form_autocomp_box)&&(event.keyCode==9)) {
    form_autocomp_blur_state=1;
  }

  // 16=shift
  if((form_autocomp_box)&&(event.keyCode!=16)) {
    form_autocomp_hide_box();
  }

  return 1;
}

function form_autocomp_get_data(data) {
  form_autocomp_clean_box();
  form_autocomp_count=data.getElementsByTagName('ac').length;
  if(form_autocomp_count==0) {
    msg=ob.getAttribute("form_autocomp_error");
    form_autocomp_add_text(msg);
  }
  else {
    for(i=0;i<form_autocomp_count;i++) {
      form_autocomp_add_text(data.getElementsByTagName('ac')[i].firstChild.nodeValue);
    }
  }
}

function keys(ob) {
  var ret=[];

  for(var i in ob) {
    ret.push(i);
  }

  return ret;
}

function form_autocomp_set_data(data) {
  form_autocomp_clean_box();
  var k=keys(data);
  form_autocomp_count=k.length;

  if(k.length==0) {
    msg=ob.getAttribute("form_autocomp_error");
    form_autocomp_add_text(msg);
  }
  else {
    for(i=0;i<k.length;i++) {
      form_autocomp_add_text(data[k[i]], k[i]);
    }
  }
}

function form_autocomp_search() {
  var ob=form_autocomp_cur_ob;
  var search_str=ob.value.toLowerCase();
  if((ob.selectionStart==0)&&(ob.selectionEnd==search_str.length))
    search_str="";

  //if(ob.value!="") {
    var x;
    form_autocomp_clean_box(ob);
    search_msg=ob.getAttribute("form_autocomp_search_msg");
    form_autocomp_add_text(search_msg);

    if(x=ob.getAttribute("form_autocomp_url"))
      // TODO: include timeout
      ajax_start_request(x, new Array("value="+ob.value), form_autocomp_get_data);
    if(x=ob.getAttribute("form_autocomp_values")) {
      var y={};
      var x=eval(x);
      for(var i in x) {
	if(x[i].toLowerCase().indexOf(search_str) != -1)
	  y[i]=x[i];
      }
      form_autocomp_set_data(y);
    }
  //}

  return 1;
}

function form_autocomp_onkeyup(ob, event) {
  if(!ob)
    ob=form_autocomp_cur_ob;

  form_autocomp_cur_ob=ob;

  if((event.keyCode==38)||(event.keyCode==40)||
     (event.keyCode==13)||(event.keyCode==27))
    return false;

  form_autocomp_search();
//  clearTimeout(form_autocomp_timer);
//  form_autocomp_timer=setTimeout("form_autocomp_search()", 100);
}

function form_autocomp_onblur(ob, event) {
  if(form_autocomp_blur_state)
    form_autocomp_hide_box();

/*  p=get_abs_pos(form_autocomp_box);
  alert(event+" "+event.pageX+" "+p[0]+" "+form_autocomp_box.offsetWidth);
  if((event.clientX>=p[0])&&(event.clientX<p[0]+form_autocomp_box.offsetWidth)&&
     (event.clientY>=p[1])&&(event.clientY<p[1]+form_autocomp_box.offsetHeight)) {
    alert("x");
  }*/

}

function form_autocomp_onfocus(ob, event) {
  if(ob.value==ob.defaultValue) {
    ob.select();
  }
  form_autocomp_cur_ob=ob;
  form_autocomp_search();
}

function form_autocomp_blurred() {
}

function form_autocomp_noblur() {
  form_autocomp_blur_state=0;
}

function form_autocomp_blur() {
  form_autocomp_blur_state=1;
}
