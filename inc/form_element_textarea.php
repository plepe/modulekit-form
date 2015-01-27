<?php
class form_element_textarea extends form_element_text {
  function type() {
    return "textarea";
  }

  function create_element($document) {
    $input=$document->createElement("textarea");

    return $input;
  }

  function show_element($document) {
    $div=parent::show_element($document);

    $this->dom_element->removeAttribute("value");

    $data = $this->data;
    if(is_array($this->data)) {
      $data = implode("\n\n", $data);
    }

    $value=$document->createTextNode($data);
    $this->dom_element->appendChild($value);

    return $div;
  }
}
