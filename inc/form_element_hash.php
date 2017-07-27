<?php
class form_element_hash extends form_element_array {
  function __construct($id, $def, $options, $form_parent) {
    if(!array_key_exists('key_def', $def)) {
      $def['key_def'] = array(
        'type'  => 'text',
        'name'  => lang('form:hash_key_field_name'),
      );
    }

    $def['key_def']['req'] = true;

    if(array_key_exists('check', $def['key_def']))
      $def['key_def']['check'] = array('and', $def['key_def']['check'], array('unique', '../*/@k'));
    else
      $def['key_def']['check'] = array('unique', '../*/@k');

    if(!array_key_exists('def', $def)) {
      print "Form Element Hash: ERROR: required option 'def'";
      return;
    }

    if($def['def']['type'] == 'form') {
      $def['def']['def'] = array_merge(array('@k' => $def['key_def']), $def['def']['def']);

      $this->value_is_form = true;
    }
    else {
      if(!array_key_exists('name', $def['def']))
        $def['def']['name'] = lang('form:hash_value_field_name');

      $def['def'] = array(
        'type' => 'form',
        'def'  => array(
          '@k'    => $def['key_def'],
          '@v'    => $def['def']
        ),
      );

      $this->value_is_form = false;
    }

    parent::__construct($id, $def, $options, $form_parent);
  }

  function _expand_data($data) {
    $new_data = array();
    if (!$data) {
      $data = array();
    }

    if($this->value_is_form) {
      foreach($data as $k=>$v) {
        $new_data[] = array_merge(array('@k' => $k), $v);
      }
    }
    else {
      foreach($data as $k=>$v) {
        $new_data[] = array('@k' => $k, '@v' => $v);
      }
    }

    return $new_data;
  }

  function _shrink_data($data) {
    $new_data = array();
    if (!$data) {
      $data = array();
    }

    if($this->value_is_form) {
      foreach($data as $v) {
        $k = $v['@k'];
        unset($v['@k']);
        $new_data[$k] = $v;
      }
    }
    else {
      foreach($data as $v) {
        $new_data[$v['@k']] = $v['@v'];
      }
    }
    
    return $new_data;
  }

  function set_data($data) {
    parent::set_data($this->_expand_data($data));
  }

  function get_data() {
    return $this->_shrink_data(parent::get_data());
  }

  function set_orig_data($data) {
    parent::set_orig_data($this->_expand_data($data));
  }

  function get_orig_data() {
    return $this->_shrink_data(parent::get_orig_data());
  }
}
