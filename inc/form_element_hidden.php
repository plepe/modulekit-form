<?php
class form_element_hidden extends form_element_json {
  function type() {
    return "hidden";
  }

  function create_element($document) {
    $input = parent::create_element($document);
    $input->setAttribute("style", "display: none;");

    return $input;
  }

  function show($document) {
    $ob = $this->show_element($document);

    return $ob;
  }
}
