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
  this.dom_element.onblur=this.notify_change.bind(this);
  this.dom_element.onchange=this.notify_change_file.bind(this);
}

form_element_file.prototype.connect=function(dom_parent) {
  this.parent("form_element_file").connect.call(this, dom_parent);

  var obs=this.dom_parent.getElementsByTagName("input");
  for(var i=0; i<obs.length; i++) {
    if(obs[i].name==this.options.var_name+"[file]")
      this.dom_element=obs[i];
  }

  if(this.dom_element) {
    this.dom_element.onblur=this.notify_change.bind(this);
    this.dom_element.onchange=this.notify_change_file.bind(this);
  }

  var span;
  if(span=document.getElementById(this.id+"-oldfile")) {
    var input=document.createElement("input");
    input.type="button";
    input.value=lang("change");
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

    span_value=document.createElement("span");
    span_value.setAttribute("class", "value");
    span.appendChild(span_value);

    // enclose in a link if web_path is set
    if(this.def.web_path) {
      var web_url=this.def.web_path.replace("[file_name]",
        this.data.tmp_name?this.data.tmp_name:this.data.name);

      var a=document.createElement("a");
      a.setAttribute("href", web_url);

      span_value.appendChild(a);
      span_value=a;

      if(in_array(this.data.type, ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/png', 'image/svg+xml'])) {
	var img=document.createElement("img");
	img.setAttribute("src", web_url);
	img.setAttribute("class", "form_element_file_preview");
	span_value.appendChild(img);

	span_value.appendChild(document.createTextNode(" "));
      }
    }

    var txt=document.createTextNode(this.data.orig_name);
    span_value.appendChild(txt);

    span_value.appendChild(document.createElement("br"));
    span_value.appendChild(document.createTextNode(format_file_size(this.data.size)));

    var input=document.createElement("input");
    input.type="button";
    input.value=lang("change");
    input.onclick=this.input_change.bind(this);
    span.appendChild(input);
  }
  else {
    var input=document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("value", null);
    input.setAttribute("name", this.options.var_name+"[data]");
    div.appendChild(input);
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
  this.dom_element.onblur=this.notify_change.bind(this);
  this.dom_element.onchange=this.notify_change_file.bind(this);

  return div;
}

form_element_file.prototype.notify_change_file=function() {
  this.parent("form_element_file").notify_change.call(this);

  var span=document.getElementById(this.id+"-newfile");
  span.style.display="none";

  span=document.getElementById(this.id+"-oldfile");
  if(!span) {
    span = document.createElement("span");
    span.id = this.id + "-oldfile";

    var span_value = document.createElement("span");
    span_value.className = "value";
    span.appendChild(span_value);

    var input=document.createElement("input");
    input.type="button";
    input.value=lang("change");
    input.onclick=this.input_change.bind(this);
    span.appendChild(input);

    this.dom.appendChild(span);
  }

  var span_value = span.firstChild;
  if(span_value.firstChild)
    span_value.removeChild(span_value.firstChild);
  span_value.insertBefore(document.createTextNode(this.dom_element.value), span_value.firstChild);

  span.style.display="block";
  span.className = "form_modified";
}

form_element_file.prototype.input_change=function() {
  var span=document.getElementById(this.id+"-oldfile");
  span.style.display="none";

  span=document.getElementById(this.id+"-newfile");
  span.style.display="block";
}
