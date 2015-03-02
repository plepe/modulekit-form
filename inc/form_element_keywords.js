form_element_keywords.inherits_from(form_element);
function form_element_keywords() {
}

form_element_keywords.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_keywords").init.call(this, id, def, options, form_parent);
}

form_element_keywords.prototype.connect=function(dom_parent) {
  this.parent("form_element_keywords").connect.call(this, dom_parent);
  this.dom_element=this.dom_parent.getElementsByTagName("input")[0];

  this.dom_element.onblur=this.notify_change.bind(this);

  this.create_interaction();

  this.set_data(this.get_data());
}

form_element_keywords.prototype.create_interaction=function() {
  this.keywords_list=document.createElement("div");
  this.keywords_list.className="keywords";
  this.dom_element.parentNode.appendChild(this.keywords_list);

  this.actions=document.createElement("div");
  this.actions.className="actions";
  this.dom_actions={};

  var button=document.createElement("input");
  button.type="button";
  button.value=(typeof this.def.text_add!="undefined"?
    this.def.text_add:lang('new'));
  button.onclick=this.add_keyword.bind(this);
  this.actions.appendChild(button);
  this.dom_actions.add=button;

  var button=document.createElement("input");
  button.type="button";
  button.value=(typeof this.def.text_edit!="undefined"?
    this.def.text_edit:lang('edit'));
  button.onclick=this.edit.bind(this);
  this.actions.appendChild(button);
  this.dom_actions.edit=button;

  this.dom_element.parentNode.appendChild(this.actions);
}

form_element_keywords.prototype.create_element=function() {
  var input=document.createElement("input");
  input.type="text";

  return input;
}

form_element_keywords.prototype.show_element=function() {
  var div=this.parent("form_element_keywords").show_element.call(this);

  var cls="form_orig";
  if(this.is_modified())
    cls="form_modified";
  cls+=" connected";

  var input=this.create_element();
  input.className=cls;
  input.name=this.options.var_name;
  if(this.data)
    input.value=this.data.join(", ");
  div.appendChild(input);
  this.dom_element=input;
  this.dom_element.onblur=this.notify_change.bind(this);

  this.datalist=document.createElement("datalist");
  this.datalist.id=this.id+"-datalist";
  this.dom.appendChild(this.datalist);

  this.update_options();

  this.create_interaction();

  return div;
}

form_element_keywords.prototype.update_options = function() {
  while(this.datalist.firstChild)
    this.datalist.removeChild(this.datalist.firstChild);

  var values = this.get_values();

  if(values) {
    for(var k in values) {
      var option=document.createElement("option");
      option.value=get_value_string(k);

      this.datalist.appendChild(option);
    }
  }
}

form_element_keywords.prototype.set_data=function(data) {
  this.parent("form_element_keywords").set_data.call(this, data);

  if(this.dom_element)
    this.dom_element.value=this.data.join(", ");

  this.get_data();

  while(this.keywords_list.firstChild)
    this.keywords_list.removeChild(this.keywords_list.firstChild);

  for(var i=0; i<this.data.length; i++) {
    var span=document.createElement("span");
    span.className="keyword";

    var text=document.createTextNode(this.data[i]);
    var v;
    if(this.def.link) {
      v=document.createElement("a");
      v.href=this.def.link.replace("%", urlencode(this.data[i]));
    }
    else
      v=document.createElement("span");
    v.className="value";
    v.appendChild(text);
    span.appendChild(v);

    var button=document.createElement("input");
    button.type="button";
    button.onclick=this.remove_keyword.bind(this, i);
    button.value=(typeof this.def.text_remove!="undefined"?
      this.def.text_remove:"X");
    span.appendChild(button);

    this.keywords_list.appendChild(span);

    this.keywords_list.appendChild(document.createTextNode(" "));
  }

  this.notify_change();
}

form_element_keywords.prototype.get_data=function() {
  if(!this.dom_element)
    return this.data;

  this.data=this.dom_element.value;
  this.data=this.data.split(/ *, */);

  // avoid empty keywords, detect duplicates
  var new_data=[];
  var dupl_detect={};
  for(var i=0; i<this.data.length; i++) {
    if(dupl_detect[this.data[i]])
      /* nothing */;
    else if(!this.data[i].match(/^ *$/))
      new_data.push(this.data[i]);

    dupl_detect[this.data[i]]=true;
  }
  this.data=new_data;

  return this.data;
}

