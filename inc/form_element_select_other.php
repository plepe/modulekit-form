<?php
class form_element_select_other extends form_element_select {
  function __construct($id, $def, $options, $form_parent) {
    parent::__construct($id, $def, $options, $form_parent);

    $other_options = $this->options;
    $other_options['var_name'] = $this->options['var_name'] . '[other]';

    $other_def = array('type' => 'text');
    if (isset($this->def['other_def'])) {
      $other_def = $this->def['other_def'];
    }

    $this->other_form = form_create_element($this->id . '_other', $other_def, $other_options, $this);
    $this->other_is_set = false;
    $this->other_orig_is_set = false;
  }

  function set_orig_data($data) {
    parent::set_orig_data($data);

    $this->other_orig_is_set = false;
    $values = $this->get_values();
    if (array_key_exists($data, $values)) {
      return;
    }

    $this->other_orig_is_set = true;
    $this->other_form->set_orig_data($data);
  }

  function set_data($data) {
    parent::set_data($data);

    $this->other_is_set = false;
    $values = $this->get_values();
    if (array_key_exists($data, $values)) {
      return;
    }

    $this->other_is_set = true;
    $this->other_form->set_data($data);
  }

  function set_request_data($data) {
    $this->other_is_set = false;

    if (isset($data['other'])) {
      $this->other_form->set_request_data($data['other']);
      unset($data['other']);
      $this->other_is_set = true;
    }

    if (isset($data['main'])) {
      if ($data['main'] === '__other__') {
        $this->other_is_set = true;
      } else {
        parent::set_request_data($data['main']);
        $this->other_is_set = false;
      }
    }
  }

  function get_data() {
    $ret = parent::get_data();
    if ($this->other_is_set) {
      $ret = $this->other_form->get_data();
    }

    return $ret;
  }

  function get_orig_data() {
    $ret = parent::get_orig_data();
    if ($this->other_orig_is_set) {
      $ret = $this->other_form->get_orig_data();
    }

    return $ret;
  }

  function show_element($document) {
    $div=parent::show_element($document);

    $this->dom_element->setAttribute('name', $this->options['var_name'] . '[main]');

    $this->other_option = $document->createElement('option');
    $this->other_option->setAttribute('value', '__other__');
    $this->other_option->appendChild($document->createTextNode(isset($this->def['button:other']) ? $this->def['button:other'] : 'Other'));

    $this->dom_element->appendChild($this->other_option);

    $this->other_dom = $document->createElement('div');
    $d = $this->other_form->show_element($document);
    $div->appendChild($this->other_dom);
    $this->other_dom->appendChild($d);
    
    $values = $this->get_values();
    if ($this->other_is_set) {
      $this->other_option->setAttribute('selected', 'selected');
    } else {
      $this->other_dom->setAttribute('style', 'display: none;');
    }

    return $div;
  }
}
