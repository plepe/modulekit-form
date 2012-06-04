function form(id, def, options) {
  this.id=id;
  this.def=def;
  if(!options)
    options={};
  this.options=options;
  if(!this.options.var_name)
    this.options.var_name=this.id;

  this.has_data=false;

  this.build_form();

  this.table=document.getElementById(this.id);
  if(this.table) {
    // connect elements to php-form
    this.connect(this.table);

    // read orig_data
    var orig_data;
    var inputs=document.getElementsByTagName("input");
    for(var i=0; i<inputs.length; i++) {
      if(inputs[i].name=="form_orig_"+this.options.var_name)
	orig_data=json_decode(inputs[i].value);
    }

    // set orig_data to elements
    if(orig_data)
      this.set_orig_data(orig_data);
  }
}

form.prototype.build_form=function() {
  var def={
    type: 'form',
    def: this.def
  };

  this.element=new form_element_form();
  this.element.init(this.id, def, this.options, null);
}

form.prototype.connect=function() {
  var def={
    type: 'form',
    def: this.def
  };

  var element_dom_parent=document.getElementById(this.id);
  this.element.connect(element_dom_parent);
}

form.prototype.get_data=function() {
  return this.element.get_data();
}

form.prototype.set_data=function(data) {
  this.has_data=true;

  this.element.set_data(data);

  if(!this.has_orig_data)
    this.set_orig_data(data);
}

form.prototype.set_orig_data=function(data) {
  this.has_orig_data=true;

  this.element.set_orig_data(data);
}

form.prototype.get_orig_data=function(data) {
  if(!this.has_orig_data)
    return this.get_data();

  return this.element.get_orig_data();
}

form.prototype.show=function(dom_parent) {
  // Include a hidden submit button as default action, to prevent that other submit buttons (e.g. for removing/adding elements in array elements) get precedence for default submit actions (e.g. user presses enter)
  var div=document.createElement("div");
  div.setAttribute("style", "width: 0px; height: 0px; overflow: hidden;");
  div.innerHTML="<input type='submit'>";
  dom_parent.appendChild(div);

  // render the form
  this.table=this.element.show_element();

  dom_parent.appendChild(this.table);
  return this.table;
}

form.prototype.errors=function() {
  var list=[];

  this.element.errors(list);

  if(list.length==null)
    return false;

  return list;
}

form.prototype.show_errors=function(div) {
  var ul=document.createElement("ul");
  div.appendChild(ul);

  var list=this.errors();
  for(var i=0; i<list.length; i++) {
    var li=document.createElement("li");
    var text=document.createTextNode(list[i]);
    li.appendChild(text);
    ul.appendChild(li);
  }
}
