form_element_file.inherits_from(form_element);
function form_element_file() {
}

form_element_file.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_file").init.call(this, id, def, options, form_parent);
}

form_element_file.prototype.refresh=function() {
  var cls;

  //this.parent("form_element_file").check_modified.call(this);

  if(!this.dom_element)
    return;

  if(this.is_modified())
    cls="form_modified";
  else
    cls="form_orig";

  this.dom_element.className=cls;
  this.dom_element.onchange=this.notify_change.bind(this);
}

form_element_file.prototype.connect=function(dom_parent) {
  this.parent("form_element_file").connect.call(this, dom_parent);

  var obs=this.dom_parent.getElementsByTagName("input");
  for(var i=0; i<obs.length; i++) {
    if(obs[i].name==this.options.var_name+"[file]")
      this.dom_element=obs[i];
  }

  if(this.dom_element)
    this.dom_element.onchange=this.notify_change.bind(this);

  var span;
  if(span=document.getElementById(this.id+"-oldfile")) {
    var input=document.createElement("input");
    input.type="button";
    input.value="Ändern";
    input.onclick=this.input_change.bind(this);
    span.appendChild(input);

    span=document.getElementById(this.id+"-newfile");
    span.style.display="none";
  }
}

form_element_file.prototype.show_element=function() {
  var div=this.parent("form_element_file").show_element.call(this);

  var cls="form_orig";
  if(this.is_modified())
    cls="form_modified";

  if(this.data) {
    // create hidden input for data
    var input=document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("value", JSON.stringify(this.data));
    input.setAttribute("name", this.options.var_name+"[data]");
    div.appendChild(input);

    // create div for text of old file
    var span=document.createElement("div");
    span.setAttribute("id", this.id+"-oldfile");
    div.appendChild(span);

    var txt=document.createTextNode(this.data.orig_name);
    span.appendChild(txt);

    var input=document.createElement("input");
    input.type="button";
    input.value="Ändern";
    input.onclick=this.input_change.bind(this);
    span.appendChild(input);
  }

  // create input field for new file
  var span=document.createElement("div");
  span.setAttribute("id", this.id+"-newfile");
  if(this.data)
    span.style.display="none";
  div.appendChild(span);

  var input=document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("class", cls);
  input.setAttribute("name", this.options.var_name+"[file]");
  span.appendChild(input);

  this.dom_element=input;
  this.dom_element.onchange=this.notify_change.bind(this);

  return div;
}

form_element_file.prototype.input_change=function() {
  var span=document.getElementById(this.id+"-oldfile");
  span.style.display="none";

  span=document.getElementById(this.id+"-newfile");
  span.style.display="block";
}
