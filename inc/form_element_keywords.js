form_element_keywords.inherits_from(form_element);
function form_element_keywords() {
}

form_element_keywords.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_keywords").init.call(this, id, def, options, form_parent);
}

form_element_keywords.prototype.connect=function(dom_parent) {
  this.parent("form_element_keywords").connect.call(this, dom_parent);
  this.dom_element=this.dom_parent.getElementsByTagName("input")[0];

  this.dom_element.onchange=this.notify_change.bind(this);

  this.keywords_list=document.createElement("div");
  this.keywords_list.className="keywords";
  this.dom_element.parentNode.appendChild(this.keywords_list);

  this.actions=document.createElement("div");
  this.actions.className="actions";

  var button=document.createElement("input");
  button.type="button";
  button.value="neu";
  button.onclick=this.add_keyword.bind(this);
  this.actions.appendChild(button);

  this.dom_element.parentNode.appendChild(this.actions);

  this.set_data(this.get_data());
}

form_element_keywords.prototype.create_element=function() {
  var input=document.createElement("input");
  input.type="text";

  return input;
}

form_element_keywords.prototype.show_element=function() {
  var div=this.parent("form_element_keywords").show_element.call(this);

  var cls="form_orig";
  if(this.orig_data&&this.data!=this.orig_data)
    cls="form_modified";
  cls+=" connected";

  var input=this.create_element();
  input.className=cls;
  input.name=this.options.var_name;
  if(this.data)
    input.value=this.data.join(", ");
  div.appendChild(input);
  this.dom_element=input;
  this.dom_element.onchange=this.notify_change.bind(this);

  this.keywords_list=document.createElement("div");
  this.keywords_list.className="keywords";
  this.dom_element.parentNode.appendChild(this.keywords_list);

  return div;
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
    span.appendChild(text);

    var button=document.createElement("input");
    button.type="button";
    button.onclick=this.remove_keyword.bind(this, i);
    button.value="X";
    span.appendChild(button);

    this.keywords_list.appendChild(span);
  }

  this.notify_change();
}

form_element_keywords.prototype.notify_change=function() {
  this.check_modified();

  this.form_parent.notify_change();
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

form_element_keywords.prototype.check_modified=function() {
  var cls;

  this.parent("form_element_keywords").check_modified.call();

  this.get_data();

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
  span.appendChild(input);
  input.onblur=this.add_keyword_save.bind(this, input);
  input.onkeypress=this.add_keyword_keypress.bind(this, input);

  this.keywords_list.appendChild(span);

  input.focus();
}

form_element_keywords.prototype.add_keyword_save=function(input) {
  var new_data=this.get_data();

  if(!input.value.match(/^ *$/))
    new_data=new_data.concat([input.value]);

  this.set_data(new_data);
}

form_element_keywords.prototype.add_keyword_keypress=function(input, event) {
  if(event.keyCode==13) {
    this.add_keyword_save(input);

    return false;
  }
  if(event.charCode==",".charCodeAt(0)) {
    this.add_keyword_save(input);

    this.add_keyword();
  }
}
