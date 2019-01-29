form_element_select_other.inherits_from(form_element_select);
function form_element_select_other() {
}

form_element_select_other.prototype.init=function(id, def, options, form_parent) {
  this.parent("form_element_select_other").init.call(this, id, def, options, form_parent)

  var other_options = new clone(this.options)
  other_options.var_name = this.options.var_name + '[other]'

  var other_def = { type: 'text' }
  if (this.def.other_def) {
    other_def = this.def.other_def
  }

  this.other_form = form_create_element(this.id + '_other', other_def, other_options, this)
  this.other_orig_is_set = false
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
    this.other_dom.style.display = 'none'
    return
  }

  this.other_option.selected = true
  this.other_dom.style.display = 'block'
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

form_element_select_other.prototype.refresh = function (force) {
  this.parent("form_element_select_other").refresh.call(this, force)
  this.other_form.refresh()
}