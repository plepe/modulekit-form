<?php
class form_element_select_other extends form_element_select {
  function __construct($id, $def, $options, $form_parent) {
    parent::__construct($id, $def, $options, $form_parent);

    $other_options = $this->options;
    $other_options['var_name'] = $this->options['var_name'] . '[other]';
    $this->other_form = form_create_element($this->id . '_other', $this->def['other_def'], $other_options, $this);

  }

  function set_data($data) {
    parent::set_data($data);

    $values = $this->get_values();
    if (array_key_exists($data, $values)) {
      return;
    }

    if (isset($this->def['other']) && ($this->def['other'])) {
      $this->other_form->set_data($data);
    }
  }

  function set_request_data($data) {
    if (isset($data['other'])) {
      $this->other_form->set_request_data($data['other']);
      unset($data['other']);
    }

    if (isset($data['main'])) {
      parent::set_request_data($data['main']);
    }
  }

  function get_data() {
    $ret = parent::get_data();
    if (!$ret) {
      $ret = $this->other_form->get_data();
    }

    return $ret;
  }

  function show_element($document) {
    $div=parent::show_element($document);

    $this->dom_element->setAttribute('name', $this->options['var_name'] . '[main]');

    if (isset($this->def['other']) && ($this->def['other'])) {
      $this->other_option = $document->createElement('option');
      $this->other_option->setAttribute('value', '');
      $this->other_option->appendChild($document->createTextNode(isset($this->def['button:other']) ? $this->def['button:other'] : 'Other'));

      $this->dom_element->appendChild($this->other_option);

      $this->other_dom = $document->createElement('div');
      $d = $this->other_form->show_element($document);
      $div->appendChild($this->other_dom);
      $this->other_dom->appendChild($d);
      
      $values = $this->get_values();
      if (array_key_exists($this->data, $values)) {
        $this->other_dom->setAttribute('style', 'display: none;');
      }
      else {
        $this->other_option->setAttribute('selected', 'selected');
      }
    }

    return $div;
  }


}
