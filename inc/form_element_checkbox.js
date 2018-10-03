form_element_checkbox.inherits_from(form_element);
function form_element_checkbox() {
}

form_element_checkbox.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_checkbox").init.call(this, id, def, options, form_parent);
  if(this.data === null)
    this.data=[];
  this.dom_values=null;
}

form_element_checkbox.prototype.connect=function(dom_parent) {
  this.parent("form_element_checkbox").connect.call(this, dom_parent);

  var current=this.dom_parent.firstChild;
  this.dom_values={};
  while(current) {
    if(current.nodeName=="SPAN") {
      var dom=current.firstChild;
      this.dom_values[dom.value]=dom;

      dom.onchange=this.notify_change.bind(this);
    }

    current=current.nextSibling;
  }

  this.values = this.get_values();
}

form_element_checkbox.prototype.get_data=function() {
  if(!this.dom_values)
    return this.data;

  var data = []

  for (var i in this.dom_values) {
    if (this.dom_values[i].checked)
      data.push(i)
  }

  return data
}

form_element_checkbox.prototype.set_data=function(data) {
  this.parent("form_element_checkbox").set_data.call(this, data);

  if(!this.dom_values)
    return;

  for(var k in this.dom_values) {
    this.dom_values[k].checked=false;
  }

  if(!this.data)
    return;

  for(var i=0; i<this.data.length; i++) {
    var k=this.data[i];
    if (!(k in this.dom_values)) {
      this.show_element_value(k, k)
    }

    this.dom_values[k].checked=true;
  }
}

form_element_checkbox.prototype.show_element=function() {
  var div=this.parent("form_element_checkbox").show_element.call(this);
  this.get_data();

  this.update_options();

  return div;
}

form_element_checkbox.prototype.show_element_value = function(k, value) {
  var id=this.id+"-"+k;

  var cls="form_orig";
  // TODO: check for changed data

  var span=document.createElement("span");
  span.className=cls;
  if (!this.dom_last_value) {
    this.dom.appendChild(span);
  } else {
    this.dom.insertBefore(span, this.dom_last_value.nextSibling);
  }
  this.dom_last_value = span

  var input=document.createElement("input");
  input.type="checkbox";
  input.id=id;
  input.name=this.options.var_name+"[]";
  input.value=k;
  // TODO: indexOf not supported in IE8 and earlier
  if(this.data && (this.data.indexOf(k)!=-1))
    input.checked=true;
  span.appendChild(input);
  this.dom_values[k]=input;

  input.onchange=this.notify_change.bind(this);

  var label=document.createElement("label");
  label.setAttribute("for", id);
  var text=document.createTextNode(get_value_string(value));
  label.appendChild(text);
  span.appendChild(label);

  var desc = get_value_string(value, "desc");
  if(desc) {
    var desc_label = document.createElement("span");
    desc_label.setAttribute("class", "description");
    desc_label.appendChild(document.createTextNode(desc));
    span.appendChild(desc_label);
  }
}

