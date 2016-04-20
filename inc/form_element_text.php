<?php
class form_element_text extends form_element {
  function type() {
    return "text";
  }

  function create_element($document) {
    $input=$document->createElement("input");
    $input->setAttribute("type", "text");

    return $input;
  }

  function show_element($document) {
    $div=parent::show_element($document);

    // check for changes
    $class="form_orig";
    if($this->is_modified())
      $class="form_modified";

    $input=$this->create_element($document);

    if(isset($this->def['html_attributes']))
      foreach($this->def['html_attributes'] as $k=>$v) {
        $input->setAttribute($k, $v);
      }

    $input->setAttribute("class", $class);
    $input->setAttribute("name", $this->options['var_name']);
    $input->setAttribute("value", $this->data);

    $values = $this->get_values();

    if($values) {
      $input->setAttribute("list", $this->id."-datalist");

      // Compatibility HTML4 browsers (i.e. IE8)
      $datalist_container=$document->createElement("span");
      $datalist_container->setAttribute("class", "form_datalist_container");

      $datalist=$document->createElement("datalist");
      $datalist->setAttribute("id", $this->id."-datalist");

      foreach($values as $k=>$v) {
        $option=$document->createElement("option");
        $option->setAttribute("value", get_value_string($v));
        $datalist->appendChild($option);

        $text=$document->createTextNode(get_value_string($v));
        $option->appendChild($text);
      }

      $div->appendChild($datalist_container);
      $datalist_container->appendChild($datalist);
    }


    $this->dom_element=$input;

    $div->appendChild($input);
    return $div;
  }

  function check_regexp(&$errors, $param) {
    if(sizeof($param)<1)
      return;

    $data = $this->get_data();

    if($data === null)
      return;

    if(!preg_match("/{$param[0]}/", $data)) {
      if(sizeof($param)<2)
	$errors[]="Ungültiger Wert";
      else
	$errors[]=$param[1];
    }
  }

  function check_not_regexp(&$errors, $param) {
    if(sizeof($param)<1)
      return;

    $data = $this->get_data();

    if($data === null)
      return;

    if(preg_match("/{$param[0]}/", $data)) {
      if(sizeof($param)<2)
	$errors[]="Ungültiger Wert";
      else
	$errors[]=$param[1];
    }
  }

  function get_data() {
    $data=parent::get_data();

    if(($data==="")||($data===null)) {
      if(array_key_exists('empty_value', $this->def))
	return $this->def['empty_value'];

      return null;
    }

    return $data;
  }

  function errors(&$errors) {
    parent::errors($errors);

    $values = $this->get_values();

    if(($this->data!="")||($this->data!=null)) {
      if(isset($this->def['force_values'])&&($this->def['force_values'])&&
         ($values)) {
        if(!in_array($this->data, $values)) {
          $errors[]=lang('form:invalid_value');
        }
      }

      if(isset($this->def['max_length'])) {
        if(mb_strlen($this->data) > $this->def['max_length'])
          $errors[] = lang('form:max_length_exceeded', 0, $this->def['max_length']);
      }
    }
  }

  function is_modified() {
    $this->get_data();

    if( (($this->orig_data==="")||($this->orig_data===null))
      &&(($this->data==="")||($this->data===null)))
      return false;

    return parent::is_modified();
  }
}
