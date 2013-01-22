<?
class form_element_unsupported extends form_element_json {
  function type() {
    return "unsupported";
  }

  function create_element($document) {
    $input=$document->createElement("input");
    $input->setAttribute("type", "hidden");

    return $input;
  }

  function show_element($document) {
    $div=parent::show_element($document);

    $warning=$document->createElement("div");
    $warning->setAttribute("class", "warning");
    $warning->appendChild($document->createTextNode(
      "Form Element type '{$this->def['type']}' not supported!"));

    $div->appendChild($warning);

    return $div;
  }
}
