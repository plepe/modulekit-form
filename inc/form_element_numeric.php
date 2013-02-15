<?
$form_element_type_alias['integer']='numeric';
$form_element_type_alias['float']='numeric';

class form_element_numeric extends form_element_text {
  function type() {
    return $this->def['type'];
  }

  function get_data() {
    parent::get_data();

    if($this->data=="")
      return null;

    switch($this->def['type']) {
      case 'integer':
        return (int)$this->data;
      default:
        return (float)$this->data;
    }
  }

  function set_data($data) {
    parent::set_data((string)$data);
  }
}
