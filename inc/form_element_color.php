<?
class form_element_color extends form_element_text {
  function type() {
    return "color";
  }

  function create_element($document) {
    $input=$document->createElement("input");
    $input->setAttribute("type", "color");

    return $input;
  }
}
