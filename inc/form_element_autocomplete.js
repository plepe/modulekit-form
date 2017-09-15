form_element_autocomplete.inherits_from(form_element);
function form_element_autocomplete() {
}

form_element_autocomplete.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_autocomplete").init.call(this, id, def, options, form_parent);
}

// Remove <select> and replace by JS <input>
form_element_autocomplete.prototype.connect=function(dom_parent) {
  var value;
  this.parent("form_element_autocomplete").connect.call(this, dom_parent);

  this.dom_element=this.dom_parent.getElementsByTagName("select")[0];
  if(this.dom_element)
    value = this.dom_element.value;

  while(dom_parent.firstChild)
    dom_parent.removeChild(dom_parent.firstChild);

  this.create_element(dom_parent);

  if(value != "")
    this.set_data(value);
}

form_element_autocomplete.prototype.create_element=function(div) {
  var cls="form_orig";
  if(this.is_modified())
    cls="form_modified";

  var input=document.createElement("input");
  input.type="hidden";
  this.dom_element = input;
  if(this.def.html_attributes)
    for(var i in this.def.html_attributes)
      input.setAttribute(i, this.def.html_attributes[i]);
  input.name=this.options.var_name;

  div.appendChild(input);

  var input=document.createElement("input");
  input.type="text";
  input.autocomplete="off";

  var placeholder;
  if('placeholder' in this.def)
    if(typeof this.def.placeholder == 'object')
      placeholder = lang(this.def.placeholder);
    else
      placeholder = this.def.placeholder;
  else
    placeholder = lang('form_element:please_select');
  input.placeholder = placeholder

  input.className=cls;
  if(this.data)
    input.value=this.data;
  div.appendChild(input);
  this.dom_visible=input;
  this.dom_visible.onblur=this.onblur.bind(this);
  this.dom_visible.onfocus=this.onfocus.bind(this);

  this.dom_visible.onkeydown=this.onkeydown.bind(this);
  this.dom_visible.onkeyup=this.onkeyup.bind(this);
  this.dom_visible.onkeypress=this.onkeypress.bind(this);

  this.dom_values={};

  this.div_desc=document.createElement("div");
  this.div_desc.className="description";
  div.appendChild(this.div_desc);
}

form_element_autocomplete.prototype.show_element=function() {
  var div=this.parent("form_element_autocomplete").show_element.call(this);

  this.create_element(div);

  return div;
}

form_element_autocomplete.prototype.onkeydown=function(event) {
  if(!event)
    event = window.event;

  if(event.keyCode == 13) {
    if(!this.select_box.current)
      return;

    var values = this.get_values();
    this.dom_element.value = this.select_box.current.value;
    this.dom_visible.value = values[this.select_box.current.value];
    this.select_box_noblur = false;
    this.notify_change();

    return false;
  }

  if(event.keyCode == 40) {
    if(!this.select_box) {
      this.select_box_show();

      if(this.select_box.current)
	return false;
    }

    current = this.select_box.current;

    if(current) {
      current.className = ""
      current = current.nextSibling;
    }

    if(!current)
      current = this.select_box.firstChild;

    this.select_box_set_current(current);

    return false;
  }

  if(event.keyCode == 38) {
    if(!this.select_box) {
      this.select_box_show();

      if(this.select_box.current)
	return false;
    }

    current = this.select_box.current;

    if(current) {
      current.className = ""
      current = current.previousSibling;
    }

    if(!current)
      current = this.select_box.lastChild;

    this.select_box_set_current(current);

    return false;
  }

  if(event.keyCode == 27) {
    if(!this.select_box)
      return;

    this.select_box_close();

    return false;
  }
}

form_element_autocomplete.prototype.select_box_set_current=function(current) {
  this.select_box.current = current;
  this.select_box.current.className = "selected"

  // make sure the highlighted object is visible
  if(this.select_box.current.offsetTop + this.select_box.current.offsetHeight - this.select_box.scrollTop > this.select_box.offsetHeight)
    this.select_box.scrollTop = this.select_box.current.offsetTop + this.select_box.current.offsetHeight - this.select_box.offsetHeight;

  if(this.select_box.current.offsetTop - this.select_box.scrollTop < 0)
    this.select_box.scrollTop = this.select_box.current.offsetTop;
}

form_element_autocomplete.prototype.build_regexps=function(v) {
  if((v === null) || (v === ''))
    return null;

  var ret = [];
  var parts = v.split(" ");

  for(var i = 0; i < parts.length ; i++ ) {
    part = parts[i];

    if(part === '')
      continue;

    part = part.replace(/([\*\.\?\+\^\$\|\(\)\[\]\\])/g, "\\$1");

    ret.push(new RegExp(part, 'i'));
  }

  return ret;
}

form_element_autocomplete.prototype.check_regexps=function(k, v, regexps) {
  if(regexps === null)
    return true;

  for(var i = 0; i < regexps.length; i ++)
    if(!v.match(regexps[i]))
      return false;

  return true;
}

