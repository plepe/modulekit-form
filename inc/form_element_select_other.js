form_element_select_other.inherits_from(form_element_select);
function form_element_select_other() {
}

form_element_select_other.prototype.init=function(id, def, options, form_parent) {
  var other_options = new clone(options)
  other_options.var_name = options.var_name + '[other]'

  var other_def = { type: 'text' }
  if (def.other_def) {
    other_def = def.other_def
  }

  this.other_orig_is_set = false
  if(form_parent==null)
    this.form_root=this;
  else
    this.form_root=form_parent.form_root;

  this.other_form = form_create_element(id + '_other', other_def, other_options, this)

  this.parent("form_element_select_other").init.call(this, id, def, options, form_parent)
}

form_element_select_other.prototype.connect = function (dom_parent) {
  this.parent("form_element_select_other").connect.call(this, dom_parent)

  this.other_dom = dom_parent.lastChild
  this.other_form.connect(this.other_dom.firstChild)

  this.other_option = this.dom_element.lastChild
}

form_element_select_other.prototype.finish_connect = function (dom_parent) {
  this.parent("form_element_select_other").finish_connect.call(this, dom_parent)
  this.other_form.finish_connect(this.other_dom.firstChild)
}

form_element_select_other.prototype.get_data = function () {
  if (!this.dom_element) {
    return this.data
  }

  if (this.dom_element.selectedOptions.length && this.dom_element.selectedOptions[0] === this.other_option) {
    this.other_dom.style.display = 'block'
    return this.other_form.get_data()
  } else {
    this.other_dom.style.display = 'none'
  }

  return this.parent("form_element_select_other").get_data.call(this);
}

form_element_select_other.prototype.set_data = function (data) {
  this.parent("form_element_select_other").set_data.call(this, data);

  if (data in this.get_values()) {
    if (this.other_dom) {
      this.other_dom.style.display = 'none'
    }

    return
  }

  if (this.other_dom) {
    this.other_option.selected = true
    this.other_dom.style.display = 'block'
  }

  this.other_form.set_data(data)
}

form_element_select_other.prototype.set_orig_data = function (data) {
  this.parent("form_element_select_other").set_orig_data.call(this, data);

  this.other_orig_is_set = false
  if (data in this.get_values()) {
    return
  }

  this.other_orig_is_set = true
  this.other_form.set_orig_data(data)
}

form_element_select_other.prototype.get_orig_data = function () {
  var ret = this.parent("form_element_select_other").get_orig_data.call(this);
  if (this.other_orig_is_set) {
    ret = this.other_form.get_orig_data()
  }

  return ret
}

form_element_select_other.prototype.update_options = function () {
  var other_selected = this.dom_element.selectedOptions.length && this.dom_element.selectedOptions[0] === this.other_option

  this.parent("form_element_select_other").update_options.call(this)

  this.dom_element.name = this.options.var_name + '[main]'

  this.other_option = document.createElement('option')
  this.other_option.appendChild(document.createTextNode(this.def['button:other'] || 'Other'))
  this.other_option.value = '__other__'

  this.dom_element.appendChild(this.other_option)

  if (!this.other_dom) {
    this.other_dom = document.createElement('div')
    this.other_dom.style.display = 'none'
    var d = this.other_form.show_element()
    this.dom.appendChild(this.other_dom)
    this.other_dom.appendChild(d)
  }

  if (other_selected) {
    this.other_dom.style.display = 'block'
    this.other_option.selected = true
  }
}

form_element_select_other.prototype.show_element = function () {
  let data = this.get_data();

  var div = this.parent("form_element_select_other").show_element.call(this);

  if (!(data in this.get_values())) {
    this.other_dom = document.createElement('div')

    var d = this.other_form.show_element()
    this.dom.appendChild(this.other_dom)
    this.other_dom.appendChild(d)

    this.other_dom.style.display = 'block'
    this.other_option.selected = true
  }

  return div;
}

form_element_select_other.prototype.refresh = function (force) {
  this.parent("form_element_select_other").refresh.call(this, force)
  this.other_form.refresh()

  if (this.dom_element) {
    let data = this.get_data()
    let values = this.get_values()

    if (!(this.orig_data in values) && !(data in values)) {
      this.dom_element.className = 'form_orig'
    }
  }
}

form_element_select_other.prototype.check_other_selected=function(list, param) {
  if (this.dom_element.selectedOptions.length && this.dom_element.selectedOptions[0] === this.other_option) {
    return;
  }

  if(param.length<1)
    list.push(lang('form:invalid_value'));
  else
    list.push(param[0]);
}
