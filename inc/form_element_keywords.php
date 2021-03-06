<?php
class form_element_keywords extends form_element {
  function type() {
    return "keywords";
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
    $input->setAttribute("class", $class);
    $input->setAttribute("name", $this->options['var_name']);
    if($this->data)
      $input->setAttribute("value", implode(", ", $this->data));

    $values = $this->get_values();

    if($values) {
      $datalist=$document->createElement("datalist");
      $datalist->setAttribute("id", "{$this->id}-datalist");

      foreach($values as $value) {
	$option=$document->createElement("option");
	$option->setAttribute("value", get_value_string($value));

	$datalist->appendChild($option);
      }

      $div->appendChild($datalist);
    }

    $div->appendChild($input);
    return $div;
  }

  function set_request_data($data) {
    $ret = parent::set_request_data($data);

    if(is_string($this->data) && ($this->data !== "")) {
      $this->data=explode(",", $this->data);
      foreach($this->data as $i=>$d)
        $this->data[$i]=trim($d);
    }
    else
      $this->data = array();

    $this->data=array_unique($this->data);

    return $ret;
  }

  function get_data() {
    return $this->data;
  }

  function is_modified() {
    $data=$this->get_data();
    if(!$data)
      $data=array();
    $orig_data=$this->get_orig_data();
    if(!$orig_data)
      $orig_data=array();

    if(sizeof(array_diff($data, $orig_data))!=0)
      return true;
    if(sizeof(array_diff($orig_data, $data))!=0)
      return true;

    return false;
  }
}
