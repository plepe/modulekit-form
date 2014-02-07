form_element_autocomplete.inherits_from(form_element);
function form_element_autocomplete() {
}

form_element_autocomplete.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_autocomplete").init.call(this, id, def, options, form_parent);
}

form_element_autocomplete.prototype.connect=function(dom_parent) {
  this.parent("form_element_autocomplete").connect.call(this, dom_parent);
  this.dom_element=this.dom_parent.getElementsByTagName("input")[0];

  this.dom_element.onblur=this.notify_change.bind(this);
}

form_element_autocomplete.prototype.create_element=function() {

  return input;
}

form_element_autocomplete.prototype.show_element=function() {
  var div=this.parent("form_element_autocomplete").show_element.call(this);

  var cls="form_orig";
  if(this.is_modified())
    cls="form_modified";

  var input=document.createElement("input");
  input.type="text";
  input.autocomplete="off";

  if(this.def.html_attributes)
    for(var i in this.def.html_attributes)
      input.setAttribute(i, this.def.html_attributes[i]);

  input.className=cls;
  input.name=this.options.var_name;
  if(this.data)
    input.value=this.data;
  div.appendChild(input);
  this.dom_element=input;
  this.dom_element.onblur=this.notify_change.bind(this);
  this.dom_element.onfocus=this.onfocus.bind(this);

  this.dom_element.onkeydown=this.onkeydown.bind(this);
  this.dom_element.onkeyup=this.onkeyup.bind(this);
  this.dom_element.onkeypress=this.onkeypress.bind(this);

  this.dom_values={};

  return div;
}

form_element_autocomplete.prototype.onkeydown=function(event) {
  if(!event)
    event = window.event;

  if(event.keyCode == 13) {
    if(!this.select_box.current)
      return;

    var values = this.get_values();
    this.dom_element.value = values[this.select_box.current.value];
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

form_element_autocomplete.prototype.onkeyup=function(event) {
  if(!event)
    event = window.event;

}

form_element_autocomplete.prototype.onkeypress=function(event) {
  if(!event)
    event = window.event;

}

form_element_autocomplete.prototype.select_box_show=function() {
  if(this.select_box)
    return;

  this.select_box = document.createElement("div");
  this.dom_element.parentNode.appendChild(this.select_box);
  this.select_box.className="select_box";

  var values = this.get_values();
  var current = null;
  for(var k in values) {
    var option=document.createElement("div");
    option.value=k;
    // TODO: indexOf not supported in IE8 and earlier
    if(this.data==k) {
      option.className="selected";
      current = option;
    }
    this.select_box.appendChild(option);
    this.dom_values[k]=option;
    option.onclick=this.select_box_select.bind(this, k);

    var text=document.createTextNode(values[k]);
    option.appendChild(text);
  }

  if(current)
    this.select_box_set_current(current);

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
  this.select_box_show();
}

form_element_autocomplete.prototype.select_box_select=function(k) {
  var values = this.get_values();
  this.dom_element.value = values[k];
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

  var values = this.get_values();
  for(var k in values)
    if(data == values[k])
      return k;

  return null;
}

form_element_autocomplete.prototype.set_data=function(data) {
  this.parent("form_element_autocomplete").set_data.call(this, data);

  if(this.dom_element)
    this.dom_element.value=this.data;
}

form_element_autocomplete.prototype.refresh=function() {
  var cls;

  this.parent("form_element_autocomplete").refresh.call(this);

  if(!this.dom_element)
    return;

  if(this.is_modified())
    cls="form_modified";
  else
    cls="form_orig";

  this.dom_element.className=cls;
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
      if(!in_array(data, this.def.values))
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
