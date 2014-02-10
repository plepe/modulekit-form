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

  input.className=cls;
  if(this.data)
    input.value=this.data;
  div.appendChild(input);
  this.dom_visible=input;
  this.dom_visible.onblur=this.notify_change.bind(this);
  this.dom_visible.onfocus=this.onfocus.bind(this);

  this.dom_visible.onkeydown=this.onkeydown.bind(this);
  this.dom_visible.onkeyup=this.onkeyup.bind(this);
  this.dom_visible.onkeypress=this.onkeypress.bind(this);

  this.dom_values={};
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

    part = strtr(part, {
      '*': '\\*',
      '.': '\\.',
      '?': '\\?',
      '+': '\\+',
      '^': '\\^',
      '$': '\\$',
      '|': '\\|',
      '(': '\\(',
      ')': '\\)',
      '[': '\\[',
      ']': '\\]',
      '\\': '\\\\'
    });

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

form_element_autocomplete.prototype.select_box_show_matches=function() {
  var values = this.get_values();
  var current = null;
  if(this.select_box&&this.select_box.current)
    current = this.select_box.current.value;
  var current_option = null;
  var regexps = this.build_regexps(this.dom_visible.value);

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

      var text=document.createTextNode(values[k]);
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

form_element_autocomplete.prototype.select_box_show=function() {
  if(this.select_box)
    return;

  this.select_box = document.createElement("div");
  this.dom_visible.parentNode.appendChild(this.select_box);
  this.select_box.className="select_box";

  this.select_box_show_matches();
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
  this.select_box.parentNode.removeChild(this.select_box);
  this.select_box = null;
}

form_element_autocomplete.prototype.onfocus=function() {
  this.dom_visible.select();
  this.select_box_show();
}

form_element_autocomplete.prototype.select_box_select=function(k) {
  this.dom_element.value = k;
  var values = this.get_values();
  this.dom_visible.value = values[k];
  this.select_box_noblur=false;
  this.notify_change();
}

form_element_autocomplete.prototype.notify_change=function() {
  this.parent('form_element_autocomplete').notify_change.call(this);
  
  if(this.select_box && !this.select_box_noblur)
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

form_element_autocomplete.prototype.refresh=function() {
  var cls;

  this.parent("form_element_autocomplete").refresh.call(this);

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

  if((data!="")&&(data!=null)) {
    if(this.def.values) {
      if(!data in this.def.values)
        list.push(this.path_name()+": "+lang('form:invalid_value'));
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
