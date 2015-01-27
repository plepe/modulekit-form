<?php
$form_element_type_alias['date']='date';
$form_element_type_alias['datetime']='date';
$form_element_type_alias['datetime-local']='date';

$form_element_date_display_format=array(
  'date'=>"j.n.Y",
  'datetime'=>"j.n.Y G:i:s P",
  'datetime-local'=>"j.n.Y G:i:s",
);
$form_element_date_value_format=array(
  'date'=>"Y-m-d",
  'datetime'=>"Y-m-d\\TH:i:sP",
  'datetime-local'=>"Y-m-d\\TH:i:s",
);

class form_element_date extends form_element_text {
  function type() {
    return $this->def['type'];
  }

  function create_element($document) {
    $input=$document->createElement("input");
    $input->setAttribute("type", "text");

    return $input;
  }

  function date_format() {
    if(isset($this->def['format']))
      return $this->def['format'];

    global $form_element_date_display_format;
    return $form_element_date_display_format[$this->type()];
  }

  function value_format() {
    if(isset($this->def['value_format']))
      return $this->def['value_format'];

    global $form_element_date_value_format;
    return $form_element_date_value_format[$this->type()];
  }

  function get_data() {
    // datetime can be stored internally either in value or display format
    $dt=DateTime::createFromFormat($this->date_format(), $this->data);
    if(!$dt) {
      $dt=DateTime::createFromFormat($this->value_format(), $this->data);
      if(!$dt)
	return null;
    }

    return $dt->format($this->value_format());
  }

  function show_element($document) {
    $div=parent::show_element($document);

    $format=$this->date_format();

    if($this->data!==null) {
      if($this->get_data()!==null) {
	$dt=new DateTime($this->get_data());
	$this->dom_element->setAttribute("value", $dt->format($format));
      }
      else
	$this->dom_element->setAttribute("value", $this->data);
    }

    return $div;
  }

  function check_after($list, $param) {
    foreach($param as $i=>$p) {
      if(is_string($p))
	$param[$i]=$this->parse_data($p);
    }

    if($this->get_data()<=$param[0])
      $list[]=$param[1];
  }
}
