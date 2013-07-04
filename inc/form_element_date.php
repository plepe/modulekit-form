<?
$form_element_type_alias['date']='date';
$form_element_type_alias['datetime']='date';
$form_element_type_alias['datetime-local']='date';

class form_element_date extends form_element_text {
  function type() {
    return $this->def['type'];
  }

  function create_element($document) {
    $input=$document->createElement("input");
    $input->setAttribute("type", $this->def['type']);

    return $input;
  }
}