form_element_autocomplete.prototype.select_box_show_matches=function(all) {
  var values = this.get_values();
  var current = null;
  if(this.select_box&&this.select_box.current)
    current = this.select_box.current.value;
  var current_option = null;
  var regexps = null;
  if(!all)
    regexps = this.build_regexps(this.dom_visible.value);

  // clear select_box
  var c = this.select_box.firstChild;
  while(c != null) {
    var n = c.nextSibling;
    this.select_box.removeChild(c);
    c = n;
  }

  // (re-)fill select_box
  for(var k in values) {
    if(this.check_regexps(k, values[k], regexps)) {
      var option=document.createElement("div");
      option.value=k;
      this.select_box.appendChild(option);
      this.dom_values[k]=option;
      option.onclick=this.select_box_select.bind(this, k);

      var text=document.createTextNode(get_value_string(values[k]));
      option.appendChild(text);

      if(current == k)
	current_option = option;
      else if(current_option === true) {
	current_option = option;
	current = k;
      }
    }
    else {
      if(current == k)
	current_option = true;
    }
  }

  if(current_option)
    this.select_box_set_current(current_option);
}

form_element_autocomplete.prototype.onkeyup=function(event) {
  if(!event)
    event = window.event;

  if (this.select_box_last_value != this.dom_visible.value) {
    this.select_box_show_matches();
    this.select_box_last_value = this.dom_visible.value;
  }
}

form_element_autocomplete.prototype.onkeypress=function(event) {
  if(!event)
    event = window.event;

}

form_element_autocomplete.prototype.select_box_show=function(all) {
  if(this.select_box)
    return;

  this.select_box = document.createElement("div");
  this.dom_visible.parentNode.insertBefore(this.select_box, this.dom_visible.nextSibling);
  this.select_box.className="select_box";

  this.select_box_show_matches(all);
  // don't remove select box if we move over the select box
  this.select_box_noblur=false;
  this.select_box.onmousemotion=function() {
    this.select_box_noblur=true;
  }.bind(this);
  this.select_box.onmouseover=function() {
    this.select_box_noblur=true;
  }.bind(this);
  this.select_box.onmouseout=function() {
    this.select_box_noblur=false;
  }.bind(this);
}

form_element_autocomplete.prototype.select_box_close=function() {
  if(!this.select_box)
    return;

  this.select_box.parentNode.removeChild(this.select_box);
  this.select_box = null;
}

form_element_autocomplete.prototype.onfocus=function() {
  window.setTimeout(function(ob) {
    ob.select();
  }.bind(this, this.dom_visible), 1);

  this.select_box_show(true);
}

form_element_autocomplete.prototype.select_box_select=function(k) {
  this.dom_element.value = k;
  var values = this.get_values();
  this.dom_visible.value = get_value_string(values[k]);
  this.select_box_last_value = this.dom_visible.value;
  this.select_box_noblur=false;
  this.notify_change();
}

form_element_autocomplete.prototype.onblur=function() {
  var found = false;

  if(this.select_box && this.select_box_noblur) {
    return;
  }
  else if(this.dom_visible.value == "") {
    this.dom_element.value = "";
    this.select_box_last_value = null;
    found = true;
  }
  else {
    var values = this.get_values();
    for(var k in values)
      if(this.dom_visible.value == values[k]) {
	this.dom_element.value = k;
	this.dom_visible.value = values[k];
	this.select_box_last_value = values[k];
	found = true;
      }
  }

  this.notify_change(found);
}

form_element_autocomplete.prototype.notify_change=function(found) {
  this.data_illegal=(found === false);

  this.parent('form_element_autocomplete').notify_change.call(this);
  
  this.select_box_close();
}

form_element_autocomplete.prototype.get_data=function(data) {
  var data=this.parent("form_element_autocomplete").get_data.call(this);

  if((data==="")||(data===null)) {
    if('empty_value' in this.def)
      return this.def.empty_value;

    return null;
  }

  return data;
}

form_element_autocomplete.prototype.set_data=function(data) {
  this.parent("form_element_autocomplete").set_data.call(this, data);

  if(this.dom_element)
    this.dom_element.value=this.data;

  var values = this.get_values();
  if(this.dom_visible)
    this.dom_visible.value=values[this.data];
}

form_element_autocomplete.prototype.refresh=function(force) {
  var cls;

  this.parent("form_element_autocomplete").refresh.call(this, force);

  if('div_desc' in this) {
    var values = this.get_values();

    this.div_desc.innerHTML="";
    for(var k in values)
      if(this.data == k)
	if(typeof values[k]=="object") {
	  var desc = lang(values[k], "desc:");

	  if(desc)
	    this.div_desc.innerHTML = desc;
	}
  }

  if(!this.dom_visible)
    return;

  if(this.is_modified())
    cls="form_modified";
  else
    cls="form_orig";

  this.dom_visible.className=cls;
}

form_element_autocomplete.prototype.check_regexp=function(list, param) {
  if(param.length<1)
    return;

  if(!this.get_data().match(param[0])) {
    if(param.length<2)
      list.push("Ungültiger Wert");
    else
      list.push(param[1]);
  }
}

form_element_autocomplete.prototype.errors=function(list) {
  this.parent("form_element_autocomplete").errors.call(this, list);

  var data=this.parent("form_element_autocomplete").get_data.call(this);

  if(this.data_illegal)
    list.push(lang('form:invalid_value'));

  if((data!="")&&(data!=null)) {
    var values = this.get_values();

    if(values) {
      if(!data in values)
        list.push(lang('form:invalid_value'));
    }
  }
}


form_element_autocomplete.prototype.is_modified=function() {
  this.get_data();

  if( ((this.orig_data==="")||(this.orig_data===null))
    &&((this.data==="")||(this.data===null)))
    return false;

  return this.parent("form_element_autocomplete").is_modified.call(this);
}
