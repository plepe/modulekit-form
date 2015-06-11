function form(id, def, options) {
  this.id=id;
  this.def=def;
  form_process_def(this.def);
  if(!options)
    options={};
  this.options=options;
  if(!'var_name' in this.options)
    this.options.var_name=this.id;

  this.has_data=false;

  this.build_form();

  this.table=document.getElementById(this.id);
  if(this.table) {
    // connect elements to php-form
    this.connect(this.table);

    // read orig_data
    var orig_data;
    if("form_orig_"+this.options.var_name in window)
      orig_data = window["form_orig_"+this.options.var_name];
    else {
      var inputs=document.getElementsByTagName("input");
      for(var i=0; i<inputs.length; i++) {
	if(inputs[i].name=="form_orig_"+this.options.var_name)
	  orig_data=JSON.parse(inputs[i].value);
      }
    }

    // set orig_data to elements
    if(orig_data)
      this.set_orig_data(orig_data);
  }

  if(window.addEventListener) {
    window.addEventListener('load', this.resize.bind(this));
    window.addEventListener('resize', this.resize.bind(this));
  }
  else {
    window.attachEvent('onload', this.resize.bind(this));
    window.attachEvent('onresize', this.resize.bind(this));
  }
}

form.prototype.resize=function() {
  var obs1=this.table.getElementsByTagName("table");
  var obs = [ this.table ];
  for(var i=0; i<obs1.length; i++)
    obs.push(obs1[i]);

  for(var i=0; i<obs.length; i++) {
    var ob=obs[i];
    if(in_array("form", ob.className.split(" "))) {
      // form is invisible
      if(!ob.parentNode)
        return;

      var width=ob.parentNode.offsetWidth;
      var em_height = get_em_height(ob);

      // set class according to width
      if(width/em_height<=25)
	ob.className="form small";
      else if(width/em_height<=40)
	ob.className="form medium";
      else
	ob.className="form";
    }
  }

  this.refresh(true);
}

form.prototype.build_form=function() {
  var def={
    type: 'form',
    def: this.def
  };

  this.element=new form_element_form();
  this.element.init(this.id, def, this.options, null);
  this.element.form=this;
}

form.prototype.connect=function() {
  var def={
    type: 'form',
    def: this.def
  };

  var element_dom_parent=document.getElementById(this.id);
  this.element.connect(element_dom_parent);
  this.element.finish_connect();

  call_hooks('form_connected', this);
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

  this.refresh();
}

form.prototype.is_modified=function() {
  return this.element.is_modified();
}

form.prototype.refresh=function(force) {
  this.element.refresh(force);
}

form.prototype.reset=function() {
  this.set_orig_data(this.get_data());
  this.refresh();
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

  this.resize();

  call_hooks('form_connected', this);

  return this.table;
}

form.prototype.errors=function() {
  var list=[];

  this.element.all_errors(list);

  if((list.length==null) || (list.length == 0))
    return false;

  return list;
}

form.prototype.is_empty=function() {
  return !this.has_data;
}

form.prototype.clear=function() {
  this.has_data = false;
}

form.prototype.is_complete=function() {
  if(!this.has_data)
    return false;

  if(this.errors())
    return false;

  return this.element.is_complete();
}

form.prototype.show_errors=function(div) {
  this.element.show_errors();

  if(!div)
    return;

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

form.prototype.notify_change=function() {
  if(this.onchange)
    this.onchange();
}

form.prototype.get_request_data = function() {
  var types = [ "input", "select", "textarea" ];
  var ret = {};

  for(var type_i = 0; type_i < types.length; type_i ++) {
    var obs = this.table.getElementsByTagName(types[type_i]);
    for(var i = 0; i < obs.length; i++) {
      var ob = obs[i];
      var active = true;
      var path;

      if(ob.type == "submit")
        active = false;
      if((ob.type == "checkbox") || (ob.type == "radio"))
        active = ob.checked;
      if(!ob.name)
        active = false;

      if(active) {
        if(ob.name.indexOf("[") == -1)
          path = [ ob.name ];
        else {
          path = [ ob.name.slice(0, ob.name.indexOf("[")) ];
          path = path.concat(ob.name.slice(ob.name.indexOf("[") + 1, ob.name.length - 1).split("]["));
        }

        var r = ret;
        for(var p = 0; p < path.length; p++) {
          var v = path[p];
          if(v == "")
            v = arr_count(r);

          if(p == path.length - 1) {
            r[v] = ob.value;
          }
          else {
            if(!(v in r))
              r[v] = {};
          }

          r = r[v];
        }
      }
    }
  }

  return ret;
}

function arr_count(arr) {
  var ret = 0;

  for(var k in arr)
    ret++;

  return ret;
}

var em_height_cache = {};
function get_em_height(dom_el) {
  var font_size = elementCurrentStyle(dom_el, "font-size");

  if(!(font_size in em_height_cache)) {
    // calculate height of M
    var em=document.createElement("div");
    em.setAttribute("style", "display:inline-block; padding:0; line-height:1; position:absolute; visibility:hidden; font-size:1em;");
    em.appendChild(document.createTextNode("M"));
    dom_el.appendChild(em);
    em_height_cache[font_size] = em.offsetHeight;
    dom_el.removeChild(em);

  }

  return em_height_cache[font_size];
}

function form_process_def(def) {
  for(var k in def) {
    var element_def=new clone(def[k]);

    if(element_def.count&&(!in_array(element_def.type, ["array", "hash"]))) {
      def[k]=element_def.count;

      if(typeof def[k] != "object") {
	def[k] = {
	  "default":	def[k],
	  "max":	def[k]
	};
      }

      def[k].type="array";

      if(element_def.name)
	def[k].name=element_def.name;
      if(element_def.desc)
	def[k].desc=element_def.desc;

      delete(element_def.name);
      delete(element_def.desc);
      delete(element_def.count);

      def[k].def=element_def;
    }

    if(((element_def.type=="array")||(element_def.type=="form"))&&
       def[k].def.def)
      form_process_def(def[k].def.def);
  }
}
