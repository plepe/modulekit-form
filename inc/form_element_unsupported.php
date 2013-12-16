<?
class form_element_unsupported extends form_element_json {
  function type() {
    return "unsupported";
  }

  function create_element($document) {
    $input=$document->createElement("textarea");
    $input->setAttribute("style", "display: none;");

    return $input;
  }

  function show_element($document) {
    $div=parent::show_element($document);

    $warning=$document->createElement("div");
    $warning->setAttribute("class", "warning");
    $warning->appendChild($document->createTextNode(
      lang('form:not_supported', 0, $this->def['type'])));

    $div->appendChild($warning);

    return $div;
  }
}
