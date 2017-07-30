<?php
class form_element_form extends form_element {
  function type() {
    return "form";
  }

  function __construct($id, $def, $options, $form_parent) {
    parent::__construct($id, $def, $options, $form_parent);

    $this->build_form();
  }

  function build_form() {
    $this->elements=array();

    foreach($this->def['def'] as $k=>$element_def) {
      $element_class=get_form_element_class($element_def);

      $element_id="{$this->id}_{$k}";
      $element_options=$this->options;
      $element_options['var_name'] = form_build_child_var_name($this->options, $k);

      $this->elements[$k]=new $element_class($element_id, $element_def, $element_options, $this);
    }
  }

  function get_data() {
    $data=array();
    foreach($this->elements as $k=>$element) {
      if($element->include_data())
	$data[$k]=$element->get_data();
    }

    return $data;
  }

  function set_data($data) {
    if($data)
      foreach($data as $k=>$d) {
	if(isset($this->elements[$k]))
	  $this->elements[$k]->set_data($d);
      }
  }

  function set_request_data($data) {
    $ret = true;

    foreach($this->elements as $k=>$element) {
      if(!isset($data[$k]))
	$data[$k] = null;

      $r = $element->set_request_data($data[$k]);

      if($r === false)
	$ret = false;
    }

    return $ret;
  }

  function set_orig_data($data) {
    foreach($this->elements as $k=>$element) {
      if(isset($data[$k]))
	$element->set_orig_data($data[$k]);
      else
	$element->set_orig_data(null);
    }
  }

  function get_orig_data() {
    $data=array();
    foreach($this->elements as $k=>$element) {
      $data[$k]=$element->get_orig_data();
    }

    return $data;
  }

  function all_errors(&$errors) {
    parent::all_errors($errors);

    foreach($this->elements as $k=>$element) {
      $element->all_errors($errors);
    }
  }

  function is_complete() {
    foreach($this->elements as $k=>$element) {
      if(!$element->is_complete())
	return false;
    }

    return true;
  }

  function show_element($document) {
    $table=$document->createElement("table");
    $table->setAttribute("class", 'form_element_form');
    $table->setAttribute("id", $this->id);
    $element_list = array();

    foreach($this->elements as $k=>$element) {
      $element_list[] = array($element->weight(), $element->show($document));
    }

    $element_list = weight_sort($element_list);

    foreach($element_list as $element) {
      $table->appendChild($element);
    }

    return $table;
  }

  function save_data() {
    parent::save_data();

    foreach($this->elements as $k=>$element) {
      $element->save_data();
    }
  }

  function is_modified() {
    foreach($this->elements as $k=>$element) {
      if($element->is_modified())
	return true;
    }

    return false;
  }

  function refresh($force=false) {
    parent::refresh($force);

    foreach($this->elements as $k=>$element) {
      $element->refresh($force);
    }
  }
}
