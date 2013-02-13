<?
$form_element_type_alias['integer']='numeric';
$form_element_type_alias['float']='numeric';

class form_element_numeric extends form_element_text {
  function type() {
    return $this->def['type'];
  }

  function get_data() {
    $data=parent::get_data();

    if($data=="")
      $this->data=null;
    else
      $this->data=(float)$data;

    return $this->data;
  }
}
