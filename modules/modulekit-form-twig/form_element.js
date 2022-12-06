form_element.prototype.check_twig = function (list, param) {
  if (typeof form_engine_twig === 'undefined') {
    console.log('modulekit-form: twig extension not enabled')
    return false
  }

  if (!param.template) {
    param.template = form_engine_twig({ data: param[0] })
  }

  const twigData = {
    value: this.get_data(),
    orig_value: this.get_orig_data(),
    data: this.form_root.get_data(),
    orig_data: this.form_root.get_orig_data(),
    path: this.path_name().split(/\//g)
  }

  const result = param.template.render(twigData)

  if (result.trim() !== '') {
    list.push(result)
  }
}

