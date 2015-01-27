<?php
class form_element_json extends form_element_textarea {
  function type() {
    return "json";
  }

  function get_data() {
    return json_decode(parent::get_data(), true);
  }

  function set_data($data) {
    parent::set_data(json_encode($data));
  }

  function errors(&$errors) {
    parent::errors($errors);

    if($this->data=="null")
      return;

    if((($this->data!="")||($this->data!=null))&&
       json_decode($this->data)===null) {

      $errors[]=$this->path_name().": ".lang("form:invalid_value");
    }
  }

  function is_modified() {
    return json_encode($this->get_data())!==json_encode($this->get_orig_data());
  }
}
