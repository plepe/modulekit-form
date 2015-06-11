form_element_hash.inherits_from(form_element_array);
function form_element_hash() {
}

form_element_hash.prototype.init=function(id, def, options, form_parent) {
  def = new clone(def);

  if(!('key_def' in def)) {
    def.key_def = {
      'type': 'text',
      'name': lang('form:hash_key_field_name')
    };
  }

  def.key_def.req = true;
  if('check' in def.key_def)
    def.key_def.check = [ 'and' , def.key_def.check , [ 'unique', '../*/@k' ] ];
  else
    def.key_def.check = [ 'unique', '../*/@k' ];

  if(!('def' in def)) {
    alert("Form Element Hash: ERROR: required option 'def'");
    return;
  }

  if(def.def.type == 'form') {
    def.def.def = array_merge({ '@k': def.key_def }, def.def.def);
    this.value_is_form = true;
  }
  else {
    if(!('name' in def.def))
      def.def.name = lang('form:hash_value_field_name');

    def.def = {
      'type': 'form',
      'def': {
        '@k': def.key_def,
        '@v': def.def
      }
    };

    this.value_is_form = false;
  }

  this.parent("form_element_hash").init.call(this, id, def, options, form_parent);
}

form_element_hash.prototype._expand_data=function(data) {
  var new_data = {};
  var i = 0;

  if(this.value_is_form) {
    for(var k in data) {
      new_data[i++] = array_merge({'@k': k}, data[k]);
    }
  }
  else {
    for(var k in data) {
      new_data[i++] = {'@k': k, '@v': data[k]};
    }
  }

  return new_data;
}

form_element_hash.prototype._shrink_data=function(data) {
  var new_data = {};

  if(this.value_is_form) {
    for(var k in data) {
      var v = new clone(data[k]);
      var k1 = v['@k'];
      delete(v['@k']);
      new_data[k1] = v;
    }
  }
  else {
    for(var k in data) {
      new_data[data[k]['@k']] = data[k]['@v'];
    }
  }

  return new_data;
}

form_element_hash.prototype.set_data=function(data) {
  this.parent("form_element_hash").set_data.call(this, this._expand_data(data));
}

form_element_hash.prototype.get_data=function() {
  return this._shrink_data(this.parent("form_element_hash").get_data.call(this));
}

form_element_hash.prototype.set_orig_data=function(data) {
  this.parent("form_element_hash").set_orig_data.call(this, this._expand_data(data));
}

form_element_hash.prototype.get_orig_data=function() {
  return this._shrink_data(this.parent("form_element_hash").get_orig_data.call(this));
}
