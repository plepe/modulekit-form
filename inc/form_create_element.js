const element_classes = require('./element_classes')

function form_create_element (id, def, options, parent) {
  let element_class = [ element_classes.get(def) ];

  let element = new element_class[0]()
  element.init(id, def, options, parent)
}

module.exports = form_create_element