form_element_keywords.prototype.refresh=function(force) {
  var cls;

  this.parent("form_element_keywords").refresh.call(this, force);

  if(!this.dom_element)
    return;

  var old_values = this.values;
  this.values = this.get_values();

  if(!array_compare(this.values, old_values))
    this.update_options();

  if(this.orig_data&&this.data.join(",")!=this.orig_data.join(","))
    cls="form_modified";
  else
    cls="form_orig";
  cls+=" connected";

  this.dom_element.className=cls;
}

form_element_keywords.prototype.remove_keyword=function(i) {
  var data=this.get_data();

  data=data.slice(0, i).concat(data.slice(i+1));

  this.set_data(data);
}

form_element_keywords.prototype.add_keyword=function() {
  var span=document.createElement("span");
  span.className="keyword";

  var input=document.createElement("input");
  input.setAttribute("list", this.id+"-datalist");
  span.appendChild(input);
  input.onblur=this.add_keyword_save.bind(this, input);
  input.onkeypress=this.add_keyword_keypress.bind(this, input);
  input.onkeyup=this.add_keyword_keyup.bind(this, input);

  this.keywords_list.appendChild(span);

  input.focus();
}

form_element_keywords.prototype.add_keyword_save=function(input) {
  // avoid onblur event when removing input due to other actions
  if(this.save_active)
    return;
  this.save_active=true;

  var new_data=this.get_data();

  if(!input.value.match(/^ *$/))
    new_data=new_data.concat([input.value]);

  this.set_data(new_data);

  delete(this.save_active);
}

form_element_keywords.prototype.add_keyword_keypress=function(input, ev) {
  if(!ev) ev=event;

  if(ev.keyCode==13) {
    return false;
  }
  if(ev.keyCode==27) {
    input.value="";

    this.add_keyword_save(input);
    return false;
  }
  if(ev.charCode==",".charCodeAt(0)) {
    this.add_keyword_save(input);

    this.add_keyword();
    return false;
  }
}

form_element_keywords.prototype.add_keyword_keyup=function(input, ev) {
  if(!ev) ev=event;

  if(ev.keyCode==13) {
    if(input.value=="")
      return false;

    this.add_keyword_save(input);
    this.dom_actions.add.focus();
  }
}

form_element_keywords.prototype.edit=function() {
  if(!this.edit_actions) {
    this.edit_actions=document.createElement("div");
    this.edit_actions.className="edit_actions";

    var button=document.createElement("input");
    button.type="button";
    button.value=(typeof this.def.text_save!="undefined"?
      this.def.text_save:lang('ok'));
    button.onclick=this.edit_save.bind(this);
    this.edit_actions.appendChild(button);

    var button=document.createElement("input");
    button.type="button";
    button.value=(typeof this.def.text_cancel!="undefined"?
      this.def.text_cancel:lang('cancel'));
    button.onclick=this.edit_cancel.bind(this);
    this.edit_actions.appendChild(button);

    this.dom_element.parentNode.appendChild(this.edit_actions);
    this.dom_element.onkeypress=this.edit_keypress.bind(this);
  }

  // remember old value
  this.old_value=this.dom_element.value;

  this.dom_parent.className=this.dom_parent.className+" edit";
  this.dom_element.focus();
}

form_element_keywords.prototype.is_modified=function() {
  if(this.orig_data&&this.data.join(",")!=this.orig_data.join(","))
    return true;
}

form_element_keywords.prototype.edit_save=function() {
  this.set_data(this.get_data());

  this.edit_hide();
}

form_element_keywords.prototype.edit_cancel=function() {
  this.dom_element.value=this.old_value;
  this.set_data(this.get_data());

  this.edit_hide();
}

form_element_keywords.prototype.edit_hide=function() {
  var x=this.dom_parent.className.split(/ /);
  var y=[];
  for(var i=0; i<x.length; i++)
    if(x[i]!="edit")
      y.push(x[i]);

  this.dom_parent.className=y.join(" ");
}

form_element_keywords.prototype.edit_keypress=function(ev) {
  if(!ev) ev=event;

  if(ev.keyCode==13) {
    this.edit_save();
    return false;
  }
  else if(ev.keyCode==27) {
    this.edit_cancel();
    return false;
  }
}

form_element_keywords.prototype.is_modified=function() {
  return array_compare_values(this.get_data(), this.get_orig_data());
}
