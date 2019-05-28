const form_element_unsupported = require('./form_element_unsupported')

const aliases = {}
const types = {}

module.exports = {
  register_type (type, _class) {
    types[type] = _class
  },

  register_alias (alias, type) {
    aliases[alias] = type
  },

  get (def) {
    if (def.type in aliases) {
      return types[aliases[def.type]]
    }

    if (def.type in types) {
      return types[def.type]
    } else {
      return form_element_unsupported
    }
  }
}