form_element_checkbox.prototype.update_options = function() {
  var data = this.get_data()

  while(this.dom.firstChild)
    this.dom.removeChild(this.dom.firstChild);

  this.dom_values={};
  var values=this.get_values();

  if (this.def.auto_add_values) {
    for (var i in data) {
      if (!(data[i] in values)) {
        values[data[i]] = data[i];
      }
    }
  }

  for(var k in values) {
    var id=this.id+"-"+k;

    var cls="form_orig";
    // TODO: check for changed data

    var span=document.createElement("span");
    span.className=cls;
    this.dom.appendChild(span);

    var input=document.createElement("input");
    input.type="checkbox";
    input.id=id;
    if (this.options.var_name) {
      input.name=this.options.var_name+"[]";
    }
    input.value=k;
    // TODO: indexOf not supported in IE8 and earlier
    if(this.data && (this.data.indexOf(k)!=-1))
      input.checked=true;
    span.appendChild(input);
    this.dom_values[k]=input;

    input.onchange=this.notify_change.bind(this);

    var label=document.createElement("label");
    label.setAttribute("for", id);
    var text=document.createTextNode(get_value_string(values[k]));
    label.appendChild(text);
    span.appendChild(label);

    var desc = get_value_string(values[k], "desc");
    if(desc) {
      var desc_label = document.createElement("span");
      desc_label.setAttribute("class", "description");
      desc_label.appendChild(document.createTextNode(desc));
      span.appendChild(desc_label);
    }
  }

  for(var k in values) {
    this.show_element_value(k, values[k])
  }

  if(('check_all' in this.def) && (this.def.check_all)) {
    this.input_check_all = document.createElement("input");
    this.input_check_all.setAttribute("type", "button");
    if (this.options.var_name) {
      this.input_check_all.setAttribute("name", this.options.var_name + "[__check_all]");
    }
    this.input_check_all.setAttribute("value", lang("form:check_all"));
    this.input_check_all.onclick = function() {
      for(k in this.dom_values)
	this.dom_values[k].checked = true;

      this.notify_change();
    }.bind(this);
    this.dom.appendChild(this.input_check_all);
  }

  if(('uncheck_all' in this.def) && (this.def.uncheck_all)) {
    this.input_uncheck_all = document.createElement("input");
    this.input_uncheck_all.setAttribute("type", "button");
    if (this.options.var_name) {
      this.input_uncheck_all.setAttribute("name", this.options.var_name + "[__uncheck_all]");
    }
    this.input_uncheck_all.setAttribute("value", lang("form:uncheck_all"));
    this.input_uncheck_all.onclick = function() {
      for(k in this.dom_values)
	this.dom_values[k].checked = false;

      this.notify_change();
    }.bind(this);
    this.dom.appendChild(this.input_uncheck_all);
  }

  if (('presets' in this.def) && (this.def.presets)) {
    this.input_presets = document.createElement('select')
    if (this.options.var_name) {
      this.input_presets.setAttribute('name', this.options.var_name + '[__presets]')
    }

    this.input_presets.onchange = function () {
      var v = this.input_presets.value
      if (v === '') {
        return
      }

      for (var k in this.dom_values) {
        this.dom_values[k].checked = false
      }

      var data = this.def.presets[v].values
      for (var i = 0; i < data.length; i++) {
        if (data[i] in this.dom_values) {
          this.dom_values[data[i]].checked = true
        }
      }

      this.notify_change()
    }.bind(this)

    var placeholder
    if('presets:label' in this.def)
      if(typeof this.def['presets:label'] === 'object')
        placeholder = lang(this.def['presets:label'])
      else
        placeholder = this.def['presets:label']
    else
      placeholder = lang('form:load_preset')

    var option = document.createElement('option')
    option.setAttribute('value', '')
    option.appendChild(document.createTextNode(placeholder))
    this.input_presets.appendChild(option)

    for (var k in this.def.presets) {
      var v = this.def.presets[k]
      var option = document.createElement('option')
      option.setAttribute('value', k)
      option.appendChild(document.createTextNode(get_value_string(v)))
      var desc = get_value_string(v, 'desc')
      if (desc) {
        option.setAttribute('title', desc)
      }
      this.input_presets.appendChild(option)
    }

    this.dom.appendChild(this.input_presets)
  }

  return values;
}

form_element_checkbox.prototype.refresh=function(force) {
  this.parent("form_element_checkbox").refresh.call(this, force);

  if(!this.dom_values)
    return;

  var old_values = this.values;
  this.values = this.get_values();

  if(!array_compare(this.values, old_values))
    this.update_options();

  for(var k in this.values) {
    var cls="form_orig";

    if(this.orig_data&&
       (this.data!=this.orig_data)&&
       (in_array(k, this.orig_data)!=in_array(k, this.data)))
      cls="form_modified";

    this.dom_values[k].parentNode.className=cls;
  }
}

form_element_checkbox.prototype.is_modified=function() {
  return array_compare_values(this.get_data(), this.get_orig_data());
}

form_element_checkbox.prototype.notify_change = function() {
  // Reset preset selector (if selection does not match current preset)
  if (this.input_presets) {
    var v = this.input_presets.value
    if (v !== '') {
      if (!array_compare(this.get_data(), this.def.presets[v].values)) {
        this.input_presets.value = ''
      }
    }
  }

  this.parent("form_element_checkbox").notify_change.call(this)
}
