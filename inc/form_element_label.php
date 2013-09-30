<?
class form_element_label extends form_element {
  function type() {
    return "label";
  }

  function show_element($document) {
    $div=parent::show_element($document);

    $input=$document->createElement("input");
    $input->setAttribute("type", "hidden");
    $input->setAttribute("name", $this->options['var_name']);
    $input->setAttribute("value", $this->data);

    $div->appendChild($input);

    $text=$document->createElement("div");
    $text->setAttribute("class", "form_element_label");
    $text->appendChild($document->createTextNode($this->data));

    $div->appendChild($text);

    return $div;
  }
}
