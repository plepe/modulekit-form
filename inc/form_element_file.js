// only used with non-HTML5 browsers
var form_element_file_types = {
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'gif': 'image/gif',
  'bmp': 'image/bmp',
  'tif': 'image/tiff',
  'pdf': 'application/pdf',
  'zip': 'application/zip',
  'xml': 'application/xml',
  'txt': 'text/plain',
  'csv': 'text/plain',
  'mp4': 'video/mp4',
  'svg': 'image/svg+xml',
  'ps' : 'application/postscript',
  'php': 'text/x-php',
  'flv': 'video/x-msvideo',
  'ogg': 'application/ogg',
  'ogv': 'application/ogg'
};

form_element_file.inherits_from(form_element);
function form_element_file() {
}

form_element_file.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_file").init.call(this, id, def, options, form_parent);
}

form_element_file.prototype.focus = function() {
  this.dom_element.focus()
}

form_element_file.prototype.refresh=function(force) {
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
  var ret = this.parent("form_element_file").connect.call(this, dom_parent);

  var obs=this.dom_parent.getElementsByTagName("input");
  for(var i=0; i<obs.length; i++) {
    if(obs[i].name==this.options.var_name+"[file]")
      this.dom_element=obs[i];

    if(obs[i].name == this.options.var_name+"[data]")
      this.dom_element_orig = obs[i]

    if(obs[i].name == this.options.var_name+"[delete]")
      this.dom_element_delete = obs[i]
  }

  if(this.dom_element) {
    span = document.getElementById(this.id+"-newfile");
    var div = span.parentNode;
    div.removeChild(span);

    var span=document.createElement("label");
    span.setAttribute("id", this.id+"-newfile");
    if(this.data)
      span.style.display="none";
    div.appendChild(span);

    var input=document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("class", 'form_orig');
    input.setAttribute("name", this.options.var_name+"[file]");
    span.appendChild(input);

    var button = document.createElement('span')
    button.className = 'button'
    button.appendChild(document.createTextNode(lang("form:file_select")));
    span.appendChild(button)

    var size_info = document.createElement('span')
    size_info.appendChild(document.createTextNode(
      ' ' + lang('form:file_max_size', 0, this.form_root.options.upload_max_filesize)
    ))
    span.appendChild(size_info)

    this.dom_element = input;
    this.dom_element.onblur=this.notify_change.bind(this);
    this.dom_element.onchange=this.notify_change_file.bind(this);
  }

  var span;
  if(span=document.getElementById(this.id+"-oldfile")) {
    if (this.dom_element_delete) {
      this.dom_element_delete.type = 'button'
      this.dom_element_delete.onclick=this.input_delete.bind(this);
    }

    span=document.getElementById(this.id+"-newfile");
    span.style.display="none";
  }

  return ret;
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
    if (this.options.var_name) {
      input.setAttribute("name", this.options.var_name+"[data]");
    }
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

    var txt=document.createTextNode(this.data.orig_name || this.data.name);
    span_value.appendChild(txt);

    span_value.appendChild(document.createElement("br"));
    span_value.appendChild(document.createTextNode(format_file_size(this.data.size)));

    var input=document.createElement("input");
    input.type="button";
    input.value=lang("delete");
    input.onclick=this.input_delete.bind(this);
    span.appendChild(input);
  }
  else {
    var input=document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("value", null);
    if (this.options.var_name) {
      input.setAttribute("name", this.options.var_name+"[data]");
    }
    div.appendChild(input);
  }

  // create input field for new file
  var span=document.createElement("label");
  span.setAttribute("id", this.id+"-newfile");
  if(this.data)
    span.style.display="none";
  div.appendChild(span);

  var input=document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("class", cls);
  if (this.options.var_name) {
    input.setAttribute("name", this.options.var_name+"[file]");
  }
  span.appendChild(input);

  var button = document.createElement('span')
  button.className = 'button'
  button.appendChild(document.createTextNode(lang("form:file_select")));
  span.appendChild(button)

  if (this.form_root.options.upload_max_filesize) {
    var size_info = document.createElement('span')
    size_info.appendChild(document.createTextNode(
      ' ' + lang('form:file_max_size', 0, this.form_root.options.upload_max_filesize)
    ))
    div.appendChild(size_info)
  }

  this.dom_element=input;
  this.dom_element.onblur=this.notify_change.bind(this);
  this.dom_element.onchange=this.notify_change_file.bind(this);

  return div;
}

