<?
class form_element_form extends form_element {
  function type() {
    return "form";
  }

  function __construct($id, $def, $options, $parent) {
    parent::__construct($id, $def, $options, $parent);

    $this->build_form();
  }

  function path_name() {
    if($this->parent===null)
      return null;

    return parent::path_name();
  }

  function build_form() {
    $this->elements=array();

    foreach($this->def['def'] as $k=>$element_def) {
      $element_class="form_element_{$element_def['type']}";
      $element_id="{$this->id}_{$k}";
      $element_options=$this->options;
      $element_options['var_name']="{$this->options['var_name']}[{$k}]";

      if(class_exists($element_class)) {
	$this->elements[$k]=new $element_class($element_id, $element_def, $element_options, $this);
      }
    }
  }

  function get_data() {
    $data=array();
    foreach($this->elements as $k=>$element) {
      $data[$k]=$element->get_data();
    }

    return $data;
  }

  function set_data($data) {
    foreach($this->elements as $k=>$element) {
      if(isset($data[$k]))
	$element->set_data($data[$k]);
      else
	$element->set_data(null);
    }
  }

  function set_request_data($data) {
    foreach($this->elements as $k=>$element) {
      if(isset($data[$k]))
	$element->set_request_data($data[$k]);
      else
	$element->set_request_data(null);
    }
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

  function errors($errors) {
    foreach($this->elements as $k=>$element) {
      $element->errors(&$errors);
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
    $table->setAttribute("id", $this->id);
    $table->setAttribute("class", "form");

    foreach($this->elements as $k=>$element) {
      $table->appendChild($element->show($document));
    }

    return $table;
  }
}
