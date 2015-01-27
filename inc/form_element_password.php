<?php
class form_element_password extends form_element_text {
  function type() {
    return "password";
  }

  function create_element($document) {
    $input=$document->createElement("input");
    $input->setAttribute("type", "password");

    return $input;
  }
}