form_element_file.prototype.notify_change_file=function() {
  this.parent("form_element_file").notify_change.call(this);

  var span=document.getElementById(this.id+"-newfile");
  var div = span.parentNode;
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
    input.value=lang("delete");
    input.onclick=this.input_delete.bind(this);
    span.appendChild(input);

    div.appendChild(span);
  }

  var span_value = span.firstChild;
  while(span_value.firstChild)
    span_value.removeChild(span_value.firstChild);

  var data = this.get_data();

  if(FileReader && this.js_file && data.type.match(/^image\//)) {
    var img=document.createElement("img");
    img.file = this.js_file;
    img.className = "form_element_file_preview";
    span_value.appendChild(img);

    var reader = new FileReader();
    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
    reader.readAsDataURL(this.js_file);

    span_value.appendChild(document.createTextNode(" "));
  }

  span_value.appendChild(document.createTextNode(data.orig_name || data.name));

  if(data.size) {
    span_value.appendChild(document.createElement("br"));
    span_value.appendChild(document.createTextNode(format_file_size(data.size)));
  }

  span.style.display="inline-block";
  span.className = "form_modified";
}

form_element_file.prototype.input_delete=function() {
  var span=document.getElementById(this.id+"-oldfile");
  span.style.display="none";

  this.dom_element.value = null;
  if (this.dom_element_orig) {
    this.dom_element_orig.value = 'null';
  }

  span=document.getElementById(this.id+"-newfile");
  span.style.display="inline-block";
}

form_element_file.prototype.get_data=function() {
  if(!this.dom_element)
    return this.data;

  // no new file -> check if there's data of an uploaded file
  if(!this.dom_element.value) {
    if(this.dom_element_orig) {
      return JSON.parse(this.dom_element_orig.value);
    }

    return null;
  }

  var data = {};
  this.js_file = null;

  if(this.dom_element.files) { // HTML5
    var file = this.dom_element.files[0];
    data.orig_name = file['name'];
    data.type = file['type'];
    data.size = file['size'];
    data.error = 0;
    data.ext = null;
    if(file['name'].lastIndexOf(".") != -1)
      data.ext = file['name'].substr(file['name'].lastIndexOf(".") + 1);

    this.js_file = file;
    data.file = this.js_file
  }
  else {
    data.orig_name = this.dom_element.value;
    // Chrome prefixes the file name by "C:\fakepath\" -> remove
    var m;
    if(m = data.orig_name.match(/^C:\\fakepath\\(.*)$/))
      data.orig_name = m[1];

    data.error = 0;
    data.size = null;
    data.ext = null;
    if(data.orig_name.lastIndexOf(".") != -1)
      data.ext = data.orig_name.substr(data.orig_name.lastIndexOf(".") + 1).toLowerCase();

    if(data.ext in form_element_file_types)
      data.type = form_element_file_types[data.ext];
    else
      data.type = "application/octet-stream";
  }

  if(this.def.template) {
    function zero_pad(num, places) {
      return ("00000000".substr(0, places)  + num).slice(-places);
    }

    data.name = this.def.template;

    data.name = data.name.replace("[orig_name]", data.name);
    data.name = data.name.replace("[ext]", data.ext);
    var d = new Date();
    data.name = data.name.replace("[timestamp]",
      d.getFullYear() + "-" +
      zero_pad(d.getMonth() + 1, 2) +"-" +
      zero_pad(d.getDate(), 2) + "-" +
      zero_pad(d.getHours(), 2) + "-" +
      zero_pad(d.getMinutes(), 2) + "-" +
      zero_pad(d.getSeconds(), 2));
  }
  else
    data.name = data.orig_name;

  return data;
}
